/**
 * Test multiple levels and types to ensure navigation works correctly
 */
const ScreenshotGenerator = require('./tools/screenshot-generator');

async function testMultipleLevels() {
    console.log('Testing screenshot generator with multiple levels...\n');
    const generator = new ScreenshotGenerator();
    
    try {
        await generator.initialize();
        console.log('✓ Initialized successfully\n');
        
        // Test cases: [level, type, expected topic]
        const testCases = [
            [1, 1, 'Basic Arithmetic'],
            [4, 2, 'Fractions'],
            [11, 1, 'Quadratic Equations'],
            [16, 1, 'Trigonometry']
        ];
        
        for (const [level, type, expectedTopic] of testCases) {
            console.log(`Testing Level ${level} Type ${type} (${expectedTopic})...`);
            const result = await generator.captureQuestionForLevel(
                level, 
                type, 
                `/tmp/test-level${level}-type${type}.png`
            );
            
            if (result.questionData) {
                console.log(`  ✓ Question generated successfully`);
                console.log(`  ✓ Question: ${result.questionData.tex}`);
                console.log(`  ✓ Correct Answer: ${result.questionData.displayAnswer}`);
                console.log(`  ✓ Level: ${result.questionData.level}, Type: ${result.questionData.questionType}`);
            } else {
                console.error(`  ✗ Failed to extract question data`);
            }
            console.log();
        }
        
        console.log('✓ All tests completed successfully');
        
    } catch (error) {
        console.error('✗ Error:', error.message);
        console.error(error.stack);
    } finally {
        await generator.close();
        console.log('\n✓ Cleanup complete');
    }
}

testMultipleLevels();
