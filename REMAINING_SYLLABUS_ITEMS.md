# Remaining Syllabus Items - Implementation Guide

**Date:** 2026-01-09  
**Purpose:** Comprehensive list of algebra syllabus items not yet covered, with implementation recommendations

---

## Executive Summary

This document provides a detailed breakdown of the **28 remaining syllabus items** that have been identified but not yet fully implemented in the Algebra Helper app. These items are organized by implementation phase and priority.

### Current Status
- **Total Identified Gaps:** 35 topics
- **Completed:** 10 topics (29%)
- **Remaining:** 28 topics (71%)
- **Estimated Remaining Questions:** ~159 questions

### Implementation Timeline
- **Phase 1 (High Priority):** 9 topics, ~62 questions - Target: Q2-Q3 2026
- **Phase 2 (Medium Priority):** 14 topics, ~72 questions - Target: Q4 2026 - Q2 2027
- **Phase 3 (Visual/SVG):** 5 topics, ~25 questions - Target: Q3 2027
- **Phase 4 (Lower Priority):** Complete ✅

---

## Phase 1: High Priority Core Topics

These are essential IB Math AA topics that fill critical gaps in the current curriculum coverage. They are algebraic in nature and fit well with the app's multiple-choice format.

### 1. Rational Functions & Asymptotes
**Level:** 14-15  
**Questions to Add:** 7  
**IB Reference:** SL/HL Topic 2.8, 2.13  
**Priority:** HIGH  
**Effort:** Medium

#### What to Implement
- Simplifying rational expressions (cancel common factors)
- Finding asymptotes (vertical: denominator = 0, horizontal: compare degrees)
- Evaluating f(x) = (ax+b)/(cx+d) at specific x values
- Identifying domain restrictions
- Finding holes vs asymptotes

#### Example Questions
1. "Simplify: (x²-9)/(x-3)" → x+3 (for x≠3)
2. "Find vertical asymptote of f(x) = (2x+1)/(x-5)" → x = 5
3. "Find horizontal asymptote of f(x) = (3x+2)/(x-1)" → y = 3
4. "What is the domain of f(x) = 1/(x²-4)?" → x ≠ ±2
5. "Evaluate f(x) = (x+3)/(x-2) at x = 5" → 8/3

#### Implementation Notes
- Add to `/js/question-templates/functions.js`
- Use LaTeX fractions: `\frac{numerator}{denominator}`
- Distractors: common errors like forgetting domain restrictions, incorrect asymptote calculations

---

### 2. Graph Transformations
**Level:** 14-15  
**Questions to Add:** 8  
**IB Reference:** SL/HL Topic 2.11  
**Priority:** HIGH  
**Effort:** Medium

#### What to Implement
- Vertical translations: f(x) + k
- Horizontal translations: f(x - h)
- Vertical stretches: a·f(x)
- Horizontal stretches: f(x/b)
- Reflections: -f(x) and f(-x)
- Combined transformations

#### Example Questions
1. "If f(x) = x², what is f(x) + 3?" → x² + 3 (vertical shift up 3)
2. "If f(x) = x², what is f(x - 2)?" → (x-2)² (horizontal shift right 2)
3. "If f(x) = x², what is 2f(x)?" → 2x² (vertical stretch by 2)
4. "If f(x) = |x|, what is -f(x)?" → -|x| (reflection in x-axis)
5. "Transform f(x) = x² to get g(x) = (x-1)² + 2" → right 1, up 2
6. "If g(x) = f(x-3) + 2 and f(x) = x², find g(x)" → (x-3)² + 2

#### Implementation Notes
- Add to `/js/question-templates/functions.js`
- Use clear descriptions of transformations
- Distractors: confusing left/right, up/down, or order of operations

---

### 3. Quadratic Vertex Form
**Level:** 10-11  
**Questions to Add:** 5  
**IB Reference:** SL/HL Topic 2.6  
**Priority:** HIGH  
**Effort:** Low (Quick Win)

#### What to Implement
- Converting standard form to vertex form: ax² + bx + c → a(x-h)² + k
- Identifying vertex coordinates (h, k)
- Finding axis of symmetry x = h
- Converting vertex form to standard form
- Using vertex form to sketch parabola features

