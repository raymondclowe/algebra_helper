// Proof by Contradiction Question Templates
// Level 26-27: Proof by Contradiction
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.ProofsContradiction = {
    // Proof by contradiction - fill in missing steps
    getContradictionProofQuestion: function() {
        const utils = window.GeneratorUtils;
        const proofType = utils.rInt(1, 3);
        
        if (proofType === 1) {
            // √2 is irrational
            const step = utils.rInt(1, 4);
            
            if (step === 1) {
                return {
                    tex: `\\text{Prove } \\sqrt{2} \\text{ is irrational by contradiction}`,
                    instruction: "What do we assume at the start?",
                    displayAnswer: `\\text{Assume } \\sqrt{2} = \\frac{a}{b} \\text{ where } a, b \\text{ are coprime integers}`,
                    distractors: utils.ensureUniqueDistractors(
                        `\\text{Assume } \\sqrt{2} = \\frac{a}{b} \\text{ where } a, b \\text{ are coprime integers}`,
                        [
                            `\\text{Assume } \\sqrt{2} \\text{ is irrational}`,
                            `\\text{Assume } \\sqrt{2} = \\frac{a}{b} \\text{ where } a, b \\text{ have common factors}`,
                            `\\text{Assume } \\sqrt{2} \\text{ is an integer}`
                        ],
                        () => `\\text{Assume } \\sqrt{2} = ${utils.rInt(1, 5)}`
                    ),
                    explanation: `For proof by contradiction, we assume the opposite: that √2 IS rational, meaning √2 = a/b where a and b are coprime (no common factors other than 1).`,
                    calc: false
                };
            } else if (step === 2) {
                return {
                    tex: `\\text{Given } \\sqrt{2} = \\frac{a}{b}, \\text{ square both sides}`,
                    instruction: `What equation do we get?`,
                    displayAnswer: `2 = \\frac{a^2}{b^2} \\text{ or } 2b^2 = a^2`,
                    distractors: utils.ensureUniqueDistractors(
                        `2 = \\frac{a^2}{b^2} \\text{ or } 2b^2 = a^2`,
                        [
                            `2 = \\frac{a}{b}`,
                            `4 = \\frac{a^2}{b^2}`,
                            `2 = a^2 + b^2`
                        ],
                        () => `${utils.rInt(1, 5)} = \\frac{a^2}{b^2}`
                    ),
                    explanation: `Squaring both sides: (√2)² = (a/b)², so 2 = a²/b², which gives us 2b² = a².`,
                    calc: false
                };
            } else if (step === 3) {
                return {
                    tex: `\\text{From } 2b^2 = a^2, \\text{ what can we conclude about } a?`,
                    instruction: `What property must a have?`,
                    displayAnswer: `a^2 \\text{ is even, so } a \\text{ must be even}`,
                    distractors: utils.ensureUniqueDistractors(
                        `a^2 \\text{ is even, so } a \\text{ must be even}`,
                        [
                            `a \\text{ must be odd}`,
                            `a \\text{ must be divisible by } 4`,
                            `a^2 \\text{ is odd}`
                        ],
                        () => `a \\text{ must equal } ${utils.rInt(1, 5)}`
                    ),
                    explanation: `Since 2b² = a², we know a² is even (it's 2 times something). If a² is even, then a must be even.`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\text{If } a \\text{ is even, write } a = 2k. \\text{ Then } 2b^2 = (2k)^2`,
                    instruction: `What can we conclude about b?`,
                    displayAnswer: `b^2 = 2k^2, \\text{ so } b \\text{ is also even}`,
                    distractors: utils.ensureUniqueDistractors(
                        `b^2 = 2k^2, \\text{ so } b \\text{ is also even}`,
                        [
                            `b \\text{ must be odd}`,
                            `b = 2k`,
                            `b \\text{ is irrational}`
                        ],
                        () => `b = ${utils.rInt(1, 5)}k`
                    ),
                    explanation: `2b² = 4k², so b² = 2k². This means b² is even, so b is even. But if both a and b are even, they share a common factor (2), contradicting our assumption that they're coprime. Therefore, √2 cannot be rational.`,
                    calc: false
                };
            }
        } else if (proofType === 2) {
            // √3 is irrational (similar structure)
            const step = utils.rInt(1, 3);
            
            if (step === 1) {
                return {
                    tex: `\\text{Prove } \\sqrt{3} \\text{ is irrational}`,
                    instruction: "What do we assume to start a proof by contradiction?",
                    displayAnswer: `\\text{Assume } \\sqrt{3} = \\frac{p}{q} \\text{ in lowest terms}`,
                    distractors: utils.ensureUniqueDistractors(
                        `\\text{Assume } \\sqrt{3} = \\frac{p}{q} \\text{ in lowest terms}`,
                        [
                            `\\text{Assume } \\sqrt{3} \\text{ is irrational}`,
                            `\\text{Assume } \\sqrt{3} \\text{ is an integer}`,
                            `\\text{Assume } p \\text{ and } q \\text{ are both divisible by 3}`
                        ],
                        () => `\\text{Assume } \\sqrt{3} = ${utils.rInt(1, 5)}`
                    ),
                    explanation: `To prove by contradiction, we assume √3 IS rational: √3 = p/q where p and q are coprime (lowest terms).`,
                    calc: false
                };
            } else if (step === 2) {
                return {
                    tex: `\\text{Given } \\sqrt{3} = \\frac{p}{q}, \\text{ square both sides}`,
                    instruction: `What equation results?`,
                    displayAnswer: `3q^2 = p^2`,
                    distractors: utils.ensureUniqueDistractors(
                        `3q^2 = p^2`,
                        [
                            `3 = \\frac{p^2}{q^2}`,
                            `9q^2 = p^2`,
                            `3 = p^2 + q^2`
                        ],
                        () => `${utils.rInt(1, 5)}q^2 = p^2`
                    ),
                    explanation: `Squaring: 3 = p²/q², so 3q² = p². This shows p² is divisible by 3, so p is divisible by 3.`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\text{If } p = 3m, \\text{ then } 3q^2 = (3m)^2 = 9m^2`,
                    instruction: `What must be true about q?`,
                    displayAnswer: `q^2 = 3m^2, \\text{ so } q \\text{ is divisible by } 3`,
                    distractors: utils.ensureUniqueDistractors(
                        `q^2 = 3m^2, \\text{ so } q \\text{ is divisible by } 3`,
                        [
                            `q \\text{ must be odd}`,
                            `q = 3m`,
                            `q^2 = 9m^2`
                        ],
                        () => `q = ${utils.rInt(1, 5)}m`
                    ),
                    explanation: `q² = 3m² means q² is divisible by 3, so q is divisible by 3. But both p and q divisible by 3 contradicts them being coprime. Therefore √3 is irrational.`,
                    calc: false
                };
            }
        } else {
            // There is no largest prime number
            const step = utils.rInt(1, 3);
            
            if (step === 1) {
                return {
                    tex: `\\text{Prove there is no largest prime number}`,
                    instruction: "What do we assume to start?",
                    displayAnswer: `\\text{Assume there is a largest prime } P`,
                    distractors: utils.ensureUniqueDistractors(
                        `\\text{Assume there is a largest prime } P`,
                        [
                            `\\text{Assume there are infinitely many primes}`,
                            `\\text{Assume all numbers are prime}`,
                            `\\text{Assume } P \\text{ is not prime}`
                        ],
                        () => `\\text{Assume there are } ${utils.rInt(1, 100)} \\text{ primes}`
                    ),
                    explanation: `For proof by contradiction, assume the opposite: that there IS a largest prime number P.`,
                    calc: false
                };
            } else if (step === 2) {
                return {
                    tex: `\\text{Let } P \\text{ be the largest prime. Consider all primes } 2, 3, 5, \\ldots, P`,
                    instruction: `What number do we construct?`,
                    displayAnswer: `N = (2 \\times 3 \\times 5 \\times \\cdots \\times P) + 1`,
                    distractors: utils.ensureUniqueDistractors(
                        `N = (2 \\times 3 \\times 5 \\times \\cdots \\times P) + 1`,
                        [
                            `N = P + 1`,
                            `N = 2 \\times 3 \\times 5 \\times \\cdots \\times P`,
                            `N = P^2`
                        ],
                        () => `N = ${utils.rInt(1, 5)}P`
                    ),
                    explanation: `Construct N = (product of all primes up to P) + 1. This number is larger than P.`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\text{Consider } N = (2 \\times 3 \\times \\cdots \\times P) + 1`,
                    instruction: `What can we conclude about N?`,
                    displayAnswer: `N \\text{ is not divisible by any prime } \\leq P, \\text{ so } N \\text{ is prime or has a prime factor } > P`,
                    distractors: utils.ensureUniqueDistractors(
                        `N \\text{ is not divisible by any prime } \\leq P, \\text{ so } N \\text{ is prime or has a prime factor } > P`,
                        [
                            `N \\text{ is divisible by all primes}`,
                            `N \\text{ is composite}`,
                            `N = P`
                        ],
                        () => `N \\text{ is divisible by } ${utils.rInt(2, 7)}`
                    ),
                    explanation: `N leaves remainder 1 when divided by any prime ≤ P. So N is either prime itself, or has a prime factor > P. Either way, there exists a prime > P, contradicting our assumption. Therefore, there is no largest prime.`,
                    calc: false
                };
            }
        }
    }
};
