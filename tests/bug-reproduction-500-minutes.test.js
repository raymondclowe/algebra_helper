const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Bug Reproduction: 500+ minutes on morning open', () => {
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

    test('Reproduces and verifies fix for 500+ minutes bug', async () => {
        // ===== NIGHT SESSION: User closes app around 10pm =====
        page = await browser.newPage();
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        await wait(2000);
        
        // Simulate some legitimate usage time (20 minutes)
        await page.evaluate(() => {
            localStorage.removeItem('algebraHelperDailyStats');
            const today = new Date().toDateString();
            localStorage.setItem('algebraHelperDailyStats', JSON.stringify({
                date: today,
                minutesSpent: 20
            }));
        });
        
        // User closes the app
        await page.close();
        
        // ===== MORNING SESSION: User opens app at 7am next day =====
        // Simulate this by setting yesterday's date in localStorage
        page = await browser.newPage();
        
        // Before navigating, set yesterday's data to simulate the overnight gap
        await page.evaluateOnNewDocument(() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toDateString();
            
            localStorage.setItem('algebraHelperDailyStats', JSON.stringify({
                date: yesterdayString,
                minutesSpent: 20
            }));
        });
        
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        await wait(3000); // Wait for initialization
        
        // Check the displayed time
        const todayMinutes = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        console.log(`Minutes displayed on morning open: ${todayMinutes}`);
        
        // THE BUG: Before fix, this would show 500+ minutes
        // AFTER FIX: Should show 0 or near 0 minutes
        expect(todayMinutes).toBeLessThan(1); // Should be 0, allowing small margin
        expect(todayMinutes).not.toBeGreaterThan(100); // Definitely not 500+
        
        // Verify yesterday's data was preserved
        const history = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('algebraHelperDailyHistory') || '{}');
        });
        
        const historyValues = Object.values(history);
        console.log(`History entries: ${historyValues.length}`);
        if (historyValues.length > 0) {
            console.log(`Yesterday's preserved minutes: ${historyValues[0].minutesSpent}`);
            expect(historyValues[0].minutesSpent).toBe(20);
        }
        
        await page.close();
    });

    test('Simulates stale session data causing inflated time', async () => {
        page = await browser.newPage();
        
        // Set up a scenario where lastDailySaveTime is very old
        await page.evaluateOnNewDocument(() => {
            const today = new Date().toDateString();
            
            localStorage.setItem('algebraHelperDailyStats', JSON.stringify({
                date: today,
                minutesSpent: 5 // Starting with 5 minutes
            }));
        });
        
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        await wait(2000);
        
        // Simulate stale lastDailySaveTime (5 hours old)
        await page.evaluate(() => {
            const fiveHoursAgo = Date.now() - (5 * 60 * 60 * 1000);
            ActivityTracker.lastDailySaveTime = fiveHoursAgo;
            ActivityTracker.isPaused = false;
        });
        
        await wait(1000);
        
        // Trigger save - this should NOT add 5 hours
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const minutesAfterSave = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        console.log(`Minutes after save with stale timestamp: ${minutesAfterSave}`);
        
        // Should still be around 5 minutes, not 5 + 300 (5 hours)
        expect(minutesAfterSave).toBeLessThan(10);
        expect(minutesAfterSave).not.toBeGreaterThan(50);
        
        await page.close();
    });

    test('Verifies constants are available to ActivityTracker', async () => {
        page = await browser.newPage();
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        await wait(2000);
        
        // Check that ActivityTracker can access the constants
        const constantsCheck = await page.evaluate(() => {
            // Check if the interval is set correctly (should be 60000ms)
            const hasInterval = ActivityTracker.dailySaveInterval !== null;
            
            // Try to access constants
            const canAccessConstants = typeof DAILY_SAVE_INTERVAL_MS !== 'undefined' &&
                                      typeof INACTIVITY_TIMEOUT_MS !== 'undefined';
            
            return {
                hasInterval,
                canAccessConstants,
                dailySaveIntervalValue: DAILY_SAVE_INTERVAL_MS,
                inactivityTimeoutValue: INACTIVITY_TIMEOUT_MS
            };
        });
        
        console.log('Constants check:', constantsCheck);
        
        expect(constantsCheck.hasInterval).toBe(true);
        expect(constantsCheck.canAccessConstants).toBe(true);
        expect(constantsCheck.dailySaveIntervalValue).toBe(60000);
        expect(constantsCheck.inactivityTimeoutValue).toBe(60000);
        
        await page.close();
    });
});
