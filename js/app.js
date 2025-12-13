// Gamification Constants
const AUTO_ADVANCE_DELAY_MS = 1500;     // Time before auto-advancing after correct answer
const CONFETTI_COUNT = 30;              // Number of confetti particles
const CONFETTI_DELAY_STEP_MS = 30;      // Delay between each confetti spawn
const SUCCESS_SOUND_FREQUENCY = 800;    // Hz for success beep
const SUCCESS_SOUND_VOLUME = 0.3;       // Volume (0-1)
const SUCCESS_SOUND_DURATION = 0.3;     // Seconds
const SUCCESS_SOUND_MIN_GAIN = 0.01;    // Minimum gain for exponential ramp
const FLOAT_ANIMATION_DELAY_MS = 50;    // Delay before starting float animation
const FLOAT_ANIMATION_DURATION_MS = 800; // Duration of float animation
const FLOAT_CLEANUP_DELAY_MS = 900;     // When to remove float element

window.APP = {
    level: 5.0, 
    streak: 0,
    mode: 'calibration',
    history: [],
    
    // Calibration State
    cMin: 0, cMax: 10,
    
    // Audio Context (reusable)
    audioContext: null,
    
    init: function() { 
        if (window.MathJax && window.MathJax.typesetPromise) this.nextQuestion();
        else setTimeout(() => this.init(), 100);
    },

    nextQuestion: function() {
        // UI Reset
        document.getElementById('explanation-box').classList.add('hidden');
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('mc-options').innerHTML = '';
        document.getElementById('delta-display').innerHTML = ''; // clear anim
        
        this.updateUI();

        // Generate Question
        this.currentQ = window.Generator.getQuestion(this.level);
        this.startTime = Date.now();

        // Render
        document.getElementById('instruction-text').innerText = this.currentQ.instruction;
        const qDiv = document.getElementById('question-math');
        qDiv.innerHTML = `\\[ ${this.currentQ.tex} \\]`;
        MathJax.typesetPromise([qDiv]);

        // Icon
        document.getElementById('calc-indicator').innerHTML = this.currentQ.calc 
            ? '<span class="text-2xl">📱</span><div class="text-[8px] text-green-500 font-bold">Calc</div>' 
            : '<span class="text-2xl text-red-500 relative">✏️</span><div class="text-[8px] text-red-500 font-bold">No Calc</div>';

        // Mode View
        document.getElementById('controls-calibration').classList.toggle('hidden', this.mode === 'drill');
        document.getElementById('controls-drill').classList.toggle('hidden', this.mode === 'calibration');
        
        if (this.mode === 'drill') this.setupDrillUI();
    },

    updateUI: function() {
        document.getElementById('level-display').innerText = this.level.toFixed(1);
        
        // Calibration Window Display
        const rangeDiv = document.getElementById('search-range');
        if (this.mode === 'calibration') {
            rangeDiv.classList.remove('hidden');
            rangeDiv.innerText = `Range: ${this.cMin.toFixed(1)} - ${this.cMax.toFixed(1)}`;
        } else {
            rangeDiv.classList.add('hidden');
        }
        
        // Show Turbo Fire if streak high
        const fire = document.getElementById('streak-indicator');
        if (this.streak >= 3) fire.classList.remove('hidden');
        else fire.classList.add('hidden');

        // Accuracy (Last 5 only for speed)
        const accEl = document.getElementById('accuracy-display');
        if (this.history.length > 0) {
            // Only take last 5
            const subset = this.history.slice(-5);
            const avg = Math.round((subset.reduce((a,b)=>a+b,0)/subset.length)*100);
            accEl.innerText = avg + "%";
            accEl.className = avg >= 80 ? "text-xl font-bold text-green-400" 
                            : avg < 50 ? "text-xl font-bold text-red-400" 
                            : "text-xl font-bold text-yellow-400";
        } else {
            accEl.innerText = "--%";
        }
    },

    // --- MOMENTUM LOGIC (DRILL) ---
    setupDrillUI: function() {
        const container = document.getElementById('mc-options');
        let opts = [
            { val: this.currentQ.displayAnswer, correct: true },
            { val: this.currentQ.distractors[0], correct: false },
            { val: this.currentQ.distractors[1], correct: false },
            { val: this.currentQ.distractors[2], correct: false }
        ].sort(() => Math.random() - 0.5);

        opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "p-4 bg-gray-700 hover:bg-gray-600 rounded text-lg border border-gray-600 transition flex items-center justify-center min-h-[60px]";
            if (window.DEBUG_MODE && opt.correct) btn.classList.add('debug-correct');
            btn.onclick = () => this.handleDrillAnswer(btn, opt.correct);
            btn.innerHTML = `\\( ${opt.val} \\)`;
            container.appendChild(btn);
        });
        MathJax.typesetPromise([container]);
    },

    handleDrillAnswer: function(btn, isCorrect) {
        // Disable all
        document.getElementById('mc-options').querySelectorAll('button').forEach(b => b.disabled=true);

        let delta = 0;

        if (isCorrect) {
            btn.className = "p-4 bg-green-600 rounded text-lg border border-green-400 flex items-center justify-center min-h-[60px]";
            this.history.push(1);
            
            // --- THE FIX: MOMENTUM LOGIC ---
            this.streak++;
            
            if (this.streak >= 3) delta = 0.5; // Acceleration
            else delta = 0.2; // Base movement
            
            // Gamification: Toast, Confetti, Points Animation
            this.showCorrectFeedback(delta);
            
            // Auto-advance after short delay (no Next button needed)
            setTimeout(() => {
                this.nextQuestion();
            }, AUTO_ADVANCE_DELAY_MS);

        } else {
            btn.className = "p-4 bg-red-600 rounded text-lg border border-red-400 flex items-center justify-center min-h-[60px]";
            this.history.push(0);
            
            // Frustration Breaker
            if (this.streak <= 0) delta = -0.8; // Second wrong answer drops hard
            else delta = -0.3; // First wrong answer drops distinct amount
            
            this.streak = 0; // Reset streak
            
            // Show Explanation
            const box = document.getElementById('explanation-box');
            box.classList.remove('hidden');
            document.getElementById('explanation-text').innerHTML = this.currentQ.explanation;
            MathJax.typesetPromise([box]);
            
            // Show Next button ONLY for wrong answers (correct answers auto-advance)
            document.getElementById('next-btn').classList.remove('hidden');
        }
        
        // Update and Animate Level (applies to both correct and wrong)
        this.applyLevelChange(delta);
    },

    applyLevelChange: function(delta) {
        // 1. Update data
        this.level = Math.max(1, Math.min(10, this.level + delta));
        
        // 2. Animate visually
        const deltaEl = document.getElementById('delta-display');
        deltaEl.innerText = (delta > 0 ? '+' : '') + delta.toFixed(1);
        deltaEl.className = delta > 0 
            ? "text-xl font-bold absolute left-16 top-0 float-up" 
            : "text-xl font-bold absolute left-16 top-0 float-down";
        
        // Update text instantly
        document.getElementById('level-display').innerText = this.level.toFixed(1);
    },

    // --- BINARY CHOP (CALIBRATION) ---
    handleCalibration: function(action) {
        const timeTaken = (Date.now() - this.startTime) / 1000;
        
        // Binary Logic
        if (action === 'pass') {
            if(timeTaken > 20) { 
                // Too slow - counts as Not Sure
                this.cMax = this.level;
            } else {
                this.cMin = this.level;
            }
        } else {
            // Fail or Doubt
            this.cMax = this.level;
        }

        // Check convergence
        if ((this.cMax - this.cMin) < 1.5) {
            // Ready to drill. Start slightly below found level.
            this.level = Math.max(1, this.cMin - 1.0); 
            this.mode = 'drill';
            // Visual update
            document.getElementById('mode-badge').innerText = "Drill Phase";
            document.getElementById('mode-badge').className = "px-3 py-1 bg-purple-900 text-purple-200 text-xs font-bold uppercase rounded-full tracking-wide";
        } else {
            // Next step in binary search
            const nextVal = (this.cMin + this.cMax) / 2;
            this.level = Math.round(nextVal * 2) / 2; // Step 0.5
        }
        this.nextQuestion();
    },
    
    // --- GAMIFICATION FEATURES ---
    showCorrectFeedback: function(delta) {
        // 1. Show Toast
        this.showToast();
        
        // 2. Trigger Confetti
        this.triggerConfetti();
        
        // 3. Float Points to Score
        this.floatPointsToScore(delta);
        
        // 4. Play Success Sound (optional)
        this.playSuccessSound();
    },
    
    showToast: function() {
        const toast = document.createElement('div');
        const messages = ['Correct! 🎉', 'Nice! ✨', 'Perfect! ⭐', 'Great! 🌟', 'Awesome! 🎯'];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        
        toast.className = 'toast bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl text-2xl font-bold';
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
        // Create a simple success sound using Web Audio API
        try {
            // Initialize audio context once
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = SUCCESS_SOUND_FREQUENCY;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(SUCCESS_SOUND_VOLUME, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(SUCCESS_SOUND_MIN_GAIN, this.audioContext.currentTime + SUCCESS_SOUND_DURATION);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + SUCCESS_SOUND_DURATION);
        } catch (e) {
            // Silent fail if audio not supported
        }
    }
};

window.onload = () => {
    window.APP.init();
    window.DebugCheatCode.init();
};
