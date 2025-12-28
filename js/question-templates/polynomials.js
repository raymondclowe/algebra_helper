// Polynomials Question Templates
// Level 11-12
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Polynomials = {
    getPolynomials: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 3);
                
                if (questionType === 1) {
                    // Polynomial addition
                    const a1 = utils.rInt(2, 5);
                    const b1 = utils.rInt(1, 8);
                    const a2 = utils.rInt(1, 4);
                    const b2 = utils.rInt(1, 7);
                    const sumA = a1 + a2;
                    const sumB = b1 + b2;
                    const correctAnswer = `${sumA}x + ${sumB}`;
                    const candidateDistractors = [`${a1}x + ${sumB}`, `${sumA}x + ${b1}`, `${a1 * a2}x + ${b1 * b2}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 15)}x + ${utils.rInt(1, 15)}`
                    );
                    
                    return {
                        tex: `(${a1}x + ${b1}) + (${a2}x + ${b2})`,
                        instruction: "Simplify",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Combine like terms: (${a1} + ${a2})x + (${b1} + ${b2}) = ${sumA}x + ${sumB}.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Factor theorem: if (x - a) is a factor, then f(a) = 0
                    const a = utils.rInt(1, 5);
                    const b = utils.rInt(1, 6);
                    const c = -a * b; // Make (x - a) a factor
                    const correctAnswer = `\\text{Yes}`;
                    const candidateDistractors = [`\\text{No}`, `\\text{Only if x > 0}`, `\\text{Cannot determine}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const options = [`\\text{Yes}`, `\\text{No}`, `\\text{Maybe}`, `\\text{Sometimes}`];
                            return options[utils.rInt(0, options.length - 1)];
                        }
                    );
                    
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = x^2 + ${b - a}x + ${c}`),
                        instruction: `\\text{Is } (x - ${a}) \\text{ a factor?}`,
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: utils.toUnicodeFunction(`By factor theorem, if (x - ${a}) is a factor, then f(${a}) = 0. Check: f(${a}) = ${a}² + ${b - a}(${a}) + ${c} = ${a * a} + ${a * (b - a)} + ${c} = 0. Yes, it's a factor.`),
                        calc: false
                    };
                } else {
                    // Remainder theorem
                    const a = utils.rInt(1, 4);
                    const b = utils.rInt(2, 8);
                    const c = utils.rInt(1, 10);
                    const remainder = a * a + b * a + c;
                    const correctAnswer = `${remainder}`;
                    const candidateDistractors = [`${remainder - a}`, `${c}`, `0`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 50)}`
                    );
                    
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = x^2 + ${b}x + ${c}`),
                        instruction: `\\text{Find remainder when divided by } (x - ${a})`,
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: utils.toUnicodeFunction(`By remainder theorem, the remainder when f(x) is divided by (x - ${a}) is f(${a}) = ${a}² + ${b}(${a}) + ${c} = ${remainder}.`),
                        calc: false
                    };
                }
    }
};
