// Pattern Analysis Module - Detects recurring mistakes and bad habits
window.PatternAnalysis = {
    // Minimum occurrences to flag as a pattern
    MIN_PATTERN_OCCURRENCES: 3,
    
    // Time window for recent patterns (30 days in milliseconds)
    RECENT_PATTERN_WINDOW: 30 * 24 * 60 * 60 * 1000,
    
    // Common error types for categorization
    ERROR_TYPES: {
        SQUARE_ROOT_SIGN: 'squareRootSign',
        DIVISION_BY_ZERO: 'divisionByZero',
        SIGN_ERROR: 'signError',
        FRACTION_SIMPLIFICATION: 'fractionSimplification',
        ORDER_OF_OPERATIONS: 'orderOfOperations',
        EXPONENT_RULES: 'exponentRules',
        FACTORING_ERROR: 'factoringError',
        SUBSTITUTION_ERROR: 'substitutionError',
        ALGEBRAIC_MANIPULATION: 'algebraicManipulation',
        UNIT_CONVERSION: 'unitConversion',
        OTHER: 'other'
    },
    
    // Analyze all paper homework for patterns
    analyzeAllPatterns: async function() {
        try {
            const paperHomework = await window.StorageManager.getAllPaperHomework();
            const inAppQuestions = await window.StorageManager.getAllQuestions();
            
            // Combine both data sources for comprehensive analysis
            const allData = [
                ...paperHomework.map(hw => ({
                    ...hw,
                    source: 'paper'
                })),
                ...inAppQuestions.map(q => ({
                    ...q,
                    source: 'inApp'
                }))
            ];
            
            // Filter to recent data
            const cutoffDate = Date.now() - this.RECENT_PATTERN_WINDOW;
            const recentData = allData.filter(item => item.datetime >= cutoffDate);
            
            // Group by topic
            const topicPatterns = this.analyzeByTopic(recentData);
            
            // Group by error type
            const errorPatterns = this.analyzeByErrorType(recentData);
            
            // Identify persistent mistakes
            const persistentMistakes = this.identifyPersistentMistakes(recentData);
            
            return {
                topicPatterns,
                errorPatterns,
                persistentMistakes,
                totalEntries: recentData.length
            };
        } catch (error) {
            console.error('Error analyzing patterns:', error);
            return null;
        }
    },
    
    // Analyze patterns by topic
    analyzeByTopic: function(data) {
        const topicStats = {};
        
        data.forEach(item => {
            const topic = item.topic || 'Unknown';
            
            if (!topicStats[topic]) {
                topicStats[topic] = {
                    total: 0,
                    correct: 0,
                    incorrect: 0,
                    accuracy: 0,
                    recentErrors: []
                };
            }
            
            topicStats[topic].total++;
            
            if (item.isCorrect) {
                topicStats[topic].correct++;
            } else if (!item.isDontKnow) {
                topicStats[topic].incorrect++;
                topicStats[topic].recentErrors.push({
                    datetime: item.datetime,
                    question: item.question || item.questionDescription,
                    errorNote: item.errorNote,
                    errorType: item.errorType
                });
            }
        });
        
        // Calculate accuracy and flag weak topics
        Object.keys(topicStats).forEach(topic => {
            const stats = topicStats[topic];
            const answered = stats.correct + stats.incorrect;
            stats.accuracy = answered > 0 ? (stats.correct / answered) * 100 : 0;
            stats.needsImprovement = stats.accuracy < 70 && stats.incorrect >= this.MIN_PATTERN_OCCURRENCES;
            
            // Keep only most recent errors
            stats.recentErrors = stats.recentErrors
                .sort((a, b) => b.datetime - a.datetime)
                .slice(0, 5);
        });
        
        return topicStats;
    },
    
    // Analyze patterns by error type
    analyzeByErrorType: function(data) {
        const errorStats = {};
        
        data.forEach(item => {
            if (item.isCorrect || item.isDontKnow) return;
            
            const errorType = item.errorType || this.ERROR_TYPES.OTHER;
            
            if (!errorStats[errorType]) {
                errorStats[errorType] = {
                    count: 0,
                    examples: [],
                    topics: new Set()
                };
            }
            
            errorStats[errorType].count++;
            errorStats[errorType].topics.add(item.topic || 'Unknown');
            
            if (errorStats[errorType].examples.length < 3) {
                errorStats[errorType].examples.push({
                    datetime: item.datetime,
                    question: item.question || item.questionDescription,
                    topic: item.topic,
                    errorNote: item.errorNote
                });
            }
        });
        
        // Convert Set to Array for serialization
        Object.keys(errorStats).forEach(errorType => {
            errorStats[errorType].topics = Array.from(errorStats[errorType].topics);
            errorStats[errorType].isRecurring = errorStats[errorType].count >= this.MIN_PATTERN_OCCURRENCES;
        });
        
        return errorStats;
    },
    
    // Identify persistent mistakes (errors that occur even after practice)
    identifyPersistentMistakes: function(data) {
        const persistentMistakes = [];
        
        // Group data by topic and error type
        const grouped = {};
        
        data.forEach(item => {
            const key = `${item.topic}_${item.errorType || 'general'}`;
            
            if (!grouped[key]) {
                grouped[key] = {
                    topic: item.topic,
                    errorType: item.errorType,
                    attempts: []
                };
            }
            
            grouped[key].attempts.push({
                datetime: item.datetime,
                isCorrect: item.isCorrect,
                isDontKnow: item.isDontKnow
            });
        });
        
        // Identify patterns where errors persist despite practice
        Object.values(grouped).forEach(group => {
            // Sort by date
            group.attempts.sort((a, b) => a.datetime - b.datetime);
            
            // Check if recent attempts show errors
            const recentAttempts = group.attempts.slice(-5);
            const recentErrors = recentAttempts.filter(a => !a.isCorrect && !a.isDontKnow).length;
            
            // Flag as persistent if still making errors in recent attempts
            if (recentErrors >= 2 && group.attempts.length >= 5) {
                persistentMistakes.push({
                    topic: group.topic,
                    errorType: group.errorType,
                    totalAttempts: group.attempts.length,
                    recentErrors: recentErrors,
                    needsHabitCorrection: true
                });
            }
        });
        
        return persistentMistakes;
    },
    
    // Get recommendations for habit improvement
    getRecommendations: async function() {
        const patterns = await this.analyzeAllPatterns();
        
        if (!patterns) {
            return [];
        }
        
        const recommendations = [];
        
        // Recommend topics that need improvement
        Object.entries(patterns.topicPatterns).forEach(([topic, stats]) => {
            if (stats.needsImprovement) {
                recommendations.push({
                    type: 'topic',
                    priority: stats.incorrect,
                    topic: topic,
                    message: `Focus on ${topic} - Recent accuracy: ${stats.accuracy.toFixed(0)}%`,
                    suggestion: 'Practice more problems in this area to build confidence'
                });
            }
        });
        
        // Recommend addressing recurring error types
        Object.entries(patterns.errorPatterns).forEach(([errorType, stats]) => {
            if (stats.isRecurring) {
                recommendations.push({
                    type: 'errorType',
                    priority: stats.count,
                    errorType: errorType,
                    message: `Address ${this.getErrorTypeDescription(errorType)} errors`,
                    suggestion: `This mistake has occurred ${stats.count} times across ${stats.topics.length} topic(s)`,
                    affectedTopics: stats.topics
                });
            }
        });
        
        // Recommend habit correction for persistent mistakes
        patterns.persistentMistakes.forEach(mistake => {
            recommendations.push({
                type: 'habit',
                priority: 10, // High priority
                topic: mistake.topic,
                errorType: mistake.errorType,
                message: `Break the habit: ${this.getErrorTypeDescription(mistake.errorType)} in ${mistake.topic}`,
                suggestion: 'Targeted practice to reinforce correct approach'
            });
        });
        
        // Sort by priority
        recommendations.sort((a, b) => b.priority - a.priority);
        
        return recommendations;
    },
    
    // Get human-readable error type description
    getErrorTypeDescription: function(errorType) {
        const descriptions = {
            squareRootSign: 'Forgetting ± sign with square roots',
            divisionByZero: 'Division by zero',
            signError: 'Sign errors (positive/negative)',
            fractionSimplification: 'Fraction simplification',
            orderOfOperations: 'Order of operations (PEMDAS)',
            exponentRules: 'Exponent rules',
            factoringError: 'Factoring',
            substitutionError: 'Substitution',
            algebraicManipulation: 'Algebraic manipulation',
            unitConversion: 'Unit conversion',
            other: 'Calculation'
        };
        
        return descriptions[errorType] || 'General';
    }
};
