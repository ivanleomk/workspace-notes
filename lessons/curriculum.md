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
| 02 | B | ✅ Complete | RLHF & Reward Modeling | InstructGPT (Ouyang et al., 2022) |
| 03 | A | ✅ Complete | Reasoning Benchmarks (GSM8K, MATH) | Cobbe et al. (2021) |
| 04 | B | ✅ Complete | Direct Preference Optimization (DPO) | Rafailov et al. (2023) |
| 05 | A | ✅ Complete | LLM-as-Judge & Preference Evals | Zheng et al. (2023) - MT-Bench |
| 06 | B | ✅ Complete | RL from Verifiable Rewards (GRPO) | DeepSeekMath (Shao et al., 2024) |
| 07 | A | ✅ Complete | Code Evaluation Benchmarks | HumanEval (Chen et al., 2021) |
| 08 | B | ✅ Complete | Constitutional AI | Bai et al. (2022) |
| 09 | A | ✅ Complete | Holistic Evaluation (HELM) | Liang et al. (2022) |
| 10 | B | ✅ Complete | Tülu 3: Open Post-Training | Lambert et al. (Allen AI, 2024) |
| 11 | A | ✅ Complete | IFEval: Verifiable Instruction-Following | Zhou et al. (Google Research, 2023) |
| 12 | B | ✅ Complete | DeepSeek-R1: Reasoning via RL | DeepSeek-AI (2025) |
| 13 | A | ✅ Complete | TruthfulQA: Imitative Falsehoods | Lin, Hilton, Evans (ACL 2022) |
| 14 | B | 📝 Next | ORPO/SimPO: Alignment without Reward Models | Hong et al. / Meng et al. (2024) |

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
- ✅ Lesson 02 (Track B): InstructGPT, RLHF, and reward modeling
- ✅ Lesson 03 (Track A): GSM8K reasoning benchmarks
- ✅ Lesson 04 (Track B): Direct Preference Optimization (DPO)
- ✅ Lesson 05 (Track A): LLM-as-Judge & MT-Bench
- ✅ Lesson 06 (Track B): DeepSeekMath and GRPO (RL from verifiable rewards)
- ✅ Lesson 07 (Track A): HumanEval and code evaluation benchmarks
- ✅ Lesson 08 (Track B): Constitutional AI (Bai et al., 2022)
- ✅ Lesson 09 (Track A): HELM - Holistic Evaluation of Language Models (Liang et al., 2022)
- ✅ Lesson 10 (Track B): Tülu 3 - Open Post-Training (Lambert et al., Allen AI, 2024)
- ✅ Lesson 11 (Track A): IFEval - Verifiable Instruction-Following Evaluation (Zhou et al., Google Research, 2023)
- ✅ Lesson 12 (Track B): DeepSeek-R1 - Reasoning via Reinforcement Learning (DeepSeek-AI, 2025)
- ✅ Lesson 13 (Track A): TruthfulQA - Imitative Falsehoods (Lin, Hilton, Evans, ACL 2022)

**Next Up:**
Lesson 14 (Track B): Modern preference optimization without reward models. Strong candidates:
- **ORPO (Odds Ratio Preference Optimization):** Hong et al. (2024) - Combines SFT and preference learning in one stage, eliminating the reward model and separate RL phase
- **SimPO (Simple Preference Optimization):** Meng et al. (2024) - Further simplifies DPO by using length-normalized rewards and removing the reference model
- **KTO (Kahneman-Tversky Optimization):** Ethayarajh et al. (2024) - Uses only binary "good/bad" labels instead of pairwise preferences

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
