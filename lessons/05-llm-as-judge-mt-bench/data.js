// MT-Bench question examples and judge data for Lesson 05
// Examples inspired by the actual MT-Bench dataset (Zheng et al. 2023)

const mtBenchQuestions = {
    writing: [
        {
            id: 1,
            turn1: "Compose an engaging travel blog post about a recent trip to Hawaii, highlighting cultural experiences and must-see attractions.",
            turn2: "Rewrite your previous response. Start every sentence with the letter 'A'.",
            category: "Writing",
            explanation: "Turn 1 tests creative writing and travel content. Turn 2 tests instruction-following under constraints—can the model rewrite while maintaining coherence and adhering to the 'A' constraint?"
        },
        {
            id: 2,
            turn1: "Draft a professional email to a client apologizing for a missed deadline and proposing a solution.",
            turn2: "Take the email you just wrote and convert it into a casual text message to a friend explaining the same situation.",
            category: "Writing",
            explanation: "Turn 1 tests professional communication. Turn 2 tests register adaptation—can the model transform formal business writing into casual conversational tone while preserving key information?"
        }
    ],
    roleplay: [
        {
            id: 3,
            turn1: "Imagine you are a time traveler from the year 3000. Describe the world you come from and how technology has evolved.",
            turn2: "Now, as this time traveler, give me advice on what present-day technologies or practices we should abandon or change.",
            category: "Roleplay",
            explanation: "Turn 1 tests creative world-building and staying in character. Turn 2 tests whether the model maintains the time traveler persona while providing reasoned critique based on the fictional future context."
        },
        {
            id: 4,
            turn1: "Act as a travel agent. I want to plan a two-week trip to Japan in April. What should my itinerary look like?",
            turn2: "Great! Now I want to add three days in South Korea before going to Japan. Update my itinerary.",
            category: "Roleplay",
            explanation: "Turn 1 tests domain expertise (travel planning) and helpfulness. Turn 2 tests context retention and adaptation—can the model revise the plan coherently based on new requirements?"
        }
    ],
    reasoning: [
        {
            id: 5,
            turn1: "You have a 3-gallon jug and a 5-gallon jug. How do you measure exactly 4 gallons of water?",
            turn2: "Now, suppose you have only a 2-gallon jug and a 5-gallon jug. How would you measure exactly 3 gallons?",
            category: "Reasoning",
            explanation: "Turn 1 is a classic logic puzzle. Turn 2 tests whether the model can apply similar reasoning to a modified problem—demonstrating transfer of problem-solving strategy."
        },
        {
            id: 6,
            turn1: "There are three people in a room: Alice, Bob, and Carol. Alice is taller than Bob. Carol is shorter than Bob. Who is the tallest?",
            turn2: "If Dave enters the room and is taller than Alice, where does each person rank by height?",
            category: "Reasoning",
            explanation: "Turn 1 tests basic transitive reasoning. Turn 2 extends the problem with new information—can the model update the ranking correctly?"
        }
    ],
    math: [
        {
            id: 7,
            turn1: "If a train travels 120 miles in 2 hours, what is its average speed? Then, how long will it take to travel 300 miles at the same speed?",
            turn2: "Now suppose the train increases its speed by 25% for the second half of the 300-mile journey. How long does the entire journey take?",
            category: "Math",
            explanation: "Turn 1 tests basic rate calculation and application. Turn 2 introduces complexity—the model must handle a two-segment problem with different rates."
        },
        {
            id: 8,
            turn1: "What is 15% of 240? Show your work.",
            turn2: "If I want to leave a 15% tip on a $240 restaurant bill, but I only have $300 total, do I have enough money? Show the calculation.",
            category: "Math",
            explanation: "Turn 1 tests percentage calculation with explicit request for reasoning. Turn 2 applies the same calculation in a word problem context with comparison."
        }
    ],
    coding: [
        {
            id: 9,
            turn1: "Write a Python function that takes a string and returns True if it's a palindrome, False otherwise.",
            turn2: "Now modify your function to ignore spaces and punctuation when checking for palindromes.",
            category: "Coding",
            explanation: "Turn 1 tests basic string manipulation. Turn 2 extends requirements—can the model adapt the code to handle edge cases without rewriting from scratch?"
        },
        {
            id: 10,
            turn1: "Write a SQL query to find the top 5 customers by total purchase amount from tables 'customers' and 'orders'.",
            turn2: "Now modify the query to only include purchases from the last 6 months.",
            category: "Coding",
            explanation: "Turn 1 tests JOIN and aggregation. Turn 2 adds a date filter—testing incremental code refinement and correct WHERE clause placement."
        }
    ],
    extraction: [
        {
            id: 11,
            turn1: "Extract all dates mentioned in the following text: 'The conference will be held on March 15-17, 2024. Early bird registration closes on February 1st. The deadline for paper submissions was January 10, 2024.'",
            turn2: "Now extract all dates and classify each as a past deadline, current event, or future event relative to February 20, 2024.",
            category: "Extraction",
            explanation: "Turn 1 tests entity extraction (dates). Turn 2 adds temporal reasoning—the model must classify dates relative to a reference point."
        },
        {
            id: 12,
            turn1: "From this paragraph, extract all company names: 'Apple and Microsoft announced a partnership yesterday. Google and Amazon are competitors in cloud services. Tesla continues to innovate in electric vehicles.'",
            turn2: "Now create a structured list showing which companies are mentioned as partners, competitors, or standalone.",
            category: "Extraction",
            explanation: "Turn 1 tests named entity recognition. Turn 2 requires relationship extraction—going beyond entities to understand connections."
        }
    ],
    stem: [
        {
            id: 13,
            turn1: "Explain why the sky is blue in terms a high school student would understand.",
            turn2: "Now explain why sunsets are often red or orange, building on your previous explanation.",
            category: "STEM",
            explanation: "Turn 1 tests scientific explanation at appropriate level. Turn 2 tests whether the model can extend the concept (Rayleigh scattering) to a related phenomenon while maintaining coherence."
        },
        {
            id: 14,
            turn1: "What is the difference between DNA and RNA?",
            turn2: "Given those differences, why do you think cells use DNA for long-term storage and RNA for short-term functions?",
            category: "STEM",
            explanation: "Turn 1 tests factual biology knowledge. Turn 2 requires reasoning from those facts—asking for functional explanation based on structural differences."
        }
    ],
    humanities: [
        {
            id: 15,
            turn1: "Summarize the main causes of World War I.",
            turn2: "Which of those causes do you think was most significant, and why?",
            category: "Humanities",
            explanation: "Turn 1 tests historical knowledge recall. Turn 2 requires analysis and argumentation—the model must take a reasoned position based on the facts."
        },
        {
            id: 16,
            turn1: "What is utilitarianism in philosophy?",
            turn2: "Give an example of a moral dilemma where utilitarianism would give a different answer than Kantian ethics.",
            category: "Humanities",
            explanation: "Turn 1 tests conceptual understanding. Turn 2 tests deeper reasoning—can the model apply the concept contrastively to construct an illustrative scenario?"
        }
    ]
};

