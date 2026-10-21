// Quiz questions for Lesson 11: Ray Scheduling, Placement Groups, and Resource Management
const quizQuestions = [
    {
        question: "What is the default resource allocation for a Ray task vs a Ray actor (when no explicit num_cpus is specified)?",
        options: [
            "Tasks default to num_cpus=1; actors default to num_cpus=1",
            "Tasks use 1 CPU; actors need 1 CPU to be scheduled but hold 0 CPUs while running",
            "Tasks default to num_cpus=0; actors default to num_cpus=1",
            "Both tasks and actors default to num_cpus=0"
        ],
        correctAnswer: 1,
        explanation: "From Ray 2.40.0 docs (Specifying Task and Actor Resources): 'By default, Ray tasks use 1 logical CPU resource and Ray actors use 1 logical CPU for scheduling, and 0 logical CPU for running. (This means, by default, actors cannot get scheduled on a zero-cpu node, but an infinite number of them can run on any non-zero cpu node. ... If resources are specified explicitly, they are required both at schedule time and at execution time.)' Option A is wrong: actors need 1 CPU to schedule but hold 0 while running. Option C is wrong: tasks default to 1. Option D is wrong: tasks default to 1."
    },
    {
        question: "You request num_gpus=0.25 for a Ray task. What does Ray enforce at runtime?",
        options: [
            "Ray limits the task to 25% of GPU memory and 25% of GPU compute cycles using CUDA MPS",
            "Ray does nothing; it's your responsibility to ensure the task uses ≤25% of the GPU. Ray only tracks logical availability for scheduling.",
            "Ray automatically sets CUDA_VISIBLE_DEVICES to a fractional GPU ID",
            "Ray creates a cgroup with 25% GPU memory limit"
        ],
        correctAnswer: 1,
        explanation: "From Ray 2.40.0 docs: 'Ray supports fractional resource requirements. For example, if your task or actor is IO bound and has low CPU usage, you can specify fractional CPU num_cpus=0.5 or even zero CPU num_cpus=0.' and 'It's your responsibility to make sure tasks or actors use no more resources than specified via resource requirements.' Ray tracks logical resources for scheduling (4 tasks with num_gpus=0.25 can share 1 GPU), but does NOT enforce limits at runtime. If a task requests 0.25 GPU but uses 80% of GPU memory, it will cause OOM for other tasks. Option A is wrong: Ray doesn't use MPS. Option C is wrong: Ray sets CUDA_VISIBLE_DEVICES to the whole GPU ID it assigned; there is no \"fractional GPU ID\". Option D is wrong: Ray doesn't use cgroups for GPU limits."
    },
    {
        question: "How does Ray's hybrid two-level scheduler decide where to place tasks vs actors?",
        options: [
            "Both tasks and actors are scheduled by the GCS (centralized scheduling)",
            "Tasks are scheduled by the caller's preferred raylet (hybrid pack-then-spread, with spillback); actor creation is coordinated by the GCS",
            "Both tasks and actors are scheduled by local raylets (no GCS involvement)",
            "Tasks are scheduled by the GCS; actors are scheduled by local raylets"
        ],
        correctAnswer: 1,
        explanation: "Whitepaper: 'A task caller schedules a task by first sending a resource request to the preferred raylet'; on spillback the raylet 'respond[s] to the caller with the address of a remote raylet at which the caller should retry'. Actors: 'Actor creation tasks are scheduled through the centralized GCS service' ... 'through the same distributed scheduling protocol that is used for normal tasks, as if the GCS were the actor creation task's caller.' Option A is wrong: tasks are scheduled by raylets, not GCS. Option C is wrong: actors are scheduled by GCS. Option D is wrong: reversed."
    },
    {
        question: "You create a placement group with 4 bundles using strategy='STRICT_PACK'. The cluster has 2 nodes, each with 2 GPUs. What happens?",
        options: [
            "Ray places 2 bundles on Node 1 and 2 bundles on Node 2 (splitting across nodes)",
            "The placement group remains PENDING forever (or until a node with 4 GPUs is added), because STRICT_PACK requires all bundles on the same node",
            "Ray creates a virtual 'super node' by merging Node 1 and Node 2's resources",
            "The placement group fails immediately with an error"
        ],
        correctAnswer: 1,
        explanation: "From Ray 2.40.0 docs (Placement Groups): 'STRICT_PACK: All bundles must be placed into a single node on the cluster.' If no single node has enough resources for all bundles, the placement group remains PENDING (state: PENDING in placement_group_table()). It waits until autoscaling adds a node with sufficient resources, or until other jobs free resources. Option A is wrong: STRICT_PACK will NOT split across nodes (that's PACK without STRICT). Option C is wrong: Ray doesn't create virtual nodes. Option D is wrong: the placement group doesn't fail; it stays PENDING. Compare to PACK (without STRICT): would place 2 bundles on Node 1, 2 on Node 2, accepting split placement."
    },
    {
        question: "How do real RL frameworks (e.g., verl, OpenRLHF) use Ray placement groups for multi-GPU training and generation?",
        options: [
            "They don't use placement groups; they manually assign tasks to specific node IDs with NodeAffinitySchedulingStrategy",
            "They create placement groups with PACK or STRICT_PACK to gang-schedule vLLM generation workers (tensor-parallel) and training workers (multi-GPU) on the same node(s)",
            "They use placement groups only for CPU workers, never for GPU workers",
            "They create one global placement group for the entire cluster and schedule all tasks/actors in it"
        ],
        correctAnswer: 1,
        explanation: "verl (verl/single_controller/ray/base.py) creates per-node placement groups for each resource pool, STRICT_PACK by default; OpenRLHF (openrlhf/trainer/ray/vllm_engine.py, launcher.py) creates PACK placement groups for vLLM engines and DeepSpeed actors. Why PACK/STRICT_PACK? Colocating multi-GPU workers on the same node minimizes inter-GPU latency (NVLink > PCIe > network). Option A is wrong: they DO use placement groups (not just node affinity). Option C is wrong: they use placement groups for GPU workers. Option D is wrong: they create multiple placement groups (per resource pool / per node in verl; per engine group in OpenRLHF), not one global group."
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
    if (percentage === 100) return "Perfect! You've mastered Ray scheduling, placement groups, and resource management.";
    if (percentage >= 80) return "Excellent! You understand gang scheduling and when to use placement groups for RL workloads.";
    if (percentage >= 60) return "Good job! Review the sections on fractional resources, STRICT_PACK vs PACK, and hybrid scheduling.";
    return "Keep studying! Re-read the resource model, placement group strategies, and the verl/OpenRLHF examples.";
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = new Array(quizQuestions.length).fill(null);
    renderQuiz();
}

// Initialize quiz on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderQuiz);
} else {
    renderQuiz();
}
