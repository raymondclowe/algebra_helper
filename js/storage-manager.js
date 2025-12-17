// Storage Manager - Handles data persistence with IndexedDB and localStorage
window.StorageManager = {
    db: null,
    DB_NAME: 'AlgebraHelperDB',
    DB_VERSION: 2, // Upgraded to support enhanced question tracking
    STORE_NAME: 'questions',
    
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
    
    // Student name management
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
    
    // Export all data (IndexedDB + localStorage) to JSON
    exportData: async function() {
        try {
            const questions = await this.getAllQuestions();
            const stats = this.getStats();
            const dailyStats = this.getDailyStats();
            
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
    }
};
