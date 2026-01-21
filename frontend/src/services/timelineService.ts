import { 
  HistoricalTradeData, 
  TimelineEvent, 
  TimelinePeriodData,
  TimelineApiResponse,
  EventType
} from '../types/timeline';

// Mock historical trade data from 2010-2025
const mockHistoricalData: HistoricalTradeData[] = [
  // 2010-2012: Pre-trade war baseline
  { year: 2010, month: 1, tradeSurplus: 181.2, exports: 1578.0, imports: 1396.8, significantEvents: [] },
  { year: 2010, month: 6, tradeSurplus: 196.8, exports: 1623.4, imports: 1426.6, significantEvents: [] },
  { year: 2010, month: 12, tradeSurplus: 183.1, exports: 1577.9, imports: 1394.8, significantEvents: [] },
  
  { year: 2011, month: 6, tradeSurplus: 155.1, exports: 1701.0, imports: 1545.9, significantEvents: [] },
  { year: 2011, month: 12, tradeSurplus: 158.1, exports: 1898.4, imports: 1740.3, significantEvents: [] },
  
  { year: 2012, month: 6, tradeSurplus: 181.5, exports: 1831.0, imports: 1649.5, significantEvents: [] },
  { year: 2012, month: 12, tradeSurplus: 231.1, exports: 2048.7, imports: 1817.6, significantEvents: [] },
  
  // 2013-2017: Gradual growth period
  { year: 2013, month: 6, tradeSurplus: 275.8, exports: 2021.0, imports: 1745.2, significantEvents: [] },
  { year: 2013, month: 12, tradeSurplus: 259.8, exports: 2209.0, imports: 1949.2, significantEvents: [] },
  
  { year: 2014, month: 6, tradeSurplus: 315.4, exports: 2342.0, imports: 2026.6, significantEvents: [] },
  { year: 2014, month: 12, tradeSurplus: 382.5, exports: 2342.3, imports: 1959.8, significantEvents: [] },
  
  { year: 2015, month: 6, tradeSurplus: 456.8, exports: 2273.5, imports: 1816.7, significantEvents: [] },
  { year: 2015, month: 12, tradeSurplus: 594.5, exports: 2274.9, imports: 1680.4, significantEvents: [] },
  
  { year: 2016, month: 6, tradeSurplus: 456.2, exports: 2097.6, imports: 1641.4, significantEvents: [] },
  { year: 2016, month: 12, tradeSurplus: 509.8, exports: 2097.6, imports: 1587.8, significantEvents: [] },
  
  { year: 2017, month: 6, tradeSurplus: 421.0, exports: 2263.5, imports: 1842.5, significantEvents: [] },
  { year: 2017, month: 12, tradeSurplus: 422.5, exports: 2263.5, imports: 1841.0, significantEvents: [] },
  
  // 2018: Trade war begins
  { 
    year: 2018, 
    month: 3, 
    tradeSurplus: 382.1, 
    exports: 2494.2, 
    imports: 2112.1,
    significantEvents: [{
      id: 'trade-war-start',
      title: 'US-China Trade War Begins',
      description: 'Trump administration imposes first round of tariffs on Chinese goods',
      date: new Date(2018, 2, 22),
      type: 'trade',
      impact: 'negative',
      severity: 'high'
    }]
  },
  { year: 2018, month: 6, tradeSurplus: 396.2, exports: 2486.7, imports: 2090.5, significantEvents: [] },
  { year: 2018, month: 9, tradeSurplus: 317.8, exports: 2494.2, imports: 2176.4, significantEvents: [] },
  { year: 2018, month: 12, tradeSurplus: 351.8, exports: 2494.2, imports: 2142.4, significantEvents: [] },
  
  // 2019: Trade tensions escalate
  { year: 2019, month: 3, tradeSurplus: 421.0, exports: 2498.6, imports: 2077.6, significantEvents: [] },
  { 
    year: 2019, 
    month: 8, 
    tradeSurplus: 429.8, 
    exports: 2498.6, 
    imports: 2068.8,
    significantEvents: [{
      id: 'tariff-escalation',
      title: 'Tariff Escalation',
      description: 'US increases tariffs to 25% on $200B of Chinese goods',
      date: new Date(2019, 7, 1),
      type: 'trade',
      impact: 'negative',
      severity: 'high'
    }]
  },
  { year: 2019, month: 12, tradeSurplus: 421.9, exports: 2498.6, imports: 2076.7, significantEvents: [] },
  
  // 2020: COVID-19 pandemic
  { 
    year: 2020, 
    month: 2, 
    tradeSurplus: 125.0, 
    exports: 1652.0, 
    imports: 1527.0,
    significantEvents: [{
      id: 'covid-outbreak',
      title: 'COVID-19 Pandemic',
      description: 'Global pandemic disrupts supply chains and trade flows',
      date: new Date(2020, 1, 15),
      type: 'pandemic',
      impact: 'negative',
      severity: 'high'
    }]
  },
  { year: 2020, month: 6, tradeSurplus: 462.7, exports: 2641.3, imports: 2178.6, significantEvents: [] },
  { year: 2020, month: 12, tradeSurplus: 535.0, exports: 2641.3, imports: 2106.3, significantEvents: [] },
  
  // 2021: Recovery and property crisis begins
  { year: 2021, month: 3, tradeSurplus: 676.4, exports: 3363.4, imports: 2687.0, significantEvents: [] },
  { 
    year: 2021, 
    month: 9, 
    tradeSurplus: 676.4, 
    exports: 3363.4, 
    imports: 2687.0,
    significantEvents: [{
      id: 'property-crisis',
      title: 'Property Sector Crisis',
      description: 'Evergrande crisis triggers broader property market downturn',
      date: new Date(2021, 8, 15),
      type: 'economic',
      impact: 'negative',
      severity: 'high'
    }]
  },
  { year: 2021, month: 12, tradeSurplus: 676.4, exports: 3363.4, imports: 2687.0, significantEvents: [] },
  
  // 2022: Record surplus begins
  { year: 2022, month: 3, tradeSurplus: 878.6, exports: 3593.3, imports: 2714.7, significantEvents: [] },
  { 
    year: 2022, 
    month: 6, 
    tradeSurplus: 878.6, 
    exports: 3593.3, 
    imports: 2714.7,
    significantEvents: [{
      id: 'ukraine-war',
      title: 'Russia-Ukraine War',
      description: 'War disrupts global supply chains and energy markets',
      date: new Date(2022, 1, 24),
      type: 'external',
      impact: 'neutral',
      severity: 'high'
    }]
  },
  { year: 2022, month: 12, tradeSurplus: 878.6, exports: 3593.3, imports: 2714.7, significantEvents: [] },
  
  // 2023: Continued growth
  { year: 2023, month: 6, tradeSurplus: 823.2, exports: 3380.0, imports: 2556.8, significantEvents: [] },
  { year: 2023, month: 12, tradeSurplus: 823.2, exports: 3380.0, imports: 2556.8, significantEvents: [] },
  
  // 2024: New Three surge
  { 
    year: 2024, 
    month: 6, 
    tradeSurplus: 967.8, 
    exports: 3652.0, 
    imports: 2684.2,
    significantEvents: [{
      id: 'new-three-surge',
      title: '"New Three" Exports Surge',
      description: 'EVs, batteries, and solar panels drive export growth',
      date: new Date(2024, 5, 1),
      type: 'economic',
      impact: 'positive',
      severity: 'medium'
    }]
  },
  { year: 2024, month: 12, tradeSurplus: 967.8, exports: 3652.0, imports: 2684.2, significantEvents: [] },
  
  // 2025: Record $1.2T surplus
  { 
    year: 2025, 
    month: 6, 
    tradeSurplus: 1189.0, 
    exports: 3845.0, 
    imports: 2656.0,
    significantEvents: [{
      id: 'record-surplus',
      title: 'Record $1.2T Surplus',
      description: 'China achieves historic $1.2 trillion trade surplus',
      date: new Date(2025, 11, 31),
      type: 'economic',
      impact: 'positive',
      severity: 'high'
    }]
  },
  { year: 2025, month: 12, tradeSurplus: 1189.0, exports: 3845.0, imports: 2656.0, significantEvents: [] },
];

