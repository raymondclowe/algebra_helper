const puppeteer = require('puppeteer');

describe('Paper Homework Feature Tests', () => {
    let browser;
    let page;
    const TEST_URL = 'http://localhost:8081/algebra-helper.html';

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
        
        // Clear IndexedDB before each test
        await page.evaluate(() => {
            return new Promise((resolve) => {
                const request = indexedDB.deleteDatabase('AlgebraHelperDB');
                request.onsuccess = resolve;
                request.onerror = resolve;
            });
        });
        
        // Reload page after clearing DB
        await page.reload({ waitUntil: 'networkidle0' });
        
        // Wait for app initialization
        await page.waitForFunction(() => window.APP && window.StorageManager && window.StorageManager.db);
    });

    afterEach(async () => {
        await page.close();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Paper homework modal can be opened', async () => {
        // Open stats modal first
        await page.evaluate(() => {
            window.StatsModal.show();
        });
        
        await page.waitForSelector('#stats-modal:not(.hidden)', { timeout: 2000 });
        
        // Click the Add Paper Homework button
        const addButton = await page.$('button[onclick*="PaperHomeworkModal.open"]');
        expect(addButton).toBeTruthy();
        
        await addButton.click();
        
        // Wait for paper homework modal to appear
        await page.waitForSelector('#paper-homework-modal', { timeout: 2000 });
        
        const isModalVisible = await page.evaluate(() => {
            const modal = document.getElementById('paper-homework-modal');
            return modal !== null;
        });
        
        expect(isModalVisible).toBe(true);
    });

    test('Paper homework form has all required fields', async () => {
        // Open the paper homework modal
        await page.evaluate(() => {
            window.PaperHomeworkModal.open();
        });
        
        await page.waitForSelector('#paper-homework-form', { timeout: 2000 });
        
        // Check for required form fields
        const hasTopicSelect = await page.$('#homework-topic');
        const hasQuestionTextarea = await page.$('#homework-question');
        const hasResultRadios = await page.$$('input[name="result"]');
        
        expect(hasTopicSelect).toBeTruthy();
        expect(hasQuestionTextarea).toBeTruthy();
        expect(hasResultRadios.length).toBe(2); // Correct and Incorrect options
    });

    test('Can save a correct paper homework entry', async () => {
        // Open the paper homework modal
        await page.evaluate(() => {
            window.PaperHomeworkModal.open();
        });
        
        await page.waitForSelector('#paper-homework-form', { timeout: 2000 });
        
        // Fill out the form
        await page.select('#homework-topic', 'Fractions');
        await page.type('#homework-question', 'Simplify 4/8 to lowest terms');
        await page.click('input[name="result"][value="correct"]');
        
        // Submit the form
        await page.click('button[type="submit"]');
        
        // Wait for success message
        await page.waitForTimeout(1000);
        
        // Verify the entry was saved
        const savedEntry = await page.evaluate(async () => {
            const entries = await window.StorageManager.getAllPaperHomework();
            return entries.length > 0 ? entries[0] : null;
        });
        
        expect(savedEntry).toBeTruthy();
        expect(savedEntry.topic).toBe('Fractions');
        expect(savedEntry.questionDescription).toBe('Simplify 4/8 to lowest terms');
        expect(savedEntry.isCorrect).toBe(true);
    });

    test('Can save an incorrect paper homework entry with error details', async () => {
        // Open the paper homework modal
        await page.evaluate(() => {
            window.PaperHomeworkModal.open();
        });
        
        await page.waitForSelector('#paper-homework-form', { timeout: 2000 });
        
        // Fill out the form for an incorrect answer
        await page.select('#homework-topic', 'Quadratic Equations');
        await page.type('#homework-question', 'Solve x² = 16');
        await page.click('input[name="result"][value="incorrect"]');
        
        // Wait for error sections to appear
        await page.waitForSelector('#error-type-section:not(.hidden)', { timeout: 1000 });
        
        // Fill in error details
        await page.select('#homework-error-type', 'squareRootSign');
        await page.type('#homework-error-notes', 'Forgot to include ±4 as solutions');
        
        // Submit the form
        await page.click('button[type="submit"]');
        
        // Wait for success message
        await page.waitForTimeout(1000);
        
        // Verify the entry was saved with error details
        const savedEntry = await page.evaluate(async () => {
            const entries = await window.StorageManager.getAllPaperHomework();
            return entries.length > 0 ? entries[0] : null;
        });
        
        expect(savedEntry).toBeTruthy();
        expect(savedEntry.topic).toBe('Quadratic Equations');
        expect(savedEntry.isCorrect).toBe(false);
        expect(savedEntry.errorType).toBe('squareRootSign');
        expect(savedEntry.errorNote).toContain('Forgot to include ±4');
    });

    test('Error type and notes fields are hidden for correct answers', async () => {
        await page.evaluate(() => {
            window.PaperHomeworkModal.open();
        });
        
        await page.waitForSelector('#paper-homework-form', { timeout: 2000 });
        
        // Select correct answer
        await page.click('input[name="result"][value="correct"]');
        
        // Check that error sections are hidden
        const errorTypeHidden = await page.evaluate(() => {
            return document.getElementById('error-type-section').classList.contains('hidden');
        });
        
        const errorNotesHidden = await page.evaluate(() => {
            return document.getElementById('error-notes-section').classList.contains('hidden');
        });
        
        expect(errorTypeHidden).toBe(true);
        expect(errorNotesHidden).toBe(true);
    });

    test('Error type and notes fields are shown for incorrect answers', async () => {
        await page.evaluate(() => {
            window.PaperHomeworkModal.open();
        });
        
        await page.waitForSelector('#paper-homework-form', { timeout: 2000 });
        
        // Select incorrect answer
        await page.click('input[name="result"][value="incorrect"]');
        
        // Wait a bit for the display change
        await page.waitForTimeout(300);
        
        // Check that error sections are visible
        const errorTypeVisible = await page.evaluate(() => {
            return !document.getElementById('error-type-section').classList.contains('hidden');
        });
        
        const errorNotesVisible = await page.evaluate(() => {
            return !document.getElementById('error-notes-section').classList.contains('hidden');
        });
        
        expect(errorTypeVisible).toBe(true);
        expect(errorNotesVisible).toBe(true);
    });

    test('Paper homework tab shows entries in stats modal', async () => {
        // Add some test entries first
        await page.evaluate(async () => {
            await window.StorageManager.savePaperHomework({
                topic: 'Fractions',
                questionDescription: 'Add 1/2 + 1/3',
                isCorrect: true,
                datetime: Date.now() - 1000
            });
            
            await window.StorageManager.savePaperHomework({
                topic: 'Algebra',
                questionDescription: 'Solve 2x + 5 = 15',
                isCorrect: false,
                errorType: 'algebraicManipulation',
                errorNote: 'Made sign error',
                datetime: Date.now()
            });
        });
        
        // Open stats modal
        await page.evaluate(() => {
            window.StatsModal.show();
        });
        
        await page.waitForSelector('#stats-modal:not(.hidden)', { timeout: 2000 });
        
        // Switch to paper homework tab
        await page.click('#tab-paperHomework');
        
        await page.waitForTimeout(1000);
        
        // Check that entries are displayed
        const entryCount = await page.evaluate(() => {
            const container = document.getElementById('paper-homework-content');
            const entries = container.querySelectorAll('.bg-gray-750');
            return entries.length;
        });
        
        expect(entryCount).toBeGreaterThanOrEqual(2);
    });

    test('Pattern analysis detects recurring mistakes', async () => {
        // Add multiple entries with the same error type
        await page.evaluate(async () => {
            for (let i = 0; i < 4; i++) {
                await window.StorageManager.savePaperHomework({
                    topic: 'Quadratic Equations',
                    questionDescription: `Question ${i + 1}`,
                    isCorrect: false,
                    errorType: 'squareRootSign',
                    errorNote: 'Forgot ± sign',
                    datetime: Date.now() + i
                });
            }
        });
        
        // Analyze patterns
        const patterns = await page.evaluate(async () => {
            return await window.PatternAnalysis.analyzeAllPatterns();
        });
        
        expect(patterns).toBeTruthy();
        expect(patterns.errorPatterns).toBeTruthy();
        expect(patterns.errorPatterns.squareRootSign).toBeTruthy();
        expect(patterns.errorPatterns.squareRootSign.count).toBe(4);
        expect(patterns.errorPatterns.squareRootSign.isRecurring).toBe(true);
    });

    test('Insights tab shows recommendations', async () => {
        // Add test data with patterns
        await page.evaluate(async () => {
            // Add multiple incorrect entries for same topic
            for (let i = 0; i < 3; i++) {
                await window.StorageManager.savePaperHomework({
                    topic: 'Fractions',
                    questionDescription: `Fraction question ${i + 1}`,
                    isCorrect: false,
                    errorType: 'fractionSimplification',
                    datetime: Date.now() + i
                });
            }
        });
        
        // Open stats modal and switch to insights tab
        await page.evaluate(() => {
            window.StatsModal.show();
        });
        
        await page.waitForSelector('#stats-modal:not(.hidden)', { timeout: 2000 });
        
        await page.click('#tab-insights');
        
        await page.waitForTimeout(1500);
        
        // Check that recommendations are shown
        const hasRecommendations = await page.evaluate(() => {
            const container = document.getElementById('insights-content');
            const recommendations = container.querySelectorAll('.bg-gray-750');
            return recommendations.length > 0;
        });
        
        expect(hasRecommendations).toBe(true);
    });

    test('Pattern analysis correctly calculates topic accuracy', async () => {
        // Add mixed correct/incorrect entries for a topic
        await page.evaluate(async () => {
            await window.StorageManager.savePaperHomework({
                topic: 'Algebra',
                questionDescription: 'Q1',
                isCorrect: true,
                datetime: Date.now()
            });
            
            await window.StorageManager.savePaperHomework({
                topic: 'Algebra',
                questionDescription: 'Q2',
                isCorrect: true,
                datetime: Date.now() + 1
            });
            
            await window.StorageManager.savePaperHomework({
                topic: 'Algebra',
                questionDescription: 'Q3',
                isCorrect: false,
                errorType: 'algebraicManipulation',
                datetime: Date.now() + 2
            });
        });
        
        const patterns = await page.evaluate(async () => {
            return await window.PatternAnalysis.analyzeAllPatterns();
        });
        
        expect(patterns.topicPatterns.Algebra).toBeTruthy();
        expect(patterns.topicPatterns.Algebra.total).toBe(3);
        expect(patterns.topicPatterns.Algebra.correct).toBe(2);
        expect(patterns.topicPatterns.Algebra.incorrect).toBe(1);
        expect(patterns.topicPatterns.Algebra.accuracy).toBeCloseTo(66.67, 0);
    });

    test('Persistent mistakes are flagged correctly', async () => {
        // Add entries showing persistent pattern
        await page.evaluate(async () => {
            const now = Date.now();
            
            // Earlier attempts with errors
            for (let i = 0; i < 3; i++) {
                await window.StorageManager.savePaperHomework({
                    topic: 'Trigonometry',
                    questionDescription: `Trig question ${i + 1}`,
                    isCorrect: false,
                    errorType: 'signError',
                    datetime: now - (10 - i) * 24 * 60 * 60 * 1000 // 10, 9, 8 days ago
                });
            }
            
            // Recent attempts still with errors
            await window.StorageManager.savePaperHomework({
                topic: 'Trigonometry',
                questionDescription: 'Recent trig question',
                isCorrect: false,
                errorType: 'signError',
                datetime: now - 1 * 24 * 60 * 60 * 1000 // 1 day ago
            });
            
            await window.StorageManager.savePaperHomework({
                topic: 'Trigonometry',
                questionDescription: 'Another recent trig question',
                isCorrect: false,
                errorType: 'signError',
                datetime: now
            });
        });
        
        const patterns = await page.evaluate(async () => {
            return await window.PatternAnalysis.analyzeAllPatterns();
        });
        
        expect(patterns.persistentMistakes).toBeTruthy();
        expect(patterns.persistentMistakes.length).toBeGreaterThan(0);
        
        const trigMistake = patterns.persistentMistakes.find(m => m.topic === 'Trigonometry');
        expect(trigMistake).toBeTruthy();
        expect(trigMistake.needsHabitCorrection).toBe(true);
    });
});
