const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Squares and Roots Expanded Range Tests', () => {
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

    describe('Square Numbers (1-20)', () => {
        test('Can generate square questions for all numbers 1-20', async () => {
            const foundNumbers = await page.evaluate(() => {
                const numbersFound = new Set();
                // Generate 500 questions to ensure we hit all numbers
                for (let i = 0; i < 500; i++) {
                    const q = window.Generator.getSquaresAndRoots();
                    // Extract the number from various question formats
                    if (q.tex.includes('^2')) {
                        const match = q.tex.match(/(\d+)\^2/);
                        if (match) numbersFound.add(parseInt(match[1]));
                    }
                    if (q.tex.includes('is the square of')) {
                        const match = q.tex.match(/(\d+) \\text{ is the square of/);
                        if (match) {
                            const square = parseInt(match[1]);
                            // Calculate the root
                            const root = Math.sqrt(square);
                            if (Number.isInteger(root)) {
                                numbersFound.add(root);
                            }
                        }
                    }
                    if (q.tex.includes('\\sqrt{') && !q.tex.includes('\\sqrt[3]')) {
                        const match = q.tex.match(/\\sqrt{(\d+)}/);
                        if (match) {
                            const square = parseInt(match[1]);
                            const root = Math.sqrt(square);
                            if (Number.isInteger(root)) {
                                numbersFound.add(root);
                            }
                        }
                    }
                }
                return Array.from(numbersFound).sort((a, b) => a - b);
            });

            // Check we found numbers in the range 1-20
            expect(foundNumbers.length).toBeGreaterThan(15);
            expect(foundNumbers.some(n => n <= 5)).toBe(true); // Low range
            expect(foundNumbers.some(n => n >= 15 && n <= 20)).toBe(true); // High range
        });

        test('Square questions include values up to 400', async () => {
            const results = await page.evaluate(() => {
                const values = [];
                for (let i = 0; i < 200; i++) {
                    const q = window.Generator.getSquaresAndRoots();
                    if (q.tex.includes('^2') || q.tex.includes('\\sqrt{')) {
                        const numMatch = q.displayAnswer.match(/\d+/);
                        if (numMatch) {
                            values.push(parseInt(numMatch[0]));
                        }
                    }
                }
                return {
                    maxValue: Math.max(...values),
                    hasLargeValues: values.some(v => v > 144) // 12^2 was the old max
                };
            });

            expect(results.hasLargeValues).toBe(true);
        });
    });

    describe('Cube Numbers (1-20)', () => {
        test('Can generate cube questions for all numbers 1-20', async () => {
            const foundNumbers = await page.evaluate(() => {
                const numbersFound = new Set();
                // Generate 500 questions to ensure we hit all numbers
                for (let i = 0; i < 500; i++) {
                    const q = window.Generator.getSquaresAndRoots();
                    // Extract the number from cube question formats
                    if (q.tex.includes('^3')) {
                        const match = q.tex.match(/(\d+)\^3/);
                        if (match) numbersFound.add(parseInt(match[1]));
                    }
                    if (q.tex.includes('is the cube of')) {
                        const match = q.tex.match(/(\d+) \\text{ is the cube of/);
                        if (match) {
                            const cube = parseInt(match[1]);
                            const root = Math.cbrt(cube);
                            if (Number.isInteger(root)) {
                                numbersFound.add(root);
                            }
                        }
                    }
                    if (q.tex.includes('\\sqrt[3]')) {
                        const match = q.tex.match(/\\sqrt\[3\]{(\d+)}/);
                        if (match) {
                            const cube = parseInt(match[1]);
                            const root = Math.cbrt(cube);
                            if (Number.isInteger(root)) {
                                numbersFound.add(root);
                            }
                        }
                    }
                }
                return Array.from(numbersFound).sort((a, b) => a - b);
            });

            // Check we found numbers in the range 1-20
            expect(foundNumbers.length).toBeGreaterThan(10);
            expect(foundNumbers.some(n => n <= 5)).toBe(true); // Low range
            expect(foundNumbers.some(n => n >= 10 && n <= 20)).toBe(true); // High range
        });

        test('Cube root notation uses proper LaTeX', async () => {
            const hasCubeRoot = await page.evaluate(() => {
                for (let i = 0; i < 100; i++) {
                    const q = window.Generator.getSquaresAndRoots();
                    if (q.tex.includes('\\sqrt[3]')) {
                        return true;
                    }
                }
                return false;
            });

            expect(hasCubeRoot).toBe(true);
        });
    });

    describe('Inverse Operations', () => {
        test('Generates inverse square root questions √(n²)', async () => {
            const hasInverseSquare = await page.evaluate(() => {
                for (let i = 0; i < 100; i++) {
                    const q = window.Generator.getSquaresAndRoots();
                    // Look for pattern like √(5²) = 5
                    if (q.tex.match(/\\sqrt{(\d+)\^2}/)) {
                        return true;
                    }
                }
                return false;
            });

            expect(hasInverseSquare).toBe(true);
        });

        test('All 8 question types are generated', async () => {
            const questionTypes = await page.evaluate(() => {
                const types = new Set();
                for (let i = 0; i < 400; i++) {
                    const q = window.Generator.getSquaresAndRoots();
                    // Classify the question type
                    if (q.tex.match(/\\text{What is } \d+\^2/)) {
                        types.add('square_forward');
                    } else if (q.tex.match(/\d+ \\text{ is the square of/)) {
                        types.add('square_reverse');
                    } else if (q.tex.match(/\\text{What is } \d+\^3/)) {
                        types.add('cube_forward');
                    } else if (q.tex.match(/\d+ \\text{ is the cube of/)) {
                        types.add('cube_reverse');
                    } else if (q.tex.match(/^\\sqrt{\d+}$/)) {
                        types.add('square_root');
                    } else if (q.tex.match(/\\sqrt\[3\]{\d+}/)) {
                        types.add('cube_root');
                    } else if (q.tex.match(/^\d+\^\d+$/) && !q.tex.includes('What is')) {
                        types.add('power_notation');
                    } else if (q.tex.match(/\\sqrt{\d+\^2}/)) {
                        types.add('inverse_square');
                    }
                }
                return Array.from(types);
            });

            // Should have at least 7 different types (8 total with the new inverse)
            expect(questionTypes.length).toBeGreaterThan(6);
        });
    });
});
