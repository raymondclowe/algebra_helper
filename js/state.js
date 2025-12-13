// Application State Management
window.APP = {
    level: 5.0, 
    streak: 0,
    mode: 'calibration',
    history: [],
    
    // Calibration State
    cMin: 0, cMax: 10,
    calibrationHistory: [], // Track all calibration responses: {level, action, timeTaken}
    
    // Audio Context (reusable)
    audioContext: null,
    
    // Current question data
    currentQ: null,
    startTime: null
};
