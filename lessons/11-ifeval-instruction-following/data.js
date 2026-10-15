// Instruction type data for IFEval lesson
const instructionTypes = [
    {
        name: "Include Keywords",
        category: "Keywords",
        description: "Include specific keywords in your response",
        example: "Write a product review. Include the keywords 'quality', 'affordable', and 'durable' in your response.",
        sampleResponse: "This product offers excellent quality at an affordable price point. The materials are durable and built to last, making it a great investment for long-term use.",
        verificationMethod: "Check if all specified keywords appear in the response (case-insensitive)",
        difficulty: "Easy to Moderate",
        modelPerformance: {
            gpt4: "~90%",
            palm2: "~70%"
        }
    },
    {
        name: "Keyword Frequency",
        category: "Keywords",
        description: "A specific word must appear exactly N times",
        example: "Write a short essay about climate change. The word 'environment' should appear exactly 4 times.",
        sampleResponse: "Climate change affects every aspect of our environment. Protecting the environment requires global cooperation. Environmental policies must prioritize sustainability. When we invest in our environment, we invest in our future.",
        verificationMethod: "Count occurrences of the specified word (case-insensitive) and verify it equals N",
        difficulty: "Hard",
        modelPerformance: {
            gpt4: "~75%",
            palm2: "~50%"
        }
    },
    {
        name: "Forbidden Words",
        category: "Keywords",
        description: "Specific words must NOT appear in the response",
        example: "Explain the benefits of renewable energy. Do not use the words 'solar', 'wind', or 'hydro' in your response.",
        sampleResponse: "Renewable energy sources offer sustainable alternatives to fossil fuels. Clean power generation reduces carbon emissions and air pollution. Emerging technologies continue to make green energy more accessible and cost-effective.",
        verificationMethod: "Check that none of the forbidden words appear in the response (case-insensitive)",
        difficulty: "Moderate to Hard",
        modelPerformance: {
            gpt4: "~85%",
            palm2: "~60%"
        }
    },
    {
        name: "Letter Frequency",
        category: "Keywords",
        description: "A specific letter must appear exactly N times",
        example: "Write a brief description of your favorite hobby. The letter 'e' should appear exactly 15 times.",
        sampleResponse: "My hobby is photography. I find joy in documenting occasions through visual arts. It allows artistic growth.",
        verificationMethod: "Count occurrences of the specified letter (case-insensitive) and verify it equals N",
        difficulty: "Very Hard",
        modelPerformance: {
            gpt4: "~60%",
            palm2: "~35%"
        }
    },
    {
        name: "Response Language",
        category: "Language",
        description: "Entire response must be in a specified language",
        example: "Describe your favorite vacation destination. Your ENTIRE response should be in Spanish, no other language is allowed.",
        sampleResponse: "Mi destino de vacaciones favorito es Barcelona, España. La ciudad combina hermosa arquitectura con excelente gastronomía. Las playas son impresionantes y la cultura es vibrante.",
        verificationMethod: "Use language detection to verify the entire response is in the specified language",
        difficulty: "Easy to Moderate (for models with multilingual training)",
        modelPerformance: {
            gpt4: "~95%",
            palm2: "~80%"
        }
    },
    {
        name: "Number Paragraphs",
        category: "Length Constraints",
        description: "Response must contain exactly N paragraphs",
        example: "Write about the importance of education. Your response should contain exactly 3 paragraphs. Separate paragraphs using: * * *",
        sampleResponse: "Education is the foundation of personal and societal progress. It empowers individuals with knowledge and critical thinking skills.\n\n* * *\n\nThrough education, people gain opportunities for better careers and quality of life. It reduces poverty and promotes social mobility.\n\n* * *\n\nInvesting in education benefits entire communities, fostering innovation and economic growth for generations to come.",
        verificationMethod: "Split by paragraph separator and count paragraphs",
        difficulty: "Moderate",
        modelPerformance: {
            gpt4: "~80%",
            palm2: "~60%"
        }
    },
    {
        name: "Number Words",
        category: "Length Constraints",
        description: "Response must contain at least/around/at most N words",
        example: "Explain the water cycle. Answer with at least 150 words.",
        sampleResponse: "The water cycle, also known as the hydrological cycle, describes the continuous movement of water on, above, and below Earth's surface. It begins with evaporation, where heat from the sun causes water from oceans, lakes, and rivers to transform into water vapor. This vapor rises into the atmosphere where cooler temperatures cause condensation, forming clouds. As water droplets accumulate and grow heavier, precipitation occurs in the form of rain, snow, sleet, or hail. When precipitation reaches the ground, it may infiltrate into the soil becoming groundwater, or flow over the surface as runoff into streams and rivers. Plants also participate through transpiration, releasing water vapor from their leaves. Eventually, this water returns to larger bodies of water, and the cycle repeats. This process is essential for distributing fresh water across the planet, regulating climate, and sustaining all forms of life on Earth.",
        verificationMethod: "Count words (split by whitespace) and verify it meets the constraint (≥N, ≈N, or ≤N)",
        difficulty: "Hard (especially exact counts)",
        modelPerformance: {
            gpt4: "~70%",
            palm2: "~45%"
        }
    },
    {
        name: "Number Sentences",
        category: "Length Constraints",
        description: "Response must contain at least/around/at most N sentences",
        example: "Describe the process of photosynthesis. Answer with exactly 5 sentences.",
        sampleResponse: "Photosynthesis is the process by which plants convert sunlight into chemical energy. Chlorophyll in plant cells absorbs light energy, primarily from the sun. This energy is used to convert carbon dioxide and water into glucose and oxygen. The glucose serves as food for the plant. The oxygen is released as a byproduct into the atmosphere.",
        verificationMethod: "Split by sentence-ending punctuation (.!?) and count sentences",
        difficulty: "Hard",
        modelPerformance: {
            gpt4: "~75%",
            palm2: "~50%"
        }
    },
    {
        name: "Postscript",
        category: "Detectable Content",
        description: "Response must end with a specific postscript",
        example: "Write a brief thank you email to a colleague. At the end of your response, explicitly add a postscript starting with 'P.S. Looking forward to working together!'",
        sampleResponse: "Dear Sarah,\n\nThank you so much for your help with the quarterly report. Your insights on the market analysis section were invaluable, and the final document is much stronger because of your contributions.\n\nBest regards,\nJohn\n\nP.S. Looking forward to working together!",
        verificationMethod: "Check if response ends with the specified postscript (with some tolerance for formatting)",
        difficulty: "Moderate",
        modelPerformance: {
            gpt4: "~85%",
            palm2: "~60%"
        }
    },
    {
        name: "Number Placeholder",
        category: "Detectable Content",
        description: "Response must contain at least N placeholders in square brackets",
        example: "Create a template for a job posting. The response must contain at least 4 placeholders represented by square brackets, such as [company name].",
        sampleResponse: "[Company name] is seeking a talented [job title] to join our [department] team. The ideal candidate will have [required years] of experience and a passion for innovation. Apply today!",
        verificationMethod: "Count occurrences of text enclosed in square brackets [like this]",
        difficulty: "Moderate",
        modelPerformance: {
            gpt4: "~80%",
            palm2: "~55%"
        }
    },
    {
        name: "Number Bullets",
        category: "Detectable Format",
        description: "Response must contain exactly N bullet points",
        example: "List the benefits of regular exercise. Your answer must contain exactly 4 bullet points. Use markdown bullets like: * This is a point",
        sampleResponse: "Regular exercise provides numerous health benefits:\n\n* Improves cardiovascular health and reduces risk of heart disease\n* Strengthens muscles and bones, preventing age-related decline\n* Boosts mental health by reducing stress and anxiety\n* Enhances sleep quality and overall energy levels",
        verificationMethod: "Count lines starting with bullet markers (*, -, +) or numbered list items",
        difficulty: "Moderate to Hard",
        modelPerformance: {
            gpt4: "~75%",
            palm2: "~50%"
        }
    },
    {
        name: "Title",
        category: "Detectable Format",
        description: "Response must contain a title wrapped in double angular brackets",
        example: "Write a short poem about autumn. Your answer must contain a title, wrapped in double angular brackets, such as <<Autumn's Beauty>>.",
        sampleResponse: "<<Golden Days of Fall>>\n\nLeaves drift down in amber swirls,\nCrisp air whispers through the trees.\nNature's canvas gently unfurls,\nPainted by the autumn breeze.",
        verificationMethod: "Check for text enclosed in << and >>",
        difficulty: "Moderate",
        modelPerformance: {
            gpt4: "~80%",
            palm2: "~60%"
        }
    },
    {
        name: "JSON Format",
        category: "Detectable Format",
        description: "Entire output must be valid JSON",
        example: "Provide information about a book including title, author, and year. Your entire output should be in JSON format.",
        sampleResponse: '{\n  "title": "To Kill a Mockingbird",\n  "author": "Harper Lee",\n  "year": 1960,\n  "genre": "Southern Gothic"\n}',
        verificationMethod: "Parse response as JSON and verify it's valid",
        difficulty: "Hard",
        modelPerformance: {
            gpt4: "~70%",
            palm2: "~40%"
        }
    }
];