#### Example Questions
1. "Convert y = x² + 6x + 5 to vertex form" → (x+3)² - 4
2. "Find the vertex of y = x² - 4x + 7" → (2, 3)
3. "What is the axis of symmetry of y = (x-5)² + 3?" → x = 5
4. "Convert y = 2(x+1)² - 3 to standard form" → 2x² + 4x - 1
5. "The vertex of a parabola is (3, -2). Write in vertex form (a=1)" → (x-3)² - 2

#### Implementation Notes
- Add to `/js/question-templates/quadratics.js`
- Link to completing the square (already covered)
- Distractors: sign errors, incorrect vertex coordinates

---

### 4. Sine and Cosine Rule
**Level:** 15-16  
**Questions to Add:** 8  
**IB Reference:** SL/HL Topic 3.2  
**Priority:** HIGH  
**Effort:** Medium

#### What to Implement
- Sine rule: a/sin(A) = b/sin(B) = c/sin(C)
- Cosine rule: c² = a² + b² - 2ab·cos(C)
- Finding unknown sides
- Finding unknown angles
- Choosing which rule to use (given information)
- Triangle area: ½ab·sin(C)

#### Example Questions
1. "Triangle: A=30°, B=45°, a=10. Find b using sine rule" → b = 10√2
2. "Triangle: a=5, b=7, C=60°. Find c using cosine rule" → c = √39
3. "Triangle: a=8, b=10, c=12. Find angle A using cosine rule" → cos⁻¹(0.6)
4. "Which rule: Given two sides and included angle?" → Cosine rule
5. "Triangle: a=6, b=8, C=90°. Find area using ½ab·sin(C)" → 24
6. "Triangle: A=40°, a=5, b=7. Find angle B" → sin⁻¹(7sin40°/5)

#### Implementation Notes
- Add to `/js/question-templates/trigonometry.js` or new file
- Use degree mode for consistency with existing trig questions
- Distractors: using wrong rule, calculation errors, angle confusion

---

### 5. Definite Integrals & Area Under Curves
**Level:** 24-25, 30-31  
**Questions to Add:** 8  
**IB Reference:** SL/HL Topic 5.11, 6.3  
**Priority:** HIGH  
**Effort:** Medium

#### What to Implement
- Evaluating ∫[a,b] f(x)dx using power rule
- Fundamental theorem: F(b) - F(a)
- Area under curve (positive regions)
- Area between curves
- Definite integral properties (linearity, additivity)
- Interpreting area in context

#### Example Questions
1. "Evaluate ∫[0,2] x² dx" → 8/3
2. "Evaluate ∫[1,3] (2x+1) dx" → 10
3. "Find area under y=x² from x=0 to x=3" → 9
4. "∫[0,4] 3dx = ?" → 12
5. "If ∫[0,2] f(x)dx = 5 and ∫[2,4] f(x)dx = 3, find ∫[0,4] f(x)dx" → 8
6. "Evaluate ∫[-1,1] x³ dx (odd function)" → 0

#### Implementation Notes
- Add to `/js/question-templates/advanced-integration.js`
- Build on existing indefinite integration (Level 24-25)
- Distractors: forgetting to subtract F(a), sign errors, wrong limits

---

### 6. Linear Regression & Correlation
**Level:** 21-22  
**Questions to Add:** 8  
**IB Reference:** SL/HL Topic 4.4, 4.10  
**Priority:** HIGH  
**Effort:** Medium

#### What to Implement
- Pearson's correlation coefficient (r)
- Interpreting r values (-1 to 1)
- Line of best fit: y = ax + b
- Using regression line for predictions
- Coefficient of determination (r²)
- Distinguishing correlation vs causation

#### Example Questions
1. "If r = 0.95, what does this indicate?" → Strong positive correlation
2. "If r = -0.8, describe the correlation" → Strong negative correlation
3. "Regression line: y = 2x + 3. Predict y when x = 5" → 13
4. "If r = 0, what does this mean?" → No linear correlation
5. "r² = 0.64. What percentage of variation is explained?" → 64%
6. "Which r indicates strongest correlation: 0.3, -0.7, 0.5?" → -0.7
7. "Regression y on x: y = 1.5x + 2. Find y when x = 10" → 17

#### Implementation Notes
- Add to `/js/question-templates/statistics.js`
- Use conceptual questions (not calculations requiring datasets)
- Distractors: confusing positive/negative correlation, causation claims

