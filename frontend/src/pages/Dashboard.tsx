import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNewThreeData } from '../hooks/useNewThreeData';
import { NewThreeOverview } from '../components/charts/NewThreeOverview';
import { ExportGrowthChart } from '../components/charts/ExportGrowthChart';
import { MarketSharePie } from '../components/charts/MarketSharePie';
import { GeographicDistribution } from '../components/charts/GeographicDistribution';
import { ComparativeAnalysis } from '../components/charts/ComparativeAnalysis';
import { TimePeriod } from '../types/newThree';

const Dashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<TimePeriod>('2025');
  const { 
    exportData, 
    regionalData, 
    overviewMetrics, 
    comparisonData, 
    loading, 
    error,
    refetch 
  } = useNewThreeData(undefined, undefined, selectedYear);

  const yearOptions: TimePeriod[] = ['2020', '2021', '2022', '2023', '2024', '2025'];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Year Selection */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                China's "New Three" Exports Analysis
              </h1>
              <p className="text-gray-600">
                Comprehensive analysis of Electric Vehicles, Batteries, and Solar Panel exports
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="year-select" className="text-sm font-medium text-gray-700">
                Year:
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as TimePeriod)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <NewThreeOverview metrics={overviewMetrics} loading={loading} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Export Growth Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ExportGrowthChart data={exportData} loading={loading} />
          </div>
          
          {/* Market Share Pie Chart - Takes 1 column */}
          <div className="lg:col-span-1">
            <MarketSharePie data={comparisonData} loading={loading} />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <GeographicDistribution data={regionalData} loading={loading} />
          
          {/* Comparative Analysis */}
          <ComparativeAnalysis data={exportData} loading={loading} />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>
            Data represents China's "New Three" exports: Electric Vehicles, Lithium-ion Batteries, and Solar Panels
          </p>
          <p className="mt-1">
            Source: Chinese Customs Data, Ministry of Commerce
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
