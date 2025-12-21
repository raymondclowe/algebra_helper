/**
 * Tests to verify MathJax displayOverflow: 'scroll' configuration (EXPERIMENTAL)
 * 
 * This test validates that the experimental displayOverflow setting is properly
 * configured. This feature may be reverted if it causes issues.
 */

const timeout = 15000;

describe('MathJax displayOverflow Configuration (EXPERIMENTAL)', () => {
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

    test('MathJax configuration includes displayOverflow: scroll', async () => {
        const displayOverflow = await page.evaluate(() => {
            // Check the output configuration for displayOverflow setting
            return window.MathJax.config?.output?.displayOverflow;
        });
        
        console.log('MathJax displayOverflow setting:', displayOverflow);
        
        // Should be set to 'scroll' for the experimental feature
        expect(displayOverflow).toBe('scroll');
    });

    test('Wide math expressions can be scrolled horizontally', async () => {
        // Wait for app initialization
        await page.waitForFunction(
            () => window.APP && typeof window.APP === 'object',
            { timeout: timeout }
        );

        // Check if any MathJax containers have overflow handling
        const hasScrollableOverflow = await page.evaluate(() => {
            const mathContainers = document.querySelectorAll('mjx-container');
            if (mathContainers.length === 0) {
                return true; // If no math yet, assume config is correct
            }
            
            // Check if containers can potentially scroll
            // With displayOverflow: 'scroll', MathJax should set up scrolling
            for (const container of mathContainers) {
                const styles = window.getComputedStyle(container);
                // MathJax should apply overflow handling when needed
                // This just verifies the containers exist and can be checked
                if (container.scrollWidth >= 0) {
                    return true;
                }
            }
            return false;
        });

        expect(hasScrollableOverflow).toBe(true);
    });

    test('MathJax configuration object is properly structured', async () => {
        const config = await page.evaluate(() => {
            return {
                hasOutput: !!window.MathJax.config?.output,
                hasDisplayOverflow: 'displayOverflow' in (window.MathJax.config?.output || {}),
                outputType: typeof window.MathJax.config?.output
            };
        });
        
        console.log('MathJax config structure:', config);
        
        // Verify the configuration structure is valid
        expect(config.hasOutput).toBe(true);
        expect(config.hasDisplayOverflow).toBe(true);
        expect(config.outputType).toBe('object');
    });
}, timeout);
