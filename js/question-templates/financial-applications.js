// Financial Applications Question Templates
// Level 13-14: Compound interest, depreciation, and appreciation
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.FinancialApplications = {
    getFinancialApplications: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 6);
        
        if (questionType === 1) {
            // Compound interest - calculate final value
            const principal = [1000, 2000, 5000, 10000][utils.rInt(0, 3)];
            const rate = [2, 3, 5, 8][utils.rInt(0, 3)];
            const years = utils.rInt(2, 5);
            const rateDecimal = rate / 100;
            const multiplier = 1 + rateDecimal;
            const finalValue = Math.round(principal * Math.pow(multiplier, years));
            const correctAnswer = `\\$${finalValue}`;
            
            // Common mistakes: simple interest, wrong power, wrong rate
            const simpleInterest = principal + (principal * rate * years / 100);
            const wrongPower = Math.round(principal * Math.pow(multiplier, years - 1));
            const wrongRate = Math.round(principal * Math.pow(1 + rate / 10, years));
            
            const candidateDistractors = [
                `\\$${Math.round(simpleInterest)}`,
                `\\$${wrongPower}`,
                `\\$${wrongRate}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\$${Math.round(principal * Math.pow(1 + utils.rInt(1, 10) / 100, years))}`
            );
            
            return {
                tex: `\\text{If \\$${principal} is invested at ${rate}\\% per year compound interest, what is the value after ${years} years?}`,
                instruction: "Calculate final value",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use the compound interest formula: A = P(1 + r)^n. Here, A = ${principal}(1 + ${rateDecimal})^${years} = ${principal}(${multiplier})^${years} = \\$${finalValue}. Note that compound interest means the interest is calculated on the accumulated amount each year.`,
                calc: true
            };
        } else if (questionType === 2) {
            // Compound interest - find initial value (working backwards)
            const finalValue = [1200, 1500, 2400, 3000][utils.rInt(0, 3)];
            const rate = [5, 10, 20][utils.rInt(0, 2)];
            const years = utils.rInt(2, 3);
            const multiplier = 1 + rate / 100;
            const principal = Math.round(finalValue / Math.pow(multiplier, years));
            const correctAnswer = `\\$${principal}`;
            
            // Common mistakes
            const simpleInterest = Math.round(finalValue / (1 + rate * years / 100));
            const wrongPower = Math.round(finalValue / Math.pow(multiplier, years - 1));
            const wrongCalc = Math.round(finalValue - (finalValue * rate * years / 100));
            
            const candidateDistractors = [
                `\\$${simpleInterest}`,
                `\\$${wrongPower}`,
                `\\$${wrongCalc}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\$${Math.round(finalValue / Math.pow(1 + utils.rInt(1, 15) / 100, years))}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{An investment grows to \\$${finalValue} after ${years} years at ${rate}\\% per year compound interest. What was the initial investment?}`),
                instruction: "Calculate initial value",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use the compound interest formula: A = P(1 + r)^n. Rearranging: P = A/(1 + r)^n. Here, P = ${finalValue}/(1 + ${rate/100})^${years} = ${finalValue}/${Math.pow(multiplier, years).toFixed(2)} = \\$${principal}.`,
                calc: true
            };
        } else if (questionType === 3) {
            // Depreciation - calculate final value
            const initialValue = [20000, 30000, 40000, 50000][utils.rInt(0, 3)];
            const rate = [10, 15, 20, 25][utils.rInt(0, 3)];
            const years = utils.rInt(2, 4);
            const multiplier = 1 - rate / 100;
            const finalValue = Math.round(initialValue * Math.pow(multiplier, years));
            const correctAnswer = `\\$${finalValue}`;
            
            // Common mistakes: adding instead of subtracting, wrong power, simple depreciation
            const simpleDepreciation = initialValue - (initialValue * rate * years / 100);
            const wrongPower = Math.round(initialValue * Math.pow(multiplier, years - 1));
            const wrongSign = Math.round(initialValue * Math.pow(1 + rate / 100, years));
            
            const candidateDistractors = [
                `\\$${Math.round(simpleDepreciation)}`,
                `\\$${wrongPower}`,
                `\\$${wrongSign}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\$${Math.round(initialValue * Math.pow(1 - utils.rInt(5, 30) / 100, years))}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{A car worth \\$${initialValue} depreciates at ${rate}\\% per year. What is its value after ${years} years?}`),
                instruction: "Calculate depreciated value",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use the depreciation formula: A = P(1 - r)^n. Here, A = ${initialValue}(1 - ${rate/100})^${years} = ${initialValue}(${multiplier})^${years} = \\$${finalValue}. Depreciation reduces the value by a percentage each year.`,
                calc: true
            };
        } else if (questionType === 4) {
            // Appreciation - calculate percentage increase
            const initial = [100, 200, 500, 1000][utils.rInt(0, 3)];
            const years = utils.rInt(2, 3);
            const rate = [5, 10, 15, 20][utils.rInt(0, 3)];
            const multiplier = 1 + rate / 100;
            const final = Math.round(initial * Math.pow(multiplier, years));
            const correctAnswer = `${rate}\\%`;
            
            // Common mistakes: total percentage, wrong rates
            const totalPercentage = Math.round((final - initial) * 100 / initial);
            const wrongRate1 = rate + 5;
            const wrongRate2 = rate - 5;
            
            const candidateDistractors = [
                `${totalPercentage}\\%`,
                `${wrongRate1}\\%`,
                `${wrongRate2}\\%`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(1, 30)}\\%`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{An asset worth \\$${initial} increases to \\$${final} after ${years} years. What is the annual growth rate (compound)?}`),
                instruction: "Find the annual rate",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use A = P(1 + r)^n: ${final} = ${initial}(1 + r)^${years}. Solving: (1 + r)^${years} = ${(final/initial).toFixed(2)}, so 1 + r = ${multiplier.toFixed(2)}, giving r = ${rate/100} = ${rate}\\%. This is the annual compound growth rate.`,
                calc: true
            };
        } else if (questionType === 5) {
            // Population growth
            const initial = [1000, 5000, 10000, 50000][utils.rInt(0, 3)];
            const rate = [2, 3, 5][utils.rInt(0, 2)];
            const years = utils.rInt(3, 5);
            const multiplier = 1 + rate / 100;
            const final = Math.round(initial * Math.pow(multiplier, years));
            const correctAnswer = `${final}`;
            
            // Common mistakes
            const simpleGrowth = initial + (initial * rate * years / 100);
            const wrongPower = Math.round(initial * Math.pow(multiplier, years - 1));
            const wrongRate = Math.round(initial * Math.pow(1 + rate / 10, years));
            
            const candidateDistractors = [
                `${Math.round(simpleGrowth)}`,
                `${wrongPower}`,
                `${wrongRate}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${Math.round(initial * Math.pow(1 + utils.rInt(1, 8) / 100, years))}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{A population of ${initial} grows at ${rate}\\% per year. What is the population after ${years} years?}`),
                instruction: "Calculate population",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use the exponential growth formula: P = P_0(1 + r)^t. Here, P = ${initial}(1 + ${rate/100})^${years} = ${initial}(${multiplier})^${years} = ${final}. Compound growth applies to populations.`,
                calc: true
            };
        } else {
            // Half-life / decay
            const initial = [800, 1600, 3200][utils.rInt(0, 2)];
            const halfLives = utils.rInt(2, 4);
            const final = initial / Math.pow(2, halfLives);
            const years = [2, 5, 10][utils.rInt(0, 2)];
            const correctAnswer = `${final}`;
            
            // Common mistakes
            const linearDecay = initial - (initial / 2 * halfLives);
            const wrongPower = initial / Math.pow(2, halfLives - 1);
            const wrongCalc = initial / (2 * halfLives);
            
            const candidateDistractors = [
                `${Math.round(linearDecay)}`,
                `${wrongPower}`,
                `${wrongCalc}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${initial / Math.pow(2, utils.rInt(1, 5))}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{A substance has ${initial} grams initially. After ${years} years (${halfLives} half-lives), how much remains?}`),
                instruction: "Calculate remaining amount",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `After each half-life, the amount halves. After ${halfLives} half-lives: ${initial} ÷ 2^${halfLives} = ${initial} ÷ ${Math.pow(2, halfLives)} = ${final} grams. This is exponential decay.`,
                calc: true
            };
        }
    }
};
