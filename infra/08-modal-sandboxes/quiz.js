// Quiz questions for Lesson 08: Modal Sandboxes - gVisor, Memory Snapshots, and Elasticity
const quizQuestions = [
    {
        question: "Why does Modal default to gVisor instead of Firecracker microVMs for most sandboxes?",
        options: [
            "Because gVisor is faster than Firecracker for all workloads",
            "Because gVisor supports GPU passthrough (nvproxy) and has lower memory overhead, while Firecracker doesn't support GPU passthrough",
            "Because gVisor provides pause/resume/fork capabilities that Firecracker lacks",
            "Because gVisor is open-source and Firecracker is proprietary"
        ],
        correctAnswer: 1,
        explanation: "Modal defaults to gVisor because: (1) gVisor supports GPU passthrough via nvproxy (forwards NVIDIA GPU ioctl calls to host driver), while Firecracker doesn't support GPU passthrough. (2) gVisor containers have lower memory overhead (no guest kernel, only Sentry overhead ~10-20 MB) compared to microVMs. (3) gVisor has fast cold starts (no kernel boot). Trade-off: Modal Sandboxes don't support pause/resume/fork (gVisor Sentry doesn't expose snapshot APIs to Modal), though Modal Functions support memory snapshots via CRIU. Both gVisor and Firecracker are open-source (Apache-2.0)."
    },
    {
        question: "How do Modal's filesystem snapshots differ from E2B/Daytona's fork operations (lessons 06-07)?",
        options: [
            "Filesystem snapshots fork the entire VM memory and device state, while E2B/Daytona only fork the filesystem",
            "Filesystem snapshots only capture the filesystem (diff-based Image), not running processes or memory state, so each child sandbox starts fresh",
            "Filesystem snapshots are slower because they store the full filesystem, not just diffs",
            "Filesystem snapshots require gVisor runtime, while E2B/Daytona fork works on any runtime"
        ],
        correctAnswer: 1,
        explanation: "Modal's filesystem snapshots (sb.snapshot_filesystem()) capture only the filesystem as a diff-based Image (only modified files vs base image are stored). Each child sandbox created from the snapshot starts fresh: no running processes, no memory state preserved. Compare to E2B/Daytona fork (lessons 06-07): they fork entire VMs including memory + devices + running processes, so children resume exactly where the parent was. Modal's approach avoids clone hazards (RNG seeds, open file descriptors are fresh) but doesn't preserve running state. Filesystem snapshots work on both gVisor and VM runtimes."
    },
    {
        question: "Why do Modal's memory snapshots only work for Functions, not Sandboxes?",
        options: [
            "Because memory snapshots require hardware virtualization that Sandboxes don't support",
            "Because memory snapshots are tied to the Function deployment lifecycle (one checkpoint per Function version, many restores), not the ephemeral Sandbox lifecycle (create, exec, terminate)",
            "Because Sandboxes use gVisor which doesn't support CRIU checkpoint/restore",
            "Because memory snapshots would violate Modal's security model for untrusted code"
        ],
        correctAnswer: 1,
        explanation: "Modal's memory snapshots use CRIU (Checkpoint/Restore In Userspace) to checkpoint a Function container after global initialization (imports, model loading) but before the first request. The checkpoint is created once per Function version and reused for all subsequent calls (3-10x speedup vendor claim). Sandboxes are ephemeral: you create, exec, terminate. Modal doesn't expose checkpoint/restore APIs for Sandboxes because the CRIU integration is optimized for the Function model (one checkpoint per code version, many restores). gVisor does support CRIU in principle, but Modal's Sandbox API doesn't expose it. Lessons 06-07 (E2B/Daytona) provide pause/resume/fork for eval orchestration needs."
    },
    {
        question: "What is the cost trade-off between Modal and self-hosted spot instances for spiky eval workloads?",
        options: [
            "Modal is always more expensive because it charges per-second instead of per-hour",
            "Modal is cost-competitive for spiky workloads (no idle charges, pay-per-second) but self-hosted spot instances are cheaper for sustained 24/7 workloads",
            "Self-hosted spot instances are always cheaper because AWS spot prices are lower than Modal's rates",
            "Modal is cheaper for both spiky and sustained workloads because of its elastic scaling"
        ],
        correctAnswer: 1,
        explanation: "Modal bills per-second for CPU/memory/GPU with no idle charges, making it cost-competitive for spiky workloads (e.g., run 1,000 evals for 5 minutes, then idle the rest of the month). Example from lesson: 1,000 sandboxes × 300 sec × $0.00005276/sec = $15.83. Self-hosted spot instances: 100 c7g.xlarge spot × $0.04/hr × (5/60 hr) = $3.33 (cheapest, but requires infra management, spot interrupt handling, and you pay for full hours). For sustained 24/7 workloads, self-hosted spot is cheaper (Modal per-second adds up). Modal's value prop: no idle charges + instant autoscale + no infra management. Trade-off: you pay ~2-3x per core-second vs AWS on-demand."
    },
    {
        question: "How does SWE-bench's Modal backend avoid rebuilding images for 2,294 instances?",
        options: [
            "It uses Modal's memory snapshots to checkpoint the environment after pip install",
            "It builds one base image per repo with dependencies installed, caches them, then creates per-instance sandboxes from those base images",
            "It uses Modal's VM runtime with pause/resume to freeze the environment after setup",
            "It runs all instances in a single sandbox to share the environment"
        ],
        correctAnswer: 1,
        explanation: "SWE-bench builds one Modal Image per repo (e.g., django-base, flask-base) with base dependencies installed (Ubuntu + Python + repo cloned + pip install -e .). These base images are cached in Modal's OCI registry (layer caching: only modified layers rebuild). For each of the 2,294 instances, SWE-bench creates a sandbox from the repo's cached base image (no rebuild), applies the agent's patch, runs tests, and captures results. This avoids 2,294 × (pip install time) waste. Compare to option A: memory snapshots work for Functions, not Sandboxes. Option C: VM runtime doesn't provide pause/resume for Sandboxes. Option D: running all instances in one sandbox would cause test interference and no parallelism."
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
    if (percentage === 100) return "Perfect! You've mastered Modal's gVisor runtime, snapshots, and elasticity model.";
    if (percentage >= 80) return "Excellent! You understand the trade-offs between Modal, E2B, and Daytona for eval orchestration.";
    if (percentage >= 60) return "Good job! Review the sections on gVisor vs VM runtimes and filesystem vs memory snapshots.";
    return "Keep studying! Re-read the architecture overview, SWE-bench integration, and cost comparison sections.";
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
