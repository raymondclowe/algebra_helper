# PWA Install Prompts and Auto-Update Mechanisms

## Overview

The IB Math Trainer (Algebra Helper) is a Progressive Web App (PWA) that can be installed on devices and automatically updates itself. This document explains **how** the install prompts appear and **how** auto-updates work behind the scenes.

---

## Table of Contents

1. [How Install Prompts Work](#how-install-prompts-work)
2. [How Auto-Updates Work](#how-auto-updates-work)
3. [Technical Implementation](#technical-implementation)
4. [Testing and Verification](#testing-and-verification)

---

## How Install Prompts Work

### Browser-Native Install Prompts

The install prompt is **automatically triggered by the browser** when specific criteria are met. Our app does NOT manually control or trigger the prompt - it's a native browser feature.

### Criteria for Install Prompt

Browsers (Chrome, Edge, Safari, Firefox) automatically show an install prompt when **all** these conditions are met:

#### 1. **Valid Web App Manifest** (`manifest.json`)

Our `manifest.json` file defines the app's metadata:

```json
{
  "name": "IB Math Trainer",
  "short_name": "Math Trainer",
  "description": "Fast-response math training app for IB students",
  "start_url": "./algebra-helper.html",
  "display": "standalone",          // Opens without browser UI
  "background_color": "#111827",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Key fields for installability:**
- `name` / `short_name`: App name (required)
- `start_url`: Entry point when app launches (required)
- `display: "standalone"`: Opens as standalone app without browser UI (required)
- `icons`: At least 192x192 and 512x512 PNG icons (required)

#### 2. **Registered Service Worker**

The service worker registration happens in `algebra-helper.html`:

```javascript
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}
```

**What this does:**
- Checks if browser supports service workers
- Registers `service-worker.js` after page load
- Service worker must successfully install and activate

#### 3. **HTTPS Connection** (or localhost)

PWAs require secure connections:
- ✅ GitHub Pages serves over HTTPS automatically
- ✅ `localhost` is treated as secure for development
- ❌ Regular HTTP sites cannot be installed as PWAs

#### 4. **User Engagement Heuristics** (varies by browser)

Browsers use heuristics to decide when to show the prompt:

**Chrome/Edge:**
- User must visit the site at least once
- Some browsers require 30+ seconds of engagement
- May require multiple visits over several days

**Safari (iOS):**
- No automatic prompt
- User must manually select "Add to Home Screen" from Share menu
- Service worker caches content for offline use

**Firefox (Android):**
- Shows prompt after site visit if criteria met
- Desktop Firefox does not support PWA installation

### Where the Prompt Appears

**Chrome/Edge (Android):**
- "Add to Home Screen" in browser menu (⋮)
- Mini-infobar at bottom of screen (can be dismissed)
- Automatic banner prompt after engagement threshold

**Chrome/Edge (Desktop):**
- Install icon in address bar (⊕ or ⬇)
- Banner notification in browser
- Menu option: "Install [App Name]"

**Safari (iOS):**
- Share button → "Add to Home Screen" (manual only)
- No automatic prompt

### What We Don't Do (And Why)

❌ **We don't capture `beforeinstallprompt` event**

Some PWAs capture this event to customize the prompt:

```javascript
// NOT IMPLEMENTED (but could be)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show custom install button
});
```

**Why we don't do this:**
- Browser's native prompt is more trustworthy for users
- Native prompts are better optimized for each browser/OS
- Simpler implementation with fewer edge cases
- Users can always install via browser menu

**Note:** This could be added in the future if we want a custom "Install App" button in the UI.

---

## How Auto-Updates Work

### Overview

The service worker automatically checks for updates and seamlessly installs new versions without user intervention (except for final activation).

### Update Check Mechanisms

Our implementation has **three** ways updates are detected:

#### 1. **On Page Load**

Every time the page loads, we explicitly check for updates:

```javascript
navigator.serviceWorker.register('service-worker.js')
    .then(registration => {
        // Explicitly check for updates on every page load
        registration.update();
    });
```

#### 2. **Periodic Checks (Every 30 Minutes)**

Background update checks while app is running:

```javascript
setInterval(() => {
    registration.update();
    console.log('Checking for service worker updates...');
}, 30 * 60 * 1000);  // 30 minutes
```

#### 3. **Browser's Automatic Check**

Browsers automatically check for service worker updates every 24 hours (browser-managed).

### How Updates Are Detected

The browser compares the **byte-by-byte content** of `service-worker.js`:

1. Browser fetches `/service-worker.js` from server
2. Compares with currently installed version
3. If files differ, triggers update process

**Important:** Even a 1-byte change triggers an update!

### Cache Versioning Strategy

We use **explicit cache versioning** to force updates:

```javascript
// service-worker.js
const CACHE_VERSION = '1.0.3';  // INCREMENT THIS ON EACH DEPLOY
const CACHE_NAME = `algebra-helper-v${CACHE_VERSION}-offline`;
```

**When deploying changes:**
1. Update file content (e.g., add new question template)
2. Increment `CACHE_VERSION` to `'1.0.4'`
3. Push to GitHub
4. Service worker file changes → triggers update

### Update Flow (Step-by-Step)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User loads app / 30-min timer triggers                   │
│    → registration.update() called                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Browser fetches service-worker.js from server            │
│    → Compares byte-by-byte with current SW                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. If different: New service worker starts installing       │
│    → 'updatefound' event fires                              │
│    → New SW downloads and caches all resources              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. New SW enters "installed" state                          │
│    → Old SW still controlling page                          │
│    → showUpdateNotification() displays banner               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. User clicks "Update Now" or refreshes page               │
│    → New SW activates and takes control                     │
│    → 'controllerchange' event fires                         │
│    → Page automatically reloads                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. New SW's activate event runs                             │
│    → Old cache deleted (e.g., v1.0.2)                       │
│    → New cache active (e.g., v1.0.3)                        │
│    → Page loads with new version                            │
└─────────────────────────────────────────────────────────────┘
```

### Update Notification UI

When an update is detected, we show a dismissible banner:

```javascript
function showUpdateNotification() {
    const banner = document.createElement('div');
    banner.innerHTML = `
        <span>🔄 New version available!</span>
        <button onclick="location.reload()">Update Now</button>
        <button onclick="this.parentElement.remove()">Later</button>
    `;
    document.body.appendChild(banner);
}
```

**User experience:**
- Non-intrusive banner appears at bottom of screen
- User can update immediately or continue using old version
- If dismissed, update activates on next page reload

### Service Worker Lifecycle Events

Our service worker handles three key lifecycle events:

#### **Install Event**

Triggered when a new service worker is detected:

```javascript
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();  // Don't wait for old SW to close
});
```

**What happens:**
- Opens new cache with version number (e.g., `algebra-helper-v1.0.3-offline`)
- Downloads and caches all 64+ resources (HTML, CSS, JS, icons)
- `skipWaiting()` allows immediate activation without waiting for tabs to close

#### **Activate Event**

Triggered when the new service worker takes control:

```javascript
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();  // Take control immediately
});
```

**What happens:**
- Deletes old cache versions (e.g., `algebra-helper-v1.0.2-offline`)
- Keeps only the new cache (e.g., `algebra-helper-v1.0.3-offline`)
- `clients.claim()` makes new SW control all open tabs immediately

#### **Fetch Event**

Handles all network requests with caching strategies:

```javascript
self.addEventListener('fetch', event => {
    // Cache-first for local resources
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

### Cache Cleanup Strategy

**Problem:** Old cache versions can accumulate and waste storage.

**Solution:** On activation, delete all cache versions except the current one:

```javascript
// During activate event
caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
        if (cacheName !== CACHE_NAME) {
            caches.delete(cacheName);  // Delete v1.0.2, v1.0.1, etc.
        }
    });
});
```

**Result:**
- Only one cache version exists at a time
- Typical cache size: 2-3 MB (64 files)
- Old versions removed automatically

---

## Technical Implementation

### File Structure

```
algebra_helper/
├── service-worker.js          # Service worker with caching logic
├── manifest.json              # PWA manifest
├── algebra-helper.html        # Main app (registers SW)
├── index.html                 # Redirect to main app
├── icons/
│   ├── icon-192x192.png      # Required for PWA
│   └── icon-512x512.png      # Required for PWA
├── css/                       # Cached CSS files
├── js/                        # Cached JS modules
└── OFFLINE_PWA_GUIDE.md      # User-facing documentation
```

### Resources Cached

The service worker caches **64 files** (~2-3 MB):

**Core files:**
- 2 HTML files
- 2 CSS files (styles.css, tailwind.css)
- 24 core JavaScript modules
- 33 question template modules
- 3 PWA files (manifest.json, 2 icons)

**CDN resources** (cached on first load):
- Tailwind CSS (cdn.tailwindcss.com)
- MathJax (cdn.jsdelivr.net)

### Caching Strategies

#### **Local Resources: Cache-First**

```javascript
// 1. Check cache first
caches.match(event.request)
    .then(response => {
        if (response) return response;  // Return cached version
        // 2. If not in cache, fetch from network
        return fetch(event.request);
    });
