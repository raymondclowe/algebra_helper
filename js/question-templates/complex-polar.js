// Complex Numbers Polar Form Question Templates
// Level 29-30: Polar and Exponential Forms of Complex Numbers
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.ComplexPolar = {
    // Complex numbers in polar form
    getComplexPolarQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 5);
        
        if (questionType === 1) {
            // Convert from Cartesian to polar (simple cases)
            const choices = [
                { x: 1, y: 1, r: '\\sqrt{2}', theta: '\\frac{\\pi}{4}' },
                { x: 1, y: Math.sqrt(3), r: 2, theta: '\\frac{\\pi}{3}' },
                { x: 0, y: 1, r: 1, theta: '\\frac{\\pi}{2}' },
                { x: -1, y: 0, r: 1, theta: '\\pi' },
                { x: -1, y: 1, r: '\\sqrt{2}', theta: '\\frac{3\\pi}{4}' },
                { x: 1, y: 0, r: 1, theta: '0' }
            ];
            
            const choice = choices[utils.rInt(0, choices.length - 1)];
            const correctAnswer = `${choice.r}e^{i${choice.theta}}`;
            
            return {
                tex: `${choice.x} + ${choice.y === 1 ? '' : choice.y}i`,
                instruction: utils.toUnicodeFunction("Express in polar form r·e^(iθ)"),
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `${choice.r}e^{-i${choice.theta}}`,
                        `${choice.x}e^{i${choice.theta}}`,
                        `${choice.y}e^{i${choice.theta}}`
                    ],
                    () => {
                        const randomChoice = choices[utils.rInt(0, choices.length - 1)];
                        return `${randomChoice.r}e^{i${randomChoice.theta}}`;
                    }
                ),
                explanation: `For z = ${choice.x} + ${choice.y}i, modulus r = √(${choice.x}² + ${choice.y}²) = ${choice.r}, argument θ = ${choice.theta}. Polar form: z = r·e^(iθ) = ${correctAnswer}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // De Moivre's theorem - simple case
            const r = utils.rInt(2, 4);
            const n = utils.rInt(2, 4);
            const thetaChoices = ['\\frac{\\pi}{6}', '\\frac{\\pi}{4}', '\\frac{\\pi}{3}', '\\frac{\\pi}{2}'];
            const theta = thetaChoices[utils.rInt(0, thetaChoices.length - 1)];
            
            // Calculate r^n
            const rn = Math.pow(r, n);
            
            const correctAnswer = `${rn}e^{i${n}${theta}}`;
            
            return {
                tex: `\\left(${r}e^{i${theta}}\\right)^${n}`,
                instruction: "Use De Moivre's theorem to simplify",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `${r}e^{i${n}${theta}}`,
                        `${rn}e^{i${theta}}`,
                        `${r * n}e^{i${n}${theta}}`
                    ],
                    () => `${utils.rInt(1, 100)}e^{i${utils.rInt(1, 10)}${theta}}`
                ),
                explanation: `By De Moivre's theorem: (r·e^(iθ))^n = r^n·e^(inθ). Here: (${r}e^(i${theta}))^${n} = ${r}^${n}·e^(i·${n}·${theta}) = ${rn}e^(i${n}${theta}).`,
                calc: true
            };
        } else if (questionType === 3) {
            // Convert polar to Cartesian (simple angles)
            const r = utils.rInt(2, 5);
            const angleChoices = [
                { display: '0', cos: 1, sin: 0 },
                { display: '\\frac{\\pi}{2}', cos: 0, sin: 1 },
                { display: '\\pi', cos: -1, sin: 0 },
                { display: '\\frac{3\\pi}{2}', cos: 0, sin: -1 }
            ];
            
            const angle = angleChoices[utils.rInt(0, angleChoices.length - 1)];
            const x = r * angle.cos;
            const y = r * angle.sin;
            
            let correctAnswer;
            if (y === 0) {
                correctAnswer = `${x}`;
            } else if (x === 0) {
                correctAnswer = `${y}i`;
            } else {
                correctAnswer = `${x} + ${y}i`;
            }
            
            return {
                tex: `${r}e^{i${angle.display}}`,
                instruction: "Convert to Cartesian form a + bi",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `${r} + ${r}i`,
                        `${x + 1} + ${y}i`,
                        y === 0 ? `${x}i` : `${y}`
                    ],
                    () => {
                        const rx = utils.rInt(-10, 10);
                        const ry = utils.rInt(-10, 10);
                        return ry === 0 ? `${rx}` : `${rx} + ${ry}i`;
                    }
                ),
                explanation: `Using Euler's formula: z = r·e^(iθ) = r(cos θ + i·sin θ). Here: ${r}(cos(${angle.display}) + i·sin(${angle.display})) = ${r}(${angle.cos} + i·${angle.sin}) = ${correctAnswer}.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Multiplication in polar form
            const r1 = utils.rInt(2, 4);
            const r2 = utils.rInt(2, 4);
            const theta1 = '\\frac{\\pi}{6}';
            const theta2 = '\\frac{\\pi}{3}';
            
            const r_product = r1 * r2;
            const correctAnswer = `${r_product}e^{i\\frac{\\pi}{2}}`;
            
            return {
                tex: `${r1}e^{i${theta1}} \\times ${r2}e^{i${theta2}}`,
                instruction: "Multiply the complex numbers in polar form",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `${r1 + r2}e^{i\\frac{\\pi}{2}}`,
                        `${r_product}e^{i${theta1}}`,
                        `${r_product}e^{i\\frac{\\pi}{18}}`
                    ],
                    () => `${utils.rInt(1, 20)}e^{i\\frac{\\pi}{${utils.rInt(2, 8)}}}`
                ),
                explanation: `When multiplying in polar form: r₁e^(iθ₁) × r₂e^(iθ₂) = (r₁r₂)e^(i(θ₁+θ₂)). Here: ${r1}×${r2} = ${r_product}, and π/6 + π/3 = π/6 + 2π/6 = 3π/6 = π/2.`,
                calc: true
            };
        } else {
            // Division in polar form
            const r1 = utils.rInt(4, 8);
            const r2 = utils.rInt(2, 4);
            const theta1 = '\\frac{2\\pi}{3}';
            const theta2 = '\\frac{\\pi}{3}';
            
            const r_quotient = r1 / r2;
            const correctAnswer = `${r_quotient}e^{i\\frac{\\pi}{3}}`;
            
            return {
                tex: `\\frac{${r1}e^{i${theta1}}}{${r2}e^{i${theta2}}}`,
                instruction: "Divide the complex numbers in polar form",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    [
                        `${r_quotient}e^{i${theta1}}`,
                        `${r1 - r2}e^{i\\frac{\\pi}{3}}`,
                        `${r_quotient}e^{i\\pi}`
                    ],
                    () => `${utils.rInt(1, 10)}e^{i\\frac{\\pi}{${utils.rInt(2, 8)}}}`
                ),
                explanation: `When dividing in polar form: (r₁e^(iθ₁))/(r₂e^(iθ₂)) = (r₁/r₂)e^(i(θ₁-θ₂)). Here: ${r1}/${r2} = ${r_quotient}, and 2π/3 - π/3 = π/3.`,
                calc: true
            };
        }
    }
};
