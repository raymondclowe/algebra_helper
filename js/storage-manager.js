// Storage Manager - Handles data persistence with IndexedDB and localStorage
window.StorageManager = {
    db: null,
    DB_NAME: 'AlgebraHelperDB',
    DB_VERSION: 2, // Upgraded to support enhanced question tracking
    STORE_NAME: 'questions',
    
    // Session export filtering constants
    MIN_SESSION_DURATION_MINUTES: 2,
    MIN_CORRECT_RATE: 0.5, // 50%
    SESSION_GAP_MS: 30 * 60 * 1000, // 30 minutes in milliseconds
    
    // Attempt tracking constants
    DEFAULT_ATTEMPT_NUMBER: 1, // Default for legacy records without attemptNumber
    
    // Helper function for rounding to 1 decimal place
    roundToOneDecimal: function(value) {
        return Math.round(value * 10) / 10;
    },
    
    // IndexedDB configuration constants
    STORE_CONFIG: {
        keyPath: 'id',
        autoIncrement: true
    },
    INDEXES: {
        datetime: { name: 'datetime', keyPath: 'datetime', unique: false },
        isCorrect: { name: 'isCorrect', keyPath: 'isCorrect', unique: false },
        eventHash: { name: 'eventHash', keyPath: 'eventHash', unique: false }
    },
    
    // Initialize IndexedDB
    init: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            
            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const transaction = event.target.transaction;
                
                // Create object store for questions if it doesn't exist
                let objectStore;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    objectStore = db.createObjectStore(this.STORE_NAME, this.STORE_CONFIG);
                    
                    // Create indexes for querying
                    Object.values(this.INDEXES).forEach(index => {
                        objectStore.createIndex(index.name, index.keyPath, { unique: index.unique });
                    });
                } else {
                    objectStore = transaction.objectStore(this.STORE_NAME);
                    
                    // Add new index if upgrading from version 1 to 2
                    if (event.oldVersion < 2) {
                        if (!objectStore.indexNames.contains('eventHash')) {
                            objectStore.createIndex('eventHash', 'eventHash', { unique: false });
                        }
                        
                        // Migrate existing records to add missing fields
                        this.migrateExistingData(objectStore);
                    }
                }
            };
        });
    },
    
    // Migrate existing data to add missing fields
    migrateExistingData: function(objectStore) {
        const self = this; // Capture reference to StorageManager
        const getAllRequest = objectStore.getAll();
        getAllRequest.onsuccess = () => {
            const records = getAllRequest.result;
            records.forEach(record => {
                // Add missing fields with default values
                if (!record.allAnswers) {
                    record.allAnswers = [record.correctAnswer]; // Only have correct answer from old schema
                }
                if (!record.chosenAnswer) {
                    record.chosenAnswer = record.isCorrect ? record.correctAnswer : 'unknown';
                }
                if (!record.hintsUsed) {
                    record.hintsUsed = 0;
                }
                if (!record.eventHash) {
                    record.eventHash = self.generateEventHash(record);
                }
                if (!record.attemptNumber) {
                    record.attemptNumber = self.DEFAULT_ATTEMPT_NUMBER; // Use constant for consistency
                }
                
                // Update the record
                objectStore.put(record);
            });
        };
    },
    
    // Generate a unique hash for a question/answer event
    generateEventHash: function(questionData) {
        const hashData = JSON.stringify({
            question: questionData.question,
            allAnswers: questionData.allAnswers || [],
            chosenAnswer: questionData.chosenAnswer || '',
            datetime: questionData.datetime
        });
        // Simple hash function (not cryptographic, just for uniqueness)
        let hash = 0;
        for (let i = 0; i < hashData.length; i++) {
            const char = hashData.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & 0xFFFFFFFF; // Convert to 32-bit integer
        }
        return 'evt_' + Math.abs(hash).toString(36) + '_' + questionData.datetime;
    },
    
    // Save a question to IndexedDB
    saveQuestion: function(questionData) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(this.STORE_NAME);
            
            const request = objectStore.add(questionData);
            
            request.onsuccess = () => {
                resolve(request.result); // Returns the ID of the saved question
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    },
    
    // Get all questions from IndexedDB
    getAllQuestions: function() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(this.STORE_NAME);
            const request = objectStore.getAll();
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    },
    
    // Get a specific question by ID
    getQuestion: function(id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(this.STORE_NAME);
            const request = objectStore.get(id);
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    },
    
    // Get question count
    getQuestionCount: function() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(this.STORE_NAME);
            const request = objectStore.count();
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    },
    
    // LocalStorage wrapper for cumulative stats
    getStats: function() {
        const statsJSON = localStorage.getItem('algebraHelperStats');
        if (statsJSON) {
            try {
                return JSON.parse(statsJSON);
            } catch (e) {
                console.error('Error parsing stats:', e);
                return this.getDefaultStats();
            }
        }
        return this.getDefaultStats();
    },
    
    getDefaultStats: function() {
        return {
            totalActiveTime: 0, // in seconds
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            dontKnowAnswers: 0,
            lastUpdated: Date.now()
        };
    },
    
    updateStats: function(updates) {
        const stats = this.getStats();
        
        // Merge updates
        Object.keys(updates).forEach(key => {
            if (typeof stats[key] === 'number' && typeof updates[key] === 'number') {
                stats[key] += updates[key];
            } else {
                stats[key] = updates[key];
            }
        });
        
        stats.lastUpdated = Date.now();
        
        // Save back to localStorage
        try {
            localStorage.setItem('algebraHelperStats', JSON.stringify(stats));
        } catch (e) {
            console.error('Error saving stats:', e);
        }
        
        return stats;
    },
    
    // User name management
    getStudentName: function() {
        return localStorage.getItem('algebraHelperStudentName') || '';
    },
    
    setStudentName: function(name) {
        const trimmedName = (name || '').trim();
        if (trimmedName) {
            localStorage.setItem('algebraHelperStudentName', trimmedName);
        } else {
            localStorage.removeItem('algebraHelperStudentName');
        }
        return trimmedName;
    },
    
    // Clear all data (for testing or reset)
    clearAllData: function() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(this.STORE_NAME);
            const request = objectStore.clear();
            
            request.onsuccess = () => {
                localStorage.removeItem('algebraHelperStats');
                localStorage.removeItem('algebraHelperDailyStats'); // Clear daily stats too
                resolve();
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    },
    
    // Get statistics by topic
    getTopicStats: async function() {
        try {
            const questions = await this.getAllQuestions();
            const topicStats = {};
            
            questions.forEach(q => {
                const topic = q.topic || 'Unknown';
                
                if (!topicStats[topic]) {
                    topicStats[topic] = {
                        total: 0,
                        correct: 0,
                        incorrect: 0,
                        dontKnow: 0,
                        recentQuestions: []
                    };
                }
                
                topicStats[topic].total++;
                if (q.isDontKnow) {
                    topicStats[topic].dontKnow++;
                } else if (q.isCorrect) {
                    topicStats[topic].correct++;
                } else {
                    topicStats[topic].incorrect++;
                }
                
                // Keep last 5 questions for each topic
                topicStats[topic].recentQuestions.push({
                    question: q.question,
                    isCorrect: q.isCorrect,
                    datetime: q.datetime,
                    isDontKnow: q.isDontKnow
                });
            });
            
            // Keep only last 5 questions for each topic and calculate average
            Object.keys(topicStats).forEach(topic => {
                topicStats[topic].recentQuestions = topicStats[topic].recentQuestions.slice(-5);
                topicStats[topic].averageScore = this.calculateAverageScore(topicStats[topic]);
            });
            
            return topicStats;
        } catch (error) {
            console.error('Error getting topic stats:', error);
            return {};
        }
    },
    
    // Helper function to calculate average score for a topic
    calculateAverageScore: function(topicData) {
        const answeredCount = topicData.correct + topicData.incorrect;
        if (answeredCount > 0) {
            return Math.round((topicData.correct / answeredCount) * 100);
        }
        return 0;
    },
    
    // Get topics that need review based on spaced repetition algorithm
    // Returns topics sorted by review priority (most urgent first)
    getTopicsNeedingReview: async function() {
        try {
            const topicStats = await this.getTopicStats();
            const reviewTopics = [];
            
            // Thresholds for determining if a topic needs review
            const MIN_ATTEMPTS = 3; // Need at least 3 attempts to evaluate
            const NEEDS_REVIEW_THRESHOLD = 70; // Below 70% accuracy needs review
            const MASTERED_THRESHOLD = 85; // Above 85% is mastered
            
            Object.entries(topicStats).forEach(([topic, stats]) => {
                const answeredCount = stats.correct + stats.incorrect;
                
                // Skip if not enough data
                if (answeredCount < MIN_ATTEMPTS) {
                    return;
                }
                
                const accuracy = stats.averageScore;
                
                // Classify topic status
                let status = 'working';
                if (accuracy >= MASTERED_THRESHOLD) {
                    status = 'mastered';
                } else if (accuracy < NEEDS_REVIEW_THRESHOLD) {
                    status = 'needs_review';
                }
                
                // Calculate time since last attempt
                const lastAttempt = stats.recentQuestions[stats.recentQuestions.length - 1];
                const daysSinceLastAttempt = lastAttempt ? 
                    (Date.now() - lastAttempt.datetime) / (1000 * 60 * 60 * 24) : 999;
                
                // Calculate review urgency (higher = more urgent)
                let urgency = 0;
                if (status === 'needs_review') {
                    // More urgent if accuracy is low and hasn't been practiced recently
                    urgency = (100 - accuracy) * (1 + Math.min(daysSinceLastAttempt / 7, 2));
                } else if (status === 'working') {
                    // Moderate urgency for topics being worked on
                    urgency = (MASTERED_THRESHOLD - accuracy) * (1 + Math.min(daysSinceLastAttempt / 14, 1));
                } else if (status === 'mastered') {
                    // Low urgency for mastered topics (maintenance review)
                    if (daysSinceLastAttempt > 7) {
                        urgency = Math.min(daysSinceLastAttempt / 7, 10);
                    }
                }
                
                reviewTopics.push({
                    topic,
                    status,
                    accuracy,
                    attempts: answeredCount,
                    daysSinceLastAttempt: Math.round(daysSinceLastAttempt * 10) / 10,
                    urgency: Math.round(urgency * 10) / 10
                });
            });
            
            // Sort by urgency (highest first)
            reviewTopics.sort((a, b) => b.urgency - a.urgency);
            
            return reviewTopics;
        } catch (error) {
            console.error('Error getting topics needing review:', error);
            return [];
        }
    },
    
    // Get mastery summary for dashboard
    getMasterySummary: async function() {
        try {
            const reviewTopics = await this.getTopicsNeedingReview();
            
            const summary = {
                mastered: reviewTopics.filter(t => t.status === 'mastered').length,
                needsReview: reviewTopics.filter(t => t.status === 'needs_review').length,
                working: reviewTopics.filter(t => t.status === 'working').length,
                total: reviewTopics.length,
                topReviewTopics: reviewTopics
                    .filter(t => t.status === 'needs_review')
                    .slice(0, 5)
                    .map(t => ({ topic: t.topic, accuracy: t.accuracy }))
            };
            
            return summary;
        } catch (error) {
            console.error('Error getting mastery summary:', error);
            return {
                mastered: 0,
                needsReview: 0,
                working: 0,
                total: 0,
                topReviewTopics: []
            };
        }
    },
    
    // Get attempt statistics (right first time, second try, etc.)
    getAttemptStats: async function() {
        try {
            const questions = await this.getAllQuestions();
            
            const stats = {
                rightFirstTime: 0,      // Correct on 1st attempt
                rightSecondTry: 0,      // Correct on 2nd attempt
                rightThirdOrMore: 0,    // Correct on 3rd+ attempt
                dontKnow: 0,            // Clicked "I don't know"
                wrongMultipleTimes: 0,  // Wrong on 2+ attempts
                totalAnswered: 0
            };
            
            questions.forEach(q => {
                stats.totalAnswered++;
                
                if (q.isDontKnow) {
                    stats.dontKnow++;
                } else if (q.isCorrect) {
                    const attemptNum = q.attemptNumber || this.DEFAULT_ATTEMPT_NUMBER;
                    if (attemptNum === 1) {
                        stats.rightFirstTime++;
                    } else if (attemptNum === 2) {
                        stats.rightSecondTry++;
                    } else {
                        stats.rightThirdOrMore++;
                    }
                } else {
                    // Wrong answer
                    const attemptNum = q.attemptNumber || this.DEFAULT_ATTEMPT_NUMBER;
                    if (attemptNum >= 2) {
                        stats.wrongMultipleTimes++;
                    }
                }
            });
            
            // Calculate percentages
            if (stats.totalAnswered > 0) {
                stats.rightFirstTimePercent = Math.round((stats.rightFirstTime / stats.totalAnswered) * 100);
                stats.rightSecondTryPercent = Math.round((stats.rightSecondTry / stats.totalAnswered) * 100);
                stats.rightThirdOrMorePercent = Math.round((stats.rightThirdOrMore / stats.totalAnswered) * 100);
                stats.dontKnowPercent = Math.round((stats.dontKnow / stats.totalAnswered) * 100);
                stats.wrongMultipleTimesPercent = Math.round((stats.wrongMultipleTimes / stats.totalAnswered) * 100);
            } else {
                stats.rightFirstTimePercent = 0;
                stats.rightSecondTryPercent = 0;
                stats.rightThirdOrMorePercent = 0;
                stats.dontKnowPercent = 0;
                stats.wrongMultipleTimesPercent = 0;
            }
            
            return stats;
        } catch (error) {
            console.error('Error getting attempt stats:', error);
            return {
                rightFirstTime: 0,
                rightSecondTry: 0,
                rightThirdOrMore: 0,
                dontKnow: 0,
                wrongMultipleTimes: 0,
                totalAnswered: 0,
                rightFirstTimePercent: 0,
                rightSecondTryPercent: 0,
                rightThirdOrMorePercent: 0,
                dontKnowPercent: 0,
                wrongMultipleTimesPercent: 0
            };
        }
    },
    
    // Get daily stats (time spent today)
    getDailyStats: function() {
        const dailyStatsJSON = localStorage.getItem('algebraHelperDailyStats');
        const today = new Date().toDateString();
        
        if (dailyStatsJSON) {
            try {
                const dailyStats = JSON.parse(dailyStatsJSON);
                // Reset if it's a new day
                if (dailyStats.date !== today) {
                    return { date: today, minutesSpent: 0 };
                }
                return dailyStats;
            } catch (e) {
                console.error('Error parsing daily stats:', e);
                return { date: today, minutesSpent: 0 };
            }
        }
        return { date: today, minutesSpent: 0 };
    },
    
    // Update daily stats
    updateDailyStats: function(minutesToAdd) {
        const dailyStats = this.getDailyStats();
        dailyStats.minutesSpent += minutesToAdd;
        
        try {
            localStorage.setItem('algebraHelperDailyStats', JSON.stringify(dailyStats));
        } catch (e) {
            console.error('Error saving daily stats:', e);
        }
        
        return dailyStats;
    },
    
    // Get historical daily stats (time tracking history)
    getHistoricalDailyStats: function() {
        const historyJSON = localStorage.getItem('algebraHelperDailyHistory');
        if (historyJSON) {
            try {
                return JSON.parse(historyJSON);
            } catch (e) {
                console.error('Error parsing daily history:', e);
                return {};
            }
        }
        return {};
    },
    
    // Save daily stats to history at end of day
    saveDailyStatsToHistory: function() {
        const dailyStats = this.getDailyStats();
        const history = this.getHistoricalDailyStats();
        
        // Store by date as key
        if (dailyStats.minutesSpent > 0) {
            history[dailyStats.date] = {
                minutesSpent: dailyStats.minutesSpent,
                date: dailyStats.date,
                timestamp: Date.now()
            };
            
            try {
                localStorage.setItem('algebraHelperDailyHistory', JSON.stringify(history));
            } catch (e) {
                console.error('Error saving daily history:', e);
            }
        }
        
        return history;
    },
    
    // Get time spent by topic for a specific date
    getTopicTimeForDate: async function(dateString) {
        try {
            const questions = await this.getAllQuestions();
            const topicTime = {};
            
            questions.forEach(q => {
                const qDate = new Date(q.datetime).toDateString();
                if (qDate === dateString && q.topic && q.timeSpent) {
                    const topic = q.topic;
                    if (!topicTime[topic]) {
                        topicTime[topic] = 0;
                    }
                    topicTime[topic] += q.timeSpent;
                }
            });
            
            // Convert seconds to minutes
            Object.keys(topicTime).forEach(topic => {
                topicTime[topic] = this.roundToOneDecimal(topicTime[topic] / 60);
            });
            
            return topicTime;
        } catch (error) {
            console.error('Error getting topic time for date:', error);
            return {};
        }
    },
    
    // Get daily time tracking summary (today and yesterday with topic breakdown)
    getDailyTimeSummary: async function() {
        try {
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            
            const todayTopicTime = await this.getTopicTimeForDate(today);
            const yesterdayTopicTime = await this.getTopicTimeForDate(yesterday);
            
            // Calculate totals
            const todayTotal = Object.values(todayTopicTime).reduce((sum, time) => sum + time, 0);
            const yesterdayTotal = Object.values(yesterdayTopicTime).reduce((sum, time) => sum + time, 0);
            
            return {
                today: {
                    date: today,
                    total: todayTotal,
                    byTopic: todayTopicTime
                },
                yesterday: {
                    date: yesterday,
                    total: yesterdayTotal,
                    byTopic: yesterdayTopicTime
                }
            };
        } catch (error) {
            console.error('Error getting daily time summary:', error);
            return {
                today: { date: new Date().toDateString(), total: 0, byTopic: {} },
                yesterday: { date: new Date(Date.now() - 86400000).toDateString(), total: 0, byTopic: {} }
            };
        }
    },
    
    // Get historical trend data (last N days)
    getHistoricalTrend: async function(daysBack = 7) {
        try {
            const questions = await this.getAllQuestions();
            const trendData = [];
            
            // Calculate date range
            const today = new Date();
            for (let i = daysBack - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateString = date.toDateString();
                
                // Calculate time for this date
                let totalMinutes = 0;
                questions.forEach(q => {
                    const qDate = new Date(q.datetime).toDateString();
                    if (qDate === dateString && q.timeSpent) {
                        totalMinutes += q.timeSpent / 60;
                    }
                });
                
                trendData.push({
                    date: dateString,
                    shortDate: this.formatShortDate(date),
                    minutes: this.roundToOneDecimal(totalMinutes)
                });
            }
            
            return trendData;
        } catch (error) {
            console.error('Error getting historical trend:', error);
            return [];
        }
    },
    
    // Helper function to format date as short string (e.g., "Mon 12/17")
    formatShortDate: function(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = days[date.getDay()];
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${dayName} ${month}/${day}`;
    },
    
    // Calculate learning velocity (rate of improvement over time)
    // Returns improvement rate in percentage points per hour
    // Note: This is calculated but not displayed per requirements
    calculateLearningVelocity: async function(lookbackDays = 7) {
        try {
            const questions = await this.getAllQuestions();
            if (questions.length < 10) {
                return null; // Need minimum data for meaningful calculation
            }
            
            // Sort by datetime
            questions.sort((a, b) => a.datetime - b.datetime);
            
            // Calculate cutoff time for lookback period
            const cutoffTime = Date.now() - (lookbackDays * 24 * 60 * 60 * 1000);
            const recentQuestions = questions.filter(q => q.datetime >= cutoffTime);
            
            if (recentQuestions.length < 5) {
                return null; // Need minimum recent data
            }
            
            // Split into early and late half for comparison
            const midpoint = Math.floor(recentQuestions.length / 2);
            const earlyQuestions = recentQuestions.slice(0, midpoint);
            const lateQuestions = recentQuestions.slice(midpoint);
            
            // Calculate accuracy for each period (excluding "I don't know")
            const calcAccuracy = (questions) => {
                const answered = questions.filter(q => !q.isDontKnow);
                if (answered.length === 0) return null;
                const correct = answered.filter(q => q.isCorrect).length;
                return (correct / answered.length) * 100;
            };
            
            const earlyAccuracy = calcAccuracy(earlyQuestions);
            const lateAccuracy = calcAccuracy(lateQuestions);
            
            if (earlyAccuracy === null || lateAccuracy === null) {
                return null;
            }
            
            // Calculate time span in hours
            const timeSpanMs = lateQuestions[lateQuestions.length - 1].datetime - earlyQuestions[0].datetime;
            const timeSpanHours = timeSpanMs / (1000 * 60 * 60);
            
            if (timeSpanHours < 0.1) {
                return null; // Too short time span
            }
            
            // Learning velocity = change in accuracy / time
            const accuracyChange = lateAccuracy - earlyAccuracy;
            const learningVelocity = accuracyChange / timeSpanHours;
            
            return {
                velocity: this.roundToOneDecimal(learningVelocity),
                earlyAccuracy: this.roundToOneDecimal(earlyAccuracy),
                lateAccuracy: this.roundToOneDecimal(lateAccuracy),
                timeSpanHours: this.roundToOneDecimal(timeSpanHours),
                questionCount: recentQuestions.length
            };
        } catch (error) {
            console.error('Error calculating learning velocity:', error);
            return null;
        }
    },
    
    // Export all data (IndexedDB + localStorage) to JSON
    // Learning velocity included per feature requirement: "export data from local storage/indexdb to json for analytics dashboard"
    exportData: async function() {
        try {
            const questions = await this.getAllQuestions();
            const stats = this.getStats();
            const dailyStats = this.getDailyStats();
            const learningVelocity = await this.calculateLearningVelocity();
            
            // Get all localStorage data
            const localStorageData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('algebraHelper')) {
                    try {
                        localStorageData[key] = JSON.parse(localStorage.getItem(key));
                    } catch (e) {
                        localStorageData[key] = localStorage.getItem(key);
                    }
                }
            }
            
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                dbVersion: this.DB_VERSION,
                questions: questions,
                stats: stats,
                dailyStats: dailyStats,
                learningVelocity: learningVelocity,
                localStorage: localStorageData
            };
            
            // Create downloadable JSON file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // Create filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `algebra-helper-data-${timestamp}.json`;
            
            // Trigger download
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            return { success: true, filename: filename, recordCount: questions.length };
        } catch (error) {
            console.error('Error exporting data:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Import data from JSON file
    importData: async function(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            // Validate data format
            if (!data.version || !data.questions) {
                throw new Error('Invalid data format');
            }
            
            // Import questions to IndexedDB
            const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(this.STORE_NAME);
            
            for (const question of data.questions) {
                // Remove auto-generated ID to get new ones
                const questionCopy = { ...question };
                delete questionCopy.id;
                objectStore.add(questionCopy);
            }
            
            // Import localStorage data
            if (data.localStorage) {
                Object.keys(data.localStorage).forEach(key => {
                    try {
                        localStorage.setItem(key, JSON.stringify(data.localStorage[key]));
                    } catch (e) {
                        console.error('Error importing localStorage item:', key, e);
                    }
                });
            }
            
            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => {
                    resolve({ success: true, recordCount: data.questions.length });
                };
                transaction.onerror = () => {
                    reject(transaction.error);
                };
            });
        } catch (error) {
            console.error('Error importing data:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Helper function to escape CSV field values
    escapeCSVField: function(value) {
        // Convert to string and escape quotes by doubling them
        const stringValue = String(value);
        if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    },
    
    // Helper function to calculate session statistics
    calculateSessionStats: function(questions) {
        let correctCount = 0;
        let answeredCount = 0;
        const topicCounts = {};
        
        questions.forEach(q => {
            if (!q.isDontKnow) {
                answeredCount++;
                if (q.isCorrect) correctCount++;
            }
            
            // Track topics
            const topic = q.topic || 'Unknown';
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
        
        const scorePercent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
        const correctRate = answeredCount > 0 ? correctCount / answeredCount : 0;
        
        return {
            correctCount,
            answeredCount,
            topicCounts,
            scorePercent,
            correctRate
        };
    },
    
    // Group questions into sessions (30 min gap threshold)
    groupIntoSessions: function(questions) {
        if (questions.length === 0) return [];
        
        // Sort questions by datetime
        questions.sort((a, b) => a.datetime - b.datetime);
        
        const sessions = [];
        let currentSession = {
            startTime: questions[0].datetime,
            endTime: questions[0].datetime,
            questions: [questions[0]]
        };
        
        for (let i = 1; i < questions.length; i++) {
            const q = questions[i];
            const timeSinceLastQuestion = q.datetime - currentSession.endTime;
            
            if (timeSinceLastQuestion > this.SESSION_GAP_MS) {
                // Start new session
                sessions.push(currentSession);
                currentSession = {
                    startTime: q.datetime,
                    endTime: q.datetime,
                    questions: [q]
                };
            } else {
                // Add to current session
                currentSession.questions.push(q);
                currentSession.endTime = q.datetime;
            }
        }
        
        // Add last session
        sessions.push(currentSession);
        
        return sessions;
    },
    
    // Export sessions to CSV format for Google Sheets
    exportSessionsCSV: async function() {
        try {
            const questions = await this.getAllQuestions();
            const studentName = this.getStudentName() || 'Anonymous';
            
            // Group into sessions
            const sessions = this.groupIntoSessions(questions);
            
            // Filter sessions using configured thresholds
            const filteredSessions = sessions.filter(session => {
                const durationMin = (session.endTime - session.startTime) / 1000 / 60;
                const stats = this.calculateSessionStats(session.questions);
                
                // Session must meet both duration and accuracy thresholds
                return durationMin > this.MIN_SESSION_DURATION_MINUTES && 
                       stats.correctRate > this.MIN_CORRECT_RATE;
            });
            
            if (filteredSessions.length === 0) {
                const minMinutes = this.MIN_SESSION_DURATION_MINUTES;
                const minPercent = Math.round(this.MIN_CORRECT_RATE * 100);
                return { 
                    success: false, 
                    error: `No sessions meet the criteria (>${minMinutes} minutes and >${minPercent}% correct)` 
                };
            }
            
            // Build CSV content
            const csvRows = [];
            
            // Header row - using exact format from issue requirements
            csvRows.push([
                'Date',
                'Topic',
                'What was done',
                'How long did it take (min)',
                'Correct Questions',
                'Total Questions',
                'If not right',
                'Checked by AI (link)',
                'Checked by human',
                'Percentage correct'
            ].join(','));
            
            // Data rows
            filteredSessions.forEach(session => {
                const date = new Date(session.startTime).toLocaleDateString();
                const durationMin = Math.round((session.endTime - session.startTime) / 1000 / 60);
                
                // Calculate statistics using helper
                const stats = this.calculateSessionStats(session.questions);
                
                // Build topics string with counts
                const topicsStr = Object.entries(stats.topicCounts)
                    .map(([topic, count]) => `${topic}(${count})`)
                    .join('; ');
                
                // Build "What was done" description
                const whatWasDone = `Practiced ${stats.answeredCount} questions across topics: ${topicsStr}`;
                
                // Build "If not right" list - questions that were incorrect
                const totalIncorrect = stats.answeredCount - stats.correctCount;
                const incorrectQuestions = session.questions
                    .filter(q => !q.isCorrect && !q.isDontKnow)
                    .map(q => q.question)
                    .slice(0, 3); // Limit to first 3 to keep manageable
                const ifNotRight = incorrectQuestions.length > 0 
                    ? incorrectQuestions.join('; ') + (incorrectQuestions.length === 3 && totalIncorrect > 3 ? '...' : '')
                    : '';
                
                // CSV row - properly escape fields with exact column order from issue
                csvRows.push([
                    date,
                    this.escapeCSVField(topicsStr),
                    this.escapeCSVField(whatWasDone),
                    durationMin,
                    stats.correctCount,
                    stats.answeredCount,
                    this.escapeCSVField(ifNotRight),
                    '', // Checked by AI (link) - optional, left empty
                    '', // Checked by human - mandatory but left empty for user to fill
                    stats.scorePercent
                ].join(','));
            });
            
            const csvContent = csvRows.join('\n');
            
            // Create downloadable CSV file
            const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            // Create filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `algebra-helper-sessions-${timestamp}.csv`;
            
            // Trigger download
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            return { 
                success: true, 
                filename: filename, 
                sessionCount: filteredSessions.length,
                totalSessions: sessions.length
            };
        } catch (error) {
            console.error('Error exporting CSV:', error);
            return { success: false, error: error.message };
        }
    }
};
