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
            
            // Debug logging (can be removed later)
            if (!validationText || validationText.trim().length === 0) {
                console.warn('   ⚠️ Warning: Empty response from API');
                console.warn('   API Response structure:', JSON.stringify(data, null, 2).substring(0, 500));
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
        
        // Check for explicit positive indicators at the start
        const startsWithValid = upperText.startsWith('OK') || 
                               upperText.startsWith('VALID') || 
                               upperText.startsWith('LOOKS GOOD') ||
                               upperText.startsWith('CORRECT');
        
        // Check for negative indicators that suggest problems
        // Be more specific - only flag if these words appear in a negative context
        const hasIncorrect = upperText.includes('INCORRECT');
        const hasError = upperText.includes(' ERROR') || upperText.startsWith('ERROR');
        const hasWrong = upperText.includes(' WRONG') || upperText.startsWith('WRONG');
        const hasFix = (upperText.includes('FIX THIS') || upperText.includes('MUST FIX'));
        const hasIssue = (upperText.includes(' ISSUE ') || upperText.includes(' ISSUES ')) && 
                        !upperText.includes('NO ISSUE');
        const hasProblem = (upperText.includes(' PROBLEM ') || upperText.includes(' PROBLEMS ')) && 
                          !upperText.includes('NO PROBLEM');
        
        const hasProblems = hasIncorrect || hasError || hasWrong || hasFix || hasIssue || hasProblem;
        
        // If starts with VALID/OK but mentions actual problems, still consider invalid
        const isValid = startsWithValid && !hasProblems;
        
        return {
            isValid: isValid,
            hasIssues: hasProblems,
            feedback: validationText,
            needsReview: hasProblems || (!isValid && validationText.length > 50)
        };
    }
}

module.exports = new ApiClient();
