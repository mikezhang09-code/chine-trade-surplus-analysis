import { useState, useEffect } from 'react';
import {
  CountryTradeData,
  TradeFlowData,
  RegionalTradeData,
  GeographicFilters,
} from '../types/geographic';
import {
  getCountryTradeData,
  getTradeFlowData,
  getRegionalTradeData,
  getComparisonData,
} from '../services/geographicService';

interface UseGeographicDataReturn {
  countryData: CountryTradeData[];
  tradeFlows: TradeFlowData[];
  regionalData: RegionalTradeData[];
  comparisonData: {
    before: CountryTradeData[];
    after: CountryTradeData[];
  } | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  fetchComparison: () => Promise<void>;
}

export const useGeographicData = (
  filters?: GeographicFilters
): UseGeographicDataReturn => {
  const [countryData, setCountryData] = useState<CountryTradeData[]>([]);
  const [tradeFlows, setTradeFlows] = useState<TradeFlowData[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalTradeData[]>([]);
  const [comparisonData, setComparisonData] = useState<{
    before: CountryTradeData[];
    after: CountryTradeData[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [countryResponse, flowResponse, regionalResponse] = await Promise.all([
        getCountryTradeData(),
        getTradeFlowData(),
        getRegionalTradeData(),
      ]);

      if (countryResponse.status === 'error') {
        throw new Error(countryResponse.message);
      }
      if (flowResponse.status === 'error') {
        throw new Error(flowResponse.message);
      }
      if (regionalResponse.status === 'error') {
        throw new Error(regionalResponse.message);
      }

      let filteredCountryData = countryResponse.data;
      let filteredFlowData = flowResponse.data;

      // Apply regional filters
      if (filters?.regions && filters.regions.length > 0) {
        filteredCountryData = filteredCountryData.filter(country =>
          filters.regions.includes(country.region)
        );
        filteredFlowData = filteredFlowData.filter(flow =>
          filteredCountryData.some(country => country.countryCode === flow.destination)
        );
      }

      // Apply minimum trade volume filter
      if (filters?.minTradeVolume) {
        filteredCountryData = filteredCountryData.filter(country =>
          country.tradeVolume2025 >= filters.minTradeVolume
        );
      }

      setCountryData(filteredCountryData);
      setTradeFlows(filters?.showFlows ? filteredFlowData : []);
      setRegionalData(regionalResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchComparison = async () => {
    try {
      const response = await getComparisonData();
      
      if (response.status === 'error') {
        throw new Error(response.message);
      }
      
      setComparisonData(response.data);
    } catch (err) {
      console.error('Failed to fetch comparison data:', err);
      setComparisonData(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const refetch = () => {
    fetchData();
  };

  return {
    countryData,
    tradeFlows,
    regionalData,
    comparisonData,
    loading,
    error,
    refetch,
    fetchComparison,
  };
};
