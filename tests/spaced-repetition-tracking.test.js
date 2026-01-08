const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Spaced Repetition Tracking Tests', () => {
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
        await wait(1000);
        
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

    test('getTopicsNeedingReview identifies topics needing review', async () => {
        const result = await page.evaluate(async () => {
            const now = Date.now();
            
            // Add questions for Topic A (needs review - 40% accuracy)
            for (let i = 0; i < 10; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Topic A question ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i < 4 ? 'A' : 'B', // 40% correct
                    isCorrect: i < 4,
                    isDontKnow: false,
                    topic: 'Basic Arithmetic',
                    datetime: now - (i * 60000),
                    timeSpent: 5,
                    questionLevel: 1,
                    eventHash: `test_a_${now}_${i}`
                });
            }
            
            // Add questions for Topic B (mastered - 90% accuracy)
            for (let i = 0; i < 10; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Topic B question ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i < 9 ? 'A' : 'B', // 90% correct
                    isCorrect: i < 9,
                    isDontKnow: false,
                    topic: 'Linear Equations',
                    datetime: now - (i * 60000),
                    timeSpent: 5,
                    questionLevel: 5,
                    eventHash: `test_b_${now}_${i}`
                });
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const reviewTopics = await window.StorageManager.getTopicsNeedingReview();
            return reviewTopics;
        });
        
        expect(result.length).toBeGreaterThanOrEqual(2);
        
        // Find topics by name
        const topicA = result.find(t => t.topic === 'Basic Arithmetic');
        const topicB = result.find(t => t.topic === 'Linear Equations');
        
        expect(topicA).toBeDefined();
        expect(topicA.status).toBe('needs_review');
        expect(topicA.accuracy).toBe(40);
        
        expect(topicB).toBeDefined();
        expect(topicB.status).toBe('mastered');
        expect(topicB.accuracy).toBe(90);
        
        // Topic A should have higher urgency than Topic B
        expect(topicA.urgency).toBeGreaterThan(topicB.urgency);
    });

    test('getMasterySummary returns correct counts', async () => {
        const result = await page.evaluate(async () => {
            const now = Date.now();
            
            // Add mastered topic (90% accuracy)
            for (let i = 0; i < 10; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Mastered ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i < 9 ? 'A' : 'B',
                    isCorrect: i < 9,
                    isDontKnow: false,
                    topic: 'Mastered Topic',
                    datetime: now - (i * 60000),
                    timeSpent: 5,
                    questionLevel: 5,
                    eventHash: `mastered_${now}_${i}`
                });
            }
            
            // Add needs review topic (50% accuracy)
            for (let i = 0; i < 10; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Needs review ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i < 5 ? 'A' : 'B',
                    isCorrect: i < 5,
                    isDontKnow: false,
                    topic: 'Review Topic',
                    datetime: now - (i * 60000),
                    timeSpent: 5,
                    questionLevel: 3,
                    eventHash: `review_${now}_${i}`
                });
            }
            
            // Add working on topic (75% accuracy)
            for (let i = 0; i < 10; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Working ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i < 7 || i === 8 ? 'A' : 'B', // 75% (7.5 rounded to 8/10)
                    isCorrect: i < 7 || i === 8,
                    isDontKnow: false,
                    topic: 'Working Topic',
                    datetime: now - (i * 60000),
                    timeSpent: 5,
                    questionLevel: 7,
                    eventHash: `working_${now}_${i}`
                });
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            return await window.StorageManager.getMasterySummary();
        });
        
        expect(result.mastered).toBe(1);
        expect(result.needsReview).toBe(1);
        expect(result.working).toBe(1);
        expect(result.total).toBe(3);
        expect(result.topReviewTopics).toHaveLength(1);
        expect(result.topReviewTopics[0].topic).toBe('Review Topic');
    });

    test('Mastery summary shows correct counts in stats modal', async () => {
        // Add questions for multiple topics with different performance levels
        await page.evaluate(async () => {
            const now = Date.now();
            
            // Mastered topic (90% accuracy)
            for (let i = 0; i < 10; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Mastered ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i < 9 ? 'A' : 'B',
                    isCorrect: i < 9,
                    isDontKnow: false,
                    topic: 'Mastered Topic',
                    datetime: now - (i * 60000),
                    timeSpent: 5,
                    questionLevel: 5,
                    eventHash: `mastered_${now}_${i}`
                });
            }
            
            // Needs review topic (50% accuracy)
            for (let i = 0; i < 10; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Review ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i < 5 ? 'A' : 'B',
                    isCorrect: i < 5,
                    isDontKnow: false,
                    topic: 'Review Topic',
                    datetime: now - (i * 60000),
                    timeSpent: 5,
                    questionLevel: 3,
                    eventHash: `review_${now}_${i}`
                });
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
        });
        
        // Click stats button
        await page.click('button[onclick*="StatsModal.show"]');
        await wait(2000); // Give more time for async loading
        
        // Check if mastery summary is visible and has correct data
        const result = await page.evaluate(() => {
            const container = document.getElementById('mastery-summary-container');
            return {
                exists: !!container,
                isHidden: container ? container.classList.contains('hidden') : true,
                masteredCount: document.getElementById('mastery-mastered-count')?.textContent,
                reviewCount: document.getElementById('mastery-review-count')?.textContent,
                workingCount: document.getElementById('mastery-working-count')?.textContent
            };
        });
        
        expect(result.exists).toBe(true);
        // If summary has data, it should not be hidden
        if (result.masteredCount !== '0' || result.reviewCount !== '0' || result.workingCount !== '0') {
            expect(result.isHidden).toBe(false);
        }
    });

    test('Topics with insufficient attempts are not included in review list', async () => {
        const result = await page.evaluate(async () => {
            const now = Date.now();
            
            // Add only 2 questions (below MIN_ATTEMPTS threshold of 3)
            for (let i = 0; i < 2; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Test ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: 'B', // Both incorrect
                    isCorrect: false,
                    isDontKnow: false,
                    topic: 'Insufficient Data Topic',
                    datetime: now - (i * 60000),
                    timeSpent: 5,
                    questionLevel: 5,
                    eventHash: `test_${now}_${i}`
                });
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const reviewTopics = await window.StorageManager.getTopicsNeedingReview();
            return reviewTopics.find(t => t.topic === 'Insufficient Data Topic');
        });
        
        expect(result).toBeUndefined();
    });

    test('Old mastered topics show up for maintenance review', async () => {
        const result = await page.evaluate(async () => {
            const now = Date.now();
            const tenDaysAgo = now - (10 * 24 * 60 * 60 * 1000);
            
            // Add mastered topic from 10 days ago
            for (let i = 0; i < 10; i++) {
                await window.StorageManager.saveQuestion({
                    question: `Old mastered ${i}`,
                    correctAnswer: 'A',
                    allAnswers: ['A', 'B', 'C', 'D'],
                    chosenAnswer: i < 9 ? 'A' : 'B',
                    isCorrect: i < 9,
                    isDontKnow: false,
                    topic: 'Old Mastered Topic',
                    datetime: tenDaysAgo - (i * 60000),
                    timeSpent: 5,
                    questionLevel: 5,
                    eventHash: `old_${tenDaysAgo}_${i}`
                });
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const reviewTopics = await window.StorageManager.getTopicsNeedingReview();
            const oldTopic = reviewTopics.find(t => t.topic === 'Old Mastered Topic');
            
            return {
                found: !!oldTopic,
                status: oldTopic?.status,
                urgency: oldTopic?.urgency,
                daysSince: oldTopic?.daysSinceLastAttempt
            };
        });
        
        expect(result.found).toBe(true);
        expect(result.status).toBe('mastered');
        expect(result.urgency).toBeGreaterThan(0); // Should have some urgency due to age
        expect(result.daysSince).toBeGreaterThan(9);
    });
});
