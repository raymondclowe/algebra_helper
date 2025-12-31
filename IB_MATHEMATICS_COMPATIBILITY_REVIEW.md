# IB Mathematics Compatibility Review

## Executive Summary

This document provides a comprehensive review of all question templates, instructions, explanations, and mathematical notation in the algebra_helper application to ensure complete alignment with IB Mathematics (SL/HL) standards.

## Review Scope

The review covers:
- 32 question template files in `js/question-templates/`
- Mathematical notation and symbol usage
- Instruction wording and command verbs
- Explanation text and pedagogical approach
- Vocabulary and terminology

---

## Key Findings and Required Changes

### 1. INSTRUCTION WORDING - IB Command Terms

**Issue**: Many instructions use informal or non-standard language that doesn't match IB examination command terms.

**IB Standard Command Terms** (from IB Mathematics Subject Guide):
- **Find**: Obtain an answer showing relevant stages in the working
- **Determine**: Obtain the only possible answer  
- **Calculate**: Obtain a numerical answer showing relevant stages in the working
- **Solve**: Obtain the answer(s) using algebraic and/or numerical and/or graphical methods
- **Hence**: Use the preceding work to obtain the required result
- **Show that**: Obtain the required result (possibly using information given) without the formality of proof
- **Verify**: Provide evidence that validates the result
- **Sketch**: Represent by means of a diagram or graph (labelled but not necessarily to scale)
- **Write down**: Obtain the answer(s), usually by extracting information
- **State**: Give a specific name, value or other brief answer without explanation or calculation
- **Express**: Obtain the answer in a particular form
- **Simplify**: Write in a simpler form

#### Current Non-IB Instructions → IB Compliant Replacements:

| File | Current Instruction | IB-Compliant Instruction | Status |
|------|-------------------|------------------------|--------|
| basic-equations.js | "Solve for x" | ✓ IB-compliant | OK |
| basic-equations.js | "Expand" | ✓ IB-compliant | OK |
| basic-equations.js | "Factorise" | "Factorize" (IB uses US spelling) | CHANGE |
| fractions.js | "Simplify the result" | "Simplify" | CHANGE |
| fractions.js | "Multiply and simplify" | "Calculate" or "Find" | CHANGE |
| fractions.js | "Divide and simplify" | "Calculate" or "Find" | CHANGE |
| trigonometry.js | "Calculate (use exact values)" | "Find the exact value" | CHANGE |
| vectors.js | "Add the vectors" | "Find **a** + **b**" or "Calculate" | CHANGE |
| vectors.js | "Multiply vector by scalar" | "Find k**v**" or "Calculate" | CHANGE |
| vectors.js | "Find the magnitude" | "Find \|**v**\|" or "Calculate \|**v**\|" | CHANGE |
| statistics.js | "Find the mean" | "Calculate the mean" | CHANGE |
| statistics.js | "Find the median" | ✓ IB-compliant | OK |
| statistics.js | "Find the mode" | ✓ IB-compliant | OK |
| statistics.js | "Find the range" | "Calculate the range" | CHANGE |
| calculus.js | "Integrate" | "Find ∫f(x) dx" | CHANGE |
| calculus.js | "Find the sum (if \|r\| < 1)" | "Given that \|r\| < 1, find the sum to infinity" | CHANGE |
| quadratics.js | "Solve for x (give smaller solution)" | "Write down the smaller value of x" | CHANGE |
| quadratics.js | "What value completes the perfect square?" | "Find the value that completes the square" | CHANGE |
| quadratics.js | "What is the discriminant b² - 4ac?" | "Calculate the value of the discriminant" | CHANGE |
| polynomials.js | "Simplify" | ✓ IB-compliant | OK |
| polynomials.js | "Is (x - a) a factor?" | "Determine whether (x - a) is a factor" | CHANGE |
| polynomials.js | "Find remainder when divided by (x - a)" | "Find the remainder when f(x) is divided by (x - a)" | CHANGE |
| complex-numbers.js | "Add the complex numbers" | "Find z₁ + z₂" or "Calculate" | CHANGE |
| advanced-integration.js | "What substitution u should we use?" | "State an appropriate substitution" | CHANGE |
| advanced-integration.js | "Express du in terms of x and dx" | "Find du in terms of x" | CHANGE |
| advanced-integration.js | "What is the result..." | "Find" or "Hence find" | CHANGE |
| advanced-trig.js | "Simplify using trig identity" | "Simplify" | CHANGE |
| advanced-trig.js | "Express in terms of sinθ and cosθ" | "Express in terms of sin θ and cos θ" | CHANGE |
| advanced-trig.js | "Convert to radians" | "Express in radians" | CHANGE |
| advanced-trig.js | "Find the smallest solution" | "Find the smallest positive solution" or "Write down the smallest value of x" | CHANGE |

