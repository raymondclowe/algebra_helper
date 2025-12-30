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
            max_tokens: 1000,
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
            const validationText = data.choices?.[0]?.message?.content || '';
            
            return {
                success: true,
                validationText,
                metadata: {
                    model: data.model,
                    usage: data.usage
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
        const text = validationText.trim().toUpperCase();
        
        // Check for positive indicators
        const isValid = text.startsWith('OK') || 
                       text.startsWith('VALID') || 
                       text.includes('LOOKS GOOD') ||
                       text.includes('CORRECT');
        
        // Check for negative indicators
        const hasIssues = text.includes('INCORRECT') ||
                         text.includes('ERROR') ||
                         text.includes('WRONG') ||
                         text.includes('ISSUE') ||
                         text.includes('PROBLEM') ||
                         text.includes('FIX');
        
        return {
            isValid: isValid && !hasIssues,
            hasIssues: hasIssues,
            feedback: validationText,
            needsReview: hasIssues || (!isValid && validationText.length > 100)
        };
    }
}

module.exports = new ApiClient();
