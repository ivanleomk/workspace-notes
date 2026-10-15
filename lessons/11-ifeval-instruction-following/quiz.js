// Quiz questions for IFEval lesson
const quizQuestions = [
    {
        question: "What is the main innovation of IFEval compared to LLM-as-a-judge evaluation methods?",
        options: [
            "It uses human annotators instead of AI judges",
            "It focuses on verifiable instructions that can be checked programmatically without a judge model",
            "It evaluates models on more diverse tasks",
            "It uses a more powerful judge model (GPT-4) for evaluation"
        ],
        correct: 1,
        explanation: "IFEval's key innovation is focusing on 'verifiable instructions'—constraints that can be checked objectively using deterministic programs (e.g., word counts, keyword presence, format validation) without any judge model. This eliminates judge biases, is faster and cheaper, and provides perfectly reproducible results. Unlike MT-Bench or AlpacaEval which require LLM judges, IFEval needs only simple rule-based verification."
    },
    {
        question: "How many types of verifiable instructions does IFEval identify, and how many prompts does the dataset contain?",
        options: [
            "25 types, 541 prompts",
            "50 types, 1000 prompts",
            "15 types, 250 prompts",
            "25 types, around 500 prompts"
        ],
        correct: 0,
        explanation: "IFEval identifies exactly 25 types of verifiable instructions organized into 5 categories (Keywords, Language, Length Constraints, Detectable Content, Detectable Format). The dataset contains 541 prompts total, with each prompt containing one to three verifiable instructions. The abstract says 'around 500 prompts' as an approximation, but the paper specifies 541 in Section 1."
    },
    {
        question: "What is the difference between prompt-level and instruction-level accuracy?",
        options: [
            "Prompt-level counts entire prompts where all instructions are followed; instruction-level counts individual instructions followed across all prompts",
            "Prompt-level is stricter; instruction-level is more lenient",
            "They are the same metric reported differently",
            "Prompt-level measures quality; instruction-level measures compliance"
        ],
        correct: 0,
        explanation: "Prompt-level accuracy measures the percentage of prompts where ALL verifiable instructions in the prompt are followed (e.g., if a prompt has 3 instructions, you must follow all 3). Instruction-level accuracy measures the percentage of individual instructions that are followed across the entire dataset. Instruction-level accuracy is always ≥ prompt-level because partial compliance (following 2 out of 3 instructions) contributes to instruction-level but fails prompt-level. GPT-4: 76.89% prompt-level, 83.57% instruction-level (strict)."
    },
    {
        question: "What is the purpose of the 'loose' accuracy metric in IFEval?",
        options: [
            "To make the benchmark easier so more models can pass",
            "To reduce false negatives by applying common transformations (removing markdown, punctuation) before verification",
            "To accept responses that partially follow instructions",
            "To allow human judgment for edge cases"
        ],
        correct: 1,
        explanation: "The loose metric addresses false negatives—valid responses that fail strict verification due to formatting variations. For example, 'P.S. **I like cake**' (with markdown bold) should satisfy 'end with P.S. I like cake' but fails exact string matching. Loose accuracy applies transformations like removing markdown, stripping punctuation, and lowercasing before checking. This reduces false negatives but may introduce some false positives. The gap between strict and loose reveals how much formatting vs genuine non-compliance causes failures."
    },
    {
        question: "What were GPT-4's scores on IFEval (November 2023)?",
        options: [
            "Prompt-level strict: 76.89%, Instruction-level strict: 83.57%",
            "Prompt-level strict: 85%, Instruction-level strict: 90%",
            "Prompt-level strict: 65%, Instruction-level strict: 72%",
            "Prompt-level strict: 79.30%, Instruction-level strict: 85.37%"
        ],
        correct: 0,
        explanation: "From Table 3 in the paper: GPT-4 achieved 76.89% prompt-level strict accuracy and 83.57% instruction-level strict accuracy. With loose metrics: 79.30% prompt-level and 85.37% instruction-level. This means GPT-4 fails to follow at least one instruction in roughly 23% of prompts, and about 16% of individual instructions are violated. Even frontier models struggle with precise constraint-following."
    },
    {
        question: "Which instruction category is hardest for models according to IFEval results?",
        options: [
            "Keywords (include/exclude specific words)",
            "Language (respond in a specific language)",
            "Detectable Format (JSON, bullets, titles, structure)",
            "Length Constraints (word/sentence/paragraph counts)"
        ],
        correct: 2,
        explanation: "Figure 2 in the paper shows instruction-level strict accuracy by category. Detectable Format is the hardest category for both GPT-4 (~75-80%) and PaLM 2 S (~40-50%). Format constraints like JSON structure, exact bullet counts, and specific markdown patterns require precise structural compliance—transformers struggle with this. Language is easiest (~95% for GPT-4, ~80% for PaLM 2 S) since models trained on multilingual data can switch languages readily. Keywords and length constraints fall in between."
    },
    {
        question: "How does IFEval relate to Tülu 3's RLVR stage (from Lesson 10)?",
        options: [
            "IFEval was not used in Tülu 3",
            "IFEval provides verifiable constraints that RLVR can use as binary rewards for RL training",
            "RLVR replaced IFEval with a better benchmark",
            "Tülu 3 only used IFEval for initial evaluation, not for training"
        ],
        correct: 1,
        explanation: "IFEval is exactly the type of benchmark RLVR (Reinforcement Learning with Verifiable Rewards) targets. Tülu 3's RLVR stage used IFEval as one of its tasks: each IFEval instruction can be verified deterministically (pass/fail), providing a binary 0/1 reward signal for RL without a learned reward model. Table 5 in the Tülu 3 paper shows IFEval performance improved from 82.6% (DPO) to 83.2% (RLVR) for the 70B model. This demonstrates the same verifiable-reward principle as GRPO (Lesson 06) applied to instruction-following."
    },
    {
        question: "What is a key limitation of IFEval?",
        options: [
            "It's too expensive to run at scale",
            "It requires human judges for every evaluation",
            "It only covers verifiable instructions and cannot assess response quality, helpfulness, or creativity",
            "The verification code is not publicly available"
        ],
        correct: 2,
        explanation: "IFEval's scope is deliberately limited to verifiable constraints. It cannot measure response quality, helpfulness, coherence, creativity, or other subjective aspects that require human or LLM judgment. A response can satisfy all IFEval constraints but be unhelpful, poorly written, or factually wrong. IFEval tells you if a response is *compliant*, not if it's *good*. This is why it complements rather than replaces subjective evaluations like MT-Bench. The paper explicitly acknowledges this limitation in Section 4."
    },
    {
        question: "Why can't standard transformers count words or letters precisely?",
        options: [
            "They are trained on text, not numbers",
            "Transformers generate text autoregressively without explicit self-verification or counting mechanisms",
            "The tokenization process makes counting impossible",
            "Models are not trained on instruction-following data"
        ],
        correct: 1,
        explanation: "Transformers generate text autoregressively (token by token, left to right) based on learned probability distributions. They don't have built-in mechanisms to 'count' tokens or verify constraints as they generate. To write exactly 450 words, a model would need to track word count during generation and stop precisely at 450—but standard decoding doesn't support this. Models approximate through learned patterns (e.g., knowing '450 words is about 3 paragraphs') but lack exact counting. Future architectures might integrate verifiers into the generation loop, but current models struggle with precise numerical constraints."
    },
    {
        question: "How does IFEval complement MT-Bench (Lesson 05) in evaluating instruction-following?",
        options: [
            "They measure the same thing, so you only need one",
            "IFEval measures precision in following constraints; MT-Bench measures quality and helpfulness—both are needed",
            "IFEval is better because it doesn't need a judge",
            "MT-Bench is obsolete now that IFEval exists"
        ],
        correct: 1,
        explanation: "IFEval and MT-Bench are complementary, not competing. IFEval measures *precision*: can the model follow exact constraints (word counts, formats, keywords)? MT-Bench measures *quality*: is the response helpful, coherent, and appropriate for multi-turn conversation? A model could score high on MT-Bench (helpful, fluent) but low on IFEval (doesn't follow constraints), or vice versa (follows rules but generates stilted text). Ideal models excel at both: producing high-quality responses that also satisfy specified constraints. The paper explicitly notes IFEval is 'complementary' to subjective evaluations."
    }
];

