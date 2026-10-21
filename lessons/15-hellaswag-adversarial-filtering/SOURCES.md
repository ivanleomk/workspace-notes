# HellaSwag Lesson: Source Verification

This document lists all numeric claims, statistics, and key facts used in Lesson 15, along with their sources from the original paper (Zellers et al., "HellaSwag: Can a Machine Really Finish Your Sentence?", ACL 2019, arXiv:1905.07830).

## Dataset Statistics

| Claim | Value | Source |
|-------|-------|--------|
| Total dataset size | 70,000 examples | Section 4.4, Table 1 caption |
| ActivityNet examples | ~25,000 | Section 4.3, final paragraph |
| WikiHow examples | ~45,000 | Section 4.3, final paragraph |
| Validation set size | 10,000 (5k in-domain + 5k zero-shot) | Table 1 header |
| Test set size | 10,000 (5k in-domain + 5k zero-shot) | Table 1 header |
| ActivityNet avg length | ~13 tokens per ending | Figure 7 caption |
| WikiHow avg length | ~41 tokens per ending | Figure 7 caption |

## Human Performance

| Claim | Value | Source |
|-------|-------|--------|
| Human overall validation accuracy | 95.7% | Table 1 |
| Human overall test accuracy | 95.6% | Table 1 |
| Human in-domain validation accuracy | 95.6% | Table 1 |
| Human zero-shot validation accuracy | 95.8% | Table 1 |
| Human ActivityNet validation accuracy | 94.0% | Table 1 |
| Human WikiHow validation accuracy | 96.5% | Table 1 |
| ActivityNet initial human accuracy (before validation) | 60% | Figure 6 |
| ActivityNet final human accuracy (after validation) | 94% | Figure 6, Section 4.3 |
| WikiHow initial human accuracy | 93.5% | Section 4.3 |
| WikiHow final human accuracy | 96.5% | Section 4.3 |

## Model Performance (Overall)

All values from Table 1 of the paper.

| Model | Validation (Overall) | Test (Overall) | In-Domain (Val) | Zero-Shot (Val) |
|-------|---------------------|----------------|-----------------|-----------------|
| BERT-Large | 46.7% | 47.3% | 50.2% | 43.3% |
| BERT-Base | 39.5% | 40.5% | 42.9% | 36.1% |
| OpenAI GPT | 41.9% | 41.7% | 45.3% | 38.6% |
| ESIM+ELMo | 33.6% | 33.3% | 35.7% | 31.5% |
| LSTM+BERT-Base | 35.9% | 36.2% | 38.7% | 33.2% |
| LSTM+ELMo | 31.7% | 31.4% | 33.2% | 30.4% |
| LSTM+GloVe | 31.9% | 31.7% | 34.3% | 29.5% |
| fastText | 30.9% | 31.6% | 33.8% | 28.0% |
| Random Chance | 25.0% | 25.0% | 25.0% | 25.0% |

**Source:** Table 1 (complete table showing all models and splits)

## Domain-Specific Performance

| Model | ActivityNet (Val) | ActivityNet (Test) | WikiHow (Val) | WikiHow (Test) |
|-------|-------------------|-------------------|---------------|----------------|
| Human | 94.0% | 94.0% | 96.5% | 96.5% |
| BERT-Large | 54.7% | 51.7% | 42.9% | 45.0% |
| BERT-Base | 48.9% | 45.7% | 34.9% | 37.7% |
| OpenAI GPT | 46.4% | 43.8% | 39.8% | 40.5% |
| ESIM+ELMo | 37.7% | 36.6% | 31.6% | 31.5% |

**Source:** Table 1 (ActivityNet and WikiHow columns)

## SWAG Comparison and Ablations

| Setting | Accuracy | Source |
|---------|----------|--------|
| SWAG - Full context (BERT-Large) | 86.7% | Figure 4 |
| SWAG - Ending only (no context) | 74.8% | Figure 4 |
| SWAG - Shuffled words | 77.0% | Figure 4 |
| SWAG - Shuffled + Ending only | 60.4% | Figure 4 |
| HellaSwag - Full context (BERT-Large) | 46.7% | Table 1 |
| Human accuracy on SWAG | 88% | Section 1, Introduction |
| ELMo on SWAG | <60% | Section 1, Introduction |

**Note:** Figure 4 shows these ablations. The paper states the drop from full context to ending-only is 11.9 points (86.7% - 74.8% = 11.9%).

## Transfer Experiments (SWAG ↔ HellaSwag)

| Setting | Accuracy | Source |
|---------|----------|--------|
| BERT on HellaSwag (trained on HellaSwag) | 46.4% | Figure 9 |
| BERT on HellaSwag (trained on SWAG) | 34.6% | Figure 9 |
| BERT on SWAG (trained on SWAG) | 86.7% | Figure 9 |
| BERT on SWAG (trained on HellaSwag) | 71.4% | Figure 9 |

**Source:** Figure 9 (transfer experiments)

## Adversarial Filtering Convergence

