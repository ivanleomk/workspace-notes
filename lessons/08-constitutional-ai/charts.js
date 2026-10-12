// Charts for Constitutional AI lesson
// Based on figures from Bai et al. (2022) - https://arxiv.org/abs/2212.08073
// NOTE: Exact values cannot be reliably read from paper figures. Charts show qualitative trends only.

// Initialize all charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createRevisionProgressChart();
    createModelComparisonChart();
    createScalingChart();
    createCritiqueVsDirectChart();
});

// Figure 5 - Progressive improvement with revisions
// QUALITATIVE REPRESENTATION: Exact PM score values cannot be reliably read from the figure
// Figure shows three subplots with PM scores on y-axis (range approximately -1 to 3)
// Trends: Harmlessness increases, Helpfulness decreases slightly, Combined HH increases overall
function createRevisionProgressChart() {
    const ctx = document.getElementById('revisionProgressChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Initial\nResponse', 'Revision 1', 'Revision 2', 'Revision 3', 'Revision 4'],
            datasets: [{
                label: 'Harmlessness PM Score (Qualitative)',
                data: [0, 1.3, 1.7, 1.9, 2.0],  // Qualitative trend from Figure 5 (left)
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Helpfulness PM Score (Qualitative)',
                data: [0.5, -0.2, -0.5, -0.7, -0.8],  // Qualitative trend from Figure 5 (center)
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Combined HH PM Score (Qualitative)',
                data: [0, 0.7, 0.9, 1.0, 1.1],  // Qualitative trend from Figure 5 (right)
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Progressive Improvement with Multiple Revisions (52B Model)',
                    color: '#f1f5f9',
                    font: { size: 16, weight: 'bold' }
                },
                subtitle: {
                    display: true,
                    text: 'Qualitative representation of trends from Figure 5. Exact values cannot be reliably read from paper figure.\nPM scores shown (not normalized 0-1). Harmlessness improves monotonically with revisions.',
                    color: '#cbd5e1',
                    font: { size: 11 },
                    padding: { bottom: 10 }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Preference Model Score (not normalized)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                }
            }
        }
    });
}

