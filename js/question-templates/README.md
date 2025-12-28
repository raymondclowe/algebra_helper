# Question Templates

This directory contains modular question template files for the Algebra Helper application. Each file focuses on a specific topic or level range, making it easier to debug and maintain individual question types.

## Structure

### Core Utilities
- **generator-utils.js** - Shared utility functions and constants used by all question templates
  - Random number generation (`rInt`)
  - Fraction operations (`gcd`, `lcm`, `parseFraction`, `normalizeFraction`)
  - Distractor generation (`ensureUniqueDistractors`, `ensureUniqueDistractorsFractionAware`)
  - Expression evaluation and equivalence checking
  - Unicode function notation converter

### Question Template Modules

Each module exports functions to `window.QuestionTemplates.<ModuleName>` and corresponds to specific difficulty levels:

#### Foundation Topics
- **basic-arithmetic.js** (Level 0-1) - Addition, subtraction, multiplication, division
- **squares-roots.js** (Level 1-2) - Squares, cubes, and roots
- **multiplication-tables.js** (Level 2-3) - Multiplication tables and powers
- **fractions.js** (Level 3-4) - Fraction operations and simplification
- **decimals-percentages.js** (Level 4-5) - Decimals, percentages, and conversions

#### Core Algebra
- **basic-equations.js** (Levels 5-6, 6-7, 8-9, 9-10, 19-20) - Simple to complex equations (lvl1-lvl5)
- **inequalities.js** (Level 7-8) - Solving inequalities
- **quadratics.js** (Level 10-11) - Quadratic equations, completing the square, inverse functions
- **polynomials.js** (Level 11-12) - Polynomial operations, factor theorem

#### Advanced Topics
- **exponentials-logs.js** (Level 12-13) - Exponential and logarithmic functions
- **sequences-series.js** (Level 13-14) - Arithmetic and geometric sequences/series
- **functions.js** (Level 14-15) - Function evaluation, composition, inverses

#### Trigonometry
- **trigonometry.js** (Level 15-16) - Basic trigonometry, standard angles
- **advanced-trig.js** (Level 16-17) - Trigonometric identities, radians, double angles

#### Higher Math
- **vectors.js** (Level 17-18) - Vector operations, dot product, magnitude
- **complex-numbers.js** (Level 18-19) - Complex number operations, modulus
- **calculus.js** (Level 24+) - Integration and series
- **advanced-calculus.js** (Level 20-21) - Chain rule, product rule, critical points

#### Statistics & Probability
- **statistics.js** (Level 21-22) - Mean, median, mode, range
- **probability.js** (Level 22-23) - Basic probability, combinations
- **advanced-probability.js** (Level 23-24) - Conditional probability, expected value

#### Conceptual Understanding
- **why-questions.js** (All Levels) - Conceptual "why" questions for deeper understanding

## Usage

All question template modules are loaded before `generator.js` in `algebra-helper.html`. The main `generator.js` file delegates to these modules based on the difficulty level.

### Adding a New Question Type

1. Create a new file in this directory (e.g., `my-new-topic.js`)
2. Follow the naming convention: `TopicName` becomes `window.QuestionTemplates.TopicName`
3. Use `window.GeneratorUtils` for utility functions (replace `this.rInt` with `utils.rInt`)
4. Add a script tag in `algebra-helper.html` before `generator.js`
5. Add a delegation function in `generator.js`

### Example Template Structure

```javascript
// My New Topic Question Templates
// Level X-Y
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.MyNewTopic = {
    getMyNewTopic: function() {
        const utils = window.GeneratorUtils;
        
        // Generate question parameters
        const a = utils.rInt(1, 10);
        
        // Create answer and distractors
        const correctAnswer = `${a}`;
        const distractors = utils.ensureUniqueDistractors(
            correctAnswer,
            [`${a + 1}`, `${a - 1}`, `${a * 2}`],
            () => `${utils.rInt(1, 20)}`
        );
        
        return {
            tex: `\\text{Question: } ${a}`,
            instruction: "Solve",
            displayAnswer: correctAnswer,
            distractors: distractors,
            explanation: `Explanation goes here.`,
            calc: false
        };
    }
};
```

## Benefits

1. **Easier Debugging** - Each question type is in its own file, making it easy to find and fix issues
2. **Avoid Merge Conflicts** - Multiple developers can work on different question types simultaneously
3. **Better Organization** - Clear separation of concerns by topic and difficulty level
4. **Improved Maintainability** - Smaller, focused files are easier to understand and modify
5. **Modular Testing** - Individual question types can be tested in isolation

## Backward Compatibility

The refactored code maintains full backward compatibility with existing code. The main `generator.js` file re-exports all utility functions and delegates question generation to the appropriate template modules.
