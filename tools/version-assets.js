#!/usr/bin/env node

/**
 * Asset Versioning Script
 * 
 * This script generates a Unix timestamp and injects it into HTML files,
 * service worker, and manifest to ensure proper cache busting on deployment.
 * 
 * Usage:
 *   node tools/version-assets.js [version]
 * 
 * If version is not provided, it uses the current Unix timestamp in seconds.
 */

const fs = require('fs');
const path = require('path');

// Get version from command line or use current Unix timestamp
const version = process.argv[2] || Math.floor(Date.now() / 1000).toString();

console.log(`🔄 Versioning assets with: ${version}`);

// Files to update
const files = {
  'algebra-helper.html': {
    patterns: [
      {
        // CSS and JS file query parameters - update existing versions
        regex: /(\.(css|js))\?v=[^"'\s]+/g,
        replacement: `$1?v=${version}`
      },
      {
        // CSS and JS file query parameters - add version to unversioned local files
        regex: /((?:href|src)=["'](?:\.\/)?(?:css|js)\/[^"'?]+)(\.(?:css|js))(["'])/g,
        replacement: `$1$2?v=${version}$3`
      },
      {
        // HTML version comment
        regex: /(<!-- Algebra Helper v)[^-\s]+( -)/,
        replacement: `$1${version}$2`
      }
    ]
  },
  'index.html': {
    patterns: [
      {
        // HTML version comment
        regex: /(<!-- Algebra Helper v)[^-\s]+( -)/,
        replacement: `$1${version}$2`
      }
    ]
  },
  'service-worker.js': {
    patterns: [
      {
        // Service worker cache version
        regex: /const CACHE_VERSION = '[^']+';/,
        replacement: `const CACHE_VERSION = '${version}';`
      }
    ]
  },
  'manifest.json': {
    patterns: [
      {
        // Add or update version field in manifest
        regex: /({\s*\n\s*)("version":\s*"[^"]+",\s*\n\s*)?("name":)/,
        replacement: `$1"version": "${version}",\n  $3`
      }
    ]
  }
};

let updatedCount = 0;
let errorCount = 0;

// Process each file
Object.entries(files).forEach(([filename, config]) => {
  const filepath = path.join(process.cwd(), filename);
  
  try {
    if (!fs.existsSync(filepath)) {
      console.warn(`⚠️  File not found: ${filename}`);
      errorCount++;
      return;
    }

    let content = fs.readFileSync(filepath, 'utf8');
    let modified = false;

    config.patterns.forEach(({ regex, replacement }) => {
      const beforeContent = content;
      content = content.replace(regex, replacement);
      if (content !== beforeContent) {
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`✅ Updated: ${filename}`);
      updatedCount++;
    } else {
      console.log(`⏭️  No changes: ${filename}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updatedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`   Version: ${version}`);

if (errorCount > 0) {
  process.exit(1);
}
