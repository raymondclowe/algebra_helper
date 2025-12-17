// Fixing Habits Questions - Targeted reinforcement for common student mistakes
// This module provides question types that address specific recurring errors

window.FixingHabitsQuestions = {
    
    // Check if a Fixing Habits question should be inserted
    shouldInsertFixingHabitsQuestion: function() {
        // Only insert in learning/drill mode
        if (window.APP.mode !== 'learning' && window.APP.mode !== 'drill') {
            return false;
        }
        
        // Check if any error type has sufficient errors
        const errorTracker = window.APP.errorTracker;
        const hasSignificantErrors = Object.values(errorTracker).some(count => count >= FIXING_HABITS_MIN_ERRORS);
        
        if (!hasSignificantErrors) {
            return false;
        }
        
        // Random insertion based on configured rate
        return Math.random() < FIXING_HABITS_INSERTION_RATE;
    },
    
    // Select which Fixing Habits question to show based on error frequency
    getFixingHabitsQuestion: function() {
        const errorTracker = window.APP.errorTracker;
        
        // Find the most frequent error type
        let maxErrors = 0;
        let errorType = null;
        
        for (const [type, count] of Object.entries(errorTracker)) {
            if (count > maxErrors && count >= FIXING_HABITS_MIN_ERRORS) {
                maxErrors = count;
                errorType = type;
            }
        }
        
        // Generate question based on error type
        switch (errorType) {
            case 'squareRootSign':
                return this.getSquareRootSignQuestion();
            case 'divisionByZero':
                return this.getDivisionByZeroQuestion();
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
    }
};