---

## Phase 2: Medium Priority HL Topics

These are more advanced IB Math HL AA topics. While important for HL students, they are less central than Phase 1 topics.

### 7. Permutations P(n,r)
**Level:** 22-23  
**Questions to Add:** 4  
**IB Reference:** HL Topic 1.10  
**Priority:** MEDIUM  
**Effort:** Low

#### What to Implement
- Permutation formula: P(n,r) = n!/(n-r)!
- Distinguishing permutations from combinations
- Order matters vs order doesn't matter
- Calculating P(n,r) for specific values

#### Example Questions
1. "How many ways to arrange 3 books from 5?" → P(5,3) = 60
2. "P(7,2) = ?" → 42
3. "When do we use permutations vs combinations?" → Order matters
4. "10 runners, 3 medals. How many outcomes?" → P(10,3) = 720

#### Implementation Notes
- Add to `/js/question-templates/probability.js`
- Contrast with existing combination questions
- Distractors: using C(n,r) instead, factorial errors

---

### 8. 3×3 Linear Systems
**Level:** 28  
**Questions to Add:** 5  
**IB Reference:** HL Topic 1.16  
**Priority:** MEDIUM  
**Effort:** Medium

#### What to Implement
- Row reduction (Gaussian elimination)
- Identifying unique solution, infinite solutions, no solution
- Using augmented matrices
- Interpreting coefficient matrix determinant

#### Example Questions
1. "System: x+y+z=6, 2x+y+z=7, x+2y+z=8. What is x+y+z?" → 6 (given)
2. "If det(A) ≠ 0 for 3×3 system, what does this mean?" → Unique solution
3. "If det(A) = 0, what are the possibilities?" → No solution or infinite solutions
4. "Solve: x+y+z=1, 2x+2y+2z=2. How many solutions?" → Infinite

#### Implementation Notes
- Add to `/js/question-templates/matrix-algebra.js`
- Focus on conceptual understanding, not manual calculations
- Distractors: wrong interpretation of determinant, solution set errors

---

### 9. Modulus Equations and Inequalities
**Level:** 7-8, 14-15  
**Questions to Add:** 6  
**IB Reference:** HL Topic 2.16  
**Priority:** MEDIUM  
**Effort:** Medium

#### What to Implement
- Solving |x| = a → x = ±a
- Solving |x| < a → -a < x < a
- Solving |x| > a → x < -a or x > a
- Solving |x - h| = a (shifted)
- Solving equations like |2x+1| = 5

#### Example Questions
1. "Solve |x| = 5" → x = ±5
2. "Solve |x| < 3" → -3 < x < 3
3. "Solve |x| ≥ 4" → x ≤ -4 or x ≥ 4
4. "Solve |x - 2| = 3" → x = 5 or x = -1
5. "Solve |2x + 1| = 7" → x = 3 or x = -4

#### Implementation Notes
- Add to `/js/question-templates/inequalities.js` or new file
- Start with simpler absolute value concepts
- Distractors: forgetting negative solution, wrong inequality direction

---

### 10. Sum and Product of Roots
**Level:** 11-12  
**Questions to Add:** 5  
**IB Reference:** HL Topic 2.12  
**Priority:** MEDIUM  
**Effort:** Low

#### What to Implement
- Sum of roots: α + β = -b/a
- Product of roots: αβ = c/a
- Forming equations given roots
- Relationship with Vieta's formulas
- Extension to cubic equations

#### Example Questions
1. "For x² + 5x + 6 = 0, find sum of roots" → -5
2. "For x² + 5x + 6 = 0, find product of roots" → 6
3. "Roots are 3 and 4. Form quadratic equation" → x² - 7x + 12 = 0
4. "If α + β = 5 and αβ = 6, form equation" → x² - 5x + 6 = 0
5. "For ax² + bx + c = 0, product of roots = ?" → c/a

#### Implementation Notes
- Add to `/js/question-templates/polynomials.js`
- Link to existing quadratic solving
- Distractors: sign errors, using wrong formula

---

### 11. Reciprocal Trigonometric Functions
**Level:** 16-17  
**Questions to Add:** 6  
**IB Reference:** HL Topic 3.9  
**Priority:** MEDIUM  
**Effort:** Medium

