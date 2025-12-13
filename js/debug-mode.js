// Debug Mode Cheat Code Handler
window.DEBUG_MODE = false;

window.DebugCheatCode = {
    // Configuration
    DEBUG_TIMEOUT_MINUTES: 10,
    
    // State
    sequence: [],
    targetSequence: ['d', 'e', 'b', 'u', 'g'],
    debugModeActive: false,
    debugModeTimeout: null,
    debugModeEndTime: null,
    timerInterval: null,

    init: function() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    },

    handleKeyPress: function(e) {
        // Only track letter keys (more efficient character check)
        if (e.key.length === 1 && ((e.key >= 'a' && e.key <= 'z') || (e.key >= 'A' && e.key <= 'Z'))) {
            this.sequence.push(e.key.toLowerCase());
            
            // Keep only last 5 keys
            if (this.sequence.length > this.targetSequence.length) {
                this.sequence.shift();
            }

            // Check if sequence matches
            if (this.sequence.join('') === this.targetSequence.join('')) {
                this.sequence = []; // Reset sequence
                if (!this.debugModeActive) {
                    this.showWarning();
                }
            }
        }
    },

    showWarning: function() {
        const modal = document.getElementById('debug-warning-modal');
        
        // Update timeout text dynamically
        const timeoutText = modal.querySelector('.text-yellow-400.font-bold');
        if (timeoutText) {
            timeoutText.textContent = `⏱️ Auto-expires in ${this.DEBUG_TIMEOUT_MINUTES} minutes`;
        }
        
        modal.classList.remove('hidden');
    },

    confirmDebugMode: function() {
        this.debugModeActive = true;
        window.DEBUG_MODE = true;
        document.getElementById('debug-warning-modal').classList.add('hidden');
        
        // Set timeout using configured duration
        const timeoutMs = this.DEBUG_TIMEOUT_MINUTES * 60 * 1000;
        this.debugModeEndTime = Date.now() + timeoutMs;
        
        this.debugModeTimeout = setTimeout(() => {
            this.deactivateDebugMode();
        }, timeoutMs);

        // Show indicator and start timer
        document.getElementById('debug-mode-indicator').classList.remove('hidden');
        this.startTimer();

        // Refresh UI to show debug markers
        this.refreshDebugUI();
    },

    cancelDebugMode: function() {
        document.getElementById('debug-warning-modal').classList.add('hidden');
    },

    deactivateDebugMode: function() {
        this.debugModeActive = false;
        window.DEBUG_MODE = false;
        document.getElementById('debug-mode-indicator').classList.add('hidden');
        
        if (this.debugModeTimeout) {
            clearTimeout(this.debugModeTimeout);
            this.debugModeTimeout = null;
        }
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Refresh UI to remove debug markers
        this.refreshDebugUI();
    },

    refreshDebugUI: function() {
        // Refresh current question to show/hide debug markers
        if (window.APP && window.APP.mode === 'learning') {
            window.APP.setupLearningUI();
        }
    },

    startTimer: function() {
        // Set initial display
        const initialDisplay = `${this.DEBUG_TIMEOUT_MINUTES}:00`;
        document.getElementById('debug-timer').innerText = initialDisplay;
        
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    },

    updateTimerDisplay: function() {
        if (!this.debugModeEndTime) return;
        
        const remaining = Math.max(0, this.debugModeEndTime - Date.now());
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('debug-timer').innerText = display;

        if (remaining <= 0) {
            this.deactivateDebugMode();
        }
    }
};
