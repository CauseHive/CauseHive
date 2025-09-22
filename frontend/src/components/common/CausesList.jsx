import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button } from '../ui';
import { PaginationWrapper } from '../ui/pagination';
import CauseCard from './CauseCard';
import CauseCardSkeleton from './CauseCardSkeleton';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';
import apiService from '../../services/apiService';

/**
 * Modern Causes List Component
 * Enterprise-grade with search, filtering, and pagination
 */
const CausesList = ({ 
  className,
  title = "Featured Causes",
  subtitle = "Support causes that matter to you",
  showSearch = true,
  showFilters = true,
  pageSize = 12,
  viewMode = "grid" // "grid" | "list"
}) => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // "recent" | "funded" | "urgent"

  // Fetch causes data
  const fetchCauses = useCallback(async (page = 1, search = '', category = 'all', sort = 'recent') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      
      if (search) params.append('search', search);
      if (category !== 'all') params.append('category', category);
      if (sort) params.append('ordering', sort === 'recent' ? '-created_at' : sort === 'funded' ? '-amount_raised' : 'target_amount');
      
      const response = await apiService.get(`/causes/list/?${params.toString()}`);
      
      if (response.results) {
        setCauses(response.results);
        setTotalPages(Math.ceil(response.count / pageSize));
      } else {
        setCauses([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching causes:', err);
      setError('Failed to load causes. Please try again.');
      setCauses([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // Initial load
  useEffect(() => {
    fetchCauses(currentPage, searchQuery, selectedCategory, sortBy);
  }, [currentPage, searchQuery, selectedCategory, sortBy, pageSize]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchCauses(1, searchQuery, selectedCategory, sortBy);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Causes' },
    { value: 'medical', label: 'Medical' },
    { value: 'education', label: 'Education' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'community', label: 'Community' },
    { value: 'environment', label: 'Environment' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'funded', label: 'Most Funded' },
    { value: 'urgent', label: 'Most Urgent' },
  ];

  return (
    <div className={cn("w-full space-y-8", className)}>
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-display font-bold text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search causes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="text-sm text-muted-foreground">
          Showing {causes.length} of {totalPages * pageSize} causes
          {searchQuery && ` for "${searchQuery}"`}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          <CauseCardSkeleton count={pageSize} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-destructive text-lg font-medium">{error}</div>
          <Button 
            variant="outline" 
            onClick={() => fetchCauses(currentPage, searchQuery, selectedCategory, sortBy)}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && causes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-lg font-medium text-foreground mb-2">No causes found</div>
          <div className="text-muted-foreground mb-4">
            {searchQuery ? `No causes match "${searchQuery}"` : 'No causes available at the moment'}
          </div>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Causes Grid */}
      {!loading && !error && causes.length > 0 && (
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1 max-w-4xl mx-auto"
        )}>
          {causes.map((cause, index) => (
            <CauseCard
              key={cause.id || index}
              cause={cause}
              variant={index === 0 ? "featured" : "default"}
              className={viewMode === "list" ? "flex flex-row" : ""}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <PaginationWrapper
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CausesList;