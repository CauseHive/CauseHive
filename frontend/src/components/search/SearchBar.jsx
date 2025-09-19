import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Clock, X, TrendingUp } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchAnalytics } from '../../contexts/SearchAnalyticsContext';
import apiService from '../../services/apiService';
import './SearchBar.css';

const SearchBar = ({ 
  onSearch, 
  onSelectSuggestion, 
  placeholder = "Search causes...", 
  className = "",
  showSuggestions = true,
  maxSuggestions = 8 
}) => {
  const { user } = useAuth();
  const { trackSearch, trackSuggestionClick } = useSearchAnalytics();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Debounce search query for API calls
  const debouncedQuery = useDebounce(query, 300);
  
  // Load search history from localStorage
  const loadSearchHistory = useCallback(() => {
    try {
      const historyKey = user ? `search_history_${user.id}` : 'search_history_guest';
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      setSearchHistory(history.slice(0, 5)); // Limit to 5 recent searches
    } catch (error) {
      console.error('Error loading search history:', error);
      setSearchHistory([]);
    }
  }, [user]);
  
  // Save search to history
  const saveToHistory = useCallback((searchTerm) => {
    try {
      const historyKey = user ? `search_history_${user.id}` : 'search_history_guest';
      const currentHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      // Remove if already exists and add to front
      const newHistory = [
        searchTerm,
        ...currentHistory.filter(item => item !== searchTerm)
      ].slice(0, 10); // Keep only 10 items
      
      localStorage.setItem(historyKey, JSON.stringify(newHistory));
      setSearchHistory(newHistory.slice(0, 5));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, [user]);
  
  // Fetch search suggestions from API
  const fetchSuggestions = useCallback(async (searchTerm) => {
    try {
      setLoading(true);
      const response = await apiService.searchSuggestions(searchTerm);
      setSuggestions(response.slice(0, maxSuggestions));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [maxSuggestions]);
  
  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);
  
  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, fetchSuggestions]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setSuggestions([]);
    }
  };
  
  // Handle search execution
  const handleSearch = useCallback((searchTerm = query) => {
    const trimmedQuery = searchTerm.trim();
    if (trimmedQuery) {
      saveToHistory(trimmedQuery);
      
      // Track search in analytics
      trackSearch(trimmedQuery);
      
      onSearch?.(trimmedQuery);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [query, onSearch, saveToHistory, trackSearch]);
  
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    const suggestionText = suggestion.title || suggestion.text || suggestion;
    
    // Track suggestion click in analytics
    trackSuggestionClick(suggestionText, query);
    
    setQuery(suggestionText);
    onSelectSuggestion?.(suggestion);
    handleSearch(suggestionText);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;
    
    const totalItems = suggestions.length + searchHistory.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const allItems = [...suggestions, ...searchHistory.map(h => ({ text: h, type: 'history' }))];
          const selectedItem = allItems[selectedIndex];
          handleSuggestionSelect(selectedItem);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        searchRef.current?.blur();
        break;
      default:
        // No action needed for other keys
        break;
    }
  };
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Clear search history
  const clearHistory = () => {
    try {
      const historyKey = user ? `search_history_${user.id}` : 'search_history_guest';
      localStorage.removeItem(historyKey);
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };
  
  // Clear current search
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    searchRef.current?.focus();
  };
  
  return (
    <div ref={searchRef} className={`search-bar ${className}`}>
      <div className="search-input-container">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="search-input"
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button onClick={clearSearch} className="clear-button" aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>
      
      {isOpen && showSuggestions && (
        <div ref={suggestionsRef} className="suggestions-dropdown">
          {loading && (
            <div className="suggestion-item loading">
              <div className="loading-spinner" />
              <span>Searching...</span>
            </div>
          )}
          
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-header">
                <TrendingUp size={14} />
                <span>Suggestions</span>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <Search size={14} className="suggestion-icon" />
                  <div className="suggestion-content">
                    <div className="suggestion-title">
                      {suggestion.title || suggestion.name || suggestion.text}
                    </div>
                    {suggestion.description && (
                      <div className="suggestion-description">
                        {suggestion.description}
                      </div>
                    )}
                  </div>
                  {suggestion.type && (
                    <span className="suggestion-type">{suggestion.type}</span>
                  )}
                </button>
              ))}
            </div>
          )}
          
          {/* Search History */}
          {searchHistory.length > 0 && query.trim().length < 2 && (
            <div className="suggestions-section">
              <div className="suggestions-header">
                <Clock size={14} />
                <span>Recent searches</span>
                <button onClick={clearHistory} className="clear-history-button">
                  Clear
                </button>
              </div>
              {searchHistory.map((historyItem, index) => (
                <button
                  key={`history-${index}`}
                  className={`suggestion-item ${(suggestions.length + index) === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSuggestionSelect(historyItem)}
                >
                  <Clock size={14} className="suggestion-icon history-icon" />
                  <span className="suggestion-text">{historyItem}</span>
                </button>
              ))}
            </div>
          )}
          
          {!loading && suggestions.length === 0 && searchHistory.length === 0 && query.trim().length >= 2 && (
            <div className="suggestion-item no-results">
              <span>No suggestions found</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;