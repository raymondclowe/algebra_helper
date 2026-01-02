// Advanced Probability Question Templates
// Level 23-24
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.AdvancedProbability = {
    getAdvancedProbability: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 9);
                
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
                        () => `${utils.roundToClean(Math.random() * 0.9 + 0.1, 2)}`
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
                        () => `${utils.roundToClean(Math.random() * 0.9 + 0.1, 2)}`
                    );
                    
                    return {
                        tex: `\\text{If A and B are independent:}\\\\[0.5em]P(A) = ${pA},\\\\[0.5em]P(B) = ${pB}`,
                        instruction: "Calculate P(A and B)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `For independent events: P(A and B) = P(A) × P(B) = ${pA} × ${pB} = ${pBoth}.`,
                        calc: false
                    };
                } else if (questionType === 3) {
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
                } else if (questionType === 4) {
                    // Definition: Conditional probability
                    const correctAnswer = `P(B|A) = \\frac{P(A \\cap B)}{P(A)}`;
                    const candidateDistractors = [
                        `P(B|A) = P(A) \\times P(B)`,
                        `P(B|A) = P(B) - P(A)`,
                        `P(B|A) = \\frac{P(A)}{P(B)}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random formula}`
                    );
                    
                    return {
                        tex: `\\text{State the formula for conditional}\\\\[0.5em]\\text{probability P(B|A)}`,
                        instruction: "Select the correct formula",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Conditional probability P(B|A) means "the probability of B given that A has occurred." Formula: P(B|A) = P(A∩B)/P(A), where P(A∩B) is the probability of both events occurring and P(A) is the probability of A. This assumes P(A) > 0.`,
                        calc: false
                    };
                } else if (questionType === 5) {
                    // Definition: Independent events
                    const correctAnswer = `P(A \\cap B) = P(A) \\times P(B)`;
                    const candidateDistractors = [
                        `P(A \\cap B) = P(A) + P(B)`,
                        `P(A|B) = P(B|A)`,
                        `P(A) = P(B)`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random formula}`
                    );
                    
                    return {
                        tex: `\\text{When are two events A and B}\\\\[0.5em]\\text{independent?}`,
                        instruction: "Select the correct condition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Events A and B are independent if the occurrence of one doesn't affect the probability of the other. Mathematically: P(A∩B) = P(A) × P(B). Equivalently, P(A|B) = P(A) and P(B|A) = P(B). For example, consecutive coin flips are independent.`,
                        calc: false
                    };
                } else if (questionType === 6) {
                    // Expected value definition
                    const correctAnswer = `E(X) = \\sum x \\cdot P(x) \\text{ (weighted average)}`;
                    const candidateDistractors = [
                        `E(X) = \\text{most likely outcome}`,
                        `E(X) = \\text{median of outcomes}`,
                        `E(X) = \\sum P(x)`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{Define expected value E(X)}\\\\[0.5em]\\text{for a discrete random variable}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Expected value E(X) is the weighted average of all possible values, where each value is weighted by its probability. Formula: E(X) = Σ[x × P(x)]. It represents the long-run average value if the experiment is repeated many times. Note: E(X) doesn't have to be a possible outcome.`,
                        calc: false
                    };
                } else if (questionType === 7) {
                    // More complex conditional probability
                    const total = 100;
                    const eventA = utils.rInt(50, 70);
                    const eventB = utils.rInt(40, 60);
                    const both = utils.rInt(20, Math.min(30, eventA, eventB));
                    const correctAnswer = `${utils.roundToClean(both / eventB, 2)}`;
                    
                    const candidateDistractors = [
                        `${utils.roundToClean(both / total, 2)}`,
                        `${utils.roundToClean(eventA / total, 2)}`,
                        `${utils.roundToClean(both / eventA, 2)}`
                    ];
                    
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.roundToClean(Math.random() * 0.9 + 0.1, 2)}`
                    );
                    
                    return {
                        tex: `P(A) = ${utils.roundToClean(eventA / total, 2)},\\\\[0.5em]P(B) = ${utils.roundToClean(eventB / total, 2)},\\\\[0.5em]P(A \\cap B) = ${utils.roundToClean(both / total, 2)}`,
                        instruction: "Calculate P(A|B)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `P(A|B) = P(A∩B)/P(B) = ${utils.roundToClean(both / total, 2)}/${utils.roundToClean(eventB / total, 2)} = ${both}/${eventB} ≈ ${utils.roundToClean(both / eventB, 2)}.`,
                        calc: true
                    };
                } else if (questionType === 8) {
                    // Independent events with fractions
                    const pA = [0.25, 0.3, 0.4, 0.5, 0.6][utils.rInt(0, 4)];
                    const pB = [0.2, 0.4, 0.5][utils.rInt(0, 2)];
                    const pBoth = utils.roundToClean(pA * pB, 2);
                    const correctAnswer = `${pBoth}`;
                    
                    const candidateDistractors = [
                        `${utils.roundToClean(pA + pB, 2)}`,
                        `${utils.roundToClean(pA + pB - pBoth, 2)}`,
                        `${Math.max(pA, pB)}`
                    ];
                    
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.roundToClean(Math.random() * 0.9 + 0.1, 2)}`
                    );
                    
                    return {
                        tex: `\\text{Events A and B are independent.}\\\\[0.5em]P(A) = ${pA}, \\; P(B) = ${pB}`,
                        instruction: "Find P(A and B)",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `For independent events: P(A and B) = P(A) × P(B) = ${pA} × ${pB} = ${pBoth}.`,
                        calc: false
                    };
                } else {
                    // Variance concept (simplified)
                    const correctAnswer = `\\text{The average squared deviation from the mean}`;
                    const candidateDistractors = [
                        `\\text{The square root of standard deviation}`,
                        `\\text{The difference between max and min}`,
                        `\\text{The most common value}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{What is variance in probability?}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Variance measures the spread of a probability distribution. It's the average of the squared deviations from the mean: Var(X) = E[(X - μ)²] = E[X²] - (E[X])². Standard deviation is the square root of variance. Larger variance means more spread out values.`,
                        calc: false
                    };
                }
    }
};
