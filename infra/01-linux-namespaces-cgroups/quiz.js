// Quiz functionality for Linux Namespaces and cgroups v2 lesson
const quizData = {
    1: {
        question: "What is the fundamental difference between Linux namespaces and hardware virtualization (like KVM)?",
        options: {
            a: "Namespaces provide better performance but less isolation",
            b: "Namespaces give each process its own kernel, while VMs share a kernel",
            c: "Namespaces hide resources but all processes share the same host kernel; VMs run separate guest kernels",
            d: "Namespaces are only for network isolation, while VMs provide full isolation"
        },
        correct: "c",
        feedback: {
            correct: "✓ Exactly! Namespaces provide isolation by giving processes different *views* of system resources, but every containerized process still makes syscalls to the **same host kernel**. With hardware virtualization (KVM, Xen), each VM runs its own guest kernel behind a hypervisor. This is why gVisor says 'containers are not a sandbox'—a kernel vulnerability in a namespace-based container can lead to escape, while a VM has hardware isolation between guest and host.",
            wrong: "✗ The key difference is what kernel the workload calls. Namespaces change a process's *view* (mount table, PID tree, network stack), but all processes share the **same host kernel**. VMs run their own guest kernel via hardware virtualization. That's the isolation gap: a kernel vuln can escape a namespace-based container, but (usually) not a VM. This is why production eval systems use gVisor (userspace kernel) or Firecracker (microVMs) for untrusted code."
        }
    },
    2: {
        question: "A container has `memory.max=2G` set in its cgroup. Inside the container, you run `free -h`. What does it show?",
        options: {
            a: "Total memory: 2 GB (the cgroup limit)",
            b: "Total memory: the host's total RAM (cgroups don't change what /proc/meminfo reports)",
            c: "Total memory: 0 (cgroups hide memory info)",
            d: "An error, because /proc/meminfo is not accessible in containers"
        },
        correct: "b",
        feedback: {
            correct: "✓ Correct! This is a common gotcha. `free`, `top`, and other tools read `/proc/meminfo`, which reports **host** values, not cgroup limits. From Daytona's isolation docs: 'Inside a sandbox, nproc and free report host values.' To see your actual limit, read `/sys/fs/cgroup/memory.max` or `/sys/fs/cgroup/memory.current`. This confuses a lot of code that tries to auto-detect available memory—it sees 128 GB on the host but the cgroup kills it at 2 GB.",
            wrong: "✗ `free` reads `/proc/meminfo`, which shows **host** totals, not cgroup limits. This is documented in Daytona's isolation guide: inside a sandbox, `nproc` and `free` report host values. To see the actual cgroup limit, your code must read `/sys/fs/cgroup/memory.max`. This gotcha trips up memory-aware apps that think they have 64 GB but the OOM killer strikes at 2 GB."
        }
    },
    3: {
        question: "You want to prevent a sandbox from fork-bombing the host. Which primitive do you use?",
        options: {
            a: "PID namespace",
            b: "cgroup pids.max controller",
            c: "seccomp-bpf to block the fork() syscall",
            d: "User namespace UID mapping"
        },
        correct: "b",
        feedback: {
            correct: "✓ Right! **pids.max** in cgroups v2 caps the number of processes/threads in a cgroup. Set it to something reasonable (e.g., 512 or 1024) and a fork bomb will hit the limit instead of exhausting the host's PID space. PID namespace only *hides* PIDs; it doesn't limit their count. Blocking fork() via seccomp would break any normal workload. User namespaces map UIDs but don't control process counts.",
            wrong: "✗ **cgroup pids.max** is the tool for this. It limits how many PIDs a cgroup can create. PID namespace only isolates the *view* of PIDs (so the container sees PID 1 for its init), but doesn't cap the count. Without `pids.max`, a malicious `:(){ :|:& };:` can exhaust the host's PID table and DoS everything. Blocking fork() via seccomp would break legitimate multi-process apps."
        }
    },
    4: {
        question: "Why do production eval systems (Modal GPU sandboxes, UK AISI's Inspect k8s provider) use gVisor instead of plain Docker for untrusted code?",
        options: {
            a: "gVisor is faster than runc for syscall-heavy workloads",
            b: "gVisor intercepts syscalls in a userspace kernel, reducing the attack surface on the host kernel",
            c: "gVisor provides better cgroup isolation than Docker",
            d: "gVisor automatically sandboxes GPU access"
        },
        correct: "b",
        feedback: {
            correct: "✓ Exactly! gVisor's Sentry is a **userspace kernel** written in Go. Workload syscalls hit the Sentry, not the host kernel directly. The Sentry's own access to the host is restricted (via seccomp, namespaces, etc.). This shrinks the attack surface: a vuln in the Sentry is less catastrophic than a kernel vuln, and the Sentry is a smaller, more auditable codebase than Linux. Modal says 'GPU Sandboxes are only supported with runtime=gvisor' because they need stronger isolation than runc provides. gVisor is **slower** for syscall-heavy work (not faster), but that's the isolation tax.",
            wrong: "✗ gVisor is **slower** for syscall-heavy workloads (not faster), because every syscall goes through the Sentry (userspace kernel) instead of directly to the host. The win is **security**: the Sentry intercepts syscalls, so a vuln in untrusted code doesn't directly hit the host kernel. Modal and UK AISI use gVisor because it's a much smaller attack surface than the full Linux kernel. Plain Docker (runc) shares the host kernel, so one kernel vuln = container escape."
        }
    },
    5: {
        question: "You're building a SWE-bench eval harness. Each test runs `pip install` and `pytest` inside a container. To share one base image across thousands of containers and allow per-container writes without copying the whole rootfs, which Linux primitive do you use?",
        options: {
            a: "Mount namespace + overlayfs (union filesystem with read-only lower layers and one writable upper)",
            b: "cgroup memory.max to limit disk usage",
            c: "seccomp-bpf to intercept write() syscalls",
            d: "PID namespace to isolate file operations"
        },
        correct: "a",
        feedback: {
            correct: "✓ Correct! **overlayfs** is a union mount: multiple read-only lower layers (the base image) under one writable upper layer (the container's changes). When the container writes, overlayfs copies the file up to the writable layer (copy-on-write). This is how Docker shares one image across thousands of containers. From the kernel docs: 'writes leave whiteouts' for deleted files. Mount namespace gives each container its own mount table. Without overlayfs, you'd need to copy the entire rootfs per container, which would blow up disk usage (SWE-bench's instance cache is already 2 TB with layering!).",
            wrong: "✗ **overlayfs** (union filesystem) is the answer. It layers read-only image layers under one writable layer per container. Writes copy files up (copy-on-write); deletes leave whiteouts. This is how thousands of containers share one base image on disk. Without it, you'd copy the entire rootfs per container (huge disk waste). cgroup memory.max limits RAM, not disk. seccomp filters syscalls but doesn't deduplicate storage. PID namespace isolates PIDs, not files."
        }
    }
};

