const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 }); // iPhone size
  
  console.log('Navigating to app...');
  await page.goto('http://localhost:8000/algebra-helper.html', {
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
  
  // Close the name modal if it exists
  await page.evaluate(() => {
    const modal = document.getElementById('name-modal');
    if (modal && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Set level to probability range (22-23)
  await page.evaluate(() => {
    window.APP.mode = 'learning';
    window.APP.level = 22.5;
  });
  
  console.log('Generating probability questions...');
  // Generate probability questions and take screenshots
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => {
      window.UI.nextQuestion();
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for MathJax
    
    // Check if it's a probability question
    const questionInfo = await page.evaluate(() => {
      const instruction = document.getElementById('instruction-text').innerText;
      const questionDiv = document.getElementById('question-math');
      const questionText = questionDiv.innerText;
      
      const isProbability = instruction.toLowerCase().includes('probability') || 
             questionText.toLowerCase().includes('p(') ||
             questionText.toLowerCase().includes('balls') ||
             questionText.toLowerCase().includes('die') ||
             questionText.toLowerCase().includes('success') ||
             questionText.toLowerCase().includes('failure');
      
      return {
        isProbability,
        instruction
      };
    });
    
    if (questionInfo.isProbability) {
      console.log('Found:', questionInfo.instruction);
      
      await page.screenshot({
        path: '/tmp/prob_screen_' + i + '.png',
        fullPage: true
      });
      console.log('Screenshot saved: prob_screen_' + i + '.png');
      
      // Get 3 examples
      if (i >= 2) break;
    }
  }
  
  await browser.close();
  console.log('Done!');
})();
