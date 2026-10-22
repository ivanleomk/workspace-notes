# KTO Lesson Fact-Check Document

This document verifies all numeric claims, statistics, equations, and key facts used in Lesson 16 against the original paper: Ethayarajh, Xu, Muennighoff, Jurafsky, Kiela, "KTO: Model Alignment as Prospect Theoretic Optimization" (ICML 2024), arXiv:2402.01306v5.

## Paper Metadata

| Claim | Source |
|-------|--------|
| Authors: Kawin Ethayarajh, Winnie Xu, Niklas Muennighoff, Dan Jurafsky, Douwe Kiela | Title page |
| Published: ICML 2024 | Title page |
| arXiv: 2402.01306v5 (September 8, 2026 version) | arXiv header |
| Affiliations: Stanford University, Contextual AI | Title page, footnote 1 |

## Core Concept: Prospect Theory

| Claim | Value | Source |
|-------|-------|--------|
| Kahneman-Tversky value function median α (curvature) | 0.88 | Section 3.1, page 2: "median value of hyperparameter α = 0.88" |
| Kahneman-Tversky value function median λ (loss aversion) | 2.25 | Section 3.1, page 2: "λ = 2.25 across individuals" |
| Value function formula | v(z; λ, α, z₀) = (z − z₀)^α if z ≥ z₀, else −λ(z₀ − z)^α | Equation 4, page 3 |
| Original prospect theory paper | Kahneman & Tversky (1979) | Abstract, Section 3.1 |
| Cumulative prospect theory paper | Tversky & Kahneman (1992) | Section 3.1, multiple citations |

## Human-Aware Losses (HALOs)

| Claim | Source |
|-------|--------|
| Definition 3.4: HALOs defined with value function v, reference point Q, implied reward r_θ | Section 3.2, page 3, Definition 3.4 |
| Implied reward formula: r_θ(x, y) = l(y) log[π_θ(y\|x)/π_ref(y\|x)] | Definition 3.4, page 3 |
| Theorem 3.5: DPO and PPO-Clip are HALOs | Section 3.2, page 4, Theorem 3.5 |
| DPO value function: v(z) = log σ(z) | Appendix B, proof of Theorem 3.5, page 14 |
| Reference point for DPO: Q = δ_{y_l} (the rejected output) | Appendix B, page 14 |

## Experimental Setup

| Claim | Source |
|-------|--------|
| Models tested: Pythia-{1.4B, 2.8B, 6.9B, 12B}, Llama-{7B, 13B, 30B} | Section 3.3, page 4 |
| Datasets: Anthropic-HH, OpenAssistant, SHP | Section 3.3, page 5 |
| Judge: GPT-4-0613 | Section 3.3, page 5 |
| Evaluation: winrate vs. SFT targets (helpfulness, harmlessness, conciseness) | Section 3.3, page 5 |

## HALO vs Non-HALO Results (Section 3.3, Figure 2)

| Claim | Source |
|-------|--------|
| HALOs match or outperform non-HALOs at every scale | Section 3.3, page 5: "HALOs either match or outperform non-HALOs at every scale" |
| Significance only at 13B+ (p < 0.05 after correction) | Section 3.3, page 5: "gap is only significant (p < 0.05) at 13B+ model sizes after correcting for multiple comparisons (Holm, 1979)" |
| Only HALO-aligned Llama-{13B, 30B} achieve winrate ≥50% | Section 3.3, page 5: "only the HALO-aligned Llama-{13B, 30B} models match or exceed a win rate of 50%" |
| Offline PPO with +1/-1 dummy rewards matches DPO up to 13B | Section 3.3, page 5: "Despite only using dummy +1/-1 rewards, our offline PPO variant performs as well as DPO for all models except Llama-30B" |

## KTO Loss Function

| Claim | Source |
|-------|--------|
| KTO loss formula: L_KTO = E[λ_y - v(x, y)] | Equation 8, page 5 |
| Implied reward: r_θ(x, y) = log[π_θ(y\|x)/π_ref(y\|x)] | Equation 8, page 5 |
| Reference point: z₀ = KL(π_θ(y'\|x) \|\| π_ref(y'\|x)) | Equation 8, page 5 |
| Value function (desirable): λ_D σ(β(r_θ - z₀)) | Equation 8, page 5 |
| Value function (undesirable): λ_U σ(β(z₀ - r_θ)) | Equation 8, page 5 |
| KL estimate formula | Equation (unnumbered), page 6: max(0, (1/m) Σ log[π_θ(y_j\|x_i)/π_ref(y_j\|x_i)]) |

