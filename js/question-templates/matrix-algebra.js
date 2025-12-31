// Matrix Algebra Question Templates
// Level 27-28: Matrices and Linear Algebra
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.MatrixAlgebra = {
    // Matrix operations and properties
    getMatrixQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 6);
        
        if (questionType === 1) {
            // Matrix addition
            const a11 = utils.rInt(1, 9);
            const a12 = utils.rInt(1, 9);
            const a21 = utils.rInt(1, 9);
            const a22 = utils.rInt(1, 9);
            
            const b11 = utils.rInt(1, 9);
            const b12 = utils.rInt(1, 9);
            const b21 = utils.rInt(1, 9);
            const b22 = utils.rInt(1, 9);
            
            const c11 = a11 + b11;
            const c12 = a12 + b12;
            const c21 = a21 + b21;
            const c22 = a22 + b22;
            
            const correctAnswer = `\\begin{pmatrix} ${c11} & ${c12} \\\\ ${c21} & ${c22} \\end{pmatrix}`;
            
            return {
                tex: `\\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix} + \\begin{pmatrix} ${b11} & ${b12} \\\\ ${b21} & ${b22} \\end{pmatrix}`,
                instruction: "Calculate the sum of these matrices",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `\\begin{pmatrix} ${a11 * b11} & ${a12 * b12} \\\\ ${a21 * b21} & ${a22 * b22} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${c11 + 1} & ${c12} \\\\ ${c21} & ${c22} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${c11} & ${c12 + 1} \\\\ ${c21} & ${c22} \\end{pmatrix}`
                    ],
                    () => `\\begin{pmatrix} ${utils.rInt(1, 20)} & ${utils.rInt(1, 20)} \\\\ ${utils.rInt(1, 20)} & ${utils.rInt(1, 20)} \\end{pmatrix}`
                ),
                explanation: `Add corresponding elements: (${a11}+${b11}, ${a12}+${b12}; ${a21}+${b21}, ${a22}+${b22}) = (${c11}, ${c12}; ${c21}, ${c22}).`,
                calc: true
            };
        } else if (questionType === 2) {
            // Scalar multiplication
            const k = utils.rInt(2, 5);
            const a11 = utils.rInt(1, 5);
            const a12 = utils.rInt(1, 5);
            const a21 = utils.rInt(1, 5);
            const a22 = utils.rInt(1, 5);
            
            const correctAnswer = `\\begin{pmatrix} ${k * a11} & ${k * a12} \\\\ ${k * a21} & ${k * a22} \\end{pmatrix}`;
            
            return {
                tex: `${k} \\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix}`,
                instruction: "Multiply the matrix by the scalar",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `\\begin{pmatrix} ${k + a11} & ${k + a12} \\\\ ${k + a21} & ${k + a22} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${k * a11 + 1} & ${k * a12} \\\\ ${k * a21} & ${k * a22} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix}`
                    ],
                    () => `\\begin{pmatrix} ${utils.rInt(1, 30)} & ${utils.rInt(1, 30)} \\\\ ${utils.rInt(1, 30)} & ${utils.rInt(1, 30)} \\end{pmatrix}`
                ),
                explanation: `Multiply each element by ${k}: (${k}×${a11}, ${k}×${a12}; ${k}×${a21}, ${k}×${a22}) = (${k * a11}, ${k * a12}; ${k * a21}, ${k * a22}).`,
                calc: true
            };
        } else if (questionType === 3) {
            // Matrix multiplication (2×2)
            const a11 = utils.rInt(1, 4);
            const a12 = utils.rInt(1, 4);
            const a21 = utils.rInt(1, 4);
            const a22 = utils.rInt(1, 4);
            
            const b11 = utils.rInt(1, 4);
            const b12 = utils.rInt(1, 4);
            const b21 = utils.rInt(1, 4);
            const b22 = utils.rInt(1, 4);
            
            const c11 = a11 * b11 + a12 * b21;
            const c12 = a11 * b12 + a12 * b22;
            const c21 = a21 * b11 + a22 * b21;
            const c22 = a21 * b12 + a22 * b22;
            
            const correctAnswer = `\\begin{pmatrix} ${c11} & ${c12} \\\\ ${c21} & ${c22} \\end{pmatrix}`;
            
            return {
                tex: `\\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix} \\begin{pmatrix} ${b11} & ${b12} \\\\ ${b21} & ${b22} \\end{pmatrix}`,
                instruction: "Calculate the matrix product",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `\\begin{pmatrix} ${a11 * b11} & ${a12 * b12} \\\\ ${a21 * b21} & ${a22 * b22} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${c11 + 1} & ${c12} \\\\ ${c21} & ${c22} \\end{pmatrix}`,
                        `\\begin{pmatrix} ${a11 + b11} & ${a12 + b12} \\\\ ${a21 + b21} & ${a22 + b22} \\end{pmatrix}`
                    ],
                    () => `\\begin{pmatrix} ${utils.rInt(1, 50)} & ${utils.rInt(1, 50)} \\\\ ${utils.rInt(1, 50)} & ${utils.rInt(1, 50)} \\end{pmatrix}`
                ),
                explanation: `Matrix multiplication: top-left = ${a11}×${b11} + ${a12}×${b21} = ${c11}. Top-right = ${a11}×${b12} + ${a12}×${b22} = ${c12}. Similarly for bottom row.`,
                calc: true
            };
        } else if (questionType === 4) {
            // Determinant of 2×2 matrix
            const a = utils.rInt(1, 6);
            const b = utils.rInt(1, 6);
            const c = utils.rInt(1, 6);
            const d = utils.rInt(1, 6);
            
            const det = a * d - b * c;
            const correctAnswer = `${det}`;
            
            return {
                tex: `\\text{det}\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`,
                instruction: "Calculate the determinant",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `${a * d + b * c}`,
                        `${a + d}`,
                        `${a * d}`
                    ],
                    () => `${utils.rInt(-30, 30)}`
                ),
                explanation: `Determinant = ad - bc = ${a}×${d} - ${b}×${c} = ${a * d} - ${b * c} = ${det}.`,
                calc: true
            };
        } else if (questionType === 5) {
            // Inverse of 2×2 matrix (when determinant is simple)
            const a = utils.rInt(2, 4);
            const b = utils.rInt(1, 3);
            const c = utils.rInt(1, 3);
            const d = utils.rInt(2, 4);
            
            const det = a * d - b * c;
            
            // Only generate if determinant is non-zero and simple
            if (det !== 0 && Math.abs(det) <= 10) {
                const correctAnswer = `\\frac{1}{${det}}\\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix}`;
                
                return {
                    tex: `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}^{-1}`,
                    instruction: "Find the inverse matrix",
                    displayAnswer: correctAnswer,
                    distractors: utils.ensureUniqueDistractors(
                        correctAnswer,
                        [
                            `\\frac{1}{${det}}\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`,
                            `\\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix}`,
                            `\\frac{1}{${det}}\\begin{pmatrix} ${d} & ${b} \\\\ ${c} & ${a} \\end{pmatrix}`
                        ],
                        () => `\\frac{1}{${utils.rInt(1, 10)}}\\begin{pmatrix} ${utils.rInt(1, 10)} & ${utils.rInt(-10, 10)} \\\\ ${utils.rInt(-10, 10)} & ${utils.rInt(1, 10)} \\end{pmatrix}`
                    ),
                    explanation: `For a 2×2 matrix, A⁻¹ = (1/det(A)) × [[d, -b], [-c, a]]. Here det = ${a}×${d} - ${b}×${c} = ${det}. So A⁻¹ = (1/${det})[[${d}, ${-b}], [${-c}, ${a}]].`,
                    calc: true
                };
            }
            // Fallback to determinant if inverse is complex
            return this.getMatrixQuestion(); // Recursive call
        } else {
            // Identity matrix property
            const a11 = utils.rInt(1, 5);
            const a12 = utils.rInt(1, 5);
            const a21 = utils.rInt(1, 5);
            const a22 = utils.rInt(1, 5);
            
            const correctAnswer = `\\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix}`;
            
            return {
                tex: `\\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix} \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}`,
                instruction: "Multiply by the identity matrix",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `\\begin{pmatrix} ${a11 + 1} & ${a12} \\\\ ${a21} & ${a22 + 1} \\end{pmatrix}`,
                        `\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}`,
                        `\\begin{pmatrix} ${a11} & 0 \\\\ 0 & ${a22} \\end{pmatrix}`
                    ],
                    () => `\\begin{pmatrix} ${utils.rInt(1, 10)} & ${utils.rInt(1, 10)} \\\\ ${utils.rInt(1, 10)} & ${utils.rInt(1, 10)} \\end{pmatrix}`
                ),
                explanation: `The identity matrix I leaves any matrix unchanged: AI = IA = A. So the answer is the original matrix.`,
                calc: false
            };
        }
    }
};
