// --- GENERATOR ---
window.Generator = {
    rInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    questionCounter: 0, // Track questions to interleave "why" questions
    
    // Constants for expression evaluation
    EQUIVALENCE_TOLERANCE: 0.0001,
    EQUIVALENCE_TEST_VALUES: [1, 2, 4, 9, 16],
    FALLBACK_DISTRACTOR_MAX_COEFFICIENT: 20, // Max coefficient for fallback distractors
    
    // Helper function to convert function notation to unicode mathematical italic characters
    // U+1D453 = 𝑓 (Mathematical Italic Small F)
    // U+1D454 = 𝑔 (Mathematical Italic Small G)
    toUnicodeFunction: function(str) {
        return str
            .replace(/f\(/g, '𝑓(')  // f( -> 𝑓(
            .replace(/f\^/g, '𝑓^')  // f^ -> 𝑓^ (for inverse notation)
            .replace(/f'/g, "𝑓'")  // f' -> 𝑓' (for derivative notation)
            .replace(/g\(/g, '𝑔(')  // g( -> 𝑔(
            .replace(/g'/g, "𝑔'"); // g' -> 𝑔' (for derivative notation)
    },
    
    // Math helper functions for fractions
    gcd: (a, b) => b === 0 ? a : window.Generator.gcd(b, a % b),
    lcm: (a, b) => (a * b) / window.Generator.gcd(a, b),
    
    // Joke answers as fallback when it's impractical to generate distinct answers
    JOKE_ANSWERS: [
        "42 (the ultimate answer)",
        "blue",
        "∞ (infinity)",
        "🤔",
        "i (imaginary unit)",
        "undefined",
        "NaN (Not a Number)",
        "π (exactly)",
        "e (Euler's number)",
        "∅ (empty set)"
    ],
    
    // Parse LaTeX fraction string and return {numerator, denominator}
    // Handles formats like: \frac{6}{12}, \frac{1}{2}, 0.5, ${decimal}
    parseFraction: function(str) {
        if (!str) return null;
        
        // Match LaTeX fraction: \frac{num}{den}
        const fracMatch = str.match(/\\frac\{(-?\d+)\}\{(-?\d+)\}/);
        if (fracMatch) {
            return {
                numerator: parseInt(fracMatch[1], 10),
                denominator: parseInt(fracMatch[2], 10)
            };
        }
        
        // Match decimal number
        const decMatch = str.match(/^-?\d+\.?\d*$/);
        if (decMatch) {
            const val = parseFloat(str);
            // Convert decimal to fraction (up to 6 decimal places)
            const denominator = 1000000;
            const numerator = Math.round(val * denominator);
            const divisor = this.gcd(Math.abs(numerator), denominator);
            return {
                numerator: numerator / divisor,
                denominator: denominator / divisor
            };
        }
        
        return null;
    },
    
    // Normalize fraction to lowest terms
    normalizeFraction: function(numerator, denominator) {
        if (denominator === 0) return { numerator, denominator };
        const divisor = this.gcd(Math.abs(numerator), Math.abs(denominator));
        return {
            numerator: numerator / divisor,
            denominator: denominator / divisor
        };
    },
    
    // Check if two answer strings are mathematically equivalent
    // This handles fractions in different forms (e.g., 6/12 vs 1/2)
    areAnswersEquivalent: function(answer1, answer2) {
        // Direct string match
        if (answer1 === answer2) return true;
        
        const frac1 = this.parseFraction(answer1);
        const frac2 = this.parseFraction(answer2);
        
        // If both are fractions, compare normalized forms
        if (frac1 && frac2) {
            const norm1 = this.normalizeFraction(frac1.numerator, frac1.denominator);
            const norm2 = this.normalizeFraction(frac2.numerator, frac2.denominator);
            return norm1.numerator === norm2.numerator && 
                   norm1.denominator === norm2.denominator;
        }
        
        return false;
    },
    
    // Fisher-Yates shuffle algorithm for proper randomization
    shuffleArray: function(array) {
        const arr = [...array]; // Create a copy to avoid mutation
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },
    
    // Generic helper for ensuring unique distractors with custom equality check
    // Internal function used by both ensureUniqueDistractors and ensureUniqueDistractorsFractionAware
    _ensureUniqueDistractorsWithEqualityCheck: function(correctAnswer, distractors, generateAlternative, isEqual) {
        const uniqueDistractors = [];
        const seenAnswers = [correctAnswer];
        
        // Helper to check if answer is equivalent to any seen answer
        const isEquivalentToAny = (answer) => {
            for (let seen of seenAnswers) {
                if (isEqual(answer, seen)) {
                    return true;
                }
            }
            return false;
        };
        
        // Filter out duplicates and equivalent answers
        for (let distractor of distractors) {
            if (!isEquivalentToAny(distractor)) {
                uniqueDistractors.push(distractor);
                seenAnswers.push(distractor);
            }
        }
        
        // If we filtered out duplicates, generate alternatives
        let jokeIndex = 0;
        let attempts = 0;
        const maxAttempts = 100; // Prevent infinite loops
        
        while (uniqueDistractors.length < 3 && attempts < maxAttempts) {
            attempts++;
            let alternative;
            
            // First try the provided generator
            if (generateAlternative && attempts < 50) {
                alternative = generateAlternative();
            } else {
                // Fall back to joke answers when generator fails or isn't provided
                alternative = this.JOKE_ANSWERS[jokeIndex % this.JOKE_ANSWERS.length];
                jokeIndex++;
            }
            
            if (!isEquivalentToAny(alternative)) {
                uniqueDistractors.push(alternative);
                seenAnswers.push(alternative);
            }
        }
        
        return uniqueDistractors.slice(0, 3); // Ensure exactly 3 distractors
    },
    
    // Ensure distractors are unique and different from the correct answer
    // This prevents the bug where all buttons show the same content
    ensureUniqueDistractors: function(correctAnswer, distractors, generateAlternative) {
        return this._ensureUniqueDistractorsWithEqualityCheck(
            correctAnswer,
            distractors,
            generateAlternative,
            (a, b) => a === b
        );
    },
    
    // Enhanced version that checks for mathematical equivalence (especially for fractions)
    // This prevents issues like having both "6/12" and "1/2" where only one is marked correct
    ensureUniqueDistractorsFractionAware: function(correctAnswer, distractors, generateAlternative) {
        return this._ensureUniqueDistractorsWithEqualityCheck(
            correctAnswer,
            distractors,
            generateAlternative,
            (a, b) => this.areAnswersEquivalent(a, b)
        );
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
    
    // Generate a signature for a question to identify duplicates in the session
    // This creates a unique key based on the question content
    generateQuestionSignature: function(question) {
        // Use the LaTeX content and correct answer as the signature
        // This ensures the same mathematical question is recognized even if generated differently
        return `${question.tex}_${question.displayAnswer}`;
    },
    
    // Check if a question has been asked frequently (more correct than incorrect answers)
    isFrequentQuestion: function(signature) {
        const sessionLog = window.APP.sessionQuestions;
        const entry = sessionLog.get(signature);
        
        if (!entry) {
            return false; // Not asked yet, so not frequent
        }
        
        // A question is considered "frequent" if answered correctly more often than incorrectly
        return entry.correctCount > entry.incorrectCount;
    },
    
    // Check if a question was recently answered incorrectly
    isRecentlyIncorrect: function(signature) {
        const sessionLog = window.APP.sessionQuestions;
        const entry = sessionLog.get(signature);
        
        if (!entry) {
            return false;
        }
        
        // Consider "recent" as within the last 5 questions
        const RECENT_THRESHOLD = 5;
        const questionsSinceLastAsked = window.APP.sessionQuestionCount - entry.lastAsked;
        
        return entry.incorrectCount > 0 && questionsSinceLastAsked <= RECENT_THRESHOLD;
    },
    
    // Record that a question was asked
    recordQuestionAsked: function(question, isCorrect) {
        const signature = this.generateQuestionSignature(question);
        const sessionLog = window.APP.sessionQuestions;
        
        // Increment the global question counter
        window.APP.sessionQuestionCount++;
        
        if (!sessionLog.has(signature)) {
            sessionLog.set(signature, {
                count: 0,
                correctCount: 0,
                incorrectCount: 0,
                lastAsked: 0
            });
        }
        
        const entry = sessionLog.get(signature);
        entry.count++;
        entry.lastAsked = window.APP.sessionQuestionCount;
        
        if (isCorrect !== undefined) {
            if (isCorrect) {
                entry.correctCount++;
            } else {
                entry.incorrectCount++;
            }
        }
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
        
        // Check if we should insert a Fixing Habits question
        // This takes priority over regular questions when error patterns are detected
        if (window.FixingHabitsQuestions && window.FixingHabitsQuestions.shouldInsertFixingHabitsQuestion()) {
            return window.FixingHabitsQuestions.getFixingHabitsQuestion();
        }
        
        // Interleave "why" questions every 3rd question in learning mode to promote deeper understanding
        // Research shows elaborative interrogation improves conceptual learning (Pressley et al., 1987)
        if (window.APP.mode === 'learning' || window.APP.mode === 'drill') {
            this.questionCounter++;
            if (this.questionCounter % 3 === 0) {
                const question = this.getWhyQuestion(questionLevel);
                question.questionLevel = questionLevel; // Track the level this question came from
                question.topic = window.TopicDefinitions.getTopicForLevel(questionLevel); // Add topic
                return question;
            }
        }
        
        // Get a unique question, avoiding frequent repeats
        const question = this.getUniqueQuestion(questionLevel);
        question.questionLevel = questionLevel; // Track the level this question came from
        question.topic = window.TopicDefinitions.getTopicForLevel(questionLevel); // Add topic
        return question;
    },
    
    // Get a unique question, avoiding frequent questions from the session log
    getUniqueQuestion: function(level) {
        // Only apply session log filtering in learning/drill mode
        if (window.APP.mode !== 'learning' && window.APP.mode !== 'drill') {
            return this.getQuestionForLevel(level);
        }
        
        const MAX_ATTEMPTS = 10; // Maximum attempts to find a unique question
        let attempts = 0;
        
        // Try to get a unique question at the current level
        while (attempts < MAX_ATTEMPTS) {
            const question = this.getQuestionForLevel(level);
            const signature = this.generateQuestionSignature(question);
            
            // Check if this question should be skipped (frequent and not recently incorrect)
            if (this.isFrequentQuestion(signature) && !this.isRecentlyIncorrect(signature)) {
                attempts++;
                continue;
            }
            
            // This question is acceptable - return it
            // Note: Recording is handled by drill.js when the user answers
            return question;
        }
        
        // Fallback 1: Try one level higher or lower
        const adjacentLevels = [
            Math.min(level + 1, MAX_LEVEL),
            Math.max(level - 1, MIN_LEVEL)
        ];
        
        for (const adjLevel of adjacentLevels) {
            attempts = 0;
            while (attempts < MAX_ATTEMPTS) {
                const question = this.getQuestionForLevel(adjLevel);
                const signature = this.generateQuestionSignature(question);
                
                if (this.isFrequentQuestion(signature) && !this.isRecentlyIncorrect(signature)) {
                    attempts++;
                    continue;
                }
                
                // Found an acceptable question at adjacent level
                return question;
            }
        }
        
        // Final fallback: Just generate a question at the current level
        // This ensures we always return a question
        // The main loop and fallback 1 already check for recently incorrect questions
        // If we reach here, it means we've exhausted unique options, so return any question
        return this.getQuestionForLevel(level);
    },
    
    // Get a question for a specific level (extracted from getQuestion for reuse)
    getQuestionForLevel: function(level) {
        const band = Math.round(level);
        // Expanded level system with more granular difficulty - IB Math HL AA curriculum
        if (band <= 1) return this.getBasicArithmetic();      // Level 0-1: Basic arithmetic
        if (band <= 2) return this.getSquaresAndRoots();       // Level 1-2: Squares, cubes, roots
        if (band <= 3) return this.getMultiplicationTables();  // Level 2-3: Multiplication tables
        if (band <= 4) return this.getFractions();             // Level 3-4: Fractions
        if (band <= 5) return this.getDecimalsPercentages();   // Level 4-5: Decimals & percentages
        if (band <= 6) return this.lvl1();                     // Level 5-6: Simple equations
        if (band <= 7) return this.lvl2();                     // Level 6-7: Two-step equations
        if (band <= 8) return this.getInequalities();          // Level 7-8: Inequalities
        if (band <= 9) return this.lvl3();                     // Level 8-9: Expanding
        if (band <= 10) return this.lvl4();                    // Level 9-10: Factorising quadratics
        if (band <= 11) return this.getQuadratics();           // Level 10-11: Quadratics (solving, completing square)
        if (band <= 12) return this.getPolynomials();          // Level 11-12: Polynomials
        if (band <= 13) return this.getExponentialsLogs();     // Level 12-13: Exponentials & logarithms
        if (band <= 14) return this.getSequencesSeries();      // Level 13-14: Sequences & series
        if (band <= 15) return this.getFunctionProblems();     // Level 14-15: Functions
        if (band <= 16) return this.getTrigonometry();         // Level 15-16: Trigonometry
        if (band <= 17) return this.getAdvancedTrig();         // Level 16-17: Advanced trigonometry
        if (band <= 18) return this.getVectors();              // Level 17-18: Vectors
        if (band <= 19) return this.getComplexNumbers();       // Level 18-19: Complex numbers
        if (band <= 20) return this.lvl5();                    // Level 19-20: Basic differentiation
        if (band <= 21) return this.getAdvancedCalculus();     // Level 20-21: Advanced calculus
        if (band <= 22) return this.getStatistics();           // Level 21-22: Statistics
        if (band <= 23) return this.getProbability();          // Level 22-23: Probability
        if (band <= 24) return this.getAdvancedProbability();  // Level 23-24: Advanced probability
        return this.getCalculus();                             // Level 24+: Integration & series
    },
    lvl1: function() {
        const a=this.rInt(2,9), x=this.rInt(2,9);
        const correctAnswer = `x=${x}`;
        const candidateDistractors = [`x=${x+1}`, `x=${a}`, `x=${x-1}`];
        const distractors = this.ensureUniqueDistractors(
            correctAnswer, 
            candidateDistractors,
            () => `x=${this.rInt(2, 9)}`
        );
        return { 
            tex: `${a}x = ${a*x}`, 
            instruction: "Solve for x", 
            displayAnswer: correctAnswer, 
            distractors: distractors, 
            explanation:`To isolate x, we need to undo the multiplication by ${a}. We divide both sides by ${a} to keep the equation balanced: ${a}x ÷ ${a} = ${a*x} ÷ ${a}, which gives x = ${x}.`, 
            calc:false 
        };
    },
    lvl2: function() {
        const a=this.rInt(2,9), b=this.rInt(2,9), x=this.rInt(2,9);
        const correctAnswer = `x=${x}`;
        const candidateDistractors = [`x=${x+1}`, `x=${-x}`, `x=${b}`];
        const distractors = this.ensureUniqueDistractors(
            correctAnswer, 
            candidateDistractors,
            () => `x=${this.rInt(2, 9)}`
        );
        return { 
            tex: `${a}x + ${b} = ${a*x+b}`, 
            instruction: "Solve for x", 
            displayAnswer: correctAnswer, 
            distractors: distractors, 
            explanation:`First, subtract ${b} from both sides to isolate the term with x: ${a}x = ${a*x}. Then divide both sides by ${a} to get x alone: x = ${x}. Remember: we perform inverse operations in reverse order of operations (PEMDAS backwards).`, 
            calc:false 
        };
    },
    lvl3: function() {
        const a=this.rInt(2,5), b=this.rInt(2,8);
        const correctAnswer = `${a}x + ${a*b}`;
        const candidateDistractors = [`${a}x+${b}`, `x+${a*b}`, `${a}x^2+${b}`];
        const distractors = this.ensureUniqueDistractors(
            correctAnswer,
            candidateDistractors,
            () => {
                const randA = this.rInt(2, 9);
                const randB = this.rInt(2, 12);
                return `${randA}x+${randB}`;
            }
        );
        return { 
            tex: `${a}(x + ${b})`, 
            instruction: "Expand", 
            displayAnswer: correctAnswer, 
            distractors: distractors, 
            explanation:`Use the distributive property: multiply ${a} by each term inside the parentheses. ${a} × x = ${a}x, and ${a} × ${b} = ${a*b}. This gives ${a}x + ${a*b}. Common mistake: forgetting to multiply ${a} by ${b}.`, 
            calc:false 
        };
    },
    lvl4: function() {
        const a=this.rInt(1,5), b=this.rInt(2,6);
        const correctAnswer = `(x+${a})(x+${b})`;
        const candidateDistractors = [`(x+${a+b})(x+${a*b})`, `x(x+${a+b})`, `(x-${a})(x-${b})`];
        const distractors = this.ensureUniqueDistractors(
            correctAnswer,
            candidateDistractors,
            () => {
                const randA = this.rInt(1, 9);
                const randB = this.rInt(1, 9);
                return `(x+${randA})(x+${randB})`;
            }
        );
        return { 
            tex: `x^2 + ${a+b}x + ${a*b}`, 
            instruction: "Factorise", 
            displayAnswer: correctAnswer, 
            distractors: distractors, 
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
            const correctAnswer = `${a*n}x^{${n-1}}`;
            const candidateDistractors = [`${a*n}x^{${n}}`, `${a}x^{${n-1}}`, `${n}x^{${a}}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const randCoeff = this.rInt(2, 20);
                    const randExp = this.rInt(0, 5);
                    return `${randCoeff}x^{${randExp}}`;
                }
            );
            return { 
                tex: this.toUnicodeFunction(`f(x) = ${a}x^{${n}}`), 
                instruction: this.toUnicodeFunction("Find f'(x)"), 
                displayAnswer: correctAnswer, 
                distractors: distractors, 
                explanation: this.toUnicodeFunction(`Use the power rule for differentiation: multiply the coefficient by the exponent, then reduce the exponent by 1. So ${a}x^${n} becomes ${a} × ${n} × x^${n-1} = ${a*n}x^${n-1}. The derivative tells us the rate of change of the function.`), 
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
            tex: this.toUnicodeFunction(`f(x) = ${a}x^2`),
            instruction: this.toUnicodeFunction("Find f^{-1}(x) for x ≥ 0"),
            displayAnswer: correctAnswer,
            distractors: wrongAnswers,
            explanation: this.toUnicodeFunction(`To find the inverse function, we swap x and y, then solve for y. Start with y = ${a}x^2, swap to get x = ${a}y^2, then divide both sides by ${a} to get y^2 = x/${a}. Finally, take the square root of both sides: y = $\\sqrt{x/${a}}$. We take the positive root because x ≥ 0. The inverse "undoes" what the original function does.`),
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
            const correctAnswer = `${answer}`;
            const candidateDistractors = [`${answer + 1}`, `${answer - 1}`, `${a - b}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 50)}`
            );
            return {
                tex: `${a} + ${b}`,
                instruction: "Calculate",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Adding ${a} and ${b} gives ${answer}. You can verify by counting up from ${a} by ${b} steps.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Simple subtraction
            const a = this.rInt(11, 30);
            const b = this.rInt(1, a - 1);
            const answer = a - b;
            const correctAnswer = `${answer}`;
            const candidateDistractors = [`${answer + 1}`, `${answer - 1}`, `${a + b}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 50)}`
            );
            return {
                tex: `${a} - ${b}`,
                instruction: "Calculate",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Subtracting ${b} from ${a} gives ${answer}. You can verify by adding: ${answer} + ${b} = ${a}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Reverse addition: "? + b = c"
            const b = this.rInt(1, 15);
            const c = this.rInt(b + 1, 30);
            const answer = c - b;
            const correctAnswer = `${answer}`;
            const candidateDistractors = [`${answer + 1}`, `${c}`, `${b}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 30)}`
            );
            return {
                tex: `? + ${b} = ${c}`,
                instruction: "Find the missing number",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `To find the missing number, subtract ${b} from ${c}: ${c} - ${b} = ${answer}. Check: ${answer} + ${b} = ${c} ✓`,
                calc: false
            };
        } else {
            // Simple division as reverse multiplication
            const a = this.rInt(2, 9);
            const x = this.rInt(2, 9);
            const product = a * x;
            const correctAnswer = `${x}`;
            const candidateDistractors = [`${x + 1}`, `${x - 1}`, `${a}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(2, 9)}`
            );
            return {
                tex: `${product} \\div ${a}`,
                instruction: "Calculate",
                displayAnswer: correctAnswer,
                distractors: distractors,
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
            const correctAnswer = `${answer}`;
            const candidateDistractors = [`${n * 2}`, `${answer + n}`, `${answer - n}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(4, 150)}`
            );
            return {
                tex: `\\text{What is } ${n}^2?`,
                instruction: "Calculate the square",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `${n}^2 = ${n} × ${n} = ${answer}. Squaring means multiplying a number by itself.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Reverse: "n² = answer, find n"
            const n = this.rInt(2, 12);
            const square = n * n;
            const correctAnswer = `${n}`;
            const candidateDistractors = [`${n + 1}`, `${n - 1}`, `${Math.floor(square / 2)}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(2, 12)}`
            );
            return {
                tex: `${square} \\text{ is the square of what number?}`,
                instruction: "Find the number",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Since ${n} × ${n} = ${square}, the answer is ${n}. This is finding the square root: $\\sqrt{${square}} = ${n}$.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Forward: "What is the cube of n?"
            const n = this.rInt(2, 6);
            const answer = n * n * n;
            const correctAnswer = `${answer}`;
            const candidateDistractors = [`${n * 3}`, `${n * n}`, `${answer + n}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(8, 250)}`
            );
            return {
                tex: `\\text{What is } ${n}^3?`,
                instruction: "Calculate the cube",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `${n}^3 = ${n} × ${n} × ${n} = ${answer}. Cubing means multiplying a number by itself three times.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Reverse: "n³ = answer, find n"
            const n = this.rInt(2, 6);
            const cube = n * n * n;
            const correctAnswer = `${n}`;
            const candidateDistractors = [`${n + 1}`, `${n - 1}`, `${Math.floor(cube / 3)}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(2, 6)}`
            );
            return {
                tex: `${cube} \\text{ is the cube of what number?}`,
                instruction: "Find the number",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Since ${n} × ${n} × ${n} = ${cube}, the answer is ${n}. This is finding the cube root: ∛${cube} = ${n}.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Square root
            const n = this.rInt(2, 12);
            const square = n * n;
            const correctAnswer = `${n}`;
            const candidateDistractors = [`${n + 1}`, `${n - 1}`, `${Math.floor(square / 2)}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(2, 12)}`
            );
            return {
                tex: `\\sqrt{${square}}`,
                instruction: "Calculate",
                displayAnswer: correctAnswer,
                distractors: distractors,
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
            const correctAnswer = `${answer}`;
            const candidateDistractors = [`${base * exp}`, `${answer + base}`, `${answer - base}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(4, 500)}`
            );
            return {
                tex: `${base}^${exp}`,
                instruction: "Calculate",
                displayAnswer: correctAnswer,
                distractors: distractors,
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
            const correctAnswer = `${answer}`;
            const candidateDistractors = [`${answer + a}`, `${answer - b}`, `${a + b}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(4, 100)}`
            );
            return {
                tex: `${a} \\times ${b}`,
                instruction: "Calculate",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `${a} × ${b} = ${answer}. You can think of this as ${a} groups of ${b}, or ${b} groups of ${a}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Harder multiplication (larger numbers)
            const a = this.rInt(11, 15);
            const b = this.rInt(6, 12);
            const answer = a * b;
            const correctAnswer = `${answer}`;
            const candidateDistractors = [`${answer + 10}`, `${answer - 10}`, `${a + b}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(50, 200)}`
            );
            return {
                tex: `${a} \\times ${b}`,
                instruction: "Calculate",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `${a} × ${b} = ${answer}. Break it down: (10 × ${b}) + (${a - 10} × ${b}) = ${10 * b} + ${(a - 10) * b} = ${answer}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Reverse: "a × ? = product"
            const a = this.rInt(3, 9);
            const b = this.rInt(3, 9);
            const product = a * b;
            const correctAnswer = `${b}`;
            const candidateDistractors = [`${b + 1}`, `${b - 1}`, `${a}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(2, 12)}`
            );
            return {
                tex: `${a} \\times ? = ${product}`,
                instruction: "Find the missing number",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `To find the missing number, divide ${product} by ${a}: ${product} ÷ ${a} = ${b}. Check: ${a} × ${b} = ${product} ✓`,
                calc: false
            };
        } else if (questionType === 4) {
            // Powers of 10 (easier)
            const n = this.rInt(1, 99);
            const multiplier = [10, 100, 1000][this.rInt(0, 2)];
            const answer = n * multiplier;
            const correctAnswer = `${answer}`;
            const candidateDistractors = [`${answer + multiplier}`, `${n + multiplier}`, `${Math.floor(answer / 10)}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(10, 10000)}`
            );
            return {
                tex: `${n} \\times ${multiplier}`,
                instruction: "Calculate",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Multiplying by ${multiplier} is like adding ${Math.log10(multiplier)} zeros: ${n} × ${multiplier} = ${answer}.`,
                calc: false
            };
        } else {
            // Division (as inverse of multiplication)
            const b = this.rInt(3, 12);
            const a = this.rInt(2, 12);
            const dividend = a * b;
            const correctAnswer = `${b}`;
            const candidateDistractors = [`${b + 1}`, `${b - 1}`, `${a}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(2, 12)}`
            );
            return {
                tex: `${dividend} \\div ${a}`,
                instruction: "Calculate",
                displayAnswer: correctAnswer,
                distractors: distractors,
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
            const correctAnswer = `${answer}`;
            const candidateDistractors = [`${a * x}`, `${answer + a}`, `${answer - b}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 100)}`
            );
            return {
                tex: this.toUnicodeFunction(`f(x) = ${a}x + ${b} \\\\[0.5em] f(${x}) = ?`),
                instruction: "Evaluate the function",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: this.toUnicodeFunction(`Substitute x = ${x} into the function: f(${x}) = ${a}(${x}) + ${b} = ${a * x} + ${b} = ${answer}.`),
                calc: false
            };
        } else if (questionType === 2) {
            // Composite function: f(x) = 2x, g(x) = x + 3, find f(g(2))
            const x = this.rInt(1, 5);
            const gResult = x + 3;
            const fResult = 2 * gResult;
            const correctAnswer = `${fResult}`;
            const candidateDistractors = [`${fResult + 2}`, `${gResult}`, `${x * 2 + 3}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(5, 30)}`
            );
            return {
                tex: this.toUnicodeFunction(`f(x) = 2x \\\\[0.5em] g(x) = x + 3 \\\\[0.5em] f(g(${x})) = ?`),
                instruction: "Evaluate the composite function",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: this.toUnicodeFunction(`First find g(${x}) = ${x} + 3 = ${gResult}. Then find f(${gResult}) = 2(${gResult}) = ${fResult}. Work from the inside out.`),
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
                const correctAnswer = `${xInt}`;
                const candidateDistractors = [`${xInt + 1}`, `${xInt - 1}`, `${resultInt}`];
                const distractors = this.ensureUniqueDistractors(
                    correctAnswer,
                    candidateDistractors,
                    () => `${this.rInt(1, 20)}`
                );
                return {
                    tex: this.toUnicodeFunction(`f(x) = ${m}x - ${c} \\\\[0.5em] f(a) = ${resultInt} \\\\[0.5em] a = ?`),
                    instruction: "Find the input value",
                    displayAnswer: correctAnswer,
                    distractors: distractors,
                    explanation: `We have ${m}a - ${c} = ${resultInt}. Add ${c}: ${m}a = ${resultInt + c}. Divide by ${m}: a = ${xInt}.`,
                    calc: false
                };
            }
            const correctAnswer = `${x}`;
            const candidateDistractors = [`${x + 1}`, `${x - 1}`, `${result}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 20)}`
            );
            return {
                tex: this.toUnicodeFunction(`f(x) = ${m}x - ${c} \\\\[0.5em] f(a) = ${result} \\\\[0.5em] a = ?`),
                instruction: "Find the input value",
                displayAnswer: correctAnswer,
                distractors: distractors,
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
            const correctAnswer = `${angle.sin}`;
            const candidateDistractors = [`${angle.cos}`, `${angle.tan}`, `${angle.deg / 90}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const altAngles = ['0', '\\frac{1}{2}', '\\frac{1}{\\sqrt{2}}', '\\frac{\\sqrt{3}}{2}', '1'];
                    return altAngles[this.rInt(0, altAngles.length - 1)];
                }
            );
            return {
                tex: `\\sin(${angle.deg}°)`,
                instruction: "Calculate (use exact values)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `sin(${angle.deg}°) = ${angle.sin}. This is one of the standard angles you should memorize.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Find cos of angle
            const correctAnswer = `${angle.cos}`;
            // Use a clearer way to compute a plausible distractor
            const complementDistractor = angle.sinVal ? `${(1 - angle.sinVal).toFixed(3)}` : `${1 - Number(angle.sin)}`;
            const candidateDistractors = [`${angle.sin}`, `${angle.tan}`, complementDistractor];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const altAngles = ['0', '\\frac{1}{2}', '\\frac{1}{\\sqrt{2}}', '\\frac{\\sqrt{3}}{2}', '1'];
                    return altAngles[this.rInt(0, altAngles.length - 1)];
                }
            );
            return {
                tex: `\\cos(${angle.deg}°)`,
                instruction: "Calculate (use exact values)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `cos(${angle.deg}°) = ${angle.cos}. Remember: cos(θ) is the x-coordinate on the unit circle.`,
                calc: false
            };
        } else {
            // Find tan of angle (avoid 90°)
            const validAngles = angles.filter(a => a.deg !== 90);
            const tanAngle = validAngles[this.rInt(0, validAngles.length - 1)];
            const correctAnswer = `${tanAngle.tan}`;
            const candidateDistractors = [`${tanAngle.sin}`, `${tanAngle.cos}`, `${tanAngle.deg / 45}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const altAngles = ['0', '\\frac{1}{\\sqrt{3}}', '1', '\\sqrt{3}'];
                    return altAngles[this.rInt(0, altAngles.length - 1)];
                }
            );
            return {
                tex: `\\tan(${tanAngle.deg}°)`,
                instruction: "Calculate (use exact values)",
                displayAnswer: correctAnswer,
                distractors: distractors,
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
            const correctAnswer = `\\frac{${favorable}}{${total}}`;
            
            // Generate candidate distractors
            const candidateDistractors = [
                `\\frac{${total - favorable}}{${total}}`,
                `\\frac{${favorable}}{${total - favorable}}`,
                `\\frac{${total}}{${favorable}}`
            ];
            
            // Use fraction-aware deduplication to ensure no mathematical equivalence
            const distractors = this.ensureUniqueDistractorsFractionAware(
                correctAnswer,
                candidateDistractors,
                () => {
                    // Generate alternative wrong fractions
                    const wrongNum = this.rInt(1, total);
                    const wrongDen = this.rInt(2, total + 5);
                    return `\\frac{${wrongNum}}{${wrongDen}}`;
                }
            );
            
            return {
                tex: `\\text{Bag has ${total} balls, ${favorable} are red. P(red) = ?}`,
                instruction: "Find the probability",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Probability = (favorable outcomes)/(total outcomes) = ${favorable}/${total}. This can be simplified if needed.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Choosing multiple items
            const total = this.rInt(6, 10);
            const choose = this.rInt(2, 3);
            const black = this.rInt(1, 3);
            const correctAnswer = `\\text{Use combinations: } C(${total}, ${choose})`;
            
            const candidateDistractors = [
                `${total - choose}`,
                `${total} \\times ${choose}`,
                `\\frac{${total}}{${choose}}`
            ];
            
            // Use standard deduplication (not fraction-specific for this type)
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `C(${this.rInt(3, 12)}, ${this.rInt(1, 4)})`
            );
            
            return {
                tex: `\\text{Choosing ${choose} balls from ${total}, where ${black} is black}`,
                instruction: "This is a probability setup question",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `The total number of ways to choose ${choose} balls from ${total} is C(${total},${choose}) = ${total}!/((${total - choose})!×${choose}!). This is a combination problem.`,
                calc: true
            };
        } else {
            // Complementary probability
            const total = this.rInt(10, 20);
            const favorable = this.rInt(3, 7);
            const complement = total - favorable;
            const correctAnswer = `\\frac{${complement}}{${total}}`;
            
            const candidateDistractors = [
                `\\frac{${favorable}}{${total}}`,
                `\\frac{${total}}{${complement}}`,
                `1 - \\frac{${complement}}{${total}}`
            ];
            
            // Use fraction-aware deduplication
            const distractors = this.ensureUniqueDistractorsFractionAware(
                correctAnswer,
                candidateDistractors,
                () => {
                    // Generate alternative wrong fractions
                    const wrongNum = this.rInt(1, total);
                    const wrongDen = this.rInt(2, total + 5);
                    return `\\frac{${wrongNum}}{${wrongDen}}`;
                }
            );
            
            return {
                tex: `\\text{If P(success) = } \\frac{${favorable}}{${total}}\\text{, what is P(failure)?}`,
                instruction: "Find the complementary probability",
                displayAnswer: correctAnswer,
                distractors: distractors,
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
    
    // ========== IB MATH HL AA EXPANDED TOPICS ==========
    
    // Fractions (Level 3-4)
    getFractions: function() {
        const questionType = this.rInt(1, 5);
        
        if (questionType === 1) {
            // Adding fractions with same denominator
            const den = this.rInt(2, 12);
            const num1 = this.rInt(1, den - 1);
            const num2 = this.rInt(1, den - num1);
            const sum = num1 + num2;
            const divisor = this.gcd(sum, den);
            const simplifiedNum = sum / divisor;
            const simplifiedDen = den / divisor;
            
            const correctAnswer = simplifiedDen === 1 ? `${simplifiedNum}` : `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
            const candidateDistractors = [
                `\\frac{${sum}}{${den}}`,
                `\\frac{${num1 + num2}}{${den * 2}}`,
                `\\frac{${simplifiedNum + 1}}{${simplifiedDen}}`
            ];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{${this.rInt(1, 20)}}{${this.rInt(2, 20)}}`
            );
            
            return {
                tex: `\\frac{${num1}}{${den}} + \\frac{${num2}}{${den}}`,
                instruction: "Simplify the result",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Add the numerators: ${num1} + ${num2} = ${sum}. Keep the denominator: ${den}. Then simplify ${sum}/${den} = ${simplifiedNum}/${simplifiedDen}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Multiplying fractions
            const num1 = this.rInt(2, 8);
            const den1 = this.rInt(2, 9);
            const num2 = this.rInt(2, 8);
            const den2 = this.rInt(2, 9);
            const resultNum = num1 * num2;
            const resultDen = den1 * den2;
            const divisor = this.gcd(resultNum, resultDen);
            const simplifiedNum = resultNum / divisor;
            const simplifiedDen = resultDen / divisor;
            
            const correctAnswer = `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
            const candidateDistractors = [
                `\\frac{${resultNum}}{${resultDen}}`,
                `\\frac{${num1 * num2}}{${den1 + den2}}`,
                `\\frac{${num1 + num2}}{${den1 * den2}}`
            ];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{${this.rInt(1, 50)}}{${this.rInt(2, 50)}}`
            );
            
            return {
                tex: `\\frac{${num1}}{${den1}} \\times \\frac{${num2}}{${den2}}`,
                instruction: "Multiply and simplify",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Multiply numerators: ${num1} × ${num2} = ${resultNum}. Multiply denominators: ${den1} × ${den2} = ${resultDen}. Simplify: ${simplifiedNum}/${simplifiedDen}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Dividing fractions
            const num1 = this.rInt(2, 6);
            const den1 = this.rInt(2, 7);
            const num2 = this.rInt(2, 6);
            const den2 = this.rInt(2, 7);
            const resultNum = num1 * den2;
            const resultDen = den1 * num2;
            const divisor = this.gcd(resultNum, resultDen);
            const simplifiedNum = resultNum / divisor;
            const simplifiedDen = resultDen / divisor;
            
            const correctAnswer = `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
            const candidateDistractors = [
                `\\frac{${num1 * num2}}{${den1 * den2}}`,
                `\\frac{${resultNum}}{${resultDen}}`,
                `\\frac{${num1}}{${den1 * num2}}`
            ];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{${this.rInt(1, 40)}}{${this.rInt(2, 40)}}`
            );
            
            return {
                tex: `\\frac{${num1}}{${den1}} \\div \\frac{${num2}}{${den2}}`,
                instruction: "Divide and simplify",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Dividing by a fraction means multiplying by its reciprocal: (${num1}/${den1}) × (${den2}/${num2}) = ${resultNum}/${resultDen} = ${simplifiedNum}/${simplifiedDen}.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Adding fractions with different denominators
            let den1 = this.rInt(2, 6);
            let den2 = this.rInt(3, 7);
            let attempts = 0;
            // Ensure different denominators with max 10 retries
            while (den1 === den2 && attempts < 10) {
                den2 = this.rInt(3, 7);
                attempts++;
            }
            // If still same after retries, force different values
            if (den1 === den2) den2 = den1 + 1;
            
            const num1 = this.rInt(1, den1);
            const num2 = this.rInt(1, den2);
            const commonDen = this.lcm(den1, den2);
            const newNum1 = num1 * (commonDen / den1);
            const newNum2 = num2 * (commonDen / den2);
            const sum = newNum1 + newNum2;
            const divisor = this.gcd(sum, commonDen);
            const simplifiedNum = sum / divisor;
            const simplifiedDen = commonDen / divisor;
            
            const correctAnswer = `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
            const candidateDistractors = [
                `\\frac{${num1 + num2}}{${den1 + den2}}`,
                `\\frac{${sum}}{${commonDen}}`,
                `\\frac{${newNum1}}{${commonDen}}`
            ];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{${this.rInt(1, 30)}}{${this.rInt(2, 30)}}`
            );
            
            return {
                tex: `\\frac{${num1}}{${den1}} + \\frac{${num2}}{${den2}}`,
                instruction: "Find common denominator and add",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Find LCD = ${commonDen}. Convert: ${num1}/${den1} = ${newNum1}/${commonDen} and ${num2}/${den2} = ${newNum2}/${commonDen}. Add: ${newNum1 + newNum2}/${commonDen} = ${simplifiedNum}/${simplifiedDen}.`,
                calc: false
            };
        } else {
            // Simplifying fractions
            const factor = this.rInt(2, 6);
            const num = this.rInt(2, 8) * factor;
            const den = this.rInt(3, 9) * factor;
            const simplifiedNum = num / factor;
            const simplifiedDen = den / factor;
            
            const correctAnswer = `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
            const candidateDistractors = [
                `\\frac{${num}}{${den}}`,
                `\\frac{${simplifiedNum + 1}}{${simplifiedDen}}`,
                `\\frac{${Math.floor(num / 2)}}{${Math.floor(den / 2)}}`
            ];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{${this.rInt(1, 15)}}{${this.rInt(2, 15)}}`
            );
            
            return {
                tex: `\\frac{${num}}{${den}}`,
                instruction: "Simplify to lowest terms",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Both ${num} and ${den} are divisible by ${factor}. Divide both by ${factor}: ${num}÷${factor} = ${simplifiedNum} and ${den}÷${factor} = ${simplifiedDen}.`,
                calc: false
            };
        }
    },
    
    // Decimals and Percentages (Level 4-5)
    getDecimalsPercentages: function() {
        const questionType = this.rInt(1, 4);
        
        if (questionType === 1) {
            // Converting fraction to decimal
            const conversions = [
                { frac: '\\frac{1}{2}', dec: '0.5' },
                { frac: '\\frac{1}{4}', dec: '0.25' },
                { frac: '\\frac{3}{4}', dec: '0.75' },
                { frac: '\\frac{1}{5}', dec: '0.2' },
                { frac: '\\frac{2}{5}', dec: '0.4' },
                { frac: '\\frac{1}{10}', dec: '0.1' }
            ];
            const conv = conversions[this.rInt(0, conversions.length - 1)];
            const correctAnswer = `${conv.dec}`;
            const candidateDistractors = [`${parseFloat(conv.dec) + 0.1}`, `${parseFloat(conv.dec) * 2}`, `${1 - parseFloat(conv.dec)}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${(this.rInt(1, 20) / 10).toFixed(1)}`
            );
            
            return {
                tex: `${conv.frac}`,
                instruction: "Convert to decimal",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Divide the numerator by the denominator to get ${conv.dec}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Converting decimal to percentage
            const decimal = this.rInt(1, 9) / 10;
            const percentage = decimal * 100;
            const correctAnswer = `${percentage}\\%`;
            const candidateDistractors = [`${decimal}\\%`, `${percentage / 10}\\%`, `${percentage * 10}\\%`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 100)}\\%`
            );
            
            return {
                tex: `${decimal}`,
                instruction: "Convert to percentage",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Multiply by 100: ${decimal} × 100 = ${percentage}%.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Finding percentage of a number
            const percent = [10, 20, 25, 50, 75][this.rInt(0, 4)];
            const number = this.rInt(20, 100);
            const result = (percent / 100) * number;
            const correctAnswer = `${result}`;
            const candidateDistractors = [`${result + 10}`, `${result - 5}`, `${number - result}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 100)}`
            );
            
            return {
                tex: `${percent}\\% \\text{ of } ${number}`,
                instruction: "Calculate",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `${percent}% of ${number} = (${percent}/100) × ${number} = ${result}.`,
                calc: false
            };
        } else {
            // Ordering decimals
            const decimals = [
                this.rInt(1, 9) / 10,
                this.rInt(10, 99) / 100,
                this.rInt(1, 9) / 100
            ].sort((a, b) => a - b);
            const correctAnswer = `${decimals[0]}`;
            const candidateDistractors = [`${decimals[1]}`, `${decimals[2]}`, `\\text{all equal}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${(this.rInt(1, 99) / 100).toFixed(2)}`
            );
            
            return {
                tex: `\\text{Which is smallest: } ${decimals[2]}, ${decimals[0]}, ${decimals[1]}?`,
                instruction: "Choose the smallest decimal",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Compare place values: ${decimals[0]} < ${decimals[1]} < ${decimals[2]}.`,
                calc: false
            };
        }
    },
    
    // Inequalities (Level 7-8)
    getInequalities: function() {
        const questionType = this.rInt(1, 3);
        
        if (questionType === 1) {
            // Simple inequality: ax < b
            const a = this.rInt(2, 9);
            const b = this.rInt(10, 50);
            const x = Math.floor(b / a);
            const correctAnswer = `x < ${x}`;
            const candidateDistractors = [`x > ${x}`, `x = ${x}`, `x \\leq ${x}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const randX = this.rInt(1, 20);
                    const ops = ['<', '>', '\\leq', '\\geq'];
                    return `x ${ops[this.rInt(0, ops.length - 1)]} ${randX}`;
                }
            );
            
            return {
                tex: `${a}x < ${b}`,
                instruction: "Solve for x",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Divide both sides by ${a}: x < ${b}/${a} = ${x}. The inequality sign stays the same when dividing by a positive number.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Inequality with negative coefficient: -ax > b
            const a = this.rInt(2, 6);
            const b = this.rInt(-20, -5);
            const x = Math.ceil(b / (-a));
            const correctAnswer = `x < ${x}`;
            const candidateDistractors = [`x > ${x}`, `x = ${x}`, `x < ${-x}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const randX = this.rInt(-10, 10);
                    const ops = ['<', '>', '\\leq', '\\geq'];
                    return `x ${ops[this.rInt(0, ops.length - 1)]} ${randX}`;
                }
            );
            
            return {
                tex: `-${a}x > ${b}`,
                instruction: "Solve for x",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Divide both sides by -${a}: x < ${b}/(-${a}) = ${x}. IMPORTANT: Flip the inequality sign when dividing by a negative number.`,
                calc: false
            };
        } else {
            // Two-step inequality: ax + b < c
            const a = this.rInt(2, 8);
            const b = this.rInt(1, 10);
            const c = this.rInt(b + 10, 50);
            const x = Math.floor((c - b) / a);
            const correctAnswer = `x < ${x}`;
            const candidateDistractors = [`x > ${x}`, `x < ${x + 1}`, `x \\leq ${x}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const randX = this.rInt(1, 20);
                    const ops = ['<', '>', '\\leq', '\\geq'];
                    return `x ${ops[this.rInt(0, ops.length - 1)]} ${randX}`;
                }
            );
            
            return {
                tex: `${a}x + ${b} < ${c}`,
                instruction: "Solve for x",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Subtract ${b}: ${a}x < ${c - b}. Divide by ${a}: x < ${x}. Solve inequalities like equations, but remember to flip the sign when multiplying/dividing by negatives.`,
                calc: false
            };
        }
    },
    
    // Quadratics - Completing the Square & Solving (Level 10-11)
    getQuadratics: function() {
        const questionType = this.rInt(1, 3);
        
        if (questionType === 1) {
            // Solving using quadratic formula (simple cases)
            const p = this.rInt(2, 5);
            const q = this.rInt(1, 4);
            // (x - p)(x - q) = 0 expands to x² - (p+q)x + pq = 0
            const b = -(p + q);
            const c = p * q;
            
            const correctAnswer = `x = ${Math.min(p, q)}`;
            const candidateDistractors = [`x = ${Math.max(p, q)}`, `x = ${-p}`, `x = ${p + q}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `x = ${this.rInt(-10, 10)}`
            );
            
            return {
                tex: `x^2 ${b >= 0 ? '+' : ''}${b}x + ${c} = 0`,
                instruction: "Solve for x (give smaller solution)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `This factors as (x - ${p})(x - ${q}) = 0. Solutions are x = ${p} and x = ${q}. The smaller solution is ${Math.min(p, q)}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Completing the square: x² + 2bx
            const b = this.rInt(2, 8);
            const square = b * b;
            
            const correctAnswer = `${square}`;
            const candidateDistractors = [`${b}`, `${2 * b}`, `${square / 2}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 100)}`
            );
            
            return {
                tex: `x^2 + ${2 * b}x + \\underline{\\quad}`,
                instruction: "What value completes the perfect square?",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `To complete the square for x² + ${2 * b}x, take half the coefficient of x: (${2 * b})/2 = ${b}, then square it: ${b}² = ${square}. This gives (x + ${b})².`,
                calc: false
            };
        } else {
            // Discriminant and nature of roots
            const discriminants = [
                { b: 4, c: 4, disc: 0, nature: 'one repeated root' },
                { b: 5, c: 6, disc: 1, nature: 'two distinct real roots' },
                { b: 2, c: 5, disc: -16, nature: 'no real roots' }
            ];
            const q = discriminants[this.rInt(0, discriminants.length - 1)];
            const disc = q.b * q.b - 4 * q.c;
            const correctAnswer = `${disc}`;
            const candidateDistractors = [`${q.b * q.b}`, `${4 * q.c}`, `${q.b - 4 * q.c}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(-20, 50)}`
            );
            
            return {
                tex: `x^2 + ${q.b}x + ${q.c} = 0`,
                instruction: "What is the discriminant b² - 4ac?",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Discriminant = b² - 4ac = ${q.b}² - 4(1)(${q.c}) = ${q.b * q.b} - ${4 * q.c} = ${disc}. This means ${q.nature}.`,
                calc: false
            };
        }
    },
    
    // Polynomials (Level 11-12)
    getPolynomials: function() {
        const questionType = this.rInt(1, 3);
        
        if (questionType === 1) {
            // Polynomial addition
            const a1 = this.rInt(2, 5);
            const b1 = this.rInt(1, 8);
            const a2 = this.rInt(1, 4);
            const b2 = this.rInt(1, 7);
            const sumA = a1 + a2;
            const sumB = b1 + b2;
            const correctAnswer = `${sumA}x + ${sumB}`;
            const candidateDistractors = [`${a1}x + ${sumB}`, `${sumA}x + ${b1}`, `${a1 * a2}x + ${b1 * b2}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 15)}x + ${this.rInt(1, 15)}`
            );
            
            return {
                tex: `(${a1}x + ${b1}) + (${a2}x + ${b2})`,
                instruction: "Simplify",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Combine like terms: (${a1} + ${a2})x + (${b1} + ${b2}) = ${sumA}x + ${sumB}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Factor theorem: if (x - a) is a factor, then f(a) = 0
            const a = this.rInt(1, 5);
            const b = this.rInt(1, 6);
            const c = -a * b; // Make (x - a) a factor
            const correctAnswer = `\\text{Yes}`;
            const candidateDistractors = [`\\text{No}`, `\\text{Only if x > 0}`, `\\text{Cannot determine}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const options = [`\\text{Yes}`, `\\text{No}`, `\\text{Maybe}`, `\\text{Sometimes}`];
                    return options[this.rInt(0, options.length - 1)];
                }
            );
            
            return {
                tex: this.toUnicodeFunction(`f(x) = x^2 + ${b - a}x + ${c}`),
                instruction: `\\text{Is } (x - ${a}) \\text{ a factor?}`,
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: this.toUnicodeFunction(`By factor theorem, if (x - ${a}) is a factor, then f(${a}) = 0. Check: f(${a}) = ${a}² + ${b - a}(${a}) + ${c} = ${a * a} + ${a * (b - a)} + ${c} = 0. Yes, it's a factor.`),
                calc: false
            };
        } else {
            // Remainder theorem
            const a = this.rInt(1, 4);
            const b = this.rInt(2, 8);
            const c = this.rInt(1, 10);
            const remainder = a * a + b * a + c;
            const correctAnswer = `${remainder}`;
            const candidateDistractors = [`${remainder - a}`, `${c}`, `0`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 50)}`
            );
            
            return {
                tex: this.toUnicodeFunction(`f(x) = x^2 + ${b}x + ${c}`),
                instruction: `\\text{Find remainder when divided by } (x - ${a})`,
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: this.toUnicodeFunction(`By remainder theorem, the remainder when f(x) is divided by (x - ${a}) is f(${a}) = ${a}² + ${b}(${a}) + ${c} = ${remainder}.`),
                calc: false
            };
        }
    },
    
    // Exponentials and Logarithms (Level 12-13)
    getExponentialsLogs: function() {
        const questionType = this.rInt(1, 4);
        
        if (questionType === 1) {
            // Basic exponential: 2^x = 8
            const bases = [2, 3, 5];
            const base = bases[this.rInt(0, bases.length - 1)];
            const exp = this.rInt(2, 4);
            const result = Math.pow(base, exp);
            const correctAnswer = `x = ${exp}`;
            // Avoid using Math.log() which produces non-integer values
            const candidateDistractors = [`x = ${exp + 1}`, `x = ${result / base}`, `x = ${Math.floor(result / 2)}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `x = ${this.rInt(1, 10)}`
            );
            
            return {
                tex: `${base}^x = ${result}`,
                instruction: "Solve for x",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `${base}^${exp} = ${result}, so x = ${exp}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Basic logarithm: log₂(8) = ?
            const base = [2, 10][this.rInt(0, 1)];
            const exp = this.rInt(2, 3);
            const arg = Math.pow(base, exp);
            const logNotation = base === 10 ? '\\log' : `\\log_{${base}}`;
            const correctAnswer = `${exp}`;
            const candidateDistractors = [`${exp + 1}`, `${arg / base}`, `${arg}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 10)}`
            );
            
            return {
                tex: `${logNotation}(${arg})`,
                instruction: "Evaluate",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `${logNotation}(${arg}) = ${exp} because ${base}^${exp} = ${arg}. Logarithm asks: "what power gives us ${arg}?"`,
                calc: false
            };
        } else if (questionType === 3) {
            // Log laws: log(a) + log(b) = log(ab)
            const a = [2, 4, 5, 8][this.rInt(0, 3)];
            const b = [2, 3, 5][this.rInt(0, 2)];
            const product = a * b;
            const correctAnswer = `\\log(${product})`;
            // Use LaTeX format for all distractors for consistency
            const candidateDistractors = [`\\log(${a + b})`, `\\log(${a * 10})`, `\\log(${a}) \\times \\log(${b})`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\log(${this.rInt(10, 100)})`
            );
            
            return {
                tex: `\\log(${a}) + \\log(${b})`,
                instruction: "Simplify using log laws",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Using the product rule: log(a) + log(b) = log(ab). So log(${a}) + log(${b}) = log(${product}).`,
                calc: false
            };
        } else {
            // Exponential equation: e^x = e^3
            const exp = this.rInt(2, 6);
            const correctAnswer = `x = ${exp}`;
            const candidateDistractors = [`x = e^{${exp}}`, `x = ${exp}e`, `x = \\ln(${exp})`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `x = ${this.rInt(1, 10)}`
            );
            
            return {
                tex: `e^x = e^{${exp}}`,
                instruction: "Solve for x",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `If e^x = e^${exp}, then x = ${exp}. Equal bases mean equal exponents.`,
                calc: false
            };
        }
    },
    
    // Sequences and Series (Level 13-14)
    getSequencesSeries: function() {
        const questionType = this.rInt(1, 4);
        
        if (questionType === 1) {
            // Arithmetic sequence: nth term
            const a = this.rInt(3, 10);
            const d = this.rInt(2, 7);
            const n = this.rInt(5, 10);
            const term = a + (n - 1) * d;
            const correctAnswer = `${term}`;
            const candidateDistractors = [`${a + n * d}`, `${term - d}`, `${a * n}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(10, 100)}`
            );
            
            return {
                tex: `\\text{Arithmetic sequence: } a_1 = ${a}, d = ${d}`,
                instruction: `\\text{Find } a_{${n}}`,
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Formula: a_n = a_1 + (n-1)d = ${a} + (${n}-1)(${d}) = ${a} + ${(n - 1) * d} = ${term}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Geometric sequence: nth term
            const a = this.rInt(2, 5);
            const r = this.rInt(2, 3);
            const n = this.rInt(3, 5);
            const term = a * Math.pow(r, n - 1);
            const correctAnswer = `${term}`;
            const candidateDistractors = [`${a * r * n}`, `${term / r}`, `${a + Math.pow(r, n)}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(10, 200)}`
            );
            
            return {
                tex: `\\text{Geometric sequence: } a_1 = ${a}, r = ${r}`,
                instruction: `\\text{Find } a_{${n}}`,
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Formula: a_n = a_1 × r^(n-1) = ${a} × ${r}^${n - 1} = ${a} × ${Math.pow(r, n - 1)} = ${term}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Sum of arithmetic series
            const a = this.rInt(1, 5);
            const d = this.rInt(1, 4);
            const n = this.rInt(5, 10);
            const l = a + (n - 1) * d;
            const sum = (n * (a + l)) / 2;
            const correctAnswer = `${sum}`;
            const candidateDistractors = [`${n * a}`, `${sum + n}`, `${a + l}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(50, 300)}`
            );
            
            return {
                tex: `\\text{Sum of arithmetic series: } a_1 = ${a}, d = ${d}, n = ${n}`,
                instruction: "Find the sum S_n",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `S_n = n(a_1 + a_n)/2. First find a_${n} = ${a} + ${(n - 1) * d} = ${l}. Then S_${n} = ${n}(${a} + ${l})/2 = ${sum}.`,
                calc: false
            };
        } else {
            // Sigma notation
            const n = this.rInt(3, 6);
            const sum = (n * (n + 1)) / 2;
            const correctAnswer = `${sum}`;
            const candidateDistractors = [`${n * n}`, `${n + 1}`, `${sum + n}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(10, 50)}`
            );
            
            return {
                tex: `\\sum_{k=1}^{${n}} k`,
                instruction: "Evaluate the sum",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Sum of first ${n} natural numbers: 1 + 2 + ... + ${n} = n(n+1)/2 = ${n}(${n + 1})/2 = ${sum}.`,
                calc: false
            };
        }
    },
    
    // Advanced Trigonometry (Level 16-17)
    getAdvancedTrig: function() {
        const questionType = this.rInt(1, 4);
        
        if (questionType === 1) {
            // Trig identity: sin²θ + cos²θ = 1
            const correctAnswer = `1`;
            const candidateDistractors = [`\\sin\\theta`, `\\cos\\theta`, `2`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const options = ['0', '1', '2', '\\sin\\theta', '\\cos\\theta'];
                    return options[this.rInt(0, options.length - 1)];
                }
            );
            return {
                tex: `\\sin^2\\theta + \\cos^2\\theta`,
                instruction: "Simplify using trig identity",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Fundamental identity: sin²θ + cos²θ = 1 for all θ. This is derived from the Pythagorean theorem on the unit circle.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Double angle formula: sin(2θ)
            const correctAnswer = `2\\sin\\theta\\cos\\theta`;
            const candidateDistractors = [`\\sin^2\\theta`, `2\\sin\\theta`, `\\sin\\theta + \\cos\\theta`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const options = ['\\sin\\theta\\cos\\theta', '\\sin^2\\theta + \\cos^2\\theta', '\\tan\\theta'];
                    return options[this.rInt(0, options.length - 1)];
                }
            );
            return {
                tex: `\\sin(2\\theta)`,
                instruction: "Express in terms of sinθ and cosθ",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Double angle formula: sin(2θ) = 2sinθcosθ. This comes from the sum formula sin(A+B).`,
                calc: false
            };
        } else if (questionType === 3) {
            // Convert degrees to radians
            const degrees = [30, 45, 60, 90, 180][this.rInt(0, 4)];
            const radians = {
                30: '\\frac{\\pi}{6}',
                45: '\\frac{\\pi}{4}',
                60: '\\frac{\\pi}{3}',
                90: '\\frac{\\pi}{2}',
                180: '\\pi'
            };
            const correctAnswer = `${radians[degrees]}`;
            const candidateDistractors = [`${degrees}\\pi`, `\\frac{${degrees}}{180}`, `\\frac{\\pi}{${degrees}}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const options = ['\\pi', '\\frac{\\pi}{2}', '\\frac{\\pi}{3}', '\\frac{\\pi}{4}', '\\frac{\\pi}{6}', '2\\pi'];
                    return options[this.rInt(0, options.length - 1)];
                }
            );
            
            return {
                tex: `${degrees}°`,
                instruction: "Convert to radians",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `To convert degrees to radians: multiply by π/180. ${degrees}° × (π/180°) = ${radians[degrees]}.`,
                calc: false
            };
        } else {
            // Solving trig equation: sin(x) = 0.5 for 0 ≤ x < 360°
            const correctAnswer = `30°`;
            const candidateDistractors = [`45°`, `60°`, `90°`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const options = ['0°', '30°', '45°', '60°', '90°', '120°', '135°', '150°', '180°'];
                    return options[this.rInt(0, options.length - 1)];
                }
            );
            return {
                tex: `\\sin(x) = 0.5 \\\\[0.5em] 0° \\leq x < 360°`,
                instruction: "Find the smallest solution",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `sin(30°) = 1/2 = 0.5. The solutions in [0°, 360°) are 30° and 150° (supplementary angles). The smallest is 30°.`,
                calc: false
            };
        }
    },
    
    // Vectors (Level 17-18)
    getVectors: function() {
        const questionType = this.rInt(1, 4);
        
        if (questionType === 1) {
            // Vector addition
            const a1 = this.rInt(1, 6);
            const a2 = this.rInt(1, 6);
            const b1 = this.rInt(1, 5);
            const b2 = this.rInt(1, 5);
            const sum1 = a1 + b1;
            const sum2 = a2 + b2;
            
            return {
                tex: `\\begin{pmatrix} ${a1} \\\\ ${a2} \\end{pmatrix} + \\begin{pmatrix} ${b1} \\\\ ${b2} \\end{pmatrix}`,
                instruction: "Add the vectors",
                displayAnswer: `\\begin{pmatrix} ${sum1} \\\\ ${sum2} \\end{pmatrix}`,
                distractors: [
                    `\\begin{pmatrix} ${a1 * b1} \\\\ ${a2 * b2} \\end{pmatrix}`,
                    `\\begin{pmatrix} ${sum1} \\\\ ${a2} \\end{pmatrix}`,
                    `\\begin{pmatrix} ${a1} \\\\ ${sum2} \\end{pmatrix}`
                ],
                explanation: `Add corresponding components: (${a1} + ${b1}, ${a2} + ${b2}) = (${sum1}, ${sum2}).`,
                calc: false
            };
        } else if (questionType === 2) {
            // Scalar multiplication
            const k = this.rInt(2, 5);
            const v1 = this.rInt(1, 6);
            const v2 = this.rInt(1, 6);
            const result1 = k * v1;
            const result2 = k * v2;
            
            return {
                tex: `${k} \\begin{pmatrix} ${v1} \\\\ ${v2} \\end{pmatrix}`,
                instruction: "Multiply vector by scalar",
                displayAnswer: `\\begin{pmatrix} ${result1} \\\\ ${result2} \\end{pmatrix}`,
                distractors: [
                    `\\begin{pmatrix} ${v1 + k} \\\\ ${v2 + k} \\end{pmatrix}`,
                    `\\begin{pmatrix} ${result1} \\\\ ${v2} \\end{pmatrix}`,
                    `\\begin{pmatrix} ${k} \\\\ ${k} \\end{pmatrix}`
                ],
                explanation: `Multiply each component by ${k}: (${k}×${v1}, ${k}×${v2}) = (${result1}, ${result2}).`,
                calc: false
            };
        } else if (questionType === 3) {
            // Magnitude of vector
            const v1 = this.rInt(3, 5);
            const v2 = this.rInt(3, 5);
            const magSquared = v1 * v1 + v2 * v2;
            const mag = Math.sqrt(magSquared);
            const isExact = mag === Math.floor(mag);
            
            return {
                tex: `\\left|\\begin{pmatrix} ${v1} \\\\ ${v2} \\end{pmatrix}\\right|`,
                instruction: "Find the magnitude",
                displayAnswer: isExact ? `${mag}` : `\\sqrt{${magSquared}}`,
                distractors: [
                    `${v1 + v2}`,
                    `${Math.max(v1, v2)}`,
                    `\\sqrt{${v1 * v2}}`
                ],
                explanation: `Magnitude = $\\sqrt{${v1}^2 + ${v2}^2} = \\sqrt{${v1 * v1} + ${v2 * v2}} = \\sqrt{${magSquared}}${isExact ? ' = ' + mag : ''}$.`,
                calc: false
            };
        } else {
            // Dot product
            const a1 = this.rInt(1, 5);
            const a2 = this.rInt(1, 5);
            const b1 = this.rInt(1, 5);
            const b2 = this.rInt(1, 5);
            const dot = a1 * b1 + a2 * b2;
            
            return {
                tex: `\\begin{pmatrix} ${a1} \\\\ ${a2} \\end{pmatrix} \\cdot \\begin{pmatrix} ${b1} \\\\ ${b2} \\end{pmatrix}`,
                instruction: "Calculate the dot product",
                displayAnswer: `${dot}`,
                distractors: [
                    `${a1 + b1}`,
                    `${a1 * b1}`,
                    `${dot + a2}`
                ],
                explanation: `Dot product = (${a1})(${b1}) + (${a2})(${b2}) = ${a1 * b1} + ${a2 * b2} = ${dot}.`,
                calc: false
            };
        }
    },
    
    // Complex Numbers (Level 18-19)
    getComplexNumbers: function() {
        const questionType = this.rInt(1, 4);
        
        if (questionType === 1) {
            // Adding complex numbers
            const a1 = this.rInt(1, 8);
            const b1 = this.rInt(1, 8);
            const a2 = this.rInt(1, 8);
            const b2 = this.rInt(1, 8);
            const sumReal = a1 + a2;
            const sumImag = b1 + b2;
            
            return {
                tex: `(${a1} + ${b1}i) + (${a2} + ${b2}i)`,
                instruction: "Add the complex numbers",
                displayAnswer: `${sumReal} + ${sumImag}i`,
                distractors: [
                    `${a1 + a2}i`,
                    `${sumReal} + ${b1}i`,
                    `${a1} + ${sumImag}i`
                ],
                explanation: `Add real parts and imaginary parts separately: (${a1} + ${a2}) + (${b1} + ${b2})i = ${sumReal} + ${sumImag}i.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Multiplying complex numbers (simple)
            const a = this.rInt(2, 5);
            const b = this.rInt(2, 5);
            // (a + bi)(a - bi) = a² + b² (conjugates)
            const result = a * a + b * b;
            
            return {
                tex: `(${a} + ${b}i)(${a} - ${b}i)`,
                instruction: "Multiply (use i² = -1)",
                displayAnswer: `${result}`,
                distractors: [
                    `${a * a} - ${b * b}`,
                    `${a * a}i`,
                    `${2 * a * b}i`
                ],
                explanation: `Using (a+bi)(a-bi) = a² - (bi)² = a² - b²i² = a² - b²(-1) = a² + b². So ${a}² + ${b}² = ${result}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Modulus of complex number
            const a = this.rInt(3, 5);
            const b = this.rInt(3, 5);
            const modSquared = a * a + b * b;
            const mod = Math.sqrt(modSquared);
            const isExact = mod === Math.floor(mod);
            
            return {
                tex: `|${a} + ${b}i|`,
                instruction: "Find the modulus",
                displayAnswer: isExact ? `${mod}` : `\\sqrt{${modSquared}}`,
                distractors: [
                    `${a + b}`,
                    `${Math.max(a, b)}`,
                    `${a * b}`
                ],
                explanation: `Modulus = $\\sqrt{a^2 + b^2} = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${modSquared}}${isExact ? ' = ' + mod : ''}$.`,
                calc: false
            };
        } else {
            // Powers of i
            const powers = [
                { exp: 2, result: '-1' },
                { exp: 3, result: '-i' },
                { exp: 4, result: '1' }
            ];
            const p = powers[this.rInt(0, powers.length - 1)];
            const correctAnswer = `${p.result}`;
            const candidateDistractors = [`i`, `${p.exp}i`, `${p.exp}`];
            const distractors = this.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => {
                    const options = ['1', '-1', 'i', '-i', '0'];
                    return options[this.rInt(0, options.length - 1)];
                }
            );
            
            return {
                tex: `i^{${p.exp}}`,
                instruction: "Simplify",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `i¹ = i, i² = -1, i³ = -i, i⁴ = 1, and the pattern repeats. So i^${p.exp} = ${p.result}.`,
                calc: false
            };
        }
    },
    
    // Advanced Calculus (Level 20-21)
    getAdvancedCalculus: function() {
        const questionType = this.rInt(1, 4);
        
        if (questionType === 1) {
            // Chain rule: d/dx[f(g(x))]
            const a = this.rInt(2, 5);
            const b = this.rInt(1, 6);
            const n = this.rInt(2, 4);
            
            return {
                tex: this.toUnicodeFunction(`f(x) = (${a}x + ${b})^${n}`),
                instruction: this.toUnicodeFunction("Find f'(x) using chain rule"),
                displayAnswer: `${n * a}(${a}x + ${b})^{${n - 1}}`,
                distractors: [
                    `${n}(${a}x + ${b})^{${n - 1}}`,
                    `${a}(${a}x + ${b})^{${n - 1}}`,
                    `${n * a}x^{${n - 1}}`
                ],
                explanation: `Chain rule: d/dx[(ax+b)^n] = n(ax+b)^(n-1) × a. So derivative = ${n}(${a}x + ${b})^${n - 1} × ${a} = ${n * a}(${a}x + ${b})^${n - 1}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Product rule: d/dx[f(x)g(x)]
            const a = this.rInt(2, 5);
            const b = this.rInt(1, 4);
            
            return {
                tex: this.toUnicodeFunction(`f(x) = x \\cdot ${a}x^${b}`),
                instruction: this.toUnicodeFunction("Find f'(x) using product rule"),
                displayAnswer: `${(b + 1) * a}x^{${b}}`,
                distractors: [
                    `${a * b}x^{${b - 1}}`,
                    `${a}x^{${b}}`,
                    `${a}x^{${b + 1}}`
                ],
                explanation: this.toUnicodeFunction(`Product rule: (uv)' = u'v + uv'. Here u = x, v = ${a}x^${b}. So (x)(${a * b}x^${b - 1}) + (1)(${a}x^${b}) = ${(b + 1) * a}x^${b}.`),
                calc: false
            };
        } else if (questionType === 3) {
            // Quotient rule hint or second derivative
            const a = this.rInt(2, 5);
            const n = this.rInt(2, 4);
            const firstDeriv = a * n;
            const secondDeriv = a * n * (n - 1);
            
            return {
                tex: this.toUnicodeFunction(`f(x) = ${a}x^${n}`),
                instruction: this.toUnicodeFunction("Find the second derivative f''(x)"),
                displayAnswer: `${secondDeriv}x^{${n - 2}}`,
                distractors: [
                    `${firstDeriv}x^{${n - 1}}`,
                    `${a * n * n}x^{${n - 2}}`,
                    `${secondDeriv}x^{${n - 1}}`
                ],
                explanation: this.toUnicodeFunction(`First derivative: f'(x) = ${firstDeriv}x^${n - 1}. Second derivative: f''(x) = ${firstDeriv}(${n - 1})x^${n - 2} = ${secondDeriv}x^${n - 2}.`),
                calc: false
            };
        } else {
            // Critical points: f'(x) = 0
            const a = this.rInt(1, 3);
            const root = this.rInt(2, 5);
            const b = -2 * a * root;
            
            return {
                tex: this.toUnicodeFunction(`f'(x) = ${a}x ${b >= 0 ? '+' : ''}${b} = 0`),
                instruction: this.toUnicodeFunction("Find critical point (where f'(x) = 0)"),
                displayAnswer: `x = ${root}`,
                distractors: [
                    `x = ${-root}`,
                    `x = ${b / a}`,
                    `x = 0`
                ],
                explanation: `Set derivative to zero: ${a}x + ${b} = 0. Solve: ${a}x = ${-b}, so x = ${root}. This is a critical point (potential max/min).`,
                calc: false
            };
        }
    },
    
    // Statistics (Level 21-22)
    getStatistics: function() {
        const questionType = this.rInt(1, 4);
        
        if (questionType === 1) {
            // Mean
            const data = [this.rInt(10, 20), this.rInt(15, 25), this.rInt(20, 30), this.rInt(10, 25)];
            const sum = data.reduce((a, b) => a + b, 0);
            const mean = sum / data.length;
            
            return {
                tex: `\\text{Data: } ${data.join(', ')}`,
                instruction: "Find the mean",
                displayAnswer: `${mean}`,
                distractors: [
                    `${Math.max(...data)}`,
                    `${data[Math.floor(data.length / 2)]}`,
                    `${mean + 1}`
                ],
                explanation: `Mean = sum/count = (${data.join(' + ')})/${data.length} = ${sum}/${data.length} = ${mean}.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Median
            const data = [12, 15, 18, 20, 25].sort((a, b) => a - b);
            const median = data[Math.floor(data.length / 2)];
            
            return {
                tex: `\\text{Data: } ${data.join(', ')}`,
                instruction: "Find the median",
                displayAnswer: `${median}`,
                distractors: [
                    `${data[0]}`,
                    `${data[data.length - 1]}`,
                    `${(data[0] + data[data.length - 1]) / 2}`
                ],
                explanation: `Median is the middle value in sorted data. Since we have ${data.length} values, the median is the ${Math.floor(data.length / 2) + 1}th value: ${median}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Mode
            const mode = this.rInt(15, 25);
            const data = [mode, this.rInt(10, 14), mode, this.rInt(26, 30), mode];
            
            return {
                tex: `\\text{Data: } ${data.join(', ')}`,
                instruction: "Find the mode",
                displayAnswer: `${mode}`,
                distractors: [
                    `${data[1]}`,
                    `${data[3]}`,
                    `\\text{no mode}`
                ],
                explanation: `Mode is the most frequent value. ${mode} appears ${data.filter(x => x === mode).length} times, more than any other value.`,
                calc: false
            };
        } else {
            // Range
            const min = this.rInt(10, 20);
            const max = this.rInt(40, 60);
            const data = [min, this.rInt(min + 5, max - 5), max];
            const range = max - min;
            
            return {
                tex: `\\text{Data: } ${data.join(', ')}`,
                instruction: "Find the range",
                displayAnswer: `${range}`,
                distractors: [
                    `${max}`,
                    `${min}`,
                    `${(max + min) / 2}`
                ],
                explanation: `Range = maximum - minimum = ${max} - ${min} = ${range}.`,
                calc: false
            };
        }
    },
    
    // Advanced Probability (Level 23-24)
    getAdvancedProbability: function() {
        const questionType = this.rInt(1, 3);
        
        if (questionType === 1) {
            // Conditional probability
            const total = 100;
            const eventA = this.rInt(40, 60);
            const both = this.rInt(15, Math.min(30, eventA));
            const correctAnswer = `${(both / eventA).toFixed(2)}`;
            
            const candidateDistractors = [
                `${(both / total).toFixed(2)}`,
                `${(eventA / total).toFixed(2)}`,
                `${((eventA - both) / total).toFixed(2)}`
            ];
            
            // Use fraction-aware deduplication for decimal probabilities
            const distractors = this.ensureUniqueDistractorsFractionAware(
                correctAnswer,
                candidateDistractors,
                () => (Math.random() * 0.9 + 0.1).toFixed(2)
            );
            
            return {
                tex: `P(A) = ${eventA / total}, P(A \\cap B) = ${both / total}`,
                instruction: "Find P(B|A) = P(A∩B)/P(A)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Conditional probability: P(B|A) = P(A∩B)/P(A) = ${both / total}/${eventA / total} = ${both}/${eventA} ≈ ${(both / eventA).toFixed(2)}.`,
                calc: true
            };
        } else if (questionType === 2) {
            // Independent events: P(A and B) = P(A) × P(B)
            const pA = [0.3, 0.4, 0.5, 0.6][this.rInt(0, 3)];
            const pB = [0.2, 0.3, 0.5][this.rInt(0, 2)];
            const pBoth = pA * pB;
            const correctAnswer = `${pBoth}`;
            
            const candidateDistractors = [
                `${pA + pB}`,
                `${pA}`,
                `${pB}`
            ];
            
            // Use fraction-aware deduplication
            const distractors = this.ensureUniqueDistractorsFractionAware(
                correctAnswer,
                candidateDistractors,
                () => (Math.random() * 0.9 + 0.1).toFixed(2)
            );
            
            return {
                tex: `\\text{If A and B are independent: } P(A) = ${pA}, P(B) = ${pB}`,
                instruction: "Find P(A and B)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `For independent events: P(A and B) = P(A) × P(B) = ${pA} × ${pB} = ${pBoth}.`,
                calc: false
            };
        } else {
            // Expected value
            const outcomes = [1, 2, 3, 4, 5, 6];
            const probs = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
            const ev = outcomes.reduce((sum, val, i) => sum + val * probs[i], 0);
            const correctAnswer = `${ev.toFixed(1)}`;
            
            const candidateDistractors = [
                `${3}`,
                `${4}`,
                `${6}`
            ];
            
            // Use fraction-aware deduplication
            const distractors = this.ensureUniqueDistractorsFractionAware(
                correctAnswer,
                candidateDistractors,
                () => `${this.rInt(1, 10)}`
            );
            
            return {
                tex: `\\text{Fair die: outcomes 1-6, each with P = 1/6}`,
                instruction: "Find expected value E(X)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `E(X) = Σ(x × P(x)) = 1(1/6) + 2(1/6) + ... + 6(1/6) = (1+2+3+4+5+6)/6 = 21/6 = ${ev.toFixed(1)}.`,
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
                displayAnswer: `\\text{Combining two quantities to find the total}`,
                distractors: [
                    `\\text{Taking away one number from another}`,
                    `\\text{Repeated multiplication}`,
                    `\\text{Splitting into equal groups}`
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
                displayAnswer: `\\text{Because } ${n} \\times ${n} = ${square}`,
                distractors: [
                    `\\text{Because } ${square} \\div 2 = ${square / 2}`,
                    `\\text{Because we reverse the addition}`,
                    `\\text{Because } ${n} + ${n} = ${n * 2}`
                ],
                explanation: `The square root undoes squaring. Since ${n}² = ${square}, we have $\\sqrt{${square}} = ${n}$.`,
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
                displayAnswer: `\\text{Adding } ${a} \\text{ to itself } ${b} \\text{ times (or } ${b} \\text{ to itself } ${a} \\text{ times)}`,
                distractors: [
                    `\\text{Combining two numbers}`,
                    `\\text{Taking } ${a} \\text{ away from } ${b}`,
                    `\\text{Dividing } ${a} \\text{ by } ${b}`
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
                displayAnswer: `\\text{To isolate } x \\text{ by canceling out the coefficient}`,
                distractors: [
                    `\\text{To make the equation simpler}`,
                    `\\text{To get rid of the equals sign}`,
                    `\\text{Because division is the opposite of addition}`
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
                    displayAnswer: `\\text{Because we have to distribute the outer term to each inner term}`,
                    distractors: [
                        `\\text{To make the expression longer}`,
                        `\\text{Because we can't have brackets in the final answer}`,
                        `\\text{To combine like terms}`
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
                    displayAnswer: `\\text{Because when we expand brackets, we use FOIL which creates these relationships}`,
                    distractors: [
                        `\\text{Because that's just the rule for factorising}`,
                        `\\text{To make the numbers smaller}`,
                        `\\text{Because we need to cancel out terms}`
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
                displayAnswer: `\\text{To isolate the term with } x \\text{ before dealing with the coefficient}`,
                distractors: [
                    `\\text{Because subtraction is easier than division}`,
                    `\\text{To make both sides equal}`,
                    `\\text{Because we always do subtraction first}`
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
                displayAnswer: `\\text{Because both positive and negative numbers give the same result when squared}`,
                distractors: [
                    `\\text{To have two answers for a quadratic}`,
                    `\\text{Because square roots are always positive and negative}`,
                    `\\text{To make the equation balanced}`
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
                    tex: this.toUnicodeFunction(`f(x) = ${a}x \\\\[0.5em] f(${x}) = ${result}`),
                    instruction: this.toUnicodeFunction("What does f(" + x + ") mean?"),
                    displayAnswer: `\\text{Substitute } ${x} \\text{ for } x \\text{ in the function definition}`,
                    distractors: [
                        `\\text{Multiply } f \\text{ by } ${x}`,
                        `\\text{Add } ${x} \\text{ to the function}`,
                        `\\text{Divide } f \\text{ by } ${x}`
                    ],
                    explanation: this.toUnicodeFunction(`f(${x}) means substitute x = ${x} into the function: f(${x}) = ${a}(${x}) = ${result}.`),
                    calc: false
                });
            } else {
                // Trigonometry
                whyQuestions.push({
                    type: 'why',
                    tex: `\\sin(30°) = \\frac{1}{2}`,
                    instruction: "Why should we memorize standard angle values?",
                    displayAnswer: `\\text{They appear frequently and help solve problems quickly}`,
                    distractors: [
                        `\\text{Because calculators don't have these values}`,
                        `\\text{To make tests harder}`,
                        `\\text{Because they're the only correct answers}`
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
                tex: this.toUnicodeFunction(`f(x) = ${a}x^{${n}} \\\\[0.5em] \\text{Step: } f'(x) = ${a*n}x^{${n-1}}`),
                instruction: "Why do we multiply by the power and reduce the power by 1?",
                displayAnswer: `\\text{This is the power rule: bring down the exponent and reduce it by 1}`,
                distractors: [
                    `\\text{To make the derivative smaller}`,
                    `\\text{Because that's how we reverse integration}`,
                    `\\text{To find the slope at a specific point}`
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
                displayAnswer: `\\text{Because one of the outcomes must happen (certainty)}`,
                distractors: [
                    `\\text{Because probabilities are always positive}`,
                    `\\text{To keep the math simple}`,
                    `\\text{Because we're adding two fractions}`
                ],
                explanation: `The event either happens or it doesn't. These are the only possibilities, so their probabilities sum to 1 (certainty).`,
                calc: false
            });
        }
        
        // Level 11+: Advanced topics
        if (band > 10 && band <= 15) {
            const topics = [
                {
                    type: 'why',
                    tex: `\\log(ab) = \\log(a) + \\log(b)`,
                    instruction: "Why does this logarithm property work?",
                    displayAnswer: `\\text{Because logarithms convert multiplication into addition}`,
                    distractors: [
                        `\\text{Because logs always add together}`,
                        `\\text{To make calculations easier}`,
                        `\\text{Because } a \\text{ and } b \\text{ are multiplied}`
                    ],
                    explanation: `This is the product rule for logarithms. It works because if log(a) = x and log(b) = y, then a = 10^x and b = 10^y, so ab = 10^x × 10^y = 10^(x+y), meaning log(ab) = x + y = log(a) + log(b).`,
                    calc: false
                },
                {
                    type: 'why',
                    tex: `\\text{Arithmetic series: } S_n = \\frac{n(a_1 + a_n)}{2}`,
                    instruction: "Why do we use (first + last) / 2?",
                    displayAnswer: `\\text{Because the average of all terms equals the average of first and last}`,
                    distractors: [
                        `\\text{To make the formula symmetric}`,
                        `\\text{Because that's how series always work}`,
                        `\\text{To simplify the calculation}`
                    ],
                    explanation: `In an arithmetic sequence, pairs of terms equidistant from the ends sum to the same value (a₁ + aₙ). The sum is n times this average value divided by 2.`,
                    calc: false
                }
            ];
            whyQuestions.push(topics[this.rInt(0, topics.length - 1)]);
        }
        
        // Level 15+: Trigonometry and Vectors
        if (band > 15 && band <= 19) {
            const topics = [
                {
                    type: 'why',
                    tex: `\\sin^2\\theta + \\cos^2\\theta = 1`,
                    instruction: "Why is this identity always true?",
                    displayAnswer: `\\text{Because it comes from the Pythagorean theorem on the unit circle}`,
                    distractors: [
                        `\\text{Because sine and cosine are inverse functions}`,
                        `\\text{Because angles are measured in radians}`,
                        `\\text{Because trigonometric functions are periodic}`
                    ],
                    explanation: `On the unit circle, the point (cos θ, sin θ) is at distance 1 from the origin. By Pythagorean theorem: (cos θ)² + (sin θ)² = 1².`,
                    calc: false
                },
                {
                    type: 'why',
                    tex: `\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta`,
                    instruction: "What does the dot product measure?",
                    displayAnswer: `\\text{The product of magnitudes times the cosine of the angle between vectors}`,
                    distractors: [
                        `\\text{The sum of vector components}`,
                        `\\text{The area between two vectors}`,
                        `\\text{The perpendicular distance}`
                    ],
                    explanation: `The dot product measures how much two vectors point in the same direction. When θ = 0° (same direction), cos θ = 1 and we get maximum value. When θ = 90° (perpendicular), cos θ = 0.`,
                    calc: false
                }
            ];
            whyQuestions.push(topics[this.rInt(0, topics.length - 1)]);
        }
        
        // Level 19+: Calculus and Statistics
        if (band > 19) {
            const topics = [
                {
                    type: 'why',
                    tex: this.toUnicodeFunction(`\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)`),
                    instruction: this.toUnicodeFunction("Why do we multiply by g'(x) in the chain rule?"),
                    displayAnswer: `\\text{Because we need to account for how fast the inner function is changing}`,
                    distractors: [
                        `\\text{To make the derivative correct}`,
                        `\\text{Because that's the product rule}`,
                        `\\text{To simplify the calculation}`
                    ],
                    explanation: this.toUnicodeFunction(`The chain rule accounts for nested rates of change. If y changes with u, and u changes with x, then dy/dx = (dy/du) × (du/dx). We multiply the outer derivative by the inner derivative.`),
                    calc: false
                },
                {
                    type: 'why',
                    tex: (() => {
                        const n = this.rInt(2, 4);
                        return `\\int x^${n} \\, dx = \\frac{x^{${n + 1}}}{${n + 1}} + C`;
                    })(),
                    instruction: "Why do we add a constant C when integrating?",
                    displayAnswer: `\\text{Because the derivative of a constant is zero, so any constant could have been there}`,
                    distractors: [
                        `\\text{To make the answer look complete}`,
                        `\\text{Because integration always adds 1}`,
                        `\\text{To balance the equation}`
                    ],
                    explanation: `When we differentiate, constants disappear (d/dx[C] = 0). So when we integrate, we must account for any constant that was lost. We write "+ C" to represent this unknown constant.`,
                    calc: false
                }
            ];
            whyQuestions.push(topics[this.rInt(0, topics.length - 1)]);
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
            displayAnswer: `\\text{To isolate } x \\text{ by canceling out the coefficient}`,
            distractors: [
                `\\text{To make the equation simpler}`,
                `\\text{To get rid of the equals sign}`,
                `\\text{Because division is the opposite of addition}`
            ],
            explanation: `We divide both sides by 2 to isolate x. This cancels the coefficient 2 on the left side, leaving just x.`,
            calc: false
        };
    }
};
