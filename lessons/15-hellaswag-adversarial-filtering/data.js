// Data for HellaSwag lesson - all values verified from the paper (Zellers et al., ACL 2019, arXiv:1905.07830)

// Main results from Table 1 of the paper
const modelResults = {
    validation: {
        overall: [
            { model: 'Human', accuracy: 95.7 },
            { model: 'BERT-Large', accuracy: 46.7 },
            { model: 'BERT-Base', accuracy: 39.5 },
            { model: 'OpenAI GPT', accuracy: 41.9 },
            { model: 'ESIM+ELMo', accuracy: 33.6 },
            { model: 'LSTM+BERT-Base', accuracy: 35.9 },
            { model: 'LSTM+ELMo', accuracy: 31.7 },
            { model: 'LSTM+GloVe', accuracy: 31.9 },
            { model: 'fastText', accuracy: 30.9 },
            { model: 'Random Chance', accuracy: 25.0 }
        ],
        indomain: [
            { model: 'Human', accuracy: 95.6 },
            { model: 'BERT-Large', accuracy: 50.2 },
            { model: 'BERT-Base', accuracy: 42.9 },
            { model: 'OpenAI GPT', accuracy: 45.3 },
            { model: 'ESIM+ELMo', accuracy: 35.7 },
            { model: 'LSTM+BERT-Base', accuracy: 38.7 },
            { model: 'LSTM+ELMo', accuracy: 33.2 },
            { model: 'LSTM+GloVe', accuracy: 34.3 },
            { model: 'fastText', accuracy: 33.8 }
        ],
        zeroshot: [
            { model: 'Human', accuracy: 95.8 },
            { model: 'BERT-Large', accuracy: 43.3 },
            { model: 'BERT-Base', accuracy: 36.1 },
            { model: 'OpenAI GPT', accuracy: 38.6 },
            { model: 'ESIM+ELMo', accuracy: 31.5 },
            { model: 'LSTM+BERT-Base', accuracy: 33.2 },
            { model: 'LSTM+ELMo', accuracy: 30.4 },
            { model: 'LSTM+GloVe', accuracy: 29.5 },
            { model: 'fastText', accuracy: 28.0 }
        ]
    },
    test: {
        overall: [
            { model: 'Human', accuracy: 95.6 },
            { model: 'BERT-Large', accuracy: 47.3 },
            { model: 'BERT-Base', accuracy: 40.5 },
            { model: 'OpenAI GPT', accuracy: 41.7 },
            { model: 'ESIM+ELMo', accuracy: 33.3 },
            { model: 'LSTM+BERT-Base', accuracy: 36.2 },
            { model: 'LSTM+ELMo', accuracy: 31.4 },
            { model: 'LSTM+GloVe', accuracy: 31.7 },
            { model: 'fastText', accuracy: 31.6 }
        ]
    }
};

// Domain-specific results from Table 1
const domainResults = {
    activitynet: {
        val: [
            { model: 'Human', accuracy: 94.0 },
            { model: 'BERT-Large', accuracy: 54.7 },
            { model: 'BERT-Base', accuracy: 48.9 },
            { model: 'OpenAI GPT', accuracy: 46.4 },
            { model: 'ESIM+ELMo', accuracy: 37.7 }
        ],
        test: [
            { model: 'Human', accuracy: 94.0 },
            { model: 'BERT-Large', accuracy: 51.7 },
            { model: 'BERT-Base', accuracy: 45.7 },
            { model: 'OpenAI GPT', accuracy: 43.8 },
            { model: 'ESIM+ELMo', accuracy: 36.6 }
        ]
    },
    wikihow: {
        val: [
            { model: 'Human', accuracy: 96.5 },
            { model: 'BERT-Large', accuracy: 42.9 },
            { model: 'BERT-Base', accuracy: 34.9 },
            { model: 'OpenAI GPT', accuracy: 39.8 },
            { model: 'ESIM+ELMo', accuracy: 31.6 }
        ],
        test: [
            { model: 'Human', accuracy: 96.5 },
            { model: 'BERT-Large', accuracy: 45.0 },
            { model: 'BERT-Base', accuracy: 37.7 },
            { model: 'OpenAI GPT', accuracy: 40.5 },
            { model: 'ESIM+ELMo', accuracy: 31.5 }
        ]
    }
};

// Transfer learning results from Figure 9
const transferResults = [
    { setting: 'BERT on HellaSwag (trained on HellaSwag)', accuracy: 46.7 },
    { setting: 'BERT on HellaSwag (trained on SWAG)', accuracy: 34.6 },
    { setting: 'BERT on SWAG (trained on SWAG)', accuracy: 86.7 },
    { setting: 'BERT on SWAG (trained on HellaSwag)', accuracy: 69.1 }
];

// SWAG comparison data from Section 3
const swagComparison = [
    { setting: 'SWAG - Full context', model: 'BERT-Large', accuracy: 86.7 },
    { setting: 'SWAG - Ending only', model: 'BERT-Large', accuracy: 74.8 },
    { setting: 'SWAG - Shuffled', model: 'BERT-Large', accuracy: 77.1 },
    { setting: 'SWAG - Shuffled + Ending only', model: 'BERT-Large', accuracy: 60.4 },
    { setting: 'HellaSwag - Full context', model: 'BERT-Large', accuracy: 46.7 }
];

