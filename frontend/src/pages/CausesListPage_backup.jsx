import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, Target, Clock, Users, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import apiService from '../services/apiService';
import DonationModal from '../components/DonationModal';
import { useSavedCauses } from '../contexts/SavedCausesContext';
import { useToast } from '../components/Toast/ToastProvider';
import CauseFilters from '../components/filters/CauseFilters';
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
    let sorted = sortCauses(filtered, filters.sortBy);
    return sorted;
  }, [causes, filters]);

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

  const handleClearFilters = (defaultFilters) => {
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
      <div className="min-h-screen bg-gray-50 py-8">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Causes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find meaningful causes to support and make a difference in your community and beyond.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <CauseFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                showMobileFilters={showMobileFilters}
                onToggleMobileFilters={handleToggleMobileFilters}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {processedCauses.length} {processedCauses.length === 1 ? 'cause' : 'causes'} found
                  </h2>
                  {getActiveFiltersCount(filters) > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {getFiltersSummary(filters).map((summary, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
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
                    className={`p-2 rounded-md ${
                      viewMode === 'grid' 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${
                      viewMode === 'list' 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-400 hover:text-gray-600'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Hidden mobile filters placeholder */}
          <div className="lg:w-80 flex-shrink-0 lg:block hidden"></div>

          {/* Causes Content */}
          <div className="flex-1">
            {processedCauses.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No causes found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters to find more causes.
                </p>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedCauses.map(cause => (
              <Link
                key={cause.id}
                to={`/causes/${cause.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
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
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
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
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(cause.current_amount, cause.target_amount)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Amount Information */}
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {formatAmount(cause.current_amount)}
                      </div>
                      <div className="text-gray-500">
                        raised of {formatAmount(cause.target_amount)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-gray-500">
                        <Target className="h-4 w-4 mr-1" />
                        <span className="text-xs">Goal</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(cause.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {Math.floor(Math.random() * 50) + 10} supporters
                      </div>
                    </div>
                    
                    {/* Quick Donate Button */}
                    <button
                      onClick={(e) => handleDonateClick(cause, e)}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 opacity-0 group-hover:opacity-100"
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

      {/* Pagination */}
      {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

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