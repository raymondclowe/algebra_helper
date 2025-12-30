// Why Questions - Conceptual Understanding
// All Levels
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.WhyQuestions = {
    getWhyQuestion: function(level) {
        const utils = window.GeneratorUtils;
        
                const band = Math.round(level);
                
                // Define "why" questions for each difficulty band
                const whyQuestions = [];
                
                // Level 0-1: Basic arithmetic
                if (band <= 1) {
                    const a = utils.rInt(5, 15), b = utils.rInt(3, 10);
                    const sum = a + b;
                    const correctAnswer = `\\text{Combining two quantities to find the total}`;
                    const candidateDistractors = [
                        `\\text{Taking away one number from another}`,
                        `\\text{Repeated multiplication}`,
                        `\\text{Splitting into equal groups}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    whyQuestions.push({
                        type: 'why',
                        tex: `${a} + ${b} = ${sum}`,
                        instruction: "What does addition represent?",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Addition combines ${a} and ${b} to give us the total: ${sum}. It's like putting two groups together.`,
                        calc: false
                    });
                }
                
                // Level 1-2: Squares and roots
                if (band <= 2 && band > 0) {
                    const n = utils.rInt(3, 9);
                    const square = n * n;
                    const correctAnswer = `\\text{Because } ${n} \\times ${n} = ${square}`;
                    const candidateDistractors = [
                        `\\text{Because } ${square} \\div 2 = ${square / 2}`,
                        `\\text{Because we reverse the addition}`,
                        `\\text{Because } ${n} + ${n} = ${n * 2}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    whyQuestions.push({
                        type: 'why',
                        tex: `\\sqrt{${square}} = ${n}`,
                        instruction: "Why is the square root of " + square + " equal to " + n + "?",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The square root undoes squaring. Since ${n}² = ${square}, we have $\\sqrt{${square}} = ${n}$.`,
                        calc: false
                    });
                }
                
                // Level 2-3: Multiplication
                if (band <= 3 && band > 1) {
                    const a = utils.rInt(3, 8), b = utils.rInt(3, 8);
                    const product = a * b;
                    const correctAnswer = `\\text{Adding } ${a} \\text{ to itself } ${b} \\text{ times (or } ${b} \\text{ to itself } ${a} \\text{ times)}`;
                    const candidateDistractors = [
                        `\\text{Combining two numbers}`,
                        `\\text{Taking } ${a} \\text{ away from } ${b}`,
                        `\\text{Dividing } ${a} \\text{ by } ${b}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    whyQuestions.push({
                        type: 'why',
                        tex: `${a} \\times ${b} = ${product}`,
                        instruction: "What does multiplication represent?",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `${a} × ${b} means ${a} groups of ${b}, or ${b} groups of ${a}, which equals ${product}.`,
                        calc: false
                    });
                }
                
                // Level 3-4: Basic equation solving
                if (band <= 4 && band > 2) {
                    const a = utils.rInt(2,9), x = utils.rInt(2,9);
                    const result = a * x;
                    const correctAnswer = `\\text{To isolate } x \\text{ by canceling out the coefficient}`;
                    const candidateDistractors = [
                        `\\text{To make the equation simpler}`,
                        `\\text{To get rid of the equals sign}`,
                        `\\text{Because division is the opposite of addition}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    whyQuestions.push({
                        type: 'why',
                        tex: `${a}x = ${result} \\\\[0.5em] \\text{Step: } x = \\frac{${result}}{${a}} = ${x}`,
                        instruction: "Why do we divide both sides by " + a + "?",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `We divide both sides by ${a} to isolate x. This cancels the coefficient ${a} on the left side, leaving just x.`,
                        calc: false
                    });
                }
                
                // Level 4-5: Two-step equations (was Level 3-4)
                if (band <= 5 && band > 3) {
                    const a = utils.rInt(2,5), b = utils.rInt(2,8);
                    const whyType = utils.rInt(1,2);
                    
                    if (whyType === 1) {
                        // Expanding
                        const correctAnswer = `\\text{Because we have to distribute the outer term to each inner term}`;
                        const candidateDistractors = [
                            `\\text{To make the expression longer}`,
                            `\\text{Because we can't have brackets in the final answer}`,
                            `\\text{To combine like terms}`
                        ];
                        const distractors = utils.ensureUniqueDistractors(
                            correctAnswer,
                            candidateDistractors,
                            () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                        );
                        whyQuestions.push({
                            type: 'why',
                            tex: `${a}(x + ${b}) \\\\[0.5em] \\text{Step: } ${a}x + ${a*b}`,
                            instruction: "Why do we multiply both terms inside the brackets?",
                            displayAnswer: correctAnswer,
                            distractors: distractors,
                            explanation: `The distributive property requires us to multiply ${a} by each term inside the brackets: ${a} × x and ${a} × ${b}.`,
                            calc: false
                        });
                    } else {
                        // Factorising - why we need to find factors
                        const factorA = utils.rInt(1,5), factorB = utils.rInt(2,6);
                        const correctAnswer = `\\text{Because when we expand brackets, we use FOIL which creates these relationships}`;
                        const candidateDistractors = [
                            `\\text{Because that's just the rule for factorising}`,
                            `\\text{To make the numbers smaller}`,
                            `\\text{Because we need to cancel out terms}`
                        ];
                        const distractors = utils.ensureUniqueDistractors(
                            correctAnswer,
                            candidateDistractors,
                            () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                        );
                        whyQuestions.push({
                            type: 'why',
                            tex: `x^2 + ${factorA+factorB}x + ${factorA*factorB} \\\\[0.5em] \\text{Step: } (x+${factorA})(x+${factorB})`,
                            instruction: "Why do we need factors that multiply to " + (factorA*factorB) + " and add to " + (factorA+factorB) + "?",
                            displayAnswer: correctAnswer,
                            distractors: distractors,
                            explanation: `When expanding (x+${factorA})(x+${factorB}), the middle term comes from ${factorA}+${factorB} and the constant from ${factorA}×${factorB}. Factorising reverses this.`,
                            calc: false
                        });
                    }
                }
                
                // Level 5-6: Expanding (was Level 5-6)
                if (band <= 6 && band > 4) {
                    const a = utils.rInt(2,5), b = utils.rInt(2,8);
                    const correctAnswer = `\\text{To isolate the term with } x \\text{ before dealing with the coefficient}`;
                    const candidateDistractors = [
                        `\\text{Because subtraction is easier than division}`,
                        `\\text{To make both sides equal}`,
                        `\\text{Because we always do subtraction first}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    whyQuestions.push({
                        type: 'why',
                        tex: `${a}x + ${b} = ${a*3+b} \\\\[0.5em] \\text{Step 1: } ${a}x = ${a*3}`,
                        instruction: "Why do we subtract " + b + " from both sides first?",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `We subtract ${b} from both sides to isolate the term with x (${a}x). This follows the order: deal with constants first, then coefficients.`,
                        calc: false
                    });
                }
                
                // Level 6-7: Factorising (was Level 7-8)
                if (band <= 7 && band > 5) {
                    const a = utils.rInt(2,4);
                    const correctAnswer = `\\text{Because both positive and negative numbers give the same result when squared}`;
                    const candidateDistractors = [
                        `\\text{To have two answers for a quadratic}`,
                        `\\text{Because square roots are always positive and negative}`,
                        `\\text{To make the equation balanced}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    whyQuestions.push({
                        type: 'why',
                        tex: `x^2 = ${a*a} \\\\[0.5em] \\text{Step: } x = \\pm ${a}`,
                        instruction: "Why do we need both positive and negative solutions?",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Since (${a})² = ${a*a} and (-${a})² = ${a*a}, both values are valid solutions. Squaring eliminates the sign.`,
                        calc: false
                    });
                }
                
                // Level 8-9: Functions and trigonometry
                if (band <= 9 && band > 7) {
                    const whyType = utils.rInt(1, 2);
                    if (whyType === 1) {
                        // Functions
                        const a = utils.rInt(2, 5), x = utils.rInt(2, 5);
                        const result = a * x;
                        const correctAnswer = `\\text{Substitute } ${x} \\text{ for } x \\text{ in the function definition}`;
                        const candidateDistractors = [
                            `\\text{Multiply } f \\text{ by } ${x}`,
                            `\\text{Add } ${x} \\text{ to the function}`,
                            `\\text{Divide } f \\text{ by } ${x}`
                        ];
                        const distractors = utils.ensureUniqueDistractors(
                            correctAnswer,
                            candidateDistractors,
                            () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                        );
                        whyQuestions.push({
                            type: 'why',
                            tex: utils.toUnicodeFunction(`f(x) = ${a}x \\\\[0.5em] f(${x}) = ${result}`),
                            instruction: utils.toUnicodeFunction("What does f(" + x + ") mean?"),
                            displayAnswer: correctAnswer,
                            distractors: distractors,
                            explanation: utils.toUnicodeFunction(`f(${x}) means substitute x = ${x} into the function: f(${x}) = ${a}(${x}) = ${result}.`),
                            calc: false
                        });
                    } else {
                        // Trigonometry
                        const correctAnswer = `\\text{They appear frequently and help solve problems quickly}`;
                        const candidateDistractors = [
                            `\\text{Because calculators don't have these values}`,
                            `\\text{To make tests harder}`,
                            `\\text{Because they're the only correct answers}`
                        ];
                        const distractors = utils.ensureUniqueDistractors(
                            correctAnswer,
                            candidateDistractors,
                            () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                        );
                        whyQuestions.push({
                            type: 'why',
                            tex: `\\sin(30°) = \\frac{1}{2}`,
                            instruction: "Why should we memorize standard angle values?",
                            displayAnswer: correctAnswer,
                            distractors: distractors,
                            explanation: `Standard angles (0°, 30°, 45°, 60°, 90°) appear often in math and physics. Knowing them saves time and helps recognize patterns.`,
                            calc: false
                        });
                    }
                }
                
                // Level 9-10: Differentiation
                if (band <= 10 && band > 8) {
                    const a = utils.rInt(2,5), n = utils.rInt(2,4);
                    const correctAnswer = `\\text{This is the power rule: bring down the exponent and reduce it by 1}`;
                    const candidateDistractors = [
                        `\\text{To make the derivative smaller}`,
                        `\\text{Because that's how we reverse integration}`,
                        `\\text{To find the slope at a specific point}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    whyQuestions.push({
                        type: 'why',
                        tex: utils.toUnicodeFunction(`f(x) = ${a}x^{${n}} \\\\[0.5em] \\text{Step: } f'(x) = ${a*n}x^{${n-1}}`),
                        instruction: "Why do we multiply by the power and reduce the power by 1?",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The power rule for differentiation states: d/dx[x^n] = nx^(n-1). We bring the exponent ${n} down as a coefficient and reduce the power by 1.`,
                        calc: false
                    });
                }
                
                // Level 10-11: Probability
                if (band <= 11 && band > 9) {
                    const correctAnswer = `\\text{Because one of the outcomes must happen (certainty)}`;
                    const candidateDistractors = [
                        `\\text{Because probabilities are always positive}`,
                        `\\text{To keep the math simple}`,
                        `\\text{Because we're adding two fractions}`
                    ];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    whyQuestions.push({
                        type: 'why',
                        tex: `P(A) + P(\\text{not } A) = 1`,
                        instruction: "Why do complementary probabilities sum to 1?",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `The event either happens or it doesn't. These are the only possibilities, so their probabilities sum to 1 (certainty).`,
                        calc: false
                    });
                }
                
                // Level 11+: Advanced topics
                if (band > 10 && band <= 15) {
                    const correctAnswer1 = `\\text{Because logarithms convert multiplication into addition}`;
                    const candidateDistractors1 = [
                        `\\text{Because logs always add together}`,
                        `\\text{To make calculations easier}`,
                        `\\text{Because } a \\text{ and } b \\text{ are multiplied}`
                    ];
                    const distractors1 = utils.ensureUniqueDistractors(
                        correctAnswer1,
                        candidateDistractors1,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    
                    const correctAnswer2 = `\\text{Because the average of all terms equals the average of first and last}`;
                    const candidateDistractors2 = [
                        `\\text{To make the formula symmetric}`,
                        `\\text{Because that's how series always work}`,
                        `\\text{To simplify the calculation}`
                    ];
                    const distractors2 = utils.ensureUniqueDistractors(
                        correctAnswer2,
                        candidateDistractors2,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    
                    const topics = [
                        {
                            type: 'why',
                            tex: `\\log(ab) = \\log(a) + \\log(b)`,
                            instruction: "Why does this logarithm property work?",
                            displayAnswer: correctAnswer1,
                            distractors: distractors1,
                            explanation: `This is the product rule for logarithms. It works because if log(a) = x and log(b) = y, then a = 10^x and b = 10^y, so ab = 10^x × 10^y = 10^(x+y), meaning log(ab) = x + y = log(a) + log(b).`,
                            calc: false
                        },
                        {
                            type: 'why',
                            tex: `\\text{Arithmetic series: } S_n = \\frac{n(a_1 + a_n)}{2}`,
                            instruction: "Why do we use (first + last) / 2?",
                            displayAnswer: correctAnswer2,
                            distractors: distractors2,
                            explanation: `In an arithmetic sequence, pairs of terms equidistant from the ends sum to the same value (a₁ + aₙ). The sum is n times this average value divided by 2.`,
                            calc: false
                        }
                    ];
                    whyQuestions.push(topics[utils.rInt(0, topics.length - 1)]);
                }
                
                // Level 15+: Trigonometry and Vectors
                if (band > 15 && band <= 19) {
                    const correctAnswer1 = `\\text{Because it comes from the Pythagorean theorem on the unit circle}`;
                    const candidateDistractors1 = [
                        `\\text{Because sine and cosine are inverse functions}`,
                        `\\text{Because angles are measured in radians}`,
                        `\\text{Because trigonometric functions are periodic}`
                    ];
                    const distractors1 = utils.ensureUniqueDistractors(
                        correctAnswer1,
                        candidateDistractors1,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    
                    const correctAnswer2 = `\\text{The product of magnitudes times the cosine of the angle between vectors}`;
                    const candidateDistractors2 = [
                        `\\text{The sum of vector components}`,
                        `\\text{The area between two vectors}`,
                        `\\text{The perpendicular distance}`
                    ];
                    const distractors2 = utils.ensureUniqueDistractors(
                        correctAnswer2,
                        candidateDistractors2,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    
                    const topics = [
                        {
                            type: 'why',
                            tex: `\\sin^2\\theta + \\cos^2\\theta = 1`,
                            instruction: "Why is this identity always true?",
                            displayAnswer: correctAnswer1,
                            distractors: distractors1,
                            explanation: `On the unit circle, the point (cos θ, sin θ) is at distance 1 from the origin. By Pythagorean theorem: (cos θ)² + (sin θ)² = 1².`,
                            calc: false
                        },
                        {
                            type: 'why',
                            tex: `\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta`,
                            instruction: "What does the dot product measure?",
                            displayAnswer: correctAnswer2,
                            distractors: distractors2,
                            explanation: `The dot product measures how much two vectors point in the same direction. When θ = 0° (same direction), cos θ = 1 and we get maximum value. When θ = 90° (perpendicular), cos θ = 0.`,
                            calc: false
                        }
                    ];
                    whyQuestions.push(topics[utils.rInt(0, topics.length - 1)]);
                }
                
                // Level 19+: Calculus and Statistics
                if (band > 19) {
                    const correctAnswer1 = `\\text{Because we need to account for how fast the inner function is changing}`;
                    const candidateDistractors1 = [
                        `\\text{To make the derivative correct}`,
                        `\\text{Because that's the product rule}`,
                        `\\text{To simplify the calculation}`
                    ];
                    const distractors1 = utils.ensureUniqueDistractors(
                        correctAnswer1,
                        candidateDistractors1,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    
                    const correctAnswer2 = `\\text{Because the derivative of a constant is zero, so any constant could have been there}`;
                    const candidateDistractors2 = [
                        `\\text{To make the answer look complete}`,
                        `\\text{Because integration always adds 1}`,
                        `\\text{To balance the equation}`
                    ];
                    const distractors2 = utils.ensureUniqueDistractors(
                        correctAnswer2,
                        candidateDistractors2,
                        () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                    );
                    
                    const topics = [
                        {
                            type: 'why',
                            tex: utils.toUnicodeFunction(`\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)`),
                            instruction: utils.toUnicodeFunction("Why do we multiply by g'(x) in the chain rule?"),
                            displayAnswer: correctAnswer1,
                            distractors: distractors1,
                            explanation: utils.toUnicodeFunction(`The chain rule accounts for nested rates of change. If y changes with u, and u changes with x, then dy/dx = (dy/du) × (du/dx). We multiply the outer derivative by the inner derivative.`),
                            calc: false
                        },
                        {
                            type: 'why',
                            tex: (() => {
                                const n = utils.rInt(2, 4);
                                return `\\int x^${n} \\, dx = \\frac{x^{${n + 1}}}{${n + 1}} + C`;
                            })(),
                            instruction: "Why do we add a constant C when integrating?",
                            displayAnswer: correctAnswer2,
                            distractors: distractors2,
                            explanation: `When we differentiate, constants disappear (d/dx[C] = 0). So when we integrate, we must account for any constant that was lost. We write "+ C" to represent this unknown constant.`,
                            calc: false
                        }
                    ];
                    whyQuestions.push(topics[utils.rInt(0, topics.length - 1)]);
                }
                
                // Return a random "why" question from the appropriate level
                if (whyQuestions.length > 0) {
                    const randomIndex = Math.floor(Math.random() * whyQuestions.length);
                    return whyQuestions[randomIndex];
                }
                
                // Fallback to a basic why question if none match
                const fallbackCorrectAnswer = `\\text{To isolate } x \\text{ by canceling out the coefficient}`;
                const fallbackCandidateDistractors = [
                    `\\text{To make the equation simpler}`,
                    `\\text{To get rid of the equals sign}`,
                    `\\text{Because division is the opposite of addition}`
                ];
                const fallbackDistractors = utils.ensureUniqueDistractors(
                    fallbackCorrectAnswer,
                    fallbackCandidateDistractors,
                    () => utils.JOKE_ANSWERS[utils.rInt(0, utils.JOKE_ANSWERS.length - 1)]
                );
                return {
                    type: 'why',
                    tex: `2x = 6 \\\\[0.5em] \\text{Step: } x = 3`,
                    instruction: "Why do we divide both sides by 2?",
                    displayAnswer: fallbackCorrectAnswer,
                    distractors: fallbackDistractors,
                    explanation: `We divide both sides by 2 to isolate x. This cancels the coefficient 2 on the left side, leaving just x.`,
                    calc: false
                };
    }
};
