import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Globe2, Factory } from 'lucide-react';
import { AnimatedCounter } from './ui/AnimatedCounter';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero-glow overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251, 191, 36, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full border-2 border-gold-400/30"
        animate={{ 
          y: [0, -20, 0], 
          rotate: [0, 180, 360] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-32 h-32 rounded-full border border-gold-400/20"
        animate={{ 
          y: [0, 20, 0], 
          rotate: [360, 180, 0] 
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Date badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.0, ease: "easeOut" }}
          >
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-sm text-gray-600 font-medium">
              Analysis: January 2026
            </span>
          </motion.div>

          {/* Main headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            China's Historic
            <br />
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              $1.2 Trillion
            </span>
            <br />
            Trade Surplus
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            An interactive analysis of the unprecedented trade phenomenon that reshaped global economics in 2025
          </p>

          {/* Main stat display */}
          <motion.div
            className="flex flex-col items-center mb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-gold-500 text-2xl md:text-3xl font-mono">$</span>
              <AnimatedCounter
                end={1.2}
                decimals={1}
                duration={4.0}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-gold bg-clip-text text-transparent animate-counter"
              />
              <span className="text-gold-500 text-2xl md:text-4xl font-mono">T</span>
            </div>
            <span className="text-gray-500 mt-4 font-medium">
              Trade Surplus (2025)
            </span>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1.5, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-mono text-2xl font-bold text-green-600">+20%</p>
                <p className="text-sm text-gray-600">YoY Growth</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-mono text-2xl font-bold text-gray-900">~10%</p>
                <p className="text-sm text-gray-600">of China's GDP</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Factory className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-left">
                <p className="font-mono text-2xl font-bold text-gray-900">35%</p>
                <p className="text-sm text-gray-600">Global Mfg Output</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1, 
            y: [0, 10, 0] 
          }}
          transition={{ 
            delay: 3.5, 
            duration: 2.0, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-gold-500" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
