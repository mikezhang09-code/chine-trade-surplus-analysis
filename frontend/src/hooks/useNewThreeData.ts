import { useState, useEffect } from 'react';
import {
  NewThreeExportData,
  RegionalExportData,
  OverviewMetrics,
  ComparisonData,
  TimePeriod,
} from '../types/newThree';
import {
  getNewThreeExportData,
  getRegionalExportData,
  getOverviewMetrics,
  getComparisonData,
} from '../services/newThreeService';

interface UseNewThreeDataReturn {
  exportData: NewThreeExportData[];
  regionalData: RegionalExportData[];
  overviewMetrics: OverviewMetrics | null;
  comparisonData: ComparisonData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useNewThreeData = (
  startYear?: TimePeriod,
  endYear?: TimePeriod,
  selectedYear: TimePeriod = '2025'
): UseNewThreeDataReturn => {
  const [exportData, setExportData] = useState<NewThreeExportData[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalExportData[]>([]);
  const [overviewMetrics, setOverviewMetrics] = useState<OverviewMetrics | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [exportResponse, regionalResponse, metricsResponse, comparisonResponse] = 
        await Promise.all([
          getNewThreeExportData(startYear, endYear),
          getRegionalExportData(),
          getOverviewMetrics(selectedYear),
          getComparisonData(selectedYear),
        ]);

      if (exportResponse.status === 'error') {
        throw new Error(exportResponse.message);
      }
      if (regionalResponse.status === 'error') {
        throw new Error(regionalResponse.message);
      }
      if (metricsResponse.status === 'error') {
        throw new Error(metricsResponse.message);
      }
      if (comparisonResponse.status === 'error') {
        throw new Error(comparisonResponse.message);
      }

      setExportData(exportResponse.data);
      setRegionalData(regionalResponse.data);
      setOverviewMetrics(metricsResponse.data);
      setComparisonData(comparisonResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startYear, endYear, selectedYear]);

  const refetch = () => {
    fetchData();
  };

  return {
    exportData,
    regionalData,
    overviewMetrics,
    comparisonData,
    loading,
    error,
    refetch,
  };
};
