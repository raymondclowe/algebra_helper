/**
 * Speed Tracking Tests
 * Tests for response speed tracking and difficulty adjustment
 */

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Speed Tracking Tests', () => {
    beforeEach(async () => {
        await page.goto('http://localhost:8000/algebra-helper.html');
        await page.waitForSelector('#question-math');
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5;
            window.APP.history = [];
            window.APP.speedHistory = [];
            window.APP.streak = 0;
        });
    });

    test('Speed history is tracked for correct answers', async () => {
        // Setup learning mode
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5;
            window.APP.history = [];
            window.APP.speedHistory = [];
            window.UI.nextQuestion();
            // Set start time AFTER nextQuestion to simulate 3 second response
            window.APP.startTime = Date.now() - 3000;
        });

        await page.waitForSelector('#mc-options button');

        // Click correct answer
        await page.evaluate(() => {
            const correctButton = document.querySelector('#mc-options button[data-correct="true"]');
            if (correctButton) correctButton.click();
        });

        // Wait for processing
        await wait(500);

        // Check that speed history was updated
        const speedHistory = await page.evaluate(() => window.APP.speedHistory);
        expect(speedHistory.length).toBeGreaterThan(0);
    });

    test('Fast answer (< 5 seconds) gives full level increase', async () => {
        // Setup
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            window.APP.history = [];
            window.APP.speedHistory = [];
            window.APP.streak = 0;
            window.UI.nextQuestion();
            // Set start time AFTER nextQuestion to simulate 3 second response
            window.APP.startTime = Date.now() - 3000;
        });

        await page.waitForSelector('#mc-options button');

        const levelBefore = await page.evaluate(() => window.APP.level);

        // Click correct answer
        await page.evaluate(() => {
            const correctButton = document.querySelector('#mc-options button[data-correct="true"]');
            if (correctButton) correctButton.click();
        });

        await wait(500);

        const levelAfter = await page.evaluate(() => window.APP.level);
        const levelIncrease = levelAfter - levelBefore;

        // Fast answer should get 0.2 delta (base movement)
        expect(levelIncrease).toBeCloseTo(0.2, 1);
    });

    test('Slow answer (> 10 seconds) gives reduced level increase', async () => {
        // Setup
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            window.APP.history = [];
            window.APP.speedHistory = [];
            window.APP.streak = 0;
            window.UI.nextQuestion();
            // Set start time AFTER nextQuestion to simulate 12 second delay
            window.APP.startTime = Date.now() - 12000;
        });

        await page.waitForSelector('#mc-options button');

        const levelBefore = await page.evaluate(() => window.APP.level);

        // Click correct answer
        await page.evaluate(() => {
            const correctButton = document.querySelector('#mc-options button[data-correct="true"]');
            if (correctButton) correctButton.click();
        });

        await wait(500);

        const levelAfter = await page.evaluate(() => window.APP.level);
        const levelIncrease = levelAfter - levelBefore;

        // Slow answer should get 0.2 * 0.5 = 0.1 delta (reduced movement)
        expect(levelIncrease).toBeCloseTo(0.1, 1);
    });

    test('Slow correct answer shows motivational feedback', async () => {
        // Setup
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            window.UI.nextQuestion();
            // Set start time AFTER nextQuestion to simulate 12 second response
            window.APP.startTime = Date.now() - 12000;
        });

        await page.waitForSelector('#mc-options button');

        // Click correct answer
        await page.evaluate(() => {
            const correctButton = document.querySelector('#mc-options button[data-correct="true"]');
            if (correctButton) correctButton.click();
        });

        // Wait for toast to appear
        await wait(500);

        // Check that a toast with yellow background (motivational) appears
        const hasMotivationalToast = await page.evaluate(() => {
            const toasts = document.querySelectorAll('.toast');
            for (let toast of toasts) {
                if (toast.className.includes('bg-yellow-500')) {
                    return true;
                }
            }
            return false;
        });

        expect(hasMotivationalToast).toBe(true);
    });

    test('Fast answer with streak triggers turbo mode bonus', async () => {
        // Setup with existing streak
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            window.APP.history = [1, 1]; // Two previous correct
            window.APP.speedHistory = [];
            window.APP.streak = 2;
            window.UI.nextQuestion();
            // Set start time AFTER nextQuestion to simulate 3 second response
            window.APP.startTime = Date.now() - 3000;
        });

        await page.waitForSelector('#mc-options button');

        const levelBefore = await page.evaluate(() => window.APP.level);

        // Click correct answer
        await page.evaluate(() => {
            const correctButton = document.querySelector('#mc-options button[data-correct="true"]');
            if (correctButton) correctButton.click();
        });

        await wait(500);

        const levelAfter = await page.evaluate(() => window.APP.level);
        const levelIncrease = levelAfter - levelBefore;
        const streak = await page.evaluate(() => window.APP.streak);

        // Should have streak of 3 and get turbo bonus (0.5)
        expect(streak).toBe(3);
        expect(levelIncrease).toBeCloseTo(0.5, 1);
    });

    test('Speed history tracks multiple responses', async () => {
        // Test fast answer
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5;
            window.APP.history = [];
            window.APP.speedHistory = [];
            window.APP.streak = 0;
            window.UI.nextQuestion();
            window.APP.startTime = Date.now() - 3000; // 3 seconds (fast)
        });

        await page.waitForSelector('#mc-options button');
        await page.evaluate(() => {
            const correctButton = document.querySelector('#mc-options button[data-correct="true"]');
            if (correctButton) correctButton.click();
        });
        await wait(2000); // Wait for auto-advance

        // Test normal answer (nextQuestion is called by auto-advance)
        await page.evaluate(() => {
            window.APP.startTime = Date.now() - 7000; // 7 seconds (normal)
        });

        await page.waitForSelector('#mc-options button');
        await page.evaluate(() => {
            const correctButton = document.querySelector('#mc-options button[data-correct="true"]');
            if (correctButton) correctButton.click();
        });
        await wait(2000); // Wait for auto-advance

        // Test slow answer (nextQuestion is called by auto-advance)
        await page.evaluate(() => {
            window.APP.startTime = Date.now() - 12000; // 12 seconds (slow)
        });

        await page.waitForSelector('#mc-options button');
        await page.evaluate(() => {
            const correctButton = document.querySelector('#mc-options button[data-correct="true"]');
            if (correctButton) correctButton.click();
        });
        await wait(2000); // Wait for auto-advance

        const speedHistory = await page.evaluate(() => window.APP.speedHistory);
        
        // Should have 3 entries
        expect(speedHistory.length).toBe(3);
        
        // First should be 1 (fast), second 0.5 (normal), third 0 (slow)
        expect(speedHistory[0]).toBe(1);
        expect(speedHistory[1]).toBe(0.5);
        expect(speedHistory[2]).toBe(0);
    });
});
