// Statistics Question Templates
// Level 21-22
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Statistics = {
    getStatistics: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 4);
                
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
                } else {
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
                }
    }
};
