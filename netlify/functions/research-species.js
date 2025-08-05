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
    const { species, prompt, options } = JSON.parse(event.body || '{}');
    
    if (!species) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Species parameter is required' })
      };
    }

    console.log(`Researching species: ${species}`);
    
    // Hybrid prompt combining depth with conversational warmth
    const researchPrompt = createHybridResearchPrompt(species, options || {});

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
        max_tokens: 3500, // Increased for comprehensive content
        temperature: 0.75, // Balanced for accuracy and warmth
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
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      // If JSON parsing fails, return error
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to parse AI response',
          details: e.message 
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

function createHybridResearchPrompt(speciesName, options) {
  const indigenousWisdom = options.includeIndigenous ? `
- Indigenous wisdom and traditional ecological knowledge with specific cultural examples
- Sacred relationships and ceremonial connections documented across traditions
- Traditional uses, spiritual significance, and ancestral teachings about ${speciesName}` : '';

  const biomimicryApplications = options.includeBiomimicry ? `
- Current biomimicry applications with specific examples and researchers
- Potential future innovations based on their unique capabilities
- Economic and environmental impact of ${speciesName}-inspired technologies` : '';

  return `You're that brilliant professor who makes everyone fall in love with science - warm, genuinely excited, and able to explain complex research in ways that spark wonder. You're researching ${speciesName} consciousness for both academic publication AND public engagement.

Your research uses the revolutionary "Perceive/Relate/Apply" framework that recognizes intelligence as relational rather than hierarchical. Balance scientific rigor with conversational warmth - think "fascinating research paper meets engaging TED talk."

RESEARCH APPROACH:
Provide comprehensive insights that are scientifically grounded but written with genuine excitement. Include specific research citations naturally within conversational explanations. Make readers feel the wonder of discovery while respecting academic standards.

Please provide insights about ${speciesName} with this structure:

1. KEY WISDOM (4-5 sentences): Open with something genuinely mind-blowing about ${species} consciousness. Share it like you're revealing an incredible discovery to colleagues who'll appreciate both the science and the wonder. Include at least one research reference naturally woven in. Make it feel like the most important thing you've learned about consciousness.

2. PERCEIVE (4-5 sentences with research depth):
   Summary: Explain their sensory world in a way that makes people rethink perception itself. Start directly with their abilities, like "${species} can actually..." Include specific mechanisms and research findings conversationally.
   Details: 4 specific capabilities backed by research, each fascinating and concrete

3. RELATE (4-5 sentences with examples):
   Summary: Share how they connect and communicate like you're describing a sophisticated society. Include documented behaviors and research observations that showcase their relational intelligence.
   Details: 4 specific relationship aspects with examples from field studies

4. APPLY (4-5 sentences with documented cases):
   Summary: Show their problem-solving brilliance through real examples. Make readers respect their intelligence through specific documented behaviors and innovations.
   Details: 4 applications of intelligence with research backing

5. TEMPORAL (4-5 rich sentences): Explain their relationship with time like it's a superpower backed by chronobiology research. Include specific examples of circadian rhythms, seasonal awareness, or migration timing. Reference studies naturally: "Researchers at [institution] discovered that ${species}..." Make their temporal awareness sound as sophisticated as it really is.

6. ENERGETIC (4-5 detailed sentences): Describe their biofield awareness and electromagnetic sensitivity with scientific backing. Explain it like a real biological capability: "Studies show ${species} detect magnetic fields through [mechanism]..." Include research on navigation, energy optimization, or biofield interactions. Make it credible and amazing.

7. COLLECTIVE (4-5 comprehensive sentences): Their group intelligence deserves awe and research citations. Describe emergent behaviors, collective decision-making, or swarm intelligence with specific examples. Include phrases like "Research teams documented..." or "Studies reveal..." Make their collective wisdom sound as sophisticated as any technology.

8. ADAPTIVE (4-5 rich sentences): Show their resilience and innovation through documented examples. Include specific cases of adaptation, behavioral flexibility, or evolutionary responses. Reference conservation studies or behavioral research. Make their adaptability sound like the survival genius it is.

9. QUANTUM (3-4 sentences with current research): Make quantum biology accessible but credible. Reference specific researchers or institutions: "Work by [researcher] suggests..." Explain quantum coherence, entanglement, or field effects in relatable terms. Keep it scientifically grounded while maintaining wonder.

10. HUMANLEARNING (4-5 meaningful sentences): Connect their intelligence to human potential and societal needs. What can ${species} teach us about consciousness, cooperation, or sustainability? Include practical applications and consciousness insights. Make it personally relevant and inspiring.

11. CONSERVATION (4-5 urgent but hopeful sentences): Blend scientific data with emotional connection. Include population statistics, threat assessments, and conservation success stories where available. Reference specific conservation organizations or studies. Make readers understand why protecting ${species} intelligence matters for planetary consciousness.

12. SOURCES: Include 6-8 credible sources mixing:
    - Peer-reviewed studies with journal names and years
    - Leading researchers and their institutions
    - Conservation organizations with specific programs
    - Indigenous knowledge sources where documented
    ${indigenousWisdom}${biomimicryApplications}

Format as JSON. Write everything with the warm excitement of sharing incredible discoveries, while maintaining scientific credibility through specific examples and research references woven naturally into the narrative.

{
  "keyWisdom": "engaging wisdom with research backing",
  "perceive": {
    "summary": "conversational but detailed perception overview",
    "details": ["specific capability with research", "second capability with mechanism", "third capability with example", "fourth capability with study reference"]
  },
  "relate": {
    "summary": "warm but comprehensive relationship overview",
    "details": ["social structure with research", "communication with documented signals", "ecological relationship with examples", "consciousness connection with evidence"]
  },
  "apply": {
    "summary": "exciting but detailed application overview",
    "details": ["problem-solving with case study", "innovation with documentation", "learning with research backing", "ecosystem contribution with examples"]
  },
  "temporal": "rich temporal intelligence description with research citations woven naturally",
  "energetic": "detailed energetic intelligence with scientific backing presented conversationally",
  "collective": "comprehensive collective wisdom with research examples shared excitedly",
  "adaptive": "rich adaptive strategies with documented cases presented warmly",
  "quantumBiology": "accessible quantum biology with current research explained clearly",
  "humanLearning": "meaningful human connections with practical applications",
  "conservation": "urgent conservation message with data and hope",
  "sources": ["Specific journal article with year", "Research team and institution", "Conservation organization and program", "Additional credible sources..."]
}`;
}
