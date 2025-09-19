import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BarChart3, TrendingUp, ArrowLeft, Eye } from 'lucide-react';
import { useSearchAnalytics } from '../contexts/SearchAnalyticsContext';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import PopularSearchesWidget from '../components/analytics/PopularSearchesWidget';
import SearchTrendsChart from '../components/analytics/SearchTrendsChart';
import EnhancedDashboard from '../components/analytics/EnhancedDashboard';

const SearchAnalyticsPage = () => {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'detailed'
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  
  const { 
    searchHistory, 
    getSearchPerformance, 
    getPopularSearches
  } = useSearchAnalytics();

  const performance = getSearchPerformance();
  const hasData = searchHistory.length > 0;

  const handleSearchClick = (query) => {
    // Navigate to causes list with search query
    window.location.href = `/causes?search=${encodeURIComponent(query)}`;
  };

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/causes" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Causes
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Search Analytics</h1>
            <p className="text-gray-600 mt-2">Track and analyze search patterns and discover popular causes</p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Search Data Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start searching for causes to see analytics data. Your search patterns and trends will appear here.
            </p>
            <Link 
              to="/causes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-5 h-5" />
              Start Searching Causes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/causes" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Causes
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Search Analytics</h1>
              <p className="text-gray-600 mt-2">Track and analyze search patterns and discover popular causes</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:text-gray-800 border'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setShowDetailedModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Detailed View
              </button>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Searches</p>
                <p className="text-3xl font-bold text-blue-600">{performance.totalSearches}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {performance.totalSearches > 0 ? 'Searches performed' : 'No searches yet'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Results</p>
                <p className="text-3xl font-bold text-green-600">{performance.avgResultsPerSearch}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Results per search</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Click Rate</p>
                <p className="text-3xl font-bold text-purple-600">{performance.clickThroughRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Search to click ratio</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Popular Terms</p>
                <p className="text-3xl font-bold text-orange-600">{getPopularSearches(1).length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Most searched terms</p>
          </div>
        </div>

        {/* Main Content */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            {/* Analytics Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Popular Searches */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Popular Searches</h2>
                <PopularSearchesWidget 
                  limit={8}
                  onSearchClick={handleSearchClick}
                  showTitle={false}
                />
              </div>

              {/* Search Trends */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Search Activity</h2>
                <SearchTrendsChart 
                  days={14}
                  showTitle={false}
                />
              </div>
            </div>

            {/* Search History Preview */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Recent Search Activity</h2>
                <p className="text-gray-600 mt-1">Your latest search queries and results</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {searchHistory.slice(0, 10).map((search) => (
                    <div 
                      key={search.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Search className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{search.query}</p>
                          <p className="text-sm text-gray-500">
                            {search.resultCount} results • {new Date(search.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSearchClick(search.query)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Search Again
                      </button>
                    </div>
                  ))}
                  
                  {searchHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No search history available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Dashboard for comprehensive view */}
        {activeView === 'enhanced' && (
          <EnhancedDashboard onSearchClick={handleSearchClick} />
        )}

        {/* Detailed Analytics Modal */}
        <AnalyticsDashboard 
          isOpen={showDetailedModal}
          onClose={() => setShowDetailedModal(false)}
        />
      </div>
    </div>
  );
};

export default SearchAnalyticsPage;