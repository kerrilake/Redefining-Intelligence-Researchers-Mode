# Species Intelligence Research Agent - Technical API Documentation

## Architecture Overview

The Species Intelligence Research Agent is built as a modular, client-side web application using vanilla JavaScript with HTML5 Canvas for visualization. The architecture follows a clean separation of concerns across multiple files and classes.

### Core Components

#### 1. Main Application (`js/main.js`)
**Class: `SpeciesIntelligenceApp`**

Primary application controller handling state management, user interactions, and coordination between modules.

```javascript
// Initialize the application
const app = new SpeciesIntelligenceApp();
```

**Key Methods:**
- `initialize()` - Sets up DOM listeners and initial state
- `conductResearch()` - Orchestrates the research simulation process
- `displayResults()` - Renders research findings in the UI
- `generateMultiSpeciesComparison()` - Performs comparative analysis

#### 2. Species Data Repository (`js/species-data.js`)
**Object: `SpeciesData`**

Contains detailed intelligence profiles and research simulation logic.

```javascript
// Research a species
const profile = await SpeciesData.researchSpeciesIntelligence('dolphins');
```

**Key Methods:**
- `researchSpeciesIntelligence(speciesName)` - Returns intelligence profile for named species
- `getTreeProfile()`, `getOctopusProfile()`, etc. - Specific species profile generators
- `delay(ms)` - Utility for research simulation timing

#### 3. Visualization Engine (`js/visualization.js`)
**Object: `IntelligenceVisualization`**

Handles triangular coordinate mapping and canvas-based visualization.

```javascript
// Calculate triangular positioning
const coords = IntelligenceVisualization.calculateTriangularCoordinates(speciesData);

// Draw complete intelligence map
IntelligenceVisualization.drawTriangularIntelligenceMap(canvas, gradientData);
```

**Key Methods:**
- `calculateTriangularCoordinates(speciesData)` - Maps intelligence to triangle position
- `generateIntelligenceGradient(allSpeciesData)` - Creates color and positioning data
- `drawTriangularIntelligenceMap(canvas, gradientData)` - Renders complete visualization
- `calculateIntelligenceMetrics(speciesData)` - Converts raw data to normalized metrics

## Data Structures

### Species Intelligence Profile

Each species is represented by a comprehensive intelligence profile following the Perceive/Relate/Apply framework:

```javascript
{
  species: "Species Name",
  perceive: {
    sensory_systems: ["System 1", "System 2", ...],
    self_awareness_indicators: ["Indicator 1", "Indicator 2", ...],
    quantum_detection: boolean,
    holofractographic_processing: boolean
  },
  relate: {
    communication_patterns: ["Pattern 1", "Pattern 2", ...],
    symbiotic_relationships: ["Relationship 1", "Relationship 2", ...],
    quantum_connections: boolean,
    ecosystem_role: boolean
  },
  apply: {
    strategic_non_response: boolean,
    creative_applications: ["Application 1", "Application 2", ...],
    timing_wisdom: boolean,
    coherence_optimization: boolean
  },
  unified_physics_integration: "Description of quantum/physics integration",
  life_contribution: "Species contribution to life's continuation",
  research_gaps: ["Gap 1", "Gap 2", ...]
}
```

### Intelligence Metrics

Calculated metrics for each species across the three dimensions:

```javascript
{
  perceive: 0.75,    // 0.0 - 1.0 range
  relate: 0.82,      // 0.0 - 1.0 range  
  apply: 0.68,       // 0.0 - 1.0 range
  overall: 0.75      // Average of the three dimensions
}
```

### Triangular Coordinates

Positioning within the triangular intelligence space:

```javascript
{
  x: 187.5,          // Canvas x-coordinate
  y: 245.3           // Canvas y-coordinate
}
```

## Triangular Intelligence Mapping

### Coordinate System

The triangular mapping uses barycentric coordinates to position species within an equilateral triangle representing the Perceive/Relate/Apply framework.

**Triangle Vertices:**
```javascript
const vertices = {
  perceive: { x: centerX - triangleSize/2, y: centerY + triangleSize * Math.sqrt(3)/6 },  // Bottom-left
  relate: { x: centerX, y: centerY - triangleSize * Math.sqrt(3)/3 },                    // Top
  apply: { x: centerX + triangleSize/2, y: centerY + triangleSize * Math.sqrt(3)/6 }     // Bottom-right
};
```

