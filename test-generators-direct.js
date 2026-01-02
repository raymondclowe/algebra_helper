#!/usr/bin/env node
/**
 * Direct test of question generators to verify they produce correct question types
 */

// Load required modules in the right order
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

// Load scripts in order
console.log('Loading scripts...\n');
loadScript(path.join(__dirname, 'js/constants.js'));
loadScript(path.join(__dirname, 'js/topic-definitions.js'));
loadScript(path.join(__dirname, 'js/question-templates/generator-utils.js'));
loadScript(path.join(__dirname, 'js/question-templates/basic-arithmetic.js'));
loadScript(path.join(__dirname, 'js/question-templates/squares-roots.js'));
loadScript(path.join(__dirname, 'js/question-templates/multiplication-tables.js'));
loadScript(path.join(__dirname, 'js/question-templates/fractions.js'));

// Test each level's question types
console.log('===== LEVEL 1: Basic Arithmetic =====');
for (let type = 1; type <= 4; type++) {
    window.TESTING_MODE = true;
    window.FORCED_QUESTION_TYPE = type;
    const q = window.QuestionTemplates.BasicArithmetic.getBasicArithmetic();
    console.log(`Type ${type}: ${q.tex.substring(0, 50)}`);
}

console.log('\n===== LEVEL 2: Powers and Roots =====');
for (let type = 1; type <= 6; type++) {
    window.TESTING_MODE = true;
    window.FORCED_QUESTION_TYPE = type;
    const q = window.QuestionTemplates.SquaresRoots.getSquaresAndRoots();
    console.log(`Type ${type}: ${q.tex.substring(0, 50)}`);
}

console.log('\n===== LEVEL 3: Multiplication and Division =====');
for (let type = 1; type <= 5; type++) {
    window.TESTING_MODE = true;
    window.FORCED_QUESTION_TYPE = type;
    const q = window.QuestionTemplates.MultiplicationTables.getMultiplicationTables();
    console.log(`Type ${type}: ${q.tex.substring(0, 50)}`);
}

console.log('\n===== LEVEL 4: Fractions =====');
for (let type = 1; type <= 5; type++) {
    window.TESTING_MODE = true;
    window.FORCED_QUESTION_TYPE = type;
    const q = window.QuestionTemplates.Fractions.getFractions();
    console.log(`Type ${type}: ${q.tex.substring(0, 50)}`);
}

console.log('\n✅ Test complete!');
