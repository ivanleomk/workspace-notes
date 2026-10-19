// Quiz questions for Lesson 09: Open-Source Sandboxes
const quizQuestions = [
    {
        question: "What makes microsandbox's architecture different from E2B (lesson 06) or Daytona (lesson 07)?",
        options: [
            "microsandbox uses Firecracker instead of libkrun",
            "microsandbox is embeddable (library, no daemon): you call Sandbox.builder().create() directly from your application, while E2B and Daytona require a server daemon and API",
            "microsandbox runs on Kubernetes while E2B and Daytona do not",
            "microsandbox does not support fork/snapshot while E2B and Daytona do"
        ],
        correctAnswer: 1,
        explanation: "microsandbox is an embeddable library built on libkrun (not Firecracker). You call Sandbox.builder().create() directly from your application (Python, TS, Rust, Go, Ruby) and it boots a microVM via libkrun without requiring a long-running server daemon or API. E2B (lesson 06) and Daytona (lesson 07) both have server architectures (API + orchestrator/runner nodes). microsandbox does support fork/snapshot (README states 'Fork & Snapshot: Fork live sandboxes. Save running sandbox state and restore later'). microsandbox is not Kubernetes-native (it's an embeddable library for single-node or small-cluster orchestration)."
    },
    {
        question: "How does agent-sandbox's SandboxWarmPool reduce allocation latency from 10-30 seconds to sub-2 seconds?",
        options: [
            "It uses Firecracker snapshot/restore to resume pre-warmed VMs",
            "It pre-warms N pods (labeled agents.x-k8s.io/pool=<name>) before any SandboxClaim is created, so claiming a sandbox relabels an already-running pod instead of waiting for image pull + container start",
            "It uses memory snapshots (like Modal Functions) to skip initialization",
            "It uses gVisor's systrap platform which has lower syscall overhead than runc"
        ],
        correctAnswer: 1,
        explanation: "agent-sandbox's SandboxWarmPool CRD pre-warms N pods (spec.replicas) before any user creates a SandboxClaim. These pods are labeled agents.x-k8s.io/pool=<warmpool-name>, are already running (image pulled, container started), and sit idle waiting to be claimed. When a SandboxClaim references the warm pool, the controller claims one pod from the pool (relabels it to agents.x-k8s.io/sandbox-name-hash), and the WarmPool controller creates a replacement pod to maintain replica count. This eliminates image pull and container start latency (10-30 seconds) and achieves sub-2-second allocation (vendor claim from quickstart README). agent-sandbox does not use Firecracker snapshot/restore (it delegates to Kubernetes RuntimeClasses like runc, gVisor, or Kata). It does not use memory snapshots (that's Modal Functions, lesson 08). The latency improvement comes from pre-warming pods, not from the isolation mechanism."
    },
    {
        question: "What licensing consideration applies to beta9 (Beam) that does NOT apply to microsandbox or agent-sandbox?",
        options: [
            "beta9 is closed-source and requires a commercial license",
            "beta9 is AGPL-3.0, which requires offering modified source code to users if you run a modified beta9 as a network service, while microsandbox and agent-sandbox are Apache-2.0 (permissive)",
            "beta9 is GPL-3.0 and requires source disclosure for any derived work",
            "beta9 has no licensing restrictions because it's public domain"
        ],
        correctAnswer: 1,
        explanation: "beta9 is licensed under GNU AGPL-3.0 (Affero GPL), which is a copyleft license designed for network server software. From the LICENSE: 'It requires the operator of a network server to provide the source code of the modified version running there to the users of that server.' This means if you modify beta9 and run it as a network service (e.g., internal API for your team, or public SaaS), you must offer the modified source code to users. microsandbox and agent-sandbox are both Apache-2.0 (permissive license), which allows proprietary modifications without source disclosure. beta9 is open-source (not closed-source), and it's not public domain (AGPL-3.0 has restrictions). Review AGPL compliance with legal counsel if considering proprietary modifications to beta9."
    },
    {
        question: "Why is Fly Machines included in this lesson despite not being open-source or self-hostable?",
        options: [
            "Because Fly.io will open-source Fly Machines in 2027",
            "Because Fly Machines are built on Firecracker (OSS) and demonstrate production Firecracker architecture (BGP Anycast, WireGuard backhaul, sub-second start/stop) that you can study and apply to your own orchestrator",
            "Because Fly Machines are the only sandboxes that support GPU workloads",
            "Because Fly Machines are cheaper than Modal and beta9 for eval workloads"
        ],
        correctAnswer: 1,
        explanation: "Fly Machines are included because they're built on Firecracker (lesson 04, Apache-2.0 OSS) and demonstrate production Firecracker architecture at scale: BGP Anycast routing (accept traffic in any datacenter, route to closest microVM), WireGuard backhaul (datacenter-to-datacenter tunnels), fly-proxy (Rust-based proxy on every server), and sub-second start/stop (vendor claim). Fly also published a public snapshot of their Firecracker guest init (github.com/superfly/init-snapshot, Rust-based). These are design lessons you can apply to your own Firecracker-based orchestrator (lesson 05-06 patterns). Fly.io is a hosted platform (not self-hostable), and there's no announcement about open-sourcing it. GPU support is available on multiple platforms (Modal lesson 08, beta9, agent-sandbox with K8s device plugins, Fly Machines). Cost comparison is not the reason for inclusion (it's about architecture patterns)."
    },
    {
        question: "When would you choose agent-sandbox over microsandbox for your eval orchestrator?",
        options: [
            "When you need cross-platform support (macOS, Windows) for local development",
            "When you're building on Kubernetes and need warm pools, multi-tenant RBAC, and runtime flexibility (runc/gVisor/Kata via RuntimeClasses)",
            "When you need pause/resume/fork for GRPO-style RL rollouts",
            "When you want the lowest-latency cold starts (<100ms) with libkrun microVMs"
        ],
        correctAnswer: 1,
        explanation: "Choose agent-sandbox when you're building on Kubernetes and need: (1) Warm pools (SandboxWarmPool CRD for sub-2-second allocation vs 10-30 seconds cold), (2) Multi-tenant orchestration (K8s RBAC, per-tenant quotas, SandboxClaim user-facing API), (3) Runtime flexibility (choose runc for speed, gVisor for userspace kernel isolation lesson 03, or Kata for hardware VM isolation lesson 03 via Kubernetes RuntimeClasses). agent-sandbox is Kubernetes-native; microsandbox is an embeddable library for single-node or small-cluster orchestration without K8s. For cross-platform (macOS/Windows), choose microsandbox (libkrun runs on Hypervisor.framework and WHP). For pause/resume/fork, both support it (microsandbox: yes per README; agent-sandbox: runtime-dependent, Kata+CRIU supports it). For lowest cold start latency, microsandbox claims ~100ms (vendor claim) but agent-sandbox with warm pools achieves sub-2s allocation by pre-warming pods (image already pulled, container already started)."
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
    if (percentage === 100) return "Perfect! You've mastered open-source sandbox systems and can choose the right one for your orchestrator.";
    if (percentage >= 80) return "Excellent! You understand the trade-offs between microsandbox, agent-sandbox, beta9, and Fly Machines.";
    if (percentage >= 60) return "Good job! Review the comparison table and decision guide sections.";
    return "Keep studying! Re-read the architecture sections for microsandbox (libkrun embedding), agent-sandbox (warm pools), and beta9 (AGPL licensing).";
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
