const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Improved Calibration Tests', () => {
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

    test('Calibration requires minimum 6 responses', async () => {
        // Simulate only 3 responses and check that calibration doesn't end
        for (let i = 0; i < 3; i++) {
            const mode = await page.evaluate(() => window.APP.mode);
            expect(mode).toBe('calibration');
            
            // Alternate between pass and fail
            const action = i % 2 === 0 ? 'pass' : 'fail';
            await page.evaluate((act) => {
                window.APP.handleCalibration(act);
            }, action);
            
            await wait(200);
        }
        
        // Should still be in calibration mode
        const mode = await page.evaluate(() => window.APP.mode);
        expect(mode).toBe('calibration');
    });

    test('Calibration requires consistent response pattern', async () => {
        // Simulate responses that are all the same (no discrimination)
        for (let i = 0; i < 8; i++) {
            const mode = await page.evaluate(() => window.APP.mode);
            if (mode === 'drill') break;
            
            // All pass responses - should not end calibration
            await page.evaluate(() => {
                window.APP.handleCalibration('pass');
            });
            
            await wait(200);
        }
        
        const mode = await page.evaluate(() => window.APP.mode);
        const historyLength = await page.evaluate(() => window.APP.calibrationHistory.length);
        
        // Even after 8 responses, if all are the same, might still be calibrating
        // or if it ended, it should have taken at least 6 responses
        if (mode === 'calibration') {
            expect(historyLength).toBeGreaterThanOrEqual(6);
        } else {
            // If it ended, verify it required at least 6 responses
            expect(historyLength).toBeGreaterThanOrEqual(6);
        }
    });

    test('Calibration history is tracked correctly', async () => {
        // Make 3 calibration responses
        await page.evaluate(() => {
            window.APP.handleCalibration('pass');
        });
        await wait(200);
        
        await page.evaluate(() => {
            window.APP.handleCalibration('fail');
        });
        await wait(200);
        
        await page.evaluate(() => {
            window.APP.handleCalibration('doubt');
        });
        await wait(200);
        
        const history = await page.evaluate(() => window.APP.calibrationHistory);
        
        // Should have 3 entries
        expect(history.length).toBe(3);
        
        // Each entry should have required fields
        expect(history[0]).toHaveProperty('level');
        expect(history[0]).toHaveProperty('action');
        expect(history[0]).toHaveProperty('timeTaken');
        
        expect(history[0].action).toBe('pass');
        expect(history[1].action).toBe('fail');
        expect(history[2].action).toBe('doubt');
    });

    test('Calibration ends with mixed responses after minimum count', async () => {
        // Simulate a user at level 5 - they know some things, don't know others
        const responses = ['pass', 'pass', 'fail', 'pass', 'fail', 'fail', 'pass', 'fail'];
        
        for (let i = 0; i < responses.length; i++) {
            const mode = await page.evaluate(() => window.APP.mode);
            if (mode === 'drill' || mode === 'learning') break;
            
            await page.evaluate((action) => {
                window.APP.handleCalibration(action);
            }, responses[i]);
            
            await wait(200);
        }
        
        // Should eventually end calibration with mixed responses
        const mode = await page.evaluate(() => window.APP.mode);
        const historyLength = await page.evaluate(() => window.APP.calibrationHistory.length);
        
        // Should have transitioned to learning mode (or drill for backward compatibility) after showing consistent pattern
        expect(mode === 'learning' || mode === 'drill').toBe(true);
        expect(historyLength).toBeGreaterThanOrEqual(6);
    });

    test('shouldEndCalibration returns false with insufficient data', async () => {
        // Test the shouldEndCalibration logic directly
        const result = await page.evaluate(() => {
            // With no history, should return false
            window.APP.calibrationHistory = [];
            return window.APP.shouldEndCalibration();
        });
        
        expect(result).toBe(false);
    });

    test('shouldEndCalibration checks for consistency', async () => {
        // Test with insufficient consistency - fewer than 6 responses
        const result = await page.evaluate(() => {
            // Simulate only 5 responses but all doubt - should not end yet
            window.APP.calibrationHistory = [
                { level: 5, action: 'doubt', timeTaken: 10 },
                { level: 5, action: 'doubt', timeTaken: 10 },
                { level: 5, action: 'doubt', timeTaken: 10 },
                { level: 5, action: 'doubt', timeTaken: 10 },
                { level: 5, action: 'doubt', timeTaken: 10 }
            ];
            window.APP.cMin = 4;
            window.APP.cMax = 6;
            return window.APP.shouldEndCalibration();
        });
        
        // Too much doubt AND not at max questions yet - should not end
        expect(result).toBe(false);
    });

    test('shouldEndCalibration requires mixed signals', async () => {
        // Test with good consistency
        const result = await page.evaluate(() => {
            // Simulate good mixed pattern
            window.APP.calibrationHistory = [
                { level: 5, action: 'pass', timeTaken: 5 },
                { level: 6, action: 'fail', timeTaken: 10 },
                { level: 5.5, action: 'pass', timeTaken: 6 },
                { level: 5.5, action: 'fail', timeTaken: 11 },
                { level: 5.2, action: 'pass', timeTaken: 7 },
                { level: 5.3, action: 'fail', timeTaken: 9 }
            ];
            window.APP.cMin = 5;
            window.APP.cMax = 6;
            return window.APP.shouldEndCalibration();
        });
        
        // Good pattern with passes and fails - should end
        expect(result).toBe(true);
    });

    test('Calibration ends after exactly MAX_CALIBRATION_QUESTIONS (6) regardless of consistency', async () => {
        // Simulate 6 responses with poor consistency (all doubt) - should still end
        const result = await page.evaluate(() => {
            // Set all responses to doubt, which would normally prevent ending
            window.APP.calibrationHistory = [
                { level: 5, action: 'doubt', timeTaken: 10 },
                { level: 5, action: 'doubt', timeTaken: 10 },
                { level: 5, action: 'doubt', timeTaken: 10 },
                { level: 5, action: 'doubt', timeTaken: 10 },
                { level: 5, action: 'doubt', timeTaken: 10 },
                { level: 5, action: 'doubt', timeTaken: 10 }
            ];
            window.APP.cMin = 4;
            window.APP.cMax = 10; // Wide range, not converged
            return window.APP.shouldEndCalibration();
        });
        
        // Should end due to reaching maximum questions, even with poor consistency
        expect(result).toBe(true);
    });

    test('Calibration never exceeds 6 questions in practice', async () => {
        // Simulate a difficult-to-calibrate user (inconsistent responses)
        const responses = ['doubt', 'doubt', 'doubt', 'doubt', 'doubt', 'doubt', 'doubt', 'doubt'];
        
        for (let i = 0; i < responses.length; i++) {
            const mode = await page.evaluate(() => window.APP.mode);
            if (mode === 'drill' || mode === 'learning') break;
            
            await page.evaluate((action) => {
                window.APP.handleCalibration(action);
            }, responses[i]);
            
            await wait(200);
        }
        
        // Should have ended after 6 questions
        const mode = await page.evaluate(() => window.APP.mode);
        const historyLength = await page.evaluate(() => window.APP.calibrationHistory.length);
        
        expect(mode === 'learning' || mode === 'drill').toBe(true);
        expect(historyLength).toBeLessThanOrEqual(6);
    });
});
