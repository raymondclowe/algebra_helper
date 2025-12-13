const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('I Don\'t Know Button Tests', () => {
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
    });

    afterEach(async () => {
        await page.close();
    });

    test('"I don\'t know" button appears on all drill questions', async () => {
        // Skip calibration and go to drill mode with a standard question
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            Generator.questionCounter = 0; // Standard question (not a "why" question)
            UI.nextQuestion();
        });
        
        await wait(2000); // Wait for rendering
        
        // Check if "I don't know" option exists
        const hasDontKnow = await page.evaluate(() => {
            const options = document.querySelectorAll('#mc-options button');
            let foundDontKnow = false;
            options.forEach(btn => {
                if (btn.innerText.includes("don't know") || btn.innerText.includes("I don't know")) {
                    foundDontKnow = true;
                }
            });
            return foundDontKnow;
        });
        
        expect(hasDontKnow).toBe(true);
    });

    test('"I don\'t know" button shows "no penalty" text', async () => {
        // Skip calibration and go to drill mode
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            Generator.questionCounter = 0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        // Check if "no penalty" text is present
        const hasNoPenaltyText = await page.evaluate(() => {
            const options = document.querySelectorAll('#mc-options button');
            let foundNoPenalty = false;
            options.forEach(btn => {
                if (btn.innerText.includes("no penalty")) {
                    foundNoPenalty = true;
                }
            });
            return foundNoPenalty;
        });
        
        expect(hasNoPenaltyText).toBe(true);
    });

    test('"I don\'t know" shows explanation and correct answer without affecting history', async () => {
        // Skip calibration and go to drill mode
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            APP.history = [];
            Generator.questionCounter = 0; // Standard question
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        // Click "I don't know" button
        await page.evaluate(() => {
            const options = document.querySelectorAll('#mc-options button');
            for (let i = 0; i < options.length; i++) {
                const btn = options[i];
                if (btn.dataset.dontKnow === 'true') {
                    btn.click();
                    break;
                }
            }
        });
        
        await wait(500);
        
        // Check that explanation is shown
        const explanationVisible = await page.evaluate(() => {
            const explanationBox = document.getElementById('explanation-box');
            return !explanationBox.classList.contains('hidden');
        });
        
        expect(explanationVisible).toBe(true);
        
        // Check that history wasn't affected (no penalty)
        const historyLength = await page.evaluate(() => {
            return APP.history.length;
        });
        
        expect(historyLength).toBe(0);
    });

    test('"I don\'t know" reduces difficulty level to make future problems easier', async () => {
        // Skip calibration and go to drill mode
        const initialLevel = await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            Generator.questionCounter = 0;
            UI.nextQuestion();
            return APP.level;
        });
        
        await wait(2000);
        
        // Click "I don't know" button
        await page.evaluate(() => {
            const options = document.querySelectorAll('#mc-options button');
            for (let i = 0; i < options.length; i++) {
                const btn = options[i];
                if (btn.dataset.dontKnow === 'true') {
                    btn.click();
                    break;
                }
            }
        });
        
        await wait(500);
        
        // Check that level decreased (adaptive difficulty)
        const newLevel = await page.evaluate(() => APP.level);
        expect(newLevel).toBeLessThan(initialLevel);
        
        // Verify it decreased by approximately 0.3
        expect(newLevel).toBeCloseTo(initialLevel - 0.3, 1);
    });

    test('"I don\'t know" does not affect streak', async () => {
        // Skip calibration and go to drill mode with a streak
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            APP.streak = 2; // Set a streak
            Generator.questionCounter = 0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        // Click "I don't know" button
        await page.evaluate(() => {
            const options = document.querySelectorAll('#mc-options button');
            for (let i = 0; i < options.length; i++) {
                const btn = options[i];
                if (btn.dataset.dontKnow === 'true') {
                    btn.click();
                    break;
                }
            }
        });
        
        await wait(500);
        
        // Check that streak wasn't affected
        const streak = await page.evaluate(() => APP.streak);
        expect(streak).toBe(2);
    });

    test('"I don\'t know" highlights correct answer in green', async () => {
        // Skip calibration and go to drill mode
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            Generator.questionCounter = 0;
            UI.nextQuestion();
        });
        
        await wait(2000);
        
        // Click "I don't know" button
        await page.evaluate(() => {
            const options = document.querySelectorAll('#mc-options button');
            for (let i = 0; i < options.length; i++) {
                const btn = options[i];
                if (btn.dataset.dontKnow === 'true') {
                    btn.click();
                    break;
                }
            }
        });
        
        await wait(500);
        
        // Check that correct answer has green styling
        const hasGreenCorrectAnswer = await page.evaluate(() => {
            const options = document.querySelectorAll('#mc-options button');
            let foundGreen = false;
            options.forEach(btn => {
                if (btn.dataset.correct === 'true' && btn.className.includes('bg-green-600')) {
                    foundGreen = true;
                }
            });
            return foundGreen;
        });
        
        expect(hasGreenCorrectAnswer).toBe(true);
    });

    test('"I don\'t know" button appears on multiple consecutive questions', async () => {
        // Test that button persists across multiple questions
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
        });
        
        for (let i = 0; i < 3; i++) {
            const questionNum = i;
            await page.evaluate((qNum) => {
                Generator.questionCounter = qNum; // Various question types
                UI.nextQuestion();
            }, questionNum);
            
            await wait(2000);
            
            const hasDontKnow = await page.evaluate(() => {
                const options = document.querySelectorAll('#mc-options button');
                let found = false;
                options.forEach(btn => {
                    if (btn.dataset.dontKnow === 'true') {
                        found = true;
                    }
                });
                return found;
            });
            
            expect(hasDontKnow).toBe(true);
        }
    });
});
