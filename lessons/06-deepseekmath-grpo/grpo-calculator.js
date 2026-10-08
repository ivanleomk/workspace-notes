// Interactive GRPO Advantage Calculator
// Allows users to experiment with group-relative advantage calculation

document.addEventListener('DOMContentLoaded', function() {
    const groupSizeSlider = document.getElementById('group-size');
    const groupSizeDisplay = document.getElementById('group-size-display');
    const rewardInputsContainer = document.getElementById('reward-inputs');
    const meanRewardDisplay = document.getElementById('mean-reward');
    const advantageResultsContainer = document.getElementById('advantage-results');

    let currentGroupSize = 8;
    let rewards = Array(currentGroupSize).fill(0);

    // Initialize calculator
    function initCalculator() {
        groupSizeDisplay.textContent = currentGroupSize;
        renderRewardInputs();
        updateCalculations();
    }

    // Render reward input controls
    function renderRewardInputs() {
        rewardInputsContainer.innerHTML = '';
        
        const gridDiv = document.createElement('div');
        gridDiv.style.display = 'grid';
        gridDiv.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        gridDiv.style.gap = '15px';
        gridDiv.style.marginTop = '15px';

        for (let i = 0; i < currentGroupSize; i++) {
            const inputGroup = document.createElement('div');
            inputGroup.style.padding = '15px';
            inputGroup.style.background = 'var(--bg-secondary)';
            inputGroup.style.borderRadius = '8px';
            inputGroup.style.border = '1px solid var(--border)';

            const label = document.createElement('label');
            label.innerHTML = `<strong>Response ${i + 1}</strong>`;
            label.style.display = 'block';
            label.style.marginBottom = '8px';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '1';
            slider.step = '0.1';
            slider.value = rewards[i];
            slider.style.width = '100%';
            slider.style.marginBottom = '5px';

            const valueDisplay = document.createElement('span');
            valueDisplay.textContent = rewards[i].toFixed(1);
            valueDisplay.style.display = 'block';
            valueDisplay.style.textAlign = 'center';
            valueDisplay.style.fontSize = '18px';
            valueDisplay.style.fontWeight = 'bold';
            valueDisplay.style.color = rewards[i] > 0.5 ? 'var(--success)' : 'var(--text-secondary)';

            slider.addEventListener('input', function() {
                rewards[i] = parseFloat(this.value);
                valueDisplay.textContent = rewards[i].toFixed(1);
                valueDisplay.style.color = rewards[i] > 0.5 ? 'var(--success)' : 'var(--text-secondary)';
                updateCalculations();
            });

            // Quick preset buttons
            const presetDiv = document.createElement('div');
            presetDiv.style.display = 'flex';
            presetDiv.style.gap = '5px';
            presetDiv.style.marginTop = '8px';

            const wrongBtn = document.createElement('button');
            wrongBtn.textContent = 'Wrong (0)';
            wrongBtn.className = 'btn';
            wrongBtn.style.flex = '1';
            wrongBtn.style.fontSize = '12px';
            wrongBtn.style.padding = '5px';
            wrongBtn.addEventListener('click', function() {
                rewards[i] = 0;
                slider.value = 0;
                valueDisplay.textContent = '0.0';
                valueDisplay.style.color = 'var(--text-secondary)';
                updateCalculations();
            });

            const correctBtn = document.createElement('button');
            correctBtn.textContent = 'Correct (1)';
            correctBtn.className = 'btn';
            correctBtn.style.flex = '1';
            correctBtn.style.fontSize = '12px';
            correctBtn.style.padding = '5px';
            correctBtn.addEventListener('click', function() {
                rewards[i] = 1;
                slider.value = 1;
                valueDisplay.textContent = '1.0';
                valueDisplay.style.color = 'var(--success)';
                updateCalculations();
            });

            presetDiv.appendChild(wrongBtn);
            presetDiv.appendChild(correctBtn);

            inputGroup.appendChild(label);
            inputGroup.appendChild(slider);
            inputGroup.appendChild(valueDisplay);
            inputGroup.appendChild(presetDiv);
            gridDiv.appendChild(inputGroup);
        }

        rewardInputsContainer.appendChild(gridDiv);
    }

    // Update calculations and display
    function updateCalculations() {
        // Calculate mean reward (group baseline)
        const meanReward = rewards.reduce((sum, r) => sum + r, 0) / rewards.length;
        meanRewardDisplay.textContent = meanReward.toFixed(3);
        meanRewardDisplay.style.color = 'var(--accent-primary)';
        meanRewardDisplay.style.fontSize = '24px';
        meanRewardDisplay.style.fontWeight = 'bold';

        // Calculate advantages
        const advantages = rewards.map(r => r - meanReward);

        // Render advantage results
        advantageResultsContainer.innerHTML = '';

        advantages.forEach((advantage, i) => {
            const resultDiv = document.createElement('div');
            resultDiv.style.padding = '12px';
            resultDiv.style.marginTop = '10px';
            resultDiv.style.borderRadius = '6px';
            resultDiv.style.display = 'flex';
            resultDiv.style.justifyContent = 'space-between';
            resultDiv.style.alignItems = 'center';
            
            // Color code by advantage
            if (advantage > 0.001) {
                resultDiv.style.background = 'var(--success)' + '20';
                resultDiv.style.border = '2px solid var(--success)';
            } else if (advantage < -0.001) {
                resultDiv.style.background = 'var(--error)' + '20';
                resultDiv.style.border = '2px solid var(--error)';
            } else {
                resultDiv.style.background = 'var(--bg-tertiary)';
                resultDiv.style.border = '2px solid var(--border)';
            }

            const labelSpan = document.createElement('span');
            labelSpan.innerHTML = `<strong>Response ${i + 1}:</strong> r = ${rewards[i].toFixed(1)}`;

            const advantageSpan = document.createElement('span');
            const advantageText = advantage >= 0 ? `+${advantage.toFixed(3)}` : advantage.toFixed(3);
            advantageSpan.innerHTML = `<strong>A = ${advantageText}</strong>`;
            
            if (advantage > 0.001) {
                advantageSpan.style.color = 'var(--success)';
            } else if (advantage < -0.001) {
                advantageSpan.style.color = 'var(--error)';
            } else {
                advantageSpan.style.color = 'var(--text-secondary)';
            }

            const actionSpan = document.createElement('span');
            actionSpan.style.fontSize = '14px';
            actionSpan.style.fontStyle = 'italic';
            
            if (advantage > 0.001) {
                actionSpan.textContent = '→ Reinforce (increase probability)';
                actionSpan.style.color = 'var(--success)';
            } else if (advantage < -0.001) {
                actionSpan.textContent = '→ Suppress (decrease probability)';
                actionSpan.style.color = 'var(--error)';
            } else {
                actionSpan.textContent = '→ No update (neutral)';
                actionSpan.style.color = 'var(--text-secondary)';
            }

            const leftDiv = document.createElement('div');
            leftDiv.appendChild(labelSpan);

            const rightDiv = document.createElement('div');
            rightDiv.style.textAlign = 'right';
            rightDiv.appendChild(advantageSpan);
            rightDiv.appendChild(document.createElement('br'));
            rightDiv.appendChild(actionSpan);

            resultDiv.appendChild(leftDiv);
            resultDiv.appendChild(rightDiv);
            advantageResultsContainer.appendChild(resultDiv);
        });

        // Add summary statistics
        const summaryDiv = document.createElement('div');
        summaryDiv.style.marginTop = '20px';
        summaryDiv.style.padding = '15px';
        summaryDiv.style.background = 'var(--bg-tertiary)';
        summaryDiv.style.borderRadius = '8px';
        summaryDiv.style.border = '1px solid var(--border)';

        const positiveCount = advantages.filter(a => a > 0.001).length;
        const negativeCount = advantages.filter(a => a < -0.001).length;
        const neutralCount = advantages.filter(a => Math.abs(a) <= 0.001).length;

        summaryDiv.innerHTML = `
            <h4 style="margin-top: 0;">Summary Statistics</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                <div>
                    <strong>Responses to Reinforce:</strong><br>
                    <span style="color: var(--success); font-size: 20px;">${positiveCount}</span>
                </div>
                <div>
                    <strong>Responses to Suppress:</strong><br>
                    <span style="color: var(--error); font-size: 20px;">${negativeCount}</span>
                </div>
                <div>
                    <strong>Neutral Responses:</strong><br>
                    <span style="color: var(--text-secondary); font-size: 20px;">${neutralCount}</span>
                </div>
            </div>
            <p style="margin-top: 15px; margin-bottom: 0; font-size: 14px; color: var(--text-secondary);">
                <strong>Variance of Advantages:</strong> ${calculateVariance(advantages).toFixed(4)}
                (Lower variance = more stable training signal)
            </p>
        `;

        advantageResultsContainer.appendChild(summaryDiv);
    }

    // Calculate variance
    function calculateVariance(arr) {
        const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
        const squaredDiffs = arr.map(val => Math.pow(val - mean, 2));
        return squaredDiffs.reduce((sum, val) => sum + val, 0) / arr.length;
    }

    // Handle group size change
    groupSizeSlider.addEventListener('input', function() {
        const newSize = parseInt(this.value);
        
        if (newSize > currentGroupSize) {
            // Add new responses with reward 0
            while (rewards.length < newSize) {
                rewards.push(0);
            }
        } else if (newSize < currentGroupSize) {
            // Remove extra responses
            rewards = rewards.slice(0, newSize);
        }

        currentGroupSize = newSize;
        groupSizeDisplay.textContent = currentGroupSize;
        renderRewardInputs();
        updateCalculations();
    });

    // Preset scenarios
    function loadScenario(scenarioName) {
        switch(scenarioName) {
            case 'one-correct':
                rewards = Array(currentGroupSize).fill(0);
                rewards[0] = 1;
                break;
            case 'half-correct':
                rewards = rewards.map((_, i) => i < currentGroupSize / 2 ? 1 : 0);
                break;
            case 'all-correct':
                rewards = Array(currentGroupSize).fill(1);
                break;
            case 'gradient':
                rewards = rewards.map((_, i) => i / (currentGroupSize - 1));
                break;
        }
        renderRewardInputs();
        updateCalculations();
    }

    // Add preset scenario buttons
    const presetContainer = document.createElement('div');
    presetContainer.style.marginTop = '20px';
    presetContainer.style.marginBottom = '10px';
    presetContainer.innerHTML = '<h3>Quick Scenarios:</h3>';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.flexWrap = 'wrap';

    const scenarios = [
        { name: 'one-correct', label: '1 Correct, Rest Wrong' },
        { name: 'half-correct', label: 'Half Correct' },
        { name: 'all-correct', label: 'All Correct' },
        { name: 'gradient', label: 'Gradient (0 to 1)' }
    ];

    scenarios.forEach(scenario => {
        const btn = document.createElement('button');
        btn.textContent = scenario.label;
        btn.className = 'btn';
        btn.style.flex = '1';
        btn.style.minWidth = '150px';
        btn.addEventListener('click', () => loadScenario(scenario.name));
        buttonContainer.appendChild(btn);
    });

    presetContainer.appendChild(buttonContainer);
    
    const calculatorContainer = document.querySelector('.calculator-container');
    calculatorContainer.insertBefore(presetContainer, calculatorContainer.querySelector('h3'));

    // Initialize on load
    initCalculator();
});
