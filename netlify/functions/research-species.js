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

1. KEY WISDOM (3-5 sentences): Share something that makes the reader go "wow!" about ${species} consciousness. Talk about their unique brilliance and how they contribute to Earth's intelligence network. Make it feel like an exciting discovery about how consciousness shows up in unexpected ways in nature.

2. PERCEIVE (3-5 sentences): Start directly with specific, visual examples like "${species} can actually sense..." or "${species} detect..." Share concrete examples that help readers imagine experiencing the world through their senses. Use phrases like "What really gets me excited is..." within the description.

3. RELATE (3-5 sentences): Jump right into stories about their relationships like "${species} have figured out..." or "When ${species} communicate..." Paint pictures of how they connect and care for each other. Include phrases like "I've seen..." or "Scientists discovered..." within the flow.

4. APPLY (3-5 sentences): Start with action like "When ${species} face challenges..." or "${species} have mastered..." Give specific examples of their intelligence in action. Weave in phrases like "And my favorite part?" naturally within the description.

5. TEMPORAL (3-5 sentences): Begin with their time abilities like "${species} somehow know..." or "Every spring, ${species}..." Explain their relationship with cycles and seasons. Include natural phrases like "Scientists are still figuring out how..." within the narrative.

6. ENERGETIC (3-5 sentences): Start with their energy awareness like "${species} can detect..." or "${species} use electromagnetic..." Share their energy sensitivity as amazing abilities. Include "It's basically like..." to make it relatable.

7. COLLECTIVE (3-5 sentences): Begin with their group intelligence like "When ${species} work together..." or "The entire colony..." Describe their collective abilities with genuine awe. Use "somehow they all know..." type phrases naturally.

8. ADAPTIVE (3-5 sentences): Start with their adaptability like "${species} have developed..." or "Faced with new challenges, ${species}..." Show their innovative responses to change.

9. QUANTUM (2-3 sentences): Make quantum biology simple like "Scientists are discovering that ${species}..." Explain it accessibly with "It's basically nature's version of..." type comparisons.

10. HUMANLEARNING (3-4 sentences): Connect directly like "${species} teach us..." or "We could learn from ${species}..." Make it personal and practical for human life.

11. CONSERVATION (3-4 sentences): Make it matter immediately like "When we lose ${species}, we lose..." or "Protecting ${species} means..." Connect their intelligence to why they're irreplaceable.

Format as JSON. Write everything conversationally - like you're sharing amazing discoveries with a friend!

{
  "keyWisdom": "conversational key wisdom",
  "perceive": "conversational perception insights",
  "relate": "conversational relationship insights", 
  "apply": "conversational application insights",
  "temporal": "conversational temporal insights",
  "energetic": "conversational energetic insights",
  "collective": "conversational collective insights",
  "adaptive": "conversational adaptive insights",
  "quantumBiology": "conversational quantum insights",
  "humanLearning": "conversational human learning insights",
  "conservation": "conversational conservation insights"
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
        temporal: parsedResponse.temporal,
        energetic: parsedResponse.energetic || "Energetic intelligence insights available through expanded research",
        collective: parsedResponse.collective || "Collective wisdom insights available through expanded research",
        adaptive: parsedResponse.adaptive || "Adaptive strategies available through expanded research",
        quantumBiology: parsedResponse.quantumBiology || "Quantum biology insights available through expanded research",
        humanLearning: parsedResponse.humanLearning || "Human learning opportunities available through expanded research",
        conservation: parsedResponse.conservation || "Conservation intelligence available through expanded research"
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
