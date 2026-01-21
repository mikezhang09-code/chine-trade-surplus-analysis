import { Feature, FeatureCollection, Geometry } from 'geojson';

export interface TradeFlowData {
  origin: string;
  destination: string;
  volume: number;
  growth: number;
  year: number;
  coordinates: {
    origin: [number, number];
    destination: [number, number];
  };
}

export interface CountryTradeData {
  countryCode: string;
  countryName: string;
  region: string;
  tradeVolume2018: number;
  tradeVolume2025: number;
  growthRate: number;
  marketShare2018: number;
  marketShare2025: number;
  coordinates: [number, number];
}

export interface RegionalTradeData {
  region: string;
  countries: string[];
  totalVolume2018: number;
  totalVolume2025: number;
  growthRate: number;
  marketShareChange: number;
  keyCountries: string[];
}

export interface GeographicFilters {
  timePeriod: '2018' | '2025' | 'comparison';
  regions: string[];
  minTradeVolume: number;
  showFlows: boolean;
  animateFlows: boolean;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface CountryFeature extends Feature<Geometry> {
  properties: {
    ISO_A3: string;
    NAME: string;
    REGION: string;
    tradeVolume?: number;
    growthRate?: number;
    marketShare?: number;
  };
}

export interface CountriesGeoJSON extends FeatureCollection<Geometry> {
  features: CountryFeature[];
}

export interface TradeFlowPath {
  id: string;
  origin: [number, number];
  destination: [number, number];
  volume: number;
  growth: number;
  animated: boolean;
  color: string;
  width: number;
}

export interface ChoroplethConfig {
  colorScale: string[];
  valueRange: [number, number];
  opacity: number;
  strokeColor: string;
  strokeWidth: number;
}

export interface MapTooltipData {
  countryName: string;
  countryCode: string;
  tradeVolume: number;
  growthRate: number;
  marketShare: number;
  position: [number, number];
}

export interface GeographicApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface ComparisonPeriod {
  year: number;
  label: string;
  data: CountryTradeData[];
}

export interface RegionalAnalysis {
  region: string;
  beforeVolume: number;
  afterVolume: number;
  growthRate: number;
  marketShareChange: number;
  topCountries: {
    name: string;
    growth: number;
    volume: number;
  }[];
}

export type MapViewMode = 'choropleth' | 'flows' | 'comparison';
export type RegionType = 'US' | 'EU' | 'ASEAN' | 'Africa' | 'LatinAmerica' | 'MiddleEast' | 'Other';
export type TradeMetric = 'volume' | 'growth' | 'marketShare';
