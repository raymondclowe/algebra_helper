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
                    explanation: utils.toUnicodeFunction(`To find the inverse function: replace f(x) with y to get y = ${a}x^2, interchange x and y to get x = ${a}y^2, then solve for y. Divide both sides by ${a}: y^2 = x/${a}. Take the square root: y = √(x/${a}). The positive root is taken since x ≥ 0.`),
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
                        instruction: "Write down the smaller value of x",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `This expression factorizes as (x - ${p})(x - ${q}) = 0. Therefore x = ${p} or x = ${q}. The smaller value is ${Math.min(p, q)}.`,
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
                        instruction: "Find the value that completes the square",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `To complete the square for x² + ${2 * b}x: take half the coefficient of x, which is (${2 * b})/2 = ${b}, then square it: ${b}² = ${square}. Therefore x² + ${2 * b}x + ${square} = (x + ${b})².`,
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
                        instruction: "Calculate the value of the discriminant",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `For the quadratic equation ax² + bx + c = 0, the discriminant Δ = b² - 4ac. Here: Δ = ${q.b}² - 4(1)(${q.c}) = ${q.b * q.b} - ${4 * q.c} = ${disc}. Since Δ ${disc === 0 ? '= 0' : disc > 0 ? '> 0' : '< 0'}, the equation has ${q.nature}.`,
                        calc: false
                    };
                }
    }
};
