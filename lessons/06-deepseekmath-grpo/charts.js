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

    // Note: mathByDifficulty chart removed (paper does not provide this breakdown)

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

    // Note: GRPO vs PPO chart removed (paper does not report PPO comparison)
});
