// Visualizations for Lesson 05: LLM-as-a-Judge & MT-Bench
// Using Chart.js loaded from CDN

function initCharts() {
    // Wait for Chart.js to load from CDN
    if (typeof Chart === 'undefined') {
        // Load Chart.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
        script.onload = createCharts;
        document.head.appendChild(script);
    } else {
        createCharts();
    }
}

function createCharts() {
    // Agreement Chart
    const agreementCtx = document.getElementById('agreement-chart');
    if (agreementCtx) {
        new Chart(agreementCtx, {
            type: 'bar',
            data: judgeAgreementData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Agreement Rate (%)',
                            color: '#f1f5f9',
                            font: { size: 14 }
                        },
                        ticks: {
                            color: '#cbd5e1',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: '#475569'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Agreement: ' + context.parsed.y + '%';
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Judge Agreement with Human Preferences (500 pairwise comparisons)',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    }
                }
            }
        });
    }

    // Position Bias Chart
    const positionBiasCtx = document.getElementById('position-bias-chart');
    if (positionBiasCtx) {
        new Chart(positionBiasCtx, {
            type: 'bar',
            data: positionBiasData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'First Response Win Rate (%)',
                            color: '#f1f5f9',
                            font: { size: 14 }
                        },
                        ticks: {
                            color: '#cbd5e1',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: '#475569'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.parsed.y + '% prefer first response';
                                if (context.parsed.y === 50) {
                                    label += ' (no bias)';
                                } else if (context.parsed.y === 60) {
                                    label += ' (position bias present)';
                                }
                                return label;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Position Bias Mitigation: Swapping Reduces Bias to Random',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: 50,
                                yMax: 50,
                                borderColor: 'rgba(16, 185, 129, 0.5)',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    display: true,
                                    content: 'Random baseline (50%)',
                                    position: 'end',
                                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                                    color: '#fff'
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    // Agreement by Category Chart
    const categoryCtx = document.getElementById('category-agreement-chart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'bar',
            data: agreementByCategory,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Agreement Rate (%)',
                            color: '#f1f5f9',
                            font: { size: 14 }
                        },
                        ticks: {
                            color: '#cbd5e1',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: '#475569'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.x + '% agreement';
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'GPT-4 Agreement by MT-Bench Category (Math most reliable, Creative least)',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    }
                }
            }
        });
    }

    // Traditional Metrics Comparison
    const metricsCtx = document.getElementById('metrics-comparison-chart');
    if (metricsCtx) {
        const metricsData = {
            labels: ['BLEU', 'ROUGE', 'BERTScore', 'GPT-4 Judge'],
            datasets: [{
                label: 'Agreement with Humans (%)',
                data: [45, 52, 60, 80.3],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)'
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(16, 185, 129, 1)'
                ],
                borderWidth: 2
            }]
        };

        new Chart(metricsCtx, {
            type: 'bar',
            data: metricsData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Agreement with Human Judges (%)',
                            color: '#f1f5f9',
                            font: { size: 14 }
                        },
                        ticks: {
                            color: '#cbd5e1',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: '#475569'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Agreement: ' + context.parsed.y + '%';
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'LLM Judges Vastly Outperform Traditional Metrics',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    }
                }
            }
        });
    }
}

// Initialize charts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharts);
} else {
    initCharts();
}
