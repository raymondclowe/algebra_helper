// Test for new advanced IB HL AA question types
// Tests proof questions, matrices, 3D vectors, polar complex numbers, and advanced integration

const puppeteer = require('puppeteer');

describe('Advanced IB HL AA Question Types', () => {
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

    test('Proof by induction questions generate correctly', async () => {
        const inductionQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.ProofsInduction.getInductionProofQuestion();
        });
        
        expect(inductionQuestion).toBeTruthy();
        expect(inductionQuestion.tex).toBeTruthy();
        expect(inductionQuestion.instruction).toBeTruthy();
        expect(inductionQuestion.displayAnswer).toBeTruthy();
        expect(inductionQuestion.distractors).toHaveLength(3);
        expect(inductionQuestion.explanation).toBeTruthy();
    });

    test('Proof by contradiction questions generate correctly', async () => {
        const contradictionQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.ProofsContradiction.getContradictionProofQuestion();
        });
        
        expect(contradictionQuestion).toBeTruthy();
        expect(contradictionQuestion.tex).toBeTruthy();
        expect(contradictionQuestion.instruction).toBeTruthy();
        expect(contradictionQuestion.displayAnswer).toBeTruthy();
        expect(contradictionQuestion.distractors).toHaveLength(3);
        expect(contradictionQuestion.explanation).toBeTruthy();
    });

    test('Matrix algebra questions generate correctly', async () => {
        const matrixQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.MatrixAlgebra.getMatrixQuestion();
        });
        
        expect(matrixQuestion).toBeTruthy();
        expect(matrixQuestion.tex).toBeTruthy();
        expect(matrixQuestion.instruction).toBeTruthy();
        expect(matrixQuestion.displayAnswer).toBeTruthy();
        expect(matrixQuestion.distractors).toHaveLength(3);
        expect(matrixQuestion.explanation).toBeTruthy();
    });

    test('3D vector questions generate correctly', async () => {
        const vector3DQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.Vectors3D.get3DVectorQuestion();
        });
        
        expect(vector3DQuestion).toBeTruthy();
        expect(vector3DQuestion.tex).toBeTruthy();
        expect(vector3DQuestion.instruction).toBeTruthy();
        expect(vector3DQuestion.displayAnswer).toBeTruthy();
        expect(vector3DQuestion.distractors).toHaveLength(3);
        expect(vector3DQuestion.explanation).toBeTruthy();
    });

    test('Complex polar form questions generate correctly', async () => {
        const complexPolarQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.ComplexPolar.getComplexPolarQuestion();
        });
        
        expect(complexPolarQuestion).toBeTruthy();
        expect(complexPolarQuestion.tex).toBeTruthy();
        expect(complexPolarQuestion.instruction).toBeTruthy();
        expect(complexPolarQuestion.displayAnswer).toBeTruthy();
        expect(complexPolarQuestion.distractors).toHaveLength(3);
        expect(complexPolarQuestion.explanation).toBeTruthy();
    });

    test('Advanced integration questions generate correctly', async () => {
        const advancedIntegrationQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.AdvancedIntegration.getAdvancedIntegrationQuestion();
        });
        
        expect(advancedIntegrationQuestion).toBeTruthy();
        expect(advancedIntegrationQuestion.tex).toBeTruthy();
        expect(advancedIntegrationQuestion.instruction).toBeTruthy();
        expect(advancedIntegrationQuestion.displayAnswer).toBeTruthy();
        expect(advancedIntegrationQuestion.distractors).toHaveLength(3);
        expect(advancedIntegrationQuestion.explanation).toBeTruthy();
    });

    test('Generator produces questions for level 26 (Proof by Induction)', async () => {
        const question = await page.evaluate(() => {
            return window.Generator.getQuestionForLevel(26);
        });
        
        expect(question).toBeTruthy();
        expect(question.tex).toBeTruthy();
    });

    test('Generator produces questions for level 27 (Proof by Contradiction)', async () => {
        const question = await page.evaluate(() => {
            return window.Generator.getQuestionForLevel(27);
        });
        
        expect(question).toBeTruthy();
        expect(question.tex).toBeTruthy();
    });

    test('Generator produces questions for level 28 (Matrix Algebra)', async () => {
        const question = await page.evaluate(() => {
            return window.Generator.getQuestionForLevel(28);
        });
        
        expect(question).toBeTruthy();
        expect(question.tex).toBeTruthy();
    });

    test('Generator produces questions for level 29 (3D Vectors)', async () => {
        const question = await page.evaluate(() => {
            return window.Generator.getQuestionForLevel(29);
        });
        
        expect(question).toBeTruthy();
        expect(question.tex).toBeTruthy();
    });

    test('Generator produces questions for level 30 (Complex Polar)', async () => {
        const question = await page.evaluate(() => {
            return window.Generator.getQuestionForLevel(30);
        });
        
        expect(question).toBeTruthy();
        expect(question.tex).toBeTruthy();
    });

    test('Generator produces questions for level 31 (Advanced Integration)', async () => {
        const question = await page.evaluate(() => {
            return window.Generator.getQuestionForLevel(31);
        });
        
        expect(question).toBeTruthy();
        expect(question.tex).toBeTruthy();
    });

    test('Topic definitions include new advanced topics', async () => {
        const topics = await page.evaluate(() => {
            return window.TopicDefinitions.getAllTopics();
        });
        
        expect(topics).toContain("Proof by Induction");
        expect(topics).toContain("Proof by Contradiction");
        expect(topics).toContain("Matrix Algebra");
        expect(topics).toContain("3D Vectors");
        expect(topics).toContain("Complex Numbers (Polar)");
        expect(topics).toContain("Advanced Integration");
    });

    test('New question types have unique distractors', async () => {
        // Test induction proof
        const inductionQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.ProofsInduction.getInductionProofQuestion();
        });
        
        const allAnswers = [inductionQuestion.displayAnswer, ...inductionQuestion.distractors];
        const uniqueAnswers = new Set(allAnswers);
        expect(uniqueAnswers.size).toBe(4); // Should have 4 unique answers
        
        // Test matrix algebra
        const matrixQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.MatrixAlgebra.getMatrixQuestion();
        });
        
        const matrixAnswers = [matrixQuestion.displayAnswer, ...matrixQuestion.distractors];
        const uniqueMatrixAnswers = new Set(matrixAnswers);
        expect(uniqueMatrixAnswers.size).toBe(4);
    });

    test('Proof questions contain expected LaTeX formatting', async () => {
        const inductionQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.ProofsInduction.getInductionProofQuestion();
        });
        
        // Check if tex contains LaTeX formatting (backslashes for commands)
        expect(inductionQuestion.tex).toMatch(/\\/);
        // displayAnswer may or may not have LaTeX depending on the question type
        // Just verify it exists and is non-empty
        expect(inductionQuestion.displayAnswer).toBeTruthy();
        expect(inductionQuestion.displayAnswer.length).toBeGreaterThan(0);
    });

    test('Matrix questions use proper matrix notation', async () => {
        const matrixQuestion = await page.evaluate(() => {
            return window.QuestionTemplates.MatrixAlgebra.getMatrixQuestion();
        });
        
        // Check for matrix notation in the question (tex)
        expect(matrixQuestion.tex).toMatch(/pmatrix/);
        // displayAnswer may be a simple number (for determinants) or matrix notation
        expect(matrixQuestion.displayAnswer).toBeTruthy();
    });

    test('Multiple induction proof questions generate with variety', async () => {
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 10; i++) {
                qs.push(window.QuestionTemplates.ProofsInduction.getInductionProofQuestion());
            }
            return qs;
        });
        
        // Check that we get different types of questions
        const texSet = new Set(questions.map(q => q.tex.substring(0, 50)));
        expect(texSet.size).toBeGreaterThan(1); // Should have variety
    });

    test('3D vector cross product questions generate correctly', async () => {
        // Generate multiple questions to ensure we get a cross product one
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 20; i++) {
                qs.push(window.QuestionTemplates.Vectors3D.get3DVectorQuestion());
            }
            return qs;
        });
        
        // At least one should contain cross product (×)
        const hasCrossProduct = questions.some(q => q.tex.includes('\\times'));
        expect(hasCrossProduct).toBe(true);
    });

    test('Complex polar questions contain De Moivre theorem', async () => {
        // Generate multiple questions to find De Moivre's theorem
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 20; i++) {
                qs.push(window.QuestionTemplates.ComplexPolar.getComplexPolarQuestion());
            }
            return qs;
        });
        
        // At least one should mention De Moivre
        const hasDeMoivre = questions.some(q => 
            q.instruction.toLowerCase().includes('moivre') || 
            q.explanation.toLowerCase().includes('moivre')
        );
        expect(hasDeMoivre).toBe(true);
    });

    test('Integration by parts questions are present', async () => {
        // Generate multiple advanced integration questions
        const questions = await page.evaluate(() => {
            const qs = [];
            for (let i = 0; i < 20; i++) {
                qs.push(window.QuestionTemplates.AdvancedIntegration.getAdvancedIntegrationQuestion());
            }
            return qs;
        });
        
        // At least one should mention integration by parts
        const hasByParts = questions.some(q => 
            q.instruction.toLowerCase().includes('parts') || 
            q.explanation.toLowerCase().includes('parts')
        );
        expect(hasByParts).toBe(true);
    });
});
