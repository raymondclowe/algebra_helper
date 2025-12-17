const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Stats Tracking Tests', () => {
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

    test('Activity tracker module is loaded', async () => {
        const hasActivityTracker = await page.evaluate(() => {
            return typeof ActivityTracker !== 'undefined';
        });
        expect(hasActivityTracker).toBe(true);
    });

    test('Storage manager module is loaded', async () => {
        const hasStorageManager = await page.evaluate(() => {
            return typeof StorageManager !== 'undefined';
        });
        expect(hasStorageManager).toBe(true);
    });

    test('Stats modal module is loaded', async () => {
        const hasStatsModal = await page.evaluate(() => {
            return typeof StatsModal !== 'undefined';
        });
        expect(hasStatsModal).toBe(true);
    });

    test('Stats icon is visible in UI', async () => {
        const statsIconExists = await page.evaluate(() => {
            const buttons = document.querySelectorAll('button');
            for (const btn of buttons) {
                if (btn.onclick && btn.onclick.toString().includes('StatsModal.show')) {
                    return true;
                }
            }
            return false;
        });
        expect(statsIconExists).toBe(true);
    });

    test('Navigation arrows are present', async () => {
        const hasNavigationButtons = await page.evaluate(() => {
            const leftBtn = document.getElementById('history-nav-left');
            const rightBtn = document.getElementById('history-nav-right');
            return leftBtn !== null && rightBtn !== null;
        });
        expect(hasNavigationButtons).toBe(true);
    });

    test('Stats modal can be opened and closed', async () => {
        // Open modal
        await page.evaluate(() => StatsModal.show());
        await wait(500);
        
        let modalVisible = await page.evaluate(() => {
            const modal = document.getElementById('stats-modal');
            return modal && !modal.classList.contains('hidden');
        });
        expect(modalVisible).toBe(true);
        
        // Close modal
        await page.evaluate(() => StatsModal.hide());
        await wait(500);
        
        modalVisible = await page.evaluate(() => {
            const modal = document.getElementById('stats-modal');
            return modal && modal.classList.contains('hidden');
        });
        expect(modalVisible).toBe(true);
    });

    test('Activity tracker measures time', async () => {
        // Get initial time
        const initialTime = await page.evaluate(() => ActivityTracker.getActiveTime());
        
        // Wait 3 seconds
        await wait(3000);
        
        // Get time again
        const afterTime = await page.evaluate(() => ActivityTracker.getActiveTime());
        
        // Should have tracked at least 2 seconds (allowing for some variance)
        expect(afterTime - initialTime).toBeGreaterThanOrEqual(2);
    });

    test('Questions are saved in drill mode', async () => {
        // Force drill mode
        await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 5.0;
            window.UI.nextQuestion();
        });
        await wait(2000);
        
        // Answer a question
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            if (buttons.length > 0) {
                buttons[0].click();
            }
        });
        await wait(2000);
        
        // Check if question was saved
        const questionCount = await page.evaluate(async () => {
            return await StorageManager.getQuestionCount();
        });
        
        expect(questionCount).toBeGreaterThan(0);
    });

    test('Stats are updated when questions are answered', async () => {
        // Force drill mode and answer a question
        await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 5.0;
            window.UI.nextQuestion();
        });
        await wait(2000);
        
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            if (buttons.length > 0) {
                buttons[0].click();
            }
        });
        await wait(2000);
        
        // Get stats
        const stats = await page.evaluate(() => {
            return StorageManager.getStats();
        });
        
        expect(stats.totalQuestions).toBeGreaterThan(0);
    });

    test('History navigation works', async () => {
        // Force drill mode and answer questions to create history
        await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 5.0;
            window.UI.nextQuestion();
        });
        await wait(2000);
        
        // Answer first question
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            if (buttons.length > 0) {
                buttons[0].click();
            }
        });
        await wait(2000);
        
        // Move to next question
        await page.evaluate(() => {
            window.UI.nextQuestion();
        });
        await wait(2000);
        
        // Navigate to history
        await page.evaluate(() => {
            window.UI.navigateHistory(1);
        });
        await wait(1000);
        
        // Check if viewing history
        const isViewingHistory = await page.evaluate(() => {
            return window.APP.isViewingHistory;
        });
        
        expect(isViewingHistory).toBe(true);
    });

    test('State includes history navigation fields', async () => {
        const stateHasHistoryFields = await page.evaluate(() => {
            return 'isViewingHistory' in window.APP && 
                   'historyIndex' in window.APP && 
                   'questionHistory' in window.APP;
        });
        expect(stateHasHistoryFields).toBe(true);
    });

    test('Topic definitions module is loaded', async () => {
        const hasTopicDefinitions = await page.evaluate(() => {
            return typeof TopicDefinitions !== 'undefined';
        });
        expect(hasTopicDefinitions).toBe(true);
    });

    test('Topics are assigned to questions', async () => {
        const hasTopic = await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.APP.level = 5.0;
            const question = Generator.getQuestion(5.0);
            return question.topic && question.topic.length > 0;
        });
        expect(hasTopic).toBe(true);
    });

    test('Storage manager can calculate topic stats', async () => {
        const hasTopicStatsMethod = await page.evaluate(() => {
            return typeof StorageManager.getTopicStats === 'function';
        });
        expect(hasTopicStatsMethod).toBe(true);
    });

    test('Daily stats tracking is available', async () => {
        const hasDailyStats = await page.evaluate(() => {
            return typeof StorageManager.getDailyStats === 'function' &&
                   typeof StorageManager.updateDailyStats === 'function';
        });
        expect(hasDailyStats).toBe(true);
    });

    test('Stats modal shows time spent today', async () => {
        await page.evaluate(() => StatsModal.init());
        await page.evaluate(() => StatsModal.show());
        await wait(1000);
        
        const hasTimeDisplay = await page.evaluate(() => {
            const timeElement = document.getElementById('stat-today-minutes');
            return timeElement && timeElement.textContent.includes('min');
        });
        expect(hasTimeDisplay).toBe(true);
    });

    test('Stats modal shows topic progress section', async () => {
        await page.evaluate(() => StatsModal.init());
        await page.evaluate(() => StatsModal.show());
        await wait(1000);
        
        const hasTopicProgress = await page.evaluate(() => {
            const topicElement = document.getElementById('topic-progress');
            return topicElement !== null;
        });
        expect(hasTopicProgress).toBe(true);
    });
});
