// --- GENERATOR UTILITIES ---
// Shared utility functions and constants for all question templates
window.GeneratorUtils = {
    rInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Constants for expression evaluation
    EQUIVALENCE_TOLERANCE: 0.0001,
    EQUIVALENCE_TEST_VALUES: [1, 2, 4, 9, 16],
    FALLBACK_DISTRACTOR_MAX_COEFFICIENT: 20, // Max coefficient for fallback distractors
    
    // Helper function to convert function notation to unicode mathematical italic characters
    // For LaTeX/MathJax content (tex, explanation) - preserves superscript notation
    // U+1D453 = 𝑓 (Mathematical Italic Small F)
    // U+1D454 = 𝑔 (Mathematical Italic Small G)
    toUnicodeFunction: function(str) {
        // First, replace function names with Unicode mathematical italic characters
        // Use word boundaries to avoid replacing 'f' in words like 'for' or 'of'
        let result = str
            .replace(/\bf\(/g, '𝑓(')     // f( -> 𝑓(
            .replace(/\bf\^/g, '𝑓^')     // f^ -> 𝑓^ (preserve ^ for LaTeX)
            .replace(/\bf''/g, "𝑓''")   // f'' -> 𝑓'' (for second derivative notation)
            .replace(/\bf'/g, "𝑓'")     // f' -> 𝑓' (for derivative notation)
            .replace(/\bg\(/g, '𝑔(')     // g( -> 𝑔(
            .replace(/\bg\^/g, '𝑔^')     // g^ -> 𝑔^ (preserve ^ for LaTeX)
            .replace(/\bg''/g, "𝑔''")   // g'' -> 𝑔'' (for second derivative notation)
            .replace(/\bg'/g, "𝑔'");    // g' -> 𝑔' (for derivative notation)
        
        return result;
    },
    
    // Helper function for plain text instructions (not LaTeX)
    // Converts function notation AND LaTeX-style superscripts to Unicode
    // For instruction field - converts superscripts for display
    toUnicodePlainText: function(str) {
        // Map of superscript characters
        const superscripts = {
            '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
            '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
            '-': '⁻', '+': '⁺', '=': '⁼', '(': '⁽', ')': '⁾'
        };
        
        // First, replace function names with Unicode mathematical italic characters
        let result = str
            .replace(/\bf\(/g, '𝑓(')     // f( -> 𝑓(
            .replace(/\bf\^/g, '𝑓^')     // f^ -> 𝑓^ (before superscript conversion)
            .replace(/\bf''/g, "𝑓''")   // f'' -> 𝑓'' (for second derivative notation)
            .replace(/\bf'/g, "𝑓'")     // f' -> 𝑓' (for derivative notation)
            .replace(/\bg\(/g, '𝑔(')     // g( -> 𝑔(
            .replace(/\bg\^/g, '𝑔^')     // g^ -> 𝑔^ (before superscript conversion)
            .replace(/\bg''/g, "𝑔''")   // g'' -> 𝑔'' (for second derivative notation)
            .replace(/\bg'/g, "𝑔'");    // g' -> 𝑔' (for derivative notation)
        
        // Convert LaTeX-style superscripts: ^{...} or ^x to Unicode superscripts
        // Handle both ^{content} and ^x patterns
        result = result.replace(/\^{([^}]+)}/g, (match, content) => {
            return content.split('').map(char => superscripts[char] || char).join('');
        });
        result = result.replace(/\^([0-9\-\+])/g, (match, char) => {
            return superscripts[char] || match;
        });
        
        return result;
    },
    
    // Math helper functions for fractions
    gcd: (a, b) => b === 0 ? a : window.GeneratorUtils.gcd(b, a % b),
    lcm: (a, b) => (a * b) / window.GeneratorUtils.gcd(a, b),
    
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
    }
};
