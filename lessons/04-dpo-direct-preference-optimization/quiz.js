// Quiz functionality for Lesson 04: DPO
const quizData = {
    1: {
        correct: "DPO eliminates the reward model and RL complexity, optimizing preferences directly with supervised learning",
        feedback: {
            correct: "✓ Exactly! DPO's main innovation is removing the need for both the reward model (Stage 2) and PPO training (Stage 3) from RLHF. Instead of learning a reward function and then optimizing it with RL, DPO derives a closed-form expression that lets you optimize preferences directly using standard supervised learning. This makes training simpler, more stable, and faster while achieving comparable or better performance.",
            wrong: "✗ DPO uses the same model size and preference data as RLHF, and it still requires a reference model. The key advantage is that it skips the reward model and PPO entirely. By reparameterizing the RLHF objective in terms of policy log-probability ratios, DPO converts a complex two-stage RL problem (train reward model, then run PPO) into a single-stage supervised learning problem. This eliminates reward model errors, PPO instabilities, and most of the hyperparameter tuning."
        }
    },
    2: {
        correct: "Deriving the optimal policy in closed form and reparameterizing reward in terms of policy probabilities",
        feedback: {
            correct: "✓ Correct! The key mathematical insight is that the RLHF objective (maximize reward minus KL penalty) has a closed-form optimal policy. By solving for this optimal policy and then rearranging the equation, you can express the reward function purely in terms of policy log-probability ratios. This reparameterization means you never need to learn a separate reward model—you can optimize preferences directly by teaching the policy to assign higher probabilities to chosen responses.",
            wrong: "✗ DPO doesn't use a different RL algorithm or avoid RL by switching to demonstrations—it avoids RL entirely. The breakthrough is mathematical: deriving the optimal policy under the RLHF objective and realizing you can reparameterize reward as β log(π_θ/π_ref). This transforms the RLHF problem from 'train reward model, then optimize it with RL' into 'optimize preference likelihood directly with supervised learning.' It's the same optimization problem, but solved in a completely different (simpler) way."
        }
    },
    3: {
        correct: "β log(π_θ(y|x) / π_ref(y|x)) – the scaled log-probability ratio",
        feedback: {
            correct: "✓ Right! The implicit reward in DPO is r(x, y) = β log(π_θ(y|x) / π_ref(y|x)). Even though DPO never trains an explicit reward model, the policy learns an implicit notion of reward through its probability assignments. If π_θ assigns much higher probability to response y than π_ref does, that response has high implicit reward. If it assigns lower probability, that response has low implicit reward. The β parameter scales this reward.",
            wrong: "✗ The implicit reward isn't the loss value or KL divergence—it's the scaled log-ratio of policy probabilities. This comes directly from the reparameterization of the RLHF optimal policy equation. When you solve for r(x, y) in terms of the policy, you get r(x, y) = β log(π*/π_ref) + constant. DPO treats the current policy π_θ as an approximation to π*, so the implicit reward is β log(π_θ/π_ref). This lets you extract a 'reward function' from the policy itself."
        }
    },
    4: {
        correct: "More aggressive optimization—higher KL divergence, policy drifts further from reference",
        feedback: {
            correct: "✓ Exactly! Smaller β means the policy is allowed to drift further from the reference model to maximize preferences. In the optimal policy formula π* ∝ π_ref exp(r/β), a smaller β means the exponential term exp(r/β) varies more dramatically with reward—high-reward responses get massively upweighted. This leads to aggressive optimization: the policy focuses heavily on preferred responses, accepting higher KL divergence. Use smaller β when you have clean preference data and want strong alignment.",
            wrong: "✗ Smaller β actually means MORE aggressive optimization, not less. Think of β as a temperature-like parameter: smaller β → sharper policy → more focused on high-reward responses → higher KL divergence. Larger β → softer policy → stays closer to reference → lower KL. The β parameter trades off between preference fitting (how well you match human preferences) and KL regularization (how close you stay to the reference model). Smaller β prioritizes fitting; larger β prioritizes staying close."
        }
    },
    5: {
        correct: "The SFT model (frozen) used as a starting point to compute log-probability ratios",
        feedback: {
            correct: "✓ Correct! The reference model π_ref is typically the SFT model—the instruction-tuned model you get after Stage 1 of the RLHF pipeline. During DPO training, π_ref is frozen (no gradient updates). It serves two purposes: (1) it provides a baseline to compute log-probability ratios against, and (2) it acts as a KL anchor, preventing the policy from drifting into nonsensical or adversarial territory. You need to keep π_ref in memory during training, which doubles memory usage compared to standard fine-tuning.",
            wrong: "✗ The reference model isn't a reward model, a random model, or the base model. It's the SFT model, frozen at the start of DPO training. Every time you compute the DPO loss, you evaluate both π_θ (the policy being trained) and π_ref (the frozen SFT model) on the same responses to get log-probability ratios. The reference model is crucial—without it, you'd have no KL regularization, and the policy could drift arbitrarily far from coherent language."
        }
    },
    6: {
        correct: "The negative log-likelihood of observed preferences under the Bradley-Terry model",
        feedback: {
            correct: "✓ Right! The DPO loss is -log σ(β·(log(π_θ(y_w)/π_ref(y_w)) - log(π_θ(y_l)/π_ref(y_l)))). This is the negative log-likelihood of observing the preference y_w ≻ y_l under the Bradley-Terry preference model, where preference probability is σ(r(y_w) - r(y_l)). By minimizing this loss, you're maximizing the likelihood that the model's implicit rewards match the observed human preferences. It's standard maximum likelihood estimation, just with a clever parameterization.",
            wrong: "✗ DPO doesn't minimize KL divergence (that's a constraint in the original RLHF objective, not the loss) or MSE on rewards. It's not standard next-token cross-entropy either. The DPO loss is a binary classification loss: predicting which of two responses is preferred. The 'logit' is the implicit reward difference (scaled log-probability ratios), and the label is always 1 (chosen is preferred over rejected). Minimizing this loss teaches the model to assign higher relative probability to chosen responses."
        }
    },
    7: {
        correct: "Examples where the model is more wrong (higher probability of incorrect preference) get larger gradients",
        feedback: {
            correct: "✓ Exactly! The DPO gradient has a weighting term σ(r_implicit(y_l) - r_implicit(y_w))—the probability the model currently assigns to the wrong preference. If the model is confident and correct (r(y_w) ≫ r(y_l)), this term is near 0, so the gradient is small (no update needed). If the model is confident but wrong (r(y_l) > r(y_w)), the term approaches 1, giving a large gradient (aggressively correct the error). This automatic weighting is efficient: training effort focuses on examples the model hasn't learned yet.",
            wrong: "✗ DPO doesn't weight examples equally or by length. The gradient magnitude is proportional to σ(r_l - r_w), the model's current confidence in the wrong answer. This is similar to how reward models in RLHF also weight by model uncertainty (from the Bradley-Terry loss), but DPO does it implicitly in the policy training. Hard examples where the model is confused or wrong get more gradient; easy examples where the model is already correct contribute little. This makes learning efficient."
        }
    },
    8: {
        correct: "Preference pairs: (prompt, chosen response, rejected response)",
        feedback: {
            correct: "✓ Correct! DPO trains on preference pairs (x, y_w, y_l) where x is a prompt, y_w is the chosen/preferred response, and y_l is the rejected/dispreferred response. This is the same format as RLHF reward model training data. You can collect these pairs from human labelers (rank multiple responses), AI feedback (use GPT-4 to pick winners), or existing preference datasets like Anthropic HH-RLHF. The key is pairwise comparisons—DPO optimizes relative preferences, not absolute scores.",
            wrong: "✗ DPO doesn't train on demonstrations alone (that's SFT), scalar reward scores (that's reward model training), or unlabeled prompts (that's unsupervised learning). It requires preference pairs. Each training example teaches the model: 'for this prompt, humans preferred this response over that response.' DPO learns to increase the probability ratio of chosen over rejected responses, which implicitly learns to predict what humans prefer."
        }
    },
    9: {
        correct: "DPO matches or slightly beats PPO while being much simpler to train",
        feedback: {
            correct: "✓ Right! On TL;DR summarization, DPO achieves 58% win rate against PPO and 61% against SFT (GPT-4 as judge). On Anthropic HH dialogue, DPO shows 55-60% win rates over SFT. On controlled sentiment, DPO reaches ~95% of PPO-GT's reward (PPO with ground-truth oracle). The performance is comparable or slightly better than PPO, while DPO training is dramatically simpler: no reward model, no PPO hyperparameters, no RL sampling. DPO has become a preferred method in practice.",
            wrong: "✗ DPO doesn't underperform PPO—it matches or beats it on most benchmarks tested in the paper. It's not limited to sentiment tasks; it works on summarization, dialogue, and general instruction-following. And it's definitely not the same as the SFT baseline—DPO improves significantly over SFT by optimizing preferences. The key result is that simpler training (DPO) delivers the same quality as complex training (RLHF), making DPO the better engineering choice for most applications."
        }
    },
    10: {
        correct: "Stop when preference accuracy on validation data plateaus and KL divergence is reasonable",
        feedback: {
            correct: "✓ Correct! The best stopping criterion for DPO is to monitor validation preference accuracy (% of pairs where r(y_w) > r(y_l)) and KL divergence from the reference model. Stop when accuracy plateaus—further training risks overfitting. If KL divergence grows too large (e.g., >10), the policy is drifting into incoherent territory; stop or reduce β. Unlike RLHF, you don't have a reward model to track, so preference accuracy is your main signal. Typical training runs are 1-3 epochs.",
            wrong: "✗ You can't train until loss is exactly zero (preferences are noisy; perfect fit would overfit), and training for a fixed number of epochs ignores whether the model has converged or is overfitting. You also don't want the policy to match the reference model exactly—that would mean no improvement. The right approach is validation-based early stopping: watch preference accuracy and KL divergence, stop when accuracy peaks and KL is still reasonable. This balances learning from preferences with staying close to coherent language."
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
            option.addEventListener('click', function() {
                if (answeredQuestions.has(questionNum)) {
                    return; // Already answered
                }
                
                const isCorrect = this.dataset.answer === 'correct';
                answeredQuestions.add(questionNum);
                
                // Disable all options for this question
                options.forEach(opt => {
                    opt.disabled = true;
                    if (opt.dataset.answer === 'correct') {
                        opt.classList.add('correct');
                    }
                });
                
                // Show feedback
                if (isCorrect) {
                    correctCount++;
                    this.classList.add('selected-correct');
                    feedback.innerHTML = `<div class="feedback-correct">${quizData[questionNum].feedback.correct}</div>`;
                } else {
                    this.classList.add('selected-wrong');
                    feedback.innerHTML = `<div class="feedback-wrong">${quizData[questionNum].feedback.wrong}</div>`;
                }
                
                feedback.style.display = 'block';
                updateScore();
            });
        });
    });
    
    // Reset button
    const resetButton = document.getElementById('reset-quiz');
    if (resetButton) {
        resetButton.addEventListener('click', resetQuiz);
    }
}

function updateScore() {
    const scoreDisplay = document.querySelector('.quiz-score');
    const totalQuestions = Object.keys(quizData).length;
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${correctCount} / ${answeredQuestions.size} answered (${totalQuestions} total)`;
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
            option.classList.remove('correct', 'selected-correct', 'selected-wrong');
        });
        
        feedback.style.display = 'none';
        feedback.innerHTML = '';
    });
    
    updateScore();
}

// Initialize quiz when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
