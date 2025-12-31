const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Test on mobile viewport
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
    
    // Wait a bit for content to render
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({ path: '/tmp/mobile-view.png', fullPage: true });
    console.log('Mobile screenshot saved to /tmp/mobile-view.png');
    
    // Test on desktop viewport
    await page.setViewport({ width: 1920, height: 1080 });
    await page.reload({ waitUntil: 'networkidle0' });
    
    await page.waitForFunction(() => {
        return typeof window.MathJax !== 'undefined' && 
               typeof window.APP !== 'undefined' &&
               window.APP.currentQ !== null;
    }, { timeout: 15000 });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({ path: '/tmp/desktop-view.png', fullPage: false });
    console.log('Desktop screenshot saved to /tmp/desktop-view.png');
    
    await browser.close();
})();
