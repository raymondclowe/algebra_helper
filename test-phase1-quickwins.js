#!/usr/bin/env node
/**
 * Test the three new question templates
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Create a browser-like environment
const window = {
    QuestionTemplates: {},
    GeneratorUtils: {},
    TopicDefinitions: {}
};

// Helper to load a JS file in our simulated environment
function loadScript(filepath) {
    const code = fs.readFileSync(filepath, 'utf-8');
    const script = new vm.Script(code);
    const context = vm.createContext({ window, console, Math });
    script.runInContext(context);
}

console.log('Loading scripts...\n');
loadScript(path.join(__dirname, 'js/constants.js'));
loadScript(path.join(__dirname, 'js/topic-definitions.js'));
loadScript(path.join(__dirname, 'js/question-templates/generator-utils.js'));
loadScript(path.join(__dirname, 'js/question-templates/arc-sector.js'));
loadScript(path.join(__dirname, 'js/question-templates/tangent-normal.js'));
loadScript(path.join(__dirname, 'js/question-templates/statistics-spread.js'));

console.log('===== ARC LENGTH AND SECTOR AREA =====');
for (let type = 1; type <= 6; type++) {
    window.TESTING_MODE = true;
    window.FORCED_QUESTION_TYPE = type;
    try {
        const q = window.QuestionTemplates.ArcSector.getArcSectorQuestion();
        console.log(`Type ${type}: ${q.tex.substring(0, 80)}`);
        console.log(`  Answer: ${q.displayAnswer}`);
    } catch (e) {
        console.log(`Type ${type}: ERROR - ${e.message}`);
    }
}

console.log('\n===== TANGENT AND NORMAL LINES =====');
for (let type = 1; type <= 6; type++) {
    window.TESTING_MODE = true;
    window.FORCED_QUESTION_TYPE = type;
    try {
        const q = window.QuestionTemplates.TangentNormal.getTangentNormalQuestion();
        console.log(`Type ${type}: ${q.tex.substring(0, 80)}`);
        console.log(`  Answer: ${q.displayAnswer}`);
    } catch (e) {
        console.log(`Type ${type}: ERROR - ${e.message}`);
    }
}

console.log('\n===== STANDARD DEVIATION & VARIANCE =====');
for (let type = 1; type <= 8; type++) {
    window.TESTING_MODE = true;
    window.FORCED_QUESTION_TYPE = type;
    try {
        const q = window.QuestionTemplates.StatisticsSpread.getStatisticsSpreadQuestion();
        console.log(`Type ${type}: ${q.tex.substring(0, 80)}`);
        console.log(`  Answer: ${q.displayAnswer}`);
    } catch (e) {
        console.log(`Type ${type}: ERROR - ${e.message}`);
    }
}

console.log('\n✅ Test complete!');
