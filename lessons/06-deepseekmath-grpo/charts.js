// Charts for Lesson 06: DeepSeekMath & GRPO
// Uses Chart.js for visualizations

document.addEventListener('DOMContentLoaded', function() {
    // Chart.js default configuration
    Chart.defaults.color = '#cbd5e1';
    Chart.defaults.borderColor = '#475569';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    const chartColors = {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4',
        purple: '#a855f7',
        pink: '#ec4899'
    };

    // 1. Training Progression Chart (GSM8K and MATH)
    const trainingProgressionCtx = document.getElementById('training-progression-chart');
    if (trainingProgressionCtx) {
        new Chart(trainingProgressionCtx, {
            type: 'bar',
            data: {
                labels: deepSeekMathData.trainingProgression.stages,
                datasets: [
                    {
                        label: 'GSM8K Accuracy (%)',
                        data: deepSeekMathData.trainingProgression.gsm8k,
                        backgroundColor: chartColors.primary,
                        borderColor: chartColors.primary,
                        borderWidth: 2
                    },
                    {
                        label: 'MATH Accuracy (%)',
                        data: deepSeekMathData.trainingProgression.math,
                        backgroundColor: chartColors.secondary,
                        borderColor: chartColors.secondary,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'DeepSeekMath Performance Across Training Stages',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y.toFixed(1) + '%';
                                
                                // Show improvement from previous stage
                                if (context.dataIndex > 0) {
                                    const prev = context.dataset.data[context.dataIndex - 1];
                                    const curr = context.parsed.y;
                                    const improvement = (curr - prev).toFixed(1);
                                    label += ` (+${improvement} from previous)`;
                                }
                                
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
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

    // 2. MATH Performance by Difficulty Level
    const difficultyCtx = document.getElementById('difficulty-chart');
    if (difficultyCtx) {
        new Chart(difficultyCtx, {
            type: 'line',
            data: {
                labels: deepSeekMathData.mathByDifficulty.levels,
                datasets: [
                    {
                        label: 'SFT (No RL)',
                        data: deepSeekMathData.mathByDifficulty.sft,
                        borderColor: chartColors.warning,
                        backgroundColor: chartColors.warning + '40',
                        borderWidth: 3,
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'GRPO (With RL)',
                        data: deepSeekMathData.mathByDifficulty.grpo,
                        borderColor: chartColors.success,
                        backgroundColor: chartColors.success + '40',
                        borderWidth: 3,
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'MATH Performance by Difficulty Level (Harder Problems Benefit More from RL)',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y.toFixed(1) + '%';
                                
                                // Show improvement from SFT if this is GRPO
                                if (context.datasetIndex === 1) {
                                    const sftValue = deepSeekMathData.mathByDifficulty.sft[context.dataIndex];
                                    const grpoValue = context.parsed.y;
                                    const improvement = (grpoValue - sftValue).toFixed(1);
                                    label += ` (+${improvement} over SFT)`;
                                }
                                
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Problem Difficulty'
                        }
                    }
                }
            }
        });
    }

    // 3. Model Comparison Chart
    const modelComparisonCtx = document.getElementById('model-comparison-chart');
    if (modelComparisonCtx) {
        new Chart(modelComparisonCtx, {
            type: 'bar',
            data: {
                labels: deepSeekMathData.modelComparison.models,
                datasets: [
                    {
                        label: 'MATH Accuracy (%)',
                        data: deepSeekMathData.modelComparison.mathAccuracy,
                        backgroundColor: deepSeekMathData.modelComparison.models.map((model, idx) => 
                            model.includes('DeepSeek') ? chartColors.success : chartColors.info
                        ),
                        borderColor: deepSeekMathData.modelComparison.models.map((model, idx) => 
                            model.includes('DeepSeek') ? chartColors.success : chartColors.info
                        ),
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'MATH Benchmark: DeepSeekMath-7B vs Much Larger Models',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const accuracy = context.parsed.y.toFixed(1);
                                const params = deepSeekMathData.modelComparison.parameters[context.dataIndex];
                                return [
                                    `Accuracy: ${accuracy}%`,
                                    `Parameters: ${params}B`,
                                    params > 7 ? `${(params / 7).toFixed(0)}× larger than DeepSeekMath` : ''
                                ].filter(Boolean);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 60,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'MATH Accuracy (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Model'
                        }
                    }
                }
            }
        });
    }

    // 4. GRPO vs PPO Efficiency Chart
    const efficiencyCtx = document.getElementById('efficiency-chart');
    if (efficiencyCtx) {
        new Chart(efficiencyCtx, {
            type: 'radar',
            data: {
                labels: [
                    'MATH Accuracy',
                    'GSM8K Accuracy',
                    'Training Speed\n(Higher is Better)',
                    'Memory Efficiency\n(Higher is Better)'
                ],
                datasets: [
                    {
                        label: 'PPO (with critic)',
                        data: [
                            (deepSeekMathData.grpoVsPpo.mathAccuracy[1] / 60) * 100,  // Normalize to 100
                            (deepSeekMathData.grpoVsPpo.gsm8kAccuracy[1] / 100) * 100,
                            (1 / deepSeekMathData.grpoVsPpo.trainingTime[1]) * 100,
                            (1 / deepSeekMathData.grpoVsPpo.memoryUsage[1]) * 100
                        ],
                        borderColor: chartColors.warning,
                        backgroundColor: chartColors.warning + '30',
                        borderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'GRPO (no critic)',
                        data: [
                            (deepSeekMathData.grpoVsPpo.mathAccuracy[2] / 60) * 100,
                            (deepSeekMathData.grpoVsPpo.gsm8kAccuracy[2] / 100) * 100,
                            (1 / deepSeekMathData.grpoVsPpo.trainingTime[2]) * 100,
                            (1 / deepSeekMathData.grpoVsPpo.memoryUsage[2]) * 100
                        ],
                        borderColor: chartColors.success,
                        backgroundColor: chartColors.success + '30',
                        borderWidth: 2,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'GRPO vs PPO: Performance and Efficiency (Normalized)',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const datasetIndex = context.datasetIndex;
                                const pointIndex = context.dataIndex;
                                const method = context.dataset.label;
                                
                                let realValue;
                                if (pointIndex === 0) {
                                    realValue = deepSeekMathData.grpoVsPpo.mathAccuracy[datasetIndex + 1] + '% MATH accuracy';
                                } else if (pointIndex === 1) {
                                    realValue = deepSeekMathData.grpoVsPpo.gsm8kAccuracy[datasetIndex + 1] + '% GSM8K accuracy';
                                } else if (pointIndex === 2) {
                                    const time = deepSeekMathData.grpoVsPpo.trainingTime[datasetIndex + 1];
                                    realValue = time === 0 ? 'N/A' : (time === 1 ? '1× (baseline)' : time.toFixed(1) + '× faster');
                                } else {
                                    const mem = deepSeekMathData.grpoVsPpo.memoryUsage[datasetIndex + 1];
                                    realValue = mem === 1 ? '1× policy size' : mem + '× policy size';
                                }
                                
                                return `${method}: ${realValue}`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            display: false
                        }
                    }
                }
            }
        });
    }
});
