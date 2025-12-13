# Algebra Helper - Interactive Math Trainer

🚀 **[Launch the App Now!](https://raymondclowe.github.io/algebra_helper/algebra-helper.html)**

An intelligent, adaptive math practice tool that helps students master algebra through personalized, immediate feedback and dynamic difficulty adjustment.

---

## 📚 For Students

### How This Tool Helps You

**Algebra Helper** is your personal math trainer that adapts to *your* skill level in real-time. Here's what makes it special:

- **🎯 Personalized Learning**: The app starts by calibrating to your current skill level, ensuring you're neither bored with easy problems nor frustrated with impossible ones.

- **⚡ Immediate Feedback**: Get instant validation of your answers with clear explanations when you make mistakes. No waiting for teachers to grade your work!

- **🤔 "I Don't Know" Option**: Stuck? No problem! Use the "I don't know" button to skip any question without penalty. You'll see the correct answer and explanation, and the app will automatically make future questions easier to help you learn at your own pace.

- **📈 Progressive Challenge**: As you improve, the difficulty automatically increases. Master easier concepts before moving to harder ones.

- **🔥 Momentum Mode**: Build a streak of correct answers and watch your level accelerate! The more you succeed, the faster you progress.

- **💪 Skill Reinforcement**: Practice makes perfect. Each problem reinforces core algebra concepts:
  - Level 1-2: Basic equation solving
  - Level 3-4: Expanding and factorising
  - Level 5-6: Algebraic manipulation
  - Level 7-8: Quadratic equations
  - Level 9-10: Differentiation

### How to Use

1. **Calibration Phase**: The app will show you problems and ask if they're too hard, just right, or too easy. Answer honestly! The app needs at least 6 responses with a clear pattern to accurately find your level.
2. **Learning Phase**: Once calibrated, practice with multiple-choice questions at your level. Answer quickly to maximize your progress!
3. **Build Momentum**: Get 3 correct answers in a row to activate Turbo Mode 🔥 for faster progression. Hover over Turbo Mode to see how it works!
4. **Learn from Mistakes**: Read the explanations when you get something wrong to understand the correct approach.
5. **"I don't know" Option**: Stuck on a problem? Click "I don't know" to see the correct answer and explanation without penalty. The app will automatically adjust to give you easier questions next.

---

## 👨‍🏫 For Teachers & Parents

### Educational Philosophy

Algebra Helper is built on research-backed pedagogical principles. For a comprehensive review of the learning science foundation, see [PEDAGOGY.md](PEDAGOGY.md).

#### **Worked Examples & Practice (Cognitive Load Theory)**
Students learn by working through specific examples with immediate practice. Research shows worked examples are effective for novice learners by reducing cognitive load (Sweller & Cooper, 1985), especially when combined with self-explanation prompts (Chi et al., 1989).

**Current Implementation:** Multiple-choice practice with explanations on errors. "Why" questions every few problems promote conceptual understanding.

#### **Immediate Feedback**
The tool provides instant verification and explanations. Research on feedback is nuanced: immediate feedback prevents error consolidation and maintains engagement, but effectiveness depends on feedback quality (Hattie & Timperley, 2007). Elaborative feedback addressing misconceptions is more effective than simple verification.

**Current Implementation:** Immediate right/wrong indication with brief explanatory feedback on errors.

#### **Adaptive Difficulty (Zone of Proximal Development)**
Based on Vygotsky's theory, learning is optimal when tasks are challenging but achievable. The app uses a binary search algorithm to calibrate initial difficulty, then dynamically adjusts based on performance to keep students in the productive learning zone.

**Current Implementation:** Adaptive difficulty with "I don't know" option to prevent frustration. Future versions will track skills separately and provide scaffolding beyond just difficulty adjustment.

#### **Constructive Feedback**
Effective feedback addresses three questions (Hattie & Timperley, 2007): Where am I going? (goals), How am I doing? (progress), and Where to next? (improvement strategies).

**Current Implementation:** Brief explanations showing correct method. Enhanced versions will include common misconception addressing and conceptual reasoning.

#### **Motivation & Engagement**
Progress indicators and level advancement provide clear goals and achievement markers. Research on gamification shows mixed results: it can increase engagement but may undermine intrinsic motivation if overused (Deci & Ryan, 1985; Hanus & Fox, 2015).

**Design Choice:** Balanced approach with mastery-oriented progression and "I don't know" option to reduce performance pressure.

#### **Evidence-Based Practices in Development**
- **Spaced Repetition:** Revisiting concepts over time improves retention (Cepeda et al., 2006)
- **Interleaved Practice:** Mixing problem types enhances learning (Rohrer & Taylor, 2007)
- **Metacognitive Strategies:** Self-monitoring and reflection improve understanding (Schraw & Dennison, 1994)

### Appropriate Use & Limitations

**✅ This Tool is Effective For:**
- Procedural fluency practice
- Low-stakes skill reinforcement
- Formative assessment
- Homework and independent practice
- Building confidence through adaptive difficulty

**⚠️ This Tool Does Not Replace:**
- Teacher explanation and instruction
- Collaborative problem-solving
- Deep conceptual exploration
- Real-world application projects
- Mathematical reasoning and communication

**📊 Effectiveness:** We are committed to evidence-based practice and continuous improvement. See [PEDAGOGY.md](PEDAGOGY.md) for our validation framework, planned pilot studies, and research methodology.

### Classroom & Home Usage Ideas

**📊 Formative Assessment**
- Use the calibration phase to quickly assess where students are in their algebra journey
- Monitor the "Last 5 Avg" accuracy to identify students who need additional support

**🏠 Homework & Independent Practice**
- Assign 15-20 minutes of daily practice as homework
- Students can work at their own pace without frustration

**👥 Collaborative Learning**
- Pair students and have them work through problems together
- Use wrong answers as discussion points for the class

**🎯 Targeted Intervention**
- Students struggling with specific concepts can focus practice at particular difficulty levels
- The adaptive system ensures they're not overwhelmed

**⏱️ Bell Work / Warm-Up Activity**
- Quick 5-minute practice sessions at the start of class
- Keeps algebra skills fresh between units

### Important Notes

- 🔒 Future versions will include user accounts for progress tracking
- 📝 This tool supplements but doesn't replace comprehensive math instruction
- 🐛 Debug mode is disabled by default; enable it only for development/testing

---

## 💻 For Programmers

### Technologies Used

**Algebra Helper** is a single-file, client-side web application built with modern web technologies:

#### **Frontend Framework**
- **Vanilla JavaScript**: No frameworks required—pure ES6+ JavaScript for maximum performance
- **Tailwind CSS**: Utility-first CSS via CDN for rapid UI development and consistent styling
- **MathJax 3**: LaTeX math rendering with SVG output for crisp, accessible mathematical notation

#### **Architecture & Algorithms**

**Binary Search Calibration with Statistical Confidence**
```javascript
// Finds optimal difficulty with confidence checks
if (student_knows) {
    minLevel = currentLevel;
} else {
    maxLevel = currentLevel;
}
nextLevel = (minLevel + maxLevel) / 2;

// Ends when multiple criteria are met:
// - Minimum 6 responses collected
// - Range converged to < 1.5 levels
// - Recent responses show mixed signals (both pass/fail)
// - Responses clustered around boundary level
```

**Adaptive Difficulty with Momentum**
- Correct answers: +0.2 level (or +0.5 in streak mode)
- First wrong answer: -0.3 level
- Consecutive wrong answers: -0.8 level (frustration breaker)

**Problem Generation**
- Procedural generation ensures infinite unique problems
- Each difficulty band has specific problem templates
- Distractors are algorithmically generated to be plausible but incorrect

#### **Key Features**

1. **No Backend Required**: All logic runs client-side—deploy to any static host
2. **Responsive Design**: Works on mobile, tablet, and desktop
3. **Fast Performance**: Question generation and rendering in <100ms
4. **Accessible**: MathJax provides screen-reader compatible math rendering

#### **Code Structure**
```javascript
APP {
    level: 5.0,           // Current difficulty (1-10)
    streak: 0,            // Consecutive correct answers
    mode: 'calibration',  // 'calibration' or 'learning'
    history: [],          // Binary success/fail for last 5
    speedHistory: [],     // Response speed: 1 for fast, 0.5 for normal, 0 for slow
}

Generator {
    getQuestion(level)    // Returns problem object
    lvl1() - lvl5()      // Problem templates per band
}
```

#### **Debug Mode**
Set `DEBUG_MODE = true` (line 105) to:
- Highlight correct answers with yellow border
- Add visual debug markers
- Enable rapid testing

### Running Locally

```bash
# Clone the repository
git clone https://github.com/raymondclowe/algebra_helper.git
cd algebra_helper

# Open in browser (no build step required!)
open algebra-helper.html
# or
python -m http.server 8000  # then visit http://localhost:8000
```

### Deployment

**GitHub Pages**

This project is automatically deployed to GitHub Pages when changes are pushed to the `main` branch:

- **Live URL**: [https://raymondclowe.github.io/algebra_helper/](https://raymondclowe.github.io/algebra_helper/)
- **Deployment Workflow**: `.github/workflows/static.yml`
- **Deployment includes**: `index.html`, `algebra-helper.html`, `README.md`

The deployment workflow:
1. Triggers on push to `main` branch or manual workflow dispatch
2. Creates a clean deployment directory with only necessary files
3. Uploads and deploys to GitHub Pages
4. Completes in ~30 seconds

To deploy to other static hosting services (Netlify, Vercel, etc.), simply upload the HTML files—no build step required!

### Contributing

This is an open-source educational tool. Contributions welcome! Some ideas:
- Add more problem types (inequalities, simultaneous equations, etc.)
- Improve distractor generation algorithms
- Add accessibility features (keyboard navigation, high contrast mode)
- Internationalization (i18n) support

---

## 🚀 Next Steps & Roadmap

We're committed to making Algebra Helper even better. Here's what's planned:

### Short Term (Next 3 Months)
- [ ] **More Problem Types**: Add inequalities, simultaneous equations, and word problems
- [ ] **Better Mobile UX**: Optimize touch targets and layout for smartphones
- [ ] **Performance Metrics**: Track average time per problem and learning velocity
- [ ] **Explanation Improvements**: More detailed step-by-step breakdowns for wrong answers - more steps for more complex problems
- [ ] **Spaced Repetition**: Intelligently resurface problems students struggled with

### Medium Term (6 Months)
- [ ] **AI-Generated Problems**: Use LLMs to create diverse problems (with human verification)
- [ ] **Topic Selection**: Let students/teachers choose specific algebra topics to practice
- [ ] **Export Results**: Download practice session summaries as PDF/CSV
- [ ] **Advanced Pedagogy**: 
  - Learning path recommendations
  - Identifying knowledge gaps
  - Personalized study plans

### Long Term (12+ Months)
- [ ] **User Accounts**: Backend storage for progress tracking across devices
- [ ] **Google One-Tap Login**: Seamless authentication for saving scores
- [ ] **Teacher Dashboard**: Class-wide analytics and progress monitoring
- [ ] **Multi-Language Support**: Translate into Spanish, French, Mandarin, etc.

### Research & Innovation
- Experiment with different feedback mechanisms
- A/B test various gamification approaches
- Partner with education researchers to measure learning outcomes
- Explore integration with Learning Management Systems (LMS)

---

## 🐛 Debug Mode

### What is Debug Mode?

Debug mode is a developer feature that visually highlights the correct answer in multiple-choice questions. It's useful for:
- Testing new problem types
- Verifying distractor generation logic
- Quick QA during development
- Demo/training purposes

### How to Enable/Disable

**Enable**: Set `DEBUG_MODE = true` in `algebra-helper.html` (line 105)
```javascript
const DEBUG_MODE = true;  // Correct answers have yellow dashed border
```

**Disable**: Set `DEBUG_MODE = false` (default for production)
```javascript
const DEBUG_MODE = false; // Production mode
```

### Important Warnings

⚠️ **Scores Are Not Saved in Debug Mode**
- Debug mode is for testing only
- Student progress will not persist
- Use production mode for real practice sessions

⏱️ **Debug Mode Timeout**
- Debug mode automatically expires after **10 minutes**
- This prevents accidental use in production environments
- Refresh the page to reset the timer

🔒 **Security Note**
- Debug mode is visible in client-side code
- For production deployments, consider a server-side flag
- Future versions will remove debug markers from production builds

### Debug Visual Indicators
- Yellow dashed border around correct answer
- "✓ DEBUG" badge in top-right corner of correct option
- Calculator/No-calculator icons for problem requirements

---

## 📚 Research & References

### Key Learning Science Principles

This tool is informed by research in cognitive psychology and mathematics education. For complete references and pedagogical analysis, see [PEDAGOGY.md](PEDAGOGY.md).

**Core References:**
- **Cognitive Load Theory:** Sweller, J., & Cooper, G. A. (1985). The use of worked examples as a substitute for problem solving in learning algebra. *Cognition and Instruction*, 2(1), 59-89.
- **Feedback Research:** Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research*, 77(1), 81-112.
- **Self-Explanation:** Chi, M. T., et al. (1989). Self-explanations: How students study and use examples in learning to solve problems. *Cognitive Science*, 13(2), 145-182.
- **Spaced Practice:** Cepeda, N. J., et al. (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin*, 132(3), 354.
- **Interleaved Practice:** Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science*, 35(6), 481-498.
- **Motivation:** Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin*, 125(6), 627.

### Validation & Continuous Improvement

We are committed to evidence-based practice:
- 📊 Pilot studies planned with control groups
- 📈 Learning analytics to measure effectiveness
- 🔬 Iterative improvement based on data
- 🎓 Partnership with education researchers

See [PEDAGOGY.md](PEDAGOGY.md) for our complete validation framework, measurement plans, and ongoing research commitments.

---

## 📄 License

This project is open source and available for educational use.

## 🤝 Contact & Support

Questions? Suggestions? Found a bug?
- Open an issue on [GitHub](https://github.com/raymondclowe/algebra_helper/issues)
- Contribute via pull requests

---

**Happy Learning! 🎓**
