const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Feedback Messaging Tests', () => {
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
        await wait(2000);
    });

    afterEach(async () => {
        await page.close();
    });

    test('Stats modal has feedback message element', async () => {
        // Open stats modal
        await page.evaluate(() => StatsModal.show());
        await wait(1000);
        
        const hasFeedbackElement = await page.evaluate(() => {
            const feedbackElement = document.getElementById('stat-feedback-message');
            return feedbackElement !== null;
        });
        
        expect(hasFeedbackElement).toBe(true);
    });

    test('Feedback message updates based on session activity', async () => {
        // Open stats modal with no activity
        await page.evaluate(() => StatsModal.show());
        await wait(1000);
        
        const initialMessage = await page.evaluate(() => {
            const feedbackElement = document.getElementById('stat-feedback-message');
            return feedbackElement ? feedbackElement.textContent : '';
        });
        
        // For short sessions, should encourage getting started (any encouraging message is valid)
        expect(initialMessage).toMatch(/started|begin|dive|journey|ready|let's/i);
        
        await page.evaluate(() => StatsModal.hide());
    });

    test('Explanation modal uses positive language', async () => {
        // Open explanation modal
        await page.evaluate(() => {
            ExplanationModal.show('This is a test explanation', true);
        });
        await wait(500);
        
        const modalContent = await page.evaluate(() => {
            const modal = document.getElementById('explanation-modal');
            return modal ? modal.textContent : '';
        });
        
        // Check for positive language
        expect(modalContent).toMatch(/Learning Opportunity|Wrong answers are where we learn/i);
        
        await page.evaluate(() => ExplanationModal.hide());
    });

    test('DisplayModes shows word-based skill descriptions', async () => {
        const skillDescription = await page.evaluate(() => {
            // Set level and check what description is shown
            if (!window.DisplayModes) return null;
            return window.DisplayModes.getSkillDescription(10);
        });
        
        // Should be a word-based description, not a number
        expect(skillDescription).toBeTruthy();
        expect(skillDescription).not.toMatch(/^\d+(\.\d+)?$/);
        expect(typeof skillDescription).toBe('string');
    });

    test('Break splash screen can be shown', async () => {
        // Simulate the break splash screen appearing
        const splashShown = await page.evaluate(() => {
            if (!window.Learning || !window.Learning.showBreakSplash) return false;
            window.Learning.showBreakSplash();
            // Check if splash is in DOM
            const splash = document.getElementById('break-splash');
            return splash !== null;
        });
        
        expect(splashShown).toBe(true);
        
        // Verify splash has positive messaging
        const splashContent = await page.evaluate(() => {
            const splash = document.getElementById('break-splash');
            return splash ? splash.textContent : '';
        });
        
        expect(splashContent).toMatch(/Great work|earned a break|Excellent effort|Well done|worked hard|persistence/i);
    });

    test('Break splash can be dismissed', async () => {
        await page.evaluate(() => {
            if (window.Learning && window.Learning.showBreakSplash) {
                window.Learning.showBreakSplash();
            }
        });
        await wait(500);
        
        // Click the dismiss button
        await page.evaluate(() => {
            const splash = document.getElementById('break-splash');
            if (splash) {
                const button = splash.querySelector('button');
                if (button) button.click();
            }
        });
        await wait(500);
        
        const splashExists = await page.evaluate(() => {
            const splash = document.getElementById('break-splash');
            return splash !== null;
        });
        
        expect(splashExists).toBe(false);
    });
});
