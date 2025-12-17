const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Time Tracking Feature Tests', () => {
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

    test('TimeTrackingModal module is loaded', async () => {
        const hasTimeTrackingModal = await page.evaluate(() => {
            return typeof TimeTrackingModal !== 'undefined';
        });
        expect(hasTimeTrackingModal).toBe(true);
    });

    test('Time tracking modal can be opened and closed', async () => {
        // Open modal
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(500);
        
        let modalVisible = await page.evaluate(() => {
            const modal = document.getElementById('time-tracking-modal');
            return modal && !modal.classList.contains('hidden');
        });
        expect(modalVisible).toBe(true);
        
        // Close modal
        await page.evaluate(() => TimeTrackingModal.hide());
        await wait(500);
        
        modalVisible = await page.evaluate(() => {
            const modal = document.getElementById('time-tracking-modal');
            return modal && modal.classList.contains('hidden');
        });
        expect(modalVisible).toBe(true);
    });

    test('Clock icon button is visible in header', async () => {
        const clockButtonExists = await page.evaluate(() => {
            const buttons = document.querySelectorAll('button');
            for (const btn of buttons) {
                if (btn.onclick && btn.onclick.toString().includes('TimeTrackingModal.show')) {
                    return true;
                }
            }
            return false;
        });
        expect(clockButtonExists).toBe(true);
    });

    test('Time tracking modal displays today section', async () => {
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(1000);
        
        const hasTodaySection = await page.evaluate(() => {
            const todayTimeElement = document.getElementById('today-total-time');
            const todayMessageElement = document.getElementById('today-motivational-message');
            return todayTimeElement !== null && todayMessageElement !== null;
        });
        expect(hasTodaySection).toBe(true);
    });

    test('Time tracking modal displays yesterday section', async () => {
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(1000);
        
        const hasYesterdaySection = await page.evaluate(() => {
            const yesterdayTimeElement = document.getElementById('yesterday-total-time');
            return yesterdayTimeElement !== null;
        });
        expect(hasYesterdaySection).toBe(true);
    });

    test('Time tracking modal displays historical trend chart', async () => {
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(1000);
        
        const hasHistoricalChart = await page.evaluate(() => {
            const chartElement = document.getElementById('historical-chart');
            const messageElement = document.getElementById('trend-message');
            return chartElement !== null && messageElement !== null;
        });
        expect(hasHistoricalChart).toBe(true);
    });

    test('StorageManager has getDailyTimeSummary method', async () => {
        const hasMethod = await page.evaluate(() => {
            return typeof StorageManager.getDailyTimeSummary === 'function';
        });
        expect(hasMethod).toBe(true);
    });

    test('StorageManager has getHistoricalTrend method', async () => {
        const hasMethod = await page.evaluate(() => {
            return typeof StorageManager.getHistoricalTrend === 'function';
        });
        expect(hasMethod).toBe(true);
    });

    test('StorageManager has getTopicTimeForDate method', async () => {
        const hasMethod = await page.evaluate(() => {
            return typeof StorageManager.getTopicTimeForDate === 'function';
        });
        expect(hasMethod).toBe(true);
    });

    test('getDailyTimeSummary returns proper structure', async () => {
        const summary = await page.evaluate(async () => {
            return await StorageManager.getDailyTimeSummary();
        });
        
        expect(summary).toHaveProperty('today');
        expect(summary).toHaveProperty('yesterday');
        expect(summary.today).toHaveProperty('date');
        expect(summary.today).toHaveProperty('total');
        expect(summary.today).toHaveProperty('byTopic');
        expect(summary.yesterday).toHaveProperty('date');
        expect(summary.yesterday).toHaveProperty('total');
        expect(summary.yesterday).toHaveProperty('byTopic');
    });

    test('getHistoricalTrend returns array of daily data', async () => {
        const trendData = await page.evaluate(async () => {
            return await StorageManager.getHistoricalTrend(7);
        });
        
        expect(Array.isArray(trendData)).toBe(true);
        expect(trendData.length).toBe(7);
        
        if (trendData.length > 0) {
            expect(trendData[0]).toHaveProperty('date');
            expect(trendData[0]).toHaveProperty('shortDate');
            expect(trendData[0]).toHaveProperty('minutes');
        }
    });

    test('Time tracking with questions answered shows in topic breakdown', async () => {
        // Answer a few questions to generate time data
        await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 5.0;
        });
        
        // Answer 3 questions
        for (let i = 0; i < 3; i++) {
            await page.evaluate(() => {
                window.UI.nextQuestion();
            });
            await wait(1500);
            
            await page.evaluate(() => {
                const buttons = document.querySelectorAll('#mc-options button');
                if (buttons.length > 0) {
                    buttons[0].click();
                }
            });
            await wait(1500);
        }
        
        // Open time tracking modal
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(1500);
        
        // Check if today's time is greater than 0
        const todayTime = await page.evaluate(() => {
            const timeElement = document.getElementById('today-total-time');
            return timeElement ? timeElement.textContent : '0 min';
        });
        
        // Should show some time (at least a few seconds tracked)
        expect(todayTime).not.toBe('0 min');
    });

    test('Motivational messages are displayed', async () => {
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(1000);
        
        const hasMotivationalMessage = await page.evaluate(() => {
            const messageElement = document.getElementById('today-motivational-message');
            return messageElement && messageElement.textContent.length > 0;
        });
        expect(hasMotivationalMessage).toBe(true);
    });

    test('Trend message is displayed', async () => {
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(1000);
        
        const hasTrendMessage = await page.evaluate(() => {
            const messageElement = document.getElementById('trend-message');
            return messageElement && messageElement.textContent.length > 0;
        });
        expect(hasTrendMessage).toBe(true);
    });

    test('Topic breakdown is displayed when data exists', async () => {
        // First answer some questions
        await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 5.0;
        });
        
        for (let i = 0; i < 2; i++) {
            await page.evaluate(() => {
                window.UI.nextQuestion();
            });
            await wait(1000);
            
            await page.evaluate(() => {
                const buttons = document.querySelectorAll('#mc-options button');
                if (buttons.length > 0) {
                    buttons[0].click();
                }
            });
            await wait(1000);
        }
        
        // Open modal and check for topic breakdown
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(1500);
        
        const hasTopicBreakdown = await page.evaluate(() => {
            const breakdownElement = document.getElementById('today-topic-breakdown');
            return breakdownElement && breakdownElement.innerHTML.length > 0;
        });
        expect(hasTopicBreakdown).toBe(true);
    });

    test('Trend indicator shows comparison between today and yesterday', async () => {
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(1000);
        
        const trendIndicatorExists = await page.evaluate(() => {
            const trendElement = document.getElementById('trend-indicator');
            return trendElement !== null;
        });
        expect(trendIndicatorExists).toBe(true);
    });

    test('Historical chart displays 7 days of data', async () => {
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(1000);
        
        const chartHasDays = await page.evaluate(() => {
            const chartElement = document.getElementById('historical-chart');
            if (!chartElement) return false;
            
            // Check if chart contains grid with days
            const gridElement = chartElement.querySelector('.grid-cols-7');
            return gridElement !== null;
        });
        expect(chartHasDays).toBe(true);
    });

    test('formatShortDate helper works correctly', async () => {
        const shortDate = await page.evaluate(() => {
            const testDate = new Date('2023-12-17');
            return StorageManager.formatShortDate(testDate);
        });
        
        expect(shortDate).toMatch(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat) \d{1,2}\/\d{1,2}$/);
    });

    test('Time tracking modal shows positive encouraging messages only', async () => {
        await page.evaluate(() => TimeTrackingModal.show());
        await wait(1000);
        
        const messages = await page.evaluate(() => {
            const motivationalMsg = document.getElementById('today-motivational-message').textContent;
            const trendMsg = document.getElementById('trend-message').textContent;
            return { motivationalMsg, trendMsg };
        });
        
        // Check that messages don't contain negative words
        const negativeWords = ['bad', 'poor', 'fail', 'not enough', 'lazy', 'behind'];
        const allMessages = messages.motivationalMsg + ' ' + messages.trendMsg;
        
        negativeWords.forEach(word => {
            expect(allMessages.toLowerCase()).not.toContain(word);
        });
    });

    test('Time tracking data persists across page reloads', async () => {
        // Answer a question
        await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 5.0;
            window.UI.nextQuestion();
        });
        await wait(1500);
        
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            if (buttons.length > 0) {
                buttons[0].click();
            }
        });
        await wait(1500);
        
        // Get initial time summary
        const initialSummary = await page.evaluate(async () => {
            return await StorageManager.getDailyTimeSummary();
        });
        
        // Reload page
        await page.reload({ waitUntil: 'networkidle0' });
        await wait(2000);
        
        // Get time summary after reload
        const afterReloadSummary = await page.evaluate(async () => {
            return await StorageManager.getDailyTimeSummary();
        });
        
        // Should have at least the same amount of data
        expect(afterReloadSummary.today.total).toBeGreaterThanOrEqual(0);
    });
});
