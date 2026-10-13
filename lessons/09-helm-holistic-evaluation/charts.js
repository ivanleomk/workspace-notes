// Visualizations for HELM lesson
// Data from Liang et al. (2022) "Holistic Evaluation of Language Models" (arXiv 2211.09110)

// Coverage improvement: Before HELM vs After HELM
// From paper: "Prior to HELM, models on average were evaluated on just 17.9% of the core HELM scenarios...We improve this to 96.0%"
const coverageData = {
    labels: ['Before HELM', 'After HELM'],
    datasets: [{
        label: 'Average Scenario Coverage (%)',
        data: [17.9, 96.0],
        backgroundColor: [
            'rgba(239, 68, 68, 0.7)',
            'rgba(34, 197, 94, 0.7)'
        ],
        borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 2
    }]
};

// Model accuracy variation on HellaSwag by adaptation method
// From paper finding #23: "accuracy for OPT (175B) on HellaSwag is 79.1% when each answer choice 
// is presented in a separate 0-shot prompt...but drops precipitously to 30.2%...when the answer 
// choices are presented jointly in a single 5-shot prompt"
const hellaswagData = {
    labels: ['Separate Method\n(0-shot)', 'Joint Method\n(5-shot)'],
    datasets: [{
        label: 'OPT-175B Accuracy on HellaSwag (%)',
        data: [79.1, 30.2],
        backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
    }]
};

// Code models vs text models on GSM8K (mathematical reasoning)
// From paper finding #16: "for GSM8K, code-davinci-002 achieves an accuracy of 52.1%, 
// where the next best model is text-davinci-002 at 35.0% and no other model surpasses 16%"
const reasoningData = {
    labels: ['code-davinci-002', 'text-davinci-002', 'Other Models\n(best)'],
    datasets: [{
        label: 'GSM8K Accuracy (%)',
        data: [52.1, 35.0, 16.0],
        backgroundColor: [
            'rgba(34, 197, 94, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(156, 163, 175, 0.7)'
        ],
        borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 2
    }]
};

// HELM evaluation scale
// From paper abstract and Table 5: "We conduct a large-scale evaluation of 30 prominent language models"
// "a total of 4,939 runs"
// "30 models" from "12 organizations" 
// "42 scenarios" (16 core + 26 targeted)
// "7 metrics"
const scaleData = {
    labels: ['Models\nEvaluated', 'Organizations', 'Total\nScenarios', 'Core\nScenarios', 'Metric\nCategories', 'Total\nRuns (÷100)'],
    datasets: [{
        label: 'HELM Evaluation Scale',
        data: [30, 12, 42, 16, 7, 49.39],
        backgroundColor: [
            'rgba(99, 102, 241, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(251, 146, 60, 0.7)',
            'rgba(34, 197, 94, 0.7)',
            'rgba(59, 130, 246, 0.7)'
        ],
        borderColor: [
            'rgba(99, 102, 241, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(251, 146, 60, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 2
    }]
};

// Multi-metric coverage matrix
// From paper Table 4 caption: "we measure 98 of the possible 112 (scenario, desiderata) pairs or 87.5%"
// 16 core scenarios × 7 metrics = 112 possible pairs
// 98 measured pairs
const metricCoverageData = {
    labels: ['Measured Pairs', 'Not Measured'],
    datasets: [{
        data: [98, 14],
        backgroundColor: [
            'rgba(34, 197, 94, 0.7)',
            'rgba(209, 213, 219, 0.7)'
        ],
        borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(209, 213, 219, 1)'
        ],
        borderWidth: 2
    }]
};

function createCharts() {
    // Coverage improvement chart
    const coverageCtx = document.getElementById('coverage-chart');
    if (coverageCtx) {
        new Chart(coverageCtx, {
            type: 'bar',
            data: coverageData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'HELM Improves Evaluation Coverage',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y.toFixed(1) + '% of core scenarios';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Average Coverage of Core Scenarios (%)'
                        }
                    }
                }
            }
        });
    }

    // HellaSwag adaptation sensitivity chart
    const hellaswagCtx = document.getElementById('hellaswag-chart');
    if (hellaswagCtx) {
        new Chart(hellaswagCtx, {
            type: 'bar',
            data: hellaswagData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Prompt Format Drastically Affects Performance',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    subtitle: {
                        display: true,
                        text: 'Same model, same task, different prompt structure'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        }
                    }
                }
            }
        });
    }

    // GSM8K reasoning chart
    const reasoningCtx = document.getElementById('reasoning-chart');
    if (reasoningCtx) {
        new Chart(reasoningCtx, {
            type: 'bar',
            data: reasoningData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Code Models Excel at Mathematical Reasoning',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 60,
                        title: {
                            display: true,
                            text: 'GSM8K Accuracy (%)'
                        }
                    }
                }
            }
        });
    }

    // Scale chart
    const scaleCtx = document.getElementById('scale-chart');
    if (scaleCtx) {
        new Chart(scaleCtx, {
            type: 'bar',
            data: scaleData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'HELM Evaluation Scale',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const labels = ['30 models', '12 organizations', '42 scenarios', '16 core scenarios', '7 metrics', '4,939 total runs'];
                                return labels[context.dataIndex];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Count (Total Runs ÷ 100)'
                        }
                    }
                }
            }
        });
    }

    // Metric coverage pie chart
    const metricCoverageCtx = document.getElementById('metric-coverage-chart');
    if (metricCoverageCtx) {
        new Chart(metricCoverageCtx, {
            type: 'doughnut',
            data: metricCoverageData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Multi-Metric Coverage: 98/112 Pairs (87.5%)',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                return label + ': ' + value + ' (scenario × metric) pairs';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', createCharts);
