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
    lastActivityTime: null, // Timestamp of last user activity
    inactivityCheckInterval: null, // Interval for checking inactivity
    inactivityOverlayVisible: false, // Whether inactivity overlay is shown
    
    // Initialize tracking with all major JS APIs
    init: function() {
        this.startTime = Date.now();
        this.isActive = true;
        this.lastDailySaveTime = Date.now();
        this.lastActivityTime = Date.now();
        
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
        
        // Setup inactivity detection
        this.setupInactivityDetection();
        
        // Save daily stats every minute
        this.dailySaveInterval = setInterval(() => this.saveDailyTime(), DAILY_SAVE_INTERVAL_MS);
    },
    
    setupInteractionTracking: function() {
        // Track any user interaction as activity
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove', 'click'];
        events.forEach(event => {
            document.addEventListener(event, () => {
                // Update last activity time
                this.lastActivityTime = Date.now();
                
                // Hide inactivity overlay if visible
                if (this.inactivityOverlayVisible) {
                    this.hideInactivityOverlay();
                    this.resume();
                }
                
                if (!this.isActive && !document.hidden && document.hasFocus()) {
                    this.resume();
                }
            }, { passive: true });
        });
    },
    
    setupInactivityDetection: function() {
        // Check for inactivity every 5 seconds
        this.inactivityCheckInterval = setInterval(() => {
            // Only check if tab is visible and not already paused
            if (!document.hidden && !this.isPaused && !this.inactivityOverlayVisible) {
                const timeSinceLastActivity = Date.now() - this.lastActivityTime;
                
                if (timeSinceLastActivity >= INACTIVITY_TIMEOUT_MS) {
                    this.showInactivityOverlay();
                    this.pause();
                }
            }
        }, 5000); // Check every 5 seconds
    },
    
    showInactivityOverlay: function() {
        // Create overlay if it doesn't exist
        let overlay = document.getElementById('inactivity-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'inactivity-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 10%;
                left: 10%;
                right: 10%;
                bottom: 10%;
                background-color: rgba(0, 0, 0, 0.9);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
            `;
            
            const message = document.createElement('div');
            message.style.cssText = `
                color: white;
                font-size: 48px;
                font-weight: bold;
                text-align: center;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            `;
            message.textContent = 'Session Paused';
            
            overlay.appendChild(message);
            document.body.appendChild(overlay);
        }
        
        overlay.style.display = 'flex';
        this.inactivityOverlayVisible = true;
    },
    
    hideInactivityOverlay: function() {
        const overlay = document.getElementById('inactivity-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        this.inactivityOverlayVisible = false;
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
            this.lastDailySaveTime = now; // Reset daily save time to prevent counting away time
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
        this.lastActivityTime = Date.now();
        this.hideInactivityOverlay();
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
        
        // Categorize the away session using constants
        let sessionType = 'unknown';
        if (awaySeconds < AWAY_SESSION_QUICK_CHECK_THRESHOLD) {
            sessionType = 'quick_check'; // Quick tab switch
        } else if (awaySeconds < AWAY_SESSION_BRIEF_DISTRACTION_THRESHOLD) {
            sessionType = 'brief_distraction'; // Brief distraction
        } else if (awaySeconds < AWAY_SESSION_SHORT_BREAK_THRESHOLD) {
            sessionType = 'short_break'; // Short break
        } else {
            sessionType = 'long_break'; // Long break or left
        }
        
        // Store in localStorage for analytics (keep last MAX_AWAY_SESSIONS)
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
            
            // Keep only last MAX_AWAY_SESSIONS
            if (sessions.length > MAX_AWAY_SESSIONS) {
                sessions = sessions.slice(-MAX_AWAY_SESSIONS);
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
            const timeSinceLastActivity = now - this.lastActivityTime;
            
            // Only count time up to INACTIVITY_TIMEOUT_MS after last activity
            // If user hasn't interacted in more than INACTIVITY_TIMEOUT_MS, they're considered away
            let endTime = now;
            if (timeSinceLastActivity > INACTIVITY_TIMEOUT_MS) {
                // User is inactive - only count up to INACTIVITY_TIMEOUT_MS after last activity
                endTime = this.lastActivityTime + INACTIVITY_TIMEOUT_MS;
            }
            
            const elapsedSeconds = Math.floor((endTime - this.lastDailySaveTime) / 1000);
            
            if (elapsedSeconds > 0) {
                const minutesToAdd = elapsedSeconds / 60;
                window.StorageManager.updateDailyStats(minutesToAdd);
                this.lastDailySaveTime = endTime;
            } else {
                // No time to add, but still update lastDailySaveTime to current time
                // to prevent counting inactive time in future saves
                this.lastDailySaveTime = now;
            }
        }
        // If paused, don't update lastDailySaveTime - this prevents counting away time
    },
    
    // Cleanup method to clear interval and prevent memory leaks
    cleanup: function() {
        if (this.dailySaveInterval) {
            clearInterval(this.dailySaveInterval);
            this.dailySaveInterval = null;
        }
        if (this.inactivityCheckInterval) {
            clearInterval(this.inactivityCheckInterval);
            this.inactivityCheckInterval = null;
        }
        this.hideInactivityOverlay();
    }
};
