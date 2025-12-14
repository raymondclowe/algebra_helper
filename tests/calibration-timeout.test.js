const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Calibration Timeout Tests', () => {
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
        // Wait for scripts to initialize
        await wait(1000);
    });

    afterEach(async () => {
        await page.close();
    });

    test('Timeout bar is visible during calibration', async () => {
        // Check that we're in calibration mode
        const mode = await page.evaluate(() => window.APP.mode);
        expect(mode).toBe('calibration');
        
        // Check that the timeout bar container exists and is visible
        const barVisible = await page.evaluate(() => {
            const barContainer = document.getElementById('timeout-bar-container');
            return barContainer && !barContainer.classList.contains('hidden');
        });
        
        expect(barVisible).toBe(true);
    });

    test('Timeout bar has correct CSS classes for animation', async () => {
        // Check that the bar has the animation class
        const hasAnimationClass = await page.evaluate(() => {
            const bar = document.getElementById('timeout-bar');
            return bar && bar.classList.contains('timeout-bar-shrinking');
        });
        
        expect(hasAnimationClass).toBe(true);
    });

    test('Timeout automatically records "don\'t know" after 5 seconds', async () => {
        // Record the initial history length
        const initialHistoryLength = await page.evaluate(() => window.APP.calibrationHistory.length);
        
        // Wait for timeout (5 seconds + buffer)
        await wait(5500);
        
        // Check that a new entry was added to history
        const history = await page.evaluate(() => window.APP.calibrationHistory);
        expect(history.length).toBe(initialHistoryLength + 1);
        
        // Check that the last action was 'fail' (don't know)
        const lastAction = history[history.length - 1];
        expect(lastAction.action).toBe('fail');
        
        // Check that time taken is approximately 5 seconds
        expect(lastAction.timeTaken).toBeGreaterThan(4.9);
        expect(lastAction.timeTaken).toBeLessThan(5.5);
    });

    test('Timeout is cleared when user responds before timeout', async () => {
        // Record the initial history length
        const initialHistoryLength = await page.evaluate(() => window.APP.calibrationHistory.length);
        
        // Wait 2 seconds (less than timeout)
        await wait(2000);
        
        // User clicks a button
        await page.evaluate(() => {
            window.APP.handleCalibration('pass');
        });
        
        // Wait for another 4 seconds to ensure timeout doesn't fire
        await wait(4000);
        
        // Check that only one entry was added (from the user click, not from timeout)
        const history = await page.evaluate(() => window.APP.calibrationHistory);
        expect(history.length).toBe(initialHistoryLength + 1);
        
        // Check that the action was 'pass', not 'fail'
        expect(history[history.length - 1].action).toBe('pass');
    });

    test('Timeout bar is cleared and restarted after user responds', async () => {
        // Check bar is visible initially
        let barVisible = await page.evaluate(() => {
            const barContainer = document.getElementById('timeout-bar-container');
            return barContainer && !barContainer.classList.contains('hidden');
        });
        expect(barVisible).toBe(true);
        
        // User responds
        await page.evaluate(() => {
            window.APP.handleCalibration('pass');
        });
        
        // Wait for next question to render
        await wait(500);
        
        // Check if we're still in calibration mode
        const mode = await page.evaluate(() => window.APP.mode);
        
        if (mode === 'calibration') {
            // Bar should be visible again for next question
            barVisible = await page.evaluate(() => {
                const barContainer = document.getElementById('timeout-bar-container');
                return barContainer && !barContainer.classList.contains('hidden');
            });
            expect(barVisible).toBe(true);
            
            // Check that animation was restarted
            const hasAnimationClass = await page.evaluate(() => {
                const bar = document.getElementById('timeout-bar');
                return bar && bar.classList.contains('timeout-bar-shrinking');
            });
            expect(hasAnimationClass).toBe(true);
        }
    });

    test('Timeout bar restarts for next calibration question', async () => {
        // Let first question timeout
        await wait(5500);
        
        // Wait for next question to load
        await wait(500);
        
        // Check if we're still in calibration mode (depends on calibration logic)
        const mode = await page.evaluate(() => window.APP.mode);
        
        if (mode === 'calibration') {
            // Check that the timeout bar is visible again
            const barVisible = await page.evaluate(() => {
                const barContainer = document.getElementById('timeout-bar-container');
                return barContainer && !barContainer.classList.contains('hidden');
            });
            expect(barVisible).toBe(true);
        }
    });

    test('Timeout bar is not visible in learning mode', async () => {
        // Transition to learning mode by completing calibration
        const responses = ['pass', 'pass', 'fail', 'pass', 'fail', 'fail', 'pass', 'fail'];
        
        for (let i = 0; i < responses.length; i++) {
            const mode = await page.evaluate(() => window.APP.mode);
            if (mode === 'learning' || mode === 'drill') break;
            
            await page.evaluate((action) => {
                window.APP.handleCalibration(action);
            }, responses[i]);
            
            await wait(200);
        }
        
        // Check mode is now learning
        const mode = await page.evaluate(() => window.APP.mode);
        expect(mode === 'learning' || mode === 'drill').toBe(true);
        
        // Check that timeout bar is hidden
        const barVisible = await page.evaluate(() => {
            const barContainer = document.getElementById('timeout-bar-container');
            return barContainer && !barContainer.classList.contains('hidden');
        });
        expect(barVisible).toBe(false);
    });
});
