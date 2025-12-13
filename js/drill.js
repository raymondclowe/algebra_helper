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
        
        // Add "Don't know" option for "why" questions
        if (isWhyQuestion) {
            opts.push({ val: "Don't know", correct: false, dontKnow: true });
        }

        opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "p-4 bg-gray-700 hover:bg-gray-600 rounded text-lg border border-gray-600 transition flex items-center justify-center min-h-[60px]";
            if (window.DEBUG_MODE && opt.correct) btn.classList.add('debug-correct');
            btn.dataset.correct = opt.correct.toString();
            btn.dataset.dontKnow = (opt.dontKnow || false).toString();
            btn.onclick = () => this.handleAnswer(btn, opt.correct, opt.dontKnow);
            
            // Use plain text for "Don't know", LaTeX for others
            if (opt.dontKnow) {
                btn.innerHTML = `<span class="italic text-gray-400">${opt.val}</span>`;
            } else {
                btn.innerHTML = `\\( ${opt.val} \\)`;
            }
            container.appendChild(btn);
        });
        MathJax.typesetPromise([container]);
    },

    handleAnswer: function(btn, isCorrect, isDontKnow) {
        // Disable all
        const allButtons = document.getElementById('mc-options').querySelectorAll('button');
        allButtons.forEach(b => b.disabled=true);

        // Calculate response time
        const timeTaken = (Date.now() - window.APP.startTime) / 1000;

        let delta = 0;
        const isWhyQuestion = window.APP.currentQ.type === 'why';

        if (isDontKnow) {
            // "Don't know" - neutral outcome (no score change)
            btn.className = "p-4 bg-yellow-600 rounded text-lg border border-yellow-400 flex items-center justify-center min-h-[60px]";
            delta = 0; // No score change
            
            // Don't affect streak or history for "Don't know"
            
            // Show explanation immediately
            const box = document.getElementById('explanation-box');
            box.classList.remove('hidden');
            document.getElementById('explanation-text').innerHTML = window.APP.currentQ.explanation;
            MathJax.typesetPromise([box]);
            
            // Highlight the correct answer in green
            allButtons.forEach(b => {
                if (b.dataset.correct === 'true') {
                    b.className = "p-4 bg-green-600 rounded text-lg border border-green-400 flex items-center justify-center min-h-[60px]";
                }
            });
            
            // Show Next button
            document.getElementById('next-btn').classList.remove('invisible');
            
        } else if (isCorrect) {
            btn.className = "p-4 bg-green-600 rounded text-lg border border-green-400 flex items-center justify-center min-h-[60px]";
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
            
            if (window.APP.streak >= 3) delta = 0.5 * speedFactor; // Acceleration with speed
            else delta = 0.2 * speedFactor; // Base movement with speed
            
            // Determine feedback based on speed
            let isSlow = timeTaken > SLOW_ANSWER_THRESHOLD;
            
            // Gamification: Toast, Confetti, Points Animation
            window.Gamification.showCorrectFeedback(delta, isSlow);
            
            // Auto-advance after short delay (no Next button needed)
            setTimeout(() => {
                window.UI.nextQuestion();
            }, AUTO_ADVANCE_DELAY_MS);

        } else {
            btn.className = "p-4 bg-red-600 rounded text-lg border border-red-400 flex items-center justify-center min-h-[60px]";
            window.APP.history.push(0);
            
            // Frustration Breaker
            if (window.APP.streak <= 0) delta = -0.8; // Second wrong answer drops hard
            else delta = -0.3; // First wrong answer drops distinct amount
            
            window.APP.streak = 0; // Reset streak
            
            // Highlight the correct answer in green
            allButtons.forEach(b => {
                // Check if this button is marked as correct
                if (b.dataset.correct === 'true') {
                    b.className = "p-4 bg-green-600 rounded text-lg border border-green-400 flex items-center justify-center min-h-[60px]";
                }
            });
            
            // Show Explanation
            const box = document.getElementById('explanation-box');
            box.classList.remove('hidden');
            document.getElementById('explanation-text').innerHTML = window.APP.currentQ.explanation;
            MathJax.typesetPromise([box]);
            
            // Show Next button ONLY for wrong answers (correct answers auto-advance)
            document.getElementById('next-btn').classList.remove('invisible');
        }
        
        // Update and Animate Level (applies to both correct and wrong)
        this.applyLevelChange(delta);
    },

    applyLevelChange: function(delta) {
        // 1. Update data
        window.APP.level = Math.max(1, Math.min(10, window.APP.level + delta));
        
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
