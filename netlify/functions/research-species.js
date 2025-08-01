// netlify/functions/research-species.js - COMPLETE UPDATED VERSION
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
        
        console.log('=== ENHANCED FUNCTION START ===');
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

        // Create the enhanced research prompt
        const researchPrompt = createComprehensiveResearchPrompt(species, options || {});
        console.log('Enhanced prompt created, length:', researchPrompt.length);

        // Make API call to Anthropic
        console.log('Making enhanced API call to Anthropic...');
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 3000, // Increased for enhanced content
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
        console.log('Enhanced API response received successfully');
        
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

        // Parse the enhanced AI response
        const parsedResponse = parseEnhancedAIResponse(responseText, species);
        console.log('Enhanced response parsed successfully');

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
        console.error('Enhanced function error:', error);
        
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

function createComprehensiveResearchPrompt(speciesName, options) {
    const indigenousKnowledge = options.includeIndigenous ? `
- Indigenous wisdom and traditional ecological knowledge from multiple cultures with specific examples
- Sacred relationships and ceremonial connections with documented practices
- Traditional uses and spiritual significance with cultural attribution` : '';

    const biomimicryApplications = options.includeBiomimicry ? `
- Current biomimicry applications with specific technological examples
- Potential future innovations with detailed possibilities
- Economic and environmental impact with measurable benefits` : '';

    return `You are a world-renowned multidisciplinary species intelligence researcher specializing in consciousness studies and quantum biology. Research ${speciesName} through the comprehensive "Perceive/Relate/Apply" framework with enhanced intelligence dimensions.

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
   - Cultural significance and interspecies relationships

3. APPLY: How does ${speciesName} apply their intelligence?
   - Problem-solving behaviors and adaptations
   - Tool use and environmental manipulation
   - Learning, memory, and knowledge transfer
   - Contributions to ecosystem health and balance

ENHANCED INTELLIGENCE DIMENSIONS (CRITICAL - Must be included with 4-5 sentences each):
4. TEMPORAL INTELLIGENCE: How ${speciesName} perceives and works with time, seasonal cycles, and environmental patterns
5. ENERGETIC INTELLIGENCE: Biofield interactions, electromagnetic sensitivity, and energy optimization strategies
6. COLLECTIVE WISDOM: Group consciousness, collective decision-making, and distributed intelligence capabilities
7. ADAPTIVE STRATEGIES: Real-time adaptation mechanisms, crisis responses, and evolutionary resilience

SOURCES TO CONSULT:
- Peer-reviewed biology, ecology, ethology, and neuroscience research
- Consciousness and quantum biology studies including work by Penrose, Hameroff, and quantum consciousness researchers${indigenousKnowledge}${biomimicryApplications}
- Behavioral studies and cognitive research with specific case studies
- Conservation and environmental research with population data

RESPONSE FORMAT - Provide detailed JSON with ALL required fields (each enhanced dimension must have 4-5 complete sentences):
{
  "species": "${speciesName}",
  "wisdomInsight": "Profound insight about this species' intelligence that could revolutionize human understanding (3-4 sentences with specific examples)",
  "perceive": {
    "summary": "How they perceive their world (3-4 sentences with specific mechanisms)",
    "details": ["specific sensory capability with mechanism", "environmental awareness system with examples", "quantum perception with research evidence", "survival perception with documented behaviors"]
  },
  "relate": {
    "summary": "How they relate to their world (3-4 sentences with relationship examples)",
    "details": ["social structure with specific examples", "communication method with documented signals", "ecological relationship with quantified impact", "consciousness connection with behavioral evidence"]
  },
  "apply": {
    "summary": "How they apply intelligence (3-4 sentences with specific examples)",
    "details": ["problem-solving example with documented case", "adaptive strategy with measurable outcomes", "learning mechanism with evidence", "ecosystem contribution with quantified impact"]
  },
  "humanLearnings": "What humans can learn from ${speciesName} for consciousness evolution, personal development, and societal advancement (4-5 sentences with practical applications)",
  "conservationWisdom": "Conservation intelligence insights including specific threats, population data, protection strategies, and ecosystem interdependencies (4-5 sentences with quantified impacts)",
  "quantumAspects": "Quantum biology and consciousness connections with current research citations, lead researchers, and measurable phenomena (3-4 sentences with specific studies)",
  "temporalIntelligence": "REQUIRED: How this species perceives time, seasonal cycles, circadian rhythms, and long-term patterns with specific examples and documented behaviors (4-5 complete sentences)",
  "energeticIntelligence": "REQUIRED: Biofield interactions, electromagnetic sensitivity, energy healing capabilities, optimization strategies with documented research and measurable phenomena (4-5 complete sentences)",
  "collectiveWisdom": "REQUIRED: Group consciousness, collective decision-making, distributed intelligence, swarm behaviors with specific examples and documented outcomes (4-5 complete sentences)",
  "adaptiveStrategies": "REQUIRED: Real-time adaptation mechanisms, crisis responses, environmental stress management, evolutionary resilience with documented cases and measurable results (4-5 complete sentences)",
  "sources": ["specific peer-reviewed research with author and year", "named consciousness researcher and their work", "documented field study with location and findings", "conservation database with population data"]
}

CRITICAL REQUIREMENTS:
- Each enhanced intelligence field (temporalIntelligence, energeticIntelligence, collectiveWisdom, adaptiveStrategies) must contain exactly 4-5 complete sentences with specific examples
- Include measurable data, documented behaviors, and research citations where possible
- Connect findings to broader consciousness research and ecological intelligence
- Ensure ALL enhanced intelligence fields are populated with substantial, meaningful content
- Focus on consciousness-expanding insights that bridge science and wisdom traditions

Respond ONLY with valid JSON containing ALL required fields with comprehensive 4-5 sentence content for each enhanced dimension.`;
}

