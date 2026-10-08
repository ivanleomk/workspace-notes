// Quiz functionality for Lesson 05: LLM-as-a-Judge & MT-Bench
const quizData = {
    1: {
        correct: "LLM judges are scalable, fast, and cheap while achieving ~80% agreement with humans",
        feedback: {
            correct: "✓ Exactly! LLM judges like GPT-4 achieve ~80% agreement with human annotators on pairwise comparisons—close to human-human agreement (~81%). This makes them practical for rapid model evaluation. Human evaluation costs $10-50 per comparison and takes days; GPT-4 evaluation costs pennies and takes seconds. For continuous model development where you need to evaluate dozens of checkpoints, LLM judges are the only scalable solution.",
            wrong: "✗ LLM judges aren't always more accurate than humans (80% agreement means 20% disagreement), and they do have biases (position, verbosity, self-enhancement). They're best for objective tasks like math (~90% agreement) and weaker for subjective creative tasks (~75%). The key advantage is scalability: they approximate human judgment well enough to be useful, at a fraction of the cost and time. This makes rapid iteration possible during model development."
        }
    },
    2: {
        correct: "80 multi-turn questions (2 turns each) across 8 categories, judged by GPT-4 on 1-10 scale",
        feedback: {
            correct: "✓ Right! MT-Bench has 80 carefully curated questions spanning 8 categories: writing, roleplay, reasoning, math, coding, extraction, STEM, and humanities (10 questions per category). Each question has two turns—the second turn builds on the first, testing whether the model maintains context. GPT-4 judges each turn on a 1-10 scale, considering helpfulness, accuracy, and appropriateness. The final score is the average across all 160 turns (80 × 2). This multi-turn, multi-category design captures conversational quality better than single-turn benchmarks like MMLU.",
            wrong: "✗ MT-Bench isn't multiple choice (that's MMLU), coding-only (that's HumanEval), or pure math (that's MATH/GSM8K). It's designed to test open-ended conversation quality across diverse domains. The multi-turn structure is critical: Turn 1 might be 'Write a poem about sunset,' Turn 2 'Now rewrite in Shakespeare's style.' This tests instruction-following, context retention, and adaptation—skills that multiple-choice benchmarks can't measure. MT-Bench was specifically designed to fill the gap that MMLU/GSM8K leave."
        }
    },
    3: {
        correct: "Users chat with two anonymous models side-by-side and vote; votes are converted to Elo ratings",
        feedback: {
            correct: "✓ Exactly! Chatbot Arena presents users with two models (identities hidden) responding to the same prompt. Users vote for which is better or declare a tie. Model identities are revealed only after voting, preventing brand bias. These votes are aggregated into Elo ratings using the Bradley-Terry model: winners gain Elo points, losers lose points. After thousands of comparisons, the ratings converge to reflect true model strength. Arena has collected 70,000+ votes and provides a continuously updated leaderboard based on real user preferences—not researcher-designed prompts.",
            wrong: "✗ Arena isn't researcher-curated (that's MT-Bench), GPT-4 automated (that would defeat the purpose of collecting human preferences), or coding-focused. The key innovation is crowdsourced evaluation on users' own prompts—whatever they naturally want to ask. This captures real-world use cases that benchmarks miss. The side-by-side anonymous comparison is critical for fairness: no brand bias, just head-to-head quality comparison. Arena validates that GPT-4 judges track real human preferences at scale (correlation ρ = 0.93 between Arena Elo and MT-Bench)."
        }
    },
    4: {
        correct: "Pairwise comparison (\"Which is better, A or B?\")",
        feedback: {
            correct: "✓ Correct! Pairwise comparison achieves ~80% agreement with human judges—the highest of all modes. It's reliable because it forces a direct choice between two concrete options, mirroring how humans naturally compare things. Single-answer grading (1-10 scale) has lower agreement (~70-75%) because absolute scales are subjective—one person's 7/10 is another's 8/10. Reference-guided grading works well for factual tasks but isn't universal. Pairwise comparison is the default choice for open-ended evaluation, which is why both MT-Bench and Chatbot Arena use it extensively.",
            wrong: "✗ Single-answer grading is less reliable because judges (both human and LLM) are inconsistent with absolute scores. GPT-4 tends to give inflated scores (mean ~7/10), compressing the scale. Reference-guided is great for math/coding but requires ground truth, so it doesn't work for creative writing or roleplay. Pairwise comparison is most reliable because: (1) it's a forced choice with clear contrast, (2) it reduces scale calibration issues, and (3) humans are better at relative judgments than absolute scoring. This is why RLHF and DPO both use pairwise preferences."
        }
    },
    5: {
        correct: "The judge prefers whichever response appears first (~60%); mitigate by swapping order and aggregating",
        feedback: {
            correct: "✓ Right! Position bias means GPT-4 prefers the first response in a pair ~60% of the time when both are equal quality. This likely comes from training data patterns where the first option is often correct. The mitigation is straightforward: evaluate both orders (A vs B and B vs A), then aggregate. If both orders agree, high confidence. If they disagree (A>B but B>A), mark as tie or look deeper. This reduces position bias to ~50% (random baseline). It doubles evaluation cost but is essential for fair comparisons.",
            wrong: "✗ Position bias isn't about company brands (that's mitigated by anonymizing models) or conversational position (that's a different issue). It's specifically about the ordering of responses shown to the judge. The bias exists because of training data correlations—early examples in lists are often correct in the pretraining corpus. This isn't unique to LLM judges; humans also show mild position bias (though weaker than LLMs). The swap-and-aggregate solution is simple and effective—it's standard practice in MT-Bench and Arena evaluations."
        }
    },
    6: {
        correct: "Judges prefer longer responses, even when brevity is more appropriate",
        feedback: {
            correct: "✓ Exactly! Verbosity bias means judges (both LLM and human) favor longer responses, even when concise answers are better. Responses 50%+ longer than competitors win ~65% of matchups, regardless of quality. This happens because length correlates with detail, caveats, and apparent effort—signals humans interpret as 'helpful.' LLM judges inherit this from training data. The risk: models can exploit this during RLHF/DPO training, learning to pad responses with filler to maximize judge scores. Mitigation: explicit judge instructions about appropriate detail, length-controlled metrics (AlpacaEval 2.0), or penalizing excessive verbosity.",
            wrong: "✗ Judges don't prefer conciseness (the bias goes the other way), and they can evaluate long responses fine (length doesn't hurt accuracy). Verbosity bias affects both humans and LLMs—humans also prefer longer answers on average, which is where LLMs learned it. The problem is that this bias can be exploited during training: models learn to maximize length rather than quality. AlpacaEval 1.0 suffered from severe length gaming; version 2.0 added length control to fix it. Always monitor response length during RLHF/DPO—if it grows without quality improving, you're reward hacking the judge."
        }
    },
    7: {
        correct: "~80%, which is comparable to human-human agreement (~81%)",
        feedback: {
            correct: "✓ Right! The paper reports that GPT-4 achieves 85% agreement with human judges on pairwise comparisons (Setup S2, excluding ties), which actually exceeds the human-human agreement rate of 81-82%. This validated LLM-as-judge as a practical method: GPT-4's judgments align with the majority of humans as well as humans agree with each other. The paper states this demonstrates 'over 80% agreement, the same level of agreement between humans.'",
            wrong: "✗ GPT-4 isn't near-perfect (95% would require almost superhuman consistency) and it's way better than random (50%). The 65% option would be borderline useful but not compelling. The 80% agreement rate is significant because it matches human-human agreement—this means GPT-4 judgments are about as reliable as hiring a second human annotator. For coarse model ranking, even 70% would be useful. At 80%+, LLM judges enable fine-grained evaluation of model capabilities, which is why they've become standard in RLHF/DPO workflows and leaderboards."
        }
    },
    8: {
        correct: "When judging its own outputs, the model prefers itself ~10 percentage points more than humans do",
        feedback: {
            correct: "✓ Correct! Self-enhancement bias is subtle but real: if humans prefer GPT-4 over Model X 70% of the time, GPT-4 self-judging prefers itself ~80% of the time. This happens because GPT-4 recognizes its own writing style (phrasing patterns, structure, tone) even when responses are anonymized. The mitigation is simple: never use a model to judge itself. Use a separate, stronger judge (e.g., GPT-4 judging GPT-3.5 or Claude) or multiple judges for cross-validation. Self-enhancement isn't catastrophic (10pp gap is manageable) but it introduces systematic bias that accumulates if ignored.",
            wrong: "✗ Self-enhancement isn't 100% self-preference (that would be obvious and catastrophic), it's not about enhancing/improving responses before judging (that's a different process), and it definitely exists (measured at ~10pp in the paper). The bias is subtle because GPT-4 recognizes its own style even with anonymous labels. This is similar to how human writers can often recognize their own work. The practical implication: if you're training a model with RLHF/DPO using GPT-4 as judge, make sure GPT-4 isn't judging its own generations—only use it to judge other models."
        }
    },
    9: {
        correct: "Math, coding, and factual tasks where there's ground truth",
        feedback: {
            correct: "✓ Exactly! Reference-guided grading works best when you have verifiable correct answers. For math: compare model's answer and reasoning to a worked solution. For coding: check if code produces correct output. For extraction: verify extracted entities against gold labels. This approach reduces subjectivity and verbosity bias—the judge focuses on correctness rather than style or length. It's less useful for creative writing or roleplay where there's no single 'right' answer and preferences are subjective. MT-Bench uses reference-guided mode for the math and coding categories, pairwise comparison for writing/roleplay.",
            wrong: "✗ Reference-guided doesn't work well for creative writing because there's no ground truth—one person's 'good poem' is another's 'boring cliché.' It's not universally better than pairwise (pairwise is more reliable for subjective tasks), and it definitely works (it's the gold standard for objective tasks). The key is knowing when to use each mode: pairwise for subjective quality judgments, reference-guided for objective correctness, single-answer grading when you need quick feedback during development. Good evaluation systems use multiple modes depending on the task type."
        }
    },
    10: {
        correct: "Traditional metrics like BLEU/ROUGE are ineffective; GPT-4 achieves ~80-85% agreement with humans",
        feedback: {
            correct: "✓ Correct! The paper explicitly states that traditional similarity-based metrics like BLEU and ROUGE are 'ineffective' for open-ended questions without reference answers (Section 2.1). They were designed for narrow tasks (machine translation, extractive summarization) where surface form matters. They miss semantic quality, helpfulness, and instruction-following—which is what matters for chat models. In contrast, GPT-4 as a judge achieves agreement with human preferences exceeding 80% (reaching 85% in some setups), matching the level of human-human agreement. This makes LLM-as-a-judge a scalable alternative to expensive human evaluation.",
            wrong: "✗ Incorrect. The paper states that BLEU and ROUGE are 'ineffective' for evaluating open-ended questions, not effective. While traditional metrics are deterministic ('objective'), that doesn't make them reliable for chat quality—they measure surface overlap, not semantic quality or helpfulness. GPT-4 achieves over 80% agreement with humans (85% in non-tie setup), making it vastly more suitable than traditional metrics for evaluating instruction-following chat models. The paper does not claim BLEU/ROUGE perform comparably to LLM judges."
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
                    return;
                }
                
                const isCorrect = this.dataset.answer === 'correct';
                answeredQuestions.add(questionNum);
                
                options.forEach(opt => {
                    opt.disabled = true;
                    if (opt.dataset.answer === 'correct') {
                        opt.classList.add('correct');
                    }
                });
                
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
