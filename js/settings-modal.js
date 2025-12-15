// Settings Modal Management
window.SettingsModal = {
    show: function() {
        const modal = document.getElementById('settings-modal');
        if (!modal) return;
        
        // Set the current mode as selected
        const currentMode = window.DisplayModes ? window.DisplayModes.currentMode : 'mastery';
        const radioButtons = modal.querySelectorAll('input[name="display-mode"]');
        radioButtons.forEach(radio => {
            radio.checked = (radio.value === currentMode);
            // Update border highlight
            const label = radio.closest('label');
            if (label) {
                if (radio.checked) {
                    label.classList.add('border-blue-500');
                    label.classList.remove('border-transparent');
                } else {
                    label.classList.remove('border-blue-500');
                    label.classList.add('border-transparent');
                }
            }
        });
        
        // Add change listeners to update border
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                radioButtons.forEach(r => {
                    const label = r.closest('label');
                    if (label) {
                        if (r.checked) {
                            label.classList.add('border-blue-500');
                            label.classList.remove('border-transparent');
                        } else {
                            label.classList.remove('border-blue-500');
                            label.classList.add('border-transparent');
                        }
                    }
                });
            });
        });
        
        modal.classList.remove('hidden');
    },
    
    close: function() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },
    
    apply: function() {
        const modal = document.getElementById('settings-modal');
        if (!modal) return;
        
        const selected = modal.querySelector('input[name="display-mode"]:checked');
        if (selected && window.DisplayModes) {
            window.DisplayModes.setDisplayMode(selected.value);
        }
        
        this.close();
    }
};

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('settings-modal');
    if (modal && e.target === modal) {
        window.SettingsModal.close();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('settings-modal');
        if (modal && !modal.classList.contains('hidden')) {
            window.SettingsModal.close();
        }
    }
});
