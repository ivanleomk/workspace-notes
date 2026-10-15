// Quiz functionality for Snapshot/Restore and Forking lesson
const quizData = {
    1: {
        question: "Why is snapshot/restore fundamentally faster than cold-booting a new Firecracker VM for each eval run?",
        options: {
            a: "Snapshots are compressed with zstd, making them smaller to transfer over the network",
            b: "Snapshots contain pre-booted memory and device state, so restoring is a memory copy + KVM VM creation (milliseconds), while cold boot requires kernel decompression, device initialization, and userspace init (125ms+ per Firecracker spec)",
            c: "Snapshots skip the jailer's security setup (chroot, cgroups, seccomp), making them faster but less secure",
            d: "Snapshots are stored in /dev/shm (RAM) while rootfs images are on disk, so the I/O is faster"
        },
        correct: "b",
        feedback: {
            correct: "✓ Correct! From Firecracker's snapshot-support.md: a snapshot consists of guest memory (mmap-able file) plus device state (JSON). Restoring loads this state directly into KVM, bypassing boot. Cold boot must: (1) decompress the kernel, (2) initialize virtio devices, (3) run /sbin/init and startup scripts. Firecracker's spec enforces ≤125ms boot, but snapshot restore can be much faster when memory is already resident and served via userfaultfd. E2B reports ~1s resume time (vendor claim) vs multi-second creates. Snapshots capture a running system mid-flight.",
            wrong: "✗ The answer is **b**. Snapshots capture **guest memory + device state**. Restoring loads this directly into KVM, skipping boot. From snapshot-support.md: 'A snapshot can be used to restore a microVM to the exact state captured at snapshot time.' This is faster than cold boot (kernel decompression + device init + /sbin/init, ≤125ms per spec). (a) is wrong: compression is optional and not the main speedup. (c) is wrong: the jailer runs before restore too. (d): snapshots can be in object storage; speed comes from skipping boot, not I/O location."
        }
    },
    2: {
        question: "What is userfaultfd and how does it accelerate snapshot restore in production systems like E2B?",
        options: {
            a: "A Linux kernel feature that lets userspace handle page faults, so Firecracker can serve guest memory pages lazily from disk/object storage instead of loading the entire snapshot upfront",
            b: "A seccomp filter that blocks faults from untrusted guest code, preventing the guest from triggering host kernel bugs",
            c: "A KVM ioctl that pre-faults all guest memory pages during restore to ensure deterministic latency",
            d: "A virtio device that notifies the guest when a page fault occurs, so the guest can handle its own swapping"
        },
        correct: "a",
        feedback: {
            correct: "✓ Exactly! From Firecracker's handling-page-faults-on-snapshot-resume.md: 'Firecracker… can configure guest memory to be handled by a userspace page fault handler.' When the guest accesses a page not yet loaded, the kernel sends a userfaultfd event to Firecracker's handler, which reads that page from the snapshot file and maps it. E2B's runtime uses this for fast resume: only hot pages are loaded immediately; cold pages fault-in on demand. This means a 1 GiB snapshot can resume in ~1s (E2B vendor claim) instead of waiting for 1 GiB to transfer from object storage.",
            wrong: "✗ The answer is **a**. From handling-page-faults-on-snapshot-resume.md: 'userfaultfd is a Linux kernel feature that allows a userspace process to handle page faults.' Firecracker registers a handler; when the guest touches an unmapped page, the kernel sends an event, and Firecracker loads that page from the snapshot. This is **lazy loading**: only accessed pages are fetched. (b) is wrong: userfaultfd is not a security feature. (c): it does the opposite—pages fault in on demand. (d): the guest doesn't know; it's transparent."
        }
    },
    3: {
        question: "You restore a Firecracker snapshot 10 times to fork rollouts from a shared prefix. Without mitigation, what is the PRIMARY determinism hazard that will break independent sampling?",
        options: {
            a: "The guest kernels share the same MAC address, causing network collisions that corrupt eval results",
            b: "All 10 VMs inherit the same RNG state and entropy pool from the snapshot, so calls to /dev/urandom or Python's random.seed() produce correlated samples unless you reseed after restore",
            c: "The Firecracker VMM process IDs (PIDs) are sequential, leaking information about the fork count to the guest",
            d: "The snapshot's filesystem is read-only, so all 10 VMs try to write to the same overlay layer and corrupt each other's files"
        },
        correct: "b",
        feedback: {
            correct: "✓ Correct! From Firecracker's random-for-clones.md: 'Clones of a snapshot share the guest OS entropy pool state at snapshot time.' This means all clones generate the same 'random' numbers. For GRPO-style forking (run to step k, fork N children, sample differently), you MUST reseed /dev/urandom or reinitialize your PRNG after restore. random-for-clones.md recommends VMGenID (a counter that changes on restore) or explicit reseeding. Without this, your N rollouts are correlated, not independent. (a) MAC collisions are a real issue (network-for-clones.md), but they break connectivity, not determinism. (c) PIDs don't leak. (d) snapshots can have writable disks.",
            wrong: "✗ The answer is **b**. From random-for-clones.md: 'When you restore a snapshot… the guest OS entropy pool is in the exact same state.' All clones produce identical 'random' bytes unless you reseed. For RL, this is fatal: your N rollouts are copies, not independent samples. Fix: reseed after restore (VMGenID or explicit /dev/urandom write). (a) MAC collisions are real (network-for-clones.md requires unique MACs per clone), but they break networking, not sampling. (c) PIDs are internal to the guest. (d) overlays work fine; the issue is RNG state."
        }
    },
    4: {
        question: "In E2B's architecture (from e2b-dev/runtime ARCHITECTURE.md), what does 'create' actually do under the hood?",
        options: {
            a: "Boots a fresh Firecracker VM from a kernel + rootfs, taking ~125ms per the Firecracker spec",
            b: "Resumes a pre-booted template snapshot using userfaultfd for lazy memory and an NBD-served copy-on-write rootfs—'Fresh creates, resumes after a pause, and forks all take the same path'",
            c: "Clones a running VM's memory with Linux's CRIU (checkpoint-restore in userspace), then updates the network namespace",
            d: "Pulls a Docker image from E2B's registry, extracts it, and runs it with runsc (gVisor)"
        },
        correct: "b",
        feedback: {
            correct: "✓ Exactly! From E2B's ARCHITECTURE.md: 'Fresh creates, resumes after a pause, and forks all take the same path'—they all restore a template snapshot. A 'template' is a pre-booted VM snapshot (memory + disk). 'Create' resumes it via userfaultfd (lazy memory) and an NBD-served copy-on-write rootfs. This is why E2B is fast: you pay boot cost once per template, then restore N sandboxes instantly. E2B reports ~1s resume (vendor claim) vs seconds for cold boot. Pause exports dirty memory/disk diffs to object storage. Fork checkpoints the original and spreads children across nodes.",
            wrong: "✗ The answer is **b**. From ARCHITECTURE.md: 'Fresh creates, resumes after a pause, and forks all take the same path.' E2B does NOT cold-boot Firecracker per create (that would be slow). Instead, it restores a **template snapshot** (pre-booted VM) using userfaultfd + CoW disk. This is the core optimization: boot once, snapshot, restore N times. (a) describes cold boot, which E2B avoids. (c) CRIU is for process trees, not VMs; E2B uses Firecracker snapshots. (d) E2B uses Firecracker (microVMs), not gVisor."
        }
    },
    5: {
        question: "You're implementing GRPO-style forking: run an agent to step k, snapshot, restore N children with different sampling temperatures. According to Firecracker's clone-hazard docs, which step is REQUIRED for correctness?",
        options: {
            a: "Assign each child VM a unique cgroup to prevent memory limit interference",
            b: "Put each child VM in its own network namespace with a unique MAC address (per network-for-clones.md), AND reseed guest RNGs (per random-for-clones.md) so samples are independent",
            c: "Disable the serial console on all children to avoid output corruption when they write concurrently",
            d: "Take a diff snapshot (not full) for each child to save disk space, since only GRPO gradient updates change memory"
        },
        correct: "b",
        feedback: {
            correct: "✓ Correct! From Firecracker's snapshotting docs: (1) network-for-clones.md: 'Restored microVMs… share the same MAC and IP addresses… each clone should be placed in its own network namespace.' (2) random-for-clones.md: 'The guest OS entropy pool is in the exact same state… To use restored microVMs as independent entities, you need a mechanism that would reseed this state.' For GRPO, independent sampling requires independent RNG state. Fix: write to /dev/urandom or use VMGenID. (a) cgroups prevent DoS, not incorrectness. (c) serial console is usually disabled in prod. (d) diff snapshots save space but aren't required for correctness; the issue is RNG + network uniqueness.",
            wrong: "✗ The answer is **b**. Firecracker's clone-hazard docs (random-for-clones.md and network-for-clones.md) require: (1) unique network namespace + MAC per clone (to avoid collisions), (2) reseed guest RNGs (so /dev/urandom, Python random, etc. produce independent values). Without (2), all N children sample identically, breaking GRPO. Without (1), networking fails. (a) cgroups are good practice but don't fix sampling. (c) serial console doesn't affect sampling. (d) diff vs full snapshots are a space/speed tradeoff, not a correctness requirement."
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
