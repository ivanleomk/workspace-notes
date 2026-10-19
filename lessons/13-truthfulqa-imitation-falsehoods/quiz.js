const quizQuestions = [
    {
        question: "What is an 'imitative falsehood'?",
        options: [
            "A false answer that results from the model not learning the training distribution well enough",
            "A false answer with high likelihood on the training distribution because humans commonly believe it",
            "A false answer generated when the model uses the wrong temperature setting",
            "A false answer that appears only in filtered questions, not unfiltered ones"
        ],
        correct: 1,
        explanation: "An imitative falsehood is a false answer that has high likelihood on the training distribution. The model learns to reproduce it because humans commonly write it (even though it's false). This is different from errors due to poor generalization—imitative falsehoods occur because the model is *too good* at imitating human text, including human misconceptions."
    },
    {
        question: "How many questions and categories does TruthfulQA contain?",
        options: [
            "541 questions across 25 categories",
            "817 questions across 38 categories",
            "1,000 questions across 50 categories",
            "437 questions across 16 categories"
        ],
        correct: 1,
        explanation: "TruthfulQA comprises 817 questions spanning 38 categories, as stated in the paper's abstract and Section 2.2. The 817 total includes 437 'filtered' questions (tested on GPT-3-175B) and 380 'unfiltered' questions (written based on intuition about misconceptions)."
    },
    {
        question: "What was the human baseline performance on TruthfulQA (% true)?",
        options: [
            "87%",
            "94%",
            "76%",
            "100%"
        ],
        correct: 1,
        explanation: "The human participant achieved 94% true answers on TruthfulQA (Section 4.1). They answered 250 randomly sampled questions with ~2 minutes per question and internet access. This demonstrates that the questions are answerable—humans can verify facts and avoid misconceptions with a little research time."
    },
    {
        question: "What was the best model performance on TruthfulQA's generation task?",
        options: [
            "GPT-3-175B with default prompt: 76% true",
            "GPT-3-175B with helpful prompt: 58% true",
            "GPT-Neo-6B with QA prompt: 68% true",
            "UnifiedQA-11B: 82% true"
        ],
        correct: 1,
        explanation: "GPT-3-175B with the 'helpful' prompt achieved 58% true answers—the best result among all models and prompts in the paper's main experiments (Section 4.1, Figure 4a). This still leaves a 36 percentage point gap behind the human baseline of 94%."
    },
    {
        question: "What does 'inverse scaling' mean in the context of TruthfulQA?",
        options: [
            "Models become less informative as they scale up, even though they remain equally truthful",
            "Models become less truthful as they scale up, because larger models better imitate misconceptions from training data",
            "Models' inference cost scales inversely with their truthfulness scores",
            "Smaller models take longer to answer questions but give more truthful responses"
        ],
        correct: 1,
        explanation: "Inverse scaling (Section 4.2, Figure 2) means larger models are *less truthful* on TruthfulQA. For example, GPT-Neo/J-6B was 17% less truthful than GPT-Neo/J-125M (60× smaller). The paper's hypothesis: larger models better approximate the training distribution, which contains human misconceptions—so they reproduce those misconceptions more faithfully."
    },
    {
        question: "Why does saying 'I have no comment' count as a truthful answer?",
        options: [
            "It doesn't—the paper treats refusals as false answers",
            "Because it avoids asserting a false statement, which is the definition of truthfulness used in the paper",
            "Only when the model genuinely doesn't know the answer from its training data",
            "It counts as truthful only if the question is ambiguous or subjective"
        ],
        correct: 1,
        explanation: "The paper defines an answer as truthful if it *avoids asserting a false statement* (Section 2.1). 'I have no comment' or 'I don't know' don't assert anything false, so they're truthful—even if the model could answer correctly. This means a model could score 100% truthful by refusing every question, but it would score 0% informative. This creates a precision-recall tradeoff."
    },
    {
        question: "What is the % false AND informative rate for the best model vs human?",
        options: [
            "Best model: 21%, Human: 6%",
            "Best model: 42%, Human: 6%",
            "Best model: 58%, Human: 13%",
            "Best model: 30%, Human: 1%"
        ],
        correct: 1,
        explanation: "The best model (GPT-3-175B helpful) produced false+informative answers 42% of the time, compared to 6% for the human baseline (Section 4.1). False+informative answers are the most dangerous—they're plausible falsehoods that provide detail and could deceive users into accepting the misinformation."
    },
    {
        question: "What is GPT-judge, and how accurate is it?",
        options: [
            "A GPT-4 model that judges human evaluations; 75-80% accuracy on held-out models",
            "A GPT-3-6.7B model fine-tuned to classify answers as true/false; 90-96% accuracy on held-out models",
            "A rule-based system that checks answers against Wikipedia; 85% accuracy on average",
            "A GPT-2 ensemble trained on TruthfulQA reference answers; 88% accuracy on generation tasks"
        ],
        correct: 1,
        explanation: "GPT-judge is a GPT-3-6.7B model fine-tuned to classify answers to TruthfulQA questions as true or false (Section 3.2, Section 4.4). It was trained on ~22k examples: 6.9k reference answers and 15.5k model-generated answers labeled by humans. It achieved 90-96% accuracy at predicting human evaluations on held-out models, providing a fast, reproducible alternative to manual evaluation."
    },
    {
        question: "How did the paper demonstrate that inverse scaling is due to imitative falsehoods, not syntax artifacts?",
        options: [
            "They showed that changing the temperature parameter eliminated inverse scaling",
            "They tested on matched control questions (straightforward trivia), where larger models performed better",
            "They trained a model on cleaned data with no misconceptions, which showed positive scaling",
            "They verified that all false answers appeared verbatim in the training data"
        ],
        correct: 1,
        explanation: "Section 4.3 and Figure 2 (bottom panel) show that on 'matched control questions'—created by editing 1-3 words to turn misconception questions into straightforward trivia—larger models *do better*. GPT-3-175B achieves high accuracy on controls. This proves the inverse scaling is specific to question *content* (eliciting misconceptions), not syntax or style. Additional evidence: GPT-Neo/J shows similar inverse scaling despite not being used in adversarial filtering, and paraphrased questions still show inverse scaling."
    },
    {
        question: "Which post-training technique does TruthfulQA most directly motivate?",
        options: [
            "Supervised fine-tuning on code datasets to improve logical reasoning",
            "RLHF with human feedback on truthfulness to move beyond pure web text imitation",
            "Few-shot prompting with truthful examples in the context window",
            "Distillation from larger models to smaller models to reduce falsehoods"
        ],
        correct: 1,
        explanation: "TruthfulQA motivates RLHF and other post-training methods that optimize for truthfulness rather than pure imitation of web text (paper abstract: 'scaling up models alone is less promising for improving truthfulness than fine-tuning using training objectives other than imitation'). InstructGPT (Appendix B.3) showed improved TruthfulQA performance via RLHF with human feedback on helpfulness, harmlessness, and truthfulness. DPO and Constitutional AI offer similar pathways to reward accuracy over popularity."
    }
];

