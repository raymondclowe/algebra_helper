# Asset Versioning System

## Overview

This project uses automatic Unix timestamp-based versioning to ensure users always receive the latest code and assets after deployment. This prevents issues with cached old code in browsers and PWA installations.

## How It Works

### Automatic Versioning on Deployment

When code is pushed to the `main` branch, the GitHub Actions workflow automatically:

1. Generates a Unix timestamp (seconds since epoch)
2. Runs `tools/version-assets.js` with this timestamp
3. Updates all asset references across the codebase
4. Deploys the versioned assets to GitHub Pages

### What Gets Versioned

The versioning script updates:

1. **HTML version comments** - `<!-- Algebra Helper v{timestamp} -->`
2. **CSS/JS query parameters** - `styles.css?v={timestamp}`, `main.js?v={timestamp}`
3. **Service Worker cache version** - `CACHE_VERSION = '{timestamp}'`
4. **PWA Manifest version** - `"version": "{timestamp}"`

### Files Modified

- `algebra-helper.html` - All CSS and JS references, HTML comment
- `index.html` - HTML comment
- `service-worker.js` - Cache version constant
- `manifest.json` - Version field

## Manual Versioning

You can manually version assets for testing:

```bash
# Use current timestamp
npm run version-assets

# Use specific timestamp
npm run version-assets -- 1234567890

# Or call the script directly
node tools/version-assets.js 1234567890
```

**Important:** Don't commit manually versioned files to version control. The GitHub Actions workflow will handle versioning during deployment.

## Why Unix Timestamps?

Unix timestamps provide several advantages:

1. **Always unique** - Each deployment gets a unique version
2. **Chronological** - Easy to see which version is newer
3. **Automatic** - No need to manually increment version numbers
4. **Cache-busting** - Browsers and PWAs will fetch new assets
5. **Debugging** - Timestamp shows exactly when code was deployed

## Cache Busting Strategy

### Browser Caching

Query parameters (`?v={timestamp}`) on CSS and JS files force browsers to fetch new versions when the timestamp changes.

### Service Worker Caching

The service worker uses the timestamp in its cache name (`algebra-helper-v{timestamp}-offline`). When a new version is deployed:

1. New service worker installs with new cache name
2. Old cache is deleted
3. Users get fresh assets on next page load

### PWA Manifest

Adding a version to `manifest.json` helps PWAs detect updates and prompt users to reload the app.

## Troubleshooting

### Users Still Seeing Old Code

If users still see old code after deployment:

1. **Hard refresh** - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear cache** - Clear browser cache and reload
3. **Unregister service worker** - In DevTools > Application > Service Workers
4. **Reinstall PWA** - Uninstall and reinstall the Progressive Web App

### Testing Locally

To test versioning locally:

```bash
# Run the versioning script
npm run version-assets -- 9999999999

# Start a local server
npx http-server -p 8000

# Test in browser at http://localhost:8000/algebra-helper.html

# Reset files when done
git checkout algebra-helper.html service-worker.js manifest.json index.html
```

## Version History

The version number in the HTML comment and console logs shows the Unix timestamp of deployment:

- `1704067200` = Jan 1, 2024 00:00:00 GMT (example)
- You can convert timestamps at [epochconverter.com](https://www.epochconverter.com/)

## Related Files

- `tools/version-assets.js` - Versioning script
- `.github/workflows/static.yml` - Deployment workflow with versioning step
- `package.json` - Contains `version-assets` npm script
