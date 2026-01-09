# IB Math AA Syllabus Coverage - Gap Summary

**Quick Reference Guide**  
**Last Updated:** 2026-01-08

---

## Overview

**Current Status:** ✅ Strong core coverage across 34 levels  
**Identified Gaps:** 35 enhancement opportunities (31 now implementable using SVG)  
**Priority Items:** 12 high-priority core topics + 5 graphing topics

**Key Insight:** Graphing questions are now feasible using SVG/JavaScript (same approach as trig diagram generator)

---

## Phase 1: High Priority Core Topics (Recommended for Immediate Implementation)

### Topics to Add

| # | Topic | Target Level | Effort | Impact |
|---|-------|--------------|--------|--------|
| 1 | Financial applications (compound interest, depreciation) | 13-14 | Medium | High |
| 2 | Parallel/perpendicular lines | 6-7 | Low | High |
| 3 | Quadratic inequalities | 10-11 | Medium | High |
| 4 | Rational functions & asymptotes | 14-15 | Medium | High |
| 5 | Graph transformations | 14-15 | Medium | High |
| 6 | Sine and cosine rule | 15-16 | Medium | High |
| 7 | Arc length and sector area | 15-16 | Low | High |
| 8 | Tangent and normal lines | 19-20 | Low | High |
| 9 | Definite integrals & area | 24-25, 30-31 | Medium | High |
| 10 | Standard deviation & variance | 21-22 | Low | High |
| 11 | Linear regression & correlation | 21-22 | Medium | High |
| 12 | Quadratic vertex form | 10-11 | Low | Medium |

### Implementation Approach

**Iteration 1** (Topics 1-3): Financial apps, lines, inequalities  
**Iteration 2** (Topics 4-5, 12): Functions and transformations  
**Iteration 3** (Topics 6-7): Trigonometry rules and circles  
**Iteration 4** (Topics 8-11): Calculus and statistics

**Total Estimated Questions:** 75-90 new question types

---

## Phase 2: Medium Priority HL Topics

### Topics to Add

| # | Topic | Target Level | Notes |
|---|-------|--------------|-------|
| 13 | Permutations P(n,r) | 22-23 | Distinguish from combinations |
| 14 | 3×3 linear systems | 28 | Unique/infinite/no solution |
| 15 | Modulus equations | 7-8, 14-15 | \|x\| = a, \|x\| < a |
| 16 | Sum/product of roots | 11-12 | Polynomial roots |
| 17 | Reciprocal trig (sec, cosec, cot) | 16-17 | With identities |
| 18 | Compound angle identities | 16-17 | sin(A±B), cos(A±B), tan(A±B) |
| 19 | Vector/plane equations | 28-29 | r = a + λb, r·n = d |
| 20 | Bayes' theorem | 23-24 | Up to 3 events |
| 21 | Quotient rule | 20-21 | d/dx[u/v] |
| 22 | L'Hôpital's rule | 20-21 | Indeterminate forms |
| 23 | Implicit differentiation | 20-21 | dy/dx for implicit equations |
| 24 | Maclaurin series | 30-31 | e^x, sin x, cos x |
| 25 | Volumes of revolution | 30-31 | π∫y²dx |
| 26 | Related rates | 20-21 | Chain rule applications |

**Total Estimated Questions:** 50-65 new question types

---

## Phase 3: Visual/Graphing Topics (Using SVG)

### Topics to Add

| # | Topic | Target Level | Implementation |
|---|-------|--------------|----------------|
| 27 | Function graphing & reading | 14-15 | SVG like trig diagrams |
| 28 | Trig function graphs | 16-17 | SVG rendering of sin/cos/tan |
| 29 | Data visualization | 21-22 | SVG histograms, box plots |
| 30 | Graphical equation solving | 14-15 | Display function intersections |
| 31 | Derivative graph relationships | 20-21 | f(x) and f'(x) connections |

**Total Estimated Questions:** 20-30 new question types

**Implementation Note:** These use the same SVG approach as the existing trig diagram generator (js/question-templates/trig-diagram-generator.js), which successfully creates interactive visual problems.

---

## Phase 4: Lower Priority Enhancements

### Topics to Add

| # | Topic | Target Level | Priority Reason |
|---|-------|--------------|-----------------|
| 32 | Counterexample proofs | 26-27 | Less frequently tested |
| 33 | Ambiguous case (sine rule) | 16-17 | Narrow application |
| 34 | Continuous random variables | 32-33 | Advanced HL |
| 35 | Euler's method for DEs | 31-32 | Numerical, less algebraic |

**Total Estimated Questions:** 15-20 new question types

---

## Current Strengths (No Changes Needed)

### Excellent Coverage Areas

✅ **Number and Algebra**
- Arithmetic sequences and series
- Geometric sequences and series  
- Exponents and logarithms
- Binomial theorem
- Partial fractions
- Complex numbers (Cartesian and polar)

