// Interactive Quiz Logic for Lesson 07: HumanEval & Code Evaluation

document.addEventListener('DOMContentLoaded', function() {
    const quizQuestions = document.querySelectorAll('.quiz-question');
    const resetButton = document.getElementById('reset-quiz');
    const scoreDisplay = document.querySelector('.quiz-score');
    
    let answeredQuestions = new Set();
    let correctAnswers = 0;

    // Feedback messages for each question
    const feedbackMessages = {
        1: {
            correct: "Correct! Functional correctness checks if code passes unit tests, capturing whether the program actually works. Match-based metrics like BLEU only measure text similarity to a reference solution, missing the vast space of functionally equivalent programs. The paper emphasizes this is how human developers judge code.",
            wrong: "Not quite. Match-based metrics (like BLEU or exact match) only compare text similarity to a reference solution. Functional correctness evaluates whether code passes unit tests—actually testing if it works correctly. This matters because many different programs can solve the same problem correctly."
        },
        2: {
            correct: "Exactly! HumanEval contains 164 hand-written programming problems. Each includes a function signature, docstring, body, and unit tests (averaging 7.7 tests per problem). Hand-written problems are crucial to avoid contamination from GitHub training data.",
            wrong: "Incorrect. HumanEval has 164 hand-written problems, with an average of 7.7 unit tests per problem. The problems were hand-written specifically to avoid solutions being present in the GitHub training data that Codex was trained on."
        },
        3: {
            correct: "Correct! Pass@k measures: if you generate k code samples per problem, what fraction of problems have at least one correct solution? It's an unbiased estimator that generates n≥k samples and counts how many are correct. This captures the practical workflow of sampling multiple solutions.",
            wrong: "Not quite. Pass@k doesn't average accuracy across samples. It measures the probability that at least one of k samples is correct. The paper uses an unbiased estimator: generate n≥k samples, count c correct ones, and calculate 1 - C(n-c,k)/C(n,k)."
        },
        4: {
            correct: "Exactly! According to Table 1 in the paper, Codex-12B achieves 28.81% pass@1 (single sample) and 72.31% pass@100 (best of 100 samples). This dramatic improvement shows that generating and evaluating multiple samples is a highly effective strategy.",
            wrong: "Incorrect. Codex-12B achieves 28.81% pass@1 and 72.31% pass@100 (from Table 1). The large gap between pass@1 and pass@100 demonstrates the power of generating multiple diverse samples and selecting one that works."
        },
        5: {
            correct: "Correct! Hand-written problems ensure the benchmark isn't contaminated by training data. Since Codex was trained on a large fraction of public GitHub code, using problems from existing sources (like Codeforces) would be unfair—the model may have seen solutions during training.",
            wrong: "Not quite. Hand-written problems are essential to avoid contamination. The paper notes that GitHub contains solutions to problems from many sources (10+ Codeforces repos). Using existing problems would mean the model might have memorized solutions rather than learning to reason."
        },
        6: {
            correct: "Exactly! Higher temperatures are optimal for larger k because they increase sample diversity. At pass@100, you want varied attempts (T*=0.8), while at pass@1 you want the single most likely solution (T*=0.2). The paper's Figure 5 illustrates this temperature-k relationship.",
            wrong: "Incorrect. The optimal temperature increases with k. For pass@1, T*=0.2 (focused, high-probability sample). For pass@100, T*=0.8 (diverse samples to explore solution space). Higher diversity helps when you're selecting the best from many attempts."
        },
        7: {
            correct: "Correct! GPT-J-6B achieves 11.62% pass@1, between Codex-85M and Codex-300M in performance. GPT-Neo 2.7B gets 6.41% pass@1. Both were trained on The Pile (8% GitHub code). Codex-12B, fine-tuned on pure GitHub code, achieves 28.81%—a massive advantage from domain-specific training.",
            wrong: "Not quite. GPT-J-6B achieves 11.62% pass@1 (Table 1), much better than GPT-3's near-0% but far below Codex-12B's 28.81%. The key difference: GPT-J saw some code in The Pile (8%), but Codex was specifically fine-tuned on 159 GB of GitHub Python code."
        },
        8: {
            correct: "Exactly! Codex-S is fine-tuned on standalone, correctly-implemented functions from competitive programming sites and open-source projects with CI. This supervised fine-tuning improves pass@1 from 28.8% to 37.7% and pass@100 from ~72% to 77.5% by adapting to the task distribution.",
            wrong: "Incorrect. Codex-S (Section 4) is Codex further fine-tuned on curated programming problems with verified correct solutions. This additional supervised fine-tuning on high-quality standalone functions improves HumanEval performance by adapting the model closer to the benchmark's task format."
        },
        9: {
            correct: "Correct! The paper's Figure 11 shows exponential performance decay as docstring complexity grows. With each additional chained operation, pass rate drops by ~2-3×. This is very different from human programmers, who can handle arbitrary-length instruction chains if they understand each component.",
            wrong: "Not quite. The paper demonstrates (Figure 11, Section 6) that Codex's performance drops exponentially with longer operation chains—each additional component roughly halves or thirds the pass rate. This reveals a fundamental limitation in following multi-step specifications."
        },
        10: {
            correct: "Exactly! Verifiable rewards (unit tests for code, answer-checking for math) enable more reliable training signals than learned reward models or human preferences. This connects HumanEval to Lesson 06 (GRPO uses verifiable math rewards) and contrasts with Lesson 05 (LLM-as-judge for subjective quality).",
            wrong: "Incorrect. Unit tests provide verifiable, objective rewards—you can programmatically check if code is correct. This is more reliable than learned reward models (Lesson 02 RLHF) or LLM judges (Lesson 05). It's the same principle as GRPO's verifiable math rewards (Lesson 06)."
        }
    };

    // Handle answer selection
    quizQuestions.forEach((question, index) => {
        const options = question.querySelectorAll('.quiz-option');
        const feedback = question.querySelector('.feedback');
        const questionNum = parseInt(question.dataset.question);

        options.forEach(option => {
            option.addEventListener('click', function() {
                if (answeredQuestions.has(questionNum)) {
                    return;
                }

                const isCorrect = this.dataset.answer === 'correct';
                
                options.forEach(opt => {
                    opt.disabled = true;
                    if (opt.dataset.answer === 'correct') {
                        opt.classList.add('correct');
                    }
                });

                this.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');

                answeredQuestions.add(questionNum);
                if (isCorrect) {
                    correctAnswers++;
                }

                const message = isCorrect ? 
                    feedbackMessages[questionNum].correct : 
                    feedbackMessages[questionNum].wrong;
                
                feedback.textContent = message;
                feedback.classList.add('show', isCorrect ? 'correct' : 'wrong');

                updateScore();
            });
        });
    });

    function updateScore() {
        const total = quizQuestions.length;
        const percentage = Math.round((correctAnswers / total) * 100);
        scoreDisplay.textContent = `Score: ${correctAnswers}/${total} (${percentage}%)`;
        scoreDisplay.classList.add('show');
    }

    // Reset quiz
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            answeredQuestions.clear();
            correctAnswers = 0;

            quizQuestions.forEach(question => {
                const options = question.querySelectorAll('.quiz-option');
                const feedback = question.querySelector('.feedback');

                options.forEach(opt => {
                    opt.disabled = false;
                    opt.classList.remove('correct', 'selected-correct', 'selected-wrong');
                });

                feedback.classList.remove('show', 'correct', 'wrong');
                feedback.textContent = '';
            });

            scoreDisplay.textContent = '';
            scoreDisplay.classList.remove('show');
        });
    }
});
