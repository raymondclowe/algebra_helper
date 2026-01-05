const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Attempt Tracking Tests', () => {
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
        
        // Wait for MathJax and app to initialize
        await page.waitForFunction(() => {
            return typeof window.MathJax !== 'undefined' && 
                   typeof window.APP !== 'undefined' &&
                   window.APP.currentQ !== null;
        }, { timeout: 5000 });
        
        // Clear any existing data
        await page.evaluate(() => {
            return window.StorageManager.clearAllData();
        });
    });

    afterEach(async () => {
        await page.close();
    });

    test('attemptNumber is initialized to 0 when question is shown', async () => {
        await page.evaluate(() => {
            APP.mode = 'learning';
            APP.level = 5.0;
            UI.nextQuestion();
        });
        
        await wait(1000);
        
        const attemptNumber = await page.evaluate(() => {
            return APP.currentQ.attemptNumber;
        });
        
        expect(attemptNumber).toBe(0);
    });

    test('attemptNumber increments to 1 on first answer attempt', async () => {
        await page.evaluate(() => {
            APP.mode = 'learning';
            APP.level = 5.0;
            UI.nextQuestion();
        });
        
        await wait(1500);
        
        // Click any answer button
        const clicked = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            if (buttons.length > 0) {
                // Click the first non-"don't know" button
                for (let btn of buttons) {
                    if (!btn.dataset.dontKnow || btn.dataset.dontKnow === 'false') {
                        btn.click();
                        return true;
                    }
                }
            }
            return false;
        });
        
        expect(clicked).toBe(true);
        
        await wait(500);
        
        const attemptNumber = await page.evaluate(() => {
            return APP.currentQ.attemptNumber;
        });
        
        expect(attemptNumber).toBe(1);
    });

    test('correct answer on first try is saved with attemptNumber 1', async () => {
        await page.evaluate(() => {
            APP.mode = 'learning';
            APP.level = 5.0;
            UI.nextQuestion();
        });
        
        await wait(1500);
        
        // Click the correct answer
        const saved = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'true') {
                    btn.click();
                    return true;
                }
            }
            return false;
        });
        
        expect(saved).toBe(true);
        
        await wait(2000); // Wait for save to complete
        
        // Check that it was saved with attemptNumber 1
        const savedData = await page.evaluate(async () => {
            const questions = await StorageManager.getAllQuestions();
            const lastQuestion = questions[questions.length - 1];
            return {
                attemptNumber: lastQuestion.attemptNumber,
                isCorrect: lastQuestion.isCorrect,
                isDontKnow: lastQuestion.isDontKnow
            };
        });
        
        expect(savedData.attemptNumber).toBe(1);
        expect(savedData.isCorrect).toBe(true);
        expect(savedData.isDontKnow).toBe(false);
    });

    test('"don\'t know" is saved with attemptNumber', async () => {
        await page.evaluate(() => {
            APP.mode = 'learning';
            APP.level = 5.0;
            UI.nextQuestion();
        });
        
        await wait(1500);
        
        // Click "I don't know" button
        const clicked = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            for (let btn of buttons) {
                if (btn.dataset.dontKnow === 'true') {
                    btn.click();
                    return true;
                }
            }
            return false;
        });
        
        expect(clicked).toBe(true);
        
        await wait(2000); // Wait for save
        
        // Check that it was saved with attemptNumber and isDontKnow flag
        const savedData = await page.evaluate(async () => {
            const questions = await StorageManager.getAllQuestions();
            const lastQuestion = questions[questions.length - 1];
            return {
                attemptNumber: lastQuestion.attemptNumber,
                isDontKnow: lastQuestion.isDontKnow,
                isCorrect: lastQuestion.isCorrect
            };
        });
        
        expect(savedData.attemptNumber).toBe(1);
        expect(savedData.isDontKnow).toBe(true);
        expect(savedData.isCorrect).toBe(false);
    });

    test('getAttemptStats returns correct statistics', async () => {
        // Add some test data directly
        await page.evaluate(async () => {
            APP.mode = 'learning';
            
            // Simulate right first time
            await StorageManager.saveQuestion({
                question: 'test1',
                correctAnswer: 'A',
                chosenAnswer: 'A',
                isCorrect: true,
                isDontKnow: false,
                attemptNumber: 1,
                datetime: Date.now(),
                topic: 'Test',
                level: 5
            });
            
            // Simulate right second try
            await StorageManager.saveQuestion({
                question: 'test2',
                correctAnswer: 'B',
                chosenAnswer: 'B',
                isCorrect: true,
                isDontKnow: false,
                attemptNumber: 2,
                datetime: Date.now(),
                topic: 'Test',
                level: 5
            });
            
            // Simulate don't know
            await StorageManager.saveQuestion({
                question: 'test3',
                correctAnswer: 'C',
                chosenAnswer: "I don't know",
                isCorrect: false,
                isDontKnow: true,
                attemptNumber: 1,
                datetime: Date.now(),
                topic: 'Test',
                level: 5
            });
            
            // Simulate wrong on second attempt
            await StorageManager.saveQuestion({
                question: 'test4',
                correctAnswer: 'D',
                chosenAnswer: 'wrong',
                isCorrect: false,
                isDontKnow: false,
                attemptNumber: 2,
                datetime: Date.now(),
                topic: 'Test',
                level: 5
            });
        });
        
        await wait(500);
        
        const stats = await page.evaluate(async () => {
            return await StorageManager.getAttemptStats();
        });
        
        expect(stats.rightFirstTime).toBe(1);
        expect(stats.rightSecondTry).toBe(1);
        expect(stats.dontKnow).toBe(1);
        expect(stats.wrongMultipleTimes).toBe(1);
        expect(stats.totalAnswered).toBe(4);
    });

    test('attempt stats display section appears in stats modal', async () => {
        // Initialize stats modal
        await page.evaluate(() => {
            if (window.StatsModal && window.StatsModal.init) {
                window.StatsModal.init();
            }
        });
        
        await wait(500);
        
        // Check that the attempt stats container exists
        const hasAttemptStatsContainer = await page.evaluate(() => {
            const container = document.getElementById('attempt-stats-container');
            return container !== null;
        });
        
        expect(hasAttemptStatsContainer).toBe(true);
    });

    test('attempt stats are displayed correctly in modal', async () => {
        // Add test data
        await page.evaluate(async () => {
            APP.mode = 'learning';
            
            // Add 10 right first time
            for (let i = 0; i < 10; i++) {
                await StorageManager.saveQuestion({
                    question: `test${i}`,
                    correctAnswer: 'A',
                    chosenAnswer: 'A',
                    isCorrect: true,
                    isDontKnow: false,
                    attemptNumber: 1,
                    datetime: Date.now() + i,
                    topic: 'Test',
                    level: 5
                });
            }
            
            // Add 5 don't know
            for (let i = 10; i < 15; i++) {
                await StorageManager.saveQuestion({
                    question: `test${i}`,
                    correctAnswer: 'B',
                    chosenAnswer: "I don't know",
                    isCorrect: false,
                    isDontKnow: true,
                    attemptNumber: 1,
                    datetime: Date.now() + i,
                    topic: 'Test',
                    level: 5
                });
            }
        });
        
        await wait(500);
        
        // Open stats modal
        await page.evaluate(() => {
            if (window.StatsModal) {
                window.StatsModal.show();
            }
        });
        
        await wait(1500);
        
        // Check displayed values
        const displayedStats = await page.evaluate(() => {
            return {
                rightFirst: document.getElementById('attempt-right-first')?.textContent || '0',
                dontKnow: document.getElementById('attempt-dont-know')?.textContent || '0',
                total: document.getElementById('attempt-total')?.textContent || '0',
                rightFirstPercent: document.getElementById('attempt-right-first-percent')?.textContent || '0%',
                dontKnowPercent: document.getElementById('attempt-dont-know-percent')?.textContent || '0%'
            };
        });
        
        expect(displayedStats.rightFirst).toBe('10');
        expect(displayedStats.dontKnow).toBe('5');
        expect(displayedStats.total).toBe('15');
        expect(displayedStats.rightFirstPercent).toBe('67%'); // 10/15 = 66.67% rounds to 67%
        expect(displayedStats.dontKnowPercent).toBe('33%'); // 5/15 = 33.33% rounds to 33%
    });
});
