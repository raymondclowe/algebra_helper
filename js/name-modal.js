// Student Name Modal Management
window.NameModal = {
    show: function(isInitialSetup = false) {
        const modal = document.getElementById('name-modal');
        const input = document.getElementById('name-input');
        const currentName = window.StorageManager.getStudentName();
        
        // Set current value or empty for initial setup
        input.value = currentName;
        
        // Update modal title based on context
        const title = document.getElementById('name-modal-title');
        if (isInitialSetup) {
            title.innerText = 'Welcome! Let\'s Get Started';
        } else {
            title.innerText = 'Update Your Name';
        }
        
        modal.classList.remove('hidden');
        
        // Focus the input field
        setTimeout(() => input.focus(), INPUT_FOCUS_DELAY_MS);
    },
    
    close: function() {
        const modal = document.getElementById('name-modal');
        modal.classList.add('hidden');
    },
    
    save: function() {
        const input = document.getElementById('name-input');
        const name = input.value.trim();
        
        if (name) {
            window.StorageManager.setStudentName(name);
            this.close();
            
            // Update APP state
            if (window.APP) {
                window.APP.studentName = name;
            }
            
            // Show a brief confirmation
            this.showConfirmation(name);
        } else {
            // Show error - name is required
            this.showError();
        }
    },
    
    showConfirmation: function(name) {
        const toast = document.createElement('div');
        toast.className = 'toast bg-blue-500 text-white px-6 py-3 rounded-lg shadow-2xl text-lg font-bold';
        toast.innerText = `Great! Welcome, ${name}! 🎉`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },
    
    showError: function() {
        const input = document.getElementById('name-input');
        input.classList.add('border-red-500');
        
        setTimeout(() => {
            input.classList.remove('border-red-500');
        }, 1500);
    },
    
    handleKeyPress: function(event) {
        if (event.key === 'Enter') {
            this.save();
        }
    },
    
    // Check if name should be prompted on startup
    checkAndPromptForName: function() {
        const name = window.StorageManager.getStudentName();
        
        // Update APP state with loaded name
        if (window.APP) {
            window.APP.studentName = name;
        }
        
        if (!name) {
            // Show the name modal for first-time users
            this.show(true);
        }
        return name;
    }
};
