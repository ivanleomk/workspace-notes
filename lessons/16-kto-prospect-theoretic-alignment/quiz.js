// Quiz for Lesson 16: KTO - Model Alignment as Prospect Theoretic Optimization

const quizQuestions = [
    {
        question: "What is the main advantage of KTO over DPO in terms of data requirements?",
        options: [
            "KTO requires more data than DPO",
            "KTO requires paired preferences like DPO",
            "KTO only requires binary desirable/undesirable labels instead of paired preferences",
            "KTO requires three outputs per input instead of two"
        ],
        correctIndex: 2,
        explanation: "KTO's key innovation is that it only needs binary feedback (this output is good/bad) instead of paired preferences (output A is better than output B). This makes data collection faster, cheaper, and more scalable in production."
    },
    {
        question: "What does the Kahneman-Tversky value function v(z; λ, α, z₀) model?",
        options: [
            "The absolute monetary value of an outcome",
            "The subjective value humans perceive for an outcome relative to a reference point",
            "The probability of an outcome occurring",
            "The computational cost of training a language model"
        ],
        correctIndex: 1,
        explanation: "The Kahneman-Tversky value function models how humans subjectively perceive value relative to a reference point z₀, not absolute value. It captures biases like loss aversion (losses hurt more than equivalent gains feel good) and diminishing sensitivity (concave in gains, convex in losses)."
    },
    {
        question: "What is loss aversion, and what is its typical coefficient λ in prospect theory?",
        options: [
            "Humans prefer certain outcomes over uncertain ones; λ = 1.0",
            "Humans are more sensitive to losses than equivalent gains; λ ≈ 2.25",
            "Humans overestimate rare events; λ ≈ 0.88",
            "Humans maximize expected value; λ = 1.0"
        ],
        correctIndex: 1,
        explanation: "Loss aversion means losing $100 hurts more than gaining $100 feels good. The median loss aversion coefficient is λ ≈ 2.25 (from Kahneman & Tversky 1992), meaning losses are weighted ~2.25× more heavily than gains. KTO uses λ_D and λ_U to model this asymmetry."
    },
    {
        question: "What is a Human-Aware Loss (HALO)?",
        options: [
            "Any loss function that uses human feedback",
            "A loss function that models human value relative to a reference point, following prospect-theoretic structure",
            "A loss function that is easy for humans to understand",
            "A loss function that requires human annotation during training"
        ],
        correctIndex: 1,
        explanation: "A HALO is defined by the paper as a loss function of the form: f = E[a·v(r_θ - E_Q[r_θ])] + C, where v is a non-decreasing value function and Q is a reference-point distribution. This structure mirrors prospect theory's reference-dependent valuation. DPO and PPO-Clip are proven to be HALOs."
    },
    {
        question: "In KTO, what is the reference point z₀?",
        options: [
            "The reward of the worst output in the dataset",
            "The KL divergence between π_θ and π_ref",
            "The average reward of all training examples",
            "A hyperparameter set to 0"
        ],
        correctIndex: 1,
        explanation: "KTO uses z₀ = KL(π_θ(y'|x) || π_ref(y'|x)), the KL divergence from the reference model. This represents the typical reward change across all outputs for input x. In practice, it's estimated by shifting outputs in a microbatch to create mismatched pairs. z₀ is held fixed during backpropagation for stability."
    },
    {
        question: "What does the hyperparameter β control in KTO?",
        options: [
            "The learning rate",
            "Loss aversion (how much undesirable examples are weighted)",
            "Risk aversion (how quickly the value function saturates)",
            "The batch size"
        ],
        correctIndex: 2,
        explanation: "β controls risk aversion: higher β means the value function σ(β(r_θ - z₀)) saturates more quickly, making the model more risk-averse in gains and more risk-seeking in losses. Default β = 0.1 works well; use smaller values (0.01-0.10) for finetuning, larger (0.10-0.50) for strong pretrained models."
    },
    {
        question: "How much desirable data can KTO discard while still matching DPO performance (Figure 5)?",
        options: [
            "10%",
            "30%",
            "50%",
            "90%"
        ],
        correctIndex: 3,
        explanation: "The paper shows (Figure 5) that KTO on Llama-7B can discard up to 90% of desirable examples (1:10 desirable:undesirable ratio) and still outperform DPO trained on the full balanced dataset. This is achieved by adjusting λ_D, λ_U per Equation 9: λ_D·n_D / (λ_U·n_U) ∈ [1, 1.5]."
    },
    {
        question: "What surprising result did the paper find about SFT for KTO?",
        options: [
            "SFT is always required before KTO",
            "SFT makes KTO perform worse",
            "At sufficient scale (13B+), KTO can skip SFT and match SFT+KTO performance",
            "SFT and KTO are incompatible"
        ],
        correctIndex: 2,
        explanation: "At 13B+ parameters, KTO alone (without SFT) matches SFT+KTO performance (Figure 3). This is unique to KTO among tested methods. The paper hypothesizes this is because KTO keeps response length stable, while DPO without SFT causes length to increase dramatically (Figure 4)."
    },
    {
        question: "How much did KTO improve over DPO on GSM8K when aligning Zephyr-β-SFT on UltraFeedback?",
        options: [
            "1.0 point",
            "5.5 points",
            "13.5 points",
            "20.0 points"
        ],
        correctIndex: 2,
        explanation: "On GSM8K (mathematical reasoning), KTO achieved 53.5% compared to DPO's 40.0%, a gain of 13.5 percentage points (Table 2). This is a 34% relative improvement and the largest gain among all benchmarks tested. Mathematical reasoning appears to particularly benefit from KTO's utility-based objective."
    },
    {
        question: "When should you use KTO instead of DPO?",
        options: [
            "When you have clean, paired preference data with low noise",
            "When you have binary feedback, imbalanced data, or noisy/intransitive preferences",
            "When you need explicit KL regularization",
            "Never; DPO is always better"
        ],
        correctIndex: 1,
        explanation: "Use KTO when: (1) you have binary feedback (easier to collect), (2) your data is highly imbalanced, (3) your preferences are noisy or intransitive (multiple annotators disagree), or (4) you want to skip SFT. KTO's theoretical analysis (Theorem 4.2, 4.3) shows it has better worst-case guarantees for handling noise and intransitivity than DPO."
    },
    {
        question: "What happens when you remove the reference point z₀ from KTO?",
        options: [
            "Performance improves slightly",
            "No change in performance",
            "Performance drops ~3-4 points on BBH and GSM8K",
            "The model fails to converge"
        ],
        correctIndex: 2,
        explanation: "Removing z₀ causes BBH to drop from 52.6% to 49.0% (−3.6 pts) and GSM8K to drop from 53.5% to 49.5% (−4.0 pts) on Zephyr-β-SFT (Table 2, middle). The reference point is crucial for KTO: it forces the model to learn what specifically makes outputs desirable/undesirable, not just boost all probabilities."
    },
    {
        question: "In the one-y-per-x experiment on Mistral-7B + OpenAssistant, how did KTO (one y per x) compare to DPO despite using 72% less data?",
        options: [
            "KTO performed worse than DPO",
            "KTO matched DPO",
            "KTO outperformed DPO (63.1% vs 60.0%)",
            "They were identical"
        ],
        correctIndex: 2,
        explanation: "KTO (one-y-per-x) achieved 63.1% ± 3.6% winrate vs. DPO's 60.0% ± 3.7%, despite using 72% less training data (Table 3). This confirms that KTO genuinely learns from unpaired binary feedback, not from hidden structure in preference pairs. KTO (all y per x) reached 65.2%, even beating the official Mistral-7B-Instruct (62.1%)."
    }
];

