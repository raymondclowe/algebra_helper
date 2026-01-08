// Lines Question Templates - Parallel and Perpendicular Lines
// Level 6-7: Parallel and perpendicular line concepts
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Lines = {
    getParallelPerpendicularLines: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 5);
        
        if (questionType === 1) {
            // Find gradient of parallel line
            const m = utils.rInt(2, 9);
            const c1 = utils.rInt(1, 10);
            const c2 = utils.rInt(1, 10);
            const correctAnswer = `${m}`;
            
            // Common mistakes: negative, reciprocal, negative reciprocal
            const candidateDistractors = [
                `${-m}`,
                `\\frac{1}{${m}}`,
                `-\\frac{1}{${m}}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(1, 12)}`
            );
            
            return {
                tex: `\\text{Line } L_1 \\text{ has equation } y = ${m}x + ${c1}. \\text{ What is the gradient of a line parallel to } L_1?`,
                instruction: "Find the gradient",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Parallel lines have equal gradients. Since the gradient of L₁ is ${m}, any line parallel to L₁ also has gradient ${m}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Find gradient of perpendicular line
            const m = [2, 3, 4, 5][utils.rInt(0, 3)];
            const c = utils.rInt(1, 8);
            const perpGradient = -1 / m;
            const correctAnswer = `-\\frac{1}{${m}}`;
            
            // Common mistakes: same gradient, positive reciprocal, just negative
            const candidateDistractors = [
                `${m}`,
                `\\frac{1}{${m}}`,
                `${-m}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const randM = utils.rInt(2, 8);
                    return `-\\frac{1}{${randM}}`;
                }
            );
            
            return {
                tex: `\\text{Line } L_1 \\text{ has equation } y = ${m}x + ${c}. \\text{ What is the gradient of a line perpendicular to } L_1?`,
                instruction: "Find the gradient",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Perpendicular lines have gradients that multiply to -1. If m₁ = ${m}, then m₂ = -1/${m}. This gives m₁ × m₂ = ${m} × (-1/${m}) = -1.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Check if lines are parallel
            const m = utils.rInt(2, 7);
            const c1 = utils.rInt(1, 8);
            const c2 = utils.rInt(1, 8);
            // Ensure c1 ≠ c2
            const c2Adjusted = c1 === c2 ? c2 + 1 : c2;
            const correctAnswer = `\\text{Yes, parallel}`;
            
            const wrongM = m + utils.rInt(1, 3);
            const candidateDistractors = [
                `\\text{No, not parallel}`,
                `\\text{Yes, perpendicular}`,
                `\\text{Cannot determine}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const options = [`\\text{No}`, `\\text{Perpendicular}`, `\\text{Intersecting}`];
                    return options[utils.rInt(0, options.length - 1)];
                }
            );
            
            return {
                tex: `\\text{Are the lines } y = ${m}x + ${c1} \\text{ and } y = ${m}x + ${c2Adjusted} \\text{ parallel?}`,
                instruction: "Determine relationship",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Compare the gradients: both lines have gradient ${m}. Since the gradients are equal and the y-intercepts are different (${c1} ≠ ${c2Adjusted}), the lines are parallel.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Check if lines are perpendicular
            const m1 = [2, 3, 4][utils.rInt(0, 2)];
            const m2 = -1 / m1;
            const c1 = utils.rInt(1, 6);
            const c2 = utils.rInt(1, 6);
            const correctAnswer = `\\text{Yes, perpendicular}`;
            
            const candidateDistractors = [
                `\\text{No, not perpendicular}`,
                `\\text{Yes, parallel}`,
                `\\text{Cannot determine}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const options = [`\\text{No}`, `\\text{Parallel}`, `\\text{Coincident}`];
                    return options[utils.rInt(0, options.length - 1)];
                }
            );
            
            const m2Display = m2 < 0 ? `${m2}` : m2;
            const m2Frac = `-\\frac{1}{${m1}}`;
            
            return {
                tex: `\\text{Are the lines } y = ${m1}x + ${c1} \\text{ and } y = ${m2Frac}x + ${c2} \\text{ perpendicular?}`,
                instruction: "Determine relationship",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Check if m₁ × m₂ = -1. Here, ${m1} × (${m2Frac}) = -1. Since the product of the gradients equals -1, the lines are perpendicular.`,
                calc: false
            };
        } else {
            // Find equation of line with given gradient through a point
            const m = utils.rInt(2, 6);
            const x0 = utils.rInt(1, 5);
            const y0 = utils.rInt(1, 8);
            // y - y0 = m(x - x0) => y = mx - mx0 + y0
            const c = y0 - m * x0;
            const correctAnswer = `y = ${m}x ${c >= 0 ? '+' : ''} ${c}`;
            
            // Common mistakes: wrong c, wrong sign, point-slope form
            const wrongC1 = y0 + m * x0;
            const wrongC2 = y0;
            const wrongSign = `y = ${-m}x ${c >= 0 ? '+' : ''} ${c}`;
            
            const candidateDistractors = [
                `y = ${m}x + ${wrongC1}`,
                `y = ${m}x + ${wrongC2}`,
                wrongSign
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const randC = utils.rInt(-20, 20);
                    return `y = ${m}x ${randC >= 0 ? '+' : ''} ${randC}`;
                }
            );
            
            return {
                tex: `\\text{Find the equation of the line with gradient } ${m} \\text{ passing through } (${x0}, ${y0})`,
                instruction: "Find line equation (y = mx + c form)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use y - y₁ = m(x - x₁): y - ${y0} = ${m}(x - ${x0}). Expanding: y = ${m}x - ${m * x0} + ${y0} = ${m}x ${c >= 0 ? '+' : ''} ${c}.`,
                calc: false
            };
        }
    }
};
