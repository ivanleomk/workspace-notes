// Quiz functionality for Firecracker Internals lesson
const quizData = {
    1: {
        question: "According to Firecracker's SPECIFICATION.md, what is the enforced boot time target from InstanceStart to guest /sbin/init?",
        options: {
            a: "<= 50ms",
            b: "<= 125ms",
            c: "<= 250ms",
            d: "<= 500ms"
        },
        correct: "b",
        feedback: {
            correct: "✓ Correct! From SPECIFICATION.md: 'It takes `<= 125 ms` to go from receiving the Firecracker InstanceStart API call to the start of the Linux guest user-space `/sbin/init` process.' This target is enforced by CI tests (test_boottime.py). The measurement uses a VM with serial console disabled and a minimal kernel + rootfs. This is why Firecracker is so fast for serverless workloads like AWS Lambda.",
            wrong: "✗ The correct answer is **<= 125ms**. From SPECIFICATION.md: 'It takes `<= 125 ms` to go from receiving the Firecracker InstanceStart API call to the start of the Linux guest user-space `/sbin/init` process.' This is a CI-enforced target measured with serial console disabled and a minimal kernel. 50ms would be impressive but is not the spec; 250ms and 500ms are too slow for Firecracker's serverless use case (AWS Lambda needs sub-second cold starts)."
        }
    },
    2: {
        question: "The Firecracker jailer applies primitives from Lessons 01–02. Which of the following is NOT part of the jailer's security model?",
        options: {
            a: "chroot jail at /srv/jailer/<exec_file_name>/<id>/root and privilege drop to a non-root uid/gid",
            b: "Seccomp-bpf filter allowing only ~60 syscalls",
            c: "cgroups v1 or v2 to set memory.max, cpu.max, and other resource limits",
            d: "gVisor's Sentry to intercept syscalls in userspace before they reach the host kernel"
        },
        correct: "d",
        feedback: {
            correct: "✓ Exactly! The jailer does NOT use gVisor. Firecracker is a VMM (Virtual Machine Monitor) that uses KVM for hardware virtualization. The jailer applies chroot, seccomp, cgroups, and privilege drop—all primitives from Lessons 01–02—but it does not intercept syscalls with a Sentry. The guest kernel inside the Firecracker VM makes hypercalls to KVM, not syscalls to the host kernel. gVisor (Lesson 03) is a completely different isolation mechanism (userspace kernel) used by Modal and Northflank, not by Firecracker.",
            wrong: "✗ The answer is **d**. The jailer does NOT use gVisor's Sentry. Firecracker is a VMM that uses **KVM for hardware virtualization**, not a userspace kernel. The jailer applies **chroot** (a), **seccomp-bpf** (b), and **cgroups** (c)—all primitives from Lessons 01–02. The guest kernel inside the Firecracker VM makes hypercalls to KVM (host kernel), which provides hardware isolation. gVisor's Sentry (Lesson 03) is a separate isolation mechanism (userspace kernel) used by Modal and others, not by Firecracker."
        }
    },
    3: {
        question: "Firecracker's device model is minimal. According to the NSDI 2020 paper, which of the following is NOT emulated by Firecracker?",
        options: {
            a: "virtio-net (paravirtualized network device)",
            b: "virtio-block (paravirtualized block device)",
            c: "PCI bus (to expose virtio devices as PCI endpoints)",
            d: "Serial console (UART) and a minimal i8042 keyboard controller"
        },
        correct: "c",
        feedback: {
            correct: "✓ Correct! From the NSDI paper: 'Firecracker's device model is intentionally minimal, supporting only virtio block devices, virtio net devices, a serial console, a one-button keyboard, and a partial RTC.' There is **no PCI bus**. Firecracker uses virtio devices in MMIO (memory-mapped I/O) mode, not PCI. The guest kernel detects virtio-mmio devices via device tree or ACPI, not PCI enumeration. This is why Firecracker boots so fast: no PCI bus initialization, no BIOS, no legacy hardware. QEMU emulates a full PCI bus; Firecracker does not.",
            wrong: "✗ The correct answer is **c (PCI bus)**. From the NSDI paper: 'Firecracker's device model is intentionally minimal, supporting only virtio block devices, virtio net devices, a serial console, a one-button keyboard, and a partial RTC.' Firecracker does NOT emulate a PCI bus. It uses virtio-mmio (memory-mapped I/O), not virtio-pci. The guest kernel detects devices via device tree/ACPI, not PCI enumeration. This minimalism (no BIOS, no PCI, no graphics) is why Firecracker boots in <= 125ms. QEMU emulates a full PC with PCI; Firecracker does not."
        }
    },
    4: {
        question: "You're building a multi-tenant eval harness. Each eval needs GPU inside the sandbox for local inference. Which runtime should you use, and why?",
        options: {
            a: "Firecracker, because it's the fastest VMM and has the lowest memory overhead",
            b: "gVisor, because it supports GPU passthrough via nvproxy while Firecracker's minimal device model has no GPU support",
            c: "Kata + Firecracker, because Kata adds GPU support on top of Firecracker",
            d: "runc, because containers share the host kernel and can access /dev/nvidia0 directly"
        },
        correct: "b",
        feedback: {
            correct: "✓ Right! From Lesson 03, Modal and Northflank use **gVisor for GPU sandboxes**. gVisor's Sentry intercepts syscalls but still shares the host kernel (with heavy filtering), so GPU ioctls can be proxied via **nvproxy** to the host NVIDIA driver. Firecracker's minimal device model (virtio-net, virtio-block, vsock, serial, i8042) has **no GPU support**. The Kata hypervisors table confirms: Firecracker does not support GPU. Kata+QEMU or Kata+Cloud Hypervisor *can* do GPU passthrough, but Firecracker cannot. If you need VMs + GPU, use Kata+QEMU. If you need strong isolation + GPU, use gVisor.",
            wrong: "✗ The answer is **b (gVisor)**. Firecracker's minimal device model (virtio-net, virtio-block, vsock, serial, i8042) has **no GPU support**. The Kata hypervisors table (Lesson 03) confirms this. If you need GPU inside the sandbox, use **gVisor** (Modal and Northflank do this; gVisor proxies GPU ioctls via nvproxy) or **Kata+QEMU/Cloud Hypervisor** (fuller VMMs that support GPU passthrough). Answer (d) runc is risky for multi-tenant: shared kernel means one vuln = escape. Use runc for trusted code only."
        }
    },
    5: {
        question: "E2B and Fly Machines use Firecracker for snapshot/restore and pause/resume. What is the PRIMARY advantage of Firecracker's snapshot/restore for eval orchestration compared to container image pulls?",
        options: {
            a: "Snapshots are text files (JSON) and can be version-controlled in git, while container images are binary blobs",
            b: "Snapshots capture the full VM memory and device state, so restoring a snapshot is a memory copy + KVM VM creation (milliseconds), while pulling a container image requires network I/O and layer extraction (seconds)",
            c: "Snapshots are smaller than container images because Firecracker compresses them with zstd",
            d: "Snapshots allow you to checkpoint GPU state, while container checkpoints (CRIU) cannot"
        },
        correct: "b",
        feedback: {
            correct: "✓ Exactly! Firecracker snapshots capture the **full guest memory and device state** (virtio ring buffers, CPU registers, etc.). Restoring a snapshot is a **memory copy** (already on the host, no network I/O) plus KVM VM creation, which takes **milliseconds**. Container image pulls require **network I/O** (pulling layers from a registry) and **layer extraction** (tar + overlay filesystem), which takes **seconds**. This is why E2B uses Firecracker for warm pools: snapshot once, restore N times. For forking (Lesson 05), you run to step k, snapshot, restore N times with different seeds. Answer (a) is wrong: snapshots are memory dumps + JSON, not version-control-friendly. Answer (c): size is not the primary advantage. Answer (d): gVisor checkpoint/restore supports GPU (cuda-checkpoint), not Firecracker.",
            wrong: "✗ The answer is **b**. Firecracker snapshots are **memory dumps + device state**. Restoring them is a **memory copy + KVM VM creation (milliseconds)**, while container image pulls require **network I/O + layer extraction (seconds)**. This is why E2B uses snapshots for warm pools: boot once, snapshot, restore N times instantly. Answer (a) is wrong: snapshots are memory dumps (binary), not JSON. Answer (c): size is not the main advantage; speed is. Answer (d): Firecracker does NOT support GPU; gVisor does (cuda-checkpoint). If you need GPU + checkpoint, use gVisor, not Firecracker."
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
