const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Tab Visibility Time Tracking Tests', () => {
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

    test('ActivityTracker module is loaded', async () => {
        const hasActivityTracker = await page.evaluate(() => {
            return typeof ActivityTracker !== 'undefined';
        });
        expect(hasActivityTracker).toBe(true);
    });

    test('ActivityTracker pauses when tab is hidden', async () => {
        // Reset the tracker
        await page.evaluate(() => {
            ActivityTracker.reset();
            ActivityTracker.isPaused = false;
        });
        
        // Simulate tab becoming hidden
        await page.evaluate(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: true
            });
            document.dispatchEvent(new Event('visibilitychange'));
        });
        
        await wait(500);
        
        const isPaused = await page.evaluate(() => {
            return ActivityTracker.isPaused;
        });
        
        expect(isPaused).toBe(true);
    });

    test('ActivityTracker resumes when tab becomes visible', async () => {
        // First pause
        await page.evaluate(() => {
            ActivityTracker.reset();
            ActivityTracker.pause();
        });
        
        await wait(200);
        
        // Then resume
        await page.evaluate(() => {
            Object.defineProperty(document, 'hidden', {
                writable: true,
                configurable: true,
                value: false
            });
            document.dispatchEvent(new Event('visibilitychange'));
        });
        
        await wait(500);
        
        const isPaused = await page.evaluate(() => {
            return ActivityTracker.isPaused;
        });
        
        expect(isPaused).toBe(false);
    });

    test('ActivityTracker tracks away time separately', async () => {
        await page.evaluate(() => {
            ActivityTracker.reset();
        });
        
        await wait(1000);
        
        // Pause (simulate going away)
        await page.evaluate(() => {
            ActivityTracker.pause();
        });
        
        await wait(2000); // Away for 2 seconds
        
        // Resume
        await page.evaluate(() => {
            ActivityTracker.resume();
        });
        
        await wait(500);
        
        const awayTime = await page.evaluate(() => {
            return ActivityTracker.getAwayTime();
        });
        
        // Should have tracked approximately 2 seconds away time
        expect(awayTime).toBeGreaterThanOrEqual(1);
        expect(awayTime).toBeLessThanOrEqual(3);
    });

    test('Away time does not count towards active time', async () => {
        await page.evaluate(() => {
            ActivityTracker.reset();
        });
        
        // Active for 1 second
        await wait(1000);
        
        const activeTimeBefore = await page.evaluate(() => {
            return ActivityTracker.getActiveTime();
        });
        
        // Pause (go away)
        await page.evaluate(() => {
            ActivityTracker.pause();
        });
        
        // Wait 3 seconds while away
        await wait(3000);
        
        // Resume
        await page.evaluate(() => {
            ActivityTracker.resume();
        });
        
        await wait(100);
        
        const activeTimeAfter = await page.evaluate(() => {
            return ActivityTracker.getActiveTime();
        });
        
        // Active time should not have increased by 3 seconds (away time)
        // It should be roughly the same (1 second + small margin)
        const timeDiff = activeTimeAfter - activeTimeBefore;
        expect(timeDiff).toBeLessThan(2); // Should not include the 3 second away period
    });

    test('lastDailySaveTime is not updated when paused', async () => {
        await page.evaluate(() => {
            ActivityTracker.reset();
            ActivityTracker.lastDailySaveTime = Date.now();
        });
        
        const initialSaveTime = await page.evaluate(() => {
            return ActivityTracker.lastDailySaveTime;
        });
        
        // Pause the tracker
        await page.evaluate(() => {
            ActivityTracker.pause();
        });
        
        await wait(1000);
        
        // Try to save daily time while paused
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const saveTimeAfter = await page.evaluate(() => {
            return ActivityTracker.lastDailySaveTime;
        });
        
        // lastDailySaveTime should NOT have been updated (should be same as initial)
        expect(saveTimeAfter).toBe(initialSaveTime);
    });

    test('lastDailySaveTime is updated when active', async () => {
        await page.evaluate(() => {
            ActivityTracker.reset();
            ActivityTracker.isPaused = false;
            ActivityTracker.lastDailySaveTime = Date.now() - 5000; // Set to 5 seconds ago
        });
        
        const initialSaveTime = await page.evaluate(() => {
            return ActivityTracker.lastDailySaveTime;
        });
        
        await wait(500);
        
        // Save daily time while active
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const saveTimeAfter = await page.evaluate(() => {
            return ActivityTracker.lastDailySaveTime;
        });
        
        // lastDailySaveTime should have been updated
        expect(saveTimeAfter).toBeGreaterThan(initialSaveTime);
    });

    test('Away sessions are categorized correctly', async () => {
        // Test quick check (< 5 seconds)
        await page.evaluate(() => {
            ActivityTracker.reset();
            localStorage.removeItem('away_sessions');
            ActivityTracker.awaySessionStart = Date.now() - 3000; // 3 seconds ago
            ActivityTracker.isPaused = true;
            ActivityTracker.resume();
        });
        
        await wait(500);
        
        let sessions = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('away_sessions') || '[]');
        });
        
        expect(sessions.length).toBe(1);
        expect(sessions[0].type).toBe('quick_check');
        
        // Test short break (30s - 5 min)
        await page.evaluate(() => {
            localStorage.removeItem('away_sessions');
            ActivityTracker.awaySessionStart = Date.now() - 60000; // 60 seconds ago
            ActivityTracker.isPaused = true;
            ActivityTracker.resume();
        });
        
        await wait(500);
        
        sessions = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('away_sessions') || '[]');
        });
        
        expect(sessions.length).toBe(1);
        expect(sessions[0].type).toBe('short_break');
    });

    test('Away sessions are stored for analytics', async () => {
        await page.evaluate(() => {
            ActivityTracker.reset();
            localStorage.removeItem('away_sessions');
        });
        
        // Create multiple away sessions
        for (let i = 0; i < 3; i++) {
            await page.evaluate((index) => {
                ActivityTracker.awaySessionStart = Date.now() - (index + 1) * 1000;
                ActivityTracker.isPaused = true;
                ActivityTracker.resume();
            }, i);
            await wait(300);
        }
        
        const sessions = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('away_sessions') || '[]');
        });
        
        expect(sessions.length).toBeGreaterThanOrEqual(3);
        expect(sessions[0]).toHaveProperty('startTime');
        expect(sessions[0]).toHaveProperty('endTime');
        expect(sessions[0]).toHaveProperty('duration');
        expect(sessions[0]).toHaveProperty('type');
        expect(sessions[0]).toHaveProperty('date');
    });

    test('Away sessions log only keeps last 100 entries', async () => {
        // Create 105 away sessions
        await page.evaluate(() => {
            localStorage.removeItem('away_sessions');
            const sessions = [];
            for (let i = 0; i < 105; i++) {
                sessions.push({
                    startTime: Date.now() - i * 1000,
                    endTime: Date.now() - i * 1000 + 500,
                    duration: 1,
                    type: 'quick_check',
                    date: new Date().toISOString()
                });
            }
            localStorage.setItem('away_sessions', JSON.stringify(sessions));
            
            // Now trigger a new away session
            ActivityTracker.awaySessionStart = Date.now() - 2000;
            ActivityTracker.isPaused = true;
            ActivityTracker.resume();
        });
        
        await wait(500);
        
        const sessions = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('away_sessions') || '[]');
        });
        
        // Should be capped at 100
        expect(sessions.length).toBe(100);
    });

    test('ActivityTracker getAwayTime returns current away duration when paused', async () => {
        await page.evaluate(() => {
            ActivityTracker.reset();
            ActivityTracker.pause();
        });
        
        await wait(2000); // Wait 2 seconds
        
        const awayTime = await page.evaluate(() => {
            return ActivityTracker.getAwayTime();
        });
        
        // Should include current away session time (approximately 2 seconds)
        expect(awayTime).toBeGreaterThanOrEqual(1);
        expect(awayTime).toBeLessThanOrEqual(3);
    });

    test('ActivityTracker getFormattedAwayTime returns proper format', async () => {
        await page.evaluate(() => {
            ActivityTracker.reset();
            ActivityTracker.totalAwayTime = 125000; // 2 minutes 5 seconds in milliseconds
        });
        
        const formattedTime = await page.evaluate(() => {
            return ActivityTracker.getFormattedAwayTime();
        });
        
        expect(formattedTime).toMatch(/2m 5s/);
    });

    test('Console logs away duration when resuming', async () => {
        const consoleLogs = [];
        page.on('console', msg => {
            if (msg.type() === 'log') {
                consoleLogs.push(msg.text());
            }
        });
        
        await page.evaluate(() => {
            ActivityTracker.reset();
            ActivityTracker.awaySessionStart = Date.now() - 5000; // 5 seconds ago
            ActivityTracker.isPaused = true;
            ActivityTracker.resume();
        });
        
        await wait(500);
        
        const hasAwayLog = consoleLogs.some(log => log.includes('User was away for'));
        expect(hasAwayLog).toBe(true);
    });
});
