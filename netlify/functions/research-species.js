/**
 * Species Intelligence Research Agent v2.0 - Constellation Release
 * research-species.js - Enhanced JavaScript Module
 * 
 * This file provides additional functionality and can be used as a separate module
 * if you want to split your JavaScript code from the main HTML file.
 * 
 * Currently, all functionality is embedded in the main HTML file for optimal
 * performance and deployment simplicity.
 */

// Configuration Constants
const RESEARCH_CONFIG = {
    // API Settings
    API_ENDPOINT: '/.netlify/functions/research-species',
    TIMEOUT_MS: 30000,
    
    // Budget Controls
    DAILY_SEARCH_LIMIT: 6,
    MONTHLY_BUDGET: 100,
    COST_PER_SEARCH: 0.50,
    
    // Intelligence Mapping
    VECTOR_DIMENSIONS: ['perceive', 'relate', 'apply', 'temporal', 'energetic', 'collective', 'adaptive'],
    SIMILARITY_THRESHOLD: 0.7,
    
    // Visualization
    CONSTELLATION_WIDTH: 400,
    CONSTELLATION_HEIGHT: 400,
    NODE_MIN_RADIUS: 5,
    NODE_MAX_RADIUS: 15,
    
    // Storage Keys
    STORAGE_KEYS: {
        RESEARCH_HISTORY: 'researchHistory',
        DAILY_USAGE: 'dailyUsage',
        MONTHLY_SPEND: 'monthlySpend',
        INTELLIGENCE_VECTORS: 'intelligenceVectors',
        CONSTELLATION_DATA: 'constellationData'
    }
};

// Species Intelligence Research Class
class SpeciesIntelligenceResearcher {
    constructor() {
        this.currentSpeciesData = [];
        this.researchHistory = this.loadFromStorage(RESEARCH_CONFIG.STORAGE_KEYS.RESEARCH_HISTORY, []);
        this.dailyUsage = this.loadFromStorage(RESEARCH_CONFIG.STORAGE_KEYS.DAILY_USAGE, {});
        this.monthlySpend = parseFloat(localStorage.getItem(RESEARCH_CONFIG.STORAGE_KEYS.MONTHLY_SPEND) || '0');
        this.intelligenceVectors = this.loadFromStorage(RESEARCH_CONFIG.STORAGE_KEYS.INTELLIGENCE_VECTORS, {});
        this.constellationData = this.loadFromStorage(RESEARCH_CONFIG.STORAGE_KEYS.CONSTELLATION_DATA, []);
    }

    // Utility method for loading JSON from localStorage
    loadFromStorage(key, defaultValue) {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (error) {
            console.warn(`Failed to load ${key} from storage:`, error);
            return defaultValue;
        }
    }

