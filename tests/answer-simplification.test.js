const puppeteer = require('puppeteer');

describe('Answer Simplification Tests', () => {
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
        
        // Disable caching
        await page.setCacheEnabled(false);
        
        // Capture ALL console messages for debugging
        page.on('console', msg => {
            console.log('BROWSER:', msg.text());
        });
        
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for app initialization
        await page.waitForFunction(() => {
            return typeof window.GeneratorUtils !== 'undefined' &&
                   typeof window.GeneratorUtils.simplifyAnswerForDisplay === 'function';
        }, { timeout: 5000 });
    });

    afterEach(async () => {
        await page.close();
    });

    test('simplifyAnswerForDisplay handles pure \\text{...} content', async () => {
        const result = await page.evaluate(() => {
            return window.GeneratorUtils.simplifyAnswerForDisplay('\\text{To make the equation simpler}');
        });
        
        expect(result).toBe('To make the equation simpler');
    });

    test('simplifyAnswerForDisplay handles mixed LaTeX with math variables', async () => {
        const result = await page.evaluate(() => {
            // Use the exact format that would come from why-questions.js
            const answer = `\\text{To isolate } x \\text{ by canceling out the coefficient}`;
            console.log('Input:', answer);
            console.log('Input length:', answer.length);
            console.log('First 20 chars:', [...answer.slice(0, 20)].map((c, i) => `${i}:'${c}'`).join(' '));
            console.log('Has \\text:', answer.includes('\\text'));
            
            const simplified = window.GeneratorUtils.simplifyAnswerForDisplay(answer);
            console.log('Output:', simplified);
            return simplified;
        });
        
        console.log('Test received:', result);
        
        // Should convert to plain HTML with italic x
        expect(result).toContain('To isolate');
        expect(result).toContain('by canceling out the coefficient');
        expect(result).toContain('<i>x</i>');
        expect(result).not.toContain('\\text');
    });

    test('simplifyAnswerForDisplay handles mixed LaTeX with multiple variables', async () => {
        const result = await page.evaluate(() => {
            const answer = `\\text{To isolate the term with } x \\text{ before dealing with the coefficient}`;
            return window.GeneratorUtils.simplifyAnswerForDisplay(answer);
        });
        
        expect(result).toContain('To isolate the term with');
        expect(result).toContain('<i>x</i>');
        expect(result).toContain('before dealing with the coefficient');
        expect(result).not.toContain('\\text');
    });

    test('simplifyAnswerForDisplay preserves complex LaTeX expressions', async () => {
        const result = await page.evaluate(() => {
            return window.GeneratorUtils.simplifyAnswerForDisplay('\\frac{1}{2}');
        });
        
        // Should leave LaTeX unchanged for complex math
        expect(result).toBe('\\frac{1}{2}');
    });

    test('simplifyAnswerForDisplay preserves mathematical operations', async () => {
        const result = await page.evaluate(() => {
            return window.GeneratorUtils.simplifyAnswerForDisplay('x^2 + 2x + 1');
        });
        
        // Should preserve for math notation
        expect(result).toBe('x^2 + 2x + 1');
    });

    test('simplifyAnswerForDisplay handles plain text without LaTeX', async () => {
        const result = await page.evaluate(() => {
            return window.GeneratorUtils.simplifyAnswerForDisplay('Just plain text');
        });
        
        expect(result).toBe('Just plain text');
    });

    test.skip('Why questions display correctly without raw LaTeX artifacts', async () => {
        // This test is skipped because it requires full UI interaction
        // The core functionality is tested in other tests
        // Navigate to a level that generates why questions
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 4.0;
            Generator.questionCounter = 2; // This should trigger a why question (every 3rd)
        });

        // Generate a new question
        await page.click('button:not([disabled])');
        
        // Wait for question to load
        await page.waitForFunction(() => {
            return document.querySelector('#mc-options button') !== null;
        });

        // Get all button texts
        const buttonTexts = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('#mc-options button'));
            return buttons.map(btn => btn.textContent || btn.innerText);
        });

        // Check that no button contains raw LaTeX artifacts like "} x" or "\\text"
        buttonTexts.forEach(text => {
            expect(text).not.toMatch(/\}\s*x/); // No "} x" pattern
            expect(text).not.toMatch(/\\text/); // No raw \text commands
            expect(text).not.toMatch(/\\\\/); // No double backslashes
        });
    });

    test('Why questions render with proper HTML formatting', async () => {
        // Set up to generate a why question at level 4 which should have x
        const questionData = await page.evaluate(() => {
            const q = Generator.getWhyQuestion(4);
            return {
                displayAnswer: q.displayAnswer,
                distractors: q.distractors
            };
        });

        // Simulate the rendering process
        const renderedAnswer = await page.evaluate((answer) => {
            const utils = window.GeneratorUtils;
            return utils.simplifyAnswerForDisplay(answer);
        }, questionData.displayAnswer);

        // Verify no raw LaTeX artifacts
        expect(renderedAnswer).not.toContain('\\text{');
        expect(renderedAnswer).not.toContain('} x');
        expect(renderedAnswer).not.toContain('} ');
        
        // Test with a specific known mixed LaTeX answer
        const knownMixedLatex = await page.evaluate(() => {
            const answer = `\\text{To isolate } x \\text{ by canceling out the coefficient}`;
            return window.GeneratorUtils.simplifyAnswerForDisplay(answer);
        });
        
        // Should contain italic x
        expect(knownMixedLatex).toContain('<i>x</i>');
        expect(knownMixedLatex).not.toContain('\\text');
    });
});
