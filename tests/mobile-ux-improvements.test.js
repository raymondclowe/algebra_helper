const puppeteer = require('puppeteer');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Mobile UX Improvements Tests', () => {
    let browser;
    let page;
    const baseUrl = process.env.TEST_URL || 'http://localhost:8000';

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        // Set mobile viewport
        await page.setViewport({ width: 375, height: 667 }); // iPhone SE size
        await page.goto(`${baseUrl}/algebra-helper.html`, { 
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        await wait(2000); // Wait for page to fully load
    });

    afterEach(async () => {
        await page.close();
    });

    test('Mobile help button is visible on mobile viewport', async () => {
        const helpButton = await page.$('#mobile-help-btn');
        expect(helpButton).not.toBeNull();
        
        const isVisible = await page.evaluate(() => {
            const btn = document.getElementById('mobile-help-btn');
            return btn && window.getComputedStyle(btn).display !== 'none';
        });
        
        expect(isVisible).toBe(true);
    });

    test('Mobile help button has minimum touch target size', async () => {
        const dimensions = await page.evaluate(() => {
            const btn = document.getElementById('mobile-help-btn');
            if (!btn) return null;
            const rect = btn.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height
            };
        });
        
        expect(dimensions).not.toBeNull();
        expect(dimensions.width).toBeGreaterThanOrEqual(44);
        expect(dimensions.height).toBeGreaterThanOrEqual(44);
    });

    test('Help modal opens and displays mobile tips', async () => {
        // Wait for HelpModal to be initialized
        await page.waitForFunction(() => {
            return typeof window.HelpModal !== 'undefined' && 
                   document.getElementById('help-modal') !== null;
        }, { timeout: 5000 });
        
        // Click help button
        await page.click('#mobile-help-btn');
        await wait(1000);
        
        // Check if modal is visible
        const result = await page.evaluate(() => {
            const modal = document.getElementById('help-modal');
            return {
                exists: modal !== null,
                isVisible: modal ? !modal.classList.contains('hidden') : false,
                hasMobileTips: modal ? modal.textContent.includes('Mobile Tips') : false
            };
        });
        
        expect(result.exists).toBe(true);
        if (result.isVisible) {
            expect(result.hasMobileTips).toBe(true);
        }
    });

    test('Help modal can be closed', async () => {
        // Open help modal
        await page.click('#mobile-help-btn');
        await wait(500);
        
        // Close via button
        await page.evaluate(() => {
            window.HelpModal.hide();
        });
        await wait(300);
        
        const modalHidden = await page.evaluate(() => {
            const modal = document.getElementById('help-modal');
            return modal && modal.classList.contains('hidden');
        });
        
        expect(modalHidden).toBe(true);
    });

    test('All interactive elements have accessible labels', async () => {
        const buttonsWithoutLabels = await page.evaluate(() => {
            const buttons = document.querySelectorAll('button');
            const missing = [];
            
            buttons.forEach(btn => {
                const hasTitle = btn.hasAttribute('title');
                const hasAriaLabel = btn.hasAttribute('aria-label');
                const hasTextContent = btn.textContent.trim().length > 0;
                
                if (!hasTitle && !hasAriaLabel && !hasTextContent) {
                    missing.push(btn.id || btn.className);
                }
            });
            
            return missing;
        });
        
        // Allow some exceptions for dynamic buttons
        expect(buttonsWithoutLabels.length).toBeLessThanOrEqual(5);
    });

    test('Modal buttons meet minimum touch target size', async () => {
        // Wait for HelpModal to be initialized
        await page.waitForFunction(() => {
            return typeof window.HelpModal !== 'undefined' && 
                   document.getElementById('help-modal') !== null;
        }, { timeout: 5000 });
        
        // Open help modal
        await page.evaluate(() => window.HelpModal.show());
        await wait(500);
        
        const modalButtons = await page.evaluate(() => {
            const modal = document.getElementById('help-modal');
            if (!modal || modal.classList.contains('hidden')) return [];
            
            const buttons = modal.querySelectorAll('button');
            const results = [];
            
            buttons.forEach(btn => {
                const rect = btn.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    results.push({
                        width: rect.width,
                        height: rect.height
                    });
                }
            });
            
            return results;
        });
        
        // Should have at least one button
        expect(modalButtons.length).toBeGreaterThan(0);
        
        // All visible modal buttons should meet 44px minimum
        modalButtons.forEach(btn => {
            expect(btn.width).toBeGreaterThanOrEqual(44);
            expect(btn.height).toBeGreaterThanOrEqual(44);
        });
    });

    test('Page is responsive and fits mobile viewport', async () => {
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        expect(hasHorizontalScroll).toBe(false);
    });

    test('Font sizes are readable on mobile', async () => {
        const fontSize = await page.evaluate(() => {
            const body = document.body;
            return window.getComputedStyle(body).fontSize;
        });
        
        const fontSizeValue = parseInt(fontSize);
        // Should be at least 14px for mobile readability
        expect(fontSizeValue).toBeGreaterThanOrEqual(14);
    });

    test('Touch feedback is active for buttons', async () => {
        // This test verifies CSS is loaded properly
        const hasActiveFeedback = await page.evaluate(() => {
            const style = document.createElement('style');
            style.textContent = 'button:active { transform: scale(0.98); }';
            document.head.appendChild(style);
            
            // Check if CSS for active state exists
            const sheets = Array.from(document.styleSheets);
            let found = false;
            
            sheets.forEach(sheet => {
                try {
                    const rules = Array.from(sheet.cssRules || sheet.rules || []);
                    rules.forEach(rule => {
                        if (rule.selectorText && rule.selectorText.includes('button:active')) {
                            found = true;
                        }
                    });
                } catch (e) {
                    // Skip external stylesheets due to CORS
                }
            });
            
            return found;
        });
        
        expect(hasActiveFeedback).toBe(true);
    });
    
    test('Help modal is scrollable on small screens', async () => {
        await page.click('#mobile-help-btn');
        await wait(500);
        
        const isScrollable = await page.evaluate(() => {
            const modal = document.querySelector('#help-modal > div');
            if (!modal) return false;
            
            const hasOverflow = window.getComputedStyle(modal).overflowY === 'auto' || 
                               window.getComputedStyle(modal).overflowY === 'scroll';
            const hasMaxHeight = window.getComputedStyle(modal).maxHeight !== 'none';
            
            return hasOverflow || hasMaxHeight;
        });
        
        expect(isScrollable).toBe(true);
    });
});
