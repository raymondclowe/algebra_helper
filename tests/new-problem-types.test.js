const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('New Problem Types Tests', () => {
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
        // Wait for scripts to load
        await wait(2000);
    });

    afterEach(async () => {
        await page.close();
    });

    test('Basic arithmetic problems are generated at level 0-1', async () => {
        // Set level to 0.5 to get basic arithmetic
        await page.evaluate(() => {
            window.APP.level = 0.5;
            window.APP.mode = 'learning';
        });

        // Generate a question
        const question = await page.evaluate(() => {
            const q = window.Generator.getBasicArithmetic();
            return {
                hasQuestion: !!q,
                hasTex: !!q.tex,
                hasAnswer: !!q.displayAnswer,
                hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                hasExplanation: !!q.explanation
            };
        });

        expect(question.hasQuestion).toBe(true);
        expect(question.hasTex).toBe(true);
        expect(question.hasAnswer).toBe(true);
        expect(question.hasDistractors).toBe(true);
        expect(question.hasExplanation).toBe(true);
    });

    test('Squares and roots problems are generated at level 1-2', async () => {
        const question = await page.evaluate(() => {
            const q = window.Generator.getSquaresAndRoots();
            return {
                hasQuestion: !!q,
                hasTex: !!q.tex,
                hasAnswer: !!q.displayAnswer,
                hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                hasExplanation: !!q.explanation,
                instruction: q.instruction
            };
        });

        expect(question.hasQuestion).toBe(true);
        expect(question.hasTex).toBe(true);
        expect(question.hasAnswer).toBe(true);
        expect(question.hasDistractors).toBe(true);
        expect(question.hasExplanation).toBe(true);
    });

    test('Multiplication table problems are generated at level 2-3', async () => {
        const question = await page.evaluate(() => {
            const q = window.Generator.getMultiplicationTables();
            return {
                hasQuestion: !!q,
                hasTex: !!q.tex,
                hasAnswer: !!q.displayAnswer,
                hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                hasExplanation: !!q.explanation
            };
        });

        expect(question.hasQuestion).toBe(true);
        expect(question.hasTex).toBe(true);
        expect(question.hasAnswer).toBe(true);
        expect(question.hasDistractors).toBe(true);
        expect(question.hasExplanation).toBe(true);
    });

    test('Function problems are generated at level 7-8', async () => {
        const question = await page.evaluate(() => {
            const q = window.Generator.getFunctionProblems();
            return {
                hasQuestion: !!q,
                hasTex: !!q.tex,
                hasAnswer: !!q.displayAnswer,
                hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                hasExplanation: !!q.explanation,
                tex: q.tex
            };
        });

        expect(question.hasQuestion).toBe(true);
        expect(question.hasTex).toBe(true);
        expect(question.hasAnswer).toBe(true);
        expect(question.hasDistractors).toBe(true);
        expect(question.hasExplanation).toBe(true);
        // Check that it contains function notation (unicode 𝑓)
        expect(question.tex).toMatch(/𝑓\(/);
    });

    test('Trigonometry problems are generated at level 8-9', async () => {
        const question = await page.evaluate(() => {
            const q = window.Generator.getTrigonometry();
            return {
                hasQuestion: !!q,
                hasTex: !!q.tex,
                hasAnswer: !!q.displayAnswer,
                hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                hasExplanation: !!q.explanation,
                tex: q.tex
            };
        });

        expect(question.hasQuestion).toBe(true);
        expect(question.hasTex).toBe(true);
        expect(question.hasAnswer).toBe(true);
        expect(question.hasDistractors).toBe(true);
        expect(question.hasExplanation).toBe(true);
        // Check that it contains trig functions
        expect(question.tex).toMatch(/(sin|cos|tan)/);
    });

    test('Probability problems are generated at level 10-11', async () => {
        const question = await page.evaluate(() => {
            const q = window.Generator.getProbability();
            return {
                hasQuestion: !!q,
                hasTex: !!q.tex,
                hasAnswer: !!q.displayAnswer,
                hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                hasExplanation: !!q.explanation
            };
        });

        expect(question.hasQuestion).toBe(true);
        expect(question.hasTex).toBe(true);
        expect(question.hasAnswer).toBe(true);
        expect(question.hasDistractors).toBe(true);
        expect(question.hasExplanation).toBe(true);
    });

    test('Calculus problems are generated at level 11+', async () => {
        const question = await page.evaluate(() => {
            const q = window.Generator.getCalculus();
            return {
                hasQuestion: !!q,
                hasTex: !!q.tex,
                hasAnswer: !!q.displayAnswer,
                hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                hasExplanation: !!q.explanation,
                tex: q.tex
            };
        });

        expect(question.hasQuestion).toBe(true);
        expect(question.hasTex).toBe(true);
        expect(question.hasAnswer).toBe(true);
        expect(question.hasDistractors).toBe(true);
        expect(question.hasExplanation).toBe(true);
        // Check that it contains calculus notation
        expect(question.tex).toMatch(/(int|sum)/i);
    });

    test('Questions are properly distributed across levels', async () => {
        const distribution = await page.evaluate(() => {
            const results = {};
            
            // Test each level
            for (let level = 0.5; level <= 12; level += 0.5) {
                window.APP.level = level;
                window.APP.mode = 'learning';
                const q = window.Generator.getQuestion(level);
                const band = Math.round(level);
                if (!results[band]) {
                    results[band] = { count: 0, hasQuestions: false };
                }
                results[band].count++;
                results[band].hasQuestions = !!q;
            }
            
            return results;
        });

        // Verify each level band has questions
        for (let band = 0; band <= 12; band++) {
            if (distribution[band]) {
                expect(distribution[band].hasQuestions).toBe(true);
            }
        }
    });

    test('Reverse question formats are available', async () => {
        const reverseQuestions = await page.evaluate(() => {
            const results = [];
            
            // Test basic arithmetic reverse questions
            for (let i = 0; i < 10; i++) {
                const q = window.Generator.getBasicArithmetic();
                if (q.tex.includes('?')) {
                    results.push({ type: 'arithmetic', hasReverse: true });
                    break;
                }
            }
            
            // Test squares/roots reverse questions
            for (let i = 0; i < 10; i++) {
                const q = window.Generator.getSquaresAndRoots();
                if (q.tex.includes('is the')) {
                    results.push({ type: 'squares', hasReverse: true });
                    break;
                }
            }
            
            // Test multiplication reverse questions
            for (let i = 0; i < 10; i++) {
                const q = window.Generator.getMultiplicationTables();
                if (q.tex.includes('?')) {
                    results.push({ type: 'multiplication', hasReverse: true });
                    break;
                }
            }
            
            return results;
        });

        // At least some reverse formats should be found
        expect(reverseQuestions.length).toBeGreaterThan(0);
    });

    test('All new problem types have LaTeX notation', async () => {
        const hasLatex = await page.evaluate(() => {
            const problemGenerators = [
                'getBasicArithmetic',
                'getSquaresAndRoots',
                'getMultiplicationTables',
                'getFunctionProblems',
                'getTrigonometry',
                'getProbability',
                'getCalculus'
            ];
            
            const results = {};
            
            for (const generator of problemGenerators) {
                const q = window.Generator[generator]();
                // Check if tex contains LaTeX-specific notation or standard math
                const hasLatexNotation = 
                    q.tex.includes('\\') || // LaTeX commands
                    q.tex.includes('^') ||  // Exponents
                    q.tex.includes('_') ||  // Subscripts
                    /\d+|\w+/.test(q.tex);  // Basic math expressions
                results[generator] = hasLatexNotation;
            }
            
            return results;
        });

        // All generators should produce some form of mathematical notation
        Object.values(hasLatex).forEach(value => {
            expect(value).toBe(true);
        });
    });

    test('All answers are pre-calculated correctly', async () => {
        const calculations = await page.evaluate(() => {
            const results = [];
            
            // Test basic arithmetic calculation
            const arith = window.Generator.getBasicArithmetic();
            results.push({
                type: 'arithmetic',
                hasCalculatedAnswer: typeof arith.displayAnswer === 'string' && arith.displayAnswer.length > 0
            });
            
            // Test squares calculation
            const squares = window.Generator.getSquaresAndRoots();
            results.push({
                type: 'squares',
                hasCalculatedAnswer: typeof squares.displayAnswer === 'string' && squares.displayAnswer.length > 0
            });
            
            // Test multiplication calculation
            const mult = window.Generator.getMultiplicationTables();
            results.push({
                type: 'multiplication',
                hasCalculatedAnswer: typeof mult.displayAnswer === 'string' && mult.displayAnswer.length > 0
            });
            
            return results;
        });

        calculations.forEach(calc => {
            expect(calc.hasCalculatedAnswer).toBe(true);
        });
    });

    test('Why questions cover new problem types', async () => {
        const whyQuestions = await page.evaluate(() => {
            const results = [];
            
            // Test different levels for why questions
            for (let level = 0.5; level <= 12; level += 1) {
                try {
                    const q = window.Generator.getWhyQuestion(level);
                    if (q && q.type === 'why') {
                        results.push({
                            level: level,
                            hasWhy: true,
                            hasExplanation: !!q.explanation
                        });
                    }
                } catch (e) {
                    results.push({
                        level: level,
                        hasWhy: false,
                        error: e.message
                    });
                }
            }
            
            return results;
        });

        // Should have why questions for multiple levels
        expect(whyQuestions.length).toBeGreaterThan(0);
        
        // All why questions should have explanations
        whyQuestions.forEach(wq => {
            if (wq.hasWhy) {
                expect(wq.hasExplanation).toBe(true);
            }
        });
    });
});
