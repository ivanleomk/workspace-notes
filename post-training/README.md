# Post-training lab

Goal: **learn by running**, not by collecting papers. Optimize for minutes-to-signal: small models, small data, fixed eval prompts, write down what changed.

## North star

1. Change one thing.
2. Train something tiny.
3. Compare on the same prompts.
4. Keep a one-paragraph log.

GPUs are available — still start small so the loop stays fast. Scale to Gemma (and friends) once the SFT → preference loop is boringly reliable.

## Read order

1. [00-map.md](00-map.md) — vocabulary
2. [01-curriculum.md](01-curriculum.md) — 1–2 week path
3. [02-lab-loop.md](02-lab-loop.md) — how we run experiments
4. [03-gemma-later.md](03-gemma-later.md) — when / how to scale up

## Success criteria for v0

- [ ] Can explain SFT vs DPO vs RLHF in one breath
- [ ] One completed tiny SFT run with before/after prompts
- [ ] One completed tiny preference (DPO) run on the same eval set
- [ ] A short `experiments/` log entry for each run
