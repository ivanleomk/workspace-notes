// Data for KTO Lesson 16: Model Alignment as Prospect Theoretic Optimization
// All values verified against arXiv:2402.01306

const ktoData = {
    // Main results: KTO vs DPO winrates (from Figure 3)
    ktoVsDpoWinrates: {
        models: ['Pythia-1.4B', 'Pythia-2.8B', 'Pythia-6.9B', 'Pythia-12B', 'Llama-7B', 'Llama-13B', 'Llama-30B'],
        dpoAlone: [null, null, null, null, -19, -8, 3.5], // approximate reads of Figure 3 (winrate − 50, ±2 pp)
        ktoAlone: [null, null, null, null, -9, -3, 16.5], // approximate reads of Figure 3 (winrate − 50, ±2 pp)
        sftPlusDpo: [null, null, null, null, -7, 0, 12], // approximate reads of Figure 3 (winrate − 50, ±2 pp)
        sftPlusKto: [null, null, null, null, -2, 2, 15]  // approximate reads of Figure 3 (winrate − 50, ±2 pp)
    },

    // Benchmark results: Zephyr-β-SFT on UltraFeedback (Table 2, top section)
    benchmarkResults: {
        methods: ['SFT', 'DPO', 'ORPO (λ=0.1)', 'KTO (β=0.1)'],
        mmlu: [57.2, 58.2, 57.1, 58.6],
        gsm8k: [39.0, 40.0, 36.5, 53.5],
        humaneval: [30.1, 30.1, 29.5, 30.9],
        bbh: [46.3, 44.1, 47.5, 52.6]
    },

    // Data imbalance results (Figure 5, left panel)
    dataImbalance: {
        desirableFractions: [1.0, 0.5, 0.3, 0.15, 0.1, 0.05],
        // Approximate winrates read from Figure 5 (left panel, absolute winrate vs SFT target)
        ktoWinrate: [0.455, 0.405, 0.40, 0.33, 0.345, 0.285], // approximate reads of Figure 5 (left), absolute winrate vs SFT target
        dpoWinrate: 0.31  // approximate, dashed line in Figure 5
    },

    // HALO vs non-HALO comparison (Figure 2, approximate values)
    haloComparison: {
        models: ['Llama-7B', 'Llama-13B', 'Llama-30B'],
        csft: [-12, -12.5, -6.5], // approximate reads of Figure 2 (winrate − 50, ±2 pp)
        slic: [-12, -10, -12.5], // approximate reads of Figure 2 (winrate − 50, ±2 pp)
        dpo: [-7, 0, 12], // approximate reads of Figure 2 (winrate − 50, ±2 pp)
        ppoOffline: [-8.5, -2, 0.5] // approximate reads of Figure 2 (winrate − 50, ±2 pp)
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
