// Example: Using the new graphData system for graph-based questions
// This example shows how to create questions that use the dedicated graph container

// Example 1: Single function graph
function exampleFunctionGraphQuestion() {
    const utils = window.GeneratorUtils;
    
    // Generate a simple quadratic
    const a = utils.rInt(1, 3);
    const b = utils.rInt(-4, 4);
    const c = utils.rInt(-3, 3);
    
    // y-intercept is c (when x=0)
    const yIntercept = c;
    
    return {
        tex: `f(x) = ${a}x^2 + ${b}x + ${c}`,
        instruction: "What is the y-intercept of this function? (Look at the graph)",
        displayAnswer: `${yIntercept}`,
        distractors: utils.ensureUniqueDistractors(
            `${yIntercept}`,
            [`${yIntercept + 1}`, `${yIntercept - 1}`, `${b}`],
            () => `${utils.rInt(-8, 8)}`
        ),
        explanation: `The y-intercept is where the graph crosses the y-axis (x = 0). For f(x) = ${a}x² + ${b}x + ${c}, when x = 0, f(0) = ${c}.`,
        calc: false,
        graphData: {
            type: 'function',
            functions: [
                {
                    fn: `${a}*x^2 + ${b}*x + ${c}`,
                    color: 'blue'
                }
            ],
            options: {
                xDomain: [-5, 5],
                yDomain: [-10, 10],
                width: 500,
                height: 350
            }
        }
    };
}

// Example 2: Statistical chart
function exampleChartQuestion() {
    const utils = window.GeneratorUtils;
    
    // Generate random data
    const data = [
        utils.rInt(5, 15),
        utils.rInt(15, 25),
        utils.rInt(10, 20),
        utils.rInt(5, 12)
    ];
    const labels = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    // Find the quarter with highest sales
    const maxValue = Math.max(...data);
    const maxIndex = data.indexOf(maxValue);
    const maxQuarter = labels[maxIndex];
    
    return {
        tex: `\\text{Sales by Quarter (in thousands)}`,
        instruction: "Which quarter had the highest sales?",
        displayAnswer: maxQuarter,
        distractors: labels.filter(q => q !== maxQuarter).slice(0, 3),
        explanation: `Looking at the bar chart, ${maxQuarter} has the tallest bar with ${maxValue}k in sales.`,
        calc: false,
        graphData: {
            type: 'chart',
            chartType: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales (thousands)',
                    data: data,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.5)',
                        'rgba(16, 185, 129, 0.5)',
                        'rgba(251, 146, 60, 0.5)',
                        'rgba(239, 68, 68, 0.5)'
                    ],
                    borderColor: [
                        'rgba(59, 130, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(251, 146, 60, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                chartOptions: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Quarterly Sales Report',
                            color: '#d1d5db',
                            font: { size: 14 }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#9ca3af' },
                            grid: { color: 'rgba(156, 163, 175, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#9ca3af' },
                            grid: { color: 'rgba(156, 163, 175, 0.1)' }
                        }
                    }
                }
            }
        }
    };
}

// Example 3: Multiple graph choices (MC question with graph options)
function exampleMultipleGraphsQuestion() {
    const utils = window.GeneratorUtils;
    
    // The question asks which graph represents y = sin(x)
    const correctAnswer = 'A';
    
    return {
        tex: `\\text{Which graph represents } y = \\sin(x) \\text{ ?}`,
        instruction: "Select the correct graph",
        displayAnswer: correctAnswer,
        distractors: ['B', 'C', 'D'],
        explanation: `Graph A shows the sine function: it starts at (0,0), reaches maximum 1 at π/2, crosses zero at π, reaches minimum -1 at 3π/2, and returns to zero at 2π.`,
        calc: false,
        graphData: {
            type: 'multiple',
            choices: [
                {
                    label: 'A',
                    type: 'function',
                    functions: [{ fn: 'sin(x)', color: 'blue' }],
                    options: { xDomain: [-Math.PI, 2*Math.PI], yDomain: [-1.5, 1.5] }
                },
                {
                    label: 'B',
                    type: 'function',
                    functions: [{ fn: 'cos(x)', color: 'red' }],
                    options: { xDomain: [-Math.PI, 2*Math.PI], yDomain: [-1.5, 1.5] }
                },
                {
                    label: 'C',
                    type: 'function',
                    functions: [{ fn: 'tan(x)', color: 'green' }],
                    options: { xDomain: [-Math.PI, Math.PI], yDomain: [-3, 3] }
                },
                {
                    label: 'D',
                    type: 'function',
                    functions: [{ fn: '-sin(x)', color: 'purple' }],
                    options: { xDomain: [-Math.PI, 2*Math.PI], yDomain: [-1.5, 1.5] }
                }
            ]
        }
    };
}

// To use these examples in your question templates:
// Simply call the function and return its result
// Example integration:
// 
// window.QuestionTemplates.MyModule = {
//     getMyQuestion: function() {
//         const questionType = window.GeneratorUtils.rInt(1, 3);
//         if (questionType === 1) {
//             return exampleFunctionGraphQuestion();
//         } else if (questionType === 2) {
//             return exampleChartQuestion();
//         } else {
//             return exampleMultipleGraphsQuestion();
//         }
//     }
// };
