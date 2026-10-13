// Charts for HELM lesson

document.addEventListener('DOMContentLoaded', function() {
    createDensityChart();
    createCoverageChart();
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

