# React + D3.js Integration Patterns for Animated Dashboard Charts

## Core Integration Patterns

### 1. React Controls DOM, D3 Handles Math
```jsx
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const TimeSeriesChart = ({ data, width = 800, height = 400 }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value))
      .range([innerHeight, 0]);

    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Animated line drawing
    const path = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line);

    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale));

  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};
```

### 2. Custom Hook Pattern
```jsx
import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const useD3 = (renderChartFn, dependencies) => {
  const ref = useRef();

  useEffect(() => {
    renderChartFn(d3.select(ref.current));
    return () => {};
  }, dependencies);

  return ref;
};

const AnimatedBarChart = ({ data }) => {
  const ref = useD3(
    (svg) => {
      const height = 400;
      const width = 600;
      const margin = { top: 20, right: 30, bottom: 40, left: 90 };

      svg.selectAll("*").remove();

      const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([margin.left, width - margin.right]);

      const yScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

      svg.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", margin.left)
        .attr("y", d => yScale(d.name))
        .attr("height", yScale.bandwidth())
        .attr("fill", "#3b82f6")
        .transition()
        .duration(1000)
        .attr("width", d => xScale(d.value) - margin.left);
    },
    [data]
  );

  return <svg ref={ref} width={600} height={400} />;
};
```

## Chart.js Alternatives

### 1. React-Chartjs-2 with Custom Animations
```jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartJSTimeSeries = ({ data }) => {
  const options = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: 'Time Series Data',
        data: data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return <Line options={options} data={chartData} />;
};
```

### 2. Recharts for React-Native Style
```jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AnimationProps
} from 'recharts';

const RechartsTimeSeries = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          type="number"
          scale="time"
          domain={['dataMin', 'dataMax']}
        />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#3b82f6"
          strokeWidth={2}
          animationDuration={2000}
          animationEasing="ease-in-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

## Framer Motion Integration

### 1. Animated Chart Container
```jsx
import { motion } from 'framer-motion';
import { useState } from 'react';

const AnimatedDashboard = ({ charts }) => {
  const [selectedChart, setSelectedChart] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="dashboard-grid"
    >
      {charts.map((chart, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="chart-container"
        >
          {chart}
        </motion.div>
      ))}
    </motion.div>
  );
};
```

### 2. Animated Chart Transitions
```jsx
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedChartWrapper = ({ children, chartKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={chartKey}
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

## Animation Libraries Comparison

### 1. React Spring for Physics-Based Animations
```jsx
import { useSpring, animated } from '@react-spring/web';

const SpringAnimatedChart = ({ data, isVisible }) => {
  const props = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 280, friction: 60 }
  });

  return (
    <animated.div style={props}>
      <TimeSeriesChart data={data} />
    </animated.div>
  );
};
```

### 2. React Transition Group for Mount/Unmount
```jsx
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const TransitionChart = ({ charts, activeChart }) => {
  return (
    <TransitionGroup>
      <CSSTransition
        key={activeChart}
        timeout={500}
        classNames="chart-transition"
      >
        <div className="chart-wrapper">
          {charts[activeChart]}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
```

## Responsive Design Best Practices

### 1. Responsive Hook
```jsx
import { useState, useEffect } from 'react';

const useResponsiveChart = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getChartDimensions = (containerRef) => {
    if (!containerRef.current) return { width: 800, height: 400 };
    
    const { width } = containerRef.current.getBoundingClientRect();
    return {
      width: Math.max(300, width - 40),
      height: Math.max(200, width * 0.5)
    };
  };

  return { dimensions, getChartDimensions };
};
```

### 2. Responsive Chart Component
```jsx
import { useRef, useEffect, useState } from 'react';

const ResponsiveChart = ({ data, ChartComponent }) => {
  const containerRef = useRef();
  const [chartDimensions, setChartDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setChartDimensions({
          width: Math.max(300, width - 40),
          height: Math.max(200, width * 0.5)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div ref={containerRef} className="chart-container">
      <ChartComponent 
        data={data} 
        width={chartDimensions.width}
        height={chartDimensions.height}
      />
    </div>
  );
};
```

### 3. CSS Grid Dashboard Layout
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.chart-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-height: 300px;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.5rem;
  }
  
  .chart-container {
    padding: 0.75rem;
    min-height: 250px;
  }
}

.chart-transition-enter {
  opacity: 0;
  transform: translateX(100%);
}

.chart-transition-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 500ms ease-in-out;
}

.chart-transition-exit {
  opacity: 1;
  transform: translateX(0);
}

.chart-transition-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: all 500ms ease-in-out;
}
```

## Performance Optimization

### 1. Memoized Chart Component
```jsx
import { memo, useMemo } from 'react';

const OptimizedChart = memo(({ data, width, height }) => {
  const processedData = useMemo(() => {
    return data.map(d => ({
      ...d,
      date: new Date(d.date),
      value: +d.value
    }));
  }, [data]);

  return <TimeSeriesChart data={processedData} width={width} height={height} />;
});
```

### 2. Virtual Scrolling for Large Datasets
```jsx
import { FixedSizeList as List } from 'react-window';

const VirtualizedChartList = ({ charts, itemHeight = 400 }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <div className="chart-container">
        {charts[index]}
      </div>
    </div>
  );

  return (
    <List
      height={800}
      itemCount={charts.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

## Real-Time Data Integration

### 1. WebSocket Data Stream
```jsx
import { useState, useEffect } from 'react';

const useRealTimeData = (wsUrl) => {
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(prev => [...prev.slice(-100), newData]); // Keep last 100 points
    };

    return () => ws.close();
  }, [wsUrl]);

  return { data, isConnected };
};

const RealTimeChart = ({ wsUrl }) => {
  const { data, isConnected } = useRealTimeData(wsUrl);
  
  return (
    <div>
      <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Live' : '🔴 Disconnected'}
      </div>
      <TimeSeriesChart data={data} />
    </div>
  );
};
```

## Library Recommendations

### Best for Different Use Cases:

1. **D3.js + React**: Maximum customization, complex interactions
2. **Chart.js**: Quick setup, standard chart types, good performance
3. **Recharts**: React-native feel, declarative API, good for simple charts
4. **Victory**: Modular, animation-focused, React-first design
5. **Nivo**: Beautiful defaults, responsive, extensive chart types

### Animation Libraries:
1. **Framer Motion**: Best overall, great documentation
2. **React Spring**: Physics-based, performance-focused
3. **React Transition Group**: Simple transitions, lightweight
4. **Lottie React**: Complex animations from After Effects

### Performance Considerations:
- Use `React.memo()` for expensive chart renders
- Implement data virtualization for large datasets
- Debounce resize events
- Use `requestAnimationFrame` for smooth animations
- Consider Canvas over SVG for >1000 data points