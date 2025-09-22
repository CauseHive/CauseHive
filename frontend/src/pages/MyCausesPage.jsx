import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Target,
  DollarSign
} from 'lucide-react';
import apiService from '../services';
import { useToast } from '../components/Toast/ToastProvider';

const MyCausesPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [causeToDelete, setCauseToDelete] = useState(null);
  const { toast } = useToast();

  const statusConfig = {
    under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
    ongoing: { label: 'Ongoing', color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
    completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  };

  // Fetch user causes
  const { data: causes = [], isLoading: loading, error } = useQuery({
    queryKey: ['user-causes'],
    queryFn: () => apiService.getUserCauses(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Delete cause mutation
  const deleteCauseMutation = useMutation({
    mutationFn: (causeId) => apiService.deleteCause(causeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-causes'] });
      toast.success('Cause deleted successfully');
      setShowDeleteModal(false);
      setCauseToDelete(null);
    },
    onError: (error) => {
      toast.error('Failed to delete cause. Please try again.');
      console.error('Error deleting cause:', error);
    },
  });

  const handleDeleteCause = (causeId) => {
    deleteCauseMutation.mutate(causeId);
  };

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['user-causes'] });
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const filteredCauses = causes.filter(cause => {
    const matchesSearch = cause.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cause.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cause.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatsData = () => {
    const totalCauses = causes.length;
    const totalRaised = causes.reduce((sum, cause) => sum + parseFloat(cause.current_amount || 0), 0);
    const activeCauses = causes.filter(cause => ['ongoing', 'approved'].includes(cause.status)).length;
    const completedCauses = causes.filter(cause => cause.status === 'completed').length;

    return { totalCauses, totalRaised, activeCauses, completedCauses };
  };

  const stats = getStatsData();

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Causes</h1>
            <p className="text-gray-600">Manage and track your created causes</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Causes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCauses}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalRaised.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Causes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCauses}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCauses}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your causes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
              >
                <option value="all">All Statuses</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Causes List */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Causes</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredCauses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {causes.length === 0 ? 'No Causes Created Yet' : 'No Causes Match Your Filter'}
            </h3>
            <p className="text-gray-600 mb-6">
              {causes.length === 0 
                ? 'Start making a difference by creating your first cause.' 
                : 'Try adjusting your search terms or filters.'}
            </p>
            {causes.length === 0 && (
              <Link
                to="/causes/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Cause
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCauses.map((cause) => {
              const StatusIcon = statusConfig[cause.status]?.icon || AlertCircle;
              const progressPercentage = getProgressPercentage(cause.current_amount, cause.target_amount);

              return (
                <div key={cause.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    <div className="lg:w-48 h-32 lg:h-auto">
                      <img
                        src={cause.cover_image || '/api/placeholder/300/200'}
                        alt={cause.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{cause.name}</h3>
                          <div className="flex items-center mb-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[cause.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                              <StatusIcon className="h-4 w-4 mr-1" />
                              {statusConfig[cause.status]?.label || cause.status}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                          <Link
                            to={`/causes/${cause.id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Cause"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/edit-cause/${cause.id}`}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Cause"
                          >
                            <Edit3 className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => {
                              setCauseToDelete(cause);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Cause"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{cause.description}</p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            ${parseFloat(cause.current_amount || 0).toLocaleString()} raised
                          </span>
                          <span className="text-sm text-gray-600">
                            ${parseFloat(cause.target_amount || 0).toLocaleString()} goal
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-sm font-medium text-gray-900">
                            {progressPercentage.toFixed(1)}% complete
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Created {new Date(cause.created_at).toLocaleDateString()}</span>
                        {cause.rejection_reason && (
                          <span className="text-red-600 font-medium">Reason: {cause.rejection_reason}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && causeToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Cause</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{causeToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCauseToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCause(causeToDelete.id)}
                  disabled={deleteCauseMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleteCauseMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCausesPage;