// Main Initialization
window.APP.init = function() { 
    if (window.MathJax && window.MathJax.typesetPromise) window.UI.nextQuestion();
    else setTimeout(() => this.init(), 100);
};

// Backward compatibility: expose methods on APP object
window.APP.nextQuestion = function() {
    window.UI.nextQuestion();
};

window.APP.handleCalibration = function(action) {
    window.Calibration.handleCalibration(action);
};

window.APP.setupDrillUI = function() {
    window.Drill.setupUI();
};

window.APP.shouldEndCalibration = function() {
    return window.Calibration.shouldEndCalibration();
};

window.onload = () => {
    window.APP.init();
    window.DebugCheatCode.init();
};
