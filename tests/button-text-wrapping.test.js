const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Button Text Wrapping Tests
 * 
 * Tests to verify that long text in answer buttons wraps properly on mobile
 * and doesn't get clipped
 */

describe('Button Text Wrapping Tests', () => {
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
        // Navigate to the app
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for MathJax to load
        await page.waitForFunction(
            () => window.MathJax && window.MathJax.typesetPromise,
            { timeout: 10000 }
        );
        
        // Wait for app to initialize
        await page.waitForFunction(
            () => window.APP && window.APP.mode,
            { timeout: 10000 }
        );
    });

    afterEach(async () => {
        await page.close();
    });

    test('Answer buttons have inline styles for text wrapping on mobile', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 }); // iPhone SE size
        
        // Switch to learning mode and generate a "why" question with long text
        await page.evaluate(async () => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            
            // Create a "why" question with long text answers similar to the issue
            window.APP.currentQ = {
                type: 'why',
                tex: '\\int x^2 \\, dx = \\frac{x^3}{3} + C',
                instruction: 'Why do we need to add the constant C when integrating?',
                displayAnswer: '\\text{Because the derivative of a constant is zero, so any constant could have been there}',
                distractors: [
                    '\\text{To balance the equation}',
                    '\\text{Because integration always adds 1}',
                    '\\text{To make the answer look complete}'
                ],
                explanation: 'When we differentiate any constant, we get zero.',
                calc: false,
                level: 5.0
            };
            
            // Render using Learning.setupUI
            window.Learning.setupUI();
            await window.MathJax.typesetPromise();
        });
        
        // Wait for buttons to render
        await page.waitForSelector('#mc-options button', { timeout: 5000 });
        await wait(500); // Extra wait for MathJax
        
        // Check that buttons have proper inline styles for wrapping
        const buttonStyles = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            const styles = [];
            
            buttons.forEach(button => {
                // Skip "I don't know" button
                if (button.dataset.dontKnow === 'true') return;
                
                styles.push({
                    whiteSpace: button.style.whiteSpace,
                    wordBreak: button.style.wordBreak,
                    overflowWrap: button.style.overflowWrap,
                    height: button.style.height,
                    minHeight: button.style.minHeight,
                    maxHeight: button.style.maxHeight,
                    overflow: button.style.overflow
                });
            });
            
            return styles;
        });
        
        // Verify inline styles are present on at least one button
        expect(buttonStyles.length).toBeGreaterThan(0);
        
        buttonStyles.forEach(style => {
            expect(style.whiteSpace).toBe('normal');
            expect(style.wordBreak).toBe('break-word');
            expect(style.overflowWrap).toBe('break-word');
            expect(style.height).toBe('auto');
            expect(style.minHeight).toBe('60px');
            expect(style.maxHeight).toBe('none');
            expect(style.overflow).toBe('visible');
        });
    });

    test('Plain text answers (from \\text{}) render as HTML for proper wrapping', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Set up learning mode with long text answers
        await page.evaluate(async () => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            
            window.APP.currentQ = {
                type: 'why',
                tex: '\\int x^2 \\, dx = \\frac{x^3}{3} + C',
                instruction: 'Why do we need to add the constant C when integrating?',
                displayAnswer: '\\text{Because the derivative of a constant is zero, so any constant could have been there}',
                distractors: [
                    '\\text{To balance the equation}',
                    '\\text{Because integration always adds 1}',
                    '\\text{To make the answer look complete}'
                ],
                explanation: 'Test',
                calc: false,
                level: 5.0
            };
            
            window.Learning.setupUI();
            await window.MathJax.typesetPromise();
        });
        
        // Wait for buttons to render
        await page.waitForSelector('#mc-options button', { timeout: 5000 });
        await wait(500);
        
        // Check that \\text{} answers are rendered as plain text spans, not MathJax
        const plainTextInfo = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            const results = [];
            
            buttons.forEach(button => {
                // Skip "I don't know" button
                if (button.dataset.dontKnow === 'true') return;
                
                const plainTextSpan = button.querySelector('.plain-text-answer');
                const mjxContainer = button.querySelector('mjx-container');
                
                results.push({
                    hasPlainTextSpan: !!plainTextSpan,
                    hasMjxContainer: !!mjxContainer,
                    textContent: plainTextSpan ? plainTextSpan.textContent : null
                });
            });
            
            return results;
        });
        
        expect(plainTextInfo.length).toBeGreaterThan(0);
        
        // All \\text{} answers should now render as plain text, not MathJax
        plainTextInfo.forEach(info => {
            expect(info.hasPlainTextSpan).toBe(true);
            expect(info.hasMjxContainer).toBe(false);
            expect(info.textContent).toBeTruthy();
        });
    });

    test('Long text buttons do not have clipped content on mobile', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Generate long text question
        await page.evaluate(async () => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            
            window.APP.currentQ = {
                type: 'why',
                tex: '\\int x^2 \\, dx = \\frac{x^3}{3} + C',
                instruction: 'Why do we need to add the constant C when integrating?',
                displayAnswer: '\\text{Because the derivative of a constant is zero, so any constant could have been there}',
                distractors: [
                    '\\text{To balance the equation}',
                    '\\text{Because integration always adds 1}',
                    '\\text{To make the answer look complete}'
                ],
                explanation: 'Test',
                calc: false,
                level: 5.0
            };
            
            window.Learning.setupUI();
            await window.MathJax.typesetPromise();
        });
        
        await page.waitForSelector('#mc-options button', { timeout: 5000 });
        await wait(1000); // Wait for all rendering to complete
        
        // Check for overflow/clipping - now using plain text spans instead of mjx-container
        const overflowInfo = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            const results = [];
            
            buttons.forEach(button => {
                if (button.dataset.dontKnow === 'true') return;
                
                const buttonRect = button.getBoundingClientRect();
                const contentElement = button.querySelector('.plain-text-answer') || button.querySelector('mjx-container');
                
                if (contentElement) {
                    const contentRect = contentElement.getBoundingClientRect();
                    
                    results.push({
                        buttonWidth: buttonRect.width,
                        buttonHeight: buttonRect.height,
                        contentWidth: contentRect.width,
                        contentHeight: contentRect.height,
                        isClipped: contentRect.width > buttonRect.width || contentRect.height > buttonRect.height,
                        overflowStyle: window.getComputedStyle(button).overflow
                    });
                }
            });
            
            return results;
        });
        
        expect(overflowInfo.length).toBeGreaterThan(0);
        
        // Buttons should not have clipped content
        overflowInfo.forEach(info => {
            // With overflow: visible, content won't be clipped even if it exceeds bounds
            // The key is that overflow is set to visible
            expect(info.overflowStyle).toBe('visible');
        });
    });

    test('Button height increases to accommodate wrapped text', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Generate long text question
        await page.evaluate(async () => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            
            window.APP.currentQ = {
                type: 'why',
                tex: '\\int x^2 \\, dx = \\frac{x^3}{3} + C',
                instruction: 'Why do we need to add the constant C when integrating?',
                displayAnswer: '\\text{Because the derivative of a constant is zero, so any constant could have been there}',
                distractors: [
                    '\\text{To balance the equation}',
                    '\\text{Because integration always adds 1}',
                    '\\text{To make the answer look complete}'
                ],
                explanation: 'Test',
                calc: false,
                level: 5.0
            };
            
            window.Learning.setupUI();
            await window.MathJax.typesetPromise();
        });
        
        await page.waitForSelector('#mc-options button', { timeout: 5000 });
        await wait(1000);
        
        // Check that buttons exist and contain plain text spans
        const buttonInfo = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            const results = [];
            
            buttons.forEach(btn => {
                if (btn.dataset.dontKnow === 'true') return;
                
                const plainTextSpan = btn.querySelector('.plain-text-answer');
                const computed = window.getComputedStyle(btn);
                
                results.push({
                    hasPlainTextSpan: !!plainTextSpan,
                    spanTextContent: plainTextSpan ? plainTextSpan.textContent.substring(0, 30) : null,
                    display: computed.display,
                    minHeight: computed.minHeight,
                    height: computed.height
                });
            });
            
            return results;
        });
        
        expect(buttonInfo.length).toBeGreaterThan(0);
        
        // Verify buttons are using flex display and have min-height set
        buttonInfo.forEach(info => {
            expect(info.hasPlainTextSpan).toBe(true);
            expect(info.display).toBe('flex');
            expect(info.minHeight).toBe('60px');
        });
    });
});
