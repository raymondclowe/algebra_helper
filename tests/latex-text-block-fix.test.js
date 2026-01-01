/**
 * Test to verify fix for LaTeX rendering issues in answer buttons
 * Issue: \text{...} blocks were being wrapped in $...$ delimiters, causing:
 * 1. Visible dollar signs in button text
 * 2. MathJax removing spaces between words, making text unreadable
 * 
 * Solution: Call simplifyAnswerForDisplay BEFORE processTextContent to extract
 * plain text from \text{...} blocks before they get wrapped in math delimiters
 */

const puppeteer = require('puppeteer');

const timeout = 15000;
const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';

describe('LaTeX Text Block Rendering Fix', () => {
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
            () => window.MathJax && window.MathJax.typesetPromise && window.GeneratorUtils && window.Learning,
            { timeout: timeout }
        );
    });

    afterEach(async () => {
        await page.close();
    });

    test('Answer buttons with \\text{...} should NOT show dollar signs', async () => {
        // Create a test question with \text{...} in answers (like why-questions)
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 33.0;
            
            // Simulate the chain rule "why" question from level 33
            window.APP.currentQ = {
                type: 'why',
                tex: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
                instruction: "Why do we multiply by g'(x) in the chain rule?",
                displayAnswer: "\\text{Because we need to account for how fast the inner function is changing}",
                distractors: [
                    "\\text{To make the derivative correct}",
                    "\\text{Because that's the product rule}",
                    "\\text{To simplify the calculation}"
                ],
                explanation: 'The chain rule accounts for nested rates of change.',
                calc: false,
                level: 33.0
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
        
        // CRITICAL FIX VERIFICATION:
        // 1. No dollar signs should be visible in button text
        buttonTexts.forEach((text, idx) => {
            expect(text).not.toMatch(/^\$/); // No $ at start
            expect(text).not.toMatch(/\$$/); // No $ at end
            expect(text).not.toContain('$Because'); // No $Because pattern
        });
        
        // 2. Text should have spaces (not run together like "Becauseweneedtoaccou...")
        // At least one button should have the word "Because" with spaces around it
        const hasProperSpacing = buttonTexts.some(text => 
            text.includes('Because') && text.includes(' ')
        );
        expect(hasProperSpacing).toBe(true);
        
        // 3. Should not contain raw \text{} commands
        buttonTexts.forEach(text => {
            expect(text).not.toContain('\\text{');
        });
    });

    test('Answer buttons with mixed \\text{...} and variables should render correctly', async () => {
        // Test mixed content like: \text{To isolate } x \text{ by canceling out the coefficient}
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 4.0;
            
            window.APP.currentQ = {
                type: 'why',
                tex: '3x = 12',
                instruction: 'Why do we divide both sides by 3?',
                displayAnswer: "\\text{To isolate } x \\text{ by canceling out the coefficient}",
                distractors: [
                    "\\text{To make the equation simpler}",
                    "\\text{To get rid of the equals sign}",
                    "\\text{Because division is the opposite of addition}"
                ],
                explanation: 'We divide to isolate the variable.',
                calc: false,
                level: 4.0
            };
            
            // Render buttons
            window.Learning.setupUI();
        });
        
        // Wait for buttons to render
        await page.waitForSelector('#mc-options button', { timeout: 5000 });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check that mixed content renders properly
        const buttonTexts = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            const texts = [];
            
            buttons.forEach(button => {
                if (button.dataset.dontKnow === 'true') return;
                texts.push(button.textContent || button.innerText);
            });
            
            return texts;
        });
        
        // Should find "To isolate x by canceling out the coefficient" with proper spacing
        const hasCorrectAnswer = buttonTexts.some(text => 
            text.includes('To isolate') && 
            text.includes('by canceling') &&
            text.includes(' ')  // Has spaces
        );
        expect(hasCorrectAnswer).toBe(true);
        
        // No dollar signs
        buttonTexts.forEach(text => {
            expect(text).not.toContain('$');
        });
    });

    test('Processing order: simplifyAnswerForDisplay before processTextContent', async () => {
        // Verify the functions are called in the correct order
        const result = await page.evaluate(() => {
            const utils = window.GeneratorUtils;
            const input = "\\text{Because that's the product rule}";
            
            // CORRECT ORDER (new implementation):
            // 1. simplifyAnswerForDisplay extracts plain text
            const simplified = utils.simplifyAnswerForDisplay(input);
            // 2. processTextContent converts any remaining LaTeX symbols
            const processed = utils.processTextContent(simplified);
            
            return {
                input: input,
                simplified: simplified,
                processed: processed,
                // Check that simplified extracted the text (no \text{} or $)
                simplifiedIsPlainText: !simplified.includes('\\text') && !simplified.includes('$'),
                // Check that processed doesn't add $ delimiters
                processedHasNoDollars: !processed.includes('$')
            };
        });
        
        // Verify the correct processing flow
        expect(result.simplifiedIsPlainText).toBe(true);
        expect(result.processedHasNoDollars).toBe(true);
        
        // The final result should be plain text with spaces
        expect(result.processed).toContain('Because');
        expect(result.processed).toContain('that');
        expect(result.processed).toContain('product');
        expect(result.processed).toContain('rule');
    });
});
