import React, { useState } from 'react';
import { BarChart3, TrendingUp, Search, Settings } from 'lucide-react';
import { useSearchAnalytics } from '../../contexts/SearchAnalyticsContext';
import PopularSearchesWidget from './PopularSearchesWidget';
import SearchTrendsChart from './SearchTrendsChart';
import AnalyticsDashboard from './AnalyticsDashboard';

const EnhancedDashboard = ({ onSearchClick }) => {
  const [showFullAnalytics, setShowFullAnalytics] = useState(false);
  const { getSearchPerformance } = useSearchAnalytics();
  
  const performance = getSearchPerformance();

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Searches</p>
              <p className="text-2xl font-bold text-blue-800">{performance.totalSearches}</p>
            </div>
            <Search className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Avg Results</p>
              <p className="text-2xl font-bold text-green-800">{performance.avgResultsPerSearch}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Click Rate</p>
              <p className="text-2xl font-bold text-purple-800">{performance.clickThroughRate}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Searches */}
        <PopularSearchesWidget 
          limit={6}
          onSearchClick={onSearchClick}
        />

        {/* Search Trends */}
        <SearchTrendsChart 
          days={7}
          compact={false}
        />
      </div>

      {/* View Full Analytics Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowFullAnalytics(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Settings className="w-5 h-5" />
          View Detailed Analytics
        </button>
      </div>

      {/* Full Analytics Modal */}
      <AnalyticsDashboard 
        isOpen={showFullAnalytics}
        onClose={() => setShowFullAnalytics(false)}
      />
    </div>
  );
};

export default EnhancedDashboard;