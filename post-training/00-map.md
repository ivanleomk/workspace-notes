# What post-training is

After **pretraining** (next-token prediction on huge unlabeled text), **post-training** turns a base model into something useful.

| Stage | What it teaches | Typical signal |
|-------|-----------------|----------------|
| **SFT / instruction tuning** | Prompt → good answer from demonstrations | Cross-entropy on target tokens |
| **Preference tuning** | Preferred answer beats rejected | Rankings / pairwise prefs |
| **RLHF (classic)** | Same, via reward model + RL (e.g. PPO) | RM score + KL to reference |
| **DPO** | Preferences as a classification-style loss (no explicit RM) | Chosen vs rejected likelihood |
| **Continued pretrain** | More next-token on domain text | Domain fluency, not chat manners |
| **RL with verifiers** | Math/code checkers, unit tests | On-policy reward from tools |

Instruct/SFT is the usual bridge into chat behavior. Preference methods sit on top. Verifier RL is optional later.

Keep the mental model: **behavior cloning first, then steering with preferences, then (maybe) on-policy RL**.
