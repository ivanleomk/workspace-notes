// Chart.js configurations for DeepSeek-R1 lesson

document.addEventListener('DOMContentLoaded', () => {
    // Chart 1: R1-Zero Training Progression (AIME 2024)
    const r1ZeroCtx = document.getElementById('r1ZeroProgressChart');
    if (r1ZeroCtx) {
        new Chart(r1ZeroCtx, {
            type: 'line',
            data: {
                labels: ['0', '2K', '4K', '6K', '8K', '8.2K*', '10K', '10.4K'],
                datasets: [
                    {
                        label: 'Pass@1 (%)',
                        data: [15.6, 35, 50, 62, 70, 75, 77, 77.9],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Cons@16 (self-consistency)',
                        data: [null, null, null, null, null, null, null, 86.7],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        pointRadius: 7,
                        pointHoverRadius: 9,
                        pointStyle: 'star'
                    },
                    {
                        label: 'Human Average',
                        data: [50, 50, 50, 50, 50, 50, 50, 50],
                        borderColor: '#ef4444',
                        borderDash: [5, 5],
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'R1-Zero Training Progress on AIME 2024',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    },
                    legend: {
                        labels: { color: '#cbd5e1' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                label += context.parsed.y ? context.parsed.y.toFixed(1) + '%' : 'N/A';
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Training Steps (* = max length increased to 65,536 tokens)',
                            color: '#cbd5e1'
                        },
                        ticks: { color: '#cbd5e1' },
                        grid: { color: '#475569' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'AIME 2024 Accuracy (%)',
                            color: '#cbd5e1'
                        },
                        ticks: { color: '#cbd5e1' },
                        grid: { color: '#475569' },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }

    // Chart 2: Multi-Stage Pipeline Comparison
    const pipelineCtx = document.getElementById('pipelineComparisonChart');
    if (pipelineCtx) {
        new Chart(pipelineCtx, {
            type: 'bar',
            data: {
                labels: ['R1-Zero', 'Dev1\n(Cold SFT)', 'Dev2\n(Reasoning RL)', 'Dev3\n(Rejection+SFT)', 'R1\n(Final RL)'],
                datasets: [
                    {
                        label: 'AIME 2024',
                        data: [77.9, 59.0, 74.0, 78.1, 79.8],
                        backgroundColor: '#3b82f6'
                    },
                    {
                        label: 'MATH-500',
                        data: [95.9, 94.2, 95.9, 95.4, 97.3],
                        backgroundColor: '#8b5cf6'
                    },
                    {
                        label: 'IFEval',
                        data: [46.6, 71.7, 72.0, 78.1, 83.3],
                        backgroundColor: '#10b981'
                    },
                    {
                        label: 'AlpacaEval 2.0',
                        data: [24.7, 50.1, 55.8, 62.1, 87.6],
                        backgroundColor: '#f59e0b'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'R1 Training Stages: Key Benchmarks',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    },
                    legend: {
                        labels: { color: '#cbd5e1' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: '#475569' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Accuracy (%)',
                            color: '#cbd5e1'
                        },
                        ticks: { color: '#cbd5e1' },
                        grid: { color: '#475569' },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }

    // Chart 3: R1 vs Competitors
    const competitorCtx = document.getElementById('competitorComparisonChart');
    if (competitorCtx) {
        new Chart(competitorCtx, {
            type: 'radar',
            data: {
                labels: ['AIME 2024', 'MATH-500', 'Codeforces', 'IFEval', 'AlpacaEval', 'MMLU'],
                datasets: [
                    {
                        label: 'DeepSeek-R1',
                        data: [79.8, 97.3, 96.3, 83.3, 87.6, 90.8],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#3b82f6'
                    },
                    {
                        label: 'R1-Zero (no SFT)',
                        data: [77.9, 95.9, 80.4, 46.6, 24.7, 88.8],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        pointBackgroundColor: '#8b5cf6',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#8b5cf6'
                    },
                    {
                        label: 'GPT-4o-0513',
                        data: [9.3, 74.6, 23.6, 84.3, 51.1, 87.2],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#10b981',
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'R1 vs R1-Zero vs GPT-4o-0513',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    },
                    legend: {
                        labels: { color: '#cbd5e1' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.r.toFixed(1) + '%';
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            color: '#cbd5e1'
                        },
                        pointLabels: {
                            color: '#cbd5e1',
                            font: { size: 12 }
                        },
                        grid: {
                            color: '#475569'
                        },
                        angleLines: {
                            color: '#475569'
                        }
                    }
                }
            }
        });
    }
});
