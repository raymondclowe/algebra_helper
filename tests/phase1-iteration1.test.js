/**
 * Tests for Phase 1 Iteration 1 new question types:
 * - Financial Applications (Level 13-14)
 * - Parallel/Perpendicular Lines (Level 6-7)
 * - Quadratic Inequalities (Level 10-11)
 */

const puppeteer = require('puppeteer');

describe('Phase 1 Iteration 1 - New Question Types', () => {
    let browser;
    let page;
    
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        await page.goto('http://localhost:8080/algebra-helper.html');
        await page.waitForSelector('#start-btn', { timeout: 5000 });
    });

    afterAll(async () => {
        await browser.close();
    });

    /**
     * Test Financial Applications questions (Level 13-14)
     */
    describe('Financial Applications (Level 13-14)', () => {
        test('should generate financial application questions at level 13-14', async () => {
            // Start in debug mode at level 13
            await page.evaluate(() => {
                window.DEBUG_MODE = true;
                window.FORCED_TEST_LEVEL = 13;
                window.TESTING_MODE = true;
            });

            await page.click('#start-btn');
            await page.waitForSelector('#question', { timeout: 2000 });

            const questionsGenerated = new Set();
            let financialQuestionFound = false;

            // Try to generate 20 questions to find financial application questions
            for (let i = 0; i < 20; i++) {
                const questionText = await page.$eval('#question', el => el.textContent);
                questionsGenerated.add(questionText);

                // Check if this is a financial application question
                if (questionText.includes('invest') || 
                    questionText.includes('compound interest') ||
                    questionText.includes('depreciat') ||
                    questionText.includes('population') ||
                    questionText.includes('half-life')) {
                    financialQuestionFound = true;
                    
                    // Verify it has proper structure
                    const hasAnswer = await page.$('#answer-btn-0');
                    expect(hasAnswer).toBeTruthy();
                    
                    // Check for dollar signs or numbers in answers for financial questions
                    const answerText = await page.$eval('#answer-btn-0', el => el.textContent);
                    expect(answerText.length).toBeGreaterThan(0);
                }

                // Click any answer to proceed
                await page.click('#answer-btn-0');
                await page.waitForTimeout(100);
            }

            expect(financialQuestionFound).toBe(true);
        });

        test('financial questions should have calculator option enabled', async () => {
            await page.evaluate(() => {
                window.DEBUG_MODE = true;
                window.FORCED_TEST_LEVEL = 13;
                window.TESTING_MODE = true;
            });

            await page.click('#start-btn');
            await page.waitForSelector('#question', { timeout: 2000 });

            // Test multiple questions
            for (let i = 0; i < 15; i++) {
                const questionText = await page.$eval('#question', el => el.textContent);
                
                if (questionText.includes('invest') || questionText.includes('compound')) {
                    // Financial questions should allow calculator
                    const question = await page.evaluate(() => window.APP.currentQuestion);
                    expect(question.calc).toBe(true);
                    break;
                }

                await page.click('#answer-btn-0');
                await page.waitForTimeout(100);
            }
        });
    });

    /**
     * Test Parallel/Perpendicular Lines questions (Level 6-7)
     */
    describe('Parallel/Perpendicular Lines (Level 6-7)', () => {
        test('should generate lines questions at level 6-7', async () => {
            await page.evaluate(() => {
                window.DEBUG_MODE = true;
                window.FORCED_TEST_LEVEL = 7;
                window.TESTING_MODE = true;
            });

            await page.click('#start-btn');
            await page.waitForSelector('#question', { timeout: 2000 });

            let linesQuestionFound = false;

            // Try to generate questions to find lines questions
            for (let i = 0; i < 20; i++) {
                const questionText = await page.$eval('#question', el => el.textContent);

                // Check if this is a lines question
                if (questionText.includes('parallel') || 
                    questionText.includes('perpendicular') ||
                    questionText.includes('gradient')) {
                    linesQuestionFound = true;
                    
                    // Verify proper structure
                    const hasAnswers = await page.$$('#answer-btn-0, #answer-btn-1, #answer-btn-2, #answer-btn-3');
                    expect(hasAnswers.length).toBe(4);
                }

                await page.click('#answer-btn-0');
                await page.waitForTimeout(100);
            }

            expect(linesQuestionFound).toBe(true);
        });

        test('lines questions should have unique distractors', async () => {
            await page.evaluate(() => {
                window.DEBUG_MODE = true;
                window.FORCED_TEST_LEVEL = 7;
                window.TESTING_MODE = true;
            });

            await page.click('#start-btn');
            await page.waitForSelector('#question', { timeout: 2000 });

            for (let i = 0; i < 15; i++) {
                const questionText = await page.$eval('#question', el => el.textContent);
                
                if (questionText.includes('parallel') || questionText.includes('perpendicular')) {
                    // Get all answer button texts
                    const answers = await page.$$eval(
                        '[id^="answer-btn-"]',
                        buttons => buttons.map(btn => btn.textContent.trim())
                    );
                    
                    // Check for uniqueness
                    const uniqueAnswers = new Set(answers);
                    expect(uniqueAnswers.size).toBe(answers.length);
                    break;
                }

                await page.click('#answer-btn-0');
                await page.waitForTimeout(100);
            }
        });
    });

    /**
     * Test Quadratic Inequalities questions (Level 10-11)
     */
    describe('Quadratic Inequalities (Level 10-11)', () => {
        test('should generate quadratic inequality questions at level 10-11', async () => {
            await page.evaluate(() => {
                window.DEBUG_MODE = true;
                window.FORCED_TEST_LEVEL = 11;
                window.TESTING_MODE = true;
            });

            await page.click('#start-btn');
            await page.waitForSelector('#question', { timeout: 2000 });

            let quadraticInequalityFound = false;

            // Try to generate questions
            for (let i = 0; i < 20; i++) {
                const questionText = await page.$eval('#question', el => el.textContent);

                // Check if this is a quadratic inequality question
                // Look for inequality signs and quadratic structure
                if ((questionText.includes('>') || questionText.includes('<') || 
                     questionText.includes('≥') || questionText.includes('≤')) &&
                    (questionText.includes('x²') || questionText.includes('x-'))) {
                    quadraticInequalityFound = true;
                    
                    // Verify proper structure
                    const instruction = await page.$eval('#instruction', el => el.textContent);
                    expect(instruction).toContain('Solve');
                    
                    const hasAnswers = await page.$$('[id^="answer-btn-"]');
                    expect(hasAnswers.length).toBe(4);
                }

                await page.click('#answer-btn-0');
                await page.waitForTimeout(100);
            }

            expect(quadraticInequalityFound).toBe(true);
        });

        test('quadratic inequality answers should include inequality notation', async () => {
            await page.evaluate(() => {
                window.DEBUG_MODE = true;
                window.FORCED_TEST_LEVEL = 11;
                window.TESTING_MODE = true;
            });

            await page.click('#start-btn');
            await page.waitForSelector('#question', { timeout: 2000 });

            for (let i = 0; i < 20; i++) {
                const questionText = await page.$eval('#question', el => el.textContent);
                
                if ((questionText.includes('>') || questionText.includes('<')) &&
                    questionText.includes('x²')) {
                    // Get answer texts
                    const answers = await page.$$eval(
                        '[id^="answer-btn-"]',
                        buttons => buttons.map(btn => btn.textContent.trim())
                    );
                    
                    // At least one answer should have inequality notation
                    const hasInequality = answers.some(ans => 
                        ans.includes('<') || ans.includes('>') || 
                        ans.includes('≤') || ans.includes('≥') ||
                        ans.includes('or')
                    );
                    expect(hasInequality).toBe(true);
                    break;
                }

                await page.click('#answer-btn-0');
                await page.waitForTimeout(100);
            }
        });
    });

    /**
     * General integration tests
     */
    describe('Integration Tests', () => {
        test('new question types should not break existing level progression', async () => {
            await page.evaluate(() => {
                window.DEBUG_MODE = false;
                window.FORCED_TEST_LEVEL = null;
                window.TESTING_MODE = false;
            });

            // Start from beginning and progress through levels
            await page.click('#start-btn');
            await page.waitForSelector('#question', { timeout: 2000 });

            // Answer 20 questions and verify no errors
            for (let i = 0; i < 20; i++) {
                const question = await page.$('#question');
                expect(question).toBeTruthy();
                
                await page.click('#answer-btn-0');
                await page.waitForTimeout(100);
            }

            // Check that level has progressed
            const level = await page.evaluate(() => window.APP.level);
            expect(level).toBeGreaterThan(1);
        });

        test('LaTeX should render correctly in new question types', async () => {
            await page.evaluate(() => {
                window.DEBUG_MODE = true;
                window.FORCED_TEST_LEVEL = 13;
                window.TESTING_MODE = true;
            });

            await page.click('#start-btn');
            await page.waitForSelector('#question', { timeout: 2000 });

            // Generate several questions and check for LaTeX errors
            for (let i = 0; i < 10; i++) {
                // Check for MathJax rendering errors
                const hasError = await page.evaluate(() => {
                    const questionEl = document.getElementById('question');
                    return questionEl && questionEl.textContent.includes('\\');
                });
                
                // If LaTeX is unrendered, it will still contain backslashes
                // This is a simple check - properly rendered math shouldn't have raw LaTeX
                expect(hasError).toBe(false);

                await page.click('#answer-btn-0');
                await page.waitForTimeout(200);
            }
        });
    });
});
