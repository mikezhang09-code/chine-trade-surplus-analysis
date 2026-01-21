import React from 'react';
import { TradeMetric } from '../../types/geographic';
import { formatTradeVolume, formatGrowthRate } from '../../utils/geoDataUtils';

interface TradeFlowLegendProps {
  metric: TradeMetric;
  showFlows: boolean;
  minValue: number;
  maxValue: number;
}

export const TradeFlowLegend: React.FC<TradeFlowLegendProps> = ({
  metric,
  showFlows,
  minValue,
  maxValue,
}) => {
  const getMetricLabel = (): string => {
    switch (metric) {
      case 'volume':
        return 'Trade Volume';
      case 'growth':
        return 'Growth Rate';
      case 'marketShare':
        return 'Market Share';
      default:
        return 'Trade Data';
    }
  };

  const getMetricUnit = (): string => {
    switch (metric) {
      case 'volume':
        return 'USD';
      case 'growth':
        return '%';
      case 'marketShare':
        return '%';
      default:
        return '';
    }
  };

  const formatValue = (value: number): string => {
    switch (metric) {
      case 'volume':
        return formatTradeVolume(value * 1e9);
      case 'growth':
        return formatGrowthRate(value);
      case 'marketShare':
        return `${value.toFixed(1)}%`;
      default:
        return value.toString();
    }
  };

  const generateColorStops = () => {
    const stops = [];
    const numStops = 5;
    
    for (let i = 0; i < numStops; i++) {
      const ratio = i / (numStops - 1);
      const value = minValue + (maxValue - minValue) * ratio;
      
      // Color scale from light to dark based on metric
      let color: string;
      if (metric === 'growth') {
        // Red for negative, green for positive
        color = value < 0 
          ? `rgb(${255 - Math.abs(value) * 2}, ${100 + Math.abs(value) * 2}, 100)`
          : `rgb(100, ${200 + value}, 100)`;
      } else {
        // Blue scale for volume and market share
        const intensity = Math.floor(100 + ratio * 155);
        color = `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
      }
      
      stops.push({ value, color, label: formatValue(value) });
    }
    
    return stops;
  };

  const colorStops = generateColorStops();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Legend</h3>
        
        {/* Choropleth Legend */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {getMetricLabel()} ({getMetricUnit()})
            </h4>
            
            <div className="space-y-2">
              {colorStops.map((stop, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: stop.color }}
                  />
                  <span className="text-xs text-gray-600">{stop.label}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              Countries with no data are shown in light gray
            </div>
          </div>
        </div>

        {/* Flow Legend */}
        {showFlows && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Trade Flows</h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">Positive Growth</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600">Negative Growth</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
                <span className="text-xs text-gray-600">Small Volume</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-2 bg-gray-600 rounded"></div>
                <span className="text-xs text-gray-600">Large Volume</span>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              Line thickness represents trade volume. Animated particles show flow direction.
            </div>
          </div>
        )}

        {/* Regional Colors */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Regions</h4>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { region: 'North America', color: '#EF4444' },
              { region: 'Europe', color: '#3B82F6' },
              { region: 'Asia', color: '#10B981' },
              { region: 'Southeast Asia', color: '#F59E0B' },
              { region: 'Africa', color: '#8B5CF6' },
              { region: 'South America', color: '#EC4899' },
            ].map(item => (
              <div key={item.region} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600 truncate">{item.region}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
          
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
              <span>US trade volume declined 20% from 2018 to 2025</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
              <span>Southeast Asia saw 50%+ growth in trade volumes</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
              <span>Africa experienced 100%+ growth in many countries</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
              <span>Russia became a major trade partner (+77% growth)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
