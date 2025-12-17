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

        opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "p-2 bg-gray-700 hover:bg-gray-600 rounded text-lg border border-gray-600 transition flex flex-wrap items-center justify-center min-h-[60px]";
            if (window.DEBUG_MODE && opt.correct) btn.classList.add('debug-correct');
            btn.dataset.correct = opt.correct.toString();
            btn.dataset.dontKnow = (opt.dontKnow || false).toString();
            btn.onclick = () => this.handleAnswer(btn, opt.correct, opt.dontKnow);
            
            // Use plain text for "I don't know" with "(no penalty)" indicator, LaTeX for others
            if (opt.dontKnow) {
                btn.innerHTML = `<div class="flex flex-col items-center">
                    <span class="italic text-gray-400">${opt.val}</span>
                    <span class="text-xs text-gray-500 mt-1">(no penalty)</span>
                </div>`;
            } else {
                // Smart rendering: Use plain text with unicode for simple text answers,
                // LaTeX only for mathematical expressions
                const needsLatex = /[\^_{}\\]|frac|sqrt|cdot|times|pm|leq|geq|sum|int|lim|log|sin|cos|tan|alpha|beta|gamma|delta|theta|pi/.test(opt.val);
                
                if (needsLatex) {
                    // Render as LaTeX math for complex expressions
                    btn.innerHTML = `\\( ${opt.val} \\)`;
                } else {
                    // Render as plain text with proper spacing and non-italic font
                    // Replace unicode math symbols if present
                    const textContent = opt.val
                        .replace(/𝑓/g, '<span style="font-style: italic;">f</span>')
                        .replace(/𝑔/g, '<span style="font-style: italic;">g</span>');
                    btn.innerHTML = `<span style="font-style: normal; word-spacing: 0.15em;">${textContent}</span>`;
                }
            }
            container.appendChild(btn);
        });
        MathJax.typesetPromise([container]);
    },

    handleAnswer: function(btn, isCorrect, isDontKnow) {
        // Only allow answering if not viewing history
        if (window.APP.isViewingHistory) {
            return;
        }
        
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
            
            // Auto-advance after short delay (no Next button needed)
            setTimeout(() => {
                window.UI.nextQuestion();
            }, AUTO_ADVANCE_DELAY_MS);

        } else {
            btn.className = "p-2 bg-red-600 rounded text-lg border border-red-400 flex flex-wrap items-center justify-center min-h-[60px]";
            window.APP.history.push(0);
            
            // Track specific error patterns for Fixing Habits questions
            this.trackErrorPattern(window.APP.currentQ);
            
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
            
            // Show explanation in modal with retry option
            window.ExplanationModal.show(window.APP.currentQ.explanation, true);
            
            // Save to storage (wrong answer)
            this.saveQuestionToStorage(timeSpent, false, false);
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
            // Only increment if the correct answer doesn't use ± (meaning it's a partial answer)
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
        
        // Prepare question data
        const questionData = {
            question: window.APP.currentQ.tex,
            userAnswer: '', // We don't track which button was clicked, just correct/wrong
            correctAnswer: window.APP.currentQ.displayAnswer,
            advice: isCorrect ? '' : window.APP.currentQ.explanation,
            timeSpent: timeSpent,
            datetime: Date.now(),
            isCorrect: isCorrect,
            isDontKnow: isDontKnow,
            topic: window.APP.currentQ.topic || 'Unknown', // Add topic tracking
            level: window.APP.currentQ.questionLevel || window.APP.level // Add level tracking
        };
        
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

    applyLevelChange: function(delta) {
        // 1. Update data
        window.APP.level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, window.APP.level + delta));
        
        // 2. Animate visually
        const deltaEl = document.getElementById('delta-display');
        deltaEl.innerText = (delta > 0 ? '+' : '') + delta.toFixed(1);
        deltaEl.className = delta > 0 
            ? "text-xl font-bold absolute left-16 top-0 float-up" 
            : "text-xl font-bold absolute left-16 top-0 float-down";
        
        // Update text instantly
        document.getElementById('level-display').innerText = window.APP.level.toFixed(1);
    }
};

// Backward compatibility: Drill is now Learning
window.Drill = window.Learning;
