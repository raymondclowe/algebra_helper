const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const baseUrl = process.env.TEST_URL || 'http://localhost:8000';

describe('Fraction Equivalence in Probability Questions', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(`${baseUrl}/algebra-helper.html`, { 
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for the app to initialize
        await page.waitForFunction(() => {
            return window.Generator && window.APP;
        }, { timeout: 10000 });
    });

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });

    test('parseFraction should correctly parse LaTeX fractions', async () => {
        const results = await page.evaluate(() => {
            const testCases = [
                { input: '\\frac{6}{12}', expected: { numerator: 6, denominator: 12 } },
                { input: '\\frac{1}{2}', expected: { numerator: 1, denominator: 2 } },
                { input: '\\frac{3}{9}', expected: { numerator: 3, denominator: 9 } },
                { input: '0.5', expected: { numerator: 1, denominator: 2 } },
                { input: '0.25', expected: { numerator: 1, denominator: 4 } }
            ];
            
            const results = [];
            for (let test of testCases) {
                const result = window.Generator.parseFraction(test.input);
                if (test.input.match(/^-?\d+\.?\d*$/)) {
                    // For decimals, check if they reduce to expected values
                    const normalized = window.Generator.normalizeFraction(result.numerator, result.denominator);
                    results.push({
                        input: test.input,
                        passed: normalized.numerator === test.expected.numerator && 
                               normalized.denominator === test.expected.denominator
                    });
                } else {
                    results.push({
                        input: test.input,
                        passed: result.numerator === test.expected.numerator && 
                               result.denominator === test.expected.denominator
                    });
                }
            }
            return results;
        });

        for (let result of results) {
            expect(result.passed).toBe(true);
        }
    });

    test('normalizeFraction should reduce fractions to lowest terms', async () => {
        const results = await page.evaluate(() => {
            const testCases = [
                { num: 6, den: 12, expected: { numerator: 1, denominator: 2 } },
                { num: 4, den: 8, expected: { numerator: 1, denominator: 2 } },
                { num: 9, den: 12, expected: { numerator: 3, denominator: 4 } },
                { num: 15, den: 20, expected: { numerator: 3, denominator: 4 } },
                { num: 7, den: 14, expected: { numerator: 1, denominator: 2 } }
            ];
            
            const results = [];
            for (let test of testCases) {
                const result = window.Generator.normalizeFraction(test.num, test.den);
                results.push({
                    input: `${test.num}/${test.den}`,
                    passed: result.numerator === test.expected.numerator && 
                           result.denominator === test.expected.denominator,
                    result: result
                });
            }
            return results;
        });

        for (let result of results) {
            expect(result.passed).toBe(true);
        }
    });

    test('areAnswersEquivalent should detect mathematically equivalent fractions', async () => {
        const results = await page.evaluate(() => {
            const testCases = [
                { a: '\\frac{6}{12}', b: '\\frac{1}{2}', shouldBeEqual: true },
                { a: '\\frac{4}{8}', b: '\\frac{1}{2}', shouldBeEqual: true },
                { a: '\\frac{9}{12}', b: '\\frac{3}{4}', shouldBeEqual: true },
                { a: '\\frac{3}{4}', b: '\\frac{1}{2}', shouldBeEqual: false },
                { a: '\\frac{6}{12}', b: '\\frac{2}{3}', shouldBeEqual: false },
                { a: '0.5', b: '\\frac{1}{2}', shouldBeEqual: true },
                { a: '0.25', b: '\\frac{1}{4}', shouldBeEqual: true }
            ];
            
            const results = [];
            for (let test of testCases) {
                const result = window.Generator.areAnswersEquivalent(test.a, test.b);
                results.push({
                    a: test.a,
                    b: test.b,
                    expected: test.shouldBeEqual,
                    actual: result,
                    passed: result === test.shouldBeEqual
                });
            }
            return results;
        });

        for (let result of results) {
            expect(result.passed).toBe(true);
        }
    });

    test('getProbability should never generate mathematically equivalent answers', async () => {
        const results = await page.evaluate(() => {
            const issues = [];
            
            // Test 2000 probability questions to ensure comprehensive coverage
            // This high iteration count is intentional to catch rare edge cases
            // where random number generation might create equivalent fractions
            for (let i = 0; i < 2000; i++) {
                const q = window.Generator.getProbability();
                const allAnswers = [q.displayAnswer, ...q.distractors];
                
                // Check for exact duplicates first
                const uniqueAnswers = new Set(allAnswers);
                if (uniqueAnswers.size !== allAnswers.length) {
                    issues.push({
                        iteration: i,
                        type: 'exact_duplicate',
                        correctAnswer: q.displayAnswer,
                        distractors: q.distractors,
                        allAnswers: allAnswers
                    });
                }
                
                // Check for mathematical equivalence
                for (let j = 0; j < allAnswers.length; j++) {
                    for (let k = j + 1; k < allAnswers.length; k++) {
                        if (window.Generator.areAnswersEquivalent(allAnswers[j], allAnswers[k])) {
                            issues.push({
                                iteration: i,
                                type: 'mathematical_equivalence',
                                answer1: allAnswers[j],
                                answer2: allAnswers[k],
                                correctAnswer: q.displayAnswer,
                                distractors: q.distractors
                            });
                        }
                    }
                }
            }
            
            return issues;
        });

        if (results.length > 0) {
            console.log('Found equivalent answers in probability questions:', JSON.stringify(results.slice(0, 5), null, 2));
        }
        expect(results.length).toBe(0);
    });

    test('getAdvancedProbability should never generate mathematically equivalent answers', async () => {
        const results = await page.evaluate(() => {
            const issues = [];
            
            // Test 2000 advanced probability questions to ensure comprehensive coverage
            // This high iteration count is intentional to catch rare edge cases
            // where random number generation might create equivalent fractions or decimals
            for (let i = 0; i < 2000; i++) {
                const q = window.Generator.getAdvancedProbability();
                const allAnswers = [q.displayAnswer, ...q.distractors];
                
                // Check for exact duplicates first
                const uniqueAnswers = new Set(allAnswers);
                if (uniqueAnswers.size !== allAnswers.length) {
                    issues.push({
                        iteration: i,
                        type: 'exact_duplicate',
                        correctAnswer: q.displayAnswer,
                        distractors: q.distractors,
                        allAnswers: allAnswers
                    });
                }
                
                // Check for mathematical equivalence
                for (let j = 0; j < allAnswers.length; j++) {
                    for (let k = j + 1; k < allAnswers.length; k++) {
                        if (window.Generator.areAnswersEquivalent(allAnswers[j], allAnswers[k])) {
                            issues.push({
                                iteration: i,
                                type: 'mathematical_equivalence',
                                answer1: allAnswers[j],
                                answer2: allAnswers[k],
                                correctAnswer: q.displayAnswer,
                                distractors: q.distractors
                            });
                        }
                    }
                }
            }
            
            return issues;
        });

        if (results.length > 0) {
            console.log('Found equivalent answers in advanced probability questions:', JSON.stringify(results.slice(0, 5), null, 2));
        }
        expect(results.length).toBe(0);
    });

    test('ensureUniqueDistractorsFractionAware should filter out equivalent fractions', async () => {
        const results = await page.evaluate(() => {
            const correctAnswer = '\\frac{1}{2}';
            const distractors = [
                '\\frac{6}{12}',  // Equivalent to 1/2
                '\\frac{2}{4}',   // Equivalent to 1/2
                '\\frac{1}{3}'    // Different
            ];
            
            const unique = window.Generator.ensureUniqueDistractorsFractionAware(
                correctAnswer,
                distractors,
                () => `\\frac{${window.Generator.rInt(1, 10)}}{${window.Generator.rInt(2, 15)}}`
            );
            
            // Check that none of the returned distractors are equivalent to the correct answer
            const issues = [];
            for (let distractor of unique) {
                if (window.Generator.areAnswersEquivalent(correctAnswer, distractor)) {
                    issues.push({
                        correctAnswer: correctAnswer,
                        distractor: distractor
                    });
                }
            }
            
            return {
                uniqueCount: unique.length,
                unique: unique,
                issues: issues
            };
        });

        expect(results.uniqueCount).toBe(3);
        expect(results.issues.length).toBe(0);
    });

    test('Real-world scenario: bag with 6 red balls out of 12', async () => {
        const results = await page.evaluate(() => {
            // This simulates the exact scenario from the issue
            // where 6/12 and 1/2 could both appear
            const issues = [];
            
            for (let i = 0; i < 100; i++) {
                // Force the generator to create a scenario where favorable=6, total=12
                const favorable = 6;
                const total = 12;
                const correctAnswer = `\\frac{${favorable}}{${total}}`;
                
                const candidateDistractors = [
                    `\\frac{${total - favorable}}{${total}}`,
                    `\\frac{${favorable}}{${total - favorable}}`,
                    `\\frac{${total}}{${favorable}}`
                ];
                
                const distractors = window.Generator.ensureUniqueDistractorsFractionAware(
                    correctAnswer,
                    candidateDistractors,
                    () => {
                        const wrongNum = window.Generator.rInt(1, total);
                        const wrongDen = window.Generator.rInt(2, total + 5);
                        return `\\frac{${wrongNum}}{${wrongDen}}`;
                    }
                );
                
                const allAnswers = [correctAnswer, ...distractors];
                
                // Check for mathematical equivalence
                for (let j = 0; j < allAnswers.length; j++) {
                    for (let k = j + 1; k < allAnswers.length; k++) {
                        if (window.Generator.areAnswersEquivalent(allAnswers[j], allAnswers[k])) {
                            issues.push({
                                iteration: i,
                                answer1: allAnswers[j],
                                answer2: allAnswers[k],
                                allAnswers: allAnswers
                            });
                        }
                    }
                }
            }
            
            return issues;
        });

        if (results.length > 0) {
            console.log('Found equivalent answers in 6/12 scenario:', JSON.stringify(results, null, 2));
        }
        expect(results.length).toBe(0);
    });
});
