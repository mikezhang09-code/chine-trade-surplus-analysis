import React from 'react';
import { RegionalTradeData, CountryTradeData } from '../../types/geographic';
import { formatTradeVolume, formatGrowthRate, calculateRegionalAnalysis } from '../../utils/geoDataUtils';

interface RegionalComparisonProps {
  regionalData: RegionalTradeData[];
  countryData: CountryTradeData[];
  selectedRegion?: string;
  onRegionSelect?: (region: string) => void;
}

export const RegionalComparison: React.FC<RegionalComparisonProps> = ({
  countryData,
  selectedRegion,
  onRegionSelect,
}) => {
  const analysis = calculateRegionalAnalysis(countryData);
  
  const getRegionColor = (region: string): string => {
    const colors: Record<string, string> = {
      'North America': '#EF4444',
      'Europe': '#3B82F6',
      'Asia': '#10B981',
      'Southeast Asia': '#F59E0B',
      'Africa': '#8B5CF6',
      'South America': '#EC4899',
      'Europe/Asia': '#6B7280',
    };
    return colors[region] || '#6B7280';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 50) return '🚀';
    if (growth > 20) return '📈';
    if (growth > 0) return '↗️';
    if (growth > -10) return '→';
    return '📉';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Regional Analysis (2018 vs 2025)
        </h3>
        
        {/* Regional Overview Cards */}
        <div className="space-y-3">
          {analysis.map((region) => (
            <div
              key={region.region}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRegion === region.region
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onRegionSelect?.(region.region)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getRegionColor(region.region) }}
                  />
                  <h4 className="font-medium text-gray-900">{region.region}</h4>
                  <span className="text-lg">{getGrowthIcon(region.growthRate)}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {formatGrowthRate(region.growthRate)}
                  </div>
                  <div className="text-xs text-gray-500">Growth</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">2018 Volume</div>
                  <div className="font-medium">
                    {formatTradeVolume(region.beforeVolume * 1e9)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">2025 Volume</div>
                  <div className="font-medium">
                    {formatTradeVolume(region.afterVolume * 1e9)}
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-1">Market Share Change</div>
                <div className={`text-sm font-medium ${
                  region.marketShareChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {region.marketShareChange >= 0 ? '+' : ''}{region.marketShareChange.toFixed(1)}%
                </div>
              </div>
              
              {/* Top Countries */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-2">Top Growing Countries</div>
                <div className="flex flex-wrap gap-1">
                  {region.topCountries.slice(0, 3).map((country, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                    >
                      {country.name} ({formatGrowthRate(country.growth)})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Key Insights</h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <div className="text-red-500 mt-0.5">📉</div>
            <div>
              <div className="font-medium text-red-800">US Market Decline</div>
              <div className="text-red-700">
                North America saw the largest decline in trade share, reflecting the impact of trade tensions and tariffs.
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <div className="text-green-500 mt-0.5">🚀</div>
            <div>
              <div className="font-medium text-green-800">Global South Surge</div>
              <div className="text-green-700">
                Africa and Southeast Asia experienced explosive growth, with many countries seeing 100%+ increases.
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-500 mt-0.5">🔄</div>
            <div>
              <div className="font-medium text-blue-800">Strategic Diversification</div>
              <div className="text-blue-700">
                China successfully redirected trade flows to reduce dependence on traditional Western markets.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Summary</h4>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {analysis.filter(r => r.growthRate > 0).length}
            </div>
            <div className="text-xs text-gray-600">Regions with Growth</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {Math.max(...analysis.map(r => r.growthRate)).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Highest Growth Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
