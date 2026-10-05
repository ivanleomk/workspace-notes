// Interactive preference data for InstructGPT lesson
// These are toy examples illustrating the format and reasoning behind preference rankings

const preferenceExamples = [
    {
        prompt: "Summarize this article about climate change in 2-3 sentences:\n\n[Article text: A new study shows global temperatures have risen 1.1°C since pre-industrial times. Scientists warn that without immediate action, we could see 2-3°C warming by 2100, leading to severe consequences including sea level rise, extreme weather, and ecosystem collapse. The report calls for cutting emissions by 50% by 2030.]",
        responses: [
            {
                rank: 1,
                label: "Response A (Best)",
                text: "Global temperatures have increased 1.1°C since pre-industrial times. Without immediate action, we could face 2-3°C warming by 2100, causing severe impacts like sea level rise and extreme weather. Scientists recommend cutting emissions 50% by 2030.",
                reason: "Concise, accurate, follows the 2-3 sentence constraint, captures key points"
            },
            {
                rank: 2,
                label: "Response B",
                text: "The study found temperatures have risen 1.1 degrees Celsius. This is concerning and we need to act now to prevent further warming.",
                reason: "Accurate but less informative—misses the 2030 target and specific consequences"
            },
            {
                rank: 3,
                label: "Response C",
                text: "Climate change is happening and it's bad. We should do something about it.",
                reason: "Too vague, loses all the specific data from the article"
            },
            {
                rank: 4,
                label: "Response D (Worst)",
                text: "Global temperatures have risen 1.1°C since pre-industrial times, marking a significant shift in Earth's climate system. Scientists from leading research institutions warn that without immediate and coordinated international action to reduce greenhouse gas emissions, we could see catastrophic warming of 2-3°C by the end of the century. The consequences would be devastating, including sea level rise threatening coastal cities, more frequent and severe extreme weather events, widespread ecosystem collapse, food security challenges, and mass displacement of human populations. The report emphasizes the urgent need to cut emissions by approximately 50% by 2030 compared to current levels, requiring transformative changes across energy, transportation, and industrial sectors.",
                reason: "Way too long—violates the 2-3 sentence instruction, though technically accurate"
            }
        ]
    },
    {
        prompt: "Write a Python function that checks if a number is prime.",
        responses: [
            {
                rank: 1,
                label: "Response A (Best)",
                text: `def is_prime(n):
    """Check if a number is prime."""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True`,
                reason: "Correct, efficient (checks only odd divisors up to sqrt(n)), handles edge cases, includes docstring"
            },
            {
                rank: 2,
                label: "Response B",
                text: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True`,
                reason: "Correct but inefficient—checks all numbers up to n instead of sqrt(n)"
            },
            {
                rank: 3,
                label: "Response C",
                text: "A prime number is a number greater than 1 that has no divisors other than 1 and itself. Examples include 2, 3, 5, 7, 11, etc.",
                reason: "Explains what prime numbers are but doesn't provide the requested code"
            },
            {
                rank: 4,
                label: "Response D (Worst)",
                text: `def is_prime(n):
    return n > 1`,
                reason: "Completely wrong—marks all numbers > 1 as prime (e.g., 4, 6, 8 would return True)"
            }
        ]
    },
    {
        prompt: "What causes seasons on Earth?",
        responses: [
            {
                rank: 1,
                label: "Response A (Best)",
                text: "Seasons are caused by Earth's axial tilt of about 23.5 degrees. As Earth orbits the Sun, different hemispheres receive more direct sunlight at different times of year. When the Northern Hemisphere is tilted toward the Sun, it experiences summer while the Southern Hemisphere has winter, and vice versa. This tilt, not Earth's distance from the Sun, is what creates seasons.",
                reason: "Accurate, addresses common misconception (distance), explains the mechanism clearly"
            },
            {
                rank: 2,
                label: "Response B",
                text: "Earth's tilt causes seasons. When one hemisphere is tilted toward the Sun, it gets more sunlight and experiences summer, while the other hemisphere has winter.",
                reason: "Correct but less detailed—doesn't mention the 23.5° tilt or address misconceptions"
            },
            {
                rank: 3,
                label: "Response C",
                text: "Seasons happen because Earth is closer to the Sun in summer and farther away in winter.",
                reason: "Common misconception presented as fact—Earth's distance from Sun isn't the primary cause"
            },
            {
                rank: 4,
                label: "Response D (Worst)",
                text: "I'm not sure.",
                reason: "Completely unhelpful—refuses to answer a straightforward factual question"
            }
        ]
    }
];

// Display preference examples
function displayPreferences() {
    const exampleSelect = document.getElementById('example-select');
    const preferenceDisplay = document.getElementById('preference-display');
    
    function showExample(index) {
        const example = preferenceExamples[index];
        preferenceDisplay.innerHTML = '';
        
        // Show prompt
        const promptDiv = document.createElement('div');
        promptDiv.className = 'sample-question';
        promptDiv.innerHTML = `
            <h4>Prompt</h4>
            <p class="question-text" style="white-space: pre-wrap;">${example.prompt}</p>
        `;
        preferenceDisplay.appendChild(promptDiv);
        
        // Show ranked responses
        example.responses.forEach(response => {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'sample-question';
            
            let rankEmoji = '';
            if (response.rank === 1) rankEmoji = '🥇';
            else if (response.rank === 2) rankEmoji = '🥈';
            else if (response.rank === 3) rankEmoji = '🥉';
            else rankEmoji = '❌';
            
            responseDiv.innerHTML = `
                <h4>${rankEmoji} ${response.label}</h4>
                <div style="background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                    <pre style="white-space: pre-wrap; margin: 0; font-family: inherit; background: none; padding: 0;"><code>${response.text}</code></pre>
                </div>
                <div class="answer">
                    <strong>Why this ranking?</strong> ${response.reason}
                </div>
            `;
            preferenceDisplay.appendChild(responseDiv);
        });
        
        // Add explanation
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'info-box';
        explanationDiv.innerHTML = `
            <h4>How This Becomes Training Data</h4>
            <p>
                These rankings are converted into pairwise comparisons for reward model training:
            </p>
            <ul>
                <li><strong>A > B:</strong> Response A is preferred over B</li>
                <li><strong>A > C:</strong> Response A is preferred over C</li>
                <li><strong>A > D:</strong> Response A is preferred over D</li>
                <li><strong>B > C:</strong> Response B is preferred over C</li>
                <li><strong>B > D:</strong> Response B is preferred over D</li>
                <li><strong>C > D:</strong> Response C is preferred over D</li>
            </ul>
            <p>
                The reward model learns to assign scores such that preferred responses get higher values. 
                Over thousands of examples, it learns general patterns: what makes responses helpful, accurate, 
                concise, and aligned with user intent.
            </p>
        `;
        preferenceDisplay.appendChild(explanationDiv);
    }
    
    // Initial display
    showExample(0);
    
    // Update on selection change
    exampleSelect.addEventListener('change', (e) => {
        showExample(parseInt(e.target.value));
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', displayPreferences);
