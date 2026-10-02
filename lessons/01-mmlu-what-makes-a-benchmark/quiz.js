// Quiz functionality with detailed feedback
const quizData = {
    1: {
        correct: "To measure broad, multitask understanding rather than narrow expertise",
        feedback: {
            correct: "✓ Exactly! MMLU's 57 subjects test whether a model has general knowledge across many domains, not just mastery of one area. This mimics the broad understanding humans develop and helps identify whether a model truly has 'world knowledge' or just specialized training.",
            wrong: "✗ While having many subjects does make MMLU comprehensive, the primary purpose is to test multitask capability. A model might excel at computer science but fail at moral philosophy—MMLU reveals that breadth of understanding, which a single-domain benchmark would miss."
        }
    },
    2: {
        correct: "It provides context for interpreting model scores and understanding ceiling effects",
        feedback: {
            correct: "✓ Correct! The human baseline (89.8%) gives us a reference point. If models reach 88%, we know they're near human expert level. If they plateau at 60%, there's clearly room for improvement. It also warns us when a benchmark might be getting too easy (when models exceed human performance significantly).",
            wrong: "✗ The human baseline isn't a ceiling—models can and do exceed it on some subjects. Its real value is providing context: is 75% good or bad? Compared to 89.8%, we know there's a meaningful gap. Without that anchor, scores are harder to interpret."
        }
    },
    3: {
        correct: "When test questions appear in model training data, inflating scores unfairly",
        feedback: {
            correct: "✓ Right! If MMLU questions were in a model's training set, the model might memorize answers instead of genuinely understanding concepts. This is a major concern because MMLU questions come from public sources (textbooks, practice exams) that could have been scraped during pretraining. Contamination makes it hard to compare models fairly.",
            wrong: "✗ Contamination specifically means the model saw test data during training. When that happens, evaluation becomes less meaningful—you're testing memorization, not capability. This is why many newer benchmarks use held-out questions that are never published publicly until evaluation time."
        }
    },
    4: {
        correct: "Models might perform well by recognizing patterns without deep understanding",
        feedback: {
            correct: "✓ Exactly! Multiple choice has a 25% random baseline (4 options), and models can sometimes exploit surface patterns—like 'option C sounds most technical' or process of elimination—without truly reasoning about the content. Open-ended generation or explanation requirements can test understanding more deeply, though they're harder to score automatically.",
            wrong: "✗ Multiple choice format makes MMLU easier to evaluate automatically (clear right/wrong answers), but it also allows shortcuts. A model might pick plausible-sounding answers or use heuristics without deep reasoning. Formats requiring explanation or generation can better test true understanding, though they're harder to score objectively."
        }
    },
    5: {
        correct: "Both factual knowledge and some reasoning, but with a bias toward knowledge",
        feedback: {
            correct: "✓ Correct! MMLU includes questions that require reasoning (e.g., physics problems), but the majority test factual recall ('Which of these is the capital of...', 'What year did... occur'). This is valuable for measuring world knowledge, but it means MMLU alone doesn't fully test reasoning ability—you'd want to pair it with math or logic benchmarks.",
            wrong: "✗ While MMLU does include reasoning questions, most questions test factual knowledge and recall. This isn't a flaw—knowledge is important!—but it means MMLU tells you more about what a model knows than how well it reasons through novel problems. That's why evaluation suites include multiple complementary benchmarks."
        }
    },
    6: {
        correct: "To measure if post-training improves task performance or causes capability regressions",
        feedback: {
            correct: "✓ Exactly! Post-training (SFT, RLHF) aims to make models more helpful and safe, but we want to ensure it doesn't degrade core capabilities. Running MMLU before and after lets us detect 'alignment tax'—cases where making a model more conversational hurts its factual knowledge. Ideally, MMLU stays stable or improves while chat quality increases.",
            wrong: "✗ We eval at multiple stages to track capability changes. Base models have raw knowledge from pretraining. After SFT (supervised fine-tuning on instructions), we check if the model maintained that knowledge while learning to follow instructions. After RLHF, we verify reward optimization didn't cause regressions. MMLU helps us catch unintended capability loss."
        }
    },
    7: {
        correct: "Per-subject performance variation (e.g., 90% on STEM, 60% on humanities)",
        feedback: {
            correct: "✓ Right! A 75% average might hide huge variation: the model could excel at math/science (subjects with clear right answers) but struggle with philosophy or history. Looking at per-subject scores reveals strengths and weaknesses that the overall number obscures. This is why good papers report category-level breakdowns, not just the single aggregate.",
            wrong: "✗ The single number averages across all 57 subjects, which hides important variation. A model might dominate STEM topics but struggle with humanities, or vice versa. Digging into per-subject or per-category performance (STEM, social sciences, humanities, other) gives a much more honest picture of where the model truly excels and where it needs work."
        }
    },
    8: {
        correct: "MMLU and user preference capture different capabilities; MMLU doesn't measure helpfulness/safety",
        feedback: {
            correct: "✓ Exactly! MMLU tests factual knowledge. Chat benchmarks (like MT-Bench or chatbot arena) test helpfulness, instruction-following, safety, and user satisfaction. RLHF primarily optimizes for preference—teaching the model to refuse harmful requests, format answers nicely, be helpful—not raw knowledge. That's why it's common for MMLU to stay flat while chat scores improve. Both matter!",
            wrong: "✗ Different benchmarks measure different things. MMLU focuses on knowledge and factual correctness. RLHF optimizes for user preferences—helpfulness, safety, refusal behavior, tone. A model can maintain its knowledge (MMLU unchanged) while becoming much better at conversational tasks (chat benchmarks improve). This is why post-training evaluations use multiple benchmarks to get the full picture."
        }
    },
    9: {
        correct: "Search training data for exact n-gram matches of test questions",
        feedback: {
            correct: "✓ Correct! N-gram overlap is one of the most practical contamination detection methods. You extract unique substrings (e.g., 10-20 consecutive words) from test questions and search for them in the training corpus. If you find exact or near-exact matches, those questions were likely in training data. This is fast and scalable, though it can miss paraphrased questions.",
            wrong: "✗ N-gram overlap detection involves extracting unique substrings from test questions and searching for them in training data. This catches exact or near-exact matches. Other methods like loss comparison and guided completion are also valuable, but n-gram search is the most commonly reported technique because it's fast and scales to large corpora."
        }
    },
    10: {
        correct: "The model might have memorized the question during training, not reasoned through it",
        feedback: {
            correct: "✓ Exactly right! Guided completion is a clever contamination test: give the model a partial question and see if it 'autocompletes' the exact test format. If the model generates the multiple-choice options and answer without being prompted, it likely saw that question during training. This tests for memorization directly, without needing access to the training corpus.",
            wrong: "✗ Guided completion tests for contamination. If you give a model the first half of a test question and it generates the exact answer choices and correct label, that's evidence of memorization—the question (or a close variant) was probably in training data. This is different from the model reasoning through the problem, which would require the full question and thoughtful inference."
        }
    },
    11: {
        correct: "Compare model loss on test questions vs. a clean held-out control set",
        feedback: {
            correct: "✓ Correct! Membership inference style checks compare loss (or perplexity) distributions. If test questions have suspiciously low loss compared to a held-out control set, they may have been memorized during training. This technique can catch contamination even when questions are paraphrased, since memorization shows up as unusually confident predictions.",
            wrong: "✗ Loss-based contamination detection works by comparing model loss on test data vs. clean control data. If test examples have significantly lower loss (the model is 'too confident'), that suggests memorization. This method doesn't require training corpus access and can detect paraphrased contamination, though it requires careful control set selection to avoid false positives."
        }
    }
};

