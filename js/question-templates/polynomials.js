// Polynomials Question Templates
// Level 11-12
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Polynomials = {
    getPolynomials: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 4);
                
                if (questionType === 1) {
                    // Polynomial addition - avoid coefficient of 1 showing as "1x"
                    const a1 = utils.rInt(2, 5);
                    const b1 = utils.rInt(1, 8);
                    const a2 = utils.rInt(2, 4);  // Changed min from 1 to 2 to avoid 1x
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
                    const middleCoeff = b - a;
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
                    
                    // Format: x^2 + bx + c with proper sign handling
                    const middleTerm = middleCoeff === 0 ? '' : (middleCoeff === 1 ? ' + x' : (middleCoeff === -1 ? ' - x' : utils.formatConstant(middleCoeff) + 'x'));
                    const constTerm = utils.formatConstant(c);
                    
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = x^2 + ${b - a}x + ${c}`),
                        instruction: `\\text{Determine whether } (x - ${a}) \\text{ is a factor}`,
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: utils.toUnicodeFunction(`By the factor theorem, (x - ${a}) is a factor of f(x) if and only if f(${a}) = 0. Calculate f(${a}) = ${a}² + ${b - a}(${a}) + ${c} = ${a * a} + ${a * (b - a)} + ${c} = 0. Therefore (x - ${a}) is a factor.`),
                        calc: false
                    };
                } else if (questionType === 3) {
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
                        instruction: `\\text{Find the remainder when } f(x) \\text{ is divided by } (x - ${a})`,
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: utils.toUnicodeFunction(`By the remainder theorem, when f(x) is divided by (x - ${a}), the remainder is f(${a}). Calculate f(${a}) = ${a}² + ${b}(${a}) + ${c} = ${remainder}.`),
                        calc: false
                    };
                } else {
                    // Polynomial long division - quotient
                    // Divide (x^2 + bx + c) by (x - a) to get quotient (x + q) with remainder r
                    const a = utils.rInt(1, 5);
                    const q = utils.rInt(2, 8);
                    const r = utils.rInt(0, 6);
                    // Work backwards: (x - a)(x + q) + r = x^2 + (q - a)x - aq + r
                    const b = q - a;
                    const c = -a * q + r;
                    
                    const correctAnswer = `x + ${q}`;
                    const candidateDistractors = [
                        `x + ${q + a}`,
                        `x + ${q - a}`,
                        `x - ${a}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `x + ${utils.rInt(-10, 10)}`
                    );
                    
                    // Format polynomial with proper signs
                    const bTerm = b === 0 ? '' : (b === 1 ? ' + x' : (b === -1 ? ' - x' : utils.formatConstant(b) + 'x'));
                    const cTerm = utils.formatConstant(c);
                    
                    return {
                        tex: `\\frac{x^2${bTerm}${cTerm}}{x - ${a}}`,
                        instruction: `\\text{Find the quotient (ignore remainder)}`,
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: utils.toUnicodeFunction(`Divide x² ${bTerm}${cTerm} by (x - ${a}) using polynomial long division. The quotient is x + ${q}${r !== 0 ? ` with remainder ${r}` : ''}.`),
                        calc: false
                    };
                }
    }
};