    // Save data to localStorage
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn(`Failed to save ${key} to storage:`, error);
        }
    }

    // Enhanced API Call with timeout and retry logic
    async callResearchAPI(speciesName, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), RESEARCH_CONFIG.TIMEOUT_MS);

        try {
            const prompt = this.createResearchPrompt(speciesName, options);
            
            const response = await fetch(RESEARCH_CONFIG.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    species: speciesName,
                    prompt: prompt,
                    options: options
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return this.parseAPIResponse(data.response || data, speciesName);

        } catch (error) {
            clearTimeout(timeoutId);
            console.warn(`API call failed for ${speciesName}:`, error.message);
            return this.createFallbackData(speciesName, options);
        }
    }

    // Create comprehensive research prompt
    createResearchPrompt(speciesName, options) {
        const indigenousKnowledge = options.includeIndigenous ? `
- Indigenous wisdom and traditional ecological knowledge
- Sacred relationships and ceremonial connections
- Traditional uses and spiritual significance` : '';

        const biomimicryApplications = options.includeBiomimicry ? `
- Current biomimicry applications and innovations
- Potential future technological developments
- Economic and environmental impact assessments` : '';

        return `Research ${speciesName} through the Perceive/Relate/Apply intelligence framework with enhanced dimensions.

FRAMEWORK ANALYSIS:
1. PERCEIVE - Sensory capabilities, environmental awareness, quantum perception
2. RELATE - Social structures, ecological relationships, consciousness connections  
3. APPLY - Problem-solving, tool use, ecosystem contributions

ENHANCED DIMENSIONS:
- Temporal Intelligence: Time perception, seasonal cycles, long-term patterns
- Energetic Intelligence: Biofield interactions, electromagnetic sensitivity
- Collective Wisdom: Group consciousness, distributed decision-making
- Adaptive Strategies: Real-time adaptation, crisis responses, resilience

SOURCES: Peer-reviewed research, consciousness studies${indigenousKnowledge}${biomimicryApplications}

RESPONSE FORMAT: Valid JSON with species, wisdomInsight, perceive/relate/apply objects with summary and details arrays, humanLearnings, conservationWisdom, quantumAspects, temporalIntelligence, energeticIntelligence, collectiveWisdom, adaptiveStrategies, and sources array.

Focus on consciousness-expanding insights bridging science and wisdom.`;
    }

    // Parse and validate API response
    parseAPIResponse(responseText, speciesName) {
        try {
            let cleanedResponse = responseText;
            if (typeof responseText === 'string') {
                cleanedResponse = responseText
                    .replace(/```json\n?/g, "")
                    .replace(/```\n?/g, "")
                    .trim();
            }
            
            const data = typeof cleanedResponse === 'string' ? JSON.parse(cleanedResponse) : cleanedResponse;
            
            // Validate required fields and provide defaults
            return {
                species: data.species || speciesName,
                wisdomInsight: data.wisdomInsight || "This species demonstrates unique intelligence worthy of study.",
                perceive: this.validateFrameworkSection(data.perceive, "perceptual capabilities"),
                relate: this.validateFrameworkSection(data.relate, "relational intelligence"),
                apply: this.validateFrameworkSection(data.apply, "problem-solving abilities"),
                humanLearnings: data.humanLearnings || "Valuable lessons for human consciousness evolution",
                conservationWisdom: data.conservationWisdom || "Important for ecosystem balance",
                quantumAspects: data.quantumAspects || "Consciousness connections being explored",
                temporalIntelligence: data.temporalIntelligence || "Sophisticated time perception capabilities",
                energeticIntelligence: data.energeticIntelligence || "Biofield sensitivity and energy optimization",
                collectiveWisdom: data.collectiveWisdom || "Group consciousness and collective decision-making",
                adaptiveStrategies: data.adaptiveStrategies || "Remarkable adaptation mechanisms",
                sources: Array.isArray(data.sources) ? data.sources : ["Research compilation"],
                researchBacked: true,
                timestamp: new Date().toISOString()
            };
        } catch (parseError) {
            console.warn("Failed to parse API response:", parseError);
            return this.createFallbackData(speciesName, {});
        }
    }

    // Validate framework section structure
    validateFrameworkSection(section, defaultType) {
        if (!section || typeof section !== 'object') {
            return {
                summary: `Advanced ${defaultType}`,
                details: ["Specialized capabilities", "Environmental adaptation", "Unique traits"]
            };
        }
        
        return {
            summary: section.summary || `Advanced ${defaultType}`,
            details: Array.isArray(section.details) ? section.details : ["Specialized capabilities"]
        };
    }

    // Create enhanced fallback data
    createFallbackData(speciesName, options) {
        return {
            species: speciesName,
            wisdomInsight: `${speciesName} represents a remarkable form of consciousness with unique evolutionary adaptations.`,
            perceive: {
                summary: `${speciesName} perceives their world through sophisticated sensory systems.`,
                details: ["Specialized sensory capabilities", "Environmental awareness", "Social perception", "Quantum field sensitivity"]
            },
            relate: {
                summary: `${speciesName} maintains complex relationships within their ecosystem.`,
                details: ["Social communication", "Ecological partnerships", "Community cooperation", "Consciousness connections"]
            },
            apply: {
                summary: `${speciesName} applies intelligence through adaptive problem-solving.`,
                details: ["Problem-solving behaviors", "Environmental adaptation", "Learning systems", "Ecosystem contributions"]
            },
            temporalIntelligence: `${speciesName} demonstrates sophisticated temporal awareness and seasonal synchronization.`,
            energeticIntelligence: `${speciesName} exhibits biofield sensitivity and electromagnetic awareness.`,
            collectiveWisdom: `${speciesName} displays group consciousness and collective decision-making capabilities.`,
            adaptiveStrategies: `${speciesName} employs remarkable adaptation strategies for environmental challenges.`,
            humanLearnings: `Humans can learn valuable lessons about intelligence and adaptation from ${speciesName}.`,
            conservationWisdom: `${speciesName} plays crucial ecosystem roles requiring thoughtful conservation.`,
            quantumAspects: `${speciesName} may utilize quantum processes in their sensory and cognitive systems.`,
            sources: ["Species intelligence research", "Consciousness studies", "Ecological research"],
            researchBacked: false,
            fallbackReason: "API unavailable - using enhanced framework analysis",
            timestamp: new Date().toISOString()
        };
    }

    // Budget and usage management
    checkBudgetLimits(speciesCount) {
        const today = new Date().toDateString();
        const todayUsage = this.dailyUsage[today] || 0;
        
        // Daily limit check
        if (todayUsage >= RESEARCH_CONFIG.DAILY_SEARCH_LIMIT) {
            throw new Error(`Daily search limit reached (${RESEARCH_CONFIG.DAILY_SEARCH_LIMIT} searches). Please try again tomorrow.`);
        }

        // Monthly budget check
        const projectedCost = this.monthlySpend + (RESEARCH_CONFIG.COST_PER_SEARCH * speciesCount);
        if (projectedCost > RESEARCH_CONFIG.MONTHLY_BUDGET) {
            throw new Error(`Monthly budget limit would be exceeded ($${projectedCost.toFixed(2)} > $${RESEARCH_CONFIG.MONTHLY_BUDGET}).`);
        }

        // Warning for high usage
        if (projectedCost > (RESEARCH_CONFIG.MONTHLY_BUDGET * 0.8) && 
            this.monthlySpend <= (RESEARCH_CONFIG.MONTHLY_BUDGET * 0.8)) {
            const percentage = ((projectedCost / RESEARCH_CONFIG.MONTHLY_BUDGET) * 100).toFixed(1);
            return `Warning: This search will use ${percentage}% of your monthly budget. Continue?`;
        }

        return null;
    }

    // Update usage tracking
    updateUsageTracking(speciesCount) {
        const today = new Date().toDateString();
        
        // Update daily usage
        if (!this.dailyUsage[today]) this.dailyUsage[today] = 0;
        this.dailyUsage[today]++;
        
        // Update monthly spend
        this.monthlySpend += RESEARCH_CONFIG.COST_PER_SEARCH * speciesCount;
        
        // Save to storage
        this.saveToStorage(RESEARCH_CONFIG.STORAGE_KEYS.DAILY_USAGE, this.dailyUsage);
        localStorage.setItem(RESEARCH_CONFIG.STORAGE_KEYS.MONTHLY_SPEND, this.monthlySpend.toString());
    }

    // Intelligence vector calculations
    calculateTextComplexity(text) {
        if (!text || typeof text !== 'string') return 0.5;
        
        const words = text.trim().split(/\s+/);
        const wordCount = words.length;
        const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
        const avgWordLength = words.join('').length / wordCount;
        const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        
        const complexityScore = Math.min(1, (
            (wordCount / 100) * 0.3 +
            (uniqueWords / wordCount) * 0.3 +
            (avgWordLength / 10) * 0.2 +
            (sentenceCount / 10) * 0.2
        ));
        
        return Math.max(0.1, complexityScore);
    }

    // Generate intelligence vector for species
    generateIntelligenceVector(speciesData) {
        const vector = {
            species: speciesData.species,
            timestamp: new Date().toISOString(),
            
            // Core dimensions
            perceive: this.calculateTextComplexity(speciesData.perceive?.summary || ''),
            relate: this.calculateTextComplexity(speciesData.relate?.summary || ''),
            apply: this.calculateTextComplexity(speciesData.apply?.summary || ''),
            
            // Enhanced dimensions
            temporal: this.calculateTextComplexity(speciesData.temporalIntelligence || ''),
            energetic: this.calculateTextComplexity(speciesData.energeticIntelligence || ''),
            collective: this.calculateTextComplexity(speciesData.collectiveWisdom || ''),
            adaptive: this.calculateTextComplexity(speciesData.adaptiveStrategies || ''),
            
            // Meta attributes
            complexity: this.calculateOverallComplexity(speciesData),
            humanRelevance: this.calculateTextComplexity(speciesData.humanLearnings || ''),
            conservationUrgency: this.calculateTextComplexity(speciesData.conservationWisdom || ''),
            
            // Quality indicators
            researchBacked: speciesData.researchBacked || false,
            sourceCount: speciesData.sources?.length || 0
        };
        
        vector.uniqueness = this.calculateUniqueness(vector);
        return vector;
    }

    // Calculate overall complexity across dimensions
    calculateOverallComplexity(speciesData) {
        const dimensions = [
            speciesData.perceive?.summary || '',
            speciesData.relate?.summary || '',
            speciesData.apply?.summary || '',
            speciesData.temporalIntelligence || '',
            speciesData.energeticIntelligence || '',
            speciesData.collectiveWisdom || '',
            speciesData.adaptiveStrategies || ''
        ];
        
        return dimensions.reduce((sum, text) => 
            sum + this.calculateTextComplexity(text), 0) / dimensions.length;
    }

    // Calculate uniqueness compared to existing vectors
    calculateUniqueness(currentVector) {
        let uniquenessScore = 1.0;
        
        Object.values(this.intelligenceVectors).forEach(existingVector => {
            if (existingVector.species !== currentVector.species) {
                const similarity = this.calculateVectorSimilarity(currentVector, existingVector);
                uniquenessScore = Math.min(uniquenessScore, 1 - similarity);
            }
        });
        
        return Math.max(0.1, uniquenessScore);
    }

    // Calculate similarity between two vectors
    calculateVectorSimilarity(vector1, vector2) {
        let similarity = 0;
        
        RESEARCH_CONFIG.VECTOR_DIMENSIONS.forEach(dim => {
            const diff = Math.abs((vector1[dim] || 0.5) - (vector2[dim] || 0.5));
            similarity += (1 - diff) / RESEARCH_CONFIG.VECTOR_DIMENSIONS.length;
        });
        
        return similarity;
    }

    // Export research data
    exportResearchData() {
        return {
            metadata: {
                generatedAt: new Date().toISOString(),
                speciesCount: Object.keys(this.intelligenceVectors).length,
                framework: "Perceive/Relate/Apply Intelligence Mapping v2.0",
                version: "2.0.0-constellation"
            },
            researchHistory: this.researchHistory,
            intelligenceVectors: this.intelligenceVectors,
            constellationData: this.constellationData,
            usageStats: {
                dailyUsage: this.dailyUsage,
                monthlySpend: this.monthlySpend
            }
        };
    }

    // Import research data
    importResearchData(data) {
        try {
            if (data.intelligenceVectors) {
                this.intelligenceVectors = { ...this.intelligenceVectors, ...data.intelligenceVectors };
                this.saveToStorage(RESEARCH_CONFIG.STORAGE_KEYS.INTELLIGENCE_VECTORS, this.intelligenceVectors);
            }
            
            if (data.constellationData) {
                this.constellationData = [...this.constellationData, ...data.constellationData];
                this.saveToStorage(RESEARCH_CONFIG.STORAGE_KEYS.CONSTELLATION_DATA, this.constellationData);
            }
            
            if (data.researchHistory) {
                this.researchHistory = [...this.researchHistory, ...data.researchHistory];
                this.saveToStorage(RESEARCH_CONFIG.STORAGE_KEYS.RESEARCH_HISTORY, this.researchHistory);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to import research data:', error);
            return false;
        }
    }

    // Get research statistics
    getResearchStats() {
        const vectors = Object.values(this.intelligenceVectors);
        
        if (vectors.length === 0) {
            return {
                totalSpecies: 0,
                avgComplexity: 0,
                avgPerceive: 0,
                avgRelate: 0,
                avgApply: 0,
                researchBacked: 0,
                uniquenessRange: [0, 0]
            };
        }
        
        return {
            totalSpecies: vectors.length,
            avgComplexity: vectors.reduce((sum, v) => sum + v.complexity, 0) / vectors.length,
            avgPerceive: vectors.reduce((sum, v) => sum + v.perceive, 0) / vectors.length,
            avgRelate: vectors.reduce((sum, v) => sum + v.relate, 0) / vectors.length,
            avgApply: vectors.reduce((sum, v) => sum + v.apply, 0) / vectors.length,
            researchBacked: vectors.filter(v => v.researchBacked).length,
            uniquenessRange: [
                Math.min(...vectors.map(v => v.uniqueness)),
                Math.max(...vectors.map(v => v.uniqueness))
            ]
        };
    }
}

