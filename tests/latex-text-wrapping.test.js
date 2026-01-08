/**
 * Tests for LaTeX text wrapping utility
 * Ensures long LaTeX text is properly wrapped at natural break points
 */

describe('LaTeX Text Wrapping', () => {
    let page;
    
    beforeAll(async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:8080/algebra-helper.html');
        
        // Wait for app and utilities to be ready
        await page.waitForFunction(
            () => window.GeneratorUtils && typeof window.GeneratorUtils.wrapLongLatexText === 'function',
            { timeout: 10000 }
        );
    });
    
    afterAll(async () => {
        await page.close();
    });
    
    describe('wrapLongLatexText utility function', () => {
        test('wraps text at period followed by capital letter', async () => {
            const result = await page.evaluate(() => {
                const input = '\\text{Line } L_1 \\text{ has equation } y = 9x + 5. \\text{ What is the gradient?}';
                return window.GeneratorUtils.wrapLongLatexText(input);
            });
            
            expect(result).toContain('\\\\[0.5em]');
            expect(result).toContain('. \\\\[0.5em]\\text{ What');
        });
        
        test('wraps text at question mark followed by space', async () => {
            const result = await page.evaluate(() => {
                const input = '\\text{What is x? What is y? What is z? Last question here}';
                return window.GeneratorUtils.wrapLongLatexText(input);
            });
            
            expect(result).toContain('? \\\\[0.5em]What');
        });
        
        test('does not wrap short text', async () => {
            const result = await page.evaluate(() => {
                const input = '\\text{Short question}';
                return window.GeneratorUtils.wrapLongLatexText(input);
            });
            
            expect(result).toBe('\\text{Short question}');
            expect(result).not.toContain('\\\\[0.5em]');
        });
        
        test('does not wrap text that already has line breaks', async () => {
            const result = await page.evaluate(() => {
                const input = '\\text{First line}\\\\[0.5em]\\text{Second line}';
                return window.GeneratorUtils.wrapLongLatexText(input);
            });
            
            expect(result).toBe('\\text{First line}\\\\[0.5em]\\text{Second line}');
        });
        
        test('handles multiple wrapping points', async () => {
            const result = await page.evaluate(() => {
                const input = '\\text{First sentence. Second sentence. Third sentence? Fourth sentence!}';
                return window.GeneratorUtils.wrapLongLatexText(input);
            });
            
            expect(result).toContain('. \\\\[0.5em]Second');
            expect(result).toContain('. \\\\[0.5em]Third');
            expect(result).toContain('? \\\\[0.5em]Fourth');
        });
    });
    
    describe('Level 7 Lines questions', () => {
        test('parallel lines question wraps correctly', async () => {
            // Force level 7, question type 1 (parallel lines)
            await page.goto('http://localhost:8080/algebra-helper.html?testLevel=7&testType=1');
            
            await page.waitForFunction(
                () => window.MathJax && window.MathJax.typesetPromise && window.APP,
                { timeout: 10000 }
            );
            
            // Wait a bit for question generation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Get the question tex
            const questionTex = await page.evaluate(() => {
                return window.APP.currentQ ? window.APP.currentQ.tex : null;
            });
            
            expect(questionTex).toBeTruthy();
            
            // If the question is long enough, it should have a line break
            if (questionTex && questionTex.length > 50) {
                expect(questionTex).toContain('\\\\[0.5em]');
            }
        });
        
        test('perpendicular lines question wraps correctly', async () => {
            // Force level 7, question type 2 (perpendicular lines)
            await page.goto('http://localhost:8080/algebra-helper.html?testLevel=7&testType=2');
            
            await page.waitForFunction(
                () => window.MathJax && window.MathJax.typesetPromise && window.APP,
                { timeout: 10000 }
            );
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const questionTex = await page.evaluate(() => {
                return window.APP.currentQ ? window.APP.currentQ.tex : null;
            });
            
            expect(questionTex).toBeTruthy();
            
            if (questionTex && questionTex.length > 50) {
                expect(questionTex).toContain('\\\\[0.5em]');
            }
        });
    });
    
    describe('Financial applications questions', () => {
        test('compound interest question wraps correctly', async () => {
            // Force level 14, question type 2
            await page.goto('http://localhost:8080/algebra-helper.html?testLevel=14&testType=2');
            
            await page.waitForFunction(
                () => window.MathJax && window.MathJax.typesetPromise && window.APP,
                { timeout: 10000 }
            );
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const questionTex = await page.evaluate(() => {
                return window.APP.currentQ ? window.APP.currentQ.tex : null;
            });
            
            expect(questionTex).toBeTruthy();
            
            // These questions are always long enough to wrap
            if (questionTex && questionTex.includes('compound interest')) {
                expect(questionTex).toContain('\\\\[0.5em]');
            }
        });
    });
});
