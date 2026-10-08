// Data from DeepSeekMath Paper (Shao et al., 2024, arXiv 2402.03300)
// All numbers are from the paper's tables and figures

const deepSeekMathData = {
    // Training progression data (from paper abstract and Section 1.1)
    // "GSM8K: 82.9% → 88.2%, MATH: 46.8% → 51.7%"
    trainingProgression: {
        stages: ['Base\n(Pre-training)', 'Instruct\n(SFT)', 'RL\n(GRPO)'],
        gsm8k: [64.2, 82.9, 88.2],
        math: [36.2, 46.8, 51.7]
    },

    // Note: Paper does not provide MATH breakdown by difficulty level
    // Removed fabricated mathByDifficulty data

    // Model comparison on MATH (Table 2 for base models, Table 5 for instruct/RL)
    modelComparison: {
        models: [
            'Minerva-540B',
            'GPT-4',
            'Gemini-Ultra',
            'DeepSeek\nMath-7B-RL'
        ],
        mathAccuracy: [33.6, 52.9, 53.2, 51.7],
        // Note: GPT-4 and Gemini-Ultra parameter counts are not publicly disclosed
        parameters: [540, null, null, 7]  // in billions; null = undisclosed
    },

    // Note: Paper does NOT report PPO comparison
    // Only shows SFT→GRPO progression (see trainingProgression above)
    // Removed fabricated grpoVsPpo data

    // Note: Paper uses G=64 and does NOT report group size ablation
    // Removed fabricated groupSizeAblation data

    // Pre-training data: 120B math tokens from CommonCrawl (Section 2.1)
    // Paper does not break down into CommonCrawl/arXiv/code splits
    // Removed fabricated preTrainingData breakdown

    // Decontamination: 10-gram exact matching (Section 2.1)
    // Paper states method but does not provide removal statistics
    // Removed fabricated contamination stats

    // RL improvement on key benchmarks (from paper abstract and Section 1.1)
    rlImprovement: {
        benchmarks: ['GSM8K', 'MATH'],
        sftScores: [82.9, 46.8],
        grpoScores: [88.2, 51.7],
        improvements: [5.3, 4.9]
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
