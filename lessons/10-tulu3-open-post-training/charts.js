// Charts for Tülu 3 lesson

// Wait for DOM and Chart.js to load
document.addEventListener('DOMContentLoaded', function() {
    // Pipeline overview chart
    const pipelineCtx = document.getElementById('pipelineChart');
    if (pipelineCtx) {
        new Chart(pipelineCtx, {
            type: 'bar',
            data: {
                labels: ['Data Curation', 'SFT', 'DPO', 'RLVR'],
                datasets: [{
                    label: 'Training Data Size (thousands)',
                    data: [23300, 939, 334, 30], // DPO: 334,302 pairs for 70B, 271,409 for 8B (Table 15); RLVR: 29,946 prompts (arXiv 2411.15124)
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(251, 146, 60, 0.8)'
                    ],
                    borderColor: [
                        'rgb(99, 102, 241)',
                        'rgb(139, 92, 246)',
                        'rgb(236, 72, 153)',
                        'rgb(251, 146, 60)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Tülu 3 Pipeline Stages',
                        font: { size: 16 }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.parsed.y;
                                if (context.dataIndex === 0) {
                                    return 'Curated prompts: 23.3M';
                                } else if (context.dataIndex === 1) {
                                    return 'SFT examples: 939K';
                                } else if (context.dataIndex === 2) {
                                    return 'DPO pairs: 271K (8B) / 334K (70B) from Table 15';
                                } else {
                                    return 'RLVR prompts: ~30K';
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Data Size (thousands)'
                        },
                        type: 'logarithmic'
                    }
                }
            }
        });
    }

    // Stage-by-stage performance chart (70B model from Table 5)
    const stageCtx = document.getElementById('stageProgressChart');
    if (stageCtx) {
        new Chart(stageCtx, {
            type: 'line',
            data: {
                labels: ['SFT', 'DPO', 'Final (RLVR)'],
                datasets: [
                    {
                        label: 'MATH',
                        data: [53.7, 62.3, 63.0],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'GSM8K',
                        data: [91.1, 93.5, 93.5],
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'AlpacaEval 2',
                        data: [26.3, 49.6, 49.8],
                        borderColor: 'rgb(236, 72, 153)',
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'IFEval',
                        data: [82.1, 82.6, 83.2],
                        borderColor: 'rgb(251, 146, 60)',
                        backgroundColor: 'rgba(251, 146, 60, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Safety',
                        data: [94.4, 89.0, 88.3],
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Tülu 3 70B: Performance Across Training Stages',
                        font: { size: 16 }
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Score (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Training Stage'
                        }
                    }
                }
            }
        });
    }

    // Competitor comparison chart (70B models, Table 5)
    const competitorCtx = document.getElementById('competitorChart');
    if (competitorCtx) {
        new Chart(competitorCtx, {
            type: 'radar',
            data: {
                labels: ['MMLU', 'MATH', 'GSM8K', 'HumanEval', 'IFEval', 'AlpacaEval', 'Safety'],
                datasets: [
                    {
                        label: 'Tülu 3 70B',
                        data: [83.1, 63.0, 93.5, 92.4, 83.2, 49.8, 88.3],
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        borderWidth: 2
                    },
                    {
                        label: 'Llama 3.1 70B Instruct',
                        data: [85.3, 56.4, 93.7, 93.6, 88.0, 33.4, 76.5],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderWidth: 2
                    },
                    {
                        label: 'Qwen 2.5 72B Instruct',
                        data: [85.5, 75.9, 89.5, 94.0, 87.6, 47.7, 87.0],
                        borderColor: 'rgb(236, 72, 153)',
                        backgroundColor: 'rgba(236, 72, 153, 0.2)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Tülu 3 70B vs Competitors (Development Benchmarks)',
                        font: { size: 16 }
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            }
        });
    }
});