// Model performance data for charts
const modelData = {
    gpt4: {
        promptStrict: 76.89,
        instStrict: 83.57,
        promptLoose: 79.10,
        instLoose: 85.37
    },
    palm2: {
        promptStrict: 43.07,
        instStrict: 35.76,
        promptLoose: 46.95,
        instLoose: 59.11
    }
};

// Approximate instruction-level strict accuracy by category (read off Figure 2)
const categoryPerformance = {
    change_case: {
        gpt4: 80,
        palm2: 48,
        description: "Changing or maintaining case (uppercase/lowercase)"
    },
    combination: {
        gpt4: 73,
        palm2: 37,
        description: "Satisfying multiple constraints simultaneously - hardest for both models"
    },
    detectable_content: {
        gpt4: 96,
        palm2: 73,
        description: "Including specific phrases or sections"
    },
    detectable_format: {
        gpt4: 93,
        palm2: 68,
        description: "Using specific formatting structures"
    },
    keywords: {
        gpt4: 84,
        palm2: 60,
        description: "Including or excluding specific words"
    },
    language: {
        gpt4: 96,
        palm2: 96,
        description: "Responding in a specific language - easiest category, both models tie"
    },
    length_constraint: {
        gpt4: 72,
        palm2: 40,
        description: "Precise word or character count"
    },
    punctuation: {
        gpt4: 66,
        palm2: 53,
        description: "Specific punctuation rules"
    },
    startend: {
        gpt4: 93,
        palm2: 45,
        description: "Starting/ending with specific words - biggest performance gap (48 points)"
    }
};
