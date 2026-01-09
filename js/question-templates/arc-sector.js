// Arc Length and Sector Area Question Templates
// Level 15-16: Circle geometry with radians and degrees
window.QuestionTemplates = window.QuestionTemplates || {};

window.QuestionTemplates.ArcSector = {
    getArcSectorQuestion: function() {
        const utils = window.GeneratorUtils;
        const questionType = utils.getQuestionType(1, 6);
        
        if (questionType === 1) {
            // Arc length in radians: L = rθ
            const radius = [3, 4, 5, 6, 8, 10][utils.rInt(0, 5)];
            const angleRadOptions = [
                { display: '\\frac{\\pi}{6}', value: Math.PI / 6 },
                { display: '\\frac{\\pi}{4}', value: Math.PI / 4 },
                { display: '\\frac{\\pi}{3}', value: Math.PI / 3 },
                { display: '\\frac{\\pi}{2}', value: Math.PI / 2 },
                { display: '\\frac{2\\pi}{3}', value: 2 * Math.PI / 3 },
                { display: '\\frac{3\\pi}{4}', value: 3 * Math.PI / 4 }
            ];
            const angle = angleRadOptions[utils.rInt(0, angleRadOptions.length - 1)];
            const arcLength = radius * angle.value;
            const arcLengthClean = utils.roundToClean(arcLength, 2);
            const correctAnswer = `${arcLengthClean}`;
            
            // Common mistakes: using degrees formula, forgetting radius, wrong formula
            const wrongDegrees = utils.roundToClean((angle.value * 180 / Math.PI) / 360 * 2 * Math.PI * radius, 2);
            const forgotRadius = utils.roundToClean(angle.value, 2);
            const wrongFormula = utils.roundToClean(0.5 * radius * radius * angle.value, 2);
            
            const candidateDistractors = [
                `${wrongDegrees}`,
                `${forgotRadius}`,
                `${wrongFormula}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.roundToClean(radius * Math.PI * utils.rInt(1, 8) / utils.rInt(2, 6), 2)}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Find the arc length of a circle with radius ${radius} cm and angle ${angle.display} radians.}`),
                instruction: "Use L = rθ (give answer to 2 d.p.)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use the arc length formula L = rθ where r is the radius and θ is the angle in radians. L = ${radius} × ${angle.display} = ${radius} × ${angle.value.toFixed(4)} = ${arcLengthClean} cm.`,
                calc: true
            };
        } else if (questionType === 2) {
            // Arc length in degrees: L = (θ/360) × 2πr
            const radius = [4, 5, 6, 8, 10, 12][utils.rInt(0, 5)];
            const angleDeg = [30, 45, 60, 90, 120, 135, 150][utils.rInt(0, 6)];
            const arcLength = (angleDeg / 360) * 2 * Math.PI * radius;
            const arcLengthClean = utils.roundToClean(arcLength, 2);
            const correctAnswer = `${arcLengthClean}`;
            
            // Common mistakes: using radians formula, using diameter, wrong fraction
            const wrongRadians = utils.roundToClean(radius * angleDeg, 2);
            const wrongDiameter = utils.roundToClean((angleDeg / 360) * 2 * Math.PI * radius * 2, 2);
            const wrongFraction = utils.roundToClean((angleDeg / 180) * Math.PI * radius, 2);
            
            const candidateDistractors = [
                `${wrongRadians}`,
                `${wrongDiameter}`,
                `${wrongFraction}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.roundToClean((utils.rInt(20, 180) / 360) * 2 * Math.PI * radius, 2)}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Find the arc length of a circle with radius ${radius} cm and angle ${angleDeg}°.}`),
                instruction: "Use L = (θ/360) × 2πr (give answer to 2 d.p.)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use the arc length formula L = (θ/360) × 2πr where θ is in degrees. L = (${angleDeg}/360) × 2π × ${radius} = ${(angleDeg / 360).toFixed(4)} × ${(2 * Math.PI * radius).toFixed(2)} = ${arcLengthClean} cm.`,
                calc: true
            };
        } else if (questionType === 3) {
            // Sector area in radians: A = (1/2)r²θ
            const radius = [4, 5, 6, 8, 10][utils.rInt(0, 4)];
            const angleRadOptions = [
                { display: '\\frac{\\pi}{6}', value: Math.PI / 6 },
                { display: '\\frac{\\pi}{4}', value: Math.PI / 4 },
                { display: '\\frac{\\pi}{3}', value: Math.PI / 3 },
                { display: '\\frac{\\pi}{2}', value: Math.PI / 2 },
                { display: '\\frac{2\\pi}{3}', value: 2 * Math.PI / 3 }
            ];
            const angle = angleRadOptions[utils.rInt(0, angleRadOptions.length - 1)];
            const sectorArea = 0.5 * radius * radius * angle.value;
            const sectorAreaClean = utils.roundToClean(sectorArea, 2);
            const correctAnswer = `${sectorAreaClean}`;
            
            // Common mistakes: using degrees formula, arc length formula, wrong factor
            const wrongDegrees = utils.roundToClean((angle.value * 180 / Math.PI) / 360 * Math.PI * radius * radius, 2);
            const arcLengthMistake = utils.roundToClean(radius * angle.value, 2);
            const wrongFactor = utils.roundToClean(radius * radius * angle.value, 2);
            
            const candidateDistractors = [
                `${wrongDegrees}`,
                `${arcLengthMistake}`,
                `${wrongFactor}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.roundToClean(0.5 * radius * radius * Math.PI * utils.rInt(1, 8) / utils.rInt(2, 6), 2)}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Find the area of a sector with radius ${radius} cm and angle ${angle.display} radians.}`),
                instruction: "Use A = (1/2)r²θ (give answer to 2 d.p.)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use the sector area formula A = (1/2)r²θ where θ is in radians. A = (1/2) × ${radius}² × ${angle.display} = 0.5 × ${radius * radius} × ${angle.value.toFixed(4)} = ${sectorAreaClean} cm².`,
                calc: true
            };
        } else if (questionType === 4) {
            // Sector area in degrees: A = (θ/360) × πr²
            const radius = [5, 6, 8, 10, 12][utils.rInt(0, 4)];
            const angleDeg = [30, 45, 60, 90, 120, 135, 150, 180][utils.rInt(0, 7)];
            const sectorArea = (angleDeg / 360) * Math.PI * radius * radius;
            const sectorAreaClean = utils.roundToClean(sectorArea, 2);
            const correctAnswer = `${sectorAreaClean}`;
            
            // Common mistakes: using radians formula, using diameter, wrong fraction
            const wrongRadians = utils.roundToClean(0.5 * radius * radius * angleDeg, 2);
            const wrongDiameter = utils.roundToClean((angleDeg / 360) * Math.PI * radius * radius * 4, 2);
            const arcLengthMistake = utils.roundToClean((angleDeg / 360) * 2 * Math.PI * radius, 2);
            
            const candidateDistractors = [
                `${wrongRadians}`,
                `${wrongDiameter}`,
                `${arcLengthMistake}`
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => `${utils.roundToClean((utils.rInt(30, 180) / 360) * Math.PI * radius * radius, 2)}`
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{Find the area of a sector with radius ${radius} cm and angle ${angleDeg}°.}`),
                instruction: "Use A = (θ/360) × πr² (give answer to 2 d.p.)",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Use the sector area formula A = (θ/360) × πr² where θ is in degrees. A = (${angleDeg}/360) × π × ${radius}² = ${(angleDeg / 360).toFixed(4)} × ${(Math.PI * radius * radius).toFixed(2)} = ${sectorAreaClean} cm².`,
                calc: true
            };
        } else if (questionType === 5) {
            // Find angle given arc length and radius (radians)
            const radius = [4, 5, 6, 8, 10][utils.rInt(0, 4)];
            const angleRadOptions = [
                { display: '\\frac{\\pi}{6}', value: Math.PI / 6 },
                { display: '\\frac{\\pi}{4}', value: Math.PI / 4 },
                { display: '\\frac{\\pi}{3}', value: Math.PI / 3 },
                { display: '\\frac{\\pi}{2}', value: Math.PI / 2 },
                { display: '\\frac{2\\pi}{3}', value: 2 * Math.PI / 3 }
            ];
            const angle = angleRadOptions[utils.rInt(0, angleRadOptions.length - 1)];
            const arcLength = radius * angle.value;
            const arcLengthClean = utils.roundToClean(arcLength, 2);
            const correctAnswer = angle.display;
            
            // Common mistakes: other common angles, wrong calculation
            const wrongAngles = angleRadOptions.filter(a => a.display !== angle.display);
            const candidateDistractors = [
                wrongAngles[0].display,
                wrongAngles[1].display,
                wrongAngles[2].display
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => angleRadOptions[utils.rInt(0, angleRadOptions.length - 1)].display
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{An arc has length ${arcLengthClean} cm and radius ${radius} cm. Find the angle in radians.}`),
                instruction: "Use θ = L/r",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Rearrange L = rθ to get θ = L/r. θ = ${arcLengthClean}/${radius} = ${angle.value.toFixed(4)} radians = ${angle.display}.`,
                calc: true
            };
        } else {
            // Find angle given sector area and radius (radians)
            const radius = [4, 5, 6, 8, 10][utils.rInt(0, 4)];
            const angleRadOptions = [
                { display: '\\frac{\\pi}{6}', value: Math.PI / 6 },
                { display: '\\frac{\\pi}{4}', value: Math.PI / 4 },
                { display: '\\frac{\\pi}{3}', value: Math.PI / 3 },
                { display: '\\frac{\\pi}{2}', value: Math.PI / 2 }
            ];
            const angle = angleRadOptions[utils.rInt(0, angleRadOptions.length - 1)];
            const sectorArea = 0.5 * radius * radius * angle.value;
            const sectorAreaClean = utils.roundToClean(sectorArea, 2);
            const correctAnswer = angle.display;
            
            // Common mistakes: other common angles, wrong calculation
            const wrongAngles = angleRadOptions.filter(a => a.display !== angle.display);
            const candidateDistractors = [
                wrongAngles[0].display,
                wrongAngles[1].display,
                wrongAngles[2].display
            ];
            const distractors = utils.ensureUniqueDistractors(
                correctAnswer,
                candidateDistractors,
                () => angleRadOptions[utils.rInt(0, angleRadOptions.length - 1)].display
            );
            
            return {
                tex: utils.wrapLongLatexText(`\\text{A sector has area ${sectorAreaClean} cm² and radius ${radius} cm. Find the angle in radians.}`),
                instruction: "Use θ = 2A/r²",
                displayAnswer: correctAnswer,
                distractors: distractors,
                explanation: `Rearrange A = (1/2)r²θ to get θ = 2A/r². θ = (2 × ${sectorAreaClean})/${radius}² = ${(2 * sectorArea).toFixed(2)}/${radius * radius} = ${angle.value.toFixed(4)} radians = ${angle.display}.`,
                calc: true
            };
        }
    }
};
