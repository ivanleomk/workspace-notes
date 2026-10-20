// Charts for SimPO lesson
document.addEventListener('DOMContentLoaded', function() {
    // Chart 1: SimPO vs DPO on AlpacaEval 2 LC Win Rate
    const simpoVsDpoCtx = document.getElementById('simpo-vs-dpo-chart');
    if (simpoVsDpoCtx) {
        new Chart(simpoVsDpoCtx, {
            type: 'bar',
            data: {
                labels: ['Mistral-Base', 'Mistral-Instruct', 'Llama-3-Base', 'Llama-3-Instruct'],
                datasets: [
                    {
                        label: 'DPO',
                        data: [15.1, 26.8, 18.2, 40.3],
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'SimPO',
                        data: [21.5, 32.1, 22.0, 44.7],
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'SimPO vs DPO: AlpacaEval 2 LC Win Rate (%)',
                        font: { size: 16 }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}% LC`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 50,
                        title: {
                            display: true,
                            text: 'LC Win Rate (%)'
                        }
                    }
                }
            }
        });
    }

    // Chart 2: Gemma-2-9B-it Results
    const gemmaResultsCtx = document.getElementById('gemma-results-chart');
    if (gemmaResultsCtx) {
        new Chart(gemmaResultsCtx, {
            type: 'bar',
            data: {
                labels: ['AlpacaEval 2 LC (%)', 'Arena-Hard (%)'],
                datasets: [
                    {
                        label: 'Gemma-2-9B-it (Base)',
                        data: [51.1, 40.8],
                        backgroundColor: 'rgba(156, 163, 175, 0.7)',
                        borderColor: 'rgba(156, 163, 175, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Gemma-2-9B-DPO',
                        data: [67.8, 58.9],
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Gemma-2-9B-SimPO',
                        data: [72.4, 59.1],
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Gemma-2-9B-it: Base vs DPO vs SimPO',
                        font: { size: 16 }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const benchmark = context.label.includes('AlpacaEval') ? 'AlpacaEval 2 LC' : 'Arena-Hard';
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 80,
                        title: {
                            display: true,
                            text: 'Win Rate (%)'
                        }
                    }
                }
            }
        });
    }

    // Chart 3: Length Normalization Impact
    const lengthNormCtx = document.getElementById('length-norm-chart');
    if (lengthNormCtx) {
        new Chart(lengthNormCtx, {
            type: 'bar',
            data: {
                labels: ['Mistral-Base\nAlpacaEval 2 LC', 'Mistral-Instruct\nAlpacaEval 2 LC', 
                         'Mistral-Base\nArena-Hard', 'Mistral-Instruct\nArena-Hard'],
                datasets: [
                    {
                        label: 'SimPO with LN',
                        data: [21.5, 32.1, 16.6, 21.0],
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'SimPO without LN',
                        data: [11.9, 19.1, 9.4, 16.3],
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Length Normalization Impact on Win Rate (%)',
                        font: { size: 16 }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 35,
                        title: {
                            display: true,
                            text: 'Win Rate (%)'
                        }
                    }
                }
            }
        });
    }

    // Chart 4: SimPO vs All Baselines (Llama-3-Instruct)
    const baselinesCtx = document.getElementById('baselines-chart');
    if (baselinesCtx) {
        new Chart(baselinesCtx, {
            type: 'bar',
            data: {
                labels: ['RRHF', 'SLiC-HF', 'IPO', 'CPO', 'KTO', 'ORPO', 'DPO', 'R-DPO', 'SimPO'],
                datasets: [
                    {
                        label: 'AlpacaEval 2 LC Win Rate (%)',
                        data: [31.3, 26.9, 35.6, 28.9, 33.1, 28.5, 40.3, 41.1, 44.7],
                        backgroundColor: [
                            'rgba(156, 163, 175, 0.7)',
                            'rgba(156, 163, 175, 0.7)',
                            'rgba(156, 163, 175, 0.7)',
                            'rgba(156, 163, 175, 0.7)',
                            'rgba(156, 163, 175, 0.7)',
                            'rgba(156, 163, 175, 0.7)',
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(156, 163, 175, 0.7)',
                            'rgba(16, 185, 129, 0.7)'
                        ],
                        borderColor: [
                            'rgba(156, 163, 175, 1)',
                            'rgba(156, 163, 175, 1)',
                            'rgba(156, 163, 175, 1)',
                            'rgba(156, 163, 175, 1)',
                            'rgba(156, 163, 175, 1)',
                            'rgba(156, 163, 175, 1)',
                            'rgba(59, 130, 246, 1)',
                            'rgba(156, 163, 175, 1)',
                            'rgba(16, 185, 129, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: {
                    title: {
                        display: true,
                        text: 'Llama-3-Instruct: SimPO vs All Baselines (AlpacaEval 2 LC)',
                        font: { size: 16 }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.x.toFixed(1)}% LC`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 50,
                        title: {
                            display: true,
                            text: 'LC Win Rate (%)'
                        }
                    }
                }
            }
        });
    }
});
