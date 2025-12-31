// Functions Question Templates
// Level 14-15
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Functions = {
    getFunctionProblems: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 3);
                
                if (questionType === 1) {
                    // Function evaluation: f(x) = ax + b, find f(n)
                    const a = utils.rInt(2, 8);
                    const b = utils.rInt(1, 10);
                    const x = utils.rInt(1, 8);
                    const answer = a * x + b;
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${a * x}`, `${answer + a}`, `${answer - b}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 100)}`
                    );
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = ${a}x + ${b} \\\\[0.5em] f(${x}) = ?`),
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: utils.toUnicodeFunction(`Substitute x = ${x} into the function: f(${x}) = ${a}(${x}) + ${b} = ${a * x} + ${b} = ${answer}.`),
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Composite function: f(x) = 2x, g(x) = x + 3, find f(g(2))
                    const x = utils.rInt(1, 5);
                    const gResult = x + 3;
                    const fResult = 2 * gResult;
                    const correctAnswer = `${fResult}`;
                    const candidateDistractors = [`${fResult + 2}`, `${gResult}`, `${x * 2 + 3}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(5, 30)}`
                    );
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = 2x \\\\[0.5em] g(x) = x + 3 \\\\[0.5em] f(g(${x})) = ?`),
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: utils.toUnicodeFunction(`Evaluate g(${x}) first: g(${x}) = ${x} + 3 = ${gResult}. Then evaluate f(${gResult}): f(${gResult}) = 2(${gResult}) = ${fResult}.`),
                        calc: false
                    };
                } else {
                    // Inverse: if f(x) = 3x - 2 and f(a) = 10, find a
                    const m = utils.rInt(2, 5);
                    const c = utils.rInt(1, 8);
                    const result = utils.rInt(10, 30);
                    const x = (result + c) / m;
                    // Ensure integer result
                    if (x !== Math.floor(x)) {
                        // Recalculate with values that work
                        const xInt = utils.rInt(3, 8);
                        const resultInt = m * xInt - c;
                        const correctAnswer = `${xInt}`;
                        const candidateDistractors = [`${xInt + 1}`, `${xInt - 1}`, `${resultInt}`];
                        const distractors = utils.ensureUniqueDistractors(
                            correctAnswer,
                            candidateDistractors,
                            () => `${utils.rInt(1, 20)}`
                        );
                        return {
                            tex: utils.toUnicodeFunction(`f(x) = ${m}x - ${c} \\\\[0.5em] f(a) = ${resultInt} \\\\[0.5em] a = ?`),
                            instruction: "Find the input value",
                            displayAnswer: correctAnswer,
                            distractors: distractors,
                            explanation: `Given ${m}a - ${c} = ${resultInt}. Add ${c} to both sides: ${m}a = ${resultInt + c}. Divide by ${m}: a = ${xInt}.`,
                            calc: false
                        };
                    }
                    const correctAnswer = `${x}`;
                    const candidateDistractors = [`${x + 1}`, `${x - 1}`, `${result}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 20)}`
                    );
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = ${m}x - ${c} \\\\[0.5em] f(a) = ${result} \\\\[0.5em] a = ?`),
                        instruction: "Find the input value",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Given ${m}a - ${c} = ${result}. Add ${c} to both sides: ${m}a = ${result + c}. Divide by ${m}: a = ${x}.`,
                        calc: false
                    };
                }
    }
};
