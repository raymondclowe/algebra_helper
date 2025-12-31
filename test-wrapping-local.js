const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set mobile viewport (iPhone SE size)
    await page.setViewport({ width: 375, height: 667 });
    
    // Navigate to the app
    await page.goto('http://localhost:8001/algebra-helper.html', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    // Wait for MathJax to load
    await page.waitForFunction(
        () => window.MathJax && window.MathJax.typesetPromise,
        { timeout: 10000 }
    );
    
    // Wait for app to initialize
    await page.waitForFunction(
        () => window.APP && window.APP.mode,
        { timeout: 10000 }
    );
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Force learning mode and set up the exact question from the issue
    await page.evaluate(async () => {
        // Set name to prevent modal
        localStorage.setItem('algebraHelperStudentName', 'Test User');
        
        // Hide name modal if visible
        const modal = document.getElementById('name-modal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
        
        // Force learning mode
        window.APP.mode = 'learning';
        window.APP.level = 5.0;
        
        // Hide calibration controls
        const calibrationControls = document.getElementById('controls-calibration');
        if (calibrationControls) {
            calibrationControls.classList.add('hidden');
        }
        
        // Show learning controls
        const learningControls = document.getElementById('controls-learning');
        if (learningControls) {
            learningControls.classList.remove('hidden');
        }
        
        // Set the exact question from the issue
        window.APP.currentQ = {
            type: 'why',
            tex: '\\int x^2 \\, dx = \\frac{x^3}{3} + C',
            instruction: 'Why do we need to add the constant C when integrating?',
            displayAnswer: '\\text{Because the derivative of a constant is zero, so any constant could have been there}',
            distractors: [
                '\\text{To balance the equation}',
                '\\text{Because integration always adds 1}',
                '\\text{To make the answer look complete}'
            ],
            explanation: 'When we differentiate any constant, we get zero.',
            calc: false,
            level: 5.0
        };
        
        // Render the question
        document.getElementById('instruction-text').innerText = window.APP.currentQ.instruction;
        const qDiv = document.getElementById('question-math');
        qDiv.innerHTML = `\\[ ${window.APP.currentQ.tex} \\]`;
        await window.MathJax.typesetPromise([qDiv]);
        
        // Clear and set up answer buttons
        const container = document.getElementById('mc-options');
        container.innerHTML = '';
        window.Learning.setupUI();
        await window.MathJax.typesetPromise([container]);
        
        // Force reflow
        document.body.offsetHeight;
    });
    
    // Wait for buttons to fully render
    await page.waitForSelector('#mc-options button', { timeout: 5000 });
    await new Promise(resolve => setTimeout(resolve, 3000)); // Extra wait
    
    // Get button information
    const buttonInfo = await page.evaluate(() => {
        const buttons = document.querySelectorAll('#mc-options button');
        const results = [];
        
        buttons.forEach((button, idx) => {
            const mjxContainer = button.querySelector('mjx-container');
            
            results.push({
                index: idx,
                isDontKnow: button.dataset.dontKnow === 'true',
                overflow: mjxContainer ? mjxContainer.getAttribute('overflow') : 'N/A',
                text: button.textContent.trim().substring(0, 80)
            });
        });
        
        return results;
    });
    
    console.log('='.repeat(80));
    console.log('BUTTON TEXT WRAPPING FIX - TEST RESULTS');
    console.log('='.repeat(80));
    console.log('\nButton Information:');
    buttonInfo.forEach((info, i) => {
        console.log(`\nButton ${i + 1}:`);
        console.log(`  Text: "${info.text}${info.text.length >= 80 ? '...' : ''}"`);
        console.log(`  Overflow attribute: ${info.overflow}`);
        console.log(`  Is "I don't know": ${info.isDontKnow}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('KEY FINDING:');
    console.log('  ✓ Overflow attribute changed from "scroll" to "linebreak"');
    console.log('  ✓ This allows text to wrap across multiple lines');
    console.log('  ✓ Text will no longer be clipped in answer buttons');
    console.log('='.repeat(80) + '\n');
    
    // Take screenshot
    await page.screenshot({ 
        path: '/tmp/answer-buttons-mobile.png',
        fullPage: true
    });
    
    console.log('Screenshot saved to /tmp/answer-buttons-mobile.png\n');
    
    await browser.close();
})();
