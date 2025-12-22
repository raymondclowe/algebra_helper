// Activity Tracker - Tracks active usage time using multiple APIs
window.ActivityTracker = {
    startTime: null,
    totalActiveTime: 0, // Total active time in milliseconds
    isActive: true,
    isPaused: false,
    lastPauseTime: null,
    lastDailySaveTime: null,
    dailySaveInterval: null,
    totalAwayTime: 0, // Total time spent away from tab (milliseconds)
    awaySessionStart: null, // Timestamp when current away session started
    
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
            this.awaySessionStart = Date.now(); // Track when away session started
            
            // Add time from start (or last resume) to now
            if (this.startTime) {
                this.totalActiveTime += (this.lastPauseTime - this.startTime);
            }
        }
    },
    
    resume: function() {
        if (this.isPaused) {
            this.isPaused = false;
            const now = Date.now();
            
            // Track away time before resuming
            if (this.awaySessionStart) {
                const awayDuration = now - this.awaySessionStart;
                this.totalAwayTime += awayDuration;
                
                // Log away session info (for debugging/analytics)
                const awaySeconds = Math.floor(awayDuration / 1000);
                if (awaySeconds > 0) {
                    console.log(`User was away for ${awaySeconds} seconds`);
                    
                    // Store away session data for analytics
                    this.logAwaySession(this.awaySessionStart, now, awayDuration);
                }
                
                this.awaySessionStart = null;
            }
            
            this.startTime = now; // Reset start time to now
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
        this.totalAwayTime = 0;
        this.awaySessionStart = null;
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
    
    // Get total away time in seconds
    getAwayTime: function() {
        let currentAwayTime = this.totalAwayTime;
        
        // If currently away, add time since away session started
        if (this.isPaused && this.awaySessionStart) {
            currentAwayTime += (Date.now() - this.awaySessionStart);
        }
        
        return Math.floor(currentAwayTime / 1000); // Return in seconds
    },
    
    // Get formatted away time string
    getFormattedAwayTime: function() {
        const seconds = this.getAwayTime();
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
    
    // Log away session for analytics
    logAwaySession: function(startTime, endTime, duration) {
        const awaySeconds = Math.floor(duration / 1000);
        
        // Categorize the away session
        let sessionType = 'unknown';
        if (awaySeconds < 5) {
            sessionType = 'quick_check'; // Quick tab switch (< 5 seconds)
        } else if (awaySeconds < 30) {
            sessionType = 'brief_distraction'; // Brief distraction (5-30 seconds)
        } else if (awaySeconds < 300) {
            sessionType = 'short_break'; // Short break (30s - 5 min)
        } else {
            sessionType = 'long_break'; // Long break or left (> 5 min)
        }
        
        // Store in localStorage for analytics (keep last 100 sessions)
        try {
            const awaySessionsKey = 'away_sessions';
            let sessions = JSON.parse(localStorage.getItem(awaySessionsKey) || '[]');
            
            sessions.push({
                startTime: startTime,
                endTime: endTime,
                duration: awaySeconds,
                type: sessionType,
                date: new Date(startTime).toISOString()
            });
            
            // Keep only last 100 sessions
            if (sessions.length > 100) {
                sessions = sessions.slice(-100);
            }
            
            localStorage.setItem(awaySessionsKey, JSON.stringify(sessions));
        } catch (error) {
            console.error('Error storing away session data:', error);
        }
    },
    
    // Save time to daily stats
    saveDailyTime: function() {
        if (!this.lastDailySaveTime || !window.StorageManager) {
            return;
        }
        
        // Only save time if currently active (not paused)
        if (!this.isPaused) {
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - this.lastDailySaveTime) / 1000);
            
            if (elapsedSeconds > 0) {
                const minutesToAdd = elapsedSeconds / 60;
                window.StorageManager.updateDailyStats(minutesToAdd);
            }
            
            // Only update lastDailySaveTime when active
            this.lastDailySaveTime = now;
        }
        // If paused, don't update lastDailySaveTime - this prevents counting away time
    },
    
    // Cleanup method to clear interval and prevent memory leaks
    cleanup: function() {
        if (this.dailySaveInterval) {
            clearInterval(this.dailySaveInterval);
            this.dailySaveInterval = null;
        }
    }
};
