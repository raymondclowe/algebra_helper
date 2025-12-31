const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Test on mobile viewport
    console.log('Testing mobile viewport with answer buttons...');
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:8000/algebra-helper.html', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    // Wait for MathJax and app to initialize
    await page.waitForFunction(() => {
        return typeof window.MathJax !== 'undefined' && 
               typeof window.APP !== 'undefined' &&
               window.APP.currentQ !== null;
    }, { timeout: 15000 });
    
    // Close the name modal
    await page.waitForSelector('#name-input', { timeout: 5000 });
    await page.type('#name-input', 'TestUser');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const saveBtn = buttons.find(btn => btn.textContent.includes('Save'));
        if (saveBtn) saveBtn.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Click "I Know This" to move to learning mode
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const iKnowBtn = buttons.find(btn => btn.textContent.includes('I Know This'));
        if (iKnowBtn) iKnowBtn.click();
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot of mobile view with answer buttons
    await page.screenshot({ path: '/tmp/mobile-answer-buttons.png', fullPage: true });
    console.log('Mobile screenshot saved to /tmp/mobile-answer-buttons.png');
    
    // Test on desktop viewport (>1920px to get desktop styles)
    console.log('Testing desktop viewport with answer buttons...');
    await page.setViewport({ width: 2560, height: 1440 });
    await page.reload({ waitUntil: 'networkidle0' });
    
    await page.waitForFunction(() => {
        return typeof window.MathJax !== 'undefined' && 
               typeof window.APP !== 'undefined' &&
               window.APP.currentQ !== null;
    }, { timeout: 15000 });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Close name modal on desktop too
    await page.evaluate(() => {
        const modal = document.getElementById('name-modal');
        if (modal && !modal.classList.contains('hidden')) {
            const buttons = Array.from(document.querySelectorAll('button'));
            const saveBtn = buttons.find(btn => btn.textContent.includes('Save'));
            if (saveBtn) saveBtn.click();
        }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Click "I Know This" 
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const iKnowBtn = buttons.find(btn => btn.textContent.includes('I Know This'));
        if (iKnowBtn) iKnowBtn.click();
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({ path: '/tmp/desktop-answer-buttons.png', fullPage: false });
    console.log('Desktop screenshot saved to /tmp/desktop-answer-buttons.png');
    
    await browser.close();
})();
