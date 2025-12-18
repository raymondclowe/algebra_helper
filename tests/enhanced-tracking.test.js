const puppeteer = require('puppeteer');

describe('Enhanced IndexedDB Tracking Tests', () => {
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
        await page.goto(`${baseUrl}/algebra-helper.html`, { 
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        // Wait for essential scripts to load
        await page.waitForFunction(() => {
            return typeof window.StorageManager !== 'undefined';
        }, { timeout: 10000 });
        
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
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // Wait for essential scripts to load after reload
        await page.waitForFunction(() => {
            return typeof window.StorageManager !== 'undefined';
        }, { timeout: 10000 });
    });

    afterEach(async () => {
        await page.close();
    });

    test('IndexedDB schema includes all required fields', async () => {
        // Complete calibration first
        await page.evaluate(() => {
            window.APP.level = 5;
            window.APP.mode = 'learning';
        });
        await page.waitForTimeout(500);

        // Answer a question
        const answerButton = await page.$('#mc-options button');
        if (answerButton) {
            await answerButton.click();
            await page.waitForTimeout(1000);
        }

        // Check the saved question data
        const savedQuestion = await page.evaluate(() => {
            return window.StorageManager.getAllQuestions();
        });

        expect(savedQuestion).toBeDefined();
        if (savedQuestion.length > 0) {
            const q = savedQuestion[0];
            
            // Check all required fields exist
            expect(q).toHaveProperty('question');
            expect(q).toHaveProperty('allAnswers');
            expect(q).toHaveProperty('chosenAnswer');
            expect(q).toHaveProperty('correctAnswer');
            expect(q).toHaveProperty('isCorrect');
            expect(q).toHaveProperty('isDontKnow');
            expect(q).toHaveProperty('timeSpent');
            expect(q).toHaveProperty('datetime');
            expect(q).toHaveProperty('topic');
            expect(q).toHaveProperty('level');
            expect(q).toHaveProperty('hintsUsed');
            expect(q).toHaveProperty('eventHash');
            
            // Check types
            expect(Array.isArray(q.allAnswers)).toBe(true);
            expect(typeof q.chosenAnswer).toBe('string');
            expect(typeof q.topic).toBe('string');
            expect(typeof q.eventHash).toBe('string');
            expect(q.eventHash).toMatch(/^evt_/);
        }
    });

    test('Export button exists in stats modal', async () => {
        // Open stats modal
        const statsButton = await page.$('button[onclick*="StatsModal.show"]');
        expect(statsButton).toBeTruthy();
        
        await statsButton.click();
        await page.waitForTimeout(500);

        // Check for export button
        const exportButton = await page.$('button[onclick*="exportData"]');
        expect(exportButton).toBeTruthy();
        
        const exportText = await page.evaluate(el => el.textContent, exportButton);
        expect(exportText).toContain('Export');
    });

    test('Import button exists in stats modal', async () => {
        // Open stats modal
        const statsButton = await page.$('button[onclick*="StatsModal.show"]');
        await statsButton.click();
        await page.waitForTimeout(500);

        // Check for import button
        const importButton = await page.$('button[onclick*="importData"]');
        expect(importButton).toBeTruthy();
        
        const importText = await page.evaluate(el => el.textContent, importButton);
        expect(importText).toContain('Import');
    });

    test('Export function creates proper JSON structure', async () => {
        // Add some test data
        await page.evaluate(() => {
            const testQuestion = {
                question: 'Test question',
                allAnswers: ['answer1', 'answer2', 'answer3', 'answer4'],
                chosenAnswer: 'answer1',
                correctAnswer: 'answer1',
                isCorrect: true,
                isDontKnow: false,
                timeSpent: 10,
                datetime: Date.now(),
                topic: 'Test Topic',
                level: 5,
                hintsUsed: 0,
                eventHash: 'evt_test_123'
            };
            
            return window.StorageManager.saveQuestion(testQuestion);
        });
        
        await page.waitForTimeout(500);

        // Test export function (without triggering download)
        const exportData = await page.evaluate(async () => {
            const questions = await window.StorageManager.getAllQuestions();
            const stats = window.StorageManager.getStats();
            const dailyStats = window.StorageManager.getDailyStats();
            
            return {
                version: '1.0',
                exportDate: new Date().toISOString(),
                dbVersion: window.StorageManager.DB_VERSION,
                questions: questions,
                stats: stats,
                dailyStats: dailyStats
            };
        });

        // Validate structure
        expect(exportData).toHaveProperty('version');
        expect(exportData).toHaveProperty('exportDate');
        expect(exportData).toHaveProperty('dbVersion');
        expect(exportData).toHaveProperty('questions');
        expect(exportData).toHaveProperty('stats');
        expect(exportData).toHaveProperty('dailyStats');
        
        expect(exportData.dbVersion).toBe(2);
        expect(Array.isArray(exportData.questions)).toBe(true);
        expect(exportData.questions.length).toBeGreaterThan(0);
        
        // Check first question has all fields
        const q = exportData.questions[0];
        expect(q.allAnswers).toBeDefined();
        expect(q.chosenAnswer).toBeDefined();
        expect(q.eventHash).toBeDefined();
    });

    test('Event hash generation is unique and consistent', async () => {
        const hashes = await page.evaluate(() => {
            const q1 = {
                question: 'Test 1',
                allAnswers: ['a', 'b'],
                chosenAnswer: 'a',
                datetime: 1000
            };
            
            const q2 = {
                question: 'Test 2',
                allAnswers: ['c', 'd'],
                chosenAnswer: 'c',
                datetime: 2000
            };
            
            const q1Same = {
                question: 'Test 1',
                allAnswers: ['a', 'b'],
                chosenAnswer: 'a',
                datetime: 1000
            };
            
            return {
                hash1: window.StorageManager.generateEventHash(q1),
                hash2: window.StorageManager.generateEventHash(q2),
                hash1Again: window.StorageManager.generateEventHash(q1Same)
            };
        });

        // Different questions should have different hashes
        expect(hashes.hash1).not.toBe(hashes.hash2);
        
        // Same question data should generate same hash
        expect(hashes.hash1).toBe(hashes.hash1Again);
        
        // Hashes should start with 'evt_'
        expect(hashes.hash1).toMatch(/^evt_/);
        expect(hashes.hash2).toMatch(/^evt_/);
    });

    test('All answer options are captured when answering', async () => {
        // Set up in learning mode
        await page.evaluate(() => {
            window.APP.level = 5;
            window.APP.mode = 'learning';
        });
        await page.waitForTimeout(500);

        // Check that currentQ has allAnswers after setupUI
        const hasAllAnswers = await page.evaluate(() => {
            return window.APP.currentQ && Array.isArray(window.APP.currentQ.allAnswers);
        });

        expect(hasAllAnswers).toBe(true);

        // Check the number of answers (should be 5: 4 options + "I don't know")
        const answerCount = await page.evaluate(() => {
            return window.APP.currentQ.allAnswers ? window.APP.currentQ.allAnswers.length : 0;
        });

        expect(answerCount).toBe(5);
    });
});
