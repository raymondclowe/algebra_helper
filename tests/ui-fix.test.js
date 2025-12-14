const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('UI Fix Tests - No Screen Shift and Correct Answer Highlight', () => {
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
        await page.waitForFunction(
            () => window.MathJax && window.MathJax.typesetPromise && window.APP,
            { timeout: 15000 }
        );
        await wait(2000);
        
        // Switch to drill mode
        await page.evaluate(() => {
            window.APP.mode = 'drill';
            window.UI.nextQuestion();
        });
        await wait(1000);
    });

    afterEach(async () => {
        await page.close();
    });

    test('Next button is always present (invisible initially) to prevent UI shift', async () => {
        // Check that Next button exists and is invisible initially
        const nextBtn = await page.$('#next-btn');
        expect(nextBtn).not.toBeNull();
        
        const isInvisible = await page.evaluate(() => {
            const btn = document.getElementById('next-btn');
            return btn.classList.contains('invisible');
        });
        expect(isInvisible).toBe(true);
    });

    test('Explanation modal appears after wrong answer without causing layout shift', async () => {
        // Get the initial position of elements
        const initialPositions = await page.evaluate(() => {
            const mcOptions = document.getElementById('mc-options');
            const rect = mcOptions.getBoundingClientRect();
            return {
                top: rect.top,
                height: rect.height
            };
        });

        // Click a wrong answer (using dataset.correct to find wrong answer)
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            // Find a wrong answer
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check that explanation modal is now visible
        const modalVisible = await page.evaluate(() => {
            const modal = document.getElementById('explanation-modal');
            return !modal.classList.contains('hidden');
        });
        expect(modalVisible).toBe(true);

        // Verify the mc-options position hasn't changed significantly
        const finalPositions = await page.evaluate(() => {
            const mcOptions = document.getElementById('mc-options');
            const rect = mcOptions.getBoundingClientRect();
            return {
                top: rect.top,
                height: rect.height
            };
        });

        // Allow for small rendering differences (< 5px)
        expect(Math.abs(finalPositions.top - initialPositions.top)).toBeLessThan(5);
    });

    test('Correct answer is highlighted in green after wrong answer', async () => {
        // Get the correct answer
        const correctAnswer = await page.evaluate(() => window.APP.currentQ.displayAnswer);

        // Click a wrong answer (using dataset.correct to find wrong answer)
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check that the correct answer button is now green (using dataset.correct)
        const correctButtonIsGreen = await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'true') {
                    return btn.className.includes('bg-green-600');
                }
            }
            return false;
        });

        expect(correctButtonIsGreen).toBe(true);
    });

    test('Explanation modal is shown after wrong answer', async () => {
        // Click a wrong answer (using dataset.correct to find wrong answer)
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check that explanation modal is visible
        const explanationVisible = await page.evaluate(() => {
            const modal = document.getElementById('explanation-modal');
            return !modal.classList.contains('hidden');
        });

        expect(explanationVisible).toBe(true);

        // Check that explanation text exists
        const explanationText = await page.$eval('#explanation-modal-text', el => el.textContent);
        expect(explanationText.length).toBeGreaterThan(0);
    });

    test('Correct answer auto-advances without showing Next button', async () => {
        // Click the correct answer (using dataset.correct)
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'true') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check that Next button is still invisible
        const isInvisible = await page.evaluate(() => {
            const btn = document.getElementById('next-btn');
            return btn.classList.contains('invisible');
        });
        expect(isInvisible).toBe(true);
    });

    test('Reserved space exists for explanation to prevent UI shift', async () => {
        // Get the wrapper around explanation box
        const hasReservedSpace = await page.evaluate(() => {
            const explanationBox = document.getElementById('explanation-box');
            const parent = explanationBox.parentElement;
            // Check if parent has min-height style
            return parent.style.minHeight !== '';
        });

        expect(hasReservedSpace).toBe(true);
    });
});
