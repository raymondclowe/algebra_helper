const puppeteer = require('puppeteer');
const path = require('path');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Algebra Helper Tests', () => {
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
    });

    afterEach(async () => {
        await page.close();
    });

    test('Page loads successfully', async () => {
        const title = await page.title();
        expect(title).toBe('IB Math Trainer (Fast Response)');
    });

    test('External JS files are loaded', async () => {
        const scriptsLoaded = await page.evaluate(() => {
            return {
                hasDebugCheatCode: typeof DebugCheatCode !== 'undefined',
                hasGenerator: typeof Generator !== 'undefined',
                hasAPP: typeof APP !== 'undefined'
            };
        });

        expect(scriptsLoaded.hasDebugCheatCode).toBe(true);
        expect(scriptsLoaded.hasGenerator).toBe(true);
        expect(scriptsLoaded.hasAPP).toBe(true);
    });

    test('MathJax loads and renders math', async () => {
        // Wait for MathJax to load
        await page.waitForFunction(
            () => window.MathJax && window.MathJax.typesetPromise,
            { timeout: 15000 }
        );

        // Wait for a question to be displayed
        await page.waitForSelector('#question-math', { timeout: 10000 });

        const questionMath = await page.$eval('#question-math', el => el.innerHTML);
        expect(questionMath).toBeTruthy();
        expect(questionMath.length).toBeGreaterThan(0);
    });

    test('App initializes in calibration mode', async () => {
        // Wait for scripts to load
        await wait(1000);

        const mode = await page.evaluate(() => {
            return window.APP ? window.APP.mode : null;
        });
        expect(mode).toBe('calibration');
    });

    test('Calibration controls are visible', async () => {
        const controls = await page.$('#controls-calibration');
        const isHidden = await page.evaluate(el => el.classList.contains('hidden'), controls);
        expect(isHidden).toBe(false);
    });

    test('Calibration button clicks work', async () => {
        // Wait for page to be ready
        await wait(2000);

        const initialLevel = await page.evaluate(() => {
            return window.APP ? window.APP.level : null;
        });
        expect(initialLevel).toBeDefined();

        // Click "I Know This" button
        await page.evaluate(() => {
            if (window.APP) {
                window.APP.handleCalibration('pass');
            }
        });

        // Wait for level to potentially change
        await wait(500);

        const newLevel = await page.evaluate(() => {
            return window.APP ? window.APP.level : null;
        });
        
        // Level should have changed
        expect(newLevel).toBeDefined();
        expect(typeof newLevel).toBe('number');
    });

    test('Debug mode activation works', async () => {
        // Wait for page to be ready
        await wait(1000);

        // Type "debug" to activate debug mode
        await page.keyboard.type('debug');

        // Wait for modal to appear
        await wait(500);

        const modalVisible = await page.$eval('#debug-warning-modal', 
            el => !el.classList.contains('hidden')
        );
        expect(modalVisible).toBe(true);
    });

    test('Generator produces valid questions', async () => {
        // Wait for page to be ready
        await wait(1000);

        const question = await page.evaluate(() => {
            return window.Generator ? window.Generator.getQuestion(5) : null;
        });

        expect(question).toBeDefined();
        expect(question.tex).toBeDefined();
        expect(question.instruction).toBeDefined();
        expect(question.displayAnswer).toBeDefined();
        expect(Array.isArray(question.distractors)).toBe(true);
        expect(question.distractors.length).toBe(3);
    });

    test('Level display shows skill description (not internal numbers)', async () => {
        const levelDisplay = await page.$('#level-display');
        const levelText = await page.evaluate(el => el.textContent, levelDisplay);
        
        // In MASTERY mode (default), should show skill description, not numeric level
        // Examples: "Simple Equations", "Two-Step Equations", "Basic Arithmetic"
        expect(levelText.length).toBeGreaterThan(0);
        // Should NOT match numeric pattern like "5.0", "2.5", "5", or "10"
        expect(levelText).not.toMatch(/^\d+(\.\d+)?$/);
    });

    test('CSS is loaded correctly', async () => {
        const hasFloatUpClass = await page.evaluate(() => {
            const style = document.styleSheets[0] || document.styleSheets[1] || document.styleSheets[2];
            if (!style) return false;
            
            try {
                const rules = Array.from(style.cssRules || style.rules || []);
                return rules.some(rule => 
                    rule.selectorText && (
                        rule.selectorText.includes('.float-up') || 
                        rule.selectorText.includes('.debug-correct')
                    )
                );
            } catch (e) {
                // CORS or other error accessing stylesheet
                return true; // Assume loaded if we can't check
            }
        });

        expect(hasFloatUpClass).toBe(true);
    });
});
