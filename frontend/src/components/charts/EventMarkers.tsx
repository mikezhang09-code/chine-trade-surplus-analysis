import React from 'react';
import { TimelineEvent } from '../../types/timeline';
import { formatDate } from '../../utils/timelineUtils';

interface EventMarkersProps {
  events: TimelineEvent[];
  onEventHover?: (event: TimelineEvent | null) => void;
  selectedEventTypes?: string[];
}

export const EventMarkers: React.FC<EventMarkersProps> = ({ 
  events, 
  onEventHover,
  selectedEventTypes 
}) => {
  const filteredEvents = selectedEventTypes 
    ? events.filter(event => selectedEventTypes.includes(event.type))
    : events;

  return (
    <div className="relative">
      {/* Event markers are rendered as part of the main timeline chart */}
      {/* This component provides the event filtering and tooltip logic */}
      
      {/* Event legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Key Events</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
              onMouseEnter={() => onEventHover?.(event)}
              onMouseLeave={() => onEventHover?.(null)}
            >
              <div
                className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
                style={{
                  backgroundColor: (() => {
                    switch (event.type) {
                      case 'policy': return '#EF4444';
                      case 'economic': return '#10B981';
                      case 'external': return '#F59E0B';
                      case 'trade': return '#8B5CF6';
                      case 'pandemic': return '#EC4899';
                      default: return '#6B7280';
                    }
                  })()
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </h5>
                  <span className="text-xs text-gray-500">
                    {formatDate(event.date, 'MMM yyyy')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    event.impact === 'positive' ? 'bg-green-100 text-green-700' :
                    event.impact === 'negative' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.impact}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    event.severity === 'high' ? 'bg-red-100 text-red-700' :
                    event.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.severity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