## Hyperparameters (Section 4.2, Table 1)

| Claim | Value | Source |
|-------|-------|--------|
| Default β | 0.1 | Section 4.2, page 7: "A default choice of β = 0.1 works well in most cases" |
| β range for finetuned models | [0.01, 0.10) | Section 4.2, page 7: "Smaller values (β ∈ [0.01, 0.10)) are recommended when applying KTO to a model that has already been finetuned" |
| β range for strong pretrained models | (0.10, 0.50] | Section 4.2, page 7: "Larger values (β ∈ (0.10, 0.50]) are recommended when the reference model is already very performant" |
| Default λ_D, λ_U | 1.0, 1.0 | Section 4.2, page 7: "both set to 1 by default" |
| Imbalance adjustment formula | λ_D n_D / (λ_U n_U) ∈ [1, 3/2] | Equation 9, page 7 |
| Default learning rate (8B scale) | 5e-6 with AdamW | Section 4.2, page 7: "we recommend starting at 5e-6 with AdamW" |
| Llama-3 8B SFT+KTO settings | lr=5e-6, β=0.05 | Table 1, page 6 |
| Llama-3 8B Instruct KTO settings | lr=5e-6, β=0.25 | Table 1, page 6 |

## Main Results: KTO vs DPO (Section 4.3, Figure 3)

| Claim | Source |
|-------|--------|
| SFT+KTO competitive with SFT+DPO at 1B-30B | Section 4.3, page 8: "SFT+KTO is competitive with SFT+DPO at scales from 1B to 30B" |
| KTO alone better than DPO alone for Llama-{7B, 13B, 30B}; significant (p < 0.01, Holm-corrected) at 7B and 30B | Section 4.3, page 8: "KTO alone is better than DPO alone for the Llama-{7B, 13B, 30B} models, and this gap is significant (p < 0.01) at 7B and 30B" |
| No significant difference for Pythia models | Section 4.3, page 8: "Among the Pythia models, there is no significant difference between the two" |

Note: Exact winrate values from Figure 3 are approximate (read from graph; y-axis is winrate − 50 in pp):
- Llama-7B: DPO ≈ −19, KTO ≈ −9
- Llama-13B: DPO ≈ −8, KTO ≈ −3
- Llama-30B: DPO ≈ +3.5, KTO ≈ +16.5

## Benchmark Results: Zephyr-β-SFT on UltraFeedback (Table 2)

| Method | MMLU | GSM8K | HumanEval | BBH | Source |
|--------|------|-------|-----------|-----|--------|
| SFT | 57.2% | 39.0% | 30.1% | 46.3% | Table 2, page 7 (top) |
| DPO | 58.2% | 40.0% | 30.1% | 44.1% | Table 2, page 7 (top) |
| ORPO (λ=0.1) | 57.1% | 36.5% | 29.5% | 47.5% | Table 2, page 7 (top) |
| KTO (β=0.1, λ_D=1) | 58.6% | 53.5% | 30.9% | 52.6% | Table 2, page 7 (top) |

**GSM8K improvement claim:** 53.5% - 40.0% = 13.5 percentage points (stated in text: Section 4.3, page 8: "swapping DPO for KTO when aligning Zephyr-β-SFT...improves performance by 13.5 points")

## Ablation Results (Table 2, middle section)

| Variant | MMLU | GSM8K | HumanEval | BBH | Source |
|---------|------|-------|-----------|-----|--------|
| KTO (baseline) | 58.6% | 53.5% | 30.9% | 52.6% | Table 2, page 7 (middle) |
| KTO (one-y-per-x) | 58.0% | 50.0% | 30.7% | 49.9% | Table 2, page 7 (middle) |
| KTO (no z₀) | 58.5% | 49.5% | 30.7% | 49.0% | Table 2, page 7 (middle) |
| KTO (concave, v=−log σ) | 58.3% | 42.5% | 30.6% | 43.2% | Table 2, page 7 (middle) |
| KTO (risk-neutral, v=identity) | 57.3% | 42.0% | 28.8% | 6.1% | Table 2, page 7 (middle) |
| KTO (no π_ref, λ_D=1.75) | 57.5% | 47.5% | 29.5% | 51.6% | Table 2, page 7 (middle) |

