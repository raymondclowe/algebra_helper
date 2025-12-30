// Test for new advanced IB HL AA question types - Part 2
// Tests differential equations, probability distributions, and hypothesis testing

const puppeteer = require('puppeteer');

describe('Advanced IB HL AA Question Types - Part 2', () => {
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
    });

    afterEach(async () => {
        await page.close();
    });

    test('Differential equations questions generate correctly', async () => {
        const deQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.DifferentialEquations.getDifferentialEquationQuestion();
        });
        
        expect(deQuestion).toBeTruthy();
        expect(deQuestion.tex).toBeTruthy();
        expect(deQuestion.instruction).toBeTruthy();
        expect(deQuestion.displayAnswer).toBeTruthy();
        expect(deQuestion.distractors).toHaveLength(3);
        expect(deQuestion.explanation).toBeTruthy();
    });

    test('Probability distributions questions generate correctly', async () => {
        const probDistQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.ProbabilityDistributions.getProbabilityDistributionQuestion();
        });
        
        expect(probDistQuestion).toBeTruthy();
        expect(probDistQuestion.tex).toBeTruthy();
        expect(probDistQuestion.instruction).toBeTruthy();
        expect(probDistQuestion.displayAnswer).toBeTruthy();
        expect(probDistQuestion.distractors).toHaveLength(3);
        expect(probDistQuestion.explanation).toBeTruthy();
    });

    test('Hypothesis testing questions generate correctly', async () => {
        const hypothesisQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.HypothesisTesting.getHypothesisTestingQuestion();
        });
        
        expect(hypothesisQuestion).toBeTruthy();
        expect(hypothesisQuestion.tex).toBeTruthy();
        expect(hypothesisQuestion.instruction).toBeTruthy();
        expect(hypothesisQuestion.displayAnswer).toBeTruthy();
        expect(hypothesisQuestion.distractors).toHaveLength(3);
        expect(hypothesisQuestion.explanation).toBeTruthy();
    });

    test('Generator produces questions for level 32 (Differential Equations)', async () => {
        const question = await page.evaluate(() => {
            return window.Generator.getQuestionForLevel(32);
        });
        
        expect(question).toBeTruthy();
        expect(question.tex).toBeTruthy();
    });

    test('Generator produces questions for level 33 (Probability Distributions)', async () => {
        const question = await page.evaluate(() => {
            return window.Generator.getQuestionForLevel(33);
        });
        
        expect(question).toBeTruthy();
        expect(question.tex).toBeTruthy();
    });

    test('Generator produces questions for level 34 (Hypothesis Testing)', async () => {
        const question = await page.evaluate(() => {
            return window.Generator.getQuestionForLevel(34);
        });
        
        expect(question).toBeTruthy();
        expect(question.tex).toBeTruthy();
    });

    test('Topic definitions include new topics', async () => {
        const topics = await page.evaluate(() => {
            return window.TopicDefinitions.getAllTopics();
        });
        
        expect(topics).toContain("Differential Equations");
        expect(topics).toContain("Probability Distributions");
        expect(topics).toContain("Hypothesis Testing");
    });

    test('New question types have unique distractors', async () => {
        // Test differential equations
        const deQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.DifferentialEquations.getDifferentialEquationQuestion();
        });
        
        const deAnswers = [deQuestion.displayAnswer, ...deQuestion.distractors];
        const uniqueDEAnswers = new Set(deAnswers);
        expect(uniqueDEAnswers.size).toBe(4);
        
        // Test probability distributions
        const probDistQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.ProbabilityDistributions.getProbabilityDistributionQuestion();
        });
        
        const probDistAnswers = [probDistQuestion.displayAnswer, ...probDistQuestion.distractors];
        const uniqueProbDistAnswers = new Set(probDistAnswers);
        expect(uniqueProbDistAnswers.size).toBe(4);
    });

    test('Differential equations contain expected terms', async () => {
        // Generate multiple questions to find separation of variables
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 20; i++) {
                qs.push(window.QuestionTemplates.DifferentialEquations.getDifferentialEquationQuestion());
            }
            return qs;
        });
        
        // At least one should mention separation of variables
        const hasSeparation = questions.some(q => 
            q.instruction.toLowerCase().includes('separat') || 
            q.displayAnswer.toLowerCase().includes('separat') ||
            q.explanation.toLowerCase().includes('separat')
        );
        expect(hasSeparation).toBe(true);
    });

    test('Probability distributions include binomial and normal', async () => {
        // Generate multiple questions
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 20; i++) {
                qs.push(window.QuestionTemplates.ProbabilityDistributions.getProbabilityDistributionQuestion());
            }
            return qs;
        });
        
        // Check for binomial
        const hasBinomial = questions.some(q => 
            q.tex.toLowerCase().includes('binomial') ||
            q.displayAnswer.toLowerCase().includes('binomial') ||
            q.explanation.toLowerCase().includes('binomial')
        );
        
        // Check for normal
        const hasNormal = questions.some(q => 
            q.tex.toLowerCase().includes('normal') ||
            q.displayAnswer.toLowerCase().includes('normal') ||
            q.explanation.toLowerCase().includes('normal')
        );
        
        expect(hasBinomial).toBe(true);
        expect(hasNormal).toBe(true);
    });

    test('Hypothesis testing includes null and alternative hypotheses', async () => {
        // Generate multiple questions
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 20; i++) {
                qs.push(window.QuestionTemplates.HypothesisTesting.getHypothesisTestingQuestion());
            }
            return qs;
        });
        
        // Check for H₀ (null hypothesis)
        const hasH0 = questions.some(q => 
            q.tex.includes('H_0') ||
            q.displayAnswer.includes('H_0') ||
            q.instruction.toLowerCase().includes('null')
        );
        
        // Check for H₁ (alternative hypothesis)
        const hasH1 = questions.some(q => 
            q.tex.includes('H_1') ||
            q.displayAnswer.includes('H_1') ||
            q.instruction.toLowerCase().includes('alternative')
        );
        
        expect(hasH0).toBe(true);
        expect(hasH1).toBe(true);
    });

    test('Multiple differential equation questions generate with variety', async () => {
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 10; i++) {
                qs.push(window.QuestionTemplates.DifferentialEquations.getDifferentialEquationQuestion());
            }
            return qs;
        });
        
        // Check that we get different types of questions
        const texSet = new Set(questions.map(q => q.tex.substring(0, 30)));
        expect(texSet.size).toBeGreaterThan(1);
    });

    test('Differential equations questions include dy/dx notation', async () => {
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 10; i++) {
                qs.push(window.QuestionTemplates.DifferentialEquations.getDifferentialEquationQuestion());
            }
            return qs;
        });
        
        // At least one should contain dy/dx
        const hasDyDx = questions.some(q => q.tex.includes('dy') || q.tex.includes('dx'));
        expect(hasDyDx).toBe(true);
    });

    test('Probability distributions use correct notation', async () => {
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 20; i++) {
                qs.push(window.QuestionTemplates.ProbabilityDistributions.getProbabilityDistributionQuestion());
            }
            return qs;
        });
        
        // Check for distribution notation like B(n,p) or N(μ,σ²)
        const hasNotation = questions.some(q => 
            q.tex.includes('B(') || 
            q.tex.includes('N(') ||
            q.displayAnswer.includes('B(') || 
            q.displayAnswer.includes('N(')
        );
        expect(hasNotation).toBe(true);
    });

    test('Hypothesis testing includes Type I and Type II errors', async () => {
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 30; i++) {
                qs.push(window.QuestionTemplates.HypothesisTesting.getHypothesisTestingQuestion());
            }
            return qs;
        });
        
        // Check for Type I error
        const hasTypeI = questions.some(q => 
            q.instruction.toLowerCase().includes('type i') ||
            q.displayAnswer.toLowerCase().includes('type i') ||
            q.explanation.toLowerCase().includes('type i')
        );
        
        // Check for Type II error
        const hasTypeII = questions.some(q => 
            q.instruction.toLowerCase().includes('type ii') ||
            q.displayAnswer.toLowerCase().includes('type ii') ||
            q.explanation.toLowerCase().includes('type ii')
        );
        
        expect(hasTypeI).toBe(true);
        expect(hasTypeII).toBe(true);
    });
});
