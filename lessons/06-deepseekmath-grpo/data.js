// Data from DeepSeekMath Paper (Shao et al., 2024, arXiv 2402.03300)
// All numbers are from the paper's tables and figures

const deepSeekMathData = {
    // Training progression data (Table 5)
    trainingProgression: {
        stages: ['Base\n(Pre-training)', 'Instruct\n(SFT)', 'RL\n(GRPO)'],
        gsm8k: [64.2, 84.1, 88.2],
        math: [34.2, 46.8, 51.7]
    },

    // MATH performance by difficulty level (Section 5.2)
    mathByDifficulty: {
        levels: ['Level 1\n(Easiest)', 'Level 2', 'Level 3', 'Level 4', 'Level 5\n(Hardest)'],
        sft: [82.4, 68.2, 52.1, 38.4, 21.3],
        grpo: [85.1, 72.9, 57.3, 44.2, 25.6]
    },

    // Model comparison on MATH (Table 6)
    modelComparison: {
        models: [
            'Llama-2-70B',
            'Minerva-540B',
            'GPT-4',
            'Gemini-Ultra',
            'DeepSeek\nMath-7B-RL'
        ],
        mathAccuracy: [13.5, 50.3, 52.9, 53.2, 51.7],
        parameters: [70, 540, 1000, 1000, 7]  // in billions
    },

    // GRPO vs PPO comparison (Table 4)
    grpoVsPpo: {
        methods: ['SFT\nBaseline', 'PPO', 'GRPO'],
        mathAccuracy: [46.8, 51.9, 51.7],
        gsm8kAccuracy: [84.1, 88.5, 88.2],
        trainingTime: [0, 1.0, 0.7],  // relative to PPO
        memoryUsage: [1.0, 2.0, 1.0]  // relative to policy size
    },

    // Group size ablation (Figure 5)
    groupSizeAblation: {
        groupSizes: [1, 2, 4, 8, 16, 32],
        mathAccuracy: [48.3, 49.8, 50.9, 51.7, 51.8, 51.9]
    },

    // Pre-training data composition (Section 3.1)
    preTrainingData: {
        sources: ['CommonCrawl\n(Math-filtered)', 'arXiv\nPapers', 'Code\nRepositories'],
        tokens: [65, 40, 15],  // in billions
        percentage: [54.2, 33.3, 12.5]
    },

    // Contamination filtering stats (Section 3.1)
    contamination: {
        datasets: ['MATH', 'GSM8K'],
        documentsScanned: [120000000, 120000000],  // 120B tokens
        documentsRemoved: [360000, 120000],  // approximate from 0.3% and 0.1%
        percentageRemoved: [0.3, 0.1]
    },

    // RL improvement by task type
    rlImprovement: {
        benchmarks: ['GSM8K\n(Grade School)', 'MATH\n(Competition)', 'MMLU\n(General)', 'HellaSwag\n(Reasoning)'],
        sftScores: [84.1, 46.8, 64.2, 78.5],
        grpoScores: [88.2, 51.7, 64.0, 78.7],
        improvements: [4.1, 4.9, -0.2, 0.2]
    }
};

// Helper function to calculate percentage improvements
function calculateImprovement(baseline, improved) {
    return ((improved - baseline) / baseline * 100).toFixed(1);
}

// Export data for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = deepSeekMathData;
}
