// Inequalities Question Templates
// Level 7-8
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Inequalities = {
    getInequalities: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 3);
                
                if (questionType === 1) {
                    // Simple inequality: ax < b
                    // Ensure b is divisible by a for integer result
                    const a = utils.rInt(2, 9);
                    const x = utils.rInt(2, 9);  // Pick answer first
                    const b = a * x;  // Ensure b is divisible by a
                    const correctAnswer = `x < ${x}`;
                    const candidateDistractors = [`x > ${x}`, `x = ${x}`, `x \\leq ${x}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randX = utils.rInt(1, 20);
                            const ops = ['<', '>', '\\leq', '\\geq'];
                            return `x ${ops[utils.rInt(0, ops.length - 1)]} ${randX}`;
                        }
                    );
                    
                    return {
                        tex: `${a}x < ${b}`,
                        instruction: "Solve for x",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Divide both sides by ${a}: x < ${b}/${a} = ${x}. Note that the inequality sign remains unchanged when dividing by a positive number.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Inequality with negative coefficient: -ax > b
                    // Ensure b is divisible by a for integer result
                    const a = utils.rInt(2, 6);
                    const x = utils.rInt(2, 6);  // Pick answer first
                    const b = -a * x;  // b = -ax so -ax > b gives x < correct answer
                    const correctAnswer = `x < ${x}`;
                    const candidateDistractors = [`x > ${x}`, `x = ${x}`, `x < ${-x}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randX = utils.rInt(-10, 10);
                            const ops = ['<', '>', '\\leq', '\\geq'];
                            return `x ${ops[utils.rInt(0, ops.length - 1)]} ${randX}`;
                        }
                    );
                    
                    return {
                        tex: `-${a}x > ${b}`,
                        instruction: "Solve for x",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Divide both sides by -${a} and reverse the inequality sign: x < ${b}/(-${a}) = ${x}. Note that dividing by a negative number reverses the inequality sign.`,
                        calc: false
                    };
                } else {
                    // Two-step inequality: ax + b < c
                    // Ensure (c - b) is divisible by a for integer result
                    const a = utils.rInt(2, 8);
                    const b = utils.rInt(1, 10);
                    const x = utils.rInt(2, 8);  // Pick answer first
                    const c = a * x + b;  // c - b = ax, so x < correct answer
                    const correctAnswer = `x < ${x}`;
                    const candidateDistractors = [`x > ${x}`, `x < ${x + 1}`, `x \\leq ${x}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randX = utils.rInt(1, 20);
                            const ops = ['<', '>', '\\leq', '\\geq'];
                            return `x ${ops[utils.rInt(0, ops.length - 1)]} ${randX}`;
                        }
                    );
                    
                    return {
                        tex: `${a}x + ${b} < ${c}`,
                        instruction: "Solve for x",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Subtract ${b} from both sides: ${a}x < ${c - b}. Divide by ${a}: x < ${x}.`,
                        calc: false
                    };
                }
    }
};
