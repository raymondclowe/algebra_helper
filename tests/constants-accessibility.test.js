const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Constants Accessibility Tests', () => {
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

    test('MAX_LEVEL and MIN_LEVEL are globally accessible', async () => {
        const constants = await page.evaluate(() => {
            return {
                MAX_LEVEL: window.MAX_LEVEL,
                MIN_LEVEL: window.MIN_LEVEL,
                MAX_LEVEL_type: typeof window.MAX_LEVEL,
                MIN_LEVEL_type: typeof window.MIN_LEVEL
            };
        });

        expect(constants.MAX_LEVEL).toBe(34);
        expect(constants.MIN_LEVEL).toBe(1);
        expect(constants.MAX_LEVEL_type).toBe('number');
        expect(constants.MIN_LEVEL_type).toBe('number');
    });

    test('Level delta constants are globally accessible', async () => {
        const constants = await page.evaluate(() => {
            return {
                BASE_LEVEL_DELTA: window.BASE_LEVEL_DELTA,
                TURBO_LEVEL_DELTA: window.TURBO_LEVEL_DELTA,
                BASE_LEVEL_DELTA_type: typeof window.BASE_LEVEL_DELTA,
                TURBO_LEVEL_DELTA_type: typeof window.TURBO_LEVEL_DELTA
            };
        });

        expect(constants.BASE_LEVEL_DELTA).toBe(0.2);
        expect(constants.TURBO_LEVEL_DELTA).toBe(0.4);
        expect(constants.BASE_LEVEL_DELTA_type).toBe('number');
        expect(constants.TURBO_LEVEL_DELTA_type).toBe('number');
    });

    test('applyLevelChange correctly clamps level at MAX_LEVEL', async () => {
        // Set up learning mode at a high level
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 33.8;
        });

        // Apply a large positive delta
        await page.evaluate(() => {
            window.Learning.applyLevelChange(1.0);
        });

        const finalLevel = await page.evaluate(() => window.APP.level);
        expect(finalLevel).toBe(34); // Should be capped at MAX_LEVEL
    });

    test('applyLevelChange correctly clamps level at MIN_LEVEL', async () => {
        // Set up learning mode at a low level
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 1.3;
        });

        // Apply a large negative delta
        await page.evaluate(() => {
            window.Learning.applyLevelChange(-2.0);
        });

        const finalLevel = await page.evaluate(() => window.APP.level);
        expect(finalLevel).toBe(1); // Should be capped at MIN_LEVEL
    });

    test('Level can progress from 21 (Advanced Calculus) to 22', async () => {
        // Set up at level 21 with streak
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 21.0;
            window.APP.streak = 3;
        });

        // Simulate correct answer with turbo delta
        await page.evaluate(() => {
            const delta = window.TURBO_LEVEL_DELTA; // 0.4
            window.Learning.applyLevelChange(delta);
        });

        const newLevel = await page.evaluate(() => window.APP.level);
        expect(newLevel).toBeGreaterThan(21);
        expect(newLevel).toBeLessThanOrEqual(34);
    });

    test('Level can progress from 25 (Integration & Series) to 26', async () => {
        // Set up at level 25 with streak
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 25.0;
            window.APP.streak = 3;
        });

        // Simulate correct answer with turbo delta
        await page.evaluate(() => {
            const delta = window.TURBO_LEVEL_DELTA; // 0.4
            window.Learning.applyLevelChange(delta);
        });

        const newLevel = await page.evaluate(() => window.APP.level);
        expect(newLevel).toBeGreaterThan(25);
        expect(newLevel).toBeLessThanOrEqual(34);
    });

    test('Multiple correct answers at level 21 can advance to level 26+', async () => {
        // Set up at level 21
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 21.0;
            window.APP.streak = 3;
        });

        // Simulate 13 correct answers with turbo delta (21 + 0.4*13 = 26.2)
        await page.evaluate(() => {
            for (let i = 0; i < 13; i++) {
                const delta = window.TURBO_LEVEL_DELTA;
                window.Learning.applyLevelChange(delta);
            }
        });

        const finalLevel = await page.evaluate(() => window.APP.level);
        expect(finalLevel).toBeGreaterThanOrEqual(26);
        expect(finalLevel).toBeLessThanOrEqual(34);
    });

    test('Level progression returns valid numbers (not NaN)', async () => {
        // Test at various levels to ensure no NaN results
        const testLevels = [1, 10, 21, 25, 30, 33];
        
        for (const testLevel of testLevels) {
            await page.evaluate((level) => {
                window.APP.mode = 'learning';
                window.APP.level = level;
                window.APP.streak = 3;
                window.Learning.applyLevelChange(window.TURBO_LEVEL_DELTA);
            }, testLevel);

            const newLevel = await page.evaluate(() => window.APP.level);
            expect(newLevel).not.toBeNaN();
            expect(typeof newLevel).toBe('number');
            expect(newLevel).toBeGreaterThanOrEqual(1);
            expect(newLevel).toBeLessThanOrEqual(34);
        }
    });
});
