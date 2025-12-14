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
    
    // Spaced repetition: Select question level with logarithmic fall-off
    // Returns the level to use for the next question (may be lower than current level)
    selectQuestionLevel: function(currentLevel) {
        // Only apply spaced repetition in learning/drill mode
        if (window.APP.mode !== 'learning' && window.APP.mode !== 'drill') {
            return currentLevel;
        }
        
        // Don't apply spaced repetition if at level 1 or below (no lower levels to review)
        if (currentLevel <= 1) {
            return currentLevel;
        }
        
        const rand = Math.random() * 100; // 0-100
        
        // Logarithmic distribution for spaced repetition:
        // ~10% from previous level (level - 1)
        // ~5% from 2 levels down (level - 2)
        // ~2% from 3 levels down (level - 3)
        // ~1% from 4+ levels down (level - 4 or more)
        // ~82% at current level
        
        if (rand < 1) {
            // 1%: 4+ levels down
            const levelDrop = Math.min(4 + Math.floor(Math.random() * 2), currentLevel - 1);
            return Math.max(1, currentLevel - levelDrop);
        } else if (rand < 3) {
            // 2%: 3 levels down
            return Math.max(1, currentLevel - 3);
        } else if (rand < 8) {
            // 5%: 2 levels down
            return Math.max(1, currentLevel - 2);
        } else if (rand < 18) {
            // 10%: 1 level down
            return Math.max(1, currentLevel - 1);
        } else {
            // 82%: current level
            return currentLevel;
        }
    },
    
    getQuestion: function(level) {
        // Apply spaced repetition to determine actual question level
        const questionLevel = this.selectQuestionLevel(level);
        
        // Interleave "why" questions every 3rd question in learning mode to promote deeper understanding
        // Research shows elaborative interrogation improves conceptual learning (Pressley et al., 1987)
        if (window.APP.mode === 'learning' || window.APP.mode === 'drill') {
            this.questionCounter++;
            if (this.questionCounter % 3 === 0) {
                const question = this.getWhyQuestion(questionLevel);
                question.questionLevel = questionLevel; // Track the level this question came from
                return question;
            }
        }
        
        const question = this.getQuestionForLevel(questionLevel);
        question.questionLevel = questionLevel; // Track the level this question came from
        return question;
    },
    
    // Get a question for a specific level (extracted from getQuestion for reuse)
    getQuestionForLevel: function(level) {
        const band = Math.round(level);
        // Expanded level system with more granular difficulty
        if (band <= 1) return this.getBasicArithmetic();      // Level 0-1: Basic arithmetic
        if (band <= 2) return this.getSquaresAndRoots();       // Level 1-2: Squares, cubes, roots
        if (band <= 3) return this.getMultiplicationTables();  // Level 2-3: Multiplication tables
        if (band <= 4) return this.lvl1();                     // Level 3-4: Simple equations
        if (band <= 5) return this.lvl2();                     // Level 4-5: Two-step equations
        if (band <= 6) return this.lvl3();                     // Level 5-6: Expanding
        if (band <= 7) return this.lvl4();                     // Level 6-7: Factorising
        if (band <= 8) return this.getFunctionProblems();      // Level 7-8: Basic functions
        if (band <= 9) return this.getTrigonometry();          // Level 8-9: Trigonometry
        if (band <= 10) return this.lvl5();                    // Level 9-10: Differentiation/Inverse
        if (band <= 11) return this.getProbability();          // Level 10-11: Probability
        return this.getCalculus();                             // Level 11+: Calculus
    },
    lvl1: function() {
        const a=this.rInt(2,9), x=this.rInt(2,9);
        return { 
            tex: `${a}x = ${a*x}`, 
            instruction: "Solve for x", 
            displayAnswer:`x=${x}`, 
            distractors:[`x=${x+1}`,`x=${a}`,`x=${x-1}`], 
            explanation:`To isolate x, we need to undo the multiplication by ${a}. We divide both sides by ${a} to keep the equation balanced: ${a}x ÷ ${a} = ${a*x} ÷ ${a}, which gives x = ${x}.`, 
            calc:false 
        };
    },
    lvl2: function() {
        const a=this.rInt(2,9), b=this.rInt(2,9), x=this.rInt(2,9); 
        return { 
            tex: `${a}x + ${b} = ${a*x+b}`, 
            instruction: "Solve for x", 
            displayAnswer:`x=${x}`, 
            distractors:[`x=${x+1}`,`x=${-x}`,`x=${b}`], 
            explanation:`First, subtract ${b} from both sides to isolate the term with x: ${a}x = ${a*x}. Then divide both sides by ${a} to get x alone: x = ${x}. Remember: we perform inverse operations in reverse order of operations (PEMDAS backwards).`, 
            calc:false 
        };
    },
    lvl3: function() {
        const a=this.rInt(2,5), b=this.rInt(2,8);
        return { 
            tex: `${a}(x + ${b})`, 
            instruction: "Expand", 
            displayAnswer:`${a}x + ${a*b}`, 
            distractors:[`${a}x+${b}`,`x+${a*b}`,`${a}x^2+${b}`], 
            explanation:`Use the distributive property: multiply ${a} by each term inside the parentheses. ${a} × x = ${a}x, and ${a} × ${b} = ${a*b}. This gives ${a}x + ${a*b}. Common mistake: forgetting to multiply ${a} by ${b}.`, 
            calc:false 
        };
    },
    lvl4: function() {
        const a=this.rInt(1,5), b=this.rInt(2,6);
        return { 
            tex: `x^2 + ${a+b}x + ${a*b}`, 
            instruction: "Factorise", 
            displayAnswer:`(x+${a})(x+${b})`, 
            distractors:[`(x+${a+b})(x+${a*b})`, `x(x+${a+b})`, `(x-${a})(x-${b})`], 
            explanation:`We need two numbers that multiply to ${a*b} (the constant term) and add to ${a+b} (the coefficient of x). These numbers are ${a} and ${b} because ${a} × ${b} = ${a*b} and ${a} + ${b} = ${a+b}. So the answer is (x+${a})(x+${b}). Check by expanding: you should get back to the original expression.`, 
            calc:false 
        };
    },
    lvl5: function() {
        // Randomly choose between differentiation and inverse function questions
        const questionType = this.rInt(1, 2);
        
        if (questionType === 1) {
            // Original differentiation question
            const a=this.rInt(2,5), n=this.rInt(2,4);
            return { 
                tex: `f(x) = ${a}x^{${n}}`, 
                instruction: "Find f'(x)", 
                displayAnswer:`${a*n}x^{${n-1}}`, 
                distractors:[`${a*n}x^{${n}}`,`${a}x^{${n-1}}`,`${n}x^{${a}}`], 
                explanation:`Use the power rule for differentiation: multiply the coefficient by the exponent, then reduce the exponent by 1. So ${a}x^${n} becomes ${a} × ${n} × x^${n-1} = ${a*n}x^${n-1}. The derivative tells us the rate of change of the function.`, 
                calc:false 
            };
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
            explanation: `To find the inverse function, we swap x and y, then solve for y. Start with y = ${a}x^2, swap to get x = ${a}y^2, then divide both sides by ${a} to get y^2 = x/${a}. Finally, take the square root of both sides: y = √(x/${a}). We take the positive root because x ≥ 0. The inverse "undoes" what the original function does.`,
            calc: false
        };
    },
    
    // ========== NEW PROBLEM TYPES ==========
    
    // Basic Arithmetic (Level 0-1): Addition and Subtraction
    getBasicArithmetic: function() {
        const questionType = this.rInt(1, 4);
        
        if (questionType === 1) {
            // Simple addition
            const a = this.rInt(1, 20);
            const b = this.rInt(1, 20);
            const answer = a + b;
            return {
                tex: `${a} + ${b}`,
                instruction: "Calculate",
                displayAnswer: `${answer}`,
                distractors: [`${answer + 1}`, `${answer - 1}`, `${a - b}`],
                explanation: `Adding ${a} and ${b} gives ${answer}. You can verify by counting up from ${a} by ${b} steps.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Simple subtraction
            const a = this.rInt(11, 30);
            const b = this.rInt(1, a - 1);
            const answer = a - b;
            return {
                tex: `${a} - ${b}`,
                instruction: "Calculate",
                displayAnswer: `${answer}`,
                distractors: [`${answer + 1}`, `${answer - 1}`, `${a + b}`],
                explanation: `Subtracting ${b} from ${a} gives ${answer}. You can verify by adding: ${answer} + ${b} = ${a}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Reverse addition: "? + b = c"
            const b = this.rInt(1, 15);
            const c = this.rInt(b + 1, 30);
            const answer = c - b;
            return {
                tex: `? + ${b} = ${c}`,
                instruction: "Find the missing number",
                displayAnswer: `${answer}`,
                distractors: [`${answer + 1}`, `${c}`, `${b}`],
                explanation: `To find the missing number, subtract ${b} from ${c}: ${c} - ${b} = ${answer}. Check: ${answer} + ${b} = ${c} ✓`,
                calc: false
            };
        } else {
            // Simple division as reverse multiplication
            const a = this.rInt(2, 9);
            const x = this.rInt(2, 9);
            const product = a * x;
            return {
                tex: `${product} \\div ${a}`,
                instruction: "Calculate",
                displayAnswer: `${x}`,
                distractors: [`${x + 1}`, `${x - 1}`, `${a}`],
                explanation: `${product} divided by ${a} equals ${x} because ${a} × ${x} = ${product}. Division is the inverse of multiplication.`,
                calc: false
            };
        }
    },
    
    // Squares, Cubes, and Roots (Level 1-2)
    getSquaresAndRoots: function() {
        const questionType = this.rInt(1, 6);
        
        if (questionType === 1) {
            // Forward: "What is the square of n?"
            const n = this.rInt(2, 12);
            const answer = n * n;
            return {
                tex: `\\text{What is } ${n}^2?`,
                instruction: "Calculate the square",
                displayAnswer: `${answer}`,
                distractors: [`${n * 2}`, `${answer + n}`, `${answer - n}`],
                explanation: `${n}^2 = ${n} × ${n} = ${answer}. Squaring means multiplying a number by itself.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Reverse: "n² = answer, find n"
            const n = this.rInt(2, 12);
            const square = n * n;
            return {
                tex: `${square} \\text{ is the square of what number?}`,
                instruction: "Find the number",
                displayAnswer: `${n}`,
                distractors: [`${n + 1}`, `${n - 1}`, `${square / 2}`],
                explanation: `Since ${n} × ${n} = ${square}, the answer is ${n}. This is finding the square root: √${square} = ${n}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Forward: "What is the cube of n?"
            const n = this.rInt(2, 6);
            const answer = n * n * n;
            return {
                tex: `\\text{What is } ${n}^3?`,
                instruction: "Calculate the cube",
                displayAnswer: `${answer}`,
                distractors: [`${n * 3}`, `${n * n}`, `${answer + n}`],
                explanation: `${n}^3 = ${n} × ${n} × ${n} = ${answer}. Cubing means multiplying a number by itself three times.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Reverse: "n³ = answer, find n"
            const n = this.rInt(2, 6);
            const cube = n * n * n;
            return {
                tex: `${cube} \\text{ is the cube of what number?}`,
                instruction: "Find the number",
                displayAnswer: `${n}`,
                distractors: [`${n + 1}`, `${n - 1}`, `${cube / 3}`],
                explanation: `Since ${n} × ${n} × ${n} = ${cube}, the answer is ${n}. This is finding the cube root: ∛${cube} = ${n}.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Square root
            const n = this.rInt(2, 12);
            const square = n * n;
            return {
                tex: `\\sqrt{${square}}`,
                instruction: "Calculate",
                displayAnswer: `${n}`,
                distractors: [`${n + 1}`, `${n - 1}`, `${square / 2}`],
                explanation: `The square root of ${square} is ${n} because ${n} × ${n} = ${square}.`,
                calc: false
            };
        } else {
            // Power notation with small exponents
            const base = this.rInt(2, 8);
            const exp = this.rInt(2, 4);
            const answer = Math.pow(base, exp);
            // Build the multiplication chain properly
            const multChain = Array(exp).fill(base).join(' × ');
            return {
                tex: `${base}^${exp}`,
                instruction: "Calculate",
                displayAnswer: `${answer}`,
                distractors: [`${base * exp}`, `${answer + base}`, `${answer - base}`],
                explanation: `${base}^${exp} means multiply ${base} by itself ${exp} times: ${multChain} = ${answer}.`,
                calc: false
            };
        }
    },
    
    // Multiplication Tables (Level 2-3)
    getMultiplicationTables: function() {
        const questionType = this.rInt(1, 5);
        
        if (questionType === 1) {
            // Standard multiplication (easier numbers)
            const a = this.rInt(2, 10);
            const b = this.rInt(2, 10);
            const answer = a * b;
            return {
                tex: `${a} \\times ${b}`,
                instruction: "Calculate",
                displayAnswer: `${answer}`,
                distractors: [`${answer + a}`, `${answer - b}`, `${a + b}`],
                explanation: `${a} × ${b} = ${answer}. You can think of this as ${a} groups of ${b}, or ${b} groups of ${a}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Harder multiplication (larger numbers)
            const a = this.rInt(11, 15);
            const b = this.rInt(6, 12);
            const answer = a * b;
            return {
                tex: `${a} \\times ${b}`,
                instruction: "Calculate",
                displayAnswer: `${answer}`,
                distractors: [`${answer + 10}`, `${answer - 10}`, `${a + b}`],
                explanation: `${a} × ${b} = ${answer}. Break it down: (10 × ${b}) + (${a - 10} × ${b}) = ${10 * b} + ${(a - 10) * b} = ${answer}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Reverse: "a × ? = product"
            const a = this.rInt(3, 9);
            const b = this.rInt(3, 9);
            const product = a * b;
            return {
                tex: `${a} \\times ? = ${product}`,
                instruction: "Find the missing number",
                displayAnswer: `${b}`,
                distractors: [`${b + 1}`, `${b - 1}`, `${a}`],
                explanation: `To find the missing number, divide ${product} by ${a}: ${product} ÷ ${a} = ${b}. Check: ${a} × ${b} = ${product} ✓`,
                calc: false
            };
        } else if (questionType === 4) {
            // Powers of 10 (easier)
            const n = this.rInt(1, 99);
            const multiplier = [10, 100, 1000][this.rInt(0, 2)];
            const answer = n * multiplier;
            return {
                tex: `${n} \\times ${multiplier}`,
                instruction: "Calculate",
                displayAnswer: `${answer}`,
                distractors: [`${answer + multiplier}`, `${n + multiplier}`, `${answer / 10}`],
                explanation: `Multiplying by ${multiplier} is like adding ${Math.log10(multiplier)} zeros: ${n} × ${multiplier} = ${answer}.`,
                calc: false
            };
        } else {
            // Division (as inverse of multiplication)
            const b = this.rInt(3, 12);
            const a = this.rInt(2, 12);
            const dividend = a * b;
            return {
                tex: `${dividend} \\div ${a}`,
                instruction: "Calculate",
                displayAnswer: `${b}`,
                distractors: [`${b + 1}`, `${b - 1}`, `${a}`],
                explanation: `${dividend} ÷ ${a} = ${b} because ${a} × ${b} = ${dividend}. Division undoes multiplication.`,
                calc: false
            };
        }
    },
    
    // Basic Functions (Level 7-8)
    getFunctionProblems: function() {
        const questionType = this.rInt(1, 3);
        
        if (questionType === 1) {
            // Function evaluation: f(x) = ax + b, find f(n)
            const a = this.rInt(2, 8);
            const b = this.rInt(1, 10);
            const x = this.rInt(1, 8);
            const answer = a * x + b;
            return {
                tex: `f(x) = ${a}x + ${b}, \\quad f(${x}) = ?`,
                instruction: "Evaluate the function",
                displayAnswer: `${answer}`,
                distractors: [`${a * x}`, `${answer + a}`, `${answer - b}`],
                explanation: `Substitute x = ${x} into the function: f(${x}) = ${a}(${x}) + ${b} = ${a * x} + ${b} = ${answer}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Composite function: f(x) = 2x, g(x) = x + 3, find f(g(2))
            const x = this.rInt(1, 5);
            const gResult = x + 3;
            const fResult = 2 * gResult;
            return {
                tex: `f(x) = 2x, \\quad g(x) = x + 3, \\quad f(g(${x})) = ?`,
                instruction: "Evaluate the composite function",
                displayAnswer: `${fResult}`,
                distractors: [`${fResult + 2}`, `${gResult}`, `${x * 2 + 3}`],
                explanation: `First find g(${x}) = ${x} + 3 = ${gResult}. Then find f(${gResult}) = 2(${gResult}) = ${fResult}. Work from the inside out.`,
                calc: false
            };
        } else {
            // Inverse: if f(x) = 3x - 2 and f(a) = 10, find a
            const m = this.rInt(2, 5);
            const c = this.rInt(1, 8);
            const result = this.rInt(10, 30);
            const x = (result + c) / m;
            // Ensure integer result
            if (x !== Math.floor(x)) {
                // Recalculate with values that work
                const xInt = this.rInt(3, 8);
                const resultInt = m * xInt - c;
                return {
                    tex: `f(x) = ${m}x - ${c}, \\quad f(a) = ${resultInt}, \\quad a = ?`,
                    instruction: "Find the input value",
                    displayAnswer: `${xInt}`,
                    distractors: [`${xInt + 1}`, `${xInt - 1}`, `${resultInt}`],
                    explanation: `We have ${m}a - ${c} = ${resultInt}. Add ${c}: ${m}a = ${resultInt + c}. Divide by ${m}: a = ${xInt}.`,
                    calc: false
                };
            }
            return {
                tex: `f(x) = ${m}x - ${c}, \\quad f(a) = ${result}, \\quad a = ?`,
                instruction: "Find the input value",
                displayAnswer: `${x}`,
                distractors: [`${x + 1}`, `${x - 1}`, `${result}`],
                explanation: `We have ${m}a - ${c} = ${result}. Add ${c}: ${m}a = ${result + c}. Divide by ${m}: a = ${x}.`,
                calc: false
            };
        }
    },
    
    // Trigonometry (Level 8-9)
    getTrigonometry: function() {
        const questionType = this.rInt(1, 3);
        
        // Common angles in degrees and their trig values
        const angles = [
            { deg: 0, sin: 0, cos: 1, tan: 0 },
            { deg: 30, sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}', tan: '\\frac{1}{\\sqrt{3}}', sinVal: 0.5, cosVal: 0.866, tanVal: 0.577 },
            { deg: 45, sin: '\\frac{1}{\\sqrt{2}}', cos: '\\frac{1}{\\sqrt{2}}', tan: 1, sinVal: 0.707, cosVal: 0.707, tanVal: 1 },
            { deg: 60, sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}', tan: '\\sqrt{3}', sinVal: 0.866, cosVal: 0.5, tanVal: 1.732 },
            { deg: 90, sin: 1, cos: 0, tan: '\\text{undefined}', sinVal: 1, cosVal: 0, tanVal: Infinity }
        ];
        
        const angle = angles[this.rInt(0, 3)]; // Exclude 90 for most cases
        
        if (questionType === 1) {
            // Find sin of angle
            return {
                tex: `\\sin(${angle.deg}°)`,
                instruction: "Calculate (use exact values)",
                displayAnswer: `${angle.sin}`,
                distractors: [`${angle.cos}`, `${angle.tan}`, `${angle.deg / 90}`],
                explanation: `sin(${angle.deg}°) = ${angle.sin}. This is one of the standard angles you should memorize.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Find cos of angle
            return {
                tex: `\\cos(${angle.deg}°)`,
                instruction: "Calculate (use exact values)",
                displayAnswer: `${angle.cos}`,
                distractors: [`${angle.sin}`, `${angle.tan}`, `${1 - (angle.sinVal || angle.sin)}`],
                explanation: `cos(${angle.deg}°) = ${angle.cos}. Remember: cos(θ) is the x-coordinate on the unit circle.`,
                calc: false
            };
        } else {
            // Find tan of angle (avoid 90°)
            const validAngles = angles.filter(a => a.deg !== 90);
            const tanAngle = validAngles[this.rInt(0, validAngles.length - 1)];
            return {
                tex: `\\tan(${tanAngle.deg}°)`,
                instruction: "Calculate (use exact values)",
                displayAnswer: `${tanAngle.tan}`,
                distractors: [`${tanAngle.sin}`, `${tanAngle.cos}`, `${tanAngle.deg / 45}`],
                explanation: `tan(${tanAngle.deg}°) = ${tanAngle.tan}. Remember: tan(θ) = sin(θ)/cos(θ).`,
                calc: false
            };
        }
    },
    
    // Probability (Level 10-11)
    getProbability: function() {
        const questionType = this.rInt(1, 3);
        
        if (questionType === 1) {
            // Simple probability: choosing from a bag
            const total = this.rInt(8, 15);
            const favorable = this.rInt(2, total - 2);
            return {
                tex: `\\text{Bag has ${total} balls, ${favorable} are red. P(red) = ?}`,
                instruction: "Find the probability",
                displayAnswer: `\\frac{${favorable}}{${total}}`,
                distractors: [
                    `\\frac{${total - favorable}}{${total}}`,
                    `\\frac{${favorable}}{${total - favorable}}`,
                    `\\frac{${total}}{${favorable}}`
                ],
                explanation: `Probability = (favorable outcomes)/(total outcomes) = ${favorable}/${total}. This can be simplified if needed.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Choosing multiple items
            const total = this.rInt(6, 10);
            const choose = this.rInt(2, 3);
            const black = this.rInt(1, 3);
            
            return {
                tex: `\\text{Choosing ${choose} balls from ${total}, where ${black} is black}`,
                instruction: "This is a probability setup question",
                displayAnswer: `\\text{Use combinations: } C(${total}, ${choose})`,
                distractors: [
                    `${total - choose}`,
                    `${total} \\times ${choose}`,
                    `\\frac{${total}}{${choose}}`
                ],
                explanation: `The total number of ways to choose ${choose} balls from ${total} is C(${total},${choose}) = ${total}!/((${total - choose})!×${choose}!). This is a combination problem.`,
                calc: true
            };
        } else {
            // Complementary probability
            const total = this.rInt(10, 20);
            const favorable = this.rInt(3, 7);
            const complement = total - favorable;
            return {
                tex: `\\text{If P(success) = } \\frac{${favorable}}{${total}}\\text{, what is P(failure)?}`,
                instruction: "Find the complementary probability",
                displayAnswer: `\\frac{${complement}}{${total}}`,
                distractors: [
                    `\\frac{${favorable}}{${total}}`,
                    `\\frac{${total}}{${complement}}`,
                    `1 - \\frac{${complement}}{${total}}`
                ],
                explanation: `P(failure) = 1 - P(success) = 1 - ${favorable}/${total} = ${complement}/${total}. The probabilities of all outcomes sum to 1.`,
                calc: false
            };
        }
    },
    
    // Calculus (Level 11+)
    getCalculus: function() {
        const questionType = this.rInt(1, 3);
        
        if (questionType === 1) {
            // Basic integration: ∫x^n dx
            const n = this.rInt(2, 5);
            const newExp = n + 1;
            return {
                tex: `\\int x^${n} \\, dx`,
                instruction: "Integrate",
                displayAnswer: `\\frac{x^{${newExp}}}{${newExp}} + C`,
                distractors: [
                    `\\frac{x^{${n}}}{${n}} + C`,
                    `${n}x^{${n - 1}} + C`,
                    `x^{${newExp}} + C`
                ],
                explanation: `Using the power rule for integration: ∫x^n dx = x^(n+1)/(n+1) + C. So ∫x^${n} dx = x^${newExp}/${newExp} + C. Don't forget the constant of integration!`,
                calc: false
            };
        } else if (questionType === 2) {
            // Integration with coefficient: ∫ax^n dx
            const a = this.rInt(2, 8);
            const n = this.rInt(2, 4);
            const newExp = n + 1;
            return {
                tex: `\\int ${a}x^${n} \\, dx`,
                instruction: "Integrate",
                displayAnswer: `\\frac{${a}x^{${newExp}}}{${newExp}} + C`,
                distractors: [
                    `${a}x^{${newExp}} + C`,
                    `\\frac{x^{${newExp}}}{${newExp}} + C`,
                    `${a * n}x^{${n - 1}} + C`
                ],
                explanation: `Integrate using the power rule, keeping the coefficient: ∫${a}x^${n} dx = ${a} × x^${newExp}/${newExp} + C = ${a}x^${newExp}/${newExp} + C.`,
                calc: false
            };
        } else {
            // Simple infinite series: sum of geometric series
            // Define series ratios with their corresponding values and display formats
            const seriesOptions = [
                { r: 0.5, display: '0.5', answer: 2, answerDisplay: '2' },
                { r: 0.25, display: '0.25', answer: 4, answerDisplay: '4' },
                { r: 0.1, display: '0.1', answer: 1.111, answerDisplay: '1.11' }
            ];
            
            const series = seriesOptions[this.rInt(0, seriesOptions.length - 1)];
            
            return {
                tex: `\\sum_{n=0}^{\\infty} (${series.display})^n`,
                instruction: "Find the sum (if |r| < 1)",
                displayAnswer: `${series.answerDisplay}`,
                distractors: [
                    `\\text{diverges}`,
                    `${series.display}`,
                    `\\infty`
                ],
                explanation: `This is a geometric series with first term a=1 and ratio r=${series.display}. Since |r| < 1, it converges to S = a/(1-r) = 1/(1-${series.display}) = ${series.answerDisplay}.`,
                calc: false
            };
        }
    },
    
    // "Why" question generator - asks students to explain reasoning
    getWhyQuestion: function(level) {
        const band = Math.round(level);
        
        // Define "why" questions for each difficulty band
        const whyQuestions = [];
        
        // Level 0-1: Basic arithmetic
        if (band <= 1) {
            const a = this.rInt(5, 15), b = this.rInt(3, 10);
            const sum = a + b;
            whyQuestions.push({
                type: 'why',
                tex: `${a} + ${b} = ${sum}`,
                instruction: "What does addition represent?",
                displayAnswer: `Combining two quantities to find the total`,
                distractors: [
                    `Taking away one number from another`,
                    `Repeated multiplication`,
                    `Splitting into equal groups`
                ],
                explanation: `Addition combines ${a} and ${b} to give us the total: ${sum}. It's like putting two groups together.`,
                calc: false
            });
        }
        
        // Level 1-2: Squares and roots
        if (band <= 2 && band > 0) {
            const n = this.rInt(3, 9);
            const square = n * n;
            whyQuestions.push({
                type: 'why',
                tex: `\\sqrt{${square}} = ${n}`,
                instruction: "Why is the square root of " + square + " equal to " + n + "?",
                displayAnswer: `Because ${n} × ${n} = ${square}`,
                distractors: [
                    `Because ${square} ÷ 2 = ${square / 2}`,
                    `Because we reverse the addition`,
                    `Because ${n} + ${n} = ${n * 2}`
                ],
                explanation: `The square root undoes squaring. Since ${n}² = ${square}, we have √${square} = ${n}.`,
                calc: false
            });
        }
        
        // Level 2-3: Multiplication
        if (band <= 3 && band > 1) {
            const a = this.rInt(3, 8), b = this.rInt(3, 8);
            const product = a * b;
            whyQuestions.push({
                type: 'why',
                tex: `${a} \\times ${b} = ${product}`,
                instruction: "What does multiplication represent?",
                displayAnswer: `Adding ${a} to itself ${b} times (or ${b} to itself ${a} times)`,
                distractors: [
                    `Combining two numbers`,
                    `Taking ${a} away from ${b}`,
                    `Dividing ${a} by ${b}`
                ],
                explanation: `${a} × ${b} means ${a} groups of ${b}, or ${b} groups of ${a}, which equals ${product}.`,
                calc: false
            });
        }
        
        // Level 3-4: Basic equation solving
        if (band <= 4 && band > 2) {
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
        
        // Level 4-5: Two-step equations (was Level 3-4)
        if (band <= 5 && band > 3) {
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
        
        // Level 5-6: Expanding (was Level 5-6)
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
        
        // Level 6-7: Factorising (was Level 7-8)
        if (band <= 7 && band > 5) {
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
        
        // Level 8-9: Functions and trigonometry
        if (band <= 9 && band > 7) {
            const whyType = this.rInt(1, 2);
            if (whyType === 1) {
                // Functions
                const a = this.rInt(2, 5), x = this.rInt(2, 5);
                const result = a * x;
                whyQuestions.push({
                    type: 'why',
                    tex: `f(x) = ${a}x, \\quad f(${x}) = ${result}`,
                    instruction: "What does f(" + x + ") mean?",
                    displayAnswer: `Substitute ${x} for x in the function definition`,
                    distractors: [
                        `Multiply f by ${x}`,
                        `Add ${x} to the function`,
                        `Divide f by ${x}`
                    ],
                    explanation: `f(${x}) means substitute x = ${x} into the function: f(${x}) = ${a}(${x}) = ${result}.`,
                    calc: false
                });
            } else {
                // Trigonometry
                whyQuestions.push({
                    type: 'why',
                    tex: `\\sin(30°) = \\frac{1}{2}`,
                    instruction: "Why should we memorize standard angle values?",
                    displayAnswer: `They appear frequently and help solve problems quickly`,
                    distractors: [
                        `Because calculators don't have these values`,
                        `To make tests harder`,
                        `Because they're the only correct answers`
                    ],
                    explanation: `Standard angles (0°, 30°, 45°, 60°, 90°) appear often in math and physics. Knowing them saves time and helps recognize patterns.`,
                    calc: false
                });
            }
        }
        
        // Level 9-10: Differentiation
        if (band <= 10 && band > 8) {
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
        
        // Level 10-11: Probability
        if (band <= 11 && band > 9) {
            whyQuestions.push({
                type: 'why',
                tex: `P(A) + P(\\text{not } A) = 1`,
                instruction: "Why do complementary probabilities sum to 1?",
                displayAnswer: `Because one of the outcomes must happen (certainty)`,
                distractors: [
                    `Because probabilities are always positive`,
                    `To keep the math simple`,
                    `Because we're adding two fractions`
                ],
                explanation: `The event either happens or it doesn't. These are the only possibilities, so their probabilities sum to 1 (certainty).`,
                calc: false
            });
        }
        
        // Level 11+: Calculus
        if (band > 10) {
            const n = this.rInt(2, 4);
            whyQuestions.push({
                type: 'why',
                tex: `\\int x^${n} \\, dx = \\frac{x^{${n + 1}}}{${n + 1}} + C`,
                instruction: "Why do we add a constant C when integrating?",
                displayAnswer: `Because the derivative of a constant is zero, so any constant could have been there`,
                distractors: [
                    `To make the answer look complete`,
                    `Because integration always adds 1`,
                    `To balance the equation`
                ],
                explanation: `When we differentiate, constants disappear (d/dx[C] = 0). So when we integrate, we must account for any constant that was lost. We write "+ C" to represent this unknown constant.`,
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
