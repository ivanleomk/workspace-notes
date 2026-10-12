// Quiz functionality for seccomp-bpf and overlayfs lesson
const quizData = {
    1: {
        question: "Docker's default seccomp profile blocks around 44 out of 300+ syscalls. Which of the following is NOT blocked by default?",
        options: {
            a: "ptrace — attach to and debug another process",
            b: "read — read from a file descriptor",
            c: "kexec_load — load a new kernel",
            d: "perf_event_open — access performance counters"
        },
        correct: "b",
        feedback: {
            correct: "✓ Correct! `read()` is essential for any process to function and is NOT blocked. The default seccomp profile (from https://github.com/moby/moby/blob/master/profiles/seccomp/default.json) blocks dangerous syscalls like ptrace, kexec_load, perf_event_open, bpf, clock_settime, and module loading, but allows core syscalls like read, write, mmap, open, etc. From the Docker docs: 'Seccomp profiles... block around 44 out of 300+ syscalls.' The goal is defense-in-depth: even if a container has sufficient capabilities, these syscalls are still blocked.",
            wrong: "✗ `read()` is a core syscall that every process needs—it's definitely NOT blocked. Docker's default seccomp profile (https://github.com/moby/moby/blob/master/profiles/seccomp/default.json) blocks dangerous syscalls: ptrace (debugging other processes), kexec_load (kernel replacement), perf_event_open (performance counter side-channels), bpf (loading BPF programs), and others. The profile allows essential syscalls (read, write, mmap, open, fork, etc.) but blocks the ~44 that are risky in multi-tenant environments."
        }
    },
    2: {
        question: "gVisor's systrap platform uses SECCOMP_RET_TRAP to intercept application syscalls. What happens when an application in a gVisor sandbox calls open()?",
        options: {
            a: "The syscall goes directly to the host kernel, just like in runc",
            b: "The seccomp filter sends SIGSYS to the Sentry, which emulates open() in userspace and returns the result",
            c: "The syscall is blocked with EPERM",
            d: "The syscall is logged but executed normally on the host kernel"
        },
        correct: "b",
        feedback: {
            correct: "✓ Exactly! With SECCOMP_RET_TRAP, the kernel delivers SIGSYS to a Sentry thread instead of executing the syscall. The Sentry handles the signal, emulates the syscall in userspace (e.g., open() checks permissions, allocates a file descriptor, updates internal state), and resumes the application with the result. From gVisor's platforms docs (https://gvisor.dev/docs/architecture_guide/platforms/): 'systrap uses seccomp to trap into the Sentry for system calls.' Only a limited set of host syscalls (mmap, futex, etc.) are used by the Sentry itself—the application's syscalls never directly reach the host. This is the isolation win: the host kernel's attack surface is drastically reduced.",
            wrong: "✗ The syscall does NOT go directly to the host kernel—that's the whole point of gVisor! With systrap, the seccomp filter returns SECCOMP_RET_TRAP, which sends SIGSYS to the Sentry (gVisor's userspace kernel). The Sentry catches the signal, emulates the syscall (e.g., open() checks permissions, manages file descriptors), and returns the result to the application. From https://gvisor.dev/docs/architecture_guide/platforms/: 'systrap uses seccomp to trap into the Sentry.' This reduces the host kernel attack surface: the app never calls the host kernel directly."
        }
    },
    3: {
        question: "In overlayfs, you have two lower layers (lower1 and lower2, stacked in that order) and one upper (writable) layer. A file named config.txt exists in both lower1 and lower2 with different contents. Which version does the application see in the merged view?",
        options: {
            a: "The version from lower2 (the bottom layer)",
            b: "The version from lower1 (the higher lower layer)",
            c: "An error—overlayfs doesn't allow duplicate filenames",
            d: "Both versions are concatenated"
        },
        correct: "b",
        feedback: {
            correct: "✓ Correct! When multiple lower layers contain the same file, the uppermost lower wins. From the kernel docs (https://docs.kernel.org/filesystems/overlayfs.html): 'An overlay filesystem combines an upper filesystem with one or more lower filesystems. When a file is accessed, overlayfs first checks the upper; if not found, it searches the lowers in order.' The search order is: upper → lower1 → lower2. So config.txt from lower1 shadows the version in lower2. This is how Docker layers images: later layers override earlier ones.",
            wrong: "✗ overlayfs searches layers from top to bottom: upper → lower1 → lower2. The first match wins. From https://docs.kernel.org/filesystems/overlayfs.html: 'When a file is accessed, overlayfs first checks the upper; if not found, it searches the lowers.' So if config.txt exists in both lower1 and lower2, the version in lower1 (higher in the stack) is visible, and lower2's version is shadowed. This is how Docker image layers work: each layer can override files from layers below."
        }
    },
    4: {
        question: "An application running in a Docker container modifies a file that exists in a read-only lower layer of overlayfs. What happens?",
        options: {
            a: "The write fails with EROFS (read-only filesystem)",
            b: "The file is copied from the lower layer to the upper layer (copy-on-write), then modified in the upper",
            c: "The file is modified in-place in the lower layer",
            d: "A symlink is created in the upper layer pointing to the lower layer file"
        },
        correct: "b",
        feedback: {
            correct: "✓ Exactly! This is **copy-on-write** (CoW). From the kernel docs (https://docs.kernel.org/filesystems/overlayfs.html): 'When a file in a lower layer is modified, the entire file is copied to the upper layer (copy-up) before the modification is applied.' After copy-up, the upper layer's version shadows the original lower layer file. This is why thousands of Docker containers can share one base image: each container's modifications stay in its own writable upper layer. Caveat: copying large files on first write adds latency (but subsequent writes to the same file are fast, since it's already in upper).",
            wrong: "✗ overlayfs implements **copy-on-write**. From https://docs.kernel.org/filesystems/overlayfs.html: 'When a file in a lower layer is modified, the entire file is copied to the upper layer (copy-up) before the modification is applied.' The lower remains read-only and unchanged. After copy-up, the modified version in upper shadows the original lower file. This is the mechanism that lets thousands of containers share one base image—each container's writes stay in its own upper layer."
        }
    },
    5: {
        question: "SWE-bench runs each test instance in a Docker container with layered images (base → environment → instance). Without overlayfs, what would be the main problem?",
        options: {
            a: "The tests would fail because SWE-bench code relies on overlayfs-specific features",
            b: "Storage would explode: you'd need to copy the entire rootfs (base + environment + instance) for every container, instead of sharing layers",
            c: "Container startup would be faster, not slower",
            d: "seccomp filters wouldn't work without overlayfs"
        },
        correct: "b",
        feedback: {
            correct: "✓ Exactly! overlayfs enables **storage deduplication**. From SWE-bench docs (https://github.com/SWE-bench/SWE-bench/blob/main/docs/guides/docker_setup.md): 'Images are layered to reduce duplication.' With overlayfs, thousands of containers share the base and environment layers (read-only), and only the per-instance changes are stored separately. The SWE-bench instance cache is already ~2TB *with* layering. Without overlayfs, you'd copy the full 5–10 GB rootfs per instance → 10×+ storage, plus much slower startup (copying GB instead of mounting instantly). overlayfs is orthogonal to seccomp and doesn't affect test correctness—it's purely a storage optimization.",
            wrong: "✗ The killer problem is **storage explosion**. Without overlayfs, each container needs its own complete copy of base + environment + instance layers (5–10 GB each). SWE-bench's instance cache is ~2TB *with* deduplication (https://github.com/SWE-bench/SWE-bench/blob/main/docs/guides/docker_setup.md); without it, that would balloon to 10×+ the size. Plus, container startup would be much slower: copying GB of data instead of instant overlayfs mount. overlayfs is orthogonal to seccomp and test correctness—it's a storage optimization, not a functional requirement."
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