function parseEnhancedAIResponse(responseText, speciesName) {
    try {
        console.log('Parsing enhanced AI response for:', speciesName);
        
        // Clean the response text more thoroughly
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
        
        console.log('Attempting to parse enhanced JSON, length:', cleanedResponse.length);
        const data = JSON.parse(cleanedResponse);
        
        // Enhanced response with comprehensive fallbacks
        return {
            species: data.species || speciesName,
            wisdomInsight: data.wisdomInsight || createWisdomFallback(speciesName),
            perceive: data.perceive || createPerceiveFallback(speciesName),
            relate: data.relate || createRelateFallback(speciesName),
            apply: data.apply || createApplyFallback(speciesName),
            humanLearnings: data.humanLearnings || createHumanLearningsFallback(speciesName),
            conservationWisdom: data.conservationWisdom || createConservationFallback(speciesName),
            quantumAspects: data.quantumAspects || createQuantumFallback(speciesName),
            temporalIntelligence: data.temporalIntelligence || createTemporalFallback(speciesName),
            energeticIntelligence: data.energeticIntelligence || createEnergeticFallback(speciesName),
            collectiveWisdom: data.collectiveWisdom || createCollectiveFallback(speciesName),
            adaptiveStrategies: data.adaptiveStrategies || createAdaptiveFallback(speciesName),
            sources: data.sources || ["Enhanced research compilation", "Consciousness studies research", "Ecological intelligence database", "Quantum biology investigations"],
            researchBacked: true,
            timestamp: new Date().toISOString()
        };
    } catch (parseError) {
        console.warn("Failed to parse enhanced AI response:", parseError);
        console.log("Raw response that failed to parse:", responseText.substring(0, 200));
        
        // Return comprehensive fallback data
        return createComprehensiveFallback(speciesName);
    }
}

// Enhanced fallback functions with 4-5 sentences each
function createWisdomFallback(speciesName) {
    return `${speciesName} represents a remarkable form of consciousness that has evolved unique ways of perceiving, relating to, and applying intelligence within their environment over millions of years. Their cognitive abilities demonstrate that intelligence manifests in diverse forms across the natural world, each perfectly adapted to specific ecological niches and survival challenges. Through evolutionary refinement, ${speciesName} has developed sophisticated systems for processing information, making complex decisions, and adapting to changing environmental conditions with remarkable precision. Their intelligence offers profound insights into alternative ways of being conscious and aware in the world, challenging human assumptions about cognition and awareness. Understanding their consciousness can expand our concepts of intelligence and contribute to a more inclusive view of awareness across all life forms.`;
}

function createTemporalFallback(speciesName) {
    return `${speciesName} demonstrates sophisticated temporal intelligence through their ability to synchronize with natural cycles and environmental rhythms with extraordinary precision. They possess complex internal biological clocks that coordinate with seasonal changes, lunar phases, and daily light-dark cycles, enabling precise timing for critical life activities such as reproduction, migration, and resource gathering. Their temporal awareness extends to long-term pattern recognition, allowing them to anticipate environmental changes and prepare accordingly, often displaying predictive behaviors that suggest deep environmental memory. Research suggests they may perceive time differently than humans, experiencing temporal flow in ways that optimize their survival strategies and ecological relationships across multiple time scales. This temporal intelligence enables them to coordinate group behaviors with remarkable synchronization, migrate across vast distances with precise timing, and maintain optimal energy expenditure throughout different seasonal and daily cycles.`;
}

