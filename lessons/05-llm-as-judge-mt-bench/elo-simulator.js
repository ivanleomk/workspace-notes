// Interactive Elo Rating Simulator for Lesson 05
// Demonstrates how Chatbot Arena converts pairwise votes into rankings

class EloSimulator {
    constructor() {
        this.models = [
            { name: 'Model A', elo: 1500, wins: 0, losses: 0, ties: 0 },
            { name: 'Model B', elo: 1500, wins: 0, losses: 0, ties: 0 },
            { name: 'Model C', elo: 1500, wins: 0, losses: 0, ties: 0 },
            { name: 'Model D', elo: 1500, wins: 0, losses: 0, ties: 0 }
        ];
        this.history = [];
        this.kFactor = 32; // Standard Elo K-factor
    }

    // Calculate expected score (probability of winning)
    expectedScore(ratingA, ratingB) {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    }

    // Update ratings after a match
    updateRatings(winnerIdx, loserIdx, isTie = false) {
        const winner = this.models[winnerIdx];
        const loser = this.models[loserIdx];
        
        const expectedWinner = this.expectedScore(winner.elo, loser.elo);
        const expectedLoser = this.expectedScore(loser.elo, winner.elo);
        
        if (isTie) {
            // In a tie, both get 0.5 points
            winner.elo += this.kFactor * (0.5 - expectedWinner);
            loser.elo += this.kFactor * (0.5 - expectedLoser);
            winner.ties++;
            loser.ties++;
        } else {
            // Winner gets 1 point, loser gets 0
            winner.elo += this.kFactor * (1 - expectedWinner);
            loser.elo += this.kFactor * (0 - expectedLoser);
            winner.wins++;
            loser.losses++;
        }
        
        // Round Elo ratings
        winner.elo = Math.round(winner.elo);
        loser.elo = Math.round(loser.elo);
        
        // Record history
        this.history.push({
            winner: winner.name,
            loser: loser.name,
            isTie: isTie,
            ratings: this.models.map(m => ({ name: m.name, elo: m.elo }))
        });
    }

    reset() {
        this.models.forEach(model => {
            model.elo = 1500;
            model.wins = 0;
            model.losses = 0;
            model.ties = 0;
        });
        this.history = [];
    }

    getRankings() {
        return [...this.models].sort((a, b) => b.elo - a.elo);
    }
}

