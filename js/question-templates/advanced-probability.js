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
    },
    
    getBayesTheoremQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 5);
        
        if (questionType === 1) {
            // Bayes' theorem formula recognition
            const correctAnswer = `P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}`;
            const candidateDistractors = [
                `P(A|B) = P(A) \\cdot P(B)`,  // Wrong (independence)
                `P(A|B) = \\frac{P(A)}{P(B)}`,  // Missing P(B|A)
                `P(A|B) = P(B|A)`  // Common mistake
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['P(A|B) = P(A) + P(B)', 'P(A|B) = \\frac{P(A) + P(B)}{2}', 'P(A|B) = 1 - P(B)'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{What is Bayes' theorem?}`),
                instruction: "Select the correct formula",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Bayes' theorem: P(A|B) = [P(B|A)·P(A)]/P(B). It allows us to reverse conditional probabilities: if we know P(B|A), we can find P(A|B). The denominator P(B) can be found using the law of total probability.`,
                calc: false
            };
        } else if (questionType === 2) {
            // When to use Bayes' theorem
            const correctAnswer = `\\text{To reverse conditional probability}`;
            const candidateDistractors = [
                `\\text{To find joint probability}`,  // Wrong
                `\\text{To find marginal probability}`,  // Wrong
                `\\text{To test independence}`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\text{To add probabilities}', '\\text{To multiply probabilities}', '\\text{To find expected value}'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{When should we use}\\\\[0.5em]\\text{Bayes' theorem?}`),
                instruction: "Select the main application",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Bayes' theorem is used to reverse conditional probability. If we know P(B|A) but need P(A|B), we use Bayes' theorem. Example: knowing P(symptoms|disease), find P(disease|symptoms).`,
                calc: false
            };
        } else if (questionType === 3) {
            // Simple Bayes calculation
            const pA = 0.3;
            const pBgivenA = 0.8;
            const pBgivenNotA = 0.2;
            // P(B) = P(B|A)·P(A) + P(B|A')·P(A')
            const pB = pBgivenA * pA + pBgivenNotA * (1 - pA);
            // P(A|B) = P(B|A)·P(A) / P(B)
            const pAgivenB = (pBgivenA * pA) / pB;
            const result = Math.round(pAgivenB * 100) / 100;
            
            const correctAnswer = `${result}`;
            const candidateDistractors = [
                `${pA}`,  // Just P(A)
                `${pBgivenA}`,  // Just P(B|A)
                `${Math.round((pA * pBgivenA) * 100) / 100}`  // Numerator only
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${Math.round(Math.random() * 90 + 10) / 100}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`P(A) = ${pA}, \\; P(B|A) = ${pBgivenA}\\\\[0.5em]P(B|A') = ${pBgivenNotA}\\\\[0.5em]\\text{Find } P(A|B)`),
                instruction: "Calculate using Bayes' theorem (2 dp)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `First find P(B) = P(B|A)·P(A) + P(B|A')·P(A') = ${pBgivenA}·${pA} + ${pBgivenNotA}·${1-pA} = ${pB.toFixed(3)}. Then P(A|B) = P(B|A)·P(A)/P(B) = (${pBgivenA}·${pA})/${pB.toFixed(3)} ≈ ${result}.`,
                calc: true
            };
        } else if (questionType === 4) {
            // Medical test scenario (conceptual)
            const correctAnswer = `\\text{Calculate using } P(D|+) = \\frac{P(+|D) \\cdot P(D)}{P(+)}`;
            const candidateDistractors = [
                `P(D|+) = P(+|D)`,  // Common mistake
                `P(D|+) = P(D) \\cdot P(+)`,  // Wrong
                `P(D|+) = 1 - P(+|D)`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\text{Use } P(D) \\text{ directly}', '\\text{Cannot be determined}', '\\text{Add all probabilities}'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Given:}\\\\[0.5em]P(\\text{Disease}) = 0.01\\\\[0.5em]P(+ | \\text{Disease}) = 0.95\\\\[0.5em]P(+ | \\text{No Disease}) = 0.05\\\\[0.5em]\\text{Find } P(\\text{Disease} | +)`),
                instruction: "What is the correct approach?",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use Bayes' theorem: P(Disease|+) = [P(+|Disease)·P(Disease)]/P(+). Need to find P(+) = P(+|Disease)·P(Disease) + P(+|No Disease)·P(No Disease) = 0.95·0.01 + 0.05·0.99 = 0.059. Then P(Disease|+) = (0.95·0.01)/0.059 ≈ 0.16 or 16%.`,
                calc: false
            };
        } else {
            // Common mistake: confusing P(A|B) with P(B|A)
            const correctAnswer = `\\text{No, they are generally different}`;
            const candidateDistractors = [
                `\\text{Yes, they are always equal}`,  // Wrong
                `\\text{Yes, if A and B are independent}`,  // Still wrong
                `\\text{Only if P(A) = P(B)}`  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = ['\\text{Sometimes}', '\\text{Cannot determine}', '\\text{Only for disjoint events}'];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Is } P(A|B) \\text{ equal to } P(B|A)?`),
                instruction: "Select the correct answer",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `P(A|B) and P(B|A) are generally different. P(A|B) = "probability of A given B" while P(B|A) = "probability of B given A". Bayes' theorem shows their relationship: P(A|B) = [P(B|A)·P(A)]/P(B). They're only equal in special cases, not generally.`,
                calc: false
            };
        }
    }
};
