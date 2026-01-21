export const COLORS = {
  EV_BLUE: '#3B82F6',
  BATTERY_GREEN: '#10B981',
  SOLAR_ORANGE: '#F59E0B',
  TRADITIONAL_GRAY: '#6B7280',
  BACKGROUND_ALPHA: '20',
} as const;

export const getAnimationConfig = (duration = 1000) => ({
  animation: {
    duration,
    easing: 'easeInOutQuart' as const,
  },
  transitions: {
    active: {
      animation: {
        duration: 400,
      },
    },
  },
});

export const getResponsiveConfig = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
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
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
});

export const formatCurrency = (value: number): string => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(1)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  return `$${value.toLocaleString()}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getColorWithAlpha = (color: string, alpha: string): string => {
  return color + alpha;
};

export const createGradient = (
  ctx: CanvasRenderingContext2D,
  color: string
): CanvasGradient => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, getColorWithAlpha(color, COLORS.BACKGROUND_ALPHA));
  return gradient;
};