**Key drops mentioned in text:**
- No z₀: BBH 52.6% → 49.0% (−3.6 pts), GSM8K 53.5% → 49.5% (−4.0 pts) — Section 4.3, page 9: "removing the reference point z₀ causes a 3.6 and 4.0 point drop on BBH and GSM8K respectively"
- Concave everywhere: BBH 52.6% → 43.2% (−9.4 pts), GSM8K 53.5% → 42.5% (−11.0 pts) — Section 4.3, page 9

## Data Imbalance Results (Figure 5, Section 4.3)

| Claim | Source |
|-------|--------|
| KTO matches DPO while using up to 90% fewer desirable examples | Section 4.3, page 8: "up to 90% of the desirable data can in fact be discarded while still outperforming DPO" |
| 1:10 desirable:undesirable ratio tested | Section 4.3, page 8: "ratio of desirable:undesirable examples goes from 1:1 to 1:10" |
| λ adjustment for 90% drop: λ_U=1, λ_D=13.33 | Section 4.3, page 8: "when we drop 90% of the desirable data, we set λ_U = 1, λ_D = 13.33" |

Note: Figure 5 shows approximate winrates maintained across imbalance levels; exact values are read from graph and noted as approximate.

## One-y-per-x Results: Mistral-7B on OpenAssistant (Table 3)

| Method | Winrate vs. SFT Target | Source |
|--------|------------------------|--------|
| Mistral-7B (unaligned) | 52.5% ± 3.7% | Table 3, page 9 |
| Mistral-7B + DPO | 60.0% ± 3.7% | Table 3, page 9 |
| Mistral-7B + KTO (all y per x) | 65.2% ± 3.6% | Table 3, page 9 |
| Mistral-7B + KTO (one y per x) | 63.1% ± 3.6% | Table 3, page 9 |
| Mistral-7B-Instruct | 62.1% ± 3.1% | Table 3, page 9 |

**Data reduction claim:** One-y-per-x reduces data by 72% (stated in text: Section 4.3, page 8: "reducing the amount of training data by 72%")

## KTO Without SFT (Section 4.3, Figure 4)

| Claim | Source |
|-------|--------|
| KTO-aligned Llama-{13B, 30B} competitive with SFT+KTO without SFT | Section 4.3, page 8: "A KTO-aligned Llama-{13B, 30B} model is competitive with its SFT+KTO counterpart despite not undergoing SFT first" |
| KTO is only method tested showing this behavior | Section 4.3, page 8: "is the only alignment method of the ones we tested to show this behavior" |
| DPO without SFT causes response length to increase dramatically | Section 4.3, page 8; Figure 4 caption: "running DPO without SFT prior causes the response length to increase dramatically" |

## Human Evaluation (Appendix D)

| Metric | Value | Source |
|--------|-------|--------|
| Sample size | 256 sampled prompts, 214 comparisons per method (after skipping domain-expert questions) | Appendix D, page 18: "256 prompts...leading to 214 comparisons for DPO and KTO each" |
| KTO winrate (human) | 72.9% ± 5.3% | Appendix D, page 18: "72.9% ± 5.3 for KTO" |
| DPO winrate (human) | 62.1% ± 5.7% | Appendix D, page 18: "62.1% ± 5.7 for DPO" |
| Confidence intervals | 90% binomial CIs | Appendix D, page 18 |
| Significance | p < 0.05 | Appendix D, page 18: "there is a significant difference with human evaluation at p < 0.05" |
| Human-GPT4 agreement (KTO) | 68.7% | Appendix D, page 18: "68.7% of the individual human judgments concurred with the GPT-4 judgments for KTO" |
| Human-GPT4 agreement (DPO) | 65.9% | Appendix D, page 18: "this number fell to 65.9% for DPO" |

## Theoretical Results

| Theorem | Statement | Source |
|---------|-----------|--------|
| Proposition 4.1 | As reference-adjusted reward → ±∞, KTO gradient → 0 (if ∇log π bounded) | Section 4.4, page 9; Appendix B, page 16 |
| Theorem 4.2 | Reward equivalence classes induce same optimal policy and Bradley-Terry preferences but different value distributions | Section 4.4, page 9; Appendix B, page 16 |
| Theorem 4.3 | For contradictory preferences (p majority, 1−p minority), DPO can prefer minority output under certain conditions; KTO increases majority likelihood (loss-neutral case) | Section 4.4, page 10; Appendix B, pages 16-17 |

## Equations Verification

All equations are verified verbatim from the paper:

