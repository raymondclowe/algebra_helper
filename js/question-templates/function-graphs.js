// Function Graphs Question Templates
// Level 14-15: Function graphing, reading, and graphical solving
// Uses function-plot library for visualization

window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.FunctionGraphs = {
    // Generate a unique ID for each graph container
    generateGraphId: function() {
        return 'graph-' + Math.random().toString(36).substr(2, 9);
    },
    
    // Create graph HTML using function-plot library
    createFunctionGraph: function(functions, options = {}) {
        const graphId = this.generateGraphId();
        const width = options.width || 400;
        const height = options.height || 300;
        const xDomain = options.xDomain || [-5, 5];
        const yDomain = options.yDomain || [-5, 5];
        
        // Return HTML that will be rendered in the question
        const html = `
            <div id="${graphId}" class="function-graph-container" style="width: ${width}px; height: ${height}px; margin: 10px auto;"></div>
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
                    console.error('Error plotting function:', e);
                }
            })();
            </script>
        `;
        
        return html;
    },
    
    getFunctionGraphQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 5);
        
        if (questionType === 1) {
            // Find y-intercept from graph
            const a = utils.rInt(-3, 3);
            if (a === 0) a = 1;
            const b = utils.rInt(-5, 5);
            const c = utils.rInt(-4, 4);
            
            // Function: f(x) = ax² + bx + c
            // y-intercept is when x = 0, so y = c
            const yIntercept = c;
            
            const graphHtml = this.createFunctionGraph([
                {
                    fn: `${a}*x^2 + ${b}*x + ${c}`,
                    color: 'blue'
                }
            ], { xDomain: [-5, 5], yDomain: [-10, 10] });
            
            const correctAnswer = `${yIntercept}`;
            const candidateDistractors = [
                `${yIntercept + 1}`,
                `${yIntercept - 1}`,
                `${b}`  // Common mistake: using coefficient b
            ];
            
            return {
                tex: graphHtml,
                instruction: "What is the y-intercept of this function?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${utils.rInt(-8, 8)}`
                ),
                explanation: `The y-intercept is where the graph crosses the y-axis (when x = 0). Reading from the graph, y = ${yIntercept}.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 2) {
            // Find x-coordinate of maximum/minimum
            const a = utils.rInt(1, 3) * (Math.random() < 0.5 ? 1 : -1);
            const h = utils.rInt(-3, 3);
            const k = utils.rInt(-2, 4);
            
            // Vertex form: f(x) = a(x-h)² + k
            // Vertex (max/min) is at x = h
            const vertexX = h;
            const isMax = a < 0;
            
            const graphHtml = this.createFunctionGraph([
                {
                    fn: `${a}*(x-${h})^2 + ${k}`,
                    color: 'red'
                }
            ], { xDomain: [-6, 6], yDomain: [-6, 8] });
            
            const correctAnswer = `${vertexX}`;
            const candidateDistractors = [
                `${vertexX + 1}`,
                `${vertexX - 1}`,
                `${k}`  // Common mistake: using y-coordinate
            ];
            
            return {
                tex: graphHtml,
                instruction: `At what x-value does the ${isMax ? 'maximum' : 'minimum'} occur?`,
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${utils.rInt(-5, 5)}`
                ),
                explanation: `The ${isMax ? 'maximum' : 'minimum'} occurs at the vertex. Reading from the graph, the x-coordinate of the vertex is ${vertexX}.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 3) {
            // Count intersection points (graphical solving)
            const a = utils.rInt(1, 2);
            const b = utils.rInt(-2, 2);
            const m = utils.rInt(1, 3);
            const c = utils.rInt(-3, 3);
            
            // Parabola and line
            const graphHtml = this.createFunctionGraph([
                {
                    fn: `${a}*x^2 + ${b}`,
                    color: 'blue'
                },
                {
                    fn: `${m}*x + ${c}`,
                    color: 'green'
                }
            ], { xDomain: [-4, 4], yDomain: [-5, 10] });
            
            // Solve ax² + b = mx + c
            // ax² - mx + (b - c) = 0
            const A = a;
            const B = -m;
            const C = b - c;
            const discriminant = B * B - 4 * A * C;
            
            let numSolutions;
            if (discriminant > 0.01) {
                numSolutions = 2;
            } else if (Math.abs(discriminant) < 0.01) {
                numSolutions = 1;
            } else {
                numSolutions = 0;
            }
            
            const correctAnswer = `${numSolutions}`;
            const candidateDistractors = [
                `${(numSolutions + 1) % 3}`,
                `${(numSolutions + 2) % 3}`,
                `3`
            ];
            
            return {
                tex: graphHtml,
                instruction: "How many solutions does the equation f(x) = g(x) have?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${utils.rInt(0, 4)}`
                ),
                explanation: `Count the intersection points of the two graphs. The blue and green curves intersect at ${numSolutions} point${numSolutions !== 1 ? 's' : ''}.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 4) {
            // Identify where f(x) > 0
            const a = utils.rInt(-2, 2);
            if (a === 0) a = 1;
            const root1 = utils.rInt(-4, -1);
            const root2 = utils.rInt(1, 4);
            
            // f(x) = a(x - root1)(x - root2)
            const graphHtml = this.createFunctionGraph([
                {
                    fn: `${a}*(x-${root1})*(x-${root2})`,
                    color: 'purple'
                }
            ], { xDomain: [-6, 6], yDomain: [-8, 8] });
            
            let correctAnswer;
            if (a > 0) {
                correctAnswer = `x < ${root1} \\text{ or } x > ${root2}`;
            } else {
                correctAnswer = `${root1} < x < ${root2}`;
            }
            
            const candidateDistractors = [
                a > 0 ? `${root1} < x < ${root2}` : `x < ${root1} \\text{ or } x > ${root2}`,
                `x > ${root1}`,
                `x < ${root2}`
            ];
            
            return {
                tex: graphHtml,
                instruction: "For what values of x is f(x) > 0?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `x > ${utils.rInt(-5, 5)}`
                ),
                explanation: `f(x) > 0 where the graph is above the x-axis. The function crosses the x-axis at x = ${root1} and x = ${root2}. ${a > 0 ? 'Since the parabola opens upward, f(x) > 0 for x < ' + root1 + ' or x > ' + root2 : 'Since the parabola opens downward, f(x) > 0 for ' + root1 + ' < x < ' + root2}.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else {
            // Identify domain or range
            const a = utils.rInt(1, 2);
            const h = utils.rInt(-2, 2);
            const k = utils.rInt(-3, 3);
            
            // f(x) = a(x-h)² + k, domain is all reals, range depends on a and k
            const graphHtml = this.createFunctionGraph([
                {
                    fn: `${a}*(x-${h})^2 + ${k}`,
                    color: 'orange'
                }
            ], { xDomain: [-5, 5], yDomain: [-5, 10] });
            
            const askDomain = Math.random() < 0.5;
            
            if (askDomain) {
                const correctAnswer = `\\mathbb{R} \\text{ (all real numbers)}`;
                const candidateDistractors = [
                    `x \\geq ${k}`,
                    `x \\geq ${h}`,
                    `[-5, 5]`
                ];
                
                return {
                    tex: graphHtml,
                    instruction: "What is the domain of this function?",
                    displayAnswer: correctAnswer,
                    distractors: utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `x > ${utils.rInt(-5, 5)}`
                    ),
                    explanation: `The domain is all x-values for which the function is defined. For a polynomial function, the domain is all real numbers (ℝ).`,
                    calc: false,
                    requiresGraphLibrary: true
                };
            } else {
                const rangeMin = k;
                const correctAnswer = `y \\geq ${rangeMin}`;
                const candidateDistractors = [
                    `y \\leq ${rangeMin}`,
                    `y \\geq ${h}`,
                    `\\mathbb{R}`
                ];
                
                return {
                    tex: graphHtml,
                    instruction: "What is the range of this function?",
                    displayAnswer: correctAnswer,
                    distractors: utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `y \\geq ${utils.rInt(-5, 5)}`
                    ),
                    explanation: `The range is all possible y-values. The parabola has a minimum at y = ${rangeMin} and extends upward to infinity, so the range is y ≥ ${rangeMin}.`,
                    calc: false,
                    requiresGraphLibrary: true
                };
            }
        }
    }
};
