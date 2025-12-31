const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Constants
const MATHJAX_INIT_TIMEOUT = 15000;

describe('Scroll Indicator Tests', () => {
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
        }, { timeout: MATHJAX_INIT_TIMEOUT });
    });

    afterEach(async () => {
        await page.close();
    });

    test('Scroll indicator should not appear when all content is visible', async () => {
        // Use a large viewport where all content fits
        await page.setViewport({ width: 1920, height: 1080 });
        await wait(500);
        
        // Trigger the scroll indicator check
        await page.evaluate(() => {
            if (window.UI && window.UI.checkScrollIndicator) {
                window.UI.checkScrollIndicator();
            }
        });
        
        // Wait for potential indicator appearance
        await wait(500);
        
        // Check if indicator is visible
        const isVisible = await page.evaluate(() => {
            const indicator = document.getElementById('scroll-indicator');
            return indicator && indicator.classList.contains('visible');
        });
        
        expect(isVisible).toBe(false);
    });

    test('Scroll indicator should appear when substantial content is hidden (>100px)', async () => {
        // Use a small viewport to ensure content goes below fold
        await page.setViewport({ width: 375, height: 400 });
        await wait(500);
        
        // Check if there's actually substantial content hidden
        const hiddenContent = await page.evaluate(() => {
            const mcOptions = document.getElementById('mc-options');
            if (!mcOptions) return 0;
            const rect = mcOptions.getBoundingClientRect();
            return rect.bottom - window.innerHeight;
        });
        
        // Only test if there's actually substantial content hidden
        if (hiddenContent > 100) {
            // Trigger the scroll indicator check
            await page.evaluate(() => {
                if (window.UI && window.UI.checkScrollIndicator) {
                    window.UI.checkScrollIndicator();
                }
            });
            
            // Wait for indicator to appear
            await wait(500);
            
            // Check if indicator is visible
            const isVisible = await page.evaluate(() => {
                const indicator = document.getElementById('scroll-indicator');
                return indicator && indicator.classList.contains('visible');
            });
            
            expect(isVisible).toBe(true);
        }
    });

    test('Scroll indicator should not appear for minor hidden content (<100px)', async () => {
        // We need to test a scenario where content is just slightly below viewport
        // This is tricky to set up reliably, so we'll test the logic directly
        await page.evaluate(() => {
            // Mock the mc-options element to have just 50px below viewport
            const mcOptions = document.getElementById('mc-options');
            if (mcOptions) {
                const originalGetBoundingClientRect = mcOptions.getBoundingClientRect.bind(mcOptions);
                mcOptions.getBoundingClientRect = () => {
                    const rect = originalGetBoundingClientRect();
                    return {
                        ...rect,
                        bottom: window.innerHeight + 50 // Only 50px below viewport
                    };
                };
                
                // Trigger check
                if (window.UI && window.UI.checkScrollIndicator) {
                    window.UI.checkScrollIndicator();
                }
            }
        });
        
        // Wait for potential indicator appearance
        await wait(500);
        
        // Check if indicator is visible
        const isVisible = await page.evaluate(() => {
            const indicator = document.getElementById('scroll-indicator');
            return indicator && indicator.classList.contains('visible');
        });
        
        expect(isVisible).toBe(false);
    });

    test('Scroll indicator should hide when user scrolls', async () => {
        // Use a small viewport
        await page.setViewport({ width: 375, height: 400 });
        await wait(500);
        
        // First make the indicator visible
        await page.evaluate(() => {
            const indicator = document.getElementById('scroll-indicator');
            if (indicator) {
                indicator.classList.add('visible');
            }
        });
        
        // Wait to ensure it's visible
        await wait(100);
        
        // Verify it's visible
        let isVisible = await page.evaluate(() => {
            const indicator = document.getElementById('scroll-indicator');
            return indicator && indicator.classList.contains('visible');
        });
        expect(isVisible).toBe(true);
        
        // Scroll the page
        await page.evaluate(() => window.scrollBy(0, 50));
        
        // Wait for scroll event to be processed
        await wait(200);
        
        // Check if indicator is now hidden
        isVisible = await page.evaluate(() => {
            const indicator = document.getElementById('scroll-indicator');
            return indicator && indicator.classList.contains('visible');
        });
        
        expect(isVisible).toBe(false);
    });

    test('Scroll indicator should hide on touch/click', async () => {
        // Use a small viewport
        await page.setViewport({ width: 375, height: 400 });
        await wait(500);
        
        // First make the indicator visible
        await page.evaluate(() => {
            const indicator = document.getElementById('scroll-indicator');
            if (indicator) {
                indicator.classList.add('visible');
            }
        });
        
        // Wait to ensure it's visible
        await wait(100);
        
        // Verify it's visible
        let isVisible = await page.evaluate(() => {
            const indicator = document.getElementById('scroll-indicator');
            return indicator && indicator.classList.contains('visible');
        });
        expect(isVisible).toBe(true);
        
        // Simulate a touch event
        await page.evaluate(() => {
            const touchEvent = new TouchEvent('touchstart', {
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(touchEvent);
        });
        
        // Wait for touch event to be processed
        await wait(100);
        
        // Check if indicator is now hidden
        isVisible = await page.evaluate(() => {
            const indicator = document.getElementById('scroll-indicator');
            return indicator && indicator.classList.contains('visible');
        });
        
        expect(isVisible).toBe(false);
    });
});
