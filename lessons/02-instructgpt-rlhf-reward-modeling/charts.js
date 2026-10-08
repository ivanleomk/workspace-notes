// Visualizations for InstructGPT lesson
// Data approximated from Ouyang et al. (2022) for educational purposes

// Win rates: InstructGPT 175B vs baseline models
// Data from Section 4.1: direct comparisons with reported percentages
const winRateData = {
    labels: [
        'InstructGPT 175B\nvs\nGPT-3 175B',
        'InstructGPT 175B\nvs\nFew-shot GPT-3',
        'InstructGPT 175B\nvs\nFLAN',
        'InstructGPT 175B\nvs\nT0'
    ],
    datasets: [{
        label: 'InstructGPT Preferred (%)',
        data: [85, 71, 78, 79],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
    }]
};

// Training dataset sizes across RLHF stages
// From Table 1 of the InstructGPT paper
const datasetSizeData = {
    labels: ['SFT\nDemonstrations', 'Reward Model\nComparisons', 'PPO\nPrompts (unlabeled)'],
    datasets: [{
        label: 'Number of Examples',
        data: [13000, 33000, 31000],
        backgroundColor: [
            'rgba(139, 92, 246, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)'
        ],
        borderColor: [
            'rgba(139, 92, 246, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 2
    }]
};

function createCharts() {
    // Win rate chart
    const winrateCtx = document.getElementById('winrate-chart');
    if (winrateCtx) {
        new Chart(winrateCtx, {
            type: 'bar',
            data: winRateData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Human Labeler Preference: InstructGPT vs Baselines',
                        color: '#f1f5f9',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Preferred: ' + context.parsed.y + '%';
                            },
                            afterLabel: function(context) {
                                const loses = 100 - context.parsed.y;
                                return 'Baseline preferred: ' + loses + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#cbd5e1',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        },
                        title: {
                            display: true,
                            text: 'Win Rate (%)',
                            color: '#cbd5e1'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1',
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        }
                    }
                }
            }
        });
    }

    // Dataset size chart
    const datasetCtx = document.getElementById('dataset-chart');
    if (datasetCtx) {
        new Chart(datasetCtx, {
            type: 'bar',
            data: datasetSizeData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'RLHF Training Data by Stage',
                        color: '#f1f5f9',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Examples: ' + context.parsed.y.toLocaleString();
                            },
                            afterLabel: function(context) {
                                if (context.dataIndex === 0) {
                                    return 'Human-written (prompt, response) pairs';
                                } else if (context.dataIndex === 1) {
                                    return '~200K pairwise comparisons (4-9 outputs per prompt)';
                                } else {
                                    return 'Prompts for PPO training (no labels needed)';
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#cbd5e1',
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        },
                        title: {
                            display: true,
                            text: 'Number of Examples',
                            color: '#cbd5e1'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        }
                    }
                }
            }
        });
    }
}

// Load Chart.js and create charts
function loadChartJS() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = createCharts;
    document.head.appendChild(script);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadChartJS);
} else {
    loadChartJS();
}
