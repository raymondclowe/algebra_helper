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
    }
};
