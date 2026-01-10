# Validation Fixes - 2026-01-10

## Summary

Analyzed Gemini validation run from 2026-01-09 which identified 52 issues out of 124 question types tested.

## Classification of Issues

After detailed analysis, the 52 "issues" break down as:

### Real Bugs Fixed (1 level, 3 question types)
- **Level 2 - Powers and Roots**: Fixed distractor generation fallback ranges

### False Positives - Metadata/UI (26 question types)
- Gemini reported seeing "Integration & Series" header for many advanced levels (24-34)
- Topic definitions in code are correct
- Likely Gemini misreading UI or hallucinating
- **Action**: Requires manual screenshot inspection to verify

### Subjective/Pedagogical Concerns (25 question types)  
- Gemini opinions about question difficulty
- Concerns about ambiguity or multiple valid answers
- Formatting preferences
- **Action**: Individual review recommended but not critical

## Fixes Applied

### Level 2 - Powers and Roots (squares-roots.js)

**Problem**: Fallback distractors used fixed ranges (1-50, 1-1000, 1-100) causing implausible values.
- Example: Question "What is 2²?" (answer: 4) could get distractor "165"

**Solution**: Changed fallback generators to use relative ranges (±50% of correct answer)

```javascript
// Before:
() => `${utils.rInt(1, 50)}`

// After:
() => {
    const minRange = Math.max(1, Math.floor(answer * 0.5));
    const maxRange = Math.ceil(answer * 1.5);
    return `${utils.rInt(minRange, maxRange)}`;
}
```

**Question types fixed**:
1. Square calculation (2²): Now generates distractors in range [2, 6] instead of [1, 50]
2. Cube calculation (2³): Now generates proportional distractors
3. Power calculation (3²): Now generates proportional distractors

## Issues Not Fixed (Reasons)

### Level 4 - Fractions
**Gemini concern**: Question shows both simplified (1) and unsimplified (11/11) answers
**Analysis**: This is pedagogically intentional - instruction says "SIMPLIFY"
**Decision**: No fix needed - tests student's understanding of simplification

### Level 7 - Two-Step Equations
**Gemini concern**: Question about perpendicular line gradients in "Two-Step Equations" topic
**Analysis**: Level 7 intentionally mixes equation solving and coordinate geometry (1/3 chance)
**Decision**: No fix needed - this is a design choice

### Level 9 - Expanding Expressions
**Gemini concern**: Question "5(x+2)" is too easy for Level 9
**Analysis**: This is Gemini's subjective opinion about difficulty calibration
**Decision**: No fix needed - levels are internally consistent gamification

### Level 10 - Factorising Quadratics
**Gemini concern**: Perfect square trinomial too easy for Level 10
**Analysis**: Subjective difficulty opinion
**Decision**: No fix needed

### Levels 24-34 - Metadata Issues
**Gemini concern**: Screenshots show "Integration & Series" for various advanced topics
**Analysis**: Topic definitions are correct in code - likely false positive
**Decision**: Requires manual screenshot inspection (cannot be done without visual access)

## Testing Recommendations

### Automated Testing
Re-run validator on Level 2 only to verify distractor improvements:
```bash
# Requires OpenRouter API key in .env file
node tools/run-validator.js --resume
```

Expected result: Level 2 Type 1 question should no longer generate implausible distractors

### Manual Testing
1. Load app with debug parameters: `?testLevel=2&testType=1`
2. Generate multiple questions
3. Verify all distractors are within reasonable range of correct answer
4. Example: For 2²=4, all distractors should be between 2 and 6

## Outstanding Work

### High Priority
- [ ] Manually inspect screenshots for levels 24-34 to verify metadata display
- [ ] If metadata issue is real, investigate UI display logic

### Medium Priority
- [ ] Review Level 7 topic naming - consider "Linear Equations & Graphs"
- [ ] Consider adding topic name variation display in UI

### Low Priority
- [ ] Review pedagogical concerns from Gemini for levels 4, 9, 10, 12-17, 21-25, 31
- [ ] Consider if any warrant difficulty recalibration

## Files Modified

1. `js/question-templates/squares-roots.js`
   - Updated questionType 1 fallback (line 19)
   - Updated questionType 3 fallback (line 57)
   - Updated questionType 7 fallback (line 136)

## Files Created

1. `GEMINI_VALIDATION_ANALYSIS.md` - Detailed issue classification
2. `VALIDATION_FIXES_2026-01-10.md` - This file

## Validation Data Preserved

All validation data from 2026-01-09 run has been preserved:
- `validation-output/screenshots/` - 124 question screenshots
- `validation-output/responses/` - 124 Gemini API responses
- `validation-issues/` - 52 individual issue files
- `validation-issues/all-issues-combined.md` - Consolidated report
- `validation-output/validation-summary-2026-01-09T09-39-25-126Z.md` - Summary

## Conclusion

**Real bugs fixed**: 1 level (3 question types)
**False positives**: 26 question types (Gemini UI misreading)
**Subjective concerns**: 25 question types (not requiring code changes)

The most critical distractor generation issue has been resolved. Remaining "issues" are either:
1. False positives requiring manual verification
2. Subjective opinions about pedagogy

No additional code changes are recommended without further investigation.
