const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Layout and Readability Fix Tests', () => {
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
        }, { timeout: 5000 });
    });

    afterEach(async () => {
        await page.close();
    });

    test('Question math div has flex-wrap enabled on mobile', async () => {
        await page.setViewport({ width: 375, height: 667 });
        
        // Force into drill mode
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        const flexWrap = await page.evaluate(() => {
            const el = document.getElementById('question-math');
            const styles = window.getComputedStyle(el);
            return styles.flexWrap;
        });
        
        expect(flexWrap).toBe('wrap');
    });

    test('Question math div has flex-wrap enabled on desktop', async () => {
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Force into drill mode
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        const flexWrap = await page.evaluate(() => {
            const el = document.getElementById('question-math');
            const styles = window.getComputedStyle(el);
            return styles.flexWrap;
        });
        
        expect(flexWrap).toBe('wrap');
    });

    test('Answer buttons have flex-wrap enabled on mobile', async () => {
        await page.setViewport({ width: 375, height: 667 });
        
        // Force into drill mode
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        const allButtonsHaveFlexWrap = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            if (buttons.length === 0) return false;
            
            for (let btn of buttons) {
                const styles = window.getComputedStyle(btn);
                if (styles.flexWrap !== 'wrap') {
                    return false;
                }
            }
            return true;
        });
        
        expect(allButtonsHaveFlexWrap).toBe(true);
    });

    test('Answer buttons have flex-wrap enabled on desktop', async () => {
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Force into drill mode
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        const allButtonsHaveFlexWrap = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            if (buttons.length === 0) return false;
            
            for (let btn of buttons) {
                const styles = window.getComputedStyle(btn);
                if (styles.flexWrap !== 'wrap') {
                    return false;
                }
            }
            return true;
        });
        
        expect(allButtonsHaveFlexWrap).toBe(true);
    });

    test('Long question text does not overflow on mobile', async () => {
        await page.setViewport({ width: 375, height: 667 });
        
        // Force a question with longer text
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            Generator.questionCounter = 5; // Get a different question type
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        const overflow = await page.evaluate(() => {
            const el = document.getElementById('question-math');
            const styles = window.getComputedStyle(el);
            // Check that content doesn't overflow horizontally
            return {
                overflow: styles.overflow,
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth
            };
        });
        
        // scrollWidth should not be significantly larger than clientWidth
        // (allow small difference for rounding)
        expect(overflow.scrollWidth - overflow.clientWidth).toBeLessThan(5);
    });

    test('Math rendering still works after layout fix on mobile', async () => {
        await page.setViewport({ width: 375, height: 667 });
        
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 7.0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        const hasMathJax = await page.evaluate(() => {
            const questionDiv = document.getElementById('question-math');
            const mjxContainer = questionDiv.querySelector('mjx-container');
            return mjxContainer !== null;
        });
        
        expect(hasMathJax).toBe(true);
    });

    test('Math rendering still works after layout fix on desktop', async () => {
        await page.setViewport({ width: 1920, height: 1080 });
        
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 7.0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        const hasMathJax = await page.evaluate(() => {
            const questionDiv = document.getElementById('question-math');
            const mjxContainer = questionDiv.querySelector('mjx-container');
            return mjxContainer !== null;
        });
        
        expect(hasMathJax).toBe(true);
    });

    test('Button content wraps properly on narrow screens', async () => {
        // Test with very narrow viewport
        await page.setViewport({ width: 320, height: 568 });
        
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        const buttonHeights = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            return Array.from(buttons).map(btn => btn.offsetHeight);
        });
        
        // All buttons should have rendered (height > 0)
        buttonHeights.forEach(height => {
            expect(height).toBeGreaterThan(0);
        });
    });

    test('Calibration mode question also has flex-wrap', async () => {
        await page.setViewport({ width: 375, height: 667 });
        
        // Stay in calibration mode
        await page.evaluate(() => {
            APP.mode = 'calibration';
            APP.level = 5.0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        const flexWrap = await page.evaluate(() => {
            const el = document.getElementById('question-math');
            const styles = window.getComputedStyle(el);
            return styles.flexWrap;
        });
        
        expect(flexWrap).toBe('wrap');
    });
});
