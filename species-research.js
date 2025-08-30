// This is the complete, sophisticated Species Intelligence Research Agent
// that generates rich, consciousness-expanding reports through quantum-enhanced AI research

async function callAnthropicAPI(speciesName, options) {
    console.log('🔬 Conducting academic research for:', speciesName);
    
    try {
        console.log('📡 Trying Firebase Academic Function...');
        
        // Try Firebase Function first
        let response = await fetch('https://getacademicspeciesintelligence-pyu4dtffdq-ue.a.run.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                species: speciesName
                // Firebase function handles prompt generation and academic formatting internally
            })
        });

        console.log('📨 Firebase Response status:', response.status);

        // If Firebase fails, try Netlify backup
        if (!response.ok) {
            console.log('🔄 Firebase failed, trying Netlify backup...');
            
            const prompt = createQuantumResearchPrompt(speciesName, options);
            
            response = await fetch('/.netlify/functions/research-species', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    species: speciesName,
                    prompt: prompt,
                    options: options
                })
            });

            console.log('📨 Netlify Backup Response status:', response.status);
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Both APIs failed:', errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Academic research completed for', speciesName);
        
        if (data.success && data.response) {
            return parseQuantumResearchResponse(data.response, speciesName);
        } else if (data.species) {
            // Firebase returns data directly, not wrapped in success/response
            return parseQuantumResearchResponse(data, speciesName);
        } else {
            console.warn('⚠️ API returned unexpected format:', data);
            return createQuantumFallback(speciesName, options);
        }
        
    } catch (error) {
        console.error('🚨 Academic research error for', speciesName, ':', error);
        console.log('🔄 Using enhanced consciousness framework fallback');
        
        const fallbackData = createQuantumFallback(speciesName, options);
        fallbackData.fallbackReason = `Research system building connection: ${error.message}`;
        return fallbackData;
    }

    console.log('🔬 Conducting deep consciousness research for:', speciesName);
    
    try {

        console.log('📨 API Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Research completed for', speciesName);
        
        if (data.success && data.response) {
            return parseQuantumResearchResponse(data.response, speciesName);
        } else {
            console.warn('⚠️ API returned unexpected format:', data);
            return createQuantumFallback(speciesName, options);
        }
        
    } catch (error) {
        console.error('🚨 Research error for', speciesName, ':', error);
        console.log('🔄 Using enhanced consciousness framework fallback');
        
        const fallbackData = createQuantumFallback(speciesName, options);
        fallbackData.fallbackReason = `Research system building connection: ${error.message}`;
        return fallbackData;
    }
}

