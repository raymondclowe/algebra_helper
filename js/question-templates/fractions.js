// Fractions Question Templates
// Level 3-4
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Fractions = {
    getFractions: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 5);
                
                if (questionType === 1) {
                    // Adding fractions with same denominator
                    const den = utils.rInt(2, 12);
                    const num1 = utils.rInt(1, den - 1);
                    const num2 = utils.rInt(1, den - num1);
                    const sum = num1 + num2;
                    const divisor = utils.gcd(sum, den);
                    const simplifiedNum = sum / divisor;
                    const simplifiedDen = den / divisor;
                    
                    const correctAnswer = simplifiedDen === 1 ? `${simplifiedNum}` : `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
                    const candidateDistractors = [
                        `\\frac{${sum}}{${den}}`,
                        `\\frac{${num1 + num2}}{${den * 2}}`,
                        `\\frac{${simplifiedNum + 1}}{${simplifiedDen}}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\frac{${utils.rInt(1, 20)}}{${utils.rInt(2, 20)}}`
                    );
                    
                    return {
                        tex: `\\frac{${num1}}{${den}} + \\frac{${num2}}{${den}}`,
                        instruction: "Simplify",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Add the numerators: ${num1} + ${num2} = ${sum}. Keep the denominator: ${den}. Then simplify ${sum}/${den} = ${simplifiedNum}/${simplifiedDen}.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Multiplying fractions
                    const num1 = utils.rInt(2, 8);
                    const den1 = utils.rInt(2, 9);
                    const num2 = utils.rInt(2, 8);
                    const den2 = utils.rInt(2, 9);
                    const resultNum = num1 * num2;
                    const resultDen = den1 * den2;
                    const divisor = utils.gcd(resultNum, resultDen);
                    const simplifiedNum = resultNum / divisor;
                    const simplifiedDen = resultDen / divisor;
                    
                    const correctAnswer = `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
                    const candidateDistractors = [
                        `\\frac{${resultNum}}{${resultDen}}`,
                        `\\frac{${num1 * num2}}{${den1 + den2}}`,
                        `\\frac{${num1 + num2}}{${den1 * den2}}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\frac{${utils.rInt(1, 50)}}{${utils.rInt(2, 50)}}`
                    );
                    
                    return {
                        tex: `\\frac{${num1}}{${den1}} \\times \\frac{${num2}}{${den2}}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Multiply numerators: ${num1} × ${num2} = ${resultNum}. Multiply denominators: ${den1} × ${den2} = ${resultDen}. Simplify: ${simplifiedNum}/${simplifiedDen}.`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Dividing fractions
                    const num1 = utils.rInt(2, 6);
                    const den1 = utils.rInt(2, 7);
                    const num2 = utils.rInt(2, 6);
                    const den2 = utils.rInt(2, 7);
                    const resultNum = num1 * den2;
                    const resultDen = den1 * num2;
                    const divisor = utils.gcd(resultNum, resultDen);
                    const simplifiedNum = resultNum / divisor;
                    const simplifiedDen = resultDen / divisor;
                    
                    const correctAnswer = `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
                    const candidateDistractors = [
                        `\\frac{${num1 * num2}}{${den1 * den2}}`,
                        // Only include unsimplified version if it's actually different from simplified
                        divisor > 1 ? `\\frac{${resultNum}}{${resultDen}}` : `\\frac{${den1}}{${num1}}`,
                        `\\frac{${num1}}{${den1 * num2}}`
                    ];
                    const distractors = utils.ensureUniqueDistractorsFractionAware(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\frac{${utils.rInt(1, 40)}}{${utils.rInt(2, 40)}}`
                    );
                    
                    return {
                        tex: `\\frac{${num1}}{${den1}} \\div \\frac{${num2}}{${den2}}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Dividing by a fraction means multiplying by its reciprocal: (${num1}/${den1}) × (${den2}/${num2}) = ${resultNum}/${resultDen}${divisor > 1 ? ` = ${simplifiedNum}/${simplifiedDen}` : ''}.`,
                        calc: false
                    };
                } else if (questionType === 4) {
                    // Adding fractions with different denominators
                    let den1 = utils.rInt(2, 6);
                    let den2 = utils.rInt(3, 7);
                    let attempts = 0;
                    // Ensure different denominators with max 10 retries
                    while (den1 === den2 && attempts < 10) {
                        den2 = utils.rInt(3, 7);
                        attempts++;
                    }
                    // If still same after retries, force different values
                    if (den1 === den2) den2 = den1 + 1;
                    
                    const num1 = utils.rInt(1, den1);
                    const num2 = utils.rInt(1, den2);
                    const commonDen = utils.lcm(den1, den2);
                    const newNum1 = num1 * (commonDen / den1);
                    const newNum2 = num2 * (commonDen / den2);
                    const sum = newNum1 + newNum2;
                    const divisor = utils.gcd(sum, commonDen);
                    const simplifiedNum = sum / divisor;
                    const simplifiedDen = commonDen / divisor;
                    
                    const correctAnswer = `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
                    const candidateDistractors = [
                        `\\frac{${num1 + num2}}{${den1 + den2}}`,
                        `\\frac{${sum}}{${commonDen}}`,
                        `\\frac{${newNum1}}{${commonDen}}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\frac{${utils.rInt(1, 30)}}{${utils.rInt(2, 30)}}`
                    );
                    
                    return {
                        tex: `\\frac{${num1}}{${den1}} + \\frac{${num2}}{${den2}}`,
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Find LCD = ${commonDen}. Convert: ${num1}/${den1} = ${newNum1}/${commonDen} and ${num2}/${den2} = ${newNum2}/${commonDen}. Add: ${newNum1 + newNum2}/${commonDen} = ${simplifiedNum}/${simplifiedDen}.`,
                        calc: false
                    };
                } else {
                    // Simplifying fractions
                    const factor = utils.rInt(2, 6);
                    const num = utils.rInt(2, 8) * factor;
                    const den = utils.rInt(3, 9) * factor;
                    const simplifiedNum = num / factor;
                    const simplifiedDen = den / factor;
                    
                    const correctAnswer = `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
                    const candidateDistractors = [
                        `\\frac{${num}}{${den}}`,
                        `\\frac{${simplifiedNum + 1}}{${simplifiedDen}}`,
                        `\\frac{${Math.floor(num / 2)}}{${Math.floor(den / 2)}}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\frac{${utils.rInt(1, 15)}}{${utils.rInt(2, 15)}}`
                    );
                    
                    return {
                        tex: `\\frac{${num}}{${den}}`,
                        instruction: "Simplify to lowest terms",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Both ${num} and ${den} are divisible by ${factor}. Divide both by ${factor}: ${num}÷${factor} = ${simplifiedNum} and ${den}÷${factor} = ${simplifiedDen}.`,
                        calc: false
                    };
                }
    }
};
