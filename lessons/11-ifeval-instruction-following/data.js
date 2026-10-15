// Sample IFEval instructions
// Data inspired by Zhou et al. (2023) "Instruction-Following Evaluation for Large Language Models"
// These represent the types of verifiable instructions IFEval tests

const ifevalData = {
    "change_case": [
        {
            "instruction": "Write a 100-word summary of climate change. Your entire response should be in lowercase letters, no capital letters are allowed.",
            "category": "change_case",
            "verifiable": "All letters must be lowercase",
            "difficulty": "Medium"
        },
        {
            "instruction": "Explain photosynthesis in 3 sentences. Your ENTIRE response should be in ALL CAPS.",
            "category": "change_case",
            "verifiable": "All letters must be uppercase",
            "difficulty": "Easy"
        }
    ],
    "combination": [
        {
            "instruction": "Write a 150-word essay about democracy that: (1) contains exactly 5 paragraphs, (2) includes the word 'liberty' at least 3 times, (3) ends with the word 'future', and (4) uses no commas.",
            "category": "combination",
            "verifiable": "Must satisfy all 4 constraints simultaneously",
            "difficulty": "Very Hard"
        },
        {
            "instruction": "Create a story about a robot that: (1) is written in lowercase, (2) contains exactly 200 words, and (3) includes the keywords 'circuit' and 'dream' at least once each.",
            "category": "combination",
            "verifiable": "Must satisfy all 3 constraints simultaneously",
            "difficulty": "Hard"
        }
    ],
    "detectable_content": [
        {
            "instruction": "Write a blog post about artificial intelligence that includes a postscript starting with 'P.S.'",
            "category": "detectable_content",
            "verifiable": "Must contain 'P.S.' followed by additional text",
            "difficulty": "Easy"
        },
        {
            "instruction": "Describe machine learning in simple terms. End your response with 'Does this make sense?'",
            "category": "detectable_content",
            "verifiable": "Must end with the exact phrase",
            "difficulty": "Easy"
        }
    ],
    "detectable_format": [
        {
            "instruction": "List 5 benefits of exercise. Format your answer as a bulleted list using asterisks (*).",
            "category": "detectable_format",
            "verifiable": "Must use '* ' at the start of each line",
            "difficulty": "Easy"
        },
        {
            "instruction": "Write a poem about winter with exactly 4 stanzas, where each stanza has exactly 4 lines.",
            "category": "detectable_format",
            "verifiable": "Must have 4 stanzas with 4 lines each",
            "difficulty": "Medium"
        }
    ],
    "keywords": [
        {
            "instruction": "Write a paragraph about space exploration that includes the words 'galaxy', 'telescope', and 'discovery'.",
            "category": "keywords",
            "verifiable": "All three keywords must appear",
            "difficulty": "Easy"
        },
        {
            "instruction": "Explain quantum computing without using any of these forbidden words: 'bit', 'computer', 'superposition', 'qubit'.",
            "category": "keywords",
            "verifiable": "None of the forbidden words can appear",
            "difficulty": "Hard"
        }
    ],
    "language": [
        {
            "instruction": "Write a 50-word description of Paris in French.",
            "category": "language",
            "verifiable": "Response must be in French",
            "difficulty": "Medium"
        },
        {
            "instruction": "Translate the following to Spanish: 'The weather is beautiful today.'",
            "category": "language",
            "verifiable": "Response must be in Spanish",
            "difficulty": "Easy"
        }
    ],
    "length_constraint": [
        {
            "instruction": "Write a story about friendship in exactly 250 words. No more, no less.",
            "category": "length_constraint",
            "verifiable": "Word count must be exactly 250",
            "difficulty": "Hard"
        },
        {
            "instruction": "Describe the ocean in at least 100 words but no more than 120 words.",
            "category": "length_constraint",
            "verifiable": "Word count must be between 100-120",
            "difficulty": "Medium"
        }
    ],
    "punctuation": [
        {
            "instruction": "Write a 100-word paragraph about technology without using any commas.",
            "category": "punctuation",
            "verifiable": "No commas allowed",
            "difficulty": "Medium"
        },
        {
            "instruction": "Create a 75-word description of music. End every sentence with an exclamation mark!",
            "category": "punctuation",
            "verifiable": "All sentences must end with !",
            "difficulty": "Medium"
        }
    ],
    "startend": [
        {
            "instruction": "Write about the importance of education. Your response must start with the word 'Education' and end with the word 'future'.",
            "category": "startend",
            "verifiable": "First word is 'Education', last word is 'future'",
            "difficulty": "Easy"
        },
        {
            "instruction": "Describe artificial intelligence. Begin your response with 'In the modern world' and conclude with 'transforming society'.",
            "category": "startend",
            "verifiable": "Must start and end with exact phrases",
            "difficulty": "Medium"
        }
    ]
};

