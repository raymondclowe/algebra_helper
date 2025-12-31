// Trigonometry Question Templates
// Level 15-16
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Trigonometry = {
    getTrigonometry: function() {
        const utils = window.GeneratorUtils;
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
                    const candidateDistractors = [`${angle.cos}`, `${angle.tan}`, `${angle.deg / 90}`];
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
                        instruction: "Calculate (use exact values)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `sin(${angle.deg}°) = ${angle.sin}. This is one of the standard angles you should memorize.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Find cos of angle
                    const correctAnswer = `${angle.cos}`;
                    // Use a clearer way to compute a plausible distractor
                    const complementDistractor = angle.sinVal ? `${(1 - angle.sinVal).toFixed(3)}` : `${1 - Number(angle.sin)}`;
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
                        instruction: "Calculate (use exact values)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `cos(${angle.deg}°) = ${angle.cos}. Remember: cos(θ) is the x-coordinate on the unit circle.`,
                        calc: false
                    };
                } else {
                    // Find tan of angle (avoid 90°)
                    const validAngles = angles.filter(a => a.deg !== 90);
                    const tanAngle = validAngles[utils.rInt(0, validAngles.length - 1)];
                    const correctAnswer = `${tanAngle.tan}`;
                    const candidateDistractors = [`${tanAngle.sin}`, `${tanAngle.cos}`, `${tanAngle.deg / 45}`];
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
                        instruction: "Calculate (use exact values)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `tan(${tanAngle.deg}°) = ${tanAngle.tan}. Remember: tan(θ) = sin(θ)/cos(θ).`,
                        calc: false
                    };
                }
    }
};
