// Advanced Integration Question Templates
// Level 30-31: Integration by Substitution and Parts
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.AdvancedIntegration = {
    // Advanced integration techniques
    getAdvancedIntegrationQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 4);
        
        if (questionType === 1) {
            // Integration by substitution - fill in the steps
            const a = utils.rInt(2, 5);
            const step = utils.rInt(1, 3);
            
            if (step === 1) {
                return {
                    tex: `\\int ${a}x(x^2 + 1)^3 \\, dx`,
                    instruction: `State an appropriate substitution`,
                    displayAnswer: `u = x^2 + 1`,
                    distractors: utils.ensureUniqueDistractors(
                        `u = x^2 + 1`,
                        [
                            `u = x^2`,
                            `u = (x^2 + 1)^3`,
                            `u = ${a}x`
                        ],
                        () => `u = x^${utils.rInt(2, 5)}`
                    ),
                    explanation: `For ∫${a}x(x² + 1)³ dx, let u = x² + 1. Then du = 2x dx, so x dx = du/2. The integral becomes ∫(${a}/2)u³ du.`,
                    calc: false
                };
            } else if (step === 2) {
                return {
                    tex: `\\text{Given } u = x^2 + 1, \\text{ what is } du?`,
                    instruction: `Find du in terms of x`,
                    displayAnswer: `du = 2x \\, dx`,
                    distractors: utils.ensureUniqueDistractors(
                        `du = 2x \\, dx`,
                        [
                            `du = x \\, dx`,
                            `du = 2x^2 \\, dx`,
                            `du = dx`
                        ],
                        () => `du = ${utils.rInt(1, 5)}x \\, dx`
                    ),
                    explanation: `Differentiating u = x² + 1 gives du/dx = 2x, so du = 2x dx. This means x dx = du/2.`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\int ${a}x(x^2 + 1)^3 \\, dx \\text{ with } u = x^2 + 1`,
                    instruction: `Hence find the integral`,
                    displayAnswer: `\\frac{${a}}{8}(x^2 + 1)^4 + C`,
                    distractors: utils.ensureUniqueDistractors(
                        `\\frac{${a}}{8}(x^2 + 1)^4 + C`,
                        [
                            `\\frac{${a}}{4}(x^2 + 1)^4 + C`,
                            `${a}(x^2 + 1)^4 + C`,
                            `\\frac{${a}}{8}(x^2 + 1)^3 + C`
                        ],
                        () => `\\frac{${utils.rInt(1, 10)}}{${utils.rInt(2, 10)}}(x^2 + 1)^${utils.rInt(3, 5)} + C`
                    ),
                    explanation: `With u = x² + 1 and x dx = du/2: ∫${a}x(x² + 1)³ dx = ∫(${a}/2)u³ du = (${a}/2)(u⁴/4) + C = (${a}/8)u⁴ + C = (${a}/8)(x² + 1)⁴ + C.`,
                    calc: true
                };
            }
        } else if (questionType === 2) {
            // Integration by parts - fill in the steps
            const step = utils.rInt(1, 3);
            
            if (step === 1) {
                return {
                    tex: `\\int x e^x \\, dx`,
                    instruction: `State an appropriate choice for u`,
                    displayAnswer: `u = x`,
                    distractors: utils.ensureUniqueDistractors(
                        `u = x`,
                        [
                            `u = e^x`,
                            `u = xe^x`,
                            `u = 1`
                        ],
                        () => `u = x^${utils.rInt(2, 4)}`
                    ),
                    explanation: `For ∫x·e^x dx, choose u = x (algebraic) and dv = e^x dx (exponential). The LIATE rule suggests: Logarithmic, Inverse trig, Algebraic, Trig, Exponential. Choose u from earlier in the list.`,
                    calc: false
                };
            } else if (step === 2) {
                return {
                    tex: `\\text{Given } u = x, dv = e^x \\, dx`,
                    instruction: `Find du and v`,
                    displayAnswer: `du = dx, \\quad v = e^x`,
                    distractors: utils.ensureUniqueDistractors(
                        `du = dx, \\quad v = e^x`,
                        [
                            `du = 1, \\quad v = e^x`,
                            `du = dx, \\quad v = xe^x`,
                            `du = 0, \\quad v = e^x`
                        ],
                        () => `du = dx, \\quad v = e^{${utils.rInt(1, 5)}x}`
                    ),
                    explanation: `From u = x, we get du = dx. From dv = e^x dx, we integrate to get v = e^x.`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\int x e^x \\, dx \\text{ using parts: } uv - \\int v \\, du`,
                    instruction: `Hence find the integral`,
                    displayAnswer: `xe^x - e^x + C = e^x(x - 1) + C`,
                    distractors: utils.ensureUniqueDistractors(
                        `xe^x - e^x + C = e^x(x - 1) + C`,
                        [
                            `xe^x + e^x + C`,
                            `xe^x + C`,
                            `e^x + C`
                        ],
                        () => `${utils.rInt(1, 5)}xe^x + C`
                    ),
                    explanation: `Using ∫u dv = uv - ∫v du with u = x, v = e^x, du = dx: ∫xe^x dx = x·e^x - ∫e^x dx = xe^x - e^x + C = e^x(x - 1) + C.`,
                    calc: false
                };
            }
        } else if (questionType === 3) {
            // Substitution with trig functions
            const step = utils.rInt(1, 2);
            
            if (step === 1) {
                return {
                    tex: `\\int \\sin(x) \\cos(x) \\, dx`,
                    instruction: `State an appropriate substitution`,
                    displayAnswer: `u = \\sin(x)`,
                    distractors: utils.ensureUniqueDistractors(
                        `u = \\sin(x)`,
                        [
                            `u = \\cos(x)`,
                            `u = \\sin(x)\\cos(x)`,
                            `u = x`
                        ],
                        () => `u = \\sin(${utils.rInt(2, 5)}x)`
                    ),
                    explanation: `For ∫sin(x)cos(x) dx, let u = sin(x). Then du = cos(x) dx, giving us ∫u du. (Note: u = cos(x) also works!)`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\int \\sin(x) \\cos(x) \\, dx \\text{ with } u = \\sin(x)`,
                    instruction: `Hence find the integral`,
                    displayAnswer: `\\frac{1}{2}\\sin^2(x) + C`,
                    distractors: utils.ensureUniqueDistractors(
                        `\\frac{1}{2}\\sin^2(x) + C`,
                        [
                            `\\sin^2(x) + C`,
                            `\\frac{1}{2}\\cos^2(x) + C`,
                            `-\\frac{1}{2}\\cos^2(x) + C`
                        ],
                        () => `\\frac{1}{${utils.rInt(2, 5)}}\\sin^2(x) + C`
                    ),
                    explanation: `With u = sin(x) and du = cos(x) dx: ∫sin(x)cos(x) dx = ∫u du = u²/2 + C = (1/2)sin²(x) + C.`,
                    calc: false
                };
            }
        } else {
            // Reverse chain rule
            const a = utils.rInt(2, 5);
            const n = utils.rInt(2, 4);
            
            const coefficient = a * (n + 1);
            // For ∫ ax(x²+1)^n dx with u=x²+1, du=2x dx, so x dx = du/2
            // Result: ∫(a/2)u^n du = (a/2)·u^(n+1)/(n+1) = a/(2(n+1))·(x²+1)^(n+1)
            // Since coefficient = a(n+1), the final coefficient is coefficient/(2(n+1))
            const result = utils.roundToClean(coefficient / (2 * (n + 1)));
            
            return {
                tex: `\\int ${coefficient}x(x^2 + 1)^${n} \\, dx`,
                instruction: `Find the integral`,
                displayAnswer: `${result}(x^2 + 1)^${n + 1} + C`,
                distractors: utils.ensureUniqueDistractors(
                    `${result}(x^2 + 1)^${n + 1} + C`,
                    [
                        `${coefficient}(x^2 + 1)^${n + 1} + C`,
                        `${result}(x^2 + 1)^${n} + C`,
                        `\\frac{${coefficient}}{${n}}(x^2 + 1)^${n + 1} + C`
                    ],
                    () => `${utils.rInt(1, 10)}(x^2 + 1)^${utils.rInt(2, 6)} + C`
                ),
                explanation: `Let u = x² + 1, then du = 2x dx, so x dx = du/2. ∫${coefficient}x(x² + 1)^${n} dx = ∫${coefficient/2}u^${n} du = ${result}u^${n + 1} + C = ${result}(x² + 1)^${n + 1} + C.`,
                calc: true
            };
        }
    }
};
