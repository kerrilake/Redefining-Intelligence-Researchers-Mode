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
    
    // Streamlined prompt for faster, warmer responses matching PDF tone
    const prompt = `You are channeling the warm, wonder-filled voice from Kerri Lake's Redefining Intelligence research. Write about ${species} consciousness with deep respect and scientific grounding, revealing how they demonstrate intelligence that expands beyond human definitions.

Please provide inspiring insights about ${species}:

1. KEY WISDOM (3-5 sentences): Like the PDFs, reveal how ${species} embodies a unique expression of consciousness with extraordinary ways of perceiving, relating to, and applying intelligence. Show how their awareness demonstrates that intelligence is not a hierarchy but a magnificent spectrum where each species contributes irreplaceable gifts to the planetary intelligence network.

2. PERCEIVE (3-5 sentences): Describe their remarkable sensory capabilities and how they process information through multiple channels. Include specific examples of their perception abilities that showcase forms of awareness very different from our own.

3. RELATE (3-5 sentences): Explore their sophisticated social bonds, communication methods, and emotional intelligence. Show how they maintain relationships within their species and across the ecosystem in ways that demonstrate deep awareness.

4. APPLY (3-5 sentences): Illustrate how they use their intelligence through specific behaviors, problem-solving, and daily life applications. Include examples that show their mastery and wisdom in action.

5. TEMPORAL (3-5 sentences): Describe their relationship with time, cycles, and seasonal patterns. Show how they demonstrate temporal intelligence through migration, breeding, hibernation, or other time-based behaviors.

Format your response as JSON:
{
  "keyWisdom": "your key wisdom insight",
  "perceive": "detailed perception insights",
  "relate": "detailed relationship insights", 
  "apply": "detailed application insights",
  "temporal": "detailed temporal insights"
}

Match the tone from the research samples - scientifically accurate yet filled with wonder, showing each species as an equal participant in Earth's living intelligence network. Write as if helping readers fall in love with the profound intelligence of all life forms.`;

    // Call Anthropic API with adjusted timeout expectations
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500, // Increased for richer content
        temperature: 0.7,
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
    
    // Parse the JSON response from Claude
    let parsedResponse;
    try {
      const responseText = data.content[0].text;
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      // If JSON parsing fails, use the text as key wisdom
      parsedResponse = {
        keyWisdom: data.content[0].text,
        perceive: "Perception details being researched",
        relate: "Relationship details being researched",
        apply: "Application details being researched",
        temporal: "Temporal insights being researched"
      };
    }
    
    // Format the response to match what the frontend expects
    const formattedResponse = {
      success: true,
      response: {
        keyWisdom: parsedResponse.keyWisdom,
        perceive: {
          summary: "How they perceive their world",
          details: [parsedResponse.perceive]
        },
        relate: {
          summary: "How they relate to their world",
          details: [parsedResponse.relate]
        },
        apply: {
          summary: "How they apply their intelligence",
          details: [parsedResponse.apply]
        },
        temporal: parsedResponse.temporal,
        energetic: "Energetic intelligence insights available through expanded research",
        collective: "Collective wisdom insights available through expanded research",
        adaptive: "Adaptive strategies available through expanded research",
        quantumBiology: "Quantum biology insights available through expanded research",
        humanLearning: "Human learning opportunities available through expanded research",
        conservation: "Conservation intelligence available through expanded research"
      }
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