| Equation | Number | Content | Source |
|----------|--------|---------|--------|
| Bradley-Terry model | (1) | p*(y_w ≻ y_l\|x) = σ(r*(x, y_w) − r*(x, y_l)) | Page 2 |
| RLHF objective | (2) | E[r_ϕ(x, y)] − β KL(π_θ \|\| π_ref) | Page 2 |
| DPO loss | (3) | −log σ(β log[π_θ(y_w\|x)/π_ref(y_w\|x)] − β log[π_θ(y_l\|x)/π_ref(y_l\|x)]) | Page 2 |
| Kahneman-Tversky value | (4) | v(z; λ, α, z₀) = (z−z₀)^α if z≥z₀, else −λ(z₀−z)^α | Page 3 |
| HALO human value | (5) | v_{x,y}(r_θ(x, y) − E_Q[r_θ(x, Y')]) | Page 3 |
| HALO definition | (6) | f = E[a_{x,y} v_{x,y}(r_θ − E_Q[r_θ])] + C_D | Page 3 |
| Optimal policy reward | (7) | r_θ*(x, y) = r*(x, y) − β log Z(x) | Page 3 |
| KTO loss | (8) | L_KTO = E[λ_y − v(x, y)] | Page 5 |
| Imbalance adjustment | (9) | λ_D n_D / (λ_U n_U) ∈ [1, 3/2] | Page 7 |

## Quotes Verification

All quotes are verbatim from the paper:

> "Kahneman & Tversky's prospect theory tells us that humans perceive random variables in a biased but well-defined manner" (Abstract, page 1)

> "We call this approach KTO, and it matches or exceeds the performance of preference-based methods at scales from 1B to 30B, despite only learning from a binary signal of whether an output is desirable" (Abstract, page 1)

> "Despite only using dummy +1/-1 rewards, our offline PPO variant performs as well as DPO for all models except Llama-30B" (Section 3.3, page 5)

> "the optimal learning rate for KTO is usually 2x to 10x the optimal learning rate for DPO" (Section 4.2, page 7)

> "the greater β is, the more quickly the value saturates, meaning the human is simultaneously more risk-averse in gains and more risk-seeking in losses" (Section 4.1, page 6)

## Links Verification

All links referenced in the lesson are active and correct:

| Resource | URL | Status |
|----------|-----|--------|
| KTO paper | https://arxiv.org/abs/2402.01306 | ✓ Active |
| Official code | https://github.com/ContextualAI/HALOs | ✓ Active |
| TRL library | https://github.com/huggingface/trl | ✓ Active |
| Anthropic-HH dataset | https://huggingface.co/datasets/Anthropic/hh-rlhf | ✓ Active |
| OpenAssistant dataset | https://huggingface.co/datasets/OpenAssistant/oasst1 | ✓ Active |
| UltraFeedback dataset | https://huggingface.co/datasets/openbmb/UltraFeedback | ✓ Active |
| DPO paper | https://arxiv.org/abs/2305.18290 | ✓ Active |
| SimPO paper | https://arxiv.org/abs/2405.14734 | ✓ Active |
| ORPO paper | https://arxiv.org/abs/2403.07691 | ✓ Active |
| Kahneman & Tversky (1979) | https://www.jstor.org/stable/1914185 | ✓ Active |
| Tversky & Kahneman (1992) | https://link.springer.com/article/10.1007/BF00122574 | ✓ Active |

## Notes on Approximate Values

The following values are read from figures and noted as approximate in the lesson:

1. **Figure 3 winrates:** The exact winrate values for KTO vs DPO across Llama models are read from the bar chart and are approximate (±2 pp). The y-axis shows winrate − 50 (pp). The text confirms the qualitative findings (KTO better than DPO alone, significance at 7B and 30B).

2. **Figure 5 data imbalance:** The winrate values at different imbalance levels are read from the line chart and are approximate (±1–2 pp). The y-axis shows absolute winrate vs SFT target (%). The key finding (90% data can be discarded) is stated explicitly in the text.

3. **Figure 2 HALO comparison:** The winrate values for different methods on Llama models are read from the bar chart and are approximate (±2 pp). The y-axis shows winrate − 50 (pp). The significance threshold (p < 0.05 at 13B+) is stated in the text.

All other numeric values are exact from tables or explicitly stated in the text.

## Summary

All equations verified verbatim from the paper. All tables verified exactly. All author names, affiliations, and paper metadata verified. All quotes verified verbatim (including corrected abstract quote). All links checked and active. All approximate values (from figures) noted as such in captions and text. All claims traceable to specific sections/pages of the paper.
