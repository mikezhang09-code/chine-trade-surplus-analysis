// Trade flow data types for 3D visualization

export interface TradeFlowRoute {
  id: string;
  origin: GeographicCoordinate;
  destination: GeographicCoordinate;
  originCountry: string;
  destinationCountry: string;
  tradeVolume: number; // in billions USD
  growthRate: number; // percentage
  sector: string;
  year: number;
}

export interface GeographicCoordinate {
  latitude: number;
  longitude: number;
  countryCode: string;
  countryName: string;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface TradeFlowFilters {
  regions: string[];
  sectors: string[];
  minTradeVolume: number;
  maxTradeVolume: number;
  year: number;
  showGrowthOnly: boolean;
  animationSpeed: number;
}

export interface GlobeInteraction {
  type: 'hover' | 'click' | 'none';
  routeId?: string;
  position?: Vector3D;
  data?: TradeFlowRoute;
}

export interface TradeFlowApiResponse {
  routes: TradeFlowRoute[];
  totalVolume: number;
  totalRoutes: number;
  lastUpdated: string;
}

export interface AnimationState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
}

export type RouteColorScheme = 'volume' | 'growth' | 'sector';
export type GlobeViewMode = 'routes' | 'heatmap' | 'flows';
