import { 
  CountryTradeData, 
  TradeFlowData, 
  RegionalTradeData,
  GeographicApiResponse
} from '../types/geographic';

// Mock trade data showing China's geographic pivot
const mockCountryTradeData: CountryTradeData[] = [
  // Traditional partners (declining)
  {
    countryCode: 'USA',
    countryName: 'United States',
    region: 'North America',
    tradeVolume2018: 478.4,
    tradeVolume2025: 382.7,
    growthRate: -20.0,
    marketShare2018: 19.2,
    marketShare2025: 9.9,
    coordinates: [-95.7129, 37.0902]
  },
  {
    countryCode: 'DEU',
    countryName: 'Germany',
    region: 'Europe',
    tradeVolume2018: 93.2,
    tradeVolume2025: 101.1,
    growthRate: 8.5,
    marketShare2018: 3.7,
    marketShare2025: 2.6,
    coordinates: [10.4515, 51.1657]
  },
  {
    countryCode: 'JPN',
    countryName: 'Japan',
    region: 'Asia',
    tradeVolume2018: 147.2,
    tradeVolume2025: 159.8,
    growthRate: 8.6,
    marketShare2018: 5.9,
    marketShare2025: 4.2,
    coordinates: [138.2529, 36.2048]
  },
  {
    countryCode: 'GBR',
    countryName: 'United Kingdom',
    region: 'Europe',
    tradeVolume2018: 68.1,
    tradeVolume2025: 73.4,
    growthRate: 7.8,
    marketShare2018: 2.7,
    marketShare2025: 1.9,
    coordinates: [-3.4360, 55.3781]
  },

  // ASEAN (growing rapidly)
  {
    countryCode: 'VNM',
    countryName: 'Vietnam',
    region: 'Southeast Asia',
    tradeVolume2018: 84.2,
    tradeVolume2025: 142.8,
    growthRate: 69.6,
    marketShare2018: 3.4,
    marketShare2025: 3.7,
    coordinates: [108.2772, 14.0583]
  },
  {
    countryCode: 'THA',
    countryName: 'Thailand',
    region: 'Southeast Asia',
    tradeVolume2018: 67.3,
    tradeVolume2025: 98.7,
    growthRate: 46.7,
    marketShare2018: 2.7,
    marketShare2025: 2.6,
    coordinates: [100.9925, 15.8700]
  },
  {
    countryCode: 'MYS',
    countryName: 'Malaysia',
    region: 'Southeast Asia',
    tradeVolume2018: 58.9,
    tradeVolume2025: 89.4,
    growthRate: 51.8,
    marketShare2018: 2.4,
    marketShare2025: 2.3,
    coordinates: [101.9758, 4.2105]
  },
  {
    countryCode: 'SGP',
    countryName: 'Singapore',
    region: 'Southeast Asia',
    tradeVolume2018: 91.7,
    tradeVolume2025: 124.3,
    growthRate: 35.5,
    marketShare2018: 3.7,
    marketShare2025: 3.2,
    coordinates: [103.8198, 1.3521]
  },
  {
    countryCode: 'IDN',
    countryName: 'Indonesia',
    region: 'Southeast Asia',
    tradeVolume2018: 77.2,
    tradeVolume2025: 132.6,
    growthRate: 71.8,
    marketShare2018: 3.1,
    marketShare2025: 3.4,
    coordinates: [113.9213, -0.7893]
  },

  // Africa (explosive growth)
  {
    countryCode: 'ZAF',
    countryName: 'South Africa',
    region: 'Africa',
    tradeVolume2018: 43.5,
    tradeVolume2025: 89.2,
    growthRate: 105.1,
    marketShare2018: 1.7,
    marketShare2025: 2.3,
    coordinates: [22.9375, -30.5595]
  },
  {
    countryCode: 'NGA',
    countryName: 'Nigeria',
    region: 'Africa',
    tradeVolume2018: 18.7,
    tradeVolume2025: 47.3,
    growthRate: 153.0,
    marketShare2018: 0.7,
    marketShare2025: 1.2,
    coordinates: [8.6753, 9.0820]
  },
  {
    countryCode: 'EGY',
    countryName: 'Egypt',
    region: 'Africa',
    tradeVolume2018: 13.8,
    tradeVolume2025: 31.2,
    growthRate: 126.1,
    marketShare2018: 0.6,
    marketShare2025: 0.8,
    coordinates: [30.8025, 26.8206]
  },
  {
    countryCode: 'KEN',
    countryName: 'Kenya',
    region: 'Africa',
    tradeVolume2018: 5.1,
    tradeVolume2025: 14.7,
    growthRate: 188.2,
    marketShare2018: 0.2,
    marketShare2025: 0.4,
    coordinates: [37.9062, -0.0236]
  },

  // Latin America (strong growth)
  {
    countryCode: 'BRA',
    countryName: 'Brazil',
    region: 'South America',
    tradeVolume2018: 67.4,
    tradeVolume2025: 104.8,
    growthRate: 55.5,
    marketShare2018: 2.7,
    marketShare2025: 2.7,
    coordinates: [-51.9253, -14.2350]
  },
  {
    countryCode: 'MEX',
    countryName: 'Mexico',
    region: 'North America',
    tradeVolume2018: 74.3,
    tradeVolume2025: 98.1,
    growthRate: 32.0,
    marketShare2018: 3.0,
    marketShare2025: 2.5,
    coordinates: [-102.5528, 23.6345]
  },
  {
    countryCode: 'ARG',
    countryName: 'Argentina',
    region: 'South America',
    tradeVolume2018: 13.6,
    tradeVolume2025: 23.8,
    growthRate: 75.0,
    marketShare2018: 0.5,
    marketShare2025: 0.6,
    coordinates: [-63.6167, -38.4161]
  },

  // Other major economies
  {
    countryCode: 'IND',
    countryName: 'India',
    region: 'Asia',
    tradeVolume2018: 95.5,
    tradeVolume2025: 125.7,
    growthRate: 31.6,
    marketShare2018: 3.8,
    marketShare2025: 3.3,
    coordinates: [78.9629, 20.5937]
  },
  {
    countryCode: 'RUS',
    countryName: 'Russia',
    region: 'Europe/Asia',
    tradeVolume2018: 107.1,
    tradeVolume2025: 190.3,
    growthRate: 77.7,
    marketShare2018: 4.3,
    marketShare2025: 4.9,
    coordinates: [105.3188, 61.5240]
  }
];

