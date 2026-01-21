import { GeographicCoordinate, Vector3D, TradeFlowRoute } from '../types/tradeFlow';

// Convert latitude/longitude to 3D sphere coordinates
export const latLngToVector3 = (
  lat: number, 
  lng: number, 
  radius: number = 1
): Vector3D => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
};

// Generate curved path between two points on sphere
export const generateCurvedPath = (
  start: Vector3D,
  end: Vector3D,
  altitude: number = 0.3,
  segments: number = 50
): Vector3D[] => {
  const points: Vector3D[] = [];
  
  // Calculate midpoint and add altitude
  const mid = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
    z: (start.z + end.z) / 2
  };
  
  // Normalize and extend midpoint for curve
  const length = Math.sqrt(mid.x * mid.x + mid.y * mid.y + mid.z * mid.z);
  const factor = (1 + altitude) / length;
  
  const controlPoint = {
    x: mid.x * factor,
    y: mid.y * factor,
    z: mid.z * factor
  };
  
  // Generate quadratic bezier curve points
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const t2 = t * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    
    points.push({
      x: mt2 * start.x + 2 * mt * t * controlPoint.x + t2 * end.x,
      y: mt2 * start.y + 2 * mt * t * controlPoint.y + t2 * end.y,
      z: mt2 * start.z + 2 * mt * t * controlPoint.z + t2 * end.z
    });
  }
  
  return points;
};

// Calculate distance between two geographic points (Haversine formula)
export const calculateDistance = (
  coord1: GeographicCoordinate,
  coord2: GeographicCoordinate
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLng = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get route color based on trade volume or growth
export const getRouteColor = (
  route: TradeFlowRoute,
  colorScheme: 'volume' | 'growth' | 'sector'
): string => {
  switch (colorScheme) {
    case 'volume':
      if (route.tradeVolume > 50) return '#ef4444'; // Red for high volume
      if (route.tradeVolume > 20) return '#f59e0b'; // Orange for medium
      return '#3b82f6'; // Blue for low volume
      
    case 'growth':
      if (route.growthRate > 50) return '#10b981'; // Green for high growth
      if (route.growthRate > 0) return '#6366f1'; // Purple for positive
      return '#ef4444'; // Red for negative growth
      
    case 'sector':
      const sectorColors: Record<string, string> = {
        'New Three': '#10b981',
        'Traditional Manufacturing': '#3b82f6',
        'Raw Materials': '#f59e0b',
        'Technology': '#8b5cf6',
        'Other': '#6b7280'
      };
      return sectorColors[route.sector] || '#6b7280';
      
    default:
      return '#3b82f6';
  }
};

// Get route thickness based on trade volume
export const getRouteThickness = (tradeVolume: number): number => {
  if (tradeVolume > 100) return 0.008;
  if (tradeVolume > 50) return 0.006;
  if (tradeVolume > 20) return 0.004;
  return 0.002;
};

// Format trade volume for display
export const formatTradeVolume = (volume: number): string => {
  if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}T`;
  if (volume >= 1) return `$${volume.toFixed(1)}B`;
  return `$${(volume * 1000).toFixed(0)}M`;
};

// China's coordinates (center point for all routes)
export const CHINA_COORDINATES: GeographicCoordinate = {
  latitude: 35.8617,
  longitude: 104.1954,
  countryCode: 'CHN',
  countryName: 'China'
};
