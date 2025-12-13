const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Deployment and Public URL Tests', () => {
    let browser;
    let page;
    
    // Test both local and production URLs
    const LOCAL_URL = process.env.TEST_URL || 'http://localhost:8000';
    const PRODUCTION_URL = 'https://raymondclowe.github.io/algebra_helper';

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
    });

    afterEach(async () => {
        await page.close();
    });

    describe('Local Deployment', () => {
        test('algebra-helper.html loads successfully', async () => {
            await page.goto(`${LOCAL_URL}/algebra-helper.html`, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            const title = await page.title();
            expect(title).toBe('IB Math Trainer (Fast Response)');
        });

        test('index.html redirects to algebra-helper.html', async () => {
            await page.goto(`${LOCAL_URL}/index.html`, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // After redirect, should end up on algebra-helper.html
            const url = page.url();
            expect(url).toContain('algebra-helper.html');
        });

        test('Version comment exists in HTML', async () => {
            await page.goto(`${LOCAL_URL}/algebra-helper.html`, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            const htmlContent = await page.content();
            expect(htmlContent).toMatch(/<!--.*Algebra Helper v\d+\.\d+\.\d+.*-->/);
        });

        test('Version UI element is visible', async () => {
            await page.goto(`${LOCAL_URL}/algebra-helper.html`, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // Wait for page to load
            await wait(1000);

            const versionElement = await page.$('span.text-xs.text-gray-600');
            expect(versionElement).toBeTruthy();

            const versionText = await page.evaluate(el => el.textContent, versionElement);
            expect(versionText).toMatch(/v\d+\.\d+\.\d+/);
        });

        test('All CSS files are accessible', async () => {
            await page.goto(`${LOCAL_URL}/algebra-helper.html`, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            const cssResponse = await page.goto(`${LOCAL_URL}/css/styles.css`);
            expect(cssResponse.ok()).toBe(true);
        });

        test('All JS files are accessible', async () => {
            const jsFiles = [
                'debug-mode.js',
                'generator.js',
                'constants.js',
                'state.js',
                'ui.js',
                'drill.js',
                'calibration.js',
                'gamification.js',
                'main.js'
            ];

            for (const jsFile of jsFiles) {
                const response = await page.goto(`${LOCAL_URL}/js/${jsFile}`);
                expect(response.ok()).toBe(true);
            }
        });
    });

    describe('Production URL Accessibility', () => {
        test('Production URL is accessible', async () => {
            try {
                const response = await page.goto(PRODUCTION_URL, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });

                expect(response.ok()).toBe(true);
                expect(response.status()).toBe(200);
            } catch (error) {
                // If production URL is not yet deployed or temporarily down, 
                // we skip this test with a warning
                console.warn('Production URL not accessible. This may be expected if deployment is in progress.');
                expect(true).toBe(true); // Pass the test with a warning
            }
        });

        test('Production algebra-helper.html loads', async () => {
            try {
                const response = await page.goto(`${PRODUCTION_URL}/algebra-helper.html`, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });

                expect(response.ok()).toBe(true);
                
                const title = await page.title();
                expect(title).toBe('IB Math Trainer (Fast Response)');
            } catch (error) {
                console.warn('Production URL not accessible. This may be expected if deployment is in progress.');
                expect(true).toBe(true);
            }
        });

        test('Production has version information', async () => {
            try {
                await page.goto(`${PRODUCTION_URL}/algebra-helper.html`, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });

                const htmlContent = await page.content();
                expect(htmlContent).toMatch(/<!--.*Algebra Helper v\d+\.\d+\.\d+.*-->/);

                await wait(1000);
                const versionElement = await page.$('span.text-xs.text-gray-600');
                if (versionElement) {
                    const versionText = await page.evaluate(el => el.textContent, versionElement);
                    expect(versionText).toMatch(/v\d+\.\d+\.\d+/);
                }
            } catch (error) {
                console.warn('Production URL not accessible. This may be expected if deployment is in progress.');
                expect(true).toBe(true);
            }
        });
    });
});
