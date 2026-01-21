import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import Comparison from './pages/Comparison';
import HeroSection from './components/HeroSection';
import { EnhancedTimelineChart } from './components/charts/EnhancedTimelineChart';
import EnhancedNewThreeSection from './components/EnhancedNewThreeSection';
// import ThreeVisualization from './pages/ThreeVisualization';
import './styles/index.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'timeline' | 'comparison'>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div>
            <HeroSection />
            <EnhancedTimelineChart />
            <EnhancedNewThreeSection />
          </div>
        );
      case 'dashboard':
        return <Dashboard />;
      case 'timeline':
        return <Timeline />;
      case 'comparison':
        return <Comparison />;
      default:
        return (
          <div>
            <HeroSection />
            <EnhancedTimelineChart />
            <EnhancedNewThreeSection />
          </div>
        );
    }
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">
              China Trade Surplus Analysis
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'home'
                    ? 'bg-gold-100 text-gold-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-gold-100 text-gold-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('timeline')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'timeline'
                    ? 'bg-gold-100 text-gold-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setCurrentPage('comparison')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'comparison'
                    ? 'bg-gold-100 text-gold-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Geographic Pivot
              </button>
              {/* Temporarily disabled 3D Globe due to WebGL issues */}
              <button
                disabled
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed"
                title="3D Globe temporarily disabled in web environment"
              >
                3D Globe
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {renderPage()}
    </div>
  );
}

export default App;
