// UI Management Functions
window.UI = {
    _updatingButtons: false, // Flag to prevent concurrent button updates
    
    nextQuestion: function() {
        // If viewing history, return to present
        if (window.APP.isViewingHistory) {
            window.APP.isViewingHistory = false;
            window.APP.historyIndex = -1;
        }
        
        // UI Reset
        document.getElementById('explanation-box').classList.add('hidden');
        document.getElementById('next-btn').classList.add('invisible');
        document.getElementById('mc-options').innerHTML = '';
        // delta-display is permanently hidden (internal level tracking)
        
        this.updateUI();
        this.updateNavigationButtons();

        // Generate Question
        window.APP.currentQ = window.Generator.getQuestion(window.APP.level);
        window.APP.startTime = Date.now();

        // Render
        document.getElementById('instruction-text').innerText = window.APP.currentQ.instruction;
        const qDiv = document.getElementById('question-math');
        
        // Process LaTeX to improve line breaks and spacing
        // Replace \\[...em] line breaks with proper display breaks
        // Split on line breaks to create separate display math blocks
        let processedTex = window.APP.currentQ.tex;
        
        // Check if the question has the "Step:" pattern with line breaks
        if (processedTex.includes('\\\\[') && processedTex.includes('\\text{Step:')) {
            // Split into lines and render each as a separate display block
            const lines = processedTex.split(/\\\[\d*\.?\d*em\]/);
            const displayBlocks = lines.map(line => `\\[ ${line.trim()} \\]`).join('\n');
            qDiv.innerHTML = displayBlocks;
        } else {
            // Standard rendering for single-line questions
            qDiv.innerHTML = `\\[ ${processedTex} \\]`;
        }
        
        MathJax.typesetPromise([qDiv]);

        // Icon
        document.getElementById('calc-indicator').innerHTML = window.APP.currentQ.calc 
            ? '<span class="text-2xl">📱</span><div class="text-[8px] text-green-500 font-bold">Calc</div>' 
            : '<span class="text-2xl text-red-500 relative">✏️</span><div class="text-[8px] text-red-500 font-bold">No Calc</div>';

        // Mode View (support both learning and drill for backward compatibility)
        const isLearningMode = window.APP.mode === 'learning' || window.APP.mode === 'drill';
        document.getElementById('controls-calibration').classList.toggle('hidden', isLearningMode);
        
        // Try to find learning controls, fallback to drill controls for backward compatibility
        const learningControls = document.getElementById('controls-learning');
        const drillControls = document.getElementById('controls-drill');
        if (learningControls) {
            learningControls.classList.toggle('hidden', window.APP.mode === 'calibration');
        }
        if (drillControls) {
            drillControls.classList.toggle('hidden', window.APP.mode === 'calibration');
        }
        
        // Start timeout for calibration mode
        if (window.APP.mode === 'calibration') {
            window.Calibration.startTimeout();
        }
        
        if (isLearningMode) window.Learning.setupUI();
    },
    
    navigateHistory: async function(direction) {
        try {
            // Guard clause: Prevent navigation when button should be disabled
            // Direction -1 (right button → forward to newer/present): Only allow when viewing history
            // Direction 1 (left button ← back to older): Allow when not viewing history with history available, or in history not at oldest
            if (direction === -1 && !window.APP.isViewingHistory) {
                // Trying to go forward/next when already at present - button should be disabled
                return;
            }
            
            // Load question history if not already loaded
            if (window.APP.questionHistory.length === 0) {
                window.APP.questionHistory = await window.StorageManager.getAllQuestions();
                // Reverse to get newest first
                window.APP.questionHistory.reverse();
            }
            
            if (window.APP.questionHistory.length === 0) {
                return; // No history to navigate
            }
            
            // Calculate new index
            // When not viewing history (historyIndex = -1), going back (direction = 1) should show newest (index 0)
            let newIndex;
            if (window.APP.historyIndex === -1 && direction === 1) {
                // Starting to view history, show newest question
                newIndex = 0;
            } else {
                newIndex = window.APP.historyIndex + direction;
            }
            
            // If going forward past newest, return to present
            if (newIndex < 0) {
                this.nextQuestion(); // Return to present
                return;
            }
            
            // Don't go beyond oldest question in history
            if (newIndex >= window.APP.questionHistory.length) {
                return;
            }
            
            // Update index and flag
            window.APP.historyIndex = newIndex;
            window.APP.isViewingHistory = true;
            
            // Load and display the historical question
            const historyQuestion = window.APP.questionHistory[newIndex];
            this.displayHistoricalQuestion(historyQuestion);
            
        } catch (error) {
            console.error('Error navigating history:', error);
        }
    },
    
    displayHistoricalQuestion: function(historyQuestion) {
        // Clear current UI
        document.getElementById('mc-options').innerHTML = '';
        // delta-display is permanently hidden (internal level tracking)
        document.getElementById('next-btn').classList.add('invisible');
        
        // Show history indicator
        document.getElementById('instruction-text').innerText = `📜 VIEWING HISTORY (${window.APP.historyIndex + 1}/${window.APP.questionHistory.length})`;
        
        // Display question
        const qDiv = document.getElementById('question-math');
        qDiv.innerHTML = `\\[ ${historyQuestion.question} \\]`;
        MathJax.typesetPromise([qDiv]);
        
        // Show result indicator
        const resultClass = historyQuestion.isCorrect ? 'text-green-400' : 'text-red-400';
        const resultText = historyQuestion.isCorrect ? '✓ CORRECT' : '✗ WRONG';
        const resultHTML = `<div class="${resultClass} font-bold text-xl mb-4">${resultText}</div>`;
        
        // Display answer and advice
        const explanationBox = document.getElementById('explanation-box');
        const explanationText = document.getElementById('explanation-text');
        
        let content = resultHTML;
        content += `<div class="mb-2"><strong>Correct Answer:</strong> \\(${historyQuestion.correctAnswer}\\)</div>`;
        content += `<div class="mb-2"><strong>Time Spent:</strong> ${historyQuestion.timeSpent}s</div>`;
        
        if (!historyQuestion.isCorrect && historyQuestion.advice) {
            content += `<div class="mt-3"><strong>Explanation:</strong><br>${historyQuestion.advice}</div>`;
        }
        
        explanationText.innerHTML = content;
        explanationBox.classList.remove('hidden');
        MathJax.typesetPromise([explanationText]);
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Hide calc indicator when viewing history
        document.getElementById('calc-indicator').innerHTML = '';
    },
    
    setNavigationButtonState: function(button, enabled) {
        if (!button) return;
        
        if (enabled) {
            button.classList.remove('opacity-30', 'cursor-not-allowed');
            button.classList.add('hover:bg-gray-700', 'cursor-pointer');
        } else {
            button.classList.add('opacity-30', 'cursor-not-allowed');
            button.classList.remove('hover:bg-gray-700', 'cursor-pointer');
        }
    },
    
    updateNavigationButtons: async function() {
        const leftBtn = document.getElementById('history-nav-left');
        const rightBtn = document.getElementById('history-nav-right');
        
        if (!leftBtn || !rightBtn) return;
        
        // Prevent concurrent updates
        if (this._updatingButtons) return;
        this._updatingButtons = true;
        
        try {
            // If cache is empty and not viewing history, check if there are questions in IndexedDB
            let hasHistory = window.APP.questionHistory.length > 0;
            if (!hasHistory && !window.APP.isViewingHistory) {
                try {
                    const count = await window.StorageManager.getQuestionCount();
                    hasHistory = count > 0;
                } catch (error) {
                    console.error('Error checking question count:', error);
                }
            }
            
            // Left button (←): Go back to older questions
            // Enable when: NOT viewing history but have history, OR viewing history and not at the oldest
            const canGoLeft = (!window.APP.isViewingHistory && hasHistory) ||
                             (window.APP.isViewingHistory && window.APP.historyIndex < window.APP.questionHistory.length - 1);
            this.setNavigationButtonState(leftBtn, canGoLeft);
            
            // Right button (→): Go forward to newer questions or return to present
            // Enable when: viewing history (can always go forward/present from history)
            const canGoRight = window.APP.isViewingHistory;
            this.setNavigationButtonState(rightBtn, canGoRight);
        } finally {
            this._updatingButtons = false;
        }
    },

    updateUI: function() {
        // Use display mode system if available, otherwise fallback to original behavior
        if (window.DisplayModes) {
            const accuracy = window.APP.history.length > 0
                ? window.APP.history.slice(-5).reduce((a,b)=>a+b,0) / Math.min(5, window.APP.history.length)
                : null;
            window.DisplayModes.updateHeaderDisplay(window.APP.level, accuracy, window.APP.history);
        } else {
            // Fallback: original display logic
            document.getElementById('level-display').innerText = window.APP.level.toFixed(1);
            
            const accEl = document.getElementById('accuracy-display');
            if (window.APP.history.length > 0) {
                const subset = window.APP.history.slice(-5);
                const avg = Math.round((subset.reduce((a,b)=>a+b,0)/subset.length)*100);
                accEl.innerText = avg + "%";
                accEl.className = avg >= 80 ? "text-xl font-bold text-green-400" 
                                : avg < 50 ? "text-xl font-bold text-red-400" 
                                : "text-xl font-bold text-yellow-400";
            } else {
                accEl.innerText = "--%";
            }
        }
        
        // Calibration Window Display - Removed: Internal level ranges should never be user-visible
        // search-range element is permanently hidden in HTML
        
        // Show Turbo Fire if streak high (tooltip added in HTML)
        const fire = document.getElementById('streak-indicator');
        if (window.APP.streak >= 3) fire.classList.remove('hidden');
        else fire.classList.add('hidden');
    }
};
