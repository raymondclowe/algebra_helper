// Counterexample Proofs Question Templates
// Level 26-27: Disproving statements by counterexample
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.CounterexampleProofs = {
    // Counterexample proof questions - disproving universal statements
    getCounterexampleProofQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 4);
        
        if (questionType === 1) {
            // Disprove: "If n² is even, then n is even" (FALSE - counterexample exists)
            // Actually TRUE - so we'll use a false statement
            // False statement: "If n is prime, then n is odd"
            return {
                tex: utils.wrapLongLatexText(`\\text{Statement: "If } n \\text{ is prime, then } n \\text{ is odd."}`),
                instruction: "Which counterexample disproves this statement?",
                displayAnswer: `n = 2 \\text{ (prime and even)}`,
                distractors: utils.ensureUniqueDistractors(
                    `n = 2 \\text{ (prime and even)}`,
                    [
                        `n = 3 \\text{ (prime and odd)}`,
                        `n = 4 \\text{ (even but not prime)}`,
                        `n = 9 \\text{ (odd but not prime)}`
                    ],
                    () => {
                        const vals = [5, 7, 11, 15, 21];
                        const n = vals[utils.rInt(0, vals.length - 1)];
                        return `n = ${n}`;
                    }
                ),
                explanation: `To disprove a universal statement, we need just one counterexample. The statement claims all primes are odd, but n = 2 is prime and even, disproving the statement.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Disprove: "For all real numbers x, x² > x"
            return {
                tex: utils.wrapLongLatexText(`\\text{Statement: "For all real numbers } x, \\, x^2 > x\\text{."}`),
                instruction: "Which counterexample disproves this statement?",
                displayAnswer: `x = 0.5 \\text{ (since } 0.25 \\not> 0.5\\text{)}`,
                distractors: utils.ensureUniqueDistractors(
                    `x = 0.5 \\text{ (since } 0.25 \\not> 0.5\\text{)}`,
                    [
                        `x = 2 \\text{ (since } 4 > 2\\text{)}`,
                        `x = -1 \\text{ (since } 1 > -1\\text{)}`,
                        `x = 3 \\text{ (since } 9 > 3\\text{)}`
                    ],
                    () => {
                        const vals = [4, 5, 10];
                        const n = vals[utils.rInt(0, vals.length - 1)];
                        return `x = ${n}`;
                    }
                ),
                explanation: `For 0 < x < 1, we have x² < x. For example, when x = 0.5, x² = 0.25 < 0.5. This single counterexample disproves the universal statement.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Disprove: "The sum of two irrational numbers is always irrational"
            return {
                tex: utils.wrapLongLatexText(`\\text{Statement: "The sum of two irrational numbers is always irrational."}`),
                instruction: "Which counterexample disproves this statement?",
                displayAnswer: `\\sqrt{2} + (-\\sqrt{2}) = 0 \\text{ (rational)}`,
                distractors: utils.ensureUniqueDistractors(
                    `\\sqrt{2} + (-\\sqrt{2}) = 0 \\text{ (rational)}`,
                    [
                        `\\sqrt{2} + \\sqrt{3} \\text{ (irrational)}`,
                        `\\pi + e \\text{ (irrational)}`,
                        `2 + 3 = 5 \\text{ (rational)}`
                    ],
                    () => {
                        const options = [
                            `\\sqrt{3} + \\sqrt{5}`,
                            `\\pi + \\sqrt{2}`,
                            `e + \\pi`
                        ];
                        return options[utils.rInt(0, options.length - 1)];
                    }
                ),
                explanation: `The sum √2 + (-√2) = 0, which is rational. This counterexample shows that the sum of two irrational numbers can be rational, disproving the statement.`,
                calc: false
            };
        } else {
            // Disprove: "If a|bc, then a|b or a|c" (not always true)
            // False for non-prime a
            return {
                tex: utils.wrapLongLatexText(`\\text{Statement: "If } a \\text{ divides } bc, \\text{ then } a \\text{ divides } b \\text{ or } a \\text{ divides } c\\text{."}`),
                instruction: "Which counterexample disproves this statement?",
                displayAnswer: `a = 4, b = 2, c = 6 \\text{ (4|12 but } 4\\nmid 2 \\text{ and } 4\\nmid 6\\text{)}`,
                distractors: utils.ensureUniqueDistractors(
                    `a = 4, b = 2, c = 6 \\text{ (4|12 but } 4\\nmid 2 \\text{ and } 4\\nmid 6\\text{)}`,
                    [
                        `a = 2, b = 4, c = 6 \\text{ (2|24, 2|4, 2|6)}`,
                        `a = 3, b = 6, c = 9 \\text{ (3|54, 3|6, 3|9)}`,
                        `a = 5, b = 10, c = 15 \\text{ (5|150, 5|10, 5|15)}`
                    ],
                    () => {
                        const options = [
                            `a = 2, b = 3, c = 4`,
                            `a = 3, b = 5, c = 7`,
                            `a = 6, b = 9, c = 12`
                        ];
                        return options[utils.rInt(0, options.length - 1)];
                    }
                ),
                explanation: `With a = 4, b = 2, c = 6: we have bc = 12, and 4|12. However, 4∤2 and 4∤6. This disproves the statement. (Note: The statement IS true for prime a.)`,
                calc: false
            };
        }
    }
};