export const getHistoricalTradeData = async (
  startYear?: number,
  endYear?: number
): Promise<TimelineApiResponse<HistoricalTradeData[]>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let data = mockHistoricalData;
    
    if (startYear || endYear) {
      data = data.filter(item => {
        const start = startYear || 2010;
        const end = endYear || 2025;
        return item.year >= start && item.year <= end;
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
      message: 'Failed to fetch historical trade data',
    };
  }
};

export const getTimelineEvents = async (
  eventTypes?: EventType[]
): Promise<TimelineApiResponse<TimelineEvent[]>> => {
  try {
    const allEvents = mockHistoricalData
      .flatMap(item => item.significantEvents || [])
      .filter(event => !eventTypes || eventTypes.includes(event.type));
    
    return {
      data: allEvents,
      status: 'success',
    };
  } catch (error) {
    return {
      data: [],
      status: 'error',
      message: 'Failed to fetch timeline events',
    };
  }
};

export const getPeriodAnalysis = async (
  startDate: Date,
  endDate: Date
): Promise<TimelineApiResponse<TimelinePeriodData>> => {
  try {
    const relevantData = mockHistoricalData.filter(item => {
      const itemDate = new Date(item.year, item.month - 1);
      return itemDate >= startDate && itemDate <= endDate;
    });
    
    if (relevantData.length === 0) {
      throw new Error('No data available for selected period');
    }
    
    const averageSurplus = relevantData.reduce((sum, item) => sum + item.tradeSurplus, 0) / relevantData.length;
    const allEvents = relevantData.flatMap(item => item.significantEvents || []);
    const keyEvents = allEvents.filter(event => event.severity === 'high');
    
    const analysis = generatePeriodAnalysis(startDate, endDate, averageSurplus, keyEvents);
    
    const periodData: TimelinePeriodData = {
      period: `${startDate.getFullYear()}-${endDate.getFullYear()}`,
      startDate,
      endDate,
      averageSurplus,
      totalEvents: allEvents.length,
      keyEvents,
      analysis,
    };
    
    return {
      data: periodData,
      status: 'success',
    };
  } catch (error) {
    return {
      data: {
        period: 'Unknown',
        startDate: new Date(),
        endDate: new Date(),
        averageSurplus: 0,
        totalEvents: 0,
        keyEvents: [],
        analysis: 'Analysis unavailable',
      },
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to fetch period analysis',
    };
  }
};