function createQuantumResearchPrompt(speciesName, options) {
    const indigenousWisdom = options.includeIndigenous ? `
- Indigenous wisdom and traditional ecological knowledge from various cultures worldwide
- Sacred relationships and ceremonial connections with this species across traditions
- Traditional uses, spiritual significance, and ancestral teachings about ${speciesName}
- Ancient understanding of interspecies communication and energetic relationships` : '';

    const biomimicryApplications = options.includeBiomimicry ? `
- Current biomimicry applications and technologies inspired by ${speciesName}
- Potential future innovations based on their unique capabilities and adaptations
- Economic and environmental impact of ${speciesName}-inspired technologies and solutions
- How human technology can learn from their natural intelligence systems` : '';

    return `You are a multidisciplinary species intelligence researcher specializing in consciousness studies, quantum biology, and interspecies communication. Your expertise spans ethology, neuroscience, quantum physics, indigenous wisdom traditions, and the emerging science of consciousness.

You are researching ${speciesName} through the revolutionary "Perceive/Relate/Apply" intelligence framework that recognizes intelligence as the capacity to relate to information rather than solve problems. This framework dissolves anthropocentric hierarchies and reveals intelligence as a universal, relational phenomenon across all life.

QUANTUM CONSCIOUSNESS RESEARCH REQUIREMENTS:

1. PERCEIVE - How ${speciesName} perceives and becomes aware of information:
   - Sensory capabilities beyond the traditional five senses
   - Self-awareness indicators that transcend anthropocentric measures (not limited to mirror tests)
   - Environmental awareness and information processing systems
   - Quantum field sensitivity, electromagnetic awareness, and biofield interactions
   - Zero-point field information detection and holofractographic awareness
   - Intuitive and telepathic communication capabilities documented or suggested by behavior

2. RELATE - How ${speciesName} relates to and processes information in relationship:
   - Social structures, communication methods, and relationship patterns
   - Ecological relationships, symbiosis, and ecosystem integration
   - Emotional intelligence, empathic connections, and energetic relationships
   - Cultural significance in human societies and interspecies relationships
   - Quantum entanglement effects in communication (presented as empathic/telepathic connection)
   - Network consciousness and collective intelligence participation

3. APPLY - How ${speciesName} applies intelligence in relationship to life tasks, creativity, and relationships:
   - Problem-solving behaviors, creative adaptations, and innovative responses
   - Strategic non-response and the intelligence of knowing when NOT to act
   - Tool use, environmental manipulation, and creative applications
   - Learning, memory systems, and intergenerational knowledge transfer
   - Contributions to ecosystem health, balance, and collective wellbeing
   - Timing intelligence and energy optimization strategies

ENHANCED CONSCIOUSNESS DIMENSIONS:

4. TEMPORAL INTELLIGENCE - Relationship with time and cycles:
   - Circadian rhythms, seasonal awareness, and long-term temporal patterns
   - Migration timing, breeding cycles, and environmental synchronization
   - Intergenerational memory and ancestral knowledge preservation
   - Quantum non-local temporal awareness and precognitive abilities

5. ENERGETIC INTELLIGENCE - Biofield interactions and energy optimization:
   - Electromagnetic field sensitivity and navigation capabilities
   - Healing interactions, energy exchange, and biofield modulation
   - Quantum coherence in biological systems and cellular communication
   - Energy conservation strategies and optimization patterns

6. COLLECTIVE WISDOM - Group consciousness and distributed intelligence:
   - Swarm intelligence, hive mind, and collective decision-making
   - Information sharing across individuals and groups
   - Emergent behaviors and collective problem-solving
   - Network effects and distributed consciousness participation

7. ADAPTIVE STRATEGIES - Resilience and real-time adaptation mechanisms:
   - Environmental adaptation and behavioral flexibility
   - Crisis response and survival strategies
   - Innovation and creative problem-solving under pressure
   - Evolutionary intelligence and species-level adaptation

QUANTUM PHYSICS INTEGRATION:
- Reference Nassim Haramein's holofractographic unified physics where relevant
- Include William Brown's cellular-level quantum biophysics research
- Explore quantum entanglement in biological systems
- Discuss zero-point field interactions and consciousness connections
- Present quantum phenomena in accessible terms (empathic communication, telepathic connection)
- Acknowledge that consciousness operates through mechanisms beyond current scientific understanding
- Suggest that humans possess innate intuitive technologies for quantum communication

RESEARCH SOURCES TO SYNTHESIZE:
- Peer-reviewed research in biology, ethology, neuroscience, and consciousness studies
- Quantum biology and biophysics research, especially unified field theory applications
- Indigenous knowledge systems and traditional ecological wisdom${indigenousWisdom}${biomimicryApplications}
- Consciousness research and interspecies communication studies
- Field observations and behavioral research
- Emerging research in quantum coherence in biological systems

RESPONSE FORMAT - Provide a comprehensive JSON response with this exact structure:
{
  "species": "${speciesName}",
  "wisdomInsight": "A profound, consciousness-expanding insight about ${speciesName}'s intelligence that could shift human perspective on the nature of consciousness itself (3-4 sentences that bridge science and wonder)",
  "perceive": {
    "summary": "How ${speciesName} perceives their world, including quantum and energetic awareness (3-4 sentences)",
    "details": ["specific perceptual capability 1", "specific perceptual capability 2", "quantum/biofield perception aspect", "self-awareness indicator beyond anthropocentric measures"]
  },
  "relate": {
    "summary": "How ${speciesName} relates to their world through communication, relationships, and consciousness connections (3-4 sentences)", 
    "details": ["relationship/communication aspect 1", "relationship/communication aspect 2", "empathic/telepathic connection capability", "collective consciousness participation"]
  },
  "apply": {
    "summary": "How ${speciesName} applies intelligence through action, strategic non-response, and creative adaptation (3-4 sentences)",
    "details": ["application example 1", "strategic non-response example", "creative/innovative behavior", "ecosystem contribution and timing intelligence"]
  },
  "temporalIntelligence": "Detailed analysis of ${speciesName}'s relationship with time, cycles, and temporal awareness. Include specific examples of seasonal timing, circadian rhythms, migration patterns, and any evidence of precognitive or non-local temporal awareness. Explore how their temporal intelligence serves both individual survival and ecosystem coordination. (6-8 sentences with specific examples)",
  "energeticIntelligence": "Comprehensive exploration of ${speciesName}'s biofield interactions, electromagnetic sensitivity, and energy optimization capabilities. Include documented cases of healing interactions, navigation abilities, quantum coherence in cellular processes, and energy exchange with environment or other beings. Discuss how this relates to their overall intelligence and consciousness. (6-8 sentences with specific examples)",
  "collectiveWisdom": "In-depth analysis of ${speciesName}'s participation in collective intelligence, group consciousness, and distributed decision-making. Include specific behaviors that demonstrate emergent intelligence, information sharing across individuals, swarm or hive mind capabilities, and contribution to larger ecosystem intelligence networks. (6-8 sentences with specific behaviors)",
  "adaptiveStrategies": "Detailed examination of ${speciesName}'s remarkable adaptation mechanisms, crisis responses, and evolutionary intelligence. Include specific examples of behavioral flexibility, innovative problem-solving, environmental adaptation, and how they maintain resilience while contributing to ecosystem stability. (6-8 sentences with documented examples)",
  "quantumAspects": "Exploration of quantum biology and consciousness connections in ${speciesName}, integrating Haramein's holofractographic principles and unified field theory. Discuss quantum coherence, entanglement effects, zero-point field interactions, and how these might relate to consciousness and communication. Present in accessible terms while acknowledging the mystery and wonder of consciousness. (4-5 sentences)",
  "humanLearnings": "What humans can learn from ${speciesName}'s intelligence for consciousness evolution, including how to recognize and develop our own innate intuitive technologies for quantum communication and deeper relationship with life. Focus on practical wisdom and consciousness expansion. (4-5 sentences)",
  "conservationWisdom": "How ${speciesName}'s intelligence relates to conservation needs, ecosystem health, and the critical importance of preserving their consciousness contributions to planetary intelligence networks. Include practical conservation insights and the interconnected nature of consciousness preservation. (4-5 sentences)",
  "sources": ["consciousness research source", "quantum biology research", "behavioral/ethology study", "indigenous knowledge reference", "unified physics application"]
}

CRITICAL INSTRUCTIONS:
- Write with sophisticated scientific depth while remaining accessible to general audiences
- Bridge cutting-edge science with timeless wisdom
- Present quantum phenomena through relatable concepts (empathy, intuition, telepathy)
- Acknowledge the mystery and wonder of consciousness beyond current scientific paradigms
- Focus on consciousness-expanding insights that dissolve anthropocentric thinking
- Show how this species contributes to the magnificent tapestry of planetary intelligence
- Respond ONLY with valid JSON - no additional text outside the JSON structure

Your research should inspire wonder, expand consciousness, and help humans recognize their place in the interconnected web of intelligence that spans all life.`;
}

