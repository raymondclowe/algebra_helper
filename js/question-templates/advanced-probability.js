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
                    const correctAnswer = `${(both / eventA).toFixed(2)}`;
                    
                    const candidateDistractors = [
                        `${(both / total).toFixed(2)}`,
                        `${(eventA / total).toFixed(2)}`,
                        `${((eventA - both) / total).toFixed(2)}`
                    ];
                    
                    // Use fraction-aware deduplication for decimal probabilities
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => (Math.random() * 0.9 + 0.1).toFixed(2)
                    );
                    
                    return {
                        tex: `P(A) = ${eventA / total},\\\\[0.5em]P(A \\cap B) = ${both / total}`,
                        instruction: "Calculate P(B|A)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Apply the formula for conditional probability: P(B|A) = P(A∩B)/P(A) = ${both / total}/${eventA / total} = ${both}/${eventA} ≈ ${(both / eventA).toFixed(2)}.`,
                        calc: true
                    };
                } else if (questionType === 2) {
                    // Independent events: P(A and B) = P(A) × P(B)
                    const pA = [0.3, 0.4, 0.5, 0.6][utils.rInt(0, 3)];
                    const pB = [0.2, 0.3, 0.5][utils.rInt(0, 2)];
                    const pBoth = pA * pB;
                    const correctAnswer = `${pBoth}`;
                    
                    const candidateDistractors = [
                        `${pA + pB}`,
                        `${pA}`,
                        `${pB}`
                    ];
                    
                    // Use fraction-aware deduplication
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => (Math.random() * 0.9 + 0.1).toFixed(2)
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
                    const ev = outcomes.reduce((sum, val, i) => sum + val * probs[i], 0);
                    const correctAnswer = `${ev.toFixed(1)}`;
                    
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
                        explanation: `Expected value E(X) = Σ(x × P(x)) = 1(1/6) + 2(1/6) + ... + 6(1/6) = (1+2+3+4+5+6)/6 = 21/6 = ${ev.toFixed(1)}.`,
                        calc: false
                    };
                }
    }
};