let answeredQuestions = new Set();
let correctCount = 0;

function initQuiz() {
    const questions = document.querySelectorAll('.quiz-question');
    
    questions.forEach(question => {
        const questionNum = question.dataset.question;
        const options = question.querySelectorAll('.quiz-option');
        const feedback = question.querySelector('.feedback');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                if (answeredQuestions.has(questionNum)) return;
                
                const isCorrect = option.dataset.answer === 'correct';
                const data = quizData[questionNum];
                
                // Mark answer
                options.forEach(opt => {
                    opt.disabled = true;
                    if (opt.dataset.answer === 'correct') {
                        opt.classList.add('correct');
                    }
                });
                
                if (isCorrect) {
                    correctCount++;
                    feedback.className = 'feedback correct show';
                    feedback.textContent = data.feedback.correct;
                } else {
                    option.classList.add('wrong');
                    feedback.className = 'feedback wrong show';
                    feedback.textContent = data.feedback.wrong;
                }
                
                answeredQuestions.add(questionNum);
                updateScore();
            });
        });
    });
    
    document.getElementById('reset-quiz').addEventListener('click', resetQuiz);
}

function updateScore() {
    const total = Object.keys(quizData).length;
    const scoreDisplay = document.querySelector('.quiz-score');
    
    if (answeredQuestions.size === total) {
        const percentage = Math.round((correctCount / total) * 100);
        let message = `You scored ${correctCount}/${total} (${percentage}%)! `;
        
        if (percentage === 100) {
            message += "Perfect! You have excellent understanding of MMLU and benchmarking concepts.";
        } else if (percentage >= 75) {
            message += "Great job! You understand the key concepts well.";
        } else if (percentage >= 50) {
            message += "Good start! Review the feedback and try again to deepen your understanding.";
        } else {
            message += "Keep learning! Review the lesson content and feedback carefully.";
        }
        
        scoreDisplay.textContent = message;
    } else if (answeredQuestions.size > 0) {
        scoreDisplay.textContent = `Progress: ${answeredQuestions.size}/${total} questions answered`;
    }
}

function resetQuiz() {
    answeredQuestions.clear();
    correctCount = 0;
    
    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach(question => {
        const options = question.querySelectorAll('.quiz-option');
        const feedback = question.querySelector('.feedback');
        
        options.forEach(option => {
            option.disabled = false;
            option.classList.remove('correct', 'wrong');
        });
        
        feedback.className = 'feedback';
        feedback.textContent = '';
    });
    
    document.querySelector('.quiz-score').textContent = '';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initQuiz);
