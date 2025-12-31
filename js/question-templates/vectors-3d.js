// 3D Vectors Question Templates
// Level 28-29: 3D Vector Operations
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Vectors3D = {
    // 3D vector operations
    get3DVectorQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 5);
        
        if (questionType === 1) {
            // 3D vector addition
            const a1 = utils.rInt(1, 9);
            const a2 = utils.rInt(1, 9);
            const a3 = utils.rInt(1, 9);
            
            const b1 = utils.rInt(1, 9);
            const b2 = utils.rInt(1, 9);
            const b3 = utils.rInt(1, 9);
            
            const c1 = a1 + b1;
            const c2 = a2 + b2;
            const c3 = a3 + b3;
            
            const correctAnswer = `\\begin{pmatrix} ${c1} \\\\ ${c2} \\\\ ${c3} \\end{pmatrix}`;
            
            return {
                tex: `\\begin{pmatrix} ${a1} \\\\ ${a2} \\\\ ${a3} \\end{pmatrix} + \\begin{pmatrix} ${b1} \\\\ ${b2} \\\\ ${b3} \\end{pmatrix}`,
                instruction: "Calculate the vector sum",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `\\begin{pmatrix} ${c1 + 1} \\\\ ${c2} \\\\ ${c3} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${c1} \\\\ ${c2 + 1} \\\\ ${c3} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${a1 * b1} \\\\ ${a2 * b2} \\\\ ${a3 * b3} \\end{pmatrix}`
                    ],
                    () => `\\begin{pmatrix} ${utils.rInt(1, 20)} \\\\ ${utils.rInt(1, 20)} \\\\ ${utils.rInt(1, 20)} \\end{pmatrix}`
                ),
                explanation: `Add corresponding components: (${a1}+${b1}, ${a2}+${b2}, ${a3}+${b3}) = (${c1}, ${c2}, ${c3}).`,
                calc: true
            };
        } else if (questionType === 2) {
            // Magnitude of 3D vector
            const a = utils.rInt(1, 4);
            const b = utils.rInt(1, 4);
            const c = utils.rInt(1, 4);
            
            const magSquared = a * a + b * b + c * c;
            const mag = Math.sqrt(magSquared);
            
            // Check if it's a perfect square for simpler answer
            const isPerfectSquare = Math.floor(mag) === mag;
            
            const correctAnswer = isPerfectSquare ? `${mag}` : `\\sqrt{${magSquared}}`;
            
            return {
                tex: `\\left|\\begin{pmatrix} ${a} \\\\ ${b} \\\\ ${c} \\end{pmatrix}\\right|`,
                instruction: "Calculate the magnitude of the vector",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    isPerfectSquare ? [
                        `${mag + 1}`,
                        `${a + b + c}`,
                        `\\sqrt{${magSquared + 1}}`
                    ] : [
                        `\\sqrt{${magSquared + 1}}`,
                        `${a + b + c}`,
                        `\\sqrt{${a * b * c}}`
                    ],
                    () => isPerfectSquare ? `${utils.rInt(1, 20)}` : `\\sqrt{${utils.rInt(1, 50)}}`
                ),
                explanation: `Magnitude = √(${a}² + ${b}² + ${c}²) = √(${a * a} + ${b * b} + ${c * c}) = √${magSquared}${isPerfectSquare ? ' = ' + mag : ''}.`,
                calc: true
            };
        } else if (questionType === 3) {
            // Dot product in 3D
            const a1 = utils.rInt(1, 5);
            const a2 = utils.rInt(1, 5);
            const a3 = utils.rInt(1, 5);
            
            const b1 = utils.rInt(1, 5);
            const b2 = utils.rInt(1, 5);
            const b3 = utils.rInt(1, 5);
            
            const dotProduct = a1 * b1 + a2 * b2 + a3 * b3;
            const correctAnswer = `${dotProduct}`;
            
            return {
                tex: `\\begin{pmatrix} ${a1} \\\\ ${a2} \\\\ ${a3} \\end{pmatrix} \\cdot \\begin{pmatrix} ${b1} \\\\ ${b2} \\\\ ${b3} \\end{pmatrix}`,
                instruction: "Calculate the dot product",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `${dotProduct + 1}`,
                        `${a1 + a2 + a3}`,
                        `${a1 * b1}`
                    ],
                    () => `${utils.rInt(1, 100)}`
                ),
                explanation: `Dot product = ${a1}×${b1} + ${a2}×${b2} + ${a3}×${b3} = ${a1 * b1} + ${a2 * b2} + ${a3 * b3} = ${dotProduct}.`,
                calc: true
            };
        } else if (questionType === 4) {
            // Cross product in 3D
            const a1 = utils.rInt(1, 4);
            const a2 = utils.rInt(1, 4);
            const a3 = utils.rInt(1, 4);
            
            const b1 = utils.rInt(1, 4);
            const b2 = utils.rInt(1, 4);
            const b3 = utils.rInt(1, 4);
            
            // Cross product: (a2*b3 - a3*b2, a3*b1 - a1*b3, a1*b2 - a2*b1)
            const c1 = a2 * b3 - a3 * b2;
            const c2 = a3 * b1 - a1 * b3;
            const c3 = a1 * b2 - a2 * b1;
            
            const correctAnswer = `\\begin{pmatrix} ${c1} \\\\ ${c2} \\\\ ${c3} \\end{pmatrix}`;
            
            return {
                tex: `\\begin{pmatrix} ${a1} \\\\ ${a2} \\\\ ${a3} \\end{pmatrix} \\times \\begin{pmatrix} ${b1} \\\\ ${b2} \\\\ ${b3} \\end{pmatrix}`,
                instruction: "Calculate the cross product",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `\\begin{pmatrix} ${-c1} \\\\ ${-c2} \\\\ ${-c3} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${c1 + 1} \\\\ ${c2} \\\\ ${c3} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${a1 * b1} \\\\ ${a2 * b2} \\\\ ${a3 * b3} \\end{pmatrix}`
                    ],
                    () => `\\begin{pmatrix} ${utils.rInt(-20, 20)} \\\\ ${utils.rInt(-20, 20)} \\\\ ${utils.rInt(-20, 20)} \\end{pmatrix}`
                ),
                explanation: `Cross product uses determinant formula: i-component = ${a2}×${b3} - ${a3}×${b2} = ${c1}, j-component = ${a3}×${b1} - ${a1}×${b3} = ${c2}, k-component = ${a1}×${b2} - ${a2}×${b1} = ${c3}.`,
                calc: true
            };
        } else {
            // Scalar multiplication in 3D
            const k = utils.rInt(2, 5);
            const a1 = utils.rInt(1, 5);
            const a2 = utils.rInt(1, 5);
            const a3 = utils.rInt(1, 5);
            
            const correctAnswer = `\\begin{pmatrix} ${k * a1} \\\\ ${k * a2} \\\\ ${k * a3} \\end{pmatrix}`;
            
            return {
                tex: `${k}\\begin{pmatrix} ${a1} \\\\ ${a2} \\\\ ${a3} \\end{pmatrix}`,
                instruction: "Multiply the vector by the scalar",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `\\begin{pmatrix} ${k + a1} \\\\ ${k + a2} \\\\ ${k + a3} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${k * a1 + 1} \\\\ ${k * a2} \\\\ ${k * a3} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${a1} \\\\ ${a2} \\\\ ${a3} \\end{pmatrix}`
                    ],
                    () => `\\begin{pmatrix} ${utils.rInt(1, 30)} \\\\ ${utils.rInt(1, 30)} \\\\ ${utils.rInt(1, 30)} \\end{pmatrix}`
                ),
                explanation: `Multiply each component by ${k}: (${k}×${a1}, ${k}×${a2}, ${k}×${a3}) = (${k * a1}, ${k * a2}, ${k * a3}).`,
                calc: true
            };
        }
    }
};
