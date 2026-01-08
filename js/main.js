// Main Initialization
window.APP.init = async function() { 
    if (window.MathJax && window.MathJax.typesetPromise) {
        // Initialize activity tracker
        window.ActivityTracker.init();
        
        // Initialize storage (IndexedDB)
        try {
            await window.StorageManager.init();
        } catch (error) {
            console.error('Error initializing storage:', error);
        }
        
        // Load user name from storage
        window.APP.studentName = window.StorageManager.getStudentName();
        
        // Initialize stats modal
        window.StatsModal.init();
        
        // Initialize time tracking modal
        window.TimeTrackingModal.init();
        
        // Initialize explanation modal
        window.ExplanationModal.init();
        
        // Initialize help modal
        window.HelpModal.init();
        
        // Initialize scroll indicator behavior
        window.UI.initScrollIndicator();
        
        // Check if testing mode should bypass calibration
        if (window.TESTING_MODE && window.FORCED_TEST_LEVEL) {
            // Skip calibration, go directly to learning mode at specified level
            window.APP.mode = 'learning';
            window.APP.level = window.FORCED_TEST_LEVEL;
            window.APP.cMin = window.FORCED_TEST_LEVEL;
            window.APP.cMax = window.FORCED_TEST_LEVEL;
            
            console.log(`🧪 Testing Mode: Bypassing calibration, starting at level ${window.FORCED_TEST_LEVEL}`);
        }
        
        // Start first question
        window.UI.nextQuestion();
        
        // Check if we need to prompt for student name (skip in testing mode)
        if (!window.TESTING_MODE) {
            setTimeout(() => {
                if (window.NameModal) {
                    window.NameModal.checkAndPromptForName();
                }
            }, 500);
        }
    } else {
        setTimeout(() => this.init(), 100);
    }
};

// Periodic save of active time to localStorage
setInterval(() => {
    const currentActiveTime = window.ActivityTracker.getActiveTime();
    const stats = window.StorageManager.getStats();
    
    // Update total active time
    stats.totalActiveTime = currentActiveTime;
    localStorage.setItem('algebraHelperStats', JSON.stringify(stats));
}, STATS_SAVE_INTERVAL_MS);

// Backward compatibility: expose methods on APP object
window.APP.nextQuestion = function() {
    window.UI.nextQuestion();
};

window.APP.handleCalibration = function(action) {
    window.Calibration.handleCalibration(action);
};

window.APP.setupLearningUI = function() {
    window.Learning.setupUI();
};

// Backward compatibility
window.APP.setupDrillUI = function() {
    window.Learning.setupUI();
};

window.APP.shouldEndCalibration = function() {
    return window.Calibration.shouldEndCalibration();
};

window.onload = () => {
    window.APP.init();
    window.DebugCheatCode.init();
};
