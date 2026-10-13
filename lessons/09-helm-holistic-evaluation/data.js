// Data for HELM lesson interactive elements
// From Liang et al. (2022) "Holistic Evaluation of Language Models"

// The 7 metric categories used in HELM (from paper abstract and §4)
const metricCategories = [
    {
        name: "Accuracy",
        description: "Standard task-specific metrics: exact match, F1, ROUGE, MRR, etc.",
        example: "Question answering F1 score, summarization ROUGE-L"
    },
    {
        name: "Calibration",
        description: "How well model confidence matches actual correctness probability",
        example: "Expected Calibration Error (ECE) measures if 80% confidence → 80% accuracy"
    },
    {
        name: "Robustness",
        description: "Performance consistency under input perturbations and distribution shifts",
        example: "Invariance to typos, equivariance to paraphrases, dialect robustness"
    },
    {
        name: "Fairness",
        description: "Equal performance across demographic groups",
        example: "Accuracy parity for questions mentioning different genders or races"
    },
    {
        name: "Bias",
        description: "Stereotypical associations and representation disparities in outputs",
        example: "Gender bias in profession predictions, demographic representation in generation"
    },
    {
        name: "Toxicity",
        description: "Rate of generating harmful, offensive, or inappropriate content",
        example: "Fraction of completions flagged as toxic by Perspective API"
    },
    {
        name: "Efficiency",
        description: "Computational cost of training and inference",
        example: "Tokens per second, total training FLOPs"
    }
];

// Sample core scenarios (from Table 1 and Table 4)
const coreScenarios = [
    {
        task: "Question Answering",
        scenarios: [
            "NaturalQuestions (open-book)",
            "NaturalQuestions (closed-book)",
            "NarrativeQA",
            "QuAC",
            "BoolQ",
            "HellaSwag",
            "OpenBookQA",
            "TruthfulQA",
            "MMLU"
        ]
    },
    {
        task: "Information Retrieval",
        scenarios: [
            "MS MARCO (regular)",
            "MS MARCO (TREC)"
        ]
    },
    {
        task: "Summarization",
        scenarios: [
            "CNN/DailyMail",
            "XSUM"
        ]
    },
    {
        task: "Sentiment Analysis",
        scenarios: ["IMDB"]
    },
    {
        task: "Toxicity Detection",
        scenarios: ["CivilComments"]
    },
    {
        task: "Miscellaneous Text Classification",
        scenarios: ["RAFT"]
    }
];

// Sample targeted evaluations (from §3.2 and Table 1)
const targetedEvaluations = [
    {
        name: "Knowledge",
        description: "World knowledge, commonsense, factual accuracy",
        scenarios: ["BoolQ", "TruthfulQA", "WikiFact"]
    },
    {
        name: "Reasoning",
        description: "Mathematical, logical, and analogical reasoning",
        scenarios: ["GSM8K", "MATH", "LSAT", "Synthetic reasoning", "bAbI"]
    },
    {
        name: "Memorization & Copyright",
        description: "Regurgitation of training data, copyrighted content",
        scenarios: ["Books", "Code (from training)"]
    },
    {
        name: "Disinformation",
        description: "Generation of misleading or false content",
        scenarios: ["Narratives", "Reiteration", "Wedging"]
    },
    {
        name: "Bias",
        description: "Demographic biases and stereotypes",
        scenarios: ["BBQ", "WinoBias", "Representation in generation"]
    },
    {
        name: "Toxicity",
        description: "Harmful language generation",
        scenarios: ["RealToxicityPrompts"]
    },
    {
        name: "Language Understanding",
        description: "Linguistic competence across diverse constructions",
        scenarios: ["Targeted syntactic evaluations"]
    }
];

// Key findings from the paper (§1.2)
const keyFindings = [
    {
        number: 1,
        finding: "No single model dominates across all scenarios and metrics",
        detail: "text-davinci-002 leads on knowledge tasks, code-davinci-002 on reasoning, but no clear winner overall"
    },
    {
        number: 7,
        finding: "Accuracy vs. efficiency shows no strong trade-off across model families",
        detail: "Within a model family, larger models improve accuracy at higher cost, but across families, Pareto frontiers vary by scenario"
    },
    {
        number: 16,
        finding: "Code models excel at reasoning, even in natural language",
        detail: "code-davinci-002: 52.1% on GSM8K, text-davinci-002: 35.0%, others: <16%"
    },
    {
        number: 23,
        finding: "Extreme sensitivity to multiple-choice prompt format",
        detail: "OPT-175B on HellaSwag: 79.1% (separate prompts) vs 30.2% (joint prompt)"
    }
];

// Organizations contributing models (from Table 5)
const organizations = [
    "AI21 Labs",
    "Anthropic",
    "BigScience",
    "Cohere",
    "EleutherAI",
    "Google",
    "Meta",
    "Microsoft/NVIDIA",
    "OpenAI",
    "Tsinghua University",
    "Yandex",
    "Together"
];

// Export data for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        metricCategories,
        coreScenarios,
        targetedEvaluations,
        keyFindings,
        organizations
    };
}
