/**
 * Tests for validation issue fixes
 * Verifies that the fixes for reported validation issues are working correctly
 */

const puppeteer = require('puppeteer');

describe('Validation Issue Fixes', () => {
    let browser;
    let page;
    const BASE_URL = 'file://' + require('path').resolve(__dirname, '..', 'algebra-helper.html');

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(BASE_URL, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for scripts to load
        await page.waitForFunction(
            () => window.Generator && window.QuestionTemplates,
            { timeout: 10000 }
        );
    });

    afterEach(async () => {
        await page.close();
    });

    // Test that testing mode disables spaced repetition
    describe('Testing Mode - Spaced Repetition', () => {
        test('should not apply spaced repetition when TESTING_MODE is true', async () => {
            const allSameLevel = await page.evaluate(() => {
                // Set up testing mode
                window.TESTING_MODE = true;
                window.APP = { mode: 'learning' };
                
                // Call selectQuestionLevel multiple times and verify it always returns the same level
                const targetLevel = 15;
                const results = [];
                for (let i = 0; i < 100; i++) {
                    const level = window.Generator.selectQuestionLevel(targetLevel);
                    results.push(level);
                }
                
                // All results should equal targetLevel (no spaced repetition)
                return results.every(l => l === targetLevel);
            });
            
            expect(allSameLevel).toBe(true);
        });
        
        test('should apply spaced repetition when TESTING_MODE is false', async () => {
            const hasVariation = await page.evaluate(() => {
                // Set up learning mode without testing
                window.TESTING_MODE = false;
                window.APP = { mode: 'learning' };
                
                // Call selectQuestionLevel many times
                const targetLevel = 15;
                const results = [];
                for (let i = 0; i < 1000; i++) {
                    const level = window.Generator.selectQuestionLevel(targetLevel);
                    results.push(level);
                }
                
                // At least some results should be lower than targetLevel (spaced repetition working)
                const lowerLevels = results.filter(l => l < targetLevel);
                const percentLower = (lowerLevels.length / results.length) * 100;
                
                return {
                    hasLower: lowerLevels.length > 0,
                    percentLower: percentLower,
                    inRange: percentLower > 10 && percentLower < 25
                };
            });
            
            expect(hasVariation.hasLower).toBe(true);
            expect(hasVariation.inRange).toBe(true);
        });
    });
    
    // Test integration question mathematical correctness
    describe('Advanced Integration - Mathematical Correctness', () => {
        test('should generate correct answer for reverse chain rule integration', async () => {
            const isCorrect = await page.evaluate(() => {
                window.TESTING_MODE = true;
                window.FORCED_QUESTION_TYPE = 4; // Reverse chain rule type
                
                // Generate question
                const question = window.QuestionTemplates.AdvancedIntegration.getAdvancedIntegrationQuestion();
                
                // Extract coefficient from question tex
                // Format is: \int COEFFx(x^2 + 1)^N \, dx
                const match = question.tex.match(/\\int\s+(\d+)x\(x\^2\s*\+\s*1\)\^(\d+)/);
                if (!match) return false;
                
                const coefficient = parseInt(match[1]);
                const n = parseInt(match[2]);
                
                // Expected answer: coefficient / (2 * (n + 1))
                const expectedCoeff = coefficient / (2 * (n + 1));
                
                // Check if displayAnswer contains the correct coefficient
                return question.displayAnswer.includes(`${expectedCoeff}`) &&
                       question.displayAnswer.includes(`(x^2 + 1)^${n + 1}`);
            });
            
            expect(isCorrect).toBe(true);
        });
    });
    
    // Test standard normal distribution distractors
    describe('Probability Distributions - Standard Normal Distractors', () => {
        test('should not include "Normal distribution" or "Gaussian distribution" as distractors', async () => {
            const result = await page.evaluate(() => {
                window.TESTING_MODE = true;
                window.FORCED_QUESTION_TYPE = 5; // Standard normal question
                
                // Generate question
                const question = window.QuestionTemplates.ProbabilityDistributions.getProbabilityDistributionQuestion();
                
                const validDistractors = [
                    "Binomial distribution",
                    "Poisson distribution", 
                    "Uniform distribution",
                    "Exponential distribution",
                    "Chi-squared distribution",
                    "Student's t-distribution"
                ];
                
                return {
                    correctAnswer: question.displayAnswer,
                    hasNormal: question.distractors.includes("Normal distribution"),
                    hasGaussian: question.distractors.includes("Gaussian distribution"),
                    allValid: question.distractors.every(d => validDistractors.includes(d))
                };
            });
            
            expect(result.correctAnswer).toBe("Standard normal distribution");
            expect(result.hasNormal).toBe(false);
            expect(result.hasGaussian).toBe(false);
            expect(result.allValid).toBe(true);
        });
    });
    
    // Test that generators produce correct questions for their levels
    describe('Generator Level Correctness', () => {
        test('Level 2 should only generate powers and roots questions', async () => {
            const allCorrect = await page.evaluate(() => {
                window.TESTING_MODE = true;
                
                for (let type = 1; type <= 6; type++) {
                    window.FORCED_QUESTION_TYPE = type;
                    const question = window.QuestionTemplates.SquaresRoots.getSquaresAndRoots();
                    
                    // Should contain power/root related content
                    const isPowerOrRoot = 
                        question.tex.includes('^') || 
                        question.tex.includes('\\sqrt') ||
                        question.tex.includes('square') ||
                        question.tex.includes('cube');
                        
                    if (!isPowerOrRoot) return false;
                    
                    // Should NOT contain simple addition/subtraction
                    const isAddition = question.tex.match(/\?\s*\+\s*\d+\s*=\s*\d+/);
                    if (isAddition) return false;
                }
                
                return true;
            });
            
            expect(allCorrect).toBe(true);
        });
        
        test('Level 4 (Fractions) should not generate power questions', async () => {
            const allCorrect = await page.evaluate(() => {
                window.TESTING_MODE = true;
                
                for (let type = 1; type <= 5; type++) {
                    window.FORCED_QUESTION_TYPE = type;
                    const question = window.QuestionTemplates.Fractions.getFractions();
                    
                    // Should contain fraction notation
                    if (!question.tex.includes('\\frac')) return false;
                    
                    // Should NOT contain power notation like "What is 3^2?"
                    const isPowerQuestion = question.tex.match(/\\text\{What is \}\s*\d+\^/);
                    if (isPowerQuestion) return false;
                }
                
                return true;
            });
            
            expect(allCorrect).toBe(true);
        });
    });
});