#### What to Implement
- Definitions: sec(θ) = 1/cos(θ), csc(θ) = 1/sin(θ), cot(θ) = 1/tan(θ)
- Evaluating at standard angles
- Pythagorean identities: 1 + tan²θ = sec²θ, 1 + cot²θ = csc²θ
- Domain restrictions (where undefined)

#### Example Questions
1. "sec(60°) = ?" → 2
2. "csc(30°) = ?" → 2
3. "cot(45°) = ?" → 1
4. "If sin(θ) = 3/5, find csc(θ)" → 5/3
5. "Simplify: 1 + tan²(θ)" → sec²(θ)
6. "Where is sec(θ) undefined?" → cos(θ) = 0 (θ = 90°, 270°, ...)

#### Implementation Notes
- Add to `/js/question-templates/advanced-trig.js`
- Build on existing trig knowledge
- Distractors: reciprocal errors, identity mistakes

---

### 12. Compound Angle Identities
**Level:** 16-17  
**Questions to Add:** 6  
**IB Reference:** HL Topic 3.10  
**Priority:** MEDIUM  
**Effort:** Medium

#### What to Implement
- sin(A ± B) = sin(A)cos(B) ± cos(A)sin(B)
- cos(A ± B) = cos(A)cos(B) ∓ sin(A)sin(B)
- tan(A ± B) = (tan(A) ± tan(B))/(1 ∓ tan(A)tan(B))
- Evaluating using compound angles (e.g., sin(75°) = sin(45° + 30°))

#### Example Questions
1. "Expand sin(A + B)" → sin(A)cos(B) + cos(A)sin(B)
2. "Expand cos(A - B)" → cos(A)cos(B) + sin(A)sin(B)
3. "Find sin(75°) using sin(45° + 30°)" → (√6 + √2)/4
4. "Simplify sin(30°)cos(60°) + cos(30°)sin(60°)" → sin(90°) = 1
5. "If sin(A)=3/5, cos(B)=5/13, find sin(A+B)" → Complex calculation

#### Implementation Notes
- Add to `/js/question-templates/advanced-trig.js`
- Focus on recognition and simple applications
- Distractors: sign errors, wrong formula

---

### 13. Vector and Plane Equations
**Level:** 28-29  
**Questions to Add:** 6  
**IB Reference:** HL Topic 3.14, 3.17  
**Priority:** MEDIUM  
**Effort:** Medium

#### What to Implement
- Vector equation of line: r = a + λb
- Parametric equations of lines
- Plane equation: r · n = d
- Cartesian form: ax + by + cz = d
- Finding normal vectors to planes

#### Example Questions
1. "Line through (1,2,3) in direction (2,1,0). Vector equation?" → r = (1,2,3) + λ(2,1,0)
2. "Line r = (2,0,1) + t(1,1,2). What is direction vector?" → (1,1,2)
3. "Plane with normal (1,2,3) through origin. Equation?" → x + 2y + 3z = 0
4. "Plane 2x + 3y + z = 6. What is normal vector?" → (2,3,1)
5. "Is point (1,1,1) on plane x + y + z = 3?" → Yes

#### Implementation Notes
- Add to `/js/question-templates/vectors-3d.js`
- Build on existing vector operations
- Distractors: parameter confusion, normal vector errors

---

### 14. Bayes' Theorem
**Level:** 23-24  
**Questions to Add:** 5  
**IB Reference:** HL Topic 4.13  
**Priority:** MEDIUM  
**Effort:** Medium

#### What to Implement
- Formula: P(A|B) = P(B|A)·P(A) / P(B)
- Application to conditional probability problems
- Using tree diagrams with Bayes
- Two-event and three-event scenarios

#### Example Questions
1. "P(A)=0.3, P(B|A)=0.8, P(B|A')=0.2. Find P(A|B)" → Calculate using Bayes
2. "Identify Bayes' theorem formula" → Multiple choice recognition
3. "When should we use Bayes' theorem?" → Reversing conditional probability
4. "P(Disease)=0.01, P(+|Disease)=0.95, P(+|No Disease)=0.05. Find P(Disease|+)" → Calculate

#### Implementation Notes
- Add to `/js/question-templates/advanced-probability.js`
- Start with conceptual understanding, then simple calculations
- Distractors: confusing P(A|B) with P(B|A), calculation errors

