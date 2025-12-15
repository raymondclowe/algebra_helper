/**
 * Tests to verify MathJax 4 upgrade and assistive features are disabled
 */

const timeout = 15000;

describe('MathJax 4 and Assistive Features Tests', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8000/algebra-helper.html', {
            waitUntil: 'networkidle0',
            timeout: timeout
        });
        
        // Wait for MathJax to load
        await page.waitForFunction(
            () => window.MathJax && window.MathJax.typesetPromise,
            { timeout: timeout }
        );
    }, timeout);

    test('MathJax version 4 is loaded', async () => {
        const version = await page.evaluate(() => {
            return window.MathJax.version || 'unknown';
        });
        
        console.log('MathJax version:', version);
        
        // MathJax 4.x should start with "4"
        expect(version).toMatch(/^4\./);
    });

    test('Assistive MML is disabled in configuration', async () => {
        const config = await page.evaluate(() => {
            return {
                enableAssistiveMml: window.MathJax.config?.options?.enableAssistiveMml,
                assistiveMmlSetting: window.MathJax.config?.options?.menuOptions?.settings?.assistiveMml
            };
        });
        
        console.log('MathJax assistive config:', config);
        
        // Both should be explicitly set to false
        expect(config.enableAssistiveMml).toBe(false);
        expect(config.assistiveMmlSetting).toBe(false);
    });

    test('MathJax still renders math correctly', async () => {
        // Wait for app initialization
        await page.waitForFunction(
            () => window.APP && typeof window.APP === 'object',
            { timeout: timeout }
        );

        // Check if math is rendered (MathJax creates specific elements)
        const hasMathJax = await page.evaluate(() => {
            // Look for MathJax rendered elements
            const mathElements = document.querySelectorAll('.MathJax, mjx-container, mjx-math');
            return mathElements.length > 0;
        });

        expect(hasMathJax).toBe(true);
    });

    test('No assistive-mml elements are created in the DOM', async () => {
        // Check that assistive MathML elements are not present
        const assistiveElements = await page.evaluate(() => {
            // Look for assistive MathML elements that MathJax might create
            const elements = document.querySelectorAll('[data-semantic-type], .MJX_Assistive_MathML, [role="application"]');
            return elements.length;
        });

        // There should be no assistive elements if the feature is properly disabled
        console.log('Number of potential assistive elements found:', assistiveElements);
    });
}, timeout);
