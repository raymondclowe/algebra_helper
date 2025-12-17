const puppeteer = require('puppeteer');

describe('Duplicate Answers Bug Fix', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        await page.goto('http://localhost:8080/algebra-helper.html');
        
        // Wait for the app to initialize
        await page.waitForFunction(() => {
            return window.Generator && window.APP;
        }, { timeout: 10000 });
    });

    afterAll(async () => {
        await browser.close();
    });

    test('No duplicate answers in button options - comprehensive test', async () => {
        const results = await page.evaluate(() => {
            const issues = [];
            
            // Test each level's question generator 1000 times
            const testCases = [
                { name: 'lvl1', func: () => window.Generator.lvl1() },
                { name: 'lvl2', func: () => window.Generator.lvl2() },
                { name: 'lvl3', func: () => window.Generator.lvl3() },
                { name: 'lvl4', func: () => window.Generator.lvl4() },
                { name: 'lvl5', func: () => window.Generator.lvl5() },
                { name: 'getBasicArithmetic', func: () => window.Generator.getBasicArithmetic() },
                { name: 'getSquaresAndRoots', func: () => window.Generator.getSquaresAndRoots() },
                { name: 'getMultiplicationTables', func: () => window.Generator.getMultiplicationTables() },
            ];
            
            for (let testCase of testCases) {
                for (let i = 0; i < 1000; i++) {
                    const q = testCase.func();
                    const allAnswers = [q.displayAnswer, ...q.distractors];
                    const uniqueAnswers = new Set(allAnswers);
                    
                    if (uniqueAnswers.size !== allAnswers.length) {
                        issues.push({
                            generator: testCase.name,
                            iteration: i,
                            correctAnswer: q.displayAnswer,
                            distractors: q.distractors,
                            allAnswers: allAnswers,
                            uniqueCount: uniqueAnswers.size
                        });
                    }
                }
            }
            
            return issues;
        });

        if (results.length > 0) {
            console.log('Found duplicate answers:', JSON.stringify(results.slice(0, 10), null, 2));
            expect(results.length).toBe(0);
        }
    });

    test('All buttons have unique content in learning mode', async () => {
        // Switch to learning mode
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5;
        });

        // Generate and display a question
        await page.evaluate(() => {
            window.APP.currentQ = window.Generator.getQuestion(window.APP.level);
            window.Learning.setupUI();
        });

        // Wait for MathJax to render
        await page.waitForTimeout(1000);

        // Get all button texts
        const buttonTexts = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('#mc-options button'));
            return buttons.map(btn => btn.textContent.trim());
        });

        // Check for duplicates
        const uniqueTexts = new Set(buttonTexts);
        expect(uniqueTexts.size).toBe(buttonTexts.length);
    });

    test('Verify fix works across multiple question generations', async () => {
        const duplicateFound = await page.evaluate(() => {
            // Test 100 question generations
            for (let i = 0; i < 100; i++) {
                const q = window.Generator.getQuestion(5);
                const allAnswers = [q.displayAnswer, ...q.distractors];
                const uniqueAnswers = new Set(allAnswers);
                
                if (uniqueAnswers.size !== allAnswers.length) {
                    return true; // Duplicate found
                }
            }
            return false; // No duplicates
        });

        expect(duplicateFound).toBe(false);
    });
});