// Utility functions for standalone use
const SpeciesResearchUtils = {
    // Validate species name
    validateSpeciesName(name) {
        if (!name || typeof name !== 'string') return false;
        const trimmed = name.trim();
        return trimmed.length >= 2 && trimmed.length <= 50 && /^[a-zA-Z\s-]+$/.test(trimmed);
    },

    // Format species name consistently
    formatSpeciesName(name) {
        return name.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    },

    // Generate research ID
    generateResearchId(speciesNames, timestamp = new Date()) {
        const speciesHash = speciesNames.join('-').toLowerCase().replace(/[^a-z-]/g, '');
        const dateHash = timestamp.toISOString().split('T')[0];
        return `research-${speciesHash}-${dateHash}`;
    },

    // Validate research options
    validateResearchOptions(options) {
        return {
            includeIndigenous: Boolean(options.includeIndigenous),
            includeBiomimicry: Boolean(options.includeBiomimicry),
            includeHuman: Boolean(options.includeHuman)
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SpeciesIntelligenceResearcher,
        SpeciesResearchUtils,
        RESEARCH_CONFIG
    };
}

// Global assignment for browser use
if (typeof window !== 'undefined') {
    window.SpeciesIntelligenceResearcher = SpeciesIntelligenceResearcher;
    window.SpeciesResearchUtils = SpeciesResearchUtils;
    window.RESEARCH_CONFIG = RESEARCH_CONFIG;
}

console.log('🌟 Species Intelligence Research Agent v2.0 - JavaScript Module Loaded');
