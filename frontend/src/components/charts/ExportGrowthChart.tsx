import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { NewThreeExportData } from '../../types/newThree';
import { COLORS, getAnimationConfig, getResponsiveConfig } from '../../utils/chartUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ExportGrowthChartProps {
  data: NewThreeExportData[];
  loading: boolean;
}

export const ExportGrowthChart: React.FC<ExportGrowthChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-96">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.period),
    datasets: [
      {
        label: 'Electric Vehicles',
        data: data.map(item => item.evExports),
        borderColor: COLORS.EV_BLUE,
        backgroundColor: COLORS.EV_BLUE + COLORS.BACKGROUND_ALPHA,
        fill: false,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Batteries',
        data: data.map(item => item.batteryExports),
        borderColor: COLORS.BATTERY_GREEN,
        backgroundColor: COLORS.BATTERY_GREEN + COLORS.BACKGROUND_ALPHA,
        fill: false,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Solar Panels',
        data: data.map(item => item.solarExports),
        borderColor: COLORS.SOLAR_ORANGE,
        backgroundColor: COLORS.SOLAR_ORANGE + COLORS.BACKGROUND_ALPHA,
        fill: false,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    ...getResponsiveConfig(),
    ...getAnimationConfig(1200),
    plugins: {
      title: {
        display: true,
        text: 'New Three Exports Growth Trends (2020-2025)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: 20,
      },
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(1)}B`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Year',
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
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-96">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Key Insight:</strong> Electric vehicle exports show the steepest growth trajectory, 
          increasing from $45.2B in 2020 to $312.8B in 2025, representing a 590% increase over five years.
        </p>
      </div>
    </div>
  );
};
