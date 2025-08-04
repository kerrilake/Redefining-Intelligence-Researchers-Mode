// netlify/functions/research-species.js
// This function bridges your Redefining Intelligence App to Claude API

exports.handler = async (event, context) => {
    // CORS headers for browser compatibility
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
        };
    }

    try {
        // Parse the request body
        const { species, prompt, options } = JSON.parse(event.body);
        
        console.log('🔬 Research request received:', { species, optionsCount: Object.keys(options || {}).length });

        // Validate required fields
        if (!species || !prompt) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Missing required fields: species and prompt' 
                })
            };
        }

        // Get Claude API key from environment variables
        const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
        
        if (!ANTHROPIC_API_KEY) {
            console.error('❌ ANTHROPIC_API_KEY not found in environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Server configuration error: API key not configured' 
                })
            };
        }

        console.log('🚀 Calling Claude API...');

        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Claude API error:', response.status, errorData);
            
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: `Claude API error: ${response.status}`,
                    details: errorData
                })
            };
        }

        const data = await response.json();
        console.log('✅ Claude API success, response length:', data.content?.[0]?.text?.length || 0);

        // Extract the text response from Claude's format
        const claudeResponse = data.content?.[0]?.text || '';

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                response: claudeResponse,
                metadata: {
                    species: species,
                    timestamp: new Date().toISOString(),
                    options: options
                }
            })
        };

    } catch (error) {
        console.error('🚨 Function error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: 'Internal server error: ' + error.message 
            })
        };
    }
};
