// Quiz for Constitutional AI lesson
// Questions based on Bai et al. (2022) - Constitutional AI paper

const quizQuestions = [
    {
        id: 1,
        question: "What is the primary goal of Constitutional AI (CAI)?",
        options: [
            "To replace all human oversight in AI training",
            "To train harmless AI assistants using principles rather than extensive human labels for harmfulness",
            "To make AI models smaller and faster",
            "To eliminate the need for supervised fine-tuning"
        ],
        correct: 1,
        explanation: "Constitutional AI aims to train harmless AI assistants through self-improvement using a small set of principles (a 'constitution') rather than requiring tens of thousands of human labels for harmfulness. The method still uses human labels for helpfulness, and principles provide the oversight for harmlessness."
    },
    {
        id: 2,
        question: "What are the two main stages of the Constitutional AI training process?",
        options: [
            "Pretraining and fine-tuning",
            "Supervised Learning (critique→revision→SFT) and Reinforcement Learning (AI feedback→PM→RL)",
            "Data collection and model evaluation",
            "Prompt engineering and reward modeling"
        ],
        correct: 1,
        explanation: "The CAI process has two stages: (1) Supervised Learning stage where the model critiques and revises its own harmful responses, then finetunes on the revisions, and (2) Reinforcement Learning stage where AI generates preference labels for harmlessness, trains a preference model, and then does RL from AI Feedback (RLAIF)."
    },
    {
        id: 3,
        question: "In the supervised learning stage (SL-CAI), what happens after the model generates a harmful response?",
        options: [
            "The response is immediately deleted and training stops",
            "The model critiques its response according to a constitutional principle, then revises it to remove harm",
            "Human labelers rate the response on a scale of 1-5",
            "The model is retrained from scratch"
        ],
        correct: 1,
        explanation: "In SL-CAI, after generating a response to a red-team prompt, the model is asked to critique its own response according to a randomly sampled constitutional principle, then revise the response to remove harmful content. This critique→revision process can be repeated multiple times before supervised finetuning."
    },
    {
        id: 4,
        question: "What is RLAIF (RL from AI Feedback)?",
        options: [
            "A type of neural network architecture",
            "Reinforcement learning using AI-generated preference labels instead of human labels for harmlessness",
            "A dataset of harmful prompts",
            "A new pretraining algorithm"
        ],
        correct: 1,
        explanation: "RLAIF (Reinforcement Learning from AI Feedback) is the RL stage of Constitutional AI where the AI itself evaluates pairs of responses according to constitutional principles, generating preference labels for harmlessness. These AI labels replace human harmfulness labels (though human helpfulness labels are still used)."
    },
    {
        id: 5,
        question: "How many constitutional principles were used in the paper's experiments?",
        options: [
            "5 principles",
            "Exactly 100 principles",
            "16 principles for harmlessness (selected in an ad hoc manner for research)",
            "No specific principles, just general guidelines"
        ],
        correct: 2,
        explanation: "The paper used 16 constitutional principles for harmlessness, randomly sampling one at each revision step. The paper notes these were selected in a fairly ad hoc and iterative way for research purposes, and that in practice such principles should be developed by a larger set of stakeholders."
    },
    {
        id: 6,
        question: "What problem with traditional HH (Helpful and Harmless) RLHF models does CAI specifically address?",
        options: [
            "Models that are too slow to respond",
            "Evasive responses that refuse to engage with sensitive topics",
            "Models that are too expensive to train",
            "Models that can't understand natural language"
        ],
        correct: 1,
        explanation: "A key motivation for CAI was to reduce evasiveness. Prior HH RLHF models would often refuse to engage with controversial or sensitive queries, giving responses like 'I can't answer that.' RL-CAI models engage thoughtfully with harmful queries by explaining objections to them, rather than being evasive, while still remaining harmless."
    },
    {
        id: 7,
        question: "According to the paper's results, what happens when you apply multiple critique-revision rounds (e.g., revision 0, 1, 2, 3, 4)?",
        options: [
            "Performance gets worse with more revisions",
            "There is no difference between revisions",
            "Harmlessness preference model scores improve progressively with more revisions",
            "The model becomes more evasive with each revision"
        ],
        correct: 2,
        explanation: "Figure 5 in the paper shows that harmlessness PM scores improve monotonically with the number of revisions (from initial response through revisions 1-4). Each revision step progressively reduces harmfulness, though the improvements become smaller with later revisions."
    },
    {
        id: 8,
        question: "What role does chain-of-thought (CoT) reasoning play in Constitutional AI?",
        options: [
            "It's not used in Constitutional AI",
            "It improves AI feedback quality by having the model reason step-by-step before choosing the less harmful response",
            "It only works for math problems",
            "It replaces the need for constitutional principles"
        ],
        correct: 1,
        explanation: "Chain-of-thought reasoning improves the RL stage of CAI. When generating AI feedback labels, the model can be prompted to 'think step-by-step' and explain why one response is more harmless before choosing. The paper found CoT significantly improves performance on HHH evaluations, though probability clamping (40-60%) was needed to prevent overconfident predictions."
    },
    {
        id: 9,
        question: "How does Constitutional AI compare to standard RLHF in terms of harmlessness vs. helpfulness tradeoff?",
        options: [
            "CAI models are more harmful but more helpful",
            "CAI models achieve better harmlessness at a given level of helpfulness (better Pareto frontier)",
            "CAI models are less helpful and less harmless",
            "There is no difference between CAI and RLHF"
        ],
        correct: 1,
        explanation: "Figure 2 shows that RL-CAI models achieve a better Pareto frontier than traditional helpful and HH RLHF models: they are less harmful at a given level of helpfulness. Crowdworkers preferred RL-CAI responses, finding them both more harmless and more transparent/non-evasive."
    },
    {
        id: 10,
        question: "What is 'Goodharting' in the context of Constitutional AI, as mentioned in the paper?",
        options: [
            "When the model gets better at all tasks",
            "When RL-CAI models are over-trained and produce overly harsh or boilerplate responses to prompts",
            "A technique to improve model accuracy",
            "The process of collecting human feedback"
        ],
        correct: 1,
        explanation: "The paper mentions Goodharting behavior when RL-CAI models are over-trained: they can become overly harsh in responding to harmful prompts or include repetitive boilerplate language (e.g., 'you are valid, valued, and cared for'). This happens when optimizing too hard against the preference model, causing the model to exploit patterns rather than genuinely improving."
    }
];

