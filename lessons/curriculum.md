# Post-Training & Benchmarking Curriculum

Ivan's alternating-track curriculum: foundations (Track A) + state-of-the-art techniques (Track B).

## Curriculum Design

**Track A:** Benchmarking foundations, evaluation methodology, understanding what models can/cannot do  
**Track B:** Post-training techniques (RLHF, DPO, etc.), reward modeling, alignment

Lessons alternate tracks to interleave theory with practice.

## Lesson Plan

| # | Track | Status | Topic | Paper/Resource |
|---|-------|--------|-------|----------------|
| 01 | A | ✅ Complete | MMLU: What Makes a Good Benchmark | Hendrycks et al. (2020) |
| 02 | B | 📋 Planned | RLHF & Reward Modeling | InstructGPT (Ouyang et al., 2022) |
| 03 | A | 📋 Planned | Reasoning Benchmarks (GSM8K, MATH) | Cobbe et al. (2021) |
| 04 | B | 📋 Planned | Direct Preference Optimization (DPO) | Rafailov et al. (2023) |
| 05 | A | 📋 Planned | LLM-as-Judge & Preference Evals | Zheng et al. (2023) - MT-Bench |
| 06 | B | 📋 Planned | RLHF at Scale & Instability | TBD |
| 07 | A | 📋 Planned | Safety Benchmarks & Red Teaming | TBD |
| 08 | B | 📋 Planned | Constitutional AI | Bai et al. (2022) |

## Learning Objectives by Track

### Track A: Foundations
- Understand what makes a good benchmark (coverage, difficulty, contamination)
- Know the landscape: knowledge (MMLU), reasoning (GSM8K), instruction-following, preferences
- Evaluate models fairly and interpret scores correctly
- Recognize when benchmarks saturate or mislead
- Connect evals to post-training goals

### Track B: State-of-the-Art
- Understand RLHF pipeline: SFT → reward model → PPO/DPO
- Know alternatives: DPO, RLAIF, constitutional AI
- Recognize alignment tax and capability preservation challenges
- Build intuition for reward hacking, mode collapse, instability
- Understand safety considerations and failure modes

## Lesson Format

Each lesson includes:
1. **Teaching Content:** Plain language explanations, no jargon pile-up
2. **Interactive Quizzes:** Immediate feedback, test conceptual understanding
3. **Data/Visualizations:** Explore real benchmark data, see model performance patterns
4. **Post-Training Bridge:** Connect benchmarks to alignment/training (or vice versa)
5. **Resources:** Links to papers, code, datasets
6. **Python Tutorial Placeholder:** Practical implementation (ask Main Guy to generate)

## Current Status

**Completed:**
- ✅ Lesson 01 (Track A): MMLU benchmark fundamentals

**Next Up:**
- 📋 Lesson 02 (Track B): InstructGPT/RLHF intro

## How to Request a Lesson

Ask Main Guy (the agent) to build the next lesson in the sequence. Provide:
- Lesson number and track
- Paper reference
- Specific learning goals or emphasis areas
- Any special interactive elements desired

## Notes

- Python tutorials are placeholders by default—request them explicitly if you want notebook walkthroughs
- Lessons are standalone static sites (no build process required)
- All data and visualizations cite their sources
- Each lesson bridges to the next to maintain narrative flow
