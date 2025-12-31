// Basic Arithmetic Question Templates
// Level 0-1
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.BasicArithmetic = {
    getBasicArithmetic: function() {
        const utils = window.GeneratorUtils;
        
                const questionType = utils.getQuestionType(1, 4);
                
                if (questionType === 1) {
                    // Simple addition
                    const a = utils.rInt(1, 20);
                    const b = utils.rInt(1, 20);
                    const answer = a + b;
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${answer + 1}`, `${answer - 1}`, `${a - b}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 50)}`
                    );
                    return {
                        tex: `${a} + ${b}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Adding ${a} and ${b} gives ${answer}. You can verify by counting up from ${a} by ${b} steps.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Simple subtraction
                    const a = utils.rInt(11, 30);
                    const b = utils.rInt(1, a - 1);
                    const answer = a - b;
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${answer + 1}`, `${answer - 1}`, `${a + b}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 50)}`
                    );
                    return {
                        tex: `${a} - ${b}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Subtracting ${b} from ${a} gives ${answer}. You can verify by adding: ${answer} + ${b} = ${a}.`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Reverse addition: "? + b = c"
                    const b = utils.rInt(1, 15);
                    const c = utils.rInt(b + 1, 30);
                    const answer = c - b;
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${answer + 1}`, `${c}`, `${b}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 30)}`
                    );
                    return {
                        tex: `? + ${b} = ${c}`,
                        instruction: "Find the missing number",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `To find the missing number, subtract ${b} from ${c}: ${c} - ${b} = ${answer}. Check: ${answer} + ${b} = ${c} ✓`,
                        calc: false
                    };
                } else {
                    // Simple division as reverse multiplication
                    const a = utils.rInt(2, 9);
                    const x = utils.rInt(2, 9);
                    const product = a * x;
                    const correctAnswer = `${x}`;
                    const candidateDistractors = [`${x + 1}`, `${x - 1}`, `${a}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(2, 9)}`
                    );
                    return {
                        tex: `${product} \\div ${a}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${product} divided by ${a} equals ${x} because ${a} × ${x} = ${product}. Division is the inverse of multiplication.`,
                        calc: false
                    };
                }
    }
};
