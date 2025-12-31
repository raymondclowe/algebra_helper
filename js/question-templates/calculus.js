// Calculus - Integration Question Templates
// Level 24+
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Calculus = {
    getCalculus: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 4);
                
                if (questionType === 1) {
                    // Basic integration: ∫x^n dx
                    const n = utils.rInt(2, 5);
                    const newExp = n + 1;
                    const correctAnswer = `\\frac{x^{${newExp}}}{${newExp}} + C`;
                    const candidateDistractors = [
                        `\\frac{x^{${n}}}{${n}} + C`,
                        `${n}x^{${n - 1}} + C`,
                        `x^{${newExp}} + C`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randExp = utils.rInt(2, 7);
                            return `\\frac{x^{${randExp}}}{${randExp}} + C`;
                        }
                    );
                    return {
                        tex: `\\int x^${n} \\, dx`,
                        instruction: "Integrate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Using the power rule for integration: ∫x^n dx = x^(n+1)/(n+1) + C. So ∫x^${n} dx = x^${newExp}/${newExp} + C. Don't forget the constant of integration!`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Integration with coefficient: ∫ax^n dx
                    const a = utils.rInt(2, 8);
                    const n = utils.rInt(2, 4);
                    const newExp = n + 1;
                    const correctAnswer = `\\frac{${a}x^{${newExp}}}{${newExp}} + C`;
                    const candidateDistractors = [
                        `${a}x^{${newExp}} + C`,
                        `\\frac{x^{${newExp}}}{${newExp}} + C`,
                        `${a * n}x^{${n - 1}} + C`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randA = utils.rInt(2, 9);
                            const randExp = utils.rInt(2, 6);
                            return `\\frac{${randA}x^{${randExp}}}{${randExp}} + C`;
                        }
                    );
                    return {
                        tex: `\\int ${a}x^${n} \\, dx`,
                        instruction: "Integrate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Integrate using the power rule, keeping the coefficient: ∫${a}x^${n} dx = ${a} × x^${newExp}/${newExp} + C = ${a}x^${newExp}/${newExp} + C.`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Simple infinite series: sum of geometric series
                    // Define series ratios with their corresponding values and display formats
                    const seriesOptions = [
                        { r: 0.5, display: '0.5', answer: 2, answerDisplay: '2' },
                        { r: 0.25, display: '0.25', answer: 4, answerDisplay: '4' },
                        { r: 0.1, display: '0.1', answer: 1.111, answerDisplay: '1.11' }
                    ];
                    
                    const series = seriesOptions[utils.rInt(0, seriesOptions.length - 1)];
                    const correctAnswer = `${series.answerDisplay}`;
                    const candidateDistractors = [
                        `\\text{diverges}`,
                        `${series.display}`,
                        `\\infty`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${(Math.random() * 9 + 1).toFixed(2)}`
                    );
                    
                    return {
                        tex: `\\sum_{n=0}^{\\infty} (${series.display})^n`,
                        instruction: "Find the sum (if |r| < 1)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `This is a geometric series with first term a=1 and ratio r=${series.display}. Since |r| < 1, it converges to S = a/(1-r) = 1/(1-${series.display}) = ${series.answerDisplay}.`,
                        calc: false
                    };
                } else {
                    // Partial fractions - simple case with distinct linear factors
                    // Form: (Ax + B) / ((x - a)(x - b)) = A/(x - a) + B/(x - b)
                    const a = utils.rInt(1, 4);
                    const b = utils.rInt(5, 8);
                    const A = utils.rInt(1, 5);
                    const B = utils.rInt(1, 5);
                    
                    // Construct numerator: A(x - b) + B(x - a) = (A + B)x - Ab - Ba
                    const numCoeff = A + B;
                    const numConst = -A * b - B * a;
                    
                    const correctAnswer = `\\frac{${A}}{x - ${a}} + \\frac{${B}}{x - ${b}}`;
                    const candidateDistractors = [
                        `\\frac{${A}}{x - ${b}} + \\frac{${B}}{x - ${a}}`,
                        `\\frac{${A + B}}{x - ${a}} + \\frac{1}{x - ${b}}`,
                        `\\frac{${A}}{(x - ${a})(x - ${b})}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randA = utils.rInt(1, 6);
                            const randB = utils.rInt(1, 6);
                            return `\\frac{${randA}}{x - ${a}} + \\frac{${randB}}{x - ${b}}`;
                        }
                    );
                    
                    const numConstTerm = numConst >= 0 ? ` + ${numConst}` : ` - ${Math.abs(numConst)}`;
                    
                    return {
                        tex: `\\frac{${numCoeff}x${numConstTerm}}{(x - ${a})(x - ${b})}`,
                        instruction: "Express as partial fractions",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `To decompose into partial fractions, write as A/(x - ${a}) + B/(x - ${b}). Solve: ${numCoeff}x${numConstTerm} = A(x - ${b}) + B(x - ${a}). Setting x = ${a}: A = ${A}. Setting x = ${b}: B = ${B}.`,
                        calc: false
                    };
                }
    }
};
