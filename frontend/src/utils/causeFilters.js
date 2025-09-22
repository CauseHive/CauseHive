// Utility functions for filtering and sorting causes

export const getProgressPercentage = (cause) => {
  const current = cause.current_amount || cause.raisedAmount || 0;
  const target = cause.target_amount || cause.targetAmount || 1;
  return Math.min((current / target) * 100, 100);
};

export const filterCauses = (causes, filters) => {
  if (!causes || causes.length === 0) {
    return [];
  }

  return causes.filter(cause => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableContent = [
        cause.name || cause.title || '',
        cause.description || '',
        cause.organizer_name || '',
        cause.category || ''
      ].join(' ').toLowerCase();
      
      if (!searchableContent.includes(searchTerm)) {
        return false;
      }
    }

    // Multiple categories filter (new)
    if (filters.categories && filters.categories.length > 0) {
      const causeCategory = (cause.category || '').toLowerCase().replace(/\s+/g, '-');
      if (!filters.categories.includes(causeCategory)) {
        return false;
      }
    }

    // Legacy single category filter (keep for backward compatibility)
    if (filters.category && filters.category !== 'all') {
      const causeCategory = (cause.category || '').toLowerCase().replace(/\s+/g, '-');
      if (causeCategory !== filters.category) {
        return false;
      }
    }

    // Multiple locations filter (new)
    if (filters.locations && filters.locations.length > 0) {
      const causeLocation = (cause.location || '').toLowerCase().replace(/\s+/g, '-');
      if (!filters.locations.includes(causeLocation)) {
        return false;
      }
    }

    // Legacy single location filter (keep for backward compatibility)
    if (filters.location && filters.location !== 'all') {
      const causeLocation = (cause.location || '').toLowerCase().replace(/\s+/g, '-');
      if (causeLocation !== filters.location) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      const causeStatus = (cause.status || '').toLowerCase();
      if (causeStatus !== filters.status) {
        return false;
      }
    }

    // Urgency filter
    if (filters.urgency && filters.urgency !== 'all') {
      const causeUrgency = (cause.urgency || '').toLowerCase();
      if (causeUrgency !== filters.urgency) {
        return false;
      }
    }

    // Target amount range filter
    if (filters.minTarget || filters.maxTarget) {
      const targetAmount = cause.target_amount || cause.targetAmount || 0;
      
      if (filters.minTarget && targetAmount < parseFloat(filters.minTarget)) {
        return false;
      }
      
      if (filters.maxTarget && targetAmount > parseFloat(filters.maxTarget)) {
        return false;
      }
    }

    // Date range filter (new)
    if (filters.startDate || filters.endDate) {
      const causeDeadline = new Date(cause.deadline || cause.end_date || '2099-12-31');
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        if (causeDeadline < startDate) {
          return false;
        }
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        if (causeDeadline > endDate) {
          return false;
        }
      }
    }

    // Progress range filter (new)
    if (filters.minProgress !== undefined || filters.maxProgress !== undefined) {
      const progress = getProgressPercentage(cause);
      
      if (filters.minProgress !== undefined && progress < filters.minProgress) {
        return false;
      }
      
      if (filters.maxProgress !== undefined && progress > filters.maxProgress) {
        return false;
      }
    }

    return true;
  });
};

