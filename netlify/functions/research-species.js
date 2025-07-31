// netlify/functions/research-species.js
exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
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
    console.log('Function called with:', event.body);
    
    const { species, prompt, options } = JSON.parse(event.body);
    console.log('Parsed request:', { species, hasPrompt: !!prompt, options });
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('No API key found');
      throw new Error('Anthropic API key not configured');
    }

    console.log('Making API call to Anthropic...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2500,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const apiResponse = await response.json();
    console.log('API response received successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: apiResponse.content[0].text,
        usage: apiResponse.usage,
        species: species,
        success: true
      })
    };

  } catch (error) {
    console.error('Research API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Research temporarily unavailable',
        message: error.message,
        success: false
      })
    };
  }
};