```

**Benefits:**
- Instant loading (no network delay)
- Works offline immediately
- Reduces bandwidth usage

#### **CDN Resources: Network-First with Cache Fallback**

```javascript
// 1. Try network first (get latest version)
fetch(event.request)
    .then(response => {
        // Cache successful response
        cache.put(event.request, response.clone());
        return response;
    })
    .catch(() => {
        // 2. If network fails, use cached version
        return caches.match(event.request);
    });
```

**Benefits:**
- Always uses latest CDN versions when online
- Falls back to cached version when offline
- Balances freshness with offline capability

### Deployment Checklist

When deploying updates to the app:

- [ ] **Update file content** (e.g., fix bug, add feature)
- [ ] **Increment `CACHE_VERSION`** in `service-worker.js`
  ```javascript
  const CACHE_VERSION = '1.0.4';  // Increment
  ```
- [ ] **Commit and push** to GitHub
- [ ] **Verify update in DevTools**:
  - Open Chrome DevTools → Application → Service Workers
  - See new SW installing/activated
  - Check new cache version exists
- [ ] **Test update notification** appears for users

**Common mistake:** Forgetting to increment `CACHE_VERSION` means:
- Service worker file changes, so update is detected ✅
- But new SW uses same cache name, so old cached files remain ❌
- Result: Users see mixed old/new content until cache is manually cleared

### Browser DevTools Inspection

**Chrome/Edge DevTools → Application Tab:**

1. **Service Workers Section:**
   - See current SW status (activated, waiting, installing)
   - Force update with "Update" button
   - Unregister SW for testing
   - Bypass for network (testing offline behavior)

2. **Cache Storage Section:**
   - View all cached resources
   - See cache version names
   - Inspect individual cached files
   - Delete caches manually

3. **Manifest Section:**
   - Verify manifest.json is valid
   - Check installability criteria
   - See parsed manifest data

---

## Testing and Verification

### Testing Install Prompt

**Manual Test:**

1. Open app in Chrome Incognito (fresh state)
2. Visit https://raymondclowe.github.io/algebra_helper/algebra-helper.html
3. Wait 30-60 seconds on the page
4. Check for install icon in address bar (⊕)
5. Check browser menu for "Install [App Name]"

**DevTools Test:**

1. Open DevTools → Application → Manifest
2. Check for green "Installability" checkmark
3. If red X, expand to see missing criteria

**Lighthouse Test:**

1. Open DevTools → Lighthouse
2. Select "Progressive Web App" category
3. Click "Generate report"
4. Look for "Installable" audit (should be ✅)

### Testing Auto-Updates

**Scenario 1: Immediate Update Test**

```javascript
// 1. Deploy current version (v1.0.3)
// Visit app in browser

