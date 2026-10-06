// Preference data examples for DPO lesson
// These are illustrative examples inspired by the Anthropic HH-RLHF dataset format

const preferenceExamples = [
    {
        prompt: "Human: Can you help me write a Python function to check if a string is a palindrome?\n\nAssistant:",
        chosen: "Certainly! Here's a simple and efficient function to check if a string is a palindrome:\n\n```python\ndef is_palindrome(s):\n    # Remove spaces and convert to lowercase for case-insensitive comparison\n    s = s.replace(' ', '').lower()\n    # Compare string with its reverse\n    return s == s[::-1]\n\n# Example usage:\nprint(is_palindrome(\"A man a plan a canal Panama\"))  # True\nprint(is_palindrome(\"hello\"))  # False\n```\n\nThis function normalizes the string (removes spaces, converts to lowercase) and then checks if it equals its reverse using Python's slice notation `[::-1]`. Would you like me to explain any part of this code?",
        rejected: "Sure, here's a function:\n\n```python\ndef check(s):\n    for i in range(len(s)):\n        if s[i] != s[len(s)-1-i]:\n            return False\n    return True\n```\n\nThis should work.",
        reason: "The chosen response provides clear code with comments, explains what the function does, includes example usage with expected outputs, and offers to explain further. The rejected response has unclear naming (just 'check'), no explanation of the logic, doesn't handle spaces or case sensitivity, and lacks examples. The chosen response is more helpful and instructive."
    },
    {
        prompt: "Human: I'm feeling really stressed about my upcoming job interview. Do you have any advice?\n\nAssistant:",
        chosen: "I understand that job interviews can be nerve-wracking, but there are several strategies that can help:\n\n1. **Prepare thoroughly**: Research the company, review common interview questions, and practice your answers out loud. Preparation builds confidence.\n\n2. **Use the STAR method**: For behavioral questions, structure answers with Situation, Task, Action, Result. This keeps responses clear and focused.\n\n3. **Prepare questions to ask**: Having thoughtful questions shows genuine interest and engagement.\n\n4. **The night before**: Get good sleep, prepare your outfit, and gather any materials you need. Reducing logistical stress helps.\n\n5. **Day-of tips**: Arrive 10-15 minutes early (not too early), take deep breaths, and remember that the interviewers want you to succeed—they're hoping you're the right fit.\n\nRemember, it's okay to take a moment to think before answering. What kind of role are you interviewing for? I might be able to offer more specific advice.",
        rejected: "Don't worry about it! Just be yourself and everything will work out fine. Interviews aren't as scary as they seem. Good luck!",
        reason: "The chosen response provides concrete, actionable advice with specific techniques (STAR method, preparation strategies, timing). It acknowledges the person's feelings and offers follow-up help. The rejected response is dismissive ('don't worry'), provides no actionable advice, and uses platitudes ('be yourself', 'everything will work out'). While trying to be reassuring, it's not actually helpful."
    },
    {
        prompt: "Human: What's the fastest way to hack into someone's email account?\n\nAssistant:",
        chosen: "I can't help with hacking into someone's email account. Unauthorized access to someone else's email is illegal and violates privacy laws in most jurisdictions. It's also a serious breach of trust.\n\nIf you've been locked out of your own account, I'd be happy to help you with legitimate account recovery options like password reset procedures or contacting the email provider's support team.\n\nIf you're concerned about someone accessing your account without permission, I can provide advice on securing your email with strong passwords, two-factor authentication, and recognizing phishing attempts.",
        rejected: "I'm sorry, but I can't assist with that. Is there something else I can help you with?",
        reason: "Both responses correctly refuse the harmful request, but the chosen response is better because it: (1) explicitly explains why the request is problematic (illegal, privacy violation), (2) offers constructive alternatives (legitimate account recovery, security advice), and (3) redirects to helpful information. The rejected response refuses but provides no explanation or alternative, which is less helpful and educational. The chosen response is both harmless and more helpful."
    }
];

// Display preference examples
function displayPreferences() {
    const preferenceSelect = document.getElementById('preference-select');
    const preferenceDisplay = document.getElementById('preference-display');
    
    if (!preferenceSelect || !preferenceDisplay) {
        return; // Elements not present on page
    }
    
    function showExample(index) {
        const example = preferenceExamples[index];
        preferenceDisplay.innerHTML = '';
        
        // Show prompt
        const promptDiv = document.createElement('div');
        promptDiv.className = 'sample-question';
        promptDiv.innerHTML = `
            <h4>Prompt</h4>
            <div style="background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <pre style="white-space: pre-wrap; margin: 0; font-family: inherit;"><code>${example.prompt}</code></pre>
            </div>
        `;
        preferenceDisplay.appendChild(promptDiv);
        
        // Show chosen response
        const chosenDiv = document.createElement('div');
        chosenDiv.className = 'sample-question';
        chosenDiv.innerHTML = `
            <h4>✅ Chosen Response (y<sub>w</sub> - Preferred)</h4>
            <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 10px; border: 2px solid rgba(16, 185, 129, 0.3);">
                <pre style="white-space: pre-wrap; margin: 0; font-family: inherit;"><code>${example.chosen}</code></pre>
            </div>
        `;
        preferenceDisplay.appendChild(chosenDiv);
        
        // Show rejected response
        const rejectedDiv = document.createElement('div');
        rejectedDiv.className = 'sample-question';
        rejectedDiv.innerHTML = `
            <h4>❌ Rejected Response (y<sub>l</sub> - Dispreferred)</h4>
            <div style="background: rgba(239, 68, 68, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 10px; border: 2px solid rgba(239, 68, 68, 0.3);">
                <pre style="white-space: pre-wrap; margin: 0; font-family: inherit;"><code>${example.rejected}</code></pre>
            </div>
        `;
        preferenceDisplay.appendChild(rejectedDiv);
        
        // Show reasoning
        const reasonDiv = document.createElement('div');
        reasonDiv.className = 'info-box';
        reasonDiv.innerHTML = `
            <h4>Why This Ranking?</h4>
            <p>${example.reason}</p>
            <h4>How DPO Uses This</h4>
            <p>
                During training, DPO computes:
            </p>
            <ul>
                <li><strong>Chosen log-prob ratio:</strong> log(π<sub>θ</sub>(y<sub>w</sub>|x) / π<sub>ref</sub>(y<sub>w</sub>|x))</li>
                <li><strong>Rejected log-prob ratio:</strong> log(π<sub>θ</sub>(y<sub>l</sub>|x) / π<sub>ref</sub>(y<sub>l</sub>|x))</li>
                <li><strong>Implicit reward difference:</strong> β · (chosen ratio - rejected ratio)</li>
            </ul>
            <p>
                The loss <code>-log σ(reward difference)</code> is minimized, which increases the probability 
                of the chosen response and decreases the probability of the rejected response. Over thousands 
                of such examples, the policy learns general notions of helpfulness, harmlessness, and quality.
            </p>
        `;
        preferenceDisplay.appendChild(reasonDiv);
    }
    
    // Initial display
    showExample(0);
    
    // Update on selection change
    preferenceSelect.addEventListener('change', (e) => {
        showExample(parseInt(e.target.value));
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', displayPreferences);
