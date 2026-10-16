// Results explorer data for DeepSeek-R1
const benchmarkCategories = [
    {
        name: "Mathematics",
        description: "Competition-level math problems and reasoning benchmarks where R1 achieves state-of-the-art performance.",
        benchmarks: [
            {
                name: "AIME 2024",
                fullName: "American Invitational Mathematics Examination 2024",
                r1Zero: "77.9% pass@1, 86.7% Cons@16",
                r1Final: "79.8% pass@1",
                humanBaseline: "Average human competitor performance (surpassed by R1)",
                description: "High school mathematics competition with 15 problems requiring integer answers 0-999. Tests multi-step reasoning, algebra, geometry, and number theory.",
                source: "Table 3, Figure 1(a), Section 2.3"
            },
            {
                name: "MATH-500",
                fullName: "Competition Mathematics Problems (500 samples)",
                r1Zero: "95.9%",
                r1Final: "97.3%",
                humanBaseline: "Varies by problem difficulty",
                description: "Subset of the MATH dataset containing competition-level math problems across algebra, geometry, number theory, and calculus. Requires step-by-step solutions.",
                source: "Table 3"
            },
            {
                name: "CNMO 2024",
                fullName: "Chinese National High School Mathematics Olympiad 2024",
                r1Zero: "88.1%",
                r1Final: "78.8%",
                humanBaseline: "Top Chinese high school students",
                description: "National-level mathematics olympiad in China. Note: R1-Zero outperforms R1 final, likely due to language consistency reward affecting Chinese math performance.",
                source: "Table 3"
            },
            {
                name: "GPQA Diamond",
                fullName: "Graduate-Level Google-Proof Q&A (Diamond subset)",
                r1Zero: "75.8%",
                r1Final: "71.5%",
                humanBaseline: "Ph.D.-level experts with web access (still outperform R1)",
                description: "Graduate-level biology, physics, and chemistry questions designed to be Google-proof. Human experts retain advantage on this benchmark.",
                source: "Table 3, Figure 10"
            }
        ]
    },
    {
        name: "Coding",
        description: "Programming challenges from competitive coding to software engineering, where R1 rivals or surpasses human programmers.",
        benchmarks: [
            {
                name: "Codeforces",
                fullName: "Codeforces Competitive Programming",
                r1Zero: "80.4 percentile, 1444 rating",
                r1Final: "96.3 percentile, 2029 rating",
                humanBaseline: "R1 outperforms 96.3% of all human competitors",
                description: "International competitive programming platform. R1's 2029 rating places it in the top ~4% of all Codeforces users (Figure 10).",
                source: "Table 3, Figure 10"
            },
            {
                name: "LiveCodeBench",
                fullName: "Live Code Benchmark (2024-08 to 2025-01)",
                r1Zero: "50.0% pass@1",
                r1Final: "65.9% pass@1",
                humanBaseline: "Not specified (benchmark designed to reduce contamination)",
                description: "Recent programming problems from LeetCode and similar platforms, collected during the period Aug 2024 - Jan 2025 to minimize training data leakage.",
                source: "Table 3"
            },
            {
                name: "SWE-Bench Verified",
                fullName: "Software Engineering Benchmark (Verified subset)",
                r1Zero: "43.2%",
                r1Final: "49.2%",
                humanBaseline: "Real GitHub issues from production repositories",
                description: "Real-world software engineering tasks: fixing bugs and implementing features in open-source repositories. Paper notes RL wasn't applied extensively to SWE tasks due to long evaluation times.",
                source: "Table 3, Section 6"
            },
            {
                name: "Aider-Polyglot",
                fullName: "Aider Code Editing Benchmark (Multiple Languages)",
                r1Zero: "12.2%",
                r1Final: "53.3%",
                humanBaseline: "Not specified",
                description: "Multi-file code editing tasks across programming languages. Major improvement from Dev2 (25.6%) to Dev3 (44.8%) after incorporating code engineering datasets.",
                source: "Table 3"
            }
        ]
    },
    {
        name: "Instruction Following & Chat",
        description: "Evaluations of the model's ability to follow precise instructions and engage in helpful, high-quality conversations.",
        benchmarks: [
            {
                name: "IFEval",
                fullName: "Instruction-Following Evaluation (Prompt Strict accuracy)",
                r1Zero: "46.6%",
                r1Final: "83.3%",
                humanBaseline: "GPT-4 achieves 76.89% (from Lesson 11)",
                description: "Verifiable instruction-following: tasks with objective, programmatically checkable constraints (word count, keyword inclusion, formatting). R1's 36.7-point improvement demonstrates RL on verifiable rewards.",
                source: "Table 3, connects to Lesson 11"
            },
            {
                name: "AlpacaEval 2.0",
                fullName: "AlpacaEval 2.0 (Length-Controlled Win Rate)",
                r1Zero: "24.7%",
                r1Final: "87.6%",
                humanBaseline: "Compares against reference model (GPT-4 Turbo, etc.)",
                description: "Open-ended instruction-following and chat quality, judged by LLM. LC win rate controls for response length. Massive 62.9-point gain from integrating general instruction data and helpful reward model.",
                source: "Table 3"
            },
            {
                name: "ArenaHard",
                fullName: "ArenaHard (GPT-4-1106 as judge)",
                r1Zero: "53.6%",
                r1Final: "92.3%",
                humanBaseline: "Challenging questions from Chatbot Arena",
                description: "Difficult, open-ended questions judged by GPT-4. Tests multi-turn reasoning, writing quality, and instruction adherence. Final RL stage (Dev3 → R1) added 16.7 percentage points.",
                source: "Table 3, Section 3.2.2"
            },
            {
                name: "FRAMES",
                fullName: "FRAMES Benchmark (Factuality and Reasoning)",
                r1Zero: "82.3%",
                r1Final: "82.5%",
                humanBaseline: "Not specified in paper",
                description: "Tests factuality and multi-hop reasoning. R1 maintains consistent performance across training stages.",
                source: "Table 3"
            }
        ]
    },
    {
        name: "Knowledge & General",
        description: "Broad knowledge benchmarks testing factual recall, multi-task understanding, and general reasoning.",
        benchmarks: [
            {
                name: "MMLU",
                fullName: "Massive Multitask Language Understanding (Exact Match)",
                r1Zero: "88.8%",
                r1Final: "90.8%",
                humanBaseline: "Human expert performance ~89% (from Lesson 01)",
                description: "57 subjects across STEM, humanities, social sciences. 5-shot evaluation with chain-of-thought prompting. R1 achieves performance above human expert baseline.",
                source: "Table 3, connects to Lesson 01"
            },
            {
                name: "MMLU-Redux",
                fullName: "MMLU-Redux (Cleaned version)",
                r1Zero: "85.6%",
                r1Final: "92.9%",
                humanBaseline: "Similar to MMLU (~89%)",
                description: "Cleaned version of MMLU with corrected labels and removed ambiguous questions. R1's 7.3-point improvement from R1-Zero suggests RL and SFT stages refined knowledge recall.",
                source: "Table 3"
            },
            {
                name: "MMLU-Pro",
                fullName: "MMLU-Pro (More challenging questions)",
                r1Zero: "68.9%",
                r1Final: "84.0%",
                humanBaseline: "Not specified (harder than MMLU)",
                description: "Harder version of MMLU with more difficult questions and distractor answer choices. R1's 15.1-point gain demonstrates improved reasoning over raw knowledge recall.",
                source: "Table 3"
            },
            {
                name: "DROP",
                fullName: "Discrete Reasoning Over Paragraphs (3-shot F1)",
                r1Zero: "89.1%",
                r1Final: "92.2%",
                humanBaseline: "Human performance ~95% F1",
                description: "Reading comprehension requiring arithmetic and discrete reasoning. Models must perform numerical operations and multi-step logic over passage content.",
                source: "Table 3"
            },
            {
                name: "SimpleQA / C-SimpleQA",
                fullName: "SimpleQA (English) and C-SimpleQA (Chinese)",
                r1Zero: "30.3% (EN), 66.4% (CN)",
                r1Final: "30.1% (EN), 63.7% (CN)",
                humanBaseline: "Not specified",
                description: "Short-form factual questions testing precise knowledge. R1 performance is relatively flat across stages, suggesting these benchmarks aren't improved much by reasoning RL.",
                source: "Table 3"
            }
        ]
    }
];

