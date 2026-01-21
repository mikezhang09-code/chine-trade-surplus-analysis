import React from 'react';
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
import { NewThreeExportData } from '../../types/newThree';
import { COLORS, getAnimationConfig, getResponsiveConfig, formatCurrency, formatPercentage } from '../../utils/chartUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ComparativeAnalysisProps {
  data: NewThreeExportData[];
  loading: boolean;
}

export const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-96">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Compare 2020 vs 2025 data
  const startYear = data.find(item => item.period === '2020');
  const endYear = data.find(item => item.period === '2025');

  if (!startYear || !endYear) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">Insufficient data for comparison</p>
      </div>
    );
  }

  const chartData = {
    labels: ['Electric Vehicles', 'Batteries', 'Solar Panels', 'Total New Three'],
    datasets: [
      {
        label: '2020',
        data: [
          startYear.evExports,
          startYear.batteryExports,
          startYear.solarExports,
          startYear.totalNewThree,
        ],
        backgroundColor: COLORS.TRADITIONAL_GRAY + COLORS.BACKGROUND_ALPHA,
        borderColor: COLORS.TRADITIONAL_GRAY,
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: '2025',
        data: [
          endYear.evExports,
          endYear.batteryExports,
          endYear.solarExports,
          endYear.totalNewThree,
        ],
        backgroundColor: COLORS.EV_BLUE + COLORS.BACKGROUND_ALPHA,
        borderColor: COLORS.EV_BLUE,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    ...getResponsiveConfig(),
    ...getAnimationConfig(1000),
    plugins: {
      title: {
        display: true,
        text: 'New Three Exports: 2020 vs 2025 Comparison',
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

  // Calculate growth rates
  const evGrowth = ((endYear.evExports - startYear.evExports) / startYear.evExports) * 100;
  const batteryGrowth = ((endYear.batteryExports - startYear.batteryExports) / startYear.batteryExports) * 100;
  const solarGrowth = ((endYear.solarExports - startYear.solarExports) / startYear.solarExports) * 100;
  const totalGrowth = ((endYear.totalNewThree - startYear.totalNewThree) / startYear.totalNewThree) * 100;

  const growthData = [
    { category: 'Electric Vehicles', growth: evGrowth, color: COLORS.EV_BLUE },
    { category: 'Batteries', growth: batteryGrowth, color: COLORS.BATTERY_GREEN },
    { category: 'Solar Panels', growth: solarGrowth, color: COLORS.SOLAR_ORANGE },
    { category: 'Total New Three', growth: totalGrowth, color: COLORS.EV_BLUE },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-80 mb-6">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="border-t pt-4">
        <h4 className="text-lg font-semibold mb-4">5-Year Growth Analysis</h4>
        <div className="grid grid-cols-2 gap-4">
          {growthData.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium">{item.category}</span>
              </div>
              <span className="text-sm font-bold text-green-600">
                +{formatPercentage(item.growth)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Transformation:</strong> The "New Three" exports have grown by {formatPercentage(totalGrowth)} 
          from 2020 to 2025, with electric vehicles leading the surge at {formatPercentage(evGrowth)} growth.
        </p>
      </div>
    </div>
  );
};
