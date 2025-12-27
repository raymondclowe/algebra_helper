/**
 * Worksheet Handler - Core logic for generating personalized worksheets
 * 
 * This module processes student data, uses Cloudflare Workers AI to analyze
 * performance patterns and generate targeted exercises for habit improvement.
 */

/**
 * Validate incoming student data
 */
function validateStudentData(data) {
  const errors = [];
  
  if (!data.studentName || typeof data.studentName !== 'string') {
    errors.push('studentName is required and must be a string');
  }
  
  if (!data.errorPatterns || typeof data.errorPatterns !== 'object') {
    errors.push('errorPatterns is required and must be an object');
  }
  
  if (!data.performanceHistory || !Array.isArray(data.performanceHistory)) {
    errors.push('performanceHistory is required and must be an array');
  }
  
  return errors;
}

/**
 * Build AI prompt for analyzing student performance
 */
function buildAnalysisPrompt(studentData) {
  const { studentName, errorPatterns, performanceHistory, weaknessAreas, level } = studentData;
  
  // Summarize error patterns
  const errorSummary = Object.entries(errorPatterns || {})
    .map(([type, count]) => `- ${type}: ${count} occurrences`)
    .join('\n');
  
  // Summarize recent performance
  const recentPerformance = performanceHistory.slice(-10).map(item => 
    `${item.topic}: ${item.correct}/${item.total} correct`
  ).join('\n');
  
  const prompt = `You are an expert IB Mathematics HL Analysis & Approaches tutor creating personalized practice worksheets.

Student Name: ${studentName}
Current Level: ${level || 'Unknown'}

ERROR PATTERNS (habits to fix):
${errorSummary || 'No significant error patterns yet'}

RECENT PERFORMANCE:
${recentPerformance || 'No recent performance data'}

IDENTIFIED WEAKNESSES:
${(weaknessAreas || []).join(', ') || 'None identified'}

Your task is to:
1. Analyze the student's error patterns and identify the 2-3 most critical habits to improve
2. For each habit, explain WHY it's important to fix it (how it costs IB exam points)
3. Generate 5-8 targeted practice questions that will help develop muscle memory for the correct approach
4. Provide clear rationale for how these exercises address the specific habits

Use positive, encouraging language. Focus on gaining exam points through habit development, not on "fixing mistakes."

Format your response as a structured JSON object with this exact structure:
{
  "worksheetTitle": "Habit Improvement Practice - [Focus Area]",
  "headerMessage": "This is to help you gain more IB exam points by developing your habit / muscle memory...",
  "targetHabits": [
    {
      "habitName": "Brief name",
      "description": "What the habit is",
      "importance": "Why fixing this gains IB points",
      "examPointsAtRisk": "Number of points typically lost"
    }
  ],
  "exercises": [
    {
      "questionNumber": 1,
      "question": "The problem statement in LaTeX format",
      "hints": ["Hint 1", "Hint 2"],
      "correctAnswer": "The answer in LaTeX",
      "commonMistake": "What students typically do wrong",
      "keyReminder": "What to remember for this type"
    }
  ],
  "rationale": "Overall explanation of how these exercises build the right habits"
}`;

  return prompt;
}

/**
 * Parse and validate AI response
 */
function parseAIResponse(aiOutput) {
  try {
    // Check if aiOutput is already parsed (object) or needs parsing (string)
    let parsed;
    if (typeof aiOutput === 'string') {
      parsed = JSON.parse(aiOutput);
    } else if (typeof aiOutput === 'object' && aiOutput !== null) {
      parsed = aiOutput;
    } else {
      throw new Error('Invalid AI response type');
    }
    
    // Validate structure
    if (!parsed.worksheetTitle || !parsed.headerMessage || !parsed.targetHabits || !parsed.exercises) {
      throw new Error('Invalid AI response structure');
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    // Return a fallback structure
    return {
      worksheetTitle: "Habit Improvement Practice",
      headerMessage: "This is to help you gain more IB exam points by developing your habit / muscle memory to automatically do the right thing when writing answers.",
      targetHabits: [
        {
          habitName: "Careful Problem Analysis",
          description: "Taking time to understand what the question is asking before starting",
          importance: "Ensures you answer the actual question and don't waste time on wrong approaches",
          examPointsAtRisk: "2-3 points per question"
        }
      ],
      exercises: [],
      rationale: "Practice builds automatic responses. By working through targeted exercises, you develop muscle memory for the correct approach.",
      error: "AI response parsing failed - using fallback structure"
    };
  }
}

/**
 * Main handler for worksheet generation requests
 */
export async function handleWorksheetRequest(request, env, corsHeaders) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate student data
    const validationErrors = validateStudentData(body);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({
        error: 'Validation Error',
        details: validationErrors
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
    
    // Build AI prompt
    const prompt = buildAnalysisPrompt(body);
    
    // Call Cloudflare Workers AI with error handling
    let aiResponse;
    try {
      // Using @cf/meta/llama-2-7b-chat-int8 model (good balance of quality and speed)
      // See: https://developers.cloudflare.com/workers-ai/models/
      aiResponse = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.7,
      });
      
      if (!aiResponse || (!aiResponse.response && !aiResponse)) {
        throw new Error('AI service returned empty response');
      }
    } catch (aiError) {
      console.error('AI service error:', aiError);
      return new Response(JSON.stringify({
        error: 'AI Service Error',
        message: 'The AI service is temporarily unavailable. Please try again later.',
        details: aiError.message
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
    
    // Parse AI response
    const worksheetData = parseAIResponse(aiResponse.response || aiResponse);
    
    // Add metadata
    worksheetData.generatedAt = new Date().toISOString();
    worksheetData.studentName = body.studentName;
    worksheetData.currentLevel = body.level;
    
    // Return structured worksheet data
    return new Response(JSON.stringify({
      success: true,
      data: worksheetData
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
    
  } catch (error) {
    console.error('Worksheet generation error:', error);
    return new Response(JSON.stringify({
      error: 'Worksheet Generation Failed',
      message: error.message,
      details: 'An error occurred while generating the worksheet. Please try again.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}
