import { TradeFlowRoute, TradeFlowApiResponse } from '../types/tradeFlow';

// Mock trade flow data representing China's major export routes
const mockTradeFlowRoutes: TradeFlowRoute[] = [
  // North America (declining due to trade tensions)
  {
    id: 'CHN-USA-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 39.8283, longitude: -98.5795, countryCode: 'USA', countryName: 'United States' },
    originCountry: 'China',
    destinationCountry: 'United States',
    tradeVolume: 120.5,
    growthRate: -15.2,
    sector: 'Traditional Manufacturing',
    year: 2025
  },
  {
    id: 'CHN-CAN-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 56.1304, longitude: -106.3468, countryCode: 'CAN', countryName: 'Canada' },
    originCountry: 'China',
    destinationCountry: 'Canada',
    tradeVolume: 25.3,
    growthRate: -8.7,
    sector: 'Raw Materials',
    year: 2025
  },
  
  // Europe (stable but slower growth)
  {
    id: 'CHN-DEU-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 51.1657, longitude: 10.4515, countryCode: 'DEU', countryName: 'Germany' },
    originCountry: 'China',
    destinationCountry: 'Germany',
    tradeVolume: 85.2,
    growthRate: 12.4,
    sector: 'New Three',
    year: 2025
  },
  {
    id: 'CHN-FRA-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 46.2276, longitude: 2.2137, countryCode: 'FRA', countryName: 'France' },
    originCountry: 'China',
    destinationCountry: 'France',
    tradeVolume: 42.8,
    growthRate: 8.9,
    sector: 'Technology',
    year: 2025
  },
  {
    id: 'CHN-NLD-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 52.1326, longitude: 5.2913, countryCode: 'NLD', countryName: 'Netherlands' },
    originCountry: 'China',
    destinationCountry: 'Netherlands',
    tradeVolume: 38.7,
    growthRate: 15.6,
    sector: 'New Three',
    year: 2025
  },
  
  // Southeast Asia (explosive growth)
  {
    id: 'CHN-SGP-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 1.3521, longitude: 103.8198, countryCode: 'SGP', countryName: 'Singapore' },
    originCountry: 'China',
    destinationCountry: 'Singapore',
    tradeVolume: 65.4,
    growthRate: 45.2,
    sector: 'Technology',
    year: 2025
  },
  {
    id: 'CHN-THA-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 15.8700, longitude: 100.9925, countryCode: 'THA', countryName: 'Thailand' },
    originCountry: 'China',
    destinationCountry: 'Thailand',
    tradeVolume: 48.9,
    growthRate: 78.3,
    sector: 'New Three',
    year: 2025
  },
  {
    id: 'CHN-VNM-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 14.0583, longitude: 108.2772, countryCode: 'VNM', countryName: 'Vietnam' },
    originCountry: 'China',
    destinationCountry: 'Vietnam',
    tradeVolume: 52.1,
    growthRate: 92.7,
    sector: 'Traditional Manufacturing',
    year: 2025
  },
  {
    id: 'CHN-IDN-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: -0.7893, longitude: 113.9213, countryCode: 'IDN', countryName: 'Indonesia' },
    originCountry: 'China',
    destinationCountry: 'Indonesia',
    tradeVolume: 41.6,
    growthRate: 67.4,
    sector: 'Raw Materials',
    year: 2025
  },
  
  // Africa (Belt and Road Initiative surge)
  {
    id: 'CHN-ZAF-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: -30.5595, longitude: 22.9375, countryCode: 'ZAF', countryName: 'South Africa' },
    originCountry: 'China',
    destinationCountry: 'South Africa',
    tradeVolume: 28.4,
    growthRate: 125.8,
    sector: 'New Three',
    year: 2025
  },
  {
    id: 'CHN-NGA-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 9.0820, longitude: 8.6753, countryCode: 'NGA', countryName: 'Nigeria' },
    originCountry: 'China',
    destinationCountry: 'Nigeria',
    tradeVolume: 22.7,
    growthRate: 156.3,
    sector: 'Traditional Manufacturing',
    year: 2025
  },
  {
    id: 'CHN-KEN-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: -0.0236, longitude: 37.9062, countryCode: 'KEN', countryName: 'Kenya' },
    originCountry: 'China',
    destinationCountry: 'Kenya',
    tradeVolume: 15.9,
    growthRate: 189.4,
    sector: 'Technology',
    year: 2025
  },
  
  // Middle East (strategic partnerships)
  {
    id: 'CHN-ARE-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 23.4241, longitude: 53.8478, countryCode: 'ARE', countryName: 'UAE' },
    originCountry: 'China',
    destinationCountry: 'UAE',
    tradeVolume: 34.2,
    growthRate: 43.7,
    sector: 'Technology',
    year: 2025
  },
  {
    id: 'CHN-SAU-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 23.8859, longitude: 45.0792, countryCode: 'SAU', countryName: 'Saudi Arabia' },
    originCountry: 'China',
    destinationCountry: 'Saudi Arabia',
    tradeVolume: 29.8,
    growthRate: 38.9,
    sector: 'New Three',
    year: 2025
  },
  
  // South America (growing partnerships)
  {
    id: 'CHN-BRA-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: -14.2350, longitude: -51.9253, countryCode: 'BRA', countryName: 'Brazil' },
    originCountry: 'China',
    destinationCountry: 'Brazil',
    tradeVolume: 45.3,
    growthRate: 52.1,
    sector: 'Raw Materials',
    year: 2025
  },
  {
    id: 'CHN-CHL-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: -35.6751, longitude: -71.5430, countryCode: 'CHL', countryName: 'Chile' },
    originCountry: 'China',
    destinationCountry: 'Chile',
    tradeVolume: 18.6,
    growthRate: 67.8,
    sector: 'Traditional Manufacturing',
    year: 2025
  },
  
  // Russia (sanctions pivot)
  {
    id: 'CHN-RUS-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 61.5240, longitude: 105.3188, countryCode: 'RUS', countryName: 'Russia' },
    originCountry: 'China',
    destinationCountry: 'Russia',
    tradeVolume: 78.9,
    growthRate: 89.2,
    sector: 'Technology',
    year: 2025
  },
  
  // India (complex relationship)
  {
    id: 'CHN-IND-1',
    origin: { latitude: 35.8617, longitude: 104.1954, countryCode: 'CHN', countryName: 'China' },
    destination: { latitude: 20.5937, longitude: 78.9629, countryCode: 'IND', countryName: 'India' },
    originCountry: 'China',
    destinationCountry: 'India',
    tradeVolume: 32.4,
    growthRate: 23.6,
    sector: 'Traditional Manufacturing',
    year: 2025
  }
];