---

### 15. Quotient Rule
**Level:** 20-21  
**Questions to Add:** 4  
**IB Reference:** HL Topic 6.1  
**Priority:** MEDIUM  
**Effort:** Low

#### What to Implement
- Formula: d/dx[u/v] = (v·u' - u·v')/v²
- Recognizing when to use quotient rule
- Applying to rational functions
- Alternative: use product rule with v⁻¹

#### Example Questions
1. "State the quotient rule" → (v·u' - u·v')/v²
2. "Differentiate (x²)/(x+1) using quotient rule" → ((x+1)·2x - x²·1)/(x+1)²
3. "Differentiate (sin x)/(x)" → (x·cos x - sin x)/x²
4. "When should you use quotient rule?" → Derivative of u/v

#### Implementation Notes
- Add to `/js/question-templates/advanced-calculus.js`
- Complement existing chain and product rules
- Distractors: wrong order in numerator, missing v² in denominator

---

### 16. L'Hôpital's Rule
**Level:** 20-21  
**Questions to Add:** 4  
**IB Reference:** HL Topic 5.13  
**Priority:** MEDIUM  
**Effort:** Low

#### What to Implement
- Identifying indeterminate forms: 0/0, ∞/∞
- Formula: lim[x→a] f(x)/g(x) = lim[x→a] f'(x)/g'(x) (if 0/0 or ∞/∞)
- Simple applications
- When NOT to use L'Hôpital's rule

#### Example Questions
1. "lim[x→0] (sin x)/x using L'Hôpital" → lim[x→0] cos x/1 = 1
2. "lim[x→0] (e^x - 1)/x using L'Hôpital" → lim[x→0] e^x/1 = 1
3. "What forms allow L'Hôpital's rule?" → 0/0 and ∞/∞
4. "lim[x→∞] (2x)/(x+1) using L'Hôpital" → lim[x→∞] 2/1 = 2

#### Implementation Notes
- Add to `/js/question-templates/advanced-calculus.js`
- Emphasize when to use vs not use
- Distractors: using when not 0/0 or ∞/∞, derivative errors

---

### 17. Implicit Differentiation
**Level:** 20-21  
**Questions to Add:** 5  
**IB Reference:** HL Topic 5.14  
**Priority:** MEDIUM  
**Effort:** Medium

#### What to Implement
- Differentiating both sides with respect to x
- Chain rule for y terms: d/dx[y^n] = n·y^(n-1)·dy/dx
- Solving for dy/dx
- Finding gradient at a point

#### Example Questions
1. "For x² + y² = 25, find dy/dx" → -x/y
2. "Circle x² + y² = 9. Find dy/dx at (√5, 2)" → -√5/2
3. "For x³ + y³ = 6xy, what is the first step?" → Differentiate both sides
4. "Implicit differentiation is used when..." → y cannot be isolated
5. "For xy = 1, find dy/dx" → -y/x = -1/x²

#### Implementation Notes
- Add to `/js/question-templates/advanced-calculus.js`
- Build on chain rule knowledge
- Distractors: forgetting dy/dx terms, algebraic errors

---

### 18. Maclaurin Series
**Level:** 30-31  
**Questions to Add:** 6  
**IB Reference:** HL Topic 5.19  
**Priority:** MEDIUM  
**Effort:** Medium

#### What to Implement
- Definition: f(x) = f(0) + f'(0)x + f''(0)x²/2! + ...
- Standard series: e^x, sin(x), cos(x), ln(1+x)
- Finding specific terms
- Approximating function values

#### Example Questions
1. "First 3 terms of e^x Maclaurin series?" → 1 + x + x²/2
2. "Maclaurin series for sin(x) (first 2 non-zero terms)?" → x - x³/6
3. "Maclaurin series for cos(x) (first 2 non-zero terms)?" → 1 - x²/2
4. "What is f(0) in the Maclaurin series of f(x)?" → The constant term
5. "Use Maclaurin series to approximate e^0.1" → 1 + 0.1 + 0.005 ≈ 1.105

#### Implementation Notes
- Add to `/js/question-templates/advanced-integration.js`
- Focus on recognition and simple terms
- Distractors: factorial errors, sign errors, wrong order

---

