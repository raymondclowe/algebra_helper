// Application State Management
window.APP = {
    level: 5.0, 
    streak: 0,
    mode: 'calibration',
    history: [],
    speedHistory: [], // Track response speed: 1 for fast, 0.5 for normal, 0 for slow
    
    // Calibration State
    cMin: 0, cMax: MAX_LEVEL,
    calibrationHistory: [], // Track all calibration responses: {level, action, timeTaken}
    
    // Audio Context (reusable)
    audioContext: null,
    
    // Current question data
    currentQ: null,
    startTime: null,
    
    // Question History Navigation
    isViewingHistory: false,
    historyIndex: -1, // -1 means viewing current/live question, 0+ means viewing history
    questionHistory: [], // Cache of questions from IndexedDB for navigation
    
    // Student personalization
    studentName: '', // Loaded from storage on startup
    
    // Fixing Habits: Track specific error types to trigger targeted reinforcement
    errorTracker: {
        squareRootSign: 0,      // Forgot ± when solving x² = a
        divisionByZero: 0,      // Attempted invalid division by zero
        // Add more error types as needed
    },
    
    // Session Question Log: Track questions asked in current session to avoid repetition
    sessionQuestions: new Map(), // Map: questionSignature -> { count, correctCount, incorrectCount, lastAsked }
};
