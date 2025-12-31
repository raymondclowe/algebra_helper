// Vectors Question Templates
// Level 17-18
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Vectors = {
    getVectors: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 4);
                
                if (questionType === 1) {
                    // Vector addition
                    const a1 = utils.rInt(1, 6);
                    const a2 = utils.rInt(1, 6);
                    const b1 = utils.rInt(1, 5);
                    const b2 = utils.rInt(1, 5);
                    const sum1 = a1 + b1;
                    const sum2 = a2 + b2;
                    const correctAnswer = `\\begin{pmatrix} ${sum1} \\\\ ${sum2} \\end{pmatrix}`;
                    const candidateDistractors = [
                        `\\begin{pmatrix} ${a1 * b1} \\\\ ${a2 * b2} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${sum1} \\\\ ${a2} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${a1} \\\\ ${sum2} \\end{pmatrix}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const r1 = utils.rInt(1, 10);
                            const r2 = utils.rInt(1, 10);
                            return `\\begin{pmatrix} ${r1} \\\\ ${r2} \\end{pmatrix}`;
                        }
                    );
                    
                    return {
                        tex: `\\begin{pmatrix} ${a1} \\\\ ${a2} \\end{pmatrix} + \\begin{pmatrix} ${b1} \\\\ ${b2} \\end{pmatrix}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Add corresponding components: (${a1} + ${b1}, ${a2} + ${b2}) = (${sum1}, ${sum2}).`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Scalar multiplication
                    const k = utils.rInt(2, 5);
                    const v1 = utils.rInt(1, 6);
                    const v2 = utils.rInt(1, 6);
                    const result1 = k * v1;
                    const result2 = k * v2;
                    const correctAnswer = `\\begin{pmatrix} ${result1} \\\\ ${result2} \\end{pmatrix}`;
                    const candidateDistractors = [
                        `\\begin{pmatrix} ${v1 + k} \\\\ ${v2 + k} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${result1} \\\\ ${v2} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${k} \\\\ ${k} \\end{pmatrix}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const r1 = utils.rInt(1, 20);
                            const r2 = utils.rInt(1, 20);
                            return `\\begin{pmatrix} ${r1} \\\\ ${r2} \\end{pmatrix}`;
                        }
                    );
                    
                    return {
                        tex: `${k} \\begin{pmatrix} ${v1} \\\\ ${v2} \\end{pmatrix}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Multiply each component by ${k}: (${k}×${v1}, ${k}×${v2}) = (${result1}, ${result2}).`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Magnitude of vector
                    const v1 = utils.rInt(3, 5);
                    const v2 = utils.rInt(3, 5);
                    const magSquared = v1 * v1 + v2 * v2;
                    const mag = Math.sqrt(magSquared);
                    const isExact = mag === Math.floor(mag);
                    const correctAnswer = isExact ? `${mag}` : `\\sqrt{${magSquared}}`;
                    const candidateDistractors = [
                        `${v1 + v2}`,
                        `${Math.max(v1, v2)}`,
                        `\\sqrt{${v1 * v2}}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randV1 = utils.rInt(1, 8);
                            const randV2 = utils.rInt(1, 8);
                            const randMagSq = randV1 * randV1 + randV2 * randV2;
                            return `\\sqrt{${randMagSq}}`;
                        }
                    );
                    
                    return {
                        tex: `\\left|\\begin{pmatrix} ${v1} \\\\ ${v2} \\end{pmatrix}\\right|`,
                        instruction: "Find the magnitude",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Magnitude = $\\sqrt{${v1}^2 + ${v2}^2} = \\sqrt{${v1 * v1} + ${v2 * v2}} = \\sqrt{${magSquared}}${isExact ? ' = ' + mag : ''}$.`,
                        calc: false
                    };
                } else {
                    // Dot product
                    const a1 = utils.rInt(1, 5);
                    const a2 = utils.rInt(1, 5);
                    const b1 = utils.rInt(1, 5);
                    const b2 = utils.rInt(1, 5);
                    const dot = a1 * b1 + a2 * b2;
                    const correctAnswer = `${dot}`;
                    const candidateDistractors = [
                        `${a1 + b1}`,
                        `${a1 * b1}`,
                        `${dot + a2}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(5, 50)}`
                    );
                    
                    return {
                        tex: `\\begin{pmatrix} ${a1} \\\\ ${a2} \\end{pmatrix} \\cdot \\begin{pmatrix} ${b1} \\\\ ${b2} \\end{pmatrix}`,
                        instruction: "Calculate the dot product",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Dot product = (${a1})(${b1}) + (${a2})(${b2}) = ${a1 * b1} + ${a2 * b2} = ${dot}.`,
                        calc: false
                    };
                }
    }
};
