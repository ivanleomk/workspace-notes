// Quiz functionality for GSM8K lesson
const quizData = {
    1: {
        correct: "GSM8K tests multi-step reasoning while MMLU tests factual knowledge",
        feedback: {
            correct: "✓ Exactly! MMLU focuses on knowledge recall across 57 subjects ('What is the capital of...', 'Which theorem states...'). GSM8K tests multi-step reasoning: breaking down word problems, performing intermediate calculations, and maintaining logical coherence. Both are important, but they measure different capabilities.",
            wrong: "✗ The key difference is what they measure. MMLU tests broad factual knowledge (history, science, law, etc.). GSM8K tests reasoning—the ability to decompose problems, track intermediate steps, and arrive at numeric answers. This is why models might excel at MMLU but struggle with GSM8K, or vice versa."
        }
    },
    2: {
        correct: "To enable automatic grading by marking the final numeric answer",
        feedback: {
            correct: "✓ Correct! The #### marker separates the reasoning steps (which can be in natural language) from the final answer (which must be a number). This makes grading automatic: extract the number after ####, compare it to the ground truth. No need for fuzzy string matching or human evaluation.",
            wrong: "✗ The #### marker serves a practical purpose: automatic grading. Solutions can be written in natural language with varied phrasing, but the final answer after #### must be a number. This lets us compare model outputs to ground-truth answers without ambiguity—it's either right or wrong."
        }
    },
    3: {
        correct: "A model that scores candidate solutions to rank them by correctness",
        feedback: {
            correct: "✓ Right! A verifier is trained to evaluate solutions, not generate them. Given (problem, candidate_solution), it outputs a probability that the solution is correct. At test time, you generate many solutions and use the verifier to pick the best one. This exploits the fact that verification is often easier than generation.",
            wrong: "✗ A verifier doesn't generate solutions—it evaluates them. It's trained on (problem, solution, correct/incorrect) triples and learns to score solutions. This is similar to reward models in RLHF, which also score outputs. The key insight: judging correctness is easier than producing correct answers from scratch."
        }
    },
    4: {
        correct: "The model generates N solutions, the verifier ranks them, and the top-ranked one is returned",
        feedback: {
            correct: "✓ Exactly! Best-of-N sampling works by generating many diverse attempts (e.g., N=100), scoring each with the verifier, and returning the highest-scoring one. This approach scales with compute: more samples = higher chance of finding a correct solution. The verifier filters the noise.",
            wrong: "✗ Best-of-N means generate multiple candidates and pick the best. The generator creates N solutions (sampling with temperature for diversity), the verifier scores each one, and the top-scoring solution is returned. This exploits the verification-generation gap: it's easier to evaluate many attempts than to produce one perfect answer."
        }
    },
    5: {
        correct: "The 6B verifier matched or slightly exceeded the 175B generator's performance",
        feedback: {
            correct: "✓ Correct! This was the paper's key result: a 6B model with a verifier + best-of-100 sampling reached 55.0% on GSM8K, matching the 175B fine-tuned generator's 55.1%. This shows that verifiers with compute-time scaling (more samples) can match or exceed much larger models that generate directly.",
            wrong: "✗ The surprising result: the 6B verifier (with best-of-100) matched the 175B generator (55.0% vs 55.1%). And the 175B verifier reached 71.5%, far exceeding the 175B generator. This demonstrates that verification + sampling scales better than pure generation, even with smaller models."
        }
    },
    6: {
        correct: "MATH requires high-school competition-level knowledge while GSM8K uses grade-school arithmetic",
        feedback: {
            correct: "✓ Exactly! GSM8K is designed for grade-school level (ages 8-12): basic arithmetic, no algebra or geometry. MATH includes competition-level problems: calculus, number theory, advanced algebra. That's why models saturate GSM8K (~95%) but still struggle with MATH (~70% for top models). Difficulty calibration matters.",
            wrong: "✗ The difficulty gap is by design. GSM8K uses only basic arithmetic—addition, subtraction, multiplication, division—solvable by grade-school students. MATH requires advanced techniques: polynomial factorization, trigonometry, proof by induction. This is why MATH remains challenging even as GSM8K approaches saturation."
        }
    },
    7: {
        correct: "Prompting the model to show intermediate reasoning steps before the final answer",
        feedback: {
            correct: "✓ Right! Chain-of-thought (CoT) prompting means asking the model to 'think step by step' or providing examples with intermediate reasoning. This dramatically improves performance on reasoning tasks like GSM8K because it forces the model to decompose problems rather than jumping directly to an answer.",
            wrong: "✗ CoT is a prompting technique, not a training method. You either include CoT examples in the prompt ('Let's think step by step...') or show few-shot examples with reasoning chains. This encourages models to show their work, which improves both accuracy and interpretability. It's now standard practice for math benchmarks."
        }
    },
    8: {
        correct: "The model shows a significant performance drop on GSM1k (a clean variant) compared to GSM8K",
        feedback: {
            correct: "✓ Correct! If a model scores 90% on GSM8K but 75% on GSM1k (newly written problems in the same style), that 15-point drop suggests contamination. The model memorized patterns or answers from the original GSM8K, rather than learning genuine reasoning. Clean variants like GSM1k help detect this.",
            wrong: "✗ Contamination means the model saw test data during training. A telltale sign: performance drops on clean variants (like GSM1k) that didn't exist during training. If a model performs equally on both, it's reasoning genuinely. But a large gap suggests memorization. Training after 2021 doesn't automatically mean contamination—it depends on the training corpus."
        }
    },
    9: {
        correct: "Both learn to score outputs, verifiers for correctness and reward models for preference/alignment",
        feedback: {
            correct: "✓ Exactly! Verifiers and reward models share the same core idea: it's easier to evaluate than to generate. Verifiers score math solutions for correctness. Reward models score language model outputs for helpfulness, safety, and alignment. Both enable techniques like best-of-N sampling and reinforcement learning.",
            wrong: "✗ Verifiers and reward models are closely related. Both learn to score outputs: verifiers check correctness (right/wrong answer), reward models check preference (helpful/harmful, aligned/misaligned). This insight powers best-of-N, rejection sampling, and RLHF—you'll see reward models in detail in Track B lessons."
        }
    },
    10: {
        correct: "Most competitive models score above 90%, making it less useful for differentiating capabilities",
        feedback: {
            correct: "✓ Right! When a benchmark saturates, it stops being useful for comparing state-of-the-art models. If GPT-4, Claude, Gemini all score 94-96% on GSM8K, you can't tell which is better at reasoning. That's why we need harder benchmarks like MATH, AIME, and frontier reasoning tasks.",
            wrong: "✗ Saturation means the benchmark's ceiling is reached. GSM8K was challenging in 2021 (GPT-3 scored 55%), but by 2024 most competitive models exceed 90%. This doesn't mean contamination—it means genuine progress. But it does mean we need new, harder benchmarks to push models further."
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
            message += "Perfect! You have excellent understanding of GSM8K and reasoning benchmarks.";
        } else if (percentage >= 80) {
            message += "Great job! You understand the key concepts well.";
        } else if (percentage >= 60) {
            message += "Good progress! Review the feedback to deepen your understanding.";
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
