// Charts for IFEval lesson
document.addEventListener('DOMContentLoaded', function() {
    createOverallChart();
    createCategoryChart();
    createGapChart();
});

function createOverallChart() {
    const ctx = document.getElementById('overallChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Prompt-Level\nStrict', 'Instruction-Level\nStrict', 'Prompt-Level\nLoose', 'Instruction-Level\nLoose'],
            datasets: [
                {
                    label: 'GPT-4',
                    data: [76.89, 83.57, 79.30, 85.37],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2
                },
                {
                    label: 'PaLM 2 S',
                    data: [43.07, 55.76, 46.95, 59.11],
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'IFEval Overall Performance (Table 3)',
                    color: '#f1f5f9',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
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
                        text: 'Accuracy (%)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(203, 213, 225, 0.1)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(203, 213, 225, 0.1)' }
                }
            }
        }
    });
}

function createCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Keywords', 'Language', 'Length\nConstraints', 'Detectable\nContent', 'Detectable\nFormat'],
            datasets: [
                {
                    label: 'GPT-4',
                    data: [86, 95, 78, 82, 76],
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
                },
                {
                    label: 'PaLM 2 S',
                    data: [62, 80, 50, 57, 44],
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(139, 92, 246, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Instruction-Level Strict Accuracy by Category (approximate, from Figure 2)',
                    color: '#f1f5f9',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.r.toFixed(0)}%`;
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
                        color: '#cbd5e1',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    pointLabels: {
                        color: '#f1f5f9',
                        font: { size: 12 }
                    },
                    grid: { color: 'rgba(203, 213, 225, 0.2)' }
                }
            }
        }
    });
}

function createGapChart() {
    const ctx = document.getElementById('gapChart');
    if (!ctx) return;
    
    const gpt4Gap = modelData.gpt4.promptLoose - modelData.gpt4.promptStrict;
    const palm2Gap = modelData.palm2.promptLoose - modelData.palm2.promptStrict;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['GPT-4', 'PaLM 2 S'],
            datasets: [
                {
                    label: 'Strict Accuracy',
                    data: [modelData.gpt4.promptStrict, modelData.palm2.promptStrict],
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Loose Advantage',
                    data: [gpt4Gap, palm2Gap],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Strict vs Loose: Formatting Impact (Prompt-Level)',
                    color: '#f1f5f9',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    labels: { color: '#f1f5f9' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Strict: ${context.parsed.y.toFixed(2)}%`;
                            } else {
                                return `Loose Gain: +${context.parsed.y.toFixed(2)}%`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Accuracy (%)',
                        color: '#f1f5f9'
                    },
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(203, 213, 225, 0.1)' }
                },
                x: {
                    stacked: true,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(203, 213, 225, 0.1)' }
                }
            }
        }
    });
}

// Instruction type explorer
function updateInstructionType() {
    const select = document.getElementById('instructionTypeSelect');
    const display = document.getElementById('instruction-type-display');
    const index = parseInt(select.value);
    const type = instructionTypes[index];
    
    display.innerHTML = `
        <div class="instruction-detail">
            <h3>${type.name}</h3>
            <div class="detail-section">
                <h4>Category:</h4>
                <p>${type.category}</p>
            </div>
            <div class="detail-section">
                <h4>Description:</h4>
                <p>${type.description}</p>
            </div>
            <div class="detail-section">
                <h4>Example Instruction:</h4>
                <p class="example-text">${type.example}</p>
            </div>
            <div class="detail-section">
                <h4>Sample Valid Response:</h4>
                <pre class="sample-response">${type.sampleResponse}</pre>
            </div>
            <div class="detail-section">
                <h4>Verification Method:</h4>
                <p>${type.verificationMethod}</p>
            </div>
            <div class="detail-section">
                <h4>Difficulty:</h4>
                <p><span class="difficulty-badge">${type.difficulty}</span></p>
            </div>
            <div class="detail-section">
                <h4>Model Performance (Instruction-Level Strict):</h4>
                <div class="performance-stats">
                    <div class="stat">
                        <span class="model-name">GPT-4:</span>
                        <span class="model-score">${type.modelPerformance.gpt4}</span>
                    </div>
                    <div class="stat">
                        <span class="model-name">PaLM 2 S:</span>
                        <span class="model-score">${type.modelPerformance.palm2}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize instruction explorer
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('instructionTypeSelect')) {
        updateInstructionType();
    }
});
