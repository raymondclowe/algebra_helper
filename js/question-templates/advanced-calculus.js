// Advanced Calculus Question Templates
// Level 20-21
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.AdvancedCalculus = {
    getAdvancedCalculus: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 12);
                
                if (questionType === 1) {
                    // Chain rule: d/dx[f(g(x))]
                    const a = utils.rInt(2, 5);
                    const b = utils.rInt(1, 6);
                    const n = utils.rInt(2, 4);
                    
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = (${a}x + ${b})^${n}`),
                        instruction: utils.toUnicodeFunction("Find f'(x) using chain rule"),
                        displayAnswer: `${n * a}(${a}x + ${b})^{${n - 1}}`,
                        distractors: [
                            `${n}(${a}x + ${b})^{${n - 1}}`,
                            `${a}(${a}x + ${b})^{${n - 1}}`,
                            `${n * a}x^{${n - 1}}`
                        ],
                        explanation: `Apply the chain rule: d/dx[(ax+b)^n] = n(ax+b)^(n-1) × a. Therefore f'(x) = ${n}(${a}x + ${b})^${n - 1} × ${a} = ${n * a}(${a}x + ${b})^${n - 1}.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Product rule: d/dx[f(x)g(x)]
                    const a = utils.rInt(2, 5);
                    const b = utils.rInt(1, 4);
                    
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = x \\cdot ${a}x^${b}`),
                        instruction: utils.toUnicodeFunction("Find f'(x) using product rule"),
                        displayAnswer: `${(b + 1) * a}x^{${b}}`,
                        distractors: [
                            `${a * b}x^{${b - 1}}`,
                            `${a}x^{${b}}`,
                            `${a}x^{${b + 1}}`
                        ],
                        explanation: utils.toUnicodeFunction(`Apply the product rule (uv)' = u'v + uv' where u = x and v = ${a}x^${b}. Therefore f'(x) = (1)(${a}x^${b}) + (x)(${a * b}x^${b - 1}) = ${(b + 1) * a}x^${b}.`),
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Quotient rule hint or second derivative
                    const a = utils.rInt(2, 5);
                    const n = utils.rInt(2, 4);
                    const firstDeriv = a * n;
                    const secondDeriv = a * n * (n - 1);
                    
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = ${a}x^${n}`),
                        instruction: utils.toUnicodeFunction("Find the second derivative f''(x)"),
                        displayAnswer: `${secondDeriv}x^{${n - 2}}`,
                        distractors: [
                            `${firstDeriv}x^{${n - 1}}`,
                            `${a * n * n}x^{${n - 2}}`,
                            `${secondDeriv}x^{${n - 1}}`
                        ],
                        explanation: utils.toUnicodeFunction(`Differentiate twice. First derivative: f'(x) = ${firstDeriv}x^${n - 1}. Second derivative: f''(x) = ${firstDeriv}(${n - 1})x^${n - 2} = ${secondDeriv}x^${n - 2}.`),
                        calc: false
                    };
                } else if (questionType === 4) {
                    // Critical points: Give f(x), find f'(x), then solve f'(x) = 0
                    // This requires students to differentiate first, then find roots
                    const a = utils.rInt(1, 3);
                    const root = utils.rInt(2, 5);
                    // For f'(x) = ax + b = 0 to have solution x = root:
                    // ax + b = 0 → x = -b/a → root = -b/a → b = -a * root
                    const b = -a * root;
                    const c = utils.rInt(1, 10);  // Constant term (disappears in derivative)
                    
                    // f(x) = (a/2)x² + bx + c, so f'(x) = ax + b
                    // Use fraction notation when a is odd to avoid floating point display issues
                    const fxTerm = (a % 2 === 1) ? `\\frac{${a}}{2}x^2` : `${a/2}x^2`;
                    
                    const correctAnswer = `x = ${root}`;
                    const candidateDistractors = [
                        `x = ${-root}`,
                        `x = ${root + 1}`,
                        `x = 0`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `x = ${utils.rInt(1, 10)}`
                    );
                    
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = ${fxTerm} ${b >= 0 ? '+' : ''}${b}x + ${c}`),
                        instruction: utils.toUnicodeFunction("Find the critical point of f(x)"),
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: utils.toUnicodeFunction(`Differentiate: f'(x) = ${a}x ${b >= 0 ? '+' : ''}${b}. For critical points, solve f'(x) = 0: ${a}x ${b >= 0 ? '+' : ''}${b} = 0, which gives ${a}x = ${-b}, therefore x = ${root}.`),
                        calc: false
                    };
                } else if (questionType === 5) {
                    // Definition: What is the chain rule?
                    const correctAnswer = `\\text{If } y = f(g(x))\\text{, then } \\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)`;
                    const candidateDistractors = [
                        `\\text{If } y = f(x)g(x)\\text{, then } \\frac{dy}{dx} = f'(x)g(x) + f(x)g'(x)`,
                        `\\text{If } y = \\frac{f(x)}{g(x)}\\text{, then } \\frac{dy}{dx} = \\frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}`,
                        `\\text{If } y = kx^n\\text{, then } \\frac{dy}{dx} = knx^{n-1}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random formula}`
                    );
                    
                    return {
                        tex: `\\text{State the chain rule for differentiation}`,
                        instruction: "Select the correct formula",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The chain rule states that when differentiating a composite function y = f(g(x)), we multiply the derivative of the outer function by the derivative of the inner function: dy/dx = f'(g(x)) × g'(x).`,
                        calc: false
                    };
                } else if (questionType === 6) {
                    // Definition: What is the product rule?
                    const correctAnswer = `\\text{If } y = f(x)g(x)\\text{, then } \\frac{dy}{dx} = f'(x)g(x) + f(x)g'(x)`;
                    const candidateDistractors = [
                        `\\text{If } y = f(g(x))\\text{, then } \\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)`,
                        `\\text{If } y = f(x)g(x)\\text{, then } \\frac{dy}{dx} = f'(x)g'(x)`,
                        `\\text{If } y = \\frac{f(x)}{g(x)}\\text{, then } \\frac{dy}{dx} = \\frac{f'(x)}{g'(x)}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random formula}`
                    );
                    
                    return {
                        tex: `\\text{State the product rule for differentiation}`,
                        instruction: "Select the correct formula",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The product rule states that when differentiating a product y = f(x)g(x), we use: dy/dx = f'(x)g(x) + f(x)g'(x). Remember: derivative of first times second, plus first times derivative of second.`,
                        calc: false
                    };
                } else if (questionType === 7) {
                    // Chain rule with square root
                    const a = utils.rInt(2, 6);
                    const b = utils.rInt(1, 8);
                    
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = \\sqrt{${a}x + ${b}}`),
                        instruction: utils.toUnicodeFunction("Find f'(x) using chain rule"),
                        displayAnswer: `\\frac{${a}}{2\\sqrt{${a}x + ${b}}}`,
                        distractors: [
                            `\\frac{1}{2\\sqrt{${a}x + ${b}}}`,
                            `\\frac{${a}}{\\sqrt{${a}x + ${b}}}`,
                            `\\frac{${a}x}{2\\sqrt{${a}x + ${b}}}`
                        ],
                        explanation: utils.toUnicodeFunction(`Rewrite as f(x) = (${a}x + ${b})^(1/2). Apply chain rule: f'(x) = (1/2)(${a}x + ${b})^(-1/2) × ${a} = ${a}/(2√(${a}x + ${b})). The chain rule requires multiplying by the derivative of the inner function ${a}x + ${b}, which is ${a}.`),
                        calc: false
                    };
                } else if (questionType === 8) {
                    // Product rule with polynomial
                    const a = utils.rInt(2, 4);
                    const b = utils.rInt(1, 3);
                    
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = (x + ${a})(x^${b})`),
                        instruction: utils.toUnicodeFunction("Find f'(x) using product rule"),
                        displayAnswer: `x^${b} + ${b + 1}x^${b - 1} + ${a * b}x^${b - 1}`,
                        distractors: [
                            `${b}x^${b - 1}`,
                            `x^${b} + ${a * b}x^${b - 1}`,
                            `(1)(${b}x^${b - 1})`
                        ],
                        explanation: utils.toUnicodeFunction(`Let u = (x + ${a}) and v = x^${b}. Then u' = 1 and v' = ${b}x^${b - 1}. Product rule: (uv)' = u'v + uv' = (1)(x^${b}) + (x + ${a})(${b}x^${b - 1}) = x^${b} + ${b}x^${b} + ${a * b}x^${b - 1}.`),
                        calc: false
                    };
                } else if (questionType === 9) {
                    // What is a critical point?
                    const correctAnswer = `\\text{A point where } f'(x) = 0 \\text{ or } f'(x) \\text{ is undefined}`;
                    const candidateDistractors = [
                        `\\text{A point where } f(x) = 0`,
                        `\\text{A point where } f''(x) = 0`,
                        `\\text{The maximum value of } f(x)`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{What is a critical point of a function?}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `A critical point occurs where the derivative f'(x) equals zero or is undefined. These points are important because they may be local maxima, local minima, or points of inflection. Critical points are found by solving f'(x) = 0.`,
                        calc: false
                    };
                } else if (questionType === 10) {
                    // Stationary points identification
                    const a = utils.rInt(2, 4);
                    const root1 = utils.rInt(1, 3);
                    const root2 = utils.rInt(4, 6);
                    
                    return {
                        tex: utils.toUnicodeFunction(`f'(x) = ${a}(x - ${root1})(x - ${root2})`),
                        instruction: utils.toUnicodeFunction("Find all stationary points"),
                        displayAnswer: `x = ${root1}, x = ${root2}`,
                        distractors: [
                            `x = ${root1}`,
                            `x = ${root2}`,
                            `x = ${(root1 + root2) / 2}`
                        ],
                        explanation: utils.toUnicodeFunction(`Stationary points occur where f'(x) = 0. Setting ${a}(x - ${root1})(x - ${root2}) = 0 gives x = ${root1} or x = ${root2}. Both are stationary points.`),
                        calc: false
                    };
                } else if (questionType === 11) {
                    // Chain rule with exponential (simplified)
                    const a = utils.rInt(2, 5);
                    const b = utils.rInt(1, 4);
                    
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = (${a}x + ${b})^{-1}`),
                        instruction: utils.toUnicodeFunction("Find f'(x)"),
                        displayAnswer: `\\frac{-${a}}{(${a}x + ${b})^2}`,
                        distractors: [
                            `\\frac{${a}}{(${a}x + ${b})^2}`,
                            `\\frac{-1}{(${a}x + ${b})^2}`,
                            `-${a}(${a}x + ${b})^{-2}`
                        ],
                        explanation: utils.toUnicodeFunction(`Apply chain rule: f'(x) = -1 × (${a}x + ${b})^(-2) × ${a} = -${a}/(${a}x + ${b})^2. The negative comes from the exponent, and we multiply by ${a} (the derivative of the inner function).`),
                        calc: false
                    };
                } else {
                    // Second derivative and concavity
                    const a = utils.rInt(2, 4);
                    const n = utils.rInt(3, 5);
                    
                    return {
                        tex: `\\text{If } f''(x) > 0 \\text{ at a point, what does}\\\\[0.5em]\\text{this tell us about the function?}`,
                        instruction: "Select the correct statement",
                        displayAnswer: `\\text{The function is concave up (convex)}`,
                        distractors: [
                            `\\text{The function is concave down}`,
                            `\\text{The function has a maximum}`,
                            `\\text{The function is decreasing}`
                        ],
                        explanation: `When f''(x) > 0, the second derivative is positive, meaning the function is concave up (convex). The graph curves upward like a smile. If f''(x) < 0, the function would be concave down.`,
                        calc: false
                    };
                }
    }
};
