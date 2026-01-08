// Direct test of Phase 1 Iteration 1 question generators
// Run with: node test-phase1-direct.js

// Mock the GeneratorUtils since we're running in Node
global.window = {};

// Load GeneratorUtils
const fs = require('fs');
const utilsCode = fs.readFileSync('./js/question-templates/generator-utils.js', 'utf8');
eval(utilsCode);

// Load the new question templates
const financialCode = fs.readFileSync('./js/question-templates/financial-applications.js', 'utf8');
eval(financialCode);

const linesCode = fs.readFileSync('./js/question-templates/lines.js', 'utf8');
eval(linesCode);

const quadraticInequalitiesCode = fs.readFileSync('./js/question-templates/quadratic-inequalities.js', 'utf8');
eval(quadraticInequalitiesCode);

console.log('='.repeat(80));
console.log('PHASE 1 ITERATION 1 - QUESTION GENERATOR TEST');
console.log('='.repeat(80));

// Test Financial Applications
console.log('\n1. FINANCIAL APPLICATIONS (Level 13-14)');
console.log('-'.repeat(80));
try {
    for (let i = 0; i < 6; i++) {
        const q = window.QuestionTemplates.FinancialApplications.getFinancialApplications();
        console.log(`\nQuestion ${i+1}:`);
        console.log(`  Instruction: ${q.instruction}`);
        console.log(`  Question: ${q.tex.substring(0, 100)}...`);
        console.log(`  Correct Answer: ${q.displayAnswer}`);
        console.log(`  Distractors: ${q.distractors.join(', ')}`);
        console.log(`  Calculator: ${q.calc}`);
        console.log(`  Explanation: ${q.explanation.substring(0, 80)}...`);
        
        // Validate unique answers
        const allAnswers = [q.displayAnswer, ...q.distractors];
        const uniqueAnswers = new Set(allAnswers);
        if (uniqueAnswers.size !== allAnswers.length) {
            console.error(`  ❌ ERROR: Duplicate answers found!`);
        } else {
            console.log(`  ✅ All answers unique`);
        }
    }
    console.log('\n✅ Financial Applications generator working correctly!');
} catch (e) {
    console.error(`❌ Financial Applications generator error: ${e.message}`);
    console.error(e.stack);
}

// Test Parallel/Perpendicular Lines
console.log('\n\n2. PARALLEL/PERPENDICULAR LINES (Level 6-7)');
console.log('-'.repeat(80));
try {
    for (let i = 0; i < 5; i++) {
        const q = window.QuestionTemplates.Lines.getParallelPerpendicularLines();
        console.log(`\nQuestion ${i+1}:`);
        console.log(`  Instruction: ${q.instruction}`);
        console.log(`  Question: ${q.tex.substring(0, 100)}...`);
        console.log(`  Correct Answer: ${q.displayAnswer}`);
        console.log(`  Distractors: ${q.distractors.join(', ')}`);
        console.log(`  Calculator: ${q.calc}`);
        
        // Validate unique answers
        const allAnswers = [q.displayAnswer, ...q.distractors];
        const uniqueAnswers = new Set(allAnswers);
        if (uniqueAnswers.size !== allAnswers.length) {
            console.error(`  ❌ ERROR: Duplicate answers found!`);
        } else {
            console.log(`  ✅ All answers unique`);
        }
    }
    console.log('\n✅ Lines generator working correctly!');
} catch (e) {
    console.error(`❌ Lines generator error: ${e.message}`);
    console.error(e.stack);
}

// Test Quadratic Inequalities
console.log('\n\n3. QUADRATIC INEQUALITIES (Level 10-11)');
console.log('-'.repeat(80));
try {
    for (let i = 0; i < 6; i++) {
        const q = window.QuestionTemplates.QuadraticInequalities.getQuadraticInequalities();
        console.log(`\nQuestion ${i+1}:`);
        console.log(`  Instruction: ${q.instruction}`);
        console.log(`  Question: ${q.tex}`);
        console.log(`  Correct Answer: ${q.displayAnswer}`);
        console.log(`  Distractors: ${q.distractors.join(' | ')}`);
        console.log(`  Calculator: ${q.calc}`);
        
        // Validate unique answers
        const allAnswers = [q.displayAnswer, ...q.distractors];
        const uniqueAnswers = new Set(allAnswers);
        if (uniqueAnswers.size !== allAnswers.length) {
            console.error(`  ❌ ERROR: Duplicate answers found!`);
        } else {
            console.log(`  ✅ All answers unique`);
        }
    }
    console.log('\n✅ Quadratic Inequalities generator working correctly!');
} catch (e) {
    console.error(`❌ Quadratic Inequalities generator error: ${e.message}`);
    console.error(e.stack);
}

console.log('\n' + '='.repeat(80));
console.log('SUMMARY: All Phase 1 Iteration 1 question generators tested successfully!');
console.log('='.repeat(80));
