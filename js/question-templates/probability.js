// Probability Question Templates
// Level 22-23
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Probability = {
    getProbability: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 9);
                
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
                        instruction: "Calculate the probability",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Probability = (number of favorable outcomes)/(total number of outcomes) = ${favorable}/${total}.`,
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
                } else if (questionType === 3) {
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
                        instruction: "Calculate the complementary probability",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `P(failure) = 1 - P(success) = 1 - ${favorable}/${total} = ${complement}/${total}. Note that complementary probabilities sum to 1.`,
                        calc: false
                    };
                } else if (questionType === 4) {
                    // Definition: What is probability?
                    const correctAnswer = `\\text{The likelihood of an event: } \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}`;
                    const candidateDistractors = [
                        `\\text{The number of ways an event can occur}`,
                        `\\text{The number of total possible outcomes}`,
                        `\\text{The difference between success and failure}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{Define probability}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Probability is a measure of the likelihood that an event will occur. For equally likely outcomes, it is calculated as the number of favorable outcomes divided by the total number of possible outcomes. Probability values range from 0 (impossible) to 1 (certain).`,
                        calc: false
                    };
                } else if (questionType === 5) {
                    // Complementary events definition
                    const correctAnswer = `\\text{Two events whose probabilities sum to 1}`;
                    const candidateDistractors = [
                        `\\text{Two events that cannot occur together}`,
                        `\\text{Two events that must occur together}`,
                        `\\text{Two events with equal probability}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{What are complementary events?}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Complementary events are pairs of events where one must occur but not both. Their probabilities sum to 1. For example, success and failure are complementary: P(success) + P(failure) = 1. If P(A) = 0.3, then P(not A) = 0.7.`,
                        calc: false
                    };
                } else if (questionType === 6) {
                    // Probability with dice
                    const target = utils.rInt(3, 6);
                    const favorable = 6 - target + 1;
                    const correctAnswer = `\\frac{${favorable}}{6}`;
                    const candidateDistractors = [
                        `\\frac{${6 - favorable}}{6}`,
                        `\\frac{${target}}{6}`,
                        `\\frac{1}{6}`
                    ];
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const wrongNum = utils.rInt(1, 6);
                            return `\\frac{${wrongNum}}{6}`;
                        }
                    );
                    
                    return {
                        tex: `\\text{Rolling a fair six-sided die,}\\\\[0.5em]\\text{what is P(roll } \\geq ${target}\\text{)?}`,
                        instruction: "Calculate the probability",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `For a roll ≥ ${target}, the favorable outcomes are {${Array.from({length: favorable}, (_, i) => target + i).join(', ')}}. That's ${favorable} favorable outcomes out of 6 possible, so P = ${favorable}/6.`,
                        calc: false
                    };
                } else if (questionType === 7) {
                    // Probability always between 0 and 1
                    const correctAnswer = `\\text{Between 0 and 1 inclusive}`;
                    const candidateDistractors = [
                        `\\text{Any positive number}`,
                        `\\text{Between 0 and 100}`,
                        `\\text{Any real number}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random range}`
                    );
                    
                    return {
                        tex: `\\text{What is the range of possible}\\\\[0.5em]\\text{probability values?}`,
                        instruction: "Select the correct range",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Probability values must be between 0 and 1 inclusive. A probability of 0 means an event is impossible, 1 means it is certain, and values in between represent varying degrees of likelihood. Probabilities can be expressed as fractions, decimals, or percentages (0% to 100%).`,
                        calc: false
                    };
                } else if (questionType === 8) {
                    // Combination formula recognition
                    const n = utils.rInt(5, 8);
                    const r = utils.rInt(2, 3);
                    const correctAnswer = `\\text{Use: } C(${n}, ${r}) = \\frac{${n}!}{${r}!(${n - r})!}`;
                    const candidateDistractors = [
                        `${n} \\times ${r}`,
                        `\\frac{${n}}{${r}}`,
                        `${n}! \\times ${r}!`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `C(${utils.rInt(4, 10)}, ${utils.rInt(1, 4)})`
                    );
                    
                    return {
                        tex: `\\text{Choose ${r} items from ${n} items}\\\\[0.5em]\\text{(order doesn't matter)}`,
                        instruction: "Select the correct formula",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `When order doesn't matter, use combinations: C(n,r) = n!/(r!(n-r)!). This is also written as "n choose r" or (n r). For C(${n},${r}), calculate ${n}!/(${r}!×${n - r}!). Combinations are used when selecting subsets where order is irrelevant.`,
                        calc: true
                    };
                } else {
                    // Sample space definition
                    const correctAnswer = `\\text{The set of all possible outcomes}`;
                    const candidateDistractors = [
                        `\\text{The set of favorable outcomes}`,
                        `\\text{The number of ways to succeed}`,
                        `\\text{The probability of an event}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{What is a sample space in probability?}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The sample space is the set of all possible outcomes of an experiment. For example, when rolling a die, the sample space is {1, 2, 3, 4, 5, 6}. When flipping a coin, it's {Heads, Tails}. Understanding the sample space is essential for calculating probabilities.`,
                        calc: false
                    };
                }
    }
};
