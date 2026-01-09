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
        
        // Mix in ambiguous case questions (about 20% of the time)
        const includeAmbiguousCase = Math.random() < 0.2;
        if (includeAmbiguousCase) {
            return this.getAmbiguousCase();
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
    },
    
    // Ambiguous Case of Sine Rule (SSA - Side-Side-Angle)
    // Given two sides and an angle opposite one of them, how many triangles are possible?
    getAmbiguousCase: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 4);
        
        if (questionType === 1) {
            // Case: No triangle (a < h where h = b·sin(A))
            // Given: angle A, sides a and b (where a is opposite A)
            // a < b·sin(A) → no triangle
            const A = 30; // angle A in degrees
            const b = 10; // side b
            const h = Math.round(b * Math.sin(A * Math.PI / 180) * 10) / 10; // h = b·sin(A) = 5
            const a = 4; // side a < h
            
            return {
                tex: utils.wrapLongLatexText(`\\text{In triangle ABC, } A = ${A}°, \\, a = ${a} \\text{ cm, } b = ${b} \\text{ cm}`),
                instruction: "How many triangles are possible?",
                displayAnswer: `0 \\text{ (no triangle: } a < b\\sin A\\text{)}`,
                distractors: utils.ensureUniqueDistractors(
                    `0 \\text{ (no triangle: } a < b\\sin A\\text{)}`,
                    [
                        `1 \\text{ triangle}`,
                        `2 \\text{ triangles}`,
                        `\\text{Infinitely many}`
                    ],
                    () => `${utils.rInt(3, 10)} \\text{ triangles}`
                ),
                explanation: `For a triangle to exist with SSA, we need a ≥ b·sin(A). Here, b·sin(A) = 10·sin(30°) = 10·0.5 = 5. Since a = 4 < 5, no triangle is possible.`,
                calc: true
            };
        } else if (questionType === 2) {
            // Case: One triangle (a ≥ b or a = h)
            // When a ≥ b, there's always exactly one triangle
            const A = 40;
            const a = 12; // side opposite A
            const b = 8;  // a > b, so exactly one triangle
            
            return {
                tex: utils.wrapLongLatexText(`\\text{In triangle ABC, } A = ${A}°, \\, a = ${a} \\text{ cm, } b = ${b} \\text{ cm}`),
                instruction: "How many triangles are possible?",
                displayAnswer: `1 \\text{ triangle (} a > b\\text{)}`,
                distractors: utils.ensureUniqueDistractors(
                    `1 \\text{ triangle (} a > b\\text{)}`,
                    [
                        `0 \\text{ (no triangle)}`,
                        `2 \\text{ triangles}`,
                        `\\text{Cannot determine}`
                    ],
                    () => `${utils.rInt(3, 5)} \\text{ triangles}`
                ),
                explanation: `When a > b, there is exactly one possible triangle. Here a = ${a} > b = ${b}, so one unique triangle exists.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Case: Two triangles (h < a < b where h = b·sin(A))
            // The ambiguous case proper
            const A = 30;
            const b = 12;
            const h = Math.round(b * Math.sin(A * Math.PI / 180) * 10) / 10; // h = 6
            const a = 8; // h < a < b
            
            return {
                tex: utils.wrapLongLatexText(`\\text{In triangle ABC, } A = ${A}°, \\, a = ${a} \\text{ cm, } b = ${b} \\text{ cm}`),
                instruction: "How many triangles are possible?",
                displayAnswer: `2 \\text{ triangles (ambiguous case: } b\\sin A < a < b\\text{)}`,
                distractors: utils.ensureUniqueDistractors(
                    `2 \\text{ triangles (ambiguous case: } b\\sin A < a < b\\text{)}`,
                    [
                        `0 \\text{ (no triangle)}`,
                        `1 \\text{ triangle}`,
                        `\\text{Cannot determine}`
                    ],
                    () => `${utils.rInt(3, 5)} \\text{ triangles}`
                ),
                explanation: `This is the ambiguous case: when b·sin(A) < a < b. Here, b·sin(A) = 12·sin(30°) = 6, and 6 < 8 < 12. Two different triangles are possible with these measurements.`,
                calc: true
            };
        } else {
            // Identify the ambiguous case condition
            return {
                tex: utils.wrapLongLatexText(`\\text{Given angle } A \\text{ and sides } a, b \\text{ (where } a \\text{ is opposite } A\\text{)}`),
                instruction: "When do we get exactly 2 possible triangles?",
                displayAnswer: `b\\sin A < a < b \\text{ (and } A \\text{ is acute)}`,
                distractors: utils.ensureUniqueDistractors(
                    `b\\sin A < a < b \\text{ (and } A \\text{ is acute)}`,
                    [
                        `a > b`,
                        `a < b\\sin A`,
                        `a = b\\sin A`
                    ],
                    () => {
                        const options = ['a = b', 'a > 2b', 'b > 2a'];
                        return options[utils.rInt(0, options.length - 1)];
                    }
                ),
                explanation: `The ambiguous case (2 triangles) occurs when: (1) angle A is acute, (2) b·sin(A) < a < b. This creates two possible positions for vertex C.`,
                calc: false
            };
        }
    }
};