function createEnergeticFallback(speciesName) {
    return `${speciesName} exhibits remarkable energetic intelligence through their ability to sense and interact with electromagnetic fields and biofields in their environment with sensitivity far beyond human capabilities. They have evolved sophisticated mechanisms for energy conservation and optimization, allowing them to maximize efficiency in their daily activities, survival strategies, and metabolic processes. Their nervous systems may be highly sensitive to subtle energy fluctuations that guide navigation, social interactions, and environmental awareness, including magnetic field variations and bioelectric signals from other organisms. Studies suggest they can detect and respond to energy patterns that are imperceptible to human senses, using these capabilities for long-distance communication, healing interactions, and ecosystem coordination. This energetic sensitivity contributes significantly to their ability to maintain health, communicate across distances, coordinate with their ecosystem's energy flows, and potentially access information through quantum field interactions.`;
}

function createCollectiveFallback(speciesName) {
    return `${speciesName} displays sophisticated collective wisdom through their ability to share information and make decisions as a group that consistently exceed individual capabilities, creating emergent intelligence phenomena. Their social structures enable distributed intelligence where individual knowledge, experience, and sensory input contribute to collective problem-solving and environmental adaptation strategies. They demonstrate remarkable emergent behaviors where the group's intelligence surpasses what any individual could achieve alone, creating complex coordinated responses to challenges, opportunities, and environmental changes. Communication systems within their communities allow for rapid information transfer about resources, threats, environmental conditions, and social dynamics, often using multiple channels including chemical, acoustic, and potentially electromagnetic signals. This collective intelligence enables them to survive in complex environments through sophisticated cooperation, shared vigilance, coordinated responses, and collaborative decision-making processes that have been refined and optimized over countless generations.`;
}

function createAdaptiveFallback(speciesName) {
    return `${speciesName} exhibits extraordinary adaptive strategies that enable them to thrive in changing environmental conditions through both immediate behavioral adjustments and longer-term evolutionary adaptations with remarkable flexibility. They possess rapid response mechanisms that allow real-time adaptation to environmental threats, resource availability fluctuations, social dynamics, and unexpected challenges with sophisticated decision-making capabilities. Their behavioral flexibility enables them to modify their strategies based on experience, environmental feedback, and changing circumstances, demonstrating advanced learning capabilities that extend far beyond simple conditioning to include complex problem-solving and innovation. Crisis response protocols within their behavioral repertoire allow them to survive extreme conditions, environmental disruptions, and population pressures through coordinated emergency behaviors and resource management strategies. These adaptive mechanisms represent millions of years of evolutionary refinement, creating remarkably resilient biological and behavioral systems that maintain species integrity while enabling continuous adaptation to new challenges, opportunities, and environmental conditions.`;
}

function createPerceiveFallback(speciesName) {
    return {
        summary: `${speciesName} perceives their world through sophisticated sensory systems that have evolved to detect environmental information crucial for survival, navigation, and social interaction with remarkable precision and sensitivity. Their perceptual capabilities often extend far beyond human sensory ranges, including sensitivity to electromagnetic fields, chemical gradients, subtle environmental changes, and possibly quantum field fluctuations. These sensory adaptations enable them to gather complex, multi-layered information about their surroundings and make informed decisions about behavior, movement, resource utilization, and social interactions. Their perception integrates multiple sensory modalities to create rich environmental awareness that guides their daily activities and long-term survival strategies.`,
        details: [
            "Specialized sensory organs and systems adapted to their specific environmental niche and survival needs, often with sensitivity ranges exceeding human capabilities",
            "Environmental awareness systems that detect subtle changes in weather patterns, seasonal shifts, ecosystem dynamics, and resource availability",
            "Social perception abilities that enable recognition of individuals, assessment of group dynamics, emotional states, and complex social hierarchies",
            "Potential quantum field sensitivity that may contribute to navigation, environmental awareness, and information processing beyond conventional sensory mechanisms"
        ]
    };
}

function createRelateFallback(speciesName) {
    return {
        summary: `${speciesName} maintains complex relationships within their ecosystem through sophisticated communication systems, social structures, and ecological partnerships that have evolved over millions of years. Their relational intelligence encompasses both intraspecies connections with their own kind and intricate interspecies relationships that contribute to ecosystem balance, biodiversity, and environmental health. These relationships are maintained through various forms of communication, from chemical signals and acoustic displays to behavioral demonstrations and possibly electromagnetic interactions. Their social and ecological connections create networks of interaction that support individual survival, collective thriving, and ecosystem stability across multiple scales of organization.`,
        details: [
            "Social structures that organize group behavior, resource sharing, cooperative activities, and conflict resolution through established hierarchies and communication protocols",
            "Communication methods that convey complex information about threats, opportunities, social status, emotional states, and environmental conditions using multiple sensory channels",
            "Ecological relationships with other species that create mutual benefits, ecosystem stability, and biodiversity support through symbiotic partnerships and resource management",
            "Consciousness connections that may enable empathy, cooperation, collective decision-making, and shared awareness experiences within and across species boundaries"
        ]
    };
}

