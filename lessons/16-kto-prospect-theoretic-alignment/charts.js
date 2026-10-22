// Charts for Lesson 16: KTO - Model Alignment as Prospect Theoretic Optimization

// Chart 1: KTO vs DPO Winrates Across Scales (Figure 3)
function createKtoVsDpoChart() {
    const ctx = document.getElementById('kto-vs-dpo-chart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ktoData.ktoVsDpoWinrates.models.filter((_, i) => i >= 4), // Only Llama models
            datasets: [
                {
                    label: 'DPO Alone',
                    data: ktoData.ktoVsDpoWinrates.dpoAlone.filter((_, i) => i >= 4).map(v => v * 100),
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2
                },
                {
                    label: 'KTO Alone',
                    data: ktoData.ktoVsDpoWinrates.ktoAlone.filter((_, i) => i >= 4).map(v => v * 100),
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2
                },
                {
                    label: 'SFT+DPO',
                    data: ktoData.ktoVsDpoWinrates.sftPlusDpo.filter((_, i) => i >= 4).map(v => v * 100),
                    backgroundColor: 'rgba(251, 146, 60, 0.7)',
                    borderColor: 'rgba(251, 146, 60, 1)',
                    borderWidth: 2
                },
                {
                    label: 'SFT+KTO',
                    data: ktoData.ktoVsDpoWinrates.sftPlusKto.filter((_, i) => i >= 4).map(v => v * 100),
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'KTO vs DPO: GPT-4-Judged Winrate Against SFT Targets',
                    color: '#f1f5f9',
                    font: { size: 16 }
                },
                legend: {
                    labels: { color: '#cbd5e1' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 60,
                    title: {
                        display: true,
                        text: 'Winrate Above Chance (%)',
                        color: '#cbd5e1'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(75, 85, 99, 0.3)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(75, 85, 99, 0.3)' }
                }
            }
        }
    });
}

// Chart 2: Benchmark Results (Table 2)
function createBenchmarkChart() {
    const ctx = document.getElementById('benchmark-results-chart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ktoData.benchmarkResults.methods,
            datasets: [
                {
                    label: 'MMLU',
                    data: ktoData.benchmarkResults.mmlu,
                    backgroundColor: 'rgba(139, 92, 246, 0.7)'
                },
                {
                    label: 'GSM8K',
                    data: ktoData.benchmarkResults.gsm8k,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)'
                },
                {
                    label: 'HumanEval',
                    data: ktoData.benchmarkResults.humaneval,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)'
                },
                {
                    label: 'BBH',
                    data: ktoData.benchmarkResults.bbh,
                    backgroundColor: 'rgba(251, 146, 60, 0.7)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Zephyr-β-SFT on UltraFeedback: KTO vs Baselines',
                    color: '#f1f5f9',
                    font: { size: 16 }
                },
                legend: {
                    labels: { color: '#cbd5e1' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 60,
                    title: {
                        display: true,
                        text: 'Accuracy (%)',
                        color: '#cbd5e1'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(75, 85, 99, 0.3)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(75, 85, 99, 0.3)' }
                }
            }
        }
    });
}

// Chart 3: Data Imbalance Robustness (Figure 5)
function createDataImbalanceChart() {
    const ctx = document.getElementById('data-imbalance-chart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ktoData.dataImbalance.desirableFractions.map(f => {
                const ratio = f === 1 ? '1:1' : f === 0.9 ? '0.9:1' : f === 0.75 ? '0.75:1' : 
                              f === 0.5 ? '0.5:1' : f === 0.25 ? '0.25:1' : '0.1:1';
                return `${ratio}\n(${Math.round(f * 100)}% desirable)`;
            }),
            datasets: [
                {
                    label: 'KTO (with λ adjustment)',
                    data: ktoData.dataImbalance.ktoWinrate.map(v => v * 100),
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderWidth: 3,
                    tension: 0.3,
                    pointRadius: 5
                },
                {
                    label: 'DPO (balanced baseline)',
                    data: new Array(6).fill(ktoData.dataImbalance.dpoWinrate * 100),
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'KTO Robustness to Data Imbalance (Llama-7B)',
                    color: '#f1f5f9',
                    font: { size: 16 }
                },
                legend: {
                    labels: { color: '#cbd5e1' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 60,
                    title: {
                        display: true,
                        text: 'Winrate Above Chance (%)',
                        color: '#cbd5e1'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(75, 85, 99, 0.3)' }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Desirable:Undesirable Ratio',
                        color: '#cbd5e1'
                    },
                    ticks: { color: '#cbd5e1', maxRotation: 0, minRotation: 0 },
                    grid: { color: 'rgba(75, 85, 99, 0.3)' }
                }
            }
        }
    });
}

