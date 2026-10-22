# Curriculum Lessons

This directory contains interactive lesson sites for Ivan's alternating paper curriculum on ML post-training and benchmarks.

## Track Structure

**Track A (Foundations):** Core benchmarking concepts and evaluation methodology  
**Track B (SOTA):** State-of-the-art techniques, RLHF, and advanced post-training

Lessons alternate between tracks to build foundations while exploring cutting-edge methods.

## Available Lessons

### Lesson 01 - MMLU: What Makes a Good Benchmark ✅
- **Track:** A (Foundations)
- **Paper:** Measuring Massive Multitask Language Understanding (Hendrycks et al., 2020)
- **Path:** [`01-mmlu-what-makes-a-benchmark/`](01-mmlu-what-makes-a-benchmark/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/01-mmlu-what-makes-a-benchmark/](https://ivanleomk.github.io/workspace-notes/01-mmlu-what-makes-a-benchmark/)
- **Topics:**
  - Benchmark design principles (coverage, difficulty, human baseline)
  - MMLU structure: 57 subjects, 5-shot evaluation
  - Limitations: contamination, multiple choice artifacts, knowledge vs reasoning
  - Connection to post-training: eval before/after SFT/RLHF
- **Interactive Elements:**
  - 11-question quiz with detailed feedback
  - Sample question explorer across 10 subjects
  - Performance visualization charts
- **Status:** Complete

### Lesson 02 - InstructGPT: RLHF & Reward Modeling ✅
- **Track:** B (SOTA)
- **Paper:** Training language models to follow instructions with human feedback (Ouyang et al., 2022)
- **Path:** [`02-instructgpt-rlhf-reward-modeling/`](02-instructgpt-rlhf-reward-modeling/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/02-instructgpt-rlhf-reward-modeling/](https://ivanleomk.github.io/workspace-notes/02-instructgpt-rlhf-reward-modeling/)
- **Topics:**
  - Why SFT alone isn't enough for alignment
  - RLHF three-stage pipeline: SFT → Reward Model → PPO
  - Reward model training on preference comparisons
  - InstructGPT results: 1.3B beats 175B GPT-3 in human evals
  - Failure modes: reward hacking, over-optimization, alignment tax
  - Bridge to Track A: evaluating post-RLHF models with benchmarks
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - Preference ranking examples (3 scenarios)
  - Win rate and dataset size visualizations
- **Status:** Complete

### Lesson 03 - GSM8K: Reasoning Benchmarks ✅
- **Track:** A (Foundations)
- **Paper:** Training Verifiers to Solve Math Word Problems (Cobbe et al., 2021)
- **Path:** [`03-gsm8k-reasoning-benchmarks/`](03-gsm8k-reasoning-benchmarks/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/03-gsm8k-reasoning-benchmarks/](https://ivanleomk.github.io/workspace-notes/03-gsm8k-reasoning-benchmarks/)
- **Topics:**
  - Multi-step reasoning vs knowledge recall
  - GSM8K structure: 8.5K grade-school math word problems
  - Verifiers vs fine-tuning: best-of-N sampling
  - GSM8K vs MATH: difficulty calibration
  - Contamination and saturation
  - Connection to post-training: verifiers → reward models
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - Real GSM8K problem explorer (simple and complex)
  - Verifier performance visualization
  - GSM8K vs MATH comparison chart
- **Status:** Complete

### Lesson 04 - Direct Preference Optimization (DPO) ✅
- **Track:** B (SOTA)
- **Paper:** Direct Preference Optimization: Your Language Model is Secretly a Reward Model (Rafailov et al., 2023)
- **Path:** [`04-dpo-direct-preference-optimization/`](04-dpo-direct-preference-optimization/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/04-dpo-direct-preference-optimization/](https://ivanleomk.github.io/workspace-notes/04-dpo-direct-preference-optimization/)
- **Topics:**
  - Why RLHF with PPO is complex and unstable
  - The key mathematical insight: closed-form optimal policy and reward reparameterization
  - Bradley-Terry preference model and DPO loss function
  - The beta parameter and KL-reward trade-offs
  - Gradient weighting by model confidence
  - Practical training requirements (reference model, preference pairs)
  - DPO vs PPO results on sentiment, summarization, and dialogue
  - Evaluation with GPT-4 as judge and known failure modes
  - Bridge to LLM-as-judge evaluation (Lesson 05)
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - DPO loss explorer with parameter sliders
  - Browsable preference data examples (Anthropic HH-RLHF)
  - Reward vs KL divergence visualization
  - Win rate comparisons across tasks and temperatures
- **Status:** Complete

### Lesson 05 - LLM-as-a-Judge & MT-Bench ✅
- **Track:** A (Foundations)
- **Paper:** Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al., 2023)
- **Path:** [`05-llm-as-judge-mt-bench/`](05-llm-as-judge-mt-bench/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/05-llm-as-judge-mt-bench/](https://ivanleomk.github.io/workspace-notes/05-llm-as-judge-mt-bench/)
- **Topics:**
  - Why open-ended chat quality can't be measured with multiple-choice benchmarks
  - MT-Bench design: 80 multi-turn questions across 8 categories, two-turn structure
  - Chatbot Arena: crowdsourced pairwise votes, Elo ratings, Bradley-Terry model
  - Three LLM judging modes: pairwise comparison, single-answer grading, reference-guided grading
  - Judge biases: position bias, verbosity bias, self-enhancement bias
  - Mitigation strategies: swap positions, few-shot prompting, chain-of-thought, reference answers
  - Agreement results: GPT-4 vs human ~80-85%, comparable to human-human agreement
  - Connection to post-training: LLM judges for preference data (RLAIF), Bradley-Terry model in RLHF/DPO, reward hacking pitfalls (length exploitation, AlpacaEval)
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - MT-Bench question explorer by category (writing, roleplay, reasoning, math, coding, extraction, STEM, humanities)
  - Judge-human agreement comparison chart
  - Position bias demonstration
  - Interactive Elo/Bradley-Terry simulator (add votes, watch ratings update)
  - Agreement by task type visualization
- **Status:** Complete

### Lesson 06 - DeepSeekMath: RL from Verifiable Rewards (GRPO) ✅
- **Track:** B (SOTA)
- **Paper:** DeepSeekMath: Pushing the Limits of Mathematical Reasoning (Shao et al., 2024)
- **Path:** [`06-deepseekmath-grpo/`](06-deepseekmath-grpo/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/06-deepseekmath-grpo/](https://ivanleomk.github.io/workspace-notes/06-deepseekmath-grpo/)
- **Topics:**
  - Why PPO's value network is unnecessary for verifiable rewards
  - GRPO (Group Relative Policy Optimization): group sampling, relative advantages, no critic
  - Verifiable rewards vs learned reward models: rule-based checks for math correctness
  - Outcome supervision vs process supervision for mathematical reasoning
  - DeepSeekMath data pipeline: contamination prevention, quality filtering, math-focused pre-training
  - Results: 51.7% on MATH, 88.2% on GSM8K (7B model rivals 100×+ larger models)
  - GRPO vs PPO: comparable performance with 2× less memory and 1.4× faster training
  - Connection to GSM8K (Lesson 03), RLHF (Lesson 02), DPO (Lesson 04), LLM-as-Judge (Lesson 05)
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - Interactive GRPO advantage calculator (set group rewards, see advantages update)
  - Training progression charts (Base → SFT → GRPO)
  - MATH performance by difficulty level (RL helps harder problems more)
  - Model comparison: 7B vs 70B, 540B, 1000B+ models
  - GRPO vs PPO efficiency radar chart
- **Status:** Complete

### Lesson 07 - HumanEval: Code Evaluation Benchmarks ✅
- **Track:** A (Foundations)
- **Paper:** Evaluating Large Language Models Trained on Code (Chen et al., 2021)
- **Path:** [`07-humaneval-code-benchmarks/`](07-humaneval-code-benchmarks/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/07-humaneval-code-benchmarks/](https://ivanleomk.github.io/workspace-notes/07-humaneval-code-benchmarks/)
- **Topics:**
  - Why code needs functional correctness (unit tests) vs match-based metrics (BLEU)
  - HumanEval design: 164 hand-written problems, function synthesis from docstrings
  - Hand-written problems avoid GitHub training data contamination
  - pass@k metric: unbiased estimation of success rate with k samples
  - Codex results: 28.8% pass@1, 72.3% pass@100 (12B model)
  - Temperature optimization: lower for pass@1, higher for pass@100 (diversity)
  - Baseline comparisons: GPT-3 ~0%, GPT-J 11.6%, Codex-12B 28.8%
  - Limitations: long operation chains, variable binding, sample inefficiency
  - Connection to verifiable rewards (Lesson 06 GRPO), contrast with LLM-as-judge (Lesson 05)
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - Problem explorer with sample HumanEval-style problems
  - Model size vs performance scaling chart
  - pass@k improvement visualization
  - Sample selection strategies comparison
  - Codex vs baselines bar chart
- **Status:** Complete

### Lesson 08 - Constitutional AI: Harmlessness from AI Feedback ✅
- **Track:** B (SOTA)
- **Paper:** Constitutional AI: Harmlessness from AI Feedback (Bai et al., Anthropic, 2022)
- **Path:** [`08-constitutional-ai/`](08-constitutional-ai/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/08-constitutional-ai/](https://ivanleomk.github.io/workspace-notes/08-constitutional-ai/)
- **Topics:**
  - Scaling supervision: using AI to help supervise AI with fewer human labels
  - The constitution: ~16 natural language principles guiding harmlessness
  - Two-stage pipeline: SL-CAI (critique→revision→SFT) and RL-CAI (RLAIF)
  - Critique-revision process: model critiques its own harmful responses and revises them
  - RLAIF (RL from AI Feedback): AI-generated preference labels for harmlessness
  - Non-evasive harmlessness: engaging thoughtfully vs refusing to answer
  - Chain-of-thought in AI feedback and probability clamping (40-60%)
  - Progressive improvement with multiple revisions (Figure 5)
  - Better harmlessness-helpfulness tradeoff vs traditional HH RLHF (Figures 2-3)
  - Critiques help smaller models more; CoT improves feedback quality
  - Goodharting risk: over-training leads to boilerplate or overly harsh responses
  - Bridge to RLHF (Lesson 02), DPO (Lesson 04), LLM-as-Judge (Lesson 05), GRPO (Lesson 06)
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - Constitution principles explorer (8 sample principles from paper Appendix C)
  - Critique→revision walkthrough with example
  - Progressive revision improvement chart (Figure 5 approximate)
  - Harmlessness vs helpfulness Pareto frontier (Figure 2 qualitative)
  - Model size scaling chart (Figure 3 approximate)
  - Critiqued vs direct revisions comparison (Figure 7 approximate)
- **Status:** Complete

### Lesson 09 - HELM: Holistic Evaluation of Language Models ✅
- **Track:** A (Foundations)
- **Paper:** Holistic Evaluation of Language Models (Liang et al., Stanford CRFM, 2022)
- **Path:** [`09-helm-holistic-evaluation/`](09-helm-holistic-evaluation/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/09-helm-holistic-evaluation/](https://ivanleomk.github.io/workspace-notes/09-helm-holistic-evaluation/)
- **Topics:**
  - Why single-metric evaluation is incomplete for general-purpose LMs
  - HELM's three pillars: broad coverage + recognition of incompleteness, multi-metric measurement, standardization
  - Scenario taxonomy: task × domain × language (16 core scenarios)
  - 7 metric categories: accuracy, calibration, robustness, fairness, bias, toxicity, efficiency
  - 87.5% density: 98/112 (scenario, metric) pairs measured
  - Coverage improvement: 17.9% → 96.0% across 30 models from 12 organizations
  - Key findings: instruction-tuning advantage, prompt sensitivity (30-50% swings), accuracy-robustness tradeoffs
  - 4,939 evaluation runs across 42 total scenarios (16 core + 26 targeted), 21 new to mainstream evaluation
  - Bridge to post-training: HELM's multi-metric lens exposes tradeoffs in RLHF/DPO/GRPO/CAI
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - Scenario & metric explorer (browse 8 core scenarios and 7 metric categories)
  - Coverage charts: before HELM (17.9%) vs after (96.0%)
  - Multi-metric density visualization (87.5% of pairs measured)
  - Metric category coverage across scenarios
- **Status:** Complete

### Lesson 10 - Tülu 3: Open Post-Training ✅
- **Track:** B (SOTA)
- **Paper:** Tülu 3: Pushing Frontiers in Open Language Model Post-Training (Lambert et al., Allen AI, 2024)
- **Path:** [`10-tulu3-open-post-training/`](10-tulu3-open-post-training/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/10-tulu3-open-post-training/](https://ivanleomk.github.io/workspace-notes/10-tulu3-open-post-training/)
- **Topics:**
  - Complete end-to-end open post-training pipeline: Data Curation → SFT → DPO → RLVR
  - 23.3M curated prompts, 939K used in SFT with skill-specific synthetic data
  - On-policy DPO preference data and length-normalized loss
  - RLVR: Reinforcement Learning with Verifiable Rewards (math, instruction-following)
  - Development vs unseen evaluation splits to detect overfitting
  - Aggressive decontamination and transparent data provenance
  - State-of-the-art results: Tülu 3 70B matches Claude 3.5 Haiku, surpasses Llama 3.1 Instruct
  - Bridge to curriculum: unifies Lessons 02 (RLHF), 04 (DPO), 06 (GRPO), 08 (CAI), 09 (HELM)
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - Tülu 3 data explorer across 5 skill categories
  - Stage-by-stage performance progression charts
  - Tülu 3 70B vs competitors comparison
  - Training pipeline visualization
- **Status:** Complete

### Lesson 11 - IFEval: Instruction-Following Evaluation ✅
- **Track:** A (Foundations)
- **Paper:** Instruction-Following Evaluation for Large Language Models (Zhou et al., Google Research, 2023)
- **Path:** [`11-ifeval-instruction-following/`](11-ifeval-instruction-following/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/11-ifeval-instruction-following/](https://ivanleomk.github.io/workspace-notes/11-ifeval-instruction-following/)
- **Topics:**
  - Verifiable instructions: objective, programmatic evaluation without judge models
  - 25 types of verifiable instructions across 5 categories (Keywords, Language, Length, Content, Format)
  - 541 prompts with 1-3 instructions each, testing multi-constraint satisfaction
  - Strict vs loose accuracy: exact matching vs formatting-tolerant verification
  - Prompt-level (all constraints) vs instruction-level (individual constraints) metrics
  - GPT-4 results: 76.89% prompt-level strict, 83.57% instruction-level strict
  - Detectable Format is hardest category (~75% GPT-4, ~40% PaLM 2 S); Language is easiest (~95%/~80%)
  - Bridge to Tülu 3 (Lesson 10): IFEval as RLVR target with verifiable rewards
  - Complements MT-Bench (Lesson 05): IFEval measures precision, MT-Bench measures quality
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - Instruction type explorer: browse 25 verifiable instruction types with examples
  - Interactive constraint checker: type responses and see strict/loose verification results
  - Overall performance comparison charts (GPT-4 vs PaLM 2 S)
  - Instruction category difficulty radar chart
  - Strict vs loose gap visualization
- **Status:** Complete

## How to View Lessons

### 🌐 Live on GitHub Pages
Lessons are published at **https://ivanleomk.github.io/workspace-notes/**

- [Lesson 01: MMLU](https://ivanleomk.github.io/workspace-notes/01-mmlu-what-makes-a-benchmark/)
- [Lesson 02: InstructGPT/RLHF](https://ivanleomk.github.io/workspace-notes/02-instructgpt-rlhf-reward-modeling/)
- [Lesson 03: GSM8K](https://ivanleomk.github.io/workspace-notes/03-gsm8k-reasoning-benchmarks/)
- [Lesson 04: DPO](https://ivanleomk.github.io/workspace-notes/04-dpo-direct-preference-optimization/)
- [Lesson 05: LLM-as-Judge & MT-Bench](https://ivanleomk.github.io/workspace-notes/05-llm-as-judge-mt-bench/)
- [Lesson 06: DeepSeekMath & GRPO](https://ivanleomk.github.io/workspace-notes/06-deepseekmath-grpo/)
- [Lesson 07: HumanEval & Code Evaluation](https://ivanleomk.github.io/workspace-notes/07-humaneval-code-benchmarks/)
- [Lesson 08: Constitutional AI](https://ivanleomk.github.io/workspace-notes/08-constitutional-ai/)
- [Lesson 09: HELM - Holistic Evaluation](https://ivanleomk.github.io/workspace-notes/09-helm-holistic-evaluation/)
- [Lesson 10: Tülu 3 - Open Post-Training](https://ivanleomk.github.io/workspace-notes/10-tulu3-open-post-training/)
- [Lesson 11: IFEval - Instruction-Following Evaluation](https://ivanleomk.github.io/workspace-notes/11-ifeval-instruction-following/)
- [Lesson 12: DeepSeek-R1 - Reasoning via RL](https://ivanleomk.github.io/workspace-notes/12-deepseek-r1-reasoning-rl/)
- [Lesson 13: TruthfulQA - Imitative Falsehoods](https://ivanleomk.github.io/workspace-notes/13-truthfulqa-imitation-falsehoods/)
- [Lesson 14: SimPO - Simple Preference Optimization](https://ivanleomk.github.io/workspace-notes/14-simpo-reference-free-preference-optimization/)
- [Lesson 15: HellaSwag - Adversarial Filtering](https://ivanleomk.github.io/workspace-notes/15-hellaswag-adversarial-filtering/)
- [Lesson 16: KTO - Prospect Theoretic Alignment](https://ivanleomk.github.io/workspace-notes/16-kto-prospect-theoretic-alignment/)

### 💻 Local Serving (for development)
```bash
# From the repository root:
cd lessons/02-instructgpt-rlhf-reward-modeling/
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

Alternative methods:
```bash
# Using Node.js:
npx serve lessons/02-instructgpt-rlhf-reward-modeling/

# Using PHP:
php -S localhost:8000 -t lessons/02-instructgpt-rlhf-reward-modeling/
```

### Direct File Open
Open `lessons/XX-topic-name/index.html` directly in a browser (most features will work without a server).

## Curriculum Progress

See [`curriculum.md`](curriculum.md) for the full roadmap and completion tracking.

### Lesson 14 - SimPO: Simple Preference Optimization ✅
- **Track:** B (SOTA)
- **Paper:** SimPO: Simple Preference Optimization with Reference-Free Reward (Meng, Xia, Chen, NeurIPS 2024)
- **Path:** [`14-simpo-reference-free-preference-optimization/`](14-simpo-reference-free-preference-optimization/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/14-simpo-reference-free-preference-optimization/](https://ivanleomk.github.io/workspace-notes/14-simpo-reference-free-preference-optimization/)
- **Topics:**
  - Reference-free reward: eliminates DPO's reference model requirement
  - Length-normalized average log-probability: (β/|y|) log π_θ(y|x)
  - Target reward margin γ for improved generalization
  - Length normalization prevents verbosity exploitation
  - SimPO vs DPO: up to 6.4 points improvement on AlpacaEval 2
  - State-of-the-art: Gemma-2-9B-it-SimPO (72.4% LC AlpacaEval 2, 59.1% Arena-Hard)
  - Memory efficiency: ~50% reduction (no reference model)
  - Hyperparameters: β ∈ [2.0, 2.5], γ ∈ [0.5, 1.5]
  - Bridge to DPO (Lesson 04), RLHF (Lesson 02), LLM-as-Judge (Lesson 05)
- **Interactive Elements:**
  - 12-question quiz with detailed feedback
  - Reward margin explorer: interactive toy with β, γ, avg log-prob sliders
  - SimPO vs DPO comparison charts (AlpacaEval 2, Arena-Hard)
  - Length normalization impact visualization
  - Gemma-2-9B-it results across Base/DPO/SimPO
  - Baselines comparison (8 methods on Llama-3-Instruct)
- **Status:** Complete

### Lesson 15 - HellaSwag: Adversarial Filtering ✅
- **Track:** A (Foundations)
- **Paper:** HellaSwag: Can a Machine Really Finish Your Sentence? (Zellers, Holtzman, Bisk, Farhadi, Choi, ACL 2019)
- **Path:** [`15-hellaswag-adversarial-filtering/`](15-hellaswag-adversarial-filtering/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/15-hellaswag-adversarial-filtering/](https://ivanleomk.github.io/workspace-notes/15-hellaswag-adversarial-filtering/)
- **Topics:**
  - Adversarial Filtering: co-evolving benchmarks with state-of-the-art models
  - SWAG→BERT story: how dataset biases allowed "solving" without reasoning
  - Goldilocks zone: ~3 sentences context + ~2 sentences generation
  - 70,000 examples from ActivityNet Captions + WikiHow
  - Human accuracy: 95.6%, BERT-Large: 47.3% (48.3pp gap)
  - In-domain vs zero-shot evaluation
  - Modern context: GPT-4 at 95.3%, benchmark saturation
  - Why benchmarks must co-evolve with models
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - Real HellaSwag examples explorer
  - Overall performance comparison charts
  - Domain comparison (ActivityNet vs WikiHow)
  - Transfer experiments visualization
  - SWAG ablation results
- **Status:** Complete

### Lesson 16 - KTO: Model Alignment as Prospect Theoretic Optimization ✅
- **Track:** B (SOTA)
- **Paper:** KTO: Model Alignment as Prospect Theoretic Optimization (Ethayarajh, Xu, Muennighoff, Jurafsky, Kiela, ICML 2024)
- **Path:** [`16-kto-prospect-theoretic-alignment/`](16-kto-prospect-theoretic-alignment/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/16-kto-prospect-theoretic-alignment/](https://ivanleomk.github.io/workspace-notes/16-kto-prospect-theoretic-alignment/)
- **Topics:**
  - Binary feedback instead of paired preferences (desirable/undesirable)
  - Prospect theory: Kahneman-Tversky value function (α=0.88, λ=2.25)
  - Human-Aware Losses (HALOs): DPO and PPO-Clip are HALOs
  - KTO loss: reference point z₀ = KL divergence, value function σ(β(r_θ - z₀))
  - Hyperparameters: β (risk aversion), λ_D/λ_U (loss aversion)
  - KTO ≥ DPO at 1B-30B scale, matches with 90% fewer desirable examples
  - Can skip SFT at 13B+ when base model is strong
  - GSM8K: +13.5 points over DPO (40.0% → 53.5%)
  - When to use KTO vs DPO: noise, intransitivity, data format
- **Interactive Elements:**
  - 12-question quiz with detailed feedback
  - Interactive value function explorer with β, λ, z₀ sliders
  - KTO vs DPO winrate comparisons across scales
  - Benchmark results charts (MMLU, GSM8K, HumanEval, BBH)
  - Data imbalance robustness visualization
  - HALO vs non-HALO performance comparison
- **Status:** Complete
- **Track:** A (Foundations)
- **Paper:** TruthfulQA: Measuring How Models Mimic Human Falsehoods (Lin, Hilton, Evans, ACL 2022)
- **Path:** [`13-truthfulqa-imitation-falsehoods/`](13-truthfulqa-imitation-falsehoods/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/13-truthfulqa-imitation-falsehoods/](https://ivanleomk.github.io/workspace-notes/13-truthfulqa-imitation-falsehoods/)
- **Topics:**
  - Imitative falsehoods: models learn human misconceptions from web text
  - Benchmark design: 817 questions, 38 categories, adversarially crafted
  - Generation task vs multiple-choice (MC1/MC2) variants
  - Metrics: truthfulness, informativeness, true+informative, GPT-judge
  - Inverse scaling: larger models less truthful (GPT-Neo/J-6B: 23% vs 125M: 40%)
  - Human baseline (94%) vs best model (GPT-3-175B helpful: 58%)
  - Why next-token imitation fails at truthfulness
  - Connection to post-training: RLHF/DPO/CAI as solutions
- **Interactive Elements:**
  - 10-question quiz with detailed feedback
  - Category explorer: 6 categories with real TruthfulQA examples
  - Inverse scaling chart showing model size vs truthfulness
  - Human vs model performance comparison
  - Control questions showing positive scaling returns
  - Prompt effects visualization
- **Status:** Complete

### Lesson 14 - SimPO: Simple Preference Optimization ✅
- **Track:** B (SOTA)
- **Paper:** SimPO: Simple Preference Optimization with a Reference-Free Reward (Meng, Xia, Chen, NeurIPS 2024)
- **Path:** [`14-simpo-reference-free-preference-optimization/`](14-simpo-reference-free-preference-optimization/)
- **Live:** [https://ivanleomk.github.io/workspace-notes/14-simpo-reference-free-preference-optimization/](https://ivanleomk.github.io/workspace-notes/14-simpo-reference-free-preference-optimization/)
- **Topics:**
  - Reference-free reward: eliminates DPO's reference model requirement
  - Length-normalized average log-probability: (β/|y|) log π_θ(y|x)
  - Target reward margin γ for improved generalization
  - Length normalization prevents verbosity exploitation
  - SimPO vs DPO: up to 6.4 points improvement on AlpacaEval 2
  - State-of-the-art: Gemma-2-9B-it-SimPO (72.4% LC AlpacaEval 2, 59.1% Arena-Hard)
  - Memory efficiency: ~50% reduction (no reference model)
  - Hyperparameters: β ∈ [2.0, 2.5], γ ∈ [0.5, 1.5]
  - Bridge to DPO (Lesson 04), RLHF (Lesson 02), LLM-as-Judge (Lesson 05)
- **Interactive Elements:**
  - 12-question quiz with detailed feedback
  - Reward margin explorer: interactive toy with β, γ, avg log-prob sliders
  - SimPO vs DPO comparison charts (AlpacaEval 2, Arena-Hard)
  - Length normalization impact visualization
  - Gemma-2-9B-it results across Base/DPO/SimPO
  - Baselines comparison (8 methods on Llama-3-Instruct)
- **Status:** Complete

## Contributing

To add a new lesson:
1. Create a directory: `lessons/XX-topic-name/`
2. Build a self-contained static site (HTML/CSS/JS)
3. Update this README and `curriculum.md`
4. Test locally before pushing
