# Lab loop (fast feedback)

## Design rules

1. **One variable per run** (data mix, LR, steps, or preference method — not all).
2. **Fixed eval prompts** (10–30) reused across base / SFT / DPO.
3. **Tiny first**: ~100–300M params, hundreds of SFT pairs, small chosen/rejected set.
4. **Wall-clock budget**: aim for a run you can finish and judge the same evening.
5. **Log in one paragraph**: hypothesis → what you changed → what you saw.

## Minimal experiment

1. Start from a tiny open base (or a small instruction checkpoint if you only care about prefs).
2. **SFT** on a few hundred instruction pairs.
3. Build a small **chosen/rejected** set from the same prompts (human or strong-model ranked).
4. **DPO** (or TRL DPO) on that set.
5. Compare **base vs SFT vs DPO** on the fixed eval prompts — watch style, refusals, and KL/drift, not leaderboards.

## Suggested folder (later)

```
experiments/
  YYYY-MM-DD-short-name/
    hypothesis.md
    config.yaml   # or a short note of knobs
    eval-prompts.md
    notes.md      # after/before qualitative + any metrics
```

## Speed levers

- Smaller model beats bigger model until the loop is muscle memory.
- Cap sequence length and steps aggressively for smoke tests.
- Smoke-test on CPU/1×GPU with 10 steps before overnight jobs.
- Prefer LoRA / QLoRA when you move up in size (see Gemma notes).
