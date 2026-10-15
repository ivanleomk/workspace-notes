// Performance visualizations for IFEval
// Data from Zhou et al. (2023) "Instruction-Following Evaluation for Large Language Models"
// arXiv:2311.07911
// Figure 2 (page 5) - Instruction-level strict accuracy by category

// Radar chart data - 9 categories from Figure 2
// Values are approximate, read off the figure (instruction-level strict accuracy)
const radarData = {
    labels: [
        'change_case',
        'combination', 
        'detectable_content',
        'detectable_format',
        'keywords',
        'language',
        'length_constraint',
        'punctuation',
        'startend'
    ],
    datasets: [{
        label: 'GPT-4 (Nov 2023)',
        data: [80, 73, 96, 93, 84, 96, 72, 66, 93],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(239, 68, 68, 1)'
    }, {
        label: 'PaLM 2 S (Aug 2023)',
        data: [48, 37, 73, 68, 60, 96, 40, 53, 45],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
    }]
};

// Strict vs loose accuracy comparison - from Table 3
const strictLooseData = {
    labels: ['GPT-4', 'PaLM 2 S'],
    datasets: [{
        label: 'Prompt-level Strict',
        data: [76.89, 43.07],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2
    }, {
        label: 'Prompt-level Loose',
        data: [79.10, 46.95],
        backgroundColor: 'rgba(251, 146, 60, 0.7)',
        borderColor: 'rgba(251, 146, 60, 1)',
        borderWidth: 2
    }, {
        label: 'Inst-level Strict',
        data: [83.57, 35.76],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
    }, {
        label: 'Inst-level Loose',
        data: [85.37, 59.11],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2
    }]
};

function createCharts() {
    // Radar chart for per-category performance
    const radarCtx = document.getElementById('radar-chart');
    if (radarCtx) {
        new Chart(radarCtx, {
            type: 'radar',
            data: radarData,
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
                        text: 'Per-Category Performance (approximate, read off Figure 2, instruction-level strict accuracy)',
                        color: '#f1f5f9',
                        font: {
                            size: 14
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.r + '%';
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#cbd5e1',
                            backdropColor: 'rgba(15, 23, 42, 0.8)',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        },
                        pointLabels: {
                            color: '#cbd5e1',
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    // Strict vs loose comparison chart
    const strictLooseCtx = document.getElementById('strict-loose-chart');
    if (strictLooseCtx) {
        new Chart(strictLooseCtx, {
            type: 'bar',
            data: strictLooseData,
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
                        text: 'Strict vs Loose Accuracy (Table 3)',
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

// Initialize charts when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCharts);
} else {
    createCharts();
}
