// Basic Equations Question Templates
// Levels 5-6 (lvl1), 6-7 (lvl2), 8-9 (lvl3), 9-10 (lvl4), 19-20 (lvl5)
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.BasicEquations = {
    // Level 5-6: Simple equations (ax = b)
    lvl1: function() {
        const utils = window.GeneratorUtils;
        const a = utils.rInt(2,9), x = utils.rInt(2,9);
        const correctAnswer = `x=${x}`;
        const candidateDistractors = [`x=${x+1}`, `x=${a}`, `x=${x-1}`];
        const distractors = utils.ensureUniqueDistractors(
            correctAnswer, 
            candidateDistractors,
            () => `x=${utils.rInt(2, 9)}`
        );
        return { 
            tex: `${a}x = ${a*x}`, 
            instruction: "Solve for x", 
            displayAnswer: correctAnswer, 
            distractors: distractors, 
            explanation:`Divide both sides by ${a} to isolate x: ${a}x ÷ ${a} = ${a*x} ÷ ${a}, which gives x = ${x}.`, 
            calc:false 
        };
    },

    // Level 6-7: Two-step equations (ax + b = c)
    lvl2: function() {
        const utils = window.GeneratorUtils;
        const a = utils.rInt(2,9), b = utils.rInt(2,9), x = utils.rInt(2,9);
        const correctAnswer = `x=${x}`;
        const candidateDistractors = [`x=${x+1}`, `x=${-x}`, `x=${b}`];
        const distractors = utils.ensureUniqueDistractors(
            correctAnswer, 
            candidateDistractors,
            () => `x=${utils.rInt(2, 9)}`
        );
        return { 
            tex: `${a}x + ${b} = ${a*x+b}`, 
            instruction: "Solve for x", 
            displayAnswer: correctAnswer, 
            distractors: distractors, 
            explanation:`Subtract ${b} from both sides: ${a}x = ${a*x}. Then divide both sides by ${a}: x = ${x}. Note that inverse operations are performed in reverse order of operations.`, 
            calc:false 
        };
    },

    // Level 8-9: Expanding expressions
    lvl3: function() {
        const utils = window.GeneratorUtils;
        const a = utils.rInt(2,5), b = utils.rInt(2,8);
        const correctAnswer = `${a}x + ${a*b}`;
        const candidateDistractors = [`${a}x+${b}`, `x+${a*b}`, `${a}x^2+${b}`];
        const distractors = utils.ensureUniqueDistractors(
            correctAnswer,
            candidateDistractors,
            () => {
                const randA = utils.rInt(2, 9);
                const randB = utils.rInt(2, 12);
                return `${randA}x+${randB}`;
            }
        );
        return { 
            tex: `${a}(x + ${b})`, 
            instruction: "Expand", 
            displayAnswer: correctAnswer, 
            distractors: distractors, 
            explanation:`Apply the distributive property by multiplying ${a} by each term inside the parentheses: ${a} × x = ${a}x, and ${a} × ${b} = ${a*b}. This gives ${a}x + ${a*b}.`, 
            calc:false 
        };
    },

    // Level 9-10: Factorising quadratics
    lvl4: function() {
        const utils = window.GeneratorUtils;
        const a = utils.rInt(1,5), b = utils.rInt(2,6);
        const correctAnswer = `(x+${a})(x+${b})`;
        const candidateDistractors = [`(x+${a+b})(x+${a*b})`, `x(x+${a+b})`, `(x-${a})(x-${b})`];
        const distractors = utils.ensureUniqueDistractors(
            correctAnswer,
            candidateDistractors,
            () => {
                const randA = utils.rInt(1, 9);
                const randB = utils.rInt(1, 9);
                return `(x+${randA})(x+${randB})`;
            }
        );
        return { 
            tex: `x^2 + ${a+b}x + ${a*b}`, 
            instruction: "Factorize", 
            displayAnswer: correctAnswer, 
            distractors: distractors, 
            explanation:`Find two numbers that multiply to ${a*b} (the constant term) and add to ${a+b} (the coefficient of x). These numbers are ${a} and ${b}: ${a} × ${b} = ${a*b} and ${a} + ${b} = ${a+b}. Therefore (x+${a})(x+${b}). This can be verified by expanding.`, 
            calc:false 
        };
    },

    // Level 19-20: Basic differentiation
    lvl5: function() {
        const utils = window.GeneratorUtils;
        // Generate differentiation questions only - inverse functions moved to appropriate topic
        const questionType = utils.getQuestionType(1, 3);
        
        if (questionType === 1) {
            // Basic power rule: d/dx[ax^n]
            const a = utils.rInt(2,5), n = utils.rInt(2,4);
            const correctAnswer = `${a*n}x^{${n-1}}`;
            const candidateDistractors = [`${a*n}x^{${n}}`, `${a}x^{${n-1}}`, `${n}x^{${a}}`];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const randCoeff = utils.rInt(2, 20);
                    const randExp = utils.rInt(0, 5);
                    return `${randCoeff}x^{${randExp}}`;
                }
            );
            return { 
                tex: utils.toUnicodeFunction(`f(x) = ${a}x^{${n}}`), 
                instruction: utils.toUnicodeFunction("Find f'(x)"), 
                displayAnswer: correctAnswer, 
                distractors: distractors, 
                explanation: utils.toUnicodeFunction(`Apply the power rule: multiply the coefficient by the exponent, then reduce the exponent by 1. Therefore f'(x) = ${a} × ${n} × x^${n-1} = ${a*n}x^${n-1}.`), 
                calc:false 
            };
        } else if (questionType === 2) {
            // Sum rule: d/dx[ax^n + bx^m]
            const a = utils.rInt(2, 4), n = utils.rInt(2, 3);
            const b = utils.rInt(2, 5), m = utils.rInt(3, 4);
            const term1 = `${a*n}x^{${n-1}}`;
            const term2 = `${b*m}x^{${m-1}}`;
            const correctAnswer = `${term1} + ${term2}`;
            const candidateDistractors = [
                `${a}x^{${n-1}} + ${b}x^{${m-1}}`,
                `${a*n + b*m}x^{${n+m-2}}`,
                `${a*n}x^{${n}} + ${b*m}x^{${m}}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const c1 = utils.rInt(2, 15);
                    const c2 = utils.rInt(2, 15);
                    const e1 = utils.rInt(1, 4);
                    const e2 = utils.rInt(1, 4);
                    return `${c1}x^{${e1}} + ${c2}x^{${e2}}`;
                }
            );
            return {
                tex: utils.toUnicodeFunction(`f(x) = ${a}x^{${n}} + ${b}x^{${m}}`),
                instruction: utils.toUnicodeFunction("Find f'(x)"),
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: utils.toUnicodeFunction(`Differentiate each term separately using the power rule. For ${a}x^${n}: ${a}×${n}x^${n-1} = ${a*n}x^${n-1}. For ${b}x^${m}: ${b}×${m}x^${m-1} = ${b*m}x^${m-1}.`),
                calc: false
            };
        } else {
            // Constant multiple rule with negative exponent
            const a = utils.rInt(2, 6);
            const correctAnswer = `-${a}x^{-2}`;
            const candidateDistractors = [
                `${a}x^{-2}`,
                `-${a}x^{-1}`,
                `\\frac{${a}}{x}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const c = utils.rInt(2, 10);
                    const e = utils.rInt(-3, -1);
                    return `${c}x^{${e}}`;
                }
            );
            return {
                tex: utils.toUnicodeFunction(`f(x) = \\frac{${a}}{x}`),
                instruction: utils.toUnicodeFunction("Find f'(x)"),
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: utils.toUnicodeFunction(`Rewrite as f(x) = ${a}x^{-1}. Using power rule: f'(x) = ${a} × (-1) × x^{-2} = -${a}x^{-2} = -${a}/x².`),
                calc: false
            };
        }
    }
};
