// Visualizations for DPO lesson
// Data approximated from Rafailov et al. (2023) for educational purposes

// Reward vs KL divergence for controlled sentiment generation
// Approximated from Figure 3 of the DPO paper
const rewardKLData = {
    datasets: [
        {
            label: 'DPO',
            data: [
                {x: 0.05, y: 1.2},
                {x: 0.1, y: 1.5},
                {x: 0.15, y: 1.75},
                {x: 0.2, y: 1.85},
                {x: 0.25, y: 1.92},
                {x: 0.3, y: 1.95},
                {x: 0.35, y: 1.97}
            ],
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7
        },
        {
            label: 'PPO (learned RM)',
            data: [
                {x: 0.05, y: 0.9},
                {x: 0.1, y: 1.2},
                {x: 0.15, y: 1.4},
                {x: 0.2, y: 1.55},
                {x: 0.25, y: 1.65},
                {x: 0.3, y: 1.7},
                {x: 0.35, y: 1.72}
            ],
            borderColor: 'rgba(139, 92, 246, 1)',
            backgroundColor: 'rgba(139, 92, 246, 0.7)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7
        },
        {
            label: 'PPO-GT (oracle RM)',
            data: [
                {x: 0.05, y: 1.3},
                {x: 0.1, y: 1.6},
                {x: 0.15, y: 1.8},
                {x: 0.2, y: 1.95},
                {x: 0.25, y: 2.02},
                {x: 0.3, y: 2.05},
                {x: 0.35, y: 2.08}
            ],
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7
        },
        {
            label: 'SFT Baseline',
            data: [
                {x: 0, y: 0.5}
            ],
            borderColor: 'rgba(203, 213, 225, 1)',
            backgroundColor: 'rgba(203, 213, 225, 0.7)',
            borderWidth: 3,
            pointRadius: 7,
            pointHoverRadius: 9
        }
    ]
};

// Win rates on TL;DR summarization (Table 1 from paper)
const winRateData = {
    labels: ['SFT Baseline', 'PPO (RLHF)', 'DPO (β=0.2)'],
    datasets: [{
        label: 'GPT-4 Win Rate vs SFT (%)',
        data: [50, 58, 61],
        backgroundColor: [
            'rgba(203, 213, 225, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(59, 130, 246, 0.7)'
        ],
        borderColor: [
            'rgba(203, 213, 225, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 2
    }]
};

// DPO win rates across temperatures (Table 2 from paper)
const temperatureData = {
    labels: ['T=0.0 (greedy)', 'T=0.5', 'T=1.0'],
    datasets: [{
        label: 'DPO Win Rate vs SFT (%)',
        data: [55, 58, 60],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
    }]
};

function createCharts() {
    // Reward vs KL chart
    const rewardKLCtx = document.getElementById('reward-kl-chart');
    if (rewardKLCtx) {
        new Chart(rewardKLCtx, {
            type: 'line',
            data: rewardKLData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#f1f5f9',
                            font: {
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Reward vs KL Divergence: Controlled Sentiment Generation',
                        color: '#f1f5f9',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': Reward=' + context.parsed.y.toFixed(2) + ', KL=' + context.parsed.x.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'KL Divergence from Reference Policy',
                            color: '#cbd5e1',
                            font: {
                                size: 13
                            }
                        },
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Reward (Sentiment Score)',
                            color: '#cbd5e1',
                            font: {
                                size: 13
                            }
                        },
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
                        text: 'GPT-4 Win Rates: TL;DR Summarization',
                        color: '#f1f5f9',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Win rate: ' + context.parsed.y + '%';
                            },
                            afterLabel: function(context) {
                                if (context.dataIndex === 0) {
                                    return 'Baseline (by definition)';
                                } else if (context.dataIndex === 1) {
                                    return '+8pp over baseline';
                                } else {
                                    return '+11pp over baseline, +3pp over PPO';
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 70,
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
                            text: 'Win Rate vs SFT (%)',
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

    // Temperature chart
    const temperatureCtx = document.getElementById('temperature-chart');
    if (temperatureCtx) {
        new Chart(temperatureCtx, {
            type: 'bar',
            data: temperatureData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'DPO Performance Across Sampling Temperatures',
                        color: '#f1f5f9',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Win rate: ' + context.parsed.y + '%';
                            },
                            afterLabel: function(context) {
                                const baseline = 50;
                                const diff = context.parsed.y - baseline;
                                return '+' + diff + 'pp over SFT baseline';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 70,
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
                            text: 'DPO Win Rate vs SFT (%)',
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
