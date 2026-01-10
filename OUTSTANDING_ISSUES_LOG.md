# Outstanding Issues Requiring Manual Intervention

**Date**: 2026-01-10
**Based on**: Gemini validation run 2026-01-09

## Category 1: Metadata/UI Verification Needed (26 issues)

**Issue**: Gemini reports seeing "Integration & Series" in screenshots for wrong levels

**Affected Levels**: 24, 26, 27, 28, 29, 30, 33, 34

**Details**:
- Level 24 - Advanced Probability (0/3 valid) - 3 question types flagged
- Level 26 - Proof by Induction (0/1 valid) - 1 question type flagged
- Level 27 - Proof by Contradiction (0/1 valid) - 1 question type flagged
- Level 28 - Matrix Algebra (0/6 valid) - 6 question types flagged
- Level 29 - 3D Vectors (0/5 valid) - 5 question types flagged
- Level 30 - Complex Numbers (Polar) (0/5 valid) - 5 question types flagged
- Level 33 - Probability Distributions (2/6 valid) - 4 question types flagged
- Level 34 - Hypothesis Testing (0/6 valid) - 6 question types flagged

**Root Cause Analysis**:
- Topic definitions in `js/topic-definitions.js` are CORRECT
- Each level maps to its intended topic name
- Either:
  a) Gemini is misreading/hallucinating the UI, OR
  b) There's an actual UI display bug during screenshot capture

**Required Action**:
1. Manually inspect screenshots in `validation-output/screenshots/` for levels 24-34
2. Check if header actually shows wrong topic or if Gemini hallucinated
3. If UI bug exists, investigate:
   - `algebra-helper.html` - header rendering
   - `js/ui.js` - UI update logic
   - `tools/screenshot-generator.js` - screenshot capture logic

**Example Screenshots to Check**:
- `validation-output/screenshots/level-28-type1.png` - Should show "Matrix Algebra", Gemini says "Integration & Series"
- `validation-output/screenshots/level-34-type1.png` - Should show "Hypothesis Testing", Gemini says "Integration & Series"

## Category 2: Pedagogical Review Recommended (25 issues)

These are subjective concerns from Gemini about question design. Not bugs, but worth reviewing.

### Level 4 - Fractions (1 issue)
**Issue**: Question has both simplified and unsimplified answer as options
**Gemini concern**: Could confuse students
**Analysis**: Intentional - tests if student understands "SIMPLIFY" instruction
**Recommendation**: Monitor student data - if pattern of errors, consider revising

### Level 7 - Two-Step Equations (1 issue)
**Issue**: Perpendicular line gradient question in "Two-Step Equations" topic
**Gemini concern**: Topic name doesn't match question content
**Analysis**: Level 7 intentionally mixes topics (design choice)
**Recommendation**: Consider more generic topic name like "Linear Equations & Graphs"

### Level 9 - Expanding Expressions (1 issue)
**Issue**: Question "5(x+2)" flagged as too easy
**Gemini concern**: Difficulty doesn't match "Level 9"
**Analysis**: Subjective - levels are internal gamification, not IB grades
**Recommendation**: No action unless user feedback indicates issue

### Level 10 - Factorising Quadratics (1 issue)
**Issue**: Perfect square trinomial flagged as too easy
**Gemini concern**: Too simple for Level 10
**Analysis**: Subjective difficulty opinion
**Recommendation**: No action unless user feedback indicates issue

### Level 12 - Polynomials (2 issues)
**Files**: `issue-level-12-Polynomials-2026-01-09T09-05-41-252Z.md`, `issue-level-12-Polynomials-2026-01-09T09-06-08-334Z.md`
**Recommendation**: Review individual issue files for specific concerns

### Level 13 - Exponentials & Logarithms (1 issue)
**File**: `issue-level-13-Exponentials---Logarithms-2026-01-09T09-06-47-308Z.md`
**Recommendation**: Review issue file

### Level 14 - Sequences & Series (2 issues)
**Files**: `issue-level-14-Sequences---Series-2026-01-09T09-08-44-117Z.md`, `issue-level-14-Sequences---Series-2026-01-09T09-09-22-217Z.md`
**Recommendation**: Review issue files

### Level 15 - Functions (1 issue)
**File**: `issue-level-15-Functions-2026-01-09T09-10-50-754Z.md`
**Recommendation**: Review issue file

### Level 16 - Basic Trigonometry (1 issue)
**File**: `issue-level-16-Basic-Trigonometry-2026-01-09T09-11-16-972Z.md`
**Recommendation**: Review issue file

### Level 17 - Advanced Trigonometry (2 issues)
**Files**: `issue-level-17-Advanced-Trigonometry-2026-01-09T09-12-25-890Z.md`, `issue-level-17-Advanced-Trigonometry-2026-01-09T09-13-19-663Z.md`
**Recommendation**: Review issue files

### Level 21 - Advanced Calculus (2 issues)
**Files**: `issue-level-21-Advanced-Calculus-2026-01-09T09-17-07-063Z.md`, `issue-level-21-Advanced-Calculus-2026-01-09T09-17-32-783Z.md`
**Recommendation**: Review issue files

### Level 22 - Statistics (2 issues)
**Files**: `issue-level-22-Statistics-2026-01-09T09-18-40-250Z.md`, `issue-level-22-Statistics-2026-01-09T09-19-30-275Z.md`
**Recommendation**: Review issue files

### Level 23 - Basic Probability (1 issue)
**File**: `issue-level-23-Basic-Probability-2026-01-09T09-20-36-623Z.md`
**Recommendation**: Review issue file

### Level 25 - Integration & Series (1 issue)
**File**: `issue-level-25-Integration---Series-2026-01-09T09-22-47-168Z.md`
**Recommendation**: Review issue file

### Level 31 - Advanced Integration (1 issue)
**File**: `issue-level-31-Advanced-Integration-2026-01-09T09-33-00-125Z.md`
**Recommendation**: Review issue file

## Summary Statistics

| Category | Count | Priority | Action Required |
|----------|-------|----------|-----------------|
| Real bugs (fixed) | 3 | High | ✅ Complete |
| Metadata/UI issues | 26 | High | 🔍 Manual inspection |
| Pedagogical concerns | 25 | Low | 📚 Optional review |
| **Total** | **54** | - | - |

## Next Steps

1. **Immediate** (if visual access available):
   - [ ] Open screenshots for levels 24-34
   - [ ] Verify if topic headers are correct or if Gemini was wrong
   - [ ] Document findings

2. **Short-term**:
   - [ ] Re-run validator with OpenRouter API key to verify Level 2 fixes
   - [ ] Create GitHub issue for metadata verification if needed

3. **Long-term**:
   - [ ] Review pedagogical concerns in low-priority issues
   - [ ] Consider user feedback on difficulty calibration
   - [ ] Monitor for patterns in student error data

## Files Referenced

All issue files are in `validation-issues/` directory:
- `all-issues-combined.md` - Consolidated 220KB report
- Individual `issue-level-*.md` files for each flagged question

All validation data preserved in `validation-output/`:
- `screenshots/` - 124 PNG files
- `responses/` - 124 JSON API responses
- `validation-summary-2026-01-09T09-39-25-126Z.md` - Summary report
