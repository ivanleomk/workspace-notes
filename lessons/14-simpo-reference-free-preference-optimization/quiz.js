// Quiz questions for SimPO lesson
const quizQuestions = [
    {
        id: 1,
        question: "What is the main advantage of SimPO over DPO?",
        options: [
            "SimPO trains faster by using a smaller model",
            "SimPO eliminates the reference model, reducing memory usage by ~50%",
            "SimPO requires less preference data than DPO",
            "SimPO can train without any supervised fine-tuning"
        ],
        correct: 1,
        explanation: "SimPO eliminates the reference model (π_ref) that DPO requires, reducing memory usage by approximately 50% since only the policy model needs to be loaded during training. This also simplifies implementation and reduces computational cost."
    },
    {
        id: 2,
        question: "What is SimPO's reward formulation?",
        options: [
            "r(x,y) = β log(π_θ(y|x) / π_ref(y|x))",
            "r(x,y) = (β / |y|) log π_θ(y|x)",
            "r(x,y) = β log π_θ(y|x)",
            "r(x,y) = log π_θ(y|x) - log π_ref(y|x)"
        ],
        correct: 1,
        explanation: "SimPO uses r(x,y) = (β / |y|) log π_θ(y|x), which is the length-normalized average log-probability. This reward is reference-free (no π_ref) and length-normalized (divided by |y|), aligning with the generation metric used during inference."
    },
    {
        id: 3,
        question: "Why does SimPO use length normalization in its reward?",
        options: [
            "To make training faster",
            "To prevent length exploitation where models generate excessively long responses",
            "To reduce memory usage",
            "To improve compatibility with the reference model"
        ],
        correct: 1,
        explanation: "Length normalization (dividing by |y|) prevents length exploitation. Without it, longer sequences would have lower summed log-probabilities, forcing the model to artificially inflate probabilities for longer sequences, leading to verbose, lower-quality outputs. The paper shows removing length normalization increases response length by 22-25% while performance drops dramatically."
    },
    {
        id: 4,
        question: "What is the target reward margin γ in SimPO?",
        options: [
            "The KL divergence penalty coefficient",
            "A term that encourages the reward difference between chosen and rejected responses to exceed γ, improving generalization",
            "The learning rate for the policy model",
            "The temperature parameter for sampling"
        ],
        correct: 1,
        explanation: "The target reward margin γ is added to the Bradley-Terry objective to encourage the model to separate chosen and rejected responses by at least γ. This is similar to margin-based classifiers (like SVMs) and improves generalization. The paper recommends γ ∈ [0.5, 1.5]."
    },
    {
        id: 5,
        question: "What problem with DPO does SimPO address?",
        options: [
            "DPO is too slow to train",
            "DPO's reward (log-ratios) doesn't match the generation metric (average log-likelihood), creating a train-test mismatch",
            "DPO requires too much training data",
            "DPO cannot handle multi-turn dialogues"
        ],
        correct: 1,
        explanation: "DPO uses log-probability ratios as the reward, but during generation, models rank candidates by average log-likelihood. This creates a mismatch: only ~50% of training examples have reward rankings that match likelihood rankings. SimPO fixes this by using average log-likelihood directly as the reward."
    },
    {
        id: 6,
        question: "On AlpacaEval 2, how much does SimPO outperform DPO (Llama-3-Instruct)?",
        options: [
            "SimPO and DPO perform identically",
            "SimPO outperforms DPO by 4.4 percentage points (44.7% vs 40.3% LC)",
            "DPO outperforms SimPO",
            "SimPO outperforms DPO by 15 percentage points"
        ],
        correct: 1,
        explanation: "On Llama-3-Instruct, SimPO achieves 44.7% LC win rate on AlpacaEval 2, while DPO achieves 40.3%, a 4.4 percentage point improvement. Across all setups, SimPO consistently outperforms DPO by 4-6 points."
    },
    {
        id: 7,
        question: "What are typical values for the β parameter in SimPO?",
        options: [
            "β = 0.1 to 0.5 (like DPO)",
            "β = 2.0 to 2.5",
            "β = 10 to 20",
            "β = 0.01 to 0.1"
        ],
        correct: 1,
        explanation: "SimPO typically uses β between 2.0 and 2.5, which is higher than DPO's typical β values (0.1-0.5). This is because SimPO's reward is length-normalized, so the scale is different. β controls the reward scale and influences gradient magnitudes."
    },
    {
        id: 8,
        question: "How does SimPO achieve comparable KL divergence to DPO without explicit KL regularization?",
        options: [
            "SimPO secretly includes a hidden KL term in the loss",
            "SimPO uses a small learning rate, diverse preference data, and relies on LLMs' intrinsic robustness to new data",
            "SimPO doesn't maintain low KL divergence—it drifts arbitrarily far from the reference",
            "SimPO uses a different optimizer that enforces KL constraints"
        ],
        correct: 1,
        explanation: "The paper attributes SimPO's comparable KL divergence to three factors: (1) small learning rate, (2) diverse preference dataset covering many domains, and (3) intrinsic robustness of LLMs to learn from new data without catastrophic forgetting. These practical factors provide implicit regularization."
    },
    {
        id: 9,
        question: "What is the best-performing model in the paper?",
        options: [
            "Llama-3-8B-SimPO with 44.7% LC on AlpacaEval 2",
            "Mistral-7B-SimPO with 32.1% LC on AlpacaEval 2",
            "Gemma-2-9B-it-SimPO with 72.4% LC on AlpacaEval 2 and ranked 1st among <10B models on Chatbot Arena",
            "GPT-4 Turbo"
        ],
        correct: 2,
        explanation: "Gemma-2-9B-it-SimPO achieves 72.4% LC on AlpacaEval 2 and 59.1% on Arena-Hard. On Chatbot Arena with real user votes, it ranks 1st among all models under 10B parameters (as of September 2024)."
    },
    {
        id: 10,
        question: "What happens when length normalization is removed from SimPO?",
        options: [
            "Performance improves slightly",
            "Response length increases by 22-25% while LC win rate drops dramatically (e.g., from 21.5% to 11.9%)",
            "Nothing—length normalization has no effect",
            "Training becomes unstable"
        ],
        correct: 1,
        explanation: "The paper's ablation (Table 11) shows that removing length normalization causes responses to become 22-25% longer while LC win rate drops dramatically. For Mistral-Base on AlpacaEval 2, LC drops from 21.5% to 11.9%, showing that length exploitation hurts quality."
    },
    {
        id: 11,
        question: "How does SimPO compare to other recent baselines like ORPO, KTO, and IPO?",
        options: [
            "SimPO performs worse than all of them",
            "SimPO performs comparably to ORPO but worse than KTO",
            "SimPO consistently outperforms all of them across multiple setups",
            "The paper doesn't compare to these baselines"
        ],
        correct: 2,
        explanation: "Table 4 in the paper shows SimPO consistently outperforms ORPO, KTO, IPO, CPO, RRHF, SLiC-HF, and R-DPO across all four training setups (Mistral/Llama-3 × Base/Instruct). SimPO achieves the highest LC win rates on AlpacaEval 2 in every configuration."
    },
    {
        id: 12,
        question: "What is the relationship between SimPO's reward and the metric used during generation?",
        options: [
            "They are completely unrelated",
            "SimPO's reward is proportional to the average log-likelihood used in beam search and generation",
            "SimPO's reward uses perplexity while generation uses log-likelihood",
            "SimPO's reward requires a reference model while generation does not"
        ],
        correct: 1,
        explanation: "SimPO's reward r(x,y) = (β/|y|) log π_θ(y|x) is exactly β times the average log-likelihood used to rank candidates during generation. This alignment eliminates the train-test mismatch that exists in DPO, where the reward (log-ratios) differs from the generation metric."
    }
];

