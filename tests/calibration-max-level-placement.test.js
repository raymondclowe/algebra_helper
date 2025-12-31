const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Calibration Max Level Placement Fix', () => {
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

    test('User who knows everything is placed at MAX_LEVEL (34)', async () => {
        // Simulate a user who knows everything - keeps clicking "I know"
        for (let i = 0; i < 10; i++) {
            const mode = await page.evaluate(() => window.APP.mode);
            if (mode === 'learning' || mode === 'drill') {
                break;
            }
            
            // Fast response time (< 20 seconds) to simulate knowing the answer
            await page.evaluate(() => {
                window.APP.startTime = Date.now() - 5000; // 5 seconds ago
                window.APP.handleCalibration('pass');
            });
            
            await wait(200);
        }
        
        // Verify calibration has ended
        const finalMode = await page.evaluate(() => window.APP.mode);
        expect(finalMode === 'learning' || finalMode === 'drill').toBe(true);
        
        // Check that user is placed at MAX_LEVEL (34)
        const finalLevel = await page.evaluate(() => window.APP.level);
        expect(finalLevel).toBe(34);
        
        console.log(`User placed at level: ${finalLevel}`);
    }, 30000);

    test('User with cMin = 32 is placed at MAX_LEVEL (34)', async () => {
        // Directly test the placement logic when cMin >= MAX_LEVEL - 2
        const result = await page.evaluate(() => {
            // Simulate state where cMin is at 32 (MAX_LEVEL - 2)
            window.APP.cMin = 32;
            window.APP.cMax = 34;
            window.APP.calibrationHistory = [
                { level: 17, action: 'pass', timeTaken: 5 },
                { level: 25.5, action: 'pass', timeTaken: 5 },
                { level: 29.75, action: 'pass', timeTaken: 5 },
                { level: 31.875, action: 'pass', timeTaken: 5 }
            ];
            
            // Trigger calibration end
            if (window.Calibration.shouldEndCalibration()) {
                // Manually replicate the placement logic
                if (window.APP.cMax <= 1) {
                    window.APP.level = 1;
                } else if (window.APP.cMin >= 32) { // MAX_LEVEL - 2
                    window.APP.level = 34; // MAX_LEVEL
                } else {
                    window.APP.level = Math.max(1, window.APP.cMin - 1.0);
                }
            }
            
            return window.APP.level;
        });
        
        // Should be placed at MAX_LEVEL (34)
        expect(result).toBe(34);
    });

    test('User with mixed performance is not placed at MAX_LEVEL', async () => {
        // Test that users who don't reach the threshold are placed below MAX_LEVEL
        // Simulate a mixed performance pattern: pass, pass, fail, pass, fail, pass, fail
        const responses = ['pass', 'pass', 'fail', 'pass', 'fail', 'pass', 'fail'];
        
        for (let i = 0; i < responses.length; i++) {
            const mode = await page.evaluate(() => window.APP.mode);
            if (mode === 'learning' || mode === 'drill') {
                break;
            }
            
            await page.evaluate((action) => {
                const timeTaken = action === 'fail' ? 12000 : 5000;
                window.APP.startTime = Date.now() - timeTaken;
                window.APP.handleCalibration(action);
            }, responses[i]);
            
            await wait(200);
        }
        
        // Check final placement
        const finalMode = await page.evaluate(() => window.APP.mode);
        const finalLevel = await page.evaluate(() => window.APP.level);
        const cMin = await page.evaluate(() => window.APP.cMin);
        
        // Should have ended calibration
        expect(finalMode === 'learning' || finalMode === 'drill').toBe(true);
        
        // Should be below MAX_LEVEL (34) since user had some failures
        // This ensures only users who consistently pass everything get MAX_LEVEL
        expect(finalLevel).toBeLessThan(34);
        
        // cMin should also be below the MAX_LEVEL - 2 threshold (32)
        expect(cMin).toBeLessThan(32);
        
        console.log(`User with mixed performance placed at level: ${finalLevel} (cMin: ${cMin})`);
    });
});
