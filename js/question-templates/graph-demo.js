// Demo Graph Question Template
// Demonstrates new graphData approach for function plots
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.GraphDemo = {
    // Example 1: Simple function graph with y-intercept question
    getYInterceptQuestion: function() {
        const utils = window.GeneratorUtils;
        
        const a = utils.rInt(1, 3);
        const b = utils.rInt(-4, 4);
        const c = utils.rInt(-3, 3);
        
        // y-intercept is c (when x=0)
        const yIntercept = c;
        
        return {
            tex: `f(x) = ${a}x^2 ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c}`,
            instruction: "What is the y-intercept of this function?",
            displayAnswer: `${yIntercept}`,
            distractors: utils.ensureUniqueDistractors(
                `${yIntercept}`,
                [`${yIntercept + 1}`, `${yIntercept - 1}`, `${b}`],
                () => `${utils.rInt(-8, 8)}`
            ),
            explanation: `The y-intercept is where the graph crosses the y-axis (x = 0). For f(x) = ${a}x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c}, when x = 0, f(0) = ${c}.`,
            calc: false,
            graphData: {
                type: 'function',
                functions: [{
                    fn: `${a}*x^2 + ${b}*x + ${c}`,
                    color: '#3b82f6'
                }],
                options: {
                    xDomain: [-5, 5],
                    yDomain: [-10, 10],
                    width: 500,
                    height: 350
                }
            }
        };
    },
    
    // Example 2: Multiple graphs - identify sine wave
    getIdentifySineQuestion: function() {
        const utils = window.GeneratorUtils;
        
        return {
            tex: `\\text{Which graph represents } y = \\sin(x)?`,
            instruction: "Select the correct graph",
            displayAnswer: 'A',
            distractors: ['B', 'C', 'D'],
            explanation: `Graph A shows the sine function: it starts at (0,0), reaches maximum 1 at π/2, crosses zero at π, reaches minimum -1 at 3π/2, and returns to zero at 2π.`,
            calc: false,
            graphData: {
                type: 'multiple',
                choices: [
                    {
                        label: 'A',
                        type: 'function',
                        functions: [{ fn: 'sin(x)', color: '#3b82f6' }],
                        options: { xDomain: [-Math.PI, 2*Math.PI], yDomain: [-1.5, 1.5] }
                    },
                    {
                        label: 'B',
                        type: 'function',
                        functions: [{ fn: 'cos(x)', color: '#ef4444' }],
                        options: { xDomain: [-Math.PI, 2*Math.PI], yDomain: [-1.5, 1.5] }
                    },
                    {
                        label: 'C',
                        type: 'function',
                        functions: [{ fn: '-sin(x)', color: '#10b981' }],
                        options: { xDomain: [-Math.PI, 2*Math.PI], yDomain: [-1.5, 1.5] }
                    },
                    {
                        label: 'D',
                        type: 'function',
                        functions: [{ fn: 'sin(2*x)', color: '#f59e0b' }],
                        options: { xDomain: [-Math.PI, 2*Math.PI], yDomain: [-1.5, 1.5] }
                    }
                ]
            }
        };
    },
    
    // Example 3: Bar chart for statistics
    getBarChartQuestion: function() {
        const utils = window.GeneratorUtils;
        
        const data = [
            utils.rInt(8, 15),
            utils.rInt(15, 25),
            utils.rInt(10, 20),
            utils.rInt(5, 12)
        ];
        const labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        
        const maxValue = Math.max(...data);
        const maxIndex = data.indexOf(maxValue);
        const maxQuarter = labels[maxIndex];
        
        return {
            tex: `\\text{Quarterly Sales (in thousands)}`,
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
                            'rgba(59, 130, 246, 0.6)',
                            'rgba(16, 185, 129, 0.6)',
                            'rgba(251, 146, 60, 0.6)',
                            'rgba(239, 68, 68, 0.6)'
                        ],
                        borderColor: [
                            'rgb(59, 130, 246)',
                            'rgb(16, 185, 129)',
                            'rgb(251, 146, 60)',
                            'rgb(239, 68, 68)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    width: 500,
                    height: 350,
                    chartOptions: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { display: false },
                            title: {
                                display: true,
                                text: 'Quarterly Sales Report',
                                color: '#d1d5db',
                                font: { size: 16 }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { color: '#9ca3af' },
                                grid: { color: 'rgba(156, 163, 175, 0.2)' }
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
};
