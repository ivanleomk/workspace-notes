// MT-Bench Question Explorer - extends functionality from data.js
// This file handles additional explorer features

// Add example model responses for selected questions
const exampleResponses = {
    1: { // Writing - Hawaii travel blog
        good: "Aloha! My recent two-week journey through Hawaii was nothing short of magical. Beyond the pristine beaches and volcanic landscapes, I found myself deeply moved by the rich cultural heritage. Attending a traditional luau in Maui wasn't just entertainment—it was a window into centuries of Polynesian history, from the mesmerizing hula kahiko dances to the explanation of ancient navigation techniques. \n\nMust-see attractions: The Road to Hana remains breathtaking, but don't miss the lesser-known Waipi'o Valley on the Big Island. Engage with local culture at the Bishop Museum in Honolulu, and if you can, participate in a taro farm tour to understand the sacred connection between Hawaiians and their land. The aloha spirit isn't just a greeting—it's a way of life I carried home with me.",
        poor: "Hawaii is really nice. I went to the beach and it was pretty. The food was good too. There are volcanoes which are cool. You should definitely go if you get a chance. The weather is warm."
    }
};

function enhanceExplorer() {
    // Add filter by difficulty or category features
    const mtBenchDisplay = document.getElementById('mtbench-display');
    if (!mtBenchDisplay) return;
    
    // Add a "Show Example Responses" toggle for questions
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        // Add a note about multi-turn structure
        const noteDiv = document.createElement('div');
        noteDiv.className = 'info-box';
        noteDiv.style.marginBottom = '20px';
        noteDiv.innerHTML = `
            <h4>About Multi-Turn Structure</h4>
            <p>
                Each MT-Bench question has <strong>two turns</strong>. Turn 2 always builds on Turn 1, testing:
            </p>
            <ul>
                <li><strong>Context retention:</strong> Does the model remember what it said?</li>
                <li><strong>Instruction adaptation:</strong> Can it modify its previous response?</li>
                <li><strong>Coherence:</strong> Do both turns form a logical conversation?</li>
            </ul>
            <p>
                Single-turn benchmarks (MMLU, GSM8K) miss this conversational dimension entirely. Real users 
                rarely ask just one question—they follow up, refine, and explore. MT-Bench captures this reality.
            </p>
        `;
        
        // Insert note before the explorer display
        if (mtBenchDisplay.previousElementSibling?.id !== 'mtbench-note') {
            noteDiv.id = 'mtbench-note';
            mtBenchDisplay.parentNode.insertBefore(noteDiv, mtBenchDisplay);
        }
    }
}

// Add comparison view for judge evaluation
function showJudgeComparison(questionId) {
    const responses = exampleResponses[questionId];
    if (!responses) return;
    
    const comparisonHTML = `
        <div style="margin-top: 20px; padding: 15px; background: var(--bg-secondary); border-radius: 8px;">
            <h4 style="color: var(--accent-primary);">Example Judge Evaluation</h4>
            
            <div style="margin-bottom: 20px;">
                <h5 style="color: var(--success);">✓ High-Quality Response (GPT-4 Score: 9/10)</h5>
                <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 6px; border-left: 4px solid var(--success);">
                    <pre style="white-space: pre-wrap; margin: 0; font-family: inherit; font-size: 0.95em;">${responses.good}</pre>
                </div>
                <p style="margin-top: 10px; font-size: 0.9em; color: var(--text-secondary);">
                    <strong>Why high score:</strong> Engaging narrative voice, specific cultural details (luau, hula kahiko, Bishop Museum), 
                    actionable recommendations, demonstrates cultural respect and depth of experience.
                </p>
            </div>
            
            <div>
                <h5 style="color: var(--error);">✗ Low-Quality Response (GPT-4 Score: 3/10)</h5>
                <div style="background: rgba(239, 68, 68, 0.1); padding: 15px; border-radius: 6px; border-left: 4px solid var(--error);">
                    <pre style="white-space: pre-wrap; margin: 0; font-family: inherit; font-size: 0.95em;">${responses.poor}</pre>
                </div>
                <p style="margin-top: 10px; font-size: 0.9em; color: var(--text-secondary);">
                    <strong>Why low score:</strong> Generic observations, no specific cultural content, lacks engaging details, 
                    reads like a placeholder rather than a genuine travel blog post.
                </p>
            </div>
        </div>
    `;
    
    return comparisonHTML;
}

// Initialize enhancements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceExplorer);
} else {
    enhanceExplorer();
}
