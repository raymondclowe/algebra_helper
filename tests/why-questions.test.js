const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Why Question Type Tests', () => {
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

    test('Generator produces why questions', async () => {
        const hasWhyQuestions = await page.evaluate(() => {
            // Test that getWhyQuestion method exists
            return typeof Generator.getWhyQuestion === 'function';
        });
        
        expect(hasWhyQuestions).toBe(true);
    });

    test('Why questions have correct structure', async () => {
        const whyQuestion = await page.evaluate(() => {
            // Generate a why question
            const q = Generator.getWhyQuestion(5);
            return {
                hasType: q.type === 'why',
                hasTex: !!q.tex,
                hasInstruction: !!q.instruction,
                hasDisplayAnswer: !!q.displayAnswer,
                hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                hasExplanation: !!q.explanation
            };
        });
        
        expect(whyQuestion.hasType).toBe(true);
        expect(whyQuestion.hasTex).toBe(true);
        expect(whyQuestion.hasInstruction).toBe(true);
        expect(whyQuestion.hasDisplayAnswer).toBe(true);
        expect(whyQuestion.hasDistractors).toBe(true);
        expect(whyQuestion.hasExplanation).toBe(true);
    });

    test('Why questions are interleaved in drill mode', async () => {
        // Fast-forward through calibration to reach drill mode
        await page.evaluate(() => {
            // Force drill mode
            APP.mode = 'drill';
            APP.level = 5.0;
            Generator.questionCounter = 0;
        });
        
        const questionTypes = await page.evaluate(() => {
            const types = [];
            // Generate several questions to see if why questions appear
            for (let i = 0; i < 8; i++) {
                const q = Generator.getQuestion(5);
                types.push(q.type || 'standard');
            }
            return types;
        });
        
        // Check that at least one why question appears (should be every 4th)
        expect(questionTypes).toContain('why');
        
        // Check the pattern - should be every 4th question
        expect(questionTypes[3]).toBe('why');
        expect(questionTypes[7]).toBe('why');
    });

    test('Why questions include "I don\'t know" option in UI', async () => {
        // Skip calibration and go to drill mode
        await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            Generator.questionCounter = 3; // Next question will be a why question
            UI.nextQuestion();
        });
        
        await wait(2000); // Wait for rendering
        
        // Check if "I don't know" option exists
        const hasDontKnow = await page.evaluate(() => {
            const options = document.querySelectorAll('#mc-options button');
            let foundDontKnow = false;
            options.forEach(btn => {
                if (btn.innerText.toLowerCase().includes("don't know")) {
                    foundDontKnow = true;
                }
            });
            return foundDontKnow;
        });
        
        expect(hasDontKnow).toBe(true);
    });

    test('"Don\'t know" selection shows explanation without penalty', async () => {
        // Skip calibration and go to drill mode with a why question
        const initialLevel = await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            APP.history = [];
            Generator.questionCounter = 3; // Next question will be a why question
            UI.nextQuestion();
            return APP.level;
        });
        
        await wait(2000); // Wait for rendering
        
        // Click "Don't know" button
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
        
        // Check that level was reduced to make future problems easier (adaptive difficulty)
        const newLevel = await page.evaluate(() => APP.level);
        expect(newLevel).toBeLessThan(initialLevel);
        expect(newLevel).toBeCloseTo(initialLevel - 0.3, 1);
        
        // Check that history wasn't affected (no penalty for "don't know")
        const historyLength = await page.evaluate(() => {
            return APP.history.length;
        });
        
        expect(historyLength).toBe(0);
    });

    test('Correct answer on why question increases score', async () => {
        // Skip calibration and go to drill mode with a why question
        const initialLevel = await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            APP.streak = 0;
            Generator.questionCounter = 3; // Next question will be a why question
            UI.nextQuestion();
            return APP.level;
        });
        
        await wait(2000);
        
        // Click the correct answer
        await page.evaluate(() => {
            const options = document.querySelectorAll('#mc-options button');
            for (let i = 0; i < options.length; i++) {
                const btn = options[i];
                if (btn.dataset.correct === 'true') {
                    btn.click();
                    break;
                }
            }
        });
        
        await wait(500);
        
        // Check that level increased
        const newLevel = await page.evaluate(() => APP.level);
        expect(newLevel).toBeGreaterThan(initialLevel);
    });

    test('Wrong answer on why question decreases score', async () => {
        // Skip calibration and go to drill mode with a why question
        const initialLevel = await page.evaluate(() => {
            APP.mode = 'drill';
            APP.level = 5.0;
            APP.streak = 0;
            Generator.questionCounter = 3; // Next question will be a why question
            UI.nextQuestion();
            return APP.level;
        });
        
        await wait(2000);
        
        // Click a wrong answer (not "Don't know" and not correct)
        await page.evaluate(() => {
            const options = document.querySelectorAll('#mc-options button');
            for (let i = 0; i < options.length; i++) {
                const btn = options[i];
                if (btn.dataset.correct === 'false' && btn.dataset.dontKnow === 'false') {
                    btn.click();
                    break;
                }
            }
        });
        
        await wait(500);
        
        // Check that level decreased
        const newLevel = await page.evaluate(() => APP.level);
        expect(newLevel).toBeLessThan(initialLevel);
    });

    test('Why questions work at different difficulty levels', async () => {
        const levels = [2, 4, 6, 8, 10];
        
        for (const level of levels) {
            const whyQuestion = await page.evaluate((lvl) => {
                const q = Generator.getWhyQuestion(lvl);
                return {
                    type: q.type,
                    hasContent: !!q.tex && !!q.instruction
                };
            }, level);
            
            expect(whyQuestion.type).toBe('why');
            expect(whyQuestion.hasContent).toBe(true);
        }
    });
});