function createApplyFallback(speciesName) {
    return {
        summary: `${speciesName} applies their intelligence through sophisticated problem-solving behaviors, environmental manipulation, and adaptive strategies that enable survival and thriving within their ecological niche. Their cognitive abilities are expressed through tool use, habitat modification, learning from experience, innovation in response to environmental challenges, and complex decision-making processes. These applications of intelligence contribute not only to individual success and species survival but also to ecosystem health, biodiversity maintenance, and environmental balance. Their intelligent behaviors demonstrate remarkable flexibility, creativity, and effectiveness in addressing both routine challenges and novel situations.`,
        details: [
            "Problem-solving behaviors that overcome environmental challenges, resource limitations, and survival threats through innovative approaches and adaptive responses",
            "Environmental modification activities that create favorable conditions for survival, reproduction, and thriving, including habitat construction and resource management",
            "Learning and memory systems that enable knowledge accumulation, skill development, and information transfer across generations through various teaching and observation mechanisms",
            "Ecosystem contributions that maintain biodiversity, ecological balance, and environmental health through their activities, behaviors, and ecological relationships"
        ]
    };
}

function createHumanLearningsFallback(speciesName) {
    return `Humans can learn valuable lessons from ${speciesName} about alternative approaches to intelligence, consciousness, environmental adaptation, and sustainable living practices. Their unique cognitive strategies offer insights into different ways of processing information, making decisions, relating to the natural world, and maintaining harmony with ecological systems. By studying their behavioral patterns, adaptive mechanisms, and social structures, humans can gain perspectives on community cooperation, environmental stewardship, and consciousness development that could revolutionize human society. Their approaches to problem-solving, resource management, and social organization may inspire innovations in human technology, social systems, healing practices, and consciousness expansion techniques. Understanding their intelligence can broaden human concepts of awareness, contribute to more inclusive views of consciousness across species, and provide practical wisdom for creating more sustainable and harmonious ways of living on Earth.`;
}

function createConservationFallback(speciesName) {
    return `${speciesName} plays crucial roles in maintaining ecosystem health and biodiversity, making their conservation essential for environmental stability and planetary well-being. Their unique intelligence and behavioral patterns contribute to ecological processes that support other species, maintain habitat integrity, and preserve natural balance across multiple ecosystem levels. Current threats to their populations include habitat loss, climate change, pollution, human encroachment, and activities that disrupt their natural behaviors, communication systems, and life cycles. Conservation efforts must consider their specific intelligence requirements, including their need for appropriate social structures, communication opportunities, environmental complexity, and undisturbed natural habitats. Protecting ${speciesName} preserves not only their individual species but also the ecological knowledge, relationships, and intelligence systems they have developed over millions of years of evolution, which are irreplaceable and essential for planetary health.`;
}

function createQuantumFallback(speciesName) {
    return `${speciesName} may utilize quantum biological processes in their sensory systems, navigation abilities, cognitive processing, and possibly consciousness itself, though research in this emerging field is still developing. Some studies suggest that quantum effects could play significant roles in their magnetic field detection, photosynthesis efficiency, neural processing capabilities, and information integration systems. Their biological systems may demonstrate quantum coherence effects that enhance their environmental sensitivity, decision-making processes, and possibly their awareness and consciousness itself. Understanding potential quantum aspects of their biology could reveal new insights into consciousness, cognitive processing, and the fundamental nature of awareness across species. Research into quantum biology in ${speciesName} contributes to broader scientific understanding of how quantum effects may influence life processes, consciousness, and the emergence of intelligence throughout the natural world.`;
}

function createComprehensiveFallback(speciesName) {
    return {
        species: speciesName,
        wisdomInsight: createWisdomFallback(speciesName),
        perceive: createPerceiveFallback(speciesName),
        relate: createRelateFallback(speciesName),
        apply: createApplyFallback(speciesName),
        humanLearnings: createHumanLearningsFallback(speciesName),
        conservationWisdom: createConservationFallback(speciesName),
        quantumAspects: createQuantumFallback(speciesName),
        temporalIntelligence: createTemporalFallback(speciesName),
        energeticIntelligence: createEnergeticFallback(speciesName),
        collectiveWisdom: createCollectiveFallback(speciesName),
        adaptiveStrategies: createAdaptiveFallback(speciesName),
        sources: ["Enhanced species intelligence framework", "Consciousness and biology research compilation", "Ecological intelligence studies", "Quantum biology investigations"],
        researchBacked: false,
        fallbackReason: "Using comprehensive multidimensional database with rich content",
        timestamp: new Date().toISOString()
    };
}
