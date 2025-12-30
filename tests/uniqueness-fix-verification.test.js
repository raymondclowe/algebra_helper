const puppeteer = require('puppeteer');

const baseUrl = process.env.TEST_URL || 'http://localhost:8000';

describe('Verify Uniqueness Fix in Previously Problematic Templates', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        await page.goto(`${baseUrl}/algebra-helper.html`);
        
        // Wait for the app to initialize
        await page.waitForFunction(() => {
            return window.QuestionTemplates && window.GeneratorUtils;
        }, { timeout: 10000 });
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Calculus questions have unique distractors', async () => {
        const results = await page.evaluate(() => {
            const issues = [];
            
            // Test 1000 iterations of calculus questions
            for (let i = 0; i < 1000; i++) {
                const q = window.QuestionTemplates.Calculus.getCalculus();
                const allAnswers = [q.displayAnswer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                
                if (uniqueAnswers.size !== allAnswers.length) {
                    issues.push({
                        iteration: i,
                        correctAnswer: q.displayAnswer,
                        distractors: q.distractors,
                        allAnswers: allAnswers
                    });
                }
            }
            
            return issues;
        });

        if (results.length > 0) {
            console.log('Found duplicate answers in calculus:', JSON.stringify(results.slice(0, 5), null, 2));
        }
        expect(results.length).toBe(0);
    });

    test('Statistics questions have unique distractors', async () => {
        const results = await page.evaluate(() => {
            const issues = [];
            
            // Test 1000 iterations of statistics questions
            for (let i = 0; i < 1000; i++) {
                const q = window.QuestionTemplates.Statistics.getStatistics();
                const allAnswers = [q.displayAnswer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                
                if (uniqueAnswers.size !== allAnswers.length) {
                    issues.push({
                        iteration: i,
                        correctAnswer: q.displayAnswer,
                        distractors: q.distractors,
                        allAnswers: allAnswers
                    });
                }
            }
            
            return issues;
        });

        if (results.length > 0) {
            console.log('Found duplicate answers in statistics:', JSON.stringify(results.slice(0, 5), null, 2));
        }
        expect(results.length).toBe(0);
    });

    test('Vectors questions have unique distractors', async () => {
        const results = await page.evaluate(() => {
            const issues = [];
            
            // Test 1000 iterations of vectors questions
            for (let i = 0; i < 1000; i++) {
                const q = window.QuestionTemplates.Vectors.getVectors();
                const allAnswers = [q.displayAnswer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                
                if (uniqueAnswers.size !== allAnswers.length) {
                    issues.push({
                        iteration: i,
                        correctAnswer: q.displayAnswer,
                        distractors: q.distractors,
                        allAnswers: allAnswers
                    });
                }
            }
            
            return issues;
        });

        if (results.length > 0) {
            console.log('Found duplicate answers in vectors:', JSON.stringify(results.slice(0, 5), null, 2));
        }
        expect(results.length).toBe(0);
    });

    test('Why questions have unique distractors', async () => {
        const results = await page.evaluate(() => {
            const issues = [];
            
            // Test 1000 iterations of why questions across different levels
            for (let level = 0; level <= 25; level++) {
                for (let i = 0; i < 40; i++) {
                    const q = window.QuestionTemplates.WhyQuestions.getWhyQuestion(level);
                    const allAnswers = [q.displayAnswer, ...q.distractors];
                    const uniqueAnswers = new Set(allAnswers);
                    
                    if (uniqueAnswers.size !== allAnswers.length) {
                        issues.push({
                            level: level,
                            iteration: i,
                            correctAnswer: q.displayAnswer,
                            distractors: q.distractors,
                            allAnswers: allAnswers
                        });
                    }
                }
            }
            
            return issues;
        });

        if (results.length > 0) {
            console.log('Found duplicate answers in why questions:', JSON.stringify(results.slice(0, 5), null, 2));
        }
        expect(results.length).toBe(0);
    });
});
