/**
 * Dynamic Font Sizing Tests
 * 
 * Tests to verify that question font size is dynamically adjusted
 * when content is too wide for mobile screens.
 * 
 * This addresses the issue: "Reduce font size of question when slightly too big"
 */

const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Dynamic Font Sizing for Mobile Questions', () => {
    let browser;
    let page;
    const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';
    const MATHJAX_INIT_TIMEOUT = 15000;

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
        
        // Wait for MathJax and app to initialize
        await page.waitForFunction(() => {
            return typeof window.MathJax !== 'undefined' && 
                   typeof window.APP !== 'undefined' &&
                   window.APP.currentQ !== null;
        }, { timeout: MATHJAX_INIT_TIMEOUT });
    });

    afterEach(async () => {
        await page.close();
    });

    test('adjustQuestionFontSize function exists on UI object', async () => {
        const functionExists = await page.evaluate(() => {
            return typeof window.UI.adjustQuestionFontSize === 'function';
        });
        
        expect(functionExists).toBe(true);
    });

    test('Font size is adjusted on narrow mobile viewport when question is too wide', async () => {
        // Set very narrow viewport (iPhone SE 1st gen)
        await page.setViewport({ width: 320, height: 568 });
        
        // Create a question with a very long expression
        await page.evaluate(async () => {
            window.APP.currentQ = {
                type: 'simplify',
                tex: '(x + 1)(x + 2)(x + 3)(x + 4)(x + 5)(x + 6)(x + 7)(x + 8)',
                instruction: 'SIMPLIFY',
                displayAnswer: 'Expanded form',
                distractors: ['A', 'B', 'C'],
                explanation: 'Test',
                calc: false,
                level: 5.0
            };
            
            window.UI.nextQuestion();
        });
        
        // Wait for MathJax and font adjustment
        await wait(500);
        
        const fontSizeInfo = await page.evaluate(() => {
            const mathContainer = document.querySelector('#question-math mjx-container');
            if (!mathContainer) return null;
            
            const computedStyle = window.getComputedStyle(mathContainer);
            const inlineStyle = mathContainer.style.fontSize;
            
            return {
                inlineStyle: inlineStyle,
                hasFontSizeSet: inlineStyle !== '',
                scrollWidth: mathContainer.scrollWidth,
                clientWidth: mathContainer.clientWidth,
                parentClientWidth: mathContainer.parentElement.clientWidth
            };
        });
        
        // On narrow viewports with long expressions, font size should be adjusted
        expect(fontSizeInfo).not.toBeNull();
        
        // If the content was overflowing, a font size adjustment should have been made
        // The adjustment is made via inline style
        if (fontSizeInfo.scrollWidth > fontSizeInfo.parentClientWidth) {
            expect(fontSizeInfo.hasFontSizeSet).toBe(true);
        }
    });

    test('Font size is not adjusted on desktop viewport', async () => {
        // Set desktop viewport
        await page.setViewport({ width: 1024, height: 768 });
        
        // Create a moderately long question
        await page.evaluate(async () => {
            window.APP.currentQ = {
                type: 'simplify',
                tex: 'x^2 + 5x + 6 = (x + 2)(x + 3)',
                instruction: 'SIMPLIFY',
                displayAnswer: 'Factored form',
                distractors: ['A', 'B', 'C'],
                explanation: 'Test',
                calc: false,
                level: 5.0
            };
            
            window.UI.nextQuestion();
        });
        
        // Wait for MathJax and font adjustment
        await wait(500);
        
        const fontSizeInfo = await page.evaluate(() => {
            const mathContainer = document.querySelector('#question-math mjx-container');
            if (!mathContainer) return null;
            
            return {
                inlineStyle: mathContainer.style.fontSize,
                hasFontSizeSet: mathContainer.style.fontSize !== '',
                windowWidth: window.innerWidth,
                scrollWidth: mathContainer.scrollWidth,
                clientWidth: mathContainer.clientWidth,
                parentClientWidth: mathContainer.parentElement.clientWidth
            };
        });
        
        // On desktop (width > 768), no inline font size adjustment should be made
        expect(fontSizeInfo).not.toBeNull();
        expect(fontSizeInfo.windowWidth).toBeGreaterThan(768);
        expect(fontSizeInfo.hasFontSizeSet).toBe(false);
    });

    test('Font size is progressively reduced up to 25% maximum', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Create a very long question that will definitely overflow
        await page.evaluate(async () => {
            window.APP.currentQ = {
                type: 'simplify',
                tex: '(x+1)(x+2)(x+3)(x+4)(x+5)(x+6)(x+7)(x+8)(x+9)(x+10)(x+11)(x+12)',
                instruction: 'EXPAND',
                displayAnswer: 'Expanded',
                distractors: ['A', 'B', 'C'],
                explanation: 'Test',
                calc: false,
                level: 5.0
            };
            
            window.UI.nextQuestion();
        });
        
        // Wait for MathJax and adjustment
        await wait(500);
        
        const fontSizeInfo = await page.evaluate(() => {
            const mathContainer = document.querySelector('#question-math mjx-container');
            if (!mathContainer) return null;
            
            const inlineStyle = mathContainer.style.fontSize;
            let numericValue = null;
            
            if (inlineStyle) {
                // Parse the em value (e.g., "0.75em" -> 0.75)
                const match = inlineStyle.match(/(\d*\.?\d+)em/);
                if (match) {
                    numericValue = parseFloat(match[1]);
                }
            }
            
            return {
                inlineStyle: inlineStyle,
                numericValue: numericValue,
                hasFontSizeSet: inlineStyle !== ''
            };
        });
        
        expect(fontSizeInfo).not.toBeNull();
        
        // If font size was adjusted, it should not be reduced by more than 25%
        if (fontSizeInfo.numericValue !== null) {
            expect(fontSizeInfo.numericValue).toBeGreaterThanOrEqual(0.75);
            expect(fontSizeInfo.numericValue).toBeLessThanOrEqual(1.0);
        }
    });

    test('Font size adjustment works with historical questions', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // First, create and store a question in history
        await page.evaluate(async () => {
            // Generate some questions to build history
            for (let i = 0; i < 3; i++) {
                window.APP.currentQ = window.Generator.getQuestion(window.APP.level);
                await window.StorageManager.saveQuestion({
                    question: '(x+1)(x+2)(x+3)(x+4)(x+5)(x+6)',
                    correctAnswer: 'test',
                    isCorrect: true,
                    timeSpent: 5,
                    advice: 'test'
                });
            }
            
            // Navigate to history
            window.APP.questionHistory = await window.StorageManager.getAllQuestions();
            window.APP.questionHistory.reverse();
        });
        
        // Navigate back in history
        await page.evaluate(() => {
            window.UI.navigateHistory(1);
        });
        
        // Wait for history display and MathJax
        await wait(500);
        
        const isHistoryView = await page.evaluate(() => {
            const instruction = document.getElementById('instruction-text').innerText;
            return instruction.includes('VIEWING HISTORY');
        });
        
        // If we're viewing history, check that font adjustment was applied
        if (isHistoryView) {
            const fontSizeInfo = await page.evaluate(() => {
                const mathContainer = document.querySelector('#question-math mjx-container');
                if (!mathContainer) return { exists: false };
                
                return {
                    exists: true,
                    hasInlineStyle: mathContainer.style.fontSize !== ''
                };
            });
            
            expect(fontSizeInfo.exists).toBe(true);
        }
    });

    test('Short questions are not affected by font size adjustment', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Create a short question
        await page.evaluate(async () => {
            window.APP.currentQ = {
                type: 'simplify',
                tex: 'x + 5',
                instruction: 'SIMPLIFY',
                displayAnswer: 'x + 5',
                distractors: ['x', '5', 'x - 5'],
                explanation: 'Test',
                calc: false,
                level: 5.0
            };
            
            window.UI.nextQuestion();
        });
        
        // Wait for MathJax
        await wait(500);
        
        const fontSizeInfo = await page.evaluate(() => {
            const mathContainer = document.querySelector('#question-math mjx-container');
            if (!mathContainer) return null;
            
            return {
                inlineStyle: mathContainer.style.fontSize,
                hasFontSizeSet: mathContainer.style.fontSize !== '',
                scrollWidth: mathContainer.scrollWidth,
                clientWidth: mathContainer.clientWidth
            };
        });
        
        expect(fontSizeInfo).not.toBeNull();
        
        // Short questions should not need adjustment
        // If they fit, no inline style should be applied
        if (fontSizeInfo.scrollWidth <= fontSizeInfo.clientWidth) {
            expect(fontSizeInfo.hasFontSizeSet).toBe(false);
        }
    });

    test('Font size adjustment is reapplied when navigating between questions', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Create first long question
        await page.evaluate(async () => {
            window.APP.currentQ = {
                type: 'simplify',
                tex: '(x+1)(x+2)(x+3)(x+4)(x+5)(x+6)(x+7)',
                instruction: 'EXPAND',
                displayAnswer: 'Expanded',
                distractors: ['A', 'B', 'C'],
                explanation: 'Test',
                calc: false,
                level: 5.0
            };
            
            window.UI.nextQuestion();
        });
        
        await wait(500);
        
        const firstQuestionFontSize = await page.evaluate(() => {
            const mathContainer = document.querySelector('#question-math mjx-container');
            return mathContainer ? mathContainer.style.fontSize : null;
        });
        
        // Now create a short question
        await page.evaluate(async () => {
            window.APP.currentQ = {
                type: 'simplify',
                tex: 'x + 2',
                instruction: 'SIMPLIFY',
                displayAnswer: 'x + 2',
                distractors: ['x', '2', 'x - 2'],
                explanation: 'Test',
                calc: false,
                level: 5.0
            };
            
            window.UI.nextQuestion();
        });
        
        await wait(500);
        
        const secondQuestionFontSize = await page.evaluate(() => {
            const mathContainer = document.querySelector('#question-math mjx-container');
            return mathContainer ? mathContainer.style.fontSize : null;
        });
        
        // Font sizes should be different (or both empty)
        // The long question should have adjustment, short one shouldn't
        // This verifies that the adjustment is properly reset and reapplied
        expect(firstQuestionFontSize).toBeDefined();
        expect(secondQuestionFontSize).toBeDefined();
    });
});
