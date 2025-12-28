// Complex Numbers Question Templates
// Level 18-19
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.ComplexNumbers = {
    getComplexNumbers: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 4);
                
                if (questionType === 1) {
                    // Adding complex numbers
                    const a1 = utils.rInt(1, 8);
                    const b1 = utils.rInt(1, 8);
                    const a2 = utils.rInt(1, 8);
                    const b2 = utils.rInt(1, 8);
                    const sumReal = a1 + a2;
                    const sumImag = b1 + b2;
                    
                    return {
                        tex: `(${a1} + ${b1}i) + (${a2} + ${b2}i)`,
                        instruction: "Add the complex numbers",
                        displayAnswer: `${sumReal} + ${sumImag}i`,
                        distractors: [
                            `${a1 + a2}i`,
                            `${sumReal} + ${b1}i`,
                            `${a1} + ${sumImag}i`
                        ],
                        explanation: `Add real parts and imaginary parts separately: (${a1} + ${a2}) + (${b1} + ${b2})i = ${sumReal} + ${sumImag}i.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Multiplying complex numbers (simple)
                    const a = utils.rInt(2, 5);
                    const b = utils.rInt(2, 5);
                    // (a + bi)(a - bi) = a² + b² (conjugates)
                    const result = a * a + b * b;
                    
                    return {
                        tex: `(${a} + ${b}i)(${a} - ${b}i)`,
                        instruction: "Multiply (use i² = -1)",
                        displayAnswer: `${result}`,
                        distractors: [
                            `${a * a} - ${b * b}`,
                            `${a * a}i`,
                            `${2 * a * b}i`
                        ],
                        explanation: `Using (a+bi)(a-bi) = a² - (bi)² = a² - b²i² = a² - b²(-1) = a² + b². So ${a}² + ${b}² = ${result}.`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Modulus of complex number
                    const a = utils.rInt(3, 5);
                    const b = utils.rInt(3, 5);
                    const modSquared = a * a + b * b;
                    const mod = Math.sqrt(modSquared);
                    const isExact = mod === Math.floor(mod);
                    
                    return {
                        tex: `|${a} + ${b}i|`,
                        instruction: "Find the modulus",
                        displayAnswer: isExact ? `${mod}` : `\\sqrt{${modSquared}}`,
                        distractors: [
                            `${a + b}`,
                            `${Math.max(a, b)}`,
                            `${a * b}`
                        ],
                        explanation: `Modulus = $\\sqrt{a^2 + b^2} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${modSquared}}${isExact ? ' = ' + mod : ''}$.`,
                        calc: false
                    };
                } else {
                    // Powers of i
                    const powers = [
                        { exp: 2, result: '-1' },
                        { exp: 3, result: '-i' },
                        { exp: 4, result: '1' }
                    ];
                    const p = powers[utils.rInt(0, powers.length - 1)];
                    const correctAnswer = `${p.result}`;
                    const candidateDistractors = [`i`, `${p.exp}i`, `${p.exp}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const options = ['1', '-1', 'i', '-i', '0'];
                            return options[utils.rInt(0, options.length - 1)];
                        }
                    );
                    
                    return {
                        tex: `i^{${p.exp}}`,
                        instruction: "Simplify",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `i¹ = i, i² = -1, i³ = -i, i⁴ = 1, and the pattern repeats. So i^${p.exp} = ${p.result}.`,
                        calc: false
                    };
                }
    }
};