const mockTradeFlowData: TradeFlowData[] = [
  // Major flows from China to key destinations
  {
    origin: 'CHN',
    destination: 'USA',
    volume: 382.7,
    growth: -20.0,
    year: 2025,
    coordinates: {
      origin: [104.1954, 35.8617],
      destination: [-95.7129, 37.0902]
    }
  },
  {
    origin: 'CHN',
    destination: 'VNM',
    volume: 142.8,
    growth: 69.6,
    year: 2025,
    coordinates: {
      origin: [104.1954, 35.8617],
      destination: [108.2772, 14.0583]
    }
  },
  {
    origin: 'CHN',
    destination: 'IDN',
    volume: 132.6,
    growth: 71.8,
    year: 2025,
    coordinates: {
      origin: [104.1954, 35.8617],
      destination: [113.9213, -0.7893]
    }
  },
  {
    origin: 'CHN',
    destination: 'RUS',
    volume: 190.3,
    growth: 77.7,
    year: 2025,
    coordinates: {
      origin: [104.1954, 35.8617],
      destination: [105.3188, 61.5240]
    }
  },
  {
    origin: 'CHN',
    destination: 'BRA',
    volume: 104.8,
    growth: 55.5,
    year: 2025,
    coordinates: {
      origin: [104.1954, 35.8617],
      destination: [-51.9253, -14.2350]
    }
  }
];

export const getCountryTradeData = async (): Promise<GeographicApiResponse<CountryTradeData[]>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: mockCountryTradeData,
      status: 'success',
    };
  } catch (error) {
    return {
      data: [],
      status: 'error',
      message: 'Failed to fetch country trade data',
    };
  }
};

export const getTradeFlowData = async (): Promise<GeographicApiResponse<TradeFlowData[]>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const data = mockTradeFlowData;
    
    return {
      data,
      status: 'success',
    };
  } catch (error) {
    return {
      data: [],
      status: 'error',
      message: 'Failed to fetch trade flow data',
    };
  }
};

export const getRegionalTradeData = async (): Promise<GeographicApiResponse<RegionalTradeData[]>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Calculate regional aggregates from country data
    const regionMap = new Map<string, CountryTradeData[]>();
    
    mockCountryTradeData.forEach(country => {
      const region = country.region;
      if (!regionMap.has(region)) {
        regionMap.set(region, []);
      }
      regionMap.get(region)!.push(country);
    });
    
    const regionalData: RegionalTradeData[] = Array.from(regionMap.entries()).map(([region, countries]) => {
      const totalVolume2018 = countries.reduce((sum, c) => sum + c.tradeVolume2018, 0);
      const totalVolume2025 = countries.reduce((sum, c) => sum + c.tradeVolume2025, 0);
      const growthRate = ((totalVolume2025 - totalVolume2018) / totalVolume2018) * 100;
      const marketShareChange = countries.reduce((sum, c) => 
        sum + (c.marketShare2025 - c.marketShare2018), 0
      );
      
      const keyCountries = countries
        .sort((a, b) => b.tradeVolume2025 - a.tradeVolume2025)
        .slice(0, 3)
        .map(c => c.countryName);
      
      return {
        region,
        countries: countries.map(c => c.countryCode),
        totalVolume2018,
        totalVolume2025,
        growthRate,
        marketShareChange,
        keyCountries
      };
    });
    
    return {
      data: regionalData.sort((a, b) => b.growthRate - a.growthRate),
      status: 'success',
    };
  } catch (error) {
    return {
      data: [],
      status: 'error',
      message: 'Failed to fetch regional trade data',
    };
  }
};

export const getComparisonData = async (): Promise<GeographicApiResponse<{ before: CountryTradeData[], after: CountryTradeData[] }>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const beforeData = mockCountryTradeData.map(country => ({
      ...country,
      tradeVolume2025: country.tradeVolume2018,
      marketShare2025: country.marketShare2018,
      growthRate: 0
    }));
    
    return {
      data: {
        before: beforeData,
        after: mockCountryTradeData
      },
      status: 'success',
    };
  } catch (error) {
    return {
      data: {
        before: [],
        after: []
      },
      status: 'error',
      message: 'Failed to fetch comparison data',
    };
  }
};
