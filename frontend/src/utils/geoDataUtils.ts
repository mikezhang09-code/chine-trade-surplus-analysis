import * as d3 from 'd3';
import { CountryTradeData, TradeFlowData, CountryFeature, RegionalAnalysis } from '../types/geographic';

export const calculateDistance = (
  coord1: [number, number], 
  coord2: [number, number]
): number => {
  return d3.geoDistance(coord1, coord2) * 6371; // Earth radius in km
};

export const interpolatePath = (
  start: [number, number], 
  end: [number, number], 
  steps: number = 50
): [number, number][] => {
  const interpolator = d3.geoInterpolate(start, end);
  return Array.from({ length: steps }, (_, i) => 
    interpolator(i / (steps - 1))
  );
};

export const getColorScale = (
  values: number[], 
  colorScheme: string[] = ['#fee5d9', '#de2d26']
): d3.ScaleSequential<string> => {
  const extent = d3.extent(values) as [number, number];
  return d3.scaleSequential()
    .domain(extent)
    .interpolator(d3.interpolateRgbBasis(colorScheme));
};

export const formatTradeVolume = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
};

export const formatGrowthRate = (rate: number): string => {
  const sign = rate >= 0 ? '+' : '';
  return `${sign}${rate.toFixed(1)}%`;
};

export const calculateGrowthRate = (
  volume2018: number, 
  volume2025: number
): number => {
  if (volume2018 === 0) return volume2025 > 0 ? 100 : 0;
  return ((volume2025 - volume2018) / volume2018) * 100;
};

export const getRegionColor = (region: string): string => {
  const regionColors: Record<string, string> = {
    'US': '#EF4444',
    'EU': '#3B82F6',
    'ASEAN': '#10B981',
    'Africa': '#F59E0B',
    'LatinAmerica': '#8B5CF6',
    'MiddleEast': '#EC4899',
    'Other': '#6B7280',
  };
  return regionColors[region] || regionColors.Other;
};

export const processCountryData = (
  countries: CountryFeature[],
  tradeData: CountryTradeData[]
): CountryFeature[] => {
  return countries.map(country => {
    const trade = tradeData.find(t => t.countryCode === country.properties.ISO_A3);
    return {
      ...country,
      properties: {
        ...country.properties,
        tradeVolume: trade?.tradeVolume2025 || 0,
        growthRate: trade?.growthRate || 0,
        marketShare: trade?.marketShare2025 || 0,
      }
    };
  });
};

export const generateFlowPaths = (
  tradeFlows: TradeFlowData[],
  minVolume: number = 1e9
): TradeFlowData[] => {
  return tradeFlows
    .filter(flow => flow.volume >= minVolume)
    .sort((a, b) => b.volume - a.volume);
};

export const calculateRegionalAnalysis = (
  tradeData: CountryTradeData[]
): RegionalAnalysis[] => {
  const regionMap = new Map<string, CountryTradeData[]>();
  
  tradeData.forEach(country => {
    const region = country.region;
    if (!regionMap.has(region)) {
      regionMap.set(region, []);
    }
    regionMap.get(region)!.push(country);
  });

  return Array.from(regionMap.entries()).map(([region, countries]) => {
    const beforeVolume = countries.reduce((sum, c) => sum + c.tradeVolume2018, 0);
    const afterVolume = countries.reduce((sum, c) => sum + c.tradeVolume2025, 0);
    const growthRate = calculateGrowthRate(beforeVolume, afterVolume);
    const marketShareChange = countries.reduce((sum, c) => 
      sum + (c.marketShare2025 - c.marketShare2018), 0
    );

    const topCountries = countries
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 3)
      .map(c => ({
        name: c.countryName,
        growth: c.growthRate,
        volume: c.tradeVolume2025
      }));

    return {
      region,
      beforeVolume,
      afterVolume,
      growthRate,
      marketShareChange,
      topCountries
    };
  }).sort((a, b) => b.growthRate - a.growthRate);
};

export const getCountryCoordinates = (countryCode: string): [number, number] => {
  // Simplified country coordinates - in production, use a comprehensive dataset
  const coordinates: Record<string, [number, number]> = {
    'USA': [-95.7129, 37.0902],
    'CHN': [104.1954, 35.8617],
    'DEU': [10.4515, 51.1657],
    'JPN': [138.2529, 36.2048],
    'GBR': [-3.4360, 55.3781],
    'FRA': [2.2137, 46.2276],
    'ITA': [12.5674, 41.8719],
    'BRA': [-51.9253, -14.2350],
    'IND': [78.9629, 20.5937],
    'RUS': [105.3188, 61.5240],
    'CAN': [-106.3468, 56.1304],
    'AUS': [133.7751, -25.2744],
    'MEX': [-102.5528, 23.6345],
    'KOR': [127.7669, 35.9078],
    'IDN': [113.9213, -0.7893],
    'TUR': [35.2433, 38.9637],
    'SAU': [45.0792, 23.8859],
    'ZAF': [22.9375, -30.5595],
    'ARG': [-63.6167, -38.4161],
    'THA': [100.9925, 15.8700],
    'VNM': [108.2772, 14.0583],
    'MYS': [101.9758, 4.2105],
    'SGP': [103.8198, 1.3521],
    'PHL': [121.7740, 12.8797],
    'EGY': [30.8025, 26.8206],
    'NGA': [8.6753, 9.0820],
    'KEN': [37.9062, -0.0236],
    'MAR': [-7.0926, 31.7917],
    'CHL': [-71.5430, -35.6751],
    'PER': [-75.0152, -9.1900],
    'COL': [-74.2973, 4.5709],
  };
  
  return coordinates[countryCode] || [0, 0];
};

export const createCurvedPath = (
  start: [number, number],
  end: [number, number],
  curvature: number = 0.3
): string => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dr = Math.sqrt(dx * dx + dy * dy) * curvature;
  
  return `M${start[0]},${start[1]}A${dr},${dr} 0 0,1 ${end[0]},${end[1]}`;
};

export const isValidCoordinate = (coord: [number, number]): boolean => {
  const [lng, lat] = coord;
  return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
};

export const clampCoordinate = (coord: [number, number]): [number, number] => {
  const [lng, lat] = coord;
  return [
    Math.max(-180, Math.min(180, lng)),
    Math.max(-90, Math.min(90, lat))
  ];
};