// Function to update the benchmark display
function updateBenchmark() {
    const select = document.getElementById('benchmarkSelect');
    const categoryIndex = parseInt(select.value);
    const category = benchmarkCategories[categoryIndex];
    
    const displayDiv = document.getElementById('benchmark-display');
    displayDiv.innerHTML = `
        <h3>${category.name}</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">${category.description}</p>
        ${category.benchmarks.map(benchmark => `
            <div class="sample-question">
                <h4>${benchmark.name}</h4>
                <p style="font-style: italic; color: var(--text-secondary); margin-bottom: 10px;">
                    ${benchmark.fullName}
                </p>
                <div style="background: var(--bg-secondary); padding: 15px; border-radius: 6px; margin: 10px 0;">
                    <p><strong>R1-Zero:</strong> ${benchmark.r1Zero}</p>
                    <p><strong>R1 (Final):</strong> ${benchmark.r1Final}</p>
                    <p><strong>Human Baseline:</strong> ${benchmark.humanBaseline}</p>
                </div>
                <p>${benchmark.description}</p>
                <p style="font-size: 0.9em; color: var(--text-secondary); margin-top: 10px;">
                    <em>Source: ${benchmark.source}</em>
                </p>
            </div>
        `).join('')}
    `;
}

// Initialize with first category
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('benchmarkSelect')) {
        updateBenchmark();
    }
});
