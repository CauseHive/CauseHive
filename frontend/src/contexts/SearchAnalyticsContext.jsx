import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Search Analytics Context
const SearchAnalyticsContext = createContext();

// Analytics action types
const ANALYTICS_ACTIONS = {
  TRACK_SEARCH: 'TRACK_SEARCH',
  TRACK_SUGGESTION_CLICK: 'TRACK_SUGGESTION_CLICK',
  TRACK_FILTER_USAGE: 'TRACK_FILTER_USAGE',
  TRACK_RESULT_CLICK: 'TRACK_RESULT_CLICK',
  SET_POPULAR_SEARCHES: 'SET_POPULAR_SEARCHES',
  SET_SEARCH_TRENDS: 'SET_SEARCH_TRENDS',
  CLEAR_ANALYTICS: 'CLEAR_ANALYTICS'
};

// Initial state
const initialState = {
  searchHistory: [],
  popularSearches: [],
  searchTrends: {},
  filterUsage: {},
  recentSearches: [],
  searchPerformance: {},
  totalSearches: 0,
  totalClicks: 0,
  avgSearchTime: 0
};

// Analytics reducer
const analyticsReducer = (state, action) => {
  switch (action.type) {
    case ANALYTICS_ACTIONS.TRACK_SEARCH:
      const newSearch = {
        id: Date.now(),
        query: action.payload.query,
        timestamp: new Date().toISOString(),
        resultCount: action.payload.resultCount || 0,
        filters: action.payload.filters || {},
        sessionId: action.payload.sessionId || generateSessionId()
      };

      const updatedHistory = [newSearch, ...state.searchHistory].slice(0, 100); // Keep last 100 searches
      const updatedRecent = [action.payload.query, ...state.recentSearches.filter(q => q !== action.payload.query)].slice(0, 10);

      return {
        ...state,
        searchHistory: updatedHistory,
        recentSearches: updatedRecent,
        totalSearches: state.totalSearches + 1
      };

    case ANALYTICS_ACTIONS.TRACK_SUGGESTION_CLICK:
      return {
        ...state,
        totalClicks: state.totalClicks + 1
      };

    case ANALYTICS_ACTIONS.TRACK_FILTER_USAGE:
      const filterKey = action.payload.filterType;
      return {
        ...state,
        filterUsage: {
          ...state.filterUsage,
          [filterKey]: (state.filterUsage[filterKey] || 0) + 1
        }
      };

    case ANALYTICS_ACTIONS.TRACK_RESULT_CLICK:
      return {
        ...state,
        totalClicks: state.totalClicks + 1
      };

    case ANALYTICS_ACTIONS.SET_POPULAR_SEARCHES:
      return {
        ...state,
        popularSearches: action.payload
      };

    case ANALYTICS_ACTIONS.SET_SEARCH_TRENDS:
      return {
        ...state,
        searchTrends: action.payload
      };

    case ANALYTICS_ACTIONS.CLEAR_ANALYTICS:
      return initialState;

    default:
      return state;
  }
};

// Generate session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Analytics provider component
export const SearchAnalyticsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  // Load analytics data from localStorage on mount
  useEffect(() => {
    const savedAnalytics = localStorage.getItem('search_analytics');
    if (savedAnalytics) {
      try {
        const parsed = JSON.parse(savedAnalytics);
        Object.keys(parsed).forEach(key => {
          if (initialState.hasOwnProperty(key)) {
            dispatch({ type: `SET_${key.toUpperCase()}`, payload: parsed[key] });
          }
        });
      } catch (error) {
        console.error('Error loading search analytics:', error);
      }
    }
  }, []);

  // Save analytics data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('search_analytics', JSON.stringify(state));
  }, [state]);

  // Analytics functions
  const trackSearch = (query, resultCount = 0, filters = {}) => {
    dispatch({
      type: ANALYTICS_ACTIONS.TRACK_SEARCH,
      payload: { query, resultCount, filters }
    });
  };

  const trackSuggestionClick = (suggestion, query) => {
    dispatch({
      type: ANALYTICS_ACTIONS.TRACK_SUGGESTION_CLICK,
      payload: { suggestion, query }
    });
  };

  const trackFilterUsage = (filterType, filterValue) => {
    dispatch({
      type: ANALYTICS_ACTIONS.TRACK_FILTER_USAGE,
      payload: { filterType, filterValue }
    });
  };

  const trackResultClick = (causeName, query, position) => {
    dispatch({
      type: ANALYTICS_ACTIONS.TRACK_RESULT_CLICK,
      payload: { causeName, query, position }
    });
  };

  const getPopularSearches = (limit = 10) => {
    const searchCounts = {};
    state.searchHistory.forEach(search => {
      const query = search.query.toLowerCase().trim();
      if (query && query.length > 1) {
        searchCounts[query] = (searchCounts[query] || 0) + 1;
      }
    });

    return Object.entries(searchCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  };

  const getSearchTrends = (days = 7) => {
    const now = new Date();
    const trends = {};

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      trends[dateKey] = 0;
    }

    state.searchHistory.forEach(search => {
      const searchDate = search.timestamp.split('T')[0];
      if (trends.hasOwnProperty(searchDate)) {
        trends[searchDate]++;
      }
    });

    return trends;
  };

  const getFilterStats = () => {
    return state.filterUsage;
  };

  const getSearchPerformance = () => {
    const avgResultsPerSearch = state.searchHistory.length > 0
      ? state.searchHistory.reduce((sum, search) => sum + (search.resultCount || 0), 0) / state.searchHistory.length
      : 0;

    const clickThroughRate = state.totalSearches > 0 ? (state.totalClicks / state.totalSearches) * 100 : 0;

    return {
      totalSearches: state.totalSearches,
      totalClicks: state.totalClicks,
      avgResultsPerSearch: Math.round(avgResultsPerSearch * 100) / 100,
      clickThroughRate: Math.round(clickThroughRate * 100) / 100
    };
  };

  const clearAnalytics = () => {
    dispatch({ type: ANALYTICS_ACTIONS.CLEAR_ANALYTICS });
    localStorage.removeItem('search_analytics');
  };

  const value = {
    ...state,
    trackSearch,
    trackSuggestionClick,
    trackFilterUsage,
    trackResultClick,
    getPopularSearches,
    getSearchTrends,
    getFilterStats,
    getSearchPerformance,
    clearAnalytics
  };

  return (
    <SearchAnalyticsContext.Provider value={value}>
      {children}
    </SearchAnalyticsContext.Provider>
  );
};

// Hook to use search analytics
export const useSearchAnalytics = () => {
  const context = useContext(SearchAnalyticsContext);
  if (!context) {
    throw new Error('useSearchAnalytics must be used within a SearchAnalyticsProvider');
  }
  return context;
};

export default SearchAnalyticsContext;