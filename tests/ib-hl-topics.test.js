const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('IB Math HL AA Topic Coverage Tests', () => {
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

    // Level 3-4: Fractions
    describe('Fractions (Level 3-4)', () => {
        test('Fraction problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getFractions();
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
            expect(question.tex).toMatch(/frac/); // Should contain LaTeX fraction notation
        });

        test('Multiple fraction types are generated', async () => {
            const types = await page.evaluate(() => {
                const texSet = new Set();
                for (let i = 0; i < 50; i++) {
                    const q = window.Generator.getFractions();
                    // Extract operation type from tex
                    if (q.tex.includes('\\div')) texSet.add('division');
                    else if (q.tex.includes('\\times')) texSet.add('multiplication');
                    else if (q.tex.includes('+')) texSet.add('addition');
                    else texSet.add('simplification');
                }
                return Array.from(texSet);
            });

            expect(types.length).toBeGreaterThan(2); // Should have multiple types
        });
    });

    // Level 4-5: Decimals and Percentages
    describe('Decimals and Percentages (Level 4-5)', () => {
        test('Decimal/percentage problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getDecimalsPercentages();
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
    });

    // Level 7-8: Inequalities
    describe('Inequalities (Level 7-8)', () => {
        test('Inequality problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getInequalities();
                return {
                    hasQuestion: !!q,
                    hasTex: !!q.tex,
                    hasAnswer: !!q.displayAnswer,
                    hasDistractors: Array.isArray(q.distractors) && q.distractors.length === 3,
                    hasExplanation: !!q.explanation,
                    tex: q.tex,
                    answer: q.displayAnswer
                };
            });

            expect(question.hasQuestion).toBe(true);
            expect(question.hasTex).toBe(true);
            expect(question.hasAnswer).toBe(true);
            expect(question.hasDistractors).toBe(true);
            expect(question.hasExplanation).toBe(true);
            expect(question.tex).toMatch(/[<>]/); // Should contain inequality symbol
        });
    });

    // Level 10-11: Quadratics
    describe('Quadratics (Level 10-11)', () => {
        test('Quadratic problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getQuadratics();
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
        });
    });

    // Level 11-12: Polynomials
    describe('Polynomials (Level 11-12)', () => {
        test('Polynomial problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getPolynomials();
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
    });

    // Level 12-13: Exponentials and Logarithms
    describe('Exponentials and Logarithms (Level 12-13)', () => {
        test('Exponential/logarithm problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getExponentialsLogs();
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
        });
    });

    // Level 13-14: Sequences and Series
    describe('Sequences and Series (Level 13-14)', () => {
        test('Sequence/series problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getSequencesSeries();
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

        test('Includes both arithmetic and geometric sequences', async () => {
            const types = await page.evaluate(() => {
                const texSet = new Set();
                for (let i = 0; i < 30; i++) {
                    const q = window.Generator.getSequencesSeries();
                    if (q.tex.includes('Arithmetic')) texSet.add('arithmetic');
                    if (q.tex.includes('Geometric')) texSet.add('geometric');
                    if (q.tex.includes('sum')) texSet.add('sigma');
                }
                return Array.from(texSet);
            });

            expect(types.length).toBeGreaterThan(1); // Should have multiple types
        });
    });

    // Level 16-17: Advanced Trigonometry
    describe('Advanced Trigonometry (Level 16-17)', () => {
        test('Advanced trig problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getAdvancedTrig();
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
        });
    });

    // Level 17-18: Vectors
    describe('Vectors (Level 17-18)', () => {
        test('Vector problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getVectors();
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
            expect(question.tex).toMatch(/pmatrix|cdot|left\|/); // Should contain vector notation
        });
    });

    // Level 18-19: Complex Numbers
    describe('Complex Numbers (Level 18-19)', () => {
        test('Complex number problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getComplexNumbers();
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
            expect(question.tex).toMatch(/i/); // Should contain imaginary unit
        });
    });

    // Level 20-21: Advanced Calculus
    describe('Advanced Calculus (Level 20-21)', () => {
        test('Advanced calculus problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getAdvancedCalculus();
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
    });

    // Level 21-22: Statistics
    describe('Statistics (Level 21-22)', () => {
        test('Statistics problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getStatistics();
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

        test('Includes mean, median, mode, and range', async () => {
            const types = await page.evaluate(() => {
                const instructionSet = new Set();
                for (let i = 0; i < 40; i++) {
                    const q = window.Generator.getStatistics();
                    const instruction = q.instruction.toLowerCase();
                    if (instruction.includes('mean')) instructionSet.add('mean');
                    if (instruction.includes('median')) instructionSet.add('median');
                    if (instruction.includes('mode')) instructionSet.add('mode');
                    if (instruction.includes('range')) instructionSet.add('range');
                }
                return Array.from(instructionSet);
            });

            expect(types.length).toBeGreaterThan(2); // Should have multiple types
        });
    });

    // Level 23-24: Advanced Probability
    describe('Advanced Probability (Level 23-24)', () => {
        test('Advanced probability problems are generated correctly', async () => {
            const question = await page.evaluate(() => {
                const q = window.Generator.getAdvancedProbability();
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
    });

    // Integration Test: Level Progression
    describe('Level System Integration', () => {
        test('All levels generate appropriate questions', async () => {
            const results = await page.evaluate(() => {
                const levelResults = [];
                for (let level = 0.5; level <= 24; level += 2) {
                    window.APP = { mode: 'learning', level: level };
                    const q = window.Generator.getQuestionForLevel(level);
                    levelResults.push({
                        level: level,
                        hasQuestion: !!q,
                        hasTex: !!q.tex,
                        hasAnswer: !!q.displayAnswer
                    });
                }
                return levelResults;
            });

            results.forEach(result => {
                expect(result.hasQuestion).toBe(true);
                expect(result.hasTex).toBe(true);
                expect(result.hasAnswer).toBe(true);
            });
        });

        test('Questions are appropriate for each level band', async () => {
            const levelMappings = await page.evaluate(() => {
                const mappings = [];
                // Test specific level bands
                const testLevels = [
                    { level: 3.5, expectedTopic: 'fractions' },
                    { level: 4.5, expectedTopic: 'decimals' },
                    { level: 7.5, expectedTopic: 'inequalities' },
                    { level: 10.5, expectedTopic: 'quadratics' },
                    { level: 12.5, expectedTopic: 'exponentials' },
                    { level: 17.5, expectedTopic: 'vectors' },
                    { level: 18.5, expectedTopic: 'complex' }
                ];
                
                testLevels.forEach(({ level, expectedTopic }) => {
                    const q = window.Generator.getQuestionForLevel(level);
                    mappings.push({
                        level: level,
                        expectedTopic: expectedTopic,
                        tex: q.tex,
                        instruction: q.instruction
                    });
                });
                
                return mappings;
            });

            // Verify topics are appropriate (basic checks)
            const fractionQ = levelMappings.find(m => m.level === 3.5);
            expect(fractionQ.tex).toMatch(/frac/);
            
            const vectorQ = levelMappings.find(m => m.level === 17.5);
            expect(vectorQ.tex).toMatch(/pmatrix|cdot|left\|/);
            
            const complexQ = levelMappings.find(m => m.level === 18.5);
            expect(complexQ.tex).toMatch(/i/);
        });
    });

    // Why Questions for New Levels
    describe('Why Questions for Extended Levels', () => {
        test('Why questions are generated for high levels', async () => {
            const whyQuestions = await page.evaluate(() => {
                const questions = [];
                for (let level = 12; level <= 24; level += 3) {
                    const q = window.Generator.getWhyQuestion(level);
                    questions.push({
                        level: level,
                        hasQuestion: !!q,
                        isWhyType: q.type === 'why',
                        hasExplanation: !!q.explanation
                    });
                }
                return questions;
            });

            whyQuestions.forEach(q => {
                expect(q.hasQuestion).toBe(true);
                expect(q.isWhyType).toBe(true);
                expect(q.hasExplanation).toBe(true);
            });
        });
    });
});
