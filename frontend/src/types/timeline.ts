export interface TimelineDataPoint {
  date: Date;
  surplus: number;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: EventType;
  impact: 'positive' | 'negative' | 'neutral';
  severity: 'low' | 'medium' | 'high';
}

export type EventType = 'policy' | 'economic' | 'external' | 'trade' | 'pandemic';

export interface TimelineRange {
  start: Date;
  end: Date;
}

export interface TimelineZoom {
  scale: number;
  translate: [number, number];
}

export interface HistoricalTradeData {
  year: number;
  month: number;
  tradeSurplus: number;
  exports: number;
  imports: number;
  significantEvents?: TimelineEvent[];
}

export interface TimelinePeriodData {
  period: string;
  startDate: Date;
  endDate: Date;
  averageSurplus: number;
  totalEvents: number;
  keyEvents: TimelineEvent[];
  analysis: string;
}

export interface TimelineFilters {
  eventTypes: EventType[];
  dateRange: TimelineRange;
  impactFilter: ('positive' | 'negative' | 'neutral')[];
  severityFilter: ('low' | 'medium' | 'high')[];
}

export interface TimelineApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface TimelineChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface TimelineTooltipData {
  date: Date;
  surplus: number;
  events: TimelineEvent[];
  position: {
    x: number;
    y: number;
  };
}
