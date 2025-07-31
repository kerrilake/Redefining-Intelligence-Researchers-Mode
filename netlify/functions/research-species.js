// netlify/functions/research-species.js
const https = require('https');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key not configured');
    }

    const requestData = JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2500,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const requestOptions = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(requestData);
      req.end();
    });

    if (response.statusCode !== 200) {
      throw new Error(`Anthropic API error: ${response.statusCode}`);
    }

    const apiResponse = JSON.parse(response.data);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: apiResponse.content[0].text,
        usage: apiResponse.usage,
        species: species
      })
    };

  } catch (error) {
    console.error('Research API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Research temporarily unavailable',
        message: error.message
      })
    };
  }
};
