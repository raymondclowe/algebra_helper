/**
 * OpenRouter API Client for Gemini 3 Pro validation
 */
const config = require('./config');

class ApiClient {
    constructor() {
        this.apiUrl = config.openRouterApiUrl;
        this.apiKey = config.apiKey;
        this.modelName = config.modelName;
        
        // Rate limiting configuration
        this.lastApiCallTime = 0;
        this.minDelayBetweenCalls = 1000; // 1 second minimum delay between API calls
        
        // Retry configuration
        this.maxRetries = 5;
        this.initialBackoff = 30000; // 30 seconds for rate limit errors
    }
    
    /**
     * Enforce minimum delay between API calls
     * @private
     */
    async enforceRateLimit() {
        const now = Date.now();
        const timeSinceLastCall = now - this.lastApiCallTime;
        
        if (timeSinceLastCall < this.minDelayBetweenCalls) {
            const delay = this.minDelayBetweenCalls - timeSinceLastCall;
            console.log(`   ⏱️  Rate limiting: waiting ${delay}ms before next API call`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        this.lastApiCallTime = Date.now();
    }
    
    /**
     * Check if error is a rate limit error
     * @param {Response} response - Fetch response
     * @param {string} errorText - Error text from response
     * @returns {boolean} True if rate limit error
     * @private
     */
    isRateLimitError(response, errorText) {
        // Check for HTTP 429 status code
        if (response.status === 429) {
            return true;
        }
        
        // Check for rate limit keywords in error message
        if (errorText) {
            const rateLimitKeywords = ['rate limit', 'rate_limit', 'too many requests', 'quota exceeded'];
            const lowerErrorText = errorText.toLowerCase();
            return rateLimitKeywords.some(keyword => lowerErrorText.includes(keyword));
        }
        
        return false;
    }
    
    /**
     * Wait for backoff period
     * @param {number} backoffMs - Backoff time in milliseconds
     * @private
     */
    async backoff(backoffMs) {
        const backoffSeconds = Math.round(backoffMs / 1000);
        console.log(`   ⏳ Backing off for ${backoffSeconds} seconds...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
    
    /**
     * Send image to Gemini 3 Pro for validation
     * @param {string} base64Image - Base64 encoded image
     * @param {object} questionMetadata - Metadata about the question
     * @returns {Promise<object>} API response with validation result
     */
    async validateQuestion(base64Image, questionMetadata) {
        const messages = [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `${config.validationPrompt}

Question Level: ${questionMetadata.level}
Topic: ${questionMetadata.topic}
Question Text: ${questionMetadata.questionText}`
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/png;base64,${base64Image}`
                        }
                    }
                ]
            }
        ];
        
        const requestBody = {
            model: this.modelName,
            messages: messages,
            max_tokens: 2000, // Increased for more complete responses
            temperature: 0.3 // Lower temperature for more consistent validation
        };
        
        // Retry logic with exponential backoff
        let lastError = null;
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                // Enforce rate limiting (1 second minimum between calls)
                await this.enforceRateLimit();
                
                const response = await fetch(this.apiUrl, {
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
                
                // Check for rate limit error
                if (!response.ok && this.isRateLimitError(response, errorText)) {
                    // Calculate exponential backoff: 30s, 60s, 120s, 240s, 480s
                    const backoffMs = this.initialBackoff * Math.pow(2, attempt);
                    
                    console.log(`   ⚠️  Rate limit error (attempt ${attempt + 1}/${this.maxRetries + 1})`);
                    
                    // If this is not the last attempt, backoff and retry
                    if (attempt < this.maxRetries) {
                        await this.backoff(backoffMs);
                        continue;
                    } else {
                        throw new Error(`Rate limit exceeded after ${this.maxRetries + 1} attempts: ${errorText}`);
                    }
                }
                
                // Handle other errors
                if (!response.ok) {
                    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
                }
                
                const data = await response.json();
                
                // Extract the response text
                // Check both content and reasoning fields (Gemini 3 Pro may use reasoning field)
                let validationText = data.choices?.[0]?.message?.content || '';
                
                // If content is empty but there's reasoning, use that
                if (!validationText || validationText.trim().length === 0) {
                    const reasoning = data.choices?.[0]?.message?.reasoning;
                    if (reasoning) {
                        validationText = reasoning;
                    }
                }
                
                // Warn if response is empty
                if (!validationText || validationText.trim().length === 0) {
                    console.warn('   ⚠️ Warning: Empty response from API');
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
                
                // If this is not a rate limit error or it's the last attempt, fail immediately
                if (!error.message.includes('Rate limit')) {
                    return {
                        success: false,
                        error: error.message
                    };
                }
            }
        }
        
        // All retries exhausted
        return {
            success: false,
            error: lastError ? lastError.message : 'Unknown error after retries'
        };
    }
    
    /**
     * Parse validation response to determine if question is valid
     * @param {string} validationText - Response from Gemini
     * @returns {object} Parsed result
     */
    parseValidationResponse(validationText) {
        const text = validationText.trim();
        const upperText = text.toUpperCase();
        
        // Check for explicit positive indicators at the start or in a clear verdict section
        // Using word boundaries to avoid false positives (e.g., INVALID matching VALID)
        const startsWithValid = /^(OK|VALID|LOOKS GOOD|CORRECT)\b/.test(upperText);
        
        // Also check if there's a clear "VALID" verdict after reasoning
        const hasValidVerdict = /\n\s*VALID\b/.test(upperText) || 
                               /\n\s*OK\b/.test(upperText);
        
        // Check for negative indicators that suggest actual problems (not just suggestions)
        // Using consistent patterns with word boundaries or specific delimiters
        const hasIncorrect = /\bINCORRECT\b/.test(upperText) && 
                           (upperText.includes('INCORRECT:') || upperText.includes('IS INCORRECT'));
        const hasError = /\bERROR\b/.test(upperText) && 
                        (upperText.includes('ERROR:') || upperText.includes('HAS AN ERROR'));
        const hasWrong = /\b(IS WRONG|ANSWER IS WRONG)\b/.test(upperText);
        const hasFix = /\b(MUST FIX|NEEDS TO BE FIXED)\b/.test(upperText);
        const hasInvalid = /\bINVALID\b/.test(upperText) && !upperText.includes('NOT INVALID');
        
        const hasProblems = hasIncorrect || hasError || hasWrong || hasFix || hasInvalid;
        
        // Consider valid if it starts with VALID/OK or has a clear verdict, and no serious problems
        const isValid = (startsWithValid || hasValidVerdict) && !hasProblems;
        
        return {
            isValid: isValid,
            hasIssues: hasProblems,
            feedback: validationText,
            needsReview: hasProblems || (!isValid && validationText.length > 50)
        };
    }
}

// Export both the class and a default instance
const apiClientInstance = new ApiClient();
apiClientInstance.ApiClient = ApiClient; // Attach class for testing
module.exports = apiClientInstance;
