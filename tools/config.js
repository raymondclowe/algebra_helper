/**
 * Configuration management for question validation tool
 */
require('dotenv').config();

class Config {
    constructor() {
        // API Configuration
        this.apiKey = process.env.OPENROUTER_API_KEY || process.env.COPILOT_OPENROUTER_API_KEY;
        this.openRouterApiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.modelName = 'google/gemini-3-pro-preview';
        
        // Validation Configuration
        this.levelsToTest = this.generateLevelsToTest();
        this.outputDir = './validation-output';
        this.issuesDir = './validation-issues';
        this.screenshotsDir = './validation-output/screenshots';
        this.responsesDir = './validation-output/responses'; // Store AI responses for cross-checking
        
        // Question Generation Configuration
        this.questionsPerLevel = 2; // Generate multiple questions per level for thorough testing
        
        // App URL for live testing (uses local file for accurate rendering)
        this.appUrl = 'file://' + require('path').resolve(__dirname, '..', 'algebra-helper.html');
        
        // Prompt Configuration
        this.validationPrompt = this.getValidationPrompt();
    }
    
    /**
     * Generate level bands to test all question types
     * Based on topic-definitions.js mapping
     * Each level includes the number of question types available
     */
    generateLevelsToTest() {
        return [
            { level: 1, name: "Basic Arithmetic", questionTypes: 4 },
            { level: 2, name: "Powers and Roots", questionTypes: 6 },
            { level: 3, name: "Multiplication and Division", questionTypes: 5 },
            { level: 4, name: "Fractions", questionTypes: 5 },
            { level: 5, name: "Decimals & Percentages", questionTypes: 4 },
            { level: 6, name: "Simple Linear Equations", questionTypes: 2 },
            { level: 7, name: "Two-Step Equations", questionTypes: 2 },
            { level: 8, name: "Inequalities", questionTypes: 3 },
            { level: 9, name: "Expanding Expressions", questionTypes: 2 },
            { level: 10, name: "Factorising Quadratics", questionTypes: 2 },
            { level: 11, name: "Quadratic Equations", questionTypes: 3 },
            { level: 12, name: "Polynomials", questionTypes: 3 },
            { level: 13, name: "Exponentials & Logarithms", questionTypes: 4 },
            { level: 14, name: "Sequences & Series", questionTypes: 4 },
            { level: 15, name: "Functions", questionTypes: 3 },
            { level: 16, name: "Basic Trigonometry", questionTypes: 3 },
            { level: 17, name: "Advanced Trigonometry", questionTypes: 4 },
            { level: 18, name: "Vectors", questionTypes: 4 },
            { level: 19, name: "Complex Numbers", questionTypes: 4 },
            { level: 20, name: "Basic Differentiation", questionTypes: 2 },
            { level: 21, name: "Advanced Calculus", questionTypes: 4 },
            { level: 22, name: "Statistics", questionTypes: 4 },
            { level: 23, name: "Basic Probability", questionTypes: 3 },
            { level: 24, name: "Advanced Probability", questionTypes: 3 },
            { level: 25, name: "Integration & Series", questionTypes: 3 },
            // Advanced HL Topics
            { level: 26, name: "Proof by Induction", questionTypes: 1 },
            { level: 27, name: "Proof by Contradiction", questionTypes: 1 },
            { level: 28, name: "Matrix Algebra", questionTypes: 6 },
            { level: 29, name: "3D Vectors", questionTypes: 5 },
            { level: 30, name: "Complex Numbers (Polar)", questionTypes: 5 },
            { level: 31, name: "Advanced Integration", questionTypes: 4 },
            { level: 32, name: "Differential Equations", questionTypes: 4 },
            { level: 33, name: "Probability Distributions", questionTypes: 6 },
            { level: 34, name: "Hypothesis Testing", questionTypes: 6 }
        ];
    }
    
    /**
     * Get the validation prompt for Gemini 3 Pro
     */
    getValidationPrompt() {
        return `You are reviewing an automatically generated mathematics question for an educational application called "Algebra Helper".

Your task is to verify if the question is:
1. Mathematically correct and accurate
2. Appropriate for the stated difficulty level
3. Clear and unambiguous in its wording
4. Has a correct answer that is actually correct
5. Has plausible distractors (incorrect answers) that are genuinely incorrect
6. Free from mathematical errors or confusing notation

IMPORTANT - Response Format:
- If the question is VALID and has NO problems: Reply with ONLY the single word "OK" and nothing else.
- If the question has ANY issues: Reply with "not OK" on the first line, then explain in detail what is wrong, how to fix it, and provide the correct approach or solution.

Context:
- This is an IB Math curriculum aligned practice tool
- Questions use LaTeX math notation for maths
- May have graphs for charting questions
- Multiple choice format with one correct answer and 3 distractors
- Questions should be solvable within 30-60 seconds by a student at the appropriate level
- "Levels" in this app are internal gamification "levels" and are not related to IB or academic or education levels.

Review the question screenshot carefully and provide your assessment.`;
    }
    
    /**
     * Validate configuration is ready
     */
    validate() {
        const errors = [];
        
        if (!this.apiKey) {
            errors.push('Missing API key: Set OPENROUTER_API_KEY or COPILOT_OPENROUTER_API_KEY in .env file');
        }
        
        if (this.modelName !== 'google/gemini-3-pro-preview') {
            errors.push(`Invalid model name: Must use google/gemini-3-pro-preview, got ${this.modelName}`);
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}

module.exports = new Config();
