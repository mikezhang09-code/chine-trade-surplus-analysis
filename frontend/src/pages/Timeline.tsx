import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTimelineData } from '../hooks/useTimelineData';
import { TradeTimelineChart } from '../components/charts/TradeTimelineChart';
import { EventMarkers } from '../components/charts/EventMarkers';
import { TimelineControls } from '../components/charts/TimelineControls';
import { ContextPanel } from '../components/charts/ContextPanel';
import { TimelineDataPoint, TimelineEvent, EventType } from '../types/timeline';

const Timeline: React.FC = () => {
  const [startYear, setStartYear] = useState<number>(2010);
  const [endYear, setEndYear] = useState<number>(2025);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([
    'policy', 'economic', 'external', 'trade', 'pandemic'
  ]);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<TimelineDataPoint | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);

  const { 
    timelineData, 
    events, 
    periodAnalysis, 
    loading, 
    error, 
    refetch,
    fetchPeriodAnalysis 
  } = useTimelineData(startYear, endYear, selectedEventTypes);

  const handleYearRangeChange = (newStartYear: number, newEndYear: number) => {
    setStartYear(newStartYear);
    setEndYear(newEndYear);
  };

  const handleEventTypeFilter = (eventTypes: EventType[]) => {
    setSelectedEventTypes(eventTypes);
  };

  const handlePeriodSelect = async (startDate: Date, endDate: Date) => {
    await fetchPeriodAnalysis(startDate, endDate);
  };

  const handleDataPointHover = (dataPoint: TimelineDataPoint | null) => {
    setHoveredDataPoint(dataPoint);
    if (dataPoint) {
      setHoveredEvent(null);
    }
  };

  const handleEventHover = (event: TimelineEvent | null) => {
    setHoveredEvent(event);
    if (event) {
      setHoveredDataPoint(null);
    }
  };

  const handleZoomReset = () => {
    setStartYear(2010);
    setEndYear(2025);
  };

  const clearContextPanel = () => {
    setHoveredDataPoint(null);
    setHoveredEvent(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Timeline</h2>
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
            China's Trade Surplus Timeline (2010-2025)
          </h1>
          <p className="text-gray-600">
            Interactive timeline showing the evolution of China's trade surplus with key economic and policy events
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1">
            <TimelineControls
              onYearRangeChange={handleYearRangeChange}
              onEventTypeFilter={handleEventTypeFilter}
              onZoomReset={handleZoomReset}
              loading={loading}
            />
          </div>

          {/* Main Timeline Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline Chart */}
            <TradeTimelineChart
              data={timelineData}
              events={events.filter(event => selectedEventTypes.includes(event.type))}
              onPeriodSelect={handlePeriodSelect}
              onDataPointHover={handleDataPointHover}
              loading={loading}
            />

            {/* Event Markers Legend */}
            <EventMarkers
              events={events}
              onEventHover={handleEventHover}
              selectedEventTypes={selectedEventTypes}
            />
          </div>

          {/* Context Panel */}
          <div className="lg:col-span-1">
            <ContextPanel
              periodData={periodAnalysis}
              hoveredDataPoint={hoveredDataPoint}
              hoveredEvent={hoveredEvent}
              isVisible={!!(periodAnalysis || hoveredDataPoint || hoveredEvent)}
              onClose={clearContextPanel}
            />
          </div>
        </div>

        {/* Key Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Timeline Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Pre-Trade War (2010-2017)</h3>
              <p className="text-xs text-blue-700">
                Steady growth period with gradual surplus increases as China's manufacturing capacity expanded.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-900 mb-2">Trade War Era (2018-2019)</h3>
              <p className="text-xs text-purple-700">
                Despite US tariffs, China maintained surplus through market diversification and export redirection.
              </p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-pink-900 mb-2">Pandemic Impact (2020-2021)</h3>
              <p className="text-xs text-pink-700">
                COVID-19 initially disrupted trade, but China's recovery and global demand surge boosted surplus.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-900 mb-2">Record Surplus (2022-2025)</h3>
              <p className="text-xs text-green-700">
                "New Three" exports and weak domestic demand drove unprecedented $1.2T surplus achievement.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>
            Timeline data represents China's monthly trade surplus with major economic and policy events
          </p>
          <p className="mt-1">
            Source: Chinese Customs Data, Ministry of Commerce, Economic Research Analysis
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Timeline;
