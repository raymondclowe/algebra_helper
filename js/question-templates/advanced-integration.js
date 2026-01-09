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
    },
    
    getDefiniteIntegralQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 8);
        
        if (questionType === 1) {
            // Basic definite integral: ∫[a,b] x^n dx
            const n = utils.rInt(1, 3);
            const a = 0;
            const b = utils.rInt(2, 4);
            // ∫[0,b] x^n dx = [x^(n+1)/(n+1)]₀^b = b^(n+1)/(n+1)
            const result = Math.pow(b, n+1) / (n+1);
            
            const correctAnswer = `\\frac{${Math.pow(b, n+1)}}{${n+1}}`;
            const candidateDistractors = [
                `\\frac{${Math.pow(b, n)}}{${n}}`,  // Wrong power
                `${Math.pow(b, n+1)}`,  // Forgot to divide
                `\\frac{${Math.pow(b, n+1)}}{${n}}`  // Wrong denominator
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{${utils.rInt(1, 30)}}{${utils.rInt(2, 6)}}`
            );
            
            return {
                tex: `\\int_{0}^{${b}} x^${n} \\, dx`,
                instruction: "Evaluate the definite integral",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `∫₀^${b} x^${n} dx = [x^${n+1}/${n+1}]₀^${b} = ${b}^${n+1}/${n+1} - 0 = ${Math.pow(b, n+1)}/${n+1}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Linear function: ∫[a,b] (mx+c) dx
            const m = utils.rInt(1, 5);
            const c = utils.rInt(1, 5);
            const a = utils.rInt(1, 2);
            const b = utils.rInt(3, 5);
            // ∫[a,b] (mx+c) dx = [mx²/2 + cx]ₐ^b = (mb²/2 + cb) - (ma²/2 + ca)
            const upper = m * b * b / 2 + c * b;
            const lower = m * a * a / 2 + c * a;
            const result = upper - lower;
            
            const correctAnswer = `${result}`;
            const candidateDistractors = [
                `${Math.round(upper)}`,  // Forgot to subtract lower
                `${Math.round(m * (b - a) + c)}`,  // Wrong approach
                `${Math.round(result + m)}`  // Calculation error
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(1, 50)}`
            );
            
            return {
                tex: `\\int_{${a}}^{${b}} (${m}x + ${c}) \\, dx`,
                instruction: "Evaluate the definite integral",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `∫${a}^${b} (${m}x + ${c}) dx = [${m}x²/2 + ${c}x]${a}^${b} = (${m}·${b}²/2 + ${c}·${b}) - (${m}·${a}²/2 + ${c}·${a}) = ${upper} - ${lower} = ${result}.`,
                calc: true
            };
        } else if (questionType === 3) {
            // Constant function: ∫[a,b] k dx = k(b-a)
            const k = utils.rInt(2, 8);
            const a = utils.rInt(0, 3);
            const b = utils.rInt(4, 7);
            const result = k * (b - a);
            
            const correctAnswer = `${result}`;
            const candidateDistractors = [
                `${k}`,  // Forgot to multiply by interval
                `${b - a}`,  // Forgot constant
                `${k * b}`  // Forgot to subtract a
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(5, 50)}`
            );
            
            return {
                tex: `\\int_{${a}}^{${b}} ${k} \\, dx`,
                instruction: "Evaluate the definite integral",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `∫${a}^${b} ${k} dx = [${k}x]${a}^${b} = ${k}·${b} - ${k}·${a} = ${k * b} - ${k * a} = ${result}. For constant k, ∫ₐ^b k dx = k(b-a).`,
                calc: false
            };
        } else if (questionType === 4) {
            // Area under curve y = x²
            const a = 0;
            const b = utils.rInt(2, 5);
            // Area = ∫[0,b] x² dx = b³/3
            const result = Math.pow(b, 3) / 3;
            
            const correctAnswer = `\\frac{${Math.pow(b, 3)}}{3}`;
            const candidateDistractors = [
                `\\frac{${Math.pow(b, 2)}}{2}`,  // Used wrong power
                `${Math.pow(b, 3)}`,  // Forgot to divide
                `\\frac{${Math.pow(b, 3)}}{2}`  // Wrong denominator
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{${utils.rInt(8, 125)}}{${utils.rInt(2, 5)}}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Find area under } y = x^2\\\\[0.5em]\\text{from } x = 0 \\text{ to } x = ${b}`),
                instruction: "Calculate the area",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Area = ∫₀^${b} x² dx = [x³/3]₀^${b} = ${b}³/3 - 0 = ${Math.pow(b, 3)}/3. The area under a curve is the definite integral.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Additive property: ∫[a,c] = ∫[a,b] + ∫[b,c]
            const int1 = utils.rInt(3, 8);
            const int2 = utils.rInt(3, 8);
            const total = int1 + int2;
            
            const correctAnswer = `${total}`;
            const candidateDistractors = [
                `${int1}`,  // Only first interval
                `${int2}`,  // Only second interval
                `${int1 * int2}`  // Multiplied instead
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(5, 30)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } \\int_{0}^{2} f(x)dx = ${int1}\\\\[0.5em]\\text{and } \\int_{2}^{4} f(x)dx = ${int2}\\\\[0.5em]\\text{find } \\int_{0}^{4} f(x)dx`),
                instruction: "Calculate using integral properties",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `By the additive property: ∫₀^4 f(x)dx = ∫₀^2 f(x)dx + ∫₂^4 f(x)dx = ${int1} + ${int2} = ${total}. Integrals over adjacent intervals add up.`,
                calc: false
            };
        } else if (questionType === 6) {
            // Odd function over symmetric interval: ∫[-a,a] f(x)dx = 0
            const a = utils.rInt(1, 5);
            
            const correctAnswer = `0`;
            const candidateDistractors = [
                `${2 * a}`,  // Used interval length
                `${a}`,  // Used half
                `Cannot be determined`  // Didn't recognize odd function
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(1, 10)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Evaluate } \\int_{-${a}}^{${a}} x^3 \\, dx`),
                instruction: "Use symmetry properties",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `x³ is an odd function (f(-x) = -f(x)). For odd functions, ∫₋ₐ^a f(x)dx = 0 because the positive and negative areas cancel. Therefore ∫₋${a}^${a} x³ dx = 0.`,
                calc: false
            };
        } else if (questionType === 7) {
            // Fundamental theorem: F(b) - F(a)
            const a = utils.rInt(1, 3);
            const b = utils.rInt(4, 7);
            const F_b = utils.rInt(20, 40);
            const F_a = utils.rInt(5, 15);
            const result = F_b - F_a;
            
            const correctAnswer = `${result}`;
            const candidateDistractors = [
                `${F_b}`,  // Forgot to subtract F(a)
                `${F_a}`,  // Used wrong value
                `${F_b + F_a}`  // Added instead
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(10, 50)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } F(x) \\text{ is an antiderivative of } f(x),\\\\[0.5em]F(${a}) = ${F_a}, F(${b}) = ${F_b}\\\\[0.5em]\\text{find } \\int_{${a}}^{${b}} f(x)dx`),
                instruction: "Use Fundamental Theorem of Calculus",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Fundamental Theorem: ∫ₐ^b f(x)dx = F(b) - F(a) where F is an antiderivative of f. So ∫${a}^${b} f(x)dx = F(${b}) - F(${a}) = ${F_b} - ${F_a} = ${result}.`,
                calc: false
            };
        } else {
            // Linearity: ∫[a,b] cf(x)dx = c∫[a,b] f(x)dx
            const c = utils.rInt(2, 6);
            const integral = utils.rInt(4, 12);
            const result = c * integral;
            
            const correctAnswer = `${result}`;
            const candidateDistractors = [
                `${integral}`,  // Forgot constant
                `${c + integral}`,  // Added instead
                `${Math.round(integral / c)}`  // Divided instead
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(10, 80)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } \\int_{1}^{3} f(x)dx = ${integral}\\\\[0.5em]\\text{find } \\int_{1}^{3} ${c}f(x)dx`),
                instruction: "Use linearity property",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `By linearity: ∫ₐ^b cf(x)dx = c·∫ₐ^b f(x)dx. So ∫₁^3 ${c}f(x)dx = ${c}·∫₁^3 f(x)dx = ${c}·${integral} = ${result}. Constants factor out of integrals.`,
                calc: false
            };
        }
    }
};
