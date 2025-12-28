// Decimals and Percentages Question Templates
// Level 4-5
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.DecimalsPercentages = {
    getDecimalsPercentages: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 4);
                
                if (questionType === 1) {
                    // Converting fraction to decimal
                    const conversions = [
                        { frac: '\\frac{1}{2}', dec: '0.5' },
                        { frac: '\\frac{1}{4}', dec: '0.25' },
                        { frac: '\\frac{3}{4}', dec: '0.75' },
                        { frac: '\\frac{1}{5}', dec: '0.2' },
                        { frac: '\\frac{2}{5}', dec: '0.4' },
                        { frac: '\\frac{1}{10}', dec: '0.1' }
                    ];
                    const conv = conversions[utils.rInt(0, conversions.length - 1)];
                    const correctAnswer = `${conv.dec}`;
                    const candidateDistractors = [`${parseFloat(conv.dec) + 0.1}`, `${parseFloat(conv.dec) * 2}`, `${1 - parseFloat(conv.dec)}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${(utils.rInt(1, 20) / 10).toFixed(1)}`
                    );
                    
                    return {
                        tex: `${conv.frac}`,
                        instruction: "Convert to decimal",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Divide the numerator by the denominator to get ${conv.dec}.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Converting decimal to percentage
                    const decimal = utils.rInt(1, 9) / 10;
                    const percentage = decimal * 100;
                    const correctAnswer = `${percentage}\\%`;
                    const candidateDistractors = [`${decimal}\\%`, `${percentage / 10}\\%`, `${percentage * 10}\\%`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 100)}\\%`
                    );
                    
                    return {
                        tex: `${decimal}`,
                        instruction: "Convert to percentage",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Multiply by 100: ${decimal} × 100 = ${percentage}%.`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Finding percentage of a number
                    const percent = [10, 20, 25, 50, 75][utils.rInt(0, 4)];
                    const number = utils.rInt(20, 100);
                    const result = (percent / 100) * number;
                    const correctAnswer = `${result}`;
                    const candidateDistractors = [`${result + 10}`, `${result - 5}`, `${number - result}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 100)}`
                    );
                    
                    return {
                        tex: `${percent}\\% \\text{ of } ${number}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${percent}% of ${number} = (${percent}/100) × ${number} = ${result}.`,
                        calc: false
                    };
                } else {
                    // Ordering decimals
                    const decimals = [
                        utils.rInt(1, 9) / 10,
                        utils.rInt(10, 99) / 100,
                        utils.rInt(1, 9) / 100
                    ].sort((a, b) => a - b);
                    const correctAnswer = `${decimals[0]}`;
                    const candidateDistractors = [`${decimals[1]}`, `${decimals[2]}`, `\\text{all equal}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${(utils.rInt(1, 99) / 100).toFixed(2)}`
                    );
                    
                    return {
                        tex: `\\text{Which is smallest: } ${decimals[2]}, ${decimals[0]}, ${decimals[1]}?`,
                        instruction: "Choose the smallest decimal",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Compare place values: ${decimals[0]} < ${decimals[1]} < ${decimals[2]}.`,
                        calc: false
                    };
                }
    }
};
