const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Cross-Session Time Tracking Tests', () => {
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
        await wait(2000);
    });

    afterEach(async () => {
        await page.close();
    });

    test('Constants are loaded before ActivityTracker', async () => {
        const constantsAvailable = await page.evaluate(() => {
            return {
                dailySaveInterval: typeof DAILY_SAVE_INTERVAL_MS !== 'undefined',
                inactivityTimeout: typeof INACTIVITY_TIMEOUT_MS !== 'undefined',
                awayQuickCheck: typeof AWAY_SESSION_QUICK_CHECK_THRESHOLD !== 'undefined',
                maxAwaySessions: typeof MAX_AWAY_SESSIONS !== 'undefined'
            };
        });
        
        expect(constantsAvailable.dailySaveInterval).toBe(true);
        expect(constantsAvailable.inactivityTimeout).toBe(true);
        expect(constantsAvailable.awayQuickCheck).toBe(true);
        expect(constantsAvailable.maxAwaySessions).toBe(true);
    });

    test('Opening page with yesterday\'s stats should reset to 0 minutes today', async () => {
        // Set up yesterday's stats in localStorage
        await page.evaluate(() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toDateString();
            
            localStorage.setItem('algebraHelperDailyStats', JSON.stringify({
                date: yesterdayString,
                minutesSpent: 500 // Simulating the bug: 500 minutes from yesterday
            }));
        });
        
        // Reload the page to trigger initialization
        await page.reload({ waitUntil: 'networkidle0' });
        await wait(2000);
        
        // Check that today's minutes are 0, not 500
        const todayMinutes = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        expect(todayMinutes).toBe(0);
    });

    test('Opening page with today\'s stats should preserve them', async () => {
        // Set up today's stats
        await page.evaluate(() => {
            const today = new Date().toDateString();
            
            localStorage.setItem('algebraHelperDailyStats', JSON.stringify({
                date: today,
                minutesSpent: 15
            }));
        });
        
        // Reload the page
        await page.reload({ waitUntil: 'networkidle0' });
        await wait(2000);
        
        // Check that today's minutes are preserved
        const todayMinutes = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        expect(todayMinutes).toBe(15);
    });

    test('Stale lastDailySaveTime (>2 hours old) should not add time', async () => {
        // Clear daily stats and set up stale lastDailySaveTime
        await page.evaluate(() => {
            localStorage.removeItem('algebraHelperDailyStats');
            ActivityTracker.reset();
            
            // Set lastDailySaveTime to 3 hours ago (stale)
            const threeHoursAgo = Date.now() - (3 * 60 * 60 * 1000);
            ActivityTracker.lastDailySaveTime = threeHoursAgo;
            ActivityTracker.isPaused = false;
        });
        
        await wait(1000);
        
        // Try to save daily time - it should reset and not count the 3 hours
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const minutesSpent = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        // Should be 0 or very small (definitely not 180 minutes)
        expect(minutesSpent).toBeLessThan(1);
    });

    test('Fresh lastDailySaveTime (<2 hours old) should add time normally', async () => {
        // Clear daily stats
        await page.evaluate(() => {
            localStorage.removeItem('algebraHelperDailyStats');
            ActivityTracker.reset();
            
            // Set lastDailySaveTime to 5 seconds ago (fresh)
            ActivityTracker.lastDailySaveTime = Date.now() - 5000;
            ActivityTracker.isPaused = false;
        });
        
        await wait(500);
        
        // Save daily time - it should count the ~5 seconds
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const minutesSpent = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        // Should have added approximately 5 seconds (~0.083 minutes)
        expect(minutesSpent).toBeGreaterThan(0.05);
        expect(minutesSpent).toBeLessThan(0.15);
    });

    test('Opening page in morning should not show 500+ minutes', async () => {
        // Simulate closing the app last night with some time tracked
        await page.evaluate(() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toDateString();
            
            // Set yesterday's stats
            localStorage.setItem('algebraHelperDailyStats', JSON.stringify({
                date: yesterdayString,
                minutesSpent: 25 // Normal usage
            }));
            
            // Also set historical stats
            const history = {};
            history[yesterdayString] = {
                minutesSpent: 25,
                date: yesterdayString,
                timestamp: Date.now() - (12 * 60 * 60 * 1000) // 12 hours ago
            };
            localStorage.setItem('algebraHelperDailyHistory', JSON.stringify(history));
        });
        
        // Reload page (simulating opening in the morning)
        await page.reload({ waitUntil: 'networkidle0' });
        await wait(2000);
        
        // Wait a bit to ensure ActivityTracker initializes
        await wait(1000);
        
        // Check today's minutes - should be 0 or very small
        const todayMinutes = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        // Should be 0 (or near 0 from the wait time), definitely not 500+
        expect(todayMinutes).toBeLessThan(2);
    });

    test('Yesterday\'s data should be preserved in history', async () => {
        // Set up yesterday's stats
        await page.evaluate(() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toDateString();
            
            localStorage.setItem('algebraHelperDailyStats', JSON.stringify({
                date: yesterdayString,
                minutesSpent: 30
            }));
        });
        
        // Reload page to trigger day change logic
        await page.reload({ waitUntil: 'networkidle0' });
        await wait(2000);
        
        // Check that history was updated
        const history = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('algebraHelperDailyHistory') || '{}');
        });
        
        // History should contain yesterday's data
        const historyKeys = Object.keys(history);
        expect(historyKeys.length).toBeGreaterThan(0);
    });

    test('Multiple page opens in same day should accumulate time correctly', async () => {
        // First session - track some time
        await page.evaluate(() => {
            localStorage.removeItem('algebraHelperDailyStats');
            ActivityTracker.reset();
        });
        
        await wait(2000);
        
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const firstSessionMinutes = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        // Reload page (simulating closing and reopening)
        await page.reload({ waitUntil: 'networkidle0' });
        await wait(2000);
        
        // Wait and save more time
        await wait(2000);
        
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const secondSessionMinutes = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        // Second session should have more time than first
        expect(secondSessionMinutes).toBeGreaterThan(firstSessionMinutes);
        
        // But should be reasonable (not hundreds of minutes)
        expect(secondSessionMinutes).toBeLessThan(1); // Less than 1 minute total
    });

    test('Constants are properly exported to window scope', async () => {
        const windowConstants = await page.evaluate(() => {
            return {
                dailySaveInterval: window.DAILY_SAVE_INTERVAL_MS,
                inactivityTimeout: window.INACTIVITY_TIMEOUT_MS,
                awayQuickCheck: window.AWAY_SESSION_QUICK_CHECK_THRESHOLD,
                awayBriefDistraction: window.AWAY_SESSION_BRIEF_DISTRACTION_THRESHOLD,
                awayShortBreak: window.AWAY_SESSION_SHORT_BREAK_THRESHOLD,
                maxAwaySessions: window.MAX_AWAY_SESSIONS
            };
        });
        
        expect(windowConstants.dailySaveInterval).toBe(60000); // 60 seconds
        expect(windowConstants.inactivityTimeout).toBe(60000); // 1 minute
        expect(windowConstants.awayQuickCheck).toBe(5);
        expect(windowConstants.awayBriefDistraction).toBe(30);
        expect(windowConstants.awayShortBreak).toBe(300);
        expect(windowConstants.maxAwaySessions).toBe(100);
    });
});
