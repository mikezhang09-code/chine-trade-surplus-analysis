# Feature: Interactive 3D Trade Flow Visualization

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Create an immersive 3D globe visualization showing China's export trade routes to different regions worldwide. Users can interact with the globe to explore trade flows, view route animations, and understand the geographic distribution of China's $1.2 trillion trade surplus. The visualization will show animated trade flows as curved lines between China and destination countries, with thickness and color representing trade volume and growth rates.

## User Story

As a policy maker or economics researcher
I want to visualize China's trade flows on an interactive 3D globe
So that I can understand the geographic distribution and scale of China's export relationships

## Problem Statement

Complex trade flow data is difficult to comprehend in traditional 2D charts. Users need an intuitive way to understand the geographic scope and relative importance of China's trade relationships, especially the shift from US markets to Global South destinations.

## Solution Statement

Build an interactive 3D globe using Three.js that renders trade routes as animated curves, with interactive controls for filtering by region, time period, and trade volume. The visualization will use WebGL for performance and include smooth animations to show trade flow dynamics.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: High
**Primary Systems Affected**: Frontend visualization components, data processing services
**Dependencies**: Three.js, React Three Fiber, geographic coordinate data

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `.kiro/steering/tech.md` (lines 1-50) - Why: Contains Three.js integration requirements and performance standards
- `.kiro/steering/structure.md` (lines 20-40) - Why: Shows component organization pattern for charts/ directory
- `.kiro/steering/product.md` (lines 30-50) - Why: Defines user interaction requirements and educational features

### New Files to Create

- `frontend/src/components/charts/TradeFlowGlobe.tsx` - Main 3D globe component
- `frontend/src/components/charts/GlobeControls.tsx` - Interactive controls for filtering and animation
- `frontend/src/hooks/useTradeFlowData.ts` - Data fetching and processing hook
- `frontend/src/utils/geoUtils.ts` - Geographic coordinate calculations
- `frontend/src/types/tradeFlow.ts` - TypeScript types for trade flow data
- `frontend/src/services/tradeFlowService.ts` - API service for trade flow data
- `tests/components/charts/TradeFlowGlobe.test.tsx` - Unit tests for globe component

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Three.js Official Documentation](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene)
  - Specific section: BufferGeometry and InstancedMesh
  - Why: Required for efficient rendering of thousands of trade routes
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
  - Specific section: useFrame and useThree hooks
  - Why: Integration patterns for React and Three.js
- [Three.js Performance Guide](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects)
  - Specific section: Memory management and disposal
  - Why: Critical for handling large geographic datasets

### Patterns to Follow

**Component Structure Pattern:**
```typescript
// From steering documents - React component organization
const TradeFlowGlobe: React.FC<Props> = ({ data, filters }) => {
  // Custom hooks for data and interactions
  // Memoized calculations
  // Three.js scene setup
  // Return JSX with Canvas
}
```

**Data Processing Pattern:**
```typescript
// Geographic coordinate transformation
const convertToSphere = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
};
```

**Performance Pattern:**
```typescript
// Efficient rendering with BufferGeometry
const routeGeometry = useMemo(() => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(routes.length * 3);
  // Populate positions array
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
}, [routes]);
```

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation

Set up Three.js integration with React and create basic globe structure with geographic data processing utilities.

**Tasks:**
- Install Three.js and React Three Fiber dependencies
- Create basic globe geometry with Earth texture
- Set up coordinate transformation utilities
- Implement camera controls and basic interactions

### Phase 2: Core Implementation

Implement trade route rendering system with animated flows and interactive filtering capabilities.

**Tasks:**
- Create trade route curve generation system
- Implement animated flow particles along routes
- Add interactive hover and click handlers
- Create filtering controls for regions and time periods

### Phase 3: Integration

Connect to data services and integrate with existing application architecture.

**Tasks:**
- Connect to trade data API endpoints
- Implement data caching and performance optimization
- Add loading states and error handling
- Integrate with global state management

### Phase 4: Testing & Validation

Comprehensive testing of 3D interactions and performance validation.

**Tasks:**
- Unit tests for coordinate calculations and data processing
- Integration tests for user interactions
- Performance testing with large datasets
- Cross-browser compatibility testing

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### CREATE frontend/package.json

- **IMPLEMENT**: Initialize React project with Vite and TypeScript
- **PATTERN**: Standard React + TypeScript + Vite setup
- **IMPORTS**: three, @react-three/fiber, @react-three/drei, @types/three
- **GOTCHA**: Use exact versions to avoid Three.js compatibility issues
- **VALIDATE**: `npm install && npm run build`

### CREATE frontend/src/types/tradeFlow.ts

- **IMPLEMENT**: TypeScript interfaces for trade flow data structures
- **PATTERN**: Interface-based type definitions with optional properties
- **IMPORTS**: None (pure TypeScript types)
- **GOTCHA**: Include geographic coordinates and trade volume data types
- **VALIDATE**: `npx tsc --noEmit`

### CREATE frontend/src/utils/geoUtils.ts

- **IMPLEMENT**: Geographic coordinate transformation utilities
- **PATTERN**: Pure functions for lat/lng to 3D coordinates conversion
- **IMPORTS**: None (pure math functions)
- **GOTCHA**: Handle edge cases for polar coordinates and date line crossing
- **VALIDATE**: `npm test -- geoUtils.test.ts`

### CREATE frontend/src/hooks/useTradeFlowData.ts

- **IMPLEMENT**: Custom React hook for fetching and processing trade flow data
- **PATTERN**: React Query or SWR pattern for data fetching with caching
- **IMPORTS**: react, axios or fetch API
- **GOTCHA**: Implement proper error handling and loading states
- **VALIDATE**: `npm test -- useTradeFlowData.test.ts`

