import { useState, useEffect, useCallback } from 'react';
import { TradeFlowRoute, TradeFlowFilters, TradeFlowApiResponse } from '../types/tradeFlow';
import { getTradeFlowRoutes, getFilteredRoutes } from '../services/tradeFlowService';

interface UseTradeFlowDataReturn {
  routes: TradeFlowRoute[];
  loading: boolean;
  error: string | null;
  totalVolume: number;
  totalRoutes: number;
  refetch: () => Promise<void>;
  applyFilters: (filters: Partial<TradeFlowFilters>) => Promise<void>;
}

export const useTradeFlowData = (initialFilters?: Partial<TradeFlowFilters>): UseTradeFlowDataReturn => {
  const [routes, setRoutes] = useState<TradeFlowRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalRoutes, setTotalRoutes] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<Partial<TradeFlowFilters>>(initialFilters || {});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: TradeFlowApiResponse = await getTradeFlowRoutes();
      
      setRoutes(response.routes);
      setTotalVolume(response.totalVolume);
      setTotalRoutes(response.totalRoutes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trade flow data');
      console.error('Error fetching trade flow data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (filters: Partial<TradeFlowFilters>) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentFilters(prev => ({ ...prev, ...filters }));

      const filteredRoutes = await getFilteredRoutes({
        regions: filters.regions,
        sectors: filters.sectors,
        minVolume: filters.minTradeVolume,
        maxVolume: filters.maxTradeVolume,
      });

      setRoutes(filteredRoutes);
      setTotalRoutes(filteredRoutes.length);
      setTotalVolume(filteredRoutes.reduce((sum, route) => sum + route.tradeVolume, 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply filters');
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (Object.keys(currentFilters).length > 0) {
      await applyFilters(currentFilters);
    } else {
      await fetchData();
    }
  }, [fetchData, applyFilters, currentFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    routes,
    loading,
    error,
    totalVolume,
    totalRoutes,
    refetch,
    applyFilters,
  };
};
