// Debug Mode Cheat Code Handler
window.DEBUG_MODE = false;

// Testing mode for automated validation - allows forcing specific levels and question types via URL parameters
window.TESTING_MODE = false;
window.FORCED_TEST_LEVEL = null;
window.FORCED_QUESTION_TYPE = null; // Force specific question type within a level

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
        
        // Check for testing mode URL parameters
        this.checkTestingModeParams();
    },
    
    /**
     * Check for testing mode URL parameters
     * ?testLevel=N - Forces questions to be generated at level N (1-34)
     * ?testType=M - Forces specific question type M within the level
     * ?testMode=true - Enables testing mode (skips calibration, shows level info)
     * 
     * Example: ?testLevel=4&testType=2 forces level 4 (Fractions) question type 2 (multiply fractions)
     */
    checkTestingModeParams: function() {
        const urlParams = new URLSearchParams(window.location.search);
        
        const testLevel = urlParams.get('testLevel');
        const testType = urlParams.get('testType');
        const testMode = urlParams.get('testMode');
        
        if (testLevel !== null) {
            const level = parseInt(testLevel, 10);
            if (!isNaN(level) && level >= 1 && level <= 40) {
                window.TESTING_MODE = true;
                window.FORCED_TEST_LEVEL = level;
                window.DEBUG_MODE = true;
                this.debugModeActive = true;
                
                // Also check for forced question type
                if (testType !== null) {
                    const qType = parseInt(testType, 10);
                    if (!isNaN(qType) && qType >= 1) {
                        window.FORCED_QUESTION_TYPE = qType;
                        console.log(`🧪 Testing Mode: Forcing level ${level}, question type ${qType}`);
                    }
                } else {
                    console.log(`🧪 Testing Mode: Forcing level ${level}`);
                }
                
                // Show a testing mode indicator
                this.showTestingModeIndicator(level, window.FORCED_QUESTION_TYPE);
            }
        } else if (testMode === 'true') {
            window.TESTING_MODE = true;
            window.DEBUG_MODE = true;
            this.debugModeActive = true;
            console.log('🧪 Testing Mode: Enabled (no forced level)');
        }
    },
    
    /**
     * Show testing mode indicator in the UI
     */
    showTestingModeIndicator: function(level, questionType) {
        // Create and show a testing mode banner
        const indicator = document.createElement('div');
        indicator.id = 'testing-mode-indicator';
        indicator.className = 'fixed top-0 left-0 right-0 bg-purple-600 text-white text-center py-1 text-sm z-50';
        
        let labelText = `🧪 Testing Mode - Level: <strong>${level}</strong>`;
        if (questionType !== null) {
            labelText += ` | Type: <strong>${questionType}</strong>`;
        }
        indicator.innerHTML = labelText;
        document.body.insertBefore(indicator, document.body.firstChild);
        
        // Mark body for screenshot identification
        document.body.setAttribute('data-testing-mode', 'true');
        document.body.setAttribute('data-forced-level', level);
        if (questionType !== null) {
            document.body.setAttribute('data-forced-type', questionType);
        }
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
        
        // Read and validate the level input
        const levelInput = document.getElementById('debug-level-input');
        const levelValue = levelInput ? levelInput.value : '';
        
        if (levelValue && levelValue.trim() !== '') {
            const targetLevel = parseInt(levelValue, 10);
            
            // Validate level is within bounds (1 to MAX_LEVEL from constants.js)
            const MAX_LEVEL = window.MAX_LEVEL || 34;
            const MIN_LEVEL = window.MIN_LEVEL || 1;
            
            if (!isNaN(targetLevel) && targetLevel >= MIN_LEVEL && targetLevel <= MAX_LEVEL) {
                // Set the user's level and switch to learning mode (skip calibration)
                if (window.APP) {
                    window.APP.level = targetLevel;
                    
                    // If in calibration mode, switch to learning mode to skip calibration
                    if (window.APP.mode === 'calibration') {
                        window.APP.mode = 'learning';
                        // Set calibration range for consistency
                        window.APP.cMin = targetLevel;
                        window.APP.cMax = targetLevel;
                        
                        // Clear any calibration timeout
                        if (window.Calibration && window.Calibration.clearTimeout) {
                            window.Calibration.clearTimeout();
                        }
                        
                        // Update mode badge
                        const modeBadge = document.getElementById('mode-badge');
                        if (modeBadge) {
                            modeBadge.innerText = "Learning Phase";
                            modeBadge.className = "px-3 py-1 bg-purple-900 text-purple-200 text-xs font-bold uppercase rounded-full tracking-wide";
                        }
                        
                        // Hide calibration controls and show learning controls
                        const calibrationControls = document.getElementById('controls-calibration');
                        const learningControls = document.getElementById('controls-learning');
                        if (calibrationControls) calibrationControls.classList.add('hidden');
                        if (learningControls) learningControls.classList.remove('hidden');
                        
                        // Generate a new question at the target level
                        if (window.UI && window.UI.nextQuestion) {
                            window.UI.nextQuestion();
                        }
                    }
                    
                    console.log(`🐛 Debug Mode: Level set to ${targetLevel}`);
                }
            } else {
                console.warn(`Invalid level input: ${levelValue}. Must be between ${MIN_LEVEL} and ${MAX_LEVEL}.`);
            }
        }
        
        // Clear the input for next time
        if (levelInput) {
            levelInput.value = '';
        }
        
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
        // Clear the level input when cancelling
        const levelInput = document.getElementById('debug-level-input');
        if (levelInput) {
            levelInput.value = '';
        }
        
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
