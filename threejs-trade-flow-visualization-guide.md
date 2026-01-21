# Three.js Best Practices for 3D Geographic Trade Flow Visualizations

## Overview
This guide covers the latest best practices for creating performant 3D trade flow visualizations on globes using Three.js, focusing on large dataset handling and optimal rendering techniques.

## Core Documentation Links

### Official Three.js Resources
- **Three.js Documentation**: https://threejs.org/docs/
- **Examples Gallery**: https://threejs.org/examples/
- **WebGL Globe Example**: https://threejs.org/examples/#webgl_geometry_earth
- **Instanced Rendering**: https://threejs.org/docs/#api/en/objects/InstancedMesh
- **BufferGeometry**: https://threejs.org/docs/#api/en/core/BufferGeometry

### Performance & Optimization
- **Performance Tips**: https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
- **GPU Instancing**: https://threejs.org/examples/#webgl_instancing_performance
- **Level of Detail (LOD)**: https://threejs.org/docs/#api/en/objects/LOD

## Implementation Patterns

### 1. Globe Setup with Optimized Geometry

```javascript
// Minimal globe setup with texture mapping
const globeGeometry = new THREE.SphereGeometry(100, 64, 32);
const globeMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load('earth-texture.jpg'),
  bumpMap: textureLoader.load('earth-bump.jpg'),
  bumpScale: 0.05
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
```

### 2. Efficient Trade Route Rendering

```javascript
// Use BufferGeometry for trade routes
class TradeRouteRenderer {
  constructor(routes) {
    this.geometry = new THREE.BufferGeometry();
    this.createRouteGeometry(routes);
  }
  
  createRouteGeometry(routes) {
    const positions = new Float32Array(routes.length * 6); // 2 points per route
    const colors = new Float32Array(routes.length * 6);
    
    routes.forEach((route, i) => {
      const start = this.latLonToVector3(route.start.lat, route.start.lon);
      const end = this.latLonToVector3(route.end.lat, route.end.lon);
      
      positions[i * 6] = start.x;
      positions[i * 6 + 1] = start.y;
      positions[i * 6 + 2] = start.z;
      positions[i * 6 + 3] = end.x;
      positions[i * 6 + 4] = end.y;
      positions[i * 6 + 5] = end.z;
    });
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }
}
```

### 3. Instanced Rendering for Trade Nodes

```javascript
// Use InstancedMesh for thousands of trade nodes
const nodeGeometry = new THREE.SphereGeometry(0.5, 8, 6);
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b35 });
const instancedNodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, tradeNodes.length);

tradeNodes.forEach((node, i) => {
  const position = this.latLonToVector3(node.lat, node.lon);
  const matrix = new THREE.Matrix4().setPosition(position);
  instancedNodes.setMatrixAt(i, matrix);
});
```

## Performance Considerations for Large Datasets

### 1. Level of Detail (LOD) System

```javascript
// Implement LOD for different zoom levels
const createLODSystem = (routes) => {
  const lod = new THREE.LOD();
  
  // High detail (close view)
  const highDetail = createDetailedRoutes(routes);
  lod.addLevel(highDetail, 0);
  
  // Medium detail
  const mediumDetail = createSimplifiedRoutes(routes, 0.5);
  lod.addLevel(mediumDetail, 200);
  
  // Low detail (far view)
  const lowDetail = createSimplifiedRoutes(routes, 0.1);
  lod.addLevel(lowDetail, 500);
  
  return lod;
};
```

### 2. Frustum Culling and Occlusion

```javascript
// Enable frustum culling
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.updateProjectionMatrix();

// Implement basic occlusion culling
const isVisible = (position, camera) => {
  const vector = position.clone().project(camera);
  return vector.z < 1 && Math.abs(vector.x) < 1 && Math.abs(vector.y) < 1;
};
```

### 3. Data Streaming and Chunking

```javascript
// Load data in chunks based on viewport
class DataStreamer {
  constructor(viewport) {
    this.viewport = viewport;
    this.loadedChunks = new Set();
  }
  
  updateVisibleRoutes(cameraPosition) {
    const visibleChunks = this.getVisibleChunks(cameraPosition);
    visibleChunks.forEach(chunk => {
      if (!this.loadedChunks.has(chunk.id)) {
        this.loadChunk(chunk);
      }
    });
  }
}
```

## Optimization Techniques

### 1. Geometry Merging
- Merge static geometries to reduce draw calls
- Use `BufferGeometryUtils.mergeBufferGeometries()`

