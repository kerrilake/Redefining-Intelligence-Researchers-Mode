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
    const prompt = `You're that cool biology professor who makes everyone actually excited about nature - friendly, genuinely stoked about your subject, and great at explaining complex stuff in ways that click. Share discoveries about ${species} consciousness like you're talking to curious college students who want the real story.

Please share insights about ${species} in a conversational, engaging way that young adults will connect with:

1. KEY WISDOM (3-5 sentences): Share something genuinely mind-blowing about ${species} consciousness. Make it feel like you're letting them in on something most people don't know about how intelligence works in nature. Keep it real but amazing.

2. PERCEIVE (3-5 sentences): Jump into specific examples like "${species} can actually sense..." Share concrete stuff that makes people rethink what perception even means. Weave in "what's wild is..." or "the crazy part is..." naturally.

3. RELATE (3-5 sentences): Tell real stories about how they connect, like "${species} basically figured out..." Make their social lives sound as interesting as they actually are. Use "researchers found..." or "we've seen..." to back it up.

4. APPLY (3-5 sentences): Show their problem-solving in action. Start with "When ${species} need to..." Give examples that make people respect their intelligence. Include "what's clever is..." type observations.

5. TEMPORAL (3-5 sentences): Explain their time sense like "${species} somehow track..." Make it relatable - like how we know when seasons change but way more precise. Include "scientists think..." to show it's cutting-edge.

6. ENERGETIC (3-5 sentences): Describe their energy awareness simply. "${species} pick up on electromagnetic..." Explain it like a real ability, not magic. Use comparisons like "kind of like how we feel static electricity but way more refined."

7. COLLECTIVE (3-5 sentences): Their group intelligence - "${species} coordinate..." Make it sound as sophisticated as it is. Include "the whole group somehow..." to capture the mystery.

8. ADAPTIVE (3-5 sentences): How they handle change - "${species} adapt by..." Show they're not just reacting but actually strategizing. Make it clear why this matters for survival.

9. QUANTUM (2-3 sentences): Keep quantum stuff accessible - "New research shows ${species} might use quantum effects for..." Compare to everyday tech when possible.

10. HUMANLEARNING (3-4 sentences): Make it relevant - "${species} show us..." Connect to things college students care about - creativity, problem-solving, community, sustainability.

11. CONSERVATION (3-4 sentences): Why it matters now - "Losing ${species} means losing..." Make it personal and urgent without preaching. Connect to their future.

Format as JSON. Write like you're genuinely excited to share this with people who'll appreciate how cool it is!

{
  "keyWisdom": "engaging key wisdom",
  "perceive": "engaging perception insights",
  "relate": "engaging relationship insights", 
  "apply": "engaging application insights",
  "temporal": "engaging temporal insights",
  "energetic": "engaging energetic insights",
  "collective": "engaging collective insights",
  "adaptive": "engaging adaptive insights",
  "quantumBiology": "engaging quantum insights",
  "humanLearning": "engaging human learning insights",
  "conservation": "engaging conservation insights"
}`;

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
        max_tokens: 2500, // Increased for all sections
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
        temporal: "Temporal insights being researched",
        energetic: "Energetic insights being researched",
        collective: "Collective insights being researched",
        adaptive: "Adaptive insights being researched",
        quantumBiology: "Quantum insights being researched",
        humanLearning: "Learning insights being researched",
        conservation: "Conservation insights being researched"
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
        // These need to be at the root level of 'response' for the frontend to find them
        temporalIntelligence: parsedResponse.temporal,
        energeticIntelligence: parsedResponse.energetic || parsedResponse.energeticIntelligence,
        collectiveWisdom: parsedResponse.collective || parsedResponse.collectiveWisdom,
        adaptiveStrategies: parsedResponse.adaptive || parsedResponse.adaptiveStrategies,
        quantumBiology: parsedResponse.quantumBiology,
        humanLearnings: parsedResponse.humanLearning || parsedResponse.humanLearnings,
        conservationWisdom: parsedResponse.conservation || parsedResponse.conservationWisdom
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
