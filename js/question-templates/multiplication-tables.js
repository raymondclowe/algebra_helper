// Multiplication Tables Question Templates
// Level 2-3
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.MultiplicationTables = {
    getMultiplicationTables: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 5);
                
                if (questionType === 1) {
                    // Standard multiplication (easier numbers)
                    const a = utils.rInt(2, 10);
                    const b = utils.rInt(2, 10);
                    const answer = a * b;
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${answer + a}`, `${answer - b}`, `${a + b}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(4, 100)}`
                    );
                    return {
                        tex: `${a} \\times ${b}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${a} × ${b} = ${answer}. You can think of this as ${a} groups of ${b}, or ${b} groups of ${a}.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Harder multiplication (larger numbers)
                    const a = utils.rInt(11, 15);
                    const b = utils.rInt(6, 12);
                    const answer = a * b;
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${answer + 10}`, `${answer - 10}`, `${a + b}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(50, 200)}`
                    );
                    return {
                        tex: `${a} \\times ${b}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${a} × ${b} = ${answer}. Break it down: (10 × ${b}) + (${a - 10} × ${b}) = ${10 * b} + ${(a - 10) * b} = ${answer}.`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Reverse: "a × ? = product"
                    const a = utils.rInt(3, 9);
                    const b = utils.rInt(3, 9);
                    const product = a * b;
                    const correctAnswer = `${b}`;
                    const candidateDistractors = [`${b + 1}`, `${b - 1}`, `${a}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(2, 12)}`
                    );
                    return {
                        tex: `${a} \\times ? = ${product}`,
                        instruction: "Find the missing number",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `To find the missing number, divide ${product} by ${a}: ${product} ÷ ${a} = ${b}. Check: ${a} × ${b} = ${product} ✓`,
                        calc: false
                    };
                } else if (questionType === 4) {
                    // Powers of 10 (easier)
                    const n = utils.rInt(1, 99);
                    const multiplier = [10, 100, 1000][utils.rInt(0, 2)];
                    const answer = n * multiplier;
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${answer + multiplier}`, `${n + multiplier}`, `${Math.floor(answer / 10)}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(10, 10000)}`
                    );
                    return {
                        tex: `${n} \\times ${multiplier}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Multiplying by ${multiplier} is like adding ${Math.log10(multiplier)} zeros: ${n} × ${multiplier} = ${answer}.`,
                        calc: false
                    };
                } else {
                    // Division (as inverse of multiplication)
                    const b = utils.rInt(3, 12);
                    const a = utils.rInt(2, 12);
                    const dividend = a * b;
                    const correctAnswer = `${b}`;
                    const candidateDistractors = [`${b + 1}`, `${b - 1}`, `${a}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(2, 12)}`
                    );
                    return {
                        tex: `${dividend} \\div ${a}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${dividend} ÷ ${a} = ${b} because ${a} × ${b} = ${dividend}. Division undoes multiplication.`,
                        calc: false
                    };
                }
    }
};
