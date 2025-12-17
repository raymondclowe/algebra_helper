// Time Tracking Modal - Displays detailed time tracking with daily breakdown and trends
window.TimeTrackingModal = {
    isOpen: false,
    
    // Create and inject modal HTML into the page
    init: function() {
        const modalHTML = `
            <div id="time-tracking-modal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div class="bg-gray-800 rounded-xl shadow-2xl border-2 border-blue-500 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <!-- Header -->
                    <div class="bg-blue-900 p-4 flex justify-between items-center border-b border-blue-700">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">⏰</span>
                            <h2 class="text-2xl font-bold text-blue-200">Your Practice Time</h2>
                        </div>
                        <button onclick="TimeTrackingModal.hide()" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                    
                    <!-- Content -->
                    <div class="p-6 space-y-6">
                        <!-- Today's Time -->
                        <div class="bg-gradient-to-r from-green-900 to-blue-900 p-6 rounded-xl border-2 border-green-400 shadow-lg">
                            <div class="text-center">
                                <div class="text-gray-300 text-sm uppercase mb-2">Today's Practice Time</div>
                                <div id="today-total-time" class="text-5xl font-bold text-green-300">0 min</div>
                                <div id="today-motivational-message" class="text-gray-300 text-sm mt-3 italic">Let's get started! 🚀</div>
                            </div>
                            
                            <!-- Today's Topic Breakdown -->
                            <div id="today-topic-breakdown" class="mt-6 space-y-2">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        
                        <!-- Yesterday's Time -->
                        <div class="bg-gray-750 p-6 rounded-xl border border-gray-600">
                            <div class="flex justify-between items-center mb-4">
                                <div>
                                    <div class="text-gray-400 text-sm uppercase">Yesterday's Practice</div>
                                    <div id="yesterday-total-time" class="text-3xl font-bold text-blue-300">0 min</div>
                                </div>
                                <div id="trend-indicator" class="text-2xl">
                                    <!-- Trend arrow populated dynamically -->
                                </div>
                            </div>
                            
                            <!-- Yesterday's Topic Breakdown -->
                            <div id="yesterday-topic-breakdown" class="space-y-2">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        
                        <!-- Historical Trend Chart -->
                        <div class="bg-gray-750 p-6 rounded-xl border border-gray-600">
                            <h3 class="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
                                <span>📊</span>
                                <span>Your Practice Trend (Last 7 Days)</span>
                            </h3>
                            <div id="trend-message" class="text-sm text-gray-400 mb-4 italic">
                                <!-- Motivational message about trend -->
                            </div>
                            <div id="historical-chart" class="mt-4">
                                <!-- Simple bar chart -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="bg-gray-750 p-4 border-t border-gray-700 flex justify-end">
                        <button onclick="TimeTrackingModal.hide()" class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },
    
    // Show the modal and load data
    show: async function() {
        this.isOpen = true;
        document.getElementById('time-tracking-modal').classList.remove('hidden');
        
        // Load and display time tracking data
        await this.loadTimeData();
    },
    
    // Hide the modal
    hide: function() {
        this.isOpen = false;
        document.getElementById('time-tracking-modal').classList.add('hidden');
    },
    
    // Load and display all time tracking data
    loadTimeData: async function() {
        try {
            // Get daily summary (today and yesterday with topic breakdown)
            const summary = await window.StorageManager.getDailyTimeSummary();
            
            // Display today's data
            this.displayTodayData(summary.today);
            
            // Display yesterday's data
            this.displayYesterdayData(summary.yesterday);
            
            // Show trend comparison
            this.displayTrendIndicator(summary.today.total, summary.yesterday.total);
            
            // Get and display historical trend
            const trendData = await window.StorageManager.getHistoricalTrend(7);
            this.displayHistoricalTrend(trendData);
            
        } catch (error) {
            console.error('Error loading time tracking data:', error);
        }
    },
    
    // Display today's time data
    displayTodayData: function(todayData) {
        const totalMinutes = Math.round(todayData.total);
        document.getElementById('today-total-time').textContent = totalMinutes + ' min';
        
        // Display motivational message
        const message = this.getMotivationalMessage(totalMinutes);
        document.getElementById('today-motivational-message').textContent = message;
        
        // Display topic breakdown
        const breakdownDiv = document.getElementById('today-topic-breakdown');
        if (Object.keys(todayData.byTopic).length === 0) {
            breakdownDiv.innerHTML = '<div class="text-gray-400 text-sm text-center">No practice time logged yet today</div>';
        } else {
            const topicsHTML = Object.entries(todayData.byTopic)
                .sort((a, b) => b[1] - a[1]) // Sort by time spent (descending)
                .map(([topic, minutes]) => `
                    <div class="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                        <div class="text-gray-300 text-sm font-medium">${topic}</div>
                        <div class="text-green-400 font-bold">${Math.round(minutes)} min</div>
                    </div>
                `).join('');
            breakdownDiv.innerHTML = topicsHTML;
        }
    },
    
    // Display yesterday's time data
    displayYesterdayData: function(yesterdayData) {
        const totalMinutes = Math.round(yesterdayData.total);
        document.getElementById('yesterday-total-time').textContent = totalMinutes + ' min';
        
        // Display topic breakdown
        const breakdownDiv = document.getElementById('yesterday-topic-breakdown');
        if (Object.keys(yesterdayData.byTopic).length === 0) {
            breakdownDiv.innerHTML = '<div class="text-gray-500 text-sm">No practice time logged yesterday</div>';
        } else {
            const topicsHTML = Object.entries(yesterdayData.byTopic)
                .sort((a, b) => b[1] - a[1])
                .map(([topic, minutes]) => `
                    <div class="flex justify-between items-center text-sm">
                        <div class="text-gray-400">${topic}</div>
                        <div class="text-blue-300">${Math.round(minutes)} min</div>
                    </div>
                `).join('');
            breakdownDiv.innerHTML = topicsHTML;
        }
    },
    
    // Display trend indicator (comparing today vs yesterday)
    displayTrendIndicator: function(todayTotal, yesterdayTotal) {
        const trendDiv = document.getElementById('trend-indicator');
        
        if (yesterdayTotal === 0 && todayTotal === 0) {
            trendDiv.innerHTML = '';
            return;
        }
        
        if (todayTotal > yesterdayTotal) {
            trendDiv.innerHTML = '<span class="text-green-400" title="More practice than yesterday!">📈</span>';
        } else if (todayTotal < yesterdayTotal && todayTotal > 0) {
            trendDiv.innerHTML = '<span class="text-blue-400" title="Keep the momentum going!">📊</span>';
        } else if (yesterdayTotal > 0 && todayTotal === 0) {
            trendDiv.innerHTML = '<span class="text-yellow-400" title="Ready to practice?">⏰</span>';
        } else {
            trendDiv.innerHTML = '';
        }
    },
    
    // Display historical trend chart
    displayHistoricalTrend: function(trendData) {
        const chartDiv = document.getElementById('historical-chart');
        const messageDiv = document.getElementById('trend-message');
        
        if (trendData.length === 0) {
            chartDiv.innerHTML = '<div class="text-gray-500 text-sm">No historical data available yet</div>';
            messageDiv.textContent = 'Start practicing to build your trend!';
            return;
        }
        
        // Calculate max value for scaling
        const maxMinutes = trendData.length > 0 
            ? Math.max.apply(Math, trendData.map(d => d.minutes).concat([1]))
            : 1;
        
        // Generate simple bar chart
        const barsHTML = trendData.map(day => {
            const heightPercent = (day.minutes / maxMinutes) * 100;
            const barHeight = Math.max(heightPercent, 5); // Minimum 5% height for visibility
            
            return `
                <div class="flex flex-col items-center">
                    <div class="text-xs text-gray-400 mb-2 h-6 flex items-end">${day.minutes > 0 ? Math.round(day.minutes) + 'm' : ''}</div>
                    <div class="w-full bg-gray-700 rounded-t-lg relative" style="height: 120px;">
                        <div class="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all" 
                             style="height: ${barHeight}%"
                             title="${day.shortDate}: ${Math.round(day.minutes)} minutes">
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">${day.shortDate}</div>
                </div>
            `;
        }).join('');
        
        chartDiv.innerHTML = `
            <div class="grid grid-cols-7 gap-2">
                ${barsHTML}
            </div>
        `;
        
        // Generate motivational message about trend
        const trendMessage = this.getTrendMessage(trendData);
        messageDiv.textContent = trendMessage;
    },
    
    // Get motivational message based on today's time
    getMotivationalMessage: function(minutes) {
        if (minutes === 0) {
            const startMessages = [
                "Let's get started! 🚀",
                "Ready to learn? Let's go! 💪",
                "Time to dive in! 📚",
                "Your learning journey begins now! ✨"
            ];
            return startMessages[Math.floor(Math.random() * startMessages.length)];
        } else if (minutes < 5) {
            return "Great start! Keep building momentum! 🌟";
        } else if (minutes < 15) {
            return "You're doing great! Fantastic focus! 💪";
        } else if (minutes < 30) {
            return "Amazing dedication! Keep up the excellent work! 🏆";
        } else if (minutes < 60) {
            return "Outstanding effort! You're crushing it! 🔥";
        } else {
            return "Incredible commitment! Remember to take breaks! 🌟";
        }
    },
    
    // Get trend message based on historical data
    getTrendMessage: function(trendData) {
        const recentDays = trendData.slice(-3);
        const totalRecent = recentDays.reduce((sum, day) => sum + day.minutes, 0);
        
        if (totalRecent === 0) {
            return "Start practicing to build your trend!";
        }
        
        // Check if trending up
        const isIncreasing = recentDays.length >= 2 && 
                            recentDays[recentDays.length - 1].minutes > recentDays[0].minutes;
        
        // Check consistency
        const daysWithPractice = recentDays.filter(d => d.minutes > 0).length;
        const isConsistent = daysWithPractice >= 2;
        
        if (isIncreasing && isConsistent) {
            return "Your practice time is consistently increasing! Awesome work! 📈";
        } else if (isConsistent) {
            return "Great consistency! You're building strong habits! 🎯";
        } else if (recentDays[recentDays.length - 1].minutes > 0) {
            return "Keep building on today's momentum! You've got this! 💪";
        } else {
            return "Every session counts. Let's keep the streak going! ✨";
        }
    }
};