// Category difficulty analysis based on Figure 2 (instruction-level strict accuracy)
// Values are approximate, read off the figure
const categoryAnalysis = {
    categories: [
        {
            name: "change_case",
            gpt4: 80,
            palm2s: 48,
            description: "Changing or maintaining case (uppercase/lowercase)",
            difficulty: "Medium",
            examples: ["All caps", "All lowercase", "Title case"]
        },
        {
            name: "combination",
            gpt4: 73,
            palm2s: 37,
            description: "Satisfying multiple constraints simultaneously",
            difficulty: "Hardest for both models",
            examples: ["Word count + keywords + format", "Multiple formatting rules"]
        },
        {
            name: "detectable_content",
            gpt4: 96,
            palm2s: 73,
            description: "Including specific phrases or sections",
            difficulty: "Easy",
            examples: ["Add postscript", "Include specific sentence"]
        },
        {
            name: "detectable_format",
            gpt4: 93,
            palm2s: 68,
            description: "Using specific formatting structures",
            difficulty: "Easy-Medium",
            examples: ["Bullet points", "Numbered lists", "Stanza structure"]
        },
        {
            name: "keywords",
            gpt4: 84,
            palm2s: 60,
            description: "Including or excluding specific words",
            difficulty: "Medium",
            examples: ["Include keywords", "Forbidden words"]
        },
        {
            name: "language",
            gpt4: 96,
            palm2s: 96,
            description: "Responding in a specific language",
            difficulty: "Easiest (tied performance)",
            examples: ["French", "Spanish", "German"]
        },
        {
            name: "length_constraint",
            gpt4: 72,
            palm2s: 40,
            description: "Precise word or character count",
            difficulty: "Hard",
            examples: ["Exactly 250 words", "Between 100-120 words"]
        },
        {
            name: "punctuation",
            gpt4: 66,
            palm2s: 53,
            description: "Specific punctuation rules",
            difficulty: "Hard",
            examples: ["No commas", "All exclamation marks"]
        },
        {
            name: "startend",
            gpt4: 93,
            palm2s: 45,
            description: "Starting/ending with specific words",
            difficulty: "Easy for GPT-4, Hard for PaLM 2 S",
            examples: ["Start with X", "End with Y"]
        }
    ],
    insights: {
        hardest: "combination - satisfying multiple constraints simultaneously is the hardest category for both models",
        easiest: "language - both models achieve ~96% accuracy on language-specific instructions",
        biggestGap: "startend - GPT-4 (93%) vs PaLM 2 S (45%), a 48-point gap",
        mostConsistent: "language - both models perform equally well at 96%"
    }
};

// Key metrics from Table 3
const overallMetrics = {
    gpt4: {
        promptLevelStrict: 76.89,
        promptLevelLoose: 79.10,
        instLevelStrict: 83.57,
        instLevelLoose: 85.37,
        strictLooseGap: 2.21 // prompt-level
    },
    palm2s: {
        promptLevelStrict: 43.07,
        promptLevelLoose: 46.95,
        instLevelStrict: 35.76,
        instLevelLoose: 59.11,
        strictLooseGap: 3.88 // prompt-level
    },
    insights: {
        gpt4Better: "GPT-4 significantly outperforms PaLM 2 S on instruction following",
        looseVsStrict: "Loose verification (allowing minor deviations) improves scores for both models",
        gapAnalysis: "The gap between strict and loose is larger for PaLM 2 S, suggesting it makes more near-miss errors"
    }
};