const generatePeriodAnalysis = (
  startDate: Date,
  endDate: Date,
  averageSurplus: number,
  keyEvents: TimelineEvent[]
): string => {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  
  if (startYear <= 2017 && endYear <= 2017) {
    return `Pre-trade war period (${startYear}-${endYear}): Steady growth with average surplus of $${averageSurplus.toFixed(1)}B. China's export economy was expanding but faced fewer external pressures.`;
  }
  
  if (startYear >= 2018 && endYear <= 2019) {
    return `Trade war initiation (${startYear}-${endYear}): Despite US tariffs, China maintained average surplus of $${averageSurplus.toFixed(1)}B through market diversification and export redirection strategies.`;
  }
  
  if (startYear >= 2020 && endYear <= 2021) {
    return `Pandemic and recovery (${startYear}-${endYear}): COVID-19 initially disrupted trade, but China's quick recovery and global demand for medical supplies and electronics drove surplus to $${averageSurplus.toFixed(1)}B.`;
  }
  
  if (startYear >= 2022) {
    return `Record surplus era (${startYear}-${endYear}): The "New Three" exports (EVs, batteries, solar) combined with weak domestic demand drove unprecedented surplus averaging $${averageSurplus.toFixed(1)}B.`;
  }
  
  return `Mixed period (${startYear}-${endYear}): Average surplus of $${averageSurplus.toFixed(1)}B reflects various economic and geopolitical factors including ${keyEvents.length} major events.`;
};
