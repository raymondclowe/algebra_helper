const puppeteer = require('puppeteer');

describe('CSV Export for Google Sheets Integration', () => {
    let browser;
    let page;
    const baseUrl = process.env.TEST_URL || 'http://localhost:8000';

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
        await page.goto(`${baseUrl}/algebra-helper.html`, { waitUntil: 'networkidle0' });
        
        // Clear any existing data
        await page.evaluate(() => {
            localStorage.clear();
            return new Promise((resolve) => {
                const request = indexedDB.deleteDatabase('AlgebraHelperDB');
                request.onsuccess = () => resolve();
                request.onerror = () => resolve();
            });
        });
        
        // Reload to initialize fresh
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForTimeout(1000);
    });

    afterEach(async () => {
        await page.close();
    });

    test('StorageManager has exportSessionsCSV method', async () => {
        const hasMethod = await page.evaluate(() => {
            return typeof window.StorageManager.exportSessionsCSV === 'function';
        });
        
        expect(hasMethod).toBe(true);
    });

    test('StorageManager has groupIntoSessions method', async () => {
        const hasMethod = await page.evaluate(() => {
            return typeof window.StorageManager.groupIntoSessions === 'function';
        });
        
        expect(hasMethod).toBe(true);
    });

    test('groupIntoSessions correctly groups questions by time gap', async () => {
        const sessions = await page.evaluate(() => {
            const now = Date.now();
            const questions = [
                { datetime: now, topic: 'Arithmetic', isCorrect: true, isDontKnow: false },
                { datetime: now + 5 * 60 * 1000, topic: 'Arithmetic', isCorrect: true, isDontKnow: false }, // 5 min later
                { datetime: now + 10 * 60 * 1000, topic: 'Arithmetic', isCorrect: false, isDontKnow: false }, // 10 min later
                { datetime: now + 40 * 60 * 1000, topic: 'Algebra', isCorrect: true, isDontKnow: false }, // 40 min later (new session)
                { datetime: now + 45 * 60 * 1000, topic: 'Algebra', isCorrect: true, isDontKnow: false }, // 45 min later
            ];
            
            return window.StorageManager.groupIntoSessions(questions);
        });
        
        expect(sessions).toBeDefined();
        expect(sessions.length).toBe(2); // Should create 2 sessions (gap > 30 min)
        expect(sessions[0].questions.length).toBe(3);
        expect(sessions[1].questions.length).toBe(2);
    });

    test('exportSessionsCSV filters sessions correctly', async () => {
        // Set student name
        await page.evaluate(() => {
            window.StorageManager.setStudentName('Test Student');
        });
        
        // Skip calibration
        await page.evaluate(() => {
            window.APP.level = 5;
            window.APP.mode = 'learning';
        });
        await page.waitForTimeout(500);

        // Simulate multiple questions to create a valid session
        // We need >2 minutes duration and >50% correct
        const now = Date.now();
        await page.evaluate((startTime) => {
            // Create a mock session: 5 questions over 3 minutes, 4 correct (80%)
            const questions = [
                {
                    question: 'What is 2 + 2?',
                    correctAnswer: '4',
                    chosenAnswer: '4',
                    allAnswers: ['3', '4', '5', '6'],
                    isCorrect: true,
                    isDontKnow: false,
                    timeSpent: 5,
                    datetime: startTime,
                    topic: 'Arithmetic',
                    level: 1,
                    hintsUsed: 0,
                    eventHash: 'test1'
                },
                {
                    question: 'What is 3 + 3?',
                    correctAnswer: '6',
                    chosenAnswer: '6',
                    allAnswers: ['5', '6', '7', '8'],
                    isCorrect: true,
                    isDontKnow: false,
                    timeSpent: 5,
                    datetime: startTime + 30 * 1000,
                    topic: 'Arithmetic',
                    level: 1,
                    hintsUsed: 0,
                    eventHash: 'test2'
                },
                {
                    question: 'What is 4 + 4?',
                    correctAnswer: '8',
                    chosenAnswer: '7',
                    allAnswers: ['7', '8', '9', '10'],
                    isCorrect: false,
                    isDontKnow: false,
                    timeSpent: 5,
                    datetime: startTime + 60 * 1000,
                    topic: 'Arithmetic',
                    level: 1,
                    hintsUsed: 0,
                    eventHash: 'test3'
                },
                {
                    question: 'What is 5 + 5?',
                    correctAnswer: '10',
                    chosenAnswer: '10',
                    allAnswers: ['9', '10', '11', '12'],
                    isCorrect: true,
                    isDontKnow: false,
                    timeSpent: 5,
                    datetime: startTime + 90 * 1000,
                    topic: 'Arithmetic',
                    level: 1,
                    hintsUsed: 0,
                    eventHash: 'test4'
                },
                {
                    question: 'What is 6 + 6?',
                    correctAnswer: '12',
                    chosenAnswer: '12',
                    allAnswers: ['11', '12', '13', '14'],
                    isCorrect: true,
                    isDontKnow: false,
                    timeSpent: 5,
                    datetime: startTime + 180 * 1000, // 3 minutes from start
                    topic: 'Arithmetic',
                    level: 1,
                    hintsUsed: 0,
                    eventHash: 'test5'
                }
            ];

            // Save questions to IndexedDB
            return Promise.all(questions.map(q => window.StorageManager.saveQuestion(q)));
        }, now);

        await page.waitForTimeout(1000);

        // Try to export CSV
        const result = await page.evaluate(() => {
            return window.StorageManager.exportSessionsCSV();
        });

        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.sessionCount).toBeGreaterThan(0);
    });

    test('exportSessionsCSV fails when no qualifying sessions exist', async () => {
        // Set student name
        await page.evaluate(() => {
            window.StorageManager.setStudentName('Test Student');
        });
        
        // Skip calibration
        await page.evaluate(() => {
            window.APP.level = 5;
            window.APP.mode = 'learning';
        });
        await page.waitForTimeout(500);

        // Create a session that doesn't meet criteria (too short and low accuracy)
        const now = Date.now();
        await page.evaluate((startTime) => {
            const questions = [
                {
                    question: 'What is 2 + 2?',
                    correctAnswer: '4',
                    chosenAnswer: '3',
                    allAnswers: ['3', '4', '5', '6'],
                    isCorrect: false,
                    isDontKnow: false,
                    timeSpent: 5,
                    datetime: startTime,
                    topic: 'Arithmetic',
                    level: 1,
                    hintsUsed: 0,
                    eventHash: 'test1'
                },
                {
                    question: 'What is 3 + 3?',
                    correctAnswer: '6',
                    chosenAnswer: '5',
                    allAnswers: ['5', '6', '7', '8'],
                    isCorrect: false,
                    isDontKnow: false,
                    timeSpent: 5,
                    datetime: startTime + 30 * 1000, // Only 30 seconds duration
                    topic: 'Arithmetic',
                    level: 1,
                    hintsUsed: 0,
                    eventHash: 'test2'
                }
            ];

            return Promise.all(questions.map(q => window.StorageManager.saveQuestion(q)));
        }, now);

        await page.waitForTimeout(1000);

        // Try to export CSV - should fail
        const result = await page.evaluate(() => {
            return window.StorageManager.exportSessionsCSV();
        });

        expect(result).toBeDefined();
        expect(result.success).toBe(false);
        expect(result.error).toContain('No sessions meet the criteria');
    });

    test('StatsModal has exportSessionsCSV button', async () => {
        // Skip calibration
        await page.evaluate(() => {
            window.APP.level = 5;
            window.APP.mode = 'learning';
        });
        await page.waitForTimeout(500);

        // Open stats modal
        const statsButton = await page.$('button[onclick*="StatsModal.show"]');
        if (statsButton) {
            await statsButton.click();
            await page.waitForTimeout(1000);

            // Check if export CSV button exists
            const exportButton = await page.$('button[onclick*="exportSessionsCSV"]');
            expect(exportButton).not.toBeNull();

            // Check button text
            const buttonText = await page.evaluate(el => el.textContent, exportButton);
            expect(buttonText).toContain('Export Sessions');
        }
    });

    test('StatsModal.exportSessionsCSV method exists', async () => {
        const hasMethod = await page.evaluate(() => {
            return typeof window.StatsModal.exportSessionsCSV === 'function';
        });
        
        expect(hasMethod).toBe(true);
    });
});
