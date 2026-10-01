# Gemma / GPU scaling (parked until the tiny loop works)

Do **not** start here. Unlock when:

- [ ] Tiny SFT + DPO loop has been run at least once end-to-end
- [ ] Eval prompt set is stable
- [ ] You know your VRAM / multi-GPU setup (count, driver, torch)

## Then

- Prefer **LoRA / QLoRA** for instruct and preference fine-tunes on Gemma-class models.
- Keep the same eval prompts from the tiny lab so “Gemma SFT” is comparable to “tiny SFT,” not a new experiment every time.
- Scale data only after a smoke run (10–50 steps) proves the pipeline (load → train → sample).
- Log VRAM peak, tokens/sec, and wall time in every `experiments/` note.

## Still skip until needed

- Full-parameter multi-GPU PPO as the first Gemma experiment
- Huge preference dumps before you can read a 20-pair set by eye

Track candidate checkpoints and exact Hugging Face / Google model IDs here when you pick them (update this file).
