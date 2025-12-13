window.APP = {
    level: 5.0, 
    streak: 0,
    mode: 'calibration',
    history: [],
    
    // Calibration State
    cMin: 0, cMax: 10,
    
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
        }
        
        // Update and Animate Level
        this.applyLevelChange(delta);
        
        document.getElementById('next-btn').classList.remove('hidden');
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
    }
};

window.onload = () => {
    window.APP.init();
    window.DebugCheatCode.init();
};
