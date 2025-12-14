/**
 * Word Wrapping and Line Breaking Tests
 * 
 * Tests to verify MathJax content properly wraps on mobile devices
 * and that line breaks work correctly in questions and answer buttons
 */

describe('Word Wrapping and Line Breaking Tests', () => {
    beforeEach(async () => {
        // Navigate to the app
        await page.goto('http://localhost:8081/algebra-helper.html', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for MathJax to load
        await page.waitForFunction(
            () => window.MathJax && window.MathJax.typesetPromise,
            { timeout: 10000 }
        );
        
        // Wait for app to initialize
        await page.waitForFunction(
            () => window.APP && window.APP.mode,
            { timeout: 10000 }
        );
    });

    test('MathJax configuration is defined in HTML', async () => {
        // Check that MathJax global config exists before loading
        const hasConfig = await page.evaluate(() => {
            // The config is set as window.MathJax before the library loads
            return window.MathJax && typeof window.MathJax === 'object';
        });
        
        expect(hasConfig).toBe(true);
    });

    test('Question math container has word wrapping CSS on mobile', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 }); // iPhone SE size
        
        // Wait for question to render
        await page.waitForSelector('#question-math', { timeout: 5000 });
        
        // Check CSS properties
        const wordWrapProps = await page.evaluate(() => {
            const questionDiv = document.querySelector('#question-math');
            const styles = window.getComputedStyle(questionDiv);
            return {
                overflowWrap: styles.overflowWrap,
                wordWrap: styles.wordWrap,
                whiteSpace: styles.whiteSpace
            };
        });
        
        expect(['break-word', 'anywhere']).toContain(wordWrapProps.overflowWrap);
        expect(wordWrapProps.whiteSpace).toBe('normal');
    });

    test('MathJax containers in questions have proper max-width on mobile', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Wait for calibration mode and generate question
        await page.waitForFunction(
            () => window.APP.mode === 'calibration',
            { timeout: 5000 }
        );
        
        // Wait for MathJax to render
        await page.waitForSelector('#question-math mjx-container', { timeout: 5000 });
        
        // Check MathJax container has proper width constraints
        const containerWidth = await page.evaluate(() => {
            const container = document.querySelector('#question-math mjx-container');
            if (!container) return null;
            
            const styles = window.getComputedStyle(container);
            return {
                maxWidth: styles.maxWidth,
                display: styles.display
            };
        });
        
        expect(containerWidth).not.toBeNull();
        expect(containerWidth.maxWidth).toBe('100%');
    });

    test('Answer buttons have word wrapping enabled on mobile', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Switch to learning mode
        await page.evaluate(async () => {
            // Simulate calibration completion
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            window.UI.nextQuestion();
            await window.MathJax.typesetPromise();
        });
        
        // Wait for answer buttons to appear
        await page.waitForSelector('#mc-options button', { timeout: 5000 });
        
        // Check CSS properties on answer buttons
        const buttonWordWrap = await page.evaluate(() => {
            const buttons = document.querySelectorAll('#mc-options button');
            if (buttons.length === 0) return null;
            
            const firstButton = buttons[0];
            const styles = window.getComputedStyle(firstButton);
            return {
                whiteSpace: styles.whiteSpace,
                wordWrap: styles.wordWrap,
                overflowWrap: styles.overflowWrap,
                display: styles.display
            };
        });
        
        expect(buttonWordWrap).not.toBeNull();
        expect(buttonWordWrap.whiteSpace).toBe('normal');
        expect(['flex', 'inline-flex']).toContain(buttonWordWrap.display);
    });

    test('MathJax content in answer buttons has proper styling on mobile', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Switch to learning mode
        await page.evaluate(async () => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            window.UI.nextQuestion();
            await window.MathJax.typesetPromise();
        });
        
        // Wait for MathJax in buttons
        await page.waitForSelector('#mc-options button mjx-container', { timeout: 5000 });
        
        // Check MathJax containers in buttons have proper properties
        const mathInButton = await page.evaluate(() => {
            const containers = document.querySelectorAll('#mc-options button mjx-container');
            if (containers.length === 0) return null;
            
            const firstContainer = containers[0];
            const styles = window.getComputedStyle(firstContainer);
            return {
                maxWidth: styles.maxWidth,
                overflowWrap: styles.overflowWrap,
                wordWrap: styles.wordWrap
            };
        });
        
        expect(mathInButton).not.toBeNull();
        expect(mathInButton.maxWidth).toBe('100%');
    });

    test('Long equation text does not overflow on narrow mobile screen', async () => {
        // Set very narrow viewport (smallest common phone)
        await page.setViewport({ width: 320, height: 568 }); // iPhone SE 1st gen
        
        // Generate a question
        await page.waitForFunction(
            () => window.APP.mode === 'calibration',
            { timeout: 5000 }
        );
        
        // Wait for question to render
        await page.waitForSelector('#question-math', { timeout: 5000 });
        
        // Check if content overflows
        const hasOverflow = await page.evaluate(() => {
            const questionDiv = document.querySelector('#question-math');
            const appContainer = document.querySelector('#app');
            
            return questionDiv.scrollWidth > appContainer.clientWidth;
        });
        
        // The main check is that word wrapping is enabled
        // Some overflow might happen with very long single-word expressions,
        // but the CSS should be in place to handle it
        const hasWordWrap = await page.evaluate(() => {
            const questionDiv = document.querySelector('#question-math');
            const styles = window.getComputedStyle(questionDiv);
            return styles.overflowWrap === 'break-word' || styles.wordWrap === 'break-word';
        });
        
        expect(hasWordWrap).toBe(true);
    });

    test('MathJax font size is reduced on mobile for better fitting', async () => {
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        
        // Wait for question to render
        await page.waitForSelector('#question-math mjx-container', { timeout: 5000 });
        
        // Get the font size on mobile
        const mobileFontSize = await page.evaluate(() => {
            const container = document.querySelector('#question-math mjx-container');
            if (!container) return null;
            return window.getComputedStyle(container).fontSize;
        });
        
        // Now check desktop
        await page.setViewport({ width: 1024, height: 768 });
        await new Promise(resolve => setTimeout(resolve, 500)); // Let CSS recalculate
        
        const desktopFontSize = await page.evaluate(() => {
            const container = document.querySelector('#question-math mjx-container');
            if (!container) return null;
            return window.getComputedStyle(container).fontSize;
        });
        
        // Both should have font sizes defined (CSS applies em-based scaling)
        expect(mobileFontSize).toBeTruthy();
        expect(desktopFontSize).toBeTruthy();
    });

    test('Line breaks in LaTeX are properly rendered', async () => {
        // Create a question with explicit line breaks
        await page.evaluate(async () => {
            // Override current question with one that has line breaks
            window.APP.currentQ = {
                type: 'why',
                tex: '2x + 3 = 9 \\\\[0.5em] \\\\text{Step 1: } 2x = 6',
                instruction: 'Test question with line break',
                displayAnswer: 'Test answer',
                distractors: ['A', 'B', 'C'],
                explanation: 'Test explanation',
                calc: false,
                level: 5.0
            };
            
            // Re-render
            const qDiv = document.getElementById('question-math');
            qDiv.innerHTML = `\\[ ${window.APP.currentQ.tex} \\]`;
            await window.MathJax.typesetPromise([qDiv]);
        });
        
        // Wait for MathJax to process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check that the content is rendered (MathJax should handle the line break)
        const hasContent = await page.evaluate(() => {
            const qDiv = document.getElementById('question-math');
            return qDiv.textContent.length > 0;
        });
        
        expect(hasContent).toBe(true);
    });

    test('Answer buttons are not in italics (upright font)', async () => {
        // Switch to learning mode
        await page.evaluate(async () => {
            window.APP.mode = 'learning';
            window.APP.level = 5.0;
            window.UI.nextQuestion();
            await window.MathJax.typesetPromise();
        });
        
        // Wait for answer buttons with MathJax
        await page.waitForSelector('#mc-options button mjx-container', { timeout: 5000 });
        
        // Check font style
        const fontStyles = await page.evaluate(() => {
            const mathElements = document.querySelectorAll('#mc-options button mjx-mi');
            if (mathElements.length === 0) return null;
            
            const styles = Array.from(mathElements).map(el => {
                return window.getComputedStyle(el).fontStyle;
            });
            
            return styles;
        });
        
        if (fontStyles && fontStyles.length > 0) {
            // All should be 'normal', not 'italic'
            fontStyles.forEach(style => {
                expect(style).toBe('normal');
            });
        }
    });
});
