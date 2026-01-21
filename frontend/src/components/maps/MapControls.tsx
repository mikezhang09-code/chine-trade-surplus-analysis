import React, { useState } from 'react';
import { GeographicFilters, MapViewMode, TradeMetric } from '../../types/geographic';

interface MapControlsProps {
  filters: GeographicFilters;
  onFiltersChange: (filters: GeographicFilters) => void;
  onViewModeChange?: (mode: MapViewMode) => void;
  onMetricChange?: (metric: TradeMetric) => void;
  loading?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  filters,
  onFiltersChange,
  onViewModeChange,
  onMetricChange,
  loading = false,
}) => {
  const [viewMode, setViewMode] = useState<MapViewMode>('choropleth');
  const [metric, setMetric] = useState<TradeMetric>('volume');

  const regions = [
    { value: 'North America', label: 'North America', color: '#EF4444' },
    { value: 'Europe', label: 'Europe', color: '#3B82F6' },
    { value: 'Asia', label: 'Asia', color: '#10B981' },
    { value: 'Southeast Asia', label: 'Southeast Asia', color: '#F59E0B' },
    { value: 'Africa', label: 'Africa', color: '#8B5CF6' },
    { value: 'South America', label: 'South America', color: '#EC4899' },
    { value: 'Europe/Asia', label: 'Europe/Asia', color: '#6B7280' },
  ];

  const handleTimePeriodChange = (period: '2018' | '2025' | 'comparison') => {
    onFiltersChange({
      ...filters,
      timePeriod: period,
    });
  };

  const handleRegionToggle = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region];
    
    onFiltersChange({
      ...filters,
      regions: newRegions,
    });
  };

  const handleMinVolumeChange = (volume: number) => {
    onFiltersChange({
      ...filters,
      minTradeVolume: volume,
    });
  };

  const handleFlowToggle = (showFlows: boolean) => {
    onFiltersChange({
      ...filters,
      showFlows,
    });
  };

  const handleAnimationToggle = (animateFlows: boolean) => {
    onFiltersChange({
      ...filters,
      animateFlows,
    });
  };

  const handleViewModeChange = (mode: MapViewMode) => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  };

  const handleMetricChange = (newMetric: TradeMetric) => {
    setMetric(newMetric);
    onMetricChange?.(newMetric);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Map Controls</h3>
        
        {/* Time Period Selection */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: '2018' as const, label: '2018 (Before)' },
                { value: '2025' as const, label: '2025 (After)' },
                { value: 'comparison' as const, label: 'Comparison' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleTimePeriodChange(option.value)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    filters.timePeriod === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={loading}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Mode
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'choropleth' as const, label: 'Country Colors' },
                { value: 'flows' as const, label: 'Trade Flows' },
                { value: 'comparison' as const, label: 'Side by Side' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleViewModeChange(option.value)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === option.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={loading}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Metric
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'volume' as const, label: 'Trade Volume' },
                { value: 'growth' as const, label: 'Growth Rate' },
                { value: 'marketShare' as const, label: 'Market Share' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleMetricChange(option.value)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    metric === option.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={loading}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Filters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Regions
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onFiltersChange({ ...filters, regions: regions.map(r => r.value) })}
              className="text-xs text-blue-600 hover:text-blue-800"
              disabled={loading}
            >
              Select All
            </button>
            <button
              onClick={() => onFiltersChange({ ...filters, regions: [] })}
              className="text-xs text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {regions.map(region => (
            <label key={region.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.regions.includes(region.value)}
                onChange={() => handleRegionToggle(region.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: region.color }}
              />
              <span className="text-sm text-gray-700">{region.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Trade Volume Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Trade Volume (Billions USD)
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minTradeVolume}
            onChange={(e) => handleMinVolumeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={loading}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0B</span>
            <span className="font-medium">${filters.minTradeVolume}B</span>
            <span>$100B+</span>
          </div>
        </div>
      </div>

      {/* Flow Controls */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showFlows}
            onChange={(e) => handleFlowToggle(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={loading}
          />
          <span className="text-sm font-medium text-gray-700">Show Trade Flows</span>
        </label>
        
        {filters.showFlows && (
          <label className="flex items-center gap-3 cursor-pointer ml-6">
            <input
              type="checkbox"
              checked={filters.animateFlows}
              onChange={(e) => handleAnimationToggle(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={loading}
            />
            <span className="text-sm text-gray-700">Animate Flows</span>
          </label>
        )}
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => onFiltersChange({
            timePeriod: '2025',
            regions: [],
            minTradeVolume: 0,
            showFlows: false,
            animateFlows: false,
          })}
          className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
          disabled={loading}
        >
          Reset Filters
        </button>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">How to use:</p>
        <ul className="space-y-1">
          <li>• Select time period to compare before/after trade patterns</li>
          <li>• Choose regions to focus on specific geographic areas</li>
          <li>• Adjust minimum volume to filter smaller trade relationships</li>
          <li>• Enable flows to see animated trade connections</li>
          <li>• Click countries for detailed trade statistics</li>
        </ul>
      </div>
    </div>
  );
};
