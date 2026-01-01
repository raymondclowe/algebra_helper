// Display Mode Management
// Provides educational-psychology-based display of progress metrics
// Research: Mastery-oriented displays promote learning goals over performance goals (Dweck, 1986)

window.DisplayModes = {
    // Current display mode (can be changed by user settings)
    currentMode: DEFAULT_DISPLAY_MODE,
    
    // Map level ranges to skill descriptions
    getSkillDescription: function(level) {
        const levelInt = Math.floor(level);
        
        const skillMap = {
            1: "Basic Arithmetic",
            2: "Squares & Roots",
            3: "Multiplication & Division",
            4: "Working with Fractions",
            5: "Decimals & Percentages",
            6: "Simple Equations",
            7: "Two-Step Equations",
            8: "Inequalities",
            9: "Expanding Expressions",
            10: "Factoring Quadratics",
            11: "Quadratic Equations",
            12: "Polynomials",
            13: "Exponentials & Logarithms",
            14: "Sequences & Series",
            15: "Functions",
            16: "Trigonometry Basics",
            17: "Advanced Trigonometry",
            18: "Vectors",
            19: "Complex Numbers",
            20: "Basic Calculus",
            21: "Advanced Calculus",
            22: "Statistics",
            23: "Probability",
            24: "Integration & Series"
        };
        
        return skillMap[levelInt] || skillMap[Math.min(24, Math.max(1, levelInt))];
    },
    
    // Get level band description (e.g., "5-6" instead of "5.3")
    getLevelBand: function(level) {
        const lower = Math.floor(level);
        const upper = Math.min(24, lower + 1);
        return `${lower}-${upper}`;
    },
    
    // Get encouraging message based on recent accuracy
    // Research shows process-oriented praise is more effective than ability praise (Mueller & Dweck, 1998)
    getEncouragingMessage: function(accuracy) {
        if (accuracy === null || accuracy === undefined || isNaN(accuracy)) {
            return "Let's get started!";
        }
        
        // 85%+ : Mastering content
        if (accuracy >= 0.85) {
            const messages = [
                "🌟 Mastering this!",
                "🎯 Excellent understanding!",
                "💎 You've got this down!",
                "✨ Strong grasp of concepts!"
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        }
        
        // 70-85% : Optimal learning zone (the target!)
        if (accuracy >= 0.70) {
            const messages = [
                "🎯 Perfect challenge level!",
                "💪 Learning actively!",
                "🚀 Great progress!",
                "⭐ Right level of challenge!"
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        }
        
        // 50-70% : Building skills
        if (accuracy >= 0.50) {
            const messages = [
                "💪 Building strong skills!",
                "🌱 Growing your abilities!",
                "🎓 Challenging yourself!",
                "🔨 Developing mastery!"
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        }
        
        // <50% : Exploring new concepts
        const messages = [
            "🔍 Exploring new concepts!",
            "🌟 Embracing the challenge!",
            "📚 Learning new material!",
            "🧠 Expanding your skills!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    },
    
    // Get accuracy trend indicator
    getTrendIndicator: function(recentHistory) {
        if (!recentHistory || recentHistory.length < 5) {
            return { symbol: "→", text: "Getting Started", color: "text-blue-400" };
        }
        
        // Compare last 3 to previous 5
        const recent = recentHistory.slice(-3);
        const previous = recentHistory.slice(-8, -3);
        
        if (previous.length < 3) {
            return { symbol: "→", text: "Building Momentum", color: "text-blue-400" };
        }
        
        const recentAvg = recent.reduce((a,b) => a+b, 0) / recent.length;
        const previousAvg = previous.reduce((a,b) => a+b, 0) / previous.length;
        
        const diff = recentAvg - previousAvg;
        
        if (diff > 0.1) {
            return { symbol: "↗️", text: "Improving", color: "text-green-400" };
        } else if (diff < -0.1) {
            return { symbol: "↘️", text: "Needs Support", color: "text-yellow-400" };
        } else {
            return { symbol: "↔️", text: "Steady Progress", color: "text-blue-400" };
        }
    },
    
    // Update the header display based on current mode
    // questionLevel: optional - the actual level of the current question (may differ from user level due to spaced repetition)
    updateHeaderDisplay: function(level, accuracy, history, questionLevel) {
        const mode = this.currentMode;
        
        const levelDisplay = document.getElementById('level-display');
        const levelContainer = levelDisplay ? levelDisplay.closest('.flex.flex-col') : null;
        const levelLabel = levelContainer ? levelContainer.querySelector('span.text-gray-400') : null;
        
        const accuracyDisplay = document.getElementById('accuracy-display');
        const accuracyContainer = accuracyDisplay ? accuracyDisplay.closest('.flex.flex-col') : null;
        const accuracyLabel = accuracyContainer ? accuracyContainer.querySelector('span.text-gray-400') : null;
        
        if (!levelDisplay || !accuracyDisplay) {
            console.warn('Display elements not found');
            return;
        }
        
        // Check if this is a spaced repetition question (question from lower level)
        const isSpacedRepetition = questionLevel !== undefined && questionLevel !== null && 
                                   questionLevel !== 0 && // Not fixing habits
                                   (level - questionLevel) > 0.5;
        
        // Check if this is a fixing habits question
        const isFixingHabits = questionLevel !== undefined && questionLevel !== null && 
                              questionLevel === 0; // FIXING_HABITS_CATEGORY = 0
        
        if (mode === DISPLAY_MODES.MASTERY) {
            // Mastery Mode: Show skill area and encouraging message
            const displayLevel = isSpacedRepetition ? questionLevel : level;
            
            if (isFixingHabits) {
                if (levelLabel) levelLabel.textContent = 'Reinforcing';
                levelDisplay.textContent = 'Building Strong Habits';
            } else {
                if (levelLabel) levelLabel.textContent = isSpacedRepetition ? 'Reviewing' : 'Working On';
                const levelInt = Math.floor(displayLevel);
                levelDisplay.textContent = `Lvl: ${levelInt}: ${this.getSkillDescription(displayLevel)}`;
            }
            // Use smaller text on mobile to prevent overflow
            levelDisplay.className = 'text-xs md:text-sm font-bold text-blue-400 transition-all duration-300';
            
            if (accuracyLabel) accuracyLabel.textContent = 'Progress';
            const message = this.getEncouragingMessage(accuracy);
            accuracyDisplay.textContent = message;
            // Use smaller text on mobile to prevent overflow
            accuracyDisplay.className = 'text-xs md:text-sm font-bold text-green-400';
            
        } else if (mode === DISPLAY_MODES.GROWTH) {
            // Growth Mode: Show level band and trend
            const displayLevel = isSpacedRepetition ? questionLevel : level;
            
            if (isFixingHabits) {
                if (levelLabel) levelLabel.textContent = 'Reinforcing';
                levelDisplay.textContent = 'Building Habits';
            } else {
                if (levelLabel) levelLabel.textContent = isSpacedRepetition ? 'Reviewing' : 'Level Range';
                levelDisplay.textContent = this.getLevelBand(displayLevel);
            }
            // Smaller font on mobile to prevent overflow
            levelDisplay.className = 'text-sm md:text-xl font-bold text-yellow-400 transition-all duration-300';
            
            if (accuracyLabel) accuracyLabel.textContent = 'Trend';
            const trend = this.getTrendIndicator(history);
            accuracyDisplay.innerHTML = `<span class="${trend.color}">${trend.symbol} ${trend.text}</span>`;
            // Use smaller text on mobile to prevent overflow
            accuracyDisplay.className = `text-xs md:text-sm font-bold ${trend.color}`;
            
        } else {
            // Full Mode: Show exact level and accuracy with educational context
            const displayLevel = isSpacedRepetition ? questionLevel : level;
            
            if (isFixingHabits) {
                if (levelLabel) levelLabel.textContent = 'Reinforcing';
                levelDisplay.textContent = 'Habits';
            } else {
                if (levelLabel) levelLabel.textContent = isSpacedRepetition ? 'Reviewing' : 'Level';
                levelDisplay.textContent = displayLevel.toFixed(1);
            }
            // Smaller font on mobile to prevent overflow
            levelDisplay.className = 'text-sm md:text-xl font-bold text-yellow-400 transition-all duration-300';
            
            if (accuracyLabel) accuracyLabel.textContent = 'Last 5 Avg';
            if (history && history.length > 0) {
                const subset = history.slice(-5);
                const avg = Math.round((subset.reduce((a,b)=>a+b,0)/subset.length)*100);
                accuracyDisplay.textContent = avg + "%";
                // Use encouraging colors: all progress is good when appropriately challenged
                // Smaller font on mobile to prevent overflow
                accuracyDisplay.className = avg >= 70 
                    ? "text-sm md:text-xl font-bold text-green-400" 
                    : "text-sm md:text-xl font-bold text-blue-400";
            } else {
                accuracyDisplay.textContent = "--%";
                accuracyDisplay.className = "text-sm md:text-xl font-bold text-gray-500";
            }
        }
    },
    
    // Set display mode (can be called from settings UI)
    setDisplayMode: function(mode) {
        if (Object.values(DISPLAY_MODES).includes(mode)) {
            this.currentMode = mode;
            // Save to localStorage
            try {
                localStorage.setItem('displayMode', mode);
            } catch (e) {
                console.warn('Could not save display mode preference:', e);
            }
            // Update display immediately
            if (window.APP && window.APP.level !== undefined) {
                const accuracy = window.APP.history && window.APP.history.length > 0
                    ? window.APP.history.slice(-5).reduce((a,b)=>a+b,0) / Math.min(5, window.APP.history.length)
                    : null;
                const questionLevel = window.APP.currentQ ? window.APP.currentQ.questionLevel : undefined;
                this.updateHeaderDisplay(window.APP.level, accuracy, window.APP.history, questionLevel);
            }
        }
    },
    
    // Initialize display mode from localStorage or default
    init: function() {
        try {
            const saved = localStorage.getItem('displayMode');
            if (saved && Object.values(DISPLAY_MODES).includes(saved)) {
                this.currentMode = saved;
            }
        } catch (e) {
            console.warn('Could not load display mode preference:', e);
        }
    }
};

// Initialize on load
if (typeof DEFAULT_DISPLAY_MODE !== 'undefined') {
    window.DisplayModes.init();
}