### 19. Volumes of Revolution
**Level:** 30-31  
**Questions to Add:** 5  
**IB Reference:** HL Topic 5.17  
**Priority:** MEDIUM  
**Effort:** Medium

#### What to Implement
- Formula: V = π∫[a,b] y² dx (rotation about x-axis)
- Formula: V = π∫[c,d] x² dy (rotation about y-axis)
- Setting up integrals
- Evaluating simple volumes

#### Example Questions
1. "Rotate y = x from x=0 to x=2 about x-axis. Volume integral?" → π∫[0,2] x² dx
2. "Volume of cone: rotate y=x from 0 to h about x-axis" → πh³/3
3. "Rotate y = √x from 0 to 4 about x-axis. Volume?" → π∫[0,4] x dx = 8π
4. "Formula for volume about x-axis?" → π∫y² dx
5. "Rotate y = r (constant) from x=0 to x=h. Volume?" → πr²h (cylinder)

#### Implementation Notes
- Add to `/js/question-templates/advanced-integration.js`
- Build on definite integrals
- Distractors: forgetting π, wrong function to square, limit errors

---

### 20. Related Rates
**Level:** 20-21  
**Questions to Add:** 5  
**IB Reference:** HL Topic (implicit in chain rule applications)  
**Priority:** MEDIUM  
**Effort:** Medium

#### What to Implement
- Chain rule with time derivatives: dV/dt = dV/dr · dr/dt
- Identifying given rate and unknown rate
- Setting up relationships
- Solving for unknown rate

#### Example Questions
1. "If dr/dt = 2 and A = πr², find dA/dt when r=3" → 2πr·dr/dt = 12π
2. "Sphere volume V = (4/3)πr³. If dr/dt = 0.5, find dV/dt when r=6" → 4πr²·dr/dt = 72π
3. "Ladder sliding: x² + y² = 25. If dx/dt = 3, find dy/dt when x=3, y=4" → -9/4
4. "Related rates problems use which rule?" → Chain rule
5. "Water flows into cone: V=(1/3)πr²h. Given dV/dt, find dh/dt" → Setup equation

#### Implementation Notes
- Add to `/js/question-templates/advanced-calculus.js`
- Focus on conceptual setup and simple calculations
- Distractors: wrong rate, sign errors, formula mistakes

---

## Phase 3: Visual/Graphing Topics (Using SVG)

These topics require visual representations but are now feasible using SVG, similar to the existing trigonometry diagram generator (`js/question-templates/trig-diagram-generator.js`).

### 21. Function Graphing & Reading
**Level:** 14-15  
**Questions to Add:** 5  
**IB Reference:** SL/HL Topic 2.3, 2.10  
**Priority:** MEDIUM (Phase 3)  
**Effort:** High (SVG implementation)

#### What to Implement
- Display function graphs using SVG
- Read coordinates from graph
- Identify intercepts
- Identify max/min points
- Identify domain and range from graph
- Solve equations graphically (intersection points)

#### Example Questions
1. Show graph, ask: "What is the y-intercept?"
2. Show graph, ask: "At what x does the maximum occur?"
3. Show two graphs, ask: "Where do they intersect?"
4. Show graph, ask: "What is the range?"
5. Show graph, ask: "For what x is f(x) > 0?"

#### Implementation Notes
- Create new file: `/js/question-templates/function-graphs.js`
- Use SVG to draw coordinate axes, grid, and function curves
- Build on trig-diagram-generator approach
- Generate randomized graphs with varying parameters
- Provide zoom/pan capabilities if needed

---

### 22. Trigonometric Function Graphs
**Level:** 16-17  
**Questions to Add:** 5  
**IB Reference:** SL/HL Topic 3.7  
**Priority:** MEDIUM (Phase 3)  
**Effort:** High (SVG implementation)

#### What to Implement
- Display sin, cos, tan graphs
- Identify amplitude (|a| in y = a·sin(x))
- Identify period (2π/b in y = sin(bx))
- Identify phase shift (c in y = sin(x - c))
- Identify vertical shift (d in y = sin(x) + d)
- Transformations of trig graphs

