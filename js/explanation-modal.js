// Explanation Modal - Displays explanations when answers are wrong
window.ExplanationModal = {
    isOpen: false,
    currentExplanation: '',
    currentDetailedExplanation: '',
    allowRetry: false,
    showingDetailed: false,
    
    // Create and inject modal HTML into the page
    init: function() {
        const modalHTML = `
            <div id="explanation-modal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div class="bg-gray-800 rounded-xl shadow-2xl border-2 border-yellow-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <!-- Header -->
                    <div class="bg-yellow-900 p-4 flex justify-between items-center border-b border-yellow-700">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">💡</span>
                            <h2 class="text-2xl font-bold text-yellow-200">Learning Opportunity!</h2>
                        </div>
                        <button onclick="ExplanationModal.hide()" class="text-gray-400 hover:text-white text-3xl leading-none" aria-label="Close">&times;</button>
                    </div>
                    
                    <!-- Explanation Content -->
                    <div class="p-6 space-y-4">
                        <div id="explanation-modal-text" class="text-gray-300 text-base leading-relaxed"></div>
                        <p class="text-gray-400 text-sm italic">💡 Wrong answers are where we learn! Take a moment to understand the correct approach.</p>
                    </div>
                    
                    <!-- Feedback buttons (shown initially) -->
                    <div id="feedback-buttons" class="bg-gray-700 p-4 border-t border-gray-700">
                        <p class="text-gray-300 text-sm mb-3 text-center">Was this explanation clear?</p>
                        <div class="flex gap-3">
                            <button onclick="ExplanationModal.handleGotIt()" class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg transition">
                                ✓ Got it!
                            </button>
                            <button onclick="ExplanationModal.showDetailedExplanation()" class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg transition">
                                🔍 Explain more
                            </button>
                        </div>
                    </div>
                    
                    <!-- Action buttons (shown after feedback or for "I don't know") -->
                    <div id="action-buttons" class="hidden bg-gray-700 p-4 border-t border-gray-700 flex gap-3">
                        <button id="retry-btn" onclick="ExplanationModal.retry()" class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg">
                            Try Again
                        </button>
                        <button onclick="ExplanationModal.nextQuestion()" class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg">
                            Next Problem →
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Inject into body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },
    
    // Show the modal with explanation
    show: function(explanation, allowRetry = true, detailedExplanation = '') {
        this.isOpen = true;
        this.currentExplanation = explanation;
        this.currentDetailedExplanation = detailedExplanation;
        this.allowRetry = allowRetry;
        this.showingDetailed = false;
        
        // Process explanation to handle LaTeX properly
        const processedExplanation = window.GeneratorUtils 
            ? window.GeneratorUtils.processExplanationText(explanation)
            : explanation;
        
        // Update content
        document.getElementById('explanation-modal-text').innerHTML = processedExplanation;
        
        // Show/hide feedback buttons vs action buttons
        const feedbackButtons = document.getElementById('feedback-buttons');
        const actionButtons = document.getElementById('action-buttons');
        const retryBtn = document.getElementById('retry-btn');
        
        if (allowRetry && detailedExplanation) {
            // Show feedback buttons for wrong answers with detailed explanation available
            feedbackButtons.classList.remove('hidden');
            actionButtons.classList.add('hidden');
        } else {
            // Show action buttons for "I don't know" or when no detailed explanation
            feedbackButtons.classList.add('hidden');
            actionButtons.classList.remove('hidden');
            
            // Show/hide retry button based on allowRetry
            if (allowRetry) {
                retryBtn.classList.remove('hidden');
            } else {
                retryBtn.classList.add('hidden');
            }
        }
        
        // Show modal
        document.getElementById('explanation-modal').classList.remove('hidden');
        
        // Typeset math if MathJax is available
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([document.getElementById('explanation-modal-text')]);
        }
    },
    
    // Handle "Got it!" button click
    handleGotIt: function() {
        // User understood the basic explanation
        // Switch to action buttons
        document.getElementById('feedback-buttons').classList.add('hidden');
        document.getElementById('action-buttons').classList.remove('hidden');
        
        // Show retry button if allowed
        const retryBtn = document.getElementById('retry-btn');
        if (this.allowRetry) {
            retryBtn.classList.remove('hidden');
        } else {
            retryBtn.classList.add('hidden');
        }
    },
    
    // Show detailed explanation
    showDetailedExplanation: function() {
        if (this.currentDetailedExplanation) {
            // Update content with detailed explanation
            // Note: detailed explanation is already processed by generateDetailedExplanation
            this.showingDetailed = true;
            document.getElementById('explanation-modal-text').innerHTML = this.currentDetailedExplanation;
            
            // Switch to action buttons
            document.getElementById('feedback-buttons').classList.add('hidden');
            document.getElementById('action-buttons').classList.remove('hidden');
            
            // Show retry button if allowed
            const retryBtn = document.getElementById('retry-btn');
            if (this.allowRetry) {
                retryBtn.classList.remove('hidden');
            } else {
                retryBtn.classList.add('hidden');
            }
            
            // Typeset math if MathJax is available
            if (window.MathJax && window.MathJax.typesetPromise) {
                MathJax.typesetPromise([document.getElementById('explanation-modal-text')]);
            }
        } else {
            // Fallback: just show action buttons if no detailed explanation
            this.handleGotIt();
        }
    },
    
    // Hide the modal and reset UI
    hide: function() {
        this.isOpen = false;
        document.getElementById('explanation-modal').classList.add('hidden');
        
        // Clear the UI state - remove highlights and reset for retry
        this.resetUIState();
    },
    
    // Reset UI state after closing modal
    resetUIState: function() {
        // Define default button class
        const DEFAULT_BUTTON_CLASS = "p-4 bg-gray-700 hover:bg-gray-600 rounded text-lg border border-gray-600 transition flex items-center justify-center min-h-[60px]";
        
        // Re-enable all answer buttons
        const allButtons = document.getElementById('mc-options').querySelectorAll('button');
        allButtons.forEach(btn => {
            btn.disabled = false;
            // Reset to default styling
            btn.className = DEFAULT_BUTTON_CLASS;
        });
        
        // Hide the old inline explanation box (for backward compatibility)
        const inlineBox = document.getElementById('explanation-box');
        if (inlineBox) {
            inlineBox.classList.add('hidden');
        }
        
        // Hide Next button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.classList.add('invisible');
        }
        
        // delta-display is permanently hidden (internal level tracking)
    },
    
    // Retry the same question
    retry: function() {
        this.hide();
        // UI is already reset by hide(), question remains the same
        // Reset the start time for the retry attempt
        if (window.APP) {
            window.APP.startTime = Date.now();
        }
    },
    
    // Go to next question
    nextQuestion: function() {
        this.hide();
        if (window.UI && window.UI.nextQuestion) {
            window.UI.nextQuestion();
        } else if (window.APP && window.APP.nextQuestion) {
            window.APP.nextQuestion();
        }
    },
    
    // Generate a detailed explanation from the basic explanation
    // This expands on the basic explanation with more step-by-step details
    generateDetailedExplanation: function(question) {
        // If question already has a detailedExplanation field, use it
        if (question.detailedExplanation) {
            return question.detailedExplanation;
        }
        
        // Helper function to escape HTML to prevent XSS
        const escapeHtml = (text) => {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        // Otherwise, enhance the basic explanation with step-by-step breakdown
        const basicExplanation = question.explanation || '';
        
        // Create a more detailed version with step-by-step structure
        let detailed = `<div class="space-y-4">`;
        detailed += `<div class="bg-blue-900 bg-opacity-30 p-3 rounded border border-blue-700">`;
        detailed += `<h3 class="text-lg font-bold text-blue-300 mb-2">📚 Detailed Step-by-Step Explanation</h3>`;
        detailed += `</div>`;
        
        // Add the problem context (escape plain text, but allow LaTeX)
        detailed += `<div class="bg-gray-700 p-3 rounded">`;
        if (question.instruction) {
            // Instructions are safe as they come from Generator
            detailed += `<p class="text-gray-300"><strong>Problem:</strong> ${escapeHtml(question.instruction)}</p>`;
        }
        if (question.tex) {
            // LaTeX expressions are safe as they come from Generator
            detailed += `<p class="text-gray-300 mt-2"><strong>Expression:</strong> \\(${question.tex}\\)</p>`;
        }
        if (question.displayAnswer) {
            // Display answers are safe as they come from Generator
            detailed += `<p class="text-green-300 mt-2"><strong>Correct Answer:</strong> \\(${question.displayAnswer}\\)</p>`;
        }
        detailed += `</div>`;
        
        // Add the basic explanation (process it to handle LaTeX properly)
        const processedBasicExplanation = window.GeneratorUtils 
            ? window.GeneratorUtils.processExplanationText(basicExplanation)
            : basicExplanation;
        detailed += `<div class="bg-gray-700 p-3 rounded">`;
        detailed += `<p class="text-sm font-semibold text-yellow-300 mb-2">Step-by-step approach:</p>`;
        detailed += `<p class="text-gray-300">${processedBasicExplanation}</p>`;
        detailed += `</div>`;
        
        // Add additional tips based on question type
        if (question.type === 'why') {
            detailed += `<div class="bg-purple-900 bg-opacity-30 p-3 rounded border border-purple-700">`;
            detailed += `<p class="text-sm text-purple-200"><strong>💡 Understanding "Why":</strong> This question tests your conceptual understanding. Make sure you understand the reasoning, not just the procedure.</p>`;
            detailed += `</div>`;
        } else if (question.type === 'fixing-habits') {
            detailed += `<div class="bg-orange-900 bg-opacity-30 p-3 rounded border border-orange-700">`;
            detailed += `<p class="text-sm text-orange-200"><strong>⚠️ Common Mistake:</strong> This is a frequently made error. Take time to understand why the correct approach works.</p>`;
            detailed += `</div>`;
        } else {
            // Add generic study tips
            detailed += `<div class="bg-green-900 bg-opacity-30 p-3 rounded border border-green-700">`;
            detailed += `<p class="text-sm text-green-200"><strong>📝 Study Tip:</strong> Practice similar problems to build confidence. Try working backwards from the answer to understand the logic.</p>`;
            detailed += `</div>`;
        }
        
        detailed += `</div>`;
        
        return detailed;
    }
};
