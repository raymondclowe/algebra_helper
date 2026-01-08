/**
 * Tests for Phase 1 Iteration 1 new question types:
 * - Financial Applications (Level 13-14)
 * - Parallel/Perpendicular Lines (Level 6-7)
 * - Quadratic Inequalities (Level 10-11)
 */

const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Phase 1 Iteration 1 - New Question Types', () => {
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
     * Test Financial Applications questions (Level 13-14)
     */
    describe('Financial Applications (Level 13-14)', () => {
        test('should generate financial application questions', async () => {
            // Generate multiple questions to test variety
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.QuestionTemplates.FinancialApplications.getFinancialApplications();
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
                expect(q.calc).toBe(true); // Financial questions should allow calculator
                
                // Check for unique answers
                const allAnswers = [q.answer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                expect(uniqueAnswers.size).toBe(4);
            });

            // Verify at least one question contains financial keywords
            const hasFinancialKeywords = questions.some(q => 
                q.tex.includes('invest') || 
                q.tex.includes('depreciat') ||
                q.tex.includes('population') ||
                q.tex.includes('half-life')
            );
            expect(hasFinancialKeywords).toBe(true);
        });
    });

    /**
     * Test Parallel/Perpendicular Lines questions (Level 6-7)
     */
    describe('Parallel/Perpendicular Lines (Level 6-7)', () => {
        test('should generate parallel/perpendicular lines questions', async () => {
            // Generate multiple questions to test variety
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.QuestionTemplates.Lines.getParallelPerpendicularLines();
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
                expect(q.calc).toBe(false); // Lines questions don't need calculator
                
                // Check for unique answers
                const allAnswers = [q.answer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                expect(uniqueAnswers.size).toBe(4);
            });

            // Verify at least one question contains line-related keywords
            const hasLineKeywords = questions.some(q => 
                q.tex.includes('parallel') || 
                q.tex.includes('perpendicular') ||
                q.tex.includes('gradient')
            );
            expect(hasLineKeywords).toBe(true);
        });
    });

    /**
     * Test Quadratic Inequalities questions (Level 10-11)
     */
    describe('Quadratic Inequalities (Level 10-11)', () => {
        test('should generate quadratic inequality questions', async () => {
            // Generate multiple questions to test variety
            const questions = await page.evaluate(() => {
                const results = [];
                for (let i = 0; i < 10; i++) {
                    const q = window.QuestionTemplates.QuadraticInequalities.getQuadraticInequalities();
                    results.push({
                        hasTex: !!q.tex,
                        hasAnswer: !!q.displayAnswer,
                        hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                        hasExplanation: !!q.explanation,
                        hasInstruction: !!q.instruction,
                        calc: q.calc,
                        tex: q.tex,
                        answer: q.displayAnswer,
                        distractors: q.distractors,
                        instruction: q.instruction
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
                expect(q.hasInstruction).toBe(true);
                expect(q.calc).toBe(false); // Quadratic inequalities don't need calculator
                expect(q.instruction).toContain('Solve');
                
                // Check for unique answers
                const allAnswers = [q.answer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                expect(uniqueAnswers.size).toBe(4);
            });

            // Verify questions contain inequality signs
            const hasInequalities = questions.every(q => 
                q.tex.includes('>') || q.tex.includes('<') || 
                q.tex.includes('≥') || q.tex.includes('≤') ||
                q.tex.includes('geq') || q.tex.includes('leq')
            );
            expect(hasInequalities).toBe(true);

            // Verify answers include inequality notation or "or"
            const answersHaveInequalities = questions.some(q => 
                q.answer.includes('<') || q.answer.includes('>') || 
                q.answer.includes('≤') || q.answer.includes('≥') ||
                q.answer.includes('or') || q.answer.includes('leq') || q.answer.includes('geq')
            );
            expect(answersHaveInequalities).toBe(true);
        });
    });

    /**
     * Integration test - verify generators work with main generator
     */
    describe('Integration Tests', () => {
        test('new question types integrate correctly with generator routing', async () => {
            // Test that the generator can call the new question types
            const results = await page.evaluate(() => {
                const testResults = {
                    level6_7: [],
                    level10_11: [],
                    level13_14: []
                };

                // Test level 6-7 (should sometimes get lines questions)
                for (let i = 0; i < 20; i++) {
                    const q = window.Generator.lvl2();
                    if (q && q.tex) {
                        testResults.level6_7.push({
                            isLinesQuestion: q.tex.includes('parallel') || q.tex.includes('perpendicular') || q.tex.includes('gradient')
                        });
                    }
                }

                // Test level 10-11 (should sometimes get quadratic inequality questions)
                for (let i = 0; i < 20; i++) {
                    const q = window.Generator.getQuadratics();
                    if (q && q.tex) {
                        testResults.level10_11.push({
                            isInequalityQuestion: q.tex.includes('>') || q.tex.includes('<') || q.tex.includes('geq') || q.tex.includes('leq')
                        });
                    }
                }

                // Test level 13-14 (should sometimes get financial questions)
                for (let i = 0; i < 20; i++) {
                    const q = window.Generator.getSequencesSeries();
                    if (q && q.tex) {
                        testResults.level13_14.push({
                            isFinancialQuestion: q.tex.includes('invest') || q.tex.includes('depreciat') || q.tex.includes('population')
                        });
                    }
                }

                return testResults;
            });

            // At least one lines question should appear at level 6-7
            const hasLinesQuestion = results.level6_7.some(r => r.isLinesQuestion);
            expect(hasLinesQuestion).toBe(true);

            // At least one inequality question should appear at level 10-11
            const hasInequalityQuestion = results.level10_11.some(r => r.isInequalityQuestion);
            expect(hasInequalityQuestion).toBe(true);

            // At least one financial question should appear at level 13-14
            const hasFinancialQuestion = results.level13_14.some(r => r.isFinancialQuestion);
            expect(hasFinancialQuestion).toBe(true);
        });
    });
});
