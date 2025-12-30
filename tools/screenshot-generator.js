/**
 * Screenshot generator for question validation
 * Renders questions to HTML and captures screenshots using Puppeteer
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const config = require('./config');

class ScreenshotGenerator {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    
    /**
     * Initialize Puppeteer browser
     */
    async initialize() {
        if (this.browser) {
            return;
        }
        
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1200, height: 800 });
    }
    
    /**
     * Close Puppeteer browser
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
    
    /**
     * Generate HTML for a question
     * @param {object} question - Question object from generator
     * @param {object} metadata - Additional metadata
     * @returns {string} HTML string
     */
    generateQuestionHTML(question, metadata) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Question Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
    window.MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']] },
      svg: {fontCache: 'global'},
      startup: { typeset: false }
    };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js"></script>
</head>
<body class="bg-gray-900 text-gray-100 p-8">
    <div class="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8 shadow-2xl">
        <div class="mb-4 text-sm text-gray-400">
            <strong>Level ${metadata.level}:</strong> ${metadata.topic}
        </div>
        
        <div class="text-2xl mb-6 font-semibold text-white">
            <div id="question-text">$${question.tex}$</div>
        </div>
        
        <div class="space-y-3">
            ${question.options.map((opt, idx) => `
                <div class="p-4 bg-gray-700 rounded-lg border-2 ${idx === question.correctIndex ? 'border-green-500' : 'border-gray-600'}">
                    <div class="flex items-center">
                        <span class="font-bold mr-3 text-blue-400">${String.fromCharCode(65 + idx)})</span>
                        <span id="option-${idx}">$${opt}$</span>
                        ${idx === question.correctIndex ? '<span class="ml-auto text-green-400 font-bold">✓ CORRECT</span>' : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${question.explanation ? `
        <div class="mt-6 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-500">
            <strong class="text-blue-400">Explanation:</strong>
            <div class="mt-2 text-gray-300">${question.explanation}</div>
        </div>
        ` : ''}
    </div>
    
    <script>
        // Wait for MathJax to load and render
        window.addEventListener('load', () => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise()
                    .then(() => {
                        // Mark as ready for screenshot
                        document.body.setAttribute('data-mathjax-ready', 'true');
                    })
                    .catch((err) => {
                        console.error('MathJax error:', err);
                        document.body.setAttribute('data-mathjax-ready', 'error');
                    });
            }
        });
    </script>
</body>
</html>`;
    }
    
    /**
     * Generate screenshot for a question
     * @param {object} question - Question object
     * @param {object} metadata - Metadata (level, topic, etc.)
     * @param {string} outputPath - Path to save screenshot
     * @returns {Promise<string>} Base64 encoded image
     */
    async captureQuestionScreenshot(question, metadata, outputPath) {
        if (!this.page) {
            throw new Error('Screenshot generator not initialized');
        }
        
        // Generate HTML
        const html = this.generateQuestionHTML(question, metadata);
        
        // Load HTML into page
        await this.page.setContent(html, { waitUntil: 'networkidle0' });
        
        // Wait for MathJax to render
        await this.page.waitForFunction(
            () => document.body.getAttribute('data-mathjax-ready') === 'true',
            { timeout: 15000 }
        );
        
        // Small delay to ensure rendering is complete
        await this.page.waitForTimeout(500);
        
        // Take screenshot
        const screenshot = await this.page.screenshot({
            type: 'png',
            fullPage: false
        });
        
        // Save to file if output path provided
        if (outputPath) {
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, screenshot);
        }
        
        // Return base64 encoded
        return screenshot.toString('base64');
    }
}

module.exports = ScreenshotGenerator;
