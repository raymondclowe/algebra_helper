# Cloudflare Worker AI Microservice for Student Worksheet Generation

## Overview

This Cloudflare Worker provides an AI-powered microservice that generates personalized practice worksheets for students based on their performance history and error patterns. It integrates with the Algebra Helper front-end to deliver targeted habit improvement exercises.

## Features

- ✅ **AI-Powered Analysis**: Uses Cloudflare Workers AI (free tier) to analyze student performance
- ✅ **Personalized Worksheets**: Generates targeted exercises based on individual error patterns
- ✅ **Positive Framing**: Focuses on gaining exam points through habit development
- ✅ **Structured Output**: Returns JSON-formatted data for easy worksheet generation
- ✅ **CORS Support**: Enables direct front-end integration
- ✅ **Cost-Effective**: Utilizes Cloudflare's free tier (10,000 neurons/day)

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              Algebra Helper Front-End               │
│         (worksheet-generator.js module)             │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS POST
                   │ /api/worksheet/analyze
                   ↓
┌─────────────────────────────────────────────────────┐
│           Cloudflare Worker (Edge)                  │
│  ┌──────────────────────────────────────────────┐  │
│  │  index.js (Router & CORS handling)           │  │
│  └──────────────────┬───────────────────────────┘  │
│                     ↓                                │
│  ┌──────────────────────────────────────────────┐  │
│  │  worksheet-handler.js                        │  │
│  │  • Validate student data                     │  │
│  │  • Build AI prompt                           │  │
│  │  • Call Workers AI                           │  │
│  │  • Parse & format response                   │  │
│  └──────────────────┬───────────────────────────┘  │
│                     ↓                                │
│  ┌──────────────────────────────────────────────┐  │
│  │  Cloudflare Workers AI                       │  │
│  │  Model: @cf/meta/llama-2-7b-chat-int8       │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Cloudflare Account**: Sign up at https://cloudflare.com
2. **Wrangler CLI**: Install with `npm install -g wrangler`
3. **Node.js**: Version 16.x or higher

## Installation & Deployment

### Step 1: Install Dependencies

```bash
cd cloudflare-worker
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

### Step 3: Configure Worker

Edit `wrangler.toml` and update the worker name if needed:

```toml
name = "algebra-helper-worksheet-generator"
```

### Step 4: Deploy to Cloudflare

```bash
# Development deployment
wrangler deploy --env development

# Production deployment
wrangler deploy --env production
```

### Step 5: Get Your Worker URL

After deployment, Wrangler will output your worker URL:
```
https://algebra-helper-worksheet-generator.YOUR-SUBDOMAIN.workers.dev
```

### Step 6: Update Front-End Configuration

Update the API endpoint in `js/worksheet-generator.js`:

```javascript
// Replace with your deployed worker URL
API_ENDPOINT: 'https://algebra-helper-worksheet-generator.YOUR-SUBDOMAIN.workers.dev/api/worksheet/analyze'
```

## API Documentation

### Endpoint: POST /api/worksheet/analyze

Generate a personalized practice worksheet based on student data.

#### Request Format

```json
{
  "studentName": "John",
  "errorPatterns": {
    "squareRootSign": 5,
    "divisionByZero": 3
  },
  "performanceHistory": [
    {
      "topic": "Quadratic Equations",
      "correct": 7,
      "total": 10,
      "successRate": "70.0"
    }
  ],
  "weaknessAreas": [
    "Square Root Signs (±)",
    "Quadratic Equations"
  ],
  "level": 10.5,
  "timestamp": "2024-12-24T01:00:00.000Z"
}
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "worksheetTitle": "Habit Improvement Practice - Square Root Signs",
    "headerMessage": "This is to help you gain more IB exam points by developing your habit / muscle memory to automatically do the right thing when writing answers.",
    "targetHabits": [
      {
        "habitName": "Square Root Sign Awareness",
        "description": "Always include ± when solving equations with square roots",
        "importance": "Missing negative roots loses points on every IB exam",
        "examPointsAtRisk": "1-2 points per question"
      }
    ],
    "exercises": [
      {
        "questionNumber": 1,
        "question": "Solve: x² = 25",
        "hints": [
          "Remember that both positive and negative numbers square to give positive results",
          "Use the ± symbol"
        ],
        "correctAnswer": "x = ±5",
        "commonMistake": "Only giving x = 5",
        "keyReminder": "Square roots always have two solutions: positive and negative"
      }
    ],
    "rationale": "These exercises build automatic responses for including ± notation...",
    "generatedAt": "2024-12-24T01:30:00.000Z",
    "studentName": "John",
    "currentLevel": 10.5
  }
}
```

#### Error Response

```json
{
  "error": "Validation Error",
  "details": [
    "studentName is required and must be a string"
  ]
}
```

### Endpoint: GET /api/health

Health check endpoint to verify worker is running.

#### Response

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-12-24T01:30:00.000Z"
}
```

