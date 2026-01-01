/**
 * Tests to verify answer buttons convert simple LaTeX to Unicode
 * This ensures that \times and \div appear as × and ÷ in answer buttons
 */

const puppeteer = require('puppeteer');

const timeout = 15000;
const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';

describe('Answer Button LaTeX Processing Tests', () => {
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

    test('Answer buttons convert \\times to × symbol', async () => {
        // Switch to learning mode and create a test question with \times in answers
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            
            // Create a test question with \times in displayAnswer
            window.APP.currentQ = {
                type: 'basic',
                tex: '2 \\times 3',
                instruction: 'Calculate',
                displayAnswer: 'N = (2 \\times 3 \\times 5 \\times 7) + 1',
                distractors: [
                    'N = 2 \\times 3',
                    'N = 5 \\times 7',
                    'N = 11 \\times 13'
                ],
                explanation: 'Test explanation',
                calc: false,
                level: 5.0
            };
            
            // Render buttons
            window.Learning.setupUI();
        });
        
        // Wait for buttons to render
        await page.waitForSelector('#mc-options button', { timeout: 5000 });
        
        // Wait for MathJax to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check button text content
        const buttonTexts = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            const texts = [];
            
            buttons.forEach(button => {
                // Skip "I don't know" button
                if (button.dataset.dontKnow === 'true') return;
                
                texts.push(button.textContent || button.innerText);
            });
            
            return texts;
        });
        
        // All button texts should contain × (Unicode) not \times (LaTeX)
        // At least one button should have the × symbol
        const hasUnicodeSymbol = buttonTexts.some(text => text.includes('×'));
        expect(hasUnicodeSymbol).toBe(true);
        
        // None should contain raw LaTeX
        buttonTexts.forEach(text => {
            expect(text).not.toContain('\\times');
        });
    });

    test('Answer buttons convert \\div to ÷ symbol', async () => {
        // Switch to learning mode and create a test question with \div in answers
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            
            // Create a test question with \div in displayAnswer
            window.APP.currentQ = {
                type: 'basic',
                tex: '10 \\div 2',
                instruction: 'Calculate',
                displayAnswer: 'Calculate 10 \\div 2 first',
                distractors: [
                    'Calculate 20 \\div 4',
                    'Calculate 15 \\div 3',
                    'Calculate 8 \\div 2'
                ],
                explanation: 'Test explanation',
                calc: false,
                level: 5.0
            };
            
            // Render buttons
            window.Learning.setupUI();
        });
        
        // Wait for buttons to render
        await page.waitForSelector('#mc-options button', { timeout: 5000 });
        
        // Wait for MathJax to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check button text content
        const buttonTexts = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            const texts = [];
            
            buttons.forEach(button => {
                // Skip "I don't know" button
                if (button.dataset.dontKnow === 'true') return;
                
                texts.push(button.textContent || button.innerText);
            });
            
            return texts;
        });
        
        // All button texts should contain ÷ (Unicode) not \div (LaTeX)
        // At least one button should have the ÷ symbol
        const hasUnicodeSymbol = buttonTexts.some(text => text.includes('÷'));
        expect(hasUnicodeSymbol).toBe(true);
        
        // None should contain raw LaTeX
        buttonTexts.forEach(text => {
            expect(text).not.toContain('\\div');
        });
    });

    test('Answer buttons with complex LaTeX use MathJax rendering', async () => {
        // Switch to learning mode with complex LaTeX that should use MathJax
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            
            // Create a test question with complex LaTeX that should be rendered by MathJax
            window.APP.currentQ = {
                type: 'basic',
                tex: '\\int x^2 dx',
                instruction: 'Calculate',
                displayAnswer: '\\frac{x^3}{3} + C',
                distractors: [
                    '\\frac{x^2}{2} + C',
                    'x^3 + C',
                    '3x^2 + C'
                ],
                explanation: 'Test explanation',
                calc: false,
                level: 5.0
            };
            
            // Render buttons
            window.Learning.setupUI();
        });
        
        // Wait for buttons to render
        await page.waitForSelector('#mc-options button', { timeout: 5000 });
        
        // Wait for MathJax to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check that MathJax rendered the content
        const hasMathJax = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            let foundMathJax = false;
            
            buttons.forEach(button => {
                if (button.dataset.dontKnow === 'true') return;
                
                // Check for MathJax container
                if (button.querySelector('mjx-container')) {
                    foundMathJax = true;
                }
            });
            
            return foundMathJax;
        });
        
        expect(hasMathJax).toBe(true);
    });

    test('Answer buttons convert \\% to % symbol', async () => {
        // Switch to learning mode and create a test question with \% in answers
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            
            // Create a test question with \% in displayAnswer
            window.APP.currentQ = {
                type: 'basic',
                tex: '0.1',
                instruction: 'Convert to percentage',
                displayAnswer: '10\\% of total',
                distractors: [
                    '20\\% of total',
                    '5\\% of total',
                    '15\\% of total'
                ],
                explanation: 'Test explanation',
                calc: false,
                level: 5.0
            };
            
            // Render buttons
            window.Learning.setupUI();
        });
        
        // Wait for buttons to render
        await page.waitForSelector('#mc-options button', { timeout: 5000 });
        
        // Wait for MathJax to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check button text content
        const buttonTexts = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            const texts = [];
            
            buttons.forEach(button => {
                // Skip "I don't know" button
                if (button.dataset.dontKnow === 'true') return;
                
                texts.push(button.textContent || button.innerText);
            });
            
            return texts;
        });
        
        // At least one button should have the % symbol
        const hasPercentSymbol = buttonTexts.some(text => text.includes('%'));
        expect(hasPercentSymbol).toBe(true);
        
        // None should contain raw LaTeX with backslash
        buttonTexts.forEach(text => {
            expect(text).not.toContain('\\%');
        });
    });
});
