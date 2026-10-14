// Data explorer for Tülu 3 datasets
const datasetCategories = [
    {
        name: "General Chat & Diversity",
        description: "Real-world user interactions and diverse conversational data to maintain broad competence and natural dialogue.",
        datasets: [
            {
                name: "WildChat (GPT-4 subset)",
                prompts: "241,307 prompts from real user interactions",
                usage: "100,000 used in SFT, 100,000 in DPO",
                purpose: "Critical for AlpacaEval performance; provides realistic user query distribution",
                license: "AI2 ImpACT License",
                reference: "Zhao et al. (2024)"
            },
            {
                name: "OpenAssistant 1 & 2",
                prompts: "88,838 prompts from volunteer workers",
                usage: "7,132 used in SFT, 7,132 in DPO",
                purpose: "General chatting capability with community-curated quality",
                license: "Apache 2.0",
                reference: "Köpf et al. (2024)"
            },
            {
                name: "No Robots",
                prompts: "9,500 prompts annotated by expert workers",
                usage: "All 9,500 used in both SFT and DPO",
                purpose: "High-quality, expert-curated tasks across diverse open-ended categories",
                license: "CC-BY-NC-4.0",
                reference: "Rajani et al. (2023)"
            },
            {
                name: "FLAN v2",
                prompts: "89,982 prompts from classical NLP tasks",
                usage: "All 89,982 used in SFT, 12,141 in DPO",
                purpose: "Maintains broad task coverage; compilation of many academic datasets",
                license: "Apache 2.0",
                reference: "Longpre et al. (2023)"
            }
        ]
    },
    {
        name: "Math & Reasoning",
        description: "Targeted data for mathematical reasoning, from grade-school word problems to competition-level mathematics.",
        datasets: [
            {
                name: "Tülu 3 Persona MATH",
                prompts: "149,960 synthetic math prompts",
                usage: "All used in SFT",
                purpose: "Persona-driven synthesis for advanced math problems; new with Tülu 3",
                license: "AI2 ImpACT License",
                reference: "Generated using Chan et al. (2024) methodology"
            },
            {
                name: "Tülu 3 Persona GSM",
                prompts: "49,980 synthetic grade-school math prompts",
                usage: "All used in SFT",
                purpose: "Diverse grade-school math word problems; new with Tülu 3",
                license: "AI2 ImpACT License",
                reference: "Generated using Chan et al. (2024) methodology"
            },
            {
                name: "Tülu 3 Persona Algebra",
                prompts: "20,000 synthetic algebra prompts",
                usage: "All used in SFT",
                purpose: "Targeted algebraic reasoning problems; new with Tülu 3",
                license: "AI2 ImpACT License",
                reference: "New dataset"
            },
            {
                name: "OpenMathInstruct 2",
                prompts: "21,972,791 prompts (50,000 sampled)",
                usage: "50,000 in SFT, 26,356 in DPO",
                purpose: "Large-scale synthetic math data; downsampled for computational efficiency",
                license: "Apache 2.0",
                reference: "Toshniwal et al. (2024)"
            },
            {
                name: "NuminaMath-TIR",
                prompts: "64,312 prompts for advanced math",
                usage: "All 64,312 in SFT, 8,677 in DPO",
                purpose: "Tool-integrated reasoning for complex mathematical problems",
                license: "Apache 2.0",
                reference: "Beeching et al. (2024)"
            }
        ]
    },
    {
        name: "Coding",
        description: "Python programming prompts ranging from basic syntax to algorithm implementation.",
        datasets: [
            {
                name: "Tülu 3 Persona Python",
                prompts: "34,999 synthetic Python coding prompts",
                usage: "All used in SFT",
                purpose: "Persona-driven Python programming problems; new with Tülu 3",
                license: "AI2 ImpACT License",
                reference: "Generated using Chan et al. (2024) methodology"
            },
            {
                name: "Evol CodeAlpaca",
                prompts: "107,276 Python coding prompts",
                usage: "All 107,276 in SFT, 14,200 in DPO",
                purpose: "Evolutionary instruction tuning for code generation",
                license: "Apache 2.0",
                reference: "Luo et al. (2023)"
            }
        ]
    },
    {
        name: "Safety & Instruction Following",
        description: "Data for safety training (non-compliance, jailbreak defense) and precise instruction following.",
        datasets: [
            {
                name: "Tülu 3 CoCoNot",
                prompts: "10,983 prompts for non-compliance training",
                usage: "All used in both SFT and DPO",
                purpose: "Teaches the model when and how to refuse harmful requests; new with Tülu 3",
                license: "AI2 ImpACT License",
                reference: "Brahman et al. (2024)"
            },
            {
                name: "Tülu 3 WildJailbreak",
                prompts: "50,000 adversarial prompts",
                usage: "All in SFT, 26,356 in DPO",
                purpose: "Red-team data to improve robustness against jailbreaking attempts; new with Tülu 3",
                license: "AI2 ImpACT License",
                reference: "Jiang et al. (2024)"
            },
            {
                name: "Tülu 3 WildGuardMix",
                prompts: "50,000 safety-focused prompts",
                usage: "All in SFT, 26,356 in DPO",
                purpose: "Safety classification and appropriate response generation; new with Tülu 3",
                license: "AI2 ImpACT License",
                reference: "Han et al. (2024)"
            },
            {
                name: "Tülu 3 Persona IF",
                prompts: "29,980 precise instruction-following prompts",
                usage: "All in SFT, 19,890 in DPO",
                purpose: "Teaches models to follow complex, multi-constraint instructions; new with Tülu 3",
                license: "AI2 ImpACT License",
                reference: "Targets IFEval performance"
            },
            {
                name: "Tülu 3 IF-augmented",
                prompts: "65,530 instruction-following prompts",
                usage: "All used in DPO only",
                purpose: "Preference data for instruction following; new with Tülu 3",
                license: "AI2 ImpACT License",
                reference: "On-policy preference data from SFT model"
            }
        ]
    },
    {
        name: "Knowledge & Multilingual",
        description: "Data for knowledge recall, scientific literature understanding, and multilingual capabilities.",
        datasets: [
            {
                name: "SciRIFF",
                prompts: "35,357 prompts (10,000 sampled)",
                usage: "10,000 in SFT, 17,590 in DPO",
                purpose: "Scientific literature understanding and information extraction",
                license: "Apache 2.0",
                reference: "Wadden et al. (2024)"
            },
            {
                name: "TableGPT",
                prompts: "13,222 prompts (5,000 sampled)",
                usage: "5,000 in SFT, 6,049 in DPO",
                purpose: "Table understanding and reasoning over structured data",
                license: "MIT",
                reference: "Zha et al. (2023)"
            },
            {
                name: "Aya",
                prompts: "202,285 prompts (100,000 sampled)",
                usage: "100,000 in SFT, 32,210 in DPO",
                purpose: "Multilingual instruction following across 101 languages",
                license: "Apache 2.0",
                reference: "Singh et al. (2024)"
            },
            {
                name: "UltraFeedback (decontaminated)",
                prompts: "41,635 preference pairs",
                usage: "All used in DPO only",
                purpose: "Off-policy preference data for general quality improvement; decontaminated version",
                license: "MIT",
                reference: "Cui et al. (2023)"
            }
        ]
    }
];