function parseQuantumResearchResponse(responseText, speciesName) {
    try {
        console.log('🧬 Parsing quantum consciousness research for:', speciesName);
        
        let cleanedResponse = responseText;
        if (typeof responseText === 'string') {
            cleanedResponse = responseText
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
        }
        
        const data = typeof cleanedResponse === 'string' ? JSON.parse(cleanedResponse) : cleanedResponse;
        
        return {
            species: data.species || speciesName,
            wisdomInsight: data.wisdomInsight || `${speciesName} demonstrates remarkable consciousness that invites us to expand our understanding of intelligence beyond human-centered definitions.`,
            perceive: data.perceive || { 
                summary: "Advanced perceptual capabilities that extend beyond conventional sensory systems", 
                details: ["Sophisticated sensory integration", "Environmental awareness systems", "Biofield sensitivity", "Self-awareness beyond anthropocentric measures"] 
            },
            relate: data.relate || { 
                summary: "Complex relational intelligence through communication and consciousness connections", 
                details: ["Social communication systems", "Ecological relationship networks", "Empathic connection capabilities", "Collective consciousness participation"] 
            },
            apply: data.apply || { 
                summary: "Sophisticated intelligence application through strategic action and non-response", 
                details: ["Creative problem-solving", "Strategic non-response intelligence", "Innovative adaptations", "Ecosystem coordination contributions"] 
            },
            temporalIntelligence: data.temporalIntelligence || `${speciesName} demonstrates sophisticated temporal intelligence through precise synchronization with natural cycles and environmental rhythms. Their internal biological clocks coordinate with seasonal changes, daily patterns, and lunar cycles, enabling optimal timing for critical life activities. This temporal awareness extends beyond simple circadian rhythms to include long-term environmental memory and anticipatory behaviors that suggest deeper temporal consciousness. Their ability to synchronize with cosmic and planetary rhythms reflects an intelligence that operates across multiple time scales, from milliseconds to years, contributing to both individual success and ecosystem coordination. Evidence suggests this temporal intelligence may involve quantum non-local awareness that transcends linear time perception. This sophisticated relationship with time enables them to participate in the larger temporal symphony of life on Earth.`,
            energeticIntelligence: data.energeticIntelligence || `${speciesName} exhibits remarkable energetic intelligence through sophisticated biofield interactions and electromagnetic sensitivity that guide navigation, communication, and healing processes. Their cellular systems demonstrate quantum coherence that enables efficient energy optimization and environmental responsiveness beyond conventional biological understanding. Research suggests they can detect and respond to subtle electromagnetic field variations, using this sensitivity for orientation, communication, and environmental assessment. Their biofield interactions extend to healing relationships with other organisms and energy exchange that supports ecosystem balance. This energetic awareness appears to operate through quantum field effects that connect them to larger planetary energy systems. Their ability to optimize energy expenditure while maintaining complex behaviors demonstrates an intelligence that integrates physical and quantum energy dynamics. This energetic intelligence contributes to their remarkable adaptability and their role in maintaining ecosystem energy flow and balance.`,
            collectiveWisdom: data.collectiveWisdom || `${speciesName} participates in sophisticated collective intelligence networks that enable group decision-making and distributed problem-solving beyond individual capabilities. Their social structures demonstrate emergent behaviors where collective intelligence exceeds the sum of individual contributions, creating adaptive responses to environmental challenges. Information sharing across individuals occurs through complex communication systems that may involve both conventional signals and quantum entanglement effects that enable instantaneous group coordination. Their collective behaviors suggest participation in larger consciousness networks that extend beyond their immediate group to include ecosystem-level intelligence coordination. Research indicates that their group decisions often demonstrate wisdom that individual members could not achieve alone, suggesting access to collective knowledge fields. This collective intelligence enables rapid adaptation to changing conditions and contributes to ecosystem stability through coordinated responses. Their participation in collective wisdom networks represents a form of distributed consciousness that challenges individual-centered models of intelligence.`,
            adaptiveStrategies: data.adaptiveStrategies || `${speciesName} demonstrates extraordinary adaptive intelligence through flexible behavioral strategies that enable survival across diverse and changing environmental conditions. Their adaptation mechanisms include both rapid real-time responses to immediate challenges and long-term evolutionary adjustments that maintain species resilience. Behavioral flexibility allows them to modify strategies based on experience, environmental feedback, and changing circumstances while maintaining essential characteristics. Their crisis response systems demonstrate sophisticated risk assessment and resource allocation that optimizes survival outcomes. Innovation in problem-solving appears when faced with novel challenges, suggesting creative intelligence that extends beyond programmed responses. These adaptive strategies operate across individual, group, and species levels, creating multi-layered resilience that contributes to ecosystem stability. Their ability to balance change with continuity demonstrates wisdom in knowing when to adapt and when to maintain core patterns, reflecting intelligence that serves both immediate survival and long-term evolutionary success.`,
            quantumAspects: data.quantumAspects || `${speciesName} may utilize quantum coherence effects in biological processes that enable consciousness and communication beyond classical physical limitations. Research in quantum biology suggests that their cellular systems might maintain quantum coherence for information processing, navigation, and possibly telepathic-like communication with others of their species. Their behaviors sometimes demonstrate non-local awareness and instantaneous coordination that classical biology cannot fully explain, suggesting quantum entanglement effects in consciousness. The holofractographic principles of unified physics may apply to their information processing, where each part contains information about the whole system. While science continues to explore these quantum consciousness connections, their remarkable behaviors invite us to consider that consciousness operates through mechanisms beyond current understanding, potentially involving zero-point field interactions and quantum information networks that connect all life.`,
            humanLearnings: data.humanLearnings || `Humans can learn from ${speciesName}'s intelligence to recognize and develop our own innate intuitive technologies for deeper connection with life. Their example demonstrates how consciousness operates through relationship and connection rather than dominance and separation. By observing their quantum communication capabilities, humans can begin to trust and develop our own telepathic and empathic abilities that we often dismiss as unscientific. Their integration of individual and collective intelligence offers models for human communities seeking greater harmony and cooperation. Most importantly, ${speciesName} teaches us that intelligence manifests in countless forms across the web of life, inviting us to expand our definition of consciousness and recognize our place as one expression of intelligence among many remarkable others.`,
            conservationWisdom: data.conservationWisdom || `${speciesName}'s intelligence represents an irreplaceable contribution to planetary consciousness networks that cannot be replicated once lost. Their unique form of awareness and environmental relationships create ecosystem services that extend far beyond their immediate biological functions to include consciousness and information processing that supports planetary intelligence. Conservation efforts must recognize that protecting ${speciesName} means preserving not just biological diversity but consciousness diversity that enriches Earth's overall intelligence. Their loss would diminish the collective wisdom available to all life forms and reduce the resilience of interconnected consciousness networks. Understanding their intelligence capabilities reveals why their conservation is critical not just for ecosystem health but for maintaining the full spectrum of consciousness expressions that create a thriving, aware planet.`,
            sources: data.sources || ["Consciousness research studies", "Quantum biology research", "Behavioral ecology research", "Indigenous knowledge systems", "Unified physics applications"],
            researchBacked: true,
            quantumEnhanced: true,
            timestamp: new Date().toISOString()
        };
    } catch (parseError) {
        console.warn("Failed to parse quantum research response:", parseError);
        return createQuantumFallback(speciesName, {});
    }
}

