import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Sun, Battery, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnimatedCounter } from './ui/AnimatedCounter';

const EnhancedNewThreeSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const products = [
    {
      icon: Zap,
      name: 'Electric Vehicles',
      stats: {
        exports: '$180B',
        growth: '+67%',
        trend: "up" as const,
        marketShare: 'Global leader with 60% market share',
      },
      description: 'China dominates global EV exports with advanced battery technology and competitive pricing.',
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Sun,
      name: 'Solar Photovoltaics',
      stats: {
        exports: '$120B',
        growth: '+15%',
        trend: "up" as const,
        marketShare: 'Controls 80% of global solar supply chain',
      },
      description: 'Massive scale manufacturing and technological innovation drive solar panel dominance.',
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Battery,
      name: 'Lithium Batteries',
      stats: {
        exports: '$95B',
        growth: '+45%',
        trend: "up" as const,
        marketShare: 'Leading supplier for global energy storage',
      },
      description: 'Critical component for renewable energy transition and electric mobility.',
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-white relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
            Sectoral Transformation
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            The "New Three" Revolution
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Electric vehicles, batteries, and solar panels drive China's export transformation and global green technology leadership
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-6 md:p-8 h-full relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {/* Gradient accent at top */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${product.color}`}
                />

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6 shadow-lg group-hover:animate-glow`}
                >
                  <product.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h3>

                <p className="text-gray-600 mb-6">{product.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Exports</p>
                    <p className="font-mono font-bold text-gray-900">
                      {product.stats.exports}
                    </p>
                  </div>
                  <div className="bg-gray-50/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Growth</p>
                    <div className="flex items-center gap-1">
                      {product.stats.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : product.stats.trend === "down" ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-500" />
                      )}
                      <p
                        className={`font-mono font-bold ${
                          product.stats.trend === "up"
                            ? "text-green-600"
                            : product.stats.trend === "down"
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {product.stats.growth}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gold-50 border border-gold-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Market Position</p>
                  <p className="font-medium text-gold-700">
                    {product.stats.marketShare}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Combined stat */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="inline-flex flex-col items-center bg-gradient-to-br from-gold-50 to-orange-50 border border-gold-200 rounded-2xl p-8 shadow-lg">
            <p className="text-gray-600 mb-2 font-medium">
              Combined "New Three" Exports
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-gold-600 text-lg font-mono">$</span>
              <AnimatedCounter
                end={395}
                decimals={0}
                className="text-5xl md:text-6xl font-bold bg-gradient-gold bg-clip-text text-transparent"
              />
              <span className="text-gold-600 text-2xl font-mono ml-1">B</span>
            </div>
            <p className="text-gray-600 mt-2">(+42% YoY Growth)</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedNewThreeSection;
