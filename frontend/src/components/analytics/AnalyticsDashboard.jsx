import React, { useState, useMemo } from 'react';
import { useSearchAnalytics } from '../../contexts/SearchAnalyticsContext';
import { 
  BarChart3, 
  TrendingUp, 
  Search, 
  Filter, 
  Calendar,
  MousePointer,
  Trash2,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  Target
} from 'lucide-react';

const AnalyticsDashboard = ({ isOpen, onClose }) => {
  const {
    searchHistory,
    recentSearches,
    getPopularSearches,
    getSearchTrends,
    getFilterStats,
    getSearchPerformance,
    clearAnalytics
  } = useSearchAnalytics();

  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    popularSearches: true,
    recentSearches: true,
    searchTrends: true,
    filterUsage: true
  });

  // Calculate analytics data
  const popularSearches = useMemo(() => getPopularSearches(8), [getPopularSearches]);
  const searchTrends = useMemo(() => getSearchTrends(7), [getSearchTrends]);
  const filterStats = useMemo(() => getFilterStats(), [getFilterStats]);
  const performance = useMemo(() => getSearchPerformance(), [getSearchPerformance]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getMaxTrendValue = () => {
    return Math.max(...Object.values(searchTrends), 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Search Analytics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'filters', label: 'Filters', icon: Filter }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Searches</p>
                      <p className="text-2xl font-bold text-blue-800">{performance.totalSearches}</p>
                    </div>
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Total Clicks</p>
                      <p className="text-2xl font-bold text-green-800">{performance.totalClicks}</p>
                    </div>
                    <MousePointer className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Avg Results</p>
                      <p className="text-2xl font-bold text-purple-800">{performance.avgResultsPerSearch}</p>
                    </div>
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">CTR</p>
                      <p className="text-2xl font-bold text-orange-800">{performance.clickThroughRate}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Popular Searches */}
              <div className="bg-white border rounded-lg">
                <button
                  onClick={() => toggleSection('popularSearches')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-800">Popular Searches</h3>
                    <span className="text-sm text-gray-500">({popularSearches.length})</span>
                  </div>
                  {expandedSections.popularSearches ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedSections.popularSearches && (
                  <div className="p-4 border-t bg-gray-50">
                    {popularSearches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {popularSearches.map((search, index) => (
                          <div
                            key={search.query}
                            className="flex items-center justify-between bg-white p-3 rounded border"
                          >
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                #{index + 1}
                              </span>
                              <span className="font-medium text-gray-800">{search.query}</span>
                            </div>
                            <span className="text-sm text-gray-500">{search.count} searches</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No popular searches yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Searches */}
              <div className="bg-white border rounded-lg">
                <button
                  onClick={() => toggleSection('recentSearches')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-800">Recent Searches</h3>
                    <span className="text-sm text-gray-500">({recentSearches.length})</span>
                  </div>
                  {expandedSections.recentSearches ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedSections.recentSearches && (
                  <div className="p-4 border-t bg-gray-50">
                    {recentSearches.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((query, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {query}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent searches</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              {/* Search Trends Chart */}
              <div className="bg-white border rounded-lg">
                <button
                  onClick={() => toggleSection('searchTrends')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-gray-800">Search Activity (Last 7 Days)</h3>
                  </div>
                  {expandedSections.searchTrends ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedSections.searchTrends && (
                  <div className="p-4 border-t">
                    <div className="space-y-3">
                      {Object.entries(searchTrends).reverse().map(([date, count]) => (
                        <div key={date} className="flex items-center gap-4">
                          <span className="text-sm text-gray-600 w-16">{formatDate(date)}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(count / getMaxTrendValue()) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-700 font-medium w-8">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search History */}
              <div className="bg-white border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-500" />
                    Search History
                    <span className="text-sm text-gray-500">({searchHistory.length})</span>
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {searchHistory.slice(0, 20).map((search) => (
                    <div key={search.id} className="p-3 border-b hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{search.query}</p>
                          <p className="text-sm text-gray-500">
                            {search.resultCount} results • {new Date(search.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {Object.keys(search.filters || {}).length > 0 && (
                          <div className="flex gap-1">
                            {Object.keys(search.filters).map((filter) => (
                              <span
                                key={filter}
                                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                              >
                                {filter}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'filters' && (
            <div className="space-y-6">
              {/* Filter Usage Stats */}
              <div className="bg-white border rounded-lg">
                <button
                  onClick={() => toggleSection('filterUsage')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-gray-800">Filter Usage Statistics</h3>
                  </div>
                  {expandedSections.filterUsage ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedSections.filterUsage && (
                  <div className="p-4 border-t">
                    {Object.keys(filterStats).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(filterStats)
                          .sort(([,a], [,b]) => b - a)
                          .map(([filter, count]) => (
                            <div key={filter} className="flex items-center gap-4">
                              <span className="text-sm text-gray-700 w-32 capitalize">{filter.replace(/([A-Z])/g, ' $1')}</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${(count / Math.max(...Object.values(filterStats))) * 100}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-700 font-medium w-8">{count}</span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No filter usage data yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clear Analytics Button */}
          <div className="pt-6 border-t flex justify-end">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
                  clearAnalytics();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Analytics Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;