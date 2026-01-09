// Advanced Calculus Question Templates
// Level 20-21
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.AdvancedCalculus = {
    getQuotientRuleQuestion: function() {
        const utils = window.GeneratorUtils;
        const qType = utils.rInt(1, 4);
        
        if (qType === 1) {
            // State the quotient rule
            const correctAnswer = `\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v^2}`;
            const candidateDistractors = [
                `\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u\\frac{dv}{dx} - v\\frac{du}{dx}}{v^2}`,  // Wrong order
                `\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{\\frac{du}{dx}}{\\frac{dv}{dx}}`,  // Wrong formula
                `\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v}`  // Missing v²
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{du}{dx} \\cdot \\frac{dv}{dx}`
            );
            
            return {
                tex: `\\text{State the quotient rule}`,
                instruction: "Select the correct formula",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `The quotient rule is: d/dx[u/v] = (v·du/dx - u·dv/dx)/v². Remember: "low d-high minus high d-low, over the square of what's below" or "bottom times derivative of top minus top times derivative of bottom, all over bottom squared".`,
                calc: false
            };
        } else if (qType === 2) {
            // Simple quotient rule application
            const a = utils.rInt(2, 5);
            const b = utils.rInt(1, 4);
            
            const correctAnswer = `\\frac{${a}x + ${b}}{(x + ${b})^2}`;
            const candidateDistractors = [
                `\\frac{${a}}{x + ${b}}`,  // Didn't apply rule properly
                `\\frac{${a}x}{(x + ${b})^2}`,  // Forgot constant
                `\\frac{${a}}{(x + ${b})^2}`  // Wrong numerator
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{${utils.rInt(1, 10)}x}{(x + ${utils.rInt(1, 5)})^2}`
            );
            
            return {
                tex: `f(x) = \\frac{${a}x}{x + ${b}}`,
                instruction: "Find f'(x) using the quotient rule",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Using quotient rule: f'(x) = [(x+${b})·${a} - ${a}x·1]/(x+${b})² = [${a}x + ${a*b} - ${a}x]/(x+${b})² = ${a*b}/(x+${b})² = (${a}x + ${b})/(x+${b})².`,
                calc: false
            };
        } else if (qType === 3) {
            // When to use quotient rule
            const correctAnswer = `\\text{When differentiating } \\frac{u(x)}{v(x)}`;
            const candidateDistractors = [
                `\\text{When differentiating } u(x) \\cdot v(x)`,  // That's product rule
                `\\text{When differentiating } u(v(x))`,  // That's chain rule
                `\\text{When integrating fractions}`  // Wrong operation
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\text{When differentiating } x^n`
            );
            
            return {
                tex: `\\text{When should you use the quotient rule?}`,
                instruction: "Select the correct situation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use the quotient rule when differentiating a fraction u(x)/v(x) where both numerator and denominator are functions of x. Alternative: rewrite as u(x)·[v(x)]⁻¹ and use product rule, but quotient rule is often more direct.`,
                calc: false
            };
        } else {
            // Quotient rule vs product rule
            const correctAnswer = `\\text{Use quotient rule: } \\frac{v·u' - u·v'}{v^2}`;
            const candidateDistractors = [
                `\\text{Use product rule: } u'v + uv'`,
                `\\text{Use chain rule: } f'(g(x))·g'(x)`,
                `\\text{Use power rule: } nx^{n-1}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\text{Use quotient rule: } \\frac{u'}{v'}`
            );
            
            return {
                tex: `\\text{Differentiate } \\frac{\\sin(x)}{x}`,
                instruction: "Which rule should you use?",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `This is a quotient (fraction), so use the quotient rule: d/dx[sin(x)/x] = [x·cos(x) - sin(x)·1]/x² = (x·cos(x) - sin(x))/x².`,
                calc: false
            };
        }
    },
    getLHopitalRuleQuestion: function() {
        const utils = window.GeneratorUtils;
        const hType = utils.rInt(1, 4);
        
        if (hType === 1) {
            // When to use L'Hôpital's rule
            const correctAnswer = `\\text{When limit gives } \\frac{0}{0} \\text{ or } \\frac{\\infty}{\\infty}`;
            const candidateDistractors = [
                `\\text{When limit gives } \\frac{0}{\\infty}`,
                `\\text{When limit gives a finite number}`,
                `\\text{Always when finding limits}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\text{When limit gives } \\frac{1}{0}`
            );
            
            return {
                tex: `\\text{When can L'Hôpital's rule be used?}`,
                instruction: "Select the correct condition",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `L'Hôpital's rule applies to indeterminate forms 0/0 and ∞/∞. The rule states: if lim[f(x)/g(x)] gives 0/0 or ∞/∞, then lim[f(x)/g(x)] = lim[f'(x)/g'(x)] (if the latter limit exists). Do NOT use for determinate forms like 1/0.`,
                calc: false
            };
        } else if (hType === 2) {
            // Simple L'Hôpital application: lim x→0 (sin x)/x
            const correctAnswer = `1`;
            const candidateDistractors = [
                `0`,
                `\\infty`,
                `\\text{undefined}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(-5, 5)}`
            );
            
            return {
                tex: `\\lim_{x \\to 0} \\frac{\\sin(x)}{x}`,
                instruction: "Evaluate using L'Hôpital's rule",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Direct substitution gives 0/0 (indeterminate). Apply L'Hôpital's rule: lim[sin(x)/x] = lim[cos(x)/1] as x→0 = cos(0)/1 = 1. This is a famous limit.`,
                calc: false
            };
        } else if (hType === 3) {
            // L'Hôpital with e^x: lim x→0 (e^x - 1)/x
            const correctAnswer = `1`;
            const candidateDistractors = [
                `0`,
                `e`,
                `\\text{undefined}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(-3, 5)}`
            );
            
            return {
                tex: `\\lim_{x \\to 0} \\frac{e^x - 1}{x}`,
                instruction: "Evaluate using L'Hôpital's rule",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Direct substitution gives (e⁰-1)/0 = 0/0 (indeterminate). Apply L'Hôpital's rule: lim[(e^x - 1)/x] = lim[e^x/1] as x→0 = e⁰ = 1.`,
                calc: false
            };
        } else {
            // Which indeterminate forms allow L'Hôpital
            const correctAnswer = `\\frac{0}{0} \\text{ and } \\frac{\\infty}{\\infty}`;
            const candidateDistractors = [
                `\\frac{0}{\\infty} \\text{ and } \\frac{\\infty}{0}`,
                `\\text{All fractions with limits}`,
                `0 \\cdot \\infty \\text{ only}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{1}{0}`
            );
            
            return {
                tex: `\\text{Which forms allow L'Hôpital's rule?}`,
                instruction: "Select the indeterminate forms",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `L'Hôpital's rule applies to indeterminate forms 0/0 and ∞/∞. Other indeterminate forms (0·∞, ∞-∞, 0⁰, 1^∞, ∞⁰) can sometimes be rewritten as 0/0 or ∞/∞ forms to apply the rule. Forms like 1/0 are NOT indeterminate.`,
                calc: false
            };
        }
    },
    getAdvancedCalculus: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 14);
                
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
                } else if (questionType === 12) {
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
                } else if (questionType === 13) {
                    // Quotient rule questions
                    return this.getQuotientRuleQuestion();
                } else {
                    // L'Hôpital's rule questions
                    return this.getLHopitalRuleQuestion();
                }
    },
    
    getImplicitDifferentiationQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 5);
        
        if (questionType === 1) {
            // Basic circle: x² + y² = r²
            const r = utils.rInt(3, 7);
            const rSquared = r * r;
            
            const correctAnswer = `-\\frac{x}{y}`;
            const candidateDistractors = [
                `\\frac{x}{y}`,  // Wrong sign
                `-\\frac{y}{x}`,  // Inverted
                `-x - y`  // Wrong approach
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['-x', '-y', '\\frac{-y}{x}', '\\frac{y}{x}'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{For } x^2 + y^2 = ${rSquared},\\\\[0.5em]\\text{find } \\frac{dy}{dx}`),
                instruction: "Use implicit differentiation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Differentiate both sides with respect to x: 2x + 2y(dy/dx) = 0. Solve for dy/dx: 2y(dy/dx) = -2x, so dy/dx = -2x/(2y) = -x/y. Remember: d/dx[y²] = 2y·dy/dx (chain rule).`,
                calc: false
            };
        } else if (questionType === 2) {
            // Find dy/dx at a specific point on circle
            const x = utils.rInt(2, 4);
            const y = utils.rInt(2, 4);
            const rSquared = x * x + y * y;
            const slope = -x / y;
            
            const correctAnswer = `${slope}`;
            const candidateDistractors = [
                `${-slope}`,  // Wrong sign
                `${y / x}`,  // Reciprocal wrong
                `${x / y}`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(-5, 5)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Circle: } x^2 + y^2 = ${rSquared}\\\\[0.5em]\\text{Find } \\frac{dy}{dx} \\text{ at } (${x}, ${y})`),
                instruction: "Calculate the gradient (2 dp)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `From x² + y² = ${rSquared}, we get dy/dx = -x/y. At (${x}, ${y}): dy/dx = -${x}/${y} = ${slope}. This is the gradient of the tangent line at that point.`,
                calc: true
            };
        } else if (questionType === 3) {
            // When to use implicit differentiation
            const correctAnswer = `\\text{When y cannot be isolated}`;
            const candidateDistractors = [
                `\\text{For all equations}`,  // Not necessary
                `\\text{Only for circles}`,  // Too specific
                `\\text{Never needed}`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\text{For linear equations}', '\\text{For explicit functions}', '\\text{Only in 3D}'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Implicit differentiation}\\\\[0.5em]\\text{is used when...}`),
                instruction: "Select the correct condition",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Implicit differentiation is used when y cannot easily be isolated (solved explicitly). For equations like x² + y² = 25 or x³ + y³ = 6xy, it's easier to differentiate both sides than to solve for y first.`,
                calc: false
            };
        } else if (questionType === 4) {
            // First step in implicit differentiation
            const correctAnswer = `\\text{Differentiate both sides with respect to x}`;
            const candidateDistractors = [
                `\\text{Solve for y first}`,  // Opposite of implicit method
                `\\text{Factor both sides}`,  // Wrong first step
                `\\text{Set the equation to zero}`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\text{Substitute values}', '\\text{Take the square root}', '\\text{Add dy/dx to both sides}'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{For } x^3 + y^3 = 6xy,\\\\[0.5em]\\text{what is the first step to find } \\frac{dy}{dx}?`),
                instruction: "Select the correct first step",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `First step: differentiate both sides with respect to x. For x³ + y³ = 6xy, get: 3x² + 3y²(dy/dx) = 6y + 6x(dy/dx). Then collect dy/dx terms and solve.`,
                calc: false
            };
        } else {
            // For xy = 1, find dy/dx
            const correctAnswer = `-\\frac{y}{x}`;
            const candidateDistractors = [
                `\\frac{y}{x}`,  // Wrong sign
                `-\\frac{x}{y}`,  // Inverted
                `\\frac{1}{xy}`  // Wrong formula
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\frac{x}{y}', '-x', '-y', '\\frac{1}{x}', '-xy'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{For } xy = 1, \\text{ find } \\frac{dy}{dx}`),
                instruction: "Use implicit differentiation (give answer in terms of x and y)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use product rule on left side: y + x(dy/dx) = 0. Solve for dy/dx: x(dy/dx) = -y, so dy/dx = -y/x. This is the answer in terms of x and y as requested.`,
                calc: false
            };
        }
    },
    
    getRelatedRatesQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 5);
        
        if (questionType === 1) {
            // Circle area: if dr/dt = 2, find dA/dt when r = 3
            const drdt = utils.rInt(1, 3);
            const r = utils.rInt(3, 6);
            const dAdt = 2 * Math.PI * r * drdt;
            const dAdtRounded = Math.round(dAdt * 10) / 10;
            
            const correctAnswer = `${dAdtRounded}`;
            const candidateDistractors = [
                `${Math.round(Math.PI * r * r * 10) / 10}`,  // Just area
                `${drdt}`,  // Used dr/dt
                `${2 * r * drdt}`  // Forgot π
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${Math.round(utils.rInt(10, 100) * 10) / 10}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } \\frac{dr}{dt} = ${drdt} \\text{ and } A = \\pi r^2,\\\\[0.5em]\\text{find } \\frac{dA}{dt} \\text{ when } r = ${r}`),
                instruction: "Calculate the rate (1 dp)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `From A = πr², differentiate with respect to t: dA/dt = 2πr·dr/dt. When r = ${r} and dr/dt = ${drdt}: dA/dt = 2π(${r})(${drdt}) = ${2 * r * drdt}π ≈ ${dAdtRounded}.`,
                calc: true
            };
        } else if (questionType === 2) {
            // Sphere volume: V = (4/3)πr³, find dV/dt when r = 6, dr/dt = 0.5
            const drdt = 0.5;
            const r = 6;
            const dVdt = 4 * Math.PI * r * r * drdt;
            const dVdtRounded = Math.round(dVdt * 10) / 10;
            
            const correctAnswer = `${dVdtRounded}`;
            const candidateDistractors = [
                `${Math.round((4/3) * Math.PI * r * r * r * 10) / 10}`,  // Just volume
                `${drdt}`,  // Used dr/dt
                `${Math.round(4 * r * r * 10) / 10}`  // Forgot π and dr/dt
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${Math.round(utils.rInt(20, 200) * 10) / 10}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Sphere: } V = \\frac{4}{3}\\pi r^3\\\\[0.5em]\\text{If } \\frac{dr}{dt} = ${drdt}, \\text{ find } \\frac{dV}{dt}\\\\[0.5em]\\text{when } r = ${r}`),
                instruction: "Calculate the rate (1 dp)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `From V = (4/3)πr³, differentiate: dV/dt = 4πr²·dr/dt. When r = ${r} and dr/dt = ${drdt}: dV/dt = 4π(${r})²(${drdt}) = ${4 * r * r * drdt}π ≈ ${dVdtRounded}.`,
                calc: true
            };
        } else if (questionType === 3) {
            // Ladder sliding: x² + y² = 25, dx/dt = 3, find dy/dt when x = 3, y = 4
            const L = 5;
            const x = 3;
            const y = 4;
            const dxdt = 3;
            const dydt = -(x * dxdt) / y;
            
            const correctAnswer = `${dydt}`;
            const candidateDistractors = [
                `${-dydt}`,  // Wrong sign
                `${dxdt}`,  // Used dx/dt
                `${x * dxdt}`  // Missing division
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(-10, 10) * 0.25}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Ladder: } x^2 + y^2 = ${L*L}\\\\[0.5em]\\text{If } \\frac{dx}{dt} = ${dxdt}, \\text{ find } \\frac{dy}{dt}\\\\[0.5em]\\text{when } x = ${x}, y = ${y}`),
                instruction: "Calculate the rate (2 dp)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `From x² + y² = ${L*L}, differentiate: 2x·dx/dt + 2y·dy/dt = 0. Solve for dy/dt: dy/dt = -(x·dx/dt)/y = -(${x}·${dxdt})/${y} = ${dydt}. Negative means y is decreasing.`,
                calc: true
            };
        } else if (questionType === 4) {
            // Which rule for related rates?
            const correctAnswer = `\\text{Chain rule}`;
            const candidateDistractors = [
                `\\text{Product rule}`,  // Sometimes used but not main
                `\\text{Quotient rule}`,  // Wrong
                `\\text{Power rule only}`  // Insufficient
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\text{L\'Hôpital\'s rule}', '\\text{Integration}', '\\text{Implicit differentiation}'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Related rates problems}\\\\[0.5em]\\text{primarily use which rule?}`),
                instruction: "Select the main technique",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Related rates problems use the chain rule with time derivatives: dV/dt = dV/dr · dr/dt. We differentiate with respect to time, connecting rates of change of different quantities.`,
                calc: false
            };
        } else {
            // Setup equation for cone
            const correctAnswer = `\\frac{dV}{dt} = \\frac{1}{3}\\pi r^2 \\frac{dh}{dt}`;
            const candidateDistractors = [
                `\\frac{dV}{dt} = \\pi r^2 h`,  // Missing derivative
                `\\frac{dV}{dt} = \\frac{1}{3}\\pi r^2 h`,  // No dh/dt
                `V = \\frac{1}{3}\\pi r^2 h`  // Original formula
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\frac{dV}{dt} = \\pi r h', '\\frac{dh}{dt} = \\frac{1}{3}\\pi r^2', 'V = \\pi r^2 h'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Water flows into cone:}\\\\[0.5em]V = \\frac{1}{3}\\pi r^2 h\\\\[0.5em]\\text{If } r \\text{ is constant, relate}\\\\[0.5em]\\frac{dV}{dt} \\text{ and } \\frac{dh}{dt}`),
                instruction: "Write the rate equation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `If r is constant, differentiate V = (1/3)πr²h with respect to t: dV/dt = (1/3)πr²·dh/dt. This relates the rate of volume change to the rate of height change.`,
                calc: false
            };
        }
    }
};
