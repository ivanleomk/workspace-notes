// Quiz questions for Lesson 10: Ray Core - Tasks, Actors, Object Store, and GCS
const quizQuestions = [
    {
        question: "Why does Ray use a 100 KB threshold to decide whether objects are inlined (in-process store) vs stored in Plasma (shared-memory object store)?",
        options: [
            "Because 100 KB is the maximum size for gRPC messages in Ray",
            "Small objects (<100 KB) have low serialization cost and fit in RPCs; large objects benefit from zero-copy shared memory across workers on the same node",
            "Because Plasma cannot store objects smaller than 100 KB due to memory alignment requirements",
            "To prevent the object store from filling up with many small objects"
        ],
        correctAnswer: 1,
        explanation: "Ray uses max_direct_call_object_size = 100 KB (from src/ray/common/ray_config_def.h) to decide storage location. Small objects (≤100 KB) are inlined: stored in the owner's in-process heap and passed directly in task RPCs, avoiding shared-memory coordination overhead. Large objects (>100 KB) go to Plasma shared memory, where multiple workers on the same node can read them via zero-copy memory-mapped access. Option A is wrong: gRPC max message size is 512 MB (max_grpc_message_size). Option C is wrong: Plasma can store any size. Option D is wrong: while too many small objects can fill metadata, the primary reason for the threshold is performance (inline vs zero-copy)."
    },
    {
        question: "How does Ray's distributed reference counting prevent object leaks when a worker crashes?",
        options: [
            "The GCS tracks all references globally and deletes objects when their count reaches zero",
            "Ray uses lineage reconstruction: if the owner crashes, Ray re-executes the task that created the object and downstream tasks (fate-sharing)",
            "Each object has a timeout; if not accessed for 5 minutes, it is automatically deleted",
            "Ray uses a centralized garbage collector that runs every minute"
        ],
        correctAnswer: 1,
        explanation: "Ray uses the ownership model (NSDI 2021 paper): each object has an owner (the worker that invoked the task that created it). Borrowers maintain local ref counts and notify the owner when they reach zero. If the owner crashes, all objects it owns and all borrowers are fate-shared (lost together). Ray uses lineage reconstruction: it re-executes the owner's task and downstream tasks to reconstruct lost objects, using stored task specs (function + arguments). Max lineage size is 1 GiB (max_lineage_bytes); once exceeded, old lineage is evicted and objects can't be reconstructed. Option A is wrong: GCS does NOT track object references; that's decentralized to owners. Option C is wrong: no automatic timeout. Option D is wrong: reference counting is distributed, not centralized."
    },
    {
        question: "When is an async Ray actor with max_concurrency=10 better than spawning 10 separate Ray tasks for I/O-bound sandbox exec calls?",
        options: [
            "Tasks are always faster because they have lower scheduling overhead",
            "Async actors preserve state (e.g., a SandboxClient connection) across 10,000 calls, avoiding setup/teardown overhead; tasks are stateless and would recreate the client each time",
            "Actors are required for GPU workloads; tasks cannot access GPUs",
            "Actors have higher priority in Ray's scheduler"
        ],
        correctAnswer: 1,
        explanation: "For I/O-bound work (e.g., calling a sandbox API), async actors with max_concurrency allow N concurrent method calls within a single stateful worker. If you create an actor with a SandboxClient in __init__, that client persists across 10,000 exec calls, avoiding repeated authentication/setup. Async actors use asyncio for concurrency: 10 concurrent await calls in the actor's event loop. Compare to tasks: each task is stateless, so you'd create and tear down the SandboxClient for each of 10,000 tasks, wasting setup time. Option A is wrong: task overhead is ~1ms (NSDI 2021), actor method overhead is similar. Option C is wrong: both tasks and actors can request GPUs (num_gpus=1). Option D is wrong: actors don't have inherently higher priority; scheduling depends on resources and placement."
    },
    {
        question: "What happens to running tasks if the GCS (Global Control Service) crashes on the head node (without GCS fault tolerance enabled)?",
        options: [
            "All running tasks immediately fail because they lose connection to GCS",
            "Running tasks continue to completion (they don't need GCS), but new actor creations and actor method calls fail because they require GCS lookups",
            "Ray automatically elects a new head node and restarts the GCS without data loss",
            "Running tasks pause until the GCS restarts"
        ],
        correctAnswer: 1,
        explanation: "GCS manages cluster-level metadata (actor directory, node membership, placement groups), but does NOT manage task execution or object locations. Running tasks already know their dependencies' locations (stored in workers' ownership tables), so they continue to completion. However: (1) New actors cannot be created (actor creation goes through GCS for placement). (2) Actor method calls fail (require GCS actor-directory lookup to find the actor's address). (3) New tasks that depend on actors or cross-node coordination may fail. Without GCS FT, the cluster is unrecoverable: you must restart all nodes. Option C is wrong: no automatic election without GCS FT (enabled with Redis-backed persistence, covered in Lesson 12). Option A and D are wrong: running tasks don't depend on GCS."
    },
    {
        question: "Why does Ray's object store spill objects to disk when Plasma shared memory is full, and what is the performance impact?",
        options: [
            "Spilling prevents OutOfMemory errors; it writes pinned objects to local disk (or S3) at ~100 MB/s, vs ~10 GB/s for Plasma shared memory (100× slower)",
            "Spilling is disabled by default because it would cause data corruption",
            "Spilling only affects objects larger than 1 GB; smaller objects are deleted instead of spilled",
            "Spilling uses network transfers to move objects to remote nodes with available memory"
        ],
        correctAnswer: 0,
        explanation: "Object spilling (Ray docs: Object Spilling) automatically writes pinned objects from Plasma to external storage (local disk by default, configurable to S3) when Plasma is full. Ray selects spillable objects: those with ref count == 1 (only the owner holds a reference, no running task is using it). Performance impact: disk I/O is ~100 MB/s (SATA SSD) vs ~10 GB/s for Plasma shared memory (zero-copy mmap), so accessing spilled objects is 100× slower. Spilling is transparent: no app changes needed. Configure with ray.init(object_spilling_directory='/path'). Option B is wrong: spilling is enabled by default, no corruption. Option C is wrong: all object sizes can be spilled. Option D is wrong: spilling writes to disk/S3, not to remote nodes (though remote object transfers also happen via raylet object manager)."
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
    if (percentage === 100) return "Perfect! You've mastered Ray Core: tasks, actors, object store, ownership, and GCS.";
    if (percentage >= 80) return "Excellent! You understand distributed reference counting and when to use Ray for eval orchestration.";
    if (percentage >= 60) return "Good job! Review the sections on ownership model, object store thresholds, and GCS responsibilities.";
    return "Keep studying! Re-read the architecture overview, object store internals, and fault tolerance sections.";
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
