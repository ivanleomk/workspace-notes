// Data for KTO Lesson 16: Model Alignment as Prospect Theoretic Optimization
// All values verified against arXiv:2402.01306

const ktoData = {
    // Main results: KTO vs DPO winrates (from Figure 3)
    ktoVsDpoWinrates: {
        models: ['Pythia-1.4B', 'Pythia-2.8B', 'Pythia-6.9B', 'Pythia-12B', 'Llama-7B', 'Llama-13B', 'Llama-30B'],
        dpoAlone: [null, null, null, null, 0.515, 0.495, 0.490], // approximate from Figure 3
        ktoAlone: [null, null, null, null, 0.545, 0.510, 0.530], // approximate from Figure 3
        sftPlusDpo: [null, null, null, null, 0.525, 0.505, 0.505], // approximate from Figure 3
        sftPlusKto: [null, null, null, null, 0.535, 0.520, 0.520]  // approximate from Figure 3
    },

    // Benchmark results: Zephyr-β-SFT on UltraFeedback (Table 2, top section)
    benchmarkResults: {
        methods: ['SFT', 'DPO', 'ORPO (λ=0.1)', 'KTO (β=0.1)'],
        mmlu: [57.2, 58.2, 57.1, 58.6],
        gsm8k: [39.0, 40.0, 36.5, 53.5],
        humaneval: [30.1, 30.1, 29.5, 30.9],
        bbh: [46.3, 44.1, 47.5, 52.6]
    },

    // Data imbalance results (Figure 5)
    dataImbalance: {
        desirableFractions: [1.0, 0.9, 0.75, 0.5, 0.25, 0.1],
        // Approximate winrates read from Figure 5
        ktoWinrate: [0.545, 0.540, 0.535, 0.530, 0.525, 0.520],
        dpoWinrate: 0.515  // DPO baseline with full balanced data
    },

    // HALO vs non-HALO comparison (Figure 2, approximate values)
    haloComparison: {
        models: ['Llama-7B', 'Llama-13B', 'Llama-30B'],
        csft: [0.485, 0.490, 0.485],
        slic: [0.490, 0.495, 0.490],
        dpo: [0.525, 0.505, 0.505],
        ppoOffline: [0.520, 0.500, 0.485]
    },

    // One-y-per-x results (Table 3)
    mistralResults: {
        methods: ['Unaligned', 'DPO', 'KTO (all y)', 'KTO (one y)', 'Mistral-Instruct'],
        winrates: [52.5, 60.0, 65.2, 63.1, 62.1],
        errors: [3.7, 3.7, 3.6, 3.6, 3.1]  // 90% confidence intervals
    },

    // Value function parameters (from Section 2, 3, 4)
    prospectTheory: {
        kahneman_tversky: {
            alpha: 0.88,  // median curvature
            lambda: 2.25  // median loss aversion
        },
        kto_defaults: {
            beta: 0.1,
            lambda_D: 1.0,
            lambda_U: 1.0
        }
    },

    // Hyperparameter recommendations (Table 1)
    hyperparameters: {
        llama3_8b_sft_kto: {lr: '5e-6', beta: 0.05, alpacaeval: 10.59, bbh: 65.15, gsm8k: 60.20},
        llama3_8b_kto: {lr: '5e-6', beta: 0.10, alpacaeval: 11.25, bbh: 65.26, gsm8k: 57.92},
        llama3_8b_instruct_kto: {lr: '5e-6', beta: 0.25, alpacaeval: 18.86, bbh: 64.28, gsm8k: 76.42},
        qwen25_3b_instruct_sft_kto: {lr: '5e-6', beta: 0.10, alpacaeval: 13.01, bbh: 32.39, gsm8k: 61.11},
        qwen25_3b_instruct_kto: {lr: '5e-6', beta: 0.50, alpacaeval: 16.63, bbh: 20.41, gsm8k: 60.35}
    },

    // Ablation results (Table 2, middle section)
    ablations: {
        kto_baseline: {mmlu: 58.6, gsm8k: 53.5, humaneval: 30.9, bbh: 52.6},
        kto_one_y_per_x: {mmlu: 58.0, gsm8k: 50.0, humaneval: 30.7, bbh: 49.9},
        kto_no_z0: {mmlu: 58.5, gsm8k: 49.5, humaneval: 30.7, bbh: 49.0},
        kto_concave: {mmlu: 58.3, gsm8k: 42.5, humaneval: 30.6, bbh: 43.2},
        kto_risk_neutral: {mmlu: 57.3, gsm8k: 42.0, humaneval: 28.8, bbh: 6.1},
        kto_no_pi_ref: {mmlu: 57.5, gsm8k: 47.5, humaneval: 29.5, bbh: 51.6}
    }
};
