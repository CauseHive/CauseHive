import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, DollarSign, Heart, TrendingUp, Gift, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services';
import { Button } from '../components/ui/button';

const DonationHistoryPage = () => {
  const { isAuthenticated } = useAuth();
  const [donations, setDonations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const fetchDonations = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [donationsResponse, statsResponse] = await Promise.all([
        apiService.getDonations(currentPage),
        apiService.getDonationStatistics()
      ]);
      
      setDonations(donationsResponse.results || []);
      setStatistics(statsResponse);
      
      // Handle pagination data
      if (donationsResponse.count) {
        const pageSize = 10; // Assuming 10 items per page
        const totalPagesCalculated = Math.ceil(donationsResponse.count / pageSize);
        setTotalPages(totalPagesCalculated);
        setHasNextPage(currentPage < totalPagesCalculated);
        setHasPrevPage(currentPage > 1);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Failed to load donation history');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentPage]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your donation history and impact dashboard.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Impact Dashboard</h1>
          <p className="text-gray-600">
            Track your donations and see the difference you're making in the world.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donated</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(statistics?.total_amount || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              Making a difference
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Causes Supported</p>
                <p className="text-3xl font-bold text-gray-900">
                  {statistics?.total_donations || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <Gift className="h-4 w-4 mr-1" />
              Causes helped
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(
                    donations
                      .filter(d => new Date(d.donated_at).getMonth() === new Date().getMonth())
                      .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              Recent activity
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Donation History</h2>
          </div>

          {error && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {donations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
                <p className="text-gray-600 mb-6">
                  Start making a difference by supporting a cause you care about.
                </p>
                <a
                  href="/causes"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Explore Causes
                </a>
              </div>
            ) : (
              donations.map((donation) => (
                <div key={donation.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          Donation to Cause
                        </h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                          {donation.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(donation.donated_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(donation.status)}
                          <span className="capitalize">{donation.status}</span>
                        </div>
                        {donation.transaction_id && (
                          <div className="text-xs text-gray-500">
                            Ref: {donation.transaction_id.slice(-8)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(donation.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {donation.currency || 'USD'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {donations.length > 0 && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          {donations.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-blue-50">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  Want to make an even bigger impact?
                </div>
                <a
                  href="/causes"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Support more causes →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationHistoryPage;