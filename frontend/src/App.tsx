import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import Comparison from './pages/Comparison';
import ThreeVisualization from './pages/ThreeVisualization';
import './styles/index.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'timeline' | 'comparison' | 'three'>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'timeline':
        return <Timeline />;
      case 'comparison':
        return <Comparison />;
      case 'three':
        return <ThreeVisualization />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">
              China Trade Surplus Analysis
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('timeline')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'timeline'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setCurrentPage('comparison')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'comparison'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Geographic Pivot
              </button>
              <button
                onClick={() => setCurrentPage('three')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'three'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
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
