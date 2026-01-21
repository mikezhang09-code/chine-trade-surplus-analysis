import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { TimelineDataPoint, TimelineEvent, TimelineChartDimensions } from '../../types/timeline';
import { formatDate, formatCurrency } from '../../utils/timelineUtils';

interface TradeTimelineChartProps {
  data: TimelineDataPoint[];
  events: TimelineEvent[];
  onPeriodSelect?: (startDate: Date, endDate: Date) => void;
  onDataPointHover?: (dataPoint: TimelineDataPoint | null) => void;
  loading?: boolean;
}

export const TradeTimelineChart: React.FC<TradeTimelineChartProps> = ({
  data,
  events,
  onPeriodSelect,
  onDataPointHover,
  loading = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<TimelineChartDimensions>({
    width: 800,
    height: 400,
    margin: { top: 20, right: 30, bottom: 40, left: 60 },
  });

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const containerWidth = svgRef.current.parentElement?.clientWidth || 800;
        setDimensions(prev => ({
          ...prev,
          width: Math.max(400, containerWidth - 40),
        }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data.length || loading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height, margin } = dimensions;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.surplus) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3
      .line<TimelineDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.surplus))
      .curve(d3.curveMonotoneX);

    // Add gradient definition
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'surplus-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', yScale(0))
      .attr('x2', 0).attr('y2', yScale(d3.max(data, d => d.surplus) || 0));

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3B82F6')
      .attr('stop-opacity', 0.1);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3B82F6')
      .attr('stop-opacity', 0.8);

    // Add area under the curve
    const area = d3
      .area<TimelineDataPoint>()
      .x(d => xScale(d.date))
      .y0(yScale(0))
      .y1(d => yScale(d.surplus))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#surplus-gradient)')
      .attr('d', area);

    // Add the line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add data points
    g.selectAll('.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.surplus))
      .attr('r', 4)
      .attr('fill', '#3B82F6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(this: any, d: any) {
        d3.select(this).attr('r', 6);
        onDataPointHover?.(d);
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4);
        onDataPointHover?.(null);
      });

    // Add event markers
    const eventMarkers = g.selectAll('.event-marker')
      .data(events)
      .enter()
      .append('g')
      .attr('class', 'event-marker')
      .attr('transform', d => `translate(${xScale(d.date)}, ${yScale(0) + 20})`);

    eventMarkers
      .append('circle')
      .attr('r', 6)
      .attr('fill', d => {
        switch (d.type) {
          case 'policy': return '#EF4444';
          case 'economic': return '#10B981';
          case 'external': return '#F59E0B';
          case 'trade': return '#8B5CF6';
          case 'pandemic': return '#EC4899';
          default: return '#6B7280';
        }
      })
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    eventMarkers
      .append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', -20)
      .attr('y2', -innerHeight + yScale(0))
      .attr('stroke', '#E5E7EB')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d => formatDate(d as Date, 'yyyy'));

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => formatCurrency(d as number));

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    // Add axis labels
    g.append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'middle')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 35)
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .text('Year');

    g.append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .text('Trade Surplus (USD)');

    // Add brush for period selection
    if (onPeriodSelect) {
      const brush = d3.brushX()
        .extent([[0, 0], [innerWidth, innerHeight]])
        .on('end', function(this: any, event: any) {
          if (!event?.selection) return;
          
          const [x0, x1] = event.selection;
          const startDate = xScale.invert(x0);
          const endDate = xScale.invert(x1);
          
          onPeriodSelect(startDate, endDate);
          
          // Clear the brush
          d3.select(this).call(brush.move, null);
        });

      g.append('g')
        .attr('class', 'brush')
        .call(brush);
    }

  }, [data, events, dimensions, loading, onPeriodSelect, onDataPointHover]);

  if (loading) {
    return (
      <div className="w-full h-96 bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          China's Trade Surplus Evolution (2010-2025)
        </h3>
        <p className="text-sm text-gray-600">
          Click and drag to select a time period for detailed analysis
        </p>
      </div>
      
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
      />
      
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Policy Events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Economic Events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>External Events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span>Trade Events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span>Pandemic Events</span>
        </div>
      </div>
    </div>
  );
};
