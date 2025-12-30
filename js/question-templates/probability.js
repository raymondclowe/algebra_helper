// Probability Question Templates
// Level 22-23
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Probability = {
    getProbability: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 3);
                
                if (questionType === 1) {
                    // Simple probability: choosing from a bag
                    const total = utils.rInt(8, 15);
                    const favorable = utils.rInt(2, total - 2);
                    const correctAnswer = `\\frac{${favorable}}{${total}}`;
                    
                    // Generate candidate distractors
                    const candidateDistractors = [
                        `\\frac{${total - favorable}}{${total}}`,
                        `\\frac{${favorable}}{${total - favorable}}`,
                        `\\frac{${total}}{${favorable}}`
                    ];
                    
                    // Use fraction-aware deduplication to ensure no mathematical equivalence
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            // Generate alternative wrong fractions
                            const wrongNum = utils.rInt(1, total);
                            const wrongDen = utils.rInt(2, total + 5);
                            return `\\frac{${wrongNum}}{${wrongDen}}`;
                        }
                    );
                    
                    return {
                        tex: `\\text{Bag has ${total} balls,}\\\\[0.5em]\\text{${favorable} are red.}\\\\[0.5em]\\text{P(red) = ?}`,
                        instruction: "Find the probability",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Probability = (favorable outcomes)/(total outcomes) = ${favorable}/${total}. This can be simplified if needed.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Choosing multiple items
                    const total = utils.rInt(6, 10);
                    const choose = utils.rInt(2, 3);
                    const black = utils.rInt(1, 3);
                    const correctAnswer = `\\text{Use combinations: } C(${total}, ${choose})`;
                    
                    const candidateDistractors = [
                        `${total - choose}`,
                        `${total} \\times ${choose}`,
                        `\\frac{${total}}{${choose}}`
                    ];
                    
                    // Use standard deduplication (not fraction-specific for this type)
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `C(${utils.rInt(3, 12)}, ${utils.rInt(1, 4)})`
                    );
                    
                    return {
                        tex: `\\text{Choosing ${choose} balls from ${total},}\\\\[0.5em]\\text{where ${black} is black}`,
                        instruction: "This is a probability setup question",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The total number of ways to choose ${choose} balls from ${total} is C(${total},${choose}) = ${total}!/((${total - choose})!×${choose}!). This is a combination problem.`,
                        calc: true
                    };
                } else {
                    // Complementary probability
                    const total = utils.rInt(10, 20);
                    const favorable = utils.rInt(3, 7);
                    const complement = total - favorable;
                    const correctAnswer = `\\frac{${complement}}{${total}}`;
                    
                    const candidateDistractors = [
                        `\\frac{${favorable}}{${total}}`,
                        `\\frac{${total}}{${complement}}`,
                        `1 - \\frac{${complement}}{${total}}`
                    ];
                    
                    // Use fraction-aware deduplication
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            // Generate alternative wrong fractions
                            const wrongNum = utils.rInt(1, total);
                            const wrongDen = utils.rInt(2, total + 5);
                            return `\\frac{${wrongNum}}{${wrongDen}}`;
                        }
                    );
                    
                    return {
                        tex: `\\text{If P(success) = } \\frac{${favorable}}{${total}}\\text{,}\\\\[0.5em]\\text{what is P(failure)?}`,
                        instruction: "Find the complementary probability",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `P(failure) = 1 - P(success) = 1 - ${favorable}/${total} = ${complement}/${total}. The probabilities of all outcomes sum to 1.`,
                        calc: false
                    };
                }
    }
};