// Initialize simulator and UI
function initEloSimulator() {
    const container = document.getElementById('elo-simulator');
    if (!container) return;

    const simulator = new EloSimulator();

    container.innerHTML = `
        <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: var(--accent-primary);">Elo Rating Simulator</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
                Select two models and record who won (or if it was a tie). Watch the Elo ratings update after each vote.
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <label style="color: var(--text-primary); font-weight: bold; display: block; margin-bottom: 10px;">Model 1:</label>
                    <select id="model1-select" style="width: 100%; padding: 10px; background: var(--bg-secondary); color: var(--text-primary); border: 2px solid var(--border); border-radius: 6px; font-size: 1em;">
                        <option value="0">Model A</option>
                        <option value="1">Model B</option>
                        <option value="2">Model C</option>
                        <option value="3">Model D</option>
                    </select>
                </div>
                <div>
                    <label style="color: var(--text-primary); font-weight: bold; display: block; margin-bottom: 10px;">Model 2:</label>
                    <select id="model2-select" style="width: 100%; padding: 10px; background: var(--bg-secondary); color: var(--text-primary); border: 2px solid var(--border); border-radius: 6px; font-size: 1em;">
                        <option value="0">Model A</option>
                        <option value="1" selected>Model B</option>
                        <option value="2">Model C</option>
                        <option value="3">Model D</option>
                    </select>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 30px; flex-wrap: wrap;">
                <button id="model1-wins" class="btn" style="flex: 1; min-width: 120px;">Model 1 Wins</button>
                <button id="tie-btn" class="btn" style="flex: 1; min-width: 120px; background: var(--accent-secondary);">Tie</button>
                <button id="model2-wins" class="btn" style="flex: 1; min-width: 120px;">Model 2 Wins</button>
                <button id="reset-elo" class="btn" style="flex: 1; min-width: 120px; background: var(--warning);">Reset All</button>
            </div>
            
            <div id="elo-rankings" style="margin-bottom: 20px;"></div>
            
            <div id="elo-explanation" class="info-box"></div>
        </div>
    `;

    const model1Select = document.getElementById('model1-select');
    const model2Select = document.getElementById('model2-select');
    const model1WinsBtn = document.getElementById('model1-wins');
    const model2WinsBtn = document.getElementById('model2-wins');
    const tieBtn = document.getElementById('tie-btn');
    const resetBtn = document.getElementById('reset-elo');
    const rankingsDiv = document.getElementById('elo-rankings');
    const explanationDiv = document.getElementById('elo-explanation');

    function updateDisplay() {
        const rankings = simulator.getRankings();
        
        // Update rankings table
        let rankingsHTML = `
            <h4 style="margin-top: 0; color: var(--accent-secondary);">Current Rankings</h4>
            <table class="data-table" style="width: 100%; margin-bottom: 0;">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Model</th>
                        <th>Elo</th>
                        <th>Record (W-L-T)</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        rankings.forEach((model, idx) => {
            const record = `${model.wins}-${model.losses}-${model.ties}`;
            const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
            rankingsHTML += `
                <tr>
                    <td>${rankBadge} ${idx + 1}</td>
                    <td><strong>${model.name}</strong></td>
                    <td style="color: var(--accent-primary); font-weight: bold;">${model.elo}</td>
                    <td>${record}</td>
                </tr>
            `;
        });
        
        rankingsHTML += '</tbody></table>';
        rankingsDiv.innerHTML = rankingsHTML;
        
        // Update explanation
        if (simulator.history.length === 0) {
            explanationDiv.innerHTML = `
                <h4>How Elo Works</h4>
                <p>Each model starts at <strong>1500 Elo</strong> (baseline). When Model A beats Model B:</p>
                <ul>
                    <li>Model A gains Elo points (more if B was rated higher—an "upset")</li>
                    <li>Model B loses Elo points (fewer if A was rated higher—expected loss)</li>
                </ul>
                <p>The formula uses the <strong>Bradley-Terry model</strong>:</p>
                <p style="text-align: center; font-family: monospace; background: rgba(59, 130, 246, 0.1); padding: 10px; border-radius: 6px;">
                    P(A beats B) = 1 / (1 + 10^((Elo_B - Elo_A) / 400))
                </p>
                <p>Try recording some votes and watch the rankings emerge!</p>
            `;
        } else {
            const lastMatch = simulator.history[simulator.history.length - 1];
            const model1Idx = parseInt(model1Select.value);
            const model2Idx = parseInt(model2Select.value);
            const model1 = simulator.models[model1Idx];
            const model2 = simulator.models[model2Idx];
            
            const expectedProb = (simulator.expectedScore(model1.elo, model2.elo) * 100).toFixed(1);
            const eloGap = Math.abs(model1.elo - model2.elo);
            
            let prediction = '';
            if (eloGap < 50) {
                prediction = 'Close matchup—nearly 50/50';
            } else if (model1.elo > model2.elo) {
                prediction = `${model1.name} favored (${expectedProb}% expected win rate)`;
            } else {
                prediction = `${model2.name} favored (${(100 - parseFloat(expectedProb)).toFixed(1)}% expected win rate)`;
            }
            
            explanationDiv.innerHTML = `
                <h4>Last Match</h4>
                <p><strong>${lastMatch.winner}</strong> ${lastMatch.isTie ? 'tied with' : 'defeated'} <strong>${lastMatch.loser}</strong></p>
                <p>Total matches recorded: <strong>${simulator.history.length}</strong></p>
                
                <h4>Next Matchup Prediction</h4>
                <p><strong>${model1.name}</strong> (${model1.elo}) vs <strong>${model2.name}</strong> (${model2.elo})</p>
                <p style="color: var(--accent-primary);">${prediction}</p>
                <p style="font-size: 0.9em; color: var(--text-secondary); margin-top: 10px;">
                    Elo difference of <strong>${eloGap}</strong> points means the favorite wins <strong>${Math.max(expectedProb, 100 - expectedProb).toFixed(1)}%</strong> of the time.
                    A 100-point gap = ~64% win rate. 200 points = ~76%. 400 points = ~91%.
                </p>
            `;
        }
    }

    model1WinsBtn.addEventListener('click', () => {
        const idx1 = parseInt(model1Select.value);
        const idx2 = parseInt(model2Select.value);
        if (idx1 === idx2) {
            alert('Please select two different models!');
            return;
        }
        simulator.updateRatings(idx1, idx2, false);
        updateDisplay();
    });

    model2WinsBtn.addEventListener('click', () => {
        const idx1 = parseInt(model1Select.value);
        const idx2 = parseInt(model2Select.value);
        if (idx1 === idx2) {
            alert('Please select two different models!');
            return;
        }
        simulator.updateRatings(idx2, idx1, false);
        updateDisplay();
    });

    tieBtn.addEventListener('click', () => {
        const idx1 = parseInt(model1Select.value);
        const idx2 = parseInt(model2Select.value);
        if (idx1 === idx2) {
            alert('Please select two different models!');
            return;
        }
        simulator.updateRatings(idx1, idx2, true);
        updateDisplay();
    });

    resetBtn.addEventListener('click', () => {
        if (simulator.history.length > 0 && !confirm('Reset all ratings and history?')) {
            return;
        }
        simulator.reset();
        updateDisplay();
    });

    model1Select.addEventListener('change', updateDisplay);
    model2Select.addEventListener('change', updateDisplay);

    // Initial display
    updateDisplay();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEloSimulator);
} else {
    initEloSimulator();
}
