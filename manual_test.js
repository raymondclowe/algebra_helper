const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    await page.goto('http://localhost:8000/algebra-helper.html', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    console.log('Page loaded successfully');
    
    // Complete calibration to get to learning mode
    await page.evaluate(() => {
        window.APP.mode = 'learning';
        window.APP.level = 5;
    });
    
    console.log('Switched to learning mode at level 5');
    
    // Generate multiple questions and track them
    const result = await page.evaluate(() => {
        const questions = [];
        const signatures = [];
        
        for (let i = 0; i < 20; i++) {
            const question = window.Generator.getQuestion(5);
            const signature = window.Generator.generateQuestionSignature(question);
            
            questions.push({
                tex: question.tex,
                answer: question.displayAnswer,
                signature: signature
            });
            signatures.push(signature);
            
            // Simulate answering correctly (makes it frequent)
            window.Generator.recordQuestionAsked(question, true);
        }
        
        // Count unique signatures
        const uniqueSignatures = new Set(signatures);
        
        return {
            totalQuestions: questions.length,
            uniqueQuestions: uniqueSignatures.size,
            sessionLogSize: window.APP.sessionQuestions.size,
            sessionQuestionCount: window.APP.sessionQuestionCount,
            sampleQuestions: questions.slice(0, 5).map(q => ({
                tex: q.tex.substring(0, 30) + '...',
                signature: q.signature.substring(0, 40) + '...'
            }))
        };
    });
    
    console.log('\n=== Session Question Log Test Results ===');
    console.log(`Total questions generated: ${result.totalQuestions}`);
    console.log(`Unique questions: ${result.uniqueQuestions}`);
    console.log(`Session log entries: ${result.sessionLogSize}`);
    console.log(`Session question count: ${result.sessionQuestionCount}`);
    console.log(`\nSample questions (first 5):`);
    result.sampleQuestions.forEach((q, i) => {
        console.log(`  ${i+1}. ${q.tex}`);
        console.log(`     Signature: ${q.signature}`);
    });
    
    // Test that frequent questions are avoided
    const avoidanceTest = await page.evaluate(() => {
        // Mark a specific question as very frequent
        const testSignature = '2x = 10_x=5';
        window.APP.sessionQuestions.set(testSignature, {
            count: 10,
            correctCount: 10,
            incorrectCount: 0,
            lastAsked: 5
        });
        
        // Generate 30 more questions
        const newSignatures = [];
        for (let i = 0; i < 30; i++) {
            const question = window.Generator.getUniqueQuestion(5);
            const signature = window.Generator.generateQuestionSignature(question);
            newSignatures.push(signature);
        }
        
        // Count how many times the frequent signature appears
        const frequentCount = newSignatures.filter(s => s === testSignature).length;
        
        return {
            newQuestionsGenerated: newSignatures.length,
            frequentQuestionAppearances: frequentCount,
            isAvoided: frequentCount <= 3 // Should appear rarely or not at all
        };
    });
    
    console.log('\n=== Frequent Question Avoidance Test ===');
    console.log(`New questions generated: ${avoidanceTest.newQuestionsGenerated}`);
    console.log(`Frequent question appearances: ${avoidanceTest.frequentQuestionAppearances}`);
    console.log(`Successfully avoided: ${avoidanceTest.isAvoided ? 'YES ✓' : 'NO ✗'}`);
    
    // Test recently incorrect questions are allowed
    const incorrectTest = await page.evaluate(() => {
        // Mark a question as recently incorrect
        const recentIncorrectSig = '3x + 5 = 14_x=3';
        window.APP.sessionQuestions.set(recentIncorrectSig, {
            count: 5,
            correctCount: 2,
            incorrectCount: 3,
            lastAsked: window.APP.sessionQuestionCount - 2 // 2 questions ago
        });
        
        const isRecent = window.Generator.isRecentlyIncorrect(recentIncorrectSig);
        const isFrequent = window.Generator.isFrequentQuestion(recentIncorrectSig);
        
        return {
            isRecentlyIncorrect: isRecent,
            isFrequentlyCorrect: isFrequent,
            shouldBeAllowedToRepeat: isRecent && !isFrequent
        };
    });
    
    console.log('\n=== Recently Incorrect Question Test ===');
    console.log(`Question marked as recently incorrect: ${incorrectTest.isRecentlyIncorrect ? 'YES' : 'NO'}`);
    console.log(`Question is frequently correct: ${incorrectTest.isFrequentlyCorrect ? 'YES' : 'NO'}`);
    console.log(`Should be allowed to repeat: ${incorrectTest.shouldBeAllowedToRepeat ? 'YES ✓' : 'NO ✗'}`);
    
    console.log('\n=== All Manual Tests Completed ===\n');
    
    await browser.close();
})();
