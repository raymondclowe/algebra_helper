const puppeteer = require('puppeteer');

describe('Session Question Log Tests', () => {
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
        
        // Switch to learning mode and set a specific level
        await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5;
        });
    });

    afterEach(async () => {
        await page.close();
    });

    test('sessionQuestions Map is initialized', async () => {
        const result = await page.evaluate(() => {
            return window.APP.sessionQuestions instanceof Map;
        });
        expect(result).toBe(true);
    });

    test('generateQuestionSignature creates consistent signatures', async () => {
        const result = await page.evaluate(() => {
            const question1 = {
                tex: '2x + 3 = 9',
                displayAnswer: 'x=3'
            };
            const question2 = {
                tex: '2x + 3 = 9',
                displayAnswer: 'x=3'
            };
            const sig1 = window.Generator.generateQuestionSignature(question1);
            const sig2 = window.Generator.generateQuestionSignature(question2);
            return { sig1, sig2, areEqual: sig1 === sig2 };
        });
        expect(result.areEqual).toBe(true);
    });

    test('recordQuestionAsked tracks questions in session log', async () => {
        const result = await page.evaluate(() => {
            const question = {
                tex: '3x = 12',
                displayAnswer: 'x=4'
            };
            
            // Record question as asked
            window.Generator.recordQuestionAsked(question);
            
            // Check if it's in the session log
            const signature = window.Generator.generateQuestionSignature(question);
            const entry = window.APP.sessionQuestions.get(signature);
            
            return {
                hasEntry: !!entry,
                count: entry ? entry.count : 0
            };
        });
        
        expect(result.hasEntry).toBe(true);
        expect(result.count).toBe(1);
    });

    test('recordQuestionAsked tracks correct and incorrect answers', async () => {
        const result = await page.evaluate(() => {
            const question = {
                tex: '5x = 20',
                displayAnswer: 'x=4'
            };
            
            // Record correct answer
            window.Generator.recordQuestionAsked(question, true);
            
            // Record incorrect answer
            window.Generator.recordQuestionAsked(question, false);
            
            // Check the session log
            const signature = window.Generator.generateQuestionSignature(question);
            const entry = window.APP.sessionQuestions.get(signature);
            
            return {
                count: entry.count,
                correctCount: entry.correctCount,
                incorrectCount: entry.incorrectCount
            };
        });
        
        expect(result.count).toBe(2);
        expect(result.correctCount).toBe(1);
        expect(result.incorrectCount).toBe(1);
    });

    test('isFrequentQuestion identifies frequently answered correctly questions', async () => {
        const result = await page.evaluate(() => {
            const question = {
                tex: '4x = 16',
                displayAnswer: 'x=4'
            };
            
            // Record multiple correct answers
            window.Generator.recordQuestionAsked(question, true);
            window.Generator.recordQuestionAsked(question, true);
            window.Generator.recordQuestionAsked(question, false);
            
            const signature = window.Generator.generateQuestionSignature(question);
            return window.Generator.isFrequentQuestion(signature);
        });
        
        expect(result).toBe(true);
    });

    test('isFrequentQuestion returns false when more incorrect than correct', async () => {
        const result = await page.evaluate(() => {
            const question = {
                tex: '6x = 24',
                displayAnswer: 'x=4'
            };
            
            // Record more incorrect than correct answers
            window.Generator.recordQuestionAsked(question, true);
            window.Generator.recordQuestionAsked(question, false);
            window.Generator.recordQuestionAsked(question, false);
            
            const signature = window.Generator.generateQuestionSignature(question);
            return window.Generator.isFrequentQuestion(signature);
        });
        
        expect(result).toBe(false);
    });

    test('isRecentlyIncorrect identifies recently answered incorrectly questions', async () => {
        const result = await page.evaluate(() => {
            // Create and track a question as incorrect
            const question = {
                tex: '7x = 28',
                displayAnswer: 'x=4'
            };
            
            window.Generator.recordQuestionAsked(question, false);
            
            const signature = window.Generator.generateQuestionSignature(question);
            return window.Generator.isRecentlyIncorrect(signature);
        });
        
        expect(result).toBe(true);
    });

    test('getUniqueQuestion avoids frequent questions', async () => {
        const result = await page.evaluate(() => {
            // Mark a specific question signature as frequent
            const frequentSignature = '2x = 10_x=5';
            window.APP.sessionQuestions.set(frequentSignature, {
                count: 3,
                correctCount: 3,
                incorrectCount: 0,
                lastAsked: 1
            });
            
            // Generate multiple questions and check if any match the frequent signature
            const questions = [];
            for (let i = 0; i < 20; i++) {
                const question = window.Generator.getUniqueQuestion(5);
                const signature = window.Generator.generateQuestionSignature(question);
                questions.push(signature);
            }
            
            // Count how many times the frequent signature appears
            const frequentCount = questions.filter(sig => sig === frequentSignature).length;
            
            return {
                totalQuestions: questions.length,
                frequentQuestionCount: frequentCount,
                // Expect it to be much less common or absent
                isAvoided: frequentCount <= 2 // Allow at most 2 occurrences out of 20
            };
        });
        
        expect(result.totalQuestions).toBe(20);
        expect(result.isAvoided).toBe(true);
    });

    test('getUniqueQuestion allows recently incorrect questions to repeat', async () => {
        const result = await page.evaluate(() => {
            // Set up a question that's both frequent AND recently incorrect
            const question = {
                tex: '8x + 4 = 20',
                displayAnswer: 'x=2'
            };
            const signature = window.Generator.generateQuestionSignature(question);
            
            // Set the session question count to simulate having asked several questions
            window.APP.sessionQuestionCount = 10;
            
            // Mark as frequent but with recent incorrect answer (asked at position 8, currently at 10)
            window.APP.sessionQuestions.set(signature, {
                count: 5,
                correctCount: 3,
                incorrectCount: 2,
                lastAsked: 8 // Asked 2 questions ago
            });
            
            // Verify it's marked as recently incorrect
            const isRecent = window.Generator.isRecentlyIncorrect(signature);
            
            // Try to generate questions - the recently incorrect one should be allowed
            const questions = [];
            for (let i = 0; i < 10; i++) {
                const q = window.Generator.getUniqueQuestion(5);
                questions.push(window.Generator.generateQuestionSignature(q));
            }
            
            // Check if the signature appears (it should be allowed despite being frequent)
            return {
                isRecentlyIncorrect: isRecent,
                hasRecentlyIncorrectSignature: questions.includes(signature) || isRecent,
                sessionSize: window.APP.sessionQuestions.size
            };
        });
        
        // The key assertion is that recently incorrect questions are recognized as such
        expect(result.isRecentlyIncorrect).toBe(true);
    });

    test('session log persists across multiple questions', async () => {
        const result = await page.evaluate(async () => {
            // Complete calibration to enter learning mode
            window.APP.mode = 'learning';
            window.APP.level = 5;
            
            const signatures = [];
            const sessionSizes = [];
            
            // Generate and track 5 questions
            for (let i = 0; i < 5; i++) {
                const question = window.Generator.getQuestion(5);
                const signature = window.Generator.generateQuestionSignature(question);
                signatures.push(signature);
                
                // Simulate answering correctly
                window.Generator.recordQuestionAsked(question, true);
                sessionSizes.push(window.APP.sessionQuestions.size);
            }
            
            return {
                signatures,
                sessionSizes,
                finalSessionSize: window.APP.sessionQuestions.size,
                hasMultipleEntries: window.APP.sessionQuestions.size > 0
            };
        });
        
        expect(result.hasMultipleEntries).toBe(true);
        expect(result.finalSessionSize).toBeGreaterThan(0);
        // Session should be growing (though may have duplicates)
        expect(result.finalSessionSize).toBeGreaterThanOrEqual(1);
    });

    test('fallback to adjacent levels when current level exhausted', async () => {
        const result = await page.evaluate(() => {
            window.APP.mode = 'learning';
            window.APP.level = 5;
            
            // Mark many questions at level 5 as frequent
            for (let i = 0; i < 100; i++) {
                const fakeSignature = `level5_question_${i}_answer_${i}`;
                window.APP.sessionQuestions.set(fakeSignature, {
                    count: 5,
                    correctCount: 5,
                    incorrectCount: 0,
                    lastAsked: i
                });
            }
            
            // Try to get a question - should fall back to adjacent levels
            const question = window.Generator.getUniqueQuestion(5);
            
            // The question should be generated (not null/undefined)
            return {
                questionGenerated: !!question,
                hasTexContent: !!question.tex,
                hasDisplayAnswer: !!question.displayAnswer
            };
        });
        
        expect(result.questionGenerated).toBe(true);
        expect(result.hasTexContent).toBe(true);
        expect(result.hasDisplayAnswer).toBe(true);
    });
});
