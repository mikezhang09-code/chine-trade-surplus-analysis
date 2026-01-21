export interface NewThreeExportData {
  period: string;
  evExports: number;
  batteryExports: number;
  solarExports: number;
  totalNewThree: number;
  traditionalExports: number;
  growthRate: number;
}

export interface RegionalExportData {
  region: string;
  evExports: number;
  batteryExports: number;
  solarExports: number;
  totalExports: number;
  marketShare: number;
}

export interface TimeSeriesData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  tension?: number;
}

export interface OverviewMetrics {
  totalExports: number;
  growthRate: number;
  marketShare: number;
  topRegion: string;
}

export interface ComparisonData {
  traditional: {
    exports: number;
    share: number;
    growth: number;
  };
  newThree: {
    exports: number;
    share: number;
    growth: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export type ExportCategory = 'ev' | 'battery' | 'solar' | 'traditional';
export type TimePeriod = '2020' | '2021' | '2022' | '2023' | '2024' | '2025';
export type Region = 'US' | 'EU' | 'ASEAN' | 'Africa' | 'LatinAmerica' | 'Other';
