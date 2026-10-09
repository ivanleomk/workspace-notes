// Chart.js visualizations for HumanEval lesson
// All data from Chen et al. 2021 paper (arXiv:2107.03374)

document.addEventListener('DOMContentLoaded', function() {
    
    // Chart 1: Codex Model Size vs Performance
    const modelSizeCtx = document.getElementById('modelSizeChart');
    if (modelSizeCtx) {
        new Chart(modelSizeCtx, {
            type: 'line',
            data: {
                labels: ['12M', '85M', '300M', '679M', '2.5B', '12B'],
                datasets: [
                    {
                        label: 'pass@1 (%)',
                        data: humanEvalData.codexPerformance.pass1,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'pass@10 (%)',
                        data: humanEvalData.codexPerformance.pass10,
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'pass@100 (%)',
                        data: humanEvalData.codexPerformance.pass100,
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Codex Performance Scales with Model Size',
                        color: '#f1f5f9',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#cbd5e1' }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Model Size (parameters)',
                            color: '#cbd5e1'
                        },
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.3)' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Pass Rate (%)',
                            color: '#cbd5e1'
                        },
                        beginAtZero: true,
                        max: 80,
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.3)' }
                    }
                }
            }
        });
    }

    // Chart 2: Model Comparison Bar Chart
    const comparisonCtx = document.getElementById('modelComparisonChart');
    if (comparisonCtx) {
        new Chart(comparisonCtx, {
            type: 'bar',
            data: {
                labels: humanEvalData.baselineComparison.models,
                datasets: [
                    {
                        label: 'pass@1',
                        data: humanEvalData.baselineComparison.pass1,
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
                    },
                    {
                        label: 'pass@100',
                        data: humanEvalData.baselineComparison.pass100,
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Codex vs Baselines on HumanEval',
                        color: '#f1f5f9',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#cbd5e1' }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.3)' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Pass Rate (%)',
                            color: '#cbd5e1'
                        },
                        beginAtZero: true,
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.3)' }
                    }
                }
            }
        });
    }

    // Chart 3: Pass@k improvement visualization
    const passk Ctx = document.getElementById('passkChart');
    if (passkCtx) {
        const kValues = [1, 10, 100];
        const codex12BValues = [28.81, 46.81, 72.31];
        
        new Chart(passkCtx, {
            type: 'line',
            data: {
                labels: ['1', '10', '100'],
                datasets: [{
                    label: 'Codex-12B Pass Rate (%)',
                    data: codex12BValues,
                    borderColor: 'rgb(139, 92, 246)',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'More Samples = Better Coverage (Codex-12B)',
                        color: '#f1f5f9',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#cbd5e1' }
                    },
                    subtitle: {
                        display: true,
                        text: 'Generating multiple samples dramatically improves problem-solving',
                        color: '#94a3b8',
                        padding: { bottom: 10 }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Number of Samples (k)',
                            color: '#cbd5e1'
                        },
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.3)' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Problems Solved (%)',
                            color: '#cbd5e1'
                        },
                        beginAtZero: true,
                        max: 80,
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.3)' }
                    }
                }
            }
        });
    }

    // Chart 4: Sample Selection Heuristics
    const selectionCtx = document.getElementById('sampleSelectionChart');
    if (selectionCtx) {
        new Chart(selectionCtx, {
            type: 'bar',
            data: {
                labels: ['Single Sample', 'Select from 10', 'Select from 100'],
                datasets: [
                    {
                        label: 'Random Selection',
                        data: [28.8, 29, 29],
                        backgroundColor: 'rgba(248, 113, 113, 0.7)',
                        borderColor: 'rgb(248, 113, 113)',
                        borderWidth: 1
                    },
                    {
                        label: 'Mean Log-Prob',
                        data: [28.8, 35, 44.5],
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
                    },
                    {
                        label: 'Oracle (with tests)',
                        data: [28.8, 47, 72.3],
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sample Selection Strategies (Codex-12B)',
                        color: '#f1f5f9',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#cbd5e1' }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.3)' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Pass Rate (%)',
                            color: '#cbd5e1'
                        },
                        beginAtZero: true,
                        max: 80,
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.3)' }
                    }
                }
            }
        });
    }
});