### CREATE frontend/src/services/tradeFlowService.ts

- **IMPLEMENT**: API service functions for trade flow data endpoints
- **PATTERN**: Async/await with proper error handling
- **IMPORTS**: axios or fetch, types from tradeFlow.ts
- **GOTCHA**: Handle API rate limiting and data transformation
- **VALIDATE**: `npm test -- tradeFlowService.test.ts`

### CREATE frontend/src/components/charts/TradeFlowGlobe.tsx

- **IMPLEMENT**: Main 3D globe component with Three.js integration
- **PATTERN**: React Three Fiber Canvas with useFrame for animations
- **IMPORTS**: @react-three/fiber, @react-three/drei, three, React hooks
- **GOTCHA**: Proper memory management and geometry disposal
- **VALIDATE**: `npm run dev` and verify globe renders

### CREATE frontend/src/components/charts/GlobeControls.tsx

- **IMPLEMENT**: Interactive controls for filtering and animation playback
- **PATTERN**: Controlled components with callback props
- **IMPORTS**: React, UI components from ui/ directory
- **GOTCHA**: Debounce filter changes to avoid performance issues
- **VALIDATE**: `npm test -- GlobeControls.test.tsx`

### UPDATE frontend/src/components/charts/TradeFlowGlobe.tsx

- **IMPLEMENT**: Add trade route curve generation and animation system
- **PATTERN**: BufferGeometry with custom shaders for performance
- **IMPORTS**: THREE.CubicBezierCurve3, THREE.BufferGeometry
- **GOTCHA**: Use instanced rendering for thousands of routes
- **VALIDATE**: Test with sample data showing animated routes

### UPDATE frontend/src/components/charts/TradeFlowGlobe.tsx

- **IMPLEMENT**: Add interactive hover and click handlers for routes
- **PATTERN**: Raycasting for 3D object intersection detection
- **IMPORTS**: THREE.Raycaster, React event handlers
- **GOTCHA**: Optimize raycasting performance with bounding boxes
- **VALIDATE**: Verify hover tooltips and click interactions work

### CREATE tests/components/charts/TradeFlowGlobe.test.tsx

- **IMPLEMENT**: Unit tests for globe component functionality
- **PATTERN**: React Testing Library with Three.js mocking
- **IMPORTS**: @testing-library/react, jest, three (mocked)
- **GOTCHA**: Mock Three.js WebGL context for testing environment
- **VALIDATE**: `npm test -- TradeFlowGlobe.test.tsx`

---

## TESTING STRATEGY

### Unit Tests

Test coordinate transformations, data processing functions, and component rendering logic. Mock Three.js WebGL context and focus on business logic validation.

### Integration Tests

Test complete user workflows including data loading, filtering, and 3D interactions. Verify performance with realistic dataset sizes.

### Edge Cases

- Handle invalid geographic coordinates
- Test with empty or malformed trade data
- Verify performance with maximum expected dataset size (10,000+ routes)
- Test memory cleanup when component unmounts

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
npx eslint frontend/src/components/charts/TradeFlowGlobe.tsx
npx prettier --check frontend/src/components/charts/
npx tsc --noEmit
```

### Level 2: Unit Tests

```bash
npm test -- --testPathPattern=TradeFlowGlobe
npm test -- --testPathPattern=geoUtils
npm test -- --coverage
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

# Test interactions:
# 1. Globe renders with Earth texture
# 2. Trade routes appear as animated curves
# 3. Hover shows country/trade volume tooltips
# 4. Filters update routes in real-time
# 5. Animation controls play/pause work
# 6. Performance remains smooth with full dataset
```

### Level 5: Performance Validation

```bash
# Monitor memory usage and frame rate
# Use browser dev tools Performance tab
# Verify <60ms frame times with full dataset
# Check for memory leaks during extended use
```

---

## ACCEPTANCE CRITERIA

- [ ] 3D globe renders with realistic Earth appearance
- [ ] Trade routes display as animated curved lines from China to destinations
- [ ] Route thickness and color represent trade volume and growth
- [ ] Interactive controls filter by region, time period, and volume
- [ ] Hover tooltips show country names and trade statistics
- [ ] Click interactions provide detailed trade information
- [ ] Animation controls allow play/pause of trade flow dynamics
- [ ] Performance maintains 30+ FPS with full dataset (1000+ routes)
- [ ] Responsive design works on desktop and tablet devices
- [ ] All validation commands pass with zero errors
- [ ] Memory usage remains stable during extended interaction

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in dependency order
- [ ] Three.js integration working with React
- [ ] Geographic coordinate transformations accurate
- [ ] Trade route animations smooth and performant
- [ ] Interactive controls functional and responsive
- [ ] Data loading and error handling implemented
- [ ] Unit and integration tests passing
- [ ] Performance benchmarks met
- [ ] Cross-browser compatibility verified
- [ ] Memory management and cleanup working

---

## NOTES

**Performance Considerations**: Use BufferGeometry and InstancedMesh for rendering efficiency. Implement LOD (Level of Detail) system for routes based on zoom level. Consider data streaming for very large datasets.

**Design Decisions**: Chose React Three Fiber over vanilla Three.js for better React integration. Using curved Bezier paths for trade routes to show realistic flight/shipping paths. Color coding: blue for stable trade, green for growth, red for decline.

**Future Enhancements**: Could add time-based animation showing trade evolution over years, VR/AR support for immersive experience, or integration with real-time trade data feeds.