#### Example Questions
1. Show y = 2sin(x), ask: "What is the amplitude?"
2. Show y = sin(2x), ask: "What is the period?"
3. Show y = sin(x - π/2), ask: "What is the phase shift?"
4. Show y = cos(x) + 1, ask: "What is the vertical shift?"
5. Show transformed trig graph, ask: "What is the equation?"

#### Implementation Notes
- Add to `/js/question-templates/trigonometry.js` or new file
- Use SVG to draw trig curves with transformations
- Show multiple periods for clarity
- Mark key points (max, min, zeros)

---

### 23. Data Visualization
**Level:** 21-22  
**Questions to Add:** 5  
**IB Reference:** SL/HL Topic 4.2  
**Priority:** MEDIUM (Phase 3)  
**Effort:** High (SVG implementation)

#### What to Implement
- Display histograms, box plots, scatter plots
- Read information from charts
- Identify quartiles from box plots
- Identify mode from histograms
- Identify correlation from scatter plots
- Compare distributions

#### Example Questions
1. Show histogram, ask: "What is the modal class?"
2. Show box plot, ask: "What is the median?"
3. Show box plot, ask: "What is the IQR?"
4. Show scatter plot, ask: "Describe the correlation"
5. Show two box plots, ask: "Which has greater spread?"

#### Implementation Notes
- Create new file: `/js/question-templates/data-visualization.js`
- Use SVG to draw statistical charts
- Generate randomized data with specific properties
- Ensure charts are clear and readable

---

### 24. Graphical Equation Solving
**Level:** 14-15  
**Questions to Add:** 5  
**IB Reference:** SL/HL Topic 2.10  
**Priority:** MEDIUM (Phase 3)  
**Effort:** High (SVG implementation)

#### What to Implement
- Show graphs of two functions
- Find intersection points (solutions to f(x) = g(x))
- Approximate solutions from graphs
- Verify solutions algebraically
- Number of solutions

#### Example Questions
1. Show f(x) and g(x), ask: "How many solutions to f(x) = g(x)?"
2. Show f(x) = x² and g(x) = 4, ask: "What are the x-values of intersections?"
3. Show linear and quadratic, ask: "Approximate the solutions"
4. Show two functions, ask: "For what x is f(x) > g(x)?"
5. Show function and x-axis, ask: "What are the roots?"

#### Implementation Notes
- Add to `/js/question-templates/function-graphs.js`
- Clearly mark intersection points
- Provide grid for reading coordinates
- Show both functions in different colors

---

### 25. Derivative Graph Relationships
**Level:** 20-21  
**Questions to Add:** 5  
**IB Reference:** SL/HL Topic 5.2, 6.2  
**Priority:** MEDIUM (Phase 3)  
**Effort:** High (SVG implementation)

#### What to Implement
- Show graph of f(x), ask about f'(x)
- Show graph of f'(x), ask about f(x)
- Identify where f'(x) = 0 from f(x) graph (turning points)
- Identify where f'(x) > 0 from f(x) graph (increasing)
- Identify where f'(x) < 0 from f(x) graph (decreasing)
- Connect f, f', f'' graphs

#### Example Questions
1. Show f(x), ask: "Where is f'(x) = 0?"
2. Show f(x), ask: "Where is f(x) increasing?" (where f'(x) > 0)
3. Show f'(x), ask: "Where does f(x) have a maximum?" (f'(x) changes from + to -)
4. Show f(x), ask: "What is the sign of f'(x) at this point?"
5. Show f(x) and candidate f'(x) graphs, ask: "Which is the derivative?"

#### Implementation Notes
- Create new file: `/js/question-templates/derivative-graphs.js`
- Draw clear curves showing turning points
- Mark critical points
- Use color coding to show relationships

---

## Implementation Strategy

### Quick Wins (Low Effort, High Impact)
Start with these for rapid curriculum enhancement:

1. **Quadratic vertex form** (5 questions, Low effort)
2. **Permutations P(n,r)** (4 questions, Low effort)
3. **Sum/product of roots** (5 questions, Low effort)
4. **Quotient rule** (4 questions, Low effort)
5. **L'Hôpital's rule** (4 questions, Low effort)

**Total Quick Wins:** 22 questions, estimated 2-3 weeks

---

### Phase 1 Implementation Order

**Iteration 2: Functions & Transformations (Q2 2026)**
- Quadratic vertex form (5)
- Rational functions (7)
- Graph transformations (8)
- **Total:** 20 questions

