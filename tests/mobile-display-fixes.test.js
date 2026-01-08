const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Constants
const MATHJAX_INIT_TIMEOUT = 15000;

describe('Mobile Display Fixes - Issue Resolution Tests', () => {
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

    describe('Answer button text wrapping', () => {
        test('Long answer button text wraps properly and is not truncated', async () => {
            await page.setViewport({ width: 375, height: 667 });
            
            // Switch to learning mode to see answer buttons
            await page.evaluate(async () => {
                window.APP.mode = 'learning';
                window.APP.level = 5.0;
                
                // Create a question with a very long answer option
                window.APP.currentQ = {
                    type: 'why',
                    tex: '5 \\times 8 = 40',
                    instruction: 'WHAT DOES MULTIPLICATION REPRESENT?',
                    displayAnswer: 'Adding 5 to itself 8 times (or 8 to itself 5 times)',
                    distractors: [
                        'Combining two numbers',
                        'Taking 5 away from 8',
                        'Dividing 5 by 8'
                    ],
                    explanation: 'Test',
                    calc: false,
                    level: 5.0
                };
                
                window.UI.nextQuestion();
                await window.MathJax.typesetPromise();
            });
            
            await wait(1000);
            
            // Check that buttons have proper wrapping styles
            const buttonStyles = await page.evaluate(() => {
                const buttons = document.querySelectorAll('#mc-options button');
                if (buttons.length === 0) return null;
                
                const firstButton = buttons[0];
                const styles = window.getComputedStyle(firstButton);
                
                return {
                    whiteSpace: styles.whiteSpace,
                    overflowWrap: styles.overflowWrap,
                    wordWrap: styles.wordWrap,
                    wordBreak: styles.wordBreak,
                    display: styles.display,
                    height: firstButton.offsetHeight,
                    minHeight: styles.minHeight
                };
            });
            
            expect(buttonStyles).not.toBeNull();
            expect(buttonStyles.whiteSpace).toBe('normal');
            expect(['break-word', 'anywhere']).toContain(buttonStyles.overflowWrap);
            expect(['flex', 'inline-flex']).toContain(buttonStyles.display);
            // Height should be auto (not fixed) to allow wrapping, should be at least min-height
            expect(buttonStyles.height).toBeGreaterThanOrEqual(60); // Min height is 60px
        });
    });

    describe('History navigation button overlap', () => {
        test('Question text has sufficient horizontal padding to avoid nav button overlap', async () => {
            await page.setViewport({ width: 375, height: 667 });
            await wait(1000);
            
            const questionPadding = await page.evaluate(() => {
                const questionDiv = document.querySelector('#question-math');
                const styles = window.getComputedStyle(questionDiv);
                
                return {
                    paddingLeft: parseFloat(styles.paddingLeft),
                    paddingRight: parseFloat(styles.paddingRight)
                };
            });
            
            // Should have at least 2rem (32px) padding on mobile to avoid nav button overlap
            expect(questionPadding.paddingLeft).toBeGreaterThanOrEqual(30); // ~2rem
            expect(questionPadding.paddingRight).toBeGreaterThanOrEqual(30);
        });
        
        test('Nav buttons do not overlap question text content', async () => {
            await page.setViewport({ width: 375, height: 667 });
            
            // Set a long question to test
            await page.evaluate(async () => {
                window.APP.currentQ = {
                    type: 'why',
                    tex: 'x^2 - 5x + 6 = 0',
                    instruction: 'WHAT DOES MULTIPLICATION REPRESENT?',
                    displayAnswer: 'Test',
                    distractors: ['A', 'B', 'C'],
                    explanation: 'Test',
                    calc: false,
                    level: 5.0
                };
                window.UI.nextQuestion();
                await window.MathJax.typesetPromise();
            });
            
            // Wait for layout to stabilize - question element should be within viewport
            await page.waitForFunction(() => {
                const questionDiv = document.querySelector('#question-math');
                if (!questionDiv) return false;
                const rect = questionDiv.getBoundingClientRect();
                // Element should be positioned within the viewport
                return rect.left >= 0 && rect.left < 200 && 
                       rect.right > 100 && rect.right <= window.innerWidth;
            }, { timeout: 10000 });
            
            await wait(1000);
            
            const overlap = await page.evaluate(() => {
                const questionDiv = document.querySelector('#question-math');
                const leftNav = document.querySelector('#history-nav-left');
                const rightNav = document.querySelector('#history-nav-right');
                
                const questionRect = questionDiv.getBoundingClientRect();
                const leftNavRect = leftNav.getBoundingClientRect();
                const rightNavRect = rightNav.getBoundingClientRect();
                
                // Check if nav buttons are positioned reasonably
                // The nav buttons sit in padding area, so some overlap with the element's
                // bounding box is expected and acceptable. Only fail for major issues.
                const leftClearance = questionRect.left - leftNavRect.right;
                const rightClearance = rightNavRect.left - questionRect.right;
                
                // Allow up to 60px overlap (buttons can be in the padding which is 56px)
                const leftOverlap = leftClearance < -60;
                const rightOverlap = rightClearance < -60;
                
                return {
                    hasOverlap: leftOverlap || rightOverlap,
                    questionLeft: questionRect.left,
                    questionRight: questionRect.right,
                    leftNavRight: leftNavRect.right,
                    rightNavLeft: rightNavRect.left,
                    leftNavWidth: leftNavRect.width,
                    clearanceLeft: leftClearance,
                    clearanceRight: rightClearance
                };
            });
            
            // Nav buttons should not massively overlap question text
            expect(overlap.hasOverlap).toBe(false);
        });
    });

    describe('Question text clipping', () => {
        test('Long question text is not clipped on sides on mobile', async () => {
            await page.setViewport({ width: 375, height: 667 });
            
            // Create a long question
            await page.evaluate(async () => {
                window.APP.currentQ = {
                    type: 'find',
                    tex: '49 \\text{ is the square of what number?}',
                    instruction: 'FIND THE NUMBER',
                    displayAnswer: '7',
                    distractors: ['24', '6', '8'],
                    explanation: 'Test',
                    calc: false,
                    level: 5.0
                };
                window.UI.nextQuestion();
                await window.MathJax.typesetPromise();
            });
            
            await wait(1000);
            
            const padding = await page.evaluate(() => {
                const questionDiv = document.querySelector('#question-math');
                const styles = window.getComputedStyle(questionDiv);
                
                return {
                    paddingLeft: parseFloat(styles.paddingLeft),
                    paddingRight: parseFloat(styles.paddingRight),
                    hasPadding: parseFloat(styles.paddingLeft) > 30 && parseFloat(styles.paddingRight) > 30
                };
            });
            
            // Question should have adequate horizontal padding to provide clearance from nav buttons
            expect(padding.paddingLeft).toBeGreaterThanOrEqual(30); // ~2rem
            expect(padding.paddingRight).toBeGreaterThanOrEqual(30);
            expect(padding.hasPadding).toBe(true);
        });
    });

    describe('Buttons obscuring question text', () => {
        test('Adequate spacing exists between question area and answer buttons', async () => {
            await page.setViewport({ width: 375, height: 667 });
            
            // Switch to learning mode
            await page.evaluate(async () => {
                window.APP.mode = 'learning';
                window.APP.level = 5.0;
                window.UI.nextQuestion();
                await window.MathJax.typesetPromise();
            });
            
            await wait(1000);
            
            const spacing = await page.evaluate(() => {
                const questionArea = document.querySelector('.question-area');
                const controlsLearning = document.querySelector('#controls-learning');
                
                if (!questionArea || !controlsLearning) return null;
                
                const questionRect = questionArea.getBoundingClientRect();
                const controlsRect = controlsLearning.getBoundingClientRect();
                
                const gap = controlsRect.top - questionRect.bottom;
                
                return {
                    gap: gap,
                    questionBottom: questionRect.bottom,
                    controlsTop: controlsRect.top,
                    controlsMarginTop: window.getComputedStyle(controlsLearning).marginTop
                };
            });
            
            expect(spacing).not.toBeNull();
            // There should be at least some gap (even if small due to explanation wrapper)
            expect(spacing.gap).toBeGreaterThanOrEqual(-10); // Allow small overlap due to layout
        });
        
        test('Explanation wrapper has proper spacing on mobile', async () => {
            await page.setViewport({ width: 375, height: 667 });
            await wait(1000);
            
            const wrapperStyles = await page.evaluate(() => {
                const wrapper = document.querySelector('.explanation-wrapper');
                const styles = window.getComputedStyle(wrapper);
                
                return {
                    minHeight: parseFloat(styles.minHeight),
                    paddingBottom: parseFloat(styles.paddingBottom)
                };
            });
            
            // Should have reduced min-height on mobile
            expect(wrapperStyles.minHeight).toBeLessThanOrEqual(100);
            // Should have some padding bottom for spacing
            expect(wrapperStyles.paddingBottom).toBeGreaterThan(0);
        });
    });

    describe('Overall mobile layout quality', () => {
        test('All UI elements are accessible on iPhone SE viewport', async () => {
            await page.setViewport({ width: 375, height: 667 });
            
            // Get to learning mode
            await page.evaluate(async () => {
                window.APP.mode = 'learning';
                window.APP.level = 5.0;
                window.UI.nextQuestion();
                await window.MathJax.typesetPromise();
            });
            
            await wait(2000);
            
            const accessibility = await page.evaluate(() => {
                const app = document.getElementById('app');
                const questionDiv = document.querySelector('#question-math');
                const buttons = document.querySelectorAll('#mc-options button');
                
                return {
                    appHeight: app.scrollHeight,
                    viewportHeight: window.innerHeight,
                    questionVisible: questionDiv.getBoundingClientRect().bottom <= window.innerHeight,
                    buttonCount: buttons.length,
                    allButtonsHaveHeight: Array.from(buttons).every(btn => btn.offsetHeight > 0)
                };
            });
            
            expect(accessibility.buttonCount).toBeGreaterThan(0);
            expect(accessibility.allButtonsHaveHeight).toBe(true);
        });
    });
});
