import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { RegionalExportData } from '../../types/newThree';
import { COLORS, getAnimationConfig, getResponsiveConfig, formatCurrency } from '../../utils/chartUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GeographicDistributionProps {
  data: RegionalExportData[];
  loading: boolean;
}

type FilterType = 'all' | 'ev' | 'battery' | 'solar';

export const GeographicDistribution: React.FC<GeographicDistributionProps> = ({ data, loading }) => {
  const [filter, setFilter] = useState<FilterType>('all');

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-[1000px]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-[920px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getDataByFilter = () => {
    switch (filter) {
      case 'ev':
        return data.map(item => item.evExports);
      case 'battery':
        return data.map(item => item.batteryExports);
      case 'solar':
        return data.map(item => item.solarExports);
      default:
        return data.map(item => item.totalExports);
    }
  };

  const getColorByFilter = () => {
    switch (filter) {
      case 'ev':
        return COLORS.EV_BLUE;
      case 'battery':
        return COLORS.BATTERY_GREEN;
      case 'solar':
        return COLORS.SOLAR_ORANGE;
      default:
        return COLORS.EV_BLUE;
    }
  };

  const chartData = {
    labels: data.map(item => item.region),
    datasets: [
      {
        label: filter === 'all' ? 'Total Exports' : 
               filter === 'ev' ? 'Electric Vehicles' :
               filter === 'battery' ? 'Batteries' : 'Solar Panels',
        data: getDataByFilter(),
        backgroundColor: getColorByFilter() + COLORS.BACKGROUND_ALPHA,
        borderColor: getColorByFilter(),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    ...getResponsiveConfig(),
    ...getAnimationConfig(800),
    plugins: {
      title: {
        display: true,
        text: 'Regional Distribution of New Three Exports (2025)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: 20,
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y * 1e9)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Region',
          font: {
            weight: 'bold' as const,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Export Value (Billions USD)',
          font: {
            weight: 'bold' as const,
          },
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return `$${value}B`;
          },
        },
      },
    },
  };

  const filterButtons = [
    { key: 'all' as FilterType, label: 'All Exports', color: COLORS.EV_BLUE },
    { key: 'ev' as FilterType, label: 'Electric Vehicles', color: COLORS.EV_BLUE },
    { key: 'battery' as FilterType, label: 'Batteries', color: COLORS.BATTERY_GREEN },
    { key: 'solar' as FilterType, label: 'Solar Panels', color: COLORS.SOLAR_ORANGE },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(button => (
            <button
              key={button.key}
              onClick={() => setFilter(button.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === button.key
                  ? 'text-white shadow-md'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: filter === button.key ? button.color : undefined,
              }}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[900px]">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Geographic Pivot:</strong> EU leads as the top destination for New Three exports, 
          while the US market share has significantly decreased due to trade tensions and tariffs.
        </p>
      </div>
    </div>
  );
};
