// Scenario data for HELM explorer
const scenarios = [
    {
        name: "NaturalQuestions (Open-book)",
        task: "Question Answering",
        domain: "Wikipedia, web search queries",
        description: "Questions from Google search queries with Wikipedia contexts. Tests reading comprehension and information extraction from reference documents.",
        metrics: ["Accuracy", "Calibration", "Robustness (invariance)", "Fairness (dialect)", "Bias", "Toxicity", "Efficiency"],
        example: {
            question: "Where was the painter of the Mona Lisa born?",
            context: "Leonardo da Vinci was born on April 15, 1452, in Vinci, Republic of Florence (present-day Italy)...",
            answer: "Vinci, Italy"
        }
    },
    {
        name: "NarrativeQA",
        task: "Question Answering",
        domain: "Books and movie scripts",
        description: "Reading comprehension through understanding of narrative long-form content. Requires integrating information across entire books or scripts.",
        metrics: ["Accuracy", "Calibration", "Robustness (invariance)", "Fairness (dialect)", "Bias", "Toxicity", "Efficiency"],
        example: {
            question: "Who is the protagonist of Pride and Prejudice?",
            context: "[Full book text]",
            answer: "Elizabeth Bennet"
        }
    },
    {
        name: "MMLU",
        task: "Question Answering",
        domain: "57 academic subjects (STEM, humanities, social sciences)",
        description: "Massive multitask language understanding across 57 subjects. Tests specialized knowledge from elementary to professional level.",
        metrics: ["Accuracy", "Calibration", "Robustness (invariance)", "Fairness (dialect)", "Efficiency"],
        example: {
            question: "Which of the following is NOT a function of the liver?\n(A) Bile production\n(B) Insulin secretion\n(C) Detoxification\n(D) Glycogen storage",
            answer: "(B) Insulin secretion"
        }
    },
    {
        name: "MS MARCO",
        task: "Information Retrieval",
        domain: "Web passages (9M collection)",
        description: "Passage ranking for web search. Given a query, rank candidate passages by relevance. Tests both retrieval and calibrated probability estimates.",
        metrics: ["Accuracy (MRR, NDCG)", "Calibration", "Robustness", "Fairness", "Bias", "Toxicity", "Efficiency"],
        example: {
            query: "what causes a rainbow",
            passages: [
                "A rainbow is caused by reflection, refraction and dispersion of light in water droplets...",
                "Rainbows appear when sunlight strikes raindrops in front of the viewer...",
                "[Several other candidate passages]"
            ],
            task: "Rank passages by relevance"
        }
    },
    {
        name: "CNN/DailyMail",
        task: "Summarization",
        domain: "News articles",
        description: "Abstractive summarization of news articles. Tests ability to identify key information, remove redundancy, and generate coherent summaries.",
        metrics: ["Accuracy (ROUGE)", "Bias", "Toxicity", "Efficiency"],
        example: {
            article: "The European Union announced today that it would impose sanctions on...",
            summary: "EU imposes sanctions; key points include..."
        }
    },
    {
        name: "IMDB",
        task: "Sentiment Analysis",
        domain: "Movie reviews",
        description: "Binary sentiment classification (positive/negative) of movie reviews. Tests understanding of sentiment, contrast sets for robustness.",
        metrics: ["Accuracy", "Calibration", "Robustness (contrast sets)", "Fairness", "Bias", "Toxicity", "Efficiency"],
        example: {
            review: "This movie was a masterpiece. The acting was superb and the plot kept me engaged throughout.",
            sentiment: "Positive"
        }
    },
    {
        name: "CivilComments",
        task: "Toxicity Detection",
        domain: "Online comments (50 news sites, 2015-2017)",
        description: "Binary classification of toxic vs non-toxic comments. Includes demographic metadata for fairness measurement. Critical for content moderation.",
        metrics: ["Accuracy", "Calibration", "Robustness", "Fairness (demographics)", "Bias", "Toxicity", "Efficiency"],
        example: {
            comment: "This policy is completely ridiculous and shows how out of touch politicians are.",
            label: "Non-toxic (strong opinion but not toxic)"
        }
    },
    {
        name: "RAFT",
        task: "Miscellaneous Text Classification",
        domain: "11 real-world tasks (medical, legal, customer service, etc.)",
        description: "Collection of 11 ecologically-valid text classification tasks with real applications: banking queries, legal classification, hate speech, etc.",
        metrics: ["Accuracy", "Calibration", "Robustness", "Fairness", "Bias", "Toxicity", "Efficiency"],
        example: {
            task: "Banking77 - Classify customer service query",
            query: "I withdrew cash and I think the exchange rate is wrong.",
            label: "wrong_exchange_rate_for_cash_withdrawal"
        }
    }
];

