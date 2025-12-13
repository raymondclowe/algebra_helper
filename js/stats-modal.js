// Stats Modal - Displays user statistics in a modal popup
window.StatsModal = {
    isOpen: false,
    
    // Create and inject modal HTML into the page
    init: function() {
        // Create modal HTML
        const modalHTML = `
            <div id="stats-modal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div class="bg-gray-800 rounded-xl shadow-2xl border-2 border-purple-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <!-- Header -->
                    <div class="bg-purple-900 p-4 flex justify-between items-center border-b border-purple-700">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">📊</span>
                            <h2 class="text-2xl font-bold text-purple-200">Your Stats</h2>
                        </div>
                        <button onclick="StatsModal.hide()" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                    
                    <!-- Stats Content -->
                    <div class="p-6 space-y-6">
                        <!-- Overall Stats Grid -->
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Total Time -->
                            <div class="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <div class="text-gray-400 text-xs uppercase mb-1">Total Active Time</div>
                                <div id="stat-total-time" class="text-2xl font-bold text-blue-400">0s</div>
                            </div>
                            
                            <!-- Total Questions -->
                            <div class="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <div class="text-gray-400 text-xs uppercase mb-1">Questions Answered</div>
                                <div id="stat-total-questions" class="text-2xl font-bold text-purple-400">0</div>
                            </div>
                            
                            <!-- Correct Answers -->
                            <div class="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <div class="text-gray-400 text-xs uppercase mb-1">Correct Answers</div>
                                <div id="stat-correct" class="text-2xl font-bold text-green-400">0</div>
                            </div>
                            
                            <!-- Wrong Answers -->
                            <div class="bg-gray-750 p-4 rounded-lg border border-gray-700">
                                <div class="text-gray-400 text-xs uppercase mb-1">Wrong Answers</div>
                                <div id="stat-wrong" class="text-2xl font-bold text-red-400">0</div>
                            </div>
                        </div>
                        
                        <!-- Accuracy -->
                        <div class="bg-gray-750 p-4 rounded-lg border border-gray-700">
                            <div class="text-gray-400 text-xs uppercase mb-2">Overall Accuracy</div>
                            <div class="flex items-center gap-4">
                                <div id="stat-accuracy" class="text-3xl font-bold text-yellow-400">--%</div>
                                <div class="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                                    <div id="stat-accuracy-bar" class="bg-yellow-400 h-full transition-all duration-500" style="width: 0%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Average Time Per Question -->
                        <div class="bg-gray-750 p-4 rounded-lg border border-gray-700">
                            <div class="text-gray-400 text-xs uppercase mb-1">Avg Time Per Question</div>
                            <div id="stat-avg-time" class="text-2xl font-bold text-cyan-400">--</div>
                        </div>
                        
                        <!-- Recent Activity -->
                        <div>
                            <h3 class="text-lg font-bold text-gray-300 mb-3">Recent Questions</h3>
                            <div id="recent-questions" class="space-y-2 max-h-60 overflow-y-auto">
                                <div class="text-gray-500 text-sm italic">No questions answered yet</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="bg-gray-750 p-4 border-t border-gray-700 flex justify-between items-center">
                        <button onclick="StatsModal.clearData()" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded">
                            Clear All Data
                        </button>
                        <button onclick="StatsModal.hide()" class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded">
                            Close
                        </button>
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
            // Get stats from localStorage
            const stats = window.StorageManager.getStats();
            
            // Update current active time
            const currentActiveTime = window.ActivityTracker.getActiveTime();
            const totalTime = stats.totalActiveTime + currentActiveTime;
            
            // Display stats
            document.getElementById('stat-total-time').textContent = this.formatTime(totalTime);
            document.getElementById('stat-total-questions').textContent = stats.totalQuestions;
            document.getElementById('stat-correct').textContent = stats.correctAnswers;
            document.getElementById('stat-wrong').textContent = stats.wrongAnswers;
            
            // Calculate accuracy
            let accuracy = 0;
            if (stats.totalQuestions > 0) {
                accuracy = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
            }
            document.getElementById('stat-accuracy').textContent = accuracy + '%';
            document.getElementById('stat-accuracy-bar').style.width = accuracy + '%';
            
            // Average time per question
            let avgTime = 0;
            if (stats.totalQuestions > 0) {
                avgTime = Math.round(totalTime / stats.totalQuestions);
            }
            document.getElementById('stat-avg-time').textContent = avgTime > 0 ? this.formatTime(avgTime) : '--';
            
            // Load recent questions from IndexedDB
            await this.loadRecentQuestions();
            
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    },
    
    // Load recent questions from IndexedDB
    loadRecentQuestions: async function() {
        try {
            const questions = await window.StorageManager.getAllQuestions();
            const recentQuestionsDiv = document.getElementById('recent-questions');
            
            if (questions.length === 0) {
                recentQuestionsDiv.innerHTML = '<div class="text-gray-500 text-sm italic">No questions answered yet</div>';
                return;
            }
            
            // Get last 10 questions (reversed to show most recent first)
            const recent = questions.slice(-10).reverse();
            
            // Build HTML for recent questions
            const questionsHTML = recent.map(q => {
                const resultClass = q.isCorrect ? 'text-green-400' : 'text-red-400';
                const resultIcon = q.isCorrect ? '✓' : '✗';
                const date = new Date(q.datetime).toLocaleString();
                
                return `
                    <div class="bg-gray-750 p-3 rounded border border-gray-700 text-sm">
                        <div class="flex items-center justify-between mb-1">
                            <span class="${resultClass} font-bold">${resultIcon} ${q.isCorrect ? 'Correct' : 'Wrong'}</span>
                            <span class="text-gray-500 text-xs">${date}</span>
                        </div>
                        <div class="text-gray-400 text-xs">Time: ${q.timeSpent}s</div>
                    </div>
                `;
            }).join('');
            
            recentQuestionsDiv.innerHTML = questionsHTML;
            
        } catch (error) {
            console.error('Error loading recent questions:', error);
        }
    },
    
    // Format time in seconds to readable string
    formatTime: function(seconds) {
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
    }
};
