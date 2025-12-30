/**
 * Simple test to verify the validation tool components work
 */
const QuestionValidator = require('./question-validator');
const config = require('./config');

async function runBasicTest() {
    console.log('🧪 Running Basic Component Test\n');
    
    // Test 1: Configuration
    console.log('Test 1: Configuration Validation');
    const configValidation = config.validate();
    console.log(`   Result: ${configValidation.valid ? '✅ PASS' : '❌ FAIL'}`);
    if (!configValidation.valid) {
        configValidation.errors.forEach(err => console.log(`   - ${err}`));
        return false;
    }
    
    // Test 2: Question Generation (limited test with 2 levels)
    console.log('\nTest 2: Question Generation and Validation (2 sample levels)');
    console.log('   Testing Level 1 (Basic Arithmetic) and Level 10 (Factorising Quadratics)\n');
    
    const validator = new QuestionValidator();
    
    // Override config to test only 2 levels with 1 question each
    config.levelsToTest = [
        { level: 1, name: "Basic Arithmetic" },
        { level: 10, name: "Factorising Quadratics" }
    ];
    config.questionsPerLevel = 1;
    
    try {
        await validator.initialize();
        console.log('   ✅ Validator initialized\n');
        
        // Test question generation
        const question = await validator.generateQuestion(1);
        console.log('   ✅ Question generated successfully');
        console.log(`      Question: ${question.tex.substring(0, 50)}...`);
        console.log(`      Options: ${question.options.length}`);
        console.log(`      Correct: ${question.options[question.correctIndex]}\n`);
        
        // Run validation on sample levels
        console.log('   Running validation on sample levels...\n');
        await validator.validateAll();
        
        await validator.generateReport();
        
        console.log('\n   ✅ All tests passed!\n');
        return true;
        
    } catch (error) {
        console.error(`   ❌ Test failed: ${error.message}`);
        console.error(error.stack);
        return false;
    } finally {
        await validator.cleanup();
    }
}

// Run the test
if (require.main === module) {
    runBasicTest()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runBasicTest };
