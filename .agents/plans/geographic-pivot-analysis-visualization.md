# Feature: Geographic Pivot Analysis Visualization

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Create an interactive geographic visualization showing China's strategic pivot from US markets to Global South destinations. The feature will display before/after choropleth maps, animated flow transitions, and comparative analysis tools to demonstrate how China redirected $1.2 trillion in trade flows despite US tariffs. Users can explore regional trade shifts, growth rates by destination, and the geographic redistribution that enabled China's record surplus.

## User Story

As a policy maker or international trade analyst
I want to visualize China's geographic trade pivot from US to Global South markets
So that I can understand the strategic redistribution of trade flows and assess geopolitical implications

## Problem Statement

Understanding China's trade diversification strategy requires clear visualization of geographic shifts in export destinations. Users need to see both the scale of redirection and the specific countries/regions that absorbed trade flows previously destined for the US market.

## Solution Statement

Build interactive geographic visualizations using React Leaflet and D3.js, featuring before/after choropleth maps, animated flow transitions, and comparative analysis tools. Include filtering by time periods, trade volumes, and regional groupings to show the complete picture of China's geographic pivot strategy.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: High
**Primary Systems Affected**: Frontend visualization components, geographic data services
**Dependencies**: React Leaflet, D3.js, geographic data (GeoJSON), comparative analysis tools

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `.kiro/steering/tech.md` (lines 15-35) - Why: Contains geographic visualization requirements and performance standards
- `.kiro/steering/structure.md` (lines 20-40) - Why: Shows maps/ component organization pattern
- `.kiro/steering/product.md` (lines 60-80) - Why: Defines comparative analysis and geographic pivot requirements

### New Files to Create

