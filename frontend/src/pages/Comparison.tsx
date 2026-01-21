import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGeographicData } from '../hooks/useGeographicData';
import { GeographicPivotMap } from '../components/maps/GeographicPivotMap';
import { MapControls } from '../components/maps/MapControls';
import { TradeFlowLegend } from '../components/maps/TradeFlowLegend';
import { RegionalComparison } from '../components/maps/RegionalComparison';
import { 
  GeographicFilters, 
  MapViewMode, 
  TradeMetric, 
  CountryTradeData 
} from '../types/geographic';
import { formatTradeVolume, formatGrowthRate } from '../utils/geoDataUtils';

const Comparison: React.FC = () => {
  const [filters, setFilters] = useState<GeographicFilters>({
    timePeriod: '2025',
    regions: [],
    minTradeVolume: 0,
    showFlows: false,
    animateFlows: false,
  });
  
  const [metric, setMetric] = useState<TradeMetric>('volume');
  const [selectedCountry, setSelectedCountry] = useState<CountryTradeData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const { 
    countryData, 
    tradeFlows, 
    regionalData,
    loading, 
    error, 
    refetch,
    fetchComparison 
  } = useGeographicData(filters);

  const handleFiltersChange = (newFilters: GeographicFilters) => {
    setFilters(newFilters);
  };

  const handleViewModeChange = (mode: MapViewMode) => {
    // Adjust filters based on view mode
    if (mode === 'flows') {
      setFilters(prev => ({ ...prev, showFlows: true }));
    } else if (mode === 'comparison') {
      setFilters(prev => ({ ...prev, timePeriod: 'comparison' }));
      fetchComparison();
    }
  };

  const handleMetricChange = (newMetric: TradeMetric) => {
    setMetric(newMetric);
  };

  const handleCountryClick = (country: CountryTradeData) => {
    setSelectedCountry(country);
  };

  const handleCountryHover = () => {
    // Handle hover effects if needed
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setFilters(prev => ({
      ...prev,
      regions: [region]
    }));
  };

  const getMinMaxValues = (): { min: number; max: number } => {
    if (countryData.length === 0) return { min: 0, max: 100 };
    
    const values = countryData.map(country => {
      switch (metric) {
        case 'volume':
          return country.tradeVolume2025;
        case 'growth':
          return country.growthRate;
        case 'marketShare':
          return country.marketShare2025;
        default:
          return 0;
      }
    });
    
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Geographic Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { min, max } = getMinMaxValues();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            China's Geographic Trade Pivot Analysis
          </h1>
          <p className="text-gray-600">
            Interactive visualization showing China's strategic shift from US markets to Global South destinations
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <MapControls
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onViewModeChange={handleViewModeChange}
              onMetricChange={handleMetricChange}
              loading={loading}
            />
            
            <TradeFlowLegend
              metric={metric}
              showFlows={filters.showFlows}
              minValue={min}
              maxValue={max}
            />
          </div>

          {/* Main Map Area */}
          <div className="lg:col-span-2">
            <GeographicPivotMap
              countryData={countryData}
              tradeFlows={tradeFlows}
              filters={filters}
              metric={metric}
              onCountryClick={handleCountryClick}
              onCountryHover={handleCountryHover}
              loading={loading}
            />
          </div>

          {/* Regional Analysis Sidebar */}
          <div className="lg:col-span-1">
            <RegionalComparison
              regionalData={regionalData}
              countryData={countryData}
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionSelect}
            />
          </div>
        </div>

        {/* Selected Country Details */}
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedCountry.countryName} Trade Details
              </h3>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">2018 Trade Volume</div>
                <div className="text-xl font-bold text-blue-900">
                  {formatTradeVolume(selectedCountry.tradeVolume2018 * 1e9)}
                </div>
                <div className="text-sm text-blue-700">
                  {selectedCountry.marketShare2018.toFixed(1)}% market share
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">2025 Trade Volume</div>
                <div className="text-xl font-bold text-green-900">
                  {formatTradeVolume(selectedCountry.tradeVolume2025 * 1e9)}
                </div>
                <div className="text-sm text-green-700">
                  {selectedCountry.marketShare2025.toFixed(1)}% market share
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                selectedCountry.growthRate >= 0 ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className={`text-sm font-medium ${
                  selectedCountry.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  Growth Rate
                </div>
                <div className={`text-xl font-bold ${
                  selectedCountry.growthRate >= 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {formatGrowthRate(selectedCountry.growthRate)}
                </div>
                <div className={`text-sm ${
                  selectedCountry.growthRate >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  2018-2025 change
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Analysis</h4>
              <p className="text-sm text-gray-700">
                {selectedCountry.region === 'North America' && selectedCountry.growthRate < 0 &&
                  `${selectedCountry.countryName} represents the traditional market decline, with trade volumes falling ${Math.abs(selectedCountry.growthRate).toFixed(1)}% due to trade tensions and tariff policies.`
                }
                {selectedCountry.region === 'Southeast Asia' && selectedCountry.growthRate > 30 &&
                  `${selectedCountry.countryName} exemplifies China's ASEAN pivot strategy, with trade volumes growing ${selectedCountry.growthRate.toFixed(1)}% as part of regional economic integration.`
                }
                {selectedCountry.region === 'Africa' && selectedCountry.growthRate > 50 &&
                  `${selectedCountry.countryName} shows the dramatic expansion into African markets, with ${selectedCountry.growthRate.toFixed(1)}% growth driven by Belt and Road Initiative investments.`
                }
                {selectedCountry.region === 'Europe/Asia' && selectedCountry.countryName === 'Russia' &&
                  `Russia became a crucial trade partner following Western sanctions, with trade volumes growing ${selectedCountry.growthRate.toFixed(1)}% as China provided alternative markets.`
                }
                {!((selectedCountry.region === 'North America' && selectedCountry.growthRate < 0) ||
                   (selectedCountry.region === 'Southeast Asia' && selectedCountry.growthRate > 30) ||
                   (selectedCountry.region === 'Africa' && selectedCountry.growthRate > 50) ||
                   (selectedCountry.region === 'Europe/Asia' && selectedCountry.countryName === 'Russia')) &&
                  `${selectedCountry.countryName} in ${selectedCountry.region} shows ${selectedCountry.growthRate >= 0 ? 'positive' : 'negative'} trade development with ${formatGrowthRate(selectedCountry.growthRate)} growth from 2018 to 2025.`
                }
              </p>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>
            Geographic data represents China's trade flow redistribution and market diversification strategy
          </p>
          <p className="mt-1">
            Source: Chinese Customs Data, Ministry of Commerce, Regional Trade Statistics
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Comparison;
