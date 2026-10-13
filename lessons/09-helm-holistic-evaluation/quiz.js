// Quiz questions for HELM lesson
const quizQuestions = [
    {
        question: "What are the three pillars of HELM's holistic evaluation approach?",
        options: [
            "Accuracy, Robustness, and Fairness",
            "Broad coverage + recognition of incompleteness, Multi-metric measurement, Standardization",
            "Question answering, Summarization, and Classification",
            "Open models, Closed models, and Limited-access models"
        ],
        correct: 1,
        explanation: "HELM's three pillars are: (1) Broad coverage with explicit recognition of what's missing, (2) Multi-metric measurement (7 categories for each scenario), and (3) Standardization (same scenarios, same prompts, same adaptation for all models). These pillars distinguish HELM from prior benchmarks that focused only on accuracy or used inconsistent evaluation setups."
    },
    {
        question: "How many core scenarios does HELM include, and how many metric categories does it measure for each?",
        options: [
            "16 core scenarios, 7 metric categories",
            "30 core scenarios, 5 metric categories",
            "42 core scenarios, 7 metric categories",
            "16 core scenarios, 3 metric categories"
        ],
        correct: 0,
        explanation: "HELM has 16 core scenarios (spanning QA, IR, summarization, sentiment, toxicity detection, and misc classification) and measures 7 metric categories for each: accuracy, calibration, robustness, fairness, bias, toxicity, and efficiency. This yields 98/112 possible pairs (87.5% density). The 26 targeted scenarios are separate from the core set."
    },
    {
        question: "What was the average scenario coverage for models BEFORE HELM, and what did HELM achieve?",
        options: [
            "Before: 50%, After: 75%",
            "Before: 17.9%, After: 96.0%",
            "Before: 30%, After: 100%",
            "Before: 10%, After: 50%"
        ],
        correct: 1,
        explanation: "Prior to HELM, models were evaluated on just 17.9% of core scenarios on average (even aggregating results from multiple papers). Some prominent models (e.g., T5 11B and Anthropic-LM v4-s3 52B) had zero datasets in common. HELM improved this to 96.0% coverage by standardizing evaluation across all models. This dramatic increase makes model comparisons meaningful."
    },
    {
        question: "What is HELM's \"multi-metric density\" achievement?",
        options: [
            "Measuring 98 out of 112 possible (scenario, metric) pairs (87.5%)",
            "Evaluating 30 models from 12 organizations",
            "Testing 42 total scenarios (16 core + 26 targeted)",
            "Processing 12.2 billion tokens across 4,939 runs"
        ],
        correct: 0,
        explanation: "Multi-metric density refers to measuring multiple metrics for the same scenarios. With 16 core scenarios × 7 metric categories = 112 possible pairs, HELM measures 98 of them (87.5%). The remaining 14 are either undefined (e.g., can't measure toxicity in generations for tasks without generation) or deliberately skipped. This dense coverage ensures tradeoffs between metrics are visible."
    },
    {
        question: "Which models showed the best overall performance on accuracy, robustness, and fairness in HELM?",
        options: [
            "GPT-NeoX (20B) and OPT (175B)",
            "text-davinci-002 and Anthropic-LM v4-s3 (52B)",
            "BLOOM (176B) and GLM (130B)",
            "T5 (11B) and TNLG v2 (530B)"
        ],
        correct: 1,
        explanation: "text-davinci-002 and Anthropic-LM v4-s3 (52B) were the top performers, consistently ranking in the top 3 for accuracy, robustness, and fairness. Notably, they were the only instruction-tuned models evaluated, and Anthropic-LM achieved this despite being 10× smaller than the largest models (TNLG v2 530B). This suggests instruction-tuning provides broad advantages beyond just accuracy."
    },
    {
        question: "How sensitive are language models to prompt formatting according to HELM?",
        options: [
            "Not very sensitive—results vary by less than 5%",
            "Moderately sensitive—results vary by 10-20%",
            "Extremely sensitive—OPT (175B) on HellaSwag varied from 30.2% to 79.1% accuracy depending on prompt format",
            "Only sensitive for small models, not large ones"
        ],
        correct: 2,
        explanation: "HELM found extreme prompt sensitivity. OPT (175B) on HellaSwag scored 79.1% accuracy with separate prompts (one per answer choice) but dropped to 30.2% with joint prompts (multiple-choice format)—a 49-point swing! All models showed significant sensitivity to prompt formatting, choice of in-context examples, and number of examples. This challenges the notion of 'fair' standardized evaluation."
    },
    {
        question: "What is a \"scenario\" in HELM's taxonomy?",
        options: [
            "A triple: (task, domain, language)",
            "A dataset with train/test splits",
            "A combination of model and prompt",
            "A metric category (accuracy, robustness, etc.)"
        ],
        correct: 0,
        explanation: "HELM defines a scenario as a triple: (task, domain, language). For example: (question answering, clinical notes from doctors, English) or (toxicity detection, tweets from Egypt, Arabic). This structured taxonomy enables systematic selection and makes explicit what's covered vs missing (e.g., HELM covers only English, acknowledges this gap)."
    },
    {
        question: "Which type of models consistently outperformed text models on reasoning tasks, even on natural language reasoning?",
        options: [
            "Larger text models (175B+)",
            "Multilingual models (BLOOM, GLM)",
            "Code models (code-davinci-002)",
            "Instruction-tuned models"
        ],
        correct: 2,
        explanation: "Code models, especially code-davinci-002, dominated reasoning tasks. On GSM8K: code-davinci-002 scored 52.1% vs text-davinci-002's 35.0% and <16% for all others. Even on synthetic reasoning in natural language, code-davinci-002 (72.7%) beat text-davinci-002 (65.1%) and OPT 175B (29.4%). This suggests code training improves structured reasoning abilities broadly, not just for programming."
    },
    {
        question: "How does HELM address the validity of automated summarization metrics?",
        options: [
            "It introduces new summarization metrics that work better",
            "It finds that automated metrics (ROUGE, BERTScore) largely fail to discriminate model quality on CNN/DM and XSUM",
            "It shows that ROUGE and BERTScore perfectly correlate with human judgments",
            "It doesn't evaluate summarization tasks"
        ],
        correct: 1,
        explanation: "HELM found that automated summarization metrics (ROUGE, BERTScore) on CNN/DailyMail and XSUM largely failed to discriminate differences in model quality that researchers observed qualitatively. This highlights the ongoing challenge of evaluation for open-ended generation tasks and suggests human evaluation or better automated metrics are still needed for summarization."
    },
    {
        question: "Why is HELM's multi-metric approach important for post-training evaluation (RLHF, DPO, etc.)?",
        options: [
            "Post-training doesn't affect metrics beyond accuracy",
            "It exposes tradeoffs—RLHF/DPO may improve accuracy but hurt robustness, fairness, or calibration",
            "Multi-metric evaluation is only useful for pre-training",
            "HELM doesn't evaluate instruction-tuned models"
        ],
        correct: 1,
        explanation: "HELM's multi-metric lens is critical for post-training because techniques like RLHF, DPO, GRPO, and CAI optimize specific objectives (reward scores, preferences, verifiable correctness) but can have unintended effects on other desiderata. Measuring accuracy, robustness, fairness, calibration, bias, toxicity, and efficiency together exposes tradeoffs like 'alignment tax' (safety hurting capability) or 'robustness collapse' (RL making models brittle). You can't optimize what you don't measure."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = new Set();

function loadQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';

    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${q.question}</p>
            <div class="quiz-options">
                ${q.options.map((option, i) => `
                    <button class="quiz-option" onclick="checkAnswer(${index}, ${i})" id="q${index}-option${i}">
                        ${option}
                    </button>
                `).join('')}
            </div>
            <div class="feedback" id="feedback-${index}"></div>
        `;
        container.appendChild(questionDiv);
    });
}

function checkAnswer(questionIndex, selectedOption) {
    if (answeredQuestions.has(questionIndex)) {
        return; // Already answered
    }

    const question = quizQuestions[questionIndex];
    const isCorrect = selectedOption === question.correct;
    const feedbackDiv = document.getElementById(`feedback-${questionIndex}`);
    
    // Disable all options for this question
    for (let i = 0; i < question.options.length; i++) {
        const optionBtn = document.getElementById(`q${questionIndex}-option${i}`);
        optionBtn.disabled = true;
        
        if (i === question.correct) {
            optionBtn.classList.add('correct');
        } else if (i === selectedOption && !isCorrect) {
            optionBtn.classList.add('wrong');
        }
    }

    // Show feedback
    feedbackDiv.className = 'feedback show ' + (isCorrect ? 'correct' : 'wrong');
    feedbackDiv.innerHTML = `
        <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong><br>
        ${question.explanation}
    `;

    // Update score
    if (isCorrect) {
        score++;
    }
    answeredQuestions.add(questionIndex);

    // Check if quiz is complete
    if (answeredQuestions.size === quizQuestions.length) {
        showQuizSummary();
    }
}

function showQuizSummary() {
    const summaryDiv = document.getElementById('quiz-summary');
    const scoreDiv = document.getElementById('quiz-score');
    
    const percentage = (score / quizQuestions.length * 100).toFixed(0);
    let message = '';
    
    if (percentage >= 90) {
        message = 'Outstanding! You have an excellent grasp of HELM\'s holistic evaluation framework.';
    } else if (percentage >= 70) {
        message = 'Well done! You understand the key concepts of multi-metric evaluation.';
    } else if (percentage >= 50) {
        message = 'Good effort! Review the lesson to strengthen your understanding of HELM\'s three pillars and findings.';
    } else {
        message = 'Keep learning! HELM\'s multi-metric approach is complex—review the scenarios and metrics sections.';
    }
    
    scoreDiv.innerHTML = `
        <div style="font-size: 2em; margin-bottom: 10px;">${score} / ${quizQuestions.length}</div>
        <div style="font-size: 1.2em; margin-bottom: 10px;">${percentage}%</div>
        <div>${message}</div>
    `;
    
    summaryDiv.style.display = 'block';
    summaryDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Scenario explorer functionality
function updateScenario() {
    const select = document.getElementById('scenarioSelect');
    const display = document.getElementById('scenario-display');
    const scenarioIndex = parseInt(select.value);
    const scenario = scenarios[scenarioIndex];

    let exampleHtml = '';
    if (scenario.example.question) {
        exampleHtml = `
            <div class="sample-question">
                <h4>Example</h4>
                ${scenario.example.context ? `<p><strong>Context:</strong> ${scenario.example.context}</p>` : ''}
                <p class="question-text"><strong>Question:</strong> ${scenario.example.question}</p>
                <div class="answer"><strong>Answer:</strong> ${scenario.example.answer}</div>
            </div>
        `;
    } else if (scenario.example.query) {
        exampleHtml = `
            <div class="sample-question">
                <h4>Example</h4>
                <p class="question-text"><strong>Query:</strong> ${scenario.example.query}</p>
                <p><strong>Task:</strong> ${scenario.example.task}</p>
                <p><em>Model must rank ${scenario.example.passages.length} passages by relevance...</em></p>
            </div>
        `;
    } else if (scenario.example.article) {
        exampleHtml = `
            <div class="sample-question">
                <h4>Example</h4>
                <p><strong>Article:</strong> ${scenario.example.article}</p>
                <div class="answer"><strong>Summary:</strong> ${scenario.example.summary}</div>
            </div>
        `;
    } else if (scenario.example.review) {
        exampleHtml = `
            <div class="sample-question">
                <h4>Example</h4>
                <p class="question-text">${scenario.example.review}</p>
                <div class="answer"><strong>Sentiment:</strong> ${scenario.example.sentiment}</div>
            </div>
        `;
    } else if (scenario.example.comment) {
        exampleHtml = `
            <div class="sample-question">
                <h4>Example</h4>
                <p class="question-text"><strong>Comment:</strong> "${scenario.example.comment}"</p>
                <div class="answer">${scenario.example.label}</div>
            </div>
        `;
    } else if (scenario.example.task) {
        exampleHtml = `
            <div class="sample-question">
                <h4>Example</h4>
                <p><strong>Task:</strong> ${scenario.example.task}</p>
                <p class="question-text">${scenario.example.query}</p>
                <div class="answer"><strong>Label:</strong> ${scenario.example.label}</div>
            </div>
        `;
    }

    display.innerHTML = `
        <div class="sample-question">
            <h3>${scenario.name}</h3>
            <p><strong>Task:</strong> ${scenario.task}</p>
            <p><strong>Domain:</strong> ${scenario.domain}</p>
            <p>${scenario.description}</p>
            <p><strong>Metrics Measured:</strong></p>
            <ul>
                ${scenario.metrics.map(m => `<li>${m}</li>`).join('')}
            </ul>
        </div>
        ${exampleHtml}
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadQuiz();
    updateScenario();
});
