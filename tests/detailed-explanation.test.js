const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Detailed Explanation Feature Tests', () => {
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

    test('Feedback buttons appear after wrong answer', async () => {
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

        // Check that feedback buttons are visible
        const feedbackButtonsVisible = await page.evaluate(() => {
            const feedbackButtons = document.getElementById('feedback-buttons');
            return feedbackButtons && !feedbackButtons.classList.contains('hidden');
        });

        expect(feedbackButtonsVisible).toBe(true);
    });

    test('Action buttons are hidden initially after wrong answer', async () => {
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

        // Check that action buttons are hidden
        const actionButtonsHidden = await page.evaluate(() => {
            const actionButtons = document.getElementById('action-buttons');
            return actionButtons && actionButtons.classList.contains('hidden');
        });

        expect(actionButtonsHidden).toBe(true);
    });

    test('"Got it!" button switches to action buttons', async () => {
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

        // Click "Got it!" button
        await page.evaluate(() => {
            window.ExplanationModal.handleGotIt();
        });

        await wait(200);

        // Check that action buttons are now visible
        const actionButtonsVisible = await page.evaluate(() => {
            const actionButtons = document.getElementById('action-buttons');
            return actionButtons && !actionButtons.classList.contains('hidden');
        });

        // Check that feedback buttons are now hidden
        const feedbackButtonsHidden = await page.evaluate(() => {
            const feedbackButtons = document.getElementById('feedback-buttons');
            return feedbackButtons && feedbackButtons.classList.contains('hidden');
        });

        expect(actionButtonsVisible).toBe(true);
        expect(feedbackButtonsHidden).toBe(true);
    });

    test('"Explain more" button shows detailed explanation', async () => {
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

        // Get the original explanation text
        const originalExplanation = await page.evaluate(() => {
            return document.getElementById('explanation-modal-text').innerHTML;
        });

        // Click "Explain more" button
        await page.evaluate(() => {
            window.ExplanationModal.showDetailedExplanation();
        });

        await wait(500);

        // Get the new explanation text
        const detailedExplanation = await page.evaluate(() => {
            return document.getElementById('explanation-modal-text').innerHTML;
        });

        // Check that explanation has changed
        expect(detailedExplanation).not.toBe(originalExplanation);
        
        // Check that detailed explanation contains expected elements
        const hasDetailedStructure = await page.evaluate(() => {
            const text = document.getElementById('explanation-modal-text').innerHTML;
            return text.includes('Detailed Step-by-Step Explanation') ||
                   text.includes('Step-by-step approach');
        });

        expect(hasDetailedStructure).toBe(true);
    });

    test('"Explain more" button switches to action buttons', async () => {
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

        // Click "Explain more" button
        await page.evaluate(() => {
            window.ExplanationModal.showDetailedExplanation();
        });

        await wait(500);

        // Check that action buttons are now visible
        const actionButtonsVisible = await page.evaluate(() => {
            const actionButtons = document.getElementById('action-buttons');
            return actionButtons && !actionButtons.classList.contains('hidden');
        });

        // Check that feedback buttons are now hidden
        const feedbackButtonsHidden = await page.evaluate(() => {
            const feedbackButtons = document.getElementById('feedback-buttons');
            return feedbackButtons && feedbackButtons.classList.contains('hidden');
        });

        expect(actionButtonsVisible).toBe(true);
        expect(feedbackButtonsHidden).toBe(true);
    });

    test('Detailed explanation includes problem context', async () => {
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

        // Click "Explain more" button
        await page.evaluate(() => {
            window.ExplanationModal.showDetailedExplanation();
        });

        await wait(500);

        // Check that detailed explanation includes key elements
        const hasRequiredElements = await page.evaluate(() => {
            const text = document.getElementById('explanation-modal-text').innerHTML;
            return text.includes('Problem:') && 
                   text.includes('Correct Answer:');
        });

        expect(hasRequiredElements).toBe(true);
    });

    test('"I don\'t know" shows action buttons directly (no feedback buttons)', async () => {
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

        // Check that action buttons are visible
        const actionButtonsVisible = await page.evaluate(() => {
            const actionButtons = document.getElementById('action-buttons');
            return actionButtons && !actionButtons.classList.contains('hidden');
        });

        // Check that feedback buttons are hidden
        const feedbackButtonsHidden = await page.evaluate(() => {
            const feedbackButtons = document.getElementById('feedback-buttons');
            return feedbackButtons && feedbackButtons.classList.contains('hidden');
        });

        expect(actionButtonsVisible).toBe(true);
        expect(feedbackButtonsHidden).toBe(true);
    });

    test('Retry button appears in action buttons after "Got it!"', async () => {
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

        // Click "Got it!" button
        await page.evaluate(() => {
            window.ExplanationModal.handleGotIt();
        });

        await wait(200);

        // Check that retry button is visible
        const retryButtonVisible = await page.evaluate(() => {
            const retryBtn = document.getElementById('retry-btn');
            return retryBtn && !retryBtn.classList.contains('hidden');
        });

        expect(retryButtonVisible).toBe(true);
    });

    test('generateDetailedExplanation creates enhanced content', async () => {
        // Test the generateDetailedExplanation function
        const hasEnhancedContent = await page.evaluate(() => {
            // Create a mock question
            const mockQuestion = {
                instruction: 'Solve for x',
                tex: '2x + 4 = 10',
                displayAnswer: 'x = 3',
                explanation: 'Subtract 4 from both sides, then divide by 2.',
                type: 'regular'
            };
            
            const detailed = window.ExplanationModal.generateDetailedExplanation(mockQuestion);
            
            // Check that it contains key elements
            return detailed.includes('Detailed Step-by-Step Explanation') &&
                   detailed.includes('Problem:') &&
                   detailed.includes('Correct Answer:') &&
                   detailed.includes('Step-by-step approach:');
        });

        expect(hasEnhancedContent).toBe(true);
    });
});
