// Data Visualization Question Templates
// Level 21-22: Statistical charts (histograms, box plots, scatter plots)
// Uses Chart.js library for visualization

window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.DataVisualization = {
    // Generate a unique ID for each chart container
    generateChartId: function() {
        return 'chart-' + Math.random().toString(36).substr(2, 9);
    },
    
    // Create chart HTML using Chart.js
    createChart: function(type, data, options = {}) {
        const chartId = this.generateChartId();
        const width = options.width || 400;
        const height = options.height || 300;
        
        const html = `
            <div style="width: ${width}px; height: ${height}px; margin: 10px auto;">
                <canvas id="${chartId}"></canvas>
            </div>
            <script>
            (function() {
                if (typeof Chart === 'undefined') {
                    console.warn('Chart.js library not loaded yet');
                    return;
                }
                try {
                    const ctx = document.getElementById('${chartId}').getContext('2d');
                    new Chart(ctx, {
                        type: '${type}',
                        data: ${JSON.stringify(data)},
                        options: ${JSON.stringify(options.chartOptions || {})}
                    });
                } catch (e) {
                    console.error('Error creating chart:', e);
                }
            })();
            </script>
        `;
        
        return html;
    },
    
    getDataVisualizationQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 5);
        
        if (questionType === 1) {
            // Histogram: identify modal class
            const classes = ['0-10', '10-20', '20-30', '30-40', '40-50'];
            const frequencies = [
                utils.rInt(3, 8),
                utils.rInt(8, 15),
                utils.rInt(12, 20),
                utils.rInt(5, 12),
                utils.rInt(2, 6)
            ];
            const maxFreq = Math.max(...frequencies);
            const modalIndex = frequencies.indexOf(maxFreq);
            const modalClass = classes[modalIndex];
            
            const chartHtml = this.createChart('bar', {
                labels: classes,
                datasets: [{
                    label: 'Frequency',
                    data: frequencies,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            }, {
                chartOptions: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: 'Test Scores Distribution' }
                    },
                    scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Frequency' } },
                        x: { title: { display: true, text: 'Score Range' } }
                    }
                }
            });
            
            const correctAnswer = modalClass;
            const candidateDistractors = classes.filter(c => c !== modalClass).slice(0, 3);
            
            return {
                tex: chartHtml,
                instruction: "What is the modal class?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => classes[utils.rInt(0, classes.length - 1)]
                ),
                explanation: `The modal class is the class with the highest frequency. Looking at the histogram, the ${modalClass} class has the highest bar with frequency ${maxFreq}.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 2) {
            // Box plot: identify median
            const data = [12, 15, 18, 22, 25, 28, 32, 35, 40];
            const median = data[Math.floor(data.length / 2)];
            const q1 = data[Math.floor(data.length / 4)];
            const q3 = data[Math.floor(3 * data.length / 4)];
            const min = data[0];
            const max = data[data.length - 1];
            
            const chartHtml = this.createChart('boxplot', {
                labels: ['Test Scores'],
                datasets: [{
                    label: 'Scores',
                    data: [[{ min, q1, median, q3, max }]],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                }]
            }, {
                chartOptions: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: 'Test Scores Box Plot' }
                    }
                }
            });
            
            const correctAnswer = `${median}`;
            const candidateDistractors = [
                `${q1}`,  // Q1
                `${q3}`,  // Q3
                `${Math.round((min + max) / 2)}`  // Mean of min and max
            ];
            
            return {
                tex: chartHtml,
                instruction: "What is the median?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${utils.rInt(10, 45)}`
                ),
                explanation: `The median is the middle value (the line inside the box). From the box plot, the median is ${median}.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 3) {
            // Box plot: identify IQR
            const data = [10, 15, 20, 25, 30, 35, 40, 45, 50];
            const q1 = data[Math.floor(data.length / 4)];
            const q3 = data[Math.floor(3 * data.length / 4)];
            const median = data[Math.floor(data.length / 2)];
            const min = data[0];
            const max = data[data.length - 1];
            const iqr = q3 - q1;
            
            const chartHtml = this.createChart('boxplot', {
                labels: ['Data Set'],
                datasets: [{
                    label: 'Values',
                    data: [[{ min, q1, median, q3, max }]],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)'
                }]
            }, {
                chartOptions: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: 'Data Distribution' }
                    }
                }
            });
            
            const correctAnswer = `${iqr}`;
            const candidateDistractors = [
                `${q3}`,  // Just Q3
                `${q1}`,  // Just Q1
                `${max - min}`  // Range instead of IQR
            ];
            
            return {
                tex: chartHtml,
                instruction: "What is the interquartile range (IQR)?",
                displayAnswer: correctAnswer,
                distractors: utils.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${utils.rInt(5, 30)}`
                ),
                explanation: `The IQR is Q3 - Q1. From the box plot, Q3 = ${q3} and Q1 = ${q1}, so IQR = ${q3} - ${q1} = ${iqr}. The IQR represents the width of the box.`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else if (questionType === 4) {
            // Scatter plot: identify correlation
            const correlationType = utils.rInt(0, 2);
            let xData, yData, correlation, description;
            
            if (correlationType === 0) {
                // Positive correlation
                xData = [1, 2, 3, 4, 5, 6, 7, 8];
                yData = xData.map(x => 2 * x + utils.rInt(-2, 2));
                correlation = 'positive';
                description = 'Strong positive correlation';
            } else if (correlationType === 1) {
                // Negative correlation
                xData = [1, 2, 3, 4, 5, 6, 7, 8];
                yData = xData.map(x => -1.5 * x + 15 + utils.rInt(-2, 2));
                correlation = 'negative';
                description = 'Strong negative correlation';
            } else {
                // No correlation
                xData = [1, 2, 3, 4, 5, 6, 7, 8];
                yData = xData.map(() => utils.rInt(5, 15));
                correlation = 'none';
                description = 'No correlation';
            }
            
            const chartData = xData.map((x, i) => ({ x, y: yData[i] }));
            
            const chartHtml = this.createChart('scatter', {
                datasets: [{
                    label: 'Data Points',
                    data: chartData,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)'
                }]
            }, {
                chartOptions: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: 'Scatter Plot' }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Variable X' } },
                        y: { title: { display: true, text: 'Variable Y' } }
                    }
                }
            });
            
            const correctAnswer = description;
            let candidateDistractors;
            if (correlation === 'positive') {
                candidateDistractors = [
                    'Strong negative correlation',
                    'No correlation',
                    'Weak positive correlation'
                ];
            } else if (correlation === 'negative') {
                candidateDistractors = [
                    'Strong positive correlation',
                    'No correlation',
                    'Weak negative correlation'
                ];
            } else {
                candidateDistractors = [
                    'Strong positive correlation',
                    'Strong negative correlation',
                    'Weak positive correlation'
                ];
            }
            
            return {
                tex: chartHtml,
                instruction: "Describe the correlation shown in this scatter plot",
                displayAnswer: correctAnswer,
                distractors: candidateDistractors,
                explanation: `${description === 'Strong positive correlation' ? 'As X increases, Y increases consistently.' : description === 'Strong negative correlation' ? 'As X increases, Y decreases consistently.' : 'There is no clear pattern between X and Y.'}`,
                calc: false,
                requiresGraphLibrary: true
            };
        } else {
            // Compare two box plots
            const data1 = { min: 10, q1: 15, median: 20, q3: 25, max: 30 };
            const data2 = { min: 20, q1: 30, median: 40, q3: 50, max: 60 };
            const iqr1 = data1.q3 - data1.q1;
            const iqr2 = data2.q3 - data2.q1;
            
            const chartHtml = this.createChart('boxplot', {
                labels: ['Group A', 'Group B'],
                datasets: [{
                    label: 'Groups',
                    data: [[data1], [data2]],
                    backgroundColor: ['rgba(255, 159, 64, 0.5)', 'rgba(75, 192, 192, 0.5)']
                }]
            }, {
                chartOptions: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: 'Comparison of Two Groups' }
                    }
                }
            });
            
            const correctAnswer = iqr1 > iqr2 ? 'Group A' : 'Group B';
            const candidateDistractors = [
                iqr1 > iqr2 ? 'Group B' : 'Group A',
                'Both the same',
                'Cannot be determined'
            ];
            
            return {
                tex: chartHtml,
                instruction: "Which group has the greater spread (IQR)?",
                displayAnswer: correctAnswer,
                distractors: candidateDistractors,
                explanation: `Group A has IQR = ${iqr1}, Group B has IQR = ${iqr2}. ${correctAnswer} has the greater spread. The IQR measures the width of the box, which represents the middle 50% of the data.`,
                calc: false,
                requiresGraphLibrary: true
            };
        }
    }
};
