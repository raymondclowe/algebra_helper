/**
 * Comprehensive tests for the new text processing system
 * Tests categorization and processing of pure text, simple LaTeX, and complex LaTeX
 */

const puppeteer = require('puppeteer');

const timeout = 15000;
const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';

describe('Text Processing System - Comprehensive Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }, timeout);

    afterAll(async () => {
        await browser.close();
    }, timeout);

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: timeout
        });
        
        // Wait for MathJax and app to initialize
        await page.waitForFunction(
            () => window.MathJax && window.MathJax.typesetPromise && window.GeneratorUtils,
            { timeout: timeout }
        );
    });

    afterEach(async () => {
        await page.close();
    });

    // ===== CATEGORY 1: PURE TEXT TESTS =====
    describe('Category 1: Pure Text (no LaTeX)', () => {
        test('categorizeTextType identifies pure text with no special characters', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('This is plain text');
            });
            expect(result).toBe('PURE_TEXT');
        });

        test('categorizeTextType identifies pure text with Unicode symbols', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Multiply 5 × 3 to get 15');
            });
            expect(result).toBe('PURE_TEXT');
        });

        test('categorizeTextType identifies pure text with numbers and punctuation', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('The answer is 42! Really?');
            });
            expect(result).toBe('PURE_TEXT');
        });

        test('processPureText returns text unchanged', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processPureText('Simple text here');
            });
            expect(result).toBe('Simple text here');
        });

        test('processTextContent handles pure text correctly', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processTextContent('Just plain text');
            });
            expect(result).toBe('Just plain text');
        });
    });

    // ===== CATEGORY 2: SIMPLE LATEX TESTS =====
    describe('Category 2: Simple LaTeX (symbols only)', () => {
        test('categorizeTextType identifies simple LaTeX with \\times', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Calculate 5 \\times 3');
            });
            expect(result).toBe('SIMPLE_LATEX');
        });

        test('categorizeTextType identifies simple LaTeX with \\div', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Calculate 10 \\div 2');
            });
            expect(result).toBe('SIMPLE_LATEX');
        });

        test('categorizeTextType identifies simple LaTeX with multiple symbols', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Use \\pm and \\times with \\leq');
            });
            expect(result).toBe('SIMPLE_LATEX');
        });

        test('categorizeTextType identifies simple LaTeX with Greek letters', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('The angle \\theta is important');
            });
            expect(result).toBe('SIMPLE_LATEX');
        });

        test('processSimpleLatex converts \\times to ×', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processSimpleLatex('Calculate 5 \\times 3');
            });
            expect(result).toBe('Calculate 5 × 3');
        });

        test('processSimpleLatex converts \\div to ÷', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processSimpleLatex('Calculate 10 \\div 2');
            });
            expect(result).toBe('Calculate 10 ÷ 2');
        });

        test('processSimpleLatex converts multiple symbols', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processSimpleLatex('Use \\pm and \\times with \\leq');
            });
            expect(result).toBe('Use ± and × with ≤');
        });

        test('processSimpleLatex converts Greek letters', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processSimpleLatex('Angle \\theta equals \\pi radians');
            });
            expect(result).toBe('Angle θ equals π radians');
        });

        test('processSimpleLatex converts \\% to %', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processSimpleLatex('The answer is 10\\% of total');
            });
            expect(result).toBe('The answer is 10% of total');
        });

        test('processTextContent handles simple LaTeX correctly', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processTextContent('Multiply 3 \\times 4');
            });
            expect(result).toBe('Multiply 3 × 4');
        });
    });

    // ===== CATEGORY 3: COMPLEX LATEX TESTS =====
    describe('Category 3: Complex LaTeX (needs MathJax)', () => {
        test('categorizeTextType identifies complex LaTeX with \\frac', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('The result is \\frac{1}{2}');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('categorizeTextType identifies complex LaTeX with \\sqrt', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Calculate \\sqrt{25}');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('categorizeTextType identifies complex LaTeX with \\sum', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Find \\sum_{i=1}^{n} i');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('categorizeTextType identifies complex LaTeX with \\int', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Evaluate \\int x dx');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('categorizeTextType identifies complex LaTeX with trig functions', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Calculate \\sin(x) + \\cos(x)');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('categorizeTextType identifies complex LaTeX with subscripts', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('The value x_{1} is important');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('categorizeTextType identifies complex LaTeX with superscripts', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Calculate x^{2} + y^{2}');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('categorizeTextType identifies text with $ delimiters as complex', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('The modulus is $\\sqrt{a^2 + b^2}$');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('categorizeTextType identifies text with \\( delimiters as complex', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('The value \\(x^2\\) is positive');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('processComplexLatex wraps text in $ delimiters', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processComplexLatex('\\frac{1}{2} + \\frac{1}{3}');
            });
            expect(result).toBe('$\\frac{1}{2} + \\frac{1}{3}$');
        });

        test('processComplexLatex preserves existing $ delimiters', async () => {
            const input = '$\\frac{1}{2}$';
            const result = await page.evaluate((text) => {
                return window.GeneratorUtils.processComplexLatex(text);
            }, input);
            expect(result).toBe(input);
        });

        test('processTextContent handles complex LaTeX correctly', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processTextContent('The result is \\sqrt{25}');
            });
            expect(result).toBe('$The result is \\sqrt{25}$');
        });
    });

    // ===== INTEGRATION TESTS =====
    describe('Integration: processTextContent with mixed content', () => {
        test('handles text that starts pure then becomes simple LaTeX', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processTextContent('Multiply 5 \\times 3 to get 15');
            });
            expect(result).toBe('Multiply 5 × 3 to get 15');
        });

        test('handles text with unknown LaTeX commands as complex', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processTextContent('Use \\unknowncommand here');
            });
            // Unknown commands should be treated as complex (wrapped in $)
            expect(result).toBe('$Use \\unknowncommand here$');
        });

        test('handles empty string', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processTextContent('');
            });
            expect(result).toBe('');
        });

        test('handles null input', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processTextContent(null);
            });
            expect(result).toBeNull();
        });

        test('handles undefined input', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processTextContent(undefined);
            });
            expect(result).toBeUndefined();
        });
    });

    // ===== BACKWARD COMPATIBILITY =====
    describe('Backward Compatibility: processExplanationText', () => {
        test('processExplanationText still works (deprecated)', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processExplanationText('Calculate 5 \\times 3');
            });
            expect(result).toBe('Calculate 5 × 3');
        });

        test('processExplanationText handles complex LaTeX', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.processExplanationText('The result is \\sqrt{25}');
            });
            expect(result).toBe('$The result is \\sqrt{25}$');
        });
    });

    // ===== EDGE CASES =====
    describe('Edge Cases', () => {
        test('handles text with literal curly braces but no LaTeX', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Use braces { and } here');
            });
            expect(result).toBe('PURE_TEXT');
        });

        test('handles text with backslash in non-LaTeX context', async () => {
            // If it has backslash followed by letters, should be treated as LaTeX
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('File path C:\\users\\test');
            });
            // This will be categorized as COMPLEX_LATEX due to backslashes
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('handles mixed simple and complex LaTeX (should be complex)', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Calculate \\times with \\frac{1}{2}');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('handles all substitutions from table', async () => {
            const result = await page.evaluate(() => {
                const text = '\\times \\div \\cdot \\pm \\leq \\geq \\neq \\approx \\alpha \\beta \\gamma \\delta \\theta \\pi \\lambda \\mu \\sigma \\infty \\% \\degree \\circ';
                return window.GeneratorUtils.processSimpleLatex(text);
            });
            expect(result).toBe('× ÷ · ± ≤ ≥ ≠ ≈ α β γ δ θ π λ μ σ ∞ % ° ∘');
        });

        test('handles text with standalone underscore in variable names', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Calculate x_1 + x_2');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('handles text with standalone caret in expressions', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Calculate x^2 + y^2');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('handles logarithm commands', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Calculate \\log(x) or \\ln(x)');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('handles vector notation', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('The vector \\vec{v} is important');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });

        test('handles partial derivatives', async () => {
            const result = await page.evaluate(() => {
                return window.GeneratorUtils.categorizeTextType('Find \\partial f / \\partial x');
            });
            expect(result).toBe('COMPLEX_LATEX');
        });
    });
});