**Coordinate Calculation:**
```javascript
// Normalize intelligence weights
const total = perceiveWeight + relateWeight + applyWeight;
const p = perceiveWeight / total;
const r = relateWeight / total;
const a = applyWeight / total;

// Calculate barycentric coordinates
const x = p * vertices.perceive.x + r * vertices.relate.x + a * vertices.apply.x;
const y = p * vertices.perceive.y + r * vertices.relate.y + a * vertices.apply.y;
```

### Color Mapping

Species colors are generated based on their intelligence distribution:

```javascript
// Color mapping: Perceive=Blue(240°), Relate=Green(120°), Apply=Purple(280°)
const hue = (perceiveInfluence * 240) + (relateInfluence * 120) + (applyInfluence * 280);
const saturation = 60 + (metrics.overall * 35); // Range: 60-95%
const lightness = 45 + (metrics.overall * 25);   // Range: 45-70%
const color = `hsl(${hue % 360}, ${saturation}%, ${lightness}%)`;
```

## Canvas Rendering Pipeline

### 1. Background Rendering
```javascript
// Radial gradient background
const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
gradient.addColorStop(0, '#f8fafc');
gradient.addColorStop(1, '#e2e8f0');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);
```

### 2. Triangle Space Rendering
```javascript
// Triangle with gradient fill representing intelligence dimensions
const triangleGradient = ctx.createLinearGradient(...);
triangleGradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');    // Perceive (Blue)
triangleGradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.1)');   // Relate (Green)
triangleGradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)');    // Apply (Purple)
```

### 3. Species Point Rendering
```javascript
// Glow effect
const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
glowGradient.addColorStop(0, speciesColor);
glowGradient.addColorStop(1, 'transparent');

// Main circle with border and highlight
ctx.arc(x, y, 12, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
```

## Intelligence Scoring Algorithm

### Scoring Components

Each intelligence dimension is scored using multiple weighted factors:

**Perceive Scoring:**
```javascript
perceiveScore += sensory_systems.length * 0.25;           // Sensory diversity
perceiveScore += self_awareness_indicators.length * 0.25; // Self-awareness depth
perceiveScore += quantum_detection ? 0.3 : 0;             // Quantum sensing capability
perceiveScore += holofractographic_processing ? 0.2 : 0;  // Information processing complexity
```

**Relate Scoring:**
```javascript
relateScore += communication_patterns.length * 0.25;      // Communication complexity
relateScore += symbiotic_relationships.length * 0.25;     // Relationship diversity
relateScore += quantum_connections ? 0.3 : 0;             // Non-local coordination
relateScore += ecosystem_role ? 0.2 : 0;                  // Ecological integration
```

**Apply Scoring:**
```javascript
applyScore += strategic_non_response ? 0.3 : 0;           // Strategic restraint capability
applyScore += creative_applications.length * 0.25;        // Creative adaptation diversity
applyScore += timing_wisdom ? 0.25 : 0;                   // Temporal coordination
applyScore += coherence_optimization ? 0.2 : 0;           // System optimization ability
```

### Normalization

All scores are clamped to a maximum of 1.0 to ensure consistent scaling:

```javascript
return {
  perceive: Math.min(perceiveScore, 1.0),
  relate: Math.min(relateScore, 1.0),
  apply: Math.min(applyScore, 1.0),
  overall: Math.min((perceiveScore + relateScore + applyScore) / 3, 1.0)
};
```

## API Methods Reference

### SpeciesIntelligenceApp Class

#### Constructor
```javascript
new SpeciesIntelligenceApp()
```
Initializes the application with default state and sets up event listeners.

#### Public Methods

**State Management:**
- `getState()` - Returns current application state for debugging
- `reset()` - Resets application to initial state
- `handleError(error, context)` - Centralized error handling

**Species Management:**
- `addSpecies()` - Adds new species input field (max 5)
- `removeSpecies(id)` - Removes species by ID (min 2)
- `updateSpecies(id, name)` - Updates species name

**Research Operations:**
- `conductResearch()` - Initiates complete research simulation
- `generateMultiSpeciesComparison(allSpeciesData)` - Performs comparative analysis

**Visualization Control:**
- `toggleMap()` - Shows/hides triangular intelligence map
- `drawIntelligenceMap()` - Renders canvas visualization
- `saveMap()` - Downloads map as PNG image

**Data Export:**
- `shareResearch()` - Copies/downloads research report
- `generateReportText()` - Creates formatted research report

### SpeciesData Object

