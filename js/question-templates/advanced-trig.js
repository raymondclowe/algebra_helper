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
    },
    
    getReciprocalTrigQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 6);
        
        if (questionType === 1) {
            // sec(60°) = ?
            const angle = [30, 45, 60][utils.rInt(0, 2)];
            const values = {
                30: { cos: '\\frac{\\sqrt{3}}{2}', sec: '\\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}' },
                45: { cos: '\\frac{1}{\\sqrt{2}}', sec: '\\sqrt{2}' },
                60: { cos: '\\frac{1}{2}', sec: '2' }
            };
            
            const correctAnswer = values[angle].sec;
            const candidateDistractors = [
                values[angle].cos,  // Used cos instead of sec
                angle === 60 ? '\\frac{1}{2}' : '2',  // Wrong value
                `\\frac{1}{${angle}}`  // Wrong approach
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const vals = ['2', '\\sqrt{2}', '\\frac{2\\sqrt{3}}{3}', '\\frac{1}{2}'];
                    return vals[utils.rInt(0, vals.length - 1)];
                }
            );
            
            return {
                tex: `\\sec(${angle}°)`,
                instruction: "Find the exact value",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `sec(θ) = 1/cos(θ). cos(${angle}°) = ${values[angle].cos}, so sec(${angle}°) = 1/(${values[angle].cos}) = ${values[angle].sec}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // csc(30°) = ?
            const angle = [30, 45, 60][utils.rInt(0, 2)];
            const values = {
                30: { sin: '\\frac{1}{2}', csc: '2' },
                45: { sin: '\\frac{1}{\\sqrt{2}}', csc: '\\sqrt{2}' },
                60: { sin: '\\frac{\\sqrt{3}}{2}', csc: '\\frac{2}{\\sqrt{3}} = \\frac{2\\sqrt{3}}{3}' }
            };
            
            const correctAnswer = values[angle].csc;
            const candidateDistractors = [
                values[angle].sin,  // Used sin instead of csc
                angle === 30 ? '\\frac{1}{2}' : '2',  // Wrong value
                `${angle}`  // Wrong approach
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const vals = ['2', '\\sqrt{2}', '\\frac{2\\sqrt{3}}{3}', '\\frac{1}{2}'];
                    return vals[utils.rInt(0, vals.length - 1)];
                }
            );
            
            return {
                tex: `\\csc(${angle}°)`,
                instruction: "Find the exact value",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `csc(θ) = 1/sin(θ). sin(${angle}°) = ${values[angle].sin}, so csc(${angle}°) = 1/(${values[angle].sin}) = ${values[angle].csc}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // cot(45°) = ?
            const angle = [30, 45, 60][utils.rInt(0, 2)];
            const values = {
                30: { tan: '\\frac{1}{\\sqrt{3}}', cot: '\\sqrt{3}' },
                45: { tan: '1', cot: '1' },
                60: { tan: '\\sqrt{3}', cot: '\\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}' }
            };
            
            const correctAnswer = values[angle].cot;
            const candidateDistractors = [
                values[angle].tan,  // Used tan instead of cot
                angle === 45 ? '0' : '1',  // Wrong value
                `\\frac{${angle}}{90}`  // Wrong approach
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const vals = ['1', '\\sqrt{3}', '\\frac{\\sqrt{3}}{3}', '\\frac{1}{\\sqrt{3}}'];
                    return vals[utils.rInt(0, vals.length - 1)];
                }
            );
            
            return {
                tex: `\\cot(${angle}°)`,
                instruction: "Find the exact value",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `cot(θ) = 1/tan(θ) = cos(θ)/sin(θ). tan(${angle}°) = ${values[angle].tan}, so cot(${angle}°) = 1/(${values[angle].tan}) = ${values[angle].cot}.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Given sin(θ) = 3/5, find csc(θ)
            const numerator = utils.rInt(2, 5);
            const denominator = utils.rInt(numerator + 1, 9);
            
            const correctAnswer = `\\frac{${denominator}}{${numerator}}`;
            const candidateDistractors = [
                `\\frac{${numerator}}{${denominator}}`,  // Didn't reciprocate
                `${numerator}`,  // Used numerator
                `${denominator}`  // Used denominator
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{${utils.rInt(2, 10)}}{${utils.rInt(2, 10)}}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } \\sin(\\theta) = \\frac{${numerator}}{${denominator}},\\\\[0.5em]\\text{find } \\csc(\\theta)`),
                instruction: "Calculate the reciprocal",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `csc(θ) = 1/sin(θ). If sin(θ) = ${numerator}/${denominator}, then csc(θ) = 1/(${numerator}/${denominator}) = ${denominator}/${numerator}.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Identity: 1 + tan²(θ) = ?
            const correctAnswer = `\\sec^2(\\theta)`;
            const candidateDistractors = [
                `\\csc^2(\\theta)`,  // Wrong function
                `1`,  // Wrong
                `\\tan^2(\\theta)`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\cos^2(\\theta)', '\\sin^2(\\theta)', '2'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: `1 + \\tan^2(\\theta)`,
                instruction: "Simplify using Pythagorean identity",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Pythagorean identity: 1 + tan²(θ) = sec²(θ). This is derived from sin²(θ) + cos²(θ) = 1 by dividing through by cos²(θ).`,
                calc: false
            };
        } else {
            // Where is sec(θ) undefined?
            const correctAnswer = `\\text{Where } \\cos(\\theta) = 0`;
            const candidateDistractors = [
                `\\text{Where } \\sin(\\theta) = 0`,  // Wrong (that's csc)
                `\\text{Where } \\tan(\\theta) = 0`,  // Wrong
                `\\text{Never undefined}`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\text{Where } \\theta = 0', '\\text{Where } \\theta = 45°', '\\text{Everywhere}'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Where is } \\sec(\\theta) \\text{ undefined?}`),
                instruction: "Select the correct condition",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `sec(θ) = 1/cos(θ), so it's undefined when cos(θ) = 0. This occurs at θ = 90°, 270°, etc. (odd multiples of 90°).`,
                calc: false
            };
        }
    },
    
    getCompoundAngleQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 6);
        
        if (questionType === 1) {
            // Expand sin(A + B)
            const correctAnswer = `\\sin A \\cos B + \\cos A \\sin B`;
            const candidateDistractors = [
                `\\sin A + \\sin B`,  // Wrong
                `\\sin A \\cos B - \\cos A \\sin B`,  // Wrong sign
                `\\cos A \\cos B + \\sin A \\sin B`  // Cos formula
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\sin A \\sin B', '\\cos A \\cos B', '\\sin(A) + \\cos(B)'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: `\\sin(A + B)`,
                instruction: "Expand using compound angle formula",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Compound angle formula: sin(A + B) = sin(A)cos(B) + cos(A)sin(B). Note the plus sign.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Expand cos(A - B)
            const correctAnswer = `\\cos A \\cos B + \\sin A \\sin B`;
            const candidateDistractors = [
                `\\cos A \\cos B - \\sin A \\sin B`,  // Wrong sign (this is cos(A+B))
                `\\cos A - \\cos B`,  // Wrong
                `\\sin A \\cos B - \\cos A \\sin B`  // Sin formula
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\cos A \\sin B', '\\sin A \\cos B', '\\cos(A) - \\sin(B)'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: `\\cos(A - B)`,
                instruction: "Expand using compound angle formula",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Compound angle formula: cos(A - B) = cos(A)cos(B) + sin(A)sin(B). Note that the sign changes (minus becomes plus) compared to cos(A + B).`,
                calc: false
            };
        } else if (questionType === 3) {
            // Calculate sin(75°) using sin(45° + 30°)
            const correctAnswer = `\\frac{\\sqrt{6} + \\sqrt{2}}{4}`;
            const candidateDistractors = [
                `\\frac{\\sqrt{6} - \\sqrt{2}}{4}`,  // Wrong sign
                `\\frac{\\sqrt{2} + \\sqrt{3}}{4}`,  // Wrong values
                `\\frac{1 + \\sqrt{3}}{2}`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\frac{\\sqrt{3}}{2}', '\\frac{1}{2}', '\\frac{\\sqrt{2}}{2}'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Find } \\sin(75°)\\\\[0.5em]\\text{using } \\sin(45° + 30°)`),
                instruction: "Calculate using compound angles",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `sin(75°) = sin(45° + 30°) = sin(45°)cos(30°) + cos(45°)sin(30°) = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Simplify sin(30°)cos(60°) + cos(30°)sin(60°)
            const correctAnswer = `1`;
            const candidateDistractors = [
                `\\frac{1}{2}`,  // Wrong
                `\\frac{\\sqrt{3}}{2}`,  // Wrong
                `0`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\sqrt{2}', '\\frac{1}{4}', '2'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: `\\sin(30°)\\cos(60°) + \\cos(30°)\\sin(60°)`,
                instruction: "Simplify",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `This is the compound angle formula: sin(A)cos(B) + cos(A)sin(B) = sin(A + B). So sin(30°)cos(60°) + cos(30°)sin(60°) = sin(30° + 60°) = sin(90°) = 1.`,
                calc: false
            };
        } else if (questionType === 5) {
            // cos(A + B) formula
            const correctAnswer = `\\cos A \\cos B - \\sin A \\sin B`;
            const candidateDistractors = [
                `\\cos A \\cos B + \\sin A \\sin B`,  // Wrong sign (this is cos(A-B))
                `\\sin A \\cos B + \\cos A \\sin B`,  // Sin formula
                `\\cos A + \\cos B`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\cos A \\sin B', '\\sin A \\sin B', '\\cos(A) \\cos(B)'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: `\\cos(A + B)`,
                instruction: "Expand using compound angle formula",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Compound angle formula: cos(A + B) = cos(A)cos(B) - sin(A)sin(B). Note the minus sign.`,
                calc: false
            };
        } else {
            // Double angle as special case: sin(2A) = ?
            const correctAnswer = `2\\sin A \\cos A`;
            const candidateDistractors = [
                `2\\sin A`,  // Wrong
                `\\sin^2 A + \\cos^2 A`,  // This equals 1
                `2\\cos^2 A - 1`  // This is cos(2A)
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\sin^2 A', '\\cos^2 A', '2\\sin^2 A'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: `\\sin(2A)`,
                instruction: "Expand using double angle formula",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Double angle formula (special case of compound angles): sin(2A) = sin(A + A) = 2sin(A)cos(A).`,
                calc: false
            };
        }
    }
};
