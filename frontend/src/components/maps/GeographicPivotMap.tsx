import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChoroplethLayer } from './ChoroplethLayer';
import { FlowAnimationLayer } from './FlowAnimationLayer';
import { CountryTradeData, TradeFlowData, CountryFeature, GeographicFilters, TradeMetric } from '../../types/geographic';
import { processCountryData } from '../../utils/geoDataUtils';

// Import country boundaries
import countriesData from '../../data/countries.json';

interface GeographicPivotMapProps {
  countryData: CountryTradeData[];
  tradeFlows: TradeFlowData[];
  filters: GeographicFilters;
  metric: TradeMetric;
  onCountryClick?: (country: CountryTradeData) => void;
  onCountryHover?: (country: CountryTradeData | null) => void;
  loading?: boolean;
}

export const GeographicPivotMap: React.FC<GeographicPivotMapProps> = ({
  countryData,
  tradeFlows,
  filters,
  metric,
  onCountryClick,
  onCountryHover,
  loading = false,
}) => {
  const [processedCountries, setProcessedCountries] = useState<CountryFeature[]>([]);

  useEffect(() => {
    // Process country data for choropleth visualization
    const countries = countriesData.features as CountryFeature[];
    const processed = processCountryData(countries, countryData);
    setProcessedCountries(processed);
  }, [countryData]);

  const mapCenter: LatLngExpression = [20, 0]; // Center on equator
  const mapZoom = 2;

  if (loading) {
    return (
      <div className="w-full h-96 bg-white rounded-lg shadow-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading geographic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          China's Geographic Trade Pivot ({filters.timePeriod === 'comparison' ? '2018 vs 2025' : filters.timePeriod})
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {filters.timePeriod === 'comparison' 
            ? 'Interactive comparison showing trade flow redistribution from US to Global South'
            : `Trade volumes and growth patterns for ${filters.timePeriod}`
          }
        </p>
      </div>
      
      <div className="h-96 relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Choropleth layer for country coloring */}
          <ChoroplethLayer
            countries={processedCountries}
            tradeData={countryData}
            metric={metric}
            onCountryClick={onCountryClick}
            onCountryHover={onCountryHover}
          />
          
          {/* Flow animation layer */}
          {filters.showFlows && tradeFlows.length > 0 && (
            <FlowAnimationLayer
              flows={tradeFlows}
              animated={filters.animateFlows}
              showLabels={tradeFlows.length <= 10} // Only show labels for smaller datasets
            />
          )}
        </MapContainer>
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Updating map...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Map Statistics */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {countryData.length}
            </div>
            <div className="text-xs text-gray-600">Countries Shown</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {tradeFlows.length}
            </div>
            <div className="text-xs text-gray-600">Trade Flows</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {filters.regions.length || 'All'}
            </div>
            <div className="text-xs text-gray-600">Regions Filtered</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              ${filters.minTradeVolume}B+
            </div>
            <div className="text-xs text-gray-600">Min Volume</div>
          </div>
        </div>
      </div>
    </div>
  );
};