### 2. MATHEMATICAL NOTATION

#### 2.1 Function Notation

**Issue**: Inconsistent use of function notation formatting

**IB Standard**:
- f(x) - always with parentheses
- f'(x) - derivative (prime notation)
- f⁻¹(x) - inverse function (superscript -1, not ^{-1})
- f''(x) - second derivative

**Current Status**: Generally correct but needs verification in Unicode conversion

#### 2.2 Brackets and Parentheses

**IB Standard**:
- Use of square brackets [ ] for intervals: [0, π/2]
- Round brackets ( ) for coordinates and function arguments
- Curly brackets { } for sets: {x: x > 0}

**Changes Needed**:
- Review inequality domain notation
- Ensure interval notation uses correct bracket types

#### 2.3 Inequality Symbols

**Current Status**: Using ≥, ≤ correctly
**IB Standard**: ✓ Correct

#### 2.4 Set Notation

**IB Standard**:
- ∈ (element of)
- ⊂ (subset)
- ∪ (union)
- ∩ (intersection)
- ℝ, ℤ, ℕ, ℚ (number sets)

**Changes Needed**: Add set notation questions if covering IB HL content

#### 2.5 Vectors

**Issue**: Vector notation needs bold or arrow notation

**IB Standard**:
- Vectors written in bold: **a**, **b**, **v**
- Or with arrow: →a (less common in IB)
- Column vector notation: ⎛a⎞
                          ⎝b⎠

**Current Status**: Using column matrix notation - acceptable but should reference as vectors in text

### 3. VOCABULARY AND TERMINOLOGY

#### 3.1 Spelling Conventions

**IB Uses US Spelling**:
- ❌ Factorise → ✅ Factorize
- ❌ Minimise → ✅ Minimize  
- ❌ Maximise → ✅ Maximize
- ❌ Analyse → ✅ Analyze

**Exception**: Some IB regions may accept both, but US spelling is standard in markschemes

#### 3.2 Mathematical Terms

**IB Standard Terminology**:
- "discriminant" ✓ (not "delta")
- "coefficient" ✓
- "constant term" ✓
- "leading coefficient" ✓
- "quadratic formula" ✓
- "remainder theorem" ✓
- "factor theorem" ✓
- "inverse function" ✓
- "composite function" ✓
- "domain" and "range" ✓
- "modulus" ✓ (for complex numbers, also "magnitude" for vectors)
- "argument" ✓ (for complex numbers)
- "gradient" ✓ (IB uses "gradient" not "slope")

**Changes Needed**:
- Verify consistent use of "gradient" vs "slope" throughout

#### 3.3 Phrases and Explanations

**Non-IB Informal Language** → **IB Formal Language**:
- "you should get" → "this gives"
- "Don't forget" → "Note that" or "Remember that"
- "we need to" → "it is necessary to" or simply state the action
- "let's" → "consider" or state directly
- "Common mistake:" → Better in explanation but keep neutral tone

### 4. EXPLANATION TEXT REVIEW

#### 4.1 Current Explanation Style

**Positive Aspects**:
- Step-by-step breakdown ✓
- References to mathematical rules ✓
- Mentions common errors (pedagogically valuable) ✓

**Issues to Address**:
1. **Tone**: Sometimes too conversational
2. **Vocabulary**: Need to use IB-standard terms consistently
3. **Method naming**: Should reference IB syllabus method names

#### 4.2 Recommended Changes

**Before**:
```
"To isolate x, we need to undo the multiplication by ${a}. We divide both sides..."
```

**After**:
```
"Divide both sides by ${a} to isolate x..."
```

**Before**:
```
"Don't forget the constant of integration!"
```

**After**:
```
"Note that C represents the constant of integration."
```

**Before**:
```
"This is one of the standard angles you should memorize."
```

**After**:
```
"This is a standard result for trigonometric values of special angles."
```

### 5. SPECIFIC FILE RECOMMENDATIONS

#### 5.1 basic-equations.js
- Change "Factorise" → "Factorize"
- Simplify explanations to be more concise and formal
- Review "undo the multiplication" language

#### 5.2 fractions.js
- Change "Simplify the result" → "Simplify"
- Change "Multiply and simplify" → "Calculate"
- Change "Divide and simplify" → "Calculate"

#### 5.3 trigonometry.js
- Change "Calculate (use exact values)" → "Find the exact value"
- Change "you should memorize" → "This is a standard result"
- Ensure degree symbol is properly formatted (°)

#### 5.4 calculus.js
- Change "Integrate" → "Find ∫x^n dx"
- Make integration constant explanation more formal
- For series: "Find the sum to infinity, given that |r| < 1"

