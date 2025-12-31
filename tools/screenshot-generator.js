/**
 * Screenshot generator for question validation
 * Uses the actual algebra-helper app with URL parameters for accurate rendering
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
        await this.page.setViewport({ width: 1200, height: 900 });
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
     * Navigate to the app with specific level and question type
     * @param {number} level - The difficulty level (1-34)
     * @param {number|null} questionType - The question type within the level (optional)
     * @returns {Promise<void>}
     */
    async navigateToQuestion(level, questionType = null) {
        if (!this.page) {
            throw new Error('Screenshot generator not initialized');
        }
        
        // Build URL with test parameters
        let url = config.appUrl;
        url += `?testLevel=${level}`;
        if (questionType !== null) {
            url += `&testType=${questionType}`;
        }
        
        // Navigate to the app
        await this.page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for MathJax to be ready and scripts to load
        await this.page.waitForFunction(
            () => window.MathJax && window.MathJax.typesetPromise && window.Generator,
            { timeout: 15000 }
        );
        
        // Wait for the question to be generated and rendered
        await this.page.waitForFunction(
            () => {
                const questionMath = document.getElementById('question-math');
                return questionMath && questionMath.textContent.trim().length > 0;
            },
            { timeout: 10000 }
        );
        
        // Wait for MathJax to finish typesetting
        await this.page.evaluate(async () => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                await window.MathJax.typesetPromise();
            }
        });
        
        // Additional wait for rendering to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    /**
     * Extract question data from the current page
     * @returns {Promise<object>} Question data
     */
    async extractQuestionData() {
        return await this.page.evaluate(() => {
            const currentQ = window.APP.currentQ;
            if (!currentQ) {
                return null;
            }
            
            // Get the rendered question text
            const questionMath = document.getElementById('question-math');
            const instruction = document.getElementById('instruction-text');
            
            // Get the answer buttons
            const buttons = document.querySelectorAll('#mc-options button');
            const options = Array.from(buttons).map(btn => btn.textContent.trim());
            
            // Find correct answer index
            let correctIndex = -1;
            buttons.forEach((btn, idx) => {
                if (btn.getAttribute('data-correct') === 'true') {
                    correctIndex = idx;
                }
            });
            
            return {
                tex: currentQ.tex,
                instruction: instruction ? instruction.textContent : '',
                displayAnswer: currentQ.displayAnswer,
                distractors: currentQ.distractors,
                explanation: currentQ.explanation || '',
                options: options,
                correctIndex: correctIndex,
                renderedQuestion: questionMath ? questionMath.innerHTML : '',
                level: window.FORCED_TEST_LEVEL || window.APP.level,
                questionType: window.FORCED_QUESTION_TYPE || 'random'
            };
        });
    }
    
    /**
     * Capture screenshot of the question area
     * @param {string} outputPath - Path to save the screenshot
     * @returns {Promise<string>} Base64 encoded image
     */
    async captureScreenshot(outputPath) {
        if (!this.page) {
            throw new Error('Screenshot generator not initialized');
        }
        
        // Get the main question container
        const container = await this.page.$('#card');
        
        let screenshot;
        if (container) {
            // Screenshot just the question card
            screenshot = await container.screenshot({
                type: 'png'
            });
        } else {
            // Fallback to full page
            screenshot = await this.page.screenshot({
                type: 'png',
                fullPage: false
            });
        }
        
        // Save to file if output path provided
        if (outputPath) {
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, screenshot);
        }
        
        return screenshot.toString('base64');
    }
    
    /**
     * Generate screenshot for a specific level and question type
     * This is the main method used by the validator
     * @param {number} level - Difficulty level
     * @param {number|null} questionType - Question type within level
     * @param {string} outputPath - Path to save screenshot
     * @returns {Promise<{base64Image: string, questionData: object}>}
     */
    async captureQuestionForLevel(level, questionType, outputPath) {
        await this.navigateToQuestion(level, questionType);
        
        const questionData = await this.extractQuestionData();
        const base64Image = await this.captureScreenshot(outputPath);
        
        return {
            base64Image,
            questionData
        };
    }
}

module.exports = ScreenshotGenerator;