// Quiz logic
let currentQuestion = 0;
let correctAnswers = 0;

function initQuiz() {
    renderQuestion();
}

function renderQuestion() {
    const container = document.getElementById('quiz-container');
    if (currentQuestion >= quizQuestions.length) {
        showSummary();
        return;
    }

    const q = quizQuestions[currentQuestion];
    const html = `
        <div class="quiz-question">
            <h3>Question ${currentQuestion + 1} of ${quizQuestions.length}</h3>
            <p class="question-text">${q.question}</p>
            <div class="options">
                ${q.options.map((opt, i) => `
                    <button class="option-btn" onclick="selectAnswer(${i})">${opt}</button>
                `).join('')}
            </div>
            <div id="feedback" class="feedback" style="display: none;"></div>
        </div>
    `;
    container.innerHTML = html;
}

function selectAnswer(selectedIndex) {
    const q = quizQuestions[currentQuestion];
    const isCorrect = selectedIndex === q.correctIndex;
    
    if (isCorrect) {
        correctAnswers++;
    }

    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackDiv.style.display = 'block';
    feedbackDiv.innerHTML = `
        <p><strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong></p>
        <p>${q.explanation}</p>
        <button class="btn" onclick="nextQuestion()">
            ${currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
        </button>
    `;

    // Disable option buttons
    document.querySelectorAll('.option-btn').forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correctIndex) {
            btn.classList.add('correct-answer');
        } else if (i === selectedIndex && !isCorrect) {
            btn.classList.add('wrong-answer');
        }
    });
}

function nextQuestion() {
    currentQuestion++;
    renderQuestion();
}

function showSummary() {
    const percentage = Math.round((correctAnswers / quizQuestions.length) * 100);
    const container = document.getElementById('quiz-container');
    container.style.display = 'none';
    
    const summary = document.getElementById('quiz-summary');
    const scoreDiv = document.getElementById('quiz-score');
    
    let message = '';
    if (percentage >= 90) {
        message = 'Outstanding! You have a strong grasp of KTO and prospect theory.';
    } else if (percentage >= 70) {
        message = 'Great job! You understand the key concepts of KTO and HALOs.';
    } else if (percentage >= 50) {
        message = 'Good effort! Review the lesson for a deeper understanding of KTO\'s design.';
    } else {
        message = 'Keep studying! KTO builds on prospect theory and requires understanding the HALO framework.';
    }
    
    scoreDiv.innerHTML = `
        <p class="score-big">${correctAnswers} / ${quizQuestions.length}</p>
        <p class="score-percentage">${percentage}%</p>
        <p>${message}</p>
    `;
    
    summary.style.display = 'block';
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', initQuiz);
