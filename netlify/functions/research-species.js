// netlify/functions/research-species.js
exports.handler = async (event, context) => {
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
    
    // Hybrid prompt combining depth with conversational warmth
    const researchPrompt = createHybridResearchPrompt(species, {});

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000, // Reduced to ensure faster response
        temperature: 0.75,
        messages: [{
          role: 'user',
          content: researchPrompt
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
      // Clean the response more thoroughly
      const cleanedResponse = responseText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .replace(/^\s+|\s+$/g, '')
        .trim();
      
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('JSON parsing error:', e.message);
      console.error('Raw response substring:', data.content[0].text.substring(0, 500));
      
      // If JSON parsing fails, return error with details
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to parse AI response',
          details: e.message,
          rawResponse: data.content[0].text.substring(0, 200) + '...'
        })
      };
    }
    
    // Format the response to match what the frontend expects
    const formattedResponse = {
      success: true,
      response: {
        wisdomInsight: parsedResponse.keyWisdom,
        perceive: {
          summary: parsedResponse.perceive.summary || "How they perceive their world",
          details: parsedResponse.perceive.details || [parsedResponse.perceive]
        },
        relate: {
          summary: parsedResponse.relate.summary || "How they relate to their world",
          details: parsedResponse.relate.details || [parsedResponse.relate]
        },
        apply: {
          summary: parsedResponse.apply.summary || "How they apply their intelligence",
          details: parsedResponse.apply.details || [parsedResponse.apply]
        },
        temporalIntelligence: parsedResponse.temporal,
        energeticIntelligence: parsedResponse.energetic,
        collectiveWisdom: parsedResponse.collective,
        adaptiveStrategies: parsedResponse.adaptive,
        quantumAspects: parsedResponse.quantumBiology,
        humanLearnings: parsedResponse.humanLearning,
        conservationWisdom: parsedResponse.conservation,
        sources: parsedResponse.sources || []
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

function createHybridResearchPrompt(species, options) {
  return `You're a brilliant scientist who makes research accessible and exciting, like that favorite professor who helps people fall in love with life's intelligence. Share discoveries about ${species} consciousness with warmth, wonder, and consciousness-expanding language that weaves research naturally into inspiring narratives.

Create content that works for both academics and general readers - like a TED talk with citations that makes awareness expand as people read.

VOICE GUIDELINES:
- Write conversationally as if sharing exciting discoveries with a curious friend
- Use consciousness-expanding metaphors: "chemical conversations," "bio-sonar symphonies," "electromagnetic memory," "consciousness networks"
- Naturally integrate quantum concepts and field awareness
- Honor indigenous wisdom alongside scientific research
- Transform clinical language: instead of "exhibits behaviors" → "expresses wisdom through"
- Make complex concepts feel accessible and wonder-filled

For ${species}, provide:

1. KEY WISDOM (3-4 sentences): A consciousness-expanding insight about their intelligence that makes readers think "whoa!" Include one research reference woven naturally into the narrative.

2. PERCEIVE (3-4 sentences): How they sense their world through consciousness-based perception. Include a specific study or researcher woven into flowing language.
   Details: 4 brief sensory capabilities using vivid, relatable descriptions

3. RELATE (3-4 sentences): Their social/communication abilities as consciousness collaboration. Include research examples flowing naturally.
   Details: 4 brief relationship aspects using consciousness network language

4. APPLY (3-4 sentences): Intelligence applications as creative problem-solving wisdom. Include documented cases naturally integrated.
   Details: 4 brief applications described as consciousness expressions

5. TEMPORAL (3-4 sentences): Time awareness as consciousness dancing through different temporal dimensions. Include chronobiology research naturally.

6. ENERGETIC (3-4 sentences): Biofield/electromagnetic abilities as consciousness frequency interactions. Include scientific backing with wonder.

7. COLLECTIVE (3-4 sentences): Group intelligence as consciousness networks and collaborative wisdom. Include research examples.

8. ADAPTIVE (3-4 sentences): Resilience as consciousness creativity responding to life's challenges. Include documented adaptations.

9. QUANTUM (2-3 sentences): Quantum biology as consciousness operating through field effects. Include researcher names naturally.

10. HUMANLEARNING (3-4 sentences): What we can learn from ${species} consciousness to expand our own awareness and intelligence.

11. CONSERVATION (3-4 sentences): Why protecting their consciousness contributions matters for planetary intelligence networks. Include data naturally.

12. SOURCES: 6 credible sources mixing journals, researchers, and organizations.

Format as clean JSON. Weave research naturally into consciousness-expanding narratives, not as formal citations. Keep responses academically robust while feeling like inspired conversation that makes awareness expand.

{
  "keyWisdom": "text",
  "perceive": {"summary": "text", "details": ["1","2","3","4"]},
  "relate": {"summary": "text", "details": ["1","2","3","4"]},
  "apply": {"summary": "text", "details": ["1","2","3","4"]},
  "temporal": "text",
  "energetic": "text",
  "collective": "text",
  "adaptive": "text",
  "quantumBiology": "text",
  "humanLearning": "text",
  "conservation": "text",
  "sources": ["1","2","3","4","5","6"]
}`;
}
