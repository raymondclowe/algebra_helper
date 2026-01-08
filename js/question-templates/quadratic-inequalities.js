// Quadratic Inequalities Question Templates
// Level 10-11: Solving quadratic inequalities
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.QuadraticInequalities = {
    getQuadraticInequalities: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 6);
        
        if (questionType === 1) {
            // Simple factorable quadratic inequality: (x-a)(x-b) > 0
            const a = utils.rInt(1, 5);
            const b = utils.rInt(6, 9);
            // For (x-a)(x-b) > 0, solution is x < a or x > b
            const correctAnswer = `x < ${a} \\text{ or } x > ${b}`;
            
            // Common mistakes: wrong direction, between roots, single inequality
            const candidateDistractors = [
                `${a} < x < ${b}`,
                `x < ${a}`,
                `x > ${b}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const r1 = utils.rInt(1, 10);
                    const r2 = utils.rInt(r1 + 1, 12);
                    return `x < ${r1} \\text{ or } x > ${r2}`;
                }
            );
            
            return {
                tex: `(x - ${a})(x - ${b}) > 0`,
                instruction: "Solve the inequality",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `The critical points are x = ${a} and x = ${b}. Test values: for x < ${a}, both factors negative, product positive ✓. For ${a} < x < ${b}, factors have opposite signs, product negative ✗. For x > ${b}, both factors positive, product positive ✓. Solution: x < ${a} or x > ${b}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Factorable quadratic inequality: (x-a)(x-b) < 0
            const a = utils.rInt(1, 4);
            const b = utils.rInt(6, 9);
            // For (x-a)(x-b) < 0, solution is a < x < b
            const correctAnswer = `${a} < x < ${b}`;
            
            // Common mistakes: wrong direction, outside roots
            const candidateDistractors = [
                `x < ${a} \\text{ or } x > ${b}`,
                `x < ${b}`,
                `x > ${a}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const r1 = utils.rInt(1, 8);
                    const r2 = utils.rInt(r1 + 2, 12);
                    return `${r1} < x < ${r2}`;
                }
            );
            
            return {
                tex: `(x - ${a})(x - ${b}) < 0`,
                instruction: "Solve the inequality",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `The critical points are x = ${a} and x = ${b}. Test values: for x < ${a}, both factors negative, product positive ✗. For ${a} < x < ${b}, factors have opposite signs, product negative ✓. For x > ${b}, both factors positive, product positive ✗. Solution: ${a} < x < ${b}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Expanded form: x² + bx + c > 0
            const root1 = utils.rInt(1, 4);
            const root2 = utils.rInt(5, 8);
            const b = -(root1 + root2);
            const c = root1 * root2;
            const bDisplay = b >= 0 ? `+ ${b}` : `- ${-b}`;
            // For x² + bx + c > 0, solution is x < root1 or x > root2
            const correctAnswer = `x < ${root1} \\text{ or } x > ${root2}`;
            
            const candidateDistractors = [
                `${root1} < x < ${root2}`,
                `x > ${root1}`,
                `x < ${root2}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const r1 = utils.rInt(1, 10);
                    const r2 = utils.rInt(r1 + 1, 12);
                    return `x < ${r1} \\text{ or } x > ${r2}`;
                }
            );
            
            return {
                tex: `x^2 ${bDisplay}x + ${c} > 0`,
                instruction: "Solve the inequality",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `First factor: x² ${bDisplay}x + ${c} = (x - ${root1})(x - ${root2}). The parabola opens upward (positive leading coefficient). The inequality > 0 is satisfied outside the roots: x < ${root1} or x > ${root2}.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Expanded form: x² + bx + c < 0
            const root1 = utils.rInt(2, 4);
            const root2 = utils.rInt(6, 9);
            const b = -(root1 + root2);
            const c = root1 * root2;
            const bDisplay = b >= 0 ? `+ ${b}` : `- ${-b}`;
            // For x² + bx + c < 0, solution is root1 < x < root2
            const correctAnswer = `${root1} < x < ${root2}`;
            
            const candidateDistractors = [
                `x < ${root1} \\text{ or } x > ${root2}`,
                `x < ${root2}`,
                `x > ${root1}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const r1 = utils.rInt(1, 8);
                    const r2 = utils.rInt(r1 + 2, 12);
                    return `${r1} < x < ${r2}`;
                }
            );
            
            return {
                tex: `x^2 ${bDisplay}x + ${c} < 0`,
                instruction: "Solve the inequality",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `First factor: x² ${bDisplay}x + ${c} = (x - ${root1})(x - ${root2}). The parabola opens upward. The inequality < 0 is satisfied between the roots: ${root1} < x < ${root2}.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Inequality with ≥: x² + bx + c ≥ 0
            const root1 = utils.rInt(1, 4);
            const root2 = utils.rInt(6, 9);
            const b = -(root1 + root2);
            const c = root1 * root2;
            const bDisplay = b >= 0 ? `+ ${b}` : `- ${-b}`;
            // For x² + bx + c ≥ 0, solution is x ≤ root1 or x ≥ root2
            const correctAnswer = `x \\leq ${root1} \\text{ or } x \\geq ${root2}`;
            
            const candidateDistractors = [
                `${root1} \\leq x \\leq ${root2}`,
                `x < ${root1} \\text{ or } x > ${root2}`,
                `x \\geq ${root1}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const r1 = utils.rInt(1, 10);
                    const r2 = utils.rInt(r1 + 1, 12);
                    return `x \\leq ${r1} \\text{ or } x \\geq ${r2}`;
                }
            );
            
            return {
                tex: `x^2 ${bDisplay}x + ${c} \\geq 0`,
                instruction: "Solve the inequality",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Factor: x² ${bDisplay}x + ${c} = (x - ${root1})(x - ${root2}). For ≥ 0, include the boundary points where the expression equals zero. Solution: x ≤ ${root1} or x ≥ ${root2}.`,
                calc: false
            };
        } else {
            // Inequality with ≤: x² + bx + c ≤ 0
            const root1 = utils.rInt(2, 4);
            const root2 = utils.rInt(6, 9);
            const b = -(root1 + root2);
            const c = root1 * root2;
            const bDisplay = b >= 0 ? `+ ${b}` : `- ${-b}`;
            // For x² + bx + c ≤ 0, solution is root1 ≤ x ≤ root2
            const correctAnswer = `${root1} \\leq x \\leq ${root2}`;
            
            const candidateDistractors = [
                `x \\leq ${root1} \\text{ or } x \\geq ${root2}`,
                `${root1} < x < ${root2}`,
                `x \\leq ${root2}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const r1 = utils.rInt(1, 8);
                    const r2 = utils.rInt(r1 + 2, 12);
                    return `${r1} \\leq x \\leq ${r2}`;
                }
            );
            
            return {
                tex: `x^2 ${bDisplay}x + ${c} \\leq 0`,
                instruction: "Solve the inequality",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Factor: x² ${bDisplay}x + ${c} = (x - ${root1})(x - ${root2}). For ≤ 0, the parabola is below or on the x-axis between (and including) the roots. Solution: ${root1} ≤ x ≤ ${root2}.`,
                calc: false
            };
        }
    }
};
