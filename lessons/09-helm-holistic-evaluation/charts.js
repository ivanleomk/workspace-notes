// Charts for HELM lesson

document.addEventListener('DOMContentLoaded', function() {
    createDensityChart();
    createCoverageChart();
    createMetricCoverageChart();
});

// Density chart showing multi-metric coverage
function createDensityChart() {
    const ctx = document.getElementById('densityChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Possible Pairs', 'Measured Pairs', 'Unmeasured Pairs'],
            datasets: [{
                label: '(Scenario, Metric) Pairs',
                data: [112, 98, 14],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.5)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(107, 114, 128, 0.5)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(107, 114, 128, 1)'
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
                    text: 'Multi-Metric Density: 87.5% Coverage (98/112 Pairs)',
                    color: '#f1f5f9',
                    font: { size: 16 }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label;
                            const value = context.parsed.y;
                            if (label === 'Measured Pairs') {
                                return `${value} pairs measured (87.5%)`;
                            } else if (label === 'Unmeasured Pairs') {
                                return `${value} pairs unmeasured (12.5%)`;
                            }
                            return `${value} pairs (16 scenarios × 7 metrics)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 120,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                }
            }
        }
    });
}

// Coverage chart showing before/after HELM
function createCoverageChart() {
    const ctx = document.getElementById('coverageChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Before HELM', 'After HELM'],
            datasets: [{
                label: 'Average Scenario Coverage (%)',
                data: [17.9, 96.0],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.6)',
                    'rgba(16, 185, 129, 0.7)'
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(16, 185, 129, 1)'
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
                    text: 'Scenario Coverage: Before vs After HELM',
                    color: '#f1f5f9',
                    font: { size: 16 }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.label;
                            if (label === 'Before HELM') {
                                return `Before: ${value}% of core scenarios evaluated on average`;
                            } else {
                                return `After: ${value}% coverage with standardized evaluation`;
                            }
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
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                }
            }
        }
    });
}

// Metric coverage chart showing which metrics are measured for how many scenarios
function createMetricCoverageChart() {
    const ctx = document.getElementById('metricCoverageChart');
    if (!ctx) return;

    // Approximate coverage by metric category from the paper
    // Not all metrics can be measured for all scenarios (e.g., calibration needs probabilities)
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Accuracy', 'Calibration', 'Robustness', 'Fairness', 'Bias', 'Toxicity', 'Efficiency'],
            datasets: [{
                label: 'Scenarios Measured',
                data: [16, 13, 14, 14, 15, 15, 16], // Approximate from paper Table 4
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: 'Metric Category Coverage Across 16 Core Scenarios',
                    color: '#f1f5f9',
                    font: { size: 16 }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const metric = context.label;
                            const count = context.parsed.x;
                            const reasons = {
                                'Accuracy': 'All 16 scenarios',
                                'Calibration': '13/16 scenarios (requires probability outputs)',
                                'Robustness': '14/16 scenarios (perturbation-based)',
                                'Fairness': '14/16 scenarios (demographic perturbations)',
                                'Bias': '15/16 scenarios (representation in generations)',
                                'Toxicity': '15/16 scenarios (toxicity in generations)',
                                'Efficiency': 'All 16 scenarios'
                            };
                            return `${count}/16 scenarios - ${reasons[metric]}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 16,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                },
                y: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                }
            }
        }
    });
}
