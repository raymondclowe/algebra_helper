const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Inverse Quadratic Function Tests', () => {
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
        await wait(1000);
    });

    afterEach(async () => {
        await page.close();
    });

    test('Helper function evaluateExpression works correctly', async () => {
        const result = await page.evaluate(() => {
            const gen = window.Generator;
            // Test basic expression evaluation
            const val1 = gen.evaluateExpression('x^2', 3);
            const val2 = gen.evaluateExpression('x**2', 3);
            const val3 = gen.evaluateExpression('\\sqrt{x}', 16);
            return { val1, val2, val3 };
        });

        expect(result.val1).toBe(9);
        expect(result.val2).toBe(9);
        expect(result.val3).toBe(4);
    });

    test('Helper function areEquivalent detects equivalent expressions', async () => {
        const result = await page.evaluate(() => {
            const gen = window.Generator;
            // Test equivalence detection
            const eq1 = gen.areEquivalent('x^2', 'x**2');
            const eq2 = gen.areEquivalent('\\sqrt{x/4}', '\\sqrt{x}/2');
            const eq3 = gen.areEquivalent('x^2', 'x'); // Should be false
            return { eq1, eq2, eq3 };
        });

        expect(result.eq1).toBe(true);
        expect(result.eq2).toBe(true);
        expect(result.eq3).toBe(false);
    });

    test('getInverseQuadraticQuestion generates valid question structure', async () => {
        const question = await page.evaluate(() => {
            return window.Generator.getInverseQuadraticQuestion();
        });

        expect(question).toBeDefined();
        expect(question.tex).toMatch(/f\(x\) = \d+x\^2/);
        expect(question.instruction).toContain('f^{-1}(x)');
        expect(question.displayAnswer).toBeDefined();
        expect(question.displayAnswer).toMatch(/y = /);
        expect(Array.isArray(question.distractors)).toBe(true);
        expect(question.distractors.length).toBe(3);
        expect(question.explanation).toBeDefined();
        expect(question.calc).toBe(false);
    });

    test('getInverseQuadraticQuestion generates different correct formats', async () => {
        const formats = await page.evaluate(() => {
            const gen = window.Generator;
            const answers = new Set();
            // Generate multiple questions to see different formats
            for (let i = 0; i < 20; i++) {
                const q = gen.getInverseQuadraticQuestion();
                answers.add(q.displayAnswer);
            }
            return Array.from(answers);
        });

        // Should have at least 2 different formats (due to randomization)
        expect(formats.length).toBeGreaterThanOrEqual(2);
    });

    test('Inverse quadratic distractors are not equivalent to correct answer', async () => {
        const result = await page.evaluate(() => {
            const gen = window.Generator;
            const q = gen.getInverseQuadraticQuestion();
            
            // Check each distractor is not equivalent to the correct answer
            const notEquivalent = q.distractors.map(dist => 
                !gen.areEquivalent(q.displayAnswer, dist)
            );
            
            return {
                allNotEquivalent: notEquivalent.every(v => v === true),
                distractors: q.distractors,
                correctAnswer: q.displayAnswer
            };
        });

        expect(result.allNotEquivalent).toBe(true);
    });

    test('Level 5 questions include inverse quadratic questions', async () => {
        const hasInverseQuestion = await page.evaluate(() => {
            const gen = window.Generator;
            let foundInverse = false;
            
            // Generate many level 20 questions to find an inverse one
            // Level 20 maps to lvl5() which includes inverse quadratic questions
            for (let i = 0; i < 50; i++) {
                const q = gen.getQuestion(20);
                if (q.instruction && q.instruction.includes('f^{-1}')) {
                    foundInverse = true;
                    break;
                }
            }
            
            return foundInverse;
        });

        expect(hasInverseQuestion).toBe(true);
    });

    test('Inverse quadratic question renders in UI correctly', async () => {
        // Switch to drill mode and set to level 20
        await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 20;
        });

        // Wait for MathJax
        await page.waitForFunction(
            () => window.MathJax && window.MathJax.typesetPromise,
            { timeout: 15000 }
        );

        // Generate questions until we get an inverse one
        let foundInverse = false;
        for (let i = 0; i < 30; i++) {
            await page.evaluate(() => {
                window.UI.nextQuestion();
            });
            await wait(500);

            const instruction = await page.$eval('#instruction-text', el => el.textContent);
            if (instruction.includes('f^{-1}') || instruction.includes('inverse')) {
                foundInverse = true;
                
                // Verify the question is displayed
                const questionText = await page.$eval('#question-math', el => el.innerHTML);
                expect(questionText).toBeTruthy();
                
                // Verify options are rendered
                const options = await page.$$('#mc-options button');
                expect(options.length).toBe(5); // 1 correct + 3 distractors + "I don't know"
                
                break;
            }
        }

        // Should have found at least one inverse question
        expect(foundInverse).toBe(true);
    });
});
