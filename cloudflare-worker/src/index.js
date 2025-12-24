/**
 * Cloudflare Worker AI Microservice for Student Worksheet Generation
 * 
 * This worker receives student performance data from the front-end,
 * uses AI to assess how the student should be helped, and returns
 * structured outlines or detailed questions for printable worksheets.
 * 
 * API Endpoints:
 * - POST /api/worksheet/analyze - Analyze student data and generate worksheet content
 * - GET /api/health - Health check endpoint
 */

import { handleWorksheetRequest } from './worksheet-handler.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers for front-end access
    // TODO: For production, replace '*' with your specific domain
    // Example: 'https://raymondclowe.github.io'
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }
    
    try {
      // Health check endpoint
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          version: '1.0.0',
          timestamp: new Date().toISOString()
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }
      
      // Worksheet generation endpoint
      if (url.pathname === '/api/worksheet/analyze' && request.method === 'POST') {
        return await handleWorksheetRequest(request, env, corsHeaders);
      }
      
      // 404 for unknown routes
      return new Response(JSON.stringify({ 
        error: 'Not Found',
        message: 'Available endpoints: GET /api/health, POST /api/worksheet/analyze'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};