// Quiz logic
let currentQuestion = 0;
let score = 0;
let answeredQuestions = new Set();

function loadQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';
    
    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.id = `question-${index}`;
        
        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = `${index + 1}. ${q.question}`;
        questionDiv.appendChild(questionText);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';
        
        q.options.forEach((option, optIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = option;
            optionDiv.onclick = () => selectAnswer(index, optIndex);
            optionsDiv.appendChild(optionDiv);
        });
        
        questionDiv.appendChild(optionsDiv);
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'feedback';
        feedbackDiv.id = `feedback-${index}`;
        questionDiv.appendChild(feedbackDiv);
        
        container.appendChild(questionDiv);
    });
}

function selectAnswer(questionIndex, selectedOption) {
    if (answeredQuestions.has(questionIndex)) return;
    
    const question = quizQuestions[questionIndex];
    const isCorrect = selectedOption === question.correct;
    
    if (isCorrect) score++;
    answeredQuestions.add(questionIndex);
    
    const questionDiv = document.getElementById(`question-${questionIndex}`);
    const options = questionDiv.querySelectorAll('.option');
    
    options.forEach((option, index) => {
        option.style.pointerEvents = 'none';
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedOption && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    const feedback = document.getElementById(`feedback-${questionIndex}`);
    feedback.style.display = 'block';
    feedback.innerHTML = `
        <div class="feedback-${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </div>
        <div class="explanation">${question.explanation}</div>
    `;
    
    if (answeredQuestions.size === quizQuestions.length) {
        showQuizSummary();
    }
}

function showQuizSummary() {
    const summary = document.getElementById('quiz-summary');
    const scoreDiv = document.getElementById('quiz-score');
    
    const percentage = (score / quizQuestions.length * 100).toFixed(1);
    let message = '';
    
    if (percentage >= 90) {
        message = 'Outstanding! You have an excellent understanding of IFEval.';
    } else if (percentage >= 70) {
        message = 'Great work! You understand the key concepts of verifiable instruction-following.';
    } else if (percentage >= 50) {
        message = 'Good effort! Review the explanations to strengthen your understanding.';
    } else {
        message = 'Keep learning! Review the lesson content and try again.';
    }
    
    scoreDiv.innerHTML = `
        <p class="score-text">You scored ${score} out of ${quizQuestions.length} (${percentage}%)</p>
        <p>${message}</p>
    `;
    
    summary.style.display = 'block';
    summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Load quiz when page loads
document.addEventListener('DOMContentLoaded', loadQuiz);
