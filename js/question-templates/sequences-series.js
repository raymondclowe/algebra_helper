// Sequences and Series Question Templates
// Level 13-14
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.SequencesSeries = {
    getSequencesSeries: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 5);
                
                if (questionType === 1) {
                    // Arithmetic sequence: nth term
                    const a = utils.rInt(3, 10);
                    const d = utils.rInt(2, 7);
                    const n = utils.rInt(5, 10);
                    const term = a + (n - 1) * d;
                    const correctAnswer = `${term}`;
                    const candidateDistractors = [`${a + n * d}`, `${term - d}`, `${a * n}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(10, 100)}`
                    );
                    
                    return {
                        tex: `\\text{Arithmetic sequence: } a_1 = ${a}, d = ${d}`,
                        instruction: `\\text{Find } a_{${n}}`,
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Formula: a_n = a_1 + (n-1)d = ${a} + (${n}-1)(${d}) = ${a} + ${(n - 1) * d} = ${term}.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Geometric sequence: nth term
                    const a = utils.rInt(2, 5);
                    const r = utils.rInt(2, 3);
                    const n = utils.rInt(3, 5);
                    const term = a * Math.pow(r, n - 1);
                    const correctAnswer = `${term}`;
                    const candidateDistractors = [`${a * r * n}`, `${term / r}`, `${a + Math.pow(r, n)}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(10, 200)}`
                    );
                    
                    return {
                        tex: `\\text{Geometric sequence: } a_1 = ${a}, r = ${r}`,
                        instruction: `\\text{Find } a_{${n}}`,
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Formula: a_n = a_1 × r^(n-1) = ${a} × ${r}^${n - 1} = ${a} × ${Math.pow(r, n - 1)} = ${term}.`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Sum of arithmetic series
                    const a = utils.rInt(1, 5);
                    const d = utils.rInt(1, 4);
                    const n = utils.rInt(5, 10);
                    const l = a + (n - 1) * d;
                    const sum = (n * (a + l)) / 2;
                    const correctAnswer = `${sum}`;
                    const candidateDistractors = [`${n * a}`, `${sum + n}`, `${a + l}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(50, 300)}`
                    );
                    
                    return {
                        tex: `\\text{Sum of arithmetic series: } a_1 = ${a}, d = ${d}, n = ${n}`,
                        instruction: "Find the sum S_n",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `S_n = n(a_1 + a_n)/2. First find a_${n} = ${a} + ${(n - 1) * d} = ${l}. Then S_${n} = ${n}(${a} + ${l})/2 = ${sum}.`,
                        calc: false
                    };
                } else if (questionType === 4) {
                    // Sigma notation
                    const n = utils.rInt(3, 6);
                    const sum = (n * (n + 1)) / 2;
                    const correctAnswer = `${sum}`;
                    const candidateDistractors = [`${n * n}`, `${n + 1}`, `${sum + n}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(10, 50)}`
                    );
                    
                    return {
                        tex: `\\sum_{k=1}^{${n}} k`,
                        instruction: "Evaluate the sum",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Sum of first ${n} natural numbers: 1 + 2 + ... + ${n} = n(n+1)/2 = ${n}(${n + 1})/2 = ${sum}.`,
                        calc: false
                    };
                } else {
                    // Binomial theorem - coefficient in expansion
                    // (a + b)^n, find coefficient of a^r b^(n-r)
                    const n = utils.rInt(3, 5);
                    const r = utils.rInt(1, n - 1);
                    
                    // Calculate binomial coefficient C(n, r) = n! / (r! * (n-r)!)
                    // Using iterative approach to avoid recursion stack issues
                    function factorial(num) {
                        let result = 1;
                        for (let i = 2; i <= num; i++) {
                            result *= i;
                        }
                        return result;
                    }
                    
                    const coeff = factorial(n) / (factorial(r) * factorial(n - r));
                    const correctAnswer = `${coeff}`;
                    const candidateDistractors = [
                        `${n * r}`,
                        `${Math.floor(factorial(n) / (factorial(r) * 2))}`,  // More plausible distractor
                        `${n + r}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 20)}`
                    );
                    
                    return {
                        tex: `(a + b)^${n}`,
                        instruction: `\\text{Find coefficient of } a^${r}b^${n - r}`,
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Use binomial theorem: coefficient is C(${n}, ${r}) = ${n}!/(${r}! × ${n - r}!) = ${coeff}. This is also written as (${n} choose ${r}).`,
                        calc: false
                    };
                }
    }
};
