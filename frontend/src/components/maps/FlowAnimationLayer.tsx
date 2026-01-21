import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { TradeFlowData } from '../../types/geographic';
import { formatTradeVolume } from '../../utils/geoDataUtils';

interface FlowAnimationLayerProps {
  flows: TradeFlowData[];
  animated?: boolean;
  showLabels?: boolean;
}

export const FlowAnimationLayer: React.FC<FlowAnimationLayerProps> = ({
  flows,
  animated = true,
  showLabels = false,
}) => {
  const map = useMap();
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!map) return;

    // Clean up existing layer
    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
    }

    // Create new layer group
    layerGroupRef.current = L.layerGroup().addTo(map);

    // Add flow lines
    flows.forEach((flow, index) => {
      const startLatLng: L.LatLngExpression = [
        flow.coordinates.origin[1],
        flow.coordinates.origin[0]
      ];
      const endLatLng: L.LatLngExpression = [
        flow.coordinates.destination[1],
        flow.coordinates.destination[0]
      ];

      // Calculate line width based on trade volume
      const maxVolume = Math.max(...flows.map(f => f.volume));
      const minWidth = 2;
      const maxWidth = 8;
      const width = minWidth + (flow.volume / maxVolume) * (maxWidth - minWidth);

      // Get color based on growth rate
      const color = flow.growth >= 0 ? '#10B981' : '#EF4444';
      const opacity = Math.min(0.8, 0.3 + (flow.volume / maxVolume) * 0.5);

      // Create curved path for better visualization
      const midPoint = [
        (flow.coordinates.origin[1] + flow.coordinates.destination[1]) / 2,
        (flow.coordinates.origin[0] + flow.coordinates.destination[0]) / 2
      ];

      // Add some curvature to the path
      const curvature = 0.3;
      const distance = Math.sqrt(
        Math.pow(flow.coordinates.destination[1] - flow.coordinates.origin[1], 2) +
        Math.pow(flow.coordinates.destination[0] - flow.coordinates.origin[0], 2)
      );
      
      const curvedMidPoint: L.LatLngExpression = [
        midPoint[0] + (distance * curvature * Math.sin(index * 0.5)),
        midPoint[1] + (distance * curvature * Math.cos(index * 0.5))
      ];

      // Create the flow line using a polyline with curved path
      const flowLine = L.polyline(
        [startLatLng, curvedMidPoint, endLatLng],
        {
          color,
          weight: width,
          opacity,
          smoothFactor: 1,
        }
      );

      // Add popup with flow information
      const popupContent = `
        <div class="p-3">
          <h3 class="font-bold text-lg mb-2">Trade Flow</h3>
          <div class="space-y-1 text-sm">
            <div><strong>Volume:</strong> ${formatTradeVolume(flow.volume * 1e9)}</div>
            <div><strong>Growth:</strong> ${flow.growth >= 0 ? '+' : ''}${flow.growth.toFixed(1)}%</div>
            <div><strong>Year:</strong> ${flow.year}</div>
          </div>
        </div>
      `;
      
      flowLine.bindPopup(popupContent);
      layerGroupRef.current?.addLayer(flowLine);

      // Add animated flow particles if enabled
      if (animated) {
        createFlowAnimation(flowLine, flow, layerGroupRef.current);
      }

      // Add labels if enabled
      if (showLabels && flow.volume > 50) { // Only show labels for major flows
        const labelMarker = L.marker(curvedMidPoint, {
          icon: L.divIcon({
            className: 'flow-label',
            html: `<div class="bg-white px-2 py-1 rounded shadow text-xs font-medium">
              ${formatTradeVolume(flow.volume * 1e9)}
            </div>`,
            iconSize: [60, 20],
            iconAnchor: [30, 10],
          }),
        });
        
        layerGroupRef.current?.addLayer(labelMarker);
      }
    });

    return () => {
      if (layerGroupRef.current) {
        map.removeLayer(layerGroupRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [map, flows, animated, showLabels]);

  const createFlowAnimation = (
    line: L.Polyline,
    flow: TradeFlowData,
    layerGroup: L.LayerGroup | null
  ) => {
    if (!layerGroup) return;

    const latlngs = line.getLatLngs() as L.LatLng[];
    let progress = 0;
    const speed = 0.01; // Animation speed

    const animateParticle = () => {
      progress += speed;
      
      if (progress >= 1) {
        progress = 0;
      }

      // Calculate position along the path
      const segmentIndex = Math.floor(progress * (latlngs.length - 1));
      const segmentProgress = (progress * (latlngs.length - 1)) - segmentIndex;
      
      if (segmentIndex < latlngs.length - 1) {
        const start = latlngs[segmentIndex];
        const end = latlngs[segmentIndex + 1];
        
        const lat = start.lat + (end.lat - start.lat) * segmentProgress;
        const lng = start.lng + (end.lng - start.lng) * segmentProgress;

        // Create or update particle marker
        const particleId = `particle-${flow.origin}-${flow.destination}`;
        const existingParticle = layerGroup.getLayers().find(
          (layer: any) => layer.options?.particleId === particleId
        );

        if (existingParticle) {
          (existingParticle as L.Marker).setLatLng([lat, lng]);
        } else {
          const particle = L.circleMarker([lat, lng], {
            radius: 4,
            fillColor: flow.growth >= 0 ? '#10B981' : '#EF4444',
            color: '#fff',
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.8,
            particleId,
          } as any);
          
          layerGroup.addLayer(particle);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animateParticle);
    };

    if (animated) {
      animateParticle();
    }
  };

  return null; // This component doesn't render anything directly
};
