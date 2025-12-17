// Activity Tracker - Tracks active usage time using multiple APIs
window.ActivityTracker = {
    startTime: null,
    totalActiveTime: 0, // Total active time in milliseconds
    isActive: true,
    isPaused: false,
    lastPauseTime: null,
    lastDailySaveTime: null,
    dailySaveInterval: null,
    
    // Initialize tracking with all major JS APIs
    init: function() {
        this.startTime = Date.now();
        this.isActive = true;
        this.lastDailySaveTime = Date.now();
        
        // Page Visibility API - detects when tab is focused
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Focus/blur events - for tab changes
        window.addEventListener('blur', () => this.pause());
        window.addEventListener('focus', () => this.resume());
        
        // User interaction tracking (helps determine if user is active)
        this.setupInteractionTracking();
        
        // Save daily stats every minute
        this.dailySaveInterval = setInterval(() => this.saveDailyTime(), DAILY_SAVE_INTERVAL_MS);
    },
    
    setupInteractionTracking: function() {
        // Track any user interaction as activity
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(event => {
            document.addEventListener(event, () => {
                if (!this.isActive && !document.hidden && document.hasFocus()) {
                    this.resume();
                }
            }, { passive: true });
        });
    },
    
    pause: function() {
        if (!this.isPaused && this.isActive) {
            this.isPaused = true;
            this.lastPauseTime = Date.now();
            
            // Add time from start (or last resume) to now
            if (this.startTime) {
                this.totalActiveTime += (this.lastPauseTime - this.startTime);
            }
        }
    },
    
    resume: function() {
        if (this.isPaused) {
            this.isPaused = false;
            this.startTime = Date.now(); // Reset start time to now
        }
    },
    
    // Get total active time in seconds
    getActiveTime: function() {
        let currentActiveTime = this.totalActiveTime;
        
        // If currently active, add time since last start
        if (!this.isPaused && this.startTime) {
            currentActiveTime += (Date.now() - this.startTime);
        }
        
        return Math.floor(currentActiveTime / 1000); // Return in seconds
    },
    
    // Reset timer (useful for testing or clearing data)
    reset: function() {
        this.startTime = Date.now();
        this.totalActiveTime = 0;
        this.isPaused = false;
        this.lastPauseTime = null;
    },
    
    // Get formatted time string (HH:MM:SS)
    getFormattedTime: function() {
        const seconds = this.getActiveTime();
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    },
    
    // Save time to daily stats
    saveDailyTime: function() {
        if (!this.lastDailySaveTime || !window.StorageManager) {
            return;
        }
        
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - this.lastDailySaveTime) / 1000);
        
        if (elapsedSeconds > 0 && !this.isPaused) {
            const minutesToAdd = elapsedSeconds / 60;
            window.StorageManager.updateDailyStats(minutesToAdd);
        }
        
        this.lastDailySaveTime = now;
    },
    
    // Cleanup method to clear interval and prevent memory leaks
    cleanup: function() {
        if (this.dailySaveInterval) {
            clearInterval(this.dailySaveInterval);
            this.dailySaveInterval = null;
        }
    }
};
