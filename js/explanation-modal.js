// Explanation Modal - Displays explanations when answers are wrong
window.ExplanationModal = {
    isOpen: false,
    currentExplanation: '',
    allowRetry: false,
    
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
                    
                    <!-- Footer with action buttons -->
                    <div class="bg-gray-750 p-4 border-t border-gray-700 flex gap-3">
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
    show: function(explanation, allowRetry = true) {
        this.isOpen = true;
        this.currentExplanation = explanation;
        this.allowRetry = allowRetry;
        
        // Update content
        document.getElementById('explanation-modal-text').innerHTML = explanation;
        
        // Show/hide retry button based on allowRetry
        const retryBtn = document.getElementById('retry-btn');
        if (allowRetry) {
            retryBtn.classList.remove('hidden');
        } else {
            retryBtn.classList.add('hidden');
        }
        
        // Show modal
        document.getElementById('explanation-modal').classList.remove('hidden');
        
        // Typeset math if MathJax is available
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([document.getElementById('explanation-modal-text')]);
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
        
        // Clear delta display
        const deltaEl = document.getElementById('delta-display');
        if (deltaEl) {
            deltaEl.innerHTML = '';
        }
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
    }
};
