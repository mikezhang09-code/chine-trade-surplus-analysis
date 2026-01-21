import { format, parseISO, isValid, differenceInDays, addMonths, startOfYear, endOfYear } from 'date-fns';
import { TimelineDataPoint, TimelineEvent, HistoricalTradeData, TimelineRange } from '../types/timeline';

export const formatDate = (date: Date, formatString: string = 'MMM yyyy'): string => {
  if (!isValid(date)) {
    return 'Invalid Date';
  }
  return format(date, formatString);
};

export const formatCurrency = (value: number): string => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(1)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  return `$${value.toLocaleString()}`;
};

export const parseDate = (dateString: string): Date => {
  const parsed = parseISO(dateString);
  return isValid(parsed) ? parsed : new Date();
};

export const createDateFromYearMonth = (year: number, month: number): Date => {
  return new Date(year, month - 1, 1);
};

export const processTimelineData = (rawData: HistoricalTradeData[]): TimelineDataPoint[] => {
  return rawData.map(item => ({
    date: createDateFromYearMonth(item.year, item.month),
    surplus: item.tradeSurplus,
    events: item.significantEvents || []
  })).sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getDateRange = (data: TimelineDataPoint[]): TimelineRange => {
  if (data.length === 0) {
    const now = new Date();
    return {
      start: startOfYear(now),
      end: endOfYear(now)
    };
  }

  const dates = data.map(d => d.date);
  return {
    start: new Date(Math.min(...dates.map(d => d.getTime()))),
    end: new Date(Math.max(...dates.map(d => d.getTime())))
  };
};

export const filterDataByDateRange = (
  data: TimelineDataPoint[], 
  range: TimelineRange
): TimelineDataPoint[] => {
  return data.filter(d => 
    d.date >= range.start && d.date <= range.end
  );
};

export const calculateMovingAverage = (
  data: TimelineDataPoint[], 
  windowSize: number = 3
): TimelineDataPoint[] => {
  if (data.length < windowSize) return data;

  return data.map((point, index) => {
    const start = Math.max(0, index - Math.floor(windowSize / 2));
    const end = Math.min(data.length, start + windowSize);
    const window = data.slice(start, end);
    
    const averageSurplus = window.reduce((sum, p) => sum + p.surplus, 0) / window.length;
    
    return {
      ...point,
      surplus: averageSurplus
    };
  });
};

export const findNearestDataPoint = (
  data: TimelineDataPoint[], 
  targetDate: Date
): TimelineDataPoint | null => {
  if (data.length === 0) return null;

  return data.reduce((nearest, current) => {
    const currentDiff = Math.abs(current.date.getTime() - targetDate.getTime());
    const nearestDiff = Math.abs(nearest.date.getTime() - targetDate.getTime());
    return currentDiff < nearestDiff ? current : nearest;
  });
};

export const getEventsByType = (events: TimelineEvent[], type: string): TimelineEvent[] => {
  return events.filter(event => event.type === type);
};

export const getTimelineTickValues = (range: TimelineRange, maxTicks: number = 10): Date[] => {
  const totalDays = differenceInDays(range.end, range.start);
  const tickInterval = Math.ceil(totalDays / maxTicks);
  
  const ticks: Date[] = [];
  let currentDate = new Date(range.start);
  
  while (currentDate <= range.end) {
    ticks.push(new Date(currentDate));
    currentDate = addMonths(currentDate, Math.max(1, Math.floor(tickInterval / 30)));
  }
  
  return ticks;
};

export const interpolateColor = (value: number, min: number, max: number): string => {
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  
  if (ratio < 0.5) {
    // Red to Yellow
    const r = 255;
    const g = Math.floor(255 * (ratio * 2));
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Green
    const r = Math.floor(255 * (2 - ratio * 2));
    const g = 255;
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  }
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
