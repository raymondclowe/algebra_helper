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
  
  await page.waitForFunction(
    () => window.MathJax && window.MathJax.typesetPromise,
    { timeout: 10000 }
  );
  
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
  
  // Set level to advanced probability range (23-24)
  await page.evaluate(() => {
    window.APP.mode = 'learning';
    window.APP.level = 23.5;
  });
  
  console.log('Generating advanced probability questions...');
  
  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => {
      window.UI.nextQuestion();
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const questionInfo = await page.evaluate(() => {
      const instruction = document.getElementById('instruction-text').innerText;
      const questionDiv = document.getElementById('question-math');
      const questionText = questionDiv.innerText;
      
      const isAdvancedProb = instruction.toLowerCase().includes('independent') || 
             instruction.toLowerCase().includes('expected') ||
             instruction.toLowerCase().includes('b|a') ||
             questionText.toLowerCase().includes('die') ||
             questionText.toLowerCase().includes('independent');
      
      return {
        isAdvancedProb,
        instruction,
        questionText: questionText.substring(0, 100)
      };
    });
    
    if (questionInfo.isAdvancedProb) {
      console.log('Found:', questionInfo.instruction);
      console.log('Text:', questionInfo.questionText);
      
      await page.screenshot({
        path: '/tmp/adv_prob_' + i + '.png',
        fullPage: true
      });
      console.log('Screenshot saved: adv_prob_' + i + '.png\n');
      
      // Get 3 examples
      if (i >= 2) break;
    }
  }
  
  await browser.close();
  console.log('Done!');
})();
