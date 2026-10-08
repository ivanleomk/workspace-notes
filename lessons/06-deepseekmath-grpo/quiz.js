// Interactive Quiz Logic for Lesson 06: DeepSeekMath & GRPO

document.addEventListener('DOMContentLoaded', function() {
    const quizQuestions = document.querySelectorAll('.quiz-question');
    const resetButton = document.getElementById('reset-quiz');
    const scoreDisplay = document.querySelector('.quiz-score');
    
    let answeredQuestions = new Set();
    let correctAnswers = 0;

    // Feedback messages for each question
    const feedbackMessages = {
        1: {
            correct: "Correct! GRPO's main innovation is dropping the value network (critic) from PPO and using group-relative advantages instead. This reduces complexity, memory footprint, and training instability while achieving comparable performance.",
            wrong: "Not quite. GRPO's key difference is that it eliminates the value network (critic) that PPO requires. Instead of learning a value function to estimate advantages, GRPO uses the mean reward of a group of sampled responses as the baseline."
        },
        2: {
            correct: "Exactly! GRPO computes the mean reward across G sampled responses (e.g., G=8) and uses this as the baseline. The advantage of each response is then its reward minus this group mean. This approach avoids the need to train a separate value network.",
            wrong: "Incorrect. GRPO doesn't use a learned value network. It samples a group of responses (typically 8), computes their mean reward, and uses that as the baseline for advantage calculation: A = r - mean(group rewards)."
        },
        3: {
            correct: "Correct! The paper found G=8 to be optimal, balancing variance reduction with computational efficiency. Smaller groups (G=1-4) have higher variance; larger groups (G>16) provide diminishing returns while increasing compute cost linearly.",
            wrong: "Not quite. The paper found G=8 to be the sweet spot. With G=1, there's no variance reduction (equivalent to REINFORCE without baseline). Larger groups provide diminishing returns. G=8 balances baseline quality with computational efficiency."
        },
        4: {
            correct: "Exactly! A verifiable reward is a rule-based function that programmatically checks whether the model's final answer is mathematically correct. No learned reward model or human judgment needed—just extract the answer and compare to ground truth. This works for any task with objective correctness.",
            wrong: "Incorrect. Verifiable rewards are rule-based checks of objective correctness (e.g., 'Is the final answer to 2+2 equal to 4?'). They don't require training a reward model or human labeling—you can programmatically verify the answer."
        },
        5: {
            correct: "Correct! Outcome supervision rewards only whether the final answer is correct, requiring just the ground truth answer. Process supervision rewards each step of the reasoning chain, requiring full step-by-step annotations. DeepSeekMath uses outcome supervision for simplicity and scalability.",
            wrong: "Not quite. Outcome supervision checks only the final answer (simpler, needs just ground truth). Process supervision rewards intermediate reasoning steps (requires step-by-step annotations, provides denser signal). Both have trade-offs in complexity vs signal quality."
        },
        6: {
            correct: "Correct! RL with GRPO improved DeepSeekMath from 46.8% (SFT only) to 51.7% on MATH, a gain of +4.9 percentage points. This shows that RL enables generalization beyond what SFT can achieve through imitation alone.",
            wrong: "Incorrect. GRPO provided a significant +4.9 percentage point improvement on MATH (46.8% → 51.7%). This gain came from RL's ability to explore and discover solutions, not just mimic training examples like SFT does."
        },
        7: {
            correct: "Exactly! DeepSeekMath applied aggressive decontamination: they extracted all 8+ token substrings from MATH and GSM8K test sets, then removed any pre-training documents containing matches. This ensures benchmark scores reflect true reasoning ability, not memorization.",
            wrong: "Incorrect. The paper describes careful contamination filtering: they removed any pre-training documents containing 8+ token matches with benchmark test sets. This prevents the model from memorizing answers and ensures legitimate evaluation."
        },
        8: {
            correct: "Correct! A positive advantage A > 0 means this response's reward is above the group average. GRPO will reinforce (increase probability of) this response. Negative advantages indicate below-average responses that get suppressed.",
            wrong: "Not quite. A positive advantage means the response performed better than the average of the sampled group. It's relative to the group baseline (mean reward), not an absolute threshold. This relative comparison is what makes GRPO work without a learned value function."
        },
        9: {
            correct: "Exactly! GRPO requires only the policy network (no critic), cutting memory usage in half. The paper reports GRPO trains 1.4× faster than PPO while achieving comparable accuracy on MATH and GSM8K. This efficiency comes from eliminating the critic training overhead.",
            wrong: "Incorrect. GRPO is more efficient because it doesn't need a value network (critic). This cuts memory usage in half and speeds up training by ~1.4× compared to PPO, while achieving similar performance."
        },
        10: {
            correct: "Correct! Use GRPO when you have verifiable, objective rewards (like math correctness, code passing tests). Use DPO when you have pairwise preference data (like human rankings or LLM judge comparisons). The structure of your feedback signal determines the best algorithm.",
            wrong: "Not quite. GRPO is designed for tasks with verifiable rewards—objective correctness that can be checked programmatically. DPO works with preference data (chosen vs rejected pairs). They're complementary techniques for different types of feedback signals."
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

                feedback.innerHTML = `
                    <div class="feedback-content ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}">
                        <strong>${isCorrect ? '✓ Correct!' : '✗ Not quite.'}</strong>
                        <p>${feedbackMessages[questionNum][isCorrect ? 'correct' : 'wrong']}</p>
                    </div>
                `;

                updateScore();
            });
        });
    });

    // Update score display
    function updateScore() {
        const totalQuestions = quizQuestions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        if (answeredQuestions.size === totalQuestions) {
            let message = '';
            if (percentage >= 90) {
                message = `Outstanding! ${correctAnswers}/${totalQuestions} correct (${percentage}%). You have a strong grasp of GRPO and verifiable rewards!`;
            } else if (percentage >= 70) {
                message = `Great work! ${correctAnswers}/${totalQuestions} correct (${percentage}%). You understand the core concepts of GRPO well.`;
            } else if (percentage >= 50) {
                message = `Good effort! ${correctAnswers}/${totalQuestions} correct (${percentage}%). Review the lesson to strengthen your understanding of GRPO vs PPO.`;
            } else {
                message = `${correctAnswers}/${totalQuestions} correct (${percentage}%). Take another look at the lesson—GRPO's advantages and verifiable rewards are key concepts!`;
            }
            scoreDisplay.innerHTML = message;
        } else {
            scoreDisplay.innerHTML = `Progress: ${answeredQuestions.size}/${totalQuestions} questions answered`;
        }
    }

    // Reset quiz
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

            feedback.innerHTML = '';
        });

        scoreDisplay.innerHTML = '';
    });
});
