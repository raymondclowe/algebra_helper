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
    },
    
    getVectorPlaneEquationQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 6);
        
        if (questionType === 1) {
            // Vector equation of line through point in direction
            const x = utils.rInt(1, 5);
            const y = utils.rInt(1, 5);
            const z = utils.rInt(1, 5);
            const dx = utils.rInt(1, 4);
            const dy = utils.rInt(1, 4);
            const dz = utils.rInt(1, 4);
            
            const correctAnswer = `\\mathbf{r} = \\begin{pmatrix} ${x} \\\\ ${y} \\\\ ${z} \\end{pmatrix} + \\lambda\\begin{pmatrix} ${dx} \\\\ ${dy} \\\\ ${dz} \\end{pmatrix}`;
            const candidateDistractors = [
                `\\mathbf{r} = \\begin{pmatrix} ${dx} \\\\ ${dy} \\\\ ${dz} \\end{pmatrix} + \\lambda\\begin{pmatrix} ${x} \\\\ ${y} \\\\ ${z} \\end{pmatrix}`,  // Swapped
                `\\mathbf{r} = \\begin{pmatrix} ${x + dx} \\\\ ${y + dy} \\\\ ${z + dz} \\end{pmatrix}`,  // No parameter
                `\\lambda = \\begin{pmatrix} ${x} \\\\ ${y} \\\\ ${z} \\end{pmatrix} + \\mathbf{r}\\begin{pmatrix} ${dx} \\\\ ${dy} \\\\ ${dz} \\end{pmatrix}`  // Wrong form
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\mathbf{r} = \\begin{pmatrix} ${utils.rInt(1, 9)} \\\\ ${utils.rInt(1, 9)} \\\\ ${utils.rInt(1, 9)} \\end{pmatrix} + \\lambda\\begin{pmatrix} ${utils.rInt(1, 9)} \\\\ ${utils.rInt(1, 9)} \\\\ ${utils.rInt(1, 9)} \\end{pmatrix}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Line through point } (${x}, ${y}, ${z})\\\\[0.5em]\\text{in direction } (${dx}, ${dy}, ${dz})\\\\[0.5em]\\text{Vector equation?}`),
                instruction: "Write the vector equation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Vector equation of line: r = a + λb where a is position vector of point on line, b is direction vector, λ is parameter. So r = (${x}, ${y}, ${z}) + λ(${dx}, ${dy}, ${dz}).`,
                calc: false
            };
        } else if (questionType === 2) {
            // Given vector equation, find direction vector
            const x = utils.rInt(1, 5);
            const y = utils.rInt(1, 5);
            const z = utils.rInt(1, 5);
            const dx = utils.rInt(1, 4);
            const dy = utils.rInt(1, 4);
            const dz = utils.rInt(1, 4);
            
            const correctAnswer = `\\begin{pmatrix} ${dx} \\\\ ${dy} \\\\ ${dz} \\end{pmatrix}`;
            const candidateDistractors = [
                `\\begin{pmatrix} ${x} \\\\ ${y} \\\\ ${z} \\end{pmatrix}`,  // Position vector
                `\\begin{pmatrix} ${x + dx} \\\\ ${y + dy} \\\\ ${z + dz} \\end{pmatrix}`,  // Sum
                `\\begin{pmatrix} ${dx * 2} \\\\ ${dy * 2} \\\\ ${dz * 2} \\end{pmatrix}`  // Scaled
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\begin{pmatrix} ${utils.rInt(1, 9)} \\\\ ${utils.rInt(1, 9)} \\\\ ${utils.rInt(1, 9)} \\end{pmatrix}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\mathbf{r} = \\begin{pmatrix} ${x} \\\\ ${y} \\\\ ${z} \\end{pmatrix} + t\\begin{pmatrix} ${dx} \\\\ ${dy} \\\\ ${dz} \\end{pmatrix}\\\\[0.5em]\\text{What is the direction vector?}`),
                instruction: "Identify the direction vector",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `In vector equation r = a + tb, the direction vector is b = (${dx}, ${dy}, ${dz}). The parameter t scales this direction vector.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Plane with normal vector through origin
            const a = utils.rInt(1, 5);
            const b = utils.rInt(1, 5);
            const c = utils.rInt(1, 5);
            
            const correctAnswer = `${a}x + ${b}y + ${c}z = 0`;
            const candidateDistractors = [
                `${a}x + ${b}y + ${c}z = 1`,  // Wrong constant
                `x + y + z = ${a + b + c}`,  // Wrong equation
                `\\begin{pmatrix} ${a} \\\\ ${b} \\\\ ${c} \\end{pmatrix} \\cdot \\mathbf{r} = 0`  // Vector form (equivalent but not Cartesian)
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const randA = utils.rInt(1, 6);
                    const randB = utils.rInt(1, 6);
                    const randC = utils.rInt(1, 6);
                    return `${randA}x + ${randB}y + ${randC}z = 0`;
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Plane with normal vector}\\\\[0.5em]\\mathbf{n} = \\begin{pmatrix} ${a} \\\\ ${b} \\\\ ${c} \\end{pmatrix}\\\\[0.5em]\\text{through origin}\\\\[0.5em]\\text{Cartesian equation?}`),
                instruction: "Write the equation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Plane equation: r · n = d. Through origin means d = 0. With normal (${a}, ${b}, ${c}), equation is ${a}x + ${b}y + ${c}z = 0.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Given plane equation, find normal vector
            const a = utils.rInt(1, 5);
            const b = utils.rInt(1, 5);
            const c = utils.rInt(1, 5);
            const d = utils.rInt(1, 9);
            
            const correctAnswer = `\\begin{pmatrix} ${a} \\\\ ${b} \\\\ ${c} \\end{pmatrix}`;
            const candidateDistractors = [
                `\\begin{pmatrix} ${d} \\\\ ${d} \\\\ ${d} \\end{pmatrix}`,  // Using d (wrong)
                `\\begin{pmatrix} ${a} \\\\ ${b} \\\\ ${d} \\end{pmatrix}`,  // Using d instead of c (wrong)
                `\\begin{pmatrix} ${a + 1} \\\\ ${b + 1} \\\\ ${c + 1} \\end{pmatrix}`  // Off by one (wrong)
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\begin{pmatrix} ${utils.rInt(1, 9)} \\\\ ${utils.rInt(1, 9)} \\\\ ${utils.rInt(1, 9)} \\end{pmatrix}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Plane: } ${a}x + ${b}y + ${c}z = ${d}\\\\[0.5em]\\text{What is a normal vector?}`),
                instruction: "Identify a normal vector",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `For plane ax + by + cz = d, a normal vector is n = (a, b, c). So a normal vector is (${a}, ${b}, ${c}). The constant d doesn't appear in the normal vector. Note: (-${a}, -${b}, -${c}) would also be a valid normal vector.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Is point on plane?
            const a = 1;
            const b = 1;
            const c = 1;
            const d = 3;
            const px = 1;
            const py = 1;
            const pz = 1;
            // Check: 1 + 1 + 1 = 3, so yes
            
            const correctAnswer = `\\text{Yes}`;
            const candidateDistractors = [
                `\\text{No}`,  // Wrong
                `\\text{Cannot determine}`,  // Wrong
                `\\text{Only if } x = y = z`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\text{Sometimes}', '\\text{Not enough information}', '\\text{Maybe}'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Is point } (${px}, ${py}, ${pz})\\\\[0.5em]\\text{on plane } x + y + z = ${d}?`),
                instruction: "Check if point satisfies equation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Substitute (${px}, ${py}, ${pz}) into x + y + z = ${d}: ${px} + ${py} + ${pz} = ${px + py + pz} = ${d}. Since this is true, the point is on the plane.`,
                calc: false
            };
        } else {
            // Parametric vs vector equation
            const correctAnswer = `\\mathbf{r} = \\mathbf{a} + \\lambda\\mathbf{b}`;
            const candidateDistractors = [
                `x = x_0 + \\lambda a, y = y_0 + \\lambda b, z = z_0 + \\lambda c`,  // Parametric (alternative form)
                `ax + by + cz = d`,  // Plane equation
                `\\mathbf{r} \\cdot \\mathbf{n} = d`  // Plane in vector form
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\mathbf{r} = \\lambda\\mathbf{a}', '\\mathbf{r} = \\mathbf{a} + \\mathbf{b}', '\\mathbf{r} \\times \\mathbf{b} = 0'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{What is the vector form}\\\\[0.5em]\\text{of a line equation?}`),
                instruction: "Select the general form",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Vector equation of line: r = a + λb where a is position vector of a point on the line, b is direction vector, λ is parameter. This can be expanded to parametric form: x = x₀ + λb₁, y = y₀ + λb₂, z = z₀ + λb₃.`,
                calc: false
            };
        }
    }
};