function initQuiz() {
    const container = document.getElementById('quiz-container');
    
    Object.keys(quizData).forEach(qNum => {
        const q = quizData[qNum];
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.id = `question-${qNum}`;
        
        let html = `
            <h3>Question ${qNum}</h3>
            <p>${q.question}</p>
            <div class="quiz-options">
        `;
        
        Object.keys(q.options).forEach(optKey => {
            const optId = `q${qNum}-${optKey}`;
            html += `
                <label class="quiz-option">
                    <input type="radio" name="q${qNum}" value="${optKey}" id="${optId}">
                    <span>${q.options[optKey]}</span>
                </label>
            `;
        });
        
        html += `
            </div>
            <button class="quiz-button" onclick="checkAnswer(${qNum})">Check Answer</button>
            <div class="quiz-feedback" id="feedback-${qNum}"></div>
        `;
        
        questionDiv.innerHTML = html;
        container.appendChild(questionDiv);
    });
}

function checkAnswer(qNum) {
    const selected = document.querySelector(`input[name="q${qNum}"]:checked`);
    if (!selected) {
        alert('Please select an answer first!');
        return;
    }
    
    const q = quizData[qNum];
    const feedback = document.getElementById(`feedback-${qNum}`);
    const isCorrect = selected.value === q.correct;
    
    feedback.className = 'quiz-feedback show ' + (isCorrect ? 'correct' : 'wrong');
    feedback.innerHTML = isCorrect ? q.feedback.correct : q.feedback.wrong;
    
    // Disable all options after answering
    document.querySelectorAll(`input[name="q${qNum}"]`).forEach(input => {
        input.disabled = true;
    });
    
    // Disable the button
    const button = document.querySelector(`#question-${qNum} .quiz-button`);
    button.disabled = true;
    button.textContent = isCorrect ? '✓ Correct!' : '✗ Incorrect';
}

// Initialize quiz when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
