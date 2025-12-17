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
                                <div class="text-gray-400 text-xs mt-2">Keep up the great work! 🌟</div>
                            </div>
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
                        <div class="flex gap-2">
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
            
            // Get today's minutes
            const dailyStats = window.StorageManager.getDailyStats();
            const minutesSpent = Math.round(dailyStats.minutesSpent);
            document.getElementById('stat-today-minutes').textContent = minutesSpent + ' min';
            
            // Get topic statistics
            const topicStats = await window.StorageManager.getTopicStats();
            await this.displayTopicProgress(topicStats);
            
        } catch (error) {
            console.error('Error loading stats:', error);
        }
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
