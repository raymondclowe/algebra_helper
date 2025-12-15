const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Level Progression Beyond 10 Fix Tests', () => {
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
        // Wait for scripts to load
        await wait(2000);
    });

    afterEach(async () => {
        await page.close();
    });

    test('Level can progress beyond 10 in learning mode', async () => {
        // Set up learning mode at level 9.8
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 9.8;
            window.APP.streak = 3; // Set streak to trigger turbo mode
        });

        // Get initial level
        const initialLevel = await page.evaluate(() => window.APP.level);
        expect(initialLevel).toBe(9.8);

        // Simulate answering correctly with turbo delta
        // This should increase level from 9.8 to something > 10
        await page.evaluate(() => {
            const delta = 0.4; // TURBO_LEVEL_DELTA with normal speed factor
            window.Learning.applyLevelChange(delta);
        });

        // Check that level increased beyond 10
        const newLevel = await page.evaluate(() => window.APP.level);
        expect(newLevel).toBeGreaterThan(10);
        expect(newLevel).toBeLessThanOrEqual(24); // Should not exceed MAX_LEVEL
    });

    test('Level can reach level 15 through multiple correct answers', async () => {
        // Set up learning mode at level 10
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 10.0;
            window.APP.streak = 3;
        });

        // Apply multiple positive deltas to progress to level 15
        await page.evaluate(() => {
            for (let i = 0; i < 13; i++) {
                const delta = 0.4; // TURBO_LEVEL_DELTA
                window.Learning.applyLevelChange(delta);
            }
        });

        const finalLevel = await page.evaluate(() => window.APP.level);
        expect(finalLevel).toBeGreaterThanOrEqual(15);
        expect(finalLevel).toBeLessThanOrEqual(24);
    });

    test('Level can reach level 20 through progression', async () => {
        // Set up learning mode at level 18
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 18.0;
            window.APP.streak = 3;
        });

        // Apply positive deltas to reach level 20
        await page.evaluate(() => {
            for (let i = 0; i < 6; i++) {
                const delta = 0.4;
                window.Learning.applyLevelChange(delta);
            }
        });

        const finalLevel = await page.evaluate(() => window.APP.level);
        expect(finalLevel).toBeGreaterThanOrEqual(20);
        expect(finalLevel).toBeLessThanOrEqual(24);
    });

    test('Level is capped at MAX_LEVEL (24)', async () => {
        // Set up learning mode at level 23.5
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 23.5;
            window.APP.streak = 3;
        });

        // Try to increase beyond 24
        await page.evaluate(() => {
            const delta = 1.0; // Large delta
            window.Learning.applyLevelChange(delta);
        });

        const finalLevel = await page.evaluate(() => window.APP.level);
        expect(finalLevel).toBe(24); // Should be capped at MAX_LEVEL
    });

    test('Level is bounded by MIN_LEVEL (1) on the lower end', async () => {
        // Set up learning mode at level 1.5
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 1.5;
        });

        // Try to decrease below 1
        await page.evaluate(() => {
            const delta = -2.0; // Large negative delta
            window.Learning.applyLevelChange(delta);
        });

        const finalLevel = await page.evaluate(() => window.APP.level);
        expect(finalLevel).toBe(1); // Should be capped at MIN_LEVEL
    });

    test('Questions are generated for levels 11-24', async () => {
        // Test that questions can be generated for high levels
        const results = await page.evaluate(() => {
            const levels = [11, 12, 15, 18, 20, 22, 24];
            const questions = [];
            
            for (const level of levels) {
                const q = window.Generator.getQuestionForLevel(level);
                questions.push({
                    level: level,
                    hasQuestion: !!q,
                    hasTex: !!q.tex,
                    hasAnswer: !!q.displayAnswer,
                    hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3
                });
            }
            
            return questions;
        });

        // Verify all levels generate valid questions
        results.forEach(result => {
            expect(result.hasQuestion).toBe(true);
            expect(result.hasTex).toBe(true);
            expect(result.hasAnswer).toBe(true);
            expect(result.hasDistractors).toBe(true);
        });
    });

    test('Calibration can set level to 20+ when user knows everything', async () => {
        // Simulate calibration that determines user knows level 24
        await page.evaluate(() => {
            window.APP.mode = 'calibration';
            window.APP.cMin = 24;
            window.APP.cMax = 24;
            window.APP.calibrationHistory = [
                { level: 12, action: 'pass', timeTaken: 5 },
                { level: 18, action: 'pass', timeTaken: 7 },
                { level: 21, action: 'pass', timeTaken: 8 },
                { level: 23, action: 'pass', timeTaken: 6 },
                { level: 24, action: 'pass', timeTaken: 9 },
                { level: 24, action: 'fail', timeTaken: 15 } // One fail to create boundary
            ];
            
            // Manually trigger calibration end logic
            if (window.Calibration.shouldEndCalibration()) {
                if (window.APP.cMin >= 24) {
                    window.APP.level = 24;
                } else {
                    window.APP.level = Math.max(1, window.APP.cMin - 1.0);
                }
                window.APP.mode = 'learning';
            }
        });

        const finalLevel = await page.evaluate(() => window.APP.level);
        const mode = await page.evaluate(() => window.APP.mode);
        
        expect(mode).toBe('learning');
        expect(finalLevel).toBe(24);
    });
});
