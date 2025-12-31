// Advanced Probability Question Templates
// Level 23-24
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.AdvancedProbability = {
    getAdvancedProbability: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 3);
                
                if (questionType === 1) {
                    // Conditional probability
                    const total = 100;
                    const eventA = utils.rInt(40, 60);
                    const both = utils.rInt(15, Math.min(30, eventA));
                    const correctAnswer = `${utils.roundToClean(both / eventA, 2)}`;
                    
                    const candidateDistractors = [
                        `${utils.roundToClean(both / total, 2)}`,
                        `${utils.roundToClean(eventA / total, 2)}`,
                        `${utils.roundToClean((eventA - both) / total, 2)}`
                    ];
                    
                    // Use fraction-aware deduplication for decimal probabilities
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => utils.roundToClean(Math.random() * 0.9 + 0.1, 2).toString()
                    );
                    
                    return {
                        tex: `P(A) = ${utils.roundToClean(eventA / total, 2)},\\\\[0.5em]P(A \\cap B) = ${utils.roundToClean(both / total, 2)}`,
                        instruction: "Calculate P(B|A)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Apply the formula for conditional probability: P(B|A) = P(A∩B)/P(A) = ${utils.roundToClean(both / total, 2)}/${utils.roundToClean(eventA / total, 2)} = ${both}/${eventA} ≈ ${utils.roundToClean(both / eventA, 2)}.`,
                        calc: true
                    };
                } else if (questionType === 2) {
                    // Independent events: P(A and B) = P(A) × P(B)
                    const pA = [0.3, 0.4, 0.5, 0.6][utils.rInt(0, 3)];
                    const pB = [0.2, 0.3, 0.5][utils.rInt(0, 2)];
                    const pBoth = utils.roundToClean(pA * pB, 2);  // Round to avoid floating-point errors
                    const correctAnswer = `${pBoth}`;
                    
                    const candidateDistractors = [
                        `${utils.roundToClean(pA + pB, 2)}`,
                        `${pA}`,
                        `${pB}`
                    ];
                    
                    // Use fraction-aware deduplication
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => utils.roundToClean(Math.random() * 0.9 + 0.1, 2).toString()
                    );
                    
                    return {
                        tex: `\\text{If A and B are independent:}\\\\[0.5em]P(A) = ${pA},\\\\[0.5em]P(B) = ${pB}`,
                        instruction: "Calculate P(A and B)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `For independent events: P(A and B) = P(A) × P(B) = ${pA} × ${pB} = ${pBoth}.`,
                        calc: false
                    };
                } else {
                    // Expected value
                    const outcomes = [1, 2, 3, 4, 5, 6];
                    const probs = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
                    const ev = utils.roundToClean(outcomes.reduce((sum, val, i) => sum + val * probs[i], 0), 1);
                    const correctAnswer = `${ev}`;
                    
                    const candidateDistractors = [
                        `${3}`,
                        `${4}`,
                        `${6}`
                    ];
                    
                    // Use fraction-aware deduplication
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 10)}`
                    );
                    
                    return {
                        tex: `\\text{Fair die: outcomes 1-6,}\\\\[0.5em]\\text{each with P = 1/6}`,
                        instruction: "Calculate E(X)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Expected value E(X) = Σ(x × P(x)) = 1(1/6) + 2(1/6) + ... + 6(1/6) = (1+2+3+4+5+6)/6 = 21/6 = ${ev}.`,
                        calc: false
                    };
                }
    }
};
