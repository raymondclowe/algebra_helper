# Debug and Testing Parameters

This document describes URL parameters that can be used for testing, debugging, and validating specific question types.

## Overview

When developing or testing specific features, you can use URL parameters to bypass normal app flow (calibration, name prompts, etc.) and jump directly to specific levels or question types.

## Available Parameters

### `testLevel=N`
Forces the app to generate questions at level N (1-34+).

**Effect:**
- Bypasses calibration phase
- Bypasses name prompt
- Disables spaced repetition
- Enables debug mode with visual indicators
- Shows testing mode banner

**Example:**
```
?testLevel=16
```
Jumps directly to level 16 (Trigonometry).

---

### `testType=M`
Forces a specific question type M within a level. Must be used with `testLevel`.

**Effect:**
- Generates only the specified question type variant
- Question type numbers vary by level (typically 1-6)

**Example:**
```
?testLevel=4&testType=2
```
Jumps to level 4 (Fractions) and generates only type 2 questions (fraction multiplication).

---

### `forceDiagram=true|false`
For trigonometry levels (15-17), forces diagram or text/formula questions.

**Effect:**
- `forceDiagram=true` - Only generates diagram-based triangle questions with SVG rendering
- `forceDiagram=false` - Only generates text/formula questions (e.g., sin(30°), cos(45°))
- Works for both basic trig (level 15-16) and advanced trig (level 16-17)

**Examples:**
```
?testLevel=16&forceDiagram=true
```
Level 16 (Trigonometry) with **only diagram questions** (right triangles, scalene triangles with sine/cosine rule).

```
?testLevel=16&forceDiagram=false
```
Level 16 (Trigonometry) with **only text/formula questions** (sin, cos, tan of standard angles).

```
?testLevel=17&forceDiagram=true
```
Level 17 (Advanced Trigonometry) with **only diagram questions**.

---

### `skipCalibration=true`
Skips calibration and goes directly to learning mode at the current stored level.

**Effect:**
- Bypasses calibration phase
- Uses the level from local storage
- Keeps other normal functionality

**Example:**
```
?skipCalibration=true
```

---

### `testMode=true`
Enables testing mode without forcing a specific level.

**Effect:**
- Enables debug mode
- Shows testing indicators
- Does not bypass calibration or force level

**Example:**
```
?testMode=true
```

---

## Combining Parameters

Multiple parameters can be combined for precise testing:

```
?testLevel=16&forceDiagram=true&testType=1
```
Forces level 16 trigonometry, diagram questions only, specific type variant.

```
?testLevel=17&forceDiagram=false
```
Forces level 17 advanced trigonometry, text/formula questions only.

---

## Testing Scenarios

### Test Trig Diagrams on Mobile

To test how triangle diagrams appear on mobile devices:

```
?testLevel=16&forceDiagram=true
```

Then resize browser to mobile dimensions (e.g., 375x667) and refresh multiple times to see different triangle variations.

### Test Calculator vs Non-Calculator

Trig diagram questions automatically vary between calculator and non-calculator modes:
- **Calculator mode**: Random numbers, answers to 3 significant figures, calculator icon (📱)
- **Non-calculator mode**: Pythagorean triples or special angles (30°, 45°, 60°), exact integer answers, pencil icon (✏️)

```
?testLevel=16&forceDiagram=true
```

Refresh the page multiple times to see both calculator and non-calculator variations.

### Test Specific Level Types

Each level has different question types. Use `testType` to test specific variants:

```
?testLevel=11&testType=1  # Quadratics - solving by factoring
?testLevel=11&testType=2  # Quadratics - completing the square
?testLevel=11&testType=3  # Quadratics - discriminant
```

---

## Visual Indicators

When testing parameters are active, you'll see:

1. **Purple banner at top** showing testing mode and parameters
2. **Debug markers** (✓ DEBUG) next to correct answers
3. **Console logs** showing testing mode status
4. **Data attributes** on body element for automation

---

## Browser Console

Check the browser console for detailed logging:
- Testing mode activation
- Forced level/type/diagram settings
- Question generation details

---

## For Automated Testing

The app sets data attributes when in testing mode:
- `data-testing-mode="true"`
- `data-forced-level="16"`
- `data-forced-type="2"` (if testType is set)
- `data-forced-diagram="true"` (if forceDiagram is set)

These can be used by automation tools (Puppeteer, Playwright, etc.) to verify correct behavior.

---

## Notes

- Testing mode expires after 10 minutes (auto-disables debug mode)
- Parameters are checked on page load
- Spaced repetition is disabled in testing mode
- All parameters are case-sensitive
- Parameters work with both `algebra-helper.html` and `index.html`

---

## Examples for Quick Copy-Paste

### Trigonometry Testing
```
# Basic trig - diagram questions
http://localhost:8080/algebra-helper.html?testLevel=16&forceDiagram=true

# Basic trig - text/formula questions
http://localhost:8080/algebra-helper.html?testLevel=16&forceDiagram=false

# Advanced trig - diagram questions
http://localhost:8080/algebra-helper.html?testLevel=17&forceDiagram=true

# Advanced trig - text/formula questions
http://localhost:8080/algebra-helper.html?testLevel=17&forceDiagram=false
```

### Other Levels
```
# Fractions
http://localhost:8080/algebra-helper.html?testLevel=4

# Quadratics
http://localhost:8080/algebra-helper.html?testLevel=11

# Calculus
http://localhost:8080/algebra-helper.html?testLevel=20
```
