/**
 * OpenRouter API Client for Gemini 3 Pro validation
 */
const config = require('./config');

class ApiClient {
    constructor() {
        this.apiUrl = config.openRouterApiUrl;
        this.apiKey = config.apiKey;
        this.modelName = config.modelName;
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
        
        try {
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
            
            if (!response.ok) {
                const errorText = await response.text();
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
            return {
                success: false,
                error: error.message
            };
        }
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

module.exports = new ApiClient();
