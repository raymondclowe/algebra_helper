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

    test('Away time is not counted in daily stats', async () => {
        // Clear daily stats
        await page.evaluate(() => {
            localStorage.removeItem('algebraHelperDailyStats');
            ActivityTracker.reset();
            ActivityTracker.lastDailySaveTime = Date.now();
        });
        
        // Be active for 2 seconds
        await wait(2000);
        
        // Save daily time while active
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const activeMinutes = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        // Should have tracked approximately 2 seconds (0.033 minutes)
        expect(activeMinutes).toBeGreaterThan(0.02);
        expect(activeMinutes).toBeLessThan(0.05);
        
        // Pause (simulate going away)
        await page.evaluate(() => {
            ActivityTracker.pause();
        });
        
        // Wait 5 seconds while away
        await wait(5000);
        
        // Try to save daily time while paused (should not add time)
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const minutesAfterPause = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        // Should be the same as before (no additional time added during pause)
        expect(minutesAfterPause).toBeCloseTo(activeMinutes, 2);
        
        // Resume
        await page.evaluate(() => {
            ActivityTracker.resume();
        });
        
        // Wait 2 seconds after resume
        await wait(2000);
        
        // Save daily time after resume
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const minutesAfterResume = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        // Should have added approximately 2 more seconds (0.033 minutes)
        // but NOT the 5 seconds of away time
        const addedMinutes = minutesAfterResume - minutesAfterPause;
        expect(addedMinutes).toBeGreaterThan(0.02);
        expect(addedMinutes).toBeLessThan(0.05);
        
        // Total should be around 4 seconds (0.067 minutes), not 9 seconds
        expect(minutesAfterResume).toBeLessThan(0.1);
    });

    test('lastDailySaveTime is reset when resuming from pause', async () => {
        await page.evaluate(() => {
            ActivityTracker.reset();
            ActivityTracker.lastDailySaveTime = Date.now() - 10000; // 10 seconds ago
        });
        
        const initialSaveTime = await page.evaluate(() => {
            return ActivityTracker.lastDailySaveTime;
        });
        
        // Pause
        await page.evaluate(() => {
            ActivityTracker.pause();
        });
        
        await wait(2000); // Wait while paused
        
        // Resume
        const resumeTime = await page.evaluate(() => {
            const now = Date.now();
            ActivityTracker.resume();
            return now;
        });
        
        await wait(100);
        
        const saveTimeAfterResume = await page.evaluate(() => {
            return ActivityTracker.lastDailySaveTime;
        });
        
        // lastDailySaveTime should have been reset to current time when resuming
        expect(saveTimeAfterResume).toBeGreaterThan(initialSaveTime);
        expect(saveTimeAfterResume).toBeGreaterThanOrEqual(resumeTime - 100); // Allow 100ms margin
    });

    test('Inactive time beyond 1 minute is not counted in daily stats', async () => {
        // Clear daily stats and setup
        const initialTime = await page.evaluate(() => {
            localStorage.removeItem('algebraHelperDailyStats');
            ActivityTracker.reset();
            const now = Date.now();
            return now;
        });
        
        // Wait a bit to accumulate some time
        await wait(2000);
        
        // Save daily time (should add ~2 seconds)
        await page.evaluate(() => {
            ActivityTracker.saveDailyTime();
        });
        
        const minutesAfterFirstSave = await page.evaluate(() => {
            const stats = StorageManager.getDailyStats();
            return stats.minutesSpent;
        });
        
        // Should have tracked approximately 2 seconds (~0.033 minutes)
        expect(minutesAfterFirstSave).toBeGreaterThan(0.02);
        expect(minutesAfterFirstSave).toBeLessThan(0.1);
        
        // Now simulate user being inactive for 90 seconds (1.5 minutes) from NOW
        // Set lastActivityTime to 90 seconds before current time
        // Set lastDailySaveTime to 90 seconds before current time
        const result = await page.evaluate(() => {
            const now = Date.now();
            ActivityTracker.lastActivityTime = now - 90000; // 90 seconds ago
            ActivityTracker.lastDailySaveTime = now - 90000; // 90 seconds ago
            
            // Now call saveDailyTime - it should only count 60 seconds (1 minute)
            ActivityTracker.saveDailyTime();
            
            const stats = StorageManager.getDailyStats();
            return {
                minutesSpent: stats.minutesSpent,
                lastActivityTime: ActivityTracker.lastActivityTime,
                lastDailySaveTime: ActivityTracker.lastDailySaveTime,
                now: now
            };
        });
        
        // Should have added 1 minute (not 1.5 minutes)
        const addedMinutes = result.minutesSpent - minutesAfterFirstSave;
        
        // The key test: added time should be close to 1 minute (not 1.5 minutes)
        expect(addedMinutes).toBeGreaterThan(0.95); // Should be close to 1 minute
        expect(addedMinutes).toBeLessThanOrEqual(1.05); // 1 minute + small margin
        
        // Total should not exceed the first save + 1 minute
        expect(result.minutesSpent).toBeLessThan(minutesAfterFirstSave + 1.1);
    });
});
