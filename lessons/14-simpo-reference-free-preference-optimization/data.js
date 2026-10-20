// Interactive reward margin explorer
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sliders and display
    const betaSlider = document.getElementById('beta-slider');
    const gammaSlider = document.getElementById('gamma-slider');
    const avgLogprobWSlider = document.getElementById('avg-logprob-w-slider');
    const lengthWSlider = document.getElementById('length-w-slider');
    const avgLogprobLSlider = document.getElementById('avg-logprob-l-slider');
    const lengthLSlider = document.getElementById('length-l-slider');
    
    if (!betaSlider) return; // Not on the right page
    
    const betaValue = document.getElementById('beta-value');
    const gammaValue = document.getElementById('gamma-value');
    const avgLogprobWValue = document.getElementById('avg-logprob-w-value');
    const lengthWValue = document.getElementById('length-w-value');
    const avgLogprobLValue = document.getElementById('avg-logprob-l-value');
    const lengthLValue = document.getElementById('length-l-value');
    
    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    function updateRewardDisplay() {
        const beta = parseFloat(betaSlider.value);
        const gamma = parseFloat(gammaSlider.value);
        const avgLogprobW = parseFloat(avgLogprobWSlider.value);
        const lengthW = parseInt(lengthWSlider.value);
        const avgLogprobL = parseFloat(avgLogprobLSlider.value);
        const lengthL = parseInt(lengthLSlider.value);
        
        // Update slider value displays
        betaValue.textContent = beta.toFixed(1);
        gammaValue.textContent = gamma.toFixed(1);
        avgLogprobWValue.textContent = avgLogprobW.toFixed(2);
        lengthWValue.textContent = lengthW;
        avgLogprobLValue.textContent = avgLogprobL.toFixed(2);
        lengthLValue.textContent = lengthL;
        
        // Calculate SimPO rewards
        const rewardW = beta * avgLogprobW;
        const rewardL = beta * avgLogprobL;
        const rewardDiff = rewardW - rewardL;
        const margin = rewardDiff - gamma;
        
        // Calculate loss
        const loss = -Math.log(sigmoid(margin));
        
        // Calculate preference probability
        const prefProb = sigmoid(margin);
        
        // Determine if model is correct
        const isCorrect = rewardDiff > gamma;
        
        // Display results
        const rewardDisplay = document.getElementById('reward-display');
        rewardDisplay.innerHTML = `
            <h4>Computed Values</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                <div>
                    <p><strong>Reward (chosen):</strong> ${rewardW.toFixed(3)}</p>
                    <p style="font-size: 0.9em; color: var(--text-secondary);">
                        r(x, y<sub>w</sub>) = β × avg_logprob = ${beta.toFixed(1)} × ${avgLogprobW.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p><strong>Reward (rejected):</strong> ${rewardL.toFixed(3)}</p>
                    <p style="font-size: 0.9em; color: var(--text-secondary);">
                        r(x, y<sub>l</sub>) = β × avg_logprob = ${beta.toFixed(1)} × ${avgLogprobL.toFixed(2)}
                    </p>
                </div>
            </div>
            <div style="padding: 15px; background: ${isCorrect ? 'var(--success-bg, #e8f5e9)' : 'var(--warning-bg, #fff3e0)'}; border-radius: 8px; margin: 15px 0;">
                <p><strong>Reward Difference:</strong> ${rewardDiff.toFixed(3)}</p>
                <p><strong>Target Margin:</strong> ${gamma.toFixed(1)}</p>
                <p><strong>Margin (reward_diff - γ):</strong> ${margin.toFixed(3)}</p>
                <p style="margin-top: 10px;">
                    ${isCorrect 
                        ? '✓ <strong>Correct:</strong> Reward difference exceeds target margin. Model successfully ranks y<sub>w</sub> > y<sub>l</sub> by at least γ.' 
                        : '✗ <strong>Needs improvement:</strong> Reward difference does not meet target margin. Model needs to increase separation.'}
                </p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                <div>
                    <p><strong>Preference Probability:</strong> ${(prefProb * 100).toFixed(1)}%</p>
                    <p style="font-size: 0.9em; color: var(--text-secondary);">
                        σ(margin) = probability model assigns to y<sub>w</sub> ≻ y<sub>l</sub>
                    </p>
                </div>
                <div>
                    <p><strong>SimPO Loss:</strong> ${loss.toFixed(3)}</p>
                    <p style="font-size: 0.9em; color: var(--text-secondary);">
                        -log(σ(margin)) — lower is better
                    </p>
                </div>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: var(--info-bg, #e3f2fd); border-radius: 8px;">
                <h5 style="margin-top: 0;">Key Observations:</h5>
                <ul style="margin: 0;">
                    <li><strong>Length independence:</strong> Even though y<sub>l</sub> has ${lengthL} tokens vs y<sub>w</sub>'s ${lengthW} tokens, 
                    the reward depends only on avg log-prob (quality per token), not total length.</li>
                    <li><strong>Margin effect:</strong> The γ parameter (${gamma.toFixed(1)}) requires the model to separate responses by at least that amount, 
                    encouraging confident distinctions and better generalization.</li>
                    <li><strong>Loss behavior:</strong> ${loss < 0.1 ? 'Very low loss indicates strong confidence in correct ranking.' 
                        : loss < 0.5 ? 'Moderate loss indicates reasonable confidence.' 
                        : 'High loss indicates the model is uncertain or incorrect.'}</li>
                </ul>
            </div>
        `;
    }
    
    // Attach event listeners
    betaSlider.addEventListener('input', updateRewardDisplay);
    gammaSlider.addEventListener('input', updateRewardDisplay);
    avgLogprobWSlider.addEventListener('input', updateRewardDisplay);
    lengthWSlider.addEventListener('input', updateRewardDisplay);
    avgLogprobLSlider.addEventListener('input', updateRewardDisplay);
    lengthLSlider.addEventListener('input', updateRewardDisplay);
    
    // Initial display
    updateRewardDisplay();
});