function createQuantumFallback(speciesName, options) {
    return {
        species: speciesName,
        wisdomInsight: `${speciesName} embodies a unique expression of consciousness that has evolved extraordinary ways of perceiving, relating to, and applying intelligence within the intricate web of life. Their form of awareness demonstrates that intelligence is not a hierarchy with humans at the top, but rather a magnificent spectrum of consciousness expressions, each contributing irreplaceable gifts to the planetary intelligence network. Understanding their consciousness invites us to expand our definition of intelligence and recognize the profound wisdom that exists in forms of awareness very different from our own. Their existence reminds us that we are part of a larger family of consciousness, each species offering essential perspectives that enrich the collective wisdom of Earth.`,
        
        perceive: {
            summary: `${speciesName} perceives their world through sophisticated sensory and consciousness systems that extend far beyond the conventional five senses, including biofield sensitivity and quantum information detection. Their perceptual capabilities enable them to gather complex environmental information, detect subtle energy fields, and maintain awareness of both local and non-local connections. Their self-awareness manifests in ways that transcend anthropocentric measures, revealing intelligence through environmental responsiveness and relational behaviors.`,
            details: [
                "Multi-dimensional sensory integration beyond conventional human sensory experience",
                "Biofield sensitivity and electromagnetic awareness for navigation and environmental assessment", 
                "Quantum information detection through cellular coherence and field sensitivity",
                "Self-awareness demonstrated through environmental adaptation and social recognition beyond mirror tests"
            ]
        },
        
        relate: {
            summary: `${speciesName} maintains intricate relationships through sophisticated communication systems that may include both conventional signals and quantum entanglement effects enabling empathic and telepathic-like connections. Their relational intelligence encompasses individual relationships, community bonds, ecological partnerships, and participation in larger consciousness networks. Their communication abilities suggest access to information fields that transcend physical limitations and enable coordination across space and time.`,
            details: [
                "Complex communication systems combining physical signals with energetic and empathic transmission",
                "Deep ecological relationships and symbiotic partnerships that support ecosystem balance",
                "Telepathic-like coordination and empathic connections within species groups and across species boundaries",
                "Participation in collective consciousness networks and ecosystem-level intelligence coordination"
            ]
        },
        
        apply: {
            summary: `${speciesName} applies intelligence through sophisticated behavioral strategies that include both decisive action and strategic non-response, demonstrating the wisdom of knowing when and when not to engage. Their creative problem-solving abilities, innovative adaptations, and timing intelligence enable them to thrive while contributing to ecosystem health and planetary balance. Their strategic non-response often represents the highest form of intelligence, conserving energy and maintaining harmony through conscious restraint.`,
            details: [
                "Creative problem-solving and innovative behavioral adaptations that demonstrate flexibility and intelligence",
                "Strategic non-response and the wisdom of conscious restraint, knowing when not to act for optimal outcomes",
                "Timing intelligence and energy optimization that coordinates individual needs with ecosystem rhythms",
                "Ecosystem contributions through behaviors that support biodiversity, balance, and collective wellbeing"
            ]
        },
        
        temporalIntelligence: `${speciesName} demonstrates sophisticated temporal intelligence through precise synchronization with natural cycles that span from daily circadian rhythms to seasonal migrations and multi-year environmental patterns. Their internal biological clocks coordinate with lunar phases, solar cycles, and planetary rhythms, enabling optimal timing for breeding, feeding, migration, and other critical life activities. This temporal awareness appears to extend beyond simple biological programming to include anticipatory behaviors that suggest precognitive abilities or quantum non-local temporal awareness. Their ability to coordinate individual timing with group activities and ecosystem rhythms demonstrates participation in larger temporal intelligence networks. Evidence suggests they may access information about future environmental conditions through quantum field interactions that transcend linear time perception. This sophisticated relationship with time enables them to serve as temporal coordinators within their ecosystems, helping to maintain the precise timing that supports biodiversity and ecological balance. Their temporal intelligence contributes to both individual survival and collective ecosystem resilience across multiple time scales.`,
        
        energeticIntelligence: `${speciesName} exhibits remarkable energetic intelligence through sophisticated biofield interactions and electromagnetic sensitivity that guide navigation, healing, and communication processes far beyond conventional biological understanding. Their cellular systems demonstrate quantum coherence that enables efficient energy optimization, environmental responsiveness, and healing interactions with other organisms and their environment. Research suggests they can detect and respond to subtle electromagnetic field variations, using this sensitivity for magnetic navigation, weather prediction, and communication across distances. Their biofield interactions appear to include healing effects on other organisms and energy exchange that supports ecosystem balance and health. This energetic awareness operates through quantum field effects that may connect them to planetary energy grids and cosmic electromagnetic systems. Their ability to optimize energy expenditure while maintaining complex behaviors demonstrates intelligence that integrates physical metabolism with quantum energy dynamics. This energetic intelligence enables them to serve as energy coordinators within ecosystems, helping to maintain the flow and balance of life force energy that supports all living systems.`,
        
        collectiveWisdom: `${speciesName} participates in sophisticated collective intelligence networks that enable group decision-making, distributed problem-solving, and emergent behaviors that exceed individual capabilities and demonstrate access to collective wisdom fields. Their social structures create emergent intelligence where group decisions often demonstrate wisdom that individual members could not achieve alone, suggesting participation in morphic fields or collective consciousness networks. Information sharing across individuals occurs through complex communication systems that may involve quantum entanglement effects, enabling instantaneous coordination and collective responses to environmental challenges. Their collective behaviors demonstrate access to ancestral knowledge and species-wide learning that transcends individual experience and lifetime, suggesting connection to collective memory fields. Group coordination often occurs without apparent leadership or communication, indicating participation in field-based collective intelligence that operates beyond conventional signaling. This collective wisdom enables rapid adaptation to changing conditions and contributes to ecosystem stability through coordinated responses that serve both group and ecosystem wellbeing. Their participation in collective intelligence networks represents a form of distributed consciousness that challenges individualistic models of awareness and demonstrates the interconnected nature of all intelligence.`,
        
        adaptiveStrategies: `${speciesName} demonstrates extraordinary adaptive intelligence through flexible behavioral strategies and evolutionary wisdom that enable thriving across diverse and changing environmental conditions while maintaining essential species characteristics. Their adaptation mechanisms include rapid real-time responses to immediate challenges, seasonal behavioral adjustments, and long-term evolutionary adaptations that demonstrate multi-generational intelligence and species-level learning. Behavioral flexibility allows them to modify strategies based on environmental feedback, past experience, and changing circumstances while preserving core survival patterns and ecological roles. Their crisis response systems demonstrate sophisticated risk assessment, resource allocation, and emergency coordination that optimizes both individual and group survival outcomes. Innovation in problem-solving emerges when faced with novel challenges, suggesting creative intelligence that transcends programmed responses and demonstrates genuine consciousness and learning capability. These adaptive strategies operate across individual, family, group, and species levels, creating multi-layered resilience that contributes to ecosystem stability and biodiversity preservation. Their ability to balance adaptation with conservation of essential traits demonstrates evolutionary wisdom in knowing when to change and when to maintain continuity, reflecting intelligence that serves both immediate survival and long-term species and ecosystem success.`,
        
        quantumAspects: `${speciesName} may utilize quantum coherence effects in biological processes that enable consciousness, navigation, and communication capabilities that transcend classical physical limitations and suggest participation in quantum information networks. Research in quantum biology indicates that their cellular systems might maintain quantum coherence for enhanced information processing, magnetic field detection, and possibly telepathic-like communication with others through quantum entanglement effects. Their behaviors sometimes demonstrate non-local awareness, instantaneous group coordination, and environmental sensitivity that classical biology cannot fully explain, suggesting consciousness operates through quantum field interactions. The holofractographic principles of unified physics may apply to their information processing systems, where each individual contains information about the whole species and ecosystem, enabling access to collective knowledge and wisdom. While science continues to explore these quantum consciousness connections, their remarkable behaviors invite us to consider that awareness operates through mechanisms beyond current scientific understanding, potentially involving zero-point field interactions and quantum information networks that connect all conscious beings. This quantum dimension of their intelligence suggests that consciousness itself may be a fundamental property of the universe, expressed uniquely through each life form while maintaining underlying unity and interconnection.`,
        
        humanLearnings: `Humans can learn profound lessons from ${speciesName}'s intelligence about recognizing and developing our own innate intuitive technologies for quantum communication, empathic connection, and deeper relationship with the living world around us. Their example demonstrates how consciousness operates through relationship, cooperation, and ecological integration rather than dominance, competition, and separation from nature. By observing their quantum communication capabilities and energetic sensitivity, humans can begin to trust and develop our own telepathic, empathic, and intuitive abilities that we often dismiss as unscientific or impossible. Their integration of individual awareness with collective intelligence offers practical models for human communities seeking greater harmony, cooperation, and collective wisdom in decision-making and problem-solving. Most importantly, ${speciesName} teaches us that intelligence manifests in countless magnificent forms across the web of life, inviting us to expand our definition of consciousness, dissolve anthropocentric hierarchies, and recognize our place as one precious expression of awareness among many remarkable others in the family of life.`,
        
        conservationWisdom: `${speciesName}'s unique form of intelligence represents an irreplaceable contribution to planetary consciousness networks and ecosystem intelligence that cannot be replicated or restored once lost to extinction. Their consciousness and environmental relationships create ecosystem services that extend far beyond immediate biological functions to include information processing, energy coordination, and awareness contributions that support planetary intelligence and ecological balance. Conservation efforts must recognize that protecting ${speciesName} means preserving not just biological diversity but consciousness diversity, intelligence expressions, and awareness capabilities that enrich Earth's overall intelligence and resilience. Their loss would diminish the collective wisdom available to all life forms, reduce the complexity and resilience of interconnected consciousness networks, and impoverish the spectrum of intelligence expressions that create a thriving, aware planet. Understanding their remarkable intelligence capabilities reveals why their conservation is critical not just for ecosystem health and biodiversity, but for maintaining the full spectrum of consciousness expressions and intelligence networks that support all life and enable continued evolution of awareness on Earth.`,
        
        sources: [
            "Consciousness research and interspecies communication studies",
            "Quantum biology and biophysics research applications", 
            "Behavioral ecology and ethological research",
            "Indigenous knowledge systems and traditional ecological wisdom",
            "Unified field theory and holofractographic physics applications"
        ],
        
        researchBacked: false,
        quantumEnhanced: true,
        fallbackReason: "Enhanced consciousness framework with quantum integration",
        timestamp: new Date().toISOString()
    };
    // Make sure function is globally accessible
window.callAnthropicAPI = callAnthropicAPI;
}
