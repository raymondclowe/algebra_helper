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

## Graph and Chart Support

### Two Approaches for Visual Questions

#### 1. Inline Graphs (Legacy - Still Supported)
The original approach embeds graphs directly in the `tex` field:

```javascript
// Example from function-graphs.js
const graphHtml = `
    <div id="graph-123">...</div>
    <script>functionPlot({...})</script>
`;
return {
    tex: graphHtml,
    instruction: "What is the y-intercept?",
    requiresGraphLibrary: true,
    // ... rest of question
};
```

**Pros:** Simple, works with existing code  
**Cons:** Mixes rendering logic with question data, harder to maintain

#### 2. Dedicated Graph Container (NEW - Recommended)
Use the new `graphData` property to render graphs in a dedicated container:

```javascript
return {
    tex: "f(x) = 2x^2 + 3x - 5",  // Question text remains pure LaTeX
    instruction: "Identify the correct graph",
    graphData: {
        type: 'function',  // 'function', 'chart', or 'multiple'
        functions: [
            { fn: '2*x^2 + 3*x - 5', color: 'blue' }
        ],
        options: {
            xDomain: [-5, 5],
            yDomain: [-10, 10],
            width: 400,
            height: 300
        }
    },
    // ... rest of question
};
```

### Graph Types

#### Single Function Plot
```javascript
graphData: {
    type: 'function',
    functions: [
        { fn: 'sin(x)', color: 'blue' },
        { fn: 'cos(x)', color: 'red' }
    ],
    options: {
        xDomain: [-Math.PI, Math.PI],
        yDomain: [-2, 2]
    }
}
```

#### Single Chart (Bar, Line, Pie, etc.)
```javascript
graphData: {
    type: 'chart',
    chartType: 'bar',  // 'bar', 'line', 'pie', 'scatter', etc.
    data: {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [{
            label: 'Frequency',
            data: [12, 19, 3, 5],
            backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
    },
    options: {
        chartOptions: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    }
}
```

#### Multiple Graph Choices (for MC questions)
```javascript
graphData: {
    type: 'multiple',
    choices: [
        {
            label: 'A',
            type: 'function',
            functions: [{ fn: 'x^2', color: 'blue' }],
            options: { xDomain: [-3, 3], yDomain: [-1, 9] }
        },
        {
            label: 'B',
            type: 'function',
            functions: [{ fn: '-x^2', color: 'blue' }],
            options: { xDomain: [-3, 3], yDomain: [-9, 1] }
        },
        // ... more choices (typically 4 for MC)
    ]
}
```

### Benefits of the New System

1. **Separation of Concerns**: Question data separate from rendering
2. **Centralized Rendering**: All graph logic in `graph-renderer.js`
3. **Better Mobile Support**: Responsive container handles sizing
4. **Easier Testing**: Pure data structures are easier to validate
5. **Future-Proof**: Can add new graph types without changing templates

### Migration Guide

If you have existing graph questions using inline HTML, they will continue to work. To migrate:

1. Remove inline HTML/script from `tex` field
2. Add `graphData` property with appropriate structure
3. Set `requiresGraphLibrary: true` (optional, for documentation)
4. Test that graph renders correctly

### API Reference

#### GraphRenderer Methods

```javascript
// Clear any previous graphs
window.GraphRenderer.clearContainer();

// Render a function plot
window.GraphRenderer.renderFunctionPlot(functions, options);

// Render a chart
window.GraphRenderer.renderChart(type, data, options);

// Render multiple graphs as choices
window.GraphRenderer.renderGraphChoices(choices, onSelectCallback);

// Check if libraries are loaded
const libs = window.GraphRenderer.checkLibrariesLoaded();
// Returns: { functionPlot: true/false, chartJs: true/false }
```

### Best Practices

1. **Keep tex Pure**: Use LaTeX for mathematical expressions, not HTML
2. **Responsive Sizing**: Don't hardcode pixel widths, use max-width
3. **Error Handling**: Graph renderer handles missing libraries gracefully
4. **Testing**: Verify graphs render on mobile and desktop
5. **Accessibility**: Ensure graph questions have text alternatives

### Examples

See these files for complete examples:
- `function-graphs.js` - Function plotting examples (currently uses inline approach)
- `data-visualization.js` - Statistical chart examples (currently uses inline approach)
- `trig-graphs.js` - Trigonometric graph examples (currently uses inline approach)

These files can be gradually migrated to use the new `graphData` approach.

---

For questions or issues, refer to the main repository documentation or open an issue.