✅ **Algebra and Equations**
- Linear equations (simple and two-step)
- Quadratic equations (factoring, solving, discriminant)
- Polynomials (factor/remainder theorems)
- Inequalities (basic)

✅ **Proof Techniques (HL)**
- Proof by induction
- Proof by contradiction

✅ **Advanced HL Topics**
- Matrix algebra (operations, determinants, inverses)
- 3D vectors (including cross product)
- Complex polar form and De Moivre's theorem
- Advanced integration (substitution, integration by parts)
- Differential equations (separation of variables)
- Probability distributions (binomial, normal, standardization)
- Hypothesis testing

✅ **Calculus**
- Differentiation (power rule, chain rule, product rule)
- Integration basics
- Second derivatives
- Critical points

✅ **Probability and Statistics**
- Basic probability concepts
- Conditional probability and independence
- Expected value
- Descriptive statistics (mean, median, mode, range)

---

## Quick Wins (Low Effort, High Impact)

These can be implemented quickly with immediate benefit:

1. **Parallel/perpendicular lines** (Level 6-7)
   - 3-5 question types
   - Simple gradient calculations

2. **Arc length and sector area** (Level 15-16)
   - 4-6 question types
   - Direct formula application

3. **Tangent and normal lines** (Level 19-20)
   - 4-6 question types
   - Uses existing differentiation skills

4. **Standard deviation & variance** (Level 21-22)
   - 5-8 question types
   - Builds on existing statistics

5. **Quadratic vertex form** (Level 10-11)
   - 3-5 question types
   - Simple algebraic manipulation

**Total for Quick Wins:** ~20-30 new question types

---

## Implementation Guidelines

### For Each New Topic

1. **Research:** Review IB specimen papers and textbooks
2. **Design:** Create 5-10 question variations
3. **Distractors:** Generate plausible incorrect answers
4. **Test:** Use validation tool (tools/README.md)
5. **Document:** Update IB_HL_AA_COVERAGE.md
6. **Deploy:** Add to appropriate question template file

### Quality Standards

- ✅ Align with IB syllabus language
- ✅ Correct calculations and solutions
- ✅ Plausible distractors based on common errors
- ✅ Clean LaTeX rendering
- ✅ Clear, unambiguous wording
- ✅ Appropriate difficulty for level

### File Locations

- **Core questions:** `/js/question-templates/[topic].js`
- **Coverage docs:** `IB_HL_AA_COVERAGE.md`
- **Topic mapping:** `js/topic-definitions.js`
- **Generator routing:** `js/generator.js`

---

## Resources

### Related Documentation

- **Full Analysis:** `SYLLABUS_COVERAGE_REVIEW.md` (detailed 35-topic breakdown)
- **Current Coverage:** `IB_HL_AA_COVERAGE.md` (existing question types)
- **Pedagogy:** `PEDAGOGY.md` (learning principles)
- **Validation:** `tools/README.md` (testing procedures)

### IB Resources

- IB Math AA Subject Guide (official syllabus)
- IB Specimen Papers (question examples)
- IB Mark Schemes (answer formats)

---

## Progress Tracking

### Phase 1 Status (0/12 Complete)

- [ ] Financial applications
- [ ] Parallel/perpendicular lines
- [ ] Quadratic inequalities
- [ ] Rational functions
- [ ] Graph transformations
- [ ] Sine and cosine rule
- [ ] Arc length and sector area
- [ ] Tangent and normal lines
- [ ] Definite integrals
- [ ] Standard deviation & variance
- [ ] Linear regression
- [ ] Quadratic vertex form

### Phase 2 Status (0/14 Complete)

- [ ] Permutations
- [ ] 3×3 systems
- [ ] Modulus equations
- [ ] Sum/product of roots
- [ ] Reciprocal trig functions
- [ ] Compound angle identities
- [ ] Vector/plane equations
- [ ] Bayes' theorem
- [ ] Quotient rule
- [ ] L'Hôpital's rule
- [ ] Implicit differentiation
- [ ] Maclaurin series
- [ ] Volumes of revolution
- [ ] Related rates

### Phase 3 Status (0/9 Complete)

- [ ] Counterexample proofs
- [ ] 3D solid geometry
- [ ] Ambiguous case
- [ ] Quadratic trig equations
- [ ] Trig symmetry
- [ ] Kinematics
- [ ] Continuous RVs
- [ ] Euler's method
- [ ] Line-plane intersections

**Note:** Several items from previous "Phase 3" have been reassigned to Phase 4 and completed.

---

## Contact

For questions about this coverage plan or to contribute new question types:
- Open an issue on GitHub
- See CONTRIBUTING.md (if available)
- Contact: raymond@clowe.com (adjust as needed)

---

**Last Review:** 2026-01-08  
**Next Review:** 2026-04-08 (quarterly)
