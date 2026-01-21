import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelinePeriodData, TimelineDataPoint, TimelineEvent } from '../../types/timeline';
import { formatDate, formatCurrency } from '../../utils/timelineUtils';

interface ContextPanelProps {
  periodData?: TimelinePeriodData | null;
  hoveredDataPoint?: TimelineDataPoint | null;
  hoveredEvent?: TimelineEvent | null;
  isVisible: boolean;
  onClose?: () => void;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
  periodData,
  hoveredDataPoint,
  hoveredEvent,
  isVisible,
  onClose,
}) => {
  const renderPeriodAnalysis = () => {
    if (!periodData) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Period Analysis: {periodData.period}
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Average Surplus</div>
            <div className="text-xl font-bold text-blue-900">
              {formatCurrency(periodData.averageSurplus * 1e9)}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Key Events</div>
            <div className="text-xl font-bold text-green-900">
              {periodData.keyEvents.length}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Analysis</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {periodData.analysis}
          </p>
        </div>

        {periodData.keyEvents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Key Events in This Period</h4>
            <div className="space-y-3">
              {periodData.keyEvents.map((event) => (
                <div key={event.id} className="border-l-4 pl-3 py-2" style={{
                  borderLeftColor: (() => {
                    switch (event.type) {
                      case 'policy': return '#EF4444';
                      case 'economic': return '#10B981';
                      case 'external': return '#F59E0B';
                      case 'trade': return '#8B5CF6';
                      case 'pandemic': return '#EC4899';
                      default: return '#6B7280';
                    }
                  })()
                }}>
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-medium text-gray-900">{event.title}</h5>
                    <span className="text-xs text-gray-500">
                      {formatDate(event.date, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{event.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      event.impact === 'positive' ? 'bg-green-100 text-green-700' :
                      event.impact === 'negative' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.impact}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{event.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDataPointTooltip = () => {
    if (!hoveredDataPoint) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {formatDate(hoveredDataPoint.date, 'MMMM yyyy')}
        </h3>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Trade Surplus</div>
          <div className="text-xl font-bold text-blue-900">
            {formatCurrency(hoveredDataPoint.surplus * 1e9)}
          </div>
        </div>

        {hoveredDataPoint.events.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Events in this period ({hoveredDataPoint.events.length})
            </h4>
            <div className="space-y-2">
              {hoveredDataPoint.events.map((event) => (
                <div key={event.id} className="text-sm">
                  <div className="font-medium text-gray-900">{event.title}</div>
                  <div className="text-gray-600 text-xs">{event.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEventTooltip = () => {
    if (!hoveredEvent) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: (() => {
                switch (hoveredEvent.type) {
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
          <h3 className="text-lg font-semibold text-gray-900">
            {hoveredEvent.title}
          </h3>
        </div>

        <div className="text-sm text-gray-600">
          {formatDate(hoveredEvent.date, 'MMMM dd, yyyy')}
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          {hoveredEvent.description}
        </p>

        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded-full ${
            hoveredEvent.impact === 'positive' ? 'bg-green-100 text-green-700' :
            hoveredEvent.impact === 'negative' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {hoveredEvent.impact} impact
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            hoveredEvent.severity === 'high' ? 'bg-red-100 text-red-700' :
            hoveredEvent.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {hoveredEvent.severity} severity
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {hoveredEvent.type} event
          </span>
        </div>
      </div>
    );
  };

  const getContent = () => {
    if (periodData) return renderPeriodAnalysis();
    if (hoveredEvent) return renderEventTooltip();
    if (hoveredDataPoint) return renderDataPointTooltip();
    return null;
  };

  const content = getContent();

  return (
    <AnimatePresence>
      {isVisible && content && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white rounded-lg shadow-lg p-6 max-h-96 overflow-y-auto"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
