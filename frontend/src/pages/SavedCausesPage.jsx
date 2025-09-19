import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSavedCauses } from '../contexts/SavedCausesContext';
import { useToast } from '../components/Toast/ToastProvider';
import apiService from '../services/apiService';
import { 
  Heart, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Calendar, 
  MapPin, 
  DollarSign,
  Trash2,
  ExternalLink,
  BookmarkX
} from 'lucide-react';

const SavedCausesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    savedCauseIds, 
    removeSavedCause, 
    clearAllSaved
  } = useSavedCauses();
  const toast = useToast();
  
  const [savedCauses, setSavedCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'name' | 'target'

  // Load saved causes from localStorage and fetch full cause details
  useEffect(() => {
    const loadSavedCauses = async () => {
      try {
        setLoading(true);
        
        if (savedCauseIds.length === 0) {
          setSavedCauses([]);
          setLoading(false);
          return;
        }

        // Fetch all causes
        const response = await apiService.getCausesList();
        const causes = Array.isArray(response) ? response : (response.results || []);
        
        // Filter to only saved causes
        const saved = causes.filter(cause => savedCauseIds.includes(cause.id));
        setSavedCauses(saved);
      } catch (error) {
        console.error('Error loading saved causes:', error);
        toast.error('Failed to load saved causes');
        setSavedCauses([]);
      } finally {
        setLoading(false);
      }
    };

    loadSavedCauses();
  }, [savedCauseIds, toast]);

  // Handle removing a saved cause
  const handleRemoveCause = (causeId) => {
    removeSavedCause(causeId);
    toast.success('Cause removed from saved list');
  };

  // Handle clearing all saved causes
  const handleClearAll = () => {
    clearAllSaved();
    toast.success('All saved causes cleared');
  };

  // Filter and sort causes
  const filteredAndSortedCauses = React.useMemo(() => {
    let filtered = savedCauses;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(cause =>
        cause.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cause.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cause.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'target':
          return (b.target_amount || 0) - (a.target_amount || 0);
        case 'recent':
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    return filtered;
  }, [savedCauses, searchQuery, sortBy]);

  // Calculate progress percentage
  const getProgress = (cause) => {
    if (!cause.target_amount) return 0;
    return Math.min(((cause.current_amount || 0) / cause.target_amount) * 100, 100);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Heart size={48} className="mx-auto text-neutral-400 mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Login Required</h2>
          <p className="text-neutral-600 mb-4">Please log in to view your saved causes</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 -mx-4 lg:-mx-8 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <Heart className="text-primary-600" size={28} />
                Saved Causes
              </h1>
              <p className="text-neutral-600 mt-1">
                {savedCauses.length} {savedCauses.length === 1 ? 'cause' : 'causes'} saved
              </p>
            </div>
            
            {savedCauses.length > 0 && (
              <div className="mt-4 sm:mt-0 flex gap-2">
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <BookmarkX size={16} />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-neutral-600">Loading saved causes...</span>
          </div>
        ) : savedCauses.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto text-neutral-400 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No Saved Causes</h3>
            <p className="text-neutral-600 mb-6">
              You haven't saved any causes yet. Browse causes and click the heart icon to save them here.
            </p>
            <Link
              to="/causes"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Search size={16} />
              Browse Causes
            </Link>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search saved causes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="recent">Recent</option>
                <option value="name">Name</option>
                <option value="target">Target Amount</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-50'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-50'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Results */}
            {filteredAndSortedCauses.length === 0 ? (
              <div className="text-center py-8">
                <Filter size={32} className="mx-auto text-neutral-400 mb-2" />
                <p className="text-neutral-600">No causes match your search criteria</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredAndSortedCauses.map((cause) => (
                  <div key={cause.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                    {/* Cause Image */}
                    <div className="aspect-video bg-neutral-200 rounded-t-xl overflow-hidden">
                      {cause.image ? (
                        <img
                          src={cause.image}
                          alt={cause.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart size={32} className="text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* Cause Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-neutral-900 text-lg leading-tight">
                          {cause.name || 'Untitled Cause'}
                        </h3>
                        <button
                          onClick={() => handleRemoveCause(cause.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {cause.description || 'No description available'}
                      </p>

                      {/* Cause Meta */}
                      <div className="space-y-2 mb-4">
                        {cause.category && (
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <Filter size={14} />
                            <span>{cause.category.name}</span>
                          </div>
                        )}
                        
                        {cause.location && (
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <MapPin size={14} />
                            <span>{cause.location}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Calendar size={14} />
                          <span>Saved {new Date(cause.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-neutral-700">
                            {formatCurrency(cause.current_amount)} raised
                          </span>
                          <span className="text-sm text-neutral-500">
                            {getProgress(cause).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgress(cause)}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-neutral-500">
                            Goal: {formatCurrency(cause.target_amount)}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {cause.donors_count || 0} {(cause.donors_count || 0) === 1 ? 'donor' : 'donors'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          to={`/causes/${cause.id}`}
                          className="flex-1 bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/causes/${cause.id}`}
                          className="flex items-center justify-center px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                          title="Donate"
                        >
                          <DollarSign size={16} />
                        </Link>
                        <a
                          href={`/causes/${cause.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SavedCausesPage;