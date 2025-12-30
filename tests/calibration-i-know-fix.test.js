const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Calibration "I Know" Button Fix', () => {
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

    test('Calibration ends when user consistently clicks "I Know" (pass)', async () => {
        // Simulate a user who knows everything - keeps clicking "I know"
        // This should end calibration after reasonable number of responses
        
        let iterationCount = 0;
        const MAX_ITERATIONS = 15; // Should end well before this
        
        while (iterationCount < MAX_ITERATIONS) {
            const mode = await page.evaluate(() => window.APP.mode);
            
            // If we've exited calibration mode, test passes
            if (mode === 'learning' || mode === 'drill') {
                break;
            }
            
            // User clicks "I know" (pass action) quickly
            await page.evaluate(() => {
                window.APP.handleCalibration('pass');
            });
            
            await wait(200);
            iterationCount++;
        }
        
        // Verify calibration has ended
        const finalMode = await page.evaluate(() => window.APP.mode);
        expect(finalMode === 'learning' || finalMode === 'drill').toBe(true);
        
        // Should have ended before MAX_ITERATIONS
        expect(iterationCount).toBeLessThan(MAX_ITERATIONS);
        
        // Should have at least MIN_RESPONSES (4) and at most MAX_RESPONSES (6)
        const historyLength = await page.evaluate(() => window.APP.calibrationHistory.length);
        expect(historyLength).toBeGreaterThanOrEqual(4);
        expect(historyLength).toBeLessThanOrEqual(6);
        
        console.log(`Calibration ended after ${iterationCount} iterations with ${historyLength} total responses`);
    }, 30000); // 30 second timeout

    test('Calibration progresses to higher levels when user clicks "I Know"', async () => {
        // Track level progression
        const levels = [];
        
        // Collect first 6 levels when clicking "I know"
        for (let i = 0; i < 6; i++) {
            const currentLevel = await page.evaluate(() => window.APP.level);
            levels.push(currentLevel);
            
            await page.evaluate(() => {
                window.APP.handleCalibration('pass');
            });
            
            await wait(200);
        }
        
        // Verify that levels are generally increasing
        // (Binary search should move towards higher levels)
        const firstLevel = levels[0];
        const lastLevel = levels[levels.length - 1];
        
        expect(lastLevel).toBeGreaterThan(firstLevel);
        
        console.log('Level progression:', levels);
    });

    test('cMin approaches MAX_LEVEL (24) when user knows everything', async () => {
        // Simulate 10 "I know" responses
        for (let i = 0; i < 10; i++) {
            const mode = await page.evaluate(() => window.APP.mode);
            if (mode === 'learning' || mode === 'drill') {
                break;
            }
            
            await page.evaluate(() => {
                window.APP.handleCalibration('pass');
            });
            
            await wait(200);
        }
        
        // Check that cMin has increased significantly
        const cMin = await page.evaluate(() => window.APP.cMin);
        
        // cMin should be close to MAX_LEVEL (24)
        expect(cMin).toBeGreaterThan(20); // Should be well into the high levels
        
        console.log(`Final cMin: ${cMin}`);
    });

    test('Calibration ends when cMin >= MAX_LEVEL - 1 (23)', async () => {
        // Test the specific fix: early termination when cMin >= 23
        const result = await page.evaluate(() => {
            // Simulate state where cMin is at 23 with 6 pass responses
            window.APP.cMin = 23;
            window.APP.cMax = 24;
            window.APP.calibrationHistory = [
                { level: 18, action: 'pass', timeTaken: 5 },
                { level: 21, action: 'pass', timeTaken: 5 },
                { level: 22.5, action: 'pass', timeTaken: 5 },
                { level: 23.25, action: 'pass', timeTaken: 5 },
                { level: 23.625, action: 'pass', timeTaken: 5 },
                { level: 23.8125, action: 'pass', timeTaken: 5 }
            ];
            
            return window.APP.shouldEndCalibration();
        });
        
        // Should return true (calibration should end)
        expect(result).toBe(true);
    });

    test('Calibration does NOT end when cMin is below MAX_LEVEL - 1', async () => {
        // Test that we don't end too early (unless we hit MAX_RESPONSES)
        const result = await page.evaluate(() => {
            // Simulate state where cMin is at 22 (not yet at threshold)
            // with only 4 responses (below MAX_RESPONSES)
            window.APP.cMin = 22;
            window.APP.cMax = 24;
            window.APP.calibrationHistory = [
                { level: 18, action: 'pass', timeTaken: 5 },
                { level: 21, action: 'pass', timeTaken: 5 },
                { level: 22.5, action: 'pass', timeTaken: 5 },
                { level: 23, action: 'pass', timeTaken: 5 }
            ];
            
            return window.APP.shouldEndCalibration();
        });
        
        // Should return false (calibration should continue, not at threshold yet and below MAX_RESPONSES)
        expect(result).toBe(false);
    });
});
