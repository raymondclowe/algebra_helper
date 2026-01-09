// Trigonometric Function Graphs Question Templates
// Level 16-17: Trig graph transformations
// Uses function-plot library for visualization

window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.TrigGraphs = {
    // Generate a unique ID for each graph container
    generateGraphId: function() {
        return 'trig-graph-' + Math.random().toString(36).substr(2, 9);
    },
    
    // Create trig graph HTML using function-plot library
    createTrigGraph: function(fn, options = {}) {
        const graphId = this.generateGraphId();
        const width = options.width || 500;
        const height = options.height || 300;
        const xDomain = options.xDomain || [-2 * Math.PI, 2 * Math.PI];
        const yDomain = options.yDomain || [-4, 4];
        
        const html = `
            <div id="${graphId}" class="trig-graph-container" style="width: ${width}px; height: ${height}px; margin: 10px auto;"></div>
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
                        data: [{
                            fn: '${fn}',
                            color: 'blue',
                            sampler: 'builtIn',
                            graphType: 'polyline'
                        }]
                    });
                } catch (e) {
                    console.error('Error plotting trig function:', e);
                }
            })();
            </script>
        `;
        
        return html;
    },
    
    getTrigGraphQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 5);
        
        if (questionType === 1) {
            // Identify amplitude
            const a = utils.rInt(2, 4);
            const fn = `${a}*sin(x)`;
            
            const graphHtml = this.createTrigGraph(fn, {
                yDomain: [-(a + 1), (a + 1)]
            });
            
            const correctAnswer = `${a}`;
            const candidateDistractors = [
                `${a + 1}`,
                `${a - 1}`,
                `${2 * a}`  // Confusing peak-to-peak with amplitude
            ];
            
            return {
                tex: graphHtml,
                instruction: "What is the amplitude of this sine function?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${utils.rInt(1, 6)}`
                ),
                explanation: `The amplitude is the distance from the midline to the maximum (or minimum). The function oscillates between -${a} and ${a}, so the amplitude is ${a}. For y = a·sin(x), the amplitude is |a|.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 2) {
            // Identify period
            const b = utils.rInt(2, 3);
            const fn = `sin(${b}*x)`;
            const period = (2 * Math.PI) / b;
            const periodStr = b === 2 ? '\\pi' : `\\frac{2\\pi}{${b}}`;
            
            const graphHtml = this.createTrigGraph(fn);
            
            const correctAnswer = periodStr;
            const candidateDistractors = [
                `2\\pi`,  // Not accounting for b
                `\\frac{\\pi}{${b}}`,  // Wrong formula
                `${b}\\pi`  // Multiplied instead of divided
            ];
            
            return {
                tex: graphHtml,
                instruction: "What is the period of this sine function?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `\\frac{\\pi}{${utils.rInt(2, 4)}}`
                ),
                explanation: `For y = sin(bx), the period is 2π/b. Here b = ${b}, so the period is 2π/${b} = ${periodStr}. The function completes one full cycle in this interval.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 3) {
            // Identify phase shift
            const c = utils.rInt(1, 3);
            const direction = Math.random() < 0.5 ? 'right' : 'left';
            const fn = direction === 'right' ? `sin(x-${c})` : `sin(x+${c})`;
            const shift = direction === 'right' ? c : -c;
            
            const graphHtml = this.createTrigGraph(fn);
            
            const correctAnswer = `${shift} \\text{ (${direction})}`;
            const candidateDistractors = [
                `${-shift} \\text{ (${direction === 'right' ? 'left' : 'right'})}`,  // Wrong direction
                `${Math.abs(shift) * 2}`,  // Doubled
                `0 \\text{ (no shift)}`  // Didn't recognize shift
            ];
            
            return {
                tex: graphHtml,
                instruction: "What is the phase shift of this sine function?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${utils.rInt(-3, 3)} \\text{ units}`
                ),
                explanation: `For y = sin(x - c), the phase shift is c units to the right. For y = sin(x + c), it's c units to the left. This function is shifted ${Math.abs(shift)} unit(s) ${direction}.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 4) {
            // Identify vertical shift
            const d = utils.rInt(-2, 3);
            if (d === 0) d = 1;
            const fn = `cos(x)+${d}`;
            
            const graphHtml = this.createTrigGraph(fn, {
                yDomain: [d - 3, d + 3]
            });
            
            const correctAnswer = `${d}`;
            const candidateDistractors = [
                `${d + 1}`,
                `${d - 1}`,
                `0`  // Didn't recognize shift
            ];
            
            return {
                tex: graphHtml,
                instruction: "What is the vertical shift of this cosine function?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${utils.rInt(-3, 4)}`
                ),
                explanation: `For y = cos(x) + d, the vertical shift is d. The midline of the function is at y = ${d}, which means the function oscillates ${d} units ${d > 0 ? 'above' : 'below'} the x-axis.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else {
            // Identify equation from graph with multiple transformations
            const a = utils.rInt(2, 3);
            const d = utils.rInt(-1, 2);
            const fn = `${a}*sin(x)+${d}`;
            
            const graphHtml = this.createTrigGraph(fn, {
                yDomain: [d - a - 1, d + a + 1]
            });
            
            const correctAnswer = `y = ${a}\\sin(x) + ${d}`;
            const candidateDistractors = [
                `y = ${a}\\sin(x) - ${d}`,  // Wrong sign on vertical shift
                `y = ${a}\\cos(x) + ${d}`,  // Wrong trig function
                `y = \\sin(x) + ${d}`  // Missing amplitude
            ];
            
            return {
                tex: graphHtml,
                instruction: "What is the equation of this function?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => {
                        const randA = utils.rInt(1, 4);
                        const randD = utils.rInt(-2, 2);
                        return `y = ${randA}\\sin(x) + ${randD}`;
                    }
                ),
                explanation: `The function has amplitude ${a} (maximum distance from midline), no period change, no phase shift, and vertical shift ${d}. The equation is y = ${a}sin(x) + ${d}.`,
                calc: false,
                requiresGraphLibrary: true
            };
        }
    }
};
