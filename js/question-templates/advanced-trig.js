// Advanced Trigonometry Question Templates
// Level 16-17
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.AdvancedTrig = {
    getAdvancedTrig: function() {
        const utils = window.GeneratorUtils;
        
        // Check if diagram mode is forced via testing parameters
        let shouldGenerateDiagram;
        if (window.FORCED_DIAGRAM_MODE !== null && window.FORCED_DIAGRAM_MODE !== undefined) {
            // Force diagram or text/formula based on URL parameter
            shouldGenerateDiagram = window.FORCED_DIAGRAM_MODE;
        } else {
            // About 50% of the time, generate a diagram-based question instead
            shouldGenerateDiagram = Math.random() < 0.5;
        }
        
        // Advanced trig typically uses calculator mode more often (70% calc, 30% non-calc)
        if (shouldGenerateDiagram && window.QuestionTemplates.TrigDiagramGenerator) {
            const isCalc = Math.random() < 0.7; // 70% calculator mode for advanced
            return window.QuestionTemplates.TrigDiagramGenerator.getTrigDiagramQuestion(isCalc);
        }
        
        const questionType = utils.getQuestionType(1, 4);
                
                if (questionType === 1) {
                    // Trig identity: sin²θ + cos²θ = 1
                    const correctAnswer = `1`;
                    const candidateDistractors = [`\\sin\\theta`, `\\cos\\theta`, `2`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const options = ['0', '1', '2', '\\sin\\theta', '\\cos\\theta'];
                            return options[utils.rInt(0, options.length - 1)];
                        }
                    );
                    return {
                        tex: `\\sin^2\\theta + \\cos^2\\theta`,
                        instruction: "Simplify using trig identity",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Fundamental identity: sin²θ + cos²θ = 1 for all θ. This is derived from the Pythagorean theorem on the unit circle.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Double angle formula: sin(2θ)
                    const correctAnswer = `2\\sin\\theta\\cos\\theta`;
                    const candidateDistractors = [`\\sin^2\\theta`, `2\\sin\\theta`, `\\sin\\theta + \\cos\\theta`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const options = ['\\sin\\theta\\cos\\theta', '\\sin^2\\theta + \\cos^2\\theta', '\\tan\\theta'];
                            return options[utils.rInt(0, options.length - 1)];
                        }
                    );
                    return {
                        tex: `\\sin(2\\theta)`,
                        instruction: "Express in terms of sin θ and cos θ",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Double angle formula: sin(2θ) = 2 sin θ cos θ. This is derived from the sum formula sin(A + B).`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Convert degrees to radians
                    const degrees = [30, 45, 60, 90, 180][utils.rInt(0, 4)];
                    const radians = {
                        30: '\\frac{\\pi}{6}',
                        45: '\\frac{\\pi}{4}',
                        60: '\\frac{\\pi}{3}',
                        90: '\\frac{\\pi}{2}',
                        180: '\\pi'
                    };
                    const correctAnswer = `${radians[degrees]}`;
                    const candidateDistractors = [`${degrees}\\pi`, `\\frac{${degrees}}{180}`, `\\frac{\\pi}{${degrees}}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const options = ['\\pi', '\\frac{\\pi}{2}', '\\frac{\\pi}{3}', '\\frac{\\pi}{4}', '\\frac{\\pi}{6}', '2\\pi'];
                            return options[utils.rInt(0, options.length - 1)];
                        }
                    );
                    
                    return {
                        tex: `${degrees}°`,
                        instruction: "Express in radians",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `To convert degrees to radians: multiply by π/180. ${degrees}° × (π/180°) = ${radians[degrees]}.`,
                        calc: false
                    };
                } else {
                    // Solving trig equation: sin(x) = 0.5 for 0 ≤ x < 360°
                    const correctAnswer = `30°`;
                    const candidateDistractors = [`45°`, `60°`, `90°`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const options = ['0°', '30°', '45°', '60°', '90°', '120°', '135°', '150°', '180°'];
                            return options[utils.rInt(0, options.length - 1)];
                        }
                    );
                    return {
                        tex: `\\sin(x) = 0.5 \\\\[0.5em] 0° \\leq x < 360°`,
                        instruction: "Write down the smallest value of x",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `sin(30°) = 1/2 = 0.5. In the interval [0°, 360°), the solutions are x = 30° and x = 150°. The smallest value is 30°.`,
                        calc: false
                    };
                }
    }
};