### 2. Texture Atlasing
- Combine multiple textures into atlases
- Reduce texture binding overhead

### 3. Shader Optimization
```javascript
// Custom shader for trade flow animation
const tradeFlowShader = {
  vertexShader: `
    attribute float progress;
    varying float vProgress;
    void main() {
      vProgress = progress;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying float vProgress;
    void main() {
      float alpha = sin(vProgress * 3.14159);
      gl_FragColor = vec4(1.0, 0.4, 0.2, alpha);
    }
  `
};
```

## Memory Management

### 1. Dispose Pattern
```javascript
// Proper cleanup for large datasets
const disposeObject = (obj) => {
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach(mat => mat.dispose());
    } else {
      obj.material.dispose();
    }
  }
  if (obj.texture) obj.texture.dispose();
};
```

### 2. Object Pooling
```javascript
// Reuse objects for dynamic trade flows
class TradeFlowPool {
  constructor(size) {
    this.pool = [];
    this.active = [];
    for (let i = 0; i < size; i++) {
      this.pool.push(this.createTradeFlow());
    }
  }
  
  acquire() {
    return this.pool.pop() || this.createTradeFlow();
  }
  
  release(flow) {
    flow.reset();
    this.pool.push(flow);
  }
}
```

## Rendering Pipeline Best Practices

### 1. Render Order Optimization
```javascript
// Optimize render order for transparency
scene.traverse((object) => {
  if (object.material && object.material.transparent) {
    object.renderOrder = 1000;
  }
});
```

### 2. Multi-pass Rendering
```javascript
// Separate opaque and transparent passes
const renderOpaque = () => {
  renderer.render(opaqueScene, camera);
};

const renderTransparent = () => {
  renderer.render(transparentScene, camera);
};
```

## Animation and Interaction

### 1. Efficient Animation Loops
```javascript
// Use requestAnimationFrame with delta time
let lastTime = 0;
const animate = (currentTime) => {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  updateTradeFlows(deltaTime);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
```

### 2. Raycasting for Interaction
```javascript
// Optimized raycasting for large datasets
const raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 0.1;
raycaster.params.Points.threshold = 0.1;

const handleClick = (event) => {
  const intersects = raycaster.intersectObjects([instancedNodes]);
  if (intersects.length > 0) {
    const instanceId = intersects[0].instanceId;
    showTradeNodeDetails(instanceId);
  }
};
```

## Performance Monitoring

### 1. FPS Tracking
```javascript
// Monitor performance
const stats = new Stats();
document.body.appendChild(stats.dom);

const animate = () => {
  stats.begin();
  // render code
  stats.end();
};
```

### 2. Memory Usage
```javascript
// Track memory usage
const trackMemory = () => {
  const info = renderer.info;
  console.log(`Geometries: ${info.memory.geometries}`);
  console.log(`Textures: ${info.memory.textures}`);
  console.log(`Draw calls: ${info.render.calls}`);
};
```

## Recommended Libraries and Tools

### Complementary Libraries
- **D3.js**: For geographic projections and data processing
- **Turf.js**: For geospatial calculations
- **Stats.js**: For performance monitoring
- **dat.GUI**: For debugging and parameter tuning

### Development Tools
- **Three.js Inspector**: Browser extension for debugging
- **WebGL Inspector**: For GPU debugging
- **Chrome DevTools**: Memory and performance profiling

## Dataset Size Recommendations

### Small Datasets (< 1,000 routes)
- Direct rendering with basic optimization
- Simple animation loops

### Medium Datasets (1,000 - 10,000 routes)
- Implement LOD system
- Use instanced rendering
- Basic frustum culling

### Large Datasets (> 10,000 routes)
- Data streaming and chunking
- Advanced culling techniques
- Shader-based animations
- Object pooling

## Common Pitfalls to Avoid

1. **Memory Leaks**: Always dispose of geometries and materials
2. **Too Many Draw Calls**: Use instancing and geometry merging
3. **Inefficient Animations**: Use shaders for complex animations
4. **Blocking Main Thread**: Use Web Workers for data processing
5. **Overdraw**: Implement proper depth testing and culling

## Conclusion

Effective 3D trade flow visualization requires careful balance between visual fidelity and performance. Focus on:
- Efficient geometry management
- Smart LOD systems
- Proper memory cleanup
- GPU-based rendering techniques

For datasets exceeding 50,000 trade routes, consider server-side preprocessing and progressive loading strategies.