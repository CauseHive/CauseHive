import React from 'react';
import { useSearchAnalytics } from '../../contexts/SearchAnalyticsContext';
import { TrendingUp, Search, Star, ArrowRight } from 'lucide-react';

const PopularSearchesWidget = ({ 
  limit = 5, 
  showTitle = true, 
  compact = false,
  onSearchClick 
}) => {
  const { getPopularSearches } = useSearchAnalytics();
  const popularSearches = getPopularSearches(limit);

  if (popularSearches.length === 0) {
    return null;
  }

  const handleSearchClick = (query) => {
    if (onSearchClick) {
      onSearchClick(query);
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-4">
        {showTitle && (
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-gray-800">Trending</h3>
          </div>
        )}
        <div className="space-y-2">
          {popularSearches.slice(0, 3).map((search, index) => (
            <button
              key={search.query}
              onClick={() => handleSearchClick(search.query)}
              className="w-full flex items-center justify-between text-left p-2 hover:bg-gray-50 rounded transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">#{index + 1}</span>
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                  {search.query}
                </span>
              </div>
              <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {showTitle && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-800">Popular Searches</h3>
          </div>
          <span className="text-sm text-gray-500">{popularSearches.length} total</span>
        </div>
      )}
      
      <div className="p-4">
        <div className="space-y-3">
          {popularSearches.map((search, index) => (
            <button
              key={search.query}
              onClick={() => handleSearchClick(search.query)}
              className="w-full flex items-center justify-between text-left p-3 hover:bg-blue-50 rounded-lg transition-colors group border border-transparent hover:border-blue-200"
            >
              <div className="flex items-center gap-3">
                <div className={`
                  flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                  ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'}
                `}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                    {search.query}
                  </p>
                  <p className="text-sm text-gray-500">
                    {search.count} search{search.count !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-gray-400">
                  <Search className="w-4 h-4" />
                  <span className="text-xs">Search</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {popularSearches.length >= limit && (
        <div className="px-4 py-3 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Showing top {limit} searches
          </p>
        </div>
      )}
    </div>
  );
};

export default PopularSearchesWidget;