#### 5.5 quadratics.js
- "give smaller solution" → "Write down the smaller value of x"
- Completing square: "Find the value that completes the square"
- Discriminant: "Calculate the value of the discriminant"

#### 5.6 vectors.js
- More formal instructions
- Use bold notation references in explanations
- "component" is correct IB term ✓

#### 5.7 statistics.js
- "Find" → "Calculate" for mean and range
- Explanations are generally good

#### 5.8 complex-numbers.js
- Check modulus vs magnitude consistency (modulus for complex, magnitude for vectors)
- "i² = -1" notation is correct ✓

#### 5.9 polynomials.js
- "Is (x-a) a factor?" → "Determine whether (x-a) is a factor of f(x)"
- Factor theorem and remainder theorem references are good ✓

#### 5.10 advanced-calculus.js
- Chain rule, product rule - terminology correct ✓
- "Find f'(x)" format is correct ✓
- Critical point terminology correct ✓

#### 5.11 advanced-integration.js
- Substitution questions need more formal phrasing
- "What substitution..." → "State an appropriate substitution"
- Integration by parts notation is correct ✓

#### 5.12 advanced-trig.js
- Spacing in "sin θ" - ensure space between function and variable
- Radian conversion: "Express in radians" 
- "smallest solution" → "smallest positive value" or "smallest value in the given domain"

#### 5.13 advanced-probability.js
- Notation P(A∩B), P(B|A) is correct IB notation ✓
- "Find P(B|A)" format is good
- Expected value E(X) notation correct ✓

#### 5.14 hypothesis-testing.js
- Need to review for IB-compliant hypothesis testing terminology
- p-value, significance level, null hypothesis - check standard phrasing

#### 5.15 differential-equations.js
- Review for IB standard differential equations notation
- Separation of variables terminology

### 6. CALCULATOR USAGE NOTATION

**IB Specification**: Questions should indicate if calculator is allowed/required

**Current**: Uses `calc: false` for non-calculator questions ✓

**Recommendation**: This is internal only. In actual question display, consider adding notation:
- "without the use of a calculator" for non-calc questions (if displayed to students)

---

## PRIORITY CHANGES SUMMARY

### High Priority (Affects Many Questions):
1. ✅ Change "Factorise" → "Factorize" globally
2. ✅ Update informal instruction language to IB command terms
3. ✅ Make explanations more formal and concise
4. ✅ Ensure consistent use of IB mathematical terminology

### Medium Priority (Specific Topics):
1. ✅ Trigonometry: "exact value" language
2. ✅ Calculus: Integration instruction formatting
3. ✅ Quadratics: Discriminant and completing square instructions
4. ✅ Vectors: Formal notation in explanations

### Low Priority (Fine-tuning):
1. ✅ Spacing in trigonometric functions (sin θ not sinθ)
2. ✅ Explanation tone adjustments
3. ✅ Remove overly casual language

---

## IMPLEMENTATION PLAN

### Phase 1: Instruction Wording (Files: 15)
- basic-equations.js
- fractions.js  
- trigonometry.js
- calculus.js
- quadratics.js
- vectors.js
- statistics.js
- complex-numbers.js
- polynomials.js
- advanced-trig.js
- advanced-integration.js
- complex-polar.js
- sequences-series.js
- differential-equations.js
- hypothesis-testing.js

### Phase 2: Explanation Text (Files: All)
- Review and update informal language
- Ensure mathematical terminology consistency
- US spelling corrections

### Phase 3: Notation Review (Files: All)
- Function notation
- Vector notation
- Set notation (if applicable)

### Phase 4: Final Verification
- Cross-check against IB syllabus documents
- Verify all command terms are used correctly
- Ensure explanations match IB markscheme style

---

## CONCLUSION

The algebra_helper application has strong foundational content that aligns well with IB Mathematics curriculum. The main changes needed are:

1. **Instruction language**: Update to use IB command terms consistently
2. **Explanation tone**: Make more formal and IB-aligned
3. **Spelling**: US spelling for verbs (factorize, not factorise)
4. **Vocabulary**: Ensure all mathematical terms match IB standards

These changes will ensure students are exposed to authentic IB examination language and formatting, better preparing them for actual IB assessments.

## FILES TO MODIFY

Total: 32 question template files + explanation modal

Most critical files (address first):
1. basic-equations.js - Core algebra
2. quadratics.js - IB SL/HL core
3. calculus.js - IB HL core  
4. trigonometry.js - IB SL/HL core
5. vectors.js - IB SL/HL core
6. fractions.js - Foundational
7. polynomials.js - IB SL/HL
8. complex-numbers.js - IB HL
9. statistics.js - IB SL/HL core
10. All advanced-*.js files - IB HL specific
