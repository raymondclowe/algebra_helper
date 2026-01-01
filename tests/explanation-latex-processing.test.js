/**
 * Tests to verify explanation text LaTeX processing
 * This ensures that explanations with LaTeX are properly rendered or converted to Unicode
 */

const puppeteer = require('puppeteer');

const timeout = 15000;
const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';

describe('Explanation LaTeX Processing Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }, timeout);

    afterAll(async () => {
        await browser.close();
    }, timeout);

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: timeout
        });
        
        // Wait for MathJax and app to initialize
        await page.waitForFunction(
            () => window.MathJax && window.MathJax.typesetPromise && window.GeneratorUtils,
            { timeout: timeout }
        );
    });

    afterEach(async () => {
        await page.close();
    });

    test('processExplanationText converts simple LaTeX to Unicode', async () => {
        const result = await page.evaluate(() => {
            return window.GeneratorUtils.processExplanationText('Multiply 5 \\times 3 and divide by 2');
        });
        
        expect(result).toBe('Multiply 5 × 3 and divide by 2');
    });

    test('processExplanationText handles division symbol', async () => {
        const result = await page.evaluate(() => {
            return window.GeneratorUtils.processExplanationText('Calculate 10 \\div 2');
        });
        
        expect(result).toBe('Calculate 10 ÷ 2');
    });

    test('processExplanationText wraps complex LaTeX in delimiters', async () => {
        const result = await page.evaluate(() => {
            return window.GeneratorUtils.processExplanationText('The result is \\sqrt{25}');
        });
        
        expect(result).toBe('$The result is \\sqrt{25}$');
    });

    test('processExplanationText leaves text with $ delimiters unchanged', async () => {
        const input = 'The modulus is $\\sqrt{a^2 + b^2}$';
        const result = await page.evaluate((text) => {
            return window.GeneratorUtils.processExplanationText(text);
        }, input);
        
        expect(result).toBe(input);
    });

    test('processExplanationText handles plain text with Unicode', async () => {
        const input = 'Multiply 5 × 3 and you get 15';
        const result = await page.evaluate((text) => {
            return window.GeneratorUtils.processExplanationText(text);
        }, input);
        
        expect(result).toBe(input);
    });

    test('processExplanationText converts multiple simple LaTeX symbols', async () => {
        const result = await page.evaluate(() => {
            return window.GeneratorUtils.processExplanationText('Use \\pm and \\times with \\leq');
        });
        
        expect(result).toBe('Use ± and × with ≤');
    });

    test('Explanation modal processes LaTeX in explanations', async () => {
        // Wait for app to be ready
        await page.waitForFunction(
            () => window.APP && window.APP.currentQ,
            { timeout: 5000 }
        );

        // Inject a test explanation with LaTeX
        await page.evaluate(() => {
            window.ExplanationModal.show('Calculate 10 \\times 5 to get 50', false);
        });

        // Wait for modal to appear
        await page.waitForSelector('#explanation-modal:not(.hidden)', { timeout: 2000 });

        // Get the displayed text
        const modalText = await page.evaluate(() => {
            return document.getElementById('explanation-modal-text').textContent;
        });

        // Should have Unicode multiplication symbol
        expect(modalText).toContain('×');
        expect(modalText).not.toContain('\\times');
    });

    test('Explanation modal handles complex LaTeX with MathJax', async () => {
        // Wait for app to be ready
        await page.waitForFunction(
            () => window.APP && window.APP.currentQ,
            { timeout: 5000 }
        );

        // Inject a test explanation with complex LaTeX
        await page.evaluate(() => {
            window.ExplanationModal.show('The modulus is $\\sqrt{a^2 + b^2}$', false);
        });

        // Wait for modal to appear
        await page.waitForSelector('#explanation-modal:not(.hidden)', { timeout: 2000 });

        // Wait for MathJax to render by checking for the presence of MathJax elements
        await page.waitForFunction(() => {
            const modalText = document.getElementById('explanation-modal-text');
            // Either MathJax has rendered, or there's no math to render
            return modalText && (modalText.querySelector('mjx-container') !== null || !modalText.textContent.includes('\\'));
        }, { timeout: 3000 });

        // Check if MathJax rendered the content
        const hasMathJax = await page.evaluate(() => {
            const modalText = document.getElementById('explanation-modal-text');
            return modalText.querySelector('mjx-container') !== null;
        });

        expect(hasMathJax).toBe(true);
    });

    test('Detailed explanation processes basic explanation correctly', async () => {
        // Wait for app to be ready
        await page.waitForFunction(
            () => window.APP && window.APP.currentQ,
            { timeout: 5000 }
        );

        // Create a test question with LaTeX in explanation
        const detailedHtml = await page.evaluate(() => {
            const testQuestion = {
                explanation: 'Multiply 3 \\times 4 to get 12',
                instruction: 'Calculate',
                tex: '3 \\times 4',
                displayAnswer: '12'
            };
            return window.ExplanationModal.generateDetailedExplanation(testQuestion);
        });

        // The detailed HTML should contain the Unicode multiplication symbol in the explanation text
        expect(detailedHtml).toContain('Multiply 3 × 4 to get 12');
        // The Expression field with \(...\) delimiters should preserve LaTeX
        expect(detailedHtml).toContain('\\(3 \\times 4\\)');
    });
});
