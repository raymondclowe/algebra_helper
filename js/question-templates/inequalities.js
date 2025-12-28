// Inequalities Question Templates
// Level 7-8
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Inequalities = {
    getInequalities: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 3);
                
                if (questionType === 1) {
                    // Simple inequality: ax < b
                    const a = utils.rInt(2, 9);
                    const b = utils.rInt(10, 50);
                    const x = Math.floor(b / a);
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
                        explanation: `Divide both sides by ${a}: x < ${b}/${a} = ${x}. The inequality sign stays the same when dividing by a positive number.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Inequality with negative coefficient: -ax > b
                    const a = utils.rInt(2, 6);
                    const b = utils.rInt(-20, -5);
                    const x = Math.ceil(b / (-a));
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
                        explanation: `Divide both sides by -${a}: x < ${b}/(-${a}) = ${x}. IMPORTANT: Flip the inequality sign when dividing by a negative number.`,
                        calc: false
                    };
                } else {
                    // Two-step inequality: ax + b < c
                    const a = utils.rInt(2, 8);
                    const b = utils.rInt(1, 10);
                    const c = utils.rInt(b + 10, 50);
                    const x = Math.floor((c - b) / a);
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
                        explanation: `Subtract ${b}: ${a}x < ${c - b}. Divide by ${a}: x < ${x}. Solve inequalities like equations, but remember to flip the sign when multiplying/dividing by negatives.`,
                        calc: false
                    };
                }
    }
};
