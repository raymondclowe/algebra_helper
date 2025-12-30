// Proof by Induction Question Templates
// Level 25-26: Mathematical Induction Proofs
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.ProofsInduction = {
    // Proof by induction - fill in missing steps
    getInductionProofQuestion: function() {
        const utils = window.GeneratorUtils;
        const proofType = utils.rInt(1, 4);
        
        if (proofType === 1) {
            // Sum of first n natural numbers: 1 + 2 + ... + n = n(n+1)/2
            const step = utils.rInt(1, 3);
            
            if (step === 1) {
                // Base case
                return {
                    tex: `\\text{Prove by induction: } \\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}`,
                    instruction: "What is the base case when n = 1?",
                    displayAnswer: `1 = \\frac{1(1+1)}{2} = 1`,
                    distractors: utils.ensureUniqueDistractors(
                        `1 = \\frac{1(1+1)}{2} = 1`,
                        [
                            `0 = \\frac{1(1+1)}{2}`,
                            `1 = \\frac{1 \\cdot 2}{2}`,
                            `1 = 1(1+1)`
                        ],
                        () => `1 = \\frac{${utils.rInt(1, 3)}(${utils.rInt(1, 3)})}{2}`
                    ),
                    explanation: `For the base case, substitute n = 1 into both sides. LHS: 1. RHS: (1)(1+1)/2 = 2/2 = 1. Since LHS = RHS, the base case holds.`,
                    calc: false
                };
            } else if (step === 2) {
                // Inductive hypothesis
                return {
                    tex: `\\text{Induction hypothesis for } \\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}`,
                    instruction: "Assume the formula holds for n = k. What do we assume?",
                    displayAnswer: `1 + 2 + \\cdots + k = \\frac{k(k+1)}{2}`,
                    distractors: utils.ensureUniqueDistractors(
                        `1 + 2 + \\cdots + k = \\frac{k(k+1)}{2}`,
                        [
                            `1 + 2 + \\cdots + (k+1) = \\frac{k(k+1)}{2}`,
                            `1 + 2 + \\cdots + k = \\frac{(k+1)(k+2)}{2}`,
                            `1 + 2 + \\cdots + k = k(k+1)`
                        ],
                        () => `1 + 2 + \\cdots + k = \\frac{${utils.rInt(1, 3)}k}{2}`
                    ),
                    explanation: `The inductive hypothesis states that the formula holds for n = k, so we assume 1 + 2 + ... + k = k(k+1)/2.`,
                    calc: false
                };
            } else {
                // Inductive step
                return {
                    tex: `\\text{Given: } 1+2+\\cdots+k = \\frac{k(k+1)}{2}`,
                    instruction: `What is 1+2+\\cdots+k+(k+1) in simplified form?`,
                    displayAnswer: `\\frac{(k+1)(k+2)}{2}`,
                    distractors: utils.ensureUniqueDistractors(
                        `\\frac{(k+1)(k+2)}{2}`,
                        [
                            `\\frac{k(k+1)}{2} + k`,
                            `\\frac{k(k+2)}{2}`,
                            `\\frac{(k+1)^2}{2}`
                        ],
                        () => `\\frac{${utils.rInt(1, 3)}(k+1)}{2}`
                    ),
                    explanation: `Add (k+1) to both sides: k(k+1)/2 + (k+1) = (k+1)[k/2 + 1] = (k+1)(k+2)/2. This shows the formula holds for n = k+1.`,
                    calc: false
                };
            }
        } else if (proofType === 2) {
            // Sum of first n odd numbers: 1 + 3 + 5 + ... + (2n-1) = n²
            const step = utils.rInt(1, 3);
            
            if (step === 1) {
                return {
                    tex: `\\text{Prove: } 1 + 3 + 5 + \\cdots + (2n-1) = n^2`,
                    instruction: "What is the base case when n = 1?",
                    displayAnswer: `1 = 1^2`,
                    distractors: utils.ensureUniqueDistractors(
                        `1 = 1^2`,
                        [
                            `1 = 2(1) - 1`,
                            `1 = 0`,
                            `1 + 3 = 1^2`
                        ],
                        () => `1 = ${utils.rInt(0, 4)}`
                    ),
                    explanation: `Base case: n = 1. LHS = 1 (first odd number). RHS = 1² = 1. The base case holds.`,
                    calc: false
                };
            } else if (step === 2) {
                return {
                    tex: `\\text{Assume: } 1+3+5+\\cdots+(2k-1) = k^2`,
                    instruction: `What is the next term to add for n = k+1?`,
                    displayAnswer: `2(k+1) - 1 = 2k + 1`,
                    distractors: utils.ensureUniqueDistractors(
                        `2(k+1) - 1 = 2k + 1`,
                        [
                            `2k - 1`,
                            `2k + 2`,
                            `k + 1`
                        ],
                        () => `${utils.rInt(1, 3)}k + ${utils.rInt(1, 3)}`
                    ),
                    explanation: `For n = k+1, the next odd number is 2(k+1) - 1 = 2k + 1.`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\text{Given: } 1+3+\\cdots+(2k-1) = k^2. \\text{ Add } (2k+1).`,
                    instruction: `What is k² + (2k+1) simplified?`,
                    displayAnswer: `(k+1)^2`,
                    distractors: utils.ensureUniqueDistractors(
                        `(k+1)^2`,
                        [
                            `k^2 + 2k + 1`,
                            `k^2 + k + 1`,
                            `k^2 + 2k`
                        ],
                        () => `k^2 + ${utils.rInt(1, 5)}`
                    ),
                    explanation: `k² + (2k+1) = k² + 2k + 1 = (k+1)². This proves the formula holds for n = k+1.`,
                    calc: false
                };
            }
        } else if (proofType === 3) {
            // Divisibility: n³ - n is divisible by 3
            const step = utils.rInt(1, 3);
            
            if (step === 1) {
                return {
                    tex: `\\text{Prove by induction: } n^3 - n \\text{ is divisible by } 3`,
                    instruction: "What is the base case when n = 1?",
                    displayAnswer: `1^3 - 1 = 0, \\text{ divisible by } 3`,
                    distractors: utils.ensureUniqueDistractors(
                        `1^3 - 1 = 0, \\text{ divisible by } 3`,
                        [
                            `1^3 - 1 = 1`,
                            `1^3 - 1 = 3`,
                            `1^3 = 1`
                        ],
                        () => `1^3 - 1 = ${utils.rInt(1, 5)}`
                    ),
                    explanation: `Base case: n = 1. 1³ - 1 = 0, and 0 is divisible by 3.`,
                    calc: false
                };
            } else if (step === 2) {
                return {
                    tex: `\\text{Assume } k^3 - k = 3m \\text{ for some integer } m`,
                    instruction: `Express (k+1)³ - (k+1) in terms of k³ - k`,
                    displayAnswer: `(k+1)^3 - (k+1) = k^3 - k + 3k^2 + 3k`,
                    distractors: utils.ensureUniqueDistractors(
                        `(k+1)^3 - (k+1) = k^3 - k + 3k^2 + 3k`,
                        [
                            `(k+1)^3 - (k+1) = k^3 + 3k^2 + 3k + 1`,
                            `(k+1)^3 - (k+1) = k^3 - k + k^2`,
                            `(k+1)^3 - (k+1) = k^3 + 1`
                        ],
                        () => `k^3 + ${utils.rInt(1, 5)}k^2`
                    ),
                    explanation: `Expand: (k+1)³ - (k+1) = k³ + 3k² + 3k + 1 - k - 1 = k³ - k + 3k² + 3k = 3m + 3k² + 3k = 3(m + k² + k), divisible by 3.`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\text{Given: } k^3 - k = 3m. \\text{ Show } (k+1)^3 - (k+1) \\text{ divisible by } 3`,
                    instruction: `What factor can we extract from k³ - k + 3k² + 3k?`,
                    displayAnswer: `3(m + k^2 + k)`,
                    distractors: utils.ensureUniqueDistractors(
                        `3(m + k^2 + k)`,
                        [
                            `3m + k^2 + k`,
                            `m + 3k^2 + 3k`,
                            `3mk^2`
                        ],
                        () => `${utils.rInt(1, 5)}(m + k)`
                    ),
                    explanation: `k³ - k + 3k² + 3k = 3m + 3k² + 3k = 3(m + k² + k), which is divisible by 3 since it's a multiple of 3.`,
                    calc: false
                };
            }
        } else {
            // Sum of geometric series: Σ r^i = (r^(n+1) - 1)/(r - 1)
            const r = utils.rInt(2, 4);
            const step = utils.rInt(1, 2);
            
            if (step === 1) {
                return {
                    tex: `\\text{Prove: } 1 + ${r} + ${r}^2 + \\cdots + ${r}^n = \\frac{${r}^{n+1} - 1}{${r} - 1}`,
                    instruction: "Verify the base case when n = 0",
                    displayAnswer: `1 = \\frac{${r}^1 - 1}{${r} - 1} = \\frac{${r - 1}}{${r - 1}} = 1`,
                    distractors: utils.ensureUniqueDistractors(
                        `1 = \\frac{${r}^1 - 1}{${r} - 1} = \\frac{${r - 1}}{${r - 1}} = 1`,
                        [
                            `1 = ${r}^0 = 1`,
                            `1 = \\frac{${r}}{${r - 1}}`,
                            `0 = \\frac{${r}^1 - 1}{${r} - 1}`
                        ],
                        () => `1 = \\frac{${utils.rInt(1, 5)}}{${utils.rInt(1, 5)}}`
                    ),
                    explanation: `Base case n = 0: LHS = ${r}⁰ = 1. RHS = (${r}¹ - 1)/(${r} - 1) = ${r - 1}/${r - 1} = 1. Base case holds.`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\text{Assume: } 1+${r}+\\cdots+${r}^k = \\frac{${r}^{k+1}-1}{${r}-1}. \\text{ Add } ${r}^{k+1}`,
                    instruction: `What is the result after adding ${r}^{k+1}?`,
                    displayAnswer: `\\frac{${r}^{k+2} - 1}{${r} - 1}`,
                    distractors: utils.ensureUniqueDistractors(
                        `\\frac{${r}^{k+2} - 1}{${r} - 1}`,
                        [
                            `\\frac{${r}^{k+1} - 1}{${r} - 1}`,
                            `\\frac{${r}^{k+2}}{${r} - 1}`,
                            `${r}^{k+2} - 1`
                        ],
                        () => `\\frac{${r}^{k+${utils.rInt(1, 3)}}}{${r} - 1}`
                    ),
                    explanation: `(${r}^(k+1) - 1)/(${r} - 1) + ${r}^(k+1) = (${r}^(k+1) - 1 + ${r}^(k+1)(${r} - 1))/(${r} - 1) = (${r}^(k+2) - 1)/(${r} - 1).`,
                    calc: false
                };
            }
        }
    }
};
