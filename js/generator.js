// --- GENERATOR ---
window.Generator = {
    rInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    getQuestion: function(level) {
        const band = Math.round(level);
        if (band <= 2) return this.lvl1();
        if (band <= 4) return this.lvl2();
        if (band <= 6) return this.lvl3();
        if (band <= 8) return this.lvl4();
        return this.lvl5();
    },
    lvl1: function() {
        const a=this.rInt(2,9), x=this.rInt(2,9);
        return { tex: `${a}x = ${a*x}`, instruction: "Solve for x", displayAnswer:`x=${x}`, distractors:[`x=${x+1}`,`x=${a}`,`x=${x-1}`], explanation:`Divide by ${a}`, calc:false };
    },
    lvl2: function() {
        const a=this.rInt(2,9), b=this.rInt(2,9), x=this.rInt(2,9); 
        return { tex: `${a}x + ${b} = ${a*x+b}`, instruction: "Solve for x", displayAnswer:`x=${x}`, distractors:[`x=${x+1}`,`x=${-x}`,`x=${b}`], explanation:`Subtract ${b}, Divide by ${a}`, calc:false };
    },
    lvl3: function() {
        const a=this.rInt(2,5), b=this.rInt(2,8);
        return { tex: `${a}(x + ${b})`, instruction: "Expand", displayAnswer:`${a}x + ${a*b}`, distractors:[`${a}x+${b}`,`x+${a*b}`,`${a}x^2+${b}`], explanation:`Multiply ${a} by each inner term`, calc:false };
    },
    lvl4: function() {
        const a=this.rInt(1,5), b=this.rInt(2,6);
        return { tex: `x^2 + ${a+b}x + ${a*b}`, instruction: "Factorise", displayAnswer:`(x+${a})(x+${b})`, distractors:[`(x+${a+b})(x+${a*b})`, `x(x+${a+b})`, `(x-${a})(x-${b})`], explanation:`Find factors of ${a*b} adding to ${a+b}`, calc:false };
    },
    lvl5: function() {
        const a=this.rInt(2,5), n=this.rInt(2,4);
        return { tex: `f(x) = ${a}x^{${n}}`, instruction: "Find f'(x)", displayAnswer:`${a*n}x^{${n-1}}`, distractors:[`${a*n}x^{${n}}`,`${a}x^{${n-1}}`,`${n}x^{${a}}`], explanation:`Power rule: $nx^{n-1}$`, calc:false };
    }
};
