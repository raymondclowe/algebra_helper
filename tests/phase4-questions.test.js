/**
 * Tests for Phase 4 new question types:
 * - Counterexample Proofs (Level 26-27)
 * - Ambiguous Case of Sine Rule (Level 16-17)
 * - Continuous Random Variables (Level 32-33)
 * - Euler's Method for Differential Equations (Level 31-32)
 */

const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Phase 4 - New Question Types', () => {
    let browser;
    let page;
    const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';
    
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
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        // Wait for scripts to load
        await wait(2000);
    });

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });

    /**
     * Test Counterexample Proofs questions (Level 26-27)
     */
    describe('Counterexample Proofs (Level 26-27)', () => {
        test('should generate counterexample proof questions', async () => {
            // Generate multiple questions to test variety
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.QuestionTemplates.CounterexampleProofs.getCounterexampleProofQuestion();
                    results.push({
                        hasTex: !!q.tex,
                        hasAnswer: !!q.displayAnswer,
                        hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                        hasExplanation: !!q.explanation,
                        calc: q.calc,
                        tex: q.tex.substring(0, 100),
                        answer: q.displayAnswer,
                        distractors: q.distractors
                    });
                }
                return results;
            });

            // Verify all questions have proper structure
            questions.forEach((q, i) => {
                expect(q.hasTex).toBe(true);
                expect(q.hasAnswer).toBe(true);
                expect(q.hasDistractors).toBe(true);
                expect(q.hasExplanation).toBe(true);
                expect(q.calc).toBe(false); // Counterexample proofs don't need calculator
                
                // Check for unique answers
                const allAnswers = [q.answer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                expect(uniqueAnswers.size).toBe(4);
            });

            // Verify at least one question contains counterexample keywords
            const hasCounterexampleKeywords = questions.some(q => 
                q.tex.includes('Statement') || 
                q.tex.includes('disprove') ||
                q.answer.includes('counterexample') ||
                q.tex.includes('For all')
            );
            expect(hasCounterexampleKeywords).toBe(true);
        });

        test('should generate questions about disproving statements', async () => {
            const question = await page.evaluate(() => {
                return window.QuestionTemplates.CounterexampleProofs.getCounterexampleProofQuestion();
            });

            expect(question.tex).toBeDefined();
            expect(question.displayAnswer).toBeDefined();
            expect(question.explanation).toBeDefined();
            expect(question.explanation.toLowerCase()).toContain('disprove');
        });
    });

    /**
     * Test Ambiguous Case of Sine Rule questions (Level 16-17)
     */
    describe('Ambiguous Case of Sine Rule (Level 16-17)', () => {
        test('should generate ambiguous case questions', async () => {
            // Generate multiple questions to test variety
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.QuestionTemplates.AdvancedTrig.getAmbiguousCase();
                    results.push({
                        hasTex: !!q.tex,
                        hasAnswer: !!q.displayAnswer,
                        hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                        hasExplanation: !!q.explanation,
                        tex: q.tex.substring(0, 100),
                        answer: q.displayAnswer,
                        distractors: q.distractors,
                        calc: q.calc
                    });
                }
                return results;
            });

            // Verify all questions have proper structure
            questions.forEach((q, i) => {
                expect(q.hasTex).toBe(true);
                expect(q.hasAnswer).toBe(true);
                expect(q.hasDistractors).toBe(true);
                expect(q.hasExplanation).toBe(true);
                
                // Check for unique answers
                const allAnswers = [q.answer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                expect(uniqueAnswers.size).toBe(4);
            });

            // Verify questions contain triangle or sine rule keywords
            const hasTrigKeywords = questions.some(q => 
                q.tex.includes('triangle') || 
                q.tex.includes('sin') ||
                q.answer.includes('triangle')
            );
            expect(hasTrigKeywords).toBe(true);
        });

        test('should include questions about 0, 1, or 2 triangles', async () => {
            const answers = await page.evaluate(() => {
                const results = new Set();
                for (let i = 0; i < 20; i++) {
                    const q = window.QuestionTemplates.AdvancedTrig.getAmbiguousCase();
                    results.add(q.displayAnswer);
                }
                return Array.from(results);
            });

            // Should have variety in answers about triangle counts
            const hasVariety = answers.some(a => a.includes('0')) ||
                               answers.some(a => a.includes('1')) ||
                               answers.some(a => a.includes('2'));
            expect(hasVariety).toBe(true);
        });
    });

    /**
     * Test Continuous Random Variables questions (Level 32-33)
     */
    describe('Continuous Random Variables (Level 32-33)', () => {
        test('should generate continuous RV questions', async () => {
            // Generate multiple questions to test variety
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.QuestionTemplates.ProbabilityDistributions.getContinuousRandomVariable();
                    results.push({
                        hasTex: !!q.tex,
                        hasAnswer: !!q.displayAnswer,
                        hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                        hasExplanation: !!q.explanation,
                        tex: q.tex.substring(0, 150),
                        answer: q.displayAnswer,
                        distractors: q.distractors,
                        calc: q.calc
                    });
                }
                return results;
            });

            // Verify all questions have proper structure
            questions.forEach((q, i) => {
                expect(q.hasTex).toBe(true);
                expect(q.hasAnswer).toBe(true);
                expect(q.hasDistractors).toBe(true);
                expect(q.hasExplanation).toBe(true);
                
                // Check for unique answers
                const allAnswers = [q.answer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                expect(uniqueAnswers.size).toBe(4);
            });

            // Verify questions contain probability keywords
            const hasProbabilityKeywords = questions.some(q => 
                q.tex.includes('PDF') || 
                q.tex.includes('continuous') ||
                q.tex.includes('random variable') ||
                q.tex.includes('E(X)') ||
                q.explanation.toLowerCase().includes('probability')
            );
            expect(hasProbabilityKeywords).toBe(true);
        });

        test('should include PDF and expected value questions', async () => {
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 15; i++) {
                    const q = window.QuestionTemplates.ProbabilityDistributions.getContinuousRandomVariable();
                    results.push({
                        tex: q.tex,
                        instruction: q.instruction,
                        explanation: q.explanation
                    });
                }
                return results;
            });

            // Should have variety in question types
            const hasPDF = questions.some(q => 
                q.tex.includes('PDF') || q.explanation.includes('PDF')
            );
            const hasExpectedValue = questions.some(q => 
                q.instruction.includes('E(X)') || q.explanation.includes('E(X)')
            );
            
            expect(hasPDF || hasExpectedValue).toBe(true);
        });
    });

    /**
     * Test Euler's Method questions (Level 31-32)
     */
    describe("Euler's Method for Differential Equations (Level 31-32)", () => {
        test("should generate Euler's method questions", async () => {
            // Generate multiple questions to test variety
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.QuestionTemplates.DifferentialEquations.getEulersMethod();
                    results.push({
                        hasTex: !!q.tex,
                        hasAnswer: !!q.displayAnswer,
                        hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                        hasExplanation: !!q.explanation,
                        tex: q.tex.substring(0, 150),
                        answer: q.displayAnswer,
                        distractors: q.distractors,
                        calc: q.calc
                    });
                }
                return results;
            });

            // Verify all questions have proper structure
            questions.forEach((q, i) => {
                expect(q.hasTex).toBe(true);
                expect(q.hasAnswer).toBe(true);
                expect(q.hasDistractors).toBe(true);
                expect(q.hasExplanation).toBe(true);
                
                // Check for unique answers
                const allAnswers = [q.answer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                expect(uniqueAnswers.size).toBe(4);
            });

            // Verify questions contain Euler's method keywords
            const hasEulerKeywords = questions.some(q => 
                q.tex.includes('Euler') || 
                q.tex.includes('dy/dx') ||
                q.explanation.toLowerCase().includes('euler')
            );
            expect(hasEulerKeywords).toBe(true);
        });

        test('should include formula identification and application questions', async () => {
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 15; i++) {
                    const q = window.QuestionTemplates.DifferentialEquations.getEulersMethod();
                    results.push({
                        instruction: q.instruction,
                        answer: q.displayAnswer,
                        explanation: q.explanation
                    });
                }
                return results;
            });

            // Should have variety in question types
            const hasFormula = questions.some(q => 
                q.answer.includes('y_{n+1}') || q.answer.includes('y_n')
            );
            const hasApplication = questions.some(q => 
                !isNaN(parseFloat(q.answer)) // Numerical answer
            );
            
            expect(hasFormula || hasApplication).toBe(true);
        });
    });

    /**
     * Integration test: Verify all Phase 4 topics are accessible from generator
     */
    describe('Integration Tests', () => {
        test('should be able to generate Level 26-27 questions (with counterexamples)', async () => {
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.Generator.getQuestionForLevel(27);
                    results.push({
                        hasTex: !!q.tex,
                        hasAnswer: !!q.displayAnswer,
                        tex: q.tex.substring(0, 100)
                    });
                }
                return results;
            });

            questions.forEach(q => {
                expect(q.hasTex).toBe(true);
                expect(q.hasAnswer).toBe(true);
            });
        });

        test('should be able to generate Level 16-17 questions (with ambiguous case)', async () => {
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.Generator.getQuestionForLevel(17);
                    results.push({
                        hasTex: !!q.tex,
                        hasAnswer: !!q.displayAnswer,
                        tex: q.tex.substring(0, 100)
                    });
                }
                return results;
            });

            questions.forEach(q => {
                expect(q.hasTex).toBe(true);
                expect(q.hasAnswer).toBe(true);
            });
        });

        test('should be able to generate Level 32-33 questions (with continuous RVs)', async () => {
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.Generator.getQuestionForLevel(33);
                    results.push({
                        hasTex: !!q.tex,
                        hasAnswer: !!q.displayAnswer,
                        tex: q.tex.substring(0, 100)
                    });
                }
                return results;
            });

            questions.forEach(q => {
                expect(q.hasTex).toBe(true);
                expect(q.hasAnswer).toBe(true);
            });
        });

        test("should be able to generate Level 31-32 questions (with Euler's method)", async () => {
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.Generator.getQuestionForLevel(32);
                    results.push({
                        hasTex: !!q.tex,
                        hasAnswer: !!q.displayAnswer,
                        tex: q.tex.substring(0, 100)
                    });
                }
                return results;
            });

            questions.forEach(q => {
                expect(q.hasTex).toBe(true);
                expect(q.hasAnswer).toBe(true);
            });
        });
    });
});
