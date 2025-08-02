// netlify/functions/research-species.js - DEBUG VERSION
exports.handler = async (event, context) => {
    console.log('🔥 FUNCTION CALLED - START');
    console.log('Method:', event.httpMethod);
    console.log('Body:', event.body);
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        console.log('🔥 CORS preflight request');
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'CORS preflight successful' }) };
    }

    if (event.httpMethod !== 'POST') {
        console.log('🔥 Wrong method:', event.httpMethod);
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed. Use POST.' }) };
    }

    let species = 'Unknown Species';

    try {
        console.log('🔥 Parsing request body...');
        const requestBody = JSON.parse(event.body || '{}');
        species = requestBody.species || 'Unknown Species';
        const options = requestBody.options || {};
        
        console.log('🔥 Species:', species);
        console.log('🔥 Options:', options);
        console.log('🔥 API Key available:', !!process.env.ANTHROPIC_API_KEY);
        console.log('🔥 API Key first 10 chars:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...' : 'MISSING');

        if (!requestBody.species) {
            console.log('🔥 Missing species parameter');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing species parameter',
                    received: requestBody
                })
            };
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            console.log('🔥 API key missing');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'API key not configured'
                })
            };
        }

        // Simple prompt for testing
        const prompt = `You are a species intelligence researcher. Research ${species} using the Perceive/Relate/Apply framework.

Respond with valid JSON only:
{
  "species": "${species}",
  "wisdomInsight": "A profound insight about ${species} intelligence (2-3 sentences)",
  "perceive": {
    "summary": "How ${species} perceives their world (2-3 sentences)",
    "details": ["perceptual capability 1", "capability 2", "capability 3", "quantum sensing"]
  },
  "relate": {
    "summary": "How ${species} relates to their world (2-3 sentences)", 
    "details": ["social structure", "communication", "ecological relationships", "consciousness connections"]
  },
  "apply": {
    "summary": "How ${species} applies intelligence (2-3 sentences)",
    "details": ["problem solving", "tool use", "learning", "ecosystem contributions"]
  },
  "temporalIntelligence": "Time perception abilities (3-4 sentences)",
  "energeticIntelligence": "Energy sensitivity and optimization (3-4 sentences)",
  "collectiveWisdom": "Group consciousness and collective decisions (3-4 sentences)",
  "adaptiveStrategies": "Adaptation and resilience mechanisms (3-4 sentences)",
  "humanLearnings": "What humans can learn from ${species} (3-4 sentences)",
  "conservationWisdom": "Conservation insights for ${species} (3-4 sentences)",
  "quantumAspects": "Quantum biology connections (2-3 sentences)",
  "sources": ["source1", "source2", "source3"]
}`;

        console.log('🔥 Making API call to Anthropic...');
        console.log('🔥 Prompt length:', prompt.length);
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 3000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        console.log('🔥 API Response status:', response.status);
        console.log('🔥 API Response ok:', response.ok);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('🔥 API Error response:', errorText);
            throw new Error(`API Error: ${response.status} - ${errorText.substring(0, 200)}`);
        }

        const apiData = await response.json();
        console.log('🔥 API Data received, content length:', apiData.content?.[0]?.text?.length || 0);
        
        const responseText = apiData.content?.[0]?.text || '';
        
        if (!responseText) {
            console.log('🔥 No response text from API');
            throw new Error('No response content from API');
        }

        console.log('🔥 Raw response first 200 chars:', responseText.substring(0, 200));

        // Clean and parse the response
        let cleanedResponse = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        
        // Try to extract JSON if wrapped in other text
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResponse = jsonMatch[0];
        }

        console.log('🔥 Cleaned response first 200 chars:', cleanedResponse.substring(0, 200));

        let parsedData;
        try {
            parsedData = JSON.parse(cleanedResponse);
            console.log('🔥 JSON parsed successfully!');
            console.log('🔥 Species in response:', parsedData.species);
        } catch (parseError) {
            console.log('🔥 JSON parse error:', parseError.message);
            console.log('🔥 Failed to parse, using fallback');
            throw new Error('Failed to parse AI response as JSON');
        }

        // Return successful AI response
        const finalResponse = {
            species: parsedData.species || species,
            wisdomInsight: parsedData.wisdomInsight || `${species} demonstrates remarkable intelligence.`,
            perceive: parsedData.perceive || { summary: "Advanced perception", details: ["Sensory capabilities"] },
            relate: parsedData.relate || { summary: "Complex relationships", details: ["Social structures"] },
            apply: parsedData.apply || { summary: "Problem-solving abilities", details: ["Tool use"] },
            temporalIntelligence: parsedData.temporalIntelligence || "Sophisticated time perception.",
            energeticIntelligence: parsedData.energeticIntelligence || "Energy optimization abilities.",
            collectiveWisdom: parsedData.collectiveWisdom || "Group decision-making capabilities.",
            adaptiveStrategies: parsedData.adaptiveStrategies || "Remarkable adaptation mechanisms.",
            humanLearnings: parsedData.humanLearnings || "Valuable lessons for humans.",
            conservationWisdom: parsedData.conservationWisdom || "Important conservation insights.",
            quantumAspects: parsedData.quantumAspects || "Potential quantum processes.",
            sources: parsedData.sources || ["AI research", "Scientific studies"],
            researchBacked: true,
            timestamp: new Date().toISOString()
        };

        console.log('🔥 SUCCESS - Returning AI response');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                species: species,
                response: finalResponse,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.log('🔥 ERROR caught:', error.message);
        console.log('🔥 Error stack:', error.stack);
        
        // Return fallback
        console.log('🔥 Returning fallback for species:', species);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                species: species,
                response: {
                    species: species,
                    wisdomInsight: `${species} represents a fascinating form of consciousness that demonstrates unique intelligence.`,
                    perceive: { summary: "Advanced sensory systems", details: ["Specialized perception"] },
                    relate: { summary: "Complex social relationships", details: ["Communication systems"] },
                    apply: { summary: "Problem-solving behaviors", details: ["Adaptive strategies"] },
                    temporalIntelligence: "Sophisticated temporal awareness and seasonal synchronization.",
                    energeticIntelligence: "Energy sensitivity and optimization capabilities.",
                    collectiveWisdom: "Group consciousness and collective decision-making.",
                    adaptiveStrategies: "Remarkable adaptation and resilience mechanisms.",
                    humanLearnings: "Valuable lessons for human consciousness development.",
                    conservationWisdom: "Important insights for species conservation.",
                    quantumAspects: "Potential quantum biological processes.",
                    sources: ["Framework analysis"],
                    researchBacked: false,
                    fallbackReason: error.message,
                    timestamp: new Date().toISOString()
                },
                timestamp: new Date().toISOString(),
                note: 'Using fallback due to: ' + error.message
            })
        };
    }
};
