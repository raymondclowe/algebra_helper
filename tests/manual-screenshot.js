const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });
    
    await page.goto('http://localhost:8080/algebra-helper.html', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    await page.waitForFunction(() => {
        return typeof window.MathJax !== 'undefined' && 
               typeof window.APP !== 'undefined' &&
               window.APP.currentQ !== null;
    }, { timeout: 5000 });
    
    console.log('App loaded');
    
    await page.evaluate(() => {
        return window.StorageManager.clearAllData();
    });
    
    console.log('Data cleared');
    
    await page.evaluate(async () => {
        APP.mode = 'learning';
        APP.level = 5.0;
        
        for (let i = 0; i < 10; i++) {
            await StorageManager.saveQuestion({
                question: 'Test ' + i,
                correctAnswer: 'A',
                chosenAnswer: 'A',
                allAnswers: ['A', 'B', 'C', 'D'],
                isCorrect: true,
                isDontKnow: false,
                attemptNumber: 1,
                datetime: Date.now() + i,
                topic: 'Basic Arithmetic',
                level: 5,
                timeSpent: 5
            });
        }
        
        for (let i = 10; i < 13; i++) {
            await StorageManager.saveQuestion({
                question: 'Test ' + i,
                correctAnswer: 'B',
                chosenAnswer: 'B',
                allAnswers: ['A', 'B', 'C', 'D'],
                isCorrect: true,
                isDontKnow: false,
                attemptNumber: 2,
                datetime: Date.now() + i,
                topic: 'Fractions',
                level: 5,
                timeSpent: 8
            });
        }
        
        for (let i = 13; i < 15; i++) {
            await StorageManager.saveQuestion({
                question: 'Test ' + i,
                correctAnswer: 'C',
                chosenAnswer: 'C',
                allAnswers: ['A', 'B', 'C', 'D'],
                isCorrect: true,
                isDontKnow: false,
                attemptNumber: 3,
                datetime: Date.now() + i,
                topic: 'Algebra',
                level: 6,
                timeSpent: 12
            });
        }
        
        for (let i = 15; i < 20; i++) {
            await StorageManager.saveQuestion({
                question: 'Test ' + i,
                correctAnswer: 'D',
                chosenAnswer: "I don't know",
                allAnswers: ['A', 'B', 'C', 'D'],
                isCorrect: false,
                isDontKnow: true,
                attemptNumber: 1,
                datetime: Date.now() + i,
                topic: 'Basic Arithmetic',
                level: 5,
                timeSpent: 3
            });
        }
        
        for (let i = 20; i < 23; i++) {
            await StorageManager.saveQuestion({
                question: 'Test ' + i,
                correctAnswer: 'A',
                chosenAnswer: 'wrong',
                allAnswers: ['A', 'B', 'C', 'D'],
                isCorrect: false,
                isDontKnow: false,
                attemptNumber: 2,
                datetime: Date.now() + i,
                topic: 'Quadratics',
                level: 7,
                timeSpent: 10
            });
        }
    });
    
    console.log('Test data added');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await page.evaluate(() => {
        window.StatsModal.show();
    });
    
    console.log('Stats modal opened');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({
        path: '/tmp/stats-modal-with-attempt-tracking.png',
        fullPage: true
    });
    
    console.log('Screenshot saved');
    
    await browser.close();
})();
