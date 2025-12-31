# Offline PWA Guide - IB Math Trainer

## Overview

The IB Math Trainer is now a fully functional Progressive Web App (PWA) that works offline after the first visit. This guide explains how the offline functionality works and how to use it.

## Features

### ✅ Complete Offline Functionality
- **All question templates** (40+ JS files) are cached locally
- **CSS and assets** are available offline
- **MathJax** is cached from CDN for math rendering
- **Tailwind CSS** is cached from CDN for styling
- **Icons** for PWA installation are included

### ✅ Progressive Enhancement
- Works online with latest resources
- Falls back to cached resources when offline
- Automatic updates when online

### ✅ Install as App
- Can be installed on Android, iOS, and desktop
- Runs in standalone mode (no browser UI)
- Works like a native app

## How It Works

### Service Worker Caching Strategy

The app uses a sophisticated caching strategy:

1. **Local Resources** (cache-first):
   - All JavaScript files
   - CSS files
   - Icons and manifest
   - Served from cache for instant loading
   - Updated in background when online

2. **CDN Resources** (network-first with cache fallback):
   - Tailwind CSS (cdn.tailwindcss.com)
   - MathJax (cdn.jsdelivr.net)
   - Fetched from network when online
   - Served from cache when offline

### First Visit Requirements

**Important**: The app must be visited once while online to cache all resources.

1. Visit the app while connected to internet
2. Wait for the page to fully load (you'll see math questions)
3. The service worker automatically caches everything
4. Now you can use the app offline!

## Installation Instructions

### On Android Phones

1. **Open in Chrome/Edge**:
   - Visit: https://raymondclowe.github.io/algebra_helper/algebra-helper.html
   - Wait for the page to fully load

2. **Install the App**:
   - Tap the menu (⋮) in the top right
   - Select "Install app" or "Add to Home Screen"
   - Tap "Install" in the prompt

3. **Launch the App**:
   - Find "IB Math Trainer" icon on your home screen
   - Tap to launch in full-screen mode

4. **Use Offline**:
   - Enable airplane mode or disconnect WiFi
   - Open the app from your home screen
   - All features work without internet!

### On iOS (iPhone/iPad)

1. **Open in Safari**:
   - Visit the app URL in Safari browser
   - Wait for page to fully load

2. **Add to Home Screen**:
   - Tap the Share button (square with arrow)
   - Scroll and tap "Add to Home Screen"
   - Name it "Math Trainer" and tap "Add"

3. **Use Offline**:
   - Launch from home screen icon
   - Works offline after first visit

### On Desktop (Windows/Mac/Linux)

1. **Open in Chrome/Edge**:
   - Visit the app URL
   - Look for install icon in address bar

2. **Install**:
   - Click the install icon or menu → "Install IB Math Trainer"
   - App opens in its own window

3. **Use Offline**:
   - Launch from Start Menu/Applications
   - Works offline after first visit

## Testing Offline Functionality

### Method 1: Browser DevTools (Chrome/Edge)

1. Open the app in Chrome
2. Press F12 to open DevTools
3. Go to "Application" tab
4. In left sidebar, click "Service Workers"
5. Check "Offline" checkbox
6. Reload the page - it should work!

### Method 2: Airplane Mode (Mobile)

1. Open the app while online
2. Navigate through a few questions
3. Enable airplane mode
4. Close and reopen the app
5. Verify all features work

### Method 3: Network Disconnect (Desktop)

1. Open the app while online
2. Disconnect WiFi/Ethernet
3. Reload the page
4. Verify app still works

## What Works Offline

✅ **Full Functionality**:
- All math question types
- All difficulty levels
- Progress tracking (stored locally)
- Statistics and analytics
- Export/import features
- All UI features and modals

❌ **Not Available Offline**:
- Sharing data to cloud (if implemented)
- Fetching new content from server
- External links in help section

## Troubleshooting

### App doesn't work offline

**Solution**: Visit the app once while online to cache resources.

```
1. Connect to internet
2. Visit the app URL
3. Wait for full page load (see questions)
4. Now try offline
```

### Styles not loading

**Solution**: Clear cache and revisit while online.

```
1. Open browser settings
2. Clear browsing data / Clear cache
3. Visit app while online
4. Wait for full load
```

### Old version showing

**Solution**: The service worker updates automatically, but you can force it:

```
1. Open DevTools (F12)
2. Application → Service Workers
3. Click "Unregister"
4. Reload page
5. New version installs
```

## Technical Details

### Service Worker Version

Current version: `algebra-helper-v1.0.2-offline`

The version number changes with each update to ensure proper cache invalidation.

### Cached Files

The service worker caches:
- 2 HTML files
- 2 CSS files  
- 24 core JavaScript files
- 33 question template files
- 3 PWA files (manifest, icons)
- **Total: 64 files** (~2-3 MB)

### Cache Storage

- Data stored in browser's Cache API
- Separate from cookies/localStorage
- Can be cleared via browser settings
- Updates automatically when online

## Browser Support

| Browser | Online | Offline | Install |
|---------|--------|---------|---------|
| Chrome (Android) | ✅ | ✅ | ✅ |
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Edge (All) | ✅ | ✅ | ✅ |
| Safari (iOS) | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ⚠️* |

*Firefox supports PWA on Android only

## Future Enhancements

Potential improvements (out of scope for current implementation):

1. **Android APK**: Package as native Android app using Capacitor or PWA Builder
2. **Background Sync**: Sync data when connection restored
3. **Offline Indicator**: Visual indicator of offline status
4. **Reduced Size**: Further optimize cached resources
5. **Update Notifications**: Prompt user when new version available

## Privacy & Data

- All data stored locally on your device
- No data sent to servers
- Progress/statistics stored in browser's localStorage
- Can be cleared via browser settings
- No tracking or analytics while offline

## Support

For issues or questions:
- GitHub Issues: https://github.com/raymondclowe/algebra_helper/issues
- Check browser console (F12) for error messages
- Verify service worker is registered in DevTools

---

**Last Updated**: December 2024  
**Version**: 1.0.2-offline
