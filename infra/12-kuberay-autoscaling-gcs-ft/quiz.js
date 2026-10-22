// Quiz questions for Lesson 12: KubeRay, Autoscaling, and GCS Fault Tolerance
const quizQuestions = [
    {
        question: "What does the KubeRay operator do when autoscaling is enabled (enableInTreeAutoscaling: true)?",
        options: [
            "The operator directly scales worker Pods based on CPU/memory metrics from Kubernetes HPA",
            "The operator injects an autoscaler sidecar into the head Pod; the autoscaler reads demand from GCS, writes desired replicas to RayCluster status, and the operator reconciles worker Pods to match",
            "The operator polls Ray tasks every second and immediately creates worker Pods for pending tasks",
            "Autoscaling is handled entirely by Kubernetes HorizontalPodAutoscaler; KubeRay is not involved"
        ],
        correctAnswer: 1,
        explanation: "From Ray 2.40.0 Docs (RayCluster Configuration — Autoscaling): 'the KubeRay operator will inject an autoscaler container into the Ray head pod, which will create and delete Ray worker pods based on resource demands.' The autoscaler sidecar (ray kuberay-autoscaler) reads pending tasks/actors/placement groups from GCS, calculates desired replica counts per worker group, writes them to status.desiredWorkerReplicas in the RayCluster CR, and the operator reconciles actual worker Pods to match. Option A is wrong: KubeRay autoscaler uses Ray's resource demand, not Kubernetes HPA metrics. Option C is wrong: the update interval is 5 seconds by default (autoscaler_update_interval_s), not 1 second, and the operator reconciles after the autoscaler writes status. Option D is wrong: KubeRay autoscaler is not HPA."
    },
    {
        question: "A RayCluster worker group has minReplicas: 0, maxReplicas: 100. The autoscaler scales up to 50 workers. After all tasks complete, how long until workers are removed?",
        options: [
            "Immediately (within seconds) after the last task finishes",
            "After workers are idle for idle_timeout_minutes (default 5 minutes)",
            "Workers are never removed; minReplicas: 0 only applies at cluster creation",
            "After 60 seconds (fixed idle timeout in KubeRay)"
        ],
        correctAnswer: 1,
        explanation: "From Ray 2.40.0 Docs (Configuring Autoscaling): 'idle_timeout_minutes: The number of minutes that need to pass before an idle node is removed by the Autoscaler. Defaults to 5.' A worker is idle if it has no running tasks/actors and has been idle for more than idle_timeout_minutes. With minReplicas: 0, the autoscaler will scale down to 0 workers after the idle timeout. Option A is wrong: there is a delay (idle_timeout_minutes). Option C is wrong: minReplicas: 0 allows scale-to-zero after the cluster is created (after autoscaler makes its first decision, replicas in the spec is ignored). Option D is wrong: the default is 5 minutes (300 seconds), not 60 seconds."
    },
    {
        question: "GCS Fault Tolerance with external Redis is enabled. The head Pod crashes and restarts. What happens?",
        options: [
            "The entire Ray cluster fails; all workers must be restarted",
            "GCS reloads metadata from Redis; running tasks/actors continue; new actor creation/placement group ops are unavailable during recovery (a few seconds)",
            "Workers immediately fail all pending tasks and wait for manual intervention",
            "GCS recovery takes 10+ minutes; all workers disconnect and rejoin"
        ],
        correctAnswer: 1,
        explanation: "From Ray 2.40.0 Docs (GCS Fault Tolerance): During GCS recovery, 'Running Ray tasks and actors will continue to run. [...] Any existing objects will continue to be available.' But 'Actor creation/deletion/reconstruction. [...] Placement group operations. [...] Submitting new tasks, which require new worker processes to be created. [...] Resource management' are unavailable. And 'The recovery time is proportional to the amount of data stored in Redis and the network latency between GCS and Redis. In practice, recovery takes a few seconds for typical cluster sizes (<100 nodes).' Option A is wrong: with GCS FT enabled, the cluster does NOT fail (without GCS FT, it would). Option C is wrong: workers do not fail pending tasks; they continue running. Option D is wrong: recovery is a few seconds, not 10+ minutes."
    },
    {
        question: "Your 1,000-worker Ray cluster is slow to schedule new actors, even though workers have free CPUs. Head Pod CPU is at 90%. What is the likely cause and solution?",
        options: [
            "Workers are overloaded with tasks; solution: add more workers",
            "GCS (on head node) is CPU-bound handling actor registration, node heartbeats, and autoscaler queries; solution: increase head Pod CPU (8-16 cores) and/or reduce heartbeat frequency",
            "Object store is full and spilling to disk; solution: increase object-store-memory",
            "Kubernetes API server is slow; solution: use a faster etcd backend"
        ],
        correctAnswer: 1,
        explanation: "High head Pod CPU with slow actor scheduling indicates GCS overload. GCS handles actor directory lookups, node heartbeats (every 1 second by default), autoscaler queries (every 5 seconds), and dashboard queries. In a large cluster (1,000 workers, 10,000+ actors), this becomes CPU-heavy. From Ray docs (Configure RayCluster — Head Node): 'For large clusters (>100 nodes), consider using a larger head node (8+ CPUs, 32+ GB memory).' Solutions: (1) increase head Pod CPU to 8-16 cores, (2) reduce heartbeat frequency (set raylet_heartbeat_period_milliseconds from 1000ms to 5000ms in rayStartParams _system_config), (3) batch actor operations. Option A is wrong: workers are NOT overloaded (they have free CPUs); the bottleneck is GCS. Option C is wrong: object store full causes task slowdown, not actor creation slowdown. Option D is wrong: Kubernetes API server slowness would affect all K8s operations, not just Ray actor scheduling."
    },
    {
        question: "You run eval sandboxes with Ray actors (max_restarts=3). An idle worker Pod is removed by the autoscaler while an actor is running on it. What happens to the actor?",
        options: [
            "The actor is restarted on another worker Pod (up to 3 times per max_restarts)",
            "The actor dies and is NOT restarted, even though max_restarts=3 (autoscaler scale-down does not trigger actor restart)",
            "The actor is checkpointed to Redis and restored on the next available worker",
            "The autoscaler waits for the actor to finish before removing the worker Pod"
        ],
        correctAnswer: 1,
        explanation: "From the lesson (Failure Mode 3): 'Actors not restarted during autoscaler scale-down: If autoscaler removes a worker Pod with a running actor, the actor dies and is NOT restarted (even with max_restarts).' max_restarts applies to actor failures (uncaught exceptions, OOM kills, node failures), but NOT to autoscaler scale-down (which is a graceful termination from Ray's perspective). Solution: use minReplicas to keep a warm pool, or pin actors to specific nodes with NodeAffinitySchedulingStrategy. Option A is wrong: max_restarts does not apply to autoscaler scale-down. Option C is wrong: Ray does not checkpoint actor state (actors are ephemeral; you must persist state to external storage if needed). Option D is wrong: the autoscaler does not wait for actors (it only checks if the node is idle, defined as no running tasks/actors at the time of the idle check; but if an actor method completes just before scale-down, the actor process is still running and will be killed)."
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

function selectAnswer(answerIndex) {
    answers[currentQuestion] = answerIndex;
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
    score = answers.reduce((total, answer, index) => {
        return total + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="quiz-question">
            <h3>Quiz Complete!</h3>
            <p style="font-size: 1.5em; margin: 20px 0;">
                Your score: <strong>${score} / ${quizQuestions.length}</strong> 
                (${Math.round(score / quizQuestions.length * 100)}%)
            </p>
            ${score === quizQuestions.length ? 
                '<p style="color: var(--success);">🎉 Perfect score! You have mastered KubeRay, autoscaling, and GCS fault tolerance.</p>' : 
                score >= quizQuestions.length * 0.6 ?
                '<p style="color: var(--warning);">Good work! Review the explanations for questions you missed.</p>' :
                '<p style="color: var(--error);">Keep studying. Review the lesson and try again.</p>'}
            <button class="quiz-button" onclick="restartQuiz()">Restart Quiz</button>
        </div>
    `;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = new Array(quizQuestions.length).fill(null);
    renderQuiz();
}
