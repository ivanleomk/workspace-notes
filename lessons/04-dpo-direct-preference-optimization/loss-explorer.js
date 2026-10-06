// Interactive DPO loss explorer
// Visualize how DPO loss and gradient weight change with different parameters

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function updateLossDisplay() {
    const beta = parseFloat(document.getElementById('beta-slider').value);
    const logProbRatioW = parseFloat(document.getElementById('logprob-ratio-w-slider').value);
    const logProbRatioL = parseFloat(document.getElementById('logprob-ratio-l-slider').value);
    
    // Update display values
    document.getElementById('beta-value').textContent = beta.toFixed(2);
    document.getElementById('logprob-ratio-w-value').textContent = logProbRatioW.toFixed(2);
    document.getElementById('logprob-ratio-l-value').textContent = logProbRatioL.toFixed(2);
    
    // Compute implicit rewards
    const rewardW = beta * logProbRatioW;
    const rewardL = beta * logProbRatioL;
    const rewardDiff = rewardW - rewardL;
    
    // Compute preference probability (model thinks chosen is better)
    const preferenceProb = sigmoid(rewardDiff);
    
    // Compute DPO loss
    const loss = -Math.log(preferenceProb);
    
    // Compute gradient weight (probability model is wrong)
    const gradientWeight = sigmoid(rewardL - rewardW);
    
    // Update display
    const display = document.getElementById('loss-display');
    if (!display) return;
    
    let interpretation = '';
    if (rewardDiff > 1.5) {
        interpretation = '<strong>Model is confident and correct:</strong> The chosen response has much higher implicit reward than rejected. Loss is low (~0), gradient is small. The model has already learned this preference.';
    } else if (rewardDiff > 0 && rewardDiff <= 1.5) {
        interpretation = '<strong>Model is slightly correct:</strong> The chosen response has higher reward, but the margin is small. Moderate loss and gradient—the model is learning but not fully confident.';
    } else if (Math.abs(rewardDiff) <= 0.1) {
        interpretation = '<strong>Model is uncertain:</strong> The implicit rewards are nearly equal. Loss is moderate (around 0.69), gradient weight is ~0.5. The model cannot distinguish which response is better yet.';
    } else if (rewardDiff < 0 && rewardDiff >= -1.5) {
        interpretation = '<strong>Model is slightly wrong:</strong> The rejected response has higher reward than chosen. Loss is high, gradient weight increases. The model needs to learn this preference.';
    } else {
        interpretation = '<strong>Model is confident but wrong:</strong> The rejected response has much higher reward. Loss is very high, gradient weight approaches 1.0. The model will receive a strong correction signal.';
    }
    
    display.innerHTML = `
        <h4>Computed Values</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
                <strong>Implicit Reward (Chosen):</strong><br>
                <code>r(y<sub>w</sub>) = β × log-ratio = ${beta.toFixed(2)} × ${logProbRatioW.toFixed(2)} = ${rewardW.toFixed(3)}</code>
            </div>
            <div>
                <strong>Implicit Reward (Rejected):</strong><br>
                <code>r(y<sub>l</sub>) = β × log-ratio = ${beta.toFixed(2)} × ${logProbRatioL.toFixed(2)} = ${rewardL.toFixed(3)}</code>
            </div>
        </div>
        
        <div style="background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <strong>Reward Difference:</strong> <code>r(y<sub>w</sub>) - r(y<sub>l</sub>) = ${rewardDiff.toFixed(3)}</code><br>
            <strong>Preference Probability:</strong> <code>P(y<sub>w</sub> ≻ y<sub>l</sub>) = σ(${rewardDiff.toFixed(3)}) = ${(preferenceProb * 100).toFixed(1)}%</code><br>
            <strong>DPO Loss:</strong> <code>-log(σ(...)) = ${loss.toFixed(4)}</code><br>
            <strong>Gradient Weight:</strong> <code>σ(r<sub>l</sub> - r<sub>w</sub>) = ${gradientWeight.toFixed(4)}</code>
        </div>
        
        <h4>Interpretation</h4>
        <p>${interpretation}</p>
        
        <h4>What Happens During Training</h4>
        <ul>
            <li><strong>If chosen has higher reward (current state):</strong> 
                ${rewardW > rewardL 
                    ? `The model is correct. Gradient is ${gradientWeight < 0.3 ? 'small' : 'moderate'}—not much update needed.`
                    : `The model is wrong! Gradient is ${gradientWeight > 0.7 ? 'large' : 'moderate'}—expect a strong correction.`}
            </li>
            <li><strong>Goal of training:</strong> Increase log(π<sub>θ</sub>(y<sub>w</sub>|x)) and decrease log(π<sub>θ</sub>(y<sub>l</sub>|x)) 
                relative to π<sub>ref</sub>, which increases the reward difference and lowers loss.
            </li>
            <li><strong>Effect of β:</strong> ${beta < 0.2 
                ? 'Low β = aggressive learning, large gradients, higher KL divergence.'
                : beta > 0.5
                    ? 'High β = conservative learning, small gradients, lower KL divergence.'
                    : 'Moderate β = balanced learning.'}
            </li>
        </ul>
    `;
}

function initLossExplorer() {
    const betaSlider = document.getElementById('beta-slider');
    const logProbWSlider = document.getElementById('logprob-ratio-w-slider');
    const logProbLSlider = document.getElementById('logprob-ratio-l-slider');
    
    if (!betaSlider || !logProbWSlider || !logProbLSlider) {
        return; // Explorer not present on this page
    }
    
    // Initial update
    updateLossDisplay();
    
    // Add event listeners
    betaSlider.addEventListener('input', updateLossDisplay);
    logProbWSlider.addEventListener('input', updateLossDisplay);
    logProbLSlider.addEventListener('input', updateLossDisplay);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLossExplorer);
} else {
    initLossExplorer();
}
