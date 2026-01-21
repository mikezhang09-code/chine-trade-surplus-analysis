import React, { useState } from 'react';
import { EventType } from '../../types/timeline';

interface TimelineControlsProps {
  onYearRangeChange?: (startYear: number, endYear: number) => void;
  onEventTypeFilter?: (eventTypes: EventType[]) => void;
  onZoomReset?: () => void;
  loading?: boolean;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  onYearRangeChange,
  onEventTypeFilter,
  onZoomReset,
  loading = false,
}) => {
  const [startYear, setStartYear] = useState(2010);
  const [endYear, setEndYear] = useState(2025);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([
    'policy', 'economic', 'external', 'trade', 'pandemic'
  ]);

  const eventTypeOptions: { value: EventType; label: string; color: string }[] = [
    { value: 'policy', label: 'Policy', color: '#EF4444' },
    { value: 'economic', label: 'Economic', color: '#10B981' },
    { value: 'external', label: 'External', color: '#F59E0B' },
    { value: 'trade', label: 'Trade', color: '#8B5CF6' },
    { value: 'pandemic', label: 'Pandemic', color: '#EC4899' },
  ];

  const handleYearChange = (type: 'start' | 'end', value: number) => {
    if (type === 'start') {
      setStartYear(value);
      if (value <= endYear) {
        onYearRangeChange?.(value, endYear);
      }
    } else {
      setEndYear(value);
      if (startYear <= value) {
        onYearRangeChange?.(startYear, value);
      }
    }
  };

  const handleEventTypeToggle = (eventType: EventType) => {
    const newSelectedTypes = selectedEventTypes.includes(eventType)
      ? selectedEventTypes.filter(type => type !== eventType)
      : [...selectedEventTypes, eventType];
    
    setSelectedEventTypes(newSelectedTypes);
    onEventTypeFilter?.(newSelectedTypes);
  };

  const handleSelectAllEvents = () => {
    const allTypes: EventType[] = ['policy', 'economic', 'external', 'trade', 'pandemic'];
    setSelectedEventTypes(allTypes);
    onEventTypeFilter?.(allTypes);
  };

  const handleDeselectAllEvents = () => {
    setSelectedEventTypes([]);
    onEventTypeFilter?.([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Controls</h3>
        
        {/* Year Range Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">From:</label>
                <select
                  value={startYear}
                  onChange={(e) => handleYearChange('start', parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {Array.from({ length: 16 }, (_, i) => 2010 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">To:</label>
                <select
                  value={endYear}
                  onChange={(e) => handleYearChange('end', parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {Array.from({ length: 16 }, (_, i) => 2010 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Period Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setStartYear(2010);
                setEndYear(2017);
                onYearRangeChange?.(2010, 2017);
              }}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={loading}
            >
              Pre-Trade War (2010-2017)
            </button>
            <button
              onClick={() => {
                setStartYear(2018);
                setEndYear(2019);
                onYearRangeChange?.(2018, 2019);
              }}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={loading}
            >
              Trade War Start (2018-2019)
            </button>
            <button
              onClick={() => {
                setStartYear(2020);
                setEndYear(2021);
                onYearRangeChange?.(2020, 2021);
              }}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={loading}
            >
              Pandemic Era (2020-2021)
            </button>
            <button
              onClick={() => {
                setStartYear(2022);
                setEndYear(2025);
                onYearRangeChange?.(2022, 2025);
              }}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={loading}
            >
              Record Surplus (2022-2025)
            </button>
          </div>
        </div>
      </div>

      {/* Event Type Filters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Event Types
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAllEvents}
              className="text-xs text-blue-600 hover:text-blue-800"
              disabled={loading}
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAllEvents}
              className="text-xs text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {eventTypeOptions.map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedEventTypes.includes(option.value)}
                onChange={() => handleEventTypeToggle(option.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: option.color }}
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onZoomReset}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
          disabled={loading}
        >
          Reset View
        </button>
        <button
          onClick={() => {
            setStartYear(2010);
            setEndYear(2025);
            onYearRangeChange?.(2010, 2025);
          }}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
          disabled={loading}
        >
          Show All Years
        </button>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">How to use:</p>
        <ul className="space-y-1">
          <li>• Adjust time period using dropdowns or quick buttons</li>
          <li>• Toggle event types to show/hide different categories</li>
          <li>• Click and drag on the timeline to select a period for analysis</li>
          <li>• Hover over data points and events for details</li>
        </ul>
      </div>
    </div>
  );
};
