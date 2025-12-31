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
                        "Unit normal distribution",
                        "Normal distribution",
                        "Gaussian distribution"
                    ],
                    () => {
                        const names = ["Z-distribution", "Standard distribution", "Central normal"];
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
    }
};