// Model families evaluated in HELM
const modelFamilies = [
    { org: "AI21 Labs", models: ["J1-Jumbo (178B)", "J1-Grande (17B)", "J1-Large (7.5B)"] },
    { org: "Anthropic", models: ["Anthropic-LM v4-s3 (52B)"] },
    { org: "BigScience", models: ["BLOOM (176B)", "T0++ (11B)"] },
    { org: "Cohere", models: ["xlarge (52.4B)", "large (13.1B)", "medium (6.1B)", "small (410M)"] },
    { org: "EleutherAI", models: ["GPT-NeoX (20B)", "GPT-J (6B)"] },
    { org: "Google", models: ["UL2 (20B)", "T5 (11B)"] },
    { org: "Meta", models: ["OPT (175B)", "OPT (66B)"] },
    { org: "Microsoft/NVIDIA", models: ["TNLG v2 (530B)", "TNLG v2 (6.7B)"] },
    { org: "OpenAI", models: ["text-davinci-002", "davinci (175B)", "curie (6.7B)", "babbage (1.3B)", "ada (350M)"] },
    { org: "OpenAI", models: ["code-davinci-002", "code-cushman-001 (12B)"], type: "code" },
    { org: "Tsinghua University", models: ["GLM (130B)"] },
    { org: "Yandex", models: ["YaLM (100B)"] }
];

// Key statistics from the paper
const helmStats = {
    coreScenarios: 16,
    targetedScenarios: 26,
    totalScenarios: 42,
    newScenarios: 21, // New or not previously mainstream
    metricCategories: 7,
    totalMetricPairs: 112, // 16 scenarios × 7 metrics
    measuredPairs: 98,
    density: 87.5, // 98/112 × 100%
    modelsEvaluated: 30,
    organizations: 12,
    totalRuns: 4939,
    totalTokens: 12169227491,
    totalQueries: 17431479,
    apiCost: 38001,
    gpuHours: 19500,
    coverageBefore: 17.9, // Average % of core scenarios evaluated before HELM
    coverageAfter: 96.0 // % coverage after HELM
};

// Key findings from the paper
const keyFindings = [
    {
        title: "Instruction-tuning advantage",
        description: "text-davinci-002 and Anthropic-LM v4-s3 (52B) dominated accuracy, robustness, and fairness despite being the only instruction-tuned models. Anthropic-LM was 10× smaller than the largest models."
    },
    {
        title: "Open vs non-open gap",
        description: "Consistent gap between open models and non-open models (closed/limited-access) across all scenarios, though the gap had narrowed significantly with recent open model releases."
    },
    {
        title: "Accuracy-robustness-fairness correlations",
        description: "Strong correlation overall, but important exceptions: TNLG v2 (530B) dropped from 72.6% to 38.9% accuracy on NarrativeQA under robustness perturbations."
    },
    {
        title: "Extreme prompt sensitivity",
        description: "OPT (175B) on HellaSwag: 79.1% accuracy with separate prompts vs 30.2% with joint prompts—a 49-point swing from prompt format alone."
    },
    {
        title: "Code models excel at reasoning",
        description: "code-davinci-002 achieved 52.1% on GSM8K vs 35.0% for text-davinci-002 (next best). Code training may improve structured reasoning generally."
    },
    {
        title: "Summarization metrics fail",
        description: "Automated summarization metrics (ROUGE, BERTScore) on CNN/DM and XSUM largely failed to discriminate model quality differences."
    },
    {
        title: "Calibration varies by scenario",
        description: "HellaSwag: improving accuracy worsens calibration. OpenBookQA: improving accuracy improves calibration. Scenario-dependent relationship."
    },
    {
        title: "Performance disparities persist",
        description: "OPT (175B): 1.506 bits/byte for White English vs 2.114 bits/byte for African American English (40% worse) on TwitterAAE."
    }
];