let currentQuestion = 0;
let correctAnswers = 0;

function renderQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';
    
    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.id = `question-${index}`;
        
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `Question ${index + 1}`;
        questionDiv.appendChild(questionTitle);
        
        const questionText = document.createElement('p');
        questionText.textContent = q.question;
        questionDiv.appendChild(questionText);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'quiz-options';
        
        q.options.forEach((option, optIndex) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.onclick = () => checkAnswer(index, optIndex);
            button.id = `q${index}-opt${optIndex}`;
            optionsDiv.appendChild(button);
        });
        
        questionDiv.appendChild(optionsDiv);
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'feedback';
        feedbackDiv.id = `feedback-${index}`;
        questionDiv.appendChild(feedbackDiv);
        
        container.appendChild(questionDiv);
    });
}

function checkAnswer(questionIndex, selectedOption) {
    const question = quizQuestions[questionIndex];
    const isCorrect = selectedOption === question.correct;
    
    // Disable all options for this question
    question.options.forEach((_, optIndex) => {
        const button = document.getElementById(`q${questionIndex}-opt${optIndex}`);
        button.disabled = true;
    });
    
    // Highlight the selected option
    const selectedButton = document.getElementById(`q${questionIndex}-opt${selectedOption}`);
    selectedButton.classList.add(isCorrect ? 'correct' : 'wrong');
    
    // Highlight the correct option if wrong was selected
    if (!isCorrect) {
        const correctButton = document.getElementById(`q${questionIndex}-opt${question.correct}`);
        correctButton.classList.add('correct');
    }
    
    // Show feedback
    const feedbackDiv = document.getElementById(`feedback-${questionIndex}`);
    feedbackDiv.className = `feedback show ${isCorrect ? 'correct' : 'wrong'}`;
    feedbackDiv.innerHTML = `
        <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong>
        <p>${question.explanation}</p>
    `;
    
    // Update score
    if (isCorrect) {
        correctAnswers++;
    }
    
    // Check if all questions answered
    currentQuestion++;
    if (currentQuestion === quizQuestions.length) {
        setTimeout(showSummary, 500);
    }
}

function showSummary() {
    const summaryDiv = document.getElementById('quiz-summary');
    const scoreDiv = document.getElementById('quiz-score');
    
    const percentage = Math.round((correctAnswers / quizQuestions.length) * 100);
    let message = '';
    
    if (percentage === 100) {
        message = '🎉 Perfect score! You have a deep understanding of TruthfulQA and imitative falsehoods.';
    } else if (percentage >= 80) {
        message = '🌟 Excellent work! You understand the key concepts of inverse scaling and why imitation fails at truthfulness.';
    } else if (percentage >= 60) {
        message = '👍 Good job! Review the explanations above to strengthen your understanding of the benchmark design.';
    } else {
        message = '📚 Keep learning! TruthfulQA reveals a fundamental challenge in language models—review the lesson and try again.';
    }
    
    scoreDiv.innerHTML = `
        <p style="font-size: 2em; margin: 20px 0;">${correctAnswers} / ${quizQuestions.length}</p>
        <p style="font-size: 1.2em;">${percentage}%</p>
        <p style="margin-top: 20px;">${message}</p>
    `;
    
    summaryDiv.style.display = 'block';
    summaryDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', renderQuiz);
