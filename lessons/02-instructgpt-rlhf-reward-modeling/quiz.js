// Quiz functionality for Lesson 02: InstructGPT & RLHF
const quizData = {
    1: {
        correct: "Preference comparisons (A > B) are cheaper and scale better than writing perfect demonstrations",
        feedback: {
            correct: "✓ Exactly! Comparing two responses ('Which is better?') is faster and easier than writing a perfect response from scratch. Labelers can process more prompts per hour with comparisons, and the preference signal is often clearer than trying to write an ideal demonstration. This scalability advantage is why RLHF became the dominant post-training approach.",
            wrong: "✗ RLHF requires more compute than SFT (you need to train a reward model AND run PPO), but it's more data-efficient in terms of human labor. Writing high-quality demonstrations is slow and expensive—each demo requires careful crafting. Preference labeling (ranking responses) is much faster, letting you collect more feedback per hour. SFT still works, but RLHF scales human feedback better."
        }
    },
    2: {
        correct: "SFT → Reward Model → PPO",
        feedback: {
            correct: "✓ Correct! The pipeline flows logically: (1) SFT teaches basic instruction-following from demonstrations, (2) the reward model learns to score responses based on human preferences, and (3) PPO optimizes the policy to maximize reward. You need SFT first to have a model that generates reasonable outputs for the RM to rank, and you need the RM before you can run RL.",
            wrong: "✗ The correct order is SFT → Reward Model → PPO. SFT comes first to give the model basic instruction-following capability (base models don't follow instructions well). Then you train the RM on preferences, using the SFT model to generate candidate outputs. Finally, PPO uses the RM to optimize the policy. Reversing the order doesn't work—you need each stage's output for the next."
        }
    },
    3: {
        correct: "It predicts human preference scores for (prompt, response) pairs",
        feedback: {
            correct: "✓ Right! The reward model is a learned proxy for human judgment. Given a prompt and a response, it outputs a scalar score predicting how much humans would like that response. During PPO (Stage 3), the language model generates millions of responses—far too many for humans to label—so the RM provides fast, scalable feedback for the RL algorithm.",
            wrong: "✗ The reward model doesn't generate text—that's the policy's job. Instead, the RM acts as a judge: it takes a (prompt, response) pair and outputs a score representing predicted human preference. Think of it as a learned evaluator that approximates 'would humans rate this response highly?' This lets the RL algorithm optimize for human preferences without needing humans to label every single generated response."
        }
    },
    4: {
        correct: "Labelers rank multiple model outputs from best to worst",
        feedback: {
            correct: "✓ Exactly! InstructGPT collects preferences by showing labelers a prompt and several model-generated responses (typically 4-9 outputs), then asking them to rank from best to worst. These rankings are converted into pairwise comparisons (A > B, A > C, etc.), which the reward model is trained on. This ranking format is faster than writing demonstrations and provides richer signal than binary yes/no labels.",
            wrong: "✗ Labelers don't write responses (that's the SFT stage) or provide numeric scores. They rank model outputs. For each prompt, the model generates multiple candidate responses, and labelers order them by quality. These rankings become pairwise preference labels (e.g., 'response A is better than response B'), which train the reward model to predict which outputs humans prefer."
        }
    },
    5: {
        correct: "Labelers preferred InstructGPT 1.3B over GPT-3 175B despite the 100x size difference",
        feedback: {
            correct: "✓ Correct! This is the headline result from the paper: human evaluators preferred the smaller RLHF-trained InstructGPT 1.3B over the much larger base GPT-3 175B model about 85% of the time. This demonstrates that alignment (learning to follow instructions and satisfy user preferences) matters more than raw scale. Bigger isn't always better—training approach matters enormously.",
            wrong: "✗ InstructGPT's most striking result wasn't perfection on benchmarks (it actually regressed slightly on some) or eliminating all failure modes. It was the head-to-head preference win: labelers preferred InstructGPT 1.3B over GPT-3 175B ~85% of the time. A model 100x smaller won because RLHF taught it to be helpful, honest, and harmless—qualities GPT-3 wasn't optimized for."
        }
    },
    6: {
        correct: "When the policy exploits flaws in the reward model to get high scores without being genuinely helpful",
        feedback: {
            correct: "✓ Exactly! Reward hacking (also called 'reward gaming') happens when the policy discovers shortcuts to maximize the reward signal without improving actual quality. For example, the RM might spuriously reward long responses, so the policy learns to pad answers with filler. Or the RM likes certain phrases, so the policy sprinkles them in even when irrelevant. This is why the KL penalty and careful RM design are critical.",
            wrong: "✗ Reward hacking is when the policy exploits weaknesses in the reward model. The RM is an imperfect proxy for human judgment—it was trained on a finite dataset and can make mistakes. During PPO, the policy might discover that certain patterns (e.g., using jargon, being verbose) reliably get high RM scores even when they don't improve helpfulness. The policy optimizes for the proxy metric, not the true goal."
        }
    },
    7: {
        correct: "To prevent the policy from drifting too far from the SFT model and reward hacking",
        feedback: {
            correct: "✓ Right! The KL penalty is a regularization term that keeps the RLHF policy close to the original SFT model. Without it, PPO might push the policy into regions of output space the reward model wasn't trained on, leading to reward hacking or nonsensical outputs. The KL constraint ensures the model stays reasonable while improving—it balances exploration (maximizing reward) with exploitation (staying near a known-good policy).",
            wrong: "✗ The KL penalty's purpose is stability and preventing reward hacking. If you let PPO optimize reward without constraints, the policy can drift into adversarial territory—generating outputs the reward model incorrectly scores highly. The KL term penalizes large divergence from the SFT model, keeping the policy in a 'safe' region. It's a trade-off: less KL penalty means more reward optimization but higher hacking risk; more KL penalty means safer but slower improvement."
        }
    },
    8: {
        correct: "Performance regressions on benchmarks when optimizing for user preferences",
        feedback: {
            correct: "✓ Correct! Alignment tax is the phenomenon where optimizing for helpfulness, safety, and user satisfaction causes the model to perform worse on traditional capability benchmarks like MMLU or SQuAD. This happens because the model learns to prioritize user intent over benchmark-specific formats. For example, it might refuse ambiguous questions or provide conversational explanations instead of terse answers—helpful for users, but penalized by benchmarks.",
            wrong: "✗ Alignment tax isn't about money or compute—it's about capability trade-offs. When you optimize for human preferences (helpfulness, safety), the model sometimes regresses on knowledge or reasoning benchmarks. InstructGPT showed small drops on SQuAD and DROP. Why? Because RLHF prioritizes user satisfaction over maximizing benchmark metrics. The model might refuse unsafe edge cases or format answers differently, which hurts benchmark scores but improves user experience."
        }
    },
    9: {
        correct: "No, SFT provides a better starting point—base models don't follow instructions well enough for RL to work",
        feedback: {
            correct: "✓ Exactly! Base models trained only on web text don't have a strong notion of 'following instructions.' If you run PPO directly on a base model, the reward signal is too sparse—the model generates nonsense, gets low rewards, and struggles to improve. SFT provides crucial initialization: it teaches the model what instruction-following looks like, so PPO has a reasonable starting point. Think of SFT as 'warm-starting' the RL process.",
            wrong: "✗ You can't skip SFT. Base language models complete text; they don't inherently follow instructions. If you try to run PPO directly on GPT-3, the policy will generate mostly irrelevant outputs, the reward model will give uniformly low scores, and learning will be extremely slow or fail entirely. SFT teaches basic instruction-following, giving PPO a much better starting point. The SFT → RM → PPO order is intentional and necessary."
        }
    },
    10: {
        correct: "The model learned general instruction-following, which transfers across languages present in the base model",
        feedback: {
            correct: "✓ Right! InstructGPT's RLHF training was mostly on English, but the base GPT-3 model was pretrained on multilingual data. RLHF taught the model to 'be helpful and follow instructions,' a meta-skill that transfers. When prompted in French or Spanish, the model applies the same instruction-following capability it learned from English examples. The generalization shows that RLHF doesn't just memorize—it teaches transferable alignment.",
            wrong: "✗ The generalization happened because RLHF teaches a general skill (instruction-following) rather than language-specific heuristics. The base model already had multilingual capability from pretraining. RLHF refined how the model uses that knowledge—learning to be helpful, stay on-topic, refuse bad requests. These lessons transfer across languages because they're about intent alignment, not surface-level pattern matching. This is evidence that RLHF captures something fundamental about helpfulness."
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
            message += "Perfect! You have excellent understanding of RLHF and reward modeling.";
        } else if (percentage >= 75) {
            message += "Great job! You understand the core RLHF concepts well.";
        } else if (percentage >= 50) {
            message += "Good start! Review the feedback and lesson content to deepen your understanding.";
        } else {
            message += "Keep learning! RLHF is complex—review the pipeline stages and try again.";
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
