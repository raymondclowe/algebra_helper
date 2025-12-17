// Fixing Habits Questions - Targeted reinforcement for common student mistakes
// This module provides question types that address specific recurring errors
// Enhanced to integrate with paper homework pattern analysis

window.FixingHabitsQuestions = {
    
    // Check if a Fixing Habits question should be inserted
    shouldInsertFixingHabitsQuestion: async function() {
        // Only insert in learning/drill mode
        if (window.APP.mode !== 'learning' && window.APP.mode !== 'drill') {
            return false;
        }
        
        // Check in-app error tracker for immediate errors
        const errorTracker = window.APP.errorTracker;
        const hasSignificantInAppErrors = Object.values(errorTracker).some(count => count >= FIXING_HABITS_MIN_ERRORS);
        
        // Also check paper homework patterns for persistent mistakes
        let hasPersistentMistakes = false;
        if (window.PatternAnalysis) {
            try {
                const patterns = await window.PatternAnalysis.analyzeAllPatterns();
                hasPersistentMistakes = patterns && patterns.persistentMistakes && patterns.persistentMistakes.length > 0;
            } catch (error) {
                console.error('Error checking paper homework patterns:', error);
            }
        }
        
        if (!hasSignificantInAppErrors && !hasPersistentMistakes) {
            return false;
        }
        
        // Random insertion based on configured rate
        return Math.random() < FIXING_HABITS_INSERTION_RATE;
    },
    
    // Select which Fixing Habits question to show based on error frequency
    getFixingHabitsQuestion: async function() {
        const errorTracker = window.APP.errorTracker;
        
        // Find the most frequent error type from in-app tracker
        let maxErrors = 0;
        let errorType = null;
        
        for (const [type, count] of Object.entries(errorTracker)) {
            if (count > maxErrors && count >= FIXING_HABITS_MIN_ERRORS) {
                maxErrors = count;
                errorType = type;
            }
        }
        
        // Also check paper homework patterns for high-priority errors
        if (window.PatternAnalysis) {
            try {
                const recommendations = await window.PatternAnalysis.getRecommendations();
                const habitRecommendations = recommendations.filter(r => r.type === 'habit');
                
                // If there's a high-priority habit recommendation, prioritize it
                if (habitRecommendations.length > 0 && habitRecommendations[0].priority >= maxErrors) {
                    errorType = habitRecommendations[0].errorType;
                }
            } catch (error) {
                console.error('Error getting paper homework recommendations:', error);
            }
        }
        
        // Generate question based on error type
        switch (errorType) {
            case 'squareRootSign':
                return this.getSquareRootSignQuestion();
            case 'divisionByZero':
                return this.getDivisionByZeroQuestion();
            case 'signError':
                return this.getSignErrorQuestion();
            case 'fractionSimplification':
                return this.getFractionSimplificationQuestion();
            case 'orderOfOperations':
                return this.getOrderOfOperationsQuestion();
            default:
                // Fallback to a general habit question
                return this.getSquareRootSignQuestion();
        }
    },
    
    // Question Type 1: Square Root Sign Reminder (± notation)
    getSquareRootSignQuestion: function() {
        const a = window.Generator.rInt(2, 9);
        const x = window.Generator.rInt(2, 9);
        const xSquared = x * x;
        
        // Correct answer includes ± notation
        const correctAnswer = `x = \\pm ${x}`;
        
        // Common mistakes as distractors
        const distractors = [
            `x = ${x}`,              // Forgot negative root (only positive)
            `x = -${x}`,             // Forgot positive root (only negative)
            `x = ${x} \\text{ or } x = -${x}` // Correct values but verbose notation (not using ±)
        ];
        
        return {
            tex: `x^2 = ${xSquared}`,
            instruction: "Solve for x (select the most complete answer)",
            displayAnswer: correctAnswer,
            distractors: distractors,
            explanation: `When solving x² = ${xSquared}, we must remember that squaring either a positive or negative number gives a positive result. Therefore, x could be either +${x} or -${x}. The most concise way to write this is x = ±${x}. This is a common mistake: forgetting that square roots have both positive and negative solutions.`,
            calc: false,
            type: 'fixing-habits',
            habitType: 'squareRootSign',
            topic: 'Fixing Habits',
            questionLevel: FIXING_HABITS_CATEGORY
        };
    },
    
    // Question Type 2: Division by Zero Warning
    getDivisionByZeroQuestion: function() {
        const a = window.Generator.rInt(2, 9);
        const b = window.Generator.rInt(1, 5);
        
        // Expression that would involve division by zero when x = 0
        const expression = `\\frac{${a}x + ${b}}{x}`;
        
        // Correct answer recognizes the issue
        const correctAnswer = `Undefined (division by zero when x = 0)`;
        
        // Common mistakes as distractors
        const distractors = [
            `${a}x + ${b}`,              // Ignored the denominator issue
            `${a} + \\frac{${b}}{x}`,    // Attempted invalid simplification
            `\\frac{${a}x + ${b}}{1}`    // Incorrectly "simplified" denominator
        ];
        
        return {
            tex: `\\text{Simplify: } ${expression}`,
            instruction: "What is the simplified form?",
            displayAnswer: correctAnswer,
            distractors: distractors,
            explanation: `This expression has a denominator of x, which equals zero when x = 0. Any expression with a denominator that equals zero is undefined. We cannot divide by zero in mathematics. Always check denominators before attempting to simplify rational expressions - if the denominator can be zero for any value of the variable, the expression is undefined at that point.`,
            calc: false,
            type: 'fixing-habits',
            habitType: 'divisionByZero',
            topic: 'Fixing Habits',
            questionLevel: FIXING_HABITS_CATEGORY
        };
    },
    
    // Record when a fixing habits question is answered
    recordFixingHabitsAnswer: function(habitType, isCorrect) {
        if (isCorrect) {
            // Reduce error count when student gets the habit question right
            if (window.APP.errorTracker[habitType] > 0) {
                window.APP.errorTracker[habitType] = Math.max(0, window.APP.errorTracker[habitType] - 1);
            }
        }
    },
    
    // Question Type 3: Sign Error Reminder
    getSignErrorQuestion: function() {
        const a = window.Generator.rInt(2, 9);
        const b = window.Generator.rInt(2, 9);
        const negB = -b;
        
        const correctAnswer = `${a - b}`;
        
        const distractors = [
            `${a + b}`,               // Added instead of subtracting
            `${-(a - b)}`,            // Got the sign backwards
            `${b - a}`                // Reversed the order
        ];
        
        return {
            tex: `${a} - ${b}`,
            instruction: "Calculate the result (watch your signs!)",
            displayAnswer: correctAnswer,
            distractors: distractors,
            explanation: `When subtracting ${b} from ${a}, we get ${a - b}. A common mistake is mixing up signs or reversing the order. Remember: subtraction is not commutative (a - b ≠ b - a). Always pay careful attention to positive and negative signs.`,
            calc: false,
            type: 'fixing-habits',
            habitType: 'signError',
            topic: 'Fixing Habits',
            questionLevel: FIXING_HABITS_CATEGORY
        };
    },
    
    // Question Type 4: Fraction Simplification
    getFractionSimplificationQuestion: function() {
        const gcd = window.Generator.rInt(2, 6);
        const a = gcd * window.Generator.rInt(2, 5);
        const b = gcd * window.Generator.rInt(2, 5);
        const simplified = `\\frac{${a / gcd}}{${b / gcd}}`;
        
        const correctAnswer = simplified;
        
        const distractors = [
            `\\frac{${a}}{${b}}`,           // Not simplified
            `\\frac{${a / 2}}{${b / 2}}`,   // Partially simplified
            `${a / b}`                       // Decimal (not simplified fraction)
        ];
        
        return {
            tex: `\\frac{${a}}{${b}}`,
            instruction: "Simplify this fraction to lowest terms",
            displayAnswer: correctAnswer,
            distractors: distractors,
            explanation: `To simplify $\\frac{${a}}{${b}}$, we find the greatest common divisor (GCD) of ${a} and ${b}, which is ${gcd}. Dividing both numerator and denominator by ${gcd} gives us ${simplified}. Always simplify fractions to lowest terms by dividing by the GCD.`,
            calc: false,
            type: 'fixing-habits',
            habitType: 'fractionSimplification',
            topic: 'Fixing Habits',
            questionLevel: FIXING_HABITS_CATEGORY
        };
    },
    
    // Question Type 5: Order of Operations (PEMDAS)
    getOrderOfOperationsQuestion: function() {
        const a = window.Generator.rInt(2, 5);
        const b = window.Generator.rInt(2, 5);
        const c = window.Generator.rInt(2, 5);
        
        const correct = a + b * c;
        
        const correctAnswer = `${correct}`;
        
        const distractors = [
            `${(a + b) * c}`,          // Did addition first (wrong order)
            `${a * b + c}`,            // Wrong grouping
            `${a + (b + c)}`           // Added everything
        ];
        
        return {
            tex: `${a} + ${b} \\times ${c}`,
            instruction: "Calculate using correct order of operations (PEMDAS)",
            displayAnswer: correctAnswer,
            distractors: distractors,
            explanation: `Following PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction), we first multiply ${b} × ${c} = ${b * c}, then add ${a} to get ${correct}. A common mistake is doing operations left-to-right without following the order of operations. Always multiply and divide before adding and subtracting (unless parentheses indicate otherwise).`,
            calc: false,
            type: 'fixing-habits',
            habitType: 'orderOfOperations',
            topic: 'Fixing Habits',
            questionLevel: FIXING_HABITS_CATEGORY
        };
    }
};
