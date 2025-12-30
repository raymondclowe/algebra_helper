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
  console.log('Waiting for MathJax...');
  await page.waitForFunction(
    () => window.MathJax && window.MathJax.typesetPromise,
    { timeout: 10000 }
  );
  
  // Wait for app to initialize
  console.log('Waiting for app...');
  await page.waitForFunction(
    () => window.APP && window.APP.mode,
    { timeout: 10000 }
  );
  
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
      const questionHTML = questionDiv.innerHTML;
      const questionText = questionDiv.innerText;
      
      const isProbability = instruction.toLowerCase().includes('probability') || 
             questionText.toLowerCase().includes('p(') ||
             questionText.toLowerCase().includes('balls') ||
             questionText.toLowerCase().includes('die') ||
             questionText.toLowerCase().includes('success') ||
             questionText.toLowerCase().includes('failure');
      
      // Count display blocks (line breaks)
      const displayBlocks = questionDiv.querySelectorAll('mjx-container[display="true"]').length;
      
      return {
        isProbability,
        instruction,
        questionText: questionText.substring(0, 200),
        questionHTML: questionHTML.substring(0, 500),
        displayBlocks
      };
    });
    
    if (questionInfo.isProbability) {
      console.log('\n--- Probability Question Found ---');
      console.log('Instruction:', questionInfo.instruction);
      console.log('Question text:', questionInfo.questionText);
      console.log('Display blocks (lines):', questionInfo.displayBlocks);
      console.log('HTML snippet:', questionInfo.questionHTML);
      
      await page.screenshot({
        path: '/tmp/probability_question_' + i + '.png',
        fullPage: false
      });
      console.log('Screenshot saved: probability_question_' + i + '.png');
      
      // Get a few more examples
      if (i >= 3) break;
    }
  }
  
  await browser.close();
  console.log('\nDone!');
})();
