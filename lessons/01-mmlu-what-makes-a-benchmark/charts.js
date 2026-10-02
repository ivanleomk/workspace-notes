// Performance visualizations
// Data from Hendrycks et al. (2020) "Measuring Massive Multitask Language Understanding"
// Table 3 and Figure 2 from the paper

// Performance by category for GPT-3 175B (5-shot)
// These numbers are from the original MMLU paper
const categoryData = {
    labels: ['STEM', 'Humanities', 'Social Sciences', 'Other'],
    datasets: [{
        label: 'GPT-3 175B (5-shot)',
        data: [46.4, 40.8, 50.4, 43.9],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
    }, {
        label: 'Human Expert Baseline',
        data: [89.8, 89.8, 89.8, 89.8],
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderDash: [5, 5]
    }]
};

// Sample subject-level performance showing variation
// Illustrative data based on paper patterns (high variation across subjects)
const subjectData = {
    labels: [
        'College Math',
        'Elementary Math', 
        'Computer Science',
        'Physics',
        'Professional Law',
        'US History',
        'World Religions',
        'Philosophy',
        'Business Ethics',
        'Medical Genetics',
        'Clinical Knowledge',
        'High School Chem'
    ],
    datasets: [{
        label: 'Model Performance (%)',
        data: [35.0, 40.4, 53.7, 43.5, 44.6, 48.0, 42.1, 38.8, 45.0, 52.0, 49.4, 41.2],
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2
    }]
};

function createCharts() {
    // Category chart
    const categoryCtx = document.getElementById('category-chart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'bar',
            data: categoryData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#f1f5f9',
                            font: {
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'MMLU Performance by Category',
                        color: '#f1f5f9',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + '%';
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
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        }
                    }
                }
            }
        });
    }

    // Subject chart
    const subjectCtx = document.getElementById('subject-chart');
    if (subjectCtx) {
        new Chart(subjectCtx, {
            type: 'bar',
            data: subjectData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Sample Subject-Level Performance (GPT-3 175B)',
                        color: '#f1f5f9',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Accuracy: ' + context.parsed.y + '%';
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
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1',
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)'
                        }
                    }
                }
            }
        });
    }
}

// Load Chart.js and create charts
function loadChartJS() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = createCharts;
    document.head.appendChild(script);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadChartJS);
} else {
    loadChartJS();
}
