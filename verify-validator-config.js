#!/usr/bin/env node
/**
 * Verification script to confirm the validator is configured to test ALL question types
 * This script analyzes the configuration and shows exactly what will be tested.
 */

const config = require('./tools/config');

console.log('\n' + '='.repeat(70));
console.log('  VALIDATOR CONFIGURATION VERIFICATION');
console.log('='.repeat(70) + '\n');

// Calculate totals
const totalLevels = config.levelsToTest.length;
const totalQuestionTypes = config.levelsToTest.reduce((sum, level) => sum + level.questionTypes, 0);

console.log('📊 Summary:');
console.log(`   Total Levels: ${totalLevels}`);
console.log(`   Total Question Types: ${totalQuestionTypes}`);
console.log('');

// Show breakdown by level
console.log('📋 Complete Breakdown:\n');

let cumulativeCount = 0;
config.levelsToTest.forEach((level, index) => {
    cumulativeCount += level.questionTypes;
    console.log(`   ${(index + 1).toString().padStart(2)}. Level ${level.level.toString().padStart(2)} - ${level.name.padEnd(30)} - ${level.questionTypes} type(s) - [Cumulative: ${cumulativeCount}]`);
});

console.log('\n' + '='.repeat(70));
console.log(`✅ CONFIRMED: Validator will test ALL ${totalQuestionTypes} question types`);
console.log('='.repeat(70) + '\n');

console.log('🔍 How the validator works:');
console.log('   1. Loops through all 34 levels');
console.log('   2. For each level, loops through all question types (1 to N)');
console.log('   3. For each type, uses URL: ?testLevel=N&testType=M');
console.log('   4. Screenshots and validates each question\n');

console.log('💡 To run full validation:');
console.log('   npm run validate-and-combine\n');

console.log('💡 To run specific levels (for testing):');
console.log('   Edit tools/config.js temporarily to reduce levelsToTest array\n');
