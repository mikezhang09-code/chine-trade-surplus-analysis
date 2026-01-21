import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TimelineData {
  year: string;
  surplus: number;
  exports: number;
  imports: number;
  event: string;
}

const CustomTooltip = ({ active, payload, label, data }: any) => {
  if (active && payload && payload.length) {
    const item = data.find((d: TimelineData) => d.year === label);
    return (
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg p-4 shadow-xl">
        <p className="font-display text-lg font-bold text-gray-900 mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-600 mb-2">{item?.event}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-gray-600">Surplus:</span>{" "}
            <span className="text-gold-600 font-mono font-bold">
              ${payload[0].value}B
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const EnhancedTimelineChart: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const data: TimelineData[] = [
    { year: "2018", surplus: 352, exports: 2487, imports: 2135, event: "Trade War Begins" },
    { year: "2019", surplus: 420, exports: 2498, imports: 2078, event: "Stabilization Period" },
    { year: "2020", surplus: 533, exports: 2590, imports: 2057, event: "Pandemic Onset" },
    { year: "2021", surplus: 670, exports: 3364, imports: 2694, event: "Post-Pandemic Surge" },
    { year: "2022", surplus: 878, exports: 3593, imports: 2715, event: "Record High" },
    { year: "2023", surplus: 823, exports: 3380, imports: 2557, event: "Stabilization" },
    { year: "2024", surplus: 990, exports: 3520, imports: 2530, event: "Recovery" },
    { year: "2025", surplus: 1200, exports: 3800, imports: 2600, event: "Trillion Threshold" },
  ];

  return (
    <section className="py-20 md:py-32 bg-gray-50 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <span className="inline-block px-3 py-1 bg-gold-100 text-gold-800 text-sm font-medium rounded-full mb-4">
            Historical Evolution
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            The Unprecedented Surge
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From trade war tensions to trillion-dollar milestones: China's export evolution 2018-2025
          </p>
        </motion.div>

        <motion.div
          className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 md:p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2.0, delay: 0.8, ease: "easeOut" }}
        >
          <div className="h-[400px] md:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="surplusGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  stroke="#6b7280"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickFormatter={(value) => `$${value}B`}
                />
                <Tooltip content={<CustomTooltip data={data} />} />
                <Area
                  type="monotone"
                  dataKey="surplus"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fill="url(#surplusGradient)"
                  animationDuration={4000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Key milestones */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { year: "2018", value: "$352B", label: "Trade War Start" },
              { year: "2020", value: "$533B", label: "Pandemic Surge" },
              { year: "2022", value: "$878B", label: "Previous Record" },
              { year: "2025", value: "$1.2T", label: "Historic Peak" },
            ].map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className="text-center p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-white/80 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: 1.5 + index * 0.3, ease: "easeOut" }}
              >
                <p className="text-gold-600 font-mono text-sm mb-1">{milestone.year}</p>
                <p className="font-mono text-xl md:text-2xl font-bold text-gray-900">
                  {milestone.value}
                </p>
                <p className="text-xs text-gray-600 mt-1">{milestone.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
