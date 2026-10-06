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

## How to View Lessons

### 🌐 Live on GitHub Pages
Lessons are published at **https://ivanleomk.github.io/workspace-notes/**

- [Lesson 01: MMLU](https://ivanleomk.github.io/workspace-notes/01-mmlu-what-makes-a-benchmark/)
- [Lesson 02: InstructGPT/RLHF](https://ivanleomk.github.io/workspace-notes/02-instructgpt-rlhf-reward-modeling/)
- [Lesson 03: GSM8K](https://ivanleomk.github.io/workspace-notes/03-gsm8k-reasoning-benchmarks/)
- [Lesson 04: DPO](https://ivanleomk.github.io/workspace-notes/04-dpo-direct-preference-optimization/)

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

## Contributing

To add a new lesson:
1. Create a directory: `lessons/XX-topic-name/`
2. Build a self-contained static site (HTML/CSS/JS)
3. Update this README and `curriculum.md`
4. Test locally before pushing