#### Research Methods
- `researchSpeciesIntelligence(speciesName)` - Main research entry point
- `getTreeProfile(speciesName)` - Tree species intelligence profile
- `getOctopusProfile(speciesName)` - Octopus species intelligence profile
- `getHumanProfile(speciesName)` - Human intelligence profile
- `getDolphinProfile(speciesName)` - Dolphin species intelligence profile
- `getMycorrhizalProfile(speciesName)` - Fungal network intelligence profile
- `getCoralProfile(speciesName)` - Coral species intelligence profile
- `getBeeProfile(speciesName)` - Bee colony intelligence profile
- `getGenericProfile(speciesName)` - Generic species template

### IntelligenceVisualization Object

#### Coordinate Calculation
- `calculateTriangularCoordinates(speciesData)` - Maps intelligence to triangle position
- `calculateIntelligenceMetrics(speciesData)` - Converts raw data to normalized metrics

#### Visualization Generation
- `generateIntelligenceGradient(allSpeciesData)` - Creates positioning/color data
- `drawTriangularIntelligenceMap(canvas, gradientData)` - Renders complete map
- `updateSpeciesLegend(legendContainer, gradientData)` - Updates species legend

#### Canvas Rendering
- `drawBackground(ctx, width, height)` - Renders gradient background
- `drawTriangularSpace(ctx)` - Draws triangle with gradient fill
- `drawCornerLabels(ctx)` - Adds labeled intelligence corners
- `drawReferenceGrid(ctx)` - Draws guidance grid lines
- `drawConnectionLines(ctx, gradientData)` - Connects nearby species
- `drawSpeciesPoints(ctx, gradientData)` - Renders species as colored circles

#### Utility Methods
- `getTriangleVertices()` - Returns triangle vertex coordinates
- `isPointInTriangle(x, y)` - Tests if coordinates are within triangle
- `getIntelligenceAnalysisForPosition(x, y)` - Analyzes intelligence at position
- `saveCanvasAsImage(canvas, filename)` - Downloads canvas as image

## Event System

### DOM Event Listeners

The application uses standard DOM event listeners for user interactions:

```javascript
// Species input changes
document.querySelectorAll('.species-input').forEach(input => {
  input.addEventListener('input', (e) => {
    const speciesId = parseInt(e.target.dataset.speciesId);
    this.updateSpecies(speciesId, e.target.value);
  });
});

// Research button
document.getElementById('research-btn').addEventListener('click', () => {
  this.conductResearch();
});

// Human toggle
document.getElementById('include-humans').addEventListener('change', (e) => {
  this.includeHumans = e.target.checked;
  this.updateToggleUI();
});
```

### Custom Events

No custom events are currently implemented, but the architecture supports adding them for advanced functionality.

## Performance Considerations

### Canvas Optimization
- Single canvas element reused for all visualizations
- Efficient redraw only when data changes
- Optimized path drawing for connection lines

### Memory Management
- Minimal object creation during rendering
- Reused calculation objects where possible
- Proper cleanup of DOM event listeners

### Simulation Delays
Realistic research delays are implemented using Promises:

```javascript
// Simulate research time
await new Promise(resolve => setTimeout(resolve, 800));
```

## Extension Points

### Adding New Species
1. Create new profile method in `SpeciesData`
2. Add species detection logic in `researchSpeciesIntelligence()`
3. Define intelligence characteristics following the standard profile structure

### Custom Visualization
The triangular mapping can be extended with additional visual elements:

```javascript
// Add custom visualization layer
IntelligenceVisualization.drawCustomLayer = function(ctx, gradientData) {
  // Custom rendering logic here
};
```

### Data Export Formats
Additional export formats can be added by extending the sharing functionality:

```javascript
// Add JSON export
app.exportAsJSON = function() {
  const data = JSON.stringify(this.researchResults, null, 2);
  // Download logic
};
```

## Error Handling

### Graceful Degradation
- Canvas fallback for unsupported browsers
- Input validation for species names
- Research simulation error recovery

### Debug Information
Debug information is available via browser console:

```javascript
// Application state
console.log(app.getState());

// Visualization data
console.log(IntelligenceVisualization.generateIntelligenceGradient(speciesData));
```

## Browser Compatibility

### Minimum Requirements
- HTML5 Canvas support
- ES6+ JavaScript (async/await, classes, arrow functions)
- CSS Grid and Flexbox support
- Modern DOM APIs (addEventListener, querySelector)

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Core functionality works without advanced CSS
- Fallback text for unsupported Canvas features
- Keyboard navigation support for accessibility

---

*This documentation covers the core technical implementation. For conceptual information about the intelligence framework, see the main README.md file.*
