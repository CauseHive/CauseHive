import React from 'react';
import { useSearchAnalytics } from '../../contexts/SearchAnalyticsContext';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

const SearchTrendsChart = ({ 
  days = 7, 
  showTitle = true, 
  compact = false 
}) => {
  const { getSearchTrends } = useSearchAnalytics();
  const trends = getSearchTrends(days);
  
  const trendEntries = Object.entries(trends).reverse();
  const maxValue = Math.max(...Object.values(trends), 1);
  const totalSearches = Object.values(trends).reduce((sum, count) => sum + count, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (compact) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getBarColor = (count, index) => {
    const intensity = count / maxValue;
    if (intensity > 0.8) return 'bg-blue-600';
    if (intensity > 0.6) return 'bg-blue-500';
    if (intensity > 0.4) return 'bg-blue-400';
    if (intensity > 0.2) return 'bg-blue-300';
    return count > 0 ? 'bg-blue-200' : 'bg-gray-200';
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-4">
        {showTitle && (
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-800">Activity</h3>
            <span className="text-xs text-gray-500">({totalSearches} total)</span>
          </div>
        )}
        
        <div className="flex items-end justify-between gap-1 h-16">
          {trendEntries.map(([date, count], index) => (
            <div key={date} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-full rounded-t transition-all duration-300 ${getBarColor(count, index)}`}
                style={{
                  height: `${Math.max((count / maxValue) * 100, count > 0 ? 10 : 0)}%`
                }}
                title={`${formatDate(date)}: ${count} searches`}
              />
              <span className="text-xs text-gray-500 text-center">
                {formatDate(date).slice(0, 1)}
              </span>
            </div>
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
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Search Activity</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last {days} days</span>
          </div>
        </div>
      )}
      
      <div className="p-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{totalSearches}</p>
            <p className="text-sm text-gray-500">Total Searches</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {totalSearches > 0 ? Math.round(totalSearches / days * 10) / 10 : 0}
            </p>
            <p className="text-sm text-gray-500">Avg per Day</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{maxValue}</p>
            <p className="text-sm text-gray-500">Peak Day</p>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>0</span>
            <span>{maxValue}</span>
          </div>
          
          <div className="space-y-2">
            {trendEntries.map(([date, count], index) => (
              <div key={date} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-16 text-right">
                  {formatDate(date)}
                </span>
                
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(count, index)}`}
                    style={{
                      width: `${Math.max((count / maxValue) * 100, count > 0 ? 5 : 0)}%`
                    }}
                  />
                </div>
                
                <span className="text-sm text-gray-700 font-medium w-8 text-center">
                  {count}
                </span>
                
                {count === maxValue && count > 0 && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Growth Indicator */}
        {trendEntries.length >= 2 && (
          <div className="mt-4 pt-4 border-t">
            {(() => {
              const recent = trendEntries.slice(-3).reduce((sum, [, count]) => sum + count, 0);
              const previous = trendEntries.slice(-6, -3).reduce((sum, [, count]) => sum + count, 0);
              const growth = previous > 0 ? ((recent - previous) / previous) * 100 : 0;
              
              return (
                <div className="flex items-center justify-center gap-2 text-sm">
                  {growth > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">
                        +{Math.round(growth)}% from previous period
                      </span>
                    </>
                  ) : growth < 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                      <span className="text-red-600 font-medium">
                        {Math.round(growth)}% from previous period
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">No change from previous period</span>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTrendsChart;