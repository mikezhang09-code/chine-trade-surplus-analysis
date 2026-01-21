# Geographic Data Visualization for Market Shift Analysis

## Overview
Research on visualization techniques and React libraries for showing geographic market changes over time, with focus on before/after comparisons.

## Core Visualization Techniques

### 1. Choropleth Maps
**Purpose**: Show data density/intensity across geographic regions
**Best for**: Market penetration, demographic changes, performance metrics by region

**Key Features**:
- Color-coded regions based on data values
- Easy to spot patterns and outliers
- Effective for showing relative differences

### 2. Flow Maps
**Purpose**: Visualize movement/migration between geographic areas
**Best for**: Customer migration, supply chain shifts, market expansion patterns

**Key Features**:
- Curved lines showing direction and volume
- Arrow thickness indicates flow magnitude
- Origin-destination relationships

### 3. Comparative Geographic Visualizations
**Purpose**: Side-by-side or animated before/after comparisons
**Best for**: Market shift analysis, trend visualization, impact assessment

**Key Features**:
- Temporal comparisons
- Split-screen layouts
- Animation transitions
- Difference highlighting

## React-Compatible Libraries

### 1. React Leaflet
**Strengths**: 
- Lightweight, flexible
- Excellent choropleth support
- Good performance
- Large ecosystem

**Market Shift Use Cases**:
- Regional performance heatmaps
- Territory boundary changes
- Store location analysis

**Basic Implementation**:
```jsx
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'

const ChoroplethMap = ({ geoData, beforeData, afterData }) => {
  const getColor = (value) => {
    return value > 1000 ? '#800026' :
           value > 500  ? '#BD0026' :
           value > 200  ? '#E31A1C' : '#FFEDA0'
  }

  const style = (feature) => ({
    fillColor: getColor(afterData[feature.properties.id]),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.7
  })

  return (
    <MapContainer center={[39.8, -98.6]} zoom={4}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={geoData} style={style} />
    </MapContainer>
  )
}
```

### 2. Deck.gl
**Strengths**:
- High-performance WebGL rendering
- Excellent for large datasets
- Advanced flow map capabilities
- Built-in animation support

**Market Shift Use Cases**:
- Customer flow visualization
- Large-scale data analysis
- Real-time updates

**Flow Map Example**:
```jsx
import DeckGL from '@deck.gl/react'
import { ArcLayer } from '@deck.gl/layers'

const FlowMap = ({ flowData }) => {
  const layers = [
    new ArcLayer({
      data: flowData,
      getSourcePosition: d => d.from,
      getTargetPosition: d => d.to,
      getWidth: d => d.value / 100,
      getSourceColor: [255, 0, 0],
      getTargetColor: [0, 255, 0]
    })
  ]

  return <DeckGL layers={layers} />
}
```

### 3. React Simple Maps
**Strengths**:
- SVG-based, lightweight
- Easy customization
- Good for simple choropleth maps
- Responsive design

**Market Shift Use Cases**:
- Clean, simple comparisons
- Custom styling needs
- Print-friendly outputs

### 4. Observable Plot (React Integration)
**Strengths**:
- Grammar of graphics approach
- Excellent for comparative visualizations
- Built-in animation support
- Clean API

**Comparative Visualization**:
```jsx
import * as Plot from "@observablehq/plot"
import { useEffect, useRef } from "react"

const ComparisonMap = ({ beforeData, afterData, geoData }) => {
  const containerRef = useRef()

  useEffect(() => {
    const plot = Plot.plot({
      projection: "albers-usa",
      color: { legend: true },
      marks: [
        Plot.geo(geoData, {
          fill: d => afterData[d.properties.id] - beforeData[d.properties.id],
          stroke: "white"
        })
      ]
    })
    
    containerRef.current.append(plot)
    return () => plot.remove()
  }, [beforeData, afterData, geoData])

  return <div ref={containerRef} />
}
```

## Specialized Techniques for Market Shift Analysis

### 1. Difference Maps
Show the delta between before/after periods:
- Positive changes in green
- Negative changes in red
- Neutral areas in gray

### 2. Small Multiples
Grid of maps showing progression over time:
- Consistent scale across all maps
- Clear temporal labeling
- Easy pattern recognition

### 3. Animated Transitions
Smooth transitions between time periods:
- Morphing boundaries
- Color transitions
- Value interpolation

### 4. Bivariate Choropleth
Show two variables simultaneously:
- Market size vs. growth rate
- Current vs. projected values
- Performance vs. potential

## Implementation Patterns

### Before/After Comparison Component
```jsx
const MarketShiftVisualization = ({ beforeData, afterData, geoData }) => {
  const [viewMode, setViewMode] = useState('comparison')
  
  return (
    <div className="market-shift-container">
      <div className="controls">
        <button onClick={() => setViewMode('before')}>Before</button>
        <button onClick={() => setViewMode('after')}>After</button>
        <button onClick={() => setViewMode('comparison')}>Difference</button>
      </div>
      
      {viewMode === 'comparison' ? (
        <DifferenceMap beforeData={beforeData} afterData={afterData} geoData={geoData} />
      ) : (
        <ChoroplethMap data={viewMode === 'before' ? beforeData : afterData} geoData={geoData} />
      )}
    </div>
  )
}
```

### Data Processing Utilities
```jsx
const calculateDifference = (before, after) => {
  const result = {}
  Object.keys(after).forEach(key => {
    result[key] = {
      absolute: after[key] - (before[key] || 0),
      percentage: before[key] ? ((after[key] - before[key]) / before[key]) * 100 : 100
    }
  })
  return result
}

const normalizeData = (data, method = 'minmax') => {
  const values = Object.values(data)
  const min = Math.min(...values)
  const max = Math.max(...values)
  
  const result = {}
  Object.entries(data).forEach(([key, value]) => {
    result[key] = (value - min) / (max - min)
  })
  return result
}
```

## Performance Considerations

### Large Datasets
- Use data aggregation for overview levels
- Implement progressive loading
- Consider WebGL-based solutions (Deck.gl)
- Optimize GeoJSON complexity

### Real-time Updates
- Implement efficient data diffing
- Use React.memo for expensive components
- Consider virtualization for large lists
- Batch updates to prevent excessive re-renders

## Recommended Library Combinations

### For Simple Market Analysis
- React Leaflet + custom controls
- Lightweight, easy to implement
- Good for up to 1000 regions

### For Complex Flow Analysis
- Deck.gl + React
- High performance
- Advanced animation capabilities
- Handles large datasets well

### For Publication-Quality Visualizations
- Observable Plot + React
- Clean, professional output
- Excellent for reports and presentations
- Good animation support

### For Custom Requirements
- D3.js + React (with careful integration)
- Maximum flexibility
- Custom interaction patterns
- Steep learning curve

## Data Requirements

### Geographic Boundaries
- GeoJSON format preferred
- Appropriate resolution for zoom levels
- Consistent property naming
- Topology optimization for performance

### Market Data Structure
```javascript
{
  "regionId": {
    "before": {
      "value": 1000,
      "timestamp": "2023-01-01",
      "metadata": {}
    },
    "after": {
      "value": 1200,
      "timestamp": "2024-01-01", 
      "metadata": {}
    }
  }
}
```

## Conclusion

For market shift analysis, the combination of choropleth maps for regional comparisons and flow maps for movement patterns provides comprehensive insights. React Leaflet offers the best balance of features and simplicity for most use cases, while Deck.gl excels for complex, large-scale visualizations. Observable Plot provides the cleanest API for comparative analysis.

The key to effective market shift visualization is choosing the right technique for your data story and implementing smooth transitions that help users understand the changes over time.