// Functions Question Templates
// Level 14-15
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.Functions = {
    getRationalFunctionQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 7);
        
        if (questionType === 1) {
            // Find vertical asymptote of f(x) = (ax+b)/(cx+d)
            const a = utils.rInt(1, 5);
            const b = utils.rInt(-8, 8);
            const c = utils.rInt(1, 4);
            let d = utils.rInt(-8, 8);
            if (d === 0) {
                d = 3;
            }
            const asymptote = -d / c;
            
            const correctAnswer = `x = ${asymptote}`;
            const candidateDistractors = [
                `x = ${-asymptote}`,  // Wrong sign
                `y = ${asymptote}`,  // Wrong variable
                `x = ${-b/a}`  // Used numerator instead
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `x = ${utils.rInt(-10, 10)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`f(x) = \\frac{${a}x ${b >= 0 ? '+' : ''}${b}}{${c}x ${d >= 0 ? '+' : ''}${d}}`),
                instruction: "Find the vertical asymptote",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Vertical asymptotes occur where the denominator equals zero. Set ${c}x ${d >= 0 ? '+' : ''}${d} = 0. Solving: ${c}x = ${-d}, so x = ${asymptote}. The function is undefined at x = ${asymptote}, creating a vertical asymptote.`,
                calc: false
            };
        } else if (questionType === 2) {
            // Find horizontal asymptote of f(x) = (ax+b)/(cx+d)
            const a = utils.rInt(2, 6);
            const b = utils.rInt(-8, 8);
            const c = utils.rInt(2, 5);
            const d = utils.rInt(-8, 8);
            const asymptote = a / c;
            
            const correctAnswer = `y = ${asymptote}`;
            const candidateDistractors = [
                `y = ${b/d}`,  // Used constants instead
                `y = 0`,  // Wrong asymptote
                `x = ${asymptote}`  // Wrong variable
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `y = ${utils.rInt(-5, 5)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`f(x) = \\frac{${a}x ${b >= 0 ? '+' : ''}${b}}{${c}x ${d >= 0 ? '+' : ''}${d}}`),
                instruction: "Find the horizontal asymptote",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `For rational functions where numerator and denominator have the same degree, the horizontal asymptote is y = (leading coefficient of numerator)/(leading coefficient of denominator) = ${a}/${c} = ${asymptote}.`,
                calc: false
            };
        } else if (questionType === 3) {
            // Simplify rational expression (cancel common factors)
            const factor = utils.rInt(2, 6);
            let root = utils.rInt(-5, 5);
            if (root === 0) {
                root = 2;
            }
            // (x² - root²)/(x - root) = (x+root)(x-root)/(x-root) = x+root
            const rootSquared = root * root;
            const correctAnswer = `x ${root >= 0 ? '+' : ''}${root}`;
            const candidateDistractors = [
                `x ${-root >= 0 ? '+' : ''}${-root}`,  // Wrong sign
                `x^2 ${-rootSquared >= 0 ? '+' : ''}${-rootSquared}`,  // Didn't simplify
                `${2*root}`  // Used constant only
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `x ${utils.rInt(-10, 10) >= 0 ? '+' : ''}${utils.rInt(-10, 10)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\frac{x^2 ${-rootSquared >= 0 ? '+' : ''}${-rootSquared}}{x ${-root >= 0 ? '+' : ''}${-root}}`),
                instruction: utils.toUnicodePlainText(`Simplify (for x ≠ ${root})`),
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Factor the numerator: x² ${-rootSquared >= 0 ? '+' : ''}${-rootSquared} = (x ${root >= 0 ? '+' : ''}${root})(x ${-root >= 0 ? '+' : ''}${-root}). Cancel the common factor (x ${-root >= 0 ? '+' : ''}${-root}): result is x ${root >= 0 ? '+' : ''}${root} for x ≠ ${root}.`,
                calc: false
            };
        } else if (questionType === 4) {
            // Domain of rational function
            const c = utils.rInt(1, 4);
            let d = utils.rInt(-8, 8);
            if (d === 0) {
                d = 4;
            }
            const restriction = -d / c;
            
            const correctAnswer = utils.toUnicodePlainText(`x ≠ ${restriction}`);
            const candidateDistractors = [
                utils.toUnicodePlainText(`x ≠ ${-restriction}`),  // Wrong sign
                utils.toUnicodePlainText(`x ≠ 0`),  // Wrong value
                utils.toUnicodePlainText(`All real numbers`)  // No restriction
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => utils.toUnicodePlainText(`x ≠ ${utils.rInt(-10, 10)}`)
            );
            
            return {
                tex: utils.toUnicodeFunction(`f(x) = \\frac{1}{${c}x ${d >= 0 ? '+' : ''}${d}}`),
                instruction: "Find the domain restriction",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `The domain excludes values where the denominator is zero. Set ${c}x ${d >= 0 ? '+' : ''}${d} = 0. Solving: x = ${restriction}. Domain: all real numbers except x = ${restriction}.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Evaluate rational function at a point
            const a = utils.rInt(1, 4);
            const b = utils.rInt(-5, 5);
            const c = utils.rInt(1, 3);
            const d = utils.rInt(-5, 5);
            let x = utils.rInt(1, 5);
            // Ensure denominator isn't zero
            if (c * x + d === 0) {
                x = x + 2;
            }
            const numerator = a * x + b;
            const denominator = c * x + d;
            
            // Try to simplify the fraction
            const gcd = utils.gcd(Math.abs(numerator), Math.abs(denominator));
            const simplifiedNum = numerator / gcd;
            const simplifiedDen = denominator / gcd;
            
            const correctAnswer = simplifiedDen === 1 ? `${simplifiedNum}` : `\\frac{${simplifiedNum}}{${simplifiedDen}}`;
            const candidateDistractors = [
                `\\frac{${numerator}}{${denominator + 1}}`,  // Wrong denominator
                `\\frac{${numerator + a}}{${denominator}}`,  // Wrong numerator
                `${numerator + denominator}`  // Added instead of divided
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `\\frac{${utils.rInt(1, 20)}}{${utils.rInt(1, 10)}}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`f(x) = \\frac{${a}x ${b >= 0 ? '+' : ''}${b}}{${c}x ${d >= 0 ? '+' : ''}${d}} \\\\[0.5em] f(${x}) = ?`),
                instruction: "Evaluate",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Substitute x = ${x}: f(${x}) = (${a}·${x} ${b >= 0 ? '+' : ''}${b})/(${c}·${x} ${d >= 0 ? '+' : ''}${d}) = ${numerator}/${denominator}${gcd > 1 ? ` = ${simplifiedNum}/${simplifiedDen}` : ''}.`,
                calc: false
            };
        } else if (questionType === 6) {
            // Hole vs asymptote
            const root = utils.rInt(2, 6);
            let otherRoot = utils.rInt(-5, 5);
            if (otherRoot === root || otherRoot === 0) {
                otherRoot = root + 3;
            }
            
            const correctAnswer = `Hole at x = ${root}`;
            const candidateDistractors = [
                `Vertical asymptote at x = ${root}`,  // Confused hole with asymptote
                `Hole at x = ${otherRoot}`,  // Wrong location
                `No holes or asymptotes`  // Missed it
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `Hole at x = ${utils.rInt(-8, 8)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`f(x) = \\frac{(x - ${root})(x - ${otherRoot})}{x - ${root}}`),
                instruction: "What feature occurs at x = " + root + "?",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Since (x - ${root}) cancels from numerator and denominator, there is a hole (removable discontinuity) at x = ${root}, not a vertical asymptote. The simplified function is f(x) = x - ${otherRoot} for x ≠ ${root}.`,
                calc: false
            };
        } else {
            // Horizontal asymptote when degrees differ
            const a = utils.rInt(1, 5);
            const b = utils.rInt(-8, 8);
            
            const correctAnswer = `y = 0`;
            const candidateDistractors = [
                `y = ${a}`,  // Used coefficient
                `No horizontal asymptote`,  // Wrong
                `y = ${b}`  // Used constant
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `y = ${utils.rInt(-5, 5)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`f(x) = \\frac{${a}x ${b >= 0 ? '+' : ''}${b}}{x^2 + 1}`),
                instruction: "Find the horizontal asymptote",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `When the degree of the denominator (2) is greater than the degree of the numerator (1), the horizontal asymptote is y = 0. As x → ±∞, the function approaches zero.`,
                calc: false
            };
        }
    },
    
    getGraphTransformationQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.rInt(1, 8);
        
        if (questionType === 1) {
            // Vertical translation: f(x) + k
            const k = utils.rInt(1, 6);
            const sign = utils.rInt(0, 1) === 0 ? 1 : -1;
            const shift = k * sign;
            
            const correctAnswer = shift >= 0 ? `Shift up ${shift} units` : `Shift down ${-shift} units`;
            const candidateDistractors = [
                shift >= 0 ? `Shift down ${shift} units` : `Shift up ${-shift} units`,  // Wrong direction
                shift >= 0 ? `Shift right ${shift} units` : `Shift left ${-shift} units`,  // Wrong axis
                `No transformation`  // Missed it
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `Shift ${utils.rInt(0, 1) === 0 ? 'up' : 'down'} ${utils.rInt(1, 10)} units`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } g(x) = f(x) ${shift >= 0 ? '+' : ''}${shift}\\\\[0.5em]\\text{how is g(x) related to f(x)?}`),
                instruction: "Describe the transformation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Adding ${shift} to f(x) translates the graph vertically ${shift >= 0 ? 'upward' : 'downward'} by ${Math.abs(shift)} units. Every point (x, y) on f(x) moves to (x, y ${shift >= 0 ? '+' : ''}${shift}).`,
                calc: false
            };
        } else if (questionType === 2) {
            // Horizontal translation: f(x - h)
            const h = utils.rInt(1, 5);
            const sign = utils.rInt(0, 1) === 0 ? 1 : -1;
            const shift = h * sign;
            
            const correctAnswer = shift >= 0 ? `Shift right ${shift} units` : `Shift left ${-shift} units`;
            const candidateDistractors = [
                shift >= 0 ? `Shift left ${shift} units` : `Shift right ${-shift} units`,  // Wrong direction
                shift >= 0 ? `Shift up ${shift} units` : `Shift down ${-shift} units`,  // Wrong axis
                `No transformation`  // Missed it
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `Shift ${utils.rInt(0, 1) === 0 ? 'right' : 'left'} ${utils.rInt(1, 10)} units`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } g(x) = f(x ${shift >= 0 ? '-' : '+'}${Math.abs(shift)})\\\\[0.5em]\\text{how is g(x) related to f(x)?}`),
                instruction: "Describe the transformation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `f(x ${shift >= 0 ? '-' : '+'}${Math.abs(shift)}) translates the graph horizontally ${shift >= 0 ? 'right' : 'left'} by ${Math.abs(shift)} units. Note: x - h shifts right by h, x + h shifts left by h. Every point (x, y) moves to (x ${shift >= 0 ? '+' : ''}${shift}, y).`,
                calc: false
            };
        } else if (questionType === 3) {
            // Vertical stretch: a·f(x)
            const a = utils.rInt(2, 5);
            
            const correctAnswer = `Vertical stretch by factor ${a}`;
            const candidateDistractors = [
                `Horizontal stretch by factor ${a}`,  // Wrong axis
                `Vertical compression by factor ${a}`,  // Wrong type
                `Shift up ${a} units`  // Confused stretch with translation
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `Vertical ${utils.rInt(0, 1) === 0 ? 'stretch' : 'compression'} by factor ${utils.rInt(2, 8)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } g(x) = ${a}f(x)\\\\[0.5em]\\text{how is g(x) related to f(x)?}`),
                instruction: "Describe the transformation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Multiplying f(x) by ${a} stretches the graph vertically by a factor of ${a}. All y-values are multiplied by ${a}, while x-values remain unchanged. Point (x, y) becomes (x, ${a}y).`,
                calc: false
            };
        } else if (questionType === 4) {
            // Reflection in x-axis: -f(x)
            const correctAnswer = `Reflection in the x-axis`;
            const candidateDistractors = [
                `Reflection in the y-axis`,  // Wrong axis
                `Rotation 180°`,  // Different transformation
                `Vertical stretch by -1`  // Technically correct but not best description
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `Reflection in the ${utils.rInt(0, 1) === 0 ? 'x' : 'y'}-axis`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } g(x) = -f(x)\\\\[0.5em]\\text{how is g(x) related to f(x)?}`),
                instruction: "Describe the transformation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Multiplying f(x) by -1 reflects the graph in the x-axis. All y-values change sign. Point (x, y) becomes (x, -y). The graph is flipped upside down.`,
                calc: false
            };
        } else if (questionType === 5) {
            // Combined transformation: f(x-h) + k
            const h = utils.rInt(1, 4);
            const k = utils.rInt(1, 4);
            
            const correctAnswer = `Right ${h}, up ${k}`;
            const candidateDistractors = [
                `Left ${h}, down ${k}`,  // Opposite directions
                `Right ${k}, up ${h}`,  // Swapped values
                `Right ${h}, down ${k}`  // Wrong vertical direction
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.rInt(0, 1) === 0 ? 'Right' : 'Left'} ${utils.rInt(1, 5)}, ${utils.rInt(0, 1) === 0 ? 'up' : 'down'} ${utils.rInt(1, 5)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Transform } f(x) = x^2\\\\[0.5em]\\text{to get } g(x) = (x-${h})^2 + ${k}`),
                instruction: "Describe the transformation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `(x-${h})² shifts right ${h} units, then +${k} shifts up ${k} units. Apply horizontal shift first, then vertical. The vertex of x² at (0,0) moves to (${h}, ${k}).`,
                calc: false
            };
        } else if (questionType === 6) {
            // Given transformation, find equation
            const h = utils.rInt(1, 4);
            const k = utils.rInt(1, 4);
            
            const correctAnswer = `(x - ${h})^2 + ${k}`;
            const candidateDistractors = [
                `(x + ${h})^2 + ${k}`,  // Wrong sign on h
                `(x - ${h})^2 - ${k}`,  // Wrong sign on k
                `x^2 - ${h}x + ${k}`  // Not in transformed form
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `(x ${utils.rInt(0, 1) === 0 ? '-' : '+'} ${utils.rInt(1, 5)})^2 ${utils.rInt(0, 1) === 0 ? '+' : '-'} ${utils.rInt(1, 5)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{Given } f(x) = x^2\\\\[0.5em]\\text{Shift right ${h} and up ${k}}\\\\[0.5em]\\text{What is the new equation?}`),
                instruction: "Find g(x)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `To shift right ${h}: replace x with (x-${h}). To shift up ${k}: add ${k}. Result: g(x) = (x-${h})² + ${k}.`,
                calc: false
            };
        } else if (questionType === 7) {
            // Reflection in y-axis: f(-x)
            const correctAnswer = `Reflection in the y-axis`;
            const candidateDistractors = [
                `Reflection in the x-axis`,  // Wrong axis
                `Rotation 180°`,  // Different
                `Horizontal compression`  // Wrong type
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `Reflection in the ${utils.rInt(0, 1) === 0 ? 'x' : 'y'}-axis`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } g(x) = f(-x)\\\\[0.5em]\\text{how is g(x) related to f(x)?}`),
                instruction: "Describe the transformation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Replacing x with -x reflects the graph in the y-axis. All x-values change sign. Point (x, y) becomes (-x, y). The graph is flipped left to right.`,
                calc: false
            };
        } else {
            // Horizontal stretch: f(x/b)
            const b = utils.rInt(2, 4);
            
            const correctAnswer = `Horizontal stretch by factor ${b}`;
            const candidateDistractors = [
                `Vertical stretch by factor ${b}`,  // Wrong axis
                `Horizontal compression by factor ${b}`,  // Wrong type
                `Shift right ${b} units`  // Confused stretch with translation
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `Horizontal ${utils.rInt(0, 1) === 0 ? 'stretch' : 'compression'} by factor ${utils.rInt(2, 6)}`
            );
            
            return {
                tex: utils.toUnicodeFunction(`\\text{If } g(x) = f(\\frac{x}{${b}})\\\\[0.5em]\\text{how is g(x) related to f(x)?}`),
                instruction: "Describe the transformation",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Replacing x with x/${b} stretches the graph horizontally by a factor of ${b}. All x-coordinates are multiplied by ${b}, while y-values remain unchanged. Point (x, y) becomes (${b}x, y).`,
                calc: false
            };
        }
    },
    
    getFunctionProblems: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 3);
                
                if (questionType === 1) {
                    // Function evaluation: f(x) = ax + b, find f(n)
                    const a = utils.rInt(2, 8);
                    const b = utils.rInt(1, 10);
                    const x = utils.rInt(1, 8);
                    const answer = a * x + b;
                    const correctAnswer = `${answer}`;
                    const candidateDistractors = [`${a * x}`, `${answer + a}`, `${answer - b}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 100)}`
                    );
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = ${a}x + ${b} \\\\[0.5em] f(${x}) = ?`),
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: utils.toUnicodeFunction(`Substitute x = ${x} into the function: f(${x}) = ${a}(${x}) + ${b} = ${a * x} + ${b} = ${answer}.`),
                        calc: false
                    };
                } else if (questionType === 2) {
                    // Composite function: f(x) = 2x, g(x) = x + 3, find f(g(2))
                    const x = utils.rInt(1, 5);
                    const gResult = x + 3;
                    const fResult = 2 * gResult;
                    const correctAnswer = `${fResult}`;
                    const candidateDistractors = [`${fResult + 2}`, `${gResult}`, `${x * 2 + 3}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(5, 30)}`
                    );
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = 2x \\\\[0.5em] g(x) = x + 3 \\\\[0.5em] f(g(${x})) = ?`),
                        instruction: "Calculate",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: utils.toUnicodeFunction(`Evaluate g(${x}) first: g(${x}) = ${x} + 3 = ${gResult}. Then evaluate f(${gResult}): f(${gResult}) = 2(${gResult}) = ${fResult}.`),
                        calc: false
                    };
                } else {
                    // Inverse: if f(x) = 3x - 2 and f(a) = 10, find a
                    const m = utils.rInt(2, 5);
                    const c = utils.rInt(1, 8);
                    const result = utils.rInt(10, 30);
                    const x = utils.roundToClean((result + c) / m);
                    // Ensure integer result
                    if (x !== Math.floor(x)) {
                        // Recalculate with values that work
                        const xInt = utils.rInt(3, 8);
                        const resultInt = m * xInt - c;
                        const correctAnswer = `${xInt}`;
                        const candidateDistractors = [`${xInt + 1}`, `${xInt - 1}`, `${resultInt}`];
                        const distractors = utils.ensureUniqueDistractors(
                            correctAnswer,
                            candidateDistractors,
                            () => `${utils.rInt(1, 20)}`
                        );
                        return {
                            tex: utils.toUnicodeFunction(`f(x) = ${m}x - ${c} \\\\[0.5em] f(a) = ${resultInt} \\\\[0.5em] a = ?`),
                            instruction: "Find the input value",
                            displayAnswer: correctAnswer,
                            distractors: distractors,
                            explanation: `Given ${m}a - ${c} = ${resultInt}. Add ${c} to both sides: ${m}a = ${resultInt + c}. Divide by ${m}: a = ${xInt}.`,
                            calc: false
                        };
                    }
                    const correctAnswer = `${x}`;
                    const candidateDistractors = [`${x + 1}`, `${x - 1}`, `${result}`];
                    const distractors = utils.ensureUniqueDistractors(
                        correctAnswer,
                        candidateDistractors,
                        () => `${utils.rInt(1, 20)}`
                    );
                    return {
                        tex: utils.toUnicodeFunction(`f(x) = ${m}x - ${c} \\\\[0.5em] f(a) = ${result} \\\\[0.5em] a = ?`),
                        instruction: "Find the input value",
                        displayAnswer: correctAnswer,
                        distractors: distractors,
                        explanation: `Given ${m}a - ${c} = ${result}. Add ${c} to both sides: ${m}a = ${result + c}. Divide by ${m}: a = ${x}.`,
                        calc: false
                    };
                }
    }
};