export const getTradeFlowRoutes = async (): Promise<TradeFlowApiResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const totalVolume = mockTradeFlowRoutes.reduce((sum, route) => sum + route.tradeVolume, 0);
  
  return {
    routes: mockTradeFlowRoutes,
    totalVolume,
    totalRoutes: mockTradeFlowRoutes.length,
    lastUpdated: new Date().toISOString()
  };
};

export const getFilteredRoutes = async (filters: {
  regions?: string[];
  sectors?: string[];
  minVolume?: number;
  maxVolume?: number;
}): Promise<TradeFlowRoute[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredRoutes = [...mockTradeFlowRoutes];
  
  if (filters.sectors && filters.sectors.length > 0) {
    filteredRoutes = filteredRoutes.filter(route => 
      filters.sectors!.includes(route.sector)
    );
  }
  
  if (filters.minVolume !== undefined) {
    filteredRoutes = filteredRoutes.filter(route => 
      route.tradeVolume >= filters.minVolume!
    );
  }
  
  if (filters.maxVolume !== undefined) {
    filteredRoutes = filteredRoutes.filter(route => 
      route.tradeVolume <= filters.maxVolume!
    );
  }
  
  return filteredRoutes;
};

export const getRoutesByRegion = (region: string): TradeFlowRoute[] => {
  const regionCountries: Record<string, string[]> = {
    'North America': ['USA', 'CAN'],
    'Europe': ['DEU', 'FRA', 'NLD'],
    'Southeast Asia': ['SGP', 'THA', 'VNM', 'IDN'],
    'Africa': ['ZAF', 'NGA', 'KEN'],
    'Middle East': ['ARE', 'SAU'],
    'South America': ['BRA', 'CHL'],
    'Asia': ['RUS', 'IND']
  };
  
  const countries = regionCountries[region] || [];
  return mockTradeFlowRoutes.filter(route => 
    countries.includes(route.destination.countryCode)
  );
};
