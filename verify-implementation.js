const puppeteer = require('puppeteer');

async function verifyImplementation() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 1600 });
    
    await page.goto('http://localhost:8000/algebra-helper.html', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    await page.waitForFunction(
        () => window.MathJax && window.MathJax.typesetPromise && window.APP,
        { timeout: 15000 }
    );
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Switch to drill mode
    await page.evaluate(() => {
        window.APP.mode = 'drill';
        window.UI.nextQuestion();
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Screenshot 1: Initial state with answer options');
    await page.screenshot({ 
        path: '/tmp/verify1-initial.png',
        fullPage: true
    });

    // Click wrong answer
    const wrongAnswerResult = await page.evaluate(() => {
        const buttons = document.getElementById('mc-options').querySelectorAll('button');
        for (let btn of buttons) {
            if (btn.dataset.correct === 'false') {
                btn.click();
                return true;
            }
        }
        return false;
    });

    console.log('Wrong answer clicked:', wrongAnswerResult);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get detailed info
    const info = await page.evaluate(() => {
        const box = document.getElementById('explanation-box');
        const text = document.getElementById('explanation-text');
        const nextBtn = document.getElementById('next-btn');
        const mainArea = document.querySelector('.p-8.min-h-\\[200px\\]');
        
        return {
            explanationBox: {
                hidden: box.classList.contains('hidden'),
                innerHTML: text.innerHTML,
                textContent: text.textContent,
                display: window.getComputedStyle(box).display,
                visibility: window.getComputedStyle(box).visibility
            },
            nextButton: {
                invisible: nextBtn.classList.contains('invisible'),
                display: window.getComputedStyle(nextBtn).display,
                visibility: window.getComputedStyle(nextBtn).visibility
            },
            mainAreaOverflow: window.getComputedStyle(mainArea).overflow,
            correctAnswerHighlighted: Array.from(document.getElementById('mc-options').querySelectorAll('button'))
                .some(btn => btn.dataset.correct === 'true' && btn.className.includes('bg-green-600'))
        };
    });

    console.log('State after wrong answer:', JSON.stringify(info, null, 2));

    console.log('Screenshot 2: After wrong answer');
    await page.screenshot({ 
        path: '/tmp/verify2-wrong-answer.png',
        fullPage: true
    });

    await browser.close();
}

verifyImplementation().catch(console.error);
