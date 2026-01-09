/**
 * Basic test to see if validator can launch and navigate
 */
const ScreenshotGenerator = require('./tools/screenshot-generator');

async function testBasic() {
    console.log('Testing screenshot generator initialization...');
    const generator = new ScreenshotGenerator();
    
    try {
        await generator.initialize();
        console.log('✓ Initialized successfully');
        
        // Test navigation to a simple level
        console.log('\nTesting navigation to Level 1 Type 1...');
        const result = await generator.captureQuestionForLevel(1, 1, '/tmp/test-level1-type1.png');
        
        console.log('✓ Navigation successful');
        console.log('Question data:', JSON.stringify(result.questionData, null, 2));
        console.log('Screenshot saved to: /tmp/test-level1-type1.png');
        
    } catch (error) {
        console.error('✗ Error:', error.message);
        console.error(error.stack);
    } finally {
        await generator.close();
        console.log('\n✓ Cleanup complete');
    }
}

testBasic();
