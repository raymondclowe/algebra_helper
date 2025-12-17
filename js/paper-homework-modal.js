// Paper Homework Modal - UI for inputting paper homework results
window.PaperHomeworkModal = {
    isOpen: false,
    
    // Initialize the modal
    init: function() {
        // Modal will be created dynamically when opened
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Listen for keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Escape') {
                this.close();
            }
        });
    },
    
    // Open the modal
    open: function() {
        this.isOpen = true;
        this.renderModal();
    },
    
    // Close the modal
    close: function() {
        this.isOpen = false;
        const modal = document.getElementById('paper-homework-modal');
        if (modal) {
            modal.remove();
        }
    },
    
    // Render the modal HTML
    renderModal: function() {
        // Remove existing modal if any
        const existingModal = document.getElementById('paper-homework-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal HTML
        const modalHTML = `
            <div id="paper-homework-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div class="bg-gray-800 rounded-xl shadow-2xl border-2 border-purple-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 fade-in">
                    <div class="text-center mb-4">
                        <span class="text-4xl">📝</span>
                        <h2 class="text-2xl font-bold text-purple-400 mt-2">Paper Homework Input</h2>
                        <p class="text-gray-400 text-sm mt-2">Track results from paper-based homework to improve your practice</p>
                    </div>
                    
                    <form id="paper-homework-form" class="space-y-4">
                        <!-- Topic Selection -->
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Topic</label>
                            <select id="homework-topic" required class="w-full px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500">
                                <option value="">Select a topic...</option>
                                ${this.getTopicOptions()}
                            </select>
                        </div>
                        
                        <!-- Question Description -->
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Question Description</label>
                            <textarea id="homework-question" rows="3" placeholder="Brief description of the question or problem type..." class="w-full px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500" required></textarea>
                        </div>
                        
                        <!-- Result -->
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Result</label>
                            <div class="flex gap-4">
                                <label class="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="result" value="correct" required class="w-4 h-4 text-green-500">
                                    <span class="text-green-400">✓ Correct</span>
                                </label>
                                <label class="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="result" value="incorrect" required class="w-4 h-4 text-red-500">
                                    <span class="text-red-400">✗ Incorrect</span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Error Type (shown when incorrect) -->
                        <div id="error-type-section" class="hidden">
                            <label class="block text-sm font-medium text-gray-300 mb-2">Error Type (Optional)</label>
                            <select id="homework-error-type" class="w-full px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500">
                                <option value="">Select error type...</option>
                                ${this.getErrorTypeOptions()}
                            </select>
                        </div>
                        
                        <!-- Error Notes (shown when incorrect) -->
                        <div id="error-notes-section" class="hidden">
                            <label class="block text-sm font-medium text-gray-300 mb-2">Error Notes (Optional)</label>
                            <textarea id="homework-error-notes" rows="2" placeholder="What went wrong? What should you remember?" class="w-full px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"></textarea>
                        </div>
                        
                        <!-- Buttons -->
                        <div class="flex gap-3 mt-6">
                            <button type="button" onclick="PaperHomeworkModal.close()" class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded">
                                Cancel
                            </button>
                            <button type="submit" class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded">
                                Save Entry
                            </button>
                        </div>
                    </form>
                    
                    <!-- View Past Entries Link -->
                    <div class="mt-4 text-center">
                        <button onclick="PaperHomeworkModal.viewEntries()" class="text-purple-400 hover:text-purple-300 text-sm underline">
                            View Past Entries
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup form event listeners
        this.setupFormListeners();
    },
    
    // Get topic options HTML
    getTopicOptions: function() {
        const topics = window.TopicDefinitions ? window.TopicDefinitions.getAllTopics() : [
            'Basic Arithmetic', 'Powers and Roots', 'Multiplication and Division',
            'Fractions', 'Decimals & Percentages', 'Simple Linear Equations',
            'Two-Step Equations', 'Inequalities', 'Expanding Expressions',
            'Factorising Quadratics', 'Quadratic Equations', 'Polynomials',
            'Exponentials & Logarithms', 'Sequences & Series', 'Functions',
            'Basic Trigonometry', 'Advanced Trigonometry', 'Vectors',
            'Complex Numbers', 'Basic Differentiation', 'Advanced Calculus',
            'Statistics', 'Basic Probability', 'Advanced Probability', 'Integration & Series'
        ];
        
        return topics.map(topic => `<option value="${topic}">${topic}</option>`).join('');
    },
    
    // Get error type options HTML
    getErrorTypeOptions: function() {
        const errorTypes = window.PatternAnalysis ? Object.keys(window.PatternAnalysis.ERROR_TYPES) : [
            'squareRootSign', 'divisionByZero', 'signError', 'fractionSimplification',
            'orderOfOperations', 'exponentRules', 'factoringError', 'substitutionError',
            'algebraicManipulation', 'unitConversion', 'other'
        ];
        
        const descriptions = {
            squareRootSign: 'Forgot ± sign with square roots',
            divisionByZero: 'Division by zero',
            signError: 'Sign error (positive/negative)',
            fractionSimplification: 'Fraction simplification',
            orderOfOperations: 'Order of operations (PEMDAS)',
            exponentRules: 'Exponent rules',
            factoringError: 'Factoring error',
            substitutionError: 'Substitution error',
            algebraicManipulation: 'Algebraic manipulation',
            unitConversion: 'Unit conversion',
            other: 'Other/General error'
        };
        
        return errorTypes.map(type => 
            `<option value="${type}">${descriptions[type] || type}</option>`
        ).join('');
    },
    
    // Setup form event listeners
    setupFormListeners: function() {
        const form = document.getElementById('paper-homework-form');
        const resultRadios = document.querySelectorAll('input[name="result"]');
        const errorTypeSection = document.getElementById('error-type-section');
        const errorNotesSection = document.getElementById('error-notes-section');
        
        // Show/hide error sections based on result
        resultRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'incorrect') {
                    errorTypeSection.classList.remove('hidden');
                    errorNotesSection.classList.remove('hidden');
                } else {
                    errorTypeSection.classList.add('hidden');
                    errorNotesSection.classList.add('hidden');
                }
            });
        });
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    },
    
    // Handle form submission
    handleSubmit: async function() {
        const topic = document.getElementById('homework-topic').value;
        const questionDescription = document.getElementById('homework-question').value;
        const result = document.querySelector('input[name="result"]:checked').value;
        const errorType = document.getElementById('homework-error-type').value || null;
        const errorNote = document.getElementById('homework-error-notes').value || null;
        
        const homeworkData = {
            topic: topic,
            questionDescription: questionDescription,
            isCorrect: result === 'correct',
            errorType: result === 'incorrect' ? errorType : null,
            errorNote: result === 'incorrect' ? errorNote : null,
            datetime: Date.now()
        };
        
        try {
            await window.StorageManager.savePaperHomework(homeworkData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Close modal after short delay
            setTimeout(() => {
                this.close();
            }, 1500);
        } catch (error) {
            console.error('Error saving paper homework:', error);
            alert('Error saving entry. Please try again.');
        }
    },
    
    // Show success message
    showSuccessMessage: function() {
        const form = document.getElementById('paper-homework-form');
        form.innerHTML = `
            <div class="text-center py-8">
                <span class="text-6xl">✅</span>
                <p class="text-xl text-green-400 font-bold mt-4">Entry Saved!</p>
                <p class="text-gray-400 text-sm mt-2">Your homework result has been recorded</p>
            </div>
        `;
    },
    
    // View past entries
    viewEntries: function() {
        this.close();
        // Open stats modal with paper homework tab
        if (window.StatsModal) {
            window.StatsModal.show('paperHomework');
        }
    }
};
