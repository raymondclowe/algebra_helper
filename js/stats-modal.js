// Stats Modal - Displays user statistics in a modal popup
window.StatsModal = {
    isOpen: false,
    
    // Configuration constants
    MINIMUM_DISPLAY_SCORE_THRESHOLD: 50, // Only show topics with >50% score
    
    // Create and inject modal HTML into the page
    init: function() {
        // Create modal HTML with new educational design
        const modalHTML = `
            <div id="stats-modal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div class="bg-gray-800 rounded-xl shadow-2xl border-2 border-purple-500 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <!-- Header -->
                    <div class="bg-purple-900 p-4 flex justify-between items-center border-b border-purple-700">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">📈</span>
                            <h2 class="text-2xl font-bold text-purple-200">Your Learning Progress</h2>
                        </div>
                        <button onclick="StatsModal.hide()" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                    
                    <!-- Stats Content -->
                    <div class="p-6 space-y-6">
                        <!-- Today's Focus - Primary Metric -->
                        <div class="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl border-2 border-blue-400 shadow-lg">
                            <div class="text-center">
                                <div class="text-gray-300 text-sm uppercase mb-2">⏰ Time Spent Today</div>
                                <div id="stat-today-minutes" class="text-5xl font-bold text-blue-300">0 min</div>
                                <div id="stat-feedback-message" class="text-gray-400 text-xs mt-2">Keep up the great work! 🌟</div>
                            </div>
                        </div>
                        
                        <!-- Mastery Summary -->
                        <div id="mastery-summary-container" class="hidden">
                            <h3 class="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
                                <span>🎯</span>
                                <span>Mastery Overview</span>
                            </h3>
                            <div class="grid grid-cols-3 gap-4 mb-4">
                                <div class="bg-green-900 bg-opacity-30 border border-green-500 p-4 rounded-lg text-center">
                                    <div class="text-3xl font-bold text-green-400" id="mastery-mastered-count">0</div>
                                    <div class="text-xs text-gray-400 mt-1">Mastered</div>
                                </div>
                                <div class="bg-yellow-900 bg-opacity-30 border border-yellow-500 p-4 rounded-lg text-center">
                                    <div class="text-3xl font-bold text-yellow-400" id="mastery-working-count">0</div>
                                    <div class="text-xs text-gray-400 mt-1">Working On</div>
                                </div>
                                <div class="bg-red-900 bg-opacity-30 border border-red-500 p-4 rounded-lg text-center">
                                    <div class="text-3xl font-bold text-red-400" id="mastery-review-count">0</div>
                                    <div class="text-xs text-gray-400 mt-1">Needs Review</div>
                                </div>
                            </div>
                            <div id="top-review-topics" class="space-y-2"></div>
                        </div>
                        
                        <!-- Topic Progress -->
                        <div>
                            <h3 class="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
                                <span>📚</span>
                                <span>Your Topics</span>
                            </h3>
                            <div id="topic-progress" class="space-y-3">
                                <div class="text-gray-500 text-sm italic">Start practicing to see your progress!</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="bg-gray-750 p-4 border-t border-gray-700 flex justify-between items-center flex-wrap gap-2">
                        <div class="flex gap-2 flex-wrap">
                            <button onclick="StatsModal.exportSessionsCSV()" class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded" title="Export practice sessions for analysis (filtered: >2min, >50% correct)">
                                📊 Export Sessions
                            </button>
                            <button onclick="StatsModal.exportData()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded">
                                📥 Export Data
                            </button>
                            <button onclick="StatsModal.importData()" class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded">
                                📤 Import Data
                            </button>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="StatsModal.clearData()" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded">
                                Clear All Data
                            </button>
                            <button onclick="StatsModal.hide()" class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Inject into body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },
    
    // Show the modal and load stats
    show: async function() {
        this.isOpen = true;
        document.getElementById('stats-modal').classList.remove('hidden');
        
        // Load and display stats
        await this.loadStats();
    },
    
    // Hide the modal
    hide: function() {
        this.isOpen = false;
        document.getElementById('stats-modal').classList.add('hidden');
    },
    
    // Load and display stats
    loadStats: async function() {
        try {
            // Save any pending daily time before showing stats
            if (window.ActivityTracker.saveDailyTime) {
                window.ActivityTracker.saveDailyTime();
            }
            
            // Get today's minutes and questions
            const dailyStats = window.StorageManager.getDailyStats();
            const minutesSpent = Math.round(dailyStats.minutesSpent);
            document.getElementById('stat-today-minutes').textContent = minutesSpent + ' min';
            
            // Get all questions from today
            // TODO: Consider adding StorageManager.getTodayQuestions() for better performance with large datasets
            const allQuestions = await window.StorageManager.getAllQuestions();
            const today = new Date().toDateString();
            const todayQuestions = allQuestions.filter(q => {
                const qDate = new Date(q.datetime).toDateString();
                return qDate === today;
            });
            
            // Update feedback message based on activity
            this.updateFeedbackMessage(minutesSpent, todayQuestions);
            
            // Get topic statistics
            const topicStats = await window.StorageManager.getTopicStats();
            await this.displayTopicProgress(topicStats);
            
            // Get and display mastery summary
            const masterySummary = await window.StorageManager.getMasterySummary();
            this.displayMasterySummary(masterySummary);
            
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    },
    
    // Update feedback message based on session activity
    updateFeedbackMessage: function(minutesSpent, todayQuestions) {
        const feedbackElement = document.getElementById('stat-feedback-message');
        if (!feedbackElement) return;
        
        const questionsCount = todayQuestions.length;
        const correctCount = todayQuestions.filter(q => q.isCorrect && !q.isDontKnow).length;
        const incorrectCount = todayQuestions.filter(q => !q.isCorrect && !q.isDontKnow).length;
        const dontKnowCount = todayQuestions.filter(q => q.isDontKnow).length;
        const answeredCount = correctCount + incorrectCount;
        const currentScore = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
        
        // Check for recent performance trend (last 10 questions)
        const recentQuestions = todayQuestions.slice(-10);
        const recentCorrect = recentQuestions.filter(q => q.isCorrect && !q.isDontKnow).length;
        const recentAnswered = recentQuestions.filter(q => !q.isDontKnow).length;
        const recentScore = recentAnswered > 0 ? Math.round((recentCorrect / recentAnswered) * 100) : 0;
        
        let message = '';
        
        // Short sessions (less than 2 minutes or no questions)
        if (minutesSpent < 2 || questionsCount === 0) {
            const startMessages = [
                "Let's get started! 🚀",
                "Ready to learn? Let's go! 💪",
                "Time to dive in! 📚",
                "Let's begin your journey! ✨"
            ];
            message = startMessages[Math.floor(Math.random() * startMessages.length)];
        }
        // Long sessions (over 30 minutes)
        else if (minutesSpent > 30) {
            // Check if performance is dropping
            if (questionsCount >= 10 && recentScore < 40) {
                const breakMessages = [
                    "Great effort today! Time for a break! 🌟",
                    "You've worked hard! Rest and come back stronger! 💪",
                    "Excellent persistence! Take a breather! 🎯",
                    "Well done! Your brain needs rest too! 🧠"
                ];
                message = breakMessages[Math.floor(Math.random() * breakMessages.length)];
            } else {
                const longSessionMessages = [
                    "Amazing dedication! Keep going! 🏆",
                    "You're on fire! Great work! 🔥",
                    "Impressive focus! Keep it up! ⭐",
                    "Outstanding effort! You're doing great! 🌟"
                ];
                message = longSessionMessages[Math.floor(Math.random() * longSessionMessages.length)];
            }
        }
        // Medium sessions with good engagement
        else if (questionsCount > 0) {
            if (currentScore >= 70) {
                const goodMessages = [
                    "Keep up the great work! 🌟",
                    "You're doing awesome! ⭐",
                    "Excellent progress! 🎯",
                    "Great job today! 💪"
                ];
                message = goodMessages[Math.floor(Math.random() * goodMessages.length)];
            } else if (currentScore >= 50) {
                const learningMessages = [
                    "You're learning and growing! 🌱",
                    "Keep practicing, you're improving! 📈",
                    "Great effort, keep going! 💪",
                    "You're building strong skills! 🔨"
                ];
                message = learningMessages[Math.floor(Math.random() * learningMessages.length)];
            } else {
                const challengingMessages = [
                    "You're tackling tough material! 🎯",
                    "Challenges help us grow! 🌱",
                    "Keep exploring, you've got this! 🔍",
                    "Every attempt is progress! 📚"
                ];
                message = challengingMessages[Math.floor(Math.random() * challengingMessages.length)];
            }
        }
        
        feedbackElement.textContent = message;
    },
    
    // Display topic progress with educational status messages
    displayTopicProgress: async function(topicStats) {
        const topicProgressDiv = document.getElementById('topic-progress');
        
        // Filter topics: only show those with good score and meaningful engagement
        const filteredTopics = Object.entries(topicStats).filter(([topic, stats]) => {
            const hasEngagement = stats.total > 0;
            const hasGoodScore = stats.averageScore >= this.MINIMUM_DISPLAY_SCORE_THRESHOLD;
            return hasEngagement && hasGoodScore;
        });
        
        if (filteredTopics.length === 0) {
            topicProgressDiv.innerHTML = '<div class="text-gray-500 text-sm italic">Start practicing to see your progress!</div>';
            return;
        }
        
        // Sort by topic order (using TopicDefinitions order)
        const allTopics = window.TopicDefinitions.getAllTopics();
        filteredTopics.sort((a, b) => {
            return allTopics.indexOf(a[0]) - allTopics.indexOf(b[0]);
        });
        
        // Build HTML for each topic
        const topicsHTML = filteredTopics.map(([topic, stats]) => {
            const status = this.getTopicStatus(stats.averageScore);
            const statusColor = this.getStatusColor(status);
            const statusIcon = this.getStatusIcon(status);
            
            // Format recent questions (last 1-5)
            const recentQuestionsHTML = stats.recentQuestions.map(q => {
                const resultClass = q.isCorrect ? 'text-green-400' : (q.isDontKnow ? 'text-yellow-400' : 'text-red-400');
                const resultIcon = q.isCorrect ? '✓' : (q.isDontKnow ? '?' : '✗');
                return `<span class="${resultClass} text-sm">${resultIcon}</span>`;
            }).join(' ');
            
            return `
                <div class="bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <h4 class="text-lg font-bold text-gray-200">${topic}</h4>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="${statusColor} text-sm font-semibold">${statusIcon} ${status}</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-purple-400">${stats.averageScore}%</div>
                            <div class="text-xs text-gray-500">average</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div class="bg-gray-800 p-2 rounded">
                            <div class="text-gray-400 text-xs">Correct</div>
                            <div class="text-green-400 font-bold">${stats.correct}</div>
                        </div>
                        <div class="bg-gray-800 p-2 rounded">
                            <div class="text-gray-400 text-xs">Incorrect</div>
                            <div class="text-red-400 font-bold">${stats.incorrect}</div>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="text-xs text-gray-500">Recent attempts:</div>
                        <div class="flex gap-1">${recentQuestionsHTML}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        topicProgressDiv.innerHTML = topicsHTML;
    },
    
    // Determine status message based on average score
    getTopicStatus: function(averageScore) {
        if (averageScore >= 95) return "Perfect";
        if (averageScore >= 85) return "Mastered It!";
        if (averageScore >= 75) return "Doing Great";
        if (averageScore >= 65) return "Progressing Well";
        return "Still Working On It";
    },
    
    // Get color class for status
    getStatusColor: function(status) {
        if (status === "Perfect") return "text-yellow-400";
        if (status === "Mastered It!") return "text-green-400";
        if (status === "Doing Great") return "text-blue-400";
        if (status === "Progressing Well") return "text-cyan-400";
        return "text-purple-400";
    },
    
    // Get icon for status
    getStatusIcon: function(status) {
        if (status === "Perfect") return "⭐";
        if (status === "Mastered It!") return "🏆";
        if (status === "Doing Great") return "💪";
        if (status === "Progressing Well") return "📈";
        return "🎯";
    },
    
    // Display mastery summary
    displayMasterySummary: function(summary) {
        const container = document.getElementById('mastery-summary-container');
        if (!container) return;
        
        // Only show if there's meaningful data
        if (summary.total === 0) {
            container.classList.add('hidden');
            return;
        }
        
        container.classList.remove('hidden');
        
        // Update counts
        document.getElementById('mastery-mastered-count').textContent = summary.mastered;
        document.getElementById('mastery-working-count').textContent = summary.working;
        document.getElementById('mastery-review-count').textContent = summary.needsReview;
        
        // Display top topics needing review
        const topReviewDiv = document.getElementById('top-review-topics');
        if (summary.topReviewTopics.length === 0) {
            topReviewDiv.innerHTML = '<div class="text-gray-500 text-sm italic">No topics need urgent review! Great work! 🎉</div>';
        } else {
            const topicsHTML = summary.topReviewTopics.map(t => `
                <div class="bg-red-900 bg-opacity-20 border border-red-700 p-3 rounded-lg flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <span class="text-red-400">⚠️</span>
                        <span class="text-gray-300 font-semibold">${t.topic}</span>
                    </div>
                    <div class="text-red-400 font-bold">${t.accuracy}%</div>
                </div>
            `).join('');
            topReviewDiv.innerHTML = `
                <div class="text-sm text-gray-400 mb-2">Top Topics to Review:</div>
                ${topicsHTML}
            `;
        }
    },
    
    // Clear all data with confirmation
    clearData: function() {
        // Create a custom confirmation dialog for better UX
        const confirmDialog = document.createElement('div');
        confirmDialog.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        confirmDialog.innerHTML = `
            <div class="bg-gray-800 rounded-xl shadow-2xl border-2 border-red-500 max-w-md w-full p-6">
                <h3 class="text-xl font-bold text-red-400 mb-4">⚠️ Clear All Data?</h3>
                <p class="text-gray-300 mb-6">Are you sure you want to clear all your stats and history? This action cannot be undone.</p>
                <div class="flex gap-3">
                    <button id="cancel-clear" class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded">
                        Cancel
                    </button>
                    <button id="confirm-clear" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded">
                        Clear Data
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmDialog);
        
        // Handle cancel
        confirmDialog.querySelector('#cancel-clear').onclick = () => {
            confirmDialog.remove();
        };
        
        // Handle confirm
        confirmDialog.querySelector('#confirm-clear').onclick = () => {
            confirmDialog.remove();
            
            window.StorageManager.clearAllData()
                .then(() => {
                    window.ActivityTracker.reset();
                    
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                    successMsg.textContent = '✓ All data cleared successfully!';
                    document.body.appendChild(successMsg);
                    
                    setTimeout(() => successMsg.remove(), 3000);
                    
                    this.loadStats(); // Refresh the display
                })
                .catch(error => {
                    console.error('Error clearing data:', error);
                    
                    // Show error message
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                    errorMsg.textContent = '✗ Error clearing data. Please try again.';
                    document.body.appendChild(errorMsg);
                    
                    setTimeout(() => errorMsg.remove(), 3000);
                });
        };
    },
    
    // Export sessions to CSV for self-analysis
    exportSessionsCSV: async function() {
        try {
            const result = await window.StorageManager.exportSessionsCSV();
            
            if (result.success) {
                // Show success message with details
                const successMsg = document.createElement('div');
                successMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                successMsg.innerHTML = `
                    <div class="font-bold">✓ CSV Export Successful!</div>
                    <div class="text-sm mt-1">Exported ${result.sessionCount} of ${result.totalSessions} sessions</div>
                    <div class="text-xs mt-1 opacity-90">(Filtered: >2 minutes and >50% correct)</div>
                `;
                document.body.appendChild(successMsg);
                
                setTimeout(() => successMsg.remove(), 5000);
            } else {
                throw new Error(result.error || 'Export failed');
            }
        } catch (error) {
            console.error('Error exporting CSV:', error);
            
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            errorMsg.textContent = '✗ Error exporting CSV: ' + error.message;
            document.body.appendChild(errorMsg);
            
            setTimeout(() => errorMsg.remove(), 4000);
        }
    },
    
    // Export data to JSON file
    exportData: async function() {
        try {
            const result = await window.StorageManager.exportData();
            
            if (result.success) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                successMsg.textContent = `✓ Exported ${result.recordCount} questions to ${result.filename}`;
                document.body.appendChild(successMsg);
                
                setTimeout(() => successMsg.remove(), 4000);
            } else {
                throw new Error(result.error || 'Export failed');
            }
        } catch (error) {
            console.error('Error exporting data:', error);
            
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            errorMsg.textContent = '✗ Error exporting data: ' + error.message;
            document.body.appendChild(errorMsg);
            
            setTimeout(() => errorMsg.remove(), 4000);
        }
    },
    
    // Import data from JSON file
    importData: function() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json,.json';
        
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const result = await window.StorageManager.importData(text);
                
                if (result.success) {
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                    successMsg.textContent = `✓ Imported ${result.recordCount} questions successfully!`;
                    document.body.appendChild(successMsg);
                    
                    setTimeout(() => successMsg.remove(), 4000);
                    
                    // Reload stats
                    this.loadStats();
                } else {
                    throw new Error(result.error || 'Import failed');
                }
            } catch (error) {
                console.error('Error importing data:', error);
                
                // Show error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                errorMsg.textContent = '✗ Error importing data: ' + error.message;
                document.body.appendChild(errorMsg);
                
                setTimeout(() => errorMsg.remove(), 4000);
            }
        };
        
        fileInput.click();
    }
};
