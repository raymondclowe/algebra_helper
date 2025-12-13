// Storage Manager - Handles data persistence with IndexedDB and localStorage
window.StorageManager = {
    db: null,
    DB_NAME: 'AlgebraHelperDB',
    DB_VERSION: 1,
    STORE_NAME: 'questions',
    
    // IndexedDB configuration constants
    STORE_CONFIG: {
        keyPath: 'id',
        autoIncrement: true
    },
    INDEXES: {
        datetime: { name: 'datetime', keyPath: 'datetime', unique: false },
        isCorrect: { name: 'isCorrect', keyPath: 'isCorrect', unique: false }
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
                
                // Create object store for questions if it doesn't exist
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    const objectStore = db.createObjectStore(this.STORE_NAME, this.STORE_CONFIG);
                    
                    // Create indexes for querying
                    Object.values(this.INDEXES).forEach(index => {
                        objectStore.createIndex(index.name, index.keyPath, { unique: index.unique });
                    });
                }
            };
        });
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
                resolve();
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
};
