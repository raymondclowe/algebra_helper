# Guidelines for Displaying Level and Score Percentage

## Educational Perspective on Progress Metrics

### Executive Summary

This document evaluates the educational impact of displaying "Level" and "Score %" metrics to students and provides evidence-based guidelines for when, how, and if these statistics should be visible.

**Key Recommendation:** Implement **mastery-oriented display modes** that emphasize learning progress over performance metrics, with configuration options to suit different educational contexts.

---

## Research Background

### The Problem with Performance-Oriented Displays

Research in educational psychology identifies two types of achievement goals (Dweck, 1986; Ames, 1992):

1. **Performance Goals**: Focus on demonstrating ability, outperforming others, or achieving specific scores
   - Can lead to helplessness when facing challenges
   - May reduce intrinsic motivation (Deci & Ryan, 1985)
   - Associated with surface learning strategies
   - Can create anxiety and fear of failure

2. **Mastery Goals**: Focus on learning, improvement, and understanding
   - Associated with deeper learning and persistence
   - Maintain intrinsic motivation
   - Promote resilience in face of difficulty
   - Support long-term achievement

### The Impact of Visible Metrics

**Potential Benefits of Showing Level/Score:**
- ✅ Clear progress indicators help students track improvement
- ✅ Transparency builds trust in the adaptive system
- ✅ Concrete goals can motivate some learners
- ✅ Helps students understand where they are in the learning journey

**Potential Risks of Showing Level/Score:**
- ❌ Students may focus on "leveling up" rather than understanding
- ❌ Low scores (below 80% target) may discourage struggling learners
- ❌ Creates social comparison when used in classroom settings
- ❌ May trigger math anxiety in vulnerable students
- ❌ Extrinsic motivation can crowd out intrinsic interest
- ❌ Students might game the system (e.g., deliberately fail to lower level)

### The 80% Accuracy Target

The app targets approximately 80% accuracy as the optimal learning zone. This is based on:
- **Challenge Point Framework** (Guadagnoli & Lee, 2004): Optimal learning occurs with moderate challenge
- **Zone of Proximal Development** (Vygotsky, 1978): Tasks should be achievable with effort
- **Error-based Learning** (Metcalfe, 2017): Some errors are beneficial for learning

**Educational Implications:**
- Students performing at 50-70% are in their learning zone but may feel discouraged
- Students at 90%+ may feel successful but aren't being challenged enough
- Raw percentage scores don't reflect the complexity of being appropriately challenged

---

## Display Mode Recommendations

### Mode 1: Mastery-Oriented (RECOMMENDED DEFAULT)

**What to Display:**
- ✅ **Skill Area**: "Working on: Linear Equations"
- ✅ **Progress Description**: "Building Mastery" / "Challenging Yourself" / "Exploring New Concepts"
- ✅ **Encouraging Messages**: "You're making great progress!" / "Perfect difficulty for learning!"
- ✅ **Mastery Badges**: Visual indicators for completed skill areas

**What NOT to Display:**
- ❌ Numerical level (e.g., "5.0")
- ❌ Raw accuracy percentage
- ❌ Comparative indicators

**Rationale:**
- Emphasizes learning process over performance outcomes
- Reframes "difficulty" as appropriate challenge rather than failure
- Reduces anxiety and social comparison
- Maintains all adaptive functionality without showing raw metrics

**Research Support:**
- Mastery-goal framing improves persistence (Dweck & Leggett, 1988)
- Process praise more effective than ability praise (Mueller & Dweck, 1998)
- Descriptive feedback outperforms evaluative feedback (Butler, 1988)

### Mode 2: Growth-Oriented

**What to Display:**
- ✅ **Level Range**: "Level 5-6: Two-Step Equations"
- ✅ **Progress Bar**: Visual indicator within current level band
- ✅ **Recent Improvement**: "You've mastered 3 new concepts this week!"
- ✅ **Accuracy Trend**: ↗️ Improving / ↔️ Steady / ↘️ Needs Support (NOT raw %)

**What NOT to Display:**
- ❌ Precise level decimals (e.g., show "5-6" not "5.3")
- ❌ Raw accuracy percentage (use trend indicators instead)

**Rationale:**
- Shows progress without creating score fixation
- Level bands reduce anxiety about small fluctuations
- Trend indicators give actionable information without judgment
- Celebrates growth over static achievement

### Mode 3: Full Transparency (For Advanced Users/Teachers)

**What to Display:**
- ✅ Exact level (e.g., "5.3")
- ✅ Accuracy percentage (e.g., "78%")
- ✅ All technical details
- ⚠️ **With Educational Context**

