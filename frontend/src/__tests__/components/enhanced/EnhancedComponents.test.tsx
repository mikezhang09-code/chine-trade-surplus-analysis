import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnimatedCounter } from '../../../components/ui/AnimatedCounter';
import HeroSection from '../../../components/HeroSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  useInView: () => true,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Globe2: () => <div data-testid="globe-icon" />,
  Factory: () => <div data-testid="factory-icon" />,
}));

describe('Enhanced Components', () => {
  describe('AnimatedCounter', () => {
    it('renders animated counter component', () => {
      render(<AnimatedCounter end={1.2} decimals={1} />);
      // The component renders, animation starts at 0
      expect(screen.getByText(/0\./)).toBeInTheDocument();
    });

    it('renders with prefix and suffix', () => {
      render(<AnimatedCounter end={100} prefix="$" suffix="B" />);
      // Check that prefix and suffix are present
      expect(screen.getByText(/\$/)).toBeInTheDocument();
      expect(screen.getByText(/B/)).toBeInTheDocument();
    });
  });

  describe('HeroSection', () => {
    it('renders main headline elements', () => {
      render(<HeroSection />);
      expect(screen.getByText(/China's Historic/)).toBeInTheDocument();
      expect(screen.getByText(/\$1\.2 Trillion/)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Trade Surplus/);
    });

    it('renders analysis date badge', () => {
      render(<HeroSection />);
      expect(screen.getByText('Analysis: January 2026')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(<HeroSection />);
      expect(screen.getByText(/An interactive analysis of the unprecedented trade phenomenon/)).toBeInTheDocument();
    });

    it('renders stat cards', () => {
      render(<HeroSection />);
      expect(screen.getByText('+20%')).toBeInTheDocument();
      expect(screen.getByText('YoY Growth')).toBeInTheDocument();
      expect(screen.getByText('~10%')).toBeInTheDocument();
      expect(screen.getByText("of China's GDP")).toBeInTheDocument();
      expect(screen.getByText('35%')).toBeInTheDocument();
      expect(screen.getByText('Global Mfg Output')).toBeInTheDocument();
    });

    it('renders icons', () => {
      render(<HeroSection />);
      expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
      expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
      expect(screen.getByTestId('factory-icon')).toBeInTheDocument();
    });
  });
});
