import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NewThreeOverview } from '../../../frontend/src/components/charts/NewThreeOverview';
import { OverviewMetrics } from '../../../frontend/src/types/newThree';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

const mockMetrics: OverviewMetrics = {
  totalExports: 685.8,
  growthRate: 28.2,
  marketShare: 25.8,
  topRegion: 'EU',
};

describe('NewThreeOverview', () => {
  it('renders loading skeleton when loading is true', () => {
    render(<NewThreeOverview metrics={null} loading={true} />);
    
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error message when metrics is null and not loading', () => {
    render(<NewThreeOverview metrics={null} loading={false} />);
    
    expect(screen.getByText('Failed to load overview metrics')).toBeInTheDocument();
  });

  it('renders metrics correctly when data is provided', () => {
    render(<NewThreeOverview metrics={mockMetrics} loading={false} />);
    
    // Check if title is rendered
    expect(screen.getByText('China\'s "New Three" Exports Dashboard')).toBeInTheDocument();
    
    // Check if metric cards are rendered
    expect(screen.getByText('Total New Three Exports')).toBeInTheDocument();
    expect(screen.getByText('Growth Rate')).toBeInTheDocument();
    expect(screen.getByText('Market Share')).toBeInTheDocument();
    expect(screen.getByText('Top Market')).toBeInTheDocument();
    
    // Check if values are formatted correctly
    expect(screen.getByText('$685.8B')).toBeInTheDocument();
    expect(screen.getByText('+28.2%')).toBeInTheDocument();
    expect(screen.getByText('25.8%')).toBeInTheDocument();
    expect(screen.getByText('EU')).toBeInTheDocument();
  });

  it('displays correct subtitles for each metric', () => {
    render(<NewThreeOverview metrics={mockMetrics} loading={false} />);
    
    expect(screen.getByText('Electric Vehicles, Batteries & Solar')).toBeInTheDocument();
    expect(screen.getByText('Year-over-year increase')).toBeInTheDocument();
    expect(screen.getByText('Of total Chinese exports')).toBeInTheDocument();
    expect(screen.getByText('Largest export destination')).toBeInTheDocument();
  });
});
