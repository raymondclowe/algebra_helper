const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Helper function for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('PWA Offline Functionality Tests', () => {
    let browser;
    let page;
    
    const LOCAL_URL = process.env.TEST_URL || 'http://localhost:8000';

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
    });

    afterEach(async () => {
        await page.close();
    });

    test('service-worker.js file exists and is valid JavaScript', async () => {
        const response = await page.goto(`${LOCAL_URL}/service-worker.js`, {
            waitUntil: 'networkidle0',
            timeout: 10000
        });
        
        expect(response.status()).toBe(200);
        const contentType = response.headers()['content-type'];
        expect(contentType).toMatch(/javascript|text\/plain/);
    });

    test('manifest.json file exists and is valid JSON', async () => {
        const response = await page.goto(`${LOCAL_URL}/manifest.json`, {
            waitUntil: 'networkidle0',
            timeout: 10000
        });
        
        expect(response.status()).toBe(200);
        const manifest = await response.json();
        
        // Verify required manifest fields
        expect(manifest.name).toBe('IB Math Trainer');
        expect(manifest.short_name).toBe('Math Trainer');
        expect(manifest.start_url).toBe('./algebra-helper.html');
        expect(manifest.display).toBe('standalone');
        expect(manifest.icons).toHaveLength(2);
    });

    test('PWA icons exist and are accessible', async () => {
        // Test 192x192 icon
        const icon192Response = await page.goto(`${LOCAL_URL}/icons/icon-192x192.png`, {
            timeout: 10000
        });
        expect(icon192Response.status()).toBe(200);
        expect(icon192Response.headers()['content-type']).toMatch(/image\/png/);
        
        // Test 512x512 icon
        const icon512Response = await page.goto(`${LOCAL_URL}/icons/icon-512x512.png`, {
            timeout: 10000
        });
        expect(icon512Response.status()).toBe(200);
        expect(icon512Response.headers()['content-type']).toMatch(/image\/png/);
    });

    test('Service Worker registers successfully on page load', async () => {
        await page.goto(`${LOCAL_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for service worker registration
        await wait(2000);
        
        // Check if service worker is registered
        const swRegistered = await page.evaluate(() => {
            return navigator.serviceWorker.controller !== null || 
                   navigator.serviceWorker.getRegistration().then(reg => reg !== undefined);
        });
        
        // Service worker should be registered (or in process of registering)
        expect(swRegistered).toBeTruthy();
    });

    test('manifest.json is linked in algebra-helper.html', async () => {
        await page.goto(`${LOCAL_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        const manifestLink = await page.$('link[rel="manifest"]');
        expect(manifestLink).toBeTruthy();
        
        const manifestHref = await page.$eval('link[rel="manifest"]', el => el.getAttribute('href'));
        expect(manifestHref).toBe('manifest.json');
    });

    test('PWA meta tags are present in HTML', async () => {
        await page.goto(`${LOCAL_URL}/algebra-helper.html`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Check for mobile-web-app-capable meta tag
        const mobileCapable = await page.$('meta[name="mobile-web-app-capable"]');
        expect(mobileCapable).toBeTruthy();
        
        // Check for apple-mobile-web-app-capable meta tag
        const appleCapable = await page.$('meta[name="apple-mobile-web-app-capable"]');
        expect(appleCapable).toBeTruthy();
        
        // Check for theme-color meta tag
        const themeColor = await page.$('meta[name="theme-color"]');
        expect(themeColor).toBeTruthy();
    });

    test('Service Worker file has correct cache version', () => {
        // Read service-worker.js file
        const swPath = path.join(__dirname, '..', 'service-worker.js');
        const swContent = fs.readFileSync(swPath, 'utf8');
        
        // Check that CACHE_NAME is defined
        expect(swContent).toMatch(/const CACHE_NAME = ['"]algebra-helper-v[\d.]+[-\w]*['"]/);
        
        // Check that urlsToCache array is defined and not empty
        expect(swContent).toMatch(/const urlsToCache = \[/);
        expect(swContent).toMatch(/\.\/algebra-helper\.html/);
        expect(swContent).toMatch(/\.\/manifest\.json/);
    });

    test('Service Worker caches essential files', () => {
        const swPath = path.join(__dirname, '..', 'service-worker.js');
        const swContent = fs.readFileSync(swPath, 'utf8');
        
        // Essential files that must be in cache
        const essentialFiles = [
            './algebra-helper.html',
            './index.html',
            './css/styles.css',
            './js/main.js',
            './js/generator.js',
            './manifest.json',
            './icons/icon-192x192.png'
        ];
        
        essentialFiles.forEach(file => {
            expect(swContent).toContain(file);
        });
    });
});
