// Squares, Cubes, and Roots Question Templates
// Level 1-2
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.SquaresRoots = {
    getSquaresAndRoots: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 8);
                
                if (questionType === 1) {
                    // Forward: "What is the square of n?" - range 1-15 for no calculator
                    const n = utils.rInt(1, 15);
                    const answer = n * n;
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${n * 2}`, `${answer + n}`, `${answer - n}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            // Generate fallback distractors in reasonable range: ±50% of answer, min 1
                            const minRange = Math.max(1, Math.floor(answer * 0.5));
                            const maxRange = Math.ceil(answer * 1.5);
                            return `${utils.rInt(minRange, maxRange)}`;
                        }
                    );
                    return {
                        tex: `\\text{What is } ${n}^2?`,
                        instruction: "Calculate the square",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${n}^2 = ${n} × ${n} = ${answer}. Squaring means multiplying a number by itself.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Reverse: "n² = answer, find n" - range 1-15 for no calculator
                    const n = utils.rInt(1, 15);
                    const square = n * n;
                    const correctAnswer = `${n}`;
                    const candidateDistractors = [`${n + 1}`, `${n - 1}`, `${Math.floor(square / 2)}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 15)}`
                    );
                    return {
                        tex: `${square} \\text{ is the square of what number?}`,
                        instruction: "Find the number",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Since ${n} × ${n} = ${square}, the answer is ${n}. This is finding the square root: $\\sqrt{${square}} = ${n}$.`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Forward: "What is the cube of n?" - range 1-10 for no calculator
                    const n = utils.rInt(1, 10);
                    const answer = n * n * n;
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${n * 3}`, `${n * n}`, `${answer + n}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            // Generate fallback distractors in reasonable range: ±50% of answer, min 1
                            const minRange = Math.max(1, Math.floor(answer * 0.5));
                            const maxRange = Math.ceil(answer * 1.5);
                            return `${utils.rInt(minRange, maxRange)}`;
                        }
                    );
                    return {
                        tex: `\\text{What is } ${n}^3?`,
                        instruction: "Calculate the cube",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${n}^3 = ${n} × ${n} × ${n} = ${answer}. Cubing means multiplying a number by itself three times.`,
                        calc: false
                    };
                } else if (questionType === 4) {
                    // Reverse: "n³ = answer, find n" - range 1-10 for no calculator
                    const n = utils.rInt(1, 10);
                    const cube = n * n * n;
                    const correctAnswer = `${n}`;
                    const candidateDistractors = [`${n + 1}`, `${n - 1}`, `${Math.floor(cube / 3)}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 10)}`
                    );
                    return {
                        tex: `${cube} \\text{ is the cube of what number?}`,
                        instruction: "Find the number",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Since ${n} × ${n} × ${n} = ${cube}, the answer is ${n}. This is finding the cube root: $\\sqrt[3]{${cube}} = ${n}$.`,
                        calc: false
                    };
                } else if (questionType === 5) {
                    // Square root - range 1-15 for no calculator
                    const n = utils.rInt(1, 15);
                    const square = n * n;
                    const correctAnswer = `${n}`;
                    const candidateDistractors = [`${n + 1}`, `${n - 1}`, `${Math.floor(square / 2)}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 15)}`
                    );
                    return {
                        tex: `\\sqrt{${square}}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The square root of ${square} is ${n} because ${n} × ${n} = ${square}.`,
                        calc: false
                    };
                } else if (questionType === 6) {
                    // Cube root - range 1-10 for no calculator
                    const n = utils.rInt(1, 10);
                    const cube = n * n * n;
                    const correctAnswer = `${n}`;
                    const candidateDistractors = [`${n + 1}`, `${n - 1}`, `${Math.floor(cube / 3)}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 10)}`
                    );
                    return {
                        tex: `\\sqrt[3]{${cube}}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The cube root of ${cube} is ${n} because ${n} × ${n} × ${n} = ${cube}.`,
                        calc: false
                    };
                } else if (questionType === 7) {
                    // Power notation with small exponents
                    const base = utils.rInt(2, 8);
                    const exp = utils.rInt(2, 4);
                    const answer = Math.pow(base, exp);
                    // Build the multiplication chain properly
                    const multChain = Array(exp).fill(base).join(' × ');
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${base * exp}`, `${answer + base}`, `${answer - base}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            // Generate fallback distractors in reasonable range: ±50% of answer, min 1
                            const minRange = Math.max(1, Math.floor(answer * 0.5));
                            const maxRange = Math.ceil(answer * 1.5);
                            return `${utils.rInt(minRange, maxRange)}`;
                        }
                    );
                    return {
                        tex: `${base}^${exp}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${base}^${exp} means multiply ${base} by itself ${exp} times: ${multChain} = ${answer}.`,
                        calc: false
                    };
                } else {
                    // Inverse square root: √(n²) = n
                    const n = utils.rInt(1, 15);
                    const correctAnswer = `${n}`;
                    const candidateDistractors = [`${n + 1}`, `${n - 1}`, `${n * 2}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 15)}`
                    );
                    return {
                        tex: `\\sqrt{${n}^2}`,
                        instruction: "Simplify",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `$\\sqrt{${n}^2} = ${n}$ because the square root and square operations are inverses of each other.`,
                        calc: false
                    };
                }
    }
};
