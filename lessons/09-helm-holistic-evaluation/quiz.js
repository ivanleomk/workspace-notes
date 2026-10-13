// Quiz for HELM lesson
// Questions based on Liang et al. (2022)

const quizQuestions = [
    {
        question: "How many language models did HELM evaluate?",
        options: [
            "16 models",
            "30 models",
            "42 models",
            "50 models"
        ],
        correct: 1,
        explanation: "HELM evaluated 30 prominent language models from 12 organizations, including models from OpenAI, Anthropic, Google, Meta, and others."
    },
    {
        question: "What percentage of core HELM scenarios were models evaluated on BEFORE the HELM benchmark?",
        options: [
            "17.9%",
            "42.0%",
            "67.5%",
            "87.5%"
        ],
        correct: 0,
        explanation: "Prior to HELM, models were evaluated on just 17.9% of the core HELM scenarios on average. HELM improved this to 96.0%, dramatically increasing evaluation standardization."
    },
    {
        question: "How many metric categories does HELM measure for each core scenario?",
        options: [
            "3 metrics",
            "5 metrics",
            "7 metrics",
            "12 metrics"
        ],
        correct: 2,
        explanation: "HELM measures 7 metric categories: accuracy, calibration, robustness, fairness, bias, toxicity, and efficiency. This multi-metric approach ensures metrics beyond accuracy are not sidelined."
    },
    {
        question: "What was code-davinci-002's accuracy on GSM8K (mathematical reasoning)?",
        options: [
            "16.0%",
            "35.0%",
            "52.1%",
            "71.5%"
        ],
        correct: 2,
        explanation: "code-davinci-002 achieved 52.1% on GSM8K, significantly outperforming text-davinci-002 (35.0%) and all other models (<16%). Code models consistently excel at reasoning tasks."
    },
    {
        question: "For OPT-175B on HellaSwag, how much did accuracy drop when switching from separate prompts to joint prompts?",
        options: [
            "From 79.1% to 54.8%",
            "From 79.1% to 30.2%",
            "From 65.0% to 45.0%",
            "From 92.0% to 79.1%"
        ],
        correct: 1,
        explanation: "OPT-175B's accuracy on HellaSwag dropped from 79.1% (separate 0-shot prompts) to 30.2% (joint 5-shot prompt), demonstrating extreme sensitivity to prompt format. This was nearly random performance with the joint method."
    },
    {
        question: "How many total scenarios does HELM include (core + targeted)?",
        options: [
            "16 scenarios",
            "26 scenarios",
            "42 scenarios",
            "112 scenarios"
        ],
        correct: 2,
        explanation: "HELM includes 42 total scenarios: 16 core scenarios (measured with all 7 metrics) plus 26 targeted evaluation scenarios for deep dives into specific capabilities like reasoning and memorization."
    },
    {
        question: "Of the 112 possible (scenario × metric) pairs for core scenarios, how many did HELM measure?",
        options: [
            "87 pairs (77.7%)",
            "98 pairs (87.5%)",
            "103 pairs (92.0%)",
            "112 pairs (100%)"
        ],
        correct: 1,
        explanation: "HELM measured 98 of the 112 possible pairs (16 scenarios × 7 metrics), achieving 87.5% coverage. The remaining 14 pairs were either not well-defined or excluded for validity concerns."
    },
    {
        question: "How many of HELM's scenarios were new and had not been used in mainstream LM evaluation before?",
        options: [
            "7 scenarios",
            "16 scenarios",
            "21 scenarios",
            "30 scenarios"
        ],
        correct: 2,
        explanation: "HELM introduced 21 scenarios that were either entirely new (e.g., WikiFact) or had not been previously used in mainstream language model evaluation (e.g., ICE)."
    },
    {
        question: "Which model type consistently outperformed text models on reasoning tasks, even those posed in natural language?",
        options: [
            "Instruction-tuned models",
            "Code models",
            "Multilingual models",
            "Dialogue-optimized models"
        ],
        correct: 1,
        explanation: "Code models, especially code-davinci-002, consistently outperformed text models on reasoning tasks. On GSM8K, code-davinci-002 achieved 52.1% vs text-davinci-002's 35.0%, even though GSM8K is posed in natural language."
    },
    {
        question: "What is the key advantage of HELM's multi-metric approach?",
        options: [
            "It makes evaluation faster",
            "It reduces the number of test examples needed",
            "It exposes trade-offs between different desiderata",
            "It eliminates the need for human evaluation"
        ],
        correct: 2,
        explanation: "HELM's multi-metric approach measures 7 metrics for each scenario, making explicit the trade-offs between accuracy, fairness, robustness, toxicity, and other desiderata. This prevents metrics beyond accuracy from being sidelined."
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function loadQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById('question-text').textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    document.getElementById('question-content').textContent = q.question;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsDiv.appendChild(button);
    });
    
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    answered = false;
}

function selectAnswer(selected) {
    if (answered) return;
    
    answered = true;
    const q = quizQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach((btn, index) => {
        if (index === q.correct) {
            btn.classList.add('correct');
        } else if (index === selected) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });
    
    const feedback = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedback-text');
    
    if (selected === q.correct) {
        score++;
        feedbackText.innerHTML = `<strong>✓ Correct!</strong><br>${q.explanation}`;
        feedback.className = 'feedback correct';
    } else {
        feedbackText.innerHTML = `<strong>✗ Incorrect.</strong><br>${q.explanation}`;
        feedback.className = 'feedback incorrect';
    }
    
    feedback.style.display = 'block';
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const quizContainer = document.getElementById('quiz-container');
    
    let message = '';
    if (percentage === 100) {
        message = '🎉 Perfect score! You have an excellent understanding of HELM.';
    } else if (percentage >= 80) {
        message = '🌟 Great job! You understand the key concepts of holistic evaluation.';
    } else if (percentage >= 60) {
        message = '👍 Good work! Review the lesson to strengthen your understanding.';
    } else {
        message = '📚 Keep learning! Review the lesson and try again.';
    }
    
    quizContainer.innerHTML = `
        <div class="quiz-results">
            <h3>Quiz Complete!</h3>
            <p class="score">Your score: ${score} / ${quizQuestions.length} (${percentage}%)</p>
            <p class="message">${message}</p>
            <button class="quiz-btn" onclick="restartQuiz()">Retake Quiz</button>
        </div>
    `;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <div id="question-text" class="question-number"></div>
        <div id="question-content" class="question"></div>
        <div id="options" class="options"></div>
        <div id="feedback" class="feedback" style="display: none;">
            <p id="feedback-text"></p>
        </div>
        <button id="next-btn" class="quiz-btn" onclick="nextQuestion()" style="display: none;">Next Question</button>
    `;
    
    loadQuestion();
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-container')) {
        loadQuestion();
    }
});
