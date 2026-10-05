// Visualizations for GSM8K lesson
// Data from Cobbe et al. (2021) "Training Verifiers to Solve Math Word Problems"

// Verifier performance data from Table 2 of the paper
const verifierData = {
    labels: ['Few-Shot\n(175B)', 'Fine-Tuned\nGenerator (6B)', 'Fine-Tuned\nGenerator (175B)', 'Verifier\nBest-of-100 (6B)', 'Verifier\nBest-of-100 (175B)'],
    datasets: [{
        label: 'GSM8K Solve Rate (%)',
        data: [16.4, 33.8, 55.1, 55.0, 71.5],
        backgroundColor: [
            'rgba(239, 68, 68, 0.7)',   // Red for few-shot baseline
            'rgba(251, 191, 36, 0.7)',  // Yellow for 6B generator
            'rgba(251, 191, 36, 0.9)',  // Darker yellow for 175B generator
            'rgba(59, 130, 246, 0.7)',  // Blue for 6B verifier
            'rgba(59, 130, 246, 0.9)'   // Darker blue for 175B verifier
        ],
        borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 2
    }]
};

// GSM8K vs MATH comparison (state-of-the-art models as of 2024)
const comparisonData = {
    labels: ['GPT-4 (2023)', 'Claude 3.5 Sonnet (2024)', 'Gemini 1.5 Pro (2024)', 'o1-preview (2024)'],
    datasets: [{
        label: 'GSM8K (%)',
        data: [92, 96, 90, 95],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2
    }, {
        label: 'MATH (%)',
        data: [52, 71, 63, 85],
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2
    }]
};

function createCharts() {
    // Verifier chart
    const verifierCtx = document.getElementById('verifier-chart');
    if (verifierCtx) {
        new Chart(verifierCtx, {
            type: 'bar',
            data: verifierData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Verifier Approach Dramatically Outperforms Direct Fine-Tuning',
                        color: '#f1f5f9',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Solve Rate: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 80,
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
                            text: 'GSM8K Solve Rate',
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

    // Comparison chart
    const comparisonCtx = document.getElementById('comparison-chart');
    if (comparisonCtx) {
        new Chart(comparisonCtx, {
            type: 'bar',
            data: comparisonData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#f1f5f9',
                            font: {
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'GSM8K (Grade-School) vs MATH (Competition-Level)',
                        color: '#f1f5f9',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + '%';
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
                            text: 'Solve Rate',
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