// Quiz state
let currentQuestion = 0;
let correctAnswers = 0;
let answeredQuestions = new Set();

// Initialize quiz
document.addEventListener('DOMContentLoaded', function() {
    renderQuiz();
});

function renderQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    container.innerHTML = '';
    
    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.id = `question-${q.id}`;
        
        questionDiv.innerHTML = `
            <h3>Question ${q.id}: ${q.question}</h3>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <button class="quiz-option" onclick="checkAnswer(${q.id}, ${i})" data-question="${q.id}" data-answer="${i}">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            <div class="quiz-feedback" id="feedback-${q.id}"></div>
        `;
        
        container.appendChild(questionDiv);
    });
}

function checkAnswer(questionId, selectedIndex) {
    if (answeredQuestions.has(questionId)) {
        return; // Already answered
    }
    
    const question = quizQuestions.find(q => q.id === questionId);
    const isCorrect = selectedIndex === question.correct;
    const feedbackDiv = document.getElementById(`feedback-${questionId}`);
    const buttons = document.querySelectorAll(`#question-${questionId} .quiz-option`);
    
    // Disable all buttons for this question
    buttons.forEach(btn => btn.disabled = true);
    
    // Highlight correct and selected answers
    buttons[question.correct].classList.add('correct');
    if (!isCorrect) {
        buttons[selectedIndex].classList.add('incorrect');
    }
    
    // Show feedback
    feedbackDiv.innerHTML = `
        <div class="feedback-${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            <p>${question.explanation}</p>
        </div>
    `;
    feedbackDiv.style.display = 'block';
    
    // Update score
    answeredQuestions.add(questionId);
    if (isCorrect) {
        correctAnswers++;
    }
    
    // Check if all questions answered
    if (answeredQuestions.size === quizQuestions.length) {
        showFinalScore();
    }
}

function showFinalScore() {
    const summary = document.getElementById('quiz-summary');
    const scoreDiv = document.getElementById('quiz-score');
    const percentage = Math.round((correctAnswers / quizQuestions.length) * 100);
    
    let message = '';
    if (percentage === 100) {
        message = 'Perfect score! You have mastered SimPO!';
    } else if (percentage >= 80) {
        message = 'Excellent work! You understand SimPO well.';
    } else if (percentage >= 60) {
        message = 'Good job! Review the sections on length normalization and reward formulation.';
    } else {
        message = 'Keep learning! Re-read the lesson and try again.';
    }
    
    scoreDiv.innerHTML = `
        <p>You answered <strong>${correctAnswers} out of ${quizQuestions.length}</strong> questions correctly.</p>
        <p>Score: <strong>${percentage}%</strong></p>
        <p>${message}</p>
    `;
    
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
