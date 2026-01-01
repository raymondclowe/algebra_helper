/**
 * Test for API client retry logic
 * Tests the rate limiting and exponential backoff functionality
 */

const apiClientInstance = require('./api-client');
const ApiClient = apiClientInstance.ApiClient;

class MockApiClient extends ApiClient {
    constructor() {
        super();
        this.mockResponses = [];
        this.callCount = 0;
        this.callTimestamps = [];
    }
    
    /**
     * Override fetch to simulate API responses
     */
    async mockFetch(url, options) {
        this.callCount++;
        this.callTimestamps.push(Date.now());
        
        const response = this.mockResponses.shift() || {
            ok: true,
            status: 200,
            json: async () => ({
                choices: [{
                    message: { content: 'VALID' },
                    finish_reason: 'stop'
                }],
                model: 'google/gemini-3-pro-preview',
                usage: { total_tokens: 100 }
            }),
            text: async () => ''
        };
        
        return response;
    }
    
    /**
     * Override validateQuestion to use mock fetch
     */
    async validateQuestion(base64Image, questionMetadata) {
        const messages = [{
            role: 'user',
            content: [
                { type: 'text', text: 'test' },
                { type: 'image_url', image_url: { url: 'data:image/png;base64,test' } }
            ]
        }];
        
        const requestBody = {
            model: this.modelName,
            messages: messages,
            max_tokens: 2000,
            temperature: 0.3
        };
        
        let lastError = null;
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                await this.enforceRateLimit();
                
                const response = await this.mockFetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`,
                        'HTTP-Referer': 'https://github.com/raymondclowe/algebra_helper',
                        'X-Title': 'Algebra Helper Question Validator'
                    },
                    body: JSON.stringify(requestBody)
                });
                
                const errorText = !response.ok ? await response.text() : null;
                
                if (!response.ok && this.isRateLimitError(response, errorText)) {
                    const backoffMs = this.initialBackoff * Math.pow(2, attempt);
                    
                    console.log(`   ⚠️  Rate limit error (attempt ${attempt + 1}/${this.maxRetries + 1})`);
                    
                    if (attempt < this.maxRetries) {
                        await this.backoff(backoffMs);
                        continue;
                    } else {
                        throw new Error(`Rate limit exceeded after ${this.maxRetries + 1} attempts: ${errorText}`);
                    }
                }
                
                if (!response.ok) {
                    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
                }
                
                const data = await response.json();
                let validationText = data.choices?.[0]?.message?.content || '';
                
                if (!validationText || validationText.trim().length === 0) {
                    const reasoning = data.choices?.[0]?.message?.reasoning;
                    if (reasoning) {
                        validationText = reasoning;
                    }
                }
                
                return {
                    success: true,
                    validationText,
                    metadata: {
                        model: data.model,
                        usage: data.usage,
                        finishReason: data.choices?.[0]?.finish_reason
                    }
                };
            } catch (error) {
                lastError = error;
                
                if (!error.message.includes('Rate limit')) {
                    return {
                        success: false,
                        error: error.message
                    };
                }
            }
        }
        
        return {
            success: false,
            error: lastError ? lastError.message : 'Unknown error after retries'
        };
    }
}

/**
 * Test: Rate limiting enforces 1 second minimum between calls
 */
async function testRateLimiting() {
    console.log('\n🧪 Test 1: Rate Limiting (1 second minimum between calls)');
    
    const client = new MockApiClient();
    client.minDelayBetweenCalls = 1000; // 1 second
    
    // Mock successful responses
    client.mockResponses = [
        {
            ok: true,
            status: 200,
            json: async () => ({
                choices: [{ message: { content: 'VALID' }, finish_reason: 'stop' }],
                model: 'google/gemini-3-pro-preview',
                usage: { total_tokens: 100 }
            }),
            text: async () => ''
        },
        {
            ok: true,
            status: 200,
            json: async () => ({
                choices: [{ message: { content: 'VALID' }, finish_reason: 'stop' }],
                model: 'google/gemini-3-pro-preview',
                usage: { total_tokens: 100 }
            }),
            text: async () => ''
        }
    ];
    
    const startTime = Date.now();
    
    // Make two consecutive API calls
    await client.validateQuestion('test', { level: 1, topic: 'test', questionText: 'test' });
    await client.validateQuestion('test', { level: 1, topic: 'test', questionText: 'test' });
    
    const elapsed = Date.now() - startTime;
    
    // Should take at least 1 second (1000ms) due to rate limiting
    if (elapsed >= 1000) {
        console.log(`   ✅ PASS: Enforced ${Math.round(elapsed)}ms delay (>= 1000ms expected)`);
        console.log(`   📊 Timestamps: ${client.callTimestamps.map((t, i) => i === 0 ? '0ms' : `${t - client.callTimestamps[0]}ms`).join(', ')}`);
        return true;
    } else {
        console.log(`   ❌ FAIL: Only ${Math.round(elapsed)}ms elapsed (>= 1000ms expected)`);
        return false;
    }
}

/**
 * Test: Rate limit error triggers retry with exponential backoff
 */
async function testRateLimitRetry() {
    console.log('\n🧪 Test 2: Rate Limit Retry with Exponential Backoff');
    
    const client = new MockApiClient();
    client.minDelayBetweenCalls = 100; // Shorter for testing
    client.initialBackoff = 1000; // 1 second for testing (instead of 30)
    client.maxRetries = 2; // Limit retries for faster testing
    
    // Mock: First call fails with rate limit, second succeeds
    client.mockResponses = [
        {
            ok: false,
            status: 429,
            text: async () => 'Rate limit exceeded',
            json: async () => { throw new Error('Not JSON'); }
        },
        {
            ok: true,
            status: 200,
            json: async () => ({
                choices: [{ message: { content: 'VALID' }, finish_reason: 'stop' }],
                model: 'google/gemini-3-pro-preview',
                usage: { total_tokens: 100 }
            }),
            text: async () => ''
        }
    ];
    
    const startTime = Date.now();
    const result = await client.validateQuestion('test', { level: 1, topic: 'test', questionText: 'test' });
    const elapsed = Date.now() - startTime;
    
    // Should succeed after retry and take at least 1 second (backoff time)
    if (result.success && elapsed >= 1000 && client.callCount === 2) {
        console.log(`   ✅ PASS: Retried after rate limit (${client.callCount} calls, ${Math.round(elapsed)}ms elapsed)`);
        return true;
    } else {
        console.log(`   ❌ FAIL: Expected success=true, >=1000ms, 2 calls`);
        console.log(`   📊 Got: success=${result.success}, ${Math.round(elapsed)}ms, ${client.callCount} calls`);
        return false;
    }
}

/**
 * Test: Multiple rate limit errors trigger exponential backoff
 */
async function testExponentialBackoff() {
    console.log('\n🧪 Test 3: Exponential Backoff (30s, 60s, 120s...)');
    
    const client = new MockApiClient();
    client.minDelayBetweenCalls = 100; // Shorter for testing
    client.initialBackoff = 500; // 0.5 second for testing
    client.maxRetries = 2; // Test 3 attempts total
    
    // Mock: Two rate limit errors, then success
    client.mockResponses = [
        {
            ok: false,
            status: 429,
            text: async () => 'Rate limit exceeded',
            json: async () => { throw new Error('Not JSON'); }
        },
        {
            ok: false,
            status: 429,
            text: async () => 'Rate limit exceeded',
            json: async () => { throw new Error('Not JSON'); }
        },
        {
            ok: true,
            status: 200,
            json: async () => ({
                choices: [{ message: { content: 'VALID' }, finish_reason: 'stop' }],
                model: 'google/gemini-3-pro-preview',
                usage: { total_tokens: 100 }
            }),
            text: async () => ''
        }
    ];
    
    const startTime = Date.now();
    const result = await client.validateQuestion('test', { level: 1, topic: 'test', questionText: 'test' });
    const elapsed = Date.now() - startTime;
    
    // Expected backoffs: 500ms (first) + 1000ms (second) = 1500ms total
    // Should succeed after 3 attempts total
    if (result.success && elapsed >= 1500 && client.callCount === 3) {
        console.log(`   ✅ PASS: Exponential backoff worked (${client.callCount} calls, ${Math.round(elapsed)}ms elapsed)`);
        console.log(`   📊 Expected: 500ms + 1000ms = 1500ms backoff`);
        return true;
    } else {
        console.log(`   ❌ FAIL: Expected success=true, >=1500ms, 3 calls`);
        console.log(`   📊 Got: success=${result.success}, ${Math.round(elapsed)}ms, ${client.callCount} calls`);
        return false;
    }
}

/**
 * Test: Max retries exceeded results in failure
 */
async function testMaxRetriesExceeded() {
    console.log('\n🧪 Test 4: Max Retries Exceeded (should fail)');
    
    const client = new MockApiClient();
    client.minDelayBetweenCalls = 100;
    client.initialBackoff = 200; // Short for testing
    client.maxRetries = 2; // Allow 3 attempts total
    
    // Mock: All calls fail with rate limit
    client.mockResponses = [
        { ok: false, status: 429, text: async () => 'Rate limit', json: async () => { throw new Error('Not JSON'); } },
        { ok: false, status: 429, text: async () => 'Rate limit', json: async () => { throw new Error('Not JSON'); } },
        { ok: false, status: 429, text: async () => 'Rate limit', json: async () => { throw new Error('Not JSON'); } },
        { ok: false, status: 429, text: async () => 'Rate limit', json: async () => { throw new Error('Not JSON'); } }
    ];
    
    const result = await client.validateQuestion('test', { level: 1, topic: 'test', questionText: 'test' });
    
    // Should fail after maxRetries attempts
    if (!result.success && result.error.includes('Rate limit exceeded after') && client.callCount === 3) {
        console.log(`   ✅ PASS: Failed after ${client.callCount} attempts (maxRetries + 1)`);
        console.log(`   📊 Error: ${result.error}`);
        return true;
    } else {
        console.log(`   ❌ FAIL: Expected failure with 3 attempts`);
        console.log(`   📊 Got: success=${result.success}, ${client.callCount} calls`);
        console.log(`   📊 Error: ${result.error}`);
        return false;
    }
}

/**
 * Test: Non-rate-limit errors don't trigger retry
 */
async function testNonRateLimitError() {
    console.log('\n🧪 Test 5: Non-Rate-Limit Errors (no retry)');
    
    const client = new MockApiClient();
    client.minDelayBetweenCalls = 100;
    
    // Mock: 500 Internal Server Error (not rate limit)
    client.mockResponses = [
        {
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error',
            json: async () => { throw new Error('Not JSON'); }
        },
        // This response should never be used
        {
            ok: true,
            status: 200,
            json: async () => ({
                choices: [{ message: { content: 'VALID' }, finish_reason: 'stop' }],
                model: 'google/gemini-3-pro-preview',
                usage: { total_tokens: 100 }
            }),
            text: async () => ''
        }
    ];
    
    const result = await client.validateQuestion('test', { level: 1, topic: 'test', questionText: 'test' });
    
    // Should fail immediately without retry
    if (!result.success && client.callCount === 1 && result.error.includes('500')) {
        console.log(`   ✅ PASS: Failed immediately without retry (${client.callCount} call)`);
        console.log(`   📊 Error: ${result.error}`);
        return true;
    } else {
        console.log(`   ❌ FAIL: Expected immediate failure with 1 call`);
        console.log(`   📊 Got: success=${result.success}, ${client.callCount} calls`);
        return false;
    }
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('🚀 Running API Client Retry Logic Tests\n');
    console.log('=' .repeat(70));
    
    const tests = [
        testRateLimiting,
        testRateLimitRetry,
        testExponentialBackoff,
        testMaxRetriesExceeded,
        testNonRateLimitError
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        try {
            const result = await test();
            if (result) {
                passed++;
            } else {
                failed++;
            }
        } catch (error) {
            console.log(`   ❌ EXCEPTION: ${error.message}`);
            console.error(error.stack);
            failed++;
        }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);
    
    if (failed === 0) {
        console.log('✅ All tests passed!\n');
        return true;
    } else {
        console.log('❌ Some tests failed.\n');
        return false;
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    runAllTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { runAllTests };
