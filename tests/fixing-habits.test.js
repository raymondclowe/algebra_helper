const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Fixing Habits Feature Tests', () => {
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
        await wait(1000); // Wait for page to be ready
    });

    afterEach(async () => {
        await page.close();
    });

    test('Fixing Habits module loads correctly', async () => {
        const hasFixingHabits = await page.evaluate(() => {
            return typeof window.FixingHabitsQuestions !== 'undefined';
        });
        expect(hasFixingHabits).toBe(true);
    });

    test('Constants are defined for Fixing Habits', async () => {
        const constants = await page.evaluate(() => {
            return {
                category: typeof FIXING_HABITS_CATEGORY !== 'undefined',
                insertionRate: typeof FIXING_HABITS_INSERTION_RATE !== 'undefined',
                minErrors: typeof FIXING_HABITS_MIN_ERRORS !== 'undefined'
            };
        });
        
        expect(constants.category).toBe(true);
        expect(constants.insertionRate).toBe(true);
        expect(constants.minErrors).toBe(true);
    });

    test('Error tracker is initialized in APP state', async () => {
        const errorTracker = await page.evaluate(() => {
            return window.APP && window.APP.errorTracker;
        });
        
        expect(errorTracker).toBeDefined();
        expect(errorTracker).toHaveProperty('squareRootSign');
        expect(errorTracker).toHaveProperty('divisionByZero');
    });

    test('Square Root Sign question generates correctly', async () => {
        const question = await page.evaluate(() => {
            return window.FixingHabitsQuestions.getSquareRootSignQuestion();
        });
        
        expect(question).toBeDefined();
        expect(question.tex).toBeTruthy();
        expect(question.instruction).toBeTruthy();
        expect(question.displayAnswer).toContain('\\pm');
        expect(question.distractors).toHaveLength(3);
        expect(question.type).toBe('fixing-habits');
        expect(question.habitType).toBe('squareRootSign');
        expect(question.topic).toBe('Fixing Habits');
    });

    test('Division by Zero question generates correctly', async () => {
        const question = await page.evaluate(() => {
            return window.FixingHabitsQuestions.getDivisionByZeroQuestion();
        });
        
        expect(question).toBeDefined();
        expect(question.tex).toBeTruthy();
        expect(question.instruction).toBeTruthy();
        expect(question.displayAnswer).toContain('Undefined');
        expect(question.distractors).toHaveLength(3);
        expect(question.type).toBe('fixing-habits');
        expect(question.habitType).toBe('divisionByZero');
        expect(question.topic).toBe('Fixing Habits');
    });

    test('Fixing Habits does not trigger without errors', async () => {
        const shouldInsert = await page.evaluate(() => {
            // Set mode to learning
            window.APP.mode = 'learning';
            // Reset error tracker to 0
            window.APP.errorTracker.squareRootSign = 0;
            window.APP.errorTracker.divisionByZero = 0;
            
            return window.FixingHabitsQuestions.shouldInsertFixingHabitsQuestion();
        });
        
        expect(shouldInsert).toBe(false);
    });

    test('Fixing Habits can trigger with sufficient errors', async () => {
        // Run multiple times to account for randomness
        let triggered = false;
        
        for (let i = 0; i < 100; i++) {
            const shouldInsert = await page.evaluate(() => {
                // Set mode to learning
                window.APP.mode = 'learning';
                // Set error count above threshold
                window.APP.errorTracker.squareRootSign = 3;
                
                return window.FixingHabitsQuestions.shouldInsertFixingHabitsQuestion();
            });
            
            if (shouldInsert) {
                triggered = true;
                break;
            }
        }
        
        expect(triggered).toBe(true);
    });

    test('Error tracker increments on wrong answer', async () => {
        // Switch to learning mode and generate a question
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 10; // Quadratic level
            window.APP.currentQ = window.Generator.getQuestion(10);
            window.APP.startTime = Date.now();
        });
        
        await wait(500);
        
        const initialErrors = await page.evaluate(() => {
            return {
                squareRoot: window.APP.errorTracker.squareRootSign,
                division: window.APP.errorTracker.divisionByZero
            };
        });
        
        // Simulate wrong answer by calling trackErrorPattern
        await page.evaluate(() => {
            // Create a mock question with square root pattern
            const mockQuestion = {
                tex: 'x^2 = 16',
                displayAnswer: 'x = 4', // Missing ±
                type: 'regular'
            };
            window.Learning.trackErrorPattern(mockQuestion);
        });
        
        const newErrors = await page.evaluate(() => {
            return {
                squareRoot: window.APP.errorTracker.squareRootSign,
                division: window.APP.errorTracker.divisionByZero
            };
        });
        
        expect(newErrors.squareRoot).toBeGreaterThan(initialErrors.squareRoot);
    });

    test('Topic definition handles Fixing Habits category', async () => {
        const topic = await page.evaluate(() => {
            return window.TopicDefinitions.getTopicForLevel(FIXING_HABITS_CATEGORY);
        });
        
        expect(topic).toBe('Fixing Habits');
    });

    test('Fixing Habits questions are not counted in regular topics', async () => {
        const allTopics = await page.evaluate(() => {
            return window.TopicDefinitions.getAllTopics();
        });
        
        expect(allTopics).not.toContain('Fixing Habits');
    });

    test('recordFixingHabitsAnswer reduces error count on correct answer', async () => {
        const result = await page.evaluate(() => {
            // Set initial error count
            window.APP.errorTracker.squareRootSign = 5;
            
            // Record correct answer
            window.FixingHabitsQuestions.recordFixingHabitsAnswer('squareRootSign', true);
            
            return window.APP.errorTracker.squareRootSign;
        });
        
        expect(result).toBe(4); // Should decrease by 1
    });

    test('recordFixingHabitsAnswer does not increase on wrong answer', async () => {
        const result = await page.evaluate(() => {
            // Set initial error count
            window.APP.errorTracker.squareRootSign = 3;
            
            // Record wrong answer
            window.FixingHabitsQuestions.recordFixingHabitsAnswer('squareRootSign', false);
            
            return window.APP.errorTracker.squareRootSign;
        });
        
        expect(result).toBe(3); // Should stay the same
    });

    test('Fixing Habits questions only appear in learning/drill mode', async () => {
        const calibrationResult = await page.evaluate(() => {
            window.APP.mode = 'calibration';
            window.APP.errorTracker.squareRootSign = 10;
            return window.FixingHabitsQuestions.shouldInsertFixingHabitsQuestion();
        });
        
        expect(calibrationResult).toBe(false);
        
        const learningResult = await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.errorTracker.squareRootSign = 10;
            // Try multiple times due to randomness
            for (let i = 0; i < 100; i++) {
                if (window.FixingHabitsQuestions.shouldInsertFixingHabitsQuestion()) {
                    return true;
                }
            }
            return false;
        });
        
        expect(learningResult).toBe(true);
    });

    test('Generator integrates Fixing Habits questions', async () => {
        // This test verifies that the generator can return fixing habits questions
        // when conditions are met
        const result = await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 10;
            window.APP.errorTracker.squareRootSign = 10;
            
            // Generate many questions to see if fixing habits appears
            for (let i = 0; i < 50; i++) {
                const q = window.Generator.getQuestion(10);
                if (q.type === 'fixing-habits') {
                    return {
                        found: true,
                        habitType: q.habitType,
                        topic: q.topic
                    };
                }
            }
            return { found: false };
        });
        
        // With high error count and 50 tries, we should find at least one
        expect(result.found).toBe(true);
        if (result.found) {
            expect(result.topic).toBe('Fixing Habits');
        }
    });
});
