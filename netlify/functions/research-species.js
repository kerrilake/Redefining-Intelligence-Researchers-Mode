// netlify/functions/research-species.js
export async function handler(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
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
    const { species } = JSON.parse(event.body);
    
    if (!species) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Species parameter is required' })
      };
    }

    console.log(`Researching species: ${species}`);
    
    // Streamlined prompt for faster, warmer responses
    const prompt = `You are a warm, compassionate researcher exploring the consciousness of ${species} through Kerri Lake's Perceive/Relate/Apply framework.

In 3-5 sentences, share an insight about ${species} that:
- Reveals their unique form of intelligence and consciousness
- Shows how they're equal participants in Earth's family of life (not inferior or superior)
- Connects their wisdom to the larger planetary intelligence network
- Feels both scientifically grounded and personally meaningful
- Inspires wonder and respect rather than hierarchy

Write in a warm, accessible tone that would resonate with someone interested in interspecies communication and consciousness. Focus on one key insight that shifts perspective from human-centric to life-centric understanding.`;

    // Call Anthropic API with shorter timeout expectations
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300, // Reduced for faster response
        temperature: 0.7, // Balanced creativity and consistency
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      console.error('Anthropic API error:', response.status);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: `API Error: ${response.status}`,
          details: errorText 
        })
      };
    }

    const data = await response.json();
    
    // Extract the content from Claude's response
    const keyWisdom = data.content[0].text;
    
    // Format the response to match the expected structure
    const formattedResponse = {
      keyWisdom: keyWisdom,
      perceive: "Full perception details available through expanded research",
      relate: "Full relationship details available through expanded research",
      apply: "Full application details available through expanded research",
      temporal: "Temporal intelligence insights available through expanded research",
      energetic: "Energetic intelligence insights available through expanded research",
      collective: "Collective wisdom insights available through expanded research",
      adaptive: "Adaptive strategies available through expanded research",
      quantumBiology: "Quantum biology insights available through expanded research",
      humanLearning: "Human learning opportunities available through expanded research",
      conservation: "Conservation intelligence available through expanded research"
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formattedResponse)
    };
    
  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
}
