// Derivative Graph Relationships Question Templates
// Level 20-21: Understanding relationships between f, f', and f''
// Uses function-plot library for visualization

window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.DerivativeGraphs = {
    // Generate a unique ID for each graph container
    generateGraphId: function() {
        return 'deriv-graph-' + Math.random().toString(36).substr(2, 9);
    },
    
    // Create graph HTML using function-plot library
    createDerivativeGraph: function(functions, options = {}) {
        const graphId = this.generateGraphId();
        const width = options.width || 500;
        const height = options.height || 300;
        const xDomain = options.xDomain || [-4, 4];
        const yDomain = options.yDomain || [-8, 8];
        
        const html = `
            <div id="${graphId}" class="derivative-graph-container" style="width: ${width}px; height: ${height}px; margin: 10px auto;"></div>
            <script>
            (function() {
                if (typeof functionPlot === 'undefined') {
                    console.warn('function-plot library not loaded yet');
                    return;
                }
                try {
                    functionPlot({
                        target: '#${graphId}',
                        width: ${width},
                        height: ${height},
                        xAxis: { domain: [${xDomain[0]}, ${xDomain[1]}] },
                        yAxis: { domain: [${yDomain[0]}, ${yDomain[1]}] },
                        grid: true,
                        data: ${JSON.stringify(functions)}
                    });
                } catch (e) {
                    console.error('Error plotting derivative graph:', e);
                }
            })();
            </script>
        `;
        
        return html;
    },
    
    getDerivativeGraphQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 5);
        
        if (questionType === 1) {
            // Where is f'(x) = 0? (turning points)
            const a = utils.rInt(1, 2);
            const h = utils.rInt(-2, 2);
            const k = utils.rInt(-3, 3);
            
            // f(x) = a(x-h)² + k, so f'(x) = 0 at x = h
            const graphHtml = this.createDerivativeGraph([
                {
                    fn: `${a}*(x-${h})^2 + ${k}`,
                    color: 'blue'
                }
            ]);
            
            const correctAnswer = `x = ${h}`;
            const candidateDistractors = [
                `x = ${h + 1}`,
                `x = ${h - 1}`,
                `x = ${k}`  // Confusing with y-coordinate
            ];
            
            return {
                tex: graphHtml,
                instruction: "At what x-value is f'(x) = 0?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `x = ${utils.rInt(-4, 4)}`
                ),
                explanation: `f'(x) = 0 at turning points (where the tangent is horizontal). From the graph, the turning point is at x = ${h}. This is where the function changes from increasing to decreasing (or vice versa).`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 2) {
            // Where is f(x) increasing? (where f'(x) > 0)
            const root1 = utils.rInt(-3, -1);
            const root2 = utils.rInt(1, 3);
            const a = utils.rInt(1, 2);
            
            // f(x) = a(x-root1)(x-root2), vertex at x = (root1+root2)/2
            const vertex = (root1 + root2) / 2;
            
            const graphHtml = this.createDerivativeGraph([
                {
                    fn: `${a}*(x-${root1})*(x-${root2})`,
                    color: 'green'
                }
            ]);
            
            const correctAnswer = `x < ${vertex}`;
            const candidateDistractors = [
                `x > ${vertex}`,
                `x < ${root1} \\text{ or } x > ${root2}`,
                `${root1} < x < ${root2}`
            ];
            
            return {
                tex: graphHtml,
                instruction: "For what values of x is f(x) increasing?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `x > ${utils.rInt(-3, 3)}`
                ),
                explanation: `f(x) is increasing where the graph slopes upward (f'(x) > 0). For this parabola opening upward, the function increases to the left of the vertex at x = ${vertex}, so f(x) is increasing for x < ${vertex}.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 3) {
            // Given f'(x), where does f(x) have a maximum?
            const criticalPoint = utils.rInt(-2, 2);
            
            // f'(x) = -(x - criticalPoint), changes from + to -
            const graphHtml = this.createDerivativeGraph([
                {
                    fn: `-(x-${criticalPoint})`,
                    color: 'red'
                }
            ], { yDomain: [-5, 5] });
            
            const correctAnswer = `x = ${criticalPoint}`;
            const candidateDistractors = [
                `x = ${criticalPoint + 1}`,
                `x = ${criticalPoint - 1}`,
                `\\text{No maximum}`
            ];
            
            return {
                tex: `<div style="margin: 10px 0;"><strong>This is the graph of f'(x):</strong></div>${graphHtml}`,
                instruction: "At what x-value does f(x) have a maximum?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `x = ${utils.rInt(-4, 4)}`
                ),
                explanation: `f(x) has a maximum where f'(x) changes from positive to negative (the derivative crosses from above to below the x-axis). This occurs at x = ${criticalPoint}.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 4) {
            // Sign of f'(x) at a point
            const a = utils.rInt(1, 2);
            const testPoint = utils.rInt(1, 3);
            
            // f(x) = ax², so f'(x) = 2ax, which is positive for x > 0
            const graphHtml = this.createDerivativeGraph([
                {
                    fn: `${a}*x^2`,
                    color: 'purple'
                }
            ]);
            
            const correctAnswer = `\\text{Positive}`;
            const candidateDistractors = [
                `\\text{Negative}`,
                `\\text{Zero}`,
                `\\text{Undefined}`
            ];
            
            return {
                tex: `${graphHtml}<div style="margin: 10px 0;"><strong>Consider the point where x = ${testPoint}</strong></div>`,
                instruction: "What is the sign of f'(x) at this point?",
                displayAnswer: correctAnswer,
                distractors: candidateDistractors,
                explanation: `At x = ${testPoint}, the function is increasing (sloping upward), so f'(x) > 0. The derivative is positive when the function is increasing, negative when decreasing, and zero at turning points.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else {
            // Match f(x) with its derivative
            const a = utils.rInt(1, 2);
            const correct = Math.random() < 0.5;
            
            // f(x) = x³ - 3x, f'(x) = 3x² - 3
            const graphHtml = this.createDerivativeGraph([
                {
                    fn: 'x^3 - 3*x',
                    color: 'blue'
                },
                {
                    fn: correct ? '3*x^2 - 3' : '-x^2 + 2',
                    color: 'orange'
                }
            ], { xDomain: [-3, 3], yDomain: [-5, 10] });
            
            const correctAnswer = correct ? `\\text{Yes}` : `\\text{No}`;
            const candidateDistractors = correct ? [
                `\\text{No}`,
                `\\text{Cannot determine}`,
                `\\text{Only for some x}`
            ] : [
                `\\text{Yes}`,
                `\\text{Cannot determine}`,
                `\\text{Only for some x}`
            ];
            
            return {
                tex: `<div style="margin: 10px 0;"><strong>Blue: f(x), Orange: candidate for f'(x)</strong></div>${graphHtml}`,
                instruction: "Is the orange curve the derivative of the blue curve?",
                displayAnswer: correctAnswer,
                distractors: candidateDistractors,
                explanation: correct ? 
                    `Yes. Where f(x) has turning points (f' = 0), the orange curve crosses the x-axis. Where f(x) is increasing, f'(x) is positive. Where f(x) is decreasing, f'(x) is negative.` :
                    `No. The orange curve doesn't match the derivative pattern. For example, where f(x) has a turning point, f'(x) should cross the x-axis, but this doesn't happen consistently.`,
                calc: false,
                requiresGraphLibrary: true
            };
        }
    }
};
