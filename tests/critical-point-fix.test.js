const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Critical Point Question Fix', () => {
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
        await page.close();
    });

    test('Critical point question gives f(x) not f\'(x)', async () => {
        const results = await page.evaluate(() => {
            const questions = [];
            // Generate multiple critical point questions
            for (let i = 0; i < 20; i++) {
                const q = window.Generator.getAdvancedCalculus();
                // Check if it's the critical point type (4th question type)
                if (q.instruction && q.instruction.includes('critical point')) {
                    questions.push({
                        tex: q.tex,
                        instruction: q.instruction,
                        answer: q.displayAnswer,
                        hasFx: q.tex.includes('f(x)') || q.tex.includes('𝑓(x)'),
                        hasFPrimeInTex: q.tex.includes("f'(x)") || q.tex.includes("𝑓'(x)"),
                        explanation: q.explanation
                    });
                }
            }
            return questions;
        });

        // Should have found some critical point questions
        expect(results.length).toBeGreaterThan(0);

        // All critical point questions should present f(x), not f'(x) in the tex
        results.forEach(q => {
            expect(q.hasFx).toBe(true);
            expect(q.hasFPrimeInTex).toBe(false);
            expect(q.tex).toMatch(/[f𝑓]\(x\)\s*=/); // Should have f(x) or 𝑓(x) = ...
        });
    });

    test('Critical point answer is mathematically correct', async () => {
        const results = await page.evaluate(() => {
            const verifications = [];
            // Generate and verify multiple questions
            for (let i = 0; i < 50; i++) {
                const q = window.Generator.getAdvancedCalculus();
                
                // Only test critical point questions
                if (q.instruction && q.instruction.includes('critical point')) {
                    // Extract the answer (should be x = something)
                    const answerMatch = q.displayAnswer.match(/x = (\d+)/);
                    if (answerMatch) {
                        const expectedRoot = parseInt(answerMatch[1]);
                        
                        // Parse the derivative from the explanation
                        // Explanation should say "f'(x) = ax + b" or "𝑓'(x) = ax + b"
                        const derivMatch = q.explanation.match(/[f𝑓]'?\(x\)\s*=\s*(\d+)x\s*([+-]\s*\d+)/);
                        if (derivMatch) {
                            const a = parseInt(derivMatch[1]);
                            const bStr = derivMatch[2].replace(/\s/g, '');
                            const b = parseInt(bStr);
                            
                            // Verify: if f'(x) = ax + b = 0, then x = -b/a should equal expectedRoot
                            const calculatedRoot = -b / a;
                            
                            verifications.push({
                                a: a,
                                b: b,
                                expectedRoot: expectedRoot,
                                calculatedRoot: calculatedRoot,
                                isCorrect: Math.abs(calculatedRoot - expectedRoot) < 0.001,
                                tex: q.tex,
                                explanation: q.explanation,
                                answer: q.displayAnswer
                            });
                        }
                    }
                }
            }
            return verifications;
        });

        // Should have verified at least some questions
        expect(results.length).toBeGreaterThan(0);

        // All should be mathematically correct
        results.forEach(v => {
            expect(v.isCorrect).toBe(true);
            // Extra check: calculated root should exactly match expected
            expect(v.calculatedRoot).toBe(v.expectedRoot);
        });
    });

    test('Critical point question has correct structure', async () => {
        const question = await page.evaluate(() => {
            // Generate questions until we get a critical point one
            for (let i = 0; i < 30; i++) {
                const q = window.Generator.getAdvancedCalculus();
                if (q.instruction && q.instruction.includes('critical point')) {
                    return {
                        tex: q.tex,
                        instruction: q.instruction,
                        displayAnswer: q.displayAnswer,
                        distractors: q.distractors,
                        explanation: q.explanation,
                        hasX2Term: q.tex.includes('x^2') || q.tex.includes('x^{2}'),
                        hasLinearTerm: q.tex.match(/[+-]\d+x/) !== null,
                        hasConstant: true // Always has a constant
                    };
                }
            }
            return null;
        });

        expect(question).not.toBeNull();
        expect(question.hasX2Term).toBe(true); // Should have x^2 term
        expect(question.hasLinearTerm).toBe(true); // Should have linear term
        expect(question.distractors.length).toBe(3); // Should have 3 distractors
        expect(question.explanation).toMatch(/derivative/i); // Explanation should mention derivative
    });

    test('Critical point question requires differentiation', async () => {
        const question = await page.evaluate(() => {
            // Generate questions until we get a critical point one
            for (let i = 0; i < 30; i++) {
                const q = window.Generator.getAdvancedCalculus();
                if (q.instruction && q.instruction.includes('critical point')) {
                    return {
                        tex: q.tex,
                        instruction: q.instruction,
                        explanation: q.explanation
                    };
                }
            }
            return null;
        });

        expect(question).not.toBeNull();
        
        // Instruction should ask to find critical point of f(x) (including unicode version)
        expect(question.instruction.toLowerCase()).toContain('critical point');
        expect(question.instruction).toMatch(/[f𝑓]\(x\)/);
        
        // Explanation should mention finding the derivative first
        expect(question.explanation.toLowerCase()).toMatch(/first find|derivative/i);
        
        // The tex should present the original function f(x) or 𝑓(x), not the derivative
        expect(question.tex).toMatch(/[f𝑓]\(x\)\s*=/);
        expect(question.tex).not.toMatch(/[f𝑓]'\(x\)\s*=/);
    });
});