// Figure 2 - Harmlessness vs Helpfulness comparison
// QUALITATIVE REPRESENTATION: Shows Pareto frontier concept from Figure 2
// Paper uses Elo scores (range: -200 to +200), not 0-100 percentages
// RL-CAI achieves better harmlessness at given helpfulness (better Pareto frontier)
function createModelComparisonChart() {
    const ctx = document.getElementById('modelComparisonChart');
    if (!ctx) return;

    // Qualitative representation showing relative positioning of different training methods
    // Points moving right represent later training steps
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Helpful-Only RLHF (52B)',
                data: [
                    {x: 20, y: -80},
                    {x: 50, y: -60},
                    {x: 80, y: -50},
                    {x: 100, y: -30}
                ],
                backgroundColor: '#ef4444',
                borderColor: '#ef4444',
                pointRadius: 7,
                pointHoverRadius: 9
            }, {
                label: 'HH RLHF (52B)',
                data: [
                    {x: -20, y: 10},
                    {x: 10, y: 20},
                    {x: 30, y: 30},
                    {x: 50, y: 35}
                ],
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                pointRadius: 7,
                pointHoverRadius: 9
            }, {
                label: 'RL-CAI (52B)',
                data: [
                    {x: 20, y: 50},
                    {x: 50, y: 80},
                    {x: 80, y: 120},
                    {x: 100, y: 150}
                ],
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                pointRadius: 7,
                pointHoverRadius: 9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Harmlessness vs Helpfulness Tradeoff (Qualitative Pareto Frontier)',
                    color: '#f1f5f9',
                    font: { size: 16, weight: 'bold' }
                },
                subtitle: {
                    display: true,
                    text: 'Qualitative representation of Figure 2 Pareto frontier. Exact Elo values cannot be reliably read.\nPaper uses Elo scores (range: -200 to +200). RL-CAI achieves better harmlessness at given helpfulness.\nPoints to the right represent later training steps.',
                    color: '#cbd5e1',
                    font: { size: 11 },
                    padding: { bottom: 10 }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: Qualitative positioning`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Harmlessness Elo Score (higher is better, only differences meaningful)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Helpfulness Elo Score (higher is better, only differences meaningful)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                }
            }
        }
    });
}

// Figure 3 - Model size scaling
// QUALITATIVE REPRESENTATION: Shows trends across model sizes from Figure 3
// Paper uses Elo scores (range: approximately -250 to +150), not 0-100 percentages
// Larger models achieve better scores; RL-CAI maintains better harmlessness than Helpful-only RLHF
function createScalingChart() {
    const ctx = document.getElementById('scalingChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2.7B', '13B', '52B'],
            datasets: [{
                label: 'Helpful-Only RLHF - Helpfulness',
                data: [0, 40, 80],  // Qualitative trend from Figure 3
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: '#ef4444',
                borderWidth: 2
            }, {
                label: 'Helpful-Only RLHF - Harmlessness',
                data: [-120, -80, -40],  // Qualitative trend from Figure 3
                backgroundColor: 'rgba(239, 68, 68, 0.4)',
                borderColor: '#ef4444',
                borderWidth: 2,
                borderDash: [5, 5]
            }, {
                label: 'RL-CAI - Helpfulness',
                data: [-30, 20, 60],  // Qualitative trend from Figure 3
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: '#10b981',
                borderWidth: 2
            }, {
                label: 'RL-CAI - Harmlessness',
                data: [-80, 0, 60],  // Qualitative trend from Figure 3
                backgroundColor: 'rgba(16, 185, 129, 0.4)',
                borderColor: '#10b981',
                borderWidth: 2,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Model Size Scaling: Helpfulness & Harmlessness Elo Scores',
                    color: '#f1f5f9',
                    font: { size: 16, weight: 'bold' }
                },
                subtitle: {
                    display: true,
                    text: 'Qualitative representation of trends from Figure 3. Exact Elo values cannot be reliably read.\nPaper uses Elo scores (range: ~-250 to +150). Larger models improve both metrics.\nRL-CAI maintains better harmlessness than Helpful-only RLHF across all sizes.',
                    color: '#cbd5e1',
                    font: { size: 11 },
                    padding: { bottom: 10 }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Elo Score (higher is better, only differences meaningful)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Model Size (Parameters)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                }
            }
        }
    });
}

// Figure 7 - Critiqued vs Direct Revisions
// QUALITATIVE REPRESENTATION: Shows trends from Figure 7
// Paper uses PM scores (range: approximately -1 to 2), not normalized 0-1 scores
// Critiques help smaller models more; large models perform similarly with or without critiques
function createCritiqueVsDirectChart() {
    const ctx = document.getElementById('critiqueVsDirectChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2.7B', '13B', '52B'],
            datasets: [{
                label: 'Critiqued Revisions',
                data: [0.5, 1.3, 1.8],  // Qualitative trend from Figure 7
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: '#3b82f6',
                borderWidth: 2
            }, {
                label: 'Direct Revisions',
                data: [0.0, 1.0, 1.7],  // Qualitative trend from Figure 7
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                borderColor: '#8b5cf6',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Critiqued vs Direct Revisions: Harmlessness PM Score',
                    color: '#f1f5f9',
                    font: { size: 16, weight: 'bold' }
                },
                subtitle: {
                    display: true,
                    text: 'Qualitative representation of trends from Figure 7. Exact PM scores cannot be reliably read.\nPaper uses PM scores (range: ~-1 to 2, not normalized 0-1). Critiques help smaller models more;\nlarge models (52B) perform similarly with or without critiques, though critiques always slightly better.',
                    color: '#cbd5e1',
                    font: { size: 11 },
                    padding: { bottom: 10 }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Harmlessness PM Score (not normalized)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Model Size (Parameters)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                }
            }
        }
    });
}
