// Quiz questions for Lesson 12: KubeRay, Autoscaling, and GCS Fault Tolerance
const quizQuestions = [
    {
        question: "What does the KubeRay operator do when autoscaling is enabled (enableInTreeAutoscaling: true)?",
        options: [
            "The operator directly scales worker Pods based on CPU/memory metrics from Kubernetes HPA",
            "The operator injects an autoscaler sidecar into the head Pod; the autoscaler reads demand from GCS, patches the worker group's replicas in the RayCluster spec, and the operator reconciles worker Pods to match",
            "The operator polls Ray tasks every second and immediately creates worker Pods for pending tasks",
            "Autoscaling is handled entirely by Kubernetes HorizontalPodAutoscaler; KubeRay is not involved"
        ],
        correctAnswer: 1,
        explanation: "From Ray 2.40.0 Docs (KubeRay autoscaling): 'By setting `enableInTreeAutoscaling: true`, the KubeRay operator automatically configures an autoscaling sidecar container for the Ray head Pod.' and 'the Ray Autoscaler adjusts the `replicas` field as it adds or removes Pods from the cluster.' The autoscaler sidecar (ray kuberay-autoscaler) reads pending tasks/actors/placement groups from GCS, calculates desired replica counts per worker group, patches spec.workerGroupSpecs[i].replicas in the RayCluster CR, and the operator reconciles actual worker Pods to match. Option A is wrong: KubeRay autoscaler uses Ray's resource demand, not Kubernetes HPA metrics. Option C is wrong: the update interval is 5 seconds by default (AUTOSCALER_UPDATE_INTERVAL_S), not 1 second, and the operator reconciles after the autoscaler writes the spec. Option D is wrong: KubeRay autoscaler is not HPA."
    },
    {
        question: "A RayCluster worker group has minReplicas: 0, maxReplicas: 100. The autoscaler scales up to 50 workers. After all tasks complete, how long until workers are removed?",
        options: [
            "Immediately (within seconds) after the last task finishes",
            "After workers are idle for autoscalerOptions.idleTimeoutSeconds (default 60 seconds)",
            "Workers are never removed; minReplicas: 0 only applies at cluster creation",
            "After 5 minutes (fixed idle timeout in KubeRay)"
        ],
        correctAnswer: 1,
        explanation: "From the KubeRay autoscaling guide (Ray 2.40.0): 'A worker Pod will be deleted after `idleTimeoutSeconds` (default 60s) seconds.' KubeRay passes this to the autoscaler as idle_timeout_minutes: 1.0. The 5-minute idle_timeout_minutes default applies to VM cluster-launcher YAMLs, not KubeRay. Workers are idle when they hold no active tasks, actors, or referenced objects. With minReplicas: 0, the group scales to zero."
    },
    {
        question: "GCS Fault Tolerance with external Redis is enabled. The head Pod crashes and restarts. What happens?",
        options: [
            "The entire Ray cluster fails; all workers must be restarted",
            "GCS reloads metadata from Redis; running tasks/actors continue; new actor creation/placement group ops are unavailable until the new head/GCS is back; KubeRay keeps workers waiting up to 600 s",
            "Workers immediately fail all pending tasks and wait for manual intervention",
            "Workers disconnect and must manually rejoin after recovery"
        ],
        correctAnswer: 1,
        explanation: "From Ray 2.40.0 Docs (GCS Fault Tolerance): 'During the recovery period, the following functions are not available: - Actor creation, deletion and reconstruction. - Placement group creation, deletion and reconstruction. - Resource management. - Worker node registration. - Worker process creation. However, running Ray tasks and actors remain alive and any existing objects will continue to be available.' Option A is wrong: with GCS FT enabled, the cluster does NOT fail (without GCS FT, it would). Option C is wrong: workers do not fail pending tasks; they continue running. Option D is wrong: workers don't need to disconnect and rejoin manually; with FT they reconnect to the new GCS."
    },
    {
        question: "Your 1,000-worker Ray cluster is slow to schedule new actors, even though workers have free CPUs. Head Pod CPU is at 90%. What is the likely cause and solution?",
        options: [
            "Workers are overloaded with tasks; solution: add more workers",
            "GCS (on head node) is CPU-bound handling actor registration, node health checks, and autoscaler queries; solution: lengthen GCS health-check interval (health_check_period_ms) / reduce GCS load or increase head Pod CPU",
            "Object store is full and spilling to disk; solution: increase object-store-memory",
            "Kubernetes API server is slow; solution: use a faster etcd backend"
        ],
        correctAnswer: 1,
        explanation: "High head Pod CPU with slow actor scheduling indicates GCS overload. GCS handles actor directory lookups, node health checks (GCS probes each raylet every 3000 ms by default), autoscaler queries (every 5 seconds), and dashboard queries. In a large cluster (1,000 workers, 10,000+ actors), this becomes CPU-heavy. Solutions: (1) increase head Pod CPU and keep work off it with num-cpus: '0', (2) lengthen health_check_period_ms from 3000 ms via rayStartParams system-config on the head, (3) batch actor operations. Option A is wrong: workers are NOT overloaded (they have free CPUs); the bottleneck is GCS. Option C is wrong: object store full causes task slowdown, not actor creation slowdown. Option D is wrong: Kubernetes API server slowness would affect all K8s operations, not just Ray actor scheduling."
    },
    {
        question: "You run eval sandboxes with Ray actors (max_restarts=3). A worker Pod hosting an actor is OOM-killed. What happens to the actor?",
        options: [
            "The actor is restarted on another worker Pod (up to 3 times per max_restarts); in-flight calls fail unless max_task_retries>0",
            "The actor dies and is NOT restarted, even though max_restarts=3",
            "The actor is checkpointed to Redis and restored on the next available worker",
            "The autoscaler waits for the actor to finish before removing the worker Pod"
        ],
        correctAnswer: 0,
        explanation: "max_restarts applies to actor failures when the actor process dies (OOM kills, node failures, segfaults). From Ray Docs (Actor Fault Tolerance): 'The default value of max_restarts is 0, meaning that the actor won't be restarted.' With max_restarts=3, the actor's __init__ re-runs up to 3 times on a node with resources. Pending method calls: by default (max_task_retries=0) they fail with RayActorError; with max_task_retries>0 they are retried on the restarted actor. Option B is wrong: max_restarts does apply to OOM kills. Option C is wrong: Ray does not checkpoint actor state. Option D is wrong: the autoscaler only removes idle nodes (no active tasks, actors, or objects), so a node hosting a live actor isn't scaled down; OOM kills are different."
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
