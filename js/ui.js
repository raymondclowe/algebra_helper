// UI Management Functions
window.UI = {
    nextQuestion: function() {
        // UI Reset
        document.getElementById('explanation-box').classList.add('hidden');
        document.getElementById('next-btn').classList.add('invisible');
        document.getElementById('mc-options').innerHTML = '';
        document.getElementById('delta-display').innerHTML = ''; // clear anim
        
        this.updateUI();

        // Generate Question
        window.APP.currentQ = window.Generator.getQuestion(window.APP.level);
        window.APP.startTime = Date.now();

        // Render
        document.getElementById('instruction-text').innerText = window.APP.currentQ.instruction;
        const qDiv = document.getElementById('question-math');
        qDiv.innerHTML = `\\[ ${window.APP.currentQ.tex} \\]`;
        MathJax.typesetPromise([qDiv]);

        // Icon
        document.getElementById('calc-indicator').innerHTML = window.APP.currentQ.calc 
            ? '<span class="text-2xl">📱</span><div class="text-[8px] text-green-500 font-bold">Calc</div>' 
            : '<span class="text-2xl text-red-500 relative">✏️</span><div class="text-[8px] text-red-500 font-bold">No Calc</div>';

        // Mode View (support both learning and drill for backward compatibility)
        const isLearningMode = window.APP.mode === 'learning' || window.APP.mode === 'drill';
        document.getElementById('controls-calibration').classList.toggle('hidden', isLearningMode);
        
        // Try to find learning controls, fallback to drill controls for backward compatibility
        const learningControls = document.getElementById('controls-learning');
        const drillControls = document.getElementById('controls-drill');
        if (learningControls) {
            learningControls.classList.toggle('hidden', window.APP.mode === 'calibration');
        }
        if (drillControls) {
            drillControls.classList.toggle('hidden', window.APP.mode === 'calibration');
        }
        
        if (isLearningMode) window.Learning.setupUI();
    },

    updateUI: function() {
        document.getElementById('level-display').innerText = window.APP.level.toFixed(1);
        
        // Calibration Window Display
        const rangeDiv = document.getElementById('search-range');
        if (window.APP.mode === 'calibration') {
            rangeDiv.classList.remove('hidden');
            rangeDiv.innerText = `Range: ${window.APP.cMin.toFixed(1)} - ${window.APP.cMax.toFixed(1)}`;
        } else {
            rangeDiv.classList.add('hidden');
        }
        
        // Show Turbo Fire if streak high (tooltip added in HTML)
        const fire = document.getElementById('streak-indicator');
        if (window.APP.streak >= 3) fire.classList.remove('hidden');
        else fire.classList.add('hidden');

        // Accuracy (Last 5 only for speed)
        const accEl = document.getElementById('accuracy-display');
        if (window.APP.history.length > 0) {
            // Only take last 5
            const subset = window.APP.history.slice(-5);
            const avg = Math.round((subset.reduce((a,b)=>a+b,0)/subset.length)*100);
            accEl.innerText = avg + "%";
            accEl.className = avg >= 80 ? "text-xl font-bold text-green-400" 
                            : avg < 50 ? "text-xl font-bold text-red-400" 
                            : "text-xl font-bold text-yellow-400";
        } else {
            accEl.innerText = "--%";
        }
    }
};
