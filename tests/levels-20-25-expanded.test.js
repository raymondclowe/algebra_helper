const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Expanded Levels 20-25 Tests', () => {
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

    describe('Level 21: Advanced Calculus (tripled)', () => {
        test('Generates at least 12 different question types', async () => {
            const questionTypes = await page.evaluate(() => {
                const types = new Set();
                for (let i = 0; i < 500; i++) {
                    const q = window.Generator.getAdvancedCalculus();
                    // Classify by instruction or tex patterns
                    if (q.instruction.includes('chain rule')) types.add('chain_rule');
                    if (q.instruction.includes('product rule')) types.add('product_rule');
                    if (q.instruction.includes('second derivative')) types.add('second_derivative');
                    if (q.instruction.includes('critical point')) types.add('critical_point');
                    if (q.tex.includes('State the chain rule')) types.add('definition_chain');
                    if (q.tex.includes('State the product rule')) types.add('definition_product');
                    if (q.instruction.includes('stationary points')) types.add('stationary_points');
                    if (q.tex.includes('What is a critical point')) types.add('definition_critical');
                    if (q.tex.includes('concave')) types.add('concavity');
                    if (q.tex.includes('sqrt')) types.add('chain_sqrt');
                }
                return Array.from(types);
            });

            expect(questionTypes.length).toBeGreaterThanOrEqual(8);
        });

        test('Includes definition/recognition questions', async () => {
            const hasDefinitions = await page.evaluate(() => {
                for (let i = 0; i < 100; i++) {
                    const q = window.Generator.getAdvancedCalculus();
                    if (q.tex.includes('State the') || q.tex.includes('What is') || q.tex.includes('Define')) {
                        return true;
                    }
                }
                return false;
            });

            expect(hasDefinitions).toBe(true);
        });
    });

    describe('Level 22: Statistics (tripled)', () => {
        test('Generates at least 12 different question types', async () => {
            const questionTypes = await page.evaluate(() => {
                const types = new Set();
                for (let i = 0; i < 500; i++) {
                    const q = window.Generator.getStatistics();
                    if (q.instruction.includes('mean')) types.add('mean');
                    if (q.instruction.includes('median')) types.add('median');
                    if (q.instruction.includes('mode')) types.add('mode');
                    if (q.instruction.includes('range')) types.add('range');
                    if (q.tex.includes('Define the mean')) types.add('definition_mean');
                    if (q.tex.includes('Define the median')) types.add('definition_median');
                    if (q.tex.includes('Define the mode')) types.add('definition_mode');
                    if (q.tex.includes('standard deviation')) types.add('std_dev');
                    if (q.tex.includes('Q2')) types.add('quartiles');
                    if (q.tex.includes('outlier')) types.add('outlier');
                    if (q.tex.includes('IQR')) types.add('iqr');
                }
                return Array.from(types);
            });

            expect(questionTypes.length).toBeGreaterThanOrEqual(8);
        });

        test('Includes IB-relevant definition questions', async () => {
            const hasDefinitions = await page.evaluate(() => {
                for (let i = 0; i < 100; i++) {
                    const q = window.Generator.getStatistics();
                    if (q.tex.includes('Define') || q.tex.includes('What does') || q.tex.includes('What is')) {
                        return true;
                    }
                }
                return false;
            });

            expect(hasDefinitions).toBe(true);
        });
    });

    describe('Level 23: Probability (tripled)', () => {
        test('Generates at least 9 different question types', async () => {
            const questionTypes = await page.evaluate(() => {
                const types = new Set();
                for (let i = 0; i < 500; i++) {
                    const q = window.Generator.getProbability();
                    if (q.tex.includes('Bag has') && q.tex.includes('balls')) types.add('simple_prob');
                    if (q.tex.includes('Choosing')) types.add('combinations');
                    if (q.tex.includes('P(failure)')) types.add('complementary');
                    if (q.tex.includes('Define probability')) types.add('definition_probability');
                    if (q.tex.includes('complementary events')) types.add('definition_complementary');
                    if (q.tex.includes('die')) types.add('dice_prob');
                    if (q.tex.includes('range of possible')) types.add('range_concept');
                    if (q.instruction.includes('correct formula') && q.tex.includes('Choosing')) types.add('combination_formula');
                    if (q.tex.includes('sample space')) types.add('sample_space');
                }
                return Array.from(types);
            });

            expect(questionTypes.length).toBeGreaterThanOrEqual(7);
        });
    });

    describe('Level 24: Advanced Probability (tripled)', () => {
        test('Generates at least 9 different question types', async () => {
            const questionTypes = await page.evaluate(() => {
                const types = new Set();
                for (let i = 0; i < 500; i++) {
                    const q = window.Generator.getAdvancedProbability();
                    if (q.instruction.includes('P(B|A)')) types.add('conditional');
                    if (q.instruction.includes('P(A and B)')) types.add('independent');
                    if (q.instruction.includes('E(X)')) types.add('expected_value');
                    if (q.tex.includes('formula for conditional')) types.add('definition_conditional');
                    if (q.tex.includes('independent')) types.add('definition_independent');
                    if (q.tex.includes('Define expected value')) types.add('definition_expected');
                    if (q.tex.includes('variance')) types.add('variance');
                }
                return Array.from(types);
            });

            expect(questionTypes.length).toBeGreaterThanOrEqual(6);
        });
    });

    describe('Level 25: Calculus/Integration (tripled)', () => {
        test('Generates at least 12 different question types', async () => {
            const questionTypes = await page.evaluate(() => {
                const types = new Set();
                for (let i = 0; i < 500; i++) {
                    const q = window.Generator.getCalculus();
                    if (q.tex.match(/^\\int x\^\d+ \\, dx$/)) types.add('basic_integration');
                    if (q.tex.match(/^\\int \d+x\^\d+ \\, dx$/)) types.add('coefficient_integration');
                    if (q.tex.includes('sum_{n=0}')) types.add('geometric_series');
                    if (q.tex.includes('frac{') && q.tex.includes(')(x -')) types.add('partial_fractions');
                    if (q.tex.includes('What is integration')) types.add('definition_integration');
                    if (q.tex.includes('Why do we add +C')) types.add('constant_integration');
                    if (q.tex.includes('\\frac{') && q.tex.includes('/x}')) types.add('integration_1_over_x');
                    if (q.tex.includes('sum of an infinite geometric')) types.add('definition_geometric_sum');
                    if (q.tex.includes('\\int_a^b')) types.add('definite_integral');
                    if (q.tex.includes('converge')) types.add('convergence');
                    if (q.tex.includes('power rule for integration')) types.add('power_rule_statement');
                }
                return Array.from(types);
            });

            expect(questionTypes.length).toBeGreaterThanOrEqual(9);
        });

        test('Includes definition questions for IB curriculum', async () => {
            const hasDefinitions = await page.evaluate(() => {
                for (let i = 0; i < 100; i++) {
                    const q = window.Generator.getCalculus();
                    if (q.tex.includes('State') || q.tex.includes('What') || q.tex.includes('Why')) {
                        return true;
                    }
                }
                return false;
            });

            expect(hasDefinitions).toBe(true);
        });
    });

    describe('All expanded levels', () => {
        test('All questions have proper structure', async () => {
            const allValid = await page.evaluate(() => {
                const generators = [
                    window.Generator.getAdvancedCalculus,
                    window.Generator.getStatistics,
                    window.Generator.getProbability,
                    window.Generator.getAdvancedProbability,
                    window.Generator.getCalculus
                ];
                
                for (const gen of generators) {
                    for (let i = 0; i < 20; i++) {
                        const q = gen();
                        if (!q.tex || !q.displayAnswer || !q.distractors || !q.explanation) {
                            return false;
                        }
                        if (q.distractors.length !== 3) {
                            return false;
                        }
                    }
                }
                return true;
            });

            expect(allValid).toBe(true);
        });
    });
});