// 2. Make a change and increment version
const CACHE_VERSION = '1.0.4';  // Was 1.0.3

// 3. Deploy to GitHub Pages

// 4. In browser: Click refresh or wait 30 minutes
// Expected: Update banner appears
// Click "Update Now" → Page reloads with v1.0.4
```

**Scenario 2: DevTools Manual Update**

1. Open DevTools → Application → Service Workers
2. Click "Update" button
3. See new SW move from "waiting" to "activated"
4. Update notification should appear

**Scenario 3: Simulate Offline-First Update**

1. Visit app online (current version)
2. Open DevTools → Network → Select "Offline"
3. Reload page → App still works (cached)
4. Uncheck "Offline" → Back online
5. Wait 30 minutes or manually update
6. New version installs in background

### Testing Update Notification

**Test the banner UI:**

```javascript
// Open browser console on app page
// Call update notification function manually
showUpdateNotification();

// Should see:
// - Banner at bottom of screen
// - "Update Now" button (reloads page)
// - "Later" button (dismisses banner)
```

### Verifying Cache Cleanup

**After update:**

1. Open DevTools → Application → Cache Storage
2. Should see only ONE cache: `algebra-helper-v1.0.4-offline`
3. Old caches (`v1.0.3`, `v1.0.2`) should be deleted

**If old caches remain:**
- Service worker didn't activate properly
- Check console for errors
- Try hard refresh (Ctrl+Shift+R)

---

## Common Issues and Solutions

### Issue: Install Prompt Doesn't Appear

**Causes:**
- ❌ Manifest.json not linked in HTML
- ❌ Icons missing or wrong size
- ❌ Service worker not registered
- ❌ Not using HTTPS (except localhost)
- ⚠️ Browser heuristics not met (need more engagement)

**Solutions:**
1. Check DevTools → Application → Manifest for errors
2. Verify icons exist at specified paths
3. Check Console for service worker errors
4. Use Lighthouse audit to diagnose

### Issue: Update Not Detected

**Causes:**
- Service worker file unchanged (same byte content)
- Browser cache preventing SW file from updating
- Update check hasn't run yet

**Solutions:**
1. Increment `CACHE_VERSION` in service-worker.js
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser cache
4. Wait 30 minutes for periodic check
5. Manually trigger `registration.update()` in console

### Issue: Old Content Still Showing

**Causes:**
- `CACHE_VERSION` not incremented
- New SW using old cache name
- Browser aggressive caching

**Solutions:**
1. Always increment `CACHE_VERSION` on deploy
2. Check DevTools → Cache Storage for old caches
3. Unregister SW and reload page
4. Use versioned URLs for critical assets

### Issue: Update Notification Not Appearing

**Causes:**
- `updatefound` event not firing
- New SW not reaching "installed" state
- JavaScript error preventing banner creation

**Solutions:**
1. Check browser console for errors
2. Verify `showUpdateNotification()` function exists
3. Test function manually in console
4. Check event listener registration

---

## Future Enhancements

Potential improvements to the PWA install and update experience:

### Custom Install Button

```javascript
// Capture beforeinstallprompt event
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button in UI
    document.getElementById('install-button').style.display = 'block';
});

