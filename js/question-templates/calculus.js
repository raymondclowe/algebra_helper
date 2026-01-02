// Calculus - Integration Question Templates
// Level 24+
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Calculus = {
    getCalculus: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 12);
                
                if (questionType === 1) {
                    // Basic integration: ∫x^n dx
                    const n = utils.rInt(2, 5);
                    const newExp = n + 1;
                    const correctAnswer = `\\frac{x^{${newExp}}}{${newExp}} + C`;
                    const candidateDistractors = [
                        `\\frac{x^{${n}}}{${n}} + C`,
                        `${n}x^{${n - 1}} + C`,
                        `x^{${newExp}} + C`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randExp = utils.rInt(2, 7);
                            return `\\frac{x^{${randExp}}}{${randExp}} + C`;
                        }
                    );
                    return {
                        tex: `\\int x^${n} \\, dx`,
                        instruction: "Find the integral",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Apply the power rule for integration: ∫x^n dx = x^(n+1)/(n+1) + C. Therefore ∫x^${n} dx = x^${newExp}/${newExp} + C, where C is the constant of integration.`,
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Integration with coefficient: ∫ax^n dx
                    const a = utils.rInt(2, 8);
                    const n = utils.rInt(2, 4);
                    const newExp = n + 1;
                    const correctAnswer = `\\frac{${a}x^{${newExp}}}{${newExp}} + C`;
                    const candidateDistractors = [
                        `${a}x^{${newExp}} + C`,
                        `\\frac{x^{${newExp}}}{${newExp}} + C`,
                        `${a * n}x^{${n - 1}} + C`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randA = utils.rInt(2, 9);
                            const randExp = utils.rInt(2, 6);
                            return `\\frac{${randA}x^{${randExp}}}{${randExp}} + C`;
                        }
                    );
                    return {
                        tex: `\\int ${a}x^${n} \\, dx`,
                        instruction: "Find the integral",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Apply the power rule, retaining the coefficient: ∫${a}x^${n} dx = ${a} × x^${newExp}/${newExp} + C = ${a}x^${newExp}/${newExp} + C.`,
                        calc: false
                    };
                } else if (questionType === 3) {
                    // Simple infinite series: sum of geometric series
                    // Define series ratios with their corresponding values and display formats
                    const seriesOptions = [
                        { r: 0.5, display: '0.5', answer: 2, answerDisplay: '2' },
                        { r: 0.25, display: '0.25', answer: 4, answerDisplay: '4' },
                        { r: 0.1, display: '0.1', answer: 1.111, answerDisplay: '1.11' }
                    ];
                    
                    const series = seriesOptions[utils.rInt(0, seriesOptions.length - 1)];
                    const correctAnswer = `${series.answerDisplay}`;
                    const candidateDistractors = [
                        `\\text{diverges}`,
                        `${series.display}`,
                        `\\infty`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${(Math.random() * 9 + 1).toFixed(2)}`
                    );
                    
                    return {
                        tex: `\\sum_{n=0}^{\\infty} (${series.display})^n`,
                        instruction: "Find the sum to infinity, given that |r| < 1",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `This is a geometric series with first term a = 1 and common ratio r = ${series.display}. Since |r| < 1, the series converges. The sum to infinity is S∞ = a/(1-r) = 1/(1-${series.display}) = ${series.answerDisplay}.`,
                        calc: false
                    };
                } else if (questionType === 4) {
                    // Partial fractions - simple case with distinct linear factors
                    // Form: (Ax + B) / ((x - a)(x - b)) = A/(x - a) + B/(x - b)
                    const a = utils.rInt(1, 4);
                    const b = utils.rInt(5, 8);
                    const A = utils.rInt(1, 5);
                    const B = utils.rInt(1, 5);
                    
                    // Construct numerator: A(x - b) + B(x - a) = (A + B)x - Ab - Ba
                    const numCoeff = A + B;
                    const numConst = -A * b - B * a;
                    
                    const correctAnswer = `\\frac{${A}}{x - ${a}} + \\frac{${B}}{x - ${b}}`;
                    const candidateDistractors = [
                        `\\frac{${A}}{x - ${b}} + \\frac{${B}}{x - ${a}}`,
                        `\\frac{${A + B}}{x - ${a}} + \\frac{1}{x - ${b}}`,
                        `\\frac{${A}}{(x - ${a})(x - ${b})}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randA = utils.rInt(1, 6);
                            const randB = utils.rInt(1, 6);
                            return `\\frac{${randA}}{x - ${a}} + \\frac{${randB}}{x - ${b}}`;
                        }
                    );
                    
                    const formattedNumConst = numConst >= 0 ? ` + ${numConst}` : ` - ${Math.abs(numConst)}`;
                    
                    return {
                        tex: `\\frac{${numCoeff}x${formattedNumConst}}{(x - ${a})(x - ${b})}`,
                        instruction: "Express as partial fractions",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `To decompose into partial fractions, write as A/(x - ${a}) + B/(x - ${b}). Solve: ${numCoeff}x${formattedNumConst} = A(x - ${b}) + B(x - ${a}). Setting x = ${a}: A = ${A}. Setting x = ${b}: B = ${B}.`,
                        calc: false
                    };
                } else if (questionType === 5) {
                    // Definition: What is integration?
                    const correctAnswer = `\\text{The reverse process of differentiation}`;
                    const candidateDistractors = [
                        `\\text{Finding the slope of a curve}`,
                        `\\text{Finding critical points}`,
                        `\\text{Solving for x}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{What is integration (antiderivative)?}`,
                        instruction: "Select the correct definition",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Integration is the reverse process of differentiation. If F'(x) = f(x), then ∫f(x)dx = F(x) + C, where C is the constant of integration. Integration can also be interpreted as finding the area under a curve.`,
                        calc: false
                    };
                } else if (questionType === 6) {
                    // Constant of integration concept
                    const correctAnswer = `\\text{Because differentiation of a constant is zero}`;
                    const candidateDistractors = [
                        `\\text{To make the answer more accurate}`,
                        `\\text{Because integration is approximate}`,
                        `\\text{To satisfy the initial condition}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random reason}`
                    );
                    
                    return {
                        tex: `\\text{Why do we add +C when integrating?}`,
                        instruction: "Select the correct explanation",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `When we integrate, we add +C (the constant of integration) because the derivative of any constant is zero. For example, d/dx(x² + 5) = 2x and d/dx(x² + 100) = 2x. So ∫2x dx could be x² + any constant. We write it as x² + C to represent all possible antiderivatives.`,
                        calc: false
                    };
                } else if (questionType === 7) {
                    // Integration of 1/x
                    const a = utils.rInt(2, 6);
                    const correctAnswer = `${a}\\ln|x| + C`;
                    const candidateDistractors = [
                        `\\frac{${a}}{x^2} + C`,
                        `${a}x + C`,
                        `\\frac{${a}\\ln|x|}{x} + C`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randA = utils.rInt(1, 8);
                            return `${randA}\\ln|x| + C`;
                        }
                    );
                    
                    return {
                        tex: `\\int \\frac{${a}}{x} \\, dx`,
                        instruction: "Find the integral",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The integral of 1/x is ln|x| (natural logarithm). Therefore ∫(${a}/x)dx = ${a}ln|x| + C. This is a special case since the power rule doesn't apply when n = -1.`,
                        calc: false
                    };
                } else if (questionType === 8) {
                    // Geometric series sum formula
                    const correctAnswer = `S_\\infty = \\frac{a}{1-r} \\text{ when } |r| < 1`;
                    const candidateDistractors = [
                        `S_\\infty = \\frac{a}{r-1} \\text{ when } |r| < 1`,
                        `S_\\infty = a(1-r) \\text{ when } |r| < 1`,
                        `S_\\infty = \\frac{1}{1-r} \\text{ when } |r| > 1`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random formula}`
                    );
                    
                    return {
                        tex: `\\text{State the formula for the sum}\\\\[0.5em]\\text{of an infinite geometric series}`,
                        instruction: "Select the correct formula",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `For a geometric series with first term a and common ratio r, the sum to infinity is S∞ = a/(1-r), but only when |r| < 1. If |r| ≥ 1, the series diverges (doesn't have a finite sum). This formula is derived from the finite sum formula as n → ∞.`,
                        calc: false
                    };
                } else if (questionType === 9) {
                    // Definite integral concept
                    const correctAnswer = `\\text{The area under the curve between limits}`;
                    const candidateDistractors = [
                        `\\text{The slope of the tangent line}`,
                        `\\text{The antiderivative plus C}`,
                        `\\text{The maximum value of the function}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random definition}`
                    );
                    
                    return {
                        tex: `\\text{What does } \\int_a^b f(x) \\, dx \\text{ represent?}`,
                        instruction: "Select the correct interpretation",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `A definite integral ∫[a to b] f(x)dx represents the signed area under the curve y = f(x) from x = a to x = b. Unlike indefinite integrals, definite integrals give a numerical value and don't include +C. Calculate using the Fundamental Theorem of Calculus: F(b) - F(a), where F is an antiderivative of f.`,
                        calc: false
                    };
                } else if (questionType === 10) {
                    // Integration with sum rule
                    const a = utils.rInt(2, 5);
                    const n1 = utils.rInt(2, 4);
                    const b = utils.rInt(2, 6);
                    const n2 = utils.rInt(2, 3);
                    const exp1 = n1 + 1;
                    const exp2 = n2 + 1;
                    const correctAnswer = `\\frac{${a}x^{${exp1}}}{${exp1}} + \\frac{${b}x^{${exp2}}}{${exp2}} + C`;
                    const candidateDistractors = [
                        `\\frac{${a}x^{${n1}}}{${n1}} + \\frac{${b}x^{${n2}}}{${n2}} + C`,
                        `${a * n1}x^{${n1 - 1}} + ${b * n2}x^{${n2 - 1}} + C`,
                        `${a}x^{${exp1}} + ${b}x^{${exp2}} + C`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => {
                            const randExp = utils.rInt(2, 6);
                            return `x^{${randExp}} + C`;
                        }
                    );
                    
                    return {
                        tex: `\\int (${a}x^${n1} + ${b}x^${n2}) \\, dx`,
                        instruction: "Find the integral",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Integrate each term separately using the power rule. ∫${a}x^${n1}dx = ${a}x^${exp1}/${exp1} and ∫${b}x^${n2}dx = ${b}x^${exp2}/${exp2}. Combined: ${a}x^${exp1}/${exp1} + ${b}x^${exp2}/${exp2} + C.`,
                        calc: false
                    };
                } else if (questionType === 11) {
                    // Geometric series convergence
                    const r = [0.3, 0.6, 0.9, 1.1, 1.5][utils.rInt(0, 4)];
                    const converges = Math.abs(r) < 1;
                    const correctAnswer = converges ? `\\text{Converges}` : `\\text{Diverges}`;
                    const candidateDistractors = converges ? 
                        [`\\text{Diverges}`, `\\text{Oscillates}`, `\\text{Undefined}`] :
                        [`\\text{Converges}`, `\\text{Converges to zero}`, `\\text{Undefined}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random answer}`
                    );
                    
                    return {
                        tex: `\\text{Does } \\sum_{n=0}^{\\infty} (${r})^n \\text{ converge?}`,
                        instruction: "Determine convergence",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `A geometric series Σr^n converges if and only if |r| < 1. Here r = ${r}, so |r| = ${Math.abs(r)}. ${Math.abs(r) < 1 ? 'Since |r| < 1, the series converges' : 'Since |r| ≥ 1, the series diverges'}. ${converges ? `The sum is 1/(1-${r}).` : 'The series has no finite sum.'}`,
                        calc: false
                    };
                } else {
                    // Power rule for integration statement
                    const correctAnswer = `\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\text{ (when } n \\neq -1\\text{)}`;
                    const candidateDistractors = [
                        `\\int x^n \\, dx = nx^{n-1} + C`,
                        `\\int x^n \\, dx = \\frac{x^{n-1}}{n-1} + C`,
                        `\\int x^n \\, dx = x^{n+1} + C`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `\\text{Random formula}`
                    );
                    
                    return {
                        tex: `\\text{State the power rule for integration}`,
                        instruction: "Select the correct formula",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The power rule for integration states: ∫x^n dx = x^(n+1)/(n+1) + C, where n ≠ -1. This is the reverse of the power rule for differentiation. The special case n = -1 gives ∫x^(-1)dx = ∫(1/x)dx = ln|x| + C.`,
                        calc: false
                    };
                }
    }
};
