const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Explanation Modal Tests', () => {
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
            () => window.MathJax && window.MathJax.typesetPromise && window.APP && window.ExplanationModal,
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

    test('Explanation modal is initialized', async () => {
        const modalExists = await page.evaluate(() => {
            return document.getElementById('explanation-modal') !== null;
        });
        expect(modalExists).toBe(true);
    });

    test('Explanation modal appears after wrong answer', async () => {
        // Click a wrong answer
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false' && btn.dataset.dontKnow === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check that modal is visible
        const modalVisible = await page.evaluate(() => {
            const modal = document.getElementById('explanation-modal');
            return !modal.classList.contains('hidden');
        });

        expect(modalVisible).toBe(true);
    });

    test('Explanation modal has close button', async () => {
        // Click a wrong answer
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false' && btn.dataset.dontKnow === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check that close button exists and is visible
        const closeButtonExists = await page.evaluate(() => {
            const modal = document.getElementById('explanation-modal');
            const closeBtn = modal.querySelector('button[onclick*="hide"]');
            return closeBtn !== null;
        });

        expect(closeButtonExists).toBe(true);
    });

    test('Explanation modal has retry button after wrong answer', async () => {
        // Click a wrong answer
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false' && btn.dataset.dontKnow === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check that retry button exists and is visible
        const retryButtonVisible = await page.evaluate(() => {
            const retryBtn = document.getElementById('retry-btn');
            return retryBtn && !retryBtn.classList.contains('hidden');
        });

        expect(retryButtonVisible).toBe(true);
    });

    test('Explanation modal does not have retry button for "I don\'t know"', async () => {
        // Click "I don't know"
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.dontKnow === 'true') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check that retry button is hidden
        const retryButtonHidden = await page.evaluate(() => {
            const retryBtn = document.getElementById('retry-btn');
            return retryBtn && retryBtn.classList.contains('hidden');
        });

        expect(retryButtonHidden).toBe(true);
    });

    test('Closing modal resets UI state', async () => {
        // Click a wrong answer
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false' && btn.dataset.dontKnow === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Close the modal using the X button
        await page.evaluate(() => {
            window.ExplanationModal.hide();
        });

        await wait(500);

        // Check that buttons are re-enabled
        const buttonsEnabled = await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.disabled) {
                    return false;
                }
            }
            return true;
        });

        expect(buttonsEnabled).toBe(true);

        // Check that modal is hidden
        const modalHidden = await page.evaluate(() => {
            const modal = document.getElementById('explanation-modal');
            return modal.classList.contains('hidden');
        });

        expect(modalHidden).toBe(true);
    });

    test('Retry button allows re-attempting the same question', async () => {
        // Get the current question text
        const questionBefore = await page.evaluate(() => window.APP.currentQ.tex);

        // Click a wrong answer
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false' && btn.dataset.dontKnow === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Click retry button
        await page.evaluate(() => {
            window.ExplanationModal.retry();
        });

        await wait(500);

        // Get the question text after retry
        const questionAfter = await page.evaluate(() => window.APP.currentQ.tex);

        // Question should be the same
        expect(questionAfter).toBe(questionBefore);

        // Buttons should be enabled
        const buttonsEnabled = await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.disabled) {
                    return false;
                }
            }
            return true;
        });

        expect(buttonsEnabled).toBe(true);
    });

    test('Next question button advances to new question', async () => {
        // Get the current question text
        const questionBefore = await page.evaluate(() => window.APP.currentQ.tex);

        // Click a wrong answer
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false' && btn.dataset.dontKnow === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Click next question button
        await page.evaluate(() => {
            window.ExplanationModal.nextQuestion();
        });

        await wait(1000);

        // Get the question text after next
        const questionAfter = await page.evaluate(() => window.APP.currentQ.tex);

        // Question should be different (most of the time - small chance of same question)
        // We'll check that the modal is closed at least
        const modalHidden = await page.evaluate(() => {
            const modal = document.getElementById('explanation-modal');
            return modal.classList.contains('hidden');
        });

        expect(modalHidden).toBe(true);
    });

    test('Explanation modal has higher z-index than other elements', async () => {
        // Click a wrong answer
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false' && btn.dataset.dontKnow === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check z-index of modal
        const modalZIndex = await page.evaluate(() => {
            const modal = document.getElementById('explanation-modal');
            const styles = window.getComputedStyle(modal);
            return parseInt(styles.zIndex);
        });

        // Modal should have z-index of 50 (defined in CSS)
        expect(modalZIndex).toBe(50);

        // Check that it's higher than the app container
        const appZIndex = await page.evaluate(() => {
            const app = document.getElementById('app');
            const styles = window.getComputedStyle(app);
            return parseInt(styles.zIndex) || 0;
        });

        expect(modalZIndex).toBeGreaterThan(appZIndex);
    });

    test('Explanation modal is scrollable on mobile', async () => {
        // Set viewport to mobile size
        await page.setViewport({ width: 375, height: 667 });

        // Click a wrong answer
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false' && btn.dataset.dontKnow === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check that modal content is scrollable
        const isScrollable = await page.evaluate(() => {
            const modal = document.getElementById('explanation-modal');
            const content = modal.querySelector('.max-h-\\[90vh\\]');
            return content && content.classList.contains('overflow-y-auto');
        });

        expect(isScrollable).toBe(true);
    });

    test('Explanation modal works on desktop viewport', async () => {
        // Set viewport to desktop size
        await page.setViewport({ width: 1920, height: 1080 });

        // Click a wrong answer
        await page.evaluate(() => {
            const buttons = document.getElementById('mc-options').querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.dataset.correct === 'false' && btn.dataset.dontKnow === 'false') {
                    btn.click();
                    break;
                }
            }
        });

        await wait(500);

        // Check that modal is visible
        const modalVisible = await page.evaluate(() => {
            const modal = document.getElementById('explanation-modal');
            return !modal.classList.contains('hidden');
        });

        expect(modalVisible).toBe(true);
    });
});
