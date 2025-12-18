// Help Modal - Quick tips and FAQ for mobile users
window.HelpModal = {
    isOpen: false,
    
    // Create and inject modal HTML into the page
    init: function() {
        const modalHTML = `
            <div id="help-modal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div class="bg-gray-800 rounded-xl shadow-2xl border-2 border-purple-500 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                    <!-- Header -->
                    <div class="bg-purple-900 p-4 flex justify-between items-center border-b border-purple-700 sticky top-0">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">💡</span>
                            <h2 class="text-2xl font-bold text-purple-200">Quick Tips</h2>
                        </div>
                        <button onclick="HelpModal.hide()" class="text-gray-400 hover:text-white text-3xl leading-none min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Close help">&times;</button>
                    </div>
                    
                    <!-- Help Content -->
                    <div class="p-6 space-y-5">
                        <!-- How It Works -->
                        <div class="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-500">
                            <h3 class="text-lg font-bold text-blue-300 mb-2 flex items-center gap-2">
                                <span>🎯</span>
                                <span>How It Works</span>
                            </h3>
                            <ul class="text-sm text-gray-300 space-y-2 ml-6 list-disc">
                                <li><strong>Calibration:</strong> Answer honestly to find your level (at least 6 responses needed)</li>
                                <li><strong>Learning:</strong> Practice with multiple choice questions at your level</li>
                                <li><strong>Turbo Mode:</strong> Get 3 correct in a row for faster progression 🔥</li>
                            </ul>
                        </div>
                        
                        <!-- Mobile Tips -->
                        <div class="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-500">
                            <h3 class="text-lg font-bold text-green-300 mb-2 flex items-center gap-2">
                                <span>📱</span>
                                <span>Mobile Tips</span>
                            </h3>
                            <ul class="text-sm text-gray-300 space-y-2 ml-6 list-disc">
                                <li>Tap buttons for best experience - all buttons are sized for easy tapping</li>
                                <li>Hold screen in portrait or landscape - app adapts to both</li>
                                <li>Use "I don't know" button when stuck - no penalty!</li>
                                <li>View stats anytime via the 📊 icon in top right</li>
                            </ul>
                        </div>
                        
                        <!-- Common Questions -->
                        <div class="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-500">
                            <h3 class="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                                <span>❓</span>
                                <span>Common Questions</span>
                            </h3>
                            <div class="space-y-3 text-sm">
                                <div>
                                    <div class="font-bold text-purple-200 mb-1">Q: What does "I don't know" do?</div>
                                    <div class="text-gray-400">Shows you the answer with explanation and adjusts difficulty down to help you learn.</div>
                                </div>
                                <div>
                                    <div class="font-bold text-purple-200 mb-1">Q: Why am I getting easier questions?</div>
                                    <div class="text-gray-400">The app uses spaced repetition to help you master earlier topics while learning new ones.</div>
                                </div>
                                <div>
                                    <div class="font-bold text-purple-200 mb-1">Q: How do I track my progress?</div>
                                    <div class="text-gray-400">Tap the 📊 Stats icon in the top right to see your mastery levels and practice time.</div>
                                </div>
                                <div>
                                    <div class="font-bold text-purple-200 mb-1">Q: What's the ideal score?</div>
                                    <div class="text-gray-400">70-85% accuracy means perfect challenge level! If you're always at 100%, questions are too easy.</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Keyboard Shortcuts (Desktop) -->
                        <div class="bg-gray-750 p-4 rounded-lg border border-gray-600 hidden md:block">
                            <h3 class="text-lg font-bold text-gray-300 mb-2 flex items-center gap-2">
                                <span>⌨️</span>
                                <span>Keyboard Shortcuts (Desktop)</span>
                            </h3>
                            <ul class="text-sm text-gray-400 space-y-1 ml-6 list-disc">
                                <li><kbd class="px-2 py-1 bg-gray-900 rounded">1-4</kbd> Select answer A-D</li>
                                <li><kbd class="px-2 py-1 bg-gray-900 rounded">Space</kbd> Next question</li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="bg-gray-750 p-4 border-t border-gray-700 sticky bottom-0">
                        <button onclick="HelpModal.hide()" class="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded min-h-[48px]">
                            Got It!
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Inject into body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },
    
    // Show the modal
    show: function() {
        this.isOpen = true;
        const modal = document.getElementById('help-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    },
    
    // Hide the modal
    hide: function() {
        this.isOpen = false;
        const modal = document.getElementById('help-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
};
