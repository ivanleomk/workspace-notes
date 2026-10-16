// Quiz questions for Lesson 06: E2B's Open-Source Runtime Architecture
const quizQuestions = [
    {
        question: "Why does E2B separate the control plane (API) from the data plane (orchestrator)?",
        options: [
            "To reduce API server costs by offloading snapshot storage to orchestrator nodes",
            "So sandbox execution traffic bypasses the API, reducing latency and allowing independent scaling of API and orchestrator nodes",
            "Because Firecracker can only be managed by gRPC, not REST APIs",
            "To comply with multi-tenant security regulations that require physical separation"
        ],
        correctAnswer: 1,
        explanation: "E2B separates control and data planes so sandbox execution traffic (exec commands, file I/O) goes directly from the SDK → client proxy → orchestrator → envd, bypassing the central API. This reduces latency (no extra network hop) and allows the API to scale horizontally (stateless, load-balanced) independently of orchestrator nodes (stateful: each owns its running VMs). The API handles lifecycle (create, pause, resume), while the orchestrator handles execution."
    },
    {
        question: "What is envd, and why does it run inside the Firecracker VM instead of on the host?",
        options: [
            "envd is the Firecracker binary renamed for E2B; it runs on the host to manage KVM",
            "envd is the in-VM agent (port 49983) that exposes process/filesystem APIs; it runs inside the VM to contain the blast radius of a compromised agent",
            "envd is the template builder; it runs inside the VM to avoid Docker dependency on the host",
            "envd is a network proxy; it runs inside the VM to implement egress filtering"
        ],
        correctAnswer: 1,
        explanation: "envd is the in-VM daemon (port 49983) that exposes process/filesystem/port APIs over Connect RPC and REST. SDKs talk to envd for exec and file operations. Running envd inside the VM (not on the host) is a security design: if a malicious guest compromises envd, the blast radius is contained to that VM. A host-side envd could be exploited to affect other sandboxes or escape to the host. Additionally, envd can be live-upgraded inside a running sandbox without rebooting Firecracker or the guest kernel."
    },
    {
        question: "How does E2B's template build process work? (Choose the correct sequence)",
        options: [
            "Docker image → snapshot → ext4 rootfs → Firecracker boot → upload to object storage",
            "Docker image → ext4 rootfs → Firecracker boot → run user commands → snapshot → upload to object storage",
            "Firecracker boot → Docker image pull inside VM → ext4 extract → snapshot → upload",
            "Docker image → gzip → Firecracker boot with compressed kernel → snapshot → ext4 extraction"
        ],
        correctAnswer: 1,
        explanation: "E2B's template build: (1) Get Docker image from remote repository, (2) Inject provisioning layers, (3) Extract ext4 filesystem from OCI layers, (4) Start Firecracker VM with BusyBox init (installs systemd), (5) Restart VM with systemd and wait for envd, (6) Run user-defined commands (.runCmd(...)), (7) Run configuration script + start command, (8) Snapshot (memory + device state), (9) Upload to object storage. The snapshot is now a template that sandboxes resume from."
    },
    {
        question: "How does E2B's pause/resume minimize snapshot transfer time? (Select all that apply)",
        options: [
            "userfaultfd: memory pages are loaded on-demand from object storage, not all at once",
            "Diff-based snapshots: only modified memory pages and disk blocks are uploaded/downloaded",
            "NBD copy-on-write rootfs: template rootfs stays read-only, writes go to a per-sandbox cache",
            "All of the above"
        ],
        correctAnswer: 3,
        explanation: "E2B uses three mechanisms to minimize snapshot transfer: (1) userfaultfd lazy memory: guest memory pages are loaded on page-fault from object storage, so resume doesn't wait for the full memory file; hot pages are optionally prefetched. (2) Diff-based snapshots: pause exports only modified pages/blocks (diff against template), not the full memory/rootfs. (3) NBD CoW rootfs: the template rootfs is read-only; writes go to a per-sandbox cache; on pause, only dirty blocks are exported as a diff. These combine to make pause/resume faster than full snapshot upload/download."
    },
    {
        question: "How does E2B's fork feature work, and how does it fix the RNG clone hazard?",
        options: [
            "Fork calls CRIU to checkpoint the parent process tree, then restarts N copies with unique PIDs",
            "Fork snapshots the parent VM, uploads the checkpoint, resumes N children with unique MAC addresses and reseeded RNGs (unique entropy per child)",
            "Fork uses Docker's --fork flag to spawn N containers from the parent's image layers",
            "Fork pauses the parent, then uses gVisor's checkpoint/restore to spawn N Sentry processes"
        ],
        correctAnswer: 1,
        explanation: "E2B's fork: (1) Checkpoint parent sandbox (same as pause: freeze cgroups, snapshot memory + rootfs, export diff, upload to object storage). (2) Spread N children across nodes (placement via API). (3) For each child, resume the checkpoint snapshot (not the template). (4) Fix clone hazards: unique MAC address per child (configured in Firecracker network-interfaces), unique entropy written to /dev/urandom (likely via envd's POST /init with unique environment variables or seed file). Without reseeding, all N children would sample identical random values (Lesson 05's RNG clone hazard), breaking algorithms that assume independent sampling (GRPO, tree search)."
    }
];

