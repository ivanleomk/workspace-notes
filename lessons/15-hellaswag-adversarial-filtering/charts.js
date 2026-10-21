// Charts for HellaSwag lesson - all data verified from the paper

document.addEventListener('DOMContentLoaded', function() {
    // Chart 1: Overall Performance Comparison
    const overallCtx = document.getElementById('overall-performance-chart');
    if (overallCtx) {
        new Chart(overallCtx, {
            type: 'bar',
            data: {
                labels: ['Human', 'BERT-Large', 'BERT-Base', 'OpenAI GPT', 'ESIM+ELMo', 'LSTM+BERT', 'Random'],
                datasets: [{
                    label: 'Test Accuracy (%)',
                    data: [95.6, 47.3, 40.5, 41.7, 33.3, 36.2, 25.0],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(107, 114, 128, 0.5)'
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(59, 130, 246)',
                        'rgb(139, 92, 246)',
                        'rgb(236, 72, 153)',
                        'rgb(251, 146, 60)',
                        'rgb(245, 158, 11)',
                        'rgb(107, 114, 128)'
                    ],
                    borderWidth: 2
                }]
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
                        text: 'HellaSwag Test Set Performance',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(75, 85, 99, 0.3)' },
                        title: {
                            display: true,
                            text: 'Accuracy (%)',
                            color: '#cbd5e1'
                        }
                    },
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(75, 85, 99, 0.3)' }
                    }
                }
            }
        });
    }

    // Chart 2: In-Domain vs Zero-Shot Performance
    const domainCtx = document.getElementById('domain-comparison-chart');
    if (domainCtx) {
        new Chart(domainCtx, {
            type: 'bar',
            data: {
                labels: ['BERT-Large', 'BERT-Base', 'OpenAI GPT', 'ESIM+ELMo'],
                datasets: [
                    {
                        label: 'In-Domain',
                        data: [50.2, 42.9, 45.3, 35.7],
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 2
                    },
                    {
                        label: 'Zero-Shot',
                        data: [43.3, 36.1, 38.6, 31.5],
                        backgroundColor: 'rgba(139, 92, 246, 0.8)',
                        borderColor: 'rgb(139, 92, 246)',
                        borderWidth: 2
                    },
                    {
                        label: 'Human (Both)',
                        data: [95.6, 95.6, 95.6, 95.6],
                        backgroundColor: 'rgba(16, 185, 129, 0.3)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 2,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e1' }
                    },
                    title: {
                        display: true,
                        text: 'In-Domain vs Zero-Shot Validation Performance',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(75, 85, 99, 0.3)' },
                        title: {
                            display: true,
                            text: 'Accuracy (%)',
                            color: '#cbd5e1'
                        }
                    },
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(75, 85, 99, 0.3)' }
                    }
                }
            }
        });
    }

    // Chart 3: Domain-Specific Performance (ActivityNet vs WikiHow)
    const sourceCtx = document.getElementById('source-comparison-chart');
    if (sourceCtx) {
        new Chart(sourceCtx, {
            type: 'bar',
            data: {
                labels: ['Human', 'BERT-Large', 'BERT-Base', 'OpenAI GPT', 'ESIM+ELMo'],
                datasets: [
                    {
                        label: 'ActivityNet',
                        data: [94.0, 54.7, 48.9, 46.4, 37.7],
                        backgroundColor: 'rgba(236, 72, 153, 0.8)',
                        borderColor: 'rgb(236, 72, 153)',
                        borderWidth: 2
                    },
                    {
                        label: 'WikiHow',
                        data: [96.5, 42.9, 34.9, 39.8, 31.6],
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e1' }
                    },
                    title: {
                        display: true,
                        text: 'ActivityNet vs WikiHow Performance (Validation)',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(75, 85, 99, 0.3)' },
                        title: {
                            display: true,
                            text: 'Accuracy (%)',
                            color: '#cbd5e1'
                        }
                    },
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(75, 85, 99, 0.3)' }
                    }
                }
            }
        });
    }

    // Chart 4: SWAG vs HellaSwag Transfer
    const transferCtx = document.getElementById('transfer-chart');
    if (transferCtx) {
        new Chart(transferCtx, {
            type: 'bar',
            data: {
                labels: ['Trained on\nHellaSwag', 'Trained on\nSWAG'],
                datasets: [
                    {
                        label: 'Evaluated on HellaSwag',
                        data: [46.7, 34.6],
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 2
                    },
                    {
                        label: 'Evaluated on SWAG',
                        data: [69.1, 86.7],
                        backgroundColor: 'rgba(139, 92, 246, 0.8)',
                        borderColor: 'rgb(139, 92, 246)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e1' }
                    },
                    title: {
                        display: true,
                        text: 'Transfer Between SWAG and HellaSwag (BERT-Large)',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(75, 85, 99, 0.3)' },
                        title: {
                            display: true,
                            text: 'Accuracy (%)',
                            color: '#cbd5e1'
                        }
                    },
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(75, 85, 99, 0.3)' }
                    }
                }
            }
        });
    }

    // Chart 5: SWAG ablations showing biases
    const swagAblationCtx = document.getElementById('swag-ablation-chart');
    if (swagAblationCtx) {
        new Chart(swagAblationCtx, {
            type: 'bar',
            data: {
                labels: ['Full Context', 'Ending Only', 'Shuffled', 'Shuffled +\nEnding Only', 'HellaSwag\n(baseline)'],
                datasets: [{
                    label: 'BERT-Large Accuracy (%)',
                    data: [86.7, 74.8, 77.1, 60.4, 46.7],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(251, 146, 60)',
                        'rgb(251, 146, 60)',
                        'rgb(239, 68, 68)',
                        'rgb(59, 130, 246)'
                    ],
                    borderWidth: 2
                }]
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
                        text: 'SWAG Ablations Show Dataset Biases',
                        color: '#f1f5f9',
                        font: { size: 16 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(75, 85, 99, 0.3)' },
                        title: {
                            display: true,
                            text: 'Accuracy (%)',
                            color: '#cbd5e1'
                        }
                    },
                    x: {
                        ticks: { color: '#cbd5e1', font: { size: 10 } },
                        grid: { color: 'rgba(75, 85, 99, 0.3)' }
                    }
                }
            }
        });
    }

    // Initialize example explorer
    initExampleExplorer();
});

