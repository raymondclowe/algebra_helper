// Hypothesis Testing Question Templates
// Level 33-34: Hypothesis Testing
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.HypothesisTesting = {
    // Hypothesis testing fundamentals
    getHypothesisTestingQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 6);
        
        if (questionType === 1) {
            // Identify null hypothesis
            const mu0 = utils.rInt(50, 100);
            
            return {
                tex: `\\text{Test if population mean differs from ${mu0}}`,
                instruction: "What is the null hypothesis H₀?",
                displayAnswer: `H_0: \\mu = ${mu0}`,
                distractors: utils.ensureUniqueDistractors(
                    `H_0: \\mu = ${mu0}`,
                    [
                        `H_0: \\mu \\neq ${mu0}`,
                        `H_0: \\mu > ${mu0}`,
                        `H_0: \\mu < ${mu0}`
                    ],
                    () => `H_0: \\mu = ${utils.rInt(10, 150)}`
                ),
                explanation: `The null hypothesis H₀ states no effect or no difference. For testing if mean differs from ${mu0}, H₀: μ = ${mu0}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Identify alternative hypothesis (two-tailed)
            const mu0 = utils.rInt(50, 100);
            
            return {
                tex: `\\text{Test if population mean differs from ${mu0}}`,
                instruction: "What is the alternative hypothesis H₁?",
                displayAnswer: `H_1: \\mu \\neq ${mu0}`,
                distractors: utils.ensureUniqueDistractors(
                    `H_1: \\mu \\neq ${mu0}`,
                    [
                        `H_1: \\mu = ${mu0}`,
                        `H_1: \\mu > ${mu0}`,
                        `H_1: \\mu < ${mu0}`
                    ],
                    () => `H_1: \\mu \\neq ${utils.rInt(10, 150)}`
                ),
                explanation: `For two-tailed test ("differs from"), alternative hypothesis H₁: μ ≠ ${mu0}. This tests for any difference, not a specific direction.`,
                calc: false
            };
        } else if (questionType === 3) {
            // One-tailed vs two-tailed
            return {
                tex: `\\text{Test: "Is mean height greater than 170 cm?"}`,
                instruction: "What type of test is this?",
                displayAnswer: "One-tailed (upper tail)",
                distractors: utils.ensureUniqueDistractors(
                    "One-tailed (upper tail)",
                    [
                        "Two-tailed",
                        "One-tailed (lower tail)",
                        "Non-parametric"
                    ],
                    () => {
                        const types = ["Z-test", "T-test", "Chi-squared test"];
                        return types[utils.rInt(0, types.length - 1)];
                    }
                ),
                explanation: `"Greater than" indicates a one-tailed test in the upper tail. H₀: μ = 170, H₁: μ > 170.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Significance level interpretation
            const alpha = [0.01, 0.05, 0.1][utils.rInt(0, 2)];
            const percent = alpha * 100;
            
            return {
                tex: `\\text{Significance level } \\alpha = ${alpha}`,
                instruction: "What does this mean?",
                displayAnswer: `${percent}\\% \\text{ probability of Type I error}`,
                distractors: utils.ensureUniqueDistractors(
                    `${percent}\\% \\text{ probability of Type I error}`,
                    [
                        `${percent}\\% \\text{ confidence level}`,
                        `${percent}\\% \\text{ probability of Type II error}`,
                        `${percent}\\% \\text{ power of the test}`
                    ],
                    () => `${utils.rInt(1, 20)}\\% \\text{ error rate}`
                ),
                explanation: `Significance level α = ${alpha} means ${percent}% probability of Type I error (rejecting true H₀). Confidence level = 1 - α = ${(1 - alpha) * 100}%.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Type I vs Type II error
            const errorType = utils.rInt(1, 2);
            
            if (errorType === 1) {
                return {
                    tex: `\\text{Reject } H_0 \\text{ when } H_0 \\text{ is true}`,
                    instruction: "What type of error is this?",
                    displayAnswer: "Type I error",
                    distractors: utils.ensureUniqueDistractors(
                        "Type I error",
                        [
                            "Type II error",
                            "Standard error",
                            "Sampling error"
                        ],
                        () => {
                            const errors = ["Systematic error", "Random error", "Measurement error"];
                            return errors[utils.rInt(0, errors.length - 1)];
                        }
                    ),
                    explanation: `Type I error: rejecting H₀ when it's actually true (false positive). Probability = α.`,
                    calc: false
                };
            } else {
                return {
                    tex: `\\text{Fail to reject } H_0 \\text{ when } H_0 \\text{ is false}`,
                    instruction: "What type of error is this?",
                    displayAnswer: "Type II error",
                    distractors: utils.ensureUniqueDistractors(
                        "Type II error",
                        [
                            "Type I error",
                            "Standard error",
                            "Sampling error"
                        ],
                        () => {
                            const errors = ["Systematic error", "Random error", "Measurement error"];
                            return errors[utils.rInt(0, errors.length - 1)];
                        }
                    ),
                    explanation: `Type II error: failing to reject H₀ when it's actually false (false negative). Probability = β.`,
                    calc: false
                };
            }
        } else {
            // P-value interpretation
            const pValue = [0.001, 0.01, 0.03, 0.08][utils.rInt(0, 3)];
            const alpha = 0.05;
            const reject = pValue < alpha;
            
            return {
                tex: `p\\text{-value} = ${pValue}, \\quad \\alpha = ${alpha}`,
                instruction: "What is the conclusion?",
                displayAnswer: reject ? `\\text{Reject } H_0` : `\\text{Fail to reject } H_0`,
                distractors: reject ? utils.ensureUniqueDistractors(
                    `\\text{Reject } H_0`,
                    [
                        `\\text{Fail to reject } H_0`,
                        `\\text{Accept } H_0`,
                        `\\text{Accept } H_1`
                    ],
                    () => `\\text{Inconclusive}`
                ) : utils.ensureUniqueDistractors(
                    `\\text{Fail to reject } H_0`,
                    [
                        `\\text{Reject } H_0`,
                        `\\text{Accept } H_0`,
                        `\\text{Accept } H_1`
                    ],
                    () => `\\text{Inconclusive}`
                ),
                explanation: reject 
                    ? `p-value (${pValue}) < α (${alpha}), so reject H₀. Evidence is significant.`
                    : `p-value (${pValue}) ≥ α (${alpha}), so fail to reject H₀. Insufficient evidence.`,
                calc: false
            };
        }
    }
};