// Handle install button click
document.getElementById('install-button').addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted install');
        }
        deferredPrompt = null;
    });
});
```

**Benefits:**
- More discoverable than browser's native prompt
- Can be styled to match app design
- Can show at optimal moment in user journey

### Silent Background Updates

```javascript
// Skip waiting immediately without notification
self.addEventListener('install', event => {
    self.skipWaiting();  // Already implemented
});

self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()  // Already implemented
    );
});

// Alternative: Skip notification, just auto-update
registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'activated') {
            // Silently reload without notification
            window.location.reload();
        }
    });
});
```

**Tradeoffs:**
- ✅ Seamless updates (no user action needed)
- ❌ May disrupt user mid-task (unexpected reload)
- ❌ Less transparent (users don't know update occurred)

### Smarter Update Timing

```javascript
// Only show update notification when user is idle
let idleTime = 0;
let idleInterval = setInterval(() => {
    idleTime++;
    if (idleTime > 2 && hasUpdate) {  // 2 minutes idle
        showUpdateNotification();
        clearInterval(idleInterval);
    }
}, 60000);

// Reset idle time on user interaction
document.addEventListener('mousemove', () => idleTime = 0);
document.addEventListener('keypress', () => idleTime = 0);
document.addEventListener('click', () => idleTime = 0);
```

**Benefits:**
- Less disruptive (waits for idle moment)
- Better UX (doesn't interrupt active work)

### Version Comparison API

```javascript
// Fetch version info from server
fetch('/version.json')
    .then(r => r.json())
    .then(data => {
        if (data.version !== currentVersion) {
            console.log('New version available:', data.version);
            console.log('Changelog:', data.changelog);
            showUpdateNotificationWithChangelog(data);
        }
    });
```

**Benefits:**
- Can show changelog to users
- Can check for critical updates
- Can skip minor updates if user prefers

---

## Summary

### Install Prompts: Browser-Controlled

- ✅ **Automatic:** Browser shows prompt when criteria met
- ✅ **No code needed:** Manifest + Service Worker = Installable
- ✅ **Native UI:** Each browser has its own install experience
- ⚠️ **Timing varies:** Heuristics differ across browsers
- 💡 **Optional:** Can customize with `beforeinstallprompt` event

### Auto-Updates: Service Worker-Managed

- ✅ **Three check methods:** Page load, periodic (30 min), browser (24h)
- ✅ **Byte-level detection:** Any change to SW file triggers update
- ✅ **Cache versioning:** Explicit version numbers prevent staleness
- ✅ **User notification:** Banner prompts user to activate update
- ✅ **Cleanup:** Old caches automatically deleted

### Key Takeaway

**The PWA works because:**
1. **Manifest** tells browser how to install the app
2. **Service Worker** enables offline functionality and auto-updates
3. **Browser** handles install prompts natively
4. **Cache versioning** ensures users get latest content
5. **Update notifications** let users activate new versions

**Minimal developer effort, maximum browser automation!**

---

## References

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN: Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Google: Install Prompt](https://web.dev/install-criteria/)
- [Google: Service Worker Lifecycle](https://web.dev/service-worker-lifecycle/)
- [GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

---

**Last Updated:** 2026-02-03  
**App Version:** See `CACHE_VERSION` in `service-worker.js`  
**Related Docs:** [OFFLINE_PWA_GUIDE.md](OFFLINE_PWA_GUIDE.md) (user-facing guide)
