import React from 'react';
import { motion } from 'framer-motion';
import { OverviewMetrics } from '../../types/newThree';
import { formatCurrency, formatPercentage } from '../../utils/chartUtils';

interface NewThreeOverviewProps {
  metrics: OverviewMetrics | null;
  loading: boolean;
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  delay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white rounded-lg shadow-lg p-6 border-l-4"
    style={{ borderLeftColor: color }}
  >
    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
      {title}
    </h3>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: delay + 0.3 }}
      className="mt-2 text-3xl font-bold text-gray-900"
    >
      {value}
    </motion.p>
    <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
  </motion.div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
      </div>
    ))}
  </div>
);

export const NewThreeOverview: React.FC<NewThreeOverviewProps> = ({ metrics, loading }) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!metrics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Failed to load overview metrics</p>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total New Three Exports',
      value: formatCurrency(metrics.totalExports * 1e9), // Convert to actual currency
      subtitle: 'Electric Vehicles, Batteries & Solar',
      color: '#3B82F6',
      delay: 0,
    },
    {
      title: 'Growth Rate',
      value: `+${formatPercentage(metrics.growthRate)}`,
      subtitle: 'Year-over-year increase',
      color: '#10B981',
      delay: 0.1,
    },
    {
      title: 'Market Share',
      value: formatPercentage(metrics.marketShare),
      subtitle: 'Of total Chinese exports',
      color: '#F59E0B',
      delay: 0.2,
    },
    {
      title: 'Top Market',
      value: metrics.topRegion,
      subtitle: 'Largest export destination',
      color: '#6B7280',
      delay: 0.3,
    },
  ];

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          China's "New Three" Exports Dashboard
        </h2>
        <p className="text-gray-600">
          Interactive analysis of Electric Vehicles, Batteries, and Solar Panel exports driving China's 2025 trade surplus
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};