- `frontend/src/pages/Comparison.tsx` - Main geographic pivot analysis page
- `frontend/src/components/maps/GeographicPivotMap.tsx` - Main map component with before/after views
- `frontend/src/components/maps/ChoroplethLayer.tsx` - Choropleth map layer for trade volumes
- `frontend/src/components/maps/FlowAnimationLayer.tsx` - Animated trade flow visualization
- `frontend/src/components/maps/RegionalComparison.tsx` - Side-by-side regional analysis
- `frontend/src/components/maps/MapControls.tsx` - Time period and filter controls
- `frontend/src/components/maps/TradeFlowLegend.tsx` - Interactive legend and data explanation
- `frontend/src/hooks/useGeographicData.ts` - Data fetching hook for geographic trade data
- `frontend/src/services/geographicService.ts` - API service for geographic and trade flow data
- `frontend/src/types/geographic.ts` - TypeScript types for geographic data structures
- `frontend/src/utils/geoDataUtils.ts` - Geographic data processing and coordinate utilities
- `frontend/src/data/countries.geojson` - Country boundary data for choropleth maps
- `tests/components/maps/GeographicPivotMap.test.tsx` - Unit tests for map components

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [React Leaflet Documentation](https://react-leaflet.js.org/)
  - Specific section: Custom layers and GeoJSON integration
  - Why: Required for choropleth maps and interactive geographic features
- [Leaflet Choropleth Tutorial](https://leafletjs.com/examples/choropleth/)
  - Specific section: Data-driven styling and color scales
  - Why: Essential for trade volume visualization on maps
- [D3.js Geographic Projections](https://d3js.org/d3-geo)
  - Specific section: Path generation and coordinate transformations
  - Why: Needed for custom geographic visualizations and flow lines
- [GeoJSON Specification](https://geojson.org/)
  - Specific section: Feature collections and properties
  - Why: Understanding data structure for country boundaries and trade data

### Patterns to Follow

**Map Component Structure:**
```typescript
// React Leaflet integration with custom layers
const GeographicPivotMap: React.FC<Props> = ({ period, filters }) => {
  const mapRef = useRef<L.Map>(null);
  
  return (
    <MapContainer ref={mapRef} center={[20, 0]} zoom={2}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ChoroplethLayer data={tradeData} period={period} />
      <FlowAnimationLayer flows={tradeFlows} animated={true} />
    </MapContainer>
  );
};
```

**Choropleth Data Processing:**
```typescript
// Process trade data for choropleth visualization
const processTradeDataForMap = (tradeData: TradeData[], countries: GeoJSON): MapData => {
  return countries.features.map(country => ({
    ...country,
    properties: {
      ...country.properties,
      tradeVolume: tradeData.find(t => t.countryCode === country.properties.ISO_A3)?.volume || 0,
      growthRate: calculateGrowthRate(tradeData, country.properties.ISO_A3)
    }
  }));
};
```

**Flow Animation Pattern:**
```typescript
// Animated trade flow lines
const FlowLine: React.FC<FlowProps> = ({ origin, destination, volume, animated }) => {
  const pathRef = useRef<L.Polyline>(null);
  
  useEffect(() => {
    if (animated && pathRef.current) {
      // Animate flow along path
      animateFlow(pathRef.current, volume);
    }
  }, [animated, volume]);
  
  return <Polyline ref={pathRef} positions={[origin, destination]} />;
};
```

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation

Set up geographic visualization infrastructure with React Leaflet integration and basic map components.

**Tasks:**
- Install React Leaflet and geographic data dependencies
- Set up basic map container with world view
- Implement country boundary data loading (GeoJSON)
- Create responsive map layout with controls

### Phase 2: Core Implementation

Build choropleth visualization and animated flow components for showing trade volume changes and geographic redistribution.

**Tasks:**
- Implement choropleth layer with trade volume data
- Create animated flow lines showing trade redirections
- Add before/after comparison functionality
- Implement regional grouping and filtering

### Phase 3: Integration

Connect to trade data APIs and implement comparative analysis tools for understanding the geographic pivot strategy.

**Tasks:**
- Integrate with backend APIs for geographic trade data
- Implement time period comparison (2018 vs 2025)
- Add regional analysis with growth rate calculations
- Create export functionality for geographic insights

### Phase 4: Testing & Validation

Comprehensive testing of map interactions, data accuracy, and performance with large geographic datasets.

**Tasks:**
- Unit tests for geographic data processing
- Integration tests for map interactions and animations
- Performance testing with full country dataset
- Cross-browser testing for map rendering

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### UPDATE frontend/package.json

- **IMPLEMENT**: Add React Leaflet and geographic visualization dependencies
- **PATTERN**: Standard npm package installation with peer dependencies
- **IMPORTS**: react-leaflet, leaflet, @types/leaflet, d3-geo, topojson-client
- **GOTCHA**: Include Leaflet CSS imports and handle CSS-in-JS conflicts
- **VALIDATE**: `npm install && npm run build`

### CREATE frontend/src/types/geographic.ts

- **IMPLEMENT**: TypeScript interfaces for geographic and trade flow data
- **PATTERN**: Interface-based type definitions with GeoJSON compatibility
- **IMPORTS**: GeoJSON type definitions from @types/geojson
- **GOTCHA**: Ensure compatibility with Leaflet and D3.js type systems
- **VALIDATE**: `npx tsc --noEmit`

### CREATE frontend/src/utils/geoDataUtils.ts

- **IMPLEMENT**: Geographic data processing and coordinate transformation utilities
- **PATTERN**: Pure functions for data transformation and calculations
- **IMPORTS**: d3-geo for projections, geographic calculation libraries
- **GOTCHA**: Handle coordinate system transformations and edge cases
- **VALIDATE**: `npm test -- geoDataUtils.test.ts`

### CREATE frontend/src/data/countries.geojson

- **IMPLEMENT**: Download and process country boundary data for choropleth maps
- **PATTERN**: Standard GeoJSON format with country properties
- **IMPORTS**: None (static data file)
- **GOTCHA**: Ensure country codes match trade data identifiers
- **VALIDATE**: Validate GeoJSON format with online tools

### CREATE frontend/src/services/geographicService.ts

- **IMPLEMENT**: API service functions for geographic trade data and country information
- **PATTERN**: Async/await with geographic data aggregation
- **IMPORTS**: axios or fetch, types from geographic.ts
- **GOTCHA**: Handle large geographic datasets and coordinate data efficiently
- **VALIDATE**: `npm test -- geographicService.test.ts`

### CREATE frontend/src/hooks/useGeographicData.ts

- **IMPLEMENT**: Custom React hook for geographic trade data fetching and processing
- **PATTERN**: React Query with geographic data caching and transformation
- **IMPORTS**: react, geographicService, React Query
- **GOTCHA**: Implement efficient caching for different time periods and regions
- **VALIDATE**: `npm test -- useGeographicData.test.ts`

### CREATE frontend/src/components/maps/ChoroplethLayer.tsx

- **IMPLEMENT**: Choropleth map layer component for trade volume visualization
- **PATTERN**: React Leaflet custom layer with GeoJSON integration
- **IMPORTS**: react-leaflet, leaflet, geographic data utilities
- **GOTCHA**: Handle dynamic color scaling and data updates efficiently
- **VALIDATE**: `npm run dev` and verify choropleth colors render correctly

### CREATE frontend/src/components/maps/FlowAnimationLayer.tsx

- **IMPLEMENT**: Animated trade flow visualization with curved flow lines
- **PATTERN**: Custom Leaflet layer with SVG animations
- **IMPORTS**: react-leaflet, d3-geo for path calculations, animation utilities
- **GOTCHA**: Optimize animation performance for hundreds of flow lines
- **VALIDATE**: Test flow animations with sample trade data

### CREATE frontend/src/components/maps/MapControls.tsx

- **IMPLEMENT**: Interactive controls for time period selection and filtering
- **PATTERN**: Controlled components with map state synchronization
- **IMPORTS**: React, UI components, date picker components
- **GOTCHA**: Synchronize control state with map visualization updates
- **VALIDATE**: Test control interactions and map updates

### CREATE frontend/src/components/maps/TradeFlowLegend.tsx

- **IMPLEMENT**: Interactive legend explaining choropleth colors and flow meanings
- **PATTERN**: Responsive legend component with interactive elements
- **IMPORTS**: React, color scale utilities, formatting functions
- **GOTCHA**: Handle dynamic legend updates when data changes
- **VALIDATE**: Verify legend accuracy and responsiveness

### CREATE frontend/src/components/maps/GeographicPivotMap.tsx

- **IMPLEMENT**: Main map component integrating all layers and controls
- **PATTERN**: React Leaflet MapContainer with custom layer management
- **IMPORTS**: react-leaflet, all map layer components, map controls
- **GOTCHA**: Manage layer rendering order and interaction conflicts
- **VALIDATE**: `npm run dev` and test complete map functionality

### CREATE frontend/src/components/maps/RegionalComparison.tsx

- **IMPLEMENT**: Side-by-side regional analysis with before/after statistics
- **PATTERN**: Responsive grid layout with comparative data visualization
- **IMPORTS**: React, chart components, regional data utilities
- **GOTCHA**: Synchronize regional selection with map highlighting
- **VALIDATE**: Test regional comparison accuracy and interactions

### CREATE frontend/src/pages/Comparison.tsx

- **IMPLEMENT**: Main geographic pivot analysis page with integrated components
- **PATTERN**: Page-level component with responsive layout and state management
- **IMPORTS**: All map components, layout components, page-level state
- **GOTCHA**: Coordinate state between map and comparison components
- **VALIDATE**: `npm run dev` and test complete page functionality

### UPDATE frontend/src/pages/Comparison.tsx

- **IMPLEMENT**: Add data export functionality and cross-visualization integration
- **PATTERN**: Export utilities with multiple format support (PNG, SVG, CSV)
- **IMPORTS**: Export utilities, state management for cross-component communication
- **GOTCHA**: Handle large geographic data exports efficiently
- **VALIDATE**: Test export functionality and data accuracy

### CREATE tests/components/maps/GeographicPivotMap.test.tsx

- **IMPLEMENT**: Unit tests for map components and geographic data processing
- **PATTERN**: React Testing Library with Leaflet mocking
- **IMPORTS**: @testing-library/react, jest, leaflet (mocked)
- **GOTCHA**: Mock Leaflet map instance and geographic calculations
- **VALIDATE**: `npm test -- GeographicPivotMap.test.tsx`

---

## TESTING STRATEGY

### Unit Tests

Test geographic data processing, coordinate transformations, and map component rendering. Mock Leaflet and focus on business logic validation.

### Integration Tests

Test complete map workflows including data loading, choropleth rendering, and flow animations. Verify responsive behavior and cross-component interactions.

### Edge Cases

- Handle countries with missing trade data gracefully
- Test with extreme trade volume values (very large or zero)
- Verify performance with maximum expected dataset (200+ countries)
- Test map interactions on touch devices

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
npx eslint frontend/src/pages/Comparison.tsx
npx eslint frontend/src/components/maps/
npx prettier --check frontend/src/components/maps/
npx tsc --noEmit
```

### Level 2: Unit Tests

```bash
npm test -- --testPathPattern=Comparison
npm test -- --testPathPattern=maps
npm test -- --coverage --testPathPattern=geographic
```

### Level 3: Integration Tests

```bash
npm run test:integration
npm run build && npm run preview
```

### Level 4: Manual Validation

```bash
# Start development server
npm run dev

# Test geographic pivot functionality:
# 1. World map renders with country boundaries
# 2. Choropleth colors show trade volume differences
# 3. Flow animations display trade redirections
# 4. Before/after comparison shows 2018 vs 2025 data
# 5. Regional filtering updates map and statistics
# 6. Hover tooltips show country trade details
# 7. Legend explains color coding and flow meanings
# 8. Map controls allow time period selection
# 9. Regional comparison panel shows accurate statistics
# 10. Export functionality works for maps and data
```

### Level 5: Performance Validation

```bash
# Monitor map performance:
# - Initial map render time (<1000ms)
# - Choropleth layer update performance (<200ms)
# - Flow animation frame rate (30fps minimum)
# - Memory usage during extended interaction
# - Mobile touch interaction responsiveness
```

---

## ACCEPTANCE CRITERIA

- [ ] World map displays with accurate country boundaries
- [ ] Choropleth visualization shows trade volume by country with appropriate color scaling
- [ ] Animated flow lines demonstrate trade redirections from US to Global South
- [ ] Before/after comparison clearly shows 2018 vs 2025 trade patterns
- [ ] Regional filtering allows focus on specific geographic areas
- [ ] Interactive tooltips provide detailed trade statistics for each country
- [ ] Legend clearly explains color coding and flow line meanings
- [ ] Time period controls allow smooth transitions between comparison periods
- [ ] Regional comparison panel shows accurate growth statistics
- [ ] Map export functionality generates high-quality images and data files
- [ ] Responsive design works on desktop, tablet, and mobile devices
- [ ] All validation commands pass with zero errors
- [ ] Performance remains smooth with full dataset (200+ countries)

---

## COMPLETION CHECKLIST

- [ ] React Leaflet integration working with custom layers
- [ ] Choropleth layer rendering trade data accurately
- [ ] Flow animation layer showing smooth trade redirections
- [ ] Map controls functional and responsive
- [ ] Regional comparison component providing accurate analysis
- [ ] Data fetching and processing optimized for geographic datasets
- [ ] Unit and integration tests passing
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness and touch interactions working
- [ ] Export functionality generating accurate outputs

---

## NOTES

**Performance Considerations**: Use canvas rendering for flow animations if SVG performance becomes an issue. Implement data clustering for countries with similar trade patterns. Consider using WebGL for complex flow visualizations.

**Design Decisions**: Chose React Leaflet over D3.js for better map interaction support. Using choropleth for trade volumes and flow lines for redirections. Color scheme: blue for stable trade, green for growth, red for decline.

**Geographic Regions**:
- **Global South**: Africa, Latin America, Southeast Asia, South Asia
- **Traditional Partners**: US, EU, Japan, South Korea
- **New Growth Markets**: ASEAN, Belt and Road countries, emerging economies

**Data Sources**: Trade data from Chinese customs, country boundaries from Natural Earth, regional classifications from UN Statistics Division.

**Interaction Design**: Click countries for detailed statistics, hover for quick info, drag to pan map, scroll to zoom. Mobile uses touch gestures with momentum and pinch-to-zoom support.
