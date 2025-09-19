import React, { useState } from 'react';
import { Search, Filter, X, MapPin, Tag, Calendar, Target, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useSearchAnalytics } from '../../contexts/SearchAnalyticsContext';
import DateRangeFilter from './DateRangeFilter';
import ProgressRangeFilter from './ProgressRangeFilter';
import MultipleCategoryFilter from './MultipleCategoryFilter';
import LocationMapFilter from './LocationMapFilter';
import './FilterComponents.css';

export function CauseFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  showMobileFilters,
  onToggleMobileFilters 
}) {
  const { trackFilterUsage } = useSearchAnalytics();
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    categories: true,
    location: true,
    dateRange: false,
    progress: false,
    status: true,
    urgency: true,
    targetAmount: false
  });

  // Filter options for Ghana-specific implementation
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' }
  ];

  const urgencyOptions = [
    { value: 'all', label: 'All Urgency Levels' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'target-high', label: 'Highest Target' },
    { value: 'target-low', label: 'Lowest Target' },
    { value: 'progress-high', label: 'Most Progress' },
    { value: 'progress-low', label: 'Least Progress' },
    { value: 'deadline-soon', label: 'Deadline Soon' },
    { value: 'alphabetical', label: 'A to Z' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Track filter usage in analytics
    trackFilterUsage(filterType, value);
  };

  const handleDateRangeChange = (startDate, endDate) => {
    const newFilters = { ...localFilters, startDate, endDate };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Track filter usage in analytics
    trackFilterUsage('dateRange', { startDate, endDate });
  };

  const handleProgressRangeChange = (minProgress, maxProgress) => {
    const newFilters = { ...localFilters, minProgress, maxProgress };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Track filter usage in analytics
    trackFilterUsage('progressRange', { minProgress, maxProgress });
  };

  const handleCategoriesChange = (selectedCategories) => {
    const newFilters = { ...localFilters, categories: selectedCategories };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Track filter usage in analytics
    trackFilterUsage('categories', selectedCategories);
  };

  const handleLocationChange = (selectedLocations) => {
    const newFilters = { ...localFilters, locations: selectedLocations };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Track filter usage in analytics
    trackFilterUsage('locations', selectedLocations);
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      search: '',
      category: 'all',
      categories: [],
      location: 'all',
      locations: [],
      status: 'all',
      urgency: 'all',
      sortBy: 'newest',
      minTarget: '',
      maxTarget: '',
      startDate: '',
      endDate: '',
      minProgress: 0,
      maxProgress: 100
    };
    setLocalFilters(defaultFilters);
    onClearFilters(defaultFilters);
  };

  const hasActiveFilters = () => {
    return localFilters.search ||
           localFilters.category !== 'all' ||
           (localFilters.categories && localFilters.categories.length > 0) ||
           localFilters.location !== 'all' ||
           (localFilters.locations && localFilters.locations.length > 0) ||
           localFilters.status !== 'all' ||
           localFilters.urgency !== 'all' ||
           localFilters.minTarget ||
           localFilters.maxTarget ||
           localFilters.startDate ||
           localFilters.endDate ||
           localFilters.minProgress !== 0 ||
           localFilters.maxProgress !== 100;
  };

  const CollapsibleSection = ({ title, icon, isExpanded, onToggle, children }) => (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-neutral-700">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-neutral-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );

  const FiltersContent = () => (
    <div className="space-y-4">
      {/* Search Section - Always expanded */}
      <CollapsibleSection
        title="Search Causes"
        icon={<Search className="h-4 w-4" />}
        isExpanded={expandedSections.search}
        onToggle={() => toggleSection('search')}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by title, description, or organizer..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </CollapsibleSection>

      {/* Enhanced Categories Section */}
      <CollapsibleSection
        title="Categories"
        icon={<Tag className="h-4 w-4" />}
        isExpanded={expandedSections.categories}
        onToggle={() => toggleSection('categories')}
      >
        <MultipleCategoryFilter
          selectedCategories={localFilters.categories || []}
          onCategoriesChange={handleCategoriesChange}
          onClear={() => handleCategoriesChange([])}
        />
      </CollapsibleSection>

      {/* Enhanced Location Section */}
      <CollapsibleSection
        title="Location (Ghana Regions)"
        icon={<MapPin className="h-4 w-4" />}
        isExpanded={expandedSections.location}
        onToggle={() => toggleSection('location')}
      >
        <LocationMapFilter
          selectedLocation={localFilters.locations || []}
          onLocationChange={handleLocationChange}
          onClear={() => handleLocationChange([])}
        />
      </CollapsibleSection>

      {/* Date Range Section */}
      <CollapsibleSection
        title="Campaign Deadline"
        icon={<Calendar className="h-4 w-4" />}
        isExpanded={expandedSections.dateRange}
        onToggle={() => toggleSection('dateRange')}
      >
        <DateRangeFilter
          startDate={localFilters.startDate}
          endDate={localFilters.endDate}
          onDateRangeChange={handleDateRangeChange}
          onClear={() => handleDateRangeChange('', '')}
        />
      </CollapsibleSection>

      {/* Progress Range Section */}
      <CollapsibleSection
        title="Funding Progress"
        icon={<Target className="h-4 w-4" />}
        isExpanded={expandedSections.progress}
        onToggle={() => toggleSection('progress')}
      >
        <ProgressRangeFilter
          minProgress={localFilters.minProgress || 0}
          maxProgress={localFilters.maxProgress || 100}
          onProgressRangeChange={handleProgressRangeChange}
          onClear={() => handleProgressRangeChange(0, 100)}
        />
      </CollapsibleSection>

      {/* Status Filter */}
      <CollapsibleSection
        title="Campaign Status"
        icon={<Calendar className="h-4 w-4" />}
        isExpanded={expandedSections.status}
        onToggle={() => toggleSection('status')}
      >
        <select
          value={localFilters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </CollapsibleSection>

      {/* Urgency Filter */}
      <CollapsibleSection
        title="Urgency Level"
        icon={<Target className="h-4 w-4" />}
        isExpanded={expandedSections.urgency}
        onToggle={() => toggleSection('urgency')}
      >
        <select
          value={localFilters.urgency}
          onChange={(e) => handleFilterChange('urgency', e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {urgencyOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </CollapsibleSection>

      {/* Target Amount Range */}
      <CollapsibleSection
        title="Target Amount Range"
        icon={<Target className="h-4 w-4" />}
        isExpanded={expandedSections.targetAmount}
        onToggle={() => toggleSection('targetAmount')}
      >
        <div className="space-y-2">
          <label className="block text-sm text-neutral-600">Amount Range (GH₵)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={localFilters.minTarget}
              onChange={(e) => handleFilterChange('minTarget', e.target.value)}
              placeholder="Min amount"
              className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="number"
              value={localFilters.maxTarget}
              onChange={(e) => handleFilterChange('maxTarget', e.target.value)}
              placeholder="Max amount"
              className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Sort By */}
      <div className="bg-neutral-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Sort By
        </label>
        <select
          value={localFilters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters() && (
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-full gap-2 border-red-300 text-red-600 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={onToggleMobileFilters}
          variant="outline"
          className="w-full gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters {hasActiveFilters() && '(Active)'}
        </Button>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button
                onClick={onToggleMobileFilters}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <FiltersContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters Sidebar */}
      <Card className="hidden lg:block">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h3 className="font-semibold">Filters</h3>
            {hasActiveFilters() && (
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
          <FiltersContent />
        </CardContent>
      </Card>
    </>
  );
}

export default CauseFilters;