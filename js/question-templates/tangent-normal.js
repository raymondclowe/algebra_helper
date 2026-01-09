// Tangent and Normal Lines Question Templates
// Level 19-20: Calculus - tangent and normal lines to curves
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.TangentNormal = {
    getTangentNormalQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 6);
        
        if (questionType === 1) {
            // Find equation of tangent line to curve at given point
            // Use y = ax² + bx + c, derivative is 2ax + b
            const a = utils.rInt(1, 3);
            const b = utils.rInt(-5, 5);
            const c = utils.rInt(-5, 5);
            const x0 = utils.rInt(1, 3);
            const y0 = a * x0 * x0 + b * x0 + c;
            const gradient = 2 * a * x0 + b;
            
            // Tangent line: y - y0 = m(x - x0) => y = mx - mx0 + y0
            const intercept = y0 - gradient * x0;
            const interceptSign = intercept >= 0 ? '+' : '';
            const correctAnswer = `y = ${gradient}x ${interceptSign} ${intercept}`;
            
            // Common mistakes: wrong gradient, normal gradient, wrong point
            const wrongGradient = 2 * a * x0;  // Forgot to add b
            const normalGradient = gradient !== 0 ? -1 / gradient : 'undefined';
            const wrongIntercept = y0 - wrongGradient * x0;
            
            const candidateDistractors = [
                `y = ${wrongGradient}x ${wrongIntercept >= 0 ? '+' : ''} ${wrongIntercept}`,
                typeof normalGradient === 'number' ? `y = ${utils.roundToClean(normalGradient, 2)}x ${(y0 - normalGradient * x0) >= 0 ? '+' : ''} ${utils.roundToClean(y0 - normalGradient * x0, 2)}` : `y = ${gradient}x`,
                `y = ${gradient}x + ${y0}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const randGrad = utils.rInt(-10, 10);
                    const randInt = utils.rInt(-20, 20);
                    return `y = ${randGrad}x ${randInt >= 0 ? '+' : ''} ${randInt}`;
                }
            );
            
            const bSign = b >= 0 ? '+' : '';
            const cSign = c >= 0 ? '+' : '';
            const curve = `y = ${a}x^2 ${bSign} ${b}x ${cSign} ${c}`;
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Find the equation of the tangent line to } ${curve} \\text{ at the point } (${x0}, ${y0}).`),
                instruction: "Use y - y₁ = m(x - x₁)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `First find the gradient: dy/dx = ${2 * a}x ${bSign} ${b}. At x = ${x0}, gradient = ${2 * a}(${x0}) ${bSign} ${b} = ${gradient}. Using point-slope form y - ${y0} = ${gradient}(x - ${x0}), we get ${correctAnswer}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Find equation of normal line to curve at given point
            // Use y = ax² + bx + c
            const a = utils.rInt(1, 3);
            const b = utils.rInt(-5, 5);
            const c = utils.rInt(-5, 5);
            const x0 = utils.rInt(1, 3);
            const y0 = a * x0 * x0 + b * x0 + c;
            const tangentGradient = 2 * a * x0 + b;
            const normalGradient = tangentGradient !== 0 ? -1 / tangentGradient : Infinity;
            
            if (normalGradient === Infinity) {
                // Vertical normal line: x = x0
                const correctAnswer = `x = ${x0}`;
                
                const candidateDistractors = [
                    `y = ${x0}`,
                    `y = ${tangentGradient}x + ${y0}`,
                    `x = ${y0}`
                ];
                const distractors = utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `x = ${utils.rInt(-5, 5)}`
                );
                
                const bSign = b >= 0 ? '+' : '';
                const cSign = c >= 0 ? '+' : '';
                const curve = `y = ${a}x^2 ${bSign} ${b}x ${cSign} ${c}`;
                
                return {
                    tex: utils.wrapLongLatexText(`\\text{Find the equation of the normal line to } ${curve} \\text{ at } (${x0}, ${y0}).`),
                    instruction: "Normal is perpendicular to tangent",
                    displayAnswer: correctAnswer,
                    distractors: distractors,
                    explanation: `The tangent gradient is ${tangentGradient}. Since this is 0, the normal is vertical: x = ${x0}.`,
                    calc: false
                };
            }
            
            // Normal line: m_normal = -1/m_tangent
            const intercept = y0 - normalGradient * x0;
            const normalGradClean = utils.roundToClean(normalGradient, 2);
            const interceptClean = utils.roundToClean(intercept, 2);
            const interceptSign = interceptClean >= 0 ? '+' : '';
            const correctAnswer = `y = ${normalGradClean}x ${interceptSign} ${interceptClean}`;
            
            // Common mistakes: using tangent gradient, wrong sign, wrong calculation
            const tangentIntercept = y0 - tangentGradient * x0;
            const wrongSign = 1 / tangentGradient;
            const wrongSignIntercept = y0 - wrongSign * x0;
            
            const candidateDistractors = [
                `y = ${tangentGradient}x ${tangentIntercept >= 0 ? '+' : ''} ${tangentIntercept}`,
                `y = ${utils.roundToClean(wrongSign, 2)}x ${wrongSignIntercept >= 0 ? '+' : ''} ${utils.roundToClean(wrongSignIntercept, 2)}`,
                `y = ${normalGradClean}x + ${y0}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const randGrad = utils.roundToClean(utils.rInt(-10, 10) / utils.rInt(1, 5), 2);
                    const randInt = utils.rInt(-20, 20);
                    return `y = ${randGrad}x ${randInt >= 0 ? '+' : ''} ${randInt}`;
                }
            );
            
            const bSign = b >= 0 ? '+' : '';
            const cSign = c >= 0 ? '+' : '';
            const curve = `y = ${a}x^2 ${bSign} ${b}x ${cSign} ${c}`;
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Find the equation of the normal line to } ${curve} \\text{ at } (${x0}, ${y0}).`),
                instruction: "Normal: m_normal = -1/m_tangent",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `First find tangent gradient: dy/dx = ${2 * a}x ${bSign} ${b}. At x = ${x0}, m_tangent = ${tangentGradient}. Normal gradient: m_normal = -1/${tangentGradient} = ${normalGradClean}. Using y - ${y0} = ${normalGradClean}(x - ${x0}), we get ${correctAnswer}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Find gradient of tangent at a point
            const a = utils.rInt(1, 4);
            const b = utils.rInt(-6, 6);
            const x0 = utils.rInt(1, 4);
            const gradient = 2 * a * x0 + b;
            const correctAnswer = `${gradient}`;
            
            // Common mistakes: forgot to substitute, wrong derivative, used x0²
            const wrongDerivative = 2 * a;
            const usedX0Squared = 2 * a * x0 * x0 + b;
            const forgotB = 2 * a * x0;
            
            const candidateDistractors = [
                `${wrongDerivative}`,
                `${usedX0Squared}`,
                `${forgotB}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(-20, 20)}`
            );
            
            const bSign = b >= 0 ? '+' : '';
            const curve = `y = ${a}x^2 ${bSign} ${b}x`;
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Find the gradient of the tangent to } ${curve} \\text{ at } x = ${x0}.`),
                instruction: "Find dy/dx and substitute x",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Differentiate: dy/dx = ${2 * a}x ${bSign} ${b}. Substitute x = ${x0}: gradient = ${2 * a}(${x0}) ${bSign} ${b} = ${gradient}.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Find gradient of normal at a point
            const a = utils.rInt(1, 3);
            const b = utils.rInt(-5, 5);
            const x0 = utils.rInt(1, 3);
            const tangentGradient = 2 * a * x0 + b;
            
            if (tangentGradient === 0) {
                // Handle special case: vertical normal
                const correctAnswer = `\\text{undefined}`;
                
                const candidateDistractors = [
                    `0`,
                    `${2 * a * x0}`,
                    `${2 * a}`
                ];
                const distractors = utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${utils.rInt(-10, 10)}`
                );
                
                const bSign = b >= 0 ? '+' : '';
                const curve = `y = ${a}x^2 ${bSign} ${b}x`;
                
                return {
                    tex: utils.wrapLongLatexText(`\\text{Find the gradient of the normal to } ${curve} \\text{ at } x = ${x0}.`),
                    instruction: "m_normal = -1/m_tangent",
                    displayAnswer: correctAnswer,
                    distractors: distractors,
                    explanation: `dy/dx = ${2 * a}x ${bSign} ${b}. At x = ${x0}, tangent gradient = ${tangentGradient}. Since m_tangent = 0, the normal is vertical and has undefined gradient.`,
                    calc: false
                };
            }
            
            const normalGradient = -1 / tangentGradient;
            const normalGradClean = utils.roundToClean(normalGradient, 2);
            const correctAnswer = `${normalGradClean}`;
            
            // Common mistakes: used tangent gradient, wrong sign, wrong reciprocal
            const wrongReciprocal = utils.roundToClean(1 / tangentGradient, 2);
            const wrongNegative = utils.roundToClean(-tangentGradient, 2);
            
            const candidateDistractors = [
                `${tangentGradient}`,
                `${wrongReciprocal}`,
                `${wrongNegative}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.roundToClean(utils.rInt(-10, 10) / utils.rInt(1, 5), 2)}`
            );
            
            const bSign = b >= 0 ? '+' : '';
            const curve = `y = ${a}x^2 ${bSign} ${b}x`;
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Find the gradient of the normal to } ${curve} \\text{ at } x = ${x0}.`),
                instruction: "m_normal = -1/m_tangent",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `dy/dx = ${2 * a}x ${bSign} ${b}. At x = ${x0}, m_tangent = ${tangentGradient}. Normal gradient: m_normal = -1/${tangentGradient} = ${normalGradClean}.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Find x-coordinate where tangent has specific gradient
            const a = utils.rInt(1, 3);
            const b = utils.rInt(-5, 5);
            const targetGradient = utils.rInt(2, 10);
            
            // Solve 2ax + b = targetGradient for x
            // x = (targetGradient - b) / (2a)
            const numerator = targetGradient - b;
            const denominator = 2 * a;
            
            // Check if it's a whole number
            let correctAnswer;
            let xValue;
            if (numerator % denominator === 0) {
                xValue = numerator / denominator;
                correctAnswer = `${xValue}`;
            } else {
                xValue = numerator / denominator;
                correctAnswer = `\\frac{${numerator}}{${denominator}}`;
            }
            
            // Common mistakes: wrong algebra, forgot b, wrong sign
            const forgotB = utils.roundToClean(targetGradient / (2 * a), 2);
            const wrongSign = utils.roundToClean((targetGradient + b) / (2 * a), 2);
            const wrongDenominator = utils.roundToClean((targetGradient - b) / a, 2);
            
            const candidateDistractors = [
                `${forgotB}`,
                `${wrongSign}`,
                `${wrongDenominator}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.roundToClean(utils.rInt(-10, 10) / utils.rInt(1, 4), 2)}`
            );
            
            const bSign = b >= 0 ? '+' : '';
            const curve = `y = ${a}x^2 ${bSign} ${b}x`;
            
            return {
                tex: utils.wrapLongLatexText(`\\text{At what value of } x \\text{ does } ${curve} \\text{ have a tangent with gradient ${targetGradient}?}`),
                instruction: "Set dy/dx = gradient and solve",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `dy/dx = ${2 * a}x ${bSign} ${b}. Set equal to ${targetGradient}: ${2 * a}x ${bSign} ${b} = ${targetGradient}. Solving: ${2 * a}x = ${numerator}, so x = ${correctAnswer}.`,
                calc: false
            };
        } else {
            // Mixed problem: Find both tangent and normal gradient at a point
            const a = utils.rInt(1, 3);
            const b = utils.rInt(-5, 5);
            const c = utils.rInt(-5, 5);
            const x0 = utils.rInt(1, 3);
            const tangentGradient = 2 * a * x0 + b;
            
            if (tangentGradient === 0) {
                // Special case: tangent horizontal, normal vertical
                const correctAnswer = `0, \\text{undefined}`;
                
                const candidateDistractors = [
                    `\\text{undefined}, 0`,
                    `${2 * a}, ${-1 / (2 * a)}`,
                    `0, 0`
                ];
                const distractors = utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${utils.rInt(-5, 5)}, ${utils.rInt(-5, 5)}`
                );
                
                const bSign = b >= 0 ? '+' : '';
                const cSign = c >= 0 ? '+' : '';
                const curve = `y = ${a}x^2 ${bSign} ${b}x ${cSign} ${c}`;
                
                return {
                    tex: utils.wrapLongLatexText(`\\text{Find the gradients of the tangent and normal to } ${curve} \\text{ at } x = ${x0}.`),
                    instruction: "Give as: tangent, normal",
                    displayAnswer: correctAnswer,
                    distractors: distractors,
                    explanation: `dy/dx = ${2 * a}x ${bSign} ${b}. At x = ${x0}, tangent gradient = ${tangentGradient}. Normal gradient = -1/0 = undefined.`,
                    calc: false
                };
            }
            
            const normalGradient = -1 / tangentGradient;
            const normalGradClean = utils.roundToClean(normalGradient, 2);
            const correctAnswer = `${tangentGradient}, ${normalGradClean}`;
            
            // Common mistakes: swapped, both same, wrong calculation
            const swapped = `${normalGradClean}, ${tangentGradient}`;
            const bothTangent = `${tangentGradient}, ${tangentGradient}`;
            const wrongCalc = `${tangentGradient}, ${utils.roundToClean(1 / tangentGradient, 2)}`;
            
            const candidateDistractors = [
                swapped,
                bothTangent,
                wrongCalc
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const g1 = utils.rInt(-10, 10);
                    const g2 = utils.roundToClean(utils.rInt(-10, 10) / utils.rInt(1, 5), 2);
                    return `${g1}, ${g2}`;
                }
            );
            
            const bSign = b >= 0 ? '+' : '';
            const cSign = c >= 0 ? '+' : '';
            const curve = `y = ${a}x^2 ${bSign} ${b}x ${cSign} ${c}`;
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Find the gradients of the tangent and normal to } ${curve} \\text{ at } x = ${x0}.`),
                instruction: "Give as: tangent, normal",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `dy/dx = ${2 * a}x ${bSign} ${b}. At x = ${x0}, tangent gradient = ${2 * a}(${x0}) ${bSign} ${b} = ${tangentGradient}. Normal gradient = -1/${tangentGradient} = ${normalGradClean}.`,
                calc: false
            };
        }
    }
};