**Iteration 3: Trigonometry (Q2 2026)**
- Sine and cosine rule (8)
- **Total:** 8 questions

**Iteration 4: Calculus & Statistics (Q3 2026)**
- Definite integrals (8)
- Linear regression (8)
- **Total:** 16 questions

---

### Phase 2 Implementation Order

**Iteration 5: Advanced Algebra (Q4 2026)**
- Permutations (4)
- Sum/product of roots (5)
- Modulus equations (6)
- 3×3 systems (5)
- **Total:** 20 questions

**Iteration 6: Advanced Trigonometry (Q4 2026)**
- Reciprocal trig (6)
- Compound angles (6)
- **Total:** 12 questions

**Iteration 7: Advanced Calculus (Q1 2027)**
- Quotient rule (4)
- L'Hôpital's rule (4)
- Implicit differentiation (5)
- Related rates (5)
- **Total:** 18 questions

**Iteration 8: Advanced Integration & Probability (Q1 2027)**
- Maclaurin series (6)
- Volumes of revolution (5)
- Bayes' theorem (5)
- **Total:** 16 questions

**Iteration 9: Vectors & Geometry (Q2 2027)**
- Vector/plane equations (6)
- **Total:** 6 questions

---

### Phase 3 Implementation Order

**Iteration 10: Visual/SVG Topics (Q3 2027)**
- Function graphing (5)
- Trig graphs (5)
- Data visualization (5)
- Graphical solving (5)
- Derivative graphs (5)
- **Total:** 25 questions

---

## Quality Standards

For each new topic implemented:

### Research & Design
- ✅ Review IB specimen papers and mark schemes
- ✅ Identify 5-10 representative question types
- ✅ Design questions at appropriate difficulty for level
- ✅ Create "why" question variants for conceptual understanding

### Implementation
- ✅ Add questions to appropriate `/js/question-templates/` file
- ✅ Use correct LaTeX syntax for mathematical notation
- ✅ Generate plausible distractors based on common errors
- ✅ Test questions manually in the app
- ✅ Verify correct answers and explanations

### Testing & Validation
- ✅ Run validation tool: `npm run validate`
- ✅ Check LaTeX rendering in browser
- ✅ Verify all answer choices are plausible
- ✅ Ensure explanations are clear and helpful
- ✅ Test randomization (run multiple times)

### Documentation
- ✅ Update `IB_HL_AA_COVERAGE.md` with new question types
- ✅ Update `SYLLABUS_IMPLEMENTATION_TRACKER.md` progress
- ✅ Update `README.md` curriculum overview
- ✅ Mark topic as complete in `REMAINING_SYLLABUS_ITEMS.md`
- ✅ Add entry to version history

---

## Progress Tracking

### Overall Progress
- **Topics Completed:** 10/35 (29%)
- **Questions Added:** 33/~190 target (17%)
- **Phase 1:** 6/12 topics (50%)
- **Phase 2:** 0/14 topics (0%)
- **Phase 3:** 0/5 topics (0%)
- **Phase 4:** 4/4 topics (100%) ✅

### Recent Completions
- 2026-01-09: Arc length & sector area, tangent & normal lines, standard deviation, Euler's method
- 2026-01-09: Counterexample proofs, ambiguous case, continuous random variables
- 2026-01-08: Financial applications, parallel/perpendicular lines, quadratic inequalities

---

## Contributing

If you'd like to contribute to implementing these remaining topics:

1. **Choose a topic** from the lists above
2. **Review existing implementations** in `/js/question-templates/`
3. **Follow the quality standards** outlined in this document
4. **Test thoroughly** using the validation tool
5. **Document** your changes in all relevant files
6. **Submit a PR** with clear description of what was added

---

## Related Documents

- **SYLLABUS_COVERAGE_MATRIX.md** - Visual mapping to IB syllabus
- **SYLLABUS_GAP_SUMMARY.md** - Executive summary
- **SYLLABUS_IMPLEMENTATION_TRACKER.md** - Progress tracking
- **IB_HL_AA_COVERAGE.md** - Current coverage documentation
- **AGENTS.md** - Critical guidelines for AI agents

---

**Last Updated:** 2026-01-09  
**Next Review:** When Phase 1, Iteration 2 begins (Q2 2026)
