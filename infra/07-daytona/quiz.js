// Quiz questions for Lesson 07: Daytona Architecture and Container vs VM Classes
const quizQuestions = [
    {
        question: "Why does Daytona use a job-based architecture instead of synchronous gRPC calls from the API to runners?",
        options: [
            "To reduce API latency by offloading job execution to Redis",
            "So runners can poll for jobs instead of accepting inbound connections, improving security and decoupling API availability from runner availability",
            "Because NestJS doesn't support gRPC, only REST",
            "To comply with container orchestration standards that require job queues"
        ],
        correctAnswer: 1,
        explanation: "Daytona's job-based architecture decouples the control plane (API) from the compute plane (runners). The API writes jobs to a queue (backed by Postgres + Redis), and runners poll the queue for jobs. This design: (1) Allows runners to be behind NAT or firewalls (no inbound connections needed), (2) Makes API restarts safe (runners keep running and reconnect), (3) Reduces blast radius (a compromised API can write malicious jobs but can't directly exec on runner nodes). Contrast E2B, where the API makes synchronous gRPC calls to orchestrators."
    },
    {
        question: "When should you choose a container sandbox over a VM sandbox in Daytona?",
        options: [
            "When you need pause/resume to save agent state between steps",
            "When you need fork to create N identical branches for GRPO-style RL",
            "When you need fast startup (<90ms), Docker compatibility, and don't need pause/resume/fork",
            "When you need nested virtualization to run Docker inside the sandbox"
        ],
        correctAnswer: 2,
        explanation: "Container sandboxes (Daytona's default) are best for: (1) Fast startup (<90ms vendor claim from cached OCI image), (2) Docker compatibility (mount Docker images, run apt-get/pip install), (3) High concurrency (shared kernel, lower overhead). Trade-offs: no pause/resume/fork (can't checkpoint agent state), shared kernel (container escape vulnerabilities could affect the host). Use VM sandboxes when you need pause/resume/fork, hardware isolation, or nested virtualization. Use GPU sandboxes when you need exclusive GPU allocation."
    },
    {
        question: "How does Daytona's VM sandbox fork work, and why does it create deterministic branches?",
        options: [
            "Fork calls Docker's --fork flag to spawn N containers from the parent's image layers",
            "Fork pauses the parent, uploads a checkpoint snapshot to S3, and resumes N children from that snapshot with unique MAC/RNG",
            "Fork uses CRIU to checkpoint the parent process tree, then restarts N copies with unique PIDs",
            "Fork clones the Firecracker process N times, then reseeds the guest kernel's RNG"
        ],
        correctAnswer: 1,
        explanation: "Daytona's VM fork: (1) Checkpoint parent: Create VM snapshot (memory + device state), upload to S3. (2) Spread children: Sandbox manager schedules N new sandboxes with the checkpoint snapshot ID. (3) Resume children: Each runner downloads the checkpoint from S3 and restores the snapshot. (4) Fix clone hazards (inferred from VM mechanics): Reseed RNG (/dev/urandom) and assign unique MAC addresses per child. Branches are deterministic because each child starts from the exact same memory and device state (bitwise-identical modulo RNG/MAC), so differences in outcomes are purely from sampling variance. Ideal for GRPO-style RL and tree search."
    },
    {
        question: "Why are GPU sandboxes container-based instead of VM-based in Daytona?",
        options: [
            "Because most microVMs don't support GPU passthrough, and Docker GPU passthrough is the standard for GPU workloads",
            "Because GPU sandboxes need pause/resume, which only works on containers",
            "Because VMs have too much overhead for GPU workloads",
            "Because Daytona's Rust daemon doesn't support GPU APIs in VMs"
        ],
        correctAnswer: 0,
        explanation: "GPU sandboxes are container-based because: (1) MicroVM + GPU = unsupported in most setups: Most microVMs (e.g., Firecracker) don't expose PCIe device passthrough (would require VFIO), so GPUs can't be passed to microVMs in most setups. (2) Docker GPU passthrough is mature: Docker + nvidia-container-runtime or --gpus is the standard way to run GPU workloads (CUDA, ROCm), with good tooling (nvidia-smi) and reliability. Trade-off: No pause/resume/fork for GPU sandboxes (GPU state can't be checkpointed; CUDA checkpoint/restore is experimental and not supported in Daytona's container runtime)."
    },
    {
        question: "What happened to Daytona's open-source repository in June 2026?",
        options: [
            "It was deleted and all code was taken offline",
            "It was archived/frozen at v0.190.0 and development moved to a private codebase for security reasons; the repo remains public and was licensed under AGPL-3.0 but receives no further updates",
            "It was relicensed from AGPL-3.0 to a proprietary license and closed to new contributors",
            "It was merged into Nightona and is now maintained by the community only"
        ],
        correctAnswer: 1,
        explanation: "In June 2026, Daytona archived its public GitHub repository (daytonaio/daytona) and moved core development to a private codebase. The announcement (published June 11, 2026) cited security as the reason: to prevent AI-based vulnerability discovery before patches could be deployed. The last open-source release was v0.190.0 (June 23, 2026). The archived repo remains public and free to use, fork, and build on. It was licensed under AGPL-3.0, but receives no further updates, fixes, or releases. Nightona (nightona-co/nightona) is a community fork that continues development from v0.190.0 under AGPL-3.0."
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
                <div class="quiz-feedback ${answers[currentQuestion] === quizQuestions[currentQuestion].correctAnswer ? 'correct' : 'wrong'} show">
                    <strong>${answers[currentQuestion] === quizQuestions[currentQuestion].correctAnswer ? '✓ Correct!' : '✗ Incorrect'}</strong>
                    <p>${quizQuestions[currentQuestion].explanation}</p>
                </div>
            ` : ''}
            <div class="quiz-navigation" style="margin-top: 20px;">
                ${currentQuestion > 0 ? '<button class="quiz-button" onclick="previousQuestion()">← Previous</button>' : '<button class="quiz-button" disabled>← Previous</button>'}
                ${currentQuestion < quizQuestions.length - 1 ? 
                    '<button class="quiz-button" onclick="nextQuestion()">Next →</button>' : 
                    '<button class="quiz-button" onclick="finishQuiz()">Finish Quiz</button>'}
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
            <button class="quiz-button" onclick="restartQuiz()">Restart Quiz</button>
        </div>
    `;
}

function getScoreMessage(score) {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage === 100) return "Perfect! You've mastered Daytona's multi-class architecture.";
    if (percentage >= 80) return "Excellent! You have a strong understanding of container vs VM vs GPU trade-offs.";
    if (percentage >= 60) return "Good job! Review the sections on job-based architecture and isolation classes.";
    return "Keep studying! Re-read the architecture overview and container/VM comparison table.";
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
