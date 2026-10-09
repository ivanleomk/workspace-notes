// Data from "Evaluating Large Language Models Trained on Code" 
// Chen et al., 2021, arXiv:2107.03374
// All numbers verified from paper tables and text

const humanEvalData = {
    // HumanEval dataset characteristics (Section 2.2)
    datasetInfo: {
        totalProblems: 164,
        avgTestsPerProblem: 7.7,
        handWritten: true,
        language: 'Python',
        purpose: 'Standalone function synthesis from docstrings'
    },

    // Codex model performance on HumanEval (Table 1)
    // All values from Table 1 in the paper
    codexPerformance: {
        models: ['Codex-12M', 'Codex-85M', 'Codex-300M', 'Codex-679M', 'Codex-2.5B', 'Codex-12B'],
        pass1: [2.00, 8.22, 13.17, 16.22, 21.36, 28.81],
        pass10: [3.62, 12.81, 20.37, 25.70, 35.42, 46.81],
        pass100: [8.58, 22.40, 36.27, 40.95, 59.50, 72.31]
    },

    // Codex-S (supervised fine-tuned) performance (Section 4.5 & Figure 10)
    // Codex-S-12B results from the paper
    codexSPerformance: {
        model: 'Codex-S-12B',
        pass1: 37.7,  // From abstract and Figure 1
        pass100: 77.5  // From abstract and Figure 1
    },

    // Baseline model comparisons (Table 1, Section 3.4)
    baselineComparison: {
        models: ['GPT-Neo 2.7B', 'GPT-J 6B', 'TabNine', 'Codex-300M', 'Codex-12B'],
        pass1: [6.41, 11.62, 2.58, 13.17, 28.81],
        pass100: [21.37, 27.74, 7.59, 36.27, 72.31],
        notes: ['The Pile + 8% GitHub', 'The Pile + 8% GitHub', 'Commercial tool', 'Fine-tuned on GitHub', 'Fine-tuned on GitHub']
    },

    // Training data info (Section 3.1)
    trainingData: {
        totalRepos: 54000000,  // 54 million public repos
        rawSize: '179 GB',
        filteredSize: '159 GB',
        tokensCount: '~100B',  // Mentioned in training section
        source: 'GitHub (May 2020)'
    },

    // Pass@k by temperature (Section 3.3, Figure 5 description)
    temperatureOptimal: {
        pass1: 0.2,   // T* for pass@1
        pass100: 0.8  // T* for pass@100
    },

    // Example problems difficulty distribution (Figure 2)
    // These are approximate probabilities from the 3 examples shown
    exampleDifficulties: {
        easy: 0.90,   // High pass rate example
        medium: 0.17, // Medium pass rate example
        hard: 0.005   // Low pass rate example
    },

    // Sample selection heuristics (Figure 7, Section 3.3)
    // Performance when selecting 1 sample from k generated
    sampleSelection: {
        methods: ['Random', 'Mean log-prob', 'Oracle (upper bound)'],
        // Approximate values from Figure 7 for Codex-12B
        pass1: [28.8, 28.8, 28.8],
        selectFrom10: [29, 35, 47],
        selectFrom100: [29, 44.5, 72.3]
    }
};

// Sample HumanEval-style problems (inspired by paper examples)
// These are simplified versions for educational purposes
const sampleProblems = [
    {
        id: 1,
        difficulty: 'Easy',
        signature: 'def has_close_elements(numbers, threshold):',
        docstring: 'Check if in given list of numbers, are any two numbers closer to each other than given threshold.',
        example: 'has_close_elements([1.0, 2.0, 3.0], 0.5) == False\nhas_close_elements([1.0, 2.8, 3.0, 4.0, 5.0, 2.0], 0.3) == True',
        tests: 3,
        passRate: 0.85
    },
    {
        id: 2,
        difficulty: 'Medium',
        signature: 'def words_string(s):',
        docstring: 'You will be given a string of words separated by commas or spaces. Your task is to split the string into words and return an array of the words.',
        example: 'words_string("Hi, my name is John") == ["Hi", "my", "name", "is", "John"]',
        tests: 5,
        passRate: 0.42
    },
    {
        id: 3,
        difficulty: 'Hard',
        signature: 'def split_words(txt):',
        docstring: 'Given a string of words, return a list of words split on whitespace, if no whitespaces exists in the text you should split on commas, if no commas exists you should return the number of lower-case letters with odd order in the alphabet.',
        example: 'split_words("Hello world!") == ["Hello", "world!"]',
        tests: 10,
        passRate: 0.18
    },
    {
        id: 4,
        difficulty: 'Medium',
        signature: 'def correct_bracketing(brackets: str):',
        docstring: 'brackets is a string of "(" and ")". Return True if every opening bracket has a corresponding closing bracket.',
        example: 'correct_bracketing("(())") == True\ncorrect_bracketing("(()())") == True\ncorrect_bracketing("(((") == False',
        tests: 8,
        passRate: 0.68
    }
];

// Key limitations mentioned in the paper (Section 6)
const limitations = [
    {
        type: 'Long operation chains',
        description: 'Model performance drops exponentially as the number of chained operations in the docstring increases',
        evidence: 'Figure 11 shows ~2-3× performance drop per additional component'
    },
    {
        type: 'Variable binding',
        description: 'Difficulty binding operations to the correct variables, especially with many operations and variables',
        evidence: 'Example in Section 6 shows missing decrement and incorrect return'
    },
    {
        type: 'Sample efficiency',
        description: 'Training requires hundreds of millions of lines of code—far more than human developers see',
        evidence: '159 GB of Python code vs. human learning from much less'
    },
    {
        type: 'Contamination risk',
        description: 'Models trained on GitHub may have seen solutions to public coding problems',
        evidence: 'Hand-written problems needed to avoid solutions from 10+ Codeforces repos'
    }
];

// Export data for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { humanEvalData, sampleProblems, limitations };
}
