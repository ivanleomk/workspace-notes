# 1–2 week starter path

Aimed at someone already comfortable at nanoGPT / small-model scale.

## Week shape

| Day-ish | Do | Why |
|---------|----|-----|
| 1 | [DeepLearning.AI — Post-training of LLMs](https://learn.deeplearning.ai/courses/post-training-of-llms) | Muscle memory: SFT → DPO → online RL in short labs |
| 2 | [InstructGPT](https://arxiv.org/abs/2203.02155) | Canonical three-stage recipe (SFT → RM → RL) |
| 3 | [DPO](https://arxiv.org/abs/2305.18290) | Why prefs can be a direct loss |
| 4–5 | Spine: [RLHF Book](https://rlhfbook.com/) (+ [course](https://rlhfbook.com/course)) | Modern map (IFT, RMs, PPO/GRPO, direct alignment) |
| 6–10 | Run the [lab loop](02-lab-loop.md) twice (SFT, then DPO) | Feedback > theory |

Optional API once concepts click: Hugging Face TRL (SFTTrainer / DPOTrainer).

## Skip early

- Full multi-GPU PPO from scratch
- Giant preference corpora
- GRPO / RLVR research variants as day-one goals
- Eval-harness sprawl and leaderboard chasing
- “Train a frontier reward model”

Get **SFT → preferences intuition** first.
