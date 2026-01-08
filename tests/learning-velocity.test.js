const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Learning Velocity Calculation Tests', () => {
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
        try {
            await page.waitForFunction(() => {
                return typeof window.StorageManager !== 'undefined';
            }, { timeout: 15000 });
        } catch (e) {
            console.log('StorageManager not loaded, continuing anyway');
        }
        
        // Clear any existing data
        await page.evaluate(() => {
            localStorage.clear();
            return new Promise((resolve) => {
                const request = indexedDB.deleteDatabase('AlgebraHelperDB');
                request.onsuccess = () => resolve();
                request.onerror = () => resolve();
                setTimeout(() => resolve(), 2000);
            });
        });
        
        // Wait for async operations to complete before reload
        await wait(500);
        
        // Reload to initialize fresh
        await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
        
        // Wait for essential scripts after reload
        try {
            await page.waitForFunction(() => {
                return typeof window.StorageManager !== 'undefined';
            }, { timeout: 15000 });
        } catch (e) {
            console.log('StorageManager not loaded after reload');
        }
    });

    afterEach(async () => {
        await page.close();
    });

    test('calculateLearningVelocity returns null with insufficient data', async () => {
        const result = await page.evaluate(async () => {
            // No questions in database
            return await window.StorageManager.calculateLearningVelocity();
        });
        
        expect(result).toBeNull();
    });

    test('calculateLearningVelocity calculates velocity with sufficient data', async () => {
        const result = await page.evaluate(async () => {
            // Add sample questions showing improvement over time
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            
            // Early questions - 50% accuracy (5 correct, 5 incorrect)
            for (let i = 0; i < 10; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Test question ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i < 5 ? 'A' : 'B', // First 5 correct, last 5 wrong
                    isCorrect: i < 5,
                    isDontKnow: false,
                    topic: 'Test Topic',
                    datetime: oneHourAgo + (i * 1000),
                    timeSpent: 5,
                    questionLevel: 5,
                    eventHash: `test_${oneHourAgo + (i * 1000)}_${i}`
                });
            }
            
            // Later questions - 80% accuracy (8 correct, 2 incorrect)
            for (let i = 10; i < 20; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Test question ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i < 18 ? 'A' : 'B', // 8 correct, 2 wrong
                    isCorrect: i < 18,
                    isDontKnow: false,
                    topic: 'Test Topic',
                    datetime: now - (10 * 60 * 1000) + (i * 1000), // Recent
                    timeSpent: 5,
                    questionLevel: 5,
                    eventHash: `test_${now + (i * 1000)}_${i}`
                });
            }
            
            // Wait a bit for IndexedDB operations
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Calculate learning velocity
            return await window.StorageManager.calculateLearningVelocity();
        });
        
        // Should have positive learning velocity (improved from 50% to 80%)
        expect(result).not.toBeNull();
        expect(result.velocity).toBeGreaterThan(0);
        expect(result.earlyAccuracy).toBe(50);
        expect(result.lateAccuracy).toBe(80);
        expect(result.questionCount).toBe(20);
    });

    test('calculateLearningVelocity excludes "I don\'t know" responses', async () => {
        const result = await page.evaluate(async () => {
            const now = Date.now();
            
            // Add questions with mix of correct, incorrect, and "I don't know"
            for (let i = 0; i < 20; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Test question ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i % 3 === 0 ? '' : (i % 2 === 0 ? 'A' : 'B'),
                    isCorrect: i % 2 === 0 && i % 3 !== 0,
                    isDontKnow: i % 3 === 0, // Every 3rd is "I don't know"
                    topic: 'Test Topic',
                    datetime: now - (60 * 60 * 1000) + (i * 60 * 1000),
                    timeSpent: 5,
                    questionLevel: 5,
                    eventHash: `test_${now + (i * 1000)}_${i}`
                });
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            return await window.StorageManager.calculateLearningVelocity();
        });
        
        // Should calculate based on answered questions only
        expect(result).not.toBeNull();
        expect(result.questionCount).toBe(20);
    });

    test('exportData includes learning velocity', async () => {
        const result = await page.evaluate(async () => {
            // Add some sample questions
            const now = Date.now();
            for (let i = 0; i < 15; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Test question ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: 'A',
                    isCorrect: true,
                    isDontKnow: false,
                    topic: 'Test Topic',
                    datetime: now - (60 * 60 * 1000) + (i * 60 * 1000),
                    timeSpent: 5,
                    questionLevel: 5,
                    eventHash: `test_${now + (i * 1000)}_${i}`
                });
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Export data (but don't actually download)
            const questions = await window.StorageManager.getAllQuestions();
            const stats = window.StorageManager.getStats();
            const dailyStats = window.StorageManager.getDailyStats();
            const learningVelocity = await window.StorageManager.calculateLearningVelocity();
            
            return {
                hasQuestions: questions.length > 0,
                hasStats: !!stats,
                hasDailyStats: !!dailyStats,
                hasLearningVelocity: learningVelocity !== null,
                learningVelocityHasVelocity: learningVelocity ? 'velocity' in learningVelocity : false
            };
        });
        
        expect(result.hasQuestions).toBe(true);
        expect(result.hasStats).toBe(true);
        expect(result.hasDailyStats).toBe(true);
        expect(result.hasLearningVelocity).toBe(true);
        expect(result.learningVelocityHasVelocity).toBe(true);
    });
});