export const sortCauses = (causes, sortBy) => {
  if (!causes || causes.length === 0) {
    return [];
  }

  const sortedCauses = [...causes];

  switch (sortBy) {
    case 'newest':
      return sortedCauses.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB - dateA;
      });

    case 'oldest':
      return sortedCauses.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateA - dateB;
      });

    case 'target-high':
      return sortedCauses.sort((a, b) => {
        const targetA = a.target_amount || a.targetAmount || 0;
        const targetB = b.target_amount || b.targetAmount || 0;
        return targetB - targetA;
      });

    case 'target-low':
      return sortedCauses.sort((a, b) => {
        const targetA = a.target_amount || a.targetAmount || 0;
        const targetB = b.target_amount || b.targetAmount || 0;
        return targetA - targetB;
      });

    case 'progress-high':
      return sortedCauses.sort((a, b) => {
        const progressA = getProgressPercentage(a);
        const progressB = getProgressPercentage(b);
        return progressB - progressA;
      });

    case 'progress-low':
      return sortedCauses.sort((a, b) => {
        const progressA = getProgressPercentage(a);
        const progressB = getProgressPercentage(b);
        return progressA - progressB;
      });

    case 'deadline-soon':
      return sortedCauses.sort((a, b) => {
        const deadlineA = new Date(a.deadline || a.end_date || '2099-12-31');
        const deadlineB = new Date(b.deadline || b.end_date || '2099-12-31');
        return deadlineA - deadlineB;
      });

    case 'alphabetical':
      return sortedCauses.sort((a, b) => {
        const nameA = (a.name || a.title || '').toLowerCase();
        const nameB = (b.name || b.title || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });

    default:
      return sortedCauses;
  }
};

export const getActiveFiltersCount = (filters) => {
  let count = 0;
  
  if (filters.search) count++;
  if (filters.category && filters.category !== 'all') count++;
  if (filters.categories && filters.categories.length > 0) count++;
  if (filters.location && filters.location !== 'all') count++;
  if (filters.locations && filters.locations.length > 0) count++;
  if (filters.status && filters.status !== 'all') count++;
  if (filters.urgency && filters.urgency !== 'all') count++;
  if (filters.minTarget || filters.maxTarget) count++;
  if (filters.startDate || filters.endDate) count++;
  if (filters.minProgress !== 0 || filters.maxProgress !== 100) count++;
  
  return count;
};

export const getFiltersSummary = (filters) => {
  const summary = [];
  
  if (filters.search) {
    summary.push(`Search: "${filters.search}"`);
  }
  
  if (filters.categories && filters.categories.length > 0) {
    const categoryLabels = filters.categories.map(cat => cat.replace('-', ' ')).join(', ');
    summary.push(`Categories: ${categoryLabels}`);
  } else if (filters.category && filters.category !== 'all') {
    summary.push(`Category: ${filters.category.replace('-', ' ')}`);
  }
  
  if (filters.locations && filters.locations.length > 0) {
    const locationLabels = filters.locations.map(loc => loc.replace('-', ' ')).join(', ');
    summary.push(`Locations: ${locationLabels}`);
  } else if (filters.location && filters.location !== 'all') {
    summary.push(`Location: ${filters.location.replace('-', ' ')}`);
  }
  
  if (filters.status && filters.status !== 'all') {
    summary.push(`Status: ${filters.status}`);
  }
  
  if (filters.urgency && filters.urgency !== 'all') {
    summary.push(`Urgency: ${filters.urgency}`);
  }
  
  if (filters.minTarget || filters.maxTarget) {
    if (filters.minTarget && filters.maxTarget) {
      summary.push(`Amount: GH₵${filters.minTarget} - GH₵${filters.maxTarget}`);
    } else if (filters.minTarget) {
      summary.push(`Min Amount: GH₵${filters.minTarget}`);
    } else if (filters.maxTarget) {
      summary.push(`Max Amount: GH₵${filters.maxTarget}`);
    }
  }
  
  if (filters.startDate || filters.endDate) {
    if (filters.startDate && filters.endDate) {
      summary.push(`Deadline: ${filters.startDate} to ${filters.endDate}`);
    } else if (filters.endDate) {
      summary.push(`Deadline until: ${filters.endDate}`);
    }
  }
  
  if (filters.minProgress !== 0 || filters.maxProgress !== 100) {
    summary.push(`Progress: ${filters.minProgress}% - ${filters.maxProgress}%`);
  }
  
  return summary;
};

// Default filter state - updated to include new filter types
export const defaultFilters = {
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

const causeFilterUtils = {
  filterCauses,
  sortCauses,
  getProgressPercentage,
  getActiveFiltersCount,
  getFiltersSummary,
  defaultFilters
};

export default causeFilterUtils;