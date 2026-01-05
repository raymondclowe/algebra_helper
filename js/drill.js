// Learning Mode Logic
window.Learning = {
    setupUI: function() {
        const container = document.getElementById('mc-options');
        const isWhyQuestion = window.APP.currentQ.type === 'why';
        
        let opts = [
            { val: window.APP.currentQ.displayAnswer, correct: true },
            { val: window.APP.currentQ.distractors[0], correct: false },
            { val: window.APP.currentQ.distractors[1], correct: false },
            { val: window.APP.currentQ.distractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        // Add "I don't know" option to ALL questions (feature requirement)
        // This allows users to skip questions without penalty while still learning
        opts.push({ val: "I don't know", correct: false, dontKnow: true });
        
        // Store all answer options in currentQ for later tracking
        window.APP.currentQ.allAnswers = opts.map(opt => opt.val);

        opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "p-2 bg-gray-700 hover:bg-gray-600 rounded text-lg border border-gray-600 transition flex flex-wrap items-center justify-center min-h-[60px]";
            if (window.DEBUG_MODE && opt.correct) btn.classList.add('debug-correct');
            btn.dataset.correct = opt.correct.toString();
            btn.dataset.dontKnow = (opt.dontKnow || false).toString();
            btn.dataset.answer = opt.val; // Store the answer value for tracking
            btn.onclick = () => this.handleAnswer(btn, opt.correct, opt.dontKnow, opt.val);
            
            // Add inline styles to ensure text wrapping and prevent clipping
            btn.style.whiteSpace = 'normal';
            btn.style.wordBreak = 'break-word';
            btn.style.overflowWrap = 'break-word';
            btn.style.height = 'auto';
            btn.style.minHeight = '60px';
            btn.style.maxHeight = 'none';
            btn.style.overflow = 'visible';
            
            // Use plain text for "I don't know" with "(no penalty)" indicator, LaTeX for others
            if (opt.dontKnow) {
                btn.innerHTML = `<div class="flex flex-col items-center">
                    <span class="italic text-gray-400">${opt.val}</span>
                    <span class="text-xs text-gray-500 mt-1">(no penalty)</span>
                </div>`;
            } else {
                // First, simplify answer to extract plain text from \text{...} blocks
                // This prevents \text{...} from being wrapped in $...$ delimiters
                const utils = window.GeneratorUtils;
                const simplifiedAnswer = utils.simplifyAnswerForDisplay(opt.val);
                
                // Then process remaining LaTeX to convert simple symbols to Unicode (like \times → ×, \div → ÷)
                const processedAnswer = utils.processTextContent(simplifiedAnswer);
                
                // Check if the answer was simplified (i.e., plain text extracted from \text{...})
                // We check for absence of LaTeX commands and math delimiters
                const wasSimplified = simplifiedAnswer !== opt.val && !simplifiedAnswer.includes('\\text') && !simplifiedAnswer.includes('\\frac');
                
                // Check if final processed answer still needs MathJax rendering
                // Only truly complex LaTeX needs MathJax (fractions, roots, sums, integrals, etc.)
                // Simple symbols like ×, ÷, ±, ≤, ≥ are already converted to Unicode by processTextContent
                const needsLatex = /\\frac|\\sqrt|\\sum|\\int|\\lim|\\log|\\sin|\\cos|\\tan|\\begin|\\end|\\\^|\\_/.test(processedAnswer);
                
                // Also check for math delimiters that indicate MathJax content
                const hasMathDelimiters = processedAnswer.includes('$') || processedAnswer.includes('\\(') || processedAnswer.includes('\\[');
                
                if (wasSimplified && !needsLatex && !hasMathDelimiters) {
                    // Simplified to plain text - render directly with proper styling
                    btn.innerHTML = `<span class="plain-text-answer" style="font-family: 'Times New Roman', Times, serif; font-style: normal; word-spacing: 0.1em;">${processedAnswer}</span>`;
                } else if (needsLatex || hasMathDelimiters) {
                    // Render as LaTeX math for complex expressions
                    // Remove any existing delimiters to avoid double-wrapping
                    let latexContent = processedAnswer;
                    if (latexContent.startsWith('$') && latexContent.endsWith('$')) {
                        latexContent = latexContent.slice(1, -1);
                    }
                    btn.innerHTML = `\\( ${latexContent} \\)`;
                } else {
                    // Plain text - render with proper spacing
                    const textContent = processedAnswer
                        .replace(/𝑓/g, '<span style="font-style: italic;">f</span>')
                        .replace(/𝑔/g, '<span style="font-style: italic;">g</span>')
                        .replace(/𝑥/g, '<span style="font-style: italic;">x</span>');
                    btn.innerHTML = `<span style="font-style: normal; word-spacing: 0.15em;">${textContent}</span>`;
                }
            }
            container.appendChild(btn);
        });
        MathJax.typesetPromise([container]).then(() => {
            // Add small delay to ensure MathJax has fully rendered
            setTimeout(() => {
                // Add inline styles to MathJax containers to ensure proper wrapping
                // Note: fontSize is handled dynamically by UI.checkAnswerButtonOverflow
                const buttons = container.querySelectorAll('button');
                buttons.forEach(button => {
                    const mathContainers = button.querySelectorAll('mjx-container');
                    mathContainers.forEach(mjxContainer => {
                        // Set wrapping and overflow styles to prevent clipping
                        mjxContainer.style.maxWidth = '100%';
                        mjxContainer.style.width = '100%';
                        mjxContainer.style.display = 'inline-block';
                        mjxContainer.style.wordBreak = 'break-word';
                        mjxContainer.style.overflowWrap = 'break-word';
                        mjxContainer.style.overflow = 'visible';
                    });
                });
                
                // After MathJax renders, check for overflow and prevent clipping
                // This function will dynamically adjust fontSize if needed
                if (window.UI && window.UI.checkAnswerButtonOverflow) {
                    window.UI.checkAnswerButtonOverflow();
                }
                
                // Check if scroll indicator should be shown
                if (window.UI && window.UI.checkScrollIndicator) {
                    window.UI.checkScrollIndicator();
                }
            }, 100);
        });
    },

    handleAnswer: function(btn, isCorrect, isDontKnow, chosenAnswer) {
        // Only allow answering if not viewing history
        if (window.APP.isViewingHistory) {
            return;
        }
        
        // Increment attempt counter (track which attempt this is: 1st, 2nd, 3rd, etc.)
        window.APP.currentQ.attemptNumber = (window.APP.currentQ.attemptNumber || 0) + 1;
        
        // Store the chosen answer for tracking
        window.APP.currentQ.chosenAnswer = chosenAnswer;
        
        // Calculate time spent on this question
        const timeSpent = Math.floor((Date.now() - window.APP.startTime) / 1000);
        
        // Disable all
        const allButtons = document.getElementById('mc-options').querySelectorAll('button');
        allButtons.forEach(b => b.disabled=true);

        // Calculate response time
        const timeTaken = (Date.now() - window.APP.startTime) / 1000;

        let delta = 0;
        const isWhyQuestion = window.APP.currentQ.type === 'why';
        
        // Spaced repetition: Check if this question was from a lower level
        const questionLevel = window.APP.currentQ.questionLevel || window.APP.level;
        const levelDifference = window.APP.level - questionLevel;
        const isSpacedRepetition = levelDifference > 0.5; // Question is from a lower level

        if (isDontKnow) {
            // "I don't know" feature: Allow users to skip without penalty
            // Requirements:
            // - No penalty: don't affect streak or history
            // - Adaptive difficulty: reduce level by 0.3 to make future questions easier
            // - Show explanation: display correct answer and explanation for learning
            btn.className = "p-2 bg-yellow-600 rounded text-lg border border-yellow-400 flex flex-wrap items-center justify-center min-h-[60px]";
            delta = -0.3; // Reduce difficulty to provide easier follow-up questions (adaptive difficulty)
            
            // Don't affect streak or history for "I don't know" - this is the "no penalty" part
            
            // Highlight the correct answer in green to show what the answer was
            allButtons.forEach(b => {
                if (b.dataset.correct === 'true') {
                    b.className = "p-4 bg-green-600 rounded text-lg border border-green-400 flex items-center justify-center min-h-[60px]";
                }
            });
            
            // Show explanation in modal (no retry option for "I don't know")
            window.ExplanationModal.show(window.APP.currentQ.explanation, false);
            
            // Save to storage (with dontKnow flag)
            this.saveQuestionToStorage(timeSpent, false, true);
            
            // Update session log - don't count as correct or incorrect
            if (window.Generator && window.Generator.recordQuestionAsked) {
                window.Generator.recordQuestionAsked(window.APP.currentQ, undefined);
            }
            
        } else if (isCorrect) {
            btn.className = "p-2 bg-green-600 rounded text-lg border border-green-400 flex flex-wrap items-center justify-center min-h-[60px]";
            window.APP.history.push(1);
            
            // Track response speed
            let speedFactor = 1; // Default: normal speed
            if (timeTaken < FAST_ANSWER_THRESHOLD) {
                speedFactor = 1; // Fast answer
                window.APP.speedHistory.push(1);
            } else if (timeTaken > SLOW_ANSWER_THRESHOLD) {
                speedFactor = 0.5; // Slow answer - reduced level gain
                window.APP.speedHistory.push(0);
            } else {
                speedFactor = 0.75; // Normal speed
                window.APP.speedHistory.push(0.5);
            }
            
            // --- MOMENTUM LOGIC with Speed Factor ---
            window.APP.streak++;
            
            if (window.APP.streak >= 3) delta = TURBO_LEVEL_DELTA * speedFactor; // Acceleration with speed
            else delta = BASE_LEVEL_DELTA * speedFactor; // Base movement with speed
            
            // SPACED REPETITION BONUS: Correct answers on review questions boost level more
            // Consistent correct answers on lower-level material accelerates progression
            if (isSpacedRepetition) {
                // Bonus multiplier based on how much lower the question was
                // Ranges from 1.2x (1 level down) to 1.5x (3+ levels down)
                const bonusMultiplier = 1.2 + Math.min(levelDifference * 0.1, 0.3);
                delta *= bonusMultiplier;
            }
            
            // Determine feedback based on speed
            let isSlow = timeTaken > SLOW_ANSWER_THRESHOLD;
            
            // Gamification: Toast, Confetti, Points Animation
            window.Gamification.showCorrectFeedback(delta, isSlow);
            
            // Save to storage (correct answer)
            this.saveQuestionToStorage(timeSpent, true, false);
            
            // Update session log with correct answer
            if (window.Generator && window.Generator.recordQuestionAsked) {
                window.Generator.recordQuestionAsked(window.APP.currentQ, true);
            }
            
            // Auto-advance after short delay (no Next button needed)
            setTimeout(() => {
                window.UI.nextQuestion();
            }, AUTO_ADVANCE_DELAY_MS);

        } else {
            btn.className = "p-2 bg-red-600 rounded text-lg border border-red-400 flex flex-wrap items-center justify-center min-h-[60px]";
            window.APP.history.push(0);
            
            // Track specific error patterns for Fixing Habits questions
            this.trackErrorPattern(window.APP.currentQ);
            
            // Check if we should show a break splash screen
            this.checkForBreakTime();
            
            // Frustration Breaker
            if (window.APP.streak <= 0) delta = -0.8; // Second wrong answer drops hard
            else delta = -0.3; // First wrong answer drops distinct amount
            
            // SPACED REPETITION PENALTY: Incorrect answers on much easier questions drop level more
            // If student fails a question that's significantly below their level, penalize proportionally
            if (isSpacedRepetition && levelDifference >= 2) {
                // Additional penalty based on level gap
                // Failing a question 2 levels down adds -0.3, 3 levels adds -0.4, etc.
                const penaltyMultiplier = 1 + (levelDifference * 0.2);
                delta *= penaltyMultiplier;
            }
            
            window.APP.streak = 0; // Reset streak
            
            // Highlight the correct answer in green
            allButtons.forEach(b => {
                // Check if this button is marked as correct
                if (b.dataset.correct === 'true') {
                    b.className = "p-2 bg-green-600 rounded text-lg border border-green-400 flex flex-wrap items-center justify-center min-h-[60px]";
                }
            });
            
            // Show explanation in modal with retry option - use positive framing
            const detailedExplanation = window.ExplanationModal.generateDetailedExplanation(window.APP.currentQ);
            window.ExplanationModal.show(window.APP.currentQ.explanation, true, detailedExplanation);
            
            // Save to storage (wrong answer)
            this.saveQuestionToStorage(timeSpent, false, false);
            
            // Update session log with incorrect answer
            if (window.Generator && window.Generator.recordQuestionAsked) {
                window.Generator.recordQuestionAsked(window.APP.currentQ, false);
            }
        }
        
        // Record answer for Fixing Habits questions
        if (window.APP.currentQ.type === 'fixing-habits' && window.FixingHabitsQuestions) {
            window.FixingHabitsQuestions.recordFixingHabitsAnswer(
                window.APP.currentQ.habitType,
                isCorrect
            );
        }
        
        // Update and Animate Level (applies to both correct and wrong)
        this.applyLevelChange(delta);
    },
    
    // Track error patterns to trigger Fixing Habits questions
    trackErrorPattern: function(question) {
        // Only track errors on regular questions (not fixing-habits questions themselves)
        if (question.type === 'fixing-habits' || question.type === 'why') {
            return;
        }
        
        // Check for square root sign errors - only for quadratic solving questions
        // Be conservative: only track when the question is explicitly about solving x² = constant
        if (question.instruction && 
            (question.instruction.toLowerCase().includes('solve') || 
             question.instruction.toLowerCase().includes('find x')) &&
            question.tex && 
            question.tex.match(/x\^2\s*=\s*\d+/) && 
            question.displayAnswer && 
            question.displayAnswer.includes('x =') &&
            !question.displayAnswer.includes('\\pm')) {
            // This is a quadratic solving question where ± notation should likely be used
            // The absence of ± suggests the question is asking for only one solution
            // (e.g., "find the positive solution"), which when answered incorrectly
            // may indicate the student doesn't understand the ± concept
            window.APP.errorTracker.squareRootSign++;
        }
        
        // Check for division by zero errors - only when simplifying rational expressions
        // Be conservative: only track for simplification questions with fractions
        if (question.instruction && 
            question.instruction.toLowerCase().includes('simplif') &&
            question.tex && 
            (question.tex.includes('\\frac') || question.tex.includes('/'))) {
            // Track potential division issues only for simplification problems
            window.APP.errorTracker.divisionByZero++;
        }
    },
    
    saveQuestionToStorage: function(timeSpent, isCorrect, isDontKnow) {
        // Only save if in learning/drill mode (not calibration)
        // Support both 'learning' (new) and 'drill' (old) for backward compatibility
        if (window.APP.mode !== 'drill' && window.APP.mode !== 'learning') {
            return;
        }
        
        // Prepare question data with all required fields
        const questionData = {
            question: window.APP.currentQ.tex,
            allAnswers: window.APP.currentQ.allAnswers || [window.APP.currentQ.displayAnswer], // All answer options
            chosenAnswer: window.APP.currentQ.chosenAnswer || '', // User's chosen answer
            correctAnswer: window.APP.currentQ.displayAnswer,
            userAnswer: window.APP.currentQ.chosenAnswer || '', // Deprecated field, kept for compatibility
            advice: isCorrect ? '' : window.APP.currentQ.explanation,
            timeSpent: timeSpent,
            datetime: Date.now(),
            isCorrect: isCorrect,
            isDontKnow: isDontKnow,
            attemptNumber: window.APP.currentQ.attemptNumber || 1, // Track which attempt (1st, 2nd, etc.)
            topic: window.APP.currentQ.topic || 'Unknown',
            level: window.APP.currentQ.questionLevel || window.APP.level,
            hintsUsed: 0 // For future feature
        };
        
        // Generate unique hash for this event
        questionData.eventHash = window.StorageManager.generateEventHash(questionData);
        
        // Save to IndexedDB
        window.StorageManager.saveQuestion(questionData)
            .then(async () => {
                // Clear history cache so it will be reloaded with new question
                window.APP.questionHistory = [];
                // Update navigation buttons to enable left button now that we have history
                try {
                    await window.UI.updateNavigationButtons();
                } catch (error) {
                    console.error('Error updating navigation buttons:', error);
                }
            })
            .catch(error => console.error('Error saving question:', error));
        
        // Update cumulative stats in localStorage
        const statUpdates = {
            totalQuestions: 1
        };
        
        if (isCorrect) {
            statUpdates.correctAnswers = 1;
        } else if (isDontKnow) {
            statUpdates.dontKnowAnswers = 1;
        } else {
            statUpdates.wrongAnswers = 1;
        }
        
        window.StorageManager.updateStats(statUpdates);
    },

    // Check if user needs a break based on session patterns
    checkForBreakTime: function() {
        // Only check in learning/drill mode (both checks needed for backward compatibility
        // since older saved data may still use 'drill' mode identifier)
        if (window.APP.mode !== 'learning' && window.APP.mode !== 'drill') {
            return;
        }
        
        // Check recent performance in history
        const recentHistory = window.APP.history.slice(-BREAK_CHECK_RECENT_QUESTIONS);
        if (recentHistory.length < BREAK_CHECK_MIN_QUESTIONS) {
            return; // Not enough data
        }
        
        const recentCorrect = recentHistory.reduce((sum, val) => sum + val, 0);
        const recentScore = (recentCorrect / recentHistory.length) * 100;
        
        // Get active time
        const activeTimeSeconds = window.ActivityTracker ? window.ActivityTracker.getActiveTime() : 0;
        const activeTimeMinutes = activeTimeSeconds / 60;
        
        // Check for rapid "don't know" or wrong answers (potential random clicking)
        const lastFiveHistory = window.APP.history.slice(-BREAK_CHECK_RAPID_WINDOW);
        const lastFiveCorrect = lastFiveHistory.reduce((sum, val) => sum + val, 0);
        
        // Trigger break splash if:
        // 1. Long session (>BREAK_SESSION_MIN_MINUTES) AND score dropping below BREAK_SCORE_THRESHOLD
        // 2. OR rapid failures in last BREAK_CHECK_RAPID_WINDOW (≤BREAK_RAPID_CORRECT_THRESHOLD correct)
        const needsBreak = (activeTimeMinutes > BREAK_SESSION_MIN_MINUTES && recentScore < BREAK_SCORE_THRESHOLD) || 
                          (lastFiveHistory.length >= BREAK_CHECK_RAPID_WINDOW && lastFiveCorrect <= BREAK_RAPID_CORRECT_THRESHOLD);
        
        if (needsBreak) {
            // Don't show more than once per cooldown period
            const lastBreakTime = window.APP.lastBreakSplashTime || 0;
            const timeSinceLastBreak = Date.now() - lastBreakTime;
            
            if (timeSinceLastBreak > BREAK_SPLASH_COOLDOWN_MS) {
                this.showBreakSplash();
                window.APP.lastBreakSplashTime = Date.now();
            }
        }
    },
    
    // Show encouraging break splash screen
    showBreakSplash: function() {
        const messages = [
            { emoji: "🌟", text: "Great work today!", subtext: "It's time to take a rest! Get some fresh air!" },
            { emoji: "💪", text: "You've earned a break!", subtext: "Your brain needs time to process what you've learned!" },
            { emoji: "🎯", text: "Excellent effort today!", subtext: "Taking breaks helps you learn better!" },
            { emoji: "🌱", text: "Well done!", subtext: "Rest is an important part of learning!" },
            { emoji: "⭐", text: "You worked hard!", subtext: "Time to recharge and come back stronger!" },
            { emoji: "🧠", text: "Great persistence!", subtext: "Your brain will thank you for a break!" }
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        const splashHTML = `
            <div id="break-splash" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] animate-fade-in">
                <div class="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl shadow-2xl border-4 border-yellow-400 max-w-2xl w-full p-12 text-center transform animate-scale-in">
                    <div class="text-8xl mb-6">${message.emoji}</div>
                    <h2 class="text-5xl font-bold text-yellow-300 mb-4">${message.text}</h2>
                    <p class="text-2xl text-gray-200 mb-8">${message.subtext}</p>
                    <button onclick="this.closest('#break-splash').remove()" class="px-8 py-4 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-xl shadow-lg transition-all hover:scale-105">
                        Got it! 👍
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', splashHTML);
        
        // Auto-dismiss after 10 seconds if user doesn't click
        setTimeout(() => {
            const splash = document.getElementById('break-splash');
            if (splash) splash.remove();
        }, 10000);
    },

    applyLevelChange: function(delta) {
        // Update internal level tracking
        window.APP.level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, window.APP.level + delta));
        
        // Note: delta-display and direct level-display updates removed
        // Display is now managed by DisplayModes system based on user preference
        // Internal level numbers should never flash or be directly visible to users
    }
};

// Backward compatibility: Drill is now Learning
window.Drill = window.Learning;
