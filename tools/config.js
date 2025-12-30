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
        
        // Question Generation Configuration
        this.questionsPerLevel = 2; // Generate multiple questions per level for thorough testing
        
        // Prompt Configuration
        this.validationPrompt = this.getValidationPrompt();
    }
    
    /**
     * Generate level bands to test all question types
     * Based on topic-definitions.js mapping
     */
    generateLevelsToTest() {
        return [
            { level: 1, name: "Basic Arithmetic" },
            { level: 2, name: "Powers and Roots" },
            { level: 3, name: "Multiplication and Division" },
            { level: 4, name: "Fractions" },
            { level: 5, name: "Decimals & Percentages" },
            { level: 6, name: "Simple Linear Equations" },
            { level: 7, name: "Two-Step Equations" },
            { level: 8, name: "Inequalities" },
            { level: 9, name: "Expanding Expressions" },
            { level: 10, name: "Factorising Quadratics" },
            { level: 11, name: "Quadratic Equations" },
            { level: 12, name: "Polynomials" },
            { level: 13, name: "Exponentials & Logarithms" },
            { level: 14, name: "Sequences & Series" },
            { level: 15, name: "Functions" },
            { level: 16, name: "Basic Trigonometry" },
            { level: 17, name: "Advanced Trigonometry" },
            { level: 18, name: "Vectors" },
            { level: 19, name: "Complex Numbers" },
            { level: 20, name: "Basic Differentiation" },
            { level: 21, name: "Advanced Calculus" },
            { level: 22, name: "Statistics" },
            { level: 23, name: "Basic Probability" },
            { level: 24, name: "Advanced Probability" },
            { level: 25, name: "Integration & Series" }
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

If the question is VALID and CORRECT:
- Respond with "OK" or "VALID" (be very brief and concise)
- Optionally add a short note if you have minor suggestions

If the question has ISSUES or is INCORRECT:
- Clearly explain what is wrong (be detailed and specific)
- Provide the correct approach or solution
- Suggest how to fix the problem
- Be thorough in your explanation

Context:
- This is an IB Math curriculum aligned practice tool
- Questions use LaTeX math notation
- Multiple choice format with one correct answer and 3 distractors
- Questions should be solvable within 30-60 seconds by a student at the appropriate level

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
