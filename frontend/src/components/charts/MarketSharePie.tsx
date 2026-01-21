import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ComparisonData } from '../../types/newThree';
import { COLORS, getAnimationConfig, formatCurrency, formatPercentage } from '../../utils/chartUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MarketSharePieProps {
  data: ComparisonData | null;
  loading: boolean;
}

export const MarketSharePie: React.FC<MarketSharePieProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-96">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded-full mx-auto w-80"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = {
    labels: ['New Three Exports', 'Traditional Exports'],
    datasets: [
      {
        data: [data.newThree.exports, data.traditional.exports],
        backgroundColor: [
          COLORS.EV_BLUE,
          COLORS.TRADITIONAL_GRAY,
        ],
        borderColor: [
          COLORS.EV_BLUE,
          COLORS.TRADITIONAL_GRAY,
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    ...getAnimationConfig(1000),
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Export Composition: New Three vs Traditional (2025)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: 20,
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value * 1e9)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-80">
        <Pie data={chartData} options={options} />
      </div>
      
      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: COLORS.EV_BLUE }}></div>
            <span className="font-medium">New Three</span>
          </div>
          <div className="text-right">
            <div className="font-bold">{formatCurrency(data.newThree.exports * 1e9)}</div>
            <div className="text-sm text-green-600">+{formatPercentage(data.newThree.growth)}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: COLORS.TRADITIONAL_GRAY }}></div>
            <span className="font-medium">Traditional</span>
          </div>
          <div className="text-right">
            <div className="font-bold">{formatCurrency(data.traditional.exports * 1e9)}</div>
            <div className="text-sm text-red-600">{formatPercentage(data.traditional.growth)}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Market Shift:</strong> New Three exports now represent {formatPercentage(data.newThree.share)} 
          of China's total exports, up from traditional manufacturing dominance.
        </p>
      </div>
    </div>
  );
};
