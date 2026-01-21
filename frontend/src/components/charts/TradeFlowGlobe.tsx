import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TradeFlowRoute, GlobeInteraction, RouteColorScheme, AnimationState } from '../../types/tradeFlow';
import { latLngToVector3, generateCurvedPath, getRouteColor } from '../../utils/geoUtils';

interface TradeFlowGlobeProps {
  routes: TradeFlowRoute[];
  colorScheme: RouteColorScheme;
  animationState: AnimationState;
  onRouteHover?: (interaction: GlobeInteraction) => void;
  onRouteClick?: (interaction: GlobeInteraction) => void;
}

// Earth component with texture
const Earth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002; // Slow rotation
    }
  });

  const earthTexture = useMemo(() => {
    // Create a simple Earth-like gradient
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Create a simple Earth-like gradient
    const gradient = ctx.createLinearGradient(0, 0, 512, 256);
    gradient.addColorStop(0, '#4a90e2');
    gradient.addColorStop(0.3, '#7cb342');
    gradient.addColorStop(0.7, '#8bc34a');
    gradient.addColorStop(1, '#4a90e2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  return (
    <Sphere ref={earthRef} args={[1, 64, 32]}>
      <meshPhongMaterial map={earthTexture} />
    </Sphere>
  );
};

// Trade route component
const TradeRoute: React.FC<{
  route: TradeFlowRoute;
  colorScheme: RouteColorScheme;
  animationProgress: number;
  onHover?: (route: TradeFlowRoute | null) => void;
  onClick?: (route: TradeFlowRoute) => void;
}> = ({ route, colorScheme, animationProgress, onHover, onClick }) => {
  const particleRef = useRef<THREE.Mesh>(null);
  
  const { points, color } = useMemo(() => {
    const startPos = latLngToVector3(route.origin.latitude, route.origin.longitude, 1.02);
    const endPos = latLngToVector3(route.destination.latitude, route.destination.longitude, 1.02);
    const pathPoints = generateCurvedPath(startPos, endPos, 0.3, 50);
    
    return {
      points: pathPoints,
      color: getRouteColor(route, colorScheme)
    };
  }, [route, colorScheme]);

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    
    points.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    });
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [points]);

  // Animate particle along route
  useFrame(() => {
    if (particleRef.current && points.length > 0) {
      const index = Math.floor(animationProgress * (points.length - 1));
      const point = points[index] || points[0];
      particleRef.current.position.set(point.x, point.y, point.z);
    }
  });

  return (
    <group>
      {/* Route line */}
      <mesh geometry={geometry}>
        <lineBasicMaterial color={color} />
      </mesh>
      
      {/* Animated particle */}
      <mesh
        ref={particleRef}
        onPointerEnter={() => onHover?.(route)}
        onPointerLeave={() => onHover?.(null)}
        onClick={() => onClick?.(route)}
      >
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

// Country marker component
const CountryMarker: React.FC<{
  position: THREE.Vector3;
  name: string;
  isOrigin?: boolean;
}> = ({ position, name, isOrigin = false }) => {
  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh>
        <sphereGeometry args={[isOrigin ? 0.02 : 0.015, 8, 8]} />
        <meshBasicMaterial color={isOrigin ? '#ef4444' : '#3b82f6'} />
      </mesh>
      <Text
        position={[0, 0.05, 0]}
        fontSize={0.03}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

// Main globe scene component
const GlobeScene: React.FC<{
  routes: TradeFlowRoute[];
  colorScheme: RouteColorScheme;
  animationState: AnimationState;
  onRouteHover?: (interaction: GlobeInteraction) => void;
  onRouteClick?: (interaction: GlobeInteraction) => void;
}> = ({ routes, colorScheme, animationState, onRouteHover, onRouteClick }) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useFrame(() => {
    if (animationState.isPlaying) {
      setAnimationProgress((prev) => {
        const newProgress = prev + (0.01 * animationState.speed);
        return newProgress > 1 ? 0 : newProgress;
      });
    }
  });

  const handleRouteHover = (route: TradeFlowRoute | null) => {
    if (route) {
      const startPos = latLngToVector3(route.origin.latitude, route.origin.longitude, 1.02);
      onRouteHover?.({
        type: 'hover',
        routeId: route.id,
        position: startPos,
        data: route
      });
    } else {
      onRouteHover?.({ type: 'none' });
    }
  };

  const handleRouteClick = (route: TradeFlowRoute) => {
    const startPos = latLngToVector3(route.origin.latitude, route.origin.longitude, 1.02);
    onRouteClick?.({
      type: 'click',
      routeId: route.id,
      position: startPos,
      data: route
    });
  };

  // Get unique countries for markers
  const countries = useMemo(() => {
    const countryMap = new Map();
    
    routes.forEach(route => {
      if (!countryMap.has(route.origin.countryCode)) {
        countryMap.set(route.origin.countryCode, {
          ...route.origin,
          isOrigin: true
        });
      }
      if (!countryMap.has(route.destination.countryCode)) {
        countryMap.set(route.destination.countryCode, {
          ...route.destination,
          isOrigin: false
        });
      }
    });
    
    return Array.from(countryMap.values());
  }, [routes]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Earth */}
      <Earth />
      
      {/* Trade routes */}
      {routes.map((route) => (
        <TradeRoute
          key={route.id}
          route={route}
          colorScheme={colorScheme}
          animationProgress={animationProgress}
          onHover={handleRouteHover}
          onClick={handleRouteClick}
        />
      ))}
      
      {/* Country markers */}
      {countries.map((country) => {
        const pos = latLngToVector3(country.latitude, country.longitude, 1.03);
        const position = new THREE.Vector3(pos.x, pos.y, pos.z);
        return (
          <CountryMarker
            key={country.countryCode}
            position={position}
            name={country.countryName}
            isOrigin={country.isOrigin}
          />
        );
      })}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.5}
        maxDistance={5}
        autoRotate={false}
      />
    </>
  );
};

// Main component
export const TradeFlowGlobe: React.FC<TradeFlowGlobeProps> = ({
  routes,
  colorScheme,
  animationState,
  onRouteHover,
  onRouteClick,
}) => {
  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 75 }}
        style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #000000 100%)' }}
      >
        <GlobeScene
          routes={routes}
          colorScheme={colorScheme}
          animationState={animationState}
          onRouteHover={onRouteHover}
          onRouteClick={onRouteClick}
        />
      </Canvas>
    </div>
  );
};