// Interactive example explorer
function initExampleExplorer() {
    const container = document.getElementById('example-explorer');
    if (!container) return;

    let currentExample = 0;
    const examples = hellaSwagExamples;

    function renderExample(index) {
        const example = examples[index];
        const card = document.createElement('div');
        card.className = 'example-card';
        card.id = 'current-example';

        card.innerHTML = `
            <h4>Example ${index + 1} of ${examples.length}: ${example.activity_label} (${example.source}, ${example.split_type})</h4>
            <div class="example-context">
                <strong>Context:</strong> ${example.ctx}
            </div>
            <div class="example-endings">
                <p><strong>Which ending makes the most sense?</strong></p>
                ${example.endings.map((ending, i) => `
                    <div class="example-ending" data-index="${i}">
                        <strong>${String.fromCharCode(65 + i)})</strong> ${ending}
                    </div>
                `).join('')}
            </div>
            <div id="answer-reveal-${index}" style="display: none;" class="answer-reveal"></div>
            <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: space-between;">
                <button class="btn" onclick="showAnswer(${index})" id="show-answer-btn-${index}">Show Answer</button>
                <div>
                    <button class="btn" onclick="changeExample(${index - 1})" ${index === 0 ? 'disabled' : ''}>Previous</button>
                    <button class="btn" onclick="changeExample(${index + 1})" ${index === examples.length - 1 ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        `;

        container.innerHTML = '';
        container.appendChild(card);

        // Add click handlers to endings
        card.querySelectorAll('.example-ending').forEach(ending => {
            ending.addEventListener('click', function() {
                if (!this.classList.contains('revealed')) {
                    selectEnding(index, parseInt(this.dataset.index));
                }
            });
        });
    }

    window.changeExample = function(index) {
        if (index >= 0 && index < examples.length) {
            currentExample = index;
            renderExample(index);
        }
    };

    window.selectEnding = function(exampleIndex, endingIndex) {
        const example = examples[exampleIndex];
        const endings = document.querySelectorAll('.example-ending');
        const reveal = document.getElementById(`answer-reveal-${exampleIndex}`);
        
        endings.forEach((ending, i) => {
            ending.classList.add('revealed');
            if (i === example.label) {
                ending.classList.add('correct');
            } else if (i === endingIndex) {
                ending.classList.add('wrong');
            }
        });

        if (endingIndex === example.label) {
            reveal.innerHTML = '✓ <strong>Correct!</strong> You selected the human-written ending.';
        } else {
            reveal.innerHTML = `✗ <strong>Incorrect.</strong> You selected a machine-generated ending. The correct answer is <strong>${String.fromCharCode(65 + example.label)}</strong>.`;
        }
        reveal.style.display = 'block';
        document.getElementById(`show-answer-btn-${exampleIndex}`).style.display = 'none';
    };

    window.showAnswer = function(exampleIndex) {
        const example = examples[exampleIndex];
        const endings = document.querySelectorAll('.example-ending');
        const reveal = document.getElementById(`answer-reveal-${exampleIndex}`);
        
        endings.forEach((ending, i) => {
            ending.classList.add('revealed');
            if (i === example.label) {
                ending.classList.add('correct');
            }
        });

        reveal.innerHTML = `The correct answer is <strong>${String.fromCharCode(65 + example.label)}</strong>. This was the actual human-written continuation from the dataset.`;
        reveal.style.display = 'block';
        document.getElementById(`show-answer-btn-${exampleIndex}`).style.display = 'none';
    };

    renderExample(currentExample);
}
