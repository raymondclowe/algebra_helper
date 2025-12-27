# Cloudflare Worker Deployment Guide

## Quick Start Deployment

### 1. Prerequisites

Ensure you have:
- Node.js 16+ installed
- A Cloudflare account (free tier works!)
- Access to your domain/subdomain (optional)

### 2. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 3. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate.

### 4. Deploy the Worker

From the `cloudflare-worker` directory:

```bash
# Deploy to production
wrangler deploy --env production

# Or deploy to development
wrangler deploy --env development
```

### 5. Get Your Worker URL

After deployment, Wrangler outputs your worker URL:
```
✨ Successfully published your Worker!
 https://algebra-helper-worksheet-generator.YOUR-SUBDOMAIN.workers.dev
```

### 6. Test Your Deployment

```bash
# Health check
curl https://algebra-helper-worksheet-generator.YOUR-SUBDOMAIN.workers.dev/api/health

# Generate a test worksheet
curl -X POST https://algebra-helper-worksheet-generator.YOUR-SUBDOMAIN.workers.dev/api/worksheet/analyze \
  -H "Content-Type: application/json" \
  -d @examples/sample-request.json
```

### 7. Update Front-End Configuration

Edit `js/worksheet-generator.js` in the main project:

```javascript
// Line ~10
API_ENDPOINT: 'https://algebra-helper-worksheet-generator.YOUR-SUBDOMAIN.workers.dev/api/worksheet/analyze'
```

Replace `YOUR-SUBDOMAIN` with your actual Cloudflare subdomain.

## Advanced Configuration

### Custom Domain

To use your own domain:

1. In Cloudflare dashboard, go to Workers & Pages
2. Select your worker
3. Go to Settings → Triggers
4. Add Custom Domain
5. Follow the prompts to configure DNS

### Environment Variables

Add secrets via CLI:

```bash
wrangler secret put API_KEY
# Enter your secret when prompted
```

Or via dashboard:
1. Workers & Pages → Your Worker → Settings → Variables
2. Add Environment Variable

### Rate Limiting

Consider adding rate limiting for production use. Edit `src/index.js`:

```javascript
// Example: Basic rate limiting
const rateLimiter = {
  requests: new Map(),
  limit: 10, // requests per minute
  windowMs: 60000, // 1 minute
  
  check(ip) {
    const now = Date.now();
    const requests = this.requests.get(ip) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.limit) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    this.requests.set(ip, validRequests);
    return true;
  }
};

// In fetch handler
const clientIP = request.headers.get('CF-Connecting-IP');
if (!rateLimiter.check(clientIP)) {
  return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
    status: 429,
    headers: corsHeaders
  });
}
```

### CORS Restriction

For production, restrict CORS to your domain. Edit `src/index.js`:

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://raymondclowe.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

## Monitoring & Debugging

### View Logs in Real-Time

```bash
wrangler tail
```

### View Metrics

1. Go to Cloudflare dashboard
2. Workers & Pages → Your Worker
3. View metrics: requests, errors, CPU time

### Debug Failed Deployments

```bash
# Check configuration
wrangler whoami

# Validate wrangler.toml
wrangler deploy --dry-run
```

## Updating the Worker

### Deploy Updates

```bash
cd cloudflare-worker
wrangler deploy
```

### Rollback

Cloudflare keeps previous versions. To rollback:

1. Go to Workers & Pages → Your Worker
2. Click "Deployments" tab
3. Select a previous version
4. Click "Rollback to this deployment"

## Cost Management

### Monitor Usage

Check your usage in the Cloudflare dashboard:
- Workers & Pages → Analytics
- View requests, CPU time, and AI neurons used

### Free Tier Limits

- 100,000 requests/day (Workers)
- 10,000 neurons/day (Workers AI)
- More than enough for small-medium deployments

### Upgrade to Paid

If you exceed limits:
- Workers Paid: $5/month for 10M requests
- Workers AI: Pay-as-you-go after free tier

## Troubleshooting

### "Module not found" Error

Ensure `src/index.js` and `src/worksheet-handler.js` exist and use ES6 module syntax:
```javascript
export default { ... }
```

### "AI binding not found"

Check `wrangler.toml` has:
```toml
[ai]
binding = "AI"
```

### CORS Errors

Verify:
1. CORS headers are set correctly
2. OPTIONS method is handled
3. Front-end uses correct worker URL

### Slow Performance

- Check AI model (llama-2-7b-chat-int8 is fastest)
- Reduce max_tokens in AI call
- Add caching for common requests (future enhancement)

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy-worker.yml`:

```yaml
name: Deploy Worker

on:
  push:
    branches:
      - main
    paths:
      - 'cloudflare-worker/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Wrangler
        run: npm install -g wrangler
      
      - name: Deploy to Cloudflare
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          cd cloudflare-worker
          wrangler deploy --env production
```

### Required Secrets

Add to GitHub repository secrets:
- `CLOUDFLARE_API_TOKEN`: Create in Cloudflare dashboard → My Profile → API Tokens

## Support

For issues with deployment:
1. Check Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
2. Review Wrangler CLI docs: https://developers.cloudflare.com/workers/wrangler/
3. Open an issue on GitHub

## Next Steps

After deployment:
1. Test the health endpoint
2. Generate a test worksheet
3. Integrate with front-end
4. Monitor usage and costs
5. Add custom domain (optional)
6. Set up CI/CD (optional)