// Judge agreement data (from Zheng et al. 2023, Table 5, Setup S2 w/o tie)
// Paper reports: Human-Human 81-82%, GPT-4 85% both turns
// Claude and GPT-3.5 pairwise agreement rates not reported in main tables
const judgeAgreementData = {
    labels: ['Human-Human', 'GPT-4'],
    datasets: [{
        label: 'Agreement with Human Judges (%, Setup S2 w/o tie)',
        data: [81.5, 85.0],
        backgroundColor: [
            'rgba(16, 185, 129, 0.7)',
            'rgba(59, 130, 246, 0.7)'
        ],
        borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 2
    }]
};

// Position bias data (from Zheng et al. 2023, Section 4.3)
const positionBiasData = {
    labels: ['No Swap (Raw)', 'With Position Swap'],
    datasets: [{
        label: 'First Response Win Rate (%)',
        data: [60, 50],
        backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(16, 185, 129, 0.7)'],
        borderColor: ['rgba(239, 68, 68, 1)', 'rgba(16, 185, 129, 1)'],
        borderWidth: 2
    }]
};

// Agreement by category (approximate values from paper)
const agreementByCategory = {
    labels: ['Math', 'Coding', 'Reasoning', 'Extraction', 'STEM', 'Writing', 'Roleplay', 'Humanities'],
    datasets: [{
        label: 'GPT-4 vs Human Agreement (%)',
        data: [90, 85, 78, 82, 84, 75, 76, 80],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
    }]
};

// Display MT-Bench questions by category
function displayMTBenchQuestions() {
    const categorySelect = document.getElementById('category-select');
    const mtBenchDisplay = document.getElementById('mtbench-display');
    
    if (!categorySelect || !mtBenchDisplay) {
        return;
    }
    
    function showCategory(category) {
        const questions = mtBenchQuestions[category];
        mtBenchDisplay.innerHTML = '';
        
        questions.forEach((q, idx) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'sample-question';
            questionDiv.innerHTML = `
                <h4>Example ${idx + 1}: ${q.category}</h4>
                <div style="background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                    <strong style="color: var(--accent-primary);">Turn 1:</strong>
                    <p style="margin: 10px 0; color: var(--text-primary);">${q.turn1}</p>
                </div>
                <div style="background: rgba(139, 92, 246, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                    <strong style="color: var(--accent-secondary);">Turn 2:</strong>
                    <p style="margin: 10px 0; color: var(--text-primary);">${q.turn2}</p>
                </div>
                <div class="info-box" style="margin-top: 15px;">
                    <h4>What This Tests</h4>
                    <p>${q.explanation}</p>
                </div>
            `;
            mtBenchDisplay.appendChild(questionDiv);
        });
    }
    
    showCategory('writing');
    
    categorySelect.addEventListener('change', (e) => {
        showCategory(e.target.value);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayMTBenchQuestions);
} else {
    displayMTBenchQuestions();
}
