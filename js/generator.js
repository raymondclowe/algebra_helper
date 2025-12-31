// --- GENERATOR ---
// Main generator that coordinates question generation
// Individual question templates are in js/question-templates/
window.Generator = {
    rInt: (min, max) => window.GeneratorUtils.rInt(min, max),
    questionCounter: 0, // Track questions to interleave "why" questions
    
    // Re-export utility functions for backward compatibility
    EQUIVALENCE_TOLERANCE: window.GeneratorUtils.EQUIVALENCE_TOLERANCE,
    EQUIVALENCE_TEST_VALUES: window.GeneratorUtils.EQUIVALENCE_TEST_VALUES,
    FALLBACK_DISTRACTOR_MAX_COEFFICIENT: window.GeneratorUtils.FALLBACK_DISTRACTOR_MAX_COEFFICIENT,
    JOKE_ANSWERS: window.GeneratorUtils.JOKE_ANSWERS,
    
    toUnicodeFunction: (str) => window.GeneratorUtils.toUnicodeFunction(str),
    gcd: (a, b) => window.GeneratorUtils.gcd(a, b),
    lcm: (a, b) => window.GeneratorUtils.lcm(a, b),
    parseFraction: function(str) { return window.GeneratorUtils.parseFraction(str); },
    normalizeFraction: function(numerator, denominator) { return window.GeneratorUtils.normalizeFraction(numerator, denominator); },
    areAnswersEquivalent: function(answer1, answer2) { return window.GeneratorUtils.areAnswersEquivalent(answer1, answer2); },
    shuffleArray: function(array) { return window.GeneratorUtils.shuffleArray(array); },
    ensureUniqueDistractors: function(correctAnswer, distractors, generateAlternative) { 
        return window.GeneratorUtils.ensureUniqueDistractors(correctAnswer, distractors, generateAlternative); 
    },
    ensureUniqueDistractorsFractionAware: function(correctAnswer, distractors, generateAlternative) { 
        return window.GeneratorUtils.ensureUniqueDistractorsFractionAware(correctAnswer, distractors, generateAlternative); 
    },
    evaluateExpression: function(expr, x) { return window.GeneratorUtils.evaluateExpression(expr, x); },
    areEquivalent: function(expr1, expr2, testValues) { return window.GeneratorUtils.areEquivalent(expr1, expr2, testValues); },
    
    // Generate a signature for a question to identify duplicates in the session
    generateQuestionSignature: function(question) {
        return `${question.tex}_${question.displayAnswer}`;
    },
    
    // Check if a question has been asked frequently
    isFrequentQuestion: function(signature) {
        const sessionLog = window.APP.sessionQuestions;
        const entry = sessionLog.get(signature);
        
        if (!entry) {
            return false;
        }
        
        return entry.correctCount > entry.incorrectCount;
    },
    
    // Check if a question was recently answered incorrectly
    isRecentlyIncorrect: function(signature) {
        const sessionLog = window.APP.sessionQuestions;
        const entry = sessionLog.get(signature);
        
        if (!entry) {
            return false;
        }
        
        const RECENT_THRESHOLD = 5;
        const questionsSinceLastAsked = window.APP.sessionQuestionCount - entry.lastAsked;
        
        return entry.incorrectCount > 0 && questionsSinceLastAsked <= RECENT_THRESHOLD;
    },
    
    // Record that a question was asked
    recordQuestionAsked: function(question, isCorrect) {
        const signature = this.generateQuestionSignature(question);
        const sessionLog = window.APP.sessionQuestions;
        
        window.APP.sessionQuestionCount++;
        
        if (!sessionLog.has(signature)) {
            sessionLog.set(signature, {
                count: 0,
                correctCount: 0,
                incorrectCount: 0,
                lastAsked: 0
            });
        }
        
        const entry = sessionLog.get(signature);
        entry.count++;
        entry.lastAsked = window.APP.sessionQuestionCount;
        
        if (isCorrect !== undefined) {
            if (isCorrect) {
                entry.correctCount++;
            } else {
                entry.incorrectCount++;
            }
        }
    },
    
    // Spaced repetition: Select question level with logarithmic fall-off
    selectQuestionLevel: function(currentLevel) {
        if (window.APP.mode !== 'learning' && window.APP.mode !== 'drill') {
            return currentLevel;
        }
        
        if (currentLevel <= 1) {
            return currentLevel;
        }
        
        const rand = Math.random() * 100;
        
        if (rand < 1) {
            const levelDrop = Math.min(4 + Math.floor(Math.random() * 2), currentLevel - 1);
            return Math.max(1, currentLevel - levelDrop);
        } else if (rand < 3) {
            return Math.max(1, currentLevel - 3);
        } else if (rand < 8) {
            return Math.max(1, currentLevel - 2);
        } else if (rand < 18) {
            return Math.max(1, currentLevel - 1);
        } else {
            return currentLevel;
        }
    },
    
    getQuestion: function(level) {
        // If in testing mode with forced level, use that instead
        let effectiveLevel = level;
        if (window.TESTING_MODE && window.FORCED_TEST_LEVEL !== null) {
            effectiveLevel = window.FORCED_TEST_LEVEL;
        }
        
        const questionLevel = this.selectQuestionLevel(effectiveLevel);
        
        // Check for Fixing Habits questions (skip in testing mode)
        if (window.FixingHabitsQuestions && window.FixingHabitsQuestions.shouldInsertFixingHabitsQuestion()) {
            return window.FixingHabitsQuestions.getFixingHabitsQuestion();
        }
        
        // Interleave "why" questions every 3rd question
        if (window.APP.mode === 'learning' || window.APP.mode === 'drill') {
            this.questionCounter++;
            if (this.questionCounter % 3 === 0) {
                const question = this.getWhyQuestion(questionLevel);
                question.questionLevel = questionLevel;
                question.topic = window.TopicDefinitions.getTopicForLevel(questionLevel);
                return question;
            }
        }
        
        const question = this.getUniqueQuestion(questionLevel);
        question.questionLevel = questionLevel;
        question.topic = window.TopicDefinitions.getTopicForLevel(questionLevel);
        return question;
    },
    
    // Get a unique question, avoiding frequent questions
    getUniqueQuestion: function(level) {
        if (window.APP.mode !== 'learning' && window.APP.mode !== 'drill') {
            return this.getQuestionForLevel(level);
        }
        
        const MAX_ATTEMPTS = 10;
        let attempts = 0;
        
        while (attempts < MAX_ATTEMPTS) {
            const question = this.getQuestionForLevel(level);
            const signature = this.generateQuestionSignature(question);
            
            if (this.isFrequentQuestion(signature) && !this.isRecentlyIncorrect(signature)) {
                attempts++;
                continue;
            }
            
            return question;
        }
        
        // Try adjacent levels
        const adjacentLevels = [
            Math.min(level + 1, MAX_LEVEL),
            Math.max(level - 1, 1)
        ];
        
        for (const adjLevel of adjacentLevels) {
            attempts = 0;
            while (attempts < MAX_ATTEMPTS) {
                const question = this.getQuestionForLevel(adjLevel);
                const signature = this.generateQuestionSignature(question);
                
                if (this.isFrequentQuestion(signature) && !this.isRecentlyIncorrect(signature)) {
                    attempts++;
                    continue;
                }
                
                return question;
            }
        }
        
        return this.getQuestionForLevel(level);
    },
    
    // Get a question for a specific level - delegates to question templates
    getQuestionForLevel: function(level) {
        const band = Math.round(level);
        if (band <= 1) return this.getBasicArithmetic();
        if (band <= 2) return this.getSquaresAndRoots();
        if (band <= 3) return this.getMultiplicationTables();
        if (band <= 4) return this.getFractions();
        if (band <= 5) return this.getDecimalsPercentages();
        if (band <= 6) return this.lvl1();
        if (band <= 7) return this.lvl2();
        if (band <= 8) return this.getInequalities();
        if (band <= 9) return this.lvl3();
        if (band <= 10) return this.lvl4();
        if (band <= 11) return this.getQuadratics();
        if (band <= 12) return this.getPolynomials();
        if (band <= 13) return this.getExponentialsLogs();
        if (band <= 14) return this.getSequencesSeries();
        if (band <= 15) return this.getFunctionProblems();
        if (band <= 16) return this.getTrigonometry();
        if (band <= 17) return this.getAdvancedTrig();
        if (band <= 18) return this.getVectors();
        if (band <= 19) return this.getComplexNumbers();
        if (band <= 20) return this.lvl5();
        if (band <= 21) return this.getAdvancedCalculus();
        if (band <= 22) return this.getStatistics();
        if (band <= 23) return this.getProbability();
        if (band <= 24) return this.getAdvancedProbability();
        if (band <= 25) return this.getCalculus();
        // Advanced HL Topics
        if (band <= 26) return this.getInductionProof();
        if (band <= 27) return this.getContradictionProof();
        if (band <= 28) return this.getMatrixAlgebra();
        if (band <= 29) return this.getVectors3D();
        if (band <= 30) return this.getComplexPolar();
        if (band <= 31) return this.getAdvancedIntegration();
        if (band <= 32) return this.getDifferentialEquations();
        if (band <= 33) return this.getProbabilityDistributions();
        return this.getHypothesisTesting();
    },
    
    // Delegate to question template modules
    lvl1: function() { return window.QuestionTemplates.BasicEquations.lvl1(); },
    lvl2: function() { return window.QuestionTemplates.BasicEquations.lvl2(); },
    lvl3: function() { return window.QuestionTemplates.BasicEquations.lvl3(); },
    lvl4: function() { return window.QuestionTemplates.BasicEquations.lvl4(); },
    lvl5: function() { return window.QuestionTemplates.BasicEquations.lvl5(); },
    getInverseQuadraticQuestion: function() { return window.QuestionTemplates.Quadratics.getInverseQuadraticQuestion(); },
    getBasicArithmetic: function() { return window.QuestionTemplates.BasicArithmetic.getBasicArithmetic(); },
    getSquaresAndRoots: function() { return window.QuestionTemplates.SquaresRoots.getSquaresAndRoots(); },
    getMultiplicationTables: function() { return window.QuestionTemplates.MultiplicationTables.getMultiplicationTables(); },
    getFunctionProblems: function() { return window.QuestionTemplates.Functions.getFunctionProblems(); },
    getTrigonometry: function() { return window.QuestionTemplates.Trigonometry.getTrigonometry(); },
    getProbability: function() { return window.QuestionTemplates.Probability.getProbability(); },
    getCalculus: function() { return window.QuestionTemplates.Calculus.getCalculus(); },
    getFractions: function() { return window.QuestionTemplates.Fractions.getFractions(); },
    getDecimalsPercentages: function() { return window.QuestionTemplates.DecimalsPercentages.getDecimalsPercentages(); },
    getInequalities: function() { return window.QuestionTemplates.Inequalities.getInequalities(); },
    getQuadratics: function() { return window.QuestionTemplates.Quadratics.getQuadratics(); },
    getPolynomials: function() { return window.QuestionTemplates.Polynomials.getPolynomials(); },
    getExponentialsLogs: function() { return window.QuestionTemplates.ExponentialsLogs.getExponentialsLogs(); },
    getSequencesSeries: function() { return window.QuestionTemplates.SequencesSeries.getSequencesSeries(); },
    getAdvancedTrig: function() { return window.QuestionTemplates.AdvancedTrig.getAdvancedTrig(); },
    getVectors: function() { return window.QuestionTemplates.Vectors.getVectors(); },
    getComplexNumbers: function() { return window.QuestionTemplates.ComplexNumbers.getComplexNumbers(); },
    getAdvancedCalculus: function() { return window.QuestionTemplates.AdvancedCalculus.getAdvancedCalculus(); },
    getStatistics: function() { return window.QuestionTemplates.Statistics.getStatistics(); },
    getAdvancedProbability: function() { return window.QuestionTemplates.AdvancedProbability.getAdvancedProbability(); },
    getWhyQuestion: function(level) { return window.QuestionTemplates.WhyQuestions.getWhyQuestion(level); },
    
    // Advanced HL Topics
    getInductionProof: function() { return window.QuestionTemplates.ProofsInduction.getInductionProofQuestion(); },
    getContradictionProof: function() { return window.QuestionTemplates.ProofsContradiction.getContradictionProofQuestion(); },
    getMatrixAlgebra: function() { return window.QuestionTemplates.MatrixAlgebra.getMatrixQuestion(); },
    getVectors3D: function() { return window.QuestionTemplates.Vectors3D.get3DVectorQuestion(); },
    getComplexPolar: function() { return window.QuestionTemplates.ComplexPolar.getComplexPolarQuestion(); },
    getAdvancedIntegration: function() { return window.QuestionTemplates.AdvancedIntegration.getAdvancedIntegrationQuestion(); },
    getDifferentialEquations: function() { return window.QuestionTemplates.DifferentialEquations.getDifferentialEquationQuestion(); },
    getProbabilityDistributions: function() { return window.QuestionTemplates.ProbabilityDistributions.getProbabilityDistributionQuestion(); },
    getHypothesisTesting: function() { return window.QuestionTemplates.HypothesisTesting.getHypothesisTestingQuestion(); }
};
