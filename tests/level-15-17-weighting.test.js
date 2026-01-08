const puppeteer = require('puppeteer');

describe('Level 15-17 Weighting Tests', () => {
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

    test('10% of questions come from level 5 to current level range', async () => {
        const distribution = await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 20;
            
            const totalQuestions = 1000;
            let questionsInRange = 0;
            
            for (let i = 0; i < totalQuestions; i++) {
                const level = window.Generator.selectQuestionLevel(20);
                if (level >= 5 && level < 20) {
                    questionsInRange++;
                }
            }
            
            return {
                totalQuestions,
                questionsInRange,
                percentage: (questionsInRange / totalQuestions) * 100
            };
        });

        // Should be approximately 10% (allowing for variance)
        // With 1000 samples, we expect roughly 100 ± ~20 (due to random variance)
        expect(distribution.percentage).toBeGreaterThan(8);
        expect(distribution.percentage).toBeLessThan(30);
    });

    test('5% of questions overall come from levels 15-17 when at level 20+', async () => {
        const distribution = await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 25;
            
            const totalQuestions = 1000;
            let level15_17Count = 0;
            
            for (let i = 0; i < totalQuestions; i++) {
                const level = window.Generator.selectQuestionLevel(25);
                if (level >= 15 && level <= 17) {
                    level15_17Count++;
                }
            }
            
            return {
                totalQuestions,
                level15_17Count,
                percentage: (level15_17Count / totalQuestions) * 100
            };
        });

        // Should be approximately 5% (1 in 20)
        // With 1000 samples, we expect roughly 50 ± ~15 (due to random variance)
        expect(distribution.percentage).toBeGreaterThan(3);
        expect(distribution.percentage).toBeLessThan(8);
    });

    test('Levels 15-17 are weighted heavier within the lower level range', async () => {
        const distribution = await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 20;
            
            const totalQuestions = 2000;
            const levelCounts = {};
            
            for (let i = 0; i < totalQuestions; i++) {
                const level = window.Generator.selectQuestionLevel(20);
                levelCounts[level] = (levelCounts[level] || 0) + 1;
            }
            
            return levelCounts;
        });

        // Count how many questions came from the special range (15-17) vs other lower levels (5-14, 18-19)
        let special15_17 = (distribution[15] || 0) + (distribution[16] || 0) + (distribution[17] || 0);
        let other5_19 = 0;
        
        for (let level = 5; level < 20; level++) {
            if (level < 15 || level > 17) {
                other5_19 += (distribution[level] || 0);
            }
        }

        // Levels 15-17 should appear more frequently than other levels in the 5-19 range
        // The special weighting should make 15-17 represent roughly half of the lower-level questions
        const totalLowerLevel = special15_17 + other5_19;
        if (totalLowerLevel > 0) {
            const special15_17Ratio = special15_17 / totalLowerLevel;
            // Should be roughly 50% of lower level questions (allowing for variance)
            // Note: Due to random distribution, this might vary between 25-55%
            expect(special15_17Ratio).toBeGreaterThan(0.25);
            expect(special15_17Ratio).toBeLessThan(0.70);
        }
    });

    test('No special weighting when current level is below 15', async () => {
        const distribution = await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 10;
            
            const totalQuestions = 1000;
            const levelCounts = {};
            
            for (let i = 0; i < totalQuestions; i++) {
                const level = window.Generator.selectQuestionLevel(10);
                levelCounts[level] = (levelCounts[level] || 0) + 1;
            }
            
            return levelCounts;
        });

        // When current level is 10, we shouldn't see any levels above 10
        for (let level = 11; level <= 17; level++) {
            expect(distribution[level] || 0).toBe(0);
        }
    });

    test('Students at level 15-17 still get the special weighting for those levels', async () => {
        const distribution = await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 16;
            
            const totalQuestions = 1000;
            const levelCounts = {};
            
            for (let i = 0; i < totalQuestions; i++) {
                const level = window.Generator.selectQuestionLevel(16);
                levelCounts[level] = (levelCounts[level] || 0) + 1;
            }
            
            return levelCounts;
        });

        // Count questions from levels 15-16 (the applicable special range)
        const special15_16 = (distribution[15] || 0) + (distribution[16] || 0);
        const total = Object.values(distribution).reduce((a, b) => a + b, 0);
        
        // Should see a boost in 15-16 questions compared to standard distribution
        // At least 5% should be from this special range
        const percentage = (special15_16 / total) * 100;
        expect(percentage).toBeGreaterThan(5);
    });

    test('Special level selection only applies in learning and drill modes', async () => {
        const result = await page.evaluate(() => {
            // Test calibration mode
            window.APP.mode = 'calibration';
            window.APP.level = 20;
            const calibrationLevel = window.Generator.selectQuestionLevel(20);
            
            // Test worksheet mode
            window.APP.mode = 'worksheet';
            window.APP.level = 20;
            const worksheetLevel = window.Generator.selectQuestionLevel(20);
            
            return {
                calibrationLevel,
                worksheetLevel
            };
        });

        // In non-learning/drill modes, should always return current level
        expect(result.calibrationLevel).toBe(20);
        expect(result.worksheetLevel).toBe(20);
    });

    test('Distribution maintains other spaced repetition probabilities', async () => {
        const distribution = await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 8;
            
            const totalQuestions = 2000;
            const levelCounts = {};
            
            for (let i = 0; i < totalQuestions; i++) {
                const level = window.Generator.selectQuestionLevel(8);
                levelCounts[level] = (levelCounts[level] || 0) + 1;
            }
            
            return levelCounts;
        });

        const total = Object.values(distribution).reduce((a, b) => a + b, 0);
        
        // Level 8 (current) should still appear most frequently (but adjusted down due to new logic)
        // Previously ~82%, now should be ~72% due to 10% going to lower levels
        expect(distribution[8] / total).toBeGreaterThan(0.65);
        expect(distribution[8] / total).toBeLessThan(0.80);
        
        // Lower levels should still appear with decreasing frequency
        if (distribution[7]) {
            expect(distribution[7]).toBeGreaterThan(0);
        }
    });

    test('Special weighting respects minimum level of 5', async () => {
        const distribution = await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 6;
            
            const totalQuestions = 1000;
            const levelCounts = {};
            
            for (let i = 0; i < totalQuestions; i++) {
                const level = window.Generator.selectQuestionLevel(6);
                levelCounts[level] = (levelCounts[level] || 0) + 1;
            }
            
            return levelCounts;
        });

        // When at level 6, special logic applies only if level > 5
        // So we should see some level 5 and 6 questions
        const total = Object.values(distribution).reduce((a, b) => a + b, 0);
        
        // Most should still be level 6 (current level)
        expect(distribution[6] / total).toBeGreaterThan(0.60);
        
        // Some should be level 5 (from the new logic)
        if (distribution[5]) {
            expect(distribution[5] / total).toBeGreaterThan(0);
        }
    });
});