**When to Use:**
- Self-directed adult learners
- Teachers monitoring student progress
- Students who explicitly request detailed metrics
- Research/assessment contexts

**Required Accompaniment:**
- Clear explanation that 70-85% accuracy indicates optimal challenge
- Statement that lower scores mean appropriate difficulty, not failure
- Emphasis that the goal is learning, not high scores

---

## Implementation Guidelines

### Default Behavior

**For Students (Default):**
- Use **Mastery-Oriented Mode**
- Hide numerical level and accuracy percentage
- Show skill area and encouraging progress messages
- Provide visual progress indicators (badges, progress bars)

**For Teachers/Settings:**
- Provide configuration option to enable Full Transparency Mode
- Include educational context when showing raw metrics
- Consider teacher dashboard separate from student view

### Contextual Display Rules

**Always Hide Metrics When:**
1. Student is struggling (accuracy < 50% recently)
2. During calibration phase (already implemented - shows "Calibration" badge)
3. First-time users (first session)
4. Student has opted out of performance tracking

**Consider Hiding Metrics When:**
1. Student shows signs of anxiety (rapid wrong answers, excessive "I don't know")
2. Student is in error recovery period after multiple mistakes
3. Working on particularly challenging new concept

**Optional Display:**
1. Student can manually toggle "Show Details" to see level/accuracy
2. Summary screen at end of session showing progress
3. Weekly progress email/report for parents/teachers

### Reframing Messages

Instead of showing raw metrics, provide **meaningful context**:

| Current Display | Mastery-Oriented Alternative |
|----------------|------------------------------|
| "Level 5.0" | "Mastering Two-Step Equations" |
| "78%" | "Perfect challenge level - learning actively!" |
| "45%" | "Exploring challenging concepts - keep going!" |
| "92%" | "Ready for more complex problems!" |
| Level drops from 6.0 → 5.5 | "Reviewing fundamentals to build strong foundation" |

### Color Psychology

**Current Implementation:**
- Green (80%+): Can create pressure to maintain "good" scores
- Yellow (50-80%): May feel like "warning" or inadequacy
- Red (<50%): Strongly negative connotation

**Recommended Alternative:**
- All progress indicators use encouraging colors (blues, purples, greens)
- Avoid red/yellow warning colors for metrics
- Use color to highlight achievements, not deficiencies

---

## Specific Recommendations for This App

### Immediate Changes (High Priority)

1. **Add Display Mode Configuration**
   ```javascript
   // In constants.js or new config file
   const DISPLAY_MODES = {
     MASTERY: 'mastery',      // Default: Hide metrics, show skill area
     GROWTH: 'growth',        // Show level bands and trends
     FULL: 'full'            // Show all metrics with context
   };
   ```

2. **Implement Mastery-Oriented Header**
   ```html
   <!-- Instead of showing "Level 5.0" -->
   <div class="skill-area">
     <span class="text-gray-400 text-xs">Working on</span>
     <span class="text-blue-400 font-bold">Two-Step Equations</span>
   </div>
   
   <!-- Instead of showing "78%" -->
   <div class="progress-indicator">
     <span class="text-green-400">🎯 Great Progress!</span>
   </div>
   ```

3. **Reframe Accuracy Display**
   - Instead of "Last 5 Avg: 78%"
   - Show: "🎯 Perfect Challenge!" (70-85%)
   - Show: "🌟 Mastering This!" (85%+)
   - Show: "💪 Building Skills!" (50-70%)
   - Show: "🔍 Exploring New Concepts" (<50%)

4. **Add Context to Stats Modal**
   - When student clicks stats, include educational explanation
   - "Your accuracy shows you're working at the right difficulty level!"
   - "Remember: The goal is learning, not perfect scores!"

### Medium-Term Enhancements

5. **Skill-Based Progress Visualization**
   - Replace single level number with skill tree or progress map
   - Show mastered skills with badges/checkmarks
   - Highlight current focus area
   - Preview upcoming concepts

6. **Adaptive Encouragement Based on Context**
   ```javascript
   function getEncouragingMessage(accuracy, trend, level) {
     if (accuracy >= 0.85) return "You're mastering this! Ready for more?";
     if (accuracy >= 0.70) return "Perfect - you're learning actively!";
     if (accuracy >= 0.50) return "Great progress on challenging material!";
     return "You're exploring new concepts - keep going!";
   }
   ```

7. **Personal Best Tracking**
   - Instead of current level, show "Highest Skill Mastered"
   - Celebrate when student tackles harder concepts than before
   - Never decrease this metric (only shows growth)

