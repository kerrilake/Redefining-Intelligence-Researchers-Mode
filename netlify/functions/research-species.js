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
    const prompt = `You are that favorite science teacher who makes everyone fall in love with nature - warm, excited, and great at making complex ideas feel like fascinating conversations. Share discoveries about ${species} consciousness as if talking to a friend who's genuinely curious.

Please share insights about ${species} in a conversational, wonder-filled way:

1. KEY WISDOM (3-5 sentences): Start with something that makes the reader go "wow!" Share how ${species} are absolutely brilliant in their own unique way. Talk about their consciousness like you're sharing an exciting secret about how intelligence shows up in unexpected forms all around us. Make it personal and relatable.

2. PERCEIVE (3-5 sentences): Get specific and visual! Instead of "exhibits sensory capabilities," try "You know how we see colors? Well, ${species}..." Share concrete examples that help readers imagine experiencing the world through their senses. Make it vivid and amazing.

3. RELATE (3-5 sentences): Tell stories about their relationships and connections. Instead of clinical descriptions, paint pictures of how they communicate, care for each other, or work together. Share it like you're describing friends with fascinating social lives.

4. APPLY (3-5 sentences): Show their intelligence in action with real examples. Rather than abstract concepts, give specific "here's what they actually do" moments that showcase their brilliance. Make readers appreciate their everyday genius.

5. TEMPORAL (3-5 sentences): Talk about their relationship with time like it's a superpower. How do they know when to migrate? How do they prepare for seasons? Share it with the excitement of revealing nature's hidden calendars.

Format as JSON, but write conversationally:
{
  "keyWisdom": "conversational key wisdom",
  "perceive": "conversational perception insights",
  "relate": "conversational relationship insights", 
  "apply": "conversational application insights",
  "temporal": "conversational temporal insights"
}

Avoid starting with "${species} demonstrates..." or "${species} exhibits..." Instead, use phrases like:
- "Here's something amazing about ${species}..."
- "You know what's incredible?"
- "Scientists just discovered that ${species}..."
- "Imagine being able to..."
- "What really gets me excited is..."

Write like you're sharing the coolest nature facts with your best friend - scientifically accurate but absolutely captivating and relatable!`;

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
        temperature: 0.8, // Slightly higher for more conversational tone
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
