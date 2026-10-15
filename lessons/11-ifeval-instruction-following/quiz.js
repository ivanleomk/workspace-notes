// Interactive Quiz Logic for Lesson 11: IFEval & Instruction Following

document.addEventListener('DOMContentLoaded', function() {
    const quizQuestions = document.querySelectorAll('.quiz-question');
    const resetButton = document.getElementById('reset-quiz');
    const scoreDisplay = document.querySelector('.quiz-score');
    
    let answeredQuestions = new Set();
    let correctAnswers = 0;

    // Feedback messages for each question
    const feedbackMessages = {
        1: {
            correct: "Correct! IFEval tests verifiable instruction-following using constraints like 'write in all caps', 'use exactly 200 words', or 'include keyword X at least 3 times'. These can be programmatically verified without human judgment, making evaluation objective and scalable.",
            wrong: "Not quite. IFEval focuses on verifiable constraints—instructions that can be checked programmatically (like word count, formatting, keywords). This differs from subjective quality judgments that need human evaluation or LLM-as-judge approaches."
        },
        2: {
            correct: "Exactly! Figure 2 shows 9 instruction categories: change_case, combination, detectable_content, detectable_format, keywords, language, length_constraint, punctuation, and startend. Each tests a different dimension of instruction-following ability.",
            wrong: "Incorrect. IFEval evaluates 9 categories of instructions (Figure 2): change_case, combination, detectable_content, detectable_format, keywords, language, length_constraint, punctuation, and startend. Each category has different difficulty characteristics."
        },
        3: {
            correct: "Correct! Both models achieve ~96% accuracy on language instructions (Figure 2), making it the only category where they tie. This suggests that multilingual capabilities are well-developed in modern LLMs, at least for common languages.",
            wrong: "Not quite. According to Figure 2, 'language' is the easiest category—both GPT-4 and PaLM 2 S achieve ~96% accuracy. This indicates that responding in specific languages (French, Spanish, etc.) is well-handled by both models."
        },
        4: {
            correct: "Exactly! 'combination' is the hardest category for both models: GPT-4 gets ~73% and PaLM 2 S gets ~37% (Figure 2). Satisfying multiple constraints simultaneously (e.g., word count + keywords + format) proves much harder than individual constraints.",
            wrong: "Incorrect. The hardest category is 'combination' (satisfying multiple constraints at once). GPT-4 achieves ~73% and PaLM 2 S ~37% (Figure 2). This is significantly lower than other categories because models must correctly satisfy all constraints simultaneously."
        },
        5: {
            correct: "Correct! Table 3 shows GPT-4 achieves 76.89% prompt-level strict and 79.10% prompt-level loose accuracy. The ~2.2 point gap means loose verification (allowing minor deviations like off-by-one word counts) increases the pass rate by about 2.2%.",
            wrong: "Not quite. The strict vs loose gap for GPT-4 is small (~2.2 points for prompt-level, Table 3). Loose verification means accepting near-misses (e.g., 201 words instead of 200). The small gap suggests GPT-4 usually gets constraints exactly right or misses them entirely."
        },
        6: {
            correct: "Exactly! PaLM 2 S has a much larger gap: 43.07% strict → 46.95% loose at prompt-level (Table 3). This ~3.9 point difference suggests PaLM 2 S makes more 'near miss' errors—getting close but not exactly satisfying constraints.",
            wrong: "Incorrect. PaLM 2 S has a larger strict-loose gap than GPT-4 (Table 3): ~3.9 points vs ~2.2 points at the prompt level. This indicates PaLM 2 S makes more near-miss errors—attempts that are close but don't exactly meet the requirements."
        },
        7: {
            correct: "Correct! 'startend' shows a 48-point gap: GPT-4 at ~93% vs PaLM 2 S at ~45% (Figure 2). This is the largest performance difference across all categories, suggesting GPT-4 is much better at precisely controlling response beginnings and endings.",
            wrong: "Not quite. 'startend' has the biggest gap (Figure 2): GPT-4 ~93%, PaLM 2 S ~45%—a 48-point difference. This category requires starting and ending with specific words/phrases, and GPT-4 significantly outperforms PaLM 2 S on this precise control task."
        },
        8: {
            correct: "Exactly! Instruction-level scoring checks if each individual instruction is followed (stricter). Prompt-level scoring checks if ALL instructions in a prompt are followed together. Table 3 shows GPT-4's instruction-level strict (83.57%) is higher than prompt-level strict (76.89%).",
            wrong: "Incorrect. Instruction-level checks each constraint individually, while prompt-level requires ALL constraints to pass. Table 3 shows instruction-level scores are typically higher because if even one instruction fails, the entire prompt fails in prompt-level scoring."
        },
        9: {
            correct: "Correct! Verifiable instruction-following connects to Lesson 06 (verifiable math rewards for GRPO) and Lesson 07 (unit tests for code). All three use objective, programmatic verification instead of learned reward models or human/LLM judges, enabling more reliable training signals.",
            wrong: "Not quite. Verifiable constraints (like unit tests for code, answer-checking for math, and IFEval's instruction checks) provide objective, programmatic verification. This is more reliable than subjective judgments and enables techniques like RLVR (Lesson 10) and GRPO (Lesson 06)."
        },
        10: {
            correct: "Exactly! While GPT-4 dominates on most categories, PaLM 2 S shows competitive performance on 'language' (~96% both) and decent results on 'detectable_content' (~73% vs ~96%). The model struggles most with 'combination', 'length_constraint', and precise control tasks like 'startend'.",
            wrong: "Incorrect. PaLM 2 S's performance is very uneven (Figure 2). It matches GPT-4 on 'language' (~96%) and does okay on 'detectable_content' (~73%), but struggles with 'combination' (~37%), 'length_constraint' (~40%), and 'startend' (~45%)—precise control tasks."
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

    // Reset quiz functionality
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

            scoreDisplay.classList.remove('show');
            scoreDisplay.textContent = 'Score: 0/10 (0%)';
        });
    }
});
