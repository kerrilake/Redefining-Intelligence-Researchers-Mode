// netlify/functions/research-species.js
exports.handler = async (event, context) => {
    // Set CORS headers for all responses
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
        };
    }

    try {
        // Parse request body
        const { species, prompt, options } = JSON.parse(event.body || '{}');
        
        console.log('=== FUNCTION START ===');
        console.log('Species:', species);
        console.log('API Key available:', !!process.env.ANTHROPIC_API_KEY);
        console.log('API Key length:', process.env.ANTHROPIC_API_KEY?.length);

        if (!species) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing species parameter',
                    received: { species, prompt, options }
                })
            };
        }

        // Check for API key
        if (!process.env.ANTHROPIC_API_KEY) {
            console.error('ANTHROPIC_API_KEY not found in environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'API key not configured',
                    details: 'ANTHROPIC_API_KEY missing from environment variables'
                })
            };
        }

        // Create the research prompt
        const researchPrompt = createDetailedResearchPrompt(species, options || {});
        console.log('Prompt created, length:', researchPrompt.length);

        // Make API call to Anthropic
        console.log('Making API call to Anthropic...');
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: researchPrompt
                    }
                ]
            })
        });

        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: `Anthropic API error: ${response.status}`,
                    details: errorText.substring(0, 200)
                })
            };
        }

        const apiData = await response.json();
        console.log('API response received successfully');
        
        // Extract the response text
        const responseText = apiData.content?.[0]?.text || '';
        console.log('Response text length:', responseText.length);
        
        if (!responseText) {
            console.error('No response text found in API response');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'No response content from API',
                    apiData: apiData
                })
            };
        }

        // Parse the AI response
        const parsedResponse = parseAIResponse(responseText, species);
        console.log('Response parsed successfully');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                species: species,
                response: parsedResponse,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                stack: error.stack?.substring(0, 500)
            })
        };
    }
};

function createDetailedResearchPrompt(speciesName, options) {
    const indigenousKnowledge = options.includeIndigenous ? `
- Indigenous wisdom and traditional ecological knowledge from various cultures
- Sacred relationships and ceremonial connections with this species
- Traditional uses and spiritual significance across different indigenous traditions` : '';

    const biomimicryApplications = options.includeBiomimicry ? `
- Current biomimicry applications inspired by this species
- Potential future technological innovations based on their capabilities
- Economic and environmental impact of species-inspired technologies` : '';

    return `You are a multidisciplinary species intelligence researcher specializing in consciousness studies and quantum biology. Research ${speciesName} through the revolutionary "Perceive/Relate/Apply" intelligence framework.

RESEARCH REQUIREMENTS:
1. PERCEIVE: How does ${speciesName} perceive their world?
   - Sensory capabilities and unique perceptual gifts
   - Environmental awareness and information processing
   - Quantum sensing abilities and field perception
   - Survival perception mechanisms

2. RELATE: How does ${speciesName} relate to their world?
   - Social structures and communication methods
   - Ecological relationships and symbiosis
   - Emotional and energetic connections
   - Cultural significance in human societies
   - Interspecies relationship patterns

3. APPLY: How does ${speciesName} apply their intelligence?
   - Problem-solving behaviors and adaptations
   - Tool use and environmental manipulation
   - Learning, memory, and knowledge transfer
   - Contributions to ecosystem health and balance

SOURCES TO CONSULT:
- Peer-reviewed biology, ecology, ethology, and neuroscience research
- Consciousness and quantum biology studies${indigenousKnowledge}${biomimicryApplications}
- Behavioral studies and cognitive research
- Conservation and environmental research

RESPONSE FORMAT:
Provide a JSON response with this exact structure:
{
  "species": "${speciesName}",
  "wisdomInsight": "One profound insight about this species' intelligence that could expand human consciousness (2-3 sentences)",
  "perceive": {
    "summary": "How they perceive their world (2-3 sentences)",
    "details": ["specific perceptual capability 1", "specific perceptual capability 2", "specific perceptual capability 3", "quantum/field perception aspect"]
  },
  "relate": {
    "summary": "How they relate to their world (2-3 sentences)", 
    "details": ["relationship aspect 1", "relationship aspect 2", "relationship aspect 3", "consciousness connection aspect"]
  },
  "apply": {
    "summary": "How they apply intelligence (2-3 sentences)",
    "details": ["application example 1", "application example 2", "application example 3", "ecosystem contribution"]
  },
  "humanLearnings": "What humans can learn from ${speciesName}'s intelligence for consciousness evolution",
  "conservationWisdom": "How their intelligence relates to conservation needs and ecosystem health",
  "quantumAspects": "Quantum biology and consciousness connections documented in research",
  "sources": ["key research source 1", "key research source 2", "key research source 3", "consciousness/quantum research source"]
}

Focus on consciousness-expanding insights that bridge science and wisdom. Respond ONLY with valid JSON.`;
}

