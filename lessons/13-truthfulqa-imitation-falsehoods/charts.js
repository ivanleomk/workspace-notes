// Chart.js configurations for TruthfulQA visualizations
// Scaling data are exact values from Table 4 (Appendix B.2)
// Other values are marked as approximate when read from figures

// Chart colors
const colors = {
    gpt3: '#3b82f6',
    gptNeoJ: '#8b5cf6',
    gpt2: '#10b981',
    unifiedQA: '#f59e0b',
    human: '#ef4444',
    true: '#10b981',
    false: '#ef4444',
    informative: '#3b82f6',
    grid: 'rgba(255, 255, 255, 0.1)',
    text: '#cbd5e1'
};

// Common chart options
const commonOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            labels: {
                color: colors.text,
                font: { size: 12 }
            }
        }
    },
    scales: {
        x: {
            ticks: { color: colors.text },
            grid: { color: colors.grid }
        },
        y: {
            ticks: { color: colors.text },
            grid: { color: colors.grid }
        }
    }
};

// Inverse Scaling Chart (Figure 2, top panel)
// Values are exact % True from Table 4 (Appendix B.2)
const inverseScalingCtx = document.getElementById('inverseScalingChart');
if (inverseScalingCtx) {
    new Chart(inverseScalingCtx, {
        type: 'line',
        data: {
            labels: ['125M/117M/60M/350M', '1.3B/220M/1.5B', '2.7B/770M', '6B/2.8B/6.7B', '175B'],
            datasets: [
                {
                    label: 'GPT-3',
                    data: [37.0, 31.9, null, 23.6, 20.4],
                    borderColor: colors.gpt3,
                    backgroundColor: colors.gpt3 + '33',
                    tension: 0.3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    spanGaps: true
                },
                {
                    label: 'GPT-Neo/J',
                    data: [43.6, 37.9, 40.0, 26.8, null],
                    borderColor: colors.gptNeoJ,
                    backgroundColor: colors.gptNeoJ + '33',
                    tension: 0.3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    spanGaps: true
                },
                {
                    label: 'GPT-2',
                    data: [35.4, 29.3, null, null, null],
                    borderColor: colors.gpt2,
                    backgroundColor: colors.gpt2 + '33',
                    tension: 0.3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    spanGaps: true
                },
                {
                    label: 'UnifiedQA',
                    data: [58.0, 56.9, 49.7, 54.0, null],
                    borderColor: colors.unifiedQA,
                    backgroundColor: colors.unifiedQA + '33',
                    tension: 0.3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    spanGaps: true
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'TruthfulQA: Larger Models Are Less Truthful (Inverse Scaling)',
                    color: colors.text,
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '% true (exact, Table 4)';
                        }
                    }
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: '% Truthful (Exact values from Table 4)',
                        color: colors.text
                    },
                    min: 0,
                    max: 60
                },
                x: {
                    ...commonOptions.scales.x,
                    title: {
                        display: true,
                        text: 'Model Size (Increasing →)',
                        color: colors.text
                    }
                }
            }
        }
    });
}

// Human vs Best Model Chart (Section 4.1, exact percentages)
const humanVsModelCtx = document.getElementById('humanVsModelChart');
if (humanVsModelCtx) {
    new Chart(humanVsModelCtx, {
        type: 'bar',
        data: {
            labels: ['% True', '% True + Informative', '% False + Informative'],
            datasets: [
                {
                    label: 'Human Baseline',
                    data: [94, 87, 6],
                    backgroundColor: colors.human + 'bb',
                    borderColor: colors.human,
                    borderWidth: 2
                },
                {
                    label: 'GPT-3-175B (Helpful Prompt)',
                    data: [58, 21, 42],
                    backgroundColor: colors.gpt3 + 'bb',
                    borderColor: colors.gpt3,
                    borderWidth: 2
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Human Baseline vs Best Model (Generation Task)',
                    color: colors.text,
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '% (exact from Section 4.1)';
                        }
                    }
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Percentage',
                        color: colors.text
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

// Control Questions Chart (Figure 2, bottom panel - approximate)
const controlQuestionsCtx = document.getElementById('controlQuestionsChart');
if (controlQuestionsCtx) {
    new Chart(controlQuestionsCtx, {
        type: 'line',
        data: {
            labels: ['125M/117M/350M', '1.3B/1.5B', '2.7B/6.7B', '6B/175B'],
            datasets: [
                {
                    label: 'GPT-3 (Control Questions)',
                    data: [60, 68, 75, 82],
                    borderColor: colors.gpt3,
                    backgroundColor: colors.gpt3 + '33',
                    tension: 0.3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'GPT-Neo/J (Control Questions)',
                    data: [58, 65, 72, 78],
                    borderColor: colors.gptNeoJ,
                    backgroundColor: colors.gptNeoJ + '33',
                    tension: 0.3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'GPT-3 (TruthfulQA)',
                    data: [37.0, 31.9, 23.6, 20.4],
                    borderColor: colors.gpt3,
                    backgroundColor: colors.gpt3 + '33',
                    borderDash: [5, 5],
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Control Questions Show Positive Scaling (Syntax Not the Problem)',
                    color: colors.text,
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.label.includes('TruthfulQA')) {
                                return context.dataset.label + ': ' + context.parsed.y + '% true (exact, Table 4)';
                            }
                            return context.dataset.label + ': ' + context.parsed.y + '% true (approximate)';
                        }
                    }
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: '% Truthful (Approximate from Figure 2)',
                        color: colors.text
                    },
                    min: 0,
                    max: 100
                },
                x: {
                    ...commonOptions.scales.x,
                    title: {
                        display: true,
                        text: 'Model Size (Increasing →)',
                        color: colors.text
                    }
                }
            }
        }
    });
}

// Prompt Effects Chart (Table 4 - exact values)
const promptEffectsCtx = document.getElementById('promptEffectsChart');
if (promptEffectsCtx) {
    new Chart(promptEffectsCtx, {
        type: 'bar',
        data: {
            labels: ['QA Prompt (Default)', 'Helpful Prompt', 'Harm Prompt', 'Human Baseline'],
            datasets: [
                {
                    label: 'GPT-3-175B % True',
                    data: [20.4, 58.1, 12.5, 94],
                    backgroundColor: [
                        colors.gpt3 + 'bb',
                        colors.gpt3 + 'bb',
                        colors.gpt3 + 'bb',
                        colors.human + 'bb'
                    ],
                    borderColor: [
                        colors.gpt3,
                        colors.gpt3,
                        colors.gpt3,
                        colors.human
                    ],
                    borderWidth: 2
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Prompt Effects on GPT-3-175B Truthfulness',
                    color: colors.text,
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.label === 'Human Baseline') {
                                return 'Human: ' + context.parsed.y + '% true (exact, Table 4)';
                            }
                            return 'GPT-3-175B: ' + context.parsed.y + '% true (exact, Table 4)';
                        }
                    }
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Percentage Truthful',
                        color: colors.text
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

// Add annotations explaining approximate vs exact data
document.addEventListener('DOMContentLoaded', () => {
    const chartCaptions = document.querySelectorAll('.chart-caption');
    chartCaptions.forEach(caption => {
        caption.style.fontSize = '0.9em';
        caption.style.fontStyle = 'italic';
        caption.style.marginTop = '15px';
        caption.style.color = 'var(--text-secondary)';
    });
});
