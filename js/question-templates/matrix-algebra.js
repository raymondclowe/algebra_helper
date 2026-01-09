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
    },
    
    get3x3SystemQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 5);
        
        if (questionType === 1) {
            // Simple: given x+y+z=sum, what is x+y+z?
            const sum = utils.rInt(5, 12);
            
            const correctAnswer = `${sum}`;
            const candidateDistractors = [
                `${sum * 2}`,  // Doubled
                `${sum - 1}`,  // Off by one
                `0`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(3, 20)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{System: } x + y + z = ${sum}\\\\[0.5em]2x + y + z = ${sum + utils.rInt(1, 3)}\\\\[0.5em]x + 2y + z = ${sum + utils.rInt(1, 3)}\\\\[0.5em]\\text{What is } x + y + z?`),
                instruction: "Find the value",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `From the first equation, x + y + z = ${sum}. This is directly given, regardless of the other equations.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Determinant interpretation: det(A) ≠ 0 means?
            const correctAnswer = `Unique solution`;
            const candidateDistractors = [
                `No solution`,  // Wrong
                `Infinite solutions`,  // Wrong
                `No solution or infinite solutions`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => [`Multiple solutions`, `Exactly two solutions`, `Cannot be determined`][utils.rInt(0, 2)]
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{For a 3×3 system with}\\\\[0.5em]\\text{coefficient matrix A,}\\\\[0.5em]\\text{if det(A) ≠ 0, what does this mean?}`),
                instruction: "Select the correct interpretation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `If det(A) ≠ 0, the coefficient matrix is invertible, which means the system has a unique solution. The matrix has full rank and the equations are linearly independent.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Determinant zero: det(A) = 0 means?
            const correctAnswer = `No solution or infinite solutions`;
            const candidateDistractors = [
                `Unique solution`,  // Wrong
                `Exactly no solution`,  // Too specific
                `Exactly infinite solutions`  // Too specific
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => [`Two solutions`, `Multiple solutions`, `Cannot be determined`][utils.rInt(0, 2)]
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{For a 3×3 system with}\\\\[0.5em]\\text{coefficient matrix A,}\\\\[0.5em]\\text{if det(A) = 0, what are}\\\\[0.5em]\\text{the possibilities?}`),
                instruction: "Select the correct interpretation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `If det(A) = 0, the matrix is singular (not invertible). The system is either inconsistent (no solution) or has infinitely many solutions (dependent equations). Which case depends on whether the right-hand side is consistent with the equations.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Infinite solutions example
            const correctAnswer = `Infinite solutions`;
            const candidateDistractors = [
                `Unique solution`,  // Wrong
                `No solution`,  // Wrong
                `Exactly two solutions`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => [`Three solutions`, `Cannot be determined`, `One solution`][utils.rInt(0, 2)]
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{System:}\\\\[0.5em]x + y + z = 1\\\\[0.5em]2x + 2y + 2z = 2\\\\[0.5em]3x + 3y + 3z = 3\\\\[0.5em]\\text{How many solutions?}`),
                instruction: "Determine the number of solutions",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `All three equations are multiples of each other (the second is 2× the first, third is 3× the first). They represent the same plane in 3D space, so there are infinitely many solutions along this plane. det(A) = 0 and the system is consistent.`,
                calc: false
            };
        } else {
            // Gaussian elimination concept
            const correctAnswer = `Row reduction (Gaussian elimination)`;
            const candidateDistractors = [
                `Cross multiplication`,  // Wrong method
                `Substitution only`,  // Limited method
                `Graphing in 3D`  // Impractical
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => [`Matrix inversion`, `Determinant method`, `Cramer's rule`][utils.rInt(0, 2)]
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{What is the standard method}\\\\[0.5em]\\text{for solving 3×3 linear}\\\\[0.5em]\\text{systems by hand?}`),
                instruction: "Select the most systematic method",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Row reduction (Gaussian elimination) is the standard systematic method. It transforms the augmented matrix [A|b] into row echelon form, making it easy to solve by back-substitution. This method works for systems of any size and reveals whether there's a unique solution, no solution, or infinite solutions.`,
                calc: false
            };
        }
    }
};
