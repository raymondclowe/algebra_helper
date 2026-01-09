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
    },
    
    getModulusEquation: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 6);
        
        if (questionType === 1) {
            // Basic: |x| = a
            const a = utils.rInt(3, 10);
            
            const correctAnswer = `x = \\pm ${a}`;
            const candidateDistractors = [
                `x = ${a}`,  // Forgot negative solution
                `x = -${a}`,  // Forgot positive solution
                `x = ${a} \\text{ or } x = 0`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `x = \\pm ${utils.rInt(1, 15)}`
            );
            
            return {
                tex: `|x| = ${a}`,
                instruction: "Solve for x",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `|x| = ${a} means x = ${a} or x = -${a}. The absolute value gives distance from zero, so both positive and negative solutions exist. Answer: x = ±${a}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Inequality: |x| < a
            const a = utils.rInt(3, 8);
            
            const correctAnswer = `-${a} < x < ${a}`;
            const candidateDistractors = [
                `x < ${a}`,  // Forgot lower bound
                `x < -${a} \\text{ or } x > ${a}`,  // Wrong inequality type
                `-${a} \\leq x \\leq ${a}`  // Wrong inequality signs
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const b = utils.rInt(2, 10);
                    return `-${b} < x < ${b}`;
                }
            );
            
            return {
                tex: `|x| < ${a}`,
                instruction: "Solve the inequality",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `|x| < ${a} means the distance from zero is less than ${a}. This gives -${a} < x < ${a}. All values between -${a} and ${a} satisfy the inequality.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Inequality: |x| ≥ a
            const a = utils.rInt(3, 8);
            
            const correctAnswer = `x \\leq -${a} \\text{ or } x \\geq ${a}`;
            const candidateDistractors = [
                `-${a} \\leq x \\leq ${a}`,  // Wrong (this is |x| ≤ a)
                `x \\geq ${a}`,  // Forgot negative part
                `x < -${a} \\text{ or } x > ${a}`  // Wrong inequality signs
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const b = utils.rInt(2, 10);
                    return `x \\leq -${b} \\text{ or } x \\geq ${b}`;
                }
            );
            
            return {
                tex: `|x| \\geq ${a}`,
                instruction: "Solve the inequality",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `|x| ≥ ${a} means the distance from zero is at least ${a}. This gives x ≤ -${a} or x ≥ ${a}. Values must be outside the interval (-${a}, ${a}).`,
                calc: false
            };
        } else if (questionType === 4) {
            // Shifted: |x - h| = a
            const h = utils.rInt(1, 6);
            const a = utils.rInt(2, 6);
            const sol1 = h + a;
            const sol2 = h - a;
            
            const correctAnswer = `x = ${sol1} \\text{ or } x = ${sol2}`;
            const candidateDistractors = [
                `x = ${h} \\pm ${a}`,  // Alternative notation but equivalent
                `x = ${sol1}`,  // Forgot second solution
                `x = ${sol2}`  // Forgot first solution
            ].filter(d => d !== correctAnswer);
            
            // Add alternative correct format if not in distractors
            if (!candidateDistractors.includes(`x = ${h} \\pm ${a}`)) {
                candidateDistractors[0] = `x = ${h} \\pm ${a}`;
            }
            
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const rand1 = utils.rInt(-10, 15);
                    const rand2 = utils.rInt(-10, 15);
                    return `x = ${rand1} \\text{ or } x = ${rand2}`;
                }
            );
            
            return {
                tex: `|x - ${h}| = ${a}`,
                instruction: "Solve for x",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `|x - ${h}| = ${a} means x - ${h} = ${a} or x - ${h} = -${a}. Solving: x = ${h} + ${a} = ${sol1} or x = ${h} - ${a} = ${sol2}.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Linear inside: |2x + 1| = a
            const coeff = utils.rInt(2, 4);
            const const_term = utils.rInt(1, 5);
            const a = utils.rInt(5, 11);
            
            // 2x + 1 = a  =>  x = (a-1)/2
            // 2x + 1 = -a  =>  x = (-a-1)/2
            const sol1_num = a - const_term;
            const sol2_num = -a - const_term;
            
            // Check if solutions are clean
            let correctAnswer, explanation;
            if (sol1_num % coeff === 0 && sol2_num % coeff === 0) {
                const sol1 = sol1_num / coeff;
                const sol2 = sol2_num / coeff;
                correctAnswer = `x = ${sol1} \\text{ or } x = ${sol2}`;
                explanation = `|${coeff}x + ${const_term}| = ${a} means ${coeff}x + ${const_term} = ${a} or ${coeff}x + ${const_term} = -${a}. First: ${coeff}x = ${a - const_term}, x = ${sol1}. Second: ${coeff}x = ${-a - const_term}, x = ${sol2}.`;
            } else {
                correctAnswer = `x = \\frac{${sol1_num}}{${coeff}} \\text{ or } x = \\frac{${sol2_num}}{${coeff}}`;
                explanation = `|${coeff}x + ${const_term}| = ${a} means ${coeff}x + ${const_term} = ${a} or ${coeff}x + ${const_term} = -${a}. First: ${coeff}x = ${sol1_num}, x = ${sol1_num}/${coeff}. Second: ${coeff}x = ${sol2_num}, x = ${sol2_num}/${coeff}.`;
            }
            
            const candidateDistractors = [
                `x = \\frac{${a}}{${coeff}}`,  // Wrong approach
                `x = \\pm ${a}`,  // Treated like |x| = a
                `x = ${Math.floor(sol1_num / coeff)}`  // Only one solution, rounded
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const rand = utils.rInt(-15, 15);
                    return `x = ${rand}`;
                }
            );
            
            return {
                tex: `|${coeff}x + ${const_term}| = ${a}`,
                instruction: "Solve for x",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: explanation,
                calc: false
            };
        } else {
            // Conceptual: Which method for |x - 3| < 5?
            const correctAnswer = `-5 < x - 3 < 5`;
            const candidateDistractors = [
                `x - 3 = \\pm 5`,  // Treating as equation
                `x < -5 \\text{ or } x > 5`,  // Wrong inequality type
                `x - 3 < 5`  // Forgot negative part
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const b = utils.rInt(2, 8);
                    return `-${b} < x - 3 < ${b}`;
                }
            );
            
            return {
                tex: `\\text{To solve } |x - 3| < 5,\\\\[0.5em]\\text{what is the first step?}`,
                instruction: "Select the correct approach",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `For |expression| < a, write -a < expression < a. So |x - 3| < 5 becomes -5 < x - 3 < 5, which simplifies to -2 < x < 8.`,
                calc: false
            };
        }
    }
};