| Setting | Converged Accuracy | Source |
|---------|-------------------|--------|
| AF with SWAG's LSTM generator (BERT-Large discriminator) | ~75% | Figure 5 (left) - read from graph |
| AF with OpenAI GPT generator (BERT-Large discriminator) | <30% | Figure 5 (left) |
| WikiHow 1-sentence endings | ~35% (slightly above random) | Figure 5 (right), Section 4.2 |
| WikiHow 2-sentence endings | ~40% | Figure 5 (right), Section 4.2 |
| WikiHow 3-sentence endings | ~50% | Figure 5 (right), Section 4.2 |

**Source:** Figure 5 (Adversarial Filtering results). The paper states: "While the one-sentence case converges to slightly higher than random – 35% when it converges – the two and three sentence cases are higher, at 40% and 50% respectively." (Section 4.2)

## BERT Training Data Requirements

| Training Set Size | BERT Performance | Source |
|-------------------|------------------|--------|
| 16 examples | Better than ESIM+ELMo with full training set | Section 3.1, Figure 3 |
| 64 examples | Outperforms ESIM+ELMo (59%) | Section 3.1 |
| ~16,000 examples | Approaches human performance, then plateaus | Section 3.1, Figure 3 |

**Source:** Section 3.1, Figure 3

## Key Gaps

| Metric | Value | Source |
|--------|-------|--------|
| Human-Model gap (test, overall) | 48.3 percentage points (95.6% - 47.3%) | Calculated from Table 1 |
| In-domain to zero-shot drop (BERT-Large) | ~7 percentage points (50.2% - 43.3%) | Table 1 |
| Zero-shot to in-domain drop (BERT-Base) | ~6.8 percentage points (42.9% - 36.1%) | Table 1 |

## Goldilocks Zone Details

| Finding | Source |
|---------|--------|
| Optimal context: ~3 sentences | Section 4.2, Abstract |
| Optimal generation: ~2 sentences | Section 4.2, Abstract |
| WikiHow 2-sentence endings average 41 tokens | Figure 7 caption |
| ActivityNet endings average 13 tokens | Figure 7 caption |

**Source:** Abstract states "roughly three sentences of context, and two generated sentences" as the Goldilocks zone. Section 4.2 and Figure 5 (right) show experimental validation.

## Modern Context (Post-2019 - Clearly Labeled)

The following information is from sources published after the 2019 paper and is clearly labeled as such in the lesson:

| Claim | Approximate Values | Source Note |
|-------|-------------------|-------------|
| GPT-4 on HellaSwag (2023) | 95.3% (10-shot) | GPT-4 Technical Report (OpenAI, 2023) |
| Claude 3 Opus (2024) | 95.4% (10-shot) | Claude 3 Model Card (Anthropic, March 2024) |

**Note:** These values are not from the original paper. They represent the state of HellaSwag saturation as of 2024-2025, based on public model evaluations.

## Dataset Examples

The interactive examples used in the lesson include four real items from the HellaSwag dataset (from Rowan/hellaswag on Hugging Face) and two illustrative items written for this lesson. The real items' endings are reordered to match the paper's presentation, and the lesson clearly indicates which items are illustrative.

The paper provides example questions with the following structure:
- Context from ActivityNet or WikiHow
- 4 ending choices (1 correct, 3 generated via AF)
- Activity labels for ActivityNet (e.g., "Removing ice from car," "Playing drums")
- Category labels for WikiHow (e.g., "Youth," "Family Life")

**Source:** Figure 1, Figure 8, Figure 10, Table 2 (Appendix)

## Verification Notes

1. **All percentage values** are taken directly from Table 1 or clearly indicated figures (Figure 4, Figure 5, Figure 9).

2. **Approximate values from graphs** (Figure 3, Figure 5) are clearly noted as "approximate" or "read from graph" and include the ~symbol where appropriate.

3. **Post-2019 information** (modern LLM performance) is explicitly labeled as coming from sources published after the paper.

4. **Dataset examples** are representative of the paper's format, with structure based on examples shown in Figures 1, 8, 10 and Table 2.

5. **All quotes** from the paper are verified verbatim.

## Key Quotes (Verified Verbatim)

> "Though its questions are trivial for humans (>95% accuracy), state-of-the-art models struggle (<48%)."
- Source: Abstract

> "The key insight is to scale up the length and complexity of the dataset examples towards a critical 'Goldilocks' zone wherein generated text is ridiculous to humans, yet often misclassified by state-of-the-art models."
- Source: Abstract

> "More broadly, it suggests a new path forward for NLP research, in which benchmarks co-evolve with the evolving state-of-the-art in an adversarial way, so as to present ever-harder challenges."
- Source: Abstract

## Summary

All numeric claims in Lesson 15 are verified against the original HellaSwag paper (arXiv:1905.07830). Where values are approximate (read from graphs), this is clearly noted. Post-2019 information about modern model performance is explicitly labeled with its time period and source type (model reports, leaderboards). The lesson maintains factual accuracy while providing appropriate modern context.
