// Exponentials and Logarithms Question Templates
// Level 12-13
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.ExponentialsLogs = {
    getExponentialsLogs: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 4);
                
                if (questionType === 1) {
                    // Basic exponential: 2^x = 8
                    const bases = [2, 3, 5];
                    const base = bases[utils.rInt(0, bases.length - 1)];
                    const exp = utils.rInt(2, 4);
                    const result = Math.pow(base, exp);
                    const correctAnswer = `x = ${exp}`;
                    // Avoid using Math.log() which produces non-integer values
                    const candidateDistractors = [`x = ${exp + 1}`, `x = ${result / base}`, `x = ${Math.floor(result / 2)}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `x = ${utils.rInt(1, 10)}`
                    );
                    
                    return {
                        tex: `${base}^x = ${result}`,
                        instruction: "Solve for x",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${base}^${exp} = ${result}, so x = ${exp}.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Basic logarithm: log₂(8) = ?
                    const base = [2, 10][utils.rInt(0, 1)];
                    const exp = utils.rInt(2, 3);
                    const arg = Math.pow(base, exp);
                    const logNotation = base === 10 ? '\\log' : `\\log_{${base}}`;
                    const correctAnswer = `${exp}`;
                    const candidateDistractors = [`${exp + 1}`, `${arg / base}`, `${arg}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 10)}`
                    );
                    
                    return {
                        tex: `${logNotation}(${arg})`,
                        instruction: "Evaluate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${logNotation}(${arg}) = ${exp} because ${base}^${exp} = ${arg}. Logarithm asks: "what power gives us ${arg}?"`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Log laws: log(a) + log(b) = log(ab)
                    const a = [2, 4, 5, 8][utils.rInt(0, 3)];
                    const b = [2, 3, 5][utils.rInt(0, 2)];
                    const product = a * b;
                    const correctAnswer = `\\log(${product})`;
                    // Use LaTeX format for all distractors for consistency
                    const candidateDistractors = [`\\log(${a + b})`, `\\log(${a * 10})`, `\\log(${a}) \\times \\log(${b})`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\log(${utils.rInt(10, 100)})`
                    );
                    
                    return {
                        tex: `\\log(${a}) + \\log(${b})`,
                        instruction: "Simplify using log laws",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Using the product rule: log(a) + log(b) = log(ab). So log(${a}) + log(${b}) = log(${product}).`,
                        calc: false
                    };
                } else {
                    // Exponential equation: e^x = e^3
                    const exp = utils.rInt(2, 6);
                    const correctAnswer = `x = ${exp}`;
                    const candidateDistractors = [`x = e^{${exp}}`, `x = ${exp}e`, `x = \\ln(${exp})`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `x = ${utils.rInt(1, 10)}`
                    );
                    
                    return {
                        tex: `e^x = e^{${exp}}`,
                        instruction: "Solve for x",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `If e^x = e^${exp}, then x = ${exp}. Equal bases mean equal exponents.`,
                        calc: false
                    };
                }
    }
};
