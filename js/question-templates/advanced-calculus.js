// Advanced Calculus Question Templates
// Level 20-21
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.AdvancedCalculus = {
    getAdvancedCalculus: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 4);
                
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
                        explanation: `Chain rule: d/dx[(ax+b)^n] = n(ax+b)^(n-1) × a. So derivative = ${n}(${a}x + ${b})^${n - 1} × ${a} = ${n * a}(${a}x + ${b})^${n - 1}.`,
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
                        explanation: utils.toUnicodeFunction(`Product rule: (uv)' = u'v + uv'. Here u = x, v = ${a}x^${b}. So (x)(${a * b}x^${b - 1}) + (1)(${a}x^${b}) = ${(b + 1) * a}x^${b}.`),
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
                        explanation: utils.toUnicodeFunction(`First derivative: f'(x) = ${firstDeriv}x^${n - 1}. Second derivative: f''(x) = ${firstDeriv}(${n - 1})x^${n - 2} = ${secondDeriv}x^${n - 2}.`),
                        calc: false
                    };
                } else {
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
                        explanation: utils.toUnicodeFunction(`First find the derivative: f'(x) = ${a}x ${b >= 0 ? '+' : ''}${b}. Set f'(x) = 0: ${a}x ${b >= 0 ? '+' : ''}${b} = 0. Solve: ${a}x = ${-b}, so x = ${root}. This is a critical point where the function has a potential maximum or minimum.`),
                        calc: false
                    };
                }
    }
};