// Chart 4: HALO vs Non-HALO Comparison (Figure 2)
function createHaloComparisonChart() {
    const ctx = document.getElementById('halo-comparison-chart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ktoData.haloComparison.models,
            datasets: [
                {
                    label: 'CSFT (Non-HALO)',
                    data: ktoData.haloComparison.csft.map(v => v * 100),
                    backgroundColor: 'rgba(156, 163, 175, 0.7)'
                },
                {
                    label: 'SLiC (Non-HALO)',
                    data: ktoData.haloComparison.slic.map(v => v * 100),
                    backgroundColor: 'rgba(107, 114, 128, 0.7)'
                },
                {
                    label: 'DPO (HALO)',
                    data: ktoData.haloComparison.dpo.map(v => v * 100),
                    backgroundColor: 'rgba(59, 130, 246, 0.7)'
                },
                {
                    label: 'PPO Offline (HALO)',
                    data: ktoData.haloComparison.ppoOffline.map(v => v * 100),
                    backgroundColor: 'rgba(16, 185, 129, 0.7)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'HALO vs Non-HALO Performance (Llama Models)',
                    color: '#f1f5f9',
                    font: { size: 16 }
                },
                legend: {
                    labels: { color: '#cbd5e1' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 60,
                    title: {
                        display: true,
                        text: 'Winrate Above Chance (%)',
                        color: '#cbd5e1'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(75, 85, 99, 0.3)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(75, 85, 99, 0.3)' }
                }
            }
        }
    });
}

// Interactive Value Function Explorer
let valueFunctionChart = null;

function initValueFunctionExplorer() {
    const betaSlider = document.getElementById('beta-slider');
    const lambdaSlider = document.getElementById('lambda-slider');
    const z0Slider = document.getElementById('z0-slider');

    if (!betaSlider || !lambdaSlider || !z0Slider) return;

    betaSlider.addEventListener('input', updateValueFunction);
    lambdaSlider.addEventListener('input', updateValueFunction);
    z0Slider.addEventListener('input', updateValueFunction);

    updateValueFunction();
}

function updateValueFunction() {
    const beta = parseFloat(document.getElementById('beta-slider').value);
    const lambda = parseFloat(document.getElementById('lambda-slider').value);
    const z0 = parseFloat(document.getElementById('z0-slider').value);

    document.getElementById('beta-value').textContent = beta.toFixed(2);
    document.getElementById('lambda-value').textContent = lambda.toFixed(2);
    document.getElementById('z0-value').textContent = z0.toFixed(2);

    // Generate value function data
    const rewardRange = [];
    const desirableValues = [];
    const undesirableValues = [];

    for (let r = -2; r <= 2; r += 0.05) {
        rewardRange.push(r);
        // Desirable: v = lambda * sigma(beta * (r - z0))
        const desirableArg = beta * (r - z0);
        const desirableValue = lambda * (1 / (1 + Math.exp(-desirableArg)));
        desirableValues.push(desirableValue);
        
        // Undesirable: v = lambda * sigma(beta * (z0 - r))
        const undesirableArg = beta * (z0 - r);
        const undesirableValue = lambda * (1 / (1 + Math.exp(-undesirableArg)));
        undesirableValues.push(undesirableValue);
    }

    const ctx = document.getElementById('value-function-chart');
    if (!ctx) return;

    if (valueFunctionChart) {
        valueFunctionChart.destroy();
    }

    valueFunctionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: rewardRange,
            datasets: [
                {
                    label: 'Desirable Examples (gains)',
                    data: desirableValues,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.3,
                    pointRadius: 0
                },
                {
                    label: 'Undesirable Examples (losses)',
                    data: undesirableValues,
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    tension: 0.3,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `KTO Value Function: v(r_θ - z₀) with β=${beta.toFixed(2)}, λ=${lambda.toFixed(2)}, z₀=${z0.toFixed(2)}`,
                    color: '#f1f5f9',
                    font: { size: 14 }
                },
                legend: {
                    labels: { color: '#cbd5e1' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Perceived Value v(r - z₀)',
                        color: '#cbd5e1'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(75, 85, 99, 0.3)' }
                },
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Reward r_θ (nats)',
                        color: '#cbd5e1'
                    },
                    ticks: { 
                        color: '#cbd5e1',
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    },
                    grid: { color: 'rgba(75, 85, 99, 0.3)' }
                }
            }
        }
    });
}

// Initialize all charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    createKtoVsDpoChart();
    createBenchmarkChart();
    createDataImbalanceChart();
    createHaloComparisonChart();
    initValueFunctionExplorer();
});
