import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, Clock, Users, ChevronLeft, ChevronRight, Grid, List, SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import apiService from '../services';
import DonationModal from '../components/DonationModal';
import { useSavedCauses } from '../contexts/SavedCausesContext';
import { useToast } from '../components/Toast/ToastProvider';
import CauseFilters from '../components/filters/CauseFilters';
import { Input } from '../components/ui/input';
import { filterCauses, sortCauses, getActiveFiltersCount, getFiltersSummary, defaultFilters } from '../utils/causeFilters';

const CausesListPage = () => {
  const toast = useToast();
  const { isCauseSaved, toggleSavedCause } = useSavedCauses();
  
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedCause, setSelectedCause] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');

  const ITEMS_PER_PAGE = 12;

  const fetchCauses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getCausesList(currentPage);
      setCauses(response.results || response);
      setTotalPages(Math.ceil((response.count || response.length) / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Failed to load causes. Please try again.');
      console.error('Error fetching causes:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, ITEMS_PER_PAGE]);

  useEffect(() => {
    fetchCauses();
  }, [fetchCauses]);

  // Apply filters and sorting to causes
  const processedCauses = React.useMemo(() => {
    let filtered = filterCauses(causes, filters);
    
    // Apply search query if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cause => 
        (cause.name && cause.name.toLowerCase().includes(query)) ||
        (cause.title && cause.title.toLowerCase().includes(query)) ||
        (cause.description && cause.description.toLowerCase().includes(query)) ||
        (cause.organizer_name && cause.organizer_name.toLowerCase().includes(query)) ||
        (cause.category && cause.category.toLowerCase().includes(query)) ||
        (cause.location && cause.location.toLowerCase().includes(query))
      );
    }
    
    const sorted = sortCauses(filtered, filters.sortBy);
    return sorted;
  }, [causes, filters, searchQuery]);

  // Pagination for filtered results
  const paginatedCauses = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return processedCauses.slice(startIndex, endIndex);
  }, [processedCauses, currentPage, ITEMS_PER_PAGE]);

  // Update total pages based on filtered results
  React.useEffect(() => {
    const newTotalPages = Math.ceil(processedCauses.length / ITEMS_PER_PAGE);
    setTotalPages(newTotalPages);
    
    // Reset to page 1 if current page is beyond available pages
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [processedCauses.length, currentPage, ITEMS_PER_PAGE]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handleToggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDonateClick = (cause, event) => {
    event.preventDefault(); // Prevent navigation to detail page
    event.stopPropagation();
    setSelectedCause(cause);
    setDonationModalOpen(true);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      approved: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-2 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCauses}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b -mx-4 lg:-mx-8 mb-6">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Causes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Find meaningful causes to support and make a difference in your community and beyond.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search causes, organizers, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle Bar */}
          <div className="lg:hidden mb-6">
            <button
              onClick={handleToggleMobileFilters}
              className="w-full flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Filters</span>
                {getActiveFiltersCount(filters) > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {getActiveFiltersCount(filters)}
                  </span>
                )}
              </div>
              <div className={`transform transition-transform duration-300 ${showMobileFilters ? 'rotate-180' : ''}`}>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
              <CauseFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                showMobileFilters={false}
                onToggleMobileFilters={handleToggleMobileFilters}
              />
            </div>

            {/* Mobile Filters Collapse */}
            {showMobileFilters && (
              <div className="lg:hidden">
                <div className="bg-white rounded-lg shadow-lg border overflow-hidden transition-all duration-300 ease-in-out">
                  <CauseFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                    showMobileFilters={showMobileFilters}
                    onToggleMobileFilters={handleToggleMobileFilters}
                  />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {processedCauses.length} {processedCauses.length === 1 ? 'cause' : 'causes'} found
                    {searchQuery && (
                      <span className="text-gray-600 font-normal"> for "{searchQuery}"</span>
                    )}
                  </h2>
                  {(getActiveFiltersCount(filters) > 0 || searchQuery) && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {searchQuery && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Search: {searchQuery}
                            <button
                              onClick={() => setSearchQuery('')}
                              className="ml-1 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {getFiltersSummary(filters).map((summary, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {summary}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-blue-100 text-blue-700 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-700 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Spacer */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0"></div>

          {/* Causes Content - Properly Centered */}
          <div className="flex-1 min-w-0 w-full">
            {processedCauses.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No causes found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? `No causes found matching "${searchQuery}".`
                    : "No causes match your current filters."
                  }
                </p>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters to find more causes.
                </p>
                {(searchQuery || getActiveFiltersCount(filters) > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters(defaultFilters);
                      setCurrentPage(1);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear all filters and search
                  </button>
                )}
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                    {paginatedCauses.map(cause => (
              <Link
                key={cause.id}
                to={`/causes/${cause.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group w-full"
              >
                {/* Cause Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden">
                  {cause.cover_image ? (
                    <img
                      src={cause.cover_image}
                      alt={cause.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {getStatusBadge(cause.status)}
                  </div>
                  <div className="absolute top-4 left-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSavedCause(cause.id);
                        toast.success(
                          isCauseSaved(cause.id) 
                            ? 'Cause removed from saved list' 
                            : 'Cause saved!'
                        );
                      }}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        isCauseSaved(cause.id)
                          ? 'bg-red-500 text-white shadow-lg scale-110'
                          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110'
                      }`}
                      title={isCauseSaved(cause.id) ? 'Remove from saved' : 'Save cause'}
                    >
                      <Heart 
                        size={16} 
                        className={isCauseSaved(cause.id) ? 'fill-current' : ''} 
                      />
                    </button>
                  </div>
                </div>

                {/* Cause Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {cause.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {cause.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(getProgressPercentage(cause.current_amount, cause.target_amount))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(cause.current_amount, cause.target_amount)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Amount Information */}
                  <div className="flex justify-between items-center text-sm mb-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 truncate">
                        {formatAmount(cause.current_amount)}
                      </div>
                      <div className="text-gray-500 text-xs truncate">
                        raised of {formatAmount(cause.target_amount)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="flex items-center text-gray-500">
                        <Target className="h-4 w-4 mr-1" />
                        <span className="text-xs">Goal</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center min-w-0 flex-1">
                        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{new Date(cause.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center flex-shrink-0 ml-2">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                    </div>
                    
                    {/* Quick Donate Button */}
                    <button
                      onClick={(e) => handleDonateClick(cause, e)}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                    >
                      Quick Donate
                    </button>
                  </div>
                </div>
              </Link>
                ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedCauses.map(cause => (
                      <Link
                        key={cause.id}
                        to={`/causes/${cause.id}`}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group block"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Cause Image */}
                          <div className="relative md:w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden flex-shrink-0">
                            {cause.cover_image ? (
                              <img
                                src={cause.cover_image}
                                alt={cause.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Target className="h-12 w-12 text-white opacity-70" />
                              </div>
                            )}
                          </div>

                          {/* Cause Details */}
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {cause.name || cause.title}
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleSavedCause(cause.id);
                                }}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <Heart 
                                  className={`h-5 w-5 transition-colors ${
                                    isCauseSaved(cause.id) 
                                      ? 'fill-red-500 text-red-500' 
                                      : 'text-gray-400 hover:text-red-500'
                                  }`} 
                                />
                              </button>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {cause.description}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{cause.organizer_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{new Date(cause.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                              {getStatusBadge(cause.status)}
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{getProgressPercentage(cause.current_amount, cause.target_amount)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${getProgressPercentage(cause.current_amount, cause.target_amount)}%`
                                  }}
                                ></div>
                              </div>
                            </div>

                            {/* Amount Info and Donate Button */}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-lg font-bold text-gray-900">
                                  {formatAmount(cause.current_amount || 0)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  of {formatAmount(cause.target_amount)} goal
                                </div>
                              </div>
                              <button
                                onClick={(e) => handleDonateClick(cause, e)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                Donate Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pagination - Centered */}
      {totalPages > 1 && (
        <div className="pb-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'border border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        cause={selectedCause}
      />
    </div>
  );
};

export default CausesListPage;