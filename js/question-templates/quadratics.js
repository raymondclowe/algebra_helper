// Quadratics Question Templates
// Level 10-11
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Quadratics = {
    getInverseQuadraticQuestion: function() {
        const utils = window.GeneratorUtils;
        const a = utils.rInt(2, 9); // Coefficient for x^2
                
                // Multiple correct LaTeX presentations of the inverse
                const correctFormats = [
                    `y = \\sqrt{\\dfrac{x}{${a}}}`,
                    `y = \\left(\\dfrac{x}{${a}}\\right)^{1/2}`,
                    `y = \\dfrac{\\sqrt{x}}{\\sqrt{${a}}}`,
                    `y = \\dfrac{1}{\\sqrt{${a}}}\\sqrt{x}`
                ];
                
                // Randomly pick one correct format
                const correctAnswer = correctFormats[utils.rInt(0, correctFormats.length - 1)];
                
                // Generate incorrect distractors that are truly wrong
                const distractors = [
                    `y = \\sqrt{${a}x}`,  // Wrong: multiplied instead of divided
                    `y = \\dfrac{x}{${a}}`,  // Wrong: forgot square root
                    `y = \\sqrt{x - ${a}}`,  // Wrong: subtraction instead of division
                    `y = ${a}\\sqrt{x}`,  // Wrong: coefficient outside and multiplied
                    `y = \\left(\\dfrac{${a}}{x}\\right)^{1/2}`,  // Wrong: inverted fraction
                    `y = \\dfrac{x^2}{${a}}`  // Wrong: squared instead of square root
                ];
                
                // Shuffle and pick 3 unique wrong answers that aren't equivalent to the correct answer
                const wrongAnswers = [];
                const shuffledDistractors = utils.shuffleArray(distractors);
                
                for (let distractor of shuffledDistractors) {
                    if (wrongAnswers.length >= 3) break;
                    // Verify this distractor is not equivalent to the correct answer
                    if (!utils.areEquivalent(correctAnswer, distractor)) {
                        wrongAnswers.push(distractor);
                    }
                }
                
                // Ensure we have exactly 3 distractors (fallback if equivalence check filtered too many)
                while (wrongAnswers.length < 3) {
                    wrongAnswers.push(`y = \\sqrt{${utils.rInt(1, this.FALLBACK_DISTRACTOR_MAX_COEFFICIENT)}x}`);
                }
                
                return {
                    tex: utils.toUnicodeFunction(`f(x) = ${a}x^2`),
                    instruction: utils.toUnicodePlainText("Find f^{-1}(x) for x ≥ 0"),
                    displayAnswer: correctAnswer,
                    distractors: wrongAnswers,
                    explanation: utils.toUnicodeFunction(`To find the inverse function, we swap x and y, then solve for y. Start with y = ${a}x^2, swap to get x = ${a}y^2, then divide both sides by ${a} to get y^2 = x/${a}. Finally, take the square root of both sides: y = $\\sqrt{x/${a}}$. We take the positive root because x ≥ 0. The inverse "undoes" what the original function does.`),
                    calc: false
                };
    },
    getQuadratics: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 3);
                
                if (questionType === 1) {
                    // Solving using quadratic formula (simple cases)
                    const p = utils.rInt(2, 5);
                    const q = utils.rInt(1, 4);
                    // (x - p)(x - q) = 0 expands to x² - (p+q)x + pq = 0
                    const b = -(p + q);
                    const c = p * q;
                    
                    const correctAnswer = `x = ${Math.min(p, q)}`;
                    const candidateDistractors = [`x = ${Math.max(p, q)}`, `x = ${-p}`, `x = ${p + q}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `x = ${utils.rInt(-10, 10)}`
                    );
                    
                    return {
                        tex: `x^2 ${b >= 0 ? '+' : ''}${b}x + ${c} = 0`,
                        instruction: "Solve for x (give smaller solution)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `This factors as (x - ${p})(x - ${q}) = 0. Solutions are x = ${p} and x = ${q}. The smaller solution is ${Math.min(p, q)}.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Completing the square: x² + 2bx
                    const b = utils.rInt(2, 8);
                    const square = b * b;
                    
                    const correctAnswer = `${square}`;
                    const candidateDistractors = [`${b}`, `${2 * b}`, `${square / 2}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 100)}`
                    );
                    
                    return {
                        tex: `x^2 + ${2 * b}x + \\underline{\\quad}`,
                        instruction: "What value completes the perfect square?",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `To complete the square for x² + ${2 * b}x, take half the coefficient of x: (${2 * b})/2 = ${b}, then square it: ${b}² = ${square}. This gives (x + ${b})².`,
                        calc: false
                    };
                } else {
                    // Discriminant and nature of roots
                    const discriminants = [
                        { b: 4, c: 4, disc: 0, nature: 'one repeated root' },
                        { b: 5, c: 6, disc: 1, nature: 'two distinct real roots' },
                        { b: 2, c: 5, disc: -16, nature: 'no real roots' }
                    ];
                    const q = discriminants[utils.rInt(0, discriminants.length - 1)];
                    const disc = q.b * q.b - 4 * q.c;
                    const correctAnswer = `${disc}`;
                    const candidateDistractors = [`${q.b * q.b}`, `${4 * q.c}`, `${q.b - 4 * q.c}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(-20, 50)}`
                    );
                    
                    return {
                        tex: `x^2 + ${q.b}x + ${q.c} = 0`,
                        instruction: "What is the discriminant b² - 4ac?",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Discriminant = b² - 4ac = ${q.b}² - 4(1)(${q.c}) = ${q.b * q.b} - ${4 * q.c} = ${disc}. This means ${q.nature}.`,
                        calc: false
                    };
                }
    }
};
