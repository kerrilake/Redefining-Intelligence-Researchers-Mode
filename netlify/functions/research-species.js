/**
 * DEBUG VERSION - Netlify Function: Species Intelligence Research
 * This version includes debugging to help us figure out the API key issue
 */

exports.handler = async (event, context) => {
  // Handle CORS (Cross-Origin Resource Sharing)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
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
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request from your frontend
    const { species, prompt, options } = JSON.parse(event.body);
    
    // DEBUG: Check if environment variable exists
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key starts with sk-ant:', apiKey ? apiKey.startsWith('sk-ant-') : false);
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'ANTHROPIC_API_KEY environment variable not found',
          debug: 'Environment variable is missing or empty'
        })
      };
    }

    if (!apiKey.startsWith('sk-ant-')) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid API key format',
          debug: 'API key should start with sk-ant-'
        })
      };
    }
    
    // Make the call to Claude AI
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    // DEBUG: Log the response status
    console.log('Claude API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Claude API Error Response:', errorText);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Claude API Error: ${response.status}`,
          debug: errorText,
          apiKeyCheck: 'API key was present and formatted correctly'
        })
      };
    }

    const data = await response.json();
    
    // Send the response back to your frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        response: data.content[0].text
      })
    };

  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        debug: 'Check Netlify function logs for more details'
      })
    };
  }
};
