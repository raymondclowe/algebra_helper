// Trigonometry Question Templates
// Level 15-16
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Trigonometry = {
    getTrigonometry: function() {
        const utils = window.GeneratorUtils;
        
        // Check if diagram mode is forced via testing parameters
        let shouldGenerateDiagram;
        if (window.FORCED_DIAGRAM_MODE !== null && window.FORCED_DIAGRAM_MODE !== undefined) {
            // Force diagram or text/formula based on URL parameter
            shouldGenerateDiagram = window.FORCED_DIAGRAM_MODE;
        } else {
            // About 50% of the time, generate a diagram-based question instead
            shouldGenerateDiagram = Math.random() < 0.5;
        }
        
        if (shouldGenerateDiagram && window.QuestionTemplates.TrigDiagramGenerator) {
            // Randomly choose calculator or non-calculator mode for diagram questions
            const isCalc = Math.random() < 0.5;
            return window.QuestionTemplates.TrigDiagramGenerator.getTrigDiagramQuestion(isCalc);
        }
        
        const questionType = utils.getQuestionType(1, 3);
                
                // Common angles in degrees and their trig values
                const angles = [
                    { deg: 0, sin: 0, cos: 1, tan: 0 },
                    { deg: 30, sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '\\frac{1}{\\sqrt{3}}', sinVal: 0.5, cosVal: 0.866, tanVal: 0.577 },
                    { deg: 45, sin: '\\frac{1}{\\sqrt{2}}', cos: '\\frac{1}{\\sqrt{2}}', tan: 1, sinVal: 0.707, cosVal: 0.707, tanVal: 1 },
                    { deg: 60, sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '\\sqrt{3}', sinVal: 0.866, cosVal: 0.5, tanVal: 1.732 },
                    { deg: 90, sin: 1, cos: 0, tan: '\\text{undefined}', sinVal: 1, cosVal: 0, tanVal: Infinity }
                ];
                
                const angle = angles[utils.rInt(0, 3)]; // Exclude 90 for most cases
                
                if (questionType === 1) {
                    // Find sin of angle
                    const correctAnswer = `${angle.sin}`;
                    const candidateDistractors = [`${angle.cos}`, `${angle.tan}`, `${utils.roundToClean(angle.deg / 90)}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const altAngles = ['0', '\\frac{1}{2}', '\\frac{1}{\\sqrt{2}}', '\\frac{\\sqrt{3}}{2}', '1'];
                            return altAngles[utils.rInt(0, altAngles.length - 1)];
                        }
                    );
                    return {
                        tex: `\\sin(${angle.deg}°)`,
                        instruction: "Find the exact value",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `sin(${angle.deg}°) = ${angle.sin}. This is a standard result for special angles.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Find cos of angle
                    const correctAnswer = `${angle.cos}`;
                    // Use a clearer way to compute a plausible distractor
                    const complementDistractor = angle.sinVal ? `${utils.roundToClean(1 - angle.sinVal, 3)}` : `${utils.roundToClean(1 - Number(angle.sin))}`;
                    const candidateDistractors = [`${angle.sin}`, `${angle.tan}`, complementDistractor];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const altAngles = ['0', '\\frac{1}{2}', '\\frac{1}{\\sqrt{2}}', '\\frac{\\sqrt{3}}{2}', '1'];
                            return altAngles[utils.rInt(0, altAngles.length - 1)];
                        }
                    );
                    return {
                        tex: `\\cos(${angle.deg}°)`,
                        instruction: "Find the exact value",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `cos(${angle.deg}°) = ${angle.cos}. Note that cos(θ) represents the x-coordinate on the unit circle.`,
                        calc: false
                    };
                } else {
                    // Find tan of angle (avoid 90°)
                    const validAngles = angles.filter(a => a.deg !== 90);
                    const tanAngle = validAngles[utils.rInt(0, validAngles.length - 1)];
                    const correctAnswer = `${tanAngle.tan}`;
                    const candidateDistractors = [`${tanAngle.sin}`, `${tanAngle.cos}`, `${utils.roundToClean(tanAngle.deg / 45)}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const altAngles = ['0', '\\frac{1}{\\sqrt{3}}', '1', '\\sqrt{3}'];
                            return altAngles[utils.rInt(0, altAngles.length - 1)];
                        }
                    );
                    return {
                        tex: `\\tan(${tanAngle.deg}°)`,
                        instruction: "Find the exact value",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `tan(${tanAngle.deg}°) = ${tanAngle.tan}. Note that tan(θ) = sin(θ)/cos(θ).`,
                        calc: false
                    };
                }
    },
    
    getSineCosineLawQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 8);
        
        if (questionType === 1) {
            // Sine rule: find side using a/sin(A) = b/sin(B)
            const A = [30, 45, 60][utils.rInt(0, 2)];
            let B = [30, 45, 60][utils.rInt(0, 2)];
            if (A === B) {
                // Pick a different angle
                const angles = [30, 45, 60].filter(angle => angle !== A);
                B = angles[utils.rInt(0, angles.length - 1)];
            }
            const a = utils.rInt(5, 12);
            // b = a * sin(B) / sin(A)
            const sinA = Math.sin(A * Math.PI / 180);
            const sinB = Math.sin(B * Math.PI / 180);
            const b = a * sinB / sinA;
            const bRounded = Math.round(b * 100) / 100;
            
            const correctAnswer = `${bRounded}`;
            const candidateDistractors = [
                `${Math.round(a * sinA / sinB * 100) / 100}`,  // Inverted ratio
                `${Math.round(a * sinB * 100) / 100}`,  // Forgot to divide
                `${a}`  // Didn't apply sine rule
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${Math.round(utils.rInt(5, 20) * 100) / 100}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Triangle: } A = ${A}°, B = ${B}°, a = ${a}\\\\[0.5em]\\text{Find side b using sine rule}`),
                instruction: "Calculate (round to 2 dp)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Sine rule: a/sin(A) = b/sin(B). So b = a·sin(B)/sin(A) = ${a}·sin(${B}°)/sin(${A}°) = ${a}·${sinB.toFixed(3)}/${sinA.toFixed(3)} ≈ ${bRounded}.`,
                calc: true
            };
        } else if (questionType === 2) {
            // Cosine rule: find side c² = a² + b² - 2ab·cos(C)
            const a = utils.rInt(5, 10);
            const b = utils.rInt(5, 10);
            const C = [60, 90, 120][utils.rInt(0, 2)];
            const cosC = Math.cos(C * Math.PI / 180);
            const cSquared = a*a + b*b - 2*a*b*cosC;
            const c = Math.sqrt(cSquared);
            const cRounded = Math.round(c * 100) / 100;
            
            const correctAnswer = `${cRounded}`;
            const candidateDistractors = [
                `${Math.round(Math.sqrt(a*a + b*b) * 100) / 100}`,  // Forgot cosine term
                `${Math.round(Math.sqrt(a*a + b*b + 2*a*b*cosC) * 100) / 100}`,  // Wrong sign
                `${Math.round((a + b) * 100) / 100}`  // Just added sides
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${Math.round(utils.rInt(5, 20) * 100) / 100}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Triangle: } a = ${a}, b = ${b}, C = ${C}°\\\\[0.5em]\\text{Find side c using cosine rule}`),
                instruction: "Calculate (round to 2 dp)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Cosine rule: c² = a² + b² - 2ab·cos(C) = ${a}² + ${b}² - 2(${a})(${b})cos(${C}°) = ${a*a} + ${b*b} - ${2*a*b}(${cosC.toFixed(3)}) = ${cSquared.toFixed(2)}. So c = √${cSquared.toFixed(2)} ≈ ${cRounded}.`,
                calc: true
            };
        } else if (questionType === 3) {
            // When to use sine rule vs cosine rule
            const scenarios = [
                { given: "Two angles and one side (AAS)", rule: "Sine rule" },
                { given: "Two sides and included angle (SAS)", rule: "Cosine rule" },
                { given: "All three sides (SSS)", rule: "Cosine rule" },
                { given: "Two sides and non-included angle (SSA)", rule: "Sine rule" }
            ];
            const scenario = scenarios[utils.rInt(0, scenarios.length - 1)];
            
            const correctAnswer = scenario.rule;
            const candidateDistractors = [
                scenario.rule === "Sine rule" ? "Cosine rule" : "Sine rule",  // Opposite
                "Pythagorean theorem",  // Related but different
                "Neither rule applies"  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => ["Sine rule", "Cosine rule", "Tangent rule"][utils.rInt(0, 2)]
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Given: ${scenario.given}}\\\\[0.5em]\\text{Which rule should you use?}`),
                instruction: "Select the appropriate rule",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `${scenario.given}: Use ${scenario.rule}. Sine rule works with angle-side pairs. Cosine rule works when you have two sides and the included angle (SAS) or all three sides (SSS).`,
                calc: false
            };
        } else if (questionType === 4) {
            // Triangle area using ½ab·sin(C)
            const a = utils.rInt(4, 10);
            const b = utils.rInt(4, 10);
            const C = [30, 45, 60, 90][utils.rInt(0, 3)];
            const sinC = Math.sin(C * Math.PI / 180);
            const area = 0.5 * a * b * sinC;
            const areaRounded = Math.round(area * 100) / 100;
            
            const correctAnswer = `${areaRounded}`;
            const candidateDistractors = [
                `${Math.round(a * b * 100) / 100}`,  // Forgot ½ and sin
                `${Math.round(0.5 * a * b * 100) / 100}`,  // Forgot sin(C)
                `${Math.round(a * b * sinC * 100) / 100}`  // Forgot ½
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${Math.round(utils.rInt(10, 50) * 100) / 100}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Triangle: } a = ${a}, b = ${b}, C = ${C}°\\\\[0.5em]\\text{Find the area}`),
                instruction: "Calculate (round to 2 dp)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Area = ½ab·sin(C) = ½(${a})(${b})sin(${C}°) = ½(${a * b})(${sinC.toFixed(3)}) = ${areaRounded}.`,
                calc: true
            };
        } else if (questionType === 5) {
            // Find angle using sine rule: sin(A)/a = sin(B)/b
            const a = 10;
            const A = [30, 45, 60][utils.rInt(0, 2)];
            const b = utils.rInt(6, 9);
            const sinA = Math.sin(A * Math.PI / 180);
            const sinB = b * sinA / a;
            const B = Math.asin(sinB) * 180 / Math.PI;
            const BRounded = Math.round(B * 10) / 10;
            
            const correctAnswer = `${BRounded}°`;
            const candidateDistractors = [
                `${Math.round((90 - BRounded) * 10) / 10}°`,  // Complementary angle
                `${Math.round((180 - BRounded) * 10) / 10}°`,  // Supplementary angle
                `${A}°`  // Used wrong angle
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${Math.round(utils.rInt(20, 80) * 10) / 10}°`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Triangle: } a = ${a}, A = ${A}°, b = ${b}\\\\[0.5em]\\text{Find angle B using sine rule}`),
                instruction: "Calculate (round to 1 dp)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Sine rule: sin(A)/a = sin(B)/b. So sin(B) = b·sin(A)/a = ${b}·sin(${A}°)/${a} = ${b}·${sinA.toFixed(3)}/${a} = ${sinB.toFixed(3)}. Therefore B = sin⁻¹(${sinB.toFixed(3)}) ≈ ${BRounded}°.`,
                calc: true
            };
        } else if (questionType === 6) {
            // Find angle using cosine rule: cos(C) = (a² + b² - c²)/(2ab)
            const a = utils.rInt(6, 10);
            const b = utils.rInt(6, 10);
            const c = utils.rInt(5, 9);
            const cosC = (a*a + b*b - c*c) / (2*a*b);
            const C = Math.acos(cosC) * 180 / Math.PI;
            const CRounded = Math.round(C * 10) / 10;
            
            const correctAnswer = `${CRounded}°`;
            const candidateDistractors = [
                `${Math.round((90 - CRounded) * 10) / 10}°`,  // Complementary
                `${Math.round((180 - CRounded) * 10) / 10}°`,  // Supplementary
                `${Math.round(C * 2 * 10) / 10}°`  // Doubled
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${Math.round(utils.rInt(20, 80) * 10) / 10}°`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Triangle: } a = ${a}, b = ${b}, c = ${c}\\\\[0.5em]\\text{Find angle C using cosine rule}`),
                instruction: "Calculate (round to 1 dp)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Cosine rule: cos(C) = (a² + b² - c²)/(2ab) = (${a}² + ${b}² - ${c}²)/(2·${a}·${b}) = (${a*a} + ${b*b} - ${c*c})/${2*a*b} = ${cosC.toFixed(3)}. Therefore C = cos⁻¹(${cosC.toFixed(3)}) ≈ ${CRounded}°.`,
                calc: true
            };
        } else if (questionType === 7) {
            // Identify the sine rule formula
            const correctAnswer = `\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}`;
            const candidateDistractors = [
                `c^2 = a^2 + b^2 - 2ab\\cos C`,  // Cosine rule
                `\\frac{a}{\\cos A} = \\frac{b}{\\cos B}`,  // Wrong function
                `a^2 + b^2 = c^2`  // Pythagorean theorem
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => [`\\frac{\\sin A}{a} = \\frac{\\sin B}{b}`, `a\\sin A = b\\sin B`, `\\sin A = \\sin B`][utils.rInt(0, 2)]
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{What is the sine rule?}`),
                instruction: "Select the correct formula",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `The sine rule states: a/sin(A) = b/sin(B) = c/sin(C), where a, b, c are sides opposite to angles A, B, C respectively. Used for finding unknown sides or angles.`,
                calc: false
            };
        } else {
            // Identify the cosine rule formula
            const correctAnswer = `c^2 = a^2 + b^2 - 2ab\\cos C`;
            const candidateDistractors = [
                `\\frac{a}{\\sin A} = \\frac{b}{\\sin B}`,  // Sine rule
                `c^2 = a^2 + b^2 + 2ab\\cos C`,  // Wrong sign
                `a^2 + b^2 = c^2`  // Pythagorean theorem
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => [`c = a + b - 2ab\\cos C`, `c^2 = a^2 - b^2 + 2ab\\cos C`, `a^2 = b^2 + c^2`][utils.rInt(0, 2)]
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{What is the cosine rule for side c?}`),
                instruction: "Select the correct formula",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `The cosine rule states: c² = a² + b² - 2ab·cos(C), where c is the side opposite angle C. Used when you know two sides and the included angle (SAS) or all three sides (SSS).`,
                calc: false
            };
        }
    }
};
