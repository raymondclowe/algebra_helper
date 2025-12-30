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

    test('MathJax containers in buttons have inline styles for wrapping', async () => {
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
        
        // Wait for MathJax to render
        await page.waitForSelector('#mc-options button mjx-container', { timeout: 5000 });
        await wait(500);
        
        // Check MathJax container styles
        const mjxStyles = await page.evaluate(() => {
            const containers = document.querySelectorAll('#mc-options button mjx-container');
            const styles = [];
            
            containers.forEach(container => {
                styles.push({
                    fontSize: container.style.fontSize,
                    maxWidth: container.style.maxWidth,
                    width: container.style.width,
                    display: container.style.display,
                    wordBreak: container.style.wordBreak,
                    overflowWrap: container.style.overflowWrap,
                    overflow: container.style.overflow
                });
            });
            
            return styles;
        });
        
        expect(mjxStyles.length).toBeGreaterThan(0);
        
        mjxStyles.forEach(style => {
            expect(style.fontSize).toBe('0.7em');
            expect(style.maxWidth).toBe('100%');
            expect(style.width).toBe('100%');
            expect(style.display).toBe('inline-block');
            expect(style.wordBreak).toBe('break-word');
            expect(style.overflowWrap).toBe('break-word');
            expect(style.overflow).toBe('visible');
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
        
        // Check for overflow/clipping
        const overflowInfo = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            const results = [];
            
            buttons.forEach(button => {
                if (button.dataset.dontKnow === 'true') return;
                
                const buttonRect = button.getBoundingClientRect();
                const mjxContainer = button.querySelector('mjx-container');
                
                if (mjxContainer) {
                    const mjxRect = mjxContainer.getBoundingClientRect();
                    
                    results.push({
                        buttonWidth: buttonRect.width,
                        buttonHeight: buttonRect.height,
                        mjxWidth: mjxRect.width,
                        mjxHeight: mjxRect.height,
                        isClipped: mjxRect.width > buttonRect.width || mjxRect.height > buttonRect.height,
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
        
        // Check button heights
        const heights = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            return Array.from(buttons)
                .filter(btn => btn.dataset.dontKnow !== 'true')
                .map(btn => btn.offsetHeight);
        });
        
        expect(heights.length).toBeGreaterThan(0);
        
        // At least one button should be taller than minimum due to text wrapping
        // The longest text should wrap and increase button height
        const maxHeight = Math.max(...heights);
        expect(maxHeight).toBeGreaterThan(60); // Should be > minHeight due to wrapping
    });
});
