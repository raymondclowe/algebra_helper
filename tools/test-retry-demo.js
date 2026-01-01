/**
 * Minimal test to demonstrate retry logic works
 * Tests just 2 levels instead of all 34
 */

const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const ValidatorRunner = require('./run-validator');
const config = require('./config');

class MinimalValidatorRunner extends ValidatorRunner {
    async runValidator() {
        console.log('\n🚀 Running Question Validator (Minimal Test - 2 Levels)...\n');
        console.log('='.repeat(70));
        
        // Override config to test only 2 levels with 1 question type each
        const originalLevels = config.levelsToTest;
        config.levelsToTest = [
            { level: 1, name: "Basic Arithmetic", questionTypes: 1 },
            { level: 6, name: "Simple Linear Equations", questionTypes: 1 }
        ];
        
        console.log('\n📝 Testing Levels:');
        config.levelsToTest.forEach(l => {
            console.log(`   - Level ${l.level}: ${l.name} (${l.questionTypes} question type)`);
        });
        console.log('');
        
        const QuestionValidator = require('./question-validator');
        const validator = new QuestionValidator();
        await validator.run();
        
        // Restore original levels
        config.levelsToTest = originalLevels;
        
        console.log('\n✅ Validation completed!\n');
    }
}

// Run the minimal test
const runner = new MinimalValidatorRunner();
runner.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
