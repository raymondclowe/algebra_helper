// --- GENERATOR ---
window.Generator = {
    rInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    questionCounter: 0, // Track questions to interleave "why" questions
    
    // Constants for expression evaluation
    EQUIVALENCE_TOLERANCE: 0.0001,
    EQUIVALENCE_TEST_VALUES: [1, 2, 4, 9, 16],
    FALLBACK_DISTRACTOR_MAX_COEFFICIENT: 20, // Max coefficient for fallback distractors
    
    // Fisher-Yates shuffle algorithm for proper randomization
    shuffleArray: function(array) {
        const arr = [...array]; // Create a copy to avoid mutation
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },
    
    // Helper function to safely evaluate mathematical expressions and check equivalence
    // Note: This is safe because all expressions come from our own generator
    evaluateExpression: function(expr, x) {
        try {
            // Replace common math notation with JavaScript equivalents
            let jsExpr = expr
                .replace(/\^/g, '**')  // x^2 -> x**2
                .replace(/√/g, 'Math.sqrt')  // √ -> Math.sqrt
                .replace(/\\sqrt\{([^}]+)\}/g, 'Math.sqrt($1)')  // LaTeX sqrt
                .replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')  // LaTeX dfrac
                .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')  // LaTeX frac
                .replace(/\\left\(/g, '(')  // Remove LaTeX left paren
                .replace(/\\right\)/g, ')')  // Remove LaTeX right paren
                .replace(/\*\*\(1\/2\)/g, '**0.5')  // (1/2) power to 0.5
                .replace(/x/g, `(${x})`);  // Replace x with the test value
            
            // Basic safety check: disallow dangerous patterns
            // Reject any expressions containing words (except Math.sqrt which we added)
            if (/[a-z_$]/i.test(jsExpr.replace(/Math\.sqrt/g, ''))) {
                return NaN;
            }
            
            // Evaluate using Function constructor
            // This is safe because inputs come from our controlled generator
            return Function('"use strict"; return (' + jsExpr + ')')();
        } catch (e) {
            return NaN;
        }
    },
    
    areEquivalent: function(expr1, expr2, testValues = this.EQUIVALENCE_TEST_VALUES) {
        // Test if two expressions are equivalent by evaluating at multiple points
        for (let x of testValues) {
            const val1 = this.evaluateExpression(expr1, x);
            const val2 = this.evaluateExpression(expr2, x);
            if (isNaN(val1) || isNaN(val2)) return false;
            if (Math.abs(val1 - val2) > this.EQUIVALENCE_TOLERANCE) return false;
        }
        return true;
    },
    
    getQuestion: function(level) {
        // Interleave "why" questions every 4th question in learning mode (or drill for backward compatibility)
        if (window.APP.mode === 'learning' || window.APP.mode === 'drill') {
            this.questionCounter++;
            if (this.questionCounter % 4 === 0) {
                return this.getWhyQuestion(level);
            }
        }
        
        const band = Math.round(level);
        if (band <= 2) return this.lvl1();
        if (band <= 4) return this.lvl2();
        if (band <= 6) return this.lvl3();
        if (band <= 8) return this.lvl4();
        return this.lvl5();
    },
    lvl1: function() {
        const a=this.rInt(2,9), x=this.rInt(2,9);
        return { tex: `${a}x = ${a*x}`, instruction: "Solve for x", displayAnswer:`x=${x}`, distractors:[`x=${x+1}`,`x=${a}`,`x=${x-1}`], explanation:`Divide by ${a}`, calc:false };
    },
    lvl2: function() {
        const a=this.rInt(2,9), b=this.rInt(2,9), x=this.rInt(2,9); 
        return { tex: `${a}x + ${b} = ${a*x+b}`, instruction: "Solve for x", displayAnswer:`x=${x}`, distractors:[`x=${x+1}`,`x=${-x}`,`x=${b}`], explanation:`Subtract ${b}, Divide by ${a}`, calc:false };
    },
    lvl3: function() {
        const a=this.rInt(2,5), b=this.rInt(2,8);
        return { tex: `${a}(x + ${b})`, instruction: "Expand", displayAnswer:`${a}x + ${a*b}`, distractors:[`${a}x+${b}`,`x+${a*b}`,`${a}x^2+${b}`], explanation:`Multiply ${a} by each inner term`, calc:false };
    },
    lvl4: function() {
        const a=this.rInt(1,5), b=this.rInt(2,6);
        return { tex: `x^2 + ${a+b}x + ${a*b}`, instruction: "Factorise", displayAnswer:`(x+${a})(x+${b})`, distractors:[`(x+${a+b})(x+${a*b})`, `x(x+${a+b})`, `(x-${a})(x-${b})`], explanation:`Find factors of ${a*b} adding to ${a+b}`, calc:false };
    },
    lvl5: function() {
        // Randomly choose between differentiation and inverse function questions
        const questionType = this.rInt(1, 2);
        
        if (questionType === 1) {
            // Original differentiation question
            const a=this.rInt(2,5), n=this.rInt(2,4);
            return { tex: `f(x) = ${a}x^{${n}}`, instruction: "Find f'(x)", displayAnswer:`${a*n}x^{${n-1}}`, distractors:[`${a*n}x^{${n}}`,`${a}x^{${n-1}}`,`${n}x^{${a}}`], explanation:`Power rule: $nx^{n-1}$`, calc:false };
        } else {
            // Inverse function question for quadratic functions
            return this.getInverseQuadraticQuestion();
        }
    },
    
    // Generate inverse function questions for quadratic functions
    getInverseQuadraticQuestion: function() {
        const a = this.rInt(2, 9); // Coefficient for x^2
        
        // Multiple correct LaTeX presentations of the inverse
        const correctFormats = [
            `y = \\sqrt{\\dfrac{x}{${a}}}`,
            `y = \\left(\\dfrac{x}{${a}}\\right)^{1/2}`,
            `y = \\dfrac{\\sqrt{x}}{\\sqrt{${a}}}`,
            `y = \\dfrac{1}{\\sqrt{${a}}}\\sqrt{x}`
        ];
        
        // Randomly pick one correct format
        const correctAnswer = correctFormats[this.rInt(0, correctFormats.length - 1)];
        
        // Generate incorrect distractors that are truly wrong
        const distractors = [
            `y = \\sqrt{${a}x}`,  // Wrong: multiplied instead of divided
            `y = \\dfrac{x}{${a}}`,  // Wrong: forgot square root
            `y = \\sqrt{x - ${a}}`,  // Wrong: subtraction instead of division
            `y = ${a}\\sqrt{x}`,  // Wrong: coefficient outside and multiplied
            `y = \\left(\\dfrac{${a}}{x}\\right)^{1/2}`,  // Wrong: inverted fraction
            `y = \\dfrac{x^2}{${a}}`  // Wrong: squared instead of square root
        ];
        
        // Shuffle and pick 3 unique wrong answers that aren't equivalent to the correct answer
        const wrongAnswers = [];
        const shuffledDistractors = this.shuffleArray(distractors);
        
        for (let distractor of shuffledDistractors) {
            if (wrongAnswers.length >= 3) break;
            // Verify this distractor is not equivalent to the correct answer
            if (!this.areEquivalent(correctAnswer, distractor)) {
                wrongAnswers.push(distractor);
            }
        }
        
        // Ensure we have exactly 3 distractors (fallback if equivalence check filtered too many)
        while (wrongAnswers.length < 3) {
            wrongAnswers.push(`y = \\sqrt{${this.rInt(1, this.FALLBACK_DISTRACTOR_MAX_COEFFICIENT)}x}`);
        }
        
        return {
            tex: `f(x) = ${a}x^2`,
            instruction: "Find f^{-1}(x) for x ≥ 0",
            displayAnswer: correctAnswer,
            distractors: wrongAnswers,
            explanation: `To find the inverse: $y = ${a}x^2$, swap variables: $x = ${a}y^2$, solve for $y$: $y^2 = \\frac{x}{${a}}$, so $y = \\sqrt{\\frac{x}{${a}}}$ (for $x \\geq 0$)`,
            calc: false
        };
    },
    
    // "Why" question generator - asks students to explain reasoning
    getWhyQuestion: function(level) {
        const band = Math.round(level);
        
        // Define "why" questions for each difficulty band
        const whyQuestions = [];
        
        // Level 1-2: Basic equation solving
        if (band <= 2) {
            const a = this.rInt(2,9), x = this.rInt(2,9);
            const result = a * x;
            whyQuestions.push({
                type: 'why',
                tex: `${a}x = ${result} \\\\[0.5em] \\text{Step: } x = \\frac{${result}}{${a}} = ${x}`,
                instruction: "Why do we divide both sides by " + a + "?",
                displayAnswer: `To isolate x by canceling out the coefficient`,
                distractors: [
                    `To make the equation simpler`,
                    `To get rid of the equals sign`,
                    `Because division is the opposite of addition`
                ],
                explanation: `We divide both sides by ${a} to isolate x. This cancels the coefficient ${a} on the left side, leaving just x.`,
                calc: false
            });
        }
        
        // Level 3-4: Expanding and factorising
        if (band <= 4 && band > 2) {
            const a = this.rInt(2,5), b = this.rInt(2,8);
            const whyType = this.rInt(1,2);
            
            if (whyType === 1) {
                // Expanding
                whyQuestions.push({
                    type: 'why',
                    tex: `${a}(x + ${b}) \\\\[0.5em] \\text{Step: } ${a}x + ${a*b}`,
                    instruction: "Why do we multiply both terms inside the brackets?",
                    displayAnswer: `Because we have to distribute the outer term to each inner term`,
                    distractors: [
                        `To make the expression longer`,
                        `Because we can't have brackets in the final answer`,
                        `To combine like terms`
                    ],
                    explanation: `The distributive property requires us to multiply ${a} by each term inside the brackets: ${a} × x and ${a} × ${b}.`,
                    calc: false
                });
            } else {
                // Factorising - why we need to find factors
                const factorA = this.rInt(1,5), factorB = this.rInt(2,6);
                whyQuestions.push({
                    type: 'why',
                    tex: `x^2 + ${factorA+factorB}x + ${factorA*factorB} \\\\[0.5em] \\text{Step: } (x+${factorA})(x+${factorB})`,
                    instruction: "Why do we need factors that multiply to " + (factorA*factorB) + " and add to " + (factorA+factorB) + "?",
                    displayAnswer: `Because when we expand brackets, we use FOIL which creates these relationships`,
                    distractors: [
                        `Because that's just the rule for factorising`,
                        `To make the numbers smaller`,
                        `Because we need to cancel out terms`
                    ],
                    explanation: `When expanding (x+${factorA})(x+${factorB}), the middle term comes from ${factorA}+${factorB} and the constant from ${factorA}×${factorB}. Factorising reverses this.`,
                    calc: false
                });
            }
        }
        
        // Level 5-6: Algebraic manipulation
        if (band <= 6 && band > 4) {
            const a = this.rInt(2,5), b = this.rInt(2,8);
            whyQuestions.push({
                type: 'why',
                tex: `${a}x + ${b} = ${a*3+b} \\\\[0.5em] \\text{Step 1: } ${a}x = ${a*3}`,
                instruction: "Why do we subtract " + b + " from both sides first?",
                displayAnswer: `To isolate the term with x before dealing with the coefficient`,
                distractors: [
                    `Because subtraction is easier than division`,
                    `To make both sides equal`,
                    `Because we always do subtraction first`
                ],
                explanation: `We subtract ${b} from both sides to isolate the term with x (${a}x). This follows the order: deal with constants first, then coefficients.`,
                calc: false
            });
        }
        
        // Level 7-8: Quadratics and more complex algebra
        if (band <= 8 && band > 6) {
            const a = this.rInt(2,4);
            whyQuestions.push({
                type: 'why',
                tex: `x^2 = ${a*a} \\\\[0.5em] \\text{Step: } x = \\pm ${a}`,
                instruction: "Why do we need both positive and negative solutions?",
                displayAnswer: `Because both positive and negative numbers give the same result when squared`,
                distractors: [
                    `To have two answers for a quadratic`,
                    `Because square roots are always positive and negative`,
                    `To make the equation balanced`
                ],
                explanation: `Since (${a})² = ${a*a} and (-${a})² = ${a*a}, both values are valid solutions. Squaring eliminates the sign.`,
                calc: false
            });
        }
        
        // Level 9-10: Differentiation
        if (band > 8) {
            const a = this.rInt(2,5), n = this.rInt(2,4);
            whyQuestions.push({
                type: 'why',
                tex: `f(x) = ${a}x^{${n}} \\\\[0.5em] \\text{Step: } f'(x) = ${a*n}x^{${n-1}}`,
                instruction: "Why do we multiply by the power and reduce the power by 1?",
                displayAnswer: `This is the power rule: bring down the exponent and reduce it by 1`,
                distractors: [
                    `To make the derivative smaller`,
                    `Because that's how we reverse integration`,
                    `To find the slope at a specific point`
                ],
                explanation: `The power rule for differentiation states: d/dx[x^n] = nx^(n-1). We bring the exponent ${n} down as a coefficient and reduce the power by 1.`,
                calc: false
            });
        }
        
        // Return a random "why" question from the appropriate level
        if (whyQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * whyQuestions.length);
            return whyQuestions[randomIndex];
        }
        
        // Fallback to a basic why question if none match
        return {
            type: 'why',
            tex: `2x = 6 \\\\[0.5em] \\text{Step: } x = 3`,
            instruction: "Why do we divide both sides by 2?",
            displayAnswer: `To isolate x by canceling out the coefficient`,
            distractors: [
                `To make the equation simpler`,
                `To get rid of the equals sign`,
                `Because division is the opposite of addition`
            ],
            explanation: `We divide both sides by 2 to isolate x. This cancels the coefficient 2 on the left side, leaving just x.`,
            calc: false
        };
    }
};
