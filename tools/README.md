# Question Validation Tool

Automated cross-checking tool for all types of algebra helper questions using Gemini 3 Pro via OpenRouter API.

## Overview

This tool validates the correctness and quality of **all automatically generated mathematics questions** by:
1. Generating every question type for all 34 difficulty levels (1-34, including HL topics)
2. Creating screenshots of each question using the actual app UI (with full MathJax rendering)
3. Sending each screenshot to Gemini 3 Pro for AI-powered validation (via OpenRouter)
4. Saving the full AI response for every question for manual cross-checking
5. Parsing feedback and generating issue reports for problems found
6. Creating a comprehensive summary report

## Requirements

- Node.js 14+
- OpenRouter API key with access to Gemini 3 Pro
- All dependencies installed (`npm install`)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Key**
   
   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```
   
   Get your API key from: https://openrouter.ai/

3. **Verify Configuration**
   
   The tool will validate your configuration on startup and report any issues.

## Usage

### Run Full Validation

Validate all question types (recommended):
```bash
npm run validate-questions
```

This will:
- Test **all 34 difficulty levels** (including HL topics)
- Test **every question type** for each level (not just random samples)
- Create screenshots for each question type using the real app UI (with MathJax)
- Send each screenshot to Gemini 3 Pro for validation
- Save the full AI response for every question to `validation-output/responses/`
- Generate issue files for any problems found
- Create a summary report

### Output

The tool creates these types of output:

1. **Screenshots** — `validation-output/screenshots/`
   - PNG images of each generated question type
   - Format: `level-{N}-type{M}.png`

2. **AI Responses** — `validation-output/responses/`
   - Full Gemini 3 Pro response for every question type (JSON)
   - Format: `level-{N}-type{M}.json`

3. **Issue Files** — `validation-issues/`
   - Markdown files for each question that failed validation
   - Contains full context and AI feedback
   - Ready to be converted to GitHub issues

4. **Summary Report** — `validation-output/`
   - Overall validation results
   - Statistics by level
   - Recommendations for fixes

## Configuration

Edit `tools/config.js` to customize:

- `levelsToTest` — List of all 34 levels and their question type counts
- `validationPrompt` — Prompt sent to Gemini 3 Pro

## Technical Details

### Model Used

- **Model:** `google/gemini-3-pro-preview`
- **API:** OpenRouter (https://openrouter.ai)
- **Purpose:** Vision + language model for validating mathematical questions

⚠️ **Important:** The tool enforces use of Gemini 3 Pro specifically. No substitutes are allowed per requirements.

### Architecture

```
question-validator.js     - Main orchestration script
├── config.js             - Configuration management (all 34 levels, question type counts)
├── api-client.js         - OpenRouter API integration
├── screenshot-generator.js - Puppeteer-based screenshot capture (uses live app with URL params)
└── issue-generator.js    - GitHub issue file generation
```

### Question Types Validated

The tool exercises **all question types** across 34 difficulty levels:

- **Level 1:** Basic Arithmetic
- **Level 2:** Powers and Roots
- **Level 3:** Multiplication and Division
- **Level 4:** Fractions
- **Level 5:** Decimals & Percentages
- **Level 6:** Simple Linear Equations
- **Level 7:** Two-Step Equations
- **Level 8:** Inequalities
- **Level 9:** Expanding Expressions
- **Level 10:** Factorising Quadratics
- **Level 11:** Quadratic Equations
- **Level 12:** Polynomials
- **Level 13:** Exponentials & Logarithms
- **Level 14:** Sequences & Series
- **Level 15:** Functions
- **Level 16:** Basic Trigonometry
- **Level 17:** Advanced Trigonometry
- **Level 18:** Vectors
- **Level 19:** Complex Numbers
- **Level 20:** Basic Differentiation
- **Level 21:** Advanced Calculus
- **Level 22:** Statistics
- **Level 23:** Basic Probability
- **Level 24:** Advanced Probability
- **Level 25:** Integration & Series
- **Level 26-34:** Advanced HL AA topics (Proof, Matrices, 3D Vectors, Complex Polar, Advanced Integration, Differential Equations, Probability Distributions, Hypothesis Testing)

### Validation Criteria

Gemini 3 Pro checks each question for:
1. Mathematical correctness and accuracy
2. Appropriate difficulty for the stated level
3. Clear and unambiguous wording
4. Correct answer is actually correct
5. Distractors are genuinely incorrect but plausible
6. Notation is clear and standard
7. **Correct topic and question type labeling**

### Response Format

**Valid Question:**
```
OK
```
or
```
VALID - Minor suggestion: could simplify notation
```

**Invalid Question:**
```
INCORRECT: The answer provided is wrong. 
For the quadratic x^2 + 5x + 6 = 0, the correct 
solutions are x = -2 and x = -3, not -1 and -6 
as shown in the correct answer.
```

## Troubleshooting

### API Key Issues

If you see `Missing API key` error:
1. Verify `.env` file exists in project root
2. Check the key is set as `OPENROUTER_API_KEY` or `COPILOT_OPENROUTER_API_KEY`
3. Ensure no extra spaces or quotes around the key

### Rate Limiting

The tool includes 2-second delays between requests to avoid rate limits. If you encounter rate limiting:
- Reduce `questionsPerLevel` in config
- Add longer delays in the main validation loop
- Use a higher-tier OpenRouter plan

### Model Not Available

If Gemini 3 Pro is unavailable:
- Check OpenRouter status: https://openrouter.ai/models
- Verify your API key has access to the model
- Check your OpenRouter account credits

### Screenshot Generation Issues

If screenshots fail to generate:
- Verify Puppeteer is installed: `npm list puppeteer`
- Check that `algebra-helper.html` exists in the project root
- Ensure MathJax CDN is accessible
- **Check that the app is not stuck in calibration or welcome mode (the tool now skips these automatically)**

## Cost Estimation

OpenRouter pricing for Gemini 3 Pro (as of Dec 2024):
- Input: ~$0.35 per million tokens
- Output: ~$1.05 per million tokens

Approximate cost for full validation (50 questions):
- ~$0.10 - $0.50 depending on feedback length

## Future Enhancements

Potential improvements:
- [ ] Parallel validation for faster processing
- [ ] Interactive mode to review each question
- [ ] Export results to CSV/JSON
- [ ] Automatic GitHub issue creation via API
- [ ] Support for custom question types
- [ ] Integration with CI/CD pipeline
- [ ] Progress indicators and ETA
- [ ] Retry logic for transient API errors

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review generated issue files in `validation-issues/`
3. Open an issue on GitHub: https://github.com/raymondclowe/algebra_helper/issues

## License

Same as parent project (Algebra Helper).
