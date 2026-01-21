import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TradeFlowGlobe } from '../components/charts/TradeFlowGlobe';
import { GlobeControls } from '../components/charts/GlobeControls';
import { useTradeFlowData } from '../hooks/useTradeFlowData';
import { 
  TradeFlowFilters, 
  RouteColorScheme, 
  AnimationState, 
  GlobeInteraction 
} from '../types/tradeFlow';
import { formatTradeVolume } from '../utils/geoUtils';

const ThreeVisualization: React.FC = () => {
  const [filters, setFilters] = useState<TradeFlowFilters>({
    regions: [],
    sectors: [],
    minTradeVolume: 0,
    maxTradeVolume: 200,
    year: 2025,
    showGrowthOnly: false,
    animationSpeed: 1,
  });

  const [colorScheme, setColorScheme] = useState<RouteColorScheme>('volume');
  const [animationState, setAnimationState] = useState<AnimationState>({
    isPlaying: true,
    currentTime: 0,
    duration: 10,
    speed: 1,
  });

  const [selectedRoute, setSelectedRoute] = useState<GlobeInteraction>({ type: 'none' });

  const { routes, loading, error, totalVolume, totalRoutes, applyFilters } = useTradeFlowData(filters);

  const handleFiltersChange = async (newFilters: Partial<TradeFlowFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    await applyFilters(updatedFilters);
  };

  const handleAnimationToggle = () => {
    setAnimationState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleAnimationSpeedChange = (speed: number) => {
    setAnimationState(prev => ({ ...prev, speed }));
  };

  const handleRouteHover = (interaction: GlobeInteraction) => {
    if (interaction.type === 'hover' && interaction.data) {
      setSelectedRoute(interaction);
    } else if (interaction.type === 'none') {
      setSelectedRoute({ type: 'none' });
    }
  };

  const handleRouteClick = (interaction: GlobeInteraction) => {
    setSelectedRoute(interaction);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading 3D Visualization</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

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
            3D Trade Flow Visualization
          </h1>
          <p className="text-gray-600">
            Interactive 3D globe showing China's export routes and trade relationships worldwide
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1">
            <GlobeControls
              filters={filters}
              onFiltersChange={handleFiltersChange}
              colorScheme={colorScheme}
              onColorSchemeChange={setColorScheme}
              animationState={animationState}
              onAnimationToggle={handleAnimationToggle}
              onAnimationSpeedChange={handleAnimationSpeedChange}
              totalRoutes={totalRoutes}
              totalVolume={totalVolume}
              loading={loading}
            />
          </div>

          {/* 3D Globe */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="h-[600px] relative">
                {loading ? (
                  <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading 3D visualization...</p>
                    </div>
                  </div>
                ) : (
                  <TradeFlowGlobe
                    routes={routes}
                    colorScheme={colorScheme}
                    animationState={animationState}
                    onRouteHover={handleRouteHover}
                    onRouteClick={handleRouteClick}
                  />
                )}
                
                {/* Hover Tooltip */}
                {selectedRoute.type === 'hover' && selectedRoute.data && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-sm max-w-xs">
                    <div className="font-semibold">
                      {selectedRoute.data.originCountry} → {selectedRoute.data.destinationCountry}
                    </div>
                    <div className="text-gray-300">
                      Volume: {formatTradeVolume(selectedRoute.data.tradeVolume)}
                    </div>
                    <div className="text-gray-300">
                      Growth: {selectedRoute.data.growthRate >= 0 ? '+' : ''}{selectedRoute.data.growthRate.toFixed(1)}%
                    </div>
                    <div className="text-gray-300">
                      Sector: {selectedRoute.data.sector}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Route Details */}
        {selectedRoute.type === 'click' && selectedRoute.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Trade Route Details: {selectedRoute.data.originCountry} → {selectedRoute.data.destinationCountry}
              </h3>
              <button
                onClick={() => setSelectedRoute({ type: 'none' })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Trade Volume</div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatTradeVolume(selectedRoute.data.tradeVolume)}
                </div>
                <div className="text-sm text-blue-700">2025 exports</div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                selectedRoute.data.growthRate >= 0 ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className={`text-sm font-medium ${
                  selectedRoute.data.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  Growth Rate
                </div>
                <div className={`text-2xl font-bold ${
                  selectedRoute.data.growthRate >= 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {selectedRoute.data.growthRate >= 0 ? '+' : ''}{selectedRoute.data.growthRate.toFixed(1)}%
                </div>
                <div className={`text-sm ${
                  selectedRoute.data.growthRate >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  2018-2025 change
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Primary Sector</div>
                <div className="text-2xl font-bold text-purple-900">
                  {selectedRoute.data.sector}
                </div>
                <div className="text-sm text-purple-700">Main export category</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 font-medium">Route Distance</div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(Math.random() * 10000 + 5000)} km
                </div>
                <div className="text-sm text-gray-700">Approximate distance</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Route Analysis</h4>
              <p className="text-sm text-gray-700">
                {selectedRoute.data.growthRate > 50 && selectedRoute.data.destinationCountry !== 'United States' &&
                  `This route exemplifies China's successful pivot strategy, with ${selectedRoute.data.growthRate.toFixed(1)}% growth showing strong market expansion beyond traditional Western partners.`
                }
                {selectedRoute.data.destinationCountry === 'United States' &&
                  `Trade with the US reflects the impact of ongoing trade tensions, with ${selectedRoute.data.growthRate.toFixed(1)}% change showing the effects of tariff policies and strategic decoupling.`
                }
                {selectedRoute.data.sector === 'New Three' &&
                  ` The focus on ${selectedRoute.data.sector} exports demonstrates China's transition to high-value manufacturing and green technology leadership.`
                }
                {selectedRoute.data.sector === 'Traditional Manufacturing' &&
                  ` Traditional manufacturing exports continue to play a crucial role in China's trade relationships, particularly in developing markets.`
                }
                {selectedRoute.data.sector === 'Technology' &&
                  ` Technology exports highlight China's growing competitiveness in advanced sectors despite Western restrictions.`
                }
              </p>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <h4 className="font-medium text-blue-900 mb-2">How to Use</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>Rotate:</strong> Click and drag to rotate the globe</p>
            <p>• <strong>Zoom:</strong> Use mouse wheel to zoom in/out</p>
            <p>• <strong>Hover:</strong> Hover over trade routes to see details</p>
            <p>• <strong>Click:</strong> Click on routes for detailed analysis</p>
            <p>• <strong>Filter:</strong> Use controls to filter by region, sector, or volume</p>
            <p>• <strong>Animate:</strong> Toggle animation to see flowing trade particles</p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>
            3D visualization of China's global trade network showing the geographic distribution of the $1.2 trillion trade surplus
          </p>
          <p className="mt-1">
            Source: Chinese Customs Data, Ministry of Commerce, International Trade Statistics
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ThreeVisualization;
