import { 
  NewThreeExportData, 
  RegionalExportData, 
  OverviewMetrics, 
  ComparisonData,
  ApiResponse,
  TimePeriod
} from '../types/newThree';

// Mock data for development
const mockNewThreeData: NewThreeExportData[] = [
  {
    period: '2020',
    evExports: 45.2,
    batteryExports: 28.7,
    solarExports: 89.3,
    totalNewThree: 163.2,
    traditionalExports: 2456.8,
    growthRate: 15.2,
  },
  {
    period: '2021',
    evExports: 67.8,
    batteryExports: 42.1,
    solarExports: 112.5,
    totalNewThree: 222.4,
    traditionalExports: 2398.6,
    growthRate: 36.3,
  },
  {
    period: '2022',
    evExports: 102.4,
    batteryExports: 58.9,
    solarExports: 134.7,
    totalNewThree: 296.0,
    traditionalExports: 2301.2,
    growthRate: 33.1,
  },
  {
    period: '2023',
    evExports: 156.7,
    batteryExports: 78.3,
    solarExports: 167.2,
    totalNewThree: 402.2,
    traditionalExports: 2198.8,
    growthRate: 35.9,
  },
  {
    period: '2024',
    evExports: 234.5,
    batteryExports: 98.7,
    solarExports: 201.8,
    totalNewThree: 535.0,
    traditionalExports: 2087.4,
    growthRate: 33.0,
  },
  {
    period: '2025',
    evExports: 312.8,
    batteryExports: 127.4,
    solarExports: 245.6,
    totalNewThree: 685.8,
    traditionalExports: 1976.2,
    growthRate: 28.2,
  },
];

const mockRegionalData: RegionalExportData[] = [
  {
    region: 'EU',
    evExports: 89.2,
    batteryExports: 34.7,
    solarExports: 67.8,
    totalExports: 191.7,
    marketShare: 27.9,
  },
  {
    region: 'ASEAN',
    evExports: 67.4,
    batteryExports: 28.9,
    solarExports: 45.2,
    totalExports: 141.5,
    marketShare: 20.6,
  },
  {
    region: 'Africa',
    evExports: 45.8,
    batteryExports: 19.3,
    solarExports: 56.7,
    totalExports: 121.8,
    marketShare: 17.8,
  },
  {
    region: 'LatinAmerica',
    evExports: 38.9,
    batteryExports: 15.2,
    solarExports: 34.1,
    totalExports: 88.2,
    marketShare: 12.9,
  },
  {
    region: 'US',
    evExports: 23.4,
    batteryExports: 12.8,
    solarExports: 18.9,
    totalExports: 55.1,
    marketShare: 8.0,
  },
  {
    region: 'Other',
    evExports: 48.1,
    batteryExports: 16.5,
    solarExports: 22.9,
    totalExports: 87.5,
    marketShare: 12.8,
  },
];

export const getNewThreeExportData = async (
  startYear?: TimePeriod,
  endYear?: TimePeriod
): Promise<ApiResponse<NewThreeExportData[]>> => {
  try {
    // In production, this would be an actual API call
    // const response = await api.get('/new-three-exports', { params: { startYear, endYear } });
    
    // For now, return mock data
    let data = mockNewThreeData;
    
    if (startYear || endYear) {
      data = data.filter(item => {
        const year = parseInt(item.period);
        const start = startYear ? parseInt(startYear) : 2020;
        const end = endYear ? parseInt(endYear) : 2025;
        return year >= start && year <= end;
      });
    }
    
    return {
      data,
      status: 'success',
    };
  } catch (error) {
    return {
      data: [],
      status: 'error',
      message: 'Failed to fetch New Three export data',
    };
  }
};

export const getRegionalExportData = async (): Promise<ApiResponse<RegionalExportData[]>> => {
  try {
    // In production, this would be an actual API call
    // const response = await api.get('/regional-exports', { params: { year } });
    
    return {
      data: mockRegionalData,
      status: 'success',
    };
  } catch (error) {
    return {
      data: [],
      status: 'error',
      message: 'Failed to fetch regional export data',
    };
  }
};

export const getOverviewMetrics = async (
  year: TimePeriod = '2025'
): Promise<ApiResponse<OverviewMetrics>> => {
  try {
    const yearData = mockNewThreeData.find(item => item.period === year);
    const regionalData = mockRegionalData;
    
    if (!yearData) {
      throw new Error('Year data not found');
    }
    
    const topRegion = regionalData.reduce((prev, current) => 
      prev.totalExports > current.totalExports ? prev : current
    );
    
    const metrics: OverviewMetrics = {
      totalExports: yearData.totalNewThree,
      growthRate: yearData.growthRate,
      marketShare: (yearData.totalNewThree / (yearData.totalNewThree + yearData.traditionalExports)) * 100,
      topRegion: topRegion.region,
    };
    
    return {
      data: metrics,
      status: 'success',
    };
  } catch (error) {
    return {
      data: {
        totalExports: 0,
        growthRate: 0,
        marketShare: 0,
        topRegion: 'Unknown',
      },
      status: 'error',
      message: 'Failed to fetch overview metrics',
    };
  }
};

export const getComparisonData = async (
  year: TimePeriod = '2025'
): Promise<ApiResponse<ComparisonData>> => {
  try {
    const yearData = mockNewThreeData.find(item => item.period === year);
    const previousYearData = mockNewThreeData.find(item => 
      item.period === (parseInt(year) - 1).toString()
    );
    
    if (!yearData || !previousYearData) {
      throw new Error('Comparison data not found');
    }
    
    const traditionalGrowth = ((yearData.traditionalExports - previousYearData.traditionalExports) / previousYearData.traditionalExports) * 100;
    const newThreeGrowth = ((yearData.totalNewThree - previousYearData.totalNewThree) / previousYearData.totalNewThree) * 100;
    
    const totalExports = yearData.totalNewThree + yearData.traditionalExports;
    
    const comparison: ComparisonData = {
      traditional: {
        exports: yearData.traditionalExports,
        share: (yearData.traditionalExports / totalExports) * 100,
        growth: traditionalGrowth,
      },
      newThree: {
        exports: yearData.totalNewThree,
        share: (yearData.totalNewThree / totalExports) * 100,
        growth: newThreeGrowth,
      },
    };
    
    return {
      data: comparison,
      status: 'success',
    };
  } catch (error) {
    return {
      data: {
        traditional: { exports: 0, share: 0, growth: 0 },
        newThree: { exports: 0, share: 0, growth: 0 },
      },
      status: 'error',
      message: 'Failed to fetch comparison data',
    };
  }
};
