// netlify/functions/research-species.js
// This is the serverless function that handles API requests from your frontend

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const { species, prompt, options } = JSON.parse(event.body);
        
        console.log('🔬 Netlify function received request for:', species);
        console.log('📝 Prompt length:', prompt.length);
        
        // Make the request to Anthropic API
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4000,
                temperature: 0.7,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        console.log('Claude API response status:', anthropicResponse.status);

        if (!anthropicResponse.ok) {
            const errorData = await anthropicResponse.json();
            console.error('Claude API error:', errorData);
            throw new Error(`Claude API error: ${anthropicResponse.status} - ${JSON.stringify(errorData)}`);
        }

        const claudeData = await anthropicResponse.json();
        
        // Extract the text content from Claude's response
        const responseText = claudeData.content[0].text;
        
        console.log('✅ Successfully received response from Claude');
        
        // Return success response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                response: responseText
            })
        };
        
    } catch (error) {
        console.error('❌ Error in Netlify function:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false,
                error: error.message,
                details: 'Failed to process species intelligence research request'
            })
        };
    }
};
