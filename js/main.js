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
        
        // Load student name from storage
        window.APP.studentName = window.StorageManager.getStudentName();
        
        // Initialize stats modal
        window.StatsModal.init();
        
        // Initialize time tracking modal
        window.TimeTrackingModal.init();
        
        // Initialize explanation modal
        window.ExplanationModal.init();
        
        // Initialize help modal
        window.HelpModal.init();
        
        // Start first question
        window.UI.nextQuestion();
        
        // Check if we need to prompt for student name (after UI is ready)
        setTimeout(() => {
            if (window.NameModal) {
                window.NameModal.checkAndPromptForName();
            }
        }, 500);
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