// Quiz UI logic
let currentQuestion = 0;
let score = 0;
let answers = new Array(quizQuestions.length).fill(null);

function renderQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    container.innerHTML = `
        <div class="quiz-progress">
            Question ${currentQuestion + 1} of ${quizQuestions.length}
        </div>
        <div class="quiz-question">
            <h3>${quizQuestions[currentQuestion].question}</h3>
            <div class="quiz-options">
                ${quizQuestions[currentQuestion].options.map((option, index) => `
                    <label class="quiz-option ${answers[currentQuestion] === index ? 'selected' : ''}">
                        <input type="radio" name="answer" value="${index}" 
                            ${answers[currentQuestion] === index ? 'checked' : ''}
                            onchange="selectAnswer(${index})">
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
            ${answers[currentQuestion] !== null ? `
                <div class="quiz-explanation ${answers[currentQuestion] === quizQuestions[currentQuestion].correctAnswer ? 'correct' : 'incorrect'}">
                    <strong>${answers[currentQuestion] === quizQuestions[currentQuestion].correctAnswer ? '✓ Correct!' : '✗ Incorrect'}</strong>
                    <p>${quizQuestions[currentQuestion].explanation}</p>
                </div>
            ` : ''}
            <div class="quiz-navigation">
                ${currentQuestion > 0 ? '<button onclick="previousQuestion()">← Previous</button>' : '<button disabled>← Previous</button>'}
                ${currentQuestion < quizQuestions.length - 1 ? 
                    '<button onclick="nextQuestion()">Next →</button>' : 
                    '<button onclick="finishQuiz()">Finish Quiz</button>'}
            </div>
        </div>
    `;
}

function selectAnswer(index) {
    answers[currentQuestion] = index;
    if (answers[currentQuestion] === quizQuestions[currentQuestion].correctAnswer) {
        score++;
    }
    renderQuiz();
}

function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        renderQuiz();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuiz();
    }
}

function finishQuiz() {
    const correctAnswers = answers.filter((answer, index) => 
        answer === quizQuestions[index].correctAnswer
    ).length;
    
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="quiz-results">
            <h3>Quiz Complete!</h3>
            <p class="score">You scored ${correctAnswers} out of ${quizQuestions.length}</p>
            <p>${getScoreMessage(correctAnswers)}</p>
            <button onclick="restartQuiz()">Restart Quiz</button>
        </div>
    `;
}

function getScoreMessage(score) {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage === 100) return "Perfect! You've mastered E2B's architecture.";
    if (percentage >= 80) return "Excellent! You have a strong understanding of production snapshot/fork systems.";
    if (percentage >= 60) return "Good job! Review the sections on control/data plane separation and envd.";
    return "Keep studying! Re-read the architecture overview and template building sections.";
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = new Array(quizQuestions.length).fill(null);
    renderQuiz();
}

// Initialize quiz when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderQuiz);
} else {
    renderQuiz();
}
