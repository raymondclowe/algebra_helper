const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Debug Mode Level Input Tests', () => {
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

    test('Debug modal contains level input field', async () => {
        // Wait for page to be ready
        await wait(1000);

        // Type "debug" to activate debug mode
        await page.keyboard.type('debug');

        // Wait for modal to appear
        await wait(500);

        // Check that the level input field exists
        const levelInput = await page.$('#debug-level-input');
        expect(levelInput).toBeTruthy();

        // Check input attributes
        const inputAttributes = await page.$eval('#debug-level-input', el => ({
            type: el.type,
            min: el.min,
            max: el.max,
            placeholder: el.placeholder
        }));

        expect(inputAttributes.type).toBe('number');
        expect(inputAttributes.min).toBe('1');
        expect(inputAttributes.max).toBe('34');
        expect(inputAttributes.placeholder).toContain('empty');
    });

    test('Debug mode with level input sets the user level', async () => {
        // Wait for page to be ready
        await wait(1000);

        // Type "debug" to activate debug mode
        await page.keyboard.type('debug');

        // Wait for modal to appear
        await wait(500);

        // Set level to 20
        await page.evaluate(() => {
            const levelInput = document.getElementById('debug-level-input');
            if (levelInput) {
                levelInput.value = '20';
            }
            window.DebugCheatCode.confirmDebugMode();
        });

        // Wait for debug mode to activate
        await wait(500);

        // Check that debug mode is active
        const debugState = await page.evaluate(() => ({
            debugMode: window.DEBUG_MODE,
            level: window.APP ? window.APP.level : null
        }));

        expect(debugState.debugMode).toBe(true);
        // Level should be set to 20 (might be adjusted slightly by calibration)
        expect(debugState.level).toBeGreaterThanOrEqual(15);
        expect(debugState.level).toBeLessThanOrEqual(25);
    });

    test('Debug mode without level input preserves current level', async () => {
        // Wait for page to be ready
        await wait(1000);

        // Get initial level
        const initialLevel = await page.evaluate(() => {
            return window.APP ? window.APP.level : null;
        });

        // Type "debug" to activate debug mode
        await page.keyboard.type('debug');

        // Wait for modal to appear
        await wait(500);

        // Confirm without setting a level
        await page.evaluate(() => {
            window.DebugCheatCode.confirmDebugMode();
        });

        // Wait for debug mode to activate
        await wait(500);

        // Check that debug mode is active and level is similar to initial
        const debugState = await page.evaluate(() => ({
            debugMode: window.DEBUG_MODE,
            level: window.APP ? window.APP.level : null
        }));

        expect(debugState.debugMode).toBe(true);
        // Level should be close to initial level
        expect(Math.abs(debugState.level - initialLevel)).toBeLessThan(5);
    });

    test('Debug mode rejects invalid level inputs', async () => {
        // Wait for page to be ready
        await wait(1000);

        // Type "debug" to activate debug mode
        await page.keyboard.type('debug');

        // Wait for modal to appear
        await wait(500);

        // Try setting an invalid level (too high)
        const consoleMessages = [];
        page.on('console', msg => consoleMessages.push(msg.text()));

        await page.evaluate(() => {
            const MAX_LEVEL = window.MAX_LEVEL || 34;
            const invalidLevel = MAX_LEVEL + 10;  // Invalid: above MAX_LEVEL
            const levelInput = document.getElementById('debug-level-input');
            if (levelInput) {
                levelInput.value = invalidLevel.toString();
            }
            window.DebugCheatCode.confirmDebugMode();
        });

        // Wait for debug mode to activate
        await wait(500);

        // Check that a warning was logged for invalid input
        const hasWarning = consoleMessages.some(msg => 
            msg.includes('Invalid level input')
        );
        expect(hasWarning).toBe(true);
    });

    test('Level input field is cleared after confirmation', async () => {
        // Wait for page to be ready
        await wait(1000);

        // Type "debug" to activate debug mode (first time)
        await page.keyboard.type('debug');
        await wait(500);

        // Set level and confirm
        await page.evaluate(() => {
            const levelInput = document.getElementById('debug-level-input');
            if (levelInput) {
                levelInput.value = '15';
            }
            window.DebugCheatCode.confirmDebugMode();
        });
        await wait(500);

        // Deactivate debug mode
        await page.evaluate(() => {
            window.DebugCheatCode.deactivateDebugMode();
        });
        await wait(500);

        // Activate debug mode again
        await page.keyboard.type('debug');
        await wait(500);

        // Check that the input field is empty
        const inputValue = await page.$eval('#debug-level-input', el => el.value);
        expect(inputValue).toBe('');
    });
});