## Local Development

### Run Locally

```bash
cd cloudflare-worker
wrangler dev
```

This starts a local development server at `http://localhost:8787`

### Test Locally

```bash
# Health check
curl http://localhost:8787/api/health

# Generate worksheet
curl -X POST http://localhost:8787/api/worksheet/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Test Student",
    "errorPatterns": {"squareRootSign": 5},
    "performanceHistory": [],
    "weaknessAreas": [],
    "level": 10
  }'
```

## Front-End Integration

### Include the Module

Add to your HTML file (e.g., `algebra-helper.html`):

```html
<script src="js/worksheet-generator.js"></script>
```

### Generate Worksheet Programmatically

```javascript
// Generate worksheet based on current student data
WorksheetGenerator.generateWorksheet()
  .then(worksheetData => {
    console.log('Worksheet generated:', worksheetData);
  })
  .catch(error => {
    console.error('Failed to generate worksheet:', error);
  });
```

### UI Integration

The module automatically adds a "Generate Practice Worksheet" button to the UI near the stats button.

Users can click this button to:
1. Analyze their performance data
2. Generate a personalized worksheet
3. View the worksheet in a modal
4. Print the worksheet for offline practice

## Cost Analysis

### Cloudflare Workers AI Free Tier

- **10,000 neurons/day** free quota
- Each worksheet generation uses approximately 500-1000 neurons
- **Estimated capacity**: 10-20 worksheets per day on free tier
- For higher usage, paid tier is very affordable (~$0.01 per 1000 tokens)

### Scaling Considerations

| Daily Worksheets | Neurons/Day | Cost |
|-----------------|-------------|------|
| < 10 | < 10,000 | **FREE** |
| 50 | ~50,000 | ~$0.50 |
| 100 | ~100,000 | ~$1.00 |
| 1000 | ~1,000,000 | ~$10.00 |

## Configuration

### Environment Variables

Set in `wrangler.toml`:

```toml
[env.production]
vars = { ENVIRONMENT = "production" }

[env.development]
vars = { ENVIRONMENT = "development" }
```

### AI Model Selection

Default model: `@cf/meta/llama-2-7b-chat-int8`

Alternative models available:
- `@cf/meta/llama-2-7b-chat-fp16` (higher quality, slower)
- `@cf/mistral/mistral-7b-instruct-v0.1` (good for structured output)

To change, edit `src/worksheet-handler.js`:

```javascript
const aiResponse = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1', {
  prompt: prompt,
  max_tokens: 2000,
  temperature: 0.7,
});
```

## Security Considerations

1. **CORS**: Currently allows all origins (`*`). For production, restrict to your domain:
   ```javascript
   'Access-Control-Allow-Origin': 'https://raymondclowe.github.io'
   ```

2. **Rate Limiting**: Consider adding rate limiting for production:
   ```javascript
   // Example: Limit to 10 requests per minute per IP
   ```

3. **Input Validation**: Already implemented in `worksheet-handler.js`

4. **Error Handling**: Comprehensive error handling prevents sensitive data leakage

## Troubleshooting

### Common Issues

1. **"AI binding not found"**
   - Ensure `wrangler.toml` has the `[ai]` binding configured
   - Redeploy with `wrangler deploy`

2. **CORS errors in browser**
   - Check that CORS headers are properly set
   - Verify the worker URL is correct in front-end configuration

3. **Slow response times**
   - AI inference can take 1-3 seconds
   - Consider reducing `max_tokens` for faster responses
   - Add caching for common patterns (future enhancement)

4. **Parsing errors**
   - The AI sometimes returns non-JSON output
   - Fallback structure is automatically used
   - Consider using a more structured model like Mistral

### Debug Mode

Enable debug logging:

```javascript
// In worksheet-handler.js
console.log('AI Prompt:', prompt);
console.log('AI Response:', aiResponse);
```

View logs:
```bash
wrangler tail
```

## Future Enhancements

- [ ] Add caching layer for common error patterns
- [ ] Implement rate limiting per user
- [ ] Support multiple AI models
- [ ] Add answer key generation
- [ ] Generate PDF worksheets server-side
- [ ] Implement worksheet history/tracking
- [ ] Add collaborative worksheet sharing
- [ ] Support custom question templates

## Support & Resources

- **Cloudflare Workers AI Docs**: https://developers.cloudflare.com/workers-ai/
- **Wrangler CLI Docs**: https://developers.cloudflare.com/workers/wrangler/
- **Available AI Models**: https://developers.cloudflare.com/workers-ai/models/
- **Pricing**: https://developers.cloudflare.com/workers-ai/platform/pricing/

## License

This project is part of the Algebra Helper open source educational tool.

## Contact

For issues or questions, please open an issue on the GitHub repository.
