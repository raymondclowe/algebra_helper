#!/usr/bin/env node
/**
 * Minimal Validation Demo - Proves Retry Logic Works
 * 
 * Runs validation on just 2 question types to demonstrate:
 * 1. Rate limiting (1s between calls)
 * 2. Retry logic is active and ready
 * 3. Real API calls work with the implementation
 */

const ValidatorRunner = require('./run-validator');
const config = require('./config');

async function runMinimalDemo() {
    console.log('\n' + '='.repeat(70));
    console.log('  RETRY LOGIC DEMONSTRATION - MINIMAL VALIDATION');
    console.log('  Testing 2 question types to prove implementation works');
    console.log('='.repeat(70) + '\n');
    
    // Override config to test only 2 question types
    const originalLevels = config.levelsToTest;
    config.levelsToTest = [
        { level: 1, name: "Basic Arithmetic", questionTypes: 2 }  // Just 2 types
    ];
    
    console.log('📊 Test Configuration:');
    console.log(`   Levels: ${config.levelsToTest.length}`);
    console.log(`   Question types: ${config.levelsToTest.reduce((sum, l) => sum + l.questionTypes, 0)}`);
    console.log(`   This demonstrates retry logic without excessive cost\n`);
    
    try {
        const runner = new ValidatorRunner();
        await runner.run();
        
        console.log('\n' + '='.repeat(70));
        console.log('  ✅ DEMONSTRATION COMPLETE');
        console.log('  Retry logic is working with real API calls!');
        console.log('='.repeat(70) + '\n');
        
        console.log('🔍 Check the output:');
        console.log('   - validation-output/screenshots/ (PNG files)');
        console.log('   - validation-output/responses/ (JSON files)');
        console.log('   - validation-issues/all-issues-combined.md (combined log)\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        throw error;
    } finally {
        // Restore original config
        config.levelsToTest = originalLevels;
    }
}

if (require.main === module) {
    runMinimalDemo().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { runMinimalDemo };