8. **Session Summary Instead of Real-Time Display**
   - Hide metrics during practice
   - Show encouraging summary at end of session
   - Focus on what was learned, not scores achieved

---

## Assessment & Validation

### Metrics to Track

After implementing mastery-oriented displays, measure:

1. **Engagement Metrics:**
   - Session duration (expect increase)
   - Return rate (expect increase)
   - Problem attempts (expect increase)
   - Use of "I don't know" button (expect decrease in anxiety-driven usage)

2. **Learning Outcomes:**
   - Time to mastery (should remain similar or improve)
   - Retention on spaced repetition (expect improvement)
   - Transfer to novel problems (expect improvement)

3. **Student Experience:**
   - Self-reported anxiety (expect decrease)
   - Intrinsic motivation survey (expect increase)
   - Satisfaction ratings (expect increase)
   - Qualitative feedback

### A/B Testing Recommendation

Implement controlled study:
- **Group A**: Mastery-Oriented Display (no level/% shown)
- **Group B**: Current Full Display (level and % visible)
- **Duration**: 4-6 weeks
- **Measure**: Engagement, learning outcomes, satisfaction, anxiety

**Hypothesis**: Mastery-oriented display will improve engagement and reduce anxiety without reducing learning outcomes, potentially improving them through increased persistence.

---

## Conclusion

### Summary Recommendation

**Default to Mastery-Oriented Display** because:
1. ✅ Maintains all adaptive learning functionality
2. ✅ Reduces performance anxiety
3. ✅ Promotes learning goals over performance goals
4. ✅ Encourages persistence through challenges
5. ✅ Prevents score fixation
6. ✅ Reduces social comparison
7. ✅ Aligns with research on motivation and learning

**Provide Full Transparency as Option** for:
- Teachers monitoring progress
- Self-directed adult learners
- Users who explicitly prefer detailed metrics
- Research and assessment contexts

**Key Principle**: *Information that helps students learn should be prominent; information that creates anxiety or score fixation should be optional.*

### The Target Audience Question

**For K-12 Students (Primary Audience):**
- Strong recommendation for Mastery-Oriented Display
- Hide level/% by default
- Emphasize skill development and progress
- Provide encouraging, educational context

**For Adult Learners / Self-Study:**
- May prefer more transparency
- Can handle detailed metrics maturely
- Still benefit from encouragement and context
- Provide choice of display modes

**For Classroom Use:**
- Teacher dashboard with full metrics
- Student view with mastery orientation
- Prevents competitive comparison
- Supports differentiated instruction

---

## References

### Motivation & Goal Orientation
- Ames, C. (1992). Classrooms: Goals, structures, and student motivation. *Journal of Educational Psychology*, 84(3), 261-271.
- Dweck, C. S. (1986). Motivational processes affecting learning. *American Psychologist*, 41(10), 1040-1048.
- Dweck, C. S., & Leggett, E. L. (1988). A social-cognitive approach to motivation and personality. *Psychological Review*, 95(2), 256-273.
- Mueller, C. M., & Dweck, C. S. (1998). Praise for intelligence can undermine children's motivation and performance. *Journal of Personality and Social Psychology*, 75(1), 33-52.

### Feedback & Assessment
- Butler, R. (1988). Enhancing and undermining intrinsic motivation: The effects of task-involving and ego-involving evaluation on interest and performance. *British Journal of Educational Psychology*, 58(1), 1-14.
- Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research*, 77(1), 81-112.

### Intrinsic Motivation
- Deci, E. L., & Ryan, R. M. (1985). *Intrinsic motivation and self-determination in human behavior*. New York: Plenum.
- Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin*, 125(6), 627-659.

### Challenge & Learning
- Guadagnoli, M. A., & Lee, T. D. (2004). Challenge point: A framework for conceptualizing the effects of various practice conditions in motor learning. *Journal of Motor Behavior*, 36(2), 212-224.
- Metcalfe, J. (2017). Learning from errors. *Annual Review of Psychology*, 68, 465-489.
- Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes*. Cambridge, MA: Harvard University Press.

### Math Anxiety
- Ashcraft, M. H. (2002). Math anxiety: Personal, educational, and cognitive consequences. *Current Directions in Psychological Science*, 11(5), 181-185.
- Ramirez, G., Gunderson, E. A., Levine, S. C., & Beilock, S. L. (2013). Math anxiety, working memory, and math achievement in early elementary school. *Journal of Cognition and Development*, 14(2), 187-202.

---

**Document Version:** 1.0  
**Date:** 2025-12-15  
**Status:** Recommendation for Implementation  
**Next Review:** After implementation and A/B testing results
