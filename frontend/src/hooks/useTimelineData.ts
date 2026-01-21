import { useState, useEffect } from 'react';
import {
  TimelineEvent,
  TimelinePeriodData,
  TimelineDataPoint,
  EventType,
} from '../types/timeline';
import {
  getHistoricalTradeData,
  getTimelineEvents,
  getPeriodAnalysis,
} from '../services/timelineService';
import { processTimelineData } from '../utils/timelineUtils';

interface UseTimelineDataReturn {
  timelineData: TimelineDataPoint[];
  events: TimelineEvent[];
  periodAnalysis: TimelinePeriodData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  fetchPeriodAnalysis: (startDate: Date, endDate: Date) => Promise<void>;
}

export const useTimelineData = (
  startYear?: number,
  endYear?: number,
  eventTypes?: EventType[]
): UseTimelineDataReturn => {
  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [periodAnalysis, setPeriodAnalysis] = useState<TimelinePeriodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [historicalResponse, eventsResponse] = await Promise.all([
        getHistoricalTradeData(startYear, endYear),
        getTimelineEvents(eventTypes),
      ]);

      if (historicalResponse.status === 'error') {
        throw new Error(historicalResponse.message);
      }
      if (eventsResponse.status === 'error') {
        throw new Error(eventsResponse.message);
      }

      const processedData = processTimelineData(historicalResponse.data);
      setTimelineData(processedData);
      setEvents(eventsResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodAnalysis = async (startDate: Date, endDate: Date) => {
    try {
      const response = await getPeriodAnalysis(startDate, endDate);
      
      if (response.status === 'error') {
        throw new Error(response.message);
      }
      
      setPeriodAnalysis(response.data);
    } catch (err) {
      console.error('Failed to fetch period analysis:', err);
      setPeriodAnalysis(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startYear, endYear, eventTypes]);

  const refetch = () => {
    fetchData();
  };

  return {
    timelineData,
    events,
    periodAnalysis,
    loading,
    error,
    refetch,
    fetchPeriodAnalysis,
  };
};
