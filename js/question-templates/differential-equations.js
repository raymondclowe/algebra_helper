// Differential Equations Question Templates
// Level 31-32: First-Order Differential Equations
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.DifferentialEquations = {
    // First-order differential equations
    getDifferentialEquationQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 4);
        
        if (questionType === 1) {
            // Separation of variables - identify the method
            const step = utils.rInt(1, 3);
            
            if (step === 1) {
                return {
                    tex: `\\frac{dy}{dx} = xy`,
                    instruction: "Which method should we use to solve this differential equation?",
                    displayAnswer: "Separation of variables",
                    distractors: utils.ensureUniqueDistractors(
                        "Separation of variables",
                        [
                            "Integration by parts",
                            "Substitution",
                            "Direct integration"
                        ],
                        () => {
                            const methods = ["Partial fractions", "Chain rule", "Product rule"];
                            return methods[utils.rInt(0, methods.length - 1)];
                        }
                    ),
                    explanation: `For dy/dx = xy, we can separate variables: (1/y) dy = x dx. This is separation of variables because we can write all y terms on one side and all x terms on the other.`,
                    calc: false
                };
            } else if (step === 2) {
                return {
                    tex: `\\frac{dy}{dx} = xy, \\text{ separate variables}`,
                    instruction: "What is the separated form?",
                    displayAnswer: `\\frac{1}{y} dy = x \\, dx`,
                    distractors: utils.ensureUniqueDistractors(
                        `\\frac{1}{y} dy = x \\, dx`,
                        [
                            `\\frac{dy}{y} = \\frac{dx}{x}`,
                            `y \\, dy = x \\, dx`,
                            `dy = xy \\, dx`
                        ],
                        () => `\\frac{dy}{dx} = ${utils.rInt(1, 5)}x`
                    ),
                    explanation: `To separate variables in dy/dx = xy, divide both sides by y and multiply by dx: (1/y) dy = x dx.`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\int \\frac{1}{y} dy = \\int x \\, dx`,
                    instruction: "What is the general solution?",
                    displayAnswer: `\\ln|y| = \\frac{x^2}{2} + C`,
                    distractors: utils.ensureUniqueDistractors(
                        `\\ln|y| = \\frac{x^2}{2} + C`,
                        [
                            `\\ln|y| = x^2 + C`,
                            `y = \\frac{x^2}{2} + C`,
                            `\\frac{1}{y} = \\frac{x^2}{2} + C`
                        ],
                        () => `\\ln|y| = ${utils.rInt(1, 5)}x^2 + C`
                    ),
                    explanation: `Integrating both sides: ∫(1/y) dy = ln|y| and ∫x dx = x²/2. So ln|y| = x²/2 + C.`,
                    calc: false
                };
            }
        } else if (questionType === 2) {
            // dy/dx = ky type (exponential growth/decay)
            const k = utils.rInt(2, 5);
            const step = utils.rInt(1, 2);
            
            if (step === 1) {
                return {
                    tex: `\\frac{dy}{dx} = ${k}y`,
                    instruction: "What type of differential equation is this?",
                    displayAnswer: "Exponential growth/decay",
                    distractors: utils.ensureUniqueDistractors(
                        "Exponential growth/decay",
                        [
                            "Linear differential equation",
                            "Quadratic differential equation",
                            "Separable but not exponential"
                        ],
                        () => {
                            const types = ["Homogeneous", "Exact", "Bernoulli"];
                            return types[utils.rInt(0, types.length - 1)];
                        }
                    ),
                    explanation: `dy/dx = ${k}y is the standard form for exponential growth (k > 0) or decay (k < 0). Solution is y = Ae^(${k}x).`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\frac{dy}{dx} = ${k}y`,
                    instruction: "What is the general solution?",
                    displayAnswer: `y = Ae^{${k}x}`,
                    distractors: utils.ensureUniqueDistractors(
                        `y = Ae^{${k}x}`,
                        [
                            `y = ${k}e^{x}`,
                            `y = Ae^{x}`,
                            `y = A${k}x`
                        ],
                        () => `y = ${utils.rInt(1, 10)}e^{${utils.rInt(1, 5)}x}`
                    ),
                    explanation: `For dy/dx = ${k}y, separate variables: (1/y) dy = ${k} dx. Integrate: ln|y| = ${k}x + C. Exponentiating: y = Ae^(${k}x) where A = e^C.`,
                    calc: false
                };
            }
        } else if (questionType === 3) {
            // dy/dx = f(x) type (direct integration)
            const a = utils.rInt(2, 5);
            const n = utils.rInt(2, 4);
            
            return {
                tex: `\\frac{dy}{dx} = ${a}x^${n}`,
                instruction: "What is the general solution?",
                displayAnswer: `y = \\frac{${a}x^{${n + 1}}}{${n + 1}} + C`,
                distractors: utils.ensureUniqueDistractors(
                    `y = \\frac{${a}x^{${n + 1}}}{${n + 1}} + C`,
                    [
                        `y = ${a}x^{${n + 1}} + C`,
                        `y = \\frac{${a}x^${n}}{${n}} + C`,
                        `y = ${a}x^${n} + C`
                    ],
                    () => `y = \\frac{${utils.rInt(1, 10)}x^{${utils.rInt(2, 6)}}}{${utils.rInt(2, 6)}} + C`
                ),
                explanation: `For dy/dx = ${a}x^${n}, integrate directly: y = ∫${a}x^${n} dx = ${a}·x^(${n + 1})/(${n + 1}) + C.`,
                calc: true
            };
        } else {
            // Initial value problem
            const k = utils.rInt(2, 4);
            const y0 = utils.rInt(1, 5);
            
            return {
                tex: `\\frac{dy}{dx} = ${k}y, \\quad y(0) = ${y0}`,
                instruction: "What is the particular solution?",
                displayAnswer: `y = ${y0}e^{${k}x}`,
                distractors: utils.ensureUniqueDistractors(
                    `y = ${y0}e^{${k}x}`,
                    [
                        `y = ${k}e^{${y0}x}`,
                        `y = e^{${k}x}`,
                        `y = ${y0}e^{x}`
                    ],
                    () => `y = ${utils.rInt(1, 10)}e^{${utils.rInt(1, 5)}x}`
                ),
                explanation: `General solution: y = Ae^(${k}x). Using y(0) = ${y0}: ${y0} = Ae^0 = A. So A = ${y0}, giving y = ${y0}e^(${k}x).`,
                calc: false
            };
        }
    }
};
