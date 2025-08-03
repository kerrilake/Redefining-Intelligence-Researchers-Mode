/**
 * ENHANCED DEBUG VERSION - Netlify Function: Species Intelligence Research
 */

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { species, prompt, options } = JSON.parse(event.body);
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    // Enhanced debugging
    console.log('=== ENHANCED DEBUG INFO ===');
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    console.log('API Key prefix:', apiKey ? apiKey.substring(0, 15) : 'N/A');
    console.log('API Key suffix:', apiKey ? apiKey.substring(apiKey.length - 10) : 'N/A');
    console.log('Species requested:', species);
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'ANTHROPIC_API_KEY environment variable not found'
        })
      };
    }

    // Test with a minimal request first
    const testPayload = {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: 'Say "API test successful" and nothing else.'
      }]
    };

    console.log('Making API request with payload:', JSON.stringify(testPayload));
    console.log('Request headers will include:');
    console.log('- Authorization: Bearer [API_KEY]');
    console.log('- anthropic-version: 2023-06-01');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(testPayload)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify([...response.headers.entries()]));
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Claude API Error: ${response.status}`,
          debug: responseText,
          apiKeyCheck: 'API key was present and formatted correctly',
          fullDebug: {
            status: response.status,
            statusText: response.statusText,
            headers: [...response.headers.entries()]
          }
        })
      };
    }

    const data = JSON.parse(responseText);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        response: data.content[0].text,
        debug: 'API call successful'
      })
    };

  } catch (error) {
    console.error('Function Error:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
};