// Display dataset information
function updateDataset() {
    const select = document.getElementById('datasetSelect');
    const selectedIndex = parseInt(select.value);
    const category = datasetCategories[selectedIndex];
    const display = document.getElementById('dataset-display');
    
    let html = `
        <div class="sample-question">
            <h4>${category.name}</h4>
            <p style="font-style: italic; color: var(--text-secondary); margin-bottom: 20px;">
                ${category.description}
            </p>
    `;
    
    category.datasets.forEach(dataset => {
        html += `
            <div style="background: var(--bg-secondary); padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid var(--primary);">
                <h5 style="margin: 0 0 10px 0; color: var(--primary);">${dataset.name}</h5>
                <p style="margin: 5px 0;"><strong>Scale:</strong> ${dataset.prompts}</p>
                <p style="margin: 5px 0;"><strong>Usage:</strong> ${dataset.usage}</p>
                <p style="margin: 5px 0;"><strong>Purpose:</strong> ${dataset.purpose}</p>
                <p style="margin: 5px 0; font-size: 0.9em; color: var(--text-secondary);">
                    <strong>License:</strong> ${dataset.license}
                </p>
                <p style="margin: 5px 0; font-size: 0.9em; color: var(--text-secondary);">
                    <strong>Reference:</strong> ${dataset.reference}
                </p>
            </div>
        `;
    });
    
    html += `
        </div>
    `;
    
    display.innerHTML = html;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateDataset();
});