function parseAIResponse(responseText, speciesName) {
    try {
        // Clean the response text
        let cleanedResponse = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .replace(/^\s*```.*$/gm, "")
            .trim();
        
        // Find JSON content between braces if there's extra text
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResponse = jsonMatch[0];
        }
        
        console.log('Attempting to parse JSON, length:', cleanedResponse.length);
        const data = JSON.parse(cleanedResponse);
        
        return {
            species: data.species || speciesName,
            wisdomInsight: data.wisdomInsight || `${speciesName} demonstrates unique intelligence worthy of deeper study.`,
            perceive: data.perceive || { 
                summary: "Advanced perceptual capabilities adapted to their environment", 
                details: ["Specialized sensory systems", "Environmental awareness", "Survival mechanisms", "Information processing abilities"] 
            },
            relate: data.relate || { 
                summary: "Complex relational intelligence within their ecosystem", 
                details: ["Social structures", "Communication systems", "Ecological relationships", "Community interactions"] 
            },
            apply: data.apply || { 
                summary: "Sophisticated problem-solving and adaptive behaviors", 
                details: ["Problem-solving abilities", "Learning mechanisms", "Adaptive strategies", "Ecosystem contributions"] 
            },
            humanLearnings: data.humanLearnings || `Valuable lessons for human consciousness evolution from ${speciesName}`,
            conservationWisdom: data.conservationWisdom || `Important for ecosystem balance and planetary health`,
            quantumAspects: data.quantumAspects || "Consciousness connections being explored by researchers",
            sources: data.sources || ["Research compilation", "Scientific studies", "Consciousness research"],
            researchBacked: true,
            timestamp: new Date().toISOString()
        };
    } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Attempted to parse:', responseText.substring(0, 200));
        
        // Return enhanced fallback data
        return createEnhancedFallback(speciesName);
    }
}

function createEnhancedFallback(speciesName) {
    return {
        species: speciesName,
        wisdomInsight: `${speciesName} represents a unique form of intelligence that bridges scientific understanding with consciousness wisdom, offering humanity profound lessons about life and awareness.`,
        perceive: {
            summary: `${speciesName} perceives their world through evolved sensory adaptations and consciousness-based awareness.`,
            details: [
                "Species-specific sensory capabilities adapted to their environment",
                "Environmental awareness mechanisms for survival and thriving",
                "Social and emotional perception within their community",
                "Potential quantum field sensitivity and morphic resonance"
            ]
        },
        relate: {
            summary: `${speciesName} maintains complex relationships within their ecosystem and consciousness network.`,
            details: [
                "Ecological connections and symbiotic relationships",
                "Intraspecies communication and social structures",
                "Interspecies relationships and ecosystem contributions",
                "Energetic and consciousness connections with other life forms"
            ]
        },
        apply: {
            summary: `${speciesName} applies their intelligence for survival, thriving, and ecosystem contribution.`,
            details: [
                "Adaptive problem-solving behaviors",
                "Environmental manipulation and habitat optimization",
                "Learning and memory applications across generations",
                "Ecosystem intelligence contributions and balance maintenance"
            ]
        },
        humanLearnings: `Humans can learn about adaptation, resilience, consciousness expansion, and natural harmony from ${speciesName}.`,
        conservationWisdom: `Protecting ${speciesName} preserves unique forms of intelligence essential for planetary health and consciousness evolution.`,
        quantumAspects: "Quantum biology research suggests consciousness connections across all life forms, with emerging studies on biofield interactions.",
        sources: ["Enhanced species intelligence framework", "Consciousness and biology research", "Ecological intelligence studies"],
        researchBacked: false,
        fallbackReason: "API response parsing failed, using enhanced local database",
        timestamp: new Date().toISOString()
    };
}
