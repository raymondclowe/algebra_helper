// Trigonometry Diagram Generator
// Generates visual triangle problems for Level 15-16 (basic) and 16-17 (advanced)
// Supports both calculator and non-calculator modes

window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.TrigDiagramGenerator = {
    // Constants
    EPSILON: 0.0001,
    MIN_TRIANGLE_DIMENSION: 50,
    
    // Math Helpers
    radToDeg: (rad) => rad * (180 / Math.PI),
    degToRad: (deg) => deg * (Math.PI / 180),
    
    // Round to 3 significant figures for calculator mode
    toSigFig: function(num) {
        if (num === 0) return 0;
        // If it's effectively an integer, return integer
        if (Math.abs(num - Math.round(num)) < this.EPSILON) return Math.round(num);
        return parseFloat(Number(num).toPrecision(3));
    },
    
    // SVG Creation Helper
    createSvgElement: function(type, attr) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", type);
        for (let key in attr) el.setAttribute(key, attr[key]);
        return el;
    },
    
    // CALCULATOR MODE: Random numbers, messy decimals
    generateCalcProblem: function() {
        const utils = window.GeneratorUtils;
        
        // 30% Right Angle, 70% Sine/Cosine Rule
        if (Math.random() < 0.3) {
            // SOH CAH TOA
            const angleA = utils.rInt(20, 70);
            const sideC = utils.rInt(10, 50); // Hypotenuse
            const sideA = sideC * Math.sin(this.degToRad(angleA));
            const sideB = sideC * Math.cos(this.degToRad(angleA));
            
            // 0=FindOpp, 1=FindAdj, 2=FindHyp, 3=FindAngle
            const type = utils.rInt(0, 3);
            
            const problemTypes = [
                { find: 'opp', known: ['angle', 'hyp'], correct: sideA },
                { find: 'adj', known: ['angle', 'hyp'], correct: sideB },
                { find: 'hyp', known: ['angle', 'adj'], correct: sideC },
                { find: 'angle', known: ['opp', 'adj'], correct: angleA }
            ];
            const problem = problemTypes[type];
            
            let q = { 
                type: 'right', 
                angle: angleA, 
                sides: {opp: sideA, adj: sideB, hyp: sideC}, 
                known: problem.known, 
                find: problem.find,
                question: problem.find === 'angle' ? "Find θ" : "Find x",
                correct: problem.correct
            };
            
            return q;
        } else {
            // Sine / Cosine Rule (Scalene Triangle)
            const A = utils.rInt(30, 80);
            const b = utils.rInt(20, 60);
            const c = utils.rInt(20, 60);
            const a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(this.degToRad(A))); // Cosine Rule
            
            // Calculate angle B for display
            const sinB = (b * Math.sin(this.degToRad(A))) / a;
            const B = this.radToDeg(Math.asin(sinB));
            const C = 180 - A - B;

            if (Math.random() > 0.5) {
                // Cosine Rule: Find side a
                return {
                    type: 'scalene',
                    question: "Find side x",
                    display: { angleA: A, sideB: b, sideC: c, sideA: 'x' },
                    angles: [A, B, C],
                    sides: [a, b, c],
                    correct: a
                };
            } else {
                // Sine Rule: Find side b given A, a, B
                return {
                    type: 'scalene',
                    question: "Find side x",
                    display: { angleA: A, sideA: a, angleB: B, sideB: 'x' },
                    angles: [A, B, C],
                    sides: [a, b, c],
                    correct: b
                };
            }
        }
    },
    
    // NON-CALCULATOR MODE: Clean integers, special triangles
    generateNonCalcProblem: function() {
        const utils = window.GeneratorUtils;
        
        // 50% Pythagorean Triples, 50% Special Angles
        if (Math.random() < 0.5) {
            // Pythagorean Triples (Sides only)
            const triples = [[3,4,5], [5,12,13], [8,15,17]];
            const base = triples[utils.rInt(0, triples.length-1)];
            const scale = utils.rInt(1, 4);
            
            const opp = base[0] * scale;
            const adj = base[1] * scale;
            const hyp = base[2] * scale;

            const subType = utils.rInt(0, 1);
            
            let q = { 
                type: 'right', 
                angle: this.radToDeg(Math.atan(opp/adj)), 
                sides: {opp: opp, adj: adj, hyp: hyp}, 
                known: [], 
                find: '' 
            };

            if (subType === 0) {
                q.question = "Find side x";
                q.find = 'hyp';
                q.known = ['opp', 'adj'];
                q.correct = hyp;
            } else {
                q.question = "Find side x";
                q.find = 'opp';
                q.known = ['hyp', 'adj'];
                q.correct = opp;
            }
            return q;

        } else {
            // Special Angles (30, 45, 60) with integer answers
            const setIdx = utils.rInt(1, 4);
            const k = utils.rInt(2, 12);

            let q = { type: 'right', known: [], find: '', sides: {} };

            if (setIdx === 1) { // 30 deg, find Opp
                q.angle = 30;
                q.sides = { hyp: 2*k, opp: k, adj: Math.sqrt(3)*k };
                q.find = 'opp';
                q.known = ['angle', 'hyp'];
                q.question = "Find side x";
                q.correct = k;
            }
            else if (setIdx === 2) { // 60 deg, find Adj
                q.angle = 60;
                q.sides = { hyp: 2*k, adj: k, opp: Math.sqrt(3)*k };
                q.find = 'adj';
                q.known = ['angle', 'hyp'];
                q.question = "Find side x";
                q.correct = k;
            }
            else if (setIdx === 3) { // 45 deg, find Adj given Opp
                q.angle = 45;
                q.sides = { opp: k, adj: k, hyp: Math.sqrt(2)*k };
                q.find = 'adj';
                q.known = ['angle', 'opp'];
                q.question = "Find side x";
                q.correct = k;
            } 
            else { // Find Angle
                const angleAns = [30, 45, 60][utils.rInt(0,2)];
                q.angle = angleAns;
                q.correct = angleAns;
                q.find = 'angle';
                q.question = "Find angle θ";
                
                if (angleAns === 30) {
                    q.sides = { opp: k, hyp: 2*k };
                    q.known = ['opp', 'hyp'];
                } else if (angleAns === 60) {
                    q.sides = { adj: k, hyp: 2*k };
                    q.known = ['adj', 'hyp'];
                } else { // 45
                    q.sides = { opp: k, adj: k };
                    q.known = ['opp', 'adj'];
                }
            }
            return q;
        }
    },
    
    // Draw triangle diagram as SVG
    drawProblem: function(qData, isCalc) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 400 300");
        svg.setAttribute("class", "w-full h-auto max-h-[300px] mx-auto border-2 border-gray-600 rounded bg-gray-700");
        
        // Text Helper
        const addText = (x, y, txt) => {
            const t = this.createSvgElement("text", {
                x: x, 
                y: y, 
                "text-anchor": "middle", 
                "dominant-baseline": "middle",
                "fill": "#e5e7eb",
                "font-size": "14",
                "font-family": "sans-serif"
            });
            t.textContent = txt;
            svg.appendChild(t);
        };

        if (qData.type === 'right') {
            // Right Triangle Drawing
            const scale = 150;
            const rad = this.degToRad(qData.angle);
            
            let w = scale * Math.cos(rad);
            let h = scale * Math.sin(rad);
            
            if (w < this.MIN_TRIANGLE_DIMENSION) w = this.MIN_TRIANGLE_DIMENSION; 
            if (h < this.MIN_TRIANGLE_DIMENSION) h = this.MIN_TRIANGLE_DIMENSION; 
            
            const x0 = 100, y0 = 250;

            const pCorner = {x: x0, y: y0}; 
            const pTop = {x: x0, y: y0 - h};
            const pAngle = {x: x0 + w, y: y0};

            // Draw Triangle
            const poly = this.createSvgElement("polygon", {
                points: `${pCorner.x},${pCorner.y} ${pTop.x},${pTop.y} ${pAngle.x},${pAngle.y}`,
                style: "fill:none;stroke:#e5e7eb;stroke-width:3"
            });
            svg.appendChild(poly);

            // Draw Angle Arc
            if (qData.find === 'angle' || qData.known.includes('angle')) {
                const arcR = 30;
                const endX = pAngle.x - arcR;
                const endY = pAngle.y;
                const path = this.createSvgElement("path", {
                    d: `M ${endX} ${endY} A ${arcR} ${arcR} 0 0 1 ${pAngle.x - arcR*0.8} ${pAngle.y - arcR*0.5}`,
                    style: "fill:none; stroke:#ef4444; stroke-width:2"
                });
                svg.appendChild(path);
                
                const lbl = (qData.find === 'angle') ? "θ" : this.toSigFig(qData.angle) + "°";
                addText(pAngle.x - 45, pAngle.y - 10, lbl);
            }

            // Draw Right Angle Box
            svg.appendChild(this.createSvgElement("path", {
                d: `M ${x0} ${y0-15} L ${x0+15} ${y0-15} L ${x0+15} ${y0}`,
                style: "fill:none;stroke:#e5e7eb;stroke-width:1"
            }));

            // Label Sides
            const txtHyp = qData.find === 'hyp' ? "x" : (qData.known.includes('hyp') ? this.toSigFig(qData.sides.hyp) : "");
            if (txtHyp) addText((pTop.x+pAngle.x)/2 + 10, (pTop.y+pAngle.y)/2 - 10, txtHyp);

            const txtOpp = qData.find === 'opp' ? "x" : (qData.known.includes('opp') ? this.toSigFig(qData.sides.opp) : "");
            if (txtOpp) addText(x0 - 15, y0 - h/2, txtOpp);

            const txtAdj = qData.find === 'adj' ? "x" : (qData.known.includes('adj') ? this.toSigFig(qData.sides.adj) : "");
            if (txtAdj) addText(x0 + w/2, y0 + 20, txtAdj);

        } else if (qData.type === 'scalene') {
            // Scalene Triangle Drawing
            const angA = qData.angles[0];
            const sideB = qData.sides[1]; 
            const sideC = qData.sides[2];
            
            const pA = {x: 50, y: 250};
            const scale = 180 / Math.max(sideB, sideC); 
            
            const pB = {x: pA.x + sideC*scale, y: pA.y};
            
            const radA = this.degToRad(angA);
            const pC = {
                x: pA.x + sideB*scale*Math.cos(radA),
                y: pA.y - sideB*scale*Math.sin(radA)
            };

            const poly = this.createSvgElement("polygon", {
                points: `${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y}`,
                style: "fill:none;stroke:#e5e7eb;stroke-width:3"
            });
            svg.appendChild(poly);

            // Labels
            if (qData.display.angleA) addText(pA.x + 20, pA.y - 10, this.toSigFig(qData.display.angleA) + "°");
            if (qData.display.angleB) addText(pB.x - 20, pB.y - 10, this.toSigFig(qData.display.angleB) + "°");
            
            if (qData.display.sideC) addText((pA.x+pB.x)/2, pA.y+20, qData.display.sideC === 'x' ? 'x' : this.toSigFig(qData.display.sideC));
            if (qData.display.sideB) addText((pA.x+pC.x)/2 - 15, (pA.y+pC.y)/2 - 5, qData.display.sideB === 'x' ? 'x' : this.toSigFig(qData.display.sideB));
            if (qData.display.sideA) addText((pB.x+pC.x)/2 + 15, (pB.y+pC.y)/2 - 5, qData.display.sideA === 'x' ? 'x' : this.toSigFig(qData.display.sideA));
        }
        
        return svg;
    },
    
    // Generate answer options for multiple choice
    generateOptions: function(qData, isCalc) {
        const utils = window.GeneratorUtils;
        let correct = parseFloat(qData.correct);
        let opts = new Set();
        
        opts.add(correct);

        while (opts.size < 4) {
            let fake;
            
            if (!isCalc) {
                // INTEGER logic for non-calculator
                if (qData.find === 'angle') {
                    const pool = [30, 45, 60, 90, 0];
                    fake = pool[utils.rInt(0, pool.length-1)];
                } else {
                    const offset = utils.rInt(-5, 5);
                    fake = correct + offset;
                }
            } else {
                // CALCULATOR logic with variations
                const variance = (Math.random() - 0.5) * correct * 0.5;
                fake = correct + variance;
            }

            // Format it
            if (isCalc) fake = parseFloat(this.toSigFig(fake));
            else fake = Math.round(fake);

            // Validity check
            if (fake > 0 && fake !== correct) {
                opts.add(fake);
            }
        }

        // Convert to array and shuffle using Fisher-Yates algorithm
        let arr = Array.from(opts);
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        
        // Format for display
        const suffix = (qData.find === 'angle' || qData.question.includes('angle')) ? "°" : "";
        return arr.map(val => `${val}${suffix}`);
    },
    
    // Main function to generate a diagram-based trigonometry question
    getTrigDiagramQuestion: function(isCalc) {
        let qData;
        if (isCalc) {
            qData = this.generateCalcProblem();
        } else {
            qData = this.generateNonCalcProblem();
        }
        
        // Format correct answer
        if (isCalc) qData.correct = this.toSigFig(qData.correct);
        else qData.correct = Math.round(qData.correct);
        
        // Generate SVG
        const svg = this.drawProblem(qData, isCalc);
        const svgString = new XMLSerializer().serializeToString(svg);
        
        // Generate distractors
        const options = this.generateOptions(qData, isCalc);
        const correctAnswer = options.find(opt => {
            const val = parseFloat(opt);
            const tolerance = 1e-9; // Use small epsilon for float comparison after toSigFig
            return Math.abs(val - qData.correct) < tolerance;
        });
        
        const distractors = options.filter(opt => opt !== correctAnswer);
        
        // Build explanation
        let explanation = "";
        if (qData.type === 'right') {
            if (qData.find === 'angle') {
                explanation = `Use inverse trig functions to find the angle. `;
            } else {
                explanation = `Use SOH CAH TOA (sine, cosine, tangent) to solve for the unknown side. `;
            }
        } else {
            explanation = `Use the sine rule or cosine rule to solve for the unknown value. `;
        }
        if (isCalc) {
            explanation += `Calculator mode: answer rounded to 3 significant figures.`;
        } else {
            explanation += `Non-calculator mode: answer should be exact.`;
        }
        
        return {
            tex: svgString, // SVG embedded as "tex" field for rendering
            instruction: qData.question,
            displayAnswer: correctAnswer,
            distractors: distractors,
            explanation: explanation,
            calc: isCalc,
            isDiagram: true // Flag to indicate this needs special SVG rendering
        };
    }
};
