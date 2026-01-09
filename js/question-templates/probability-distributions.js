// Probability Distributions Question Templates
// Level 32-33: Binomial and Normal Distributions
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.ProbabilityDistributions = {
    // Probability distributions - binomial and normal
    getProbabilityDistributionQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 6);
        
        if (questionType === 1) {
            // Binomial distribution - identify
            const n = utils.rInt(5, 10);
            const p = [0.1, 0.2, 0.25, 0.3, 0.4, 0.5][utils.rInt(0, 5)];
            
            return {
                tex: `\\text{Coin flipped ${n} times, P(heads) = ${p}}`,
                instruction: "What distribution models the number of heads?",
                displayAnswer: `\\text{Binomial: } B(${n}, ${p})`,
                distractors: utils.ensureUniqueDistractors(
                    `\\text{Binomial: } B(${n}, ${p})`,
                    [
                        `\\text{Normal: } N(${n}, ${p})`,
                        `\\text{Poisson: } Po(${n})`,
                        `\\text{Uniform: } U(0, ${n})`
                    ],
                    () => {
                        const dist = ["Geometric", "Exponential", "Chi-squared"];
                        return `\\text{${dist[utils.rInt(0, dist.length - 1)]}}`;
                    }
                ),
                explanation: `This is a binomial distribution: fixed number of trials (${n}), two outcomes, constant probability (${p}), independent trials. Notation: B(${n}, ${p}).`,
                calc: false
            };
        } else if (questionType === 2) {
            // Binomial mean
            const n = utils.rInt(10, 20);
            const p = [0.2, 0.25, 0.3, 0.4, 0.5][utils.rInt(0, 4)];
            const mean = utils.roundToClean(n * p, 3);  // Round to avoid floating-point errors
            
            return {
                tex: `X \\sim B(${n}, ${p})`,
                instruction: "What is E(X), the expected value?",
                displayAnswer: `${mean}`,
                distractors: utils.ensureUniqueDistractors(
                    `${mean}`,
                    [
                        `${n}`,
                        `${p}`,
                        `${n + p}`
                    ],
                    () => `${utils.rInt(1, 30)}`
                ),
                explanation: `For binomial distribution B(n, p), the mean is E(X) = np = ${n} × ${p} = ${mean}.`,
                calc: true
            };
        } else if (questionType === 3) {
            // Binomial variance
            const n = utils.rInt(10, 20);
            const p = [0.2, 0.25, 0.3, 0.4, 0.5][utils.rInt(0, 4)];
            const variance = utils.roundToClean(n * p * (1 - p), 3);  // Round to avoid floating-point errors
            
            return {
                tex: `X \\sim B(${n}, ${p})`,
                instruction: "What is Var(X)?",
                displayAnswer: `${variance}`,
                distractors: utils.ensureUniqueDistractors(
                    `${variance}`,
                    [
                        `${utils.roundToClean(n * p, 3)}`,
                        `${utils.roundToClean(n * (1 - p), 3)}`,
                        `${utils.roundToClean(p * (1 - p), 3)}`
                    ],
                    () => `${utils.rInt(1, 20)}`
                ),
                explanation: `For binomial B(n, p), variance is Var(X) = np(1-p) = ${n} × ${p} × ${1 - p} = ${variance}.`,
                calc: true
            };
        } else if (questionType === 4) {
            // Normal distribution - identify
            const mu = utils.rInt(50, 100);
            const sigma = utils.rInt(5, 15);
            
            return {
                tex: `\\text{Heights are normally distributed with mean ${mu} cm, SD ${sigma} cm}`,
                instruction: "What notation represents this distribution?",
                displayAnswer: `N(${mu}, ${sigma}^2)`,
                distractors: utils.ensureUniqueDistractors(
                    `N(${mu}, ${sigma}^2)`,
                    [
                        `N(${mu}, ${sigma})`,
                        `B(${mu}, ${sigma})`,
                        `N(${sigma}, ${mu})`
                    ],
                    () => `N(${utils.rInt(10, 100)}, ${utils.rInt(1, 20)})`
                ),
                explanation: `Normal distribution notation is N(μ, σ²) where μ is mean and σ² is variance. So N(${mu}, ${sigma}²). Note: variance, not standard deviation!`,
                calc: false
            };
        } else if (questionType === 5) {
            // Standard normal distribution
            return {
                tex: `Z \\sim N(0, 1)`,
                instruction: "What is this distribution called?",
                displayAnswer: "Standard normal distribution",
                distractors: utils.ensureUniqueDistractors(
                    "Standard normal distribution",
                    [
                        "Binomial distribution",
                        "Poisson distribution",
                        "Uniform distribution"
                    ],
                    () => {
                        const names = ["Exponential distribution", "Chi-squared distribution", "Student's t-distribution"];
                        return names[utils.rInt(0, names.length - 1)];
                    }
                ),
                explanation: `N(0, 1) is the standard normal distribution with mean 0 and variance 1. We standardize: Z = (X - μ)/σ.`,
                calc: false
            };
        } else {
            // Standardizing normal variable
            const mu = utils.rInt(50, 100);
            const sigma = utils.rInt(5, 15);
            
            return {
                tex: `X \\sim N(${mu}, ${sigma}^2)`,
                instruction: `How do we standardize X to get Z ~ N(0, 1)?`,
                displayAnswer: `Z = \\frac{X - ${mu}}{${sigma}}`,
                distractors: utils.ensureUniqueDistractors(
                    `Z = \\frac{X - ${mu}}{${sigma}}`,
                    [
                        `Z = \\frac{X - ${mu}}{${sigma}^2}`,
                        `Z = \\frac{X}{${sigma}}`,
                        `Z = X - ${mu}`
                    ],
                    () => `Z = \\frac{X - ${utils.rInt(10, 100)}}{${utils.rInt(1, 20)}}`
                ),
                explanation: `To standardize, subtract the mean and divide by standard deviation: Z = (X - μ)/σ = (X - ${mu})/${sigma}.`,
                calc: false
            };
        }
    },
    
    // Continuous Random Variables - PDF, CDF, Expected Value, Variance
    getContinuousRandomVariable: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 4);
        
        if (questionType === 1) {
            // Identify PDF property: ∫f(x)dx = 1
            return {
                tex: utils.wrapLongLatexText(`\\text{For a continuous random variable } X \\text{ with PDF } f(x)`),
                instruction: `\\text{What must } \\int_{-\\infty}^{\\infty} f(x) \\, dx \\text{ equal?}`,
                displayAnswer: `1`,
                distractors: utils.ensureUniqueDistractors(
                    `1`,
                    [
                        `0`,
                        `E(X)`,
                        `\\text{Var}(X)`
                    ],
                    () => `${utils.rInt(2, 10)}`
                ),
                explanation: `For any probability density function (PDF), the total area under the curve must equal 1: ∫_{-∞}^{∞} f(x) dx = 1. This ensures all probabilities sum to 1.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Find constant k in a simple PDF: f(x) = k for a ≤ x ≤ b (uniform)
            const a = 0;
            const b = [4, 5, 8, 10][utils.rInt(0, 3)];
            const k = utils.roundToClean(1 / b, 4);
            
            return {
                tex: utils.wrapLongLatexText(`f(x) = \\begin{cases} k & ${a} \\leq x \\leq ${b} \\\\ 0 & \\text{otherwise} \\end{cases}`),
                instruction: `\\text{Find } k \\text{ if } f(x) \\text{ is a valid PDF}`,
                displayAnswer: `\\frac{1}{${b}}`,
                distractors: utils.ensureUniqueDistractors(
                    `\\frac{1}{${b}}`,
                    [
                        `${b}`,
                        `\\frac{1}{${b * 2}}`,
                        `\\frac{${b}}{2}`
                    ],
                    () => `\\frac{1}{${utils.rInt(2, 12)}}`
                ),
                explanation: `For a valid PDF, ∫f(x)dx = 1. Here: ∫₀^${b} k dx = k·${b} = 1, so k = 1/${b}. This is the uniform distribution on [0, ${b}].`,
                calc: true
            };
        } else if (questionType === 3) {
            // Expected value of uniform distribution
            const a = 0;
            const b = [4, 6, 8, 10][utils.rInt(0, 3)];
            const expectedValue = (a + b) / 2;
            
            return {
                tex: utils.wrapLongLatexText(`X \\sim U(${a}, ${b}) \\text{ (uniform distribution)}`),
                instruction: `\\text{Find } E(X)`,
                displayAnswer: `${expectedValue}`,
                distractors: utils.ensureUniqueDistractors(
                    `${expectedValue}`,
                    [
                        `${b}`,
                        `${a}`,
                        `${b - a}`
                    ],
                    () => `${utils.rInt(1, 15)}`
                ),
                explanation: `For uniform distribution U(a, b), the expected value is E(X) = (a + b)/2 = (${a} + ${b})/2 = ${expectedValue}. The mean is at the midpoint.`,
                calc: true
            };
        } else {
            // P(a ≤ X ≤ b) using PDF
            // Simple case: uniform distribution f(x) = 1/c on [0, c]
            const c = 10;
            const a = 2;
            const b = 5;
            const probability = (b - a) / c;
            
            return {
                tex: utils.wrapLongLatexText(`X \\sim U(0, ${c}). \\text{ Find } P(${a} \\leq X \\leq ${b})`),
                instruction: "Calculate the probability",
                displayAnswer: `${probability}`,
                distractors: utils.ensureUniqueDistractors(
                    `${probability}`,
                    [
                        `${b / c}`,
                        `${a / c}`,
                        `${(b + a) / c}`
                    ],
                    () => `${utils.roundToClean(utils.rInt(1, 10) / 10, 2)}`
                ),
                explanation: `For uniform distribution, P(a ≤ X ≤ b) = (b - a)/c = (${b} - ${a})/${c} = ${b - a}/${c} = ${probability}. This is the area under f(x) = 1/${c} from ${a} to ${b}.`,
                calc: true
            };
        }
    }
};
