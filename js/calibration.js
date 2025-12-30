// ============================================================================
// CALIBRATION TIMEOUT CONFIGURATION
// ============================================================================
// Default timeout duration for calibration questions (in milliseconds).
// This value determines how long users have to answer during initial calibration.
// To change the timeout, modify the value below (e.g., 20000 for 20 seconds).
const CALIBRATION_TIMEOUT_MS = 15000; // 15 seconds

// ============================================================================
// Calibration Logic
// ============================================================================
window.Calibration = {
    timeoutId: null,
    timeoutDuration: CALIBRATION_TIMEOUT_MS,
    
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
            // Special case: if cMax <= 1, start at level 1 (user doesn't know anything)
            // Special case: if cMin >= MAX_LEVEL, start at MAX_LEVEL (user knows everything)
            if (window.APP.cMax <= MIN_LEVEL) {
                window.APP.level = MIN_LEVEL;
            } else if (window.APP.cMin >= MAX_LEVEL) {
                window.APP.level = MAX_LEVEL;
            } else {
                window.APP.level = Math.max(MIN_LEVEL, window.APP.cMin - 1.0);
            }
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
        const MIN_RESPONSES = 4; // Minimum number of responses before ending
        const MAX_RESPONSES = 6; // Maximum number of responses - binary search should converge by then
        const CONVERGENCE_THRESHOLD = 2.0; // Range must be narrow (relaxed from 1.5)
        const CONSISTENCY_WINDOW = 3; // Check last N responses for consistency (reduced from 4)
        
        // Hard maximum: Binary search should converge rapidly
        // After 6 questions, we have enough information to determine the level
        if (window.APP.calibrationHistory.length >= MAX_RESPONSES) {
            return true;
        }
        
        // Early termination: If both cMin and cMax indicate level 1 or below
        // This handles the case where user doesn't know anything
        if (window.APP.cMax <= MIN_LEVEL && window.APP.calibrationHistory.length >= MIN_RESPONSES) {
            return true;
        }
        
        // Early termination: If cMin is at or very close to maximum level
        // This handles the case where user knows everything
        // We check >= MAX_LEVEL - 1 because the binary search asymptotically approaches MAX_LEVEL
        // but may never reach it exactly (e.g., 23.25, 23.625, 23.8125, ...)
        if (window.APP.cMin >= MAX_LEVEL - 1 && window.APP.calibrationHistory.length >= MIN_RESPONSES) {
            return true;
        }
        
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
        
        // If all same response, not confident yet (unless we're at max responses)
        if (passCount === CONSISTENCY_WINDOW || failCount === CONSISTENCY_WINDOW) {
            return false;
        }
        
        // If too much doubt/uncertainty, not confident yet (unless we're at max responses)
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
