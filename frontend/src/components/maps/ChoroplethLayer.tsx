import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { CountryTradeData, CountryFeature } from '../../types/geographic';
import { getColorScale, formatTradeVolume, formatGrowthRate } from '../../utils/geoDataUtils';

interface ChoroplethLayerProps {
  countries: CountryFeature[];
  tradeData: CountryTradeData[];
  metric: 'volume' | 'growth' | 'marketShare';
  onCountryClick?: (country: CountryTradeData) => void;
  onCountryHover?: (country: CountryTradeData | null) => void;
}

export const ChoroplethLayer: React.FC<ChoroplethLayerProps> = ({
  countries,
  tradeData,
  metric,
  onCountryClick,
  onCountryHover,
}) => {
  const getMetricValue = (country: CountryTradeData): number => {
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
  };

  const getColorForValue = (value: number): string => {
    const values = tradeData.map(getMetricValue);
    const colorScale = getColorScale(values);
    return colorScale(value);
  };

  const getCountryStyle = (feature: CountryFeature) => {
    const tradeInfo = tradeData.find(t => t.countryCode === feature.properties.ISO_A3);
    
    if (!tradeInfo) {
      return {
        fillColor: '#f0f0f0',
        weight: 1,
        opacity: 0.8,
        color: '#666',
        fillOpacity: 0.3,
      };
    }

    const value = getMetricValue(tradeInfo);
    const fillColor = getColorForValue(value);
    
    return {
      fillColor,
      weight: 2,
      opacity: 1,
      color: '#fff',
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: CountryFeature, layer: any) => {
    const tradeInfo = tradeData.find(t => t.countryCode === feature.properties.ISO_A3);
    
    if (tradeInfo) {
      const popupContent = `
        <div class="p-3">
          <h3 class="font-bold text-lg mb-2">${tradeInfo.countryName}</h3>
          <div class="space-y-1 text-sm">
            <div><strong>Trade Volume (2025):</strong> ${formatTradeVolume(tradeInfo.tradeVolume2025 * 1e9)}</div>
            <div><strong>Growth Rate:</strong> ${formatGrowthRate(tradeInfo.growthRate)}</div>
            <div><strong>Market Share:</strong> ${tradeInfo.marketShare2025.toFixed(1)}%</div>
            <div><strong>Region:</strong> ${tradeInfo.region}</div>
          </div>
        </div>
      `;
      
      layer.bindPopup(popupContent);
      
      layer.on({
        mouseover: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            color: '#333',
            fillOpacity: 0.9,
          });
          onCountryHover?.(tradeInfo);
        },
        mouseout: (e: any) => {
          const layer = e.target;
          layer.setStyle(getCountryStyle(feature));
          onCountryHover?.(null);
        },
        click: () => {
          onCountryClick?.(tradeInfo);
        },
      });
    }
  };

  const geoJsonData = {
    type: 'FeatureCollection' as const,
    features: countries,
  };

  const defaultStyle = {
    fillColor: '#e5e7eb',
    weight: 1,
    opacity: 1,
    color: '#9ca3af',
    fillOpacity: 0.7,
  };

  const styleFunction = (feature: any) => {
    if (!feature) return defaultStyle;
    return getCountryStyle(feature as CountryFeature);
  };

  return (
    <GeoJSON
      data={geoJsonData}
      style={styleFunction}
      onEachFeature={onEachFeature}
    />
  );
};
