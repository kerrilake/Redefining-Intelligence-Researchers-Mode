x: (vertices.apply.x + vertices.perceive.x) / 2,
                y: (vertices.apply.y + vertices.perceive.y) / 2
            }
        };
        
        // Reference grid
        ctx.beginPath();
        ctx.moveTo(vertices.apply.x, vertices.apply.y);
        ctx.lineTo(midpoints.perceiveRelate.x, midpoints.perceiveRelate.y);
        ctx.moveTo(vertices.perceive.x, vertices.perceive.y);
        ctx.lineTo(midpoints.relateApply.x, midpoints.relateApply.y);
        ctx.moveTo(vertices.relate.x, vertices.relate.y);
        ctx.lineTo(midpoints.applyPerceive.x, midpoints.applyPerceive.y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw connection lines between species
        gradientData.forEach((item, index) => {
            gradientData.forEach((otherItem, otherIndex) => {
                if (index < otherIndex) {
                    const distance = Math.sqrt(
                        Math.pow(item.coords.x - otherItem.coords.x, 2) +
                        Math.pow(item.coords.y - otherItem.coords.y, 2)
                    );
                    if (distance < 80) { // Connect nearby species
                        const opacity = Math.max(0.1, 0.4 - (distance / 200));
                        ctx.strokeStyle = \`rgba(100, 116, 139, \${opacity})\`;
                        ctx.lineWidth = Math.max(1, 3 - (distance / 40));
                        ctx.beginPath();
                        ctx.moveTo(item.coords.x, item.coords.y);
                        ctx.lineTo(otherItem.coords.x, otherItem.coords.y);
                        ctx.stroke();
                    }
                }
            });
        });
        
        // Draw species points
        gradientData.forEach((item, index) => {
            // Draw glow effect
            const glowGradient = ctx.createRadialGradient(
                item.coords.x, item.coords.y, 0,
                item.coords.x, item.coords.y, 20
            );
            glowGradient.addColorStop(0, item.color);
            glowGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(item.coords.x, item.coords.y, 20, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw main species circle
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(item.coords.x, item.coords.y, 12, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw inner highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(item.coords.x - 3, item.coords.y - 3, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw species name with background
            const textWidth = ctx.measureText(item.species).width;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(
                item.coords.x - textWidth/2 - 4,
                item.coords.y + 20,
                textWidth + 8,
                16
            );
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.species, item.coords.x, item.coords.y + 30);
        });
    };

    // Enhanced research function for multiple species
    const conductResearch = async () => {
        const validSpecies = speciesList.filter(s => s.name.trim());
        if (validSpecies.length < 2) {
            alert("Please enter at least two species/life forms to compare");
            return;
        }

        setIsResearching(true);
        setResearchResults(null);

        try {
            const allSpeciesData = [];

            // Research each species
            for (let i = 0; i < validSpecies.length; i++) {
                const species = validSpecies[i];
                setResearchProgress(\`Researching quantum intelligence patterns in \${species.name}...\`);
                const speciesData = await researchSpeciesIntelligence(species.name);
                if (speciesData) {
                    allSpeciesData.push(speciesData);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Research humans if included
            let humanData = null;
            if (includeHumans) {
                setResearchProgress("Analyzing human intelligence within the relational framework...");
                humanData = await researchSpeciesIntelligence("humans");
                if (humanData) {
                    allSpeciesData.push(humanData);
                }
            }

            setResearchProgress("Synthesizing unified physics insights...");
            if (allSpeciesData.length >= 2) {
                const comparison = generateMultiSpeciesComparison(allSpeciesData);
                const temporalPatterns = analyzeTemporalPatterns(allSpeciesData);
                const metrics = {};
                
                allSpeciesData.forEach((species, index) => {
                    metrics[\`species\${index + 1}\`] = calculateIntelligenceMetrics(species);
                });

                setResearchResults({
                    allSpecies: allSpeciesData,
                    humanData: humanData,
                    comparison: comparison,
                    temporalPatterns: temporalPatterns,
                    metrics: metrics,
                    timestamp: new Date().toLocaleString()
                });
                
                setResearchProgress("Multi-species research completed successfully!");
            } else {
                setResearchProgress("Error: Insufficient research data");
            }
        } catch (error) {
            setResearchProgress("Error: " + error.message);
        } finally {
            setIsResearching(false);
            setTimeout(() => setResearchProgress(''), 3000);
        }
    };

    // Enhanced comparison for multiple species
    const generateMultiSpeciesComparison = (allSpeciesData) => {
        const similarities = [];
        const differences = [];
        const wholeLifeContribution = [];

        // Universal patterns
        const hasQuantumDetection = allSpeciesData.every(s => s.perceive.quantum_detection);
        const hasStrategicNonResponse = allSpeciesData.every(s => s.apply.strategic_non_response);
        const hasCommunication = allSpeciesData.every(s => s.relate.communication_patterns.length > 0);

        if (hasQuantumDetection) {
            similarities.push(\`All \${allSpeciesData.length} life forms demonstrate quantum coherence in their biological processes, revealing intelligence as a universal quantum phenomenon that transcends individual species boundaries.\`);
        }

        if (hasStrategicNonResponse) {
            const examples = allSpeciesData.map(s =>
                s.species.toLowerCase().includes('tree') ? 'trees through dormancy' :
                s.species.toLowerCase().includes('octop') ? 'octopuses through camouflage stillness' :
                s.species.toLowerCase().includes('human') ? 'humans through mindful restraint' :
                \`\${s.species} through strategic timing\`
            ).join(', ');
            similarities.push(\`Each demonstrates strategic non-response as sophisticated intelligence - \${examples}. This shows that knowing when NOT to act is a universal intelligence principle.\`);
        }

        if (hasCommunication) {
            similarities.push(\`All forms demonstrate complex relational communication extending beyond individual boundaries, proving intelligence is fundamentally about connection across the entire spectrum of life.\`);
        }

        // Highlight diversity
        differences.push(\`These \${allSpeciesData.length} life forms operate across different timescales and spatial domains, showing how intelligence adapts to diverse ecological niches while maintaining core relational principles.\`);
        
        if (allSpeciesData.length >= 3) {
            differences.push("This multi-species comparison reveals the full spectrum of intelligence strategies - from rapid individual creativity to patient networked wisdom to abstract collective thinking.");
        }

        // Contributions
        allSpeciesData.forEach(species => {
            wholeLifeContribution.push(\`\${species.species}: \${species.life_contribution}\`);
        });
        
        wholeLifeContribution.push(\`Together, these \${allSpeciesData.length} forms of intelligence create a comprehensive model of life's wisdom - each contributing unique capacities that strengthen and support the entire web of existence.\`);

        return { similarities, differences, wholeLifeContribution };
    };

    const calculateIntelligenceMetrics = (speciesData) => {
        let perceiveScore = 0;
        let relateScore = 0;
        let applyScore = 0;

        perceiveScore += speciesData.perceive.sensory_systems.length * 0.25;
        perceiveScore += speciesData.perceive.self_awareness_indicators.length * 0.25;
        perceiveScore += speciesData.perceive.quantum_detection ? 0.3 : 0;
        perceiveScore += speciesData.perceive.holofractographic_processing ? 0.2 : 0;

        relateScore += speciesData.relate.communication_patterns.length * 0.25;
        relateScore += speciesData.relate.symbiotic_relationships.length * 0.25;
        relateScore += speciesData.relate.quantum_connections ? 0.3 : 0;
        relateScore += speciesData.relate.ecosystem_role ? 0.2 : 0;

        applyScore += speciesData.apply.strategic_non_response ? 0.3 : 0;
        applyScore += speciesData.apply.creative_applications.length * 0.25;
        applyScore += speciesData.apply.timing_wisdom ? 0.25 : 0;
        applyScore += speciesData.apply.coherence_optimization ? 0.2 : 0;

        return {
            perceive: Math.min(perceiveScore, 1.0),
            relate: Math.min(relateScore, 1.0),
            apply: Math.min(applyScore, 1.0),
            overall: Math.min((perceiveScore + relateScore + applyScore) / 3, 1.0)
        };
    };

    // Species research function
    const researchSpeciesIntelligence = async (speciesName) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (speciesName.toLowerCase().includes('tree')) {
            return {
                species: speciesName,
                perceive: {
                    sensory_systems: ["Chemical gradient detection", "Light spectrum analysis", "Vibration sensing through roots", "Electromagnetic field sensitivity"],
                    self_awareness_indicators: ["Resource allocation decisions", "Territorial root boundary recognition", "Stress response communication"],
                    quantum_detection: true,
                    holofractographic_processing: true
                },
                relate: {
                    communication_patterns: ["Chemical signaling through air and soil", "Root network electrical signals", "Mycorrhizal network information exchange"],
                    symbiotic_relationships: ["Mycorrhizal fungi partnerships", "Nitrogen-fixing bacteria collaboration", "Animal seed dispersal relationships"],
                    quantum_connections: true,
                    ecosystem_role: true
                },
                apply: {
                    strategic_non_response: true,
                    creative_applications: ["Architectural canopy optimization", "Chemical defense innovation", "Root system engineering"],
                    timing_wisdom: true,
                    coherence_optimization: true
                },
                unified_physics_integration: "Quantum coherence in photosynthesis, bioelectromagnetic communication networks, holofractographic scaling",
                life_contribution: "Atmospheric regulation, foundation for terrestrial ecosystems, interspecies communication networks",
                research_gaps: ["Quantum coherence in root networks", "Electromagnetic communication mechanisms", "Consciousness in plant systems"]
            };
        }

        if (speciesName.toLowerCase().includes('octop')) {
            return {
                species: speciesName,
                perceive: {
                    sensory_systems: ["Distributed neural processing", "Chromatophore color-pattern detection", "Tactile arm sensing", "Chemical taste-smell integration"],
                    self_awareness_indicators: ["Mirror self-recognition", "Individual problem-solving styles", "Emotional color expression"],
                    quantum_detection: true,
                    holofractographic_processing: true
                },
                relate: {
                    communication_patterns: ["Dynamic color communication", "Tactile arm signaling", "Body posture messaging"],
                    symbiotic_relationships: ["Protective shell relationships", "Cleaning station interactions", "Prey-sharing behaviors"],
                    quantum_connections: true,
                    ecosystem_role: true
                },
                apply: {
                    strategic_non_response: true,
                    creative_applications: ["Tool use and modification", "Camouflage innovation", "Problem-solving creativity"],
                    timing_wisdom: true,
                    coherence_optimization: true
                },
                unified_physics_integration: "Distributed neural quantum processing, chromatophore quantum coherence, arm-brain integration",
                life_contribution: "Marine ecosystem balance, problem-solving innovation, distributed intelligence modeling",
                research_gaps: ["Quantum neural processing", "Chromatophore quantum mechanics", "Consciousness distribution"]
            };
        }

        if (speciesName.toLowerCase().includes('human')) {
            return {
                species: speciesName,
                perceive: {
                    sensory_systems: ["Visual pattern recognition", "Auditory language processing", "Spatial awareness", "Social emotional sensing"],
                    self_awareness_indicators: ["Metacognitive reflection", "Future planning", "Abstract thinking"],
                    quantum_detection: true,
                    holofractographic_processing: true
                },
                relate: {
                    communication_patterns: ["Language and symbols", "Emotional expression", "Cultural transmission", "Digital networking"],
                    symbiotic_relationships: ["Agricultural partnerships", "Domestic animal bonds", "Microbiome integration"],
                    quantum_connections: true,
                    ecosystem_role: true
                },
                apply: {
                    strategic_non_response: true,
                    creative_applications: ["Technology development", "Artistic expression", "Scientific innovation", "Social organizing"],
                    timing_wisdom: true,
                    coherence_optimization: true
                },
                unified_physics_integration: "Neural quantum coherence, collective consciousness, technological augmentation",
                life_contribution: "Global communication networks, scientific understanding, cultural evolution",
                research_gaps: ["Consciousness emergence", "Collective intelligence", "Technology-biology integration"]
            };
        }

        // Generic fallback
        return {
            species: speciesName,
            perceive: {
                sensory_systems: ["Species-specific sensory adaptations"],
                self_awareness_indicators: ["Behavioral complexity indicators"],
                quantum_detection: true,
                holofractographic_processing: true
            },
            relate: {
                communication_patterns: ["Communication methods"],
                symbiotic_relationships: ["Ecological relationships"],
                quantum_connections: true,
                ecosystem_role: true
            },
            apply: {
                strategic_non_response: true,
                creative_applications: ["Adaptive behaviors"],
                timing_wisdom: true,
                coherence_optimization: true
            },
            unified_physics_integration: "Quantum biology connections",
            life_contribution: "Ecological intelligence contribution",
            research_gaps: ["Research areas needed"]
        };
    };

    const analyzeTemporalPatterns = (allSpeciesData) => {
        // Placeholder for temporal analysis
        return {
            patterns: ["Multi-temporal coordination across species"],
            insights: ["Different species operate on various timescales"]
        };
    };

    // Enhanced Visual Mapping Component
    const VisualIntelligenceMapping = ({ results }) => {
        const allSpeciesData = results.allSpecies || [];
        const gradientData = generateIntelligenceGradient(allSpeciesData);

        useEffect(() => {
            if (showVisualMapping && mapCanvasRef.current && gradientData.length > 0) {
                drawTriangularIntelligenceMap(mapCanvasRef.current, gradientData);
            }
        }, [showVisualMapping, gradientData]);

        return (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        <Eye className="text-indigo-600" />
                        Triangular Intelligence Mapping
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                if (mapCanvasRef.current) {
                                    const canvas = mapCanvasRef.current;
                                    const url = canvas.toDataURL('image/png');
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = \`intelligence-map-\${Date.now()}.png\`;
                                    a.click();
                                    setShareUrl('Intelligence map saved! 🗺️');
                                    setTimeout(() => setShareUrl(''), 3000);
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                        >
                            <Camera className="w-4 h-4" />
                            Save Map
                        </button>
                        <button
                            onClick={() => setShowVisualMapping(!showVisualMapping)}
                            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                        >
                            {showVisualMapping ? 'Hide' : 'Show'} Map
                        </button>
                    </div>
                </div>

                {showVisualMapping && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <canvas
                                ref={mapCanvasRef}
                                className="border rounded-lg shadow-lg bg-gradient-to-br from-slate-50 to-blue-50"
                                width="400"
                                height="400"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                            {gradientData.map((item, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div
                                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="font-medium text-gray-800 truncate">{item.species}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <div>Position: ({item.coords.x.toFixed(0)}, {item.coords.y.toFixed(0)})</div>
                                        <div>Overall: {(item.metrics.overall * 100).toFixed(0)}%</div>
                                        <div className="flex gap-1">
                                            <span className="px-1 bg-blue-100 text-blue-700 rounded text-xs">P:{(item.metrics.perceive * 100).toFixed(0)}%</span>
                                            <span className="px-1 bg-green-100 text-green-700 rounded text-xs">R:{(item.metrics.relate * 100).toFixed(0)}%</span>
                                            <span className="px-1 bg-purple-100 text-purple-700 rounded text-xs">A:{(item.metrics.apply * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                            <h4 className="font-medium mb-2 text-gray-800">Triangular Intelligence Space Guide:</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium text-blue-700">• Perceive Corner (Bottom-Left)</p>
                                    <p className="text-xs ml-2">Species specializing in sensory awareness and information detection</p>
                                    <p className="font-medium text-green-700 mt-2">• Relate Corner (Top)</p>
                                    <p className="text-xs ml-2">Species specializing in communication and symbiotic relationships</p>
                                </div>
                                <div>
                                    <p className="font-medium text-purple-700">• Apply Corner (Bottom-Right)</p>
                                    <p className="text-xs ml-2">Species specializing in creative application and strategic action</p>
                                    <p className="font-medium text-gray-700 mt-2">• Center Balance</p>
                                    <p className="text-xs ml-2">Species with balanced intelligence across all three capacities</p>
                                </div>
                            </div>
                            <p className="mt-2 text-xs"><strong>Proximity:</strong> Species positioned closer together share similar intelligence patterns. Connection lines show relational strength.</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Multi-Species Input Component
    const MultiSpeciesInput = () => (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Research Parameters</h2>
            <div className="space-y-4 mb-4">
                {speciesList.map((species, index) => (
                    <div key={species.id} className="flex items-center gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {species.label}:
                            </label>
                            <input
                                type="text"
                                value={species.name}
                                onChange={(e) => updateSpecies(species.id, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., dolphins, mycorrhizal networks, coral reefs"
                                disabled={isResearching}
                            />
                        </div>
                        {speciesList.length > 2 && (
                            <button
                                onClick={() => removeSpecies(species.id)}
                                className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                disabled={isResearching}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {speciesList.length < 5 && (
                <button
                    onClick={addSpecies}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors mb-6"
                    disabled={isResearching}
                >
                    <Plus className="w-4 h-4" />
                    Add Another Life Form ({speciesList.length}/5)
                </button>
            )}

            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Include Human Intelligence Analysis</h3>
                        <p className="text-sm text-gray-600">Add humans as an additional comparison point to provide familiar context within the broader spectrum of life.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                            type="checkbox"
                            checked={includeHumans}
                            onChange={(e) => setIncludeHumans(e.target.checked)}
                            disabled={isResearching}
                            className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 transition-colors">
                            <div className={\`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform \${includeHumans ? 'translate-x-5' : 'translate-x-0'}\`}></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                            {includeHumans ? 'Human Baseline Included' : 'Add Human Baseline'}
                        </span>
                    </label>
                </div>
            </div>

            <button
                onClick={conductResearch}
                disabled={isResearching || speciesList.filter(s => s.name.trim()).length < 2}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isResearching ? (
                    <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Researching...
                    </>
                ) : (
                    <>
                        <Search className="w-5 h-5" />
                        Begin Multi-Species Intelligence Research
                    </>
                )}
            </button>

            {(researchProgress || isResearching) && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                        {isResearching && <Loader className="w-4 h-4 animate-spin text-blue-600" />}
                        <p className="text-blue-700 font-medium">
                            {researchProgress || "Initializing research..."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );

    // Enhanced Results Display
    const MultiSpeciesResults = ({ results }) => (
        <div className="space-y-8">
            {/* Enhanced Comparison Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        <Heart className="text-green-600" />
                        Multi-Species Intelligence Connections
                    </h2>
                    <button
                        onClick={() => {
                            if (!results) return;
                            const reportText = \`🧠 Multi-Species Intelligence Analysis
\${results.allSpecies.map(s => s.species).join(' vs ')}\${results.humanData ? ' vs Humans' : ''}
Generated: \${results.timestamp}

UNIVERSAL PATTERNS:
\${results.comparison.similarities.map(s => \`• \${s}\`).join('\\n')}

DIVERSITY INSIGHTS:
\${results.comparison.differences.map(d => \`• \${d}\`).join('\\n')}

COLLECTIVE CONTRIBUTION TO LIFE:
\${results.comparison.wholeLifeContribution.map(c => \`• \${c}\`).join('\\n')}

---
Generated by Species Intelligence Research Agent
Redefining Intelligence Framework - Kerri Lake\`;
                            
                            navigator.clipboard.writeText(reportText).then(() => {
                                setShareUrl('Multi-species report copied! 📋');
                                setTimeout(() => setShareUrl(''), 3000);
                            }).catch(() => {
                                const blob = new Blob([reportText], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = \`multi-species-analysis-\${Date.now()}.txt\`;
                                a.click();
                                URL.revokeObjectURL(url);
                                setShareUrl('Multi-species report downloaded! 📄');
                                setTimeout(() => setShareUrl(''), 3000);
                            });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                        Share Research
                    </button>
                </div>

                {shareUrl && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-700 text-sm font-medium text-center">{shareUrl}</p>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-l-blue-500">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            Universal Patterns
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700">
                            {results.comparison.similarities.map((similarity, idx) => (
                                <p key={idx} className="leading-relaxed">{similarity}</p>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-l-purple-500">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            Diversity Insights
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700">
                            {results.comparison.differences.map((difference, idx) => (
                                <p key={idx} className="leading-relaxed">{difference}</p>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-l-green-500">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-green-600" />
                            Collective Life Contribution
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700">
                            {results.comparison.wholeLifeContribution.map((contribution, idx) => (
                                <p key={idx} className="leading-relaxed">{contribution}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Intelligence Mapping */}
            <VisualIntelligenceMapping results={results} />

            {/* Species Count Summary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Brain className="text-indigo-600" />
                    Intelligence Spectrum Summary
                </h3>
                <p className="text-gray-700 mb-4">
                    Analyzing {results.allSpecies.length} distinct forms of life{results.humanData ? ' plus human intelligence' : ''} reveals the extraordinary diversity and interconnectedness of intelligence across our shared planet.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {results.allSpecies.map((species, idx) => {
                        const metrics = results.metrics[\`species\${idx + 1}\`] || {};
                        return (
                            <div key={idx} className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="font-medium text-gray-800 text-sm mb-1">{species.species}</div>
                                <div className="text-xs text-gray-600">
                                    Overall: {((metrics.overall || 0) * 100).toFixed(0)}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    // Main component return
    return (
        <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                    <Brain className="text-blue-600" size={40} />
                    Species Intelligence Research Agent
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Exploring intelligence through quantum-enhanced relational capacity across all life forms
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Multi-Species Support • Triangular Intelligence Mapping • Export Capabilities
                </p>
            </div>

            {/* Multi-Species Input */}
            <MultiSpeciesInput />

            {/* Results */}
            {researchResults && (
                <MultiSpeciesResults results={researchResults} />
            )}
        </div>
    );
};

// Export for use
window.SpeciesIntelligenceResearcher = SpeciesIntelligenceResearcher;// Complete React Component from v24 Document
// This contains all the functionality from your original React implementation

const SpeciesIntelligenceResearcher = () => {
    const [speciesList, setSpeciesList] = useState([
        { id: 1, name: 'trees', label: 'First Life Form' },
        { id: 2, name: 'octopuses', label: 'Second Life Form' }
    ]);
    const [includeHumans, setIncludeHumans] = useState(false);
    const [researchResults, setResearchResults] = useState(null);
    const [isResearching, setIsResearching] = useState(false);
    const [researchProgress, setResearchProgress] = useState('');
    const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
    const [showVisualMapping, setShowVisualMapping] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const mapCanvasRef = useRef(null);

    // Multi-species management
    const addSpecies = () => {
        if (speciesList.length < 5) {
            const newId = Math.max(...speciesList.map(s => s.id)) + 1;
            setSpeciesList([
                ...speciesList,
                {
                    id: newId,
                    name: '',
                    label: \`Life Form \${speciesList.length + 1}\`
                }
            ]);
        }
    };

    const removeSpecies = (id) => {
        if (speciesList.length > 2) {
            setSpeciesList(speciesList.filter(s => s.id !== id));
        }
    };

    const updateSpecies = (id, name) => {
        setSpeciesList(speciesList.map(s =>
            s.id === id ? { ...s, name } : s
        ));
    };

    // Enhanced triangular coordinate calculation
    const calculateTriangularCoordinates = (speciesData) => {
        const metrics = calculateIntelligenceMetrics(speciesData);
        
        // Triangular barycentric coordinates
        const perceiveWeight = metrics.perceive;
        const relateWeight = metrics.relate;
        const applyWeight = metrics.apply;
        
        // Normalize weights
        const total = perceiveWeight + relateWeight + applyWeight;
        if (total === 0) return { x: 200, y: 300 }; // Default center position
        
        const p = perceiveWeight / total;
        const r = relateWeight / total;
        const a = applyWeight / total;
        
        // Triangle vertices (in canvas coordinates)
        const triangleSize = 280;
        const centerX = 200;
        const centerY = 200;
        
        // Vertices of equilateral triangle
        const vertices = {
            perceive: { x: centerX - triangleSize/2, y: centerY + triangleSize * Math.sqrt(3)/6 }, // Bottom left
            relate: { x: centerX, y: centerY - triangleSize * Math.sqrt(3)/3 }, // Top
            apply: { x: centerX + triangleSize/2, y: centerY + triangleSize * Math.sqrt(3)/6 } // Bottom right
        };

        // Calculate position using barycentric coordinates
        const x = p * vertices.perceive.x + r * vertices.relate.x + a * vertices.apply.x;
        const y = p * vertices.perceive.y + r * vertices.relate.y + a * vertices.apply.y;
        
        return { x, y };
    };

    const generateIntelligenceGradient = (allSpeciesData) => {
        return allSpeciesData.map((species, index) => {
            const metrics = calculateIntelligenceMetrics(species);
            const coords = calculateTriangularCoordinates(species);
            
            // Enhanced color generation for triangular space
            const perceiveInfluence = metrics.perceive;
            const relateInfluence = metrics.relate;
            const applyInfluence = metrics.apply;
            
            // Color mapping: Perceive=Blue, Relate=Green, Apply=Purple
            const hue = (perceiveInfluence * 240) + (relateInfluence * 120) + (applyInfluence * 280);
            const saturation = 60 + (metrics.overall * 35); // 60-95%
            const lightness = 45 + (metrics.overall * 25); // 45-70%
            
            return {
                species: species.species,
                coords,
                color: \`hsl(\${hue % 360}, \${saturation}%, \${lightness}%)\`,
                metrics,
                data: species,
                index
            };
        });
    };

    const drawTriangularIntelligenceMap = (canvas, gradientData) => {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = 400;
        const height = canvas.height = 400;
        
        // Clear canvas with gradient background
        const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw triangular intelligence space
        const triangleSize = 280;
        const centerX = 200;
        const centerY = 200;
        
        // Triangle vertices
        const vertices = {
            perceive: { x: centerX - triangleSize/2, y: centerY + triangleSize * Math.sqrt(3)/6 },
            relate: { x: centerX, y: centerY - triangleSize * Math.sqrt(3)/3 },
            apply: { x: centerX + triangleSize/2, y: centerY + triangleSize * Math.sqrt(3)/6 }
        };
        
        // Draw triangle outline with gradient fill
        const triangleGradient = ctx.createLinearGradient(
            vertices.perceive.x, vertices.perceive.y,
            vertices.apply.x, vertices.apply.y
        );
        triangleGradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)'); // Blue for Perceive
        triangleGradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.1)'); // Green for Relate
        triangleGradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)'); // Purple for Apply
        
        ctx.fillStyle = triangleGradient;
        ctx.beginPath();
        ctx.moveTo(vertices.perceive.x, vertices.perceive.y);
        ctx.lineTo(vertices.relate.x, vertices.relate.y);
        ctx.lineTo(vertices.apply.x, vertices.apply.y);
        ctx.closePath();
        ctx.fill();
        
        // Draw triangle border
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw corner labels with colored backgrounds
        const labelStyle = {
            font: 'bold 14px sans-serif',
            textAlign: 'center',
            textBaseline: 'middle'
        };
        
        // Perceive label (bottom-left, blue)
        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.beginPath();
        ctx.arc(vertices.perceive.x, vertices.perceive.y + 25, 45, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = labelStyle.font;
        ctx.textAlign = labelStyle.textAlign;
        ctx.fillText('PERCEIVE', vertices.perceive.x, vertices.perceive.y + 25);
        
        // Relate label (top, green)
        ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
        ctx.beginPath();
        ctx.arc(vertices.relate.x, vertices.relate.y - 25, 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText('RELATE', vertices.relate.x, vertices.relate.y - 25);
        
        // Apply label (bottom-right, purple)
        ctx.fillStyle = 'rgba(147, 51, 234, 0.8)';
        ctx.beginPath();
        ctx.arc(vertices.apply.x, vertices.apply.y + 25, 35, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText('APPLY', vertices.apply.x, vertices.apply.y + 25);
        
        // Draw grid lines for reference
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        // Draw lines from each vertex to opposite edge midpoints
        const midpoints = {
            perceiveRelate: {
                x: (vertices.perceive.x + vertices.relate.x) / 2,
                y: (vertices.perceive.y + vertices.relate.y) / 2
            },
            relateApply: {
                x: (vertices.relate.x + vertices.apply.x) / 2,
                y: (vertices.relate.y + vertices.apply.y) / 2
            },
            applyPerceive: {
                x: (vertices.apply.x + vertices.perceive.x) / 2,
