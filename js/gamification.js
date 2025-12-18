// Gamification Features
window.Gamification = {
    showCorrectFeedback: function(delta, isSlow) {
        // 1. Show Toast
        this.showToast(isSlow);
        
        // 2. Trigger Confetti (skip for slow answers)
        if (!isSlow) {
            this.triggerConfetti();
        }
        
        // 3. Float Points to Score
        this.floatPointsToScore(delta);
        
        // 4. Play Success Sound (optional, skip for slow answers)
        if (!isSlow) {
            this.playSuccessSound();
        }
    },
    
    showToast: function(isSlow) {
        const toast = document.createElement('div');
        let messages, className;
        const name = window.APP.studentName || '';
        
        if (isSlow) {
            // Encouraging messages for thoughtful answers (removed speed pressure)
            // Research shows rushing can undermine deep learning (Schraw & Dennison, 1994)
            // Occasionally include student name for personalization
            const shouldUseName = name && Math.random() < PERSONALIZATION_PROBABILITY_SLOW;
            if (shouldUseName) {
                messages = [
                    `Well done, ${name}! 🎯`, 
                    `Correct! Great thinking, ${name}! 💡`, 
                    `Right answer, ${name}! 🌟`, 
                    `Good work, ${name}! ⭐`
                ];
            } else {
                messages = ['Well done! 🎯', 'Correct! Great thinking! 💡', 'Right answer! 🌟', 'Good work! ⭐'];
            }
            className = 'toast bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl text-xl font-bold';
        } else {
            // Regular success messages
            // Occasionally include student name for personalization
            const shouldUseName = name && Math.random() < PERSONALIZATION_PROBABILITY_FAST;
            if (shouldUseName) {
                messages = [
                    `Correct, ${name}! 🎉`, 
                    `Nice, ${name}! ✨`, 
                    `Perfect, ${name}! ⭐`, 
                    `Great, ${name}! 🌟`, 
                    `Awesome, ${name}! 🎯`, 
                    `Excellent, ${name}! 💫`
                ];
            } else {
                messages = ['Correct! 🎉', 'Nice! ✨', 'Perfect! ⭐', 'Great! 🌟', 'Awesome! 🎯', 'Excellent! 💫'];
            }
            className = 'toast bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl text-2xl font-bold';
        }
        
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        
        toast.className = className;
        toast.innerText = randomMsg;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 1200);
    },
    
    triggerConfetti: function() {
        const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'];
        const fragment = document.createDocumentFragment(); // Batch DOM operations
        const confettiElements = [];
        
        for (let i = 0; i < CONFETTI_COUNT; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            const duration = 2 + Math.random() * 2;
            const delay = i * CONFETTI_DELAY_STEP_MS;
            confetti.style.animation = `confettiFall ${duration}s linear forwards`;
            confetti.style.animationDelay = `${delay}ms`;
            fragment.appendChild(confetti);
            confettiElements.push({ element: confetti, cleanupTime: (duration * 1000) + delay });
        }
        
        document.body.appendChild(fragment); // Single DOM append
        
        // Batch cleanup - find max cleanup time and use single timer
        const maxCleanupTime = Math.max(...confettiElements.map(c => c.cleanupTime));
        setTimeout(() => {
            confettiElements.forEach(c => c.element.remove());
        }, maxCleanupTime);
    },
    
    floatPointsToScore: function(delta) {
        const points = document.createElement('div');
        // Show level delta as points (e.g., +0.2 or +0.5)
        points.className = 'float-to-score';
        points.innerText = `+${delta.toFixed(1)}`;
        
        // Start from center of screen
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        
        // End at level display (top left)
        const levelEl = document.getElementById('level-display');
        const rect = levelEl.getBoundingClientRect();
        const endX = rect.left + rect.width / 2;
        const endY = rect.top + rect.height / 2;
        
        points.style.left = startX + 'px';
        points.style.top = startY + 'px';
        document.body.appendChild(points);
        
        // Animate to score
        setTimeout(() => {
            points.style.transition = `all ${FLOAT_ANIMATION_DURATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            points.style.left = endX + 'px';
            points.style.top = endY + 'px';
            points.style.opacity = '0';
            points.style.transform = 'scale(0.5)';
        }, FLOAT_ANIMATION_DELAY_MS);
        
        setTimeout(() => points.remove(), FLOAT_CLEANUP_DELAY_MS);
    },
    
    playSuccessSound: function() {
        // Create a research-backed success sound using Web Audio API
        // Design based on educational feedback research and game audio principles
        // Features: two-note arpeggio, ADSR envelope, subtle variation for naturalness
        try {
            // Initialize audio context once
            if (!window.APP.audioContext) {
                window.APP.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const ctx = window.APP.audioContext;
            const now = ctx.currentTime;
            
            // Subtle parameter variation for naturalness and reduced habituation
            // Random pitch transposition: ±2 semitones (multiply by 2^(semitones/12))
            const pitchVariation = (Math.random() * SUCCESS_SOUND_PITCH_VARIATION * 2) - SUCCESS_SOUND_PITCH_VARIATION;
            const pitchMultiplier = Math.pow(2, pitchVariation / 12);
            
            // Random timing variation: ±15ms
            const timingVariation = (Math.random() * SUCCESS_SOUND_TIMING_VARIATION * 2) - SUCCESS_SOUND_TIMING_VARIATION;
            const actualDuration = SUCCESS_SOUND_DURATION + timingVariation;
            
            // Occasionally switch waveform for variety (80% sine, 20% triangle)
            const waveType = Math.random() < 0.8 ? 'sine' : 'triangle';
            
            // Create two-note arpeggio (root and major third)
            // Two oscillators for richer, more pleasant sound
            
            // First note (root) - starts immediately
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = waveType;
            osc1.frequency.value = SUCCESS_SOUND_BASE_FREQUENCY * pitchMultiplier;
            osc1.detune.value = SUCCESS_SOUND_DETUNE_AMOUNT; // Slight detuning for richness
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            
            // ADSR Envelope for first note
            gain1.gain.setValueAtTime(0, now);
            // Attack
            gain1.gain.linearRampToValueAtTime(SUCCESS_SOUND_VOLUME, now + SUCCESS_SOUND_ATTACK);
            // Decay to sustain
            gain1.gain.linearRampToValueAtTime(
                SUCCESS_SOUND_VOLUME * SUCCESS_SOUND_SUSTAIN, 
                now + SUCCESS_SOUND_ATTACK + SUCCESS_SOUND_DECAY
            );
            // Release to zero
            gain1.gain.linearRampToValueAtTime(
                0.001, 
                now + actualDuration
            );
            
            // Second note (major third) - starts slightly after first for arpeggio effect
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = waveType;
            osc2.frequency.value = SUCCESS_SOUND_BASE_FREQUENCY * SUCCESS_SOUND_INTERVAL_RATIO * pitchMultiplier;
            osc2.detune.value = -SUCCESS_SOUND_DETUNE_AMOUNT; // Opposite detuning for stereo richness
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            
            const arpeggioDelay = 0.08; // 80ms delay for pleasant arpeggio
            
            // ADSR Envelope for second note
            gain2.gain.setValueAtTime(0, now + arpeggioDelay);
            // Attack
            gain2.gain.linearRampToValueAtTime(
                SUCCESS_SOUND_VOLUME * 0.85, // Slightly quieter than root
                now + arpeggioDelay + SUCCESS_SOUND_ATTACK
            );
            // Decay to sustain
            gain2.gain.linearRampToValueAtTime(
                SUCCESS_SOUND_VOLUME * SUCCESS_SOUND_SUSTAIN * 0.85,
                now + arpeggioDelay + SUCCESS_SOUND_ATTACK + SUCCESS_SOUND_DECAY
            );
            // Release to zero
            gain2.gain.linearRampToValueAtTime(
                0.001,
                now + arpeggioDelay + actualDuration
            );
            
            // Start and stop oscillators
            osc1.start(now);
            osc1.stop(now + actualDuration + 0.1); // Extra time for release
            
            osc2.start(now + arpeggioDelay);
            osc2.stop(now + arpeggioDelay + actualDuration + 0.1);
            
        } catch (e) {
            // Silent fail if audio not supported
        }
    }
};
