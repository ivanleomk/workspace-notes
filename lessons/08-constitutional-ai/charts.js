// Charts for Constitutional AI lesson
// Based on figures from Bai et al. (2022) - https://arxiv.org/abs/2212.08073

// Initialize all charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createRevisionProgressChart();
    createModelComparisonChart();
    createScalingChart();
    createCritiqueVsDirectChart();
});

// Figure 5 - Progressive improvement with revisions
// Note: Approximate values from figure
function createRevisionProgressChart() {
    const ctx = document.getElementById('revisionProgressChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Initial\nResponse', 'Revision 1', 'Revision 2', 'Revision 3', 'Revision 4'],
            datasets: [{
                label: 'Harmlessness PM Score',
                data: [0.48, 0.72, 0.76, 0.78, 0.79],  // Approximate from Figure 5 (left)
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Helpfulness PM Score',
                data: [0.65, 0.58, 0.55, 0.53, 0.52],  // Approximate from Figure 5 (center)
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Combined HH PM Score',
                data: [0.51, 0.68, 0.71, 0.72, 0.73],  // Approximate from Figure 5 (right)
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
                    text: 'Approximate values from Figure 5 of the paper. Harmlessness improves monotonically with revisions.',
                    color: '#cbd5e1',
                    font: { size: 12 }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Preference Model Score',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' },
                    min: 0.4,
                    max: 0.85
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                }
            }
        }
    });
}

// Figure 2/3 - Harmlessness vs Helpfulness comparison
// Note: Qualitative Pareto frontier comparison
function createModelComparisonChart() {
    const ctx = document.getElementById('modelComparisonChart');
    if (!ctx) return;

    // These are illustrative points showing the qualitative Pareto frontier
    // from Figure 2 - RL-CAI achieves better harmlessness at given helpfulness
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Helpful RLHF (52B)',
                data: [
                    {x: 75, y: 45},
                    {x: 80, y: 43},
                    {x: 85, y: 40},
                    {x: 88, y: 38}
                ],
                backgroundColor: '#ef4444',
                borderColor: '#ef4444',
                pointRadius: 7,
                pointHoverRadius: 9
            }, {
                label: 'HH RLHF (52B)',
                data: [
                    {x: 65, y: 55},
                    {x: 68, y: 58},
                    {x: 70, y: 60},
                    {x: 72, y: 61}
                ],
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                pointRadius: 7,
                pointHoverRadius: 9
            }, {
                label: 'RL-CAI (52B)',
                data: [
                    {x: 70, y: 65},
                    {x: 75, y: 68},
                    {x: 80, y: 70},
                    {x: 83, y: 72}
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
                    text: 'Harmlessness vs Helpfulness Tradeoff (Qualitative)',
                    color: '#f1f5f9',
                    font: { size: 16, weight: 'bold' }
                },
                subtitle: {
                    display: true,
                    text: 'Illustrative Pareto frontier from Figure 2. RL-CAI achieves better harmlessness at given helpfulness.\nPoints to the right represent later training steps.',
                    color: '#cbd5e1',
                    font: { size: 12 }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: Helpfulness ${context.parsed.x}, Harmlessness ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Harmlessness Elo Score (higher is better)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' },
                    min: 30,
                    max: 80
                },
                x: {
                    title: {
                        display: true,
                        text: 'Helpfulness Elo Score (higher is better)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' },
                    min: 60,
                    max: 95
                }
            }
        }
    });
}

// Figure 3 - Model size scaling
// Note: Approximate from figure showing SL-CAI, RL-CAI, and RLHF across sizes
function createScalingChart() {
    const ctx = document.getElementById('scalingChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2.7B', '13B', '52B'],
            datasets: [{
                label: 'Helpful RLHF - Helpfulness',
                data: [72, 80, 88],  // Approximate from Figure 3
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: '#ef4444',
                borderWidth: 2
            }, {
                label: 'Helpful RLHF - Harmlessness',
                data: [40, 42, 45],  // Approximate from Figure 3
                backgroundColor: 'rgba(239, 68, 68, 0.4)',
                borderColor: '#ef4444',
                borderWidth: 2,
                borderDash: [5, 5]
            }, {
                label: 'RL-CAI - Helpfulness',
                data: [68, 75, 83],  // Approximate from Figure 3
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: '#10b981',
                borderWidth: 2
            }, {
                label: 'RL-CAI - Harmlessness',
                data: [60, 66, 72],  // Approximate from Figure 3
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
                    text: 'Approximate from Figure 3. Larger models improve both metrics. RL-CAI maintains better harmlessness.',
                    color: '#cbd5e1',
                    font: { size: 12 }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Elo Score (higher is better)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' },
                    min: 30,
                    max: 95
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
// Note: Approximate from figure comparing harmlessness PM scores
function createCritiqueVsDirectChart() {
    const ctx = document.getElementById('critiqueVsDirectChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2.7B', '13B', '52B'],
            datasets: [{
                label: 'Critiqued Revisions',
                data: [0.70, 0.74, 0.76],  // Approximate from Figure 7
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: '#3b82f6',
                borderWidth: 2
            }, {
                label: 'Direct Revisions',
                data: [0.65, 0.72, 0.75],  // Approximate from Figure 7
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
                    text: 'Approximate from Figure 7. Critiques help smaller models more; large models perform similarly.',
                    color: '#cbd5e1',
                    font: { size: 12 }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Harmlessness PM Score (higher is better)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' },
                    min: 0.6,
                    max: 0.8
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
