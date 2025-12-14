// Calibration Logic
window.Calibration = {
    timeoutId: null,
    timeoutDuration: 5000, // 5 seconds in milliseconds
    
    startTimeout: function() {
        // Clear any existing timeout
        this.clearTimeout();
        
        // Show and start the timeout bar animation
        const barContainer = document.getElementById('timeout-bar-container');
        const bar = document.getElementById('timeout-bar');
        
        if (barContainer && bar) {
            barContainer.classList.remove('hidden');
            bar.classList.remove('timeout-bar-shrinking');
            // Force reflow to restart animation
            void bar.offsetWidth;
            bar.classList.add('timeout-bar-shrinking');
        }
        
        // Set timeout to auto-submit as "don't know"
        this.timeoutId = setTimeout(() => {
            this.handleTimeout();
        }, this.timeoutDuration);
    },
    
    clearTimeout: function() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        
        // Hide the timeout bar
        const barContainer = document.getElementById('timeout-bar-container');
        const bar = document.getElementById('timeout-bar');
        
        if (barContainer && bar) {
            barContainer.classList.add('hidden');
            bar.classList.remove('timeout-bar-shrinking');
        }
    },
    
    handleTimeout: function() {
        // Auto-submit as "don't know" (fail)
        this.handleCalibration('fail');
    },
    
    handleCalibration: function(action) {
        // Clear timeout when user responds
        this.clearTimeout();
        
        const timeTaken = (Date.now() - window.APP.startTime) / 1000;
        
        // Record this calibration response
        window.APP.calibrationHistory.push({
            level: window.APP.level,
            action: action,
            timeTaken: timeTaken
        });
        
        // Binary Logic
        if (action === 'pass') {
            if(timeTaken > 20) { 
                // Too slow - counts as Not Sure
                window.APP.cMax = window.APP.level;
            } else {
                window.APP.cMin = window.APP.level;
            }
        } else {
            // Fail or Doubt
            window.APP.cMax = window.APP.level;
        }

        // Check if we have enough confidence to end calibration
        if (this.shouldEndCalibration()) {
            // Ready to learn. Start slightly below found level.
            window.APP.level = Math.max(1, window.APP.cMin - 1.0); 
            // Support both 'learning' (new) and 'drill' (old) for backward compatibility
            window.APP.mode = 'learning';
            // Visual update
            document.getElementById('mode-badge').innerText = "Learning Phase";
            document.getElementById('mode-badge').className = "px-3 py-1 bg-purple-900 text-purple-200 text-xs font-bold uppercase rounded-full tracking-wide";
        } else {
            // Next step in binary search
            const nextVal = (window.APP.cMin + window.APP.cMax) / 2;
            window.APP.level = Math.round(nextVal * 2) / 2; // Step 0.5
        }
        window.UI.nextQuestion();
    },
    
    // Statistical confidence check for calibration completion
    shouldEndCalibration: function() {
        const MIN_RESPONSES = 6; // Minimum number of responses before ending
        const CONVERGENCE_THRESHOLD = 1.5; // Range must be narrow
        const CONSISTENCY_WINDOW = 4; // Check last N responses for consistency
        
        // Must have minimum responses
        if (window.APP.calibrationHistory.length < MIN_RESPONSES) {
            return false;
        }
        
        // Range must have converged
        if ((window.APP.cMax - window.APP.cMin) >= CONVERGENCE_THRESHOLD) {
            return false;
        }
        
        // Check for consistency in recent responses
        // Look at last CONSISTENCY_WINDOW responses
        const recent = window.APP.calibrationHistory.slice(-CONSISTENCY_WINDOW);
        
        // Count responses by type
        let passCount = 0;
        let failCount = 0;
        let doubtCount = 0;
        
        recent.forEach(r => {
            if (r.action === 'pass' && r.timeTaken <= 20) passCount++;
            else if (r.action === 'fail') failCount++;
            else doubtCount++;
        });
        
        // We need evidence of a consistent level:
        // - Not all the same response (would indicate no discrimination)
        // - Should have both "can do" and "can't do" signals
        // - Or consistent alternating pattern indicating we're at the boundary
        
        // If all same response, not confident yet
        if (passCount === CONSISTENCY_WINDOW || failCount === CONSISTENCY_WINDOW) {
            return false;
        }
        
        // If too much doubt/uncertainty, not confident yet
        if (doubtCount > CONSISTENCY_WINDOW / 2) {
            return false;
        }
        
        // Look for stable boundary: some passes and some fails in recent history
        // This indicates we've found the level where user transitions from "know" to "don't know"
        const hasPassSignal = passCount >= 1;
        const hasFailSignal = (failCount + doubtCount) >= 1;
        
        if (hasPassSignal && hasFailSignal) {
            // Check if the responses are within the converged range
            // Calculate average level of recent responses
            const recentLevels = recent.map(r => r.level);
            const avgLevel = recentLevels.reduce((a, b) => a + b, 0) / recentLevels.length;
            
            // If average is within our current range, we're stable
            if (avgLevel >= window.APP.cMin && avgLevel <= window.APP.cMax) {
                return true;
            }
        }
        
        return false;
    }
};
