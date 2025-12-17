const puppeteer = require('puppeteer');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Student Name Personalization Tests', () => {
    let browser;
    let page;
    const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';

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
        
        // Clear localStorage before each test
        await page.evaluateOnNewDocument(() => {
            localStorage.clear();
        });
        
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for scripts to initialize
        await wait(1000);
    });

    afterEach(async () => {
        await page.close();
    });

    test('Name modal appears on first visit', async () => {
        // Wait a bit for the delayed prompt
        await wait(1000);
        
        // Check if name modal is visible
        const isVisible = await page.evaluate(() => {
            const modal = document.getElementById('name-modal');
            return modal && !modal.classList.contains('hidden');
        });
        
        expect(isVisible).toBe(true);
    });

    test('Name input has correct placeholder "John"', async () => {
        // Wait for modal to appear
        await wait(1000);
        
        const placeholder = await page.evaluate(() => {
            const input = document.getElementById('name-input');
            return input ? input.placeholder : null;
        });
        
        expect(placeholder).toBe('John');
    });

    test('Name input does NOT have placeholder "Gerald"', async () => {
        // Wait for modal to appear
        await wait(1000);
        
        const placeholder = await page.evaluate(() => {
            const input = document.getElementById('name-input');
            return input ? input.placeholder : null;
        });
        
        expect(placeholder).not.toBe('Gerald');
    });

    test('Can save student name', async () => {
        // Wait for modal to appear
        await wait(1000);
        
        // Type name in input
        await page.type('#name-input', 'Raymond');
        
        // Click save button
        await page.evaluate(() => {
            window.NameModal.save();
        });
        
        // Wait for save to complete
        await wait(500);
        
        // Check if name was saved to localStorage
        const savedName = await page.evaluate(() => {
            return window.StorageManager.getStudentName();
        });
        
        expect(savedName).toBe('Raymond');
    });

    test('Student name appears in APP state after saving', async () => {
        // Wait for modal to appear
        await wait(1000);
        
        // Type name in input
        await page.type('#name-input', 'Christopher');
        
        // Click save button
        await page.evaluate(() => {
            window.NameModal.save();
        });
        
        // Wait for save to complete
        await wait(500);
        
        // Check APP state
        const appName = await page.evaluate(() => {
            return window.APP.studentName;
        });
        
        expect(appName).toBe('Christopher');
    });

    test('Modal does not appear on subsequent visits if name is set', async () => {
        // First, close the page and create a new one with localStorage preset
        await page.close();
        
        // Create new page with preset localStorage
        page = await browser.newPage();
        
        // Set localStorage before navigation
        await page.evaluateOnNewDocument(() => {
            localStorage.setItem('algebraHelperStudentName', 'Willie');
        });
        
        // Navigate to the page
        await page.goto(`${BASE_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for initialization
        await wait(1500);
        
        // Check if name modal is hidden
        const isHidden = await page.evaluate(() => {
            const modal = document.getElementById('name-modal');
            return modal && modal.classList.contains('hidden');
        });
        
        expect(isHidden).toBe(true);
    });

    test('Name can be changed through settings modal', async () => {
        // Set initial name
        await wait(1000);
        await page.type('#name-input', 'Edwards');
        await page.evaluate(() => window.NameModal.save());
        await wait(500);
        
        // Open settings modal
        await page.evaluate(() => window.SettingsModal.show());
        await wait(300);
        
        // Check that current name is displayed
        const displayedName = await page.evaluate(() => {
            const display = document.getElementById('current-name-display');
            return display ? display.innerText : null;
        });
        
        expect(displayedName).toBe('Edwards');
        
        // Click change button to open name modal
        await page.evaluate(() => window.NameModal.show(false));
        await wait(300);
        
        // Clear and type new name
        await page.evaluate(() => {
            document.getElementById('name-input').value = '';
        });
        await page.type('#name-input', 'Willie');
        
        // Save the new name
        await page.evaluate(() => window.NameModal.save());
        await wait(500);
        
        // Verify the name was updated
        const updatedName = await page.evaluate(() => {
            return window.StorageManager.getStudentName();
        });
        
        expect(updatedName).toBe('Willie');
    });

    test('Name appears in personalized feedback messages', async () => {
        // Set a name
        await page.evaluate(() => {
            window.StorageManager.setStudentName('John');
            window.APP.studentName = 'John';
        });
        
        // Wait for modal to close
        await wait(1000);
        
        // Close name modal if open
        await page.evaluate(() => {
            const modal = document.getElementById('name-modal');
            if (modal && !modal.classList.contains('hidden')) {
                window.NameModal.close();
            }
        });
        
        await wait(500);
        
        // Simulate getting several correct answers to trigger feedback
        // We'll check if the gamification module can produce personalized messages
        let foundPersonalizedMessage = false;
        
        for (let i = 0; i < 20; i++) {
            const message = await page.evaluate(() => {
                // Trigger a toast message
                window.Gamification.showToast(false);
                
                // Wait a bit and check for toast with name
                const toasts = document.querySelectorAll('.toast');
                const lastToast = toasts[toasts.length - 1];
                return lastToast ? lastToast.innerText : '';
            });
            
            if (message.includes('John')) {
                foundPersonalizedMessage = true;
                break;
            }
            
            await wait(200);
        }
        
        // Since personalization is probabilistic (30-40% chance), 
        // with 20 attempts we should see at least one personalized message
        expect(foundPersonalizedMessage).toBe(true);
    });

    test('Empty name cannot be saved', async () => {
        // Wait for modal to appear
        await wait(1000);
        
        // Try to save without entering a name
        await page.evaluate(() => {
            window.NameModal.save();
        });
        
        await wait(500);
        
        // Modal should still be visible
        const isVisible = await page.evaluate(() => {
            const modal = document.getElementById('name-modal');
            return modal && !modal.classList.contains('hidden');
        });
        
        expect(isVisible).toBe(true);
        
        // Name should not be saved
        const savedName = await page.evaluate(() => {
            return window.StorageManager.getStudentName();
        });
        
        expect(savedName).toBe('');
    });

    test('Name is trimmed when saved', async () => {
        // Wait for modal to appear
        await wait(1000);
        
        // Type name with spaces
        await page.type('#name-input', '  Raymond  ');
        
        // Save
        await page.evaluate(() => {
            window.NameModal.save();
        });
        
        await wait(500);
        
        // Check if name was trimmed
        const savedName = await page.evaluate(() => {
            return window.StorageManager.getStudentName();
        });
        
        expect(savedName).toBe('Raymond');
    });
});
