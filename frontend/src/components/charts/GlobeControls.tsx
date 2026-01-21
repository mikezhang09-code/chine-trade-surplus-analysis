import React, { useState } from 'react';
import { TradeFlowFilters, RouteColorScheme, AnimationState } from '../../types/tradeFlow';

interface GlobeControlsProps {
  filters: TradeFlowFilters;
  onFiltersChange: (filters: Partial<TradeFlowFilters>) => void;
  colorScheme: RouteColorScheme;
  onColorSchemeChange: (scheme: RouteColorScheme) => void;
  animationState: AnimationState;
  onAnimationToggle: () => void;
  onAnimationSpeedChange: (speed: number) => void;
  totalRoutes: number;
  totalVolume: number;
  loading?: boolean;
}

export const GlobeControls: React.FC<GlobeControlsProps> = ({
  filters,
  onFiltersChange,
  colorScheme,
  onColorSchemeChange,
  animationState,
  onAnimationToggle,
  onAnimationSpeedChange,
  totalRoutes,
  totalVolume,
  loading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const regions = [
    'North America',
    'Europe', 
    'Southeast Asia',
    'Africa',
    'Middle East',
    'South America',
    'Asia'
  ];

  const sectors = [
    'New Three',
    'Traditional Manufacturing',
    'Technology',
    'Raw Materials',
    'Other'
  ];

  const handleRegionToggle = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region];
    onFiltersChange({ regions: newRegions });
  };

  const handleSectorToggle = (sector: string) => {
    const newSectors = filters.sectors.includes(sector)
      ? filters.sectors.filter(s => s !== sector)
      : [...filters.sectors, sector];
    onFiltersChange({ sectors: newSectors });
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}T`;
    return `$${volume.toFixed(0)}B`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Globe Controls</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg 
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Active Routes</div>
          <div className="text-xl font-bold text-blue-900">
            {loading ? '...' : totalRoutes}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Total Volume</div>
          <div className="text-xl font-bold text-green-900">
            {loading ? '...' : formatVolume(totalVolume)}
          </div>
        </div>
      </div>

      {/* Animation Controls */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Animation</h4>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onAnimationToggle}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              animationState.isPlaying
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {animationState.isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          
          <div className="flex-1">
            <label className="text-xs text-gray-600">Speed</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={animationState.speed}
              onChange={(e) => onAnimationSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-xs text-gray-500 text-center">{animationState.speed}x</div>
          </div>
        </div>
      </div>

      {/* Color Scheme */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Color By</h4>
        <div className="flex gap-2">
          {(['volume', 'growth', 'sector'] as RouteColorScheme[]).map((scheme) => (
            <button
              key={scheme}
              onClick={() => onColorSchemeChange(scheme)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                colorScheme === scheme
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* Volume Range */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Trade Volume Range</h4>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-600">Min Volume ($B)</label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={filters.minTradeVolume}
                  onChange={(e) => onFiltersChange({ minTradeVolume: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Max Volume ($B)</label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={filters.maxTradeVolume}
                  onChange={(e) => onFiltersChange({ maxTradeVolume: parseFloat(e.target.value) || 200 })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Regions Filter */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Regions</h4>
            <div className="space-y-1">
              {regions.map((region) => (
                <label key={region} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.regions.includes(region)}
                    onChange={() => handleRegionToggle(region)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">{region}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sectors Filter */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Sectors</h4>
            <div className="space-y-1">
              {sectors.map((sector) => (
                <label key={sector} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.sectors.includes(sector)}
                    onChange={() => handleSectorToggle(sector)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">{sector}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Growth Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.showGrowthOnly}
                onChange={(e) => onFiltersChange({ showGrowthOnly: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">Show only growing routes</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
