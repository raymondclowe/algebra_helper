// Standard Deviation and Variance Question Templates
// Level 21-22: Statistics - measures of spread
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.StatisticsSpread = {
    getStatisticsSpreadQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 8);
        
        if (questionType === 1) {
            // Calculate variance: σ² = Σ(x - μ)² / n
            const data = [
                utils.rInt(10, 15),
                utils.rInt(15, 20),
                utils.rInt(20, 25),
                utils.rInt(25, 30)
            ];
            const n = data.length;
            const sum = data.reduce((a, b) => a + b, 0);
            const mean = sum / n;
            const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
            const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
            const varianceClean = utils.roundToClean(variance, 2);
            const correctAnswer = `${varianceClean}`;
            
            // Common mistakes: forgot to square, used n-1, calculated std dev
            const forgotSquare = utils.roundToClean(data.map(x => Math.abs(x - mean)).reduce((a, b) => a + b, 0) / n, 2);
            const usedNMinus1 = utils.roundToClean(squaredDiffs.reduce((a, b) => a + b, 0) / (n - 1), 2);
            const stdDev = utils.roundToClean(Math.sqrt(variance), 2);
            
            const candidateDistractors = [
                `${forgotSquare}`,
                `${usedNMinus1}`,
                `${stdDev}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.roundToClean(utils.rInt(10, 100) / utils.rInt(1, 5), 2)}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Calculate the variance of the data: } ${data.join(', ')}`),
                instruction: "Use σ² = Σ(x - μ)² / n (to 2 d.p.)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `First find mean: μ = ${sum}/${n} = ${mean}. Then calculate Σ(x - μ)²: ${squaredDiffs.map((v, i) => `(${data[i]} - ${mean})² = ${utils.roundToClean(v, 2)}`).join(', ')}. Sum = ${utils.roundToClean(squaredDiffs.reduce((a, b) => a + b, 0), 2)}. Variance = ${utils.roundToClean(squaredDiffs.reduce((a, b) => a + b, 0), 2)}/${n} = ${varianceClean}.`,
                calc: true
            };
        } else if (questionType === 2) {
            // Calculate standard deviation: σ = √(variance)
            const data = [
                utils.rInt(5, 10),
                utils.rInt(10, 15),
                utils.rInt(15, 20),
                utils.rInt(20, 25),
                utils.rInt(25, 30)
            ];
            const n = data.length;
            const sum = data.reduce((a, b) => a + b, 0);
            const mean = sum / n;
            const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
            const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
            const stdDev = Math.sqrt(variance);
            const stdDevClean = utils.roundToClean(stdDev, 2);
            const correctAnswer = `${stdDevClean}`;
            
            // Common mistakes: gave variance, forgot sqrt, used n-1
            const gaveVariance = utils.roundToClean(variance, 2);
            const usedNMinus1 = utils.roundToClean(Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / (n - 1)), 2);
            const wrongCalc = utils.roundToClean(stdDev * 1.2, 2);
            
            const candidateDistractors = [
                `${gaveVariance}`,
                `${usedNMinus1}`,
                `${wrongCalc}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.roundToClean(utils.rInt(5, 20), 2)}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Calculate the standard deviation of: } ${data.join(', ')}`),
                instruction: "Use σ = √(Σ(x - μ)² / n) (to 2 d.p.)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Mean μ = ${mean.toFixed(2)}. Variance σ² = Σ(x - μ)²/n = ${gaveVariance}. Standard deviation σ = √${gaveVariance} = ${stdDevClean}. Standard deviation measures the spread of data around the mean.`,
                calc: true
            };
        } else if (questionType === 3) {
            // Effect of adding constant to all values
            const originalMean = utils.rInt(20, 40);
            const originalStdDev = utils.rInt(3, 8);
            const constant = utils.rInt(5, 15);
            const newMean = originalMean + constant;
            const newStdDev = originalStdDev;  // Standard deviation doesn't change!
            const correctAnswer = `${newMean}, ${newStdDev}`;
            
            // Common mistakes: both change, std dev changes, wrong calculation
            const bothChange = `${newMean}, ${originalStdDev + constant}`;
            const stdDevChanges = `${newMean}, ${utils.roundToClean(originalStdDev * 1.1, 2)}`;
            const wrongMean = `${originalMean}, ${originalStdDev}`;
            
            const candidateDistractors = [
                bothChange,
                stdDevChanges,
                wrongMean
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(20, 60)}, ${utils.rInt(3, 15)}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{A dataset has mean ${originalMean} and standard deviation ${originalStdDev}. If ${constant} is added to every value, what are the new mean and standard deviation?}`),
                instruction: "Give as: new mean, new σ",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Adding a constant to all values shifts the mean by that constant: new mean = ${originalMean} + ${constant} = ${newMean}. However, standard deviation measures spread from the mean, which doesn't change when all values shift equally. New σ = ${newStdDev}.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Effect of multiplying all values by constant
            const originalMean = utils.rInt(10, 30);
            const originalStdDev = utils.rInt(2, 6);
            const multiplier = [2, 3, 4, 5][utils.rInt(0, 3)];
            const newMean = originalMean * multiplier;
            const newStdDev = originalStdDev * multiplier;
            const correctAnswer = `${newMean}, ${newStdDev}`;
            
            // Common mistakes: only mean changes, squared multiplier, wrong calculation
            const onlyMean = `${newMean}, ${originalStdDev}`;
            const squaredMultiplier = `${newMean}, ${originalStdDev * multiplier * multiplier}`;
            const wrongBoth = `${originalMean + multiplier}, ${originalStdDev + multiplier}`;
            
            const candidateDistractors = [
                onlyMean,
                squaredMultiplier,
                wrongBoth
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(20, 100)}, ${utils.rInt(5, 20)}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{A dataset has mean ${originalMean} and standard deviation ${originalStdDev}. If every value is multiplied by ${multiplier}, what are the new mean and standard deviation?}`),
                instruction: "Give as: new mean, new σ",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Multiplying all values by a constant multiplies both the mean and standard deviation by that constant (actually by |constant|). New mean = ${originalMean} × ${multiplier} = ${newMean}. New σ = ${originalStdDev} × ${multiplier} = ${newStdDev}.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Given mean and variance, find sum of squares Σx²
            const n = utils.rInt(4, 6);
            const mean = utils.rInt(10, 20);
            const variance = utils.rInt(4, 16);
            
            // Variance = (Σx² / n) - μ²
            // Therefore: Σx² = n(variance + μ²)
            const sumOfSquares = n * (variance + mean * mean);
            const correctAnswer = `${sumOfSquares}`;
            
            // Common mistakes: n*variance, just variance, wrong formula
            const wrongFormula1 = n * variance;
            const wrongFormula2 = n * mean * mean;
            const wrongFormula3 = variance + mean * mean;
            
            const candidateDistractors = [
                `${wrongFormula1}`,
                `${wrongFormula2}`,
                `${wrongFormula3}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(100, 2000)}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{A dataset of ${n} values has mean ${mean} and variance ${variance}. Find Σx².}`),
                instruction: "Use: variance = (Σx²/n) - μ²",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Rearrange the variance formula: σ² = (Σx²/n) - μ². So Σx² = n(σ² + μ²) = ${n}(${variance} + ${mean}²) = ${n}(${variance + mean * mean}) = ${sumOfSquares}.`,
                calc: false
            };
        } else if (questionType === 6) {
            // Interpret standard deviation
            const correctAnswer = `\\text{Measures the spread of data around the mean}`;
            const candidateDistractors = [
                `\\text{The middle value in ordered data}`,
                `\\text{The average of all values}`,
                `\\text{The difference between max and min}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\text{Random interpretation}`
            );
            
            return {
                tex: `\\text{What does standard deviation measure?}`,
                instruction: "Select the correct interpretation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Standard deviation (σ) measures how spread out the data values are from the mean. A low σ means data is clustered close to the mean; a high σ means data is more spread out. It's the square root of variance.`,
                calc: false
            };
        } else if (questionType === 7) {
            // Compare standard deviations of different datasets
            const dataset1 = [10, 11, 12, 13, 14];
            const dataset2 = [5, 10, 15, 20, 25];
            
            const mean1 = dataset1.reduce((a, b) => a + b, 0) / dataset1.length;
            const mean2 = dataset2.reduce((a, b) => a + b, 0) / dataset2.length;
            
            const variance1 = dataset1.map(x => Math.pow(x - mean1, 2)).reduce((a, b) => a + b, 0) / dataset1.length;
            const variance2 = dataset2.map(x => Math.pow(x - mean2, 2)).reduce((a, b) => a + b, 0) / dataset2.length;
            
            const stdDev1 = utils.roundToClean(Math.sqrt(variance1), 2);
            const stdDev2 = utils.roundToClean(Math.sqrt(variance2), 2);
            
            let correctAnswer;
            if (stdDev1 < stdDev2) {
                correctAnswer = `\\text{Dataset B has greater spread}`;
            } else if (stdDev1 > stdDev2) {
                correctAnswer = `\\text{Dataset A has greater spread}`;
            } else {
                correctAnswer = `\\text{Equal spread}`;
            }
            
            const candidateDistractors = [
                correctAnswer === `\\text{Dataset B has greater spread}` ? `\\text{Dataset A has greater spread}` : `\\text{Dataset B has greater spread}`,
                `\\text{Equal spread}`,
                `\\text{Cannot determine}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\text{Random answer}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Dataset A: } ${dataset1.join(', ')}. \\text{ Dataset B: } ${dataset2.join(', ')}. \\text{ Which has greater spread?}`),
                instruction: "Compare standard deviations",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Calculate standard deviations: Dataset A has σ = ${stdDev1}, Dataset B has σ = ${stdDev2}. ${correctAnswer.replace(/\\text\{|\}/g, '')} since ${stdDev1 < stdDev2 ? stdDev2 : stdDev1} > ${stdDev1 < stdDev2 ? stdDev1 : stdDev2}.`,
                calc: true
            };
        } else {
            // Calculate from frequency table
            const values = [2, 4, 6, 8];
            const frequencies = [
                utils.rInt(2, 5),
                utils.rInt(3, 6),
                utils.rInt(2, 5),
                utils.rInt(1, 4)
            ];
            
            const n = frequencies.reduce((a, b) => a + b, 0);
            const sumFX = values.reduce((sum, val, i) => sum + val * frequencies[i], 0);
            const mean = sumFX / n;
            
            const sumFXSquared = values.reduce((sum, val, i) => sum + Math.pow(val - mean, 2) * frequencies[i], 0);
            const variance = sumFXSquared / n;
            const stdDev = Math.sqrt(variance);
            const stdDevClean = utils.roundToClean(stdDev, 2);
            const correctAnswer = `${stdDevClean}`;
            
            // Common mistakes: ignored frequency, wrong formula, calculated variance
            const ignoredFreq = utils.roundToClean(Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / values.length), 2);
            const gaveVariance = utils.roundToClean(variance, 2);
            const wrongCalc = utils.roundToClean(stdDev * 1.15, 2);
            
            const candidateDistractors = [
                `${ignoredFreq}`,
                `${gaveVariance}`,
                `${wrongCalc}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.roundToClean(utils.rInt(1, 10), 2)}`
            );
            
            const tableRows = values.map((val, i) => `${val}: ${frequencies[i]}`).join(', ');
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Calculate standard deviation from this frequency table: } ${tableRows}`),
                instruction: "Use σ = √(Σf(x-μ)² / Σf) (to 2 d.p.)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `First find mean: μ = Σfx/Σf = ${sumFX}/${n} = ${mean.toFixed(2)}. Then variance: σ² = Σf(x-μ)²/Σf = ${variance.toFixed(2)}. Standard deviation: σ = √${variance.toFixed(2)} = ${stdDevClean}.`,
                calc: true
            };
        }
    }
};
