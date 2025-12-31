const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Calibration Edge Cases Tests', () => {
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

    test('Initial cMax is set to 34 (maximum level)', async () => {
        const cMax = await page.evaluate(() => window.APP.cMax);
        expect(cMax).toBe(34);
    });

    test('Calibration ends at level 1 when user fails repeatedly (timeouts)', async () => {
        // Simulate user letting questions timeout repeatedly (all fail)
        for (let i = 0; i < 10; i++) {
            const mode = await page.evaluate(() => window.APP.mode);
            if (mode === 'learning' || mode === 'drill') break;
            
            await page.evaluate(() => {
                window.APP.handleCalibration('fail');
            });
            
            await wait(200);
        }
        
        // Should have ended calibration
        const mode = await page.evaluate(() => window.APP.mode);
        expect(mode === 'learning' || mode === 'drill').toBe(true);
        
        // Should start at level 1
        const level = await page.evaluate(() => window.APP.level);
        expect(level).toBe(1);
    });

    test('Calibration ends early when cMax goes to 1 or below', async () => {
        // Set up state where cMax is at 1
        await page.evaluate(() => {
            window.APP.cMax = 1;
            window.APP.cMin = 0;
            window.APP.calibrationHistory = [
                { level: 5, action: 'fail', timeTaken: 5 },
                { level: 2.5, action: 'fail', timeTaken: 5 },
                { level: 1.5, action: 'fail', timeTaken: 5 },
                { level: 1, action: 'fail', timeTaken: 5 },
                { level: 0.75, action: 'fail', timeTaken: 5 },
                { level: 0.5, action: 'fail', timeTaken: 5 }
            ];
        });
        
        // Check shouldEndCalibration
        const shouldEnd = await page.evaluate(() => {
            return window.APP.shouldEndCalibration();
        });
        
        expect(shouldEnd).toBe(true);
    });

    test('Calibration allows reaching maximum level (34)', async () => {
        // Simulate user passing all questions (knows everything)
        for (let i = 0; i < 15; i++) {
            const mode = await page.evaluate(() => window.APP.mode);
            if (mode === 'learning' || mode === 'drill') break;
            
            await page.evaluate(() => {
                // Simulate fast correct answers (under 20 seconds)
                window.APP.startTime = Date.now() - 5000; // 5 seconds ago
                window.APP.handleCalibration('pass');
            });
            
            await wait(200);
        }
        
        // Should have ended calibration
        const mode = await page.evaluate(() => window.APP.mode);
        expect(mode === 'learning' || mode === 'drill').toBe(true);
        
        // Should start at or near level 34
        const level = await page.evaluate(() => window.APP.level);
        expect(level).toBeGreaterThanOrEqual(30);
    });

    test('Calibration ends early when cMin reaches maximum level', async () => {
        // Set up state where cMin is at 32 (within MAX_LEVEL - 2 threshold)
        await page.evaluate(() => {
            window.APP.cMin = 32;
            window.APP.cMax = 34;
            window.APP.calibrationHistory = [
                { level: 17, action: 'pass', timeTaken: 5 },
                { level: 25.5, action: 'pass', timeTaken: 5 },
                { level: 29.75, action: 'pass', timeTaken: 5 },
                { level: 31.875, action: 'pass', timeTaken: 5 },
                { level: 32.9375, action: 'pass', timeTaken: 5 },
                { level: 33.5, action: 'pass', timeTaken: 5 }
            ];
        });
        
        // Check shouldEndCalibration
        const shouldEnd = await page.evaluate(() => {
            return window.APP.shouldEndCalibration();
        });
        
        expect(shouldEnd).toBe(true);
    });

    test('Final level is 34 when cMin >= 33', async () => {
        // Simulate calibration ending with cMin at 33
        await page.evaluate(() => {
            window.APP.mode = 'calibration';
            window.APP.cMin = 33;
            window.APP.cMax = 34;
            window.APP.level = 33.5;
            window.APP.calibrationHistory = [
                { level: 17, action: 'pass', timeTaken: 5 },
                { level: 25.5, action: 'pass', timeTaken: 5 },
                { level: 29.75, action: 'pass', timeTaken: 5 },
                { level: 31.875, action: 'pass', timeTaken: 5 },
                { level: 32.9375, action: 'pass', timeTaken: 5 },
                { level: 33.5, action: 'pass', timeTaken: 5 }
            ];
            window.APP.startTime = Date.now() - 5000;
            window.APP.handleCalibration('pass');
        });
        
        await wait(200);
        
        // Should have transitioned to learning mode
        const mode = await page.evaluate(() => window.APP.mode);
        expect(mode === 'learning' || mode === 'drill').toBe(true);
        
        // Level should be 34
        const level = await page.evaluate(() => window.APP.level);
        expect(level).toBe(34);
    });

    test('Final level is 1 when cMax <= 1', async () => {
        // Simulate calibration ending with cMax at 1
        await page.evaluate(() => {
            window.APP.mode = 'calibration';
            window.APP.cMin = 0;
            window.APP.cMax = 1;
            window.APP.level = 0.5;
            window.APP.calibrationHistory = [
                { level: 5, action: 'fail', timeTaken: 5 },
                { level: 2.5, action: 'fail', timeTaken: 5 },
                { level: 1.5, action: 'fail', timeTaken: 5 },
                { level: 1, action: 'fail', timeTaken: 5 },
                { level: 0.75, action: 'fail', timeTaken: 5 },
                { level: 0.5, action: 'fail', timeTaken: 5 }
            ];
            window.APP.startTime = Date.now() - 5000;
            window.APP.handleCalibration('fail');
        });
        
        await wait(200);
        
        // Should have transitioned to learning mode
        const mode = await page.evaluate(() => window.APP.mode);
        expect(mode === 'learning' || mode === 'drill').toBe(true);
        
        // Level should be 1
        const level = await page.evaluate(() => window.APP.level);
        expect(level).toBe(1);
    });

    test('Binary search can reach levels above 10', async () => {
        // Simulate passing questions to push level above 10
        await page.evaluate(() => {
            window.APP.cMin = 0;
            window.APP.cMax = 34;
            window.APP.level = 17;
            window.APP.startTime = Date.now() - 5000;
        });
        
        const initialLevel = await page.evaluate(() => window.APP.level);
        expect(initialLevel).toBe(17);
        
        // Pass this question (should increase cMin)
        await page.evaluate(() => {
            window.APP.handleCalibration('pass');
        });
        
        await wait(200);
        
        // cMin should now be at least 17
        const cMin = await page.evaluate(() => window.APP.cMin);
        expect(cMin).toBeGreaterThanOrEqual(17);
        
        // Next level should be above 17 (binary search between cMin and cMax=34)
        const mode = await page.evaluate(() => window.APP.mode);
        if (mode === 'calibration') {
            const nextLevel = await page.evaluate(() => window.APP.level);
            expect(nextLevel).toBeGreaterThan(17);
        }
    });

    test('Timeout during calibration properly sets action as fail', async () => {
        // Wait for timeout to occur
        await wait(15500);
        
        // Check that history was updated with fail action
        const history = await page.evaluate(() => window.APP.calibrationHistory);
        expect(history.length).toBeGreaterThan(0);
        
        const lastEntry = history[history.length - 1];
        expect(lastEntry.action).toBe('fail');
    });
});
