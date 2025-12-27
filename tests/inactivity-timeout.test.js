const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Inactivity Timeout Tests', () => {
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

    test('ActivityTracker has inactivity tracking properties', async () => {
        const hasProperties = await page.evaluate(() => {
            return typeof ActivityTracker.lastActivityTime !== 'undefined' &&
                   typeof ActivityTracker.inactivityCheckInterval !== 'undefined' &&
                   typeof ActivityTracker.inactivityOverlayVisible !== 'undefined';
        });
        expect(hasProperties).toBe(true);
    });

    test('ActivityTracker initializes lastActivityTime', async () => {
        const lastActivityTime = await page.evaluate(() => {
            return ActivityTracker.lastActivityTime;
        });
        expect(lastActivityTime).not.toBeNull();
        expect(typeof lastActivityTime).toBe('number');
    });

    test('User activity updates lastActivityTime', async () => {
        const initialTime = await page.evaluate(() => {
            return ActivityTracker.lastActivityTime;
        });
        
        await wait(1000);
        
        // Simulate user activity (click)
        await page.click('body');
        
        await wait(500);
        
        const updatedTime = await page.evaluate(() => {
            return ActivityTracker.lastActivityTime;
        });
        
        expect(updatedTime).toBeGreaterThan(initialTime);
    });

    test('Inactivity overlay can be shown and hidden', async () => {
        // Show overlay
        await page.evaluate(() => {
            ActivityTracker.showInactivityOverlay();
        });
        
        await wait(500);
        
        const overlayVisible = await page.evaluate(() => {
            const overlay = document.getElementById('inactivity-overlay');
            return overlay && overlay.style.display === 'flex';
        });
        
        expect(overlayVisible).toBe(true);
        
        // Hide overlay
        await page.evaluate(() => {
            ActivityTracker.hideInactivityOverlay();
        });
        
        await wait(500);
        
        const overlayHidden = await page.evaluate(() => {
            const overlay = document.getElementById('inactivity-overlay');
            return overlay && overlay.style.display === 'none';
        });
        
        expect(overlayHidden).toBe(true);
    });

    test('Inactivity overlay has correct styling', async () => {
        await page.evaluate(() => {
            ActivityTracker.showInactivityOverlay();
        });
        
        await wait(500);
        
        const overlayStyle = await page.evaluate(() => {
            const overlay = document.getElementById('inactivity-overlay');
            if (!overlay) return null;
            
            return {
                position: overlay.style.position,
                top: overlay.style.top,
                left: overlay.style.left,
                right: overlay.style.right,
                bottom: overlay.style.bottom,
                zIndex: overlay.style.zIndex,
                backgroundColor: overlay.style.backgroundColor
            };
        });
        
        expect(overlayStyle).not.toBeNull();
        expect(overlayStyle.position).toBe('fixed');
        expect(overlayStyle.top).toBe('10%');
        expect(overlayStyle.left).toBe('10%');
        expect(overlayStyle.right).toBe('10%');
        expect(overlayStyle.bottom).toBe('10%');
        expect(overlayStyle.backgroundColor).toContain('rgba(0, 0, 0, 0.9)');
    });

    test('Inactivity overlay displays "Session Paused" message', async () => {
        await page.evaluate(() => {
            ActivityTracker.showInactivityOverlay();
        });
        
        await wait(500);
        
        const messageText = await page.evaluate(() => {
            const overlay = document.getElementById('inactivity-overlay');
            if (!overlay) return null;
            return overlay.textContent;
        });
        
        expect(messageText).toBe('Session Paused');
    });

    test('User interaction hides inactivity overlay', async () => {
        // Show overlay manually
        await page.evaluate(() => {
            ActivityTracker.showInactivityOverlay();
        });
        
        await wait(500);
        
        // Verify overlay is visible
        let overlayVisible = await page.evaluate(() => {
            return ActivityTracker.inactivityOverlayVisible;
        });
        expect(overlayVisible).toBe(true);
        
        // Click to trigger interaction
        await page.click('body');
        
        await wait(500);
        
        // Verify overlay is hidden
        overlayVisible = await page.evaluate(() => {
            return ActivityTracker.inactivityOverlayVisible;
        });
        expect(overlayVisible).toBe(false);
    });

    test('Inactivity pauses the tracker', async () => {
        await page.evaluate(() => {
            ActivityTracker.reset();
            ActivityTracker.isPaused = false;
            ActivityTracker.showInactivityOverlay();
            ActivityTracker.pause();
        });
        
        await wait(500);
        
        const isPaused = await page.evaluate(() => {
            return ActivityTracker.isPaused;
        });
        
        expect(isPaused).toBe(true);
    });

    test('User interaction after inactivity resumes tracker', async () => {
        await page.evaluate(() => {
            ActivityTracker.reset();
            ActivityTracker.showInactivityOverlay();
            ActivityTracker.pause();
        });
        
        await wait(500);
        
        // User clicks to resume
        await page.click('body');
        
        await wait(500);
        
        const isPaused = await page.evaluate(() => {
            return ActivityTracker.isPaused;
        });
        
        expect(isPaused).toBe(false);
    });

    test('Reset clears inactivity overlay', async () => {
        await page.evaluate(() => {
            ActivityTracker.showInactivityOverlay();
        });
        
        await wait(500);
        
        await page.evaluate(() => {
            ActivityTracker.reset();
        });
        
        await wait(500);
        
        const overlayVisible = await page.evaluate(() => {
            return ActivityTracker.inactivityOverlayVisible;
        });
        
        expect(overlayVisible).toBe(false);
    });

    test('Cleanup clears inactivity check interval', async () => {
        const hasInterval = await page.evaluate(() => {
            return ActivityTracker.inactivityCheckInterval !== null;
        });
        
        expect(hasInterval).toBe(true);
        
        await page.evaluate(() => {
            ActivityTracker.cleanup();
        });
        
        await wait(500);
        
        const intervalCleared = await page.evaluate(() => {
            return ActivityTracker.inactivityCheckInterval === null;
        });
        
        expect(intervalCleared).toBe(true);
    });

    test('Inactivity check interval is set during init', async () => {
        const intervalExists = await page.evaluate(() => {
            return ActivityTracker.inactivityCheckInterval !== null &&
                   ActivityTracker.inactivityCheckInterval !== undefined;
        });
        
        expect(intervalExists).toBe(true);
    });

    test('Mouse movement updates lastActivityTime', async () => {
        const initialTime = await page.evaluate(() => {
            return ActivityTracker.lastActivityTime;
        });
        
        await wait(1000);
        
        // Simulate mouse movement
        await page.mouse.move(100, 100);
        
        await wait(500);
        
        const updatedTime = await page.evaluate(() => {
            return ActivityTracker.lastActivityTime;
        });
        
        expect(updatedTime).toBeGreaterThan(initialTime);
    });

    test('Keyboard input updates lastActivityTime', async () => {
        const initialTime = await page.evaluate(() => {
            return ActivityTracker.lastActivityTime;
        });
        
        await wait(1000);
        
        // Simulate keyboard input
        await page.keyboard.press('Space');
        
        await wait(500);
        
        const updatedTime = await page.evaluate(() => {
            return ActivityTracker.lastActivityTime;
        });
        
        expect(updatedTime).toBeGreaterThan(initialTime);
    });
});
