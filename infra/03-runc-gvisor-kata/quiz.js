// Quiz functionality for runc vs gVisor vs Kata lesson
const quizData = {
    1: {
        question: "You're running a SWE-bench evaluation with thousands of containers on a single node. The dockerd daemon crashes. According to DeepSWE's experience, what was the root cause and the solution?",
        options: {
            a: "Kernel bug in namespaces; fixed by upgrading the kernel",
            b: "Docker daemon overwhelmed by thousands of concurrent containers; moved to Kubernetes with image preloading",
            c: "OOM killer; fixed by adding more RAM",
            d: "Network saturation; fixed by adding more NICs"
        },
        correct: "b",
        feedback: {
            correct: "✓ Correct! From the DeepSWE blog: 'parallel experiments pushed this to thousands of containers at any given time, overloading Docker's API server and eventually crashing the Docker daemon.' They moved to Kubernetes and preloaded SWE-bench images onto NVMe. The lesson: never put a single daemon in the hot path of thousands of containers. This is an **orchestration** failure, not a runtime (runc) failure.",
            wrong: "✗ The issue was the Docker daemon itself, not the kernel or resources. DeepSWE says: 'thousands of containers at any given time, overloading Docker's API server and eventually crashing the Docker daemon.' The fix was moving to Kubernetes (which distributes the control plane) and preloading images onto local NVMe. The lesson: single points of failure in the orchestration layer (dockerd, containerd) matter more than runtime choice at that scale."
        }
    },
    2: {
        question: "Modal states that 'GPU Sandboxes are only supported with runtime=gvisor'. Why does gVisor support GPU passthrough but Kata+Firecracker does not?",
        options: {
            a: "gVisor's Sentry has special GPU emulation code; Kata does not",
            b: "gVisor still shares the host kernel (via nvproxy), so GPU devices are accessible; Firecracker's minimal device model has no GPU support",
            c: "Kata requires nested virtualization for GPU, which most clouds don't support",
            d: "gVisor is faster than Kata for GPU workloads"
        },
        correct: "b",
        feedback: {
            correct: "✓ Exactly! gVisor's Sentry intercepts syscalls but still talks to the host kernel (with heavy filtering). For GPU, gVisor uses **nvproxy** to proxy GPU ioctls to the host NVIDIA driver. Kata+Firecracker runs each pod in a VM with a guest kernel; Firecracker's minimal device model (virtio net/block/vsock) has **no GPU support** (per the Kata hypervisors table). Kata+QEMU or Kata+Cloud Hypervisor *can* do GPU passthrough, but Firecracker cannot. That's why Modal and Northflank use gVisor for GPU sandboxes.",
            wrong: "✗ The key is **device model**. gVisor still shares the host kernel (the Sentry's syscalls go to the host, filtered), so GPU ioctls can be proxied (nvproxy) to the host NVIDIA driver. Firecracker's minimal VMM only supports virtio net/block/vsock—no GPU passthrough. The Kata hypervisors table confirms: Firecracker has no GPU support. Kata+QEMU or Cloud Hypervisor *can* pass through GPUs (they're fuller VMMs), but Firecracker can't. That's why Modal uses gVisor for GPU sandboxes."
        }
    },
    3: {
        question: "In gVisor, what is the Gofer and why does it exist?",
        options: {
            a: "The Gofer is gVisor's replacement for containerd; it manages container lifecycle",
            b: "The Gofer is a per-sandbox file proxy; the Sentry has no direct filesystem access, so file I/O requests go through the Gofer over a UNIX socket (9P protocol)",
            c: "The Gofer is gVisor's name for the platform (systrap/KVM/ptrace)",
            d: "The Gofer is a GPU proxy for CUDA workloads"
        },
        correct: "b",
        feedback: {
            correct: "✓ Right! From the gVisor architecture guide: the **Gofer** is a per-sandbox file proxy. The Sentry (userspace kernel) itself never directly opens host files—it sends file I/O requests to the Gofer over a UNIX socket using the 9P protocol. The Gofer does the actual open/read/write syscalls on the host. This shrinks the Sentry's attack surface: even if an attacker compromises the Sentry, they can't directly open arbitrary host files. The cost is file I/O overhead (Sentry → Gofer → host), which is why gVisor is slower for I/O-heavy workloads.",
            wrong: "✗ The **Gofer** is a per-sandbox **file proxy**. The Sentry (gVisor's userspace kernel) has no direct filesystem access—it sends file I/O requests to the Gofer over a UNIX socket (9P protocol). The Gofer then does the actual open/read/write syscalls on the host. This is a security boundary: compromising the Sentry doesn't give you direct host filesystem access. The cost is I/O overhead, which is why gVisor is slower for syscall-heavy and I/O-heavy workloads like `pip install` or `pytest` discovery."
        }
    },
    4: {
        question: "You're building an RL eval harness. During rollouts, you want to run the agent to step k, then fork N children and sample each one differently (GRPO-style). Which runtime and feature do you use?",
        options: {
            a: "runc with CRIU checkpoint/restore",
            b: "gVisor with runsc checkpoint/restore and lazy background restore",
            c: "Kata with Firecracker snapshot/restore",
            d: "None of these; you must replay the first k steps N times"
        },
        correct: "b",
        feedback: {
            correct: "✓ Correct! gVisor's `runsc checkpoint/restore` supports lazy background restore (pages memory in on demand) and is more robust than CRIU because the Sentry *is* the kernel—it can serialize the whole kernel state without host cooperation. For forking, you checkpoint once, then restore N times (possibly with different sampling seeds or policies). E2B also offers fork directly for Firecracker (answer c), but the question asks about *runtimes* (runc/gVisor/Kata), and Kata's snapshot support is less mature. Answer: gVisor checkpoint/restore.",
            wrong: "✗ The best answer for *runtimes* is **gVisor checkpoint/restore**. gVisor can checkpoint the Sentry's state (which is the entire kernel from the workload's perspective) and restore it multiple times with lazy background memory paging. CRIU (answer a) works with runc but is less robust (it has to serialize host-kernel state). Kata+Firecracker (answer c) *can* snapshot/restore, but that's outside the OCI runtime interface—you'd use E2B or Fly Machines for that. The question is about runtime choice, so gVisor is the right pick. You never have to replay steps (answer d) if you have checkpoint/restore."
        }
    },
    5: {
        question: "SkyRL-OpenHands reports '80–100 containers per replica on nodes with just 16 CPUs' using crun + aiodocker. Which statement is TRUE?",
        options: {
            a: "This density is only possible because crun is written in C and is faster than runc",
            b: "This density is possible because containers are just processes with namespaces/cgroups; the overhead per container is small (a few MB of kernel memory for namespaces/cgroups)",
            c: "This density would not be possible with gVisor or Kata",
            d: "Both b and c"
        },
        correct: "d",
        feedback: {
            correct: "✓ Exactly! **Both b and c** are true. (b) Containers share the host kernel, so each container's overhead is just a few cgroups, some namespace structs, and the process's own memory. With careful resource limits, you can run hundreds of containers per host. crun being in C (vs runc in Go) helps a bit, but the *fundamental* reason is shared-kernel architecture. (c) gVisor would have lower density (each sandbox has a Sentry in userspace, which consumes memory), and Kata would have much lower density (each VM needs 50–150 MB for guest kernel + kata-agent). This is the density vs isolation trade-off.",
            wrong: "✗ The answer is **both b and c**. (b) Containers are processes with namespaces/cgroups. The host kernel is shared, so per-container overhead is minimal (a few MB of kernel memory for namespace and cgroup structs, plus the process's own RSS). That's how you get 80–100 containers on 16 CPUs. crun being C vs runc being Go helps marginally, but the real reason is shared-kernel architecture. (c) gVisor and Kata would have **lower density**: gVisor has a per-sandbox Sentry (userspace process), and Kata has per-VM guest kernel + kata-agent (50–150 MB each). Density is the cost you pay for stronger isolation."
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
