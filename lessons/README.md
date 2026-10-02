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
- **Topics:**
  - Benchmark design principles (coverage, difficulty, human baseline)
  - MMLU structure: 57 subjects, 5-shot evaluation
  - Limitations: contamination, multiple choice artifacts, knowledge vs reasoning
  - Connection to post-training: eval before/after SFT/RLHF
- **Interactive Elements:**
  - 8-question quiz with detailed feedback
  - Sample question explorer across 10 subjects
  - Performance visualization charts
- **Status:** Complete

## How to View Lessons

### 🚨 GitHub Pages Not Available
GitHub Pages for private repositories requires GitHub Pro, Team, or Enterprise. This private repo cannot publish to Pages without upgrading the account plan.

### ✅ Local Serving (Recommended)
```bash
# From the repository root:
cd lessons/01-mmlu-what-makes-a-benchmark/
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

Alternative methods:
```bash
# Using Node.js:
npx serve lessons/01-mmlu-what-makes-a-benchmark/

# Using PHP:
php -S localhost:8000 -t lessons/01-mmlu-what-makes-a-benchmark/
```

### Direct File Open
Open `lessons/01-mmlu-what-makes-a-benchmark/index.html` directly in a browser (most features will work without a server).

## Curriculum Progress

See [`curriculum.md`](curriculum.md) for the full roadmap and completion tracking.

## Contributing

To add a new lesson:
1. Create a directory: `lessons/XX-topic-name/`
2. Build a self-contained static site (HTML/CSS/JS)
3. Update this README and `curriculum.md`
4. Test locally before pushing
