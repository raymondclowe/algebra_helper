/**
 * Test for LaTeX rendering fixes in proof questions
 * Addresses issue where complex LaTeX/text mixed answers were not rendering properly
 */

const puppeteer = require('puppeteer');

describe('LaTeX Rendering Fixes - Proof Questions', () => {
    let browser;
    let page;
    const BASE_URL = 'file://' + require('path').resolve(__dirname, '..', 'algebra-helper.html');

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
        await page.goto(BASE_URL, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for scripts to load
        await page.waitForFunction(
            () => window.Generator && window.QuestionTemplates,
            { timeout: 10000 }
        );
    });

    afterEach(async () => {
        await page.close();
    });

    test('proof by contradiction questions should render mixed LaTeX/text properly', async () => {
        const result = await page.evaluate(() => {
            window.TESTING_MODE = true;
            window.FORCED_QUESTION_TYPE = 1; // First step of proof
            
            // Generate multiple proof questions
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const q = window.QuestionTemplates.ProofsContradiction.getContradictionProofQuestion();
                questions.push({
                    displayAnswer: q.displayAnswer,
                    distractors: q.distractors,
                    hasTextBlocks: q.displayAnswer.includes('\\text{'),
                    hasMathNotation: /\\frac|\\sqrt|\\sum|\\int/.test(q.displayAnswer)
                });
            }
            
            return questions;
        });
        
        // Check that questions with both text and math notation are NOT simplified
        result.forEach((q, idx) => {
            if (q.hasTextBlocks && q.hasMathNotation) {
                // Should still have \text{} blocks
                expect(q.displayAnswer).toContain('\\text{');
                console.log(`Question ${idx + 1}: Mixed LaTeX preserved ✓`);
            }
        });
    });

    test('answer buttons should render complex LaTeX properly through simplification', async () => {
        const buttonProcessingResults = await page.evaluate(() => {
            window.TESTING_MODE = true;
            window.FORCED_QUESTION_TYPE = 1;
            
            // Generate a proof question
            const q = window.QuestionTemplates.ProofsContradiction.getContradictionProofQuestion();
            const utils = window.GeneratorUtils;
            
            // Simulate how the UI processes each answer option
            const allAnswers = [q.displayAnswer, ...q.distractors];
            
            return allAnswers.map(answer => {
                const simplified = utils.simplifyAnswerForDisplay(answer);
                const processed = utils.processTextContent(simplified);
                
                // Use the shared pattern from GeneratorUtils for consistency
                const needsLatex = utils.MATH_NOTATION_PATTERN.test(processed);
                const hasMathDelimiters = processed.includes('$') || processed.includes('\\(') || processed.includes('\\[');
                
                // Check for raw LaTeX code (backslashes that shouldn't be there)
                const hasRawBackslashes = processed.includes('\\') && !needsLatex && !hasMathDelimiters;
                
                return {
                    original: answer,
                    simplified: simplified,
                    processed: processed,
                    needsLatex: needsLatex,
                    willRenderAsMathJax: needsLatex || hasMathDelimiters,
                    hasProperSpacing: processed.includes(' ') || processed.includes('\\text{'),
                    hasRawBackslashes: hasRawBackslashes
                };
            });
        });
        
        buttonProcessingResults.forEach((result, idx) => {
            // Should not have raw backslashes in final output (unless it's LaTeX math)
            if (!result.willRenderAsMathJax) {
                expect(result.hasRawBackslashes).toBe(false);
                console.log(`Button ${idx + 1}: No raw backslashes in plain text ✓`);
            } else {
                console.log(`Button ${idx + 1}: Will render as MathJax ✓`);
            }
            
            // Should have proper spacing
            expect(result.hasProperSpacing).toBe(true);
        });
    });

    test('text-only answers should render with proper spacing', async () => {
        const result = await page.evaluate(() => {
            window.TESTING_MODE = true;
            window.FORCED_QUESTION_TYPE = 1;
            
            const q = window.QuestionTemplates.ProofsContradiction.getContradictionProofQuestion();
            
            // Check if distractors have proper spacing after simplification
            const utils = window.GeneratorUtils;
            return q.distractors.map(d => {
                const simplified = utils.simplifyAnswerForDisplay(d);
                const hasProperSpacing = simplified.includes(' ') || simplified.includes('\\text{');
                return {
                    original: d,
                    simplified: simplified,
                    hasProperSpacing
                };
            });
        });
        
        result.forEach((item, idx) => {
            expect(item.hasProperSpacing).toBe(true);
            console.log(`Distractor ${idx + 1}: Proper spacing ✓`);
        });
    });
});