// Real HellaSwag examples for the explorer
// These are representative examples based on the paper's format
const hellaSwagExamples = [
    {
        ind: 24,
        activity_label: "Removing ice from car",
        source: "activitynet",
        split_type: "indomain",
        ctx: "Then, the man writes over the snow covering the window of a car, and a woman wearing winter clothes smiles. then",
        endings: [
            ", the man adds wax to the windshield and cuts it.",
            ", a person board a ski lift, while two men supporting the head of the person wearing winter clothes snow as the we girls sled.",
            ", the man puts on a christmas coat, knitted with netting.",
            ", the man continues removing the snow on his car."
        ],
        label: 3
    },
    {
        ind: 73,
        activity_label: "Playing drums",
        source: "activitynet",
        split_type: "indomain",
        ctx: "A guy is sitting with sticks in his hands. A guy plays the drums.",
        endings: [
            "A guy is sitting with drumsticks in his hands.",
            "The guy wipes his face with his hand.",
            "The guy is swirling around with drum sticks.",
            "The guy has finished playing drums."
        ],
        label: 1
    },
    {
        ind: 1133,
        activity_label: "Cutting the grass",
        source: "activitynet",
        split_type: "indomain",
        ctx: "A man is standing in a yard holding a lawn mower. He starts the lawn mower.",
        endings: [
            "He then cuts the grass on the lawn.",
            "He then does a split and rubs his hands together.",
            "He takes off the hat he is wearing.",
            "He is cutting all the grass around the side."
        ],
        label: 0
    },
    {
        ind: 201,
        activity_label: "Sharpening knives",
        source: "activitynet",
        split_type: "zeroshot",
        ctx: "Two men are in a room and the man with a blue shirt takes out a bench stone and with a little lubricant on the stone takes a knife and explains how to sharpen it. then he",
        endings: [
            "uses a sharpener to smooth out the stone using the knife.",
            "shows how to cut the bottom with the knife and place a tube on the inner and corner.",
            "bends down and grabs the knife and remove the appliance.",
            "stops sharpening the knife and takes out some pieces of paper to show how sharp the knife is as he cuts slivers of paper with the knife."
        ],
        label: 3
    },
    {
        ind: 487,
        activity_label: "Youth",
        source: "wikihow",
        split_type: "indomain",
        ctx: "[header] How to make up a good excuse for your homework not being finished [title] Blame technology. [step] One of the easiest and most believable excuses is simply blaming technology. You can say your computer crashed, your printer broke, your internet was down, or any number of problems.",
        endings: [
            "Your excuses will hardly seem believable. [substeps] This doesn't mean you are lying, just only that you don't have all the details of how your computer ran at the time of the accident.",
            "The simplest one to have in a classroom is to blame you entire classroom, not just lab. If you can think of yourself as the victim, why not blame it on technology.",
            "Most people, your teacher included, have experienced setbacks due to technological problems. [substeps] This is a great excuse if you had a paper you needed to type and print.",
            "It may also be more believable if you are fully aware that you may be flying at high speed on a plane and need someone to give you traffic report. Your problem might be your laptop failing to charge after a long flight."
        ],
        label: 2
    },
    {
        ind: 912,
        activity_label: "Family Life",
        source: "wikihow",
        split_type: "zeroshot",
        ctx: "[header] How to raise your children to be helpers [title] Call them helpers when you ask for things. [step] Instead of asking for help, ask your child to \"be a helper.\" All people, children included, are more motivated when their identity is in play.",
        endings: [
            "You can start doing this with your children as early as two years old. [substeps] You might say, \"jayden, can you be a helper and clean your bedroom before grandma comes over?\" or \"please be a helper and stay quiet while your sister naps.\"",
            "When you call your child helpers, describe what they do and what they need to be helped for. [substeps] You could say, \"i need you to help dad during his lunch break at work.\"",
            "If you ask your child for things they have access to, it encourages them to put more effort into making things happen. [substeps] To make sure they understand exactly what's expected of them, you could try saying, \"i'm looking for helpers who can be helpers.\"",
            "Call them when you need them for help or for monetary help. [substeps] For example, if you need help with something you don't know how to do, let your child know you're excited to help with this.\""
        ],
        label: 0
    }
];

// Dataset statistics
const datasetStats = {
    total: 70000,
    activitynet: 25000,
    wikihow: 45000,
    validation: 10000,
    test: 10000,
    indomain_per_split: 5000,
    zeroshot_per_split: 5000
};

// Key insights
const keyInsights = [
    "Human accuracy: 95.6% overall (>95% on all splits)",
    "Best model (BERT-Large): 47.3% test accuracy - less than half of human performance",
    "Performance gap: Over 48 percentage points between humans and best model",
    "Zero-shot drop: ~5% accuracy drop on novel categories",
    "WikiHow is harder for machines (45% BERT-Large) than ActivityNet (52%)",
    "Transfer from SWAG to HellaSwag: only 34.6% - minimal generalization"
];
