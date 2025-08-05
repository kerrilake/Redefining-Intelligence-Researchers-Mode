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

1. KEY WISDOM (3-5 sentences): Start with something that makes the reader go "wow!" Like "You know what blows my mind about ${species}?" or "Here's the thing that gets me every time..." Share how they're absolutely brilliant in their own unique way. Talk about their consciousness like you're letting someone in on the coolest secret about how intelligence shows up in nature. Make it feel like an exciting discovery you just have to share!

2. PERCEIVE (3-5 sentences): Get specific and visual! Start with "Here's something wild -" or "Get this -" Share concrete examples that help readers imagine experiencing the world through their senses. Like "While we're limited to our eyes and ears, these magnificent beings..." Make it vivid and use phrases like "What really gets me excited is..."

3. RELATE (3-5 sentences): Tell stories about their relationships! Start with "You're going to love this -" or "Check this out -" Paint pictures of how they communicate and care for each other. Use phrases like "I've seen..." or "They've actually figured out..." Share it like you're describing the most fascinating social dynamics you've ever witnessed.

4. APPLY (3-5 sentences): Show their intelligence in action! Start with "Watch this -" or "Here's where it gets really cool -" Give specific examples like "During drought, they'll actually..." Use phrases like "And my favorite part?" Make readers appreciate their everyday genius with real, amazing behaviors.

5. TEMPORAL (3-5 sentences): Talk about their relationship with time like it's mind-blowing! Start with "Okay, this is where it gets really incredible -" or "You won't believe how they..." Explain how they know when to migrate or prepare for seasons with genuine excitement. Use phrases like "Scientists are still figuring out how they..." or "What amazes me is..."

6. ENERGETIC (3-5 sentences): Share their energy awareness like it's a superpower! Start with "Here's something that sounds like science fiction but is totally real -" Talk about their electromagnetic sensitivity or energy optimization. Use phrases like "They've basically figured out..." or "It's like they have a sixth sense for..."

7. COLLECTIVE (3-5 sentences): Describe their group intelligence with awe! Start with "This is the part that gives me goosebumps -" or "You know what's absolutely mind-blowing?" Share how they work together in ways that seem almost magical. Use phrases like "Together, they can..." or "The whole group somehow knows..."

8. ADAPTIVE (3-5 sentences): Show their adaptability like it's genius! Start with "Here's what really shows their brilliance -" Talk about how they adjust and innovate. Use phrases like "When faced with..." or "They've developed this incredible ability to..."

9. QUANTUM (2-3 sentences): Make quantum biology accessible! Start with "Scientists are discovering something absolutely wild -" Explain it simply like "It's basically like they're tapped into..." or "Think of it as nature's version of..."

10. HUMANLEARNING (3-4 sentences): Connect it to us! Start with "Here's what ${species} can teach us -" or "What I love about learning from ${species} is..." Make it personal and practical. Use phrases like "Imagine if we could..." or "They're basically showing us..."

11. CONSERVATION (3-4 sentences): Make it matter! Start with "Here's why protecting ${species} is so crucial -" or "What breaks my heart is..." Connect their unique intelligence to why we need them. Use phrases like "When we lose ${species}, we lose..." Make it feel urgent but hopeful.

Format as JSON, but write everything conversationally. Remember: you're sharing the coolest nature facts with your best friend - scientifically accurate but absolutely captivating and relatable!

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