// Quiz state
let currentQuestion = 0;
let score = 0;
let answers = [];

function initializeQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    renderQuestion();
}

function renderQuestion() {
    const container = document.getElementById('quiz-container');
    const question = quizQuestions[currentQuestion];
    
    container.innerHTML = `
        <div class="quiz-question">
            <h3>Question ${currentQuestion + 1} of ${quizQuestions.length}</h3>
            <p>${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option" onclick="selectAnswer(${index})" id="option-${index}">
                        ${String.fromCharCode(65 + index)}. ${option}
                    </button>
                `).join('')}
            </div>
            <div class="feedback" id="feedback"></div>
        </div>
    `;
}

function selectAnswer(selected) {
    const question = quizQuestions[currentQuestion];
    const feedback = document.getElementById('feedback');
    const options = document.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach((option, index) => {
        option.disabled = true;
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selected && index !== question.correct) {
            option.classList.add('wrong');
        }
    });

    // Record answer
    answers[currentQuestion] = selected;
    
    // Show feedback
    const isCorrect = selected === question.correct;
    if (isCorrect) score++;
    
    feedback.className = `feedback show ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.innerHTML = `
        <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong>
        <p>${question.explanation}</p>
        <button class="btn" onclick="nextQuestion()" style="margin-top: 15px;">
            ${currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Show Results'}
        </button>
    `;
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const container = document.getElementById('quiz-container');
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    let message = '';
    if (percentage >= 90) {
        message = 'Outstanding! You have an excellent understanding of Constitutional AI!';
    } else if (percentage >= 70) {
        message = 'Great job! You understand the key concepts of Constitutional AI.';
    } else if (percentage >= 50) {
        message = 'Good effort! Review the lesson to strengthen your understanding.';
    } else {
        message = 'Keep learning! Review the lesson and try again.';
    }
    
    container.innerHTML = `
        <div class="quiz-summary">
            <h3>Quiz Complete!</h3>
            <p class="quiz-score">Your Score: ${score} / ${quizQuestions.length} (${percentage}%)</p>
            <p>${message}</p>
            <button class="btn" onclick="restartQuiz()">Retry Quiz</button>
        </div>
        <div class="quiz-summary" style="margin-top: 20px;">
            <h4>Review Your Answers</h4>
            ${quizQuestions.map((q, i) => `
                <div style="margin: 20px 0; padding: 15px; background: var(--bg-tertiary); border-radius: 8px; text-align: left;">
                    <p><strong>Q${i + 1}:</strong> ${q.question}</p>
                    <p style="color: ${answers[i] === q.correct ? '#10b981' : '#ef4444'};">
                        Your answer: ${String.fromCharCode(65 + answers[i])}. ${q.options[answers[i]]}
                    </p>
                    ${answers[i] !== q.correct ? `
                        <p style="color: #10b981;">
                            Correct answer: ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}
                        </p>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    renderQuestion();
}

// Initialize quiz when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeQuiz);
} else {
    initializeQuiz();
}
