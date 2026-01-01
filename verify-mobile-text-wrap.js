const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'mobile-text-wrap-screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function captureTextWrappingExamples() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set mobile viewport (iPhone SE size - common small mobile device)
    await page.setViewport({ width: 375, height: 667 });
    
    // Navigate to the app
    const BASE_URL = 'http://localhost:8000';
    await page.goto(`${BASE_URL}/algebra-helper.html`, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    console.log('✓ Page loaded');
    
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
    
    console.log('✓ App initialized');
    
    // Example 1: Long text answer with multiple words (why question)
    console.log('\nCapturing Example 1: Long text answer wrapping...');
    await page.evaluate(async () => {
        window.APP.mode = 'learning';
        window.APP.level = 20.0;
        
        window.APP.currentQ = {
            type: 'why',
            tex: '\\int x^2 \\, dx = \\frac{x^3}{3} + C',
            instruction: 'Why do we need to add the constant C when integrating?',
            displayAnswer: '\\text{Because the derivative of a constant is zero, so any constant could have been there originally}',
            distractors: [
                '\\text{To make the equation balance properly}',
                '\\text{Because integration always adds exactly one}',
                '\\text{To make the final answer look more complete and professional}'
            ],
            explanation: 'When we differentiate any constant, we get zero. Therefore, the original function could have had any constant term.',
            calc: false,
            level: 20.0
        };
        
        window.Learning.setupUI();
        await window.MathJax.typesetPromise();
    });
    
    await page.waitForSelector('#mc-options button', { timeout: 5000 });
    await wait(1500); // Extra wait for rendering
    
    await page.screenshot({
        path: path.join(screenshotsDir, '01-long-text-wrapping.png'),
        fullPage: false
    });
    console.log('✓ Example 1 captured: 01-long-text-wrapping.png');
    
    // Example 2: Very long single-line text answer
    console.log('\nCapturing Example 2: Very long text answer...');
    await page.evaluate(async () => {
        window.APP.currentQ = {
            type: 'why',
            tex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
            instruction: 'Why is this limit equal to 1?',
            displayAnswer: '\\text{The sine function can be approximated by its Taylor series expansion around zero}',
            distractors: [
                '\\text{Because sine and x are the same when x is very small}',
                '\\text{This is a fundamental trigonometric identity that must be memorized}',
                '\\text{The limit follows from L\'Hopital\'s rule and the derivative of sine}'
            ],
            explanation: 'Using the Taylor series: sin(x) ≈ x - x³/6 + ... so sin(x)/x ≈ 1 - x²/6 + ..., which approaches 1 as x → 0.',
            calc: false,
            level: 20.0
        };
        
        window.Learning.setupUI();
        await window.MathJax.typesetPromise();
    });
    
    await wait(1500);
    
    await page.screenshot({
        path: path.join(screenshotsDir, '02-very-long-text.png'),
        fullPage: false
    });
    console.log('✓ Example 2 captured: 02-very-long-text.png');
    
    // Example 3: Multiple answers with varying lengths showing proper wrapping
    console.log('\nCapturing Example 3: Mixed length answers...');
    await page.evaluate(async () => {
        window.APP.currentQ = {
            type: 'why',
            tex: 'f(x) = x^2 + 5x + 6',
            instruction: 'What is the best method to solve this quadratic equation?',
            displayAnswer: '\\text{Factor into (x+2)(x+3) and solve}',
            distractors: [
                '\\text{Use the quadratic formula with a=1, b=5, c=6}',
                '\\text{Complete the square by adding and subtracting the appropriate constant}',
                '\\text{Graph the function and find x-intercepts}'
            ],
            explanation: 'Since the quadratic factorizes nicely, factoring is the most efficient method.',
            calc: false,
            level: 10.0
        };
        
        window.Learning.setupUI();
        await window.MathJax.typesetPromise();
    });
    
    await wait(1500);
    
    await page.screenshot({
        path: path.join(screenshotsDir, '03-mixed-length-answers.png'),
        fullPage: false
    });
    console.log('✓ Example 3 captured: 03-mixed-length-answers.png');
    
    // Also capture CSS styles being applied
    const stylesInfo = await page.evaluate(() => {
        const buttons = document.querySelectorAll('#mc-options button');
        const results = [];
        
        buttons.forEach(btn => {
            if (btn.dataset.dontKnow === 'true') return;
            
            const computed = window.getComputedStyle(btn);
            const plainTextSpan = btn.querySelector('.plain-text-answer');
            
            results.push({
                textContent: btn.textContent.substring(0, 50),
                whiteSpace: computed.whiteSpace,
                wordBreak: computed.wordBreak,
                overflowWrap: computed.overflowWrap,
                display: computed.display,
                minHeight: computed.minHeight,
                hasPlainTextSpan: !!plainTextSpan
            });
        });
        
        return results;
    });
    
    console.log('\n=== CSS Styles Applied ===');
    stylesInfo.forEach((style, idx) => {
        console.log(`\nButton ${idx + 1}:`);
        console.log(`  Text: "${style.textContent}..."`);
        console.log(`  white-space: ${style.whiteSpace}`);
        console.log(`  word-break: ${style.wordBreak}`);
        console.log(`  overflow-wrap: ${style.overflowWrap}`);
        console.log(`  display: ${style.display}`);
        console.log(`  min-height: ${style.minHeight}`);
        console.log(`  Has plain text span: ${style.hasPlainTextSpan}`);
    });
    
    await browser.close();
    
    console.log('\n✅ All screenshots captured successfully!');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);
    console.log('\n📋 Summary:');
    console.log('  - 01-long-text-wrapping.png: Long text answer demonstrating proper wrapping');
    console.log('  - 02-very-long-text.png: Very long text showing word breaking');
    console.log('  - 03-mixed-length-answers.png: Multiple answers of varying lengths');
}

// Run the script
console.log('🔍 Starting mobile text wrap verification...\n');
captureTextWrappingExamples().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
