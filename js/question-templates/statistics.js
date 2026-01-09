// Statistics Question Templates
// Level 21-22
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Statistics = {
    getStatistics: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 12);
                
                if (questionType === 1) {
                    // Mean
                    const data = [utils.rInt(10, 20), utils.rInt(15, 25), utils.rInt(20, 30), utils.rInt(10, 25)];
                    const sum = data.reduce((a, b) => a + b, 0);
                    const mean = utils.roundToClean(sum / data.length);
                    const correctAnswer = `${mean}`;
                    const candidateDistractors = [
                        `${Math.max(...data)}`,
                        `${data[Math.floor(data.length / 2)]}`,
                        `${mean + 1}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(10, 30)}`
                    );
                    
                    return {
                        tex: `\\text{Data: } ${data.join(', ')}`,
                        instruction: "Calculate the mean",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Mean = sum/count = (${data.join(' + ')})/${data.length} = ${sum}/${data.length} = ${mean}.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Median
                    const data = [12, 15, 18, 20, 25].sort((a, b) => a - b);
                    const median = data[Math.floor(data.length / 2)];
                    const correctAnswer = `${median}`;
                    const candidateDistractors = [
                        `${data[0]}`,
                        `${data[data.length - 1]}`,
                        `${utils.roundToClean((data[0] + data[data.length - 1]) / 2)}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(10, 30)}`
                    );
                    
                    return {
                        tex: `\\text{Data: } ${data.join(', ')}`,
                        instruction: "Find the median",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Median is the middle value in sorted data. Since we have ${data.length} values, the median is the ${Math.floor(data.length / 2) + 1}th value: ${median}.`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Mode
                    const mode = utils.rInt(15, 25);
                    const data = [mode, utils.rInt(10, 14), mode, utils.rInt(26, 30), mode];
                    const correctAnswer = `${mode}`;
                    const candidateDistractors = [
                        `${data[1]}`,
                        `${data[3]}`,
                        `\\text{no mode}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(10, 30)}`
                    );
                    
                    return {
                        tex: `\\text{Data: } ${data.join(', ')}`,
                        instruction: "Find the mode",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Mode is the most frequent value. ${mode} appears ${data.filter(x => x === mode).length} times, more than any other value.`,
                        calc: false
                    };
                } else if (questionType === 4) {
                    // Range
                    const min = utils.rInt(10, 20);
                    const max = utils.rInt(40, 60);
                    const data = [min, utils.rInt(min + 5, max - 5), max];
                    const range = max - min;
                    const correctAnswer = `${range}`;
                    const candidateDistractors = [
                        `${max}`,
                        `${min}`,
                        `${(max + min) / 2}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(20, 50)}`
                    );
                    
                    return {
                        tex: `\\text{Data: } ${data.join(', ')}`,
                        instruction: "Calculate the range",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Range = maximum - minimum = ${max} - ${min} = ${range}.`,
                        calc: false
                    };
                } else if (questionType === 5) {
                    // Definition: What is the mean?
                    const correctAnswer = `\\text{The sum of all values divided by the count}`;
                    const candidateDistractors = [
                        `\\text{The middle value in ordered data}`,
                        `\\text{The most frequently occurring value}`,
                        `\\text{The difference between max and min}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{Define the mean (average) of a data set}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The mean is the arithmetic average. Calculate it by adding all values and dividing by how many values there are. Formula: mean = (Σx)/n, where Σx is the sum of all values and n is the count.`,
                        calc: false
                    };
                } else if (questionType === 6) {
                    // Definition: What is the median?
                    const correctAnswer = `\\text{The middle value when data is ordered}`;
                    const candidateDistractors = [
                        `\\text{The sum of all values divided by the count}`,
                        `\\text{The most frequently occurring value}`,
                        `\\text{The average of the first and last values}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{Define the median of a data set}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The median is the middle value in ordered data. If there's an odd number of values, it's the middle one. If even, it's the average of the two middle values. The median is less affected by outliers than the mean.`,
                        calc: false
                    };
                } else if (questionType === 7) {
                    // Definition: What is the mode?
                    const correctAnswer = `\\text{The most frequently occurring value}`;
                    const candidateDistractors = [
                        `\\text{The middle value when data is ordered}`,
                        `\\text{The sum of all values divided by the count}`,
                        `\\text{The difference between max and min}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{Define the mode of a data set}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The mode is the value that appears most frequently in a data set. A data set can have one mode, multiple modes (bimodal, multimodal), or no mode if all values occur with equal frequency.`,
                        calc: false
                    };
                } else if (questionType === 8) {
                    // Standard deviation concept
                    const correctAnswer = `\\text{A measure of spread around the mean}`;
                    const candidateDistractors = [
                        `\\text{The middle value of the data}`,
                        `\\text{The average of all values}`,
                        `\\text{The most common value}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{What does standard deviation measure?}`,
                        instruction: "Select the correct statement",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Standard deviation measures how spread out the data is from the mean. A small standard deviation means data points are close to the mean; a large standard deviation means they are more spread out. It's calculated as the square root of the variance.`,
                        calc: false
                    };
                } else if (questionType === 9) {
                    // Quartiles concept
                    const data = [10, 15, 20, 25, 30, 35, 40, 45, 50];
                    const q2 = data[Math.floor(data.length / 2)];
                    const correctAnswer = `${q2}`;
                    const candidateDistractors = [
                        `${data[0]}`,
                        `${data[data.length - 1]}`,
                        `${utils.roundToClean(data.reduce((a, b) => a + b, 0) / data.length)}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(15, 45)}`
                    );
                    
                    return {
                        tex: `\\text{Data: } ${data.join(', ')}\\\\[0.5em]\\text{Find Q2 (second quartile)}`,
                        instruction: "Calculate Q2",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Q2 (the second quartile) is the same as the median. For this ordered data with ${data.length} values, Q2 is the middle value: ${q2}. Q1 is the median of the lower half, Q3 is the median of the upper half.`,
                        calc: false
                    };
                } else if (questionType === 10) {
                    // Mean with larger dataset
                    const data = [utils.rInt(5, 10), utils.rInt(10, 15), utils.rInt(15, 20), utils.rInt(20, 25), utils.rInt(25, 30), utils.rInt(30, 35)];
                    const sum = data.reduce((a, b) => a + b, 0);
                    const mean = utils.roundToClean(sum / data.length, 1);
                    const correctAnswer = `${mean}`;
                    const candidateDistractors = [
                        `${Math.max(...data)}`,
                        `${data[Math.floor(data.length / 2)]}`,
                        `${utils.roundToClean(mean + 2, 1)}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(10, 30)}`
                    );
                    
                    return {
                        tex: `\\text{Data: } ${data.join(', ')}`,
                        instruction: "Calculate the mean",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Mean = (${data.join(' + ')})/${data.length} = ${sum}/${data.length} ≈ ${mean}.`,
                        calc: false
                    };
                } else if (questionType === 11) {
                    // Outlier concept
                    const correctAnswer = `\\text{A data point far from other values}`;
                    const candidateDistractors = [
                        `\\text{The middle value in a data set}`,
                        `\\text{The average of all data points}`,
                        `\\text{The most common value}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{What is an outlier in statistics?}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `An outlier is a data point that differs significantly from other observations. It may be much higher or much lower than most values. Outliers can greatly affect the mean but have less impact on the median, making the median a better measure of central tendency when outliers are present.`,
                        calc: false
                    };
                } else {
                    // IQR (Interquartile Range) definition
                    const correctAnswer = `\\text{The range of the middle 50% of data: } Q3 - Q1`;
                    const candidateDistractors = [
                        `\\text{The difference between max and min}`,
                        `\\text{The average of Q1 and Q3}`,
                        `\\text{Half of the standard deviation}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{What is the interquartile range (IQR)?}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The IQR is the range of the middle 50% of the data, calculated as Q3 - Q1. It measures the spread of the central portion of the data and is resistant to outliers. The IQR is used to identify outliers: values below Q1 - 1.5×IQR or above Q3 + 1.5×IQR are typically considered outliers.`,
                        calc: false
                    };
                }
    },
    
    getLinearRegressionQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 8);
        
        if (questionType === 1) {
            // Interpret correlation coefficient r
            const r = [0.95, 0.85, 0.50, -0.80, -0.95, 0.10][utils.rInt(0, 5)];
            let description;
            if (Math.abs(r) >= 0.9) {
                description = Math.sign(r) > 0 ? "Strong positive correlation" : "Strong negative correlation";
            } else if (Math.abs(r) >= 0.7) {
                description = Math.sign(r) > 0 ? "Moderate positive correlation" : "Moderate negative correlation";
            } else if (Math.abs(r) >= 0.3) {
                description = Math.sign(r) > 0 ? "Weak positive correlation" : "Weak negative correlation";
            } else {
                description = "Little to no correlation";
            }
            
            const correctAnswer = description;
            const candidateDistractors = [
                Math.sign(r) > 0 ? "Strong negative correlation" : "Strong positive correlation",  // Opposite
                "Perfect correlation",  // Exaggeration
                "Causation"  // Confusing correlation with causation
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => ["Weak correlation", "No relationship", "Moderate correlation"][utils.rInt(0, 2)]
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If the correlation coefficient } r = ${r},\\\\[0.5em]\\text{what does this indicate?}`),
                instruction: "Interpret the correlation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `r = ${r} indicates ${description}. The correlation coefficient r ranges from -1 to 1. Values near ±1 indicate strong linear relationships, while values near 0 indicate weak or no linear relationship. Positive r means as x increases, y tends to increase; negative r means as x increases, y tends to decrease.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Strongest correlation by magnitude
            const correlations = [
                { value: 0.3, label: "r = 0.3" },
                { value: -0.7, label: "r = -0.7" },
                { value: 0.5, label: "r = 0.5" },
                { value: -0.2, label: "r = -0.2" }
            ];
            const strongest = correlations.reduce((a, b) => Math.abs(a.value) > Math.abs(b.value) ? a : b);
            
            const correctAnswer = strongest.label;
            const candidateDistractors = correlations
                .filter(c => c.label !== strongest.label)
                .map(c => c.label);
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors.slice(0, 3),
                () => `r = ${(utils.rInt(-10, 10) / 10).toFixed(1)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Which correlation coefficient}\\\\[0.5em]\\text{indicates the strongest relationship?}`),
                instruction: "Select the strongest correlation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `${strongest.label} has the largest absolute value (|${strongest.value}| = ${Math.abs(strongest.value)}). The strength of correlation is determined by |r|, not by sign. |r| closer to 1 means stronger linear relationship.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Use regression line for prediction
            const a = utils.rInt(1, 5);
            const b = utils.rInt(1, 6);
            const x = utils.rInt(3, 8);
            const y = a * x + b;
            
            const correctAnswer = `${y}`;
            const candidateDistractors = [
                `${a * x}`,  // Forgot constant
                `${x + b}`,  // Added instead of multiplied
                `${y + a}`  // Calculation error
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(10, 50)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Regression line: } y = ${a}x + ${b}\\\\[0.5em]\\text{Predict y when x = ${x}}`),
                instruction: "Calculate using the regression line",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Substitute x = ${x} into y = ${a}x + ${b}: y = ${a}(${x}) + ${b} = ${a * x} + ${b} = ${y}. The regression line is used to predict y values for given x values.`,
                calc: false
            };
        } else if (questionType === 4) {
            // r = 0 interpretation
            const correctAnswer = "No linear correlation";
            const candidateDistractors = [
                "Perfect positive correlation",  // Opposite
                "Strong negative correlation",  // Wrong
                "Variables are independent"  // Too strong (could be nonlinear)
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => ["Weak correlation", "Moderate correlation", "No relationship"][utils.rInt(0, 2)]
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } r = 0, \\text{ what does this mean?}`),
                instruction: "Interpret r = 0",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `r = 0 means there is no linear correlation between the variables. However, this doesn't necessarily mean the variables are independent - there could be a nonlinear relationship. r only measures linear correlation.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Coefficient of determination r²
            const r = [0.6, 0.7, 0.8, 0.9][utils.rInt(0, 3)];
            const rSquared = r * r;
            const percentage = Math.round(rSquared * 100);
            
            const correctAnswer = `${percentage}%`;
            const candidateDistractors = [
                `${Math.round(r * 100)}%`,  // Used r instead of r²
                `${Math.round((1 - rSquared) * 100)}%`,  // Used 1-r²
                `${Math.round(rSquared * 50)}%`  // Calculation error
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(10, 95)}%`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } r = ${r}, \\text{ what percentage}\\\\[0.5em]\\text{of variation is explained by the model?}`),
                instruction: "Calculate r² as percentage",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `r² = (${r})² = ${rSquared.toFixed(2)} = ${percentage}%. The coefficient of determination r² represents the proportion of variance in the dependent variable explained by the independent variable. ${percentage}% of the variation in y is explained by its linear relationship with x.`,
                calc: false
            };
        } else if (questionType === 6) {
            // Correlation vs causation
            const correctAnswer = "Correlation does not imply causation";
            const candidateDistractors = [
                "Strong correlation proves causation",  // Common misconception
                "Correlation always implies causation",  // Wrong
                "r > 0.8 proves causation"  // Wrong
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => ["They are the same concept", "Causation implies correlation", "Neither exists"][utils.rInt(0, 2)]
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{What is the relationship between}\\\\[0.5em]\\text{correlation and causation?}`),
                instruction: "Select the correct statement",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Correlation does not imply causation. Two variables can be correlated without one causing the other - they might both be influenced by a third variable (confounding), or the relationship might be coincidental. Strong correlation indicates association, but additional evidence is needed to establish causation.`,
                calc: false
            };
        } else if (questionType === 7) {
            // Regression equation form
            const correctAnswer = `y = ax + b`;
            const candidateDistractors = [
                `x = ay + b`,  // Wrong direction (x as dependent variable)
                `y = ax^2 + bx + c`,  // Quadratic, not linear
                `y = a \\cdot b \\cdot x`  // Wrong (multiplication of parameters)
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const opts = [`y = ax^3 + b`, `y = \\frac{a}{x} + b`, `xy = a + b`];
                    return opts[utils.rInt(0, opts.length - 1)];
                }
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{What is the general form of}\\\\[0.5em]\\text{a linear regression equation?}`),
                instruction: "Select the standard form",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `The linear regression equation is y = ax + b, where a is the slope (rate of change), b is the y-intercept (value when x=0), x is the independent variable, and y is the dependent variable being predicted. This is also written as y = mx + c or ŷ = a + bx (equivalent forms with different parameter notation).`,
                calc: false
            };
        } else {
            // Predict with given regression line
            const a = utils.rInt(2, 4) * 0.5;  // Use 0.5 increments for variety
            const b = utils.rInt(1, 8);
            const x = utils.rInt(8, 15);
            const y = a * x + b;
            
            const correctAnswer = `${y}`;
            const candidateDistractors = [
                `${a * x}`,  // Forgot intercept
                `${Math.round(y + a)}`,  // Calculation error
                `${Math.round(x * b + a)}`  // Wrong order
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(10, 60)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Regression equation: } y = ${a}x + ${b}\\\\[0.5em]\\text{Find y when x = ${x}}`),
                instruction: "Make a prediction",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Substitute x = ${x}: y = ${a}(${x}) + ${b} = ${a * x} + ${b} = ${y}. The regression line allows us to predict y values for given x values based on the linear relationship found in the data.`,
                calc: true
            };
        }
    }
};
