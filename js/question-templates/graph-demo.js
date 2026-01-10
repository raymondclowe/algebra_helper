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
    
    // Example 3: Bar chart for statistics (using SVG, no Chart.js dependency)
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
        
        // Create SVG bar chart
        const width = 500;
        const height = 350;
        const padding = 60;
        const barWidth = (width - 2 * padding) / data.length;
        const maxDataValue = Math.max(...data);
        const scale = (height - 2 * padding) / maxDataValue;
        
        const colors = [
            'rgb(59, 130, 246)',   // blue
            'rgb(16, 185, 129)',   // green
            'rgb(251, 146, 60)',   // orange
            'rgb(239, 68, 68)'     // red
        ];
        
        let bars = '';
        data.forEach((value, i) => {
            const barHeight = value * scale;
            const x = padding + i * barWidth + barWidth * 0.1;
            const y = height - padding - barHeight;
            const barWidthActual = barWidth * 0.8;
            
            bars += `
                <rect x="${x}" y="${y}" 
                      width="${barWidthActual}" height="${barHeight}" 
                      fill="${colors[i]}" 
                      stroke="${colors[i]}" stroke-width="2"
                      opacity="0.8"/>
                <text x="${x + barWidthActual/2}" y="${height - padding + 20}" 
                      text-anchor="middle" fill="#9ca3af" font-size="14">${labels[i]}</text>
                <text x="${x + barWidthActual/2}" y="${y - 5}" 
                      text-anchor="middle" fill="#d1d5db" font-size="12" font-weight="bold">${value}</text>
            `;
        });
        
        const chartSvg = `
            <div style="width: ${width}px; margin: 20px auto;">
                <svg width="${width}" height="${height}" style="background: rgba(17, 24, 39, 0.5); border-radius: 8px;">
                    <!-- Title -->
                    <text x="${width/2}" y="30" text-anchor="middle" fill="#d1d5db" font-size="16" font-weight="bold">
                        Quarterly Sales Report
                    </text>
                    
                    <!-- Y-axis -->
                    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" 
                          stroke="#374151" stroke-width="2"/>
                    
                    <!-- X-axis -->
                    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" 
                          stroke="#374151" stroke-width="2"/>
                    
                    <!-- Y-axis label -->
                    <text x="20" y="${height/2}" text-anchor="middle" fill="#9ca3af" font-size="12" 
                          transform="rotate(-90, 20, ${height/2})">
                        Sales (thousands)
                    </text>
                    
                    <!-- Grid lines -->
                    ${[0, 0.25, 0.5, 0.75, 1].map(fraction => {
                        const y = height - padding - (height - 2*padding) * fraction;
                        const value = Math.round(maxDataValue * fraction);
                        return `
                            <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" 
                                  stroke="#374151" stroke-width="1" opacity="0.3" stroke-dasharray="4"/>
                            <text x="${padding - 10}" y="${y + 4}" text-anchor="end" fill="#9ca3af" font-size="11">
                                ${value}
                            </text>
                        `;
                    }).join('')}
                    
                    <!-- Bars -->
                    ${bars}
                </svg>
            </div>
        `;
        
        return {
            tex: chartSvg,
            instruction: "Which quarter had the highest sales?",
            displayAnswer: maxQuarter,
            distractors: labels.filter(q => q !== maxQuarter).slice(0, 3),
            explanation: `Looking at the bar chart, ${maxQuarter} has the tallest bar with ${maxValue}k in sales.`,
            calc: false,
            isDiagram: true
        };
    }
};
