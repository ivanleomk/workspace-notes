// Quiz for HellaSwag lesson
const quizQuestions = [
    {
        question: "What is the primary task that HellaSwag evaluates?",
        options: [
            "Sentiment analysis of movie reviews",
            "Commonsense natural language inference through sentence completion",
            "Machine translation between English and other languages",
            "Named entity recognition in video captions"
        ],
        correct: 1,
        explanation: "HellaSwag evaluates commonsense natural language inference (NLI) by asking models to complete sentences with the most plausible continuation. Given a context like 'A woman sits at a piano,' the model must select the most likely followup from multiple choices."
    },
    {
        question: "What is Adversarial Filtering (AF) and why is it important for HellaSwag?",
        options: [
            "A method to remove toxic content from the dataset",
            "A data collection method that uses discriminators to iteratively select challenging machine-generated wrong answers",
            "A technique to filter out examples that are too easy for humans",
            "An algorithm to balance the dataset across different domains"
        ],
        correct: 1,
        explanation: "Adversarial Filtering iteratively trains discriminators on random splits of the data and uses them to select machine-generated endings that are hard to distinguish from human-written ones. This creates a dataset that remains challenging regardless of how the data is split into training and test sets."
    },
    {
        question: "What is the 'Goldilocks zone' in HellaSwag's construction?",
        options: [
            "The optimal number of training examples (around 16k)",
            "A sweet spot of ~3 sentences of context and ~2 generated sentences where generations are nonsensical to humans but hard for models to detect",
            "The target accuracy range of 40-60% for discriminators",
            "The middle difficulty level between easy and hard questions"
        ],
        correct: 1,
        explanation: "The 'Goldilocks zone' refers to the specific complexity level (roughly 3 sentences of context, 2 generated sentences) where machine-generated endings are ridiculous to humans but state-of-the-art discriminators cannot reliably tell them apart from ground truth. This makes the benchmark both human-solvable and machine-challenging."
    },
    {
        question: "How did humans and BERT-Large perform on HellaSwag?",
        options: [
            "Humans: 75%, BERT-Large: 70%",
            "Humans: 88%, BERT-Large: 86%",
            "Humans: 95.6%, BERT-Large: 47.3%",
            "Humans: 99%, BERT-Large: 25%"
        ],
        correct: 2,
        explanation: "Humans achieved 95.6% accuracy on HellaSwag, showing it's easy for people. BERT-Large, the best model at the time, achieved only 47.3% on the test set - far below human performance and just under twice random chance (25%). This massive 48+ point gap demonstrates that commonsense reasoning remained unsolved."
    },
    {
        question: "What motivated the creation of HellaSwag after BERT solved SWAG?",
        options: [
            "SWAG was too small and needed more data",
            "BERT reached 86%+ on SWAG (near human-level), suggesting the dataset had distributional biases that didn't require true commonsense reasoning",
            "SWAG only covered video captions and needed more domains",
            "The research community needed a harder version for competitions"
        ],
        correct: 1,
        explanation: "When BERT reached over 86% on SWAG (approaching the 88% human performance), it raised questions about whether models truly understood commonsense or just learned dataset-specific biases. Experiments showed BERT could achieve 74.8% on SWAG with no context (endings only) and 60.4% with shuffled words, indicating it learned stylistic patterns rather than commonsense reasoning."
    },
    {
        question: "What are the two data sources used in HellaSwag?",
        options: [
            "Wikipedia and Common Crawl",
            "ActivityNet video captions and WikiHow articles",
            "Movie scripts and news articles",
            "Books and web forums"
        ],
        correct: 1,
        explanation: "HellaSwag uses ActivityNet Captions (video descriptions of activities) and WikiHow articles (how-to guides on diverse topics). ActivityNet provides ~25k examples with activity labels, while WikiHow contributes ~45k examples covering topics from 'how to make origami' to 'how to survive a bank robbery.'"
    },
    {
        question: "How does performance differ between in-domain and zero-shot categories?",
        options: [
            "No difference - models perform equally on both",
            "Zero-shot is harder: BERT-Large drops from 50.2% (in-domain) to 43.3% (zero-shot) on validation",
            "Zero-shot is easier because models can use transfer learning",
            "In-domain is harder because training creates overfitting"
        ],
        correct: 1,
        explanation: "Zero-shot categories (novel activities/topics not seen during training) are significantly harder. BERT-Large's validation accuracy drops from 50.2% on in-domain to 43.3% on zero-shot (~7 point drop), while human accuracy remains constant at ~95%. This shows models struggle to generalize their commonsense knowledge to new situations."
    },
    {
        question: "What does the transfer experiment from SWAG to HellaSwag reveal?",
        options: [
            "Models trained on SWAG achieve 86% on HellaSwag, showing strong transfer",
            "Models trained on SWAG achieve only 34.6% on HellaSwag, showing minimal transfer and suggesting SWAG didn't require general commonsense",
            "Transfer is symmetric: both directions achieve ~70%",
            "Transfer fails completely with 25% accuracy (random chance)"
        ],
        correct: 1,
        explanation: "A BERT-Large model trained on SWAG achieves only 34.6% when evaluated on HellaSwag - only ~10 points above random chance and about 12 points below a model trained on HellaSwag (46.4%). This poor transfer suggests that solving SWAG didn't require learning general commonsense reasoning, just dataset-specific patterns."
    }
];

// Initialize quiz
let currentQuestion = 0;
let score = 0;
let answered = Array(quizQuestions.length).fill(false);

function initQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
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
        
        q.options.forEach((option, optionIndex) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.onclick = () => selectAnswer(index, optionIndex);
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

function selectAnswer(questionIndex, answerIndex) {
    if (answered[questionIndex]) return;
    
    const question = quizQuestions[questionIndex];
    const questionDiv = document.getElementById(`question-${questionIndex}`);
    const buttons = questionDiv.querySelectorAll('.quiz-option');
    const feedbackDiv = document.getElementById(`feedback-${questionIndex}`);
    
    answered[questionIndex] = true;
    
    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) {
            button.classList.add('correct');
        } else if (index === answerIndex) {
            button.classList.add('wrong');
        }
    });
    
    if (answerIndex === question.correct) {
        score++;
        feedbackDiv.className = 'feedback correct show';
        feedbackDiv.innerHTML = `<strong>Correct!</strong> ${question.explanation}`;
    } else {
        feedbackDiv.className = 'feedback wrong show';
        feedbackDiv.innerHTML = `<strong>Incorrect.</strong> ${question.explanation}`;
    }
    
    // Check if all questions answered
    if (answered.every(a => a)) {
        showQuizSummary();
    }
}

function showQuizSummary() {
    const summaryDiv = document.getElementById('quiz-summary');
    const scoreDiv = document.getElementById('quiz-score');
    
    const percentage = (score / quizQuestions.length * 100).toFixed(0);
    let message = '';
    
    if (percentage >= 90) {
        message = 'Outstanding! You have an excellent understanding of HellaSwag and adversarial filtering.';
    } else if (percentage >= 70) {
        message = 'Great job! You understand the key concepts of commonsense NLI benchmarks.';
    } else if (percentage >= 50) {
        message = 'Good effort! Review the material to strengthen your understanding of benchmark construction.';
    } else {
        message = 'Keep studying! The concepts of adversarial filtering and benchmark co-evolution take time to master.';
    }
    
    scoreDiv.innerHTML = `
        <p>Your Score: ${score} / ${quizQuestions.length} (${percentage}%)</p>
        <p>${message}</p>
    `;
    
    summaryDiv.style.display = 'block';
    summaryDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initQuiz);
