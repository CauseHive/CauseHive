import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Heart, Users, DollarSign, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonated: 0,
    causesSupported: 0,
    impactScore: 0,
    recentDonations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you'd fetch this from the API
        // For now, using mock data that would come from the backend
        const mockStats = {
          totalDonated: 425.00,
          causesSupported: 12,
          impactScore: 98,
          recentDonations: [
            { id: 1, cause: 'Clean Water Initiative', amount: 50, date: '2025-09-15' },
            { id: 2, cause: 'Education for All', amount: 100, date: '2025-09-10' },
            { id: 3, cause: 'Food Security Program', amount: 75, date: '2025-09-05' }
          ]
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-neutral-600">
            Here's your impact summary and recent activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">Total Donated</h3>
            <p className="text-2xl font-bold text-neutral-900">
              ${stats.totalDonated.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-2">+15% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary-50 rounded-lg">
                <Heart className="h-6 w-6 text-secondary-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">Causes Supported</h3>
            <p className="text-2xl font-bold text-neutral-900">{stats.causesSupported}</p>
            <p className="text-xs text-green-600 mt-2">+3 new this month</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-accent-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">Impact Score</h3>
            <p className="text-2xl font-bold text-neutral-900">{stats.impactScore}</p>
            <p className="text-xs text-green-600 mt-2">Excellent impact!</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Donations */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900">Recent Donations</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {stats.recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{donation.cause}</p>
                      <p className="text-sm text-neutral-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(donation.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">
                    +${donation.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 group-hover:bg-primary-200 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-neutral-900">Explore New Causes</p>
                    <p className="text-sm text-neutral-600">Discover causes to support</p>
                  </div>
                </div>
                <div className="text-primary-600">→</div>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-100 group-hover:bg-secondary-200 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-neutral-900">Create a Cause</p>
                    <p className="text-sm text-neutral-600">Start your own campaign</p>
                  </div>
                </div>
                <div className="text-secondary-600">→</div>
              </button>

              <Link 
                to="/my-testimonials"
                className="w-full flex items-center justify-between p-4 bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-100 group-hover:bg-accent-200 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-accent-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-neutral-900">My Reviews</p>
                    <p className="text-sm text-neutral-600">Manage your testimonials</p>
                  </div>
                </div>
                <div className="text-accent-600">→</div>
              </Link>

              <button className="w-full flex items-center justify-between p-4 bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-100 group-hover:bg-accent-200 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-accent-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-neutral-900">View My Causes</p>
                    <p className="text-sm text-neutral-600">Manage your campaigns</p>
                  </div>
                </div>
                <div className="text-accent-600">→</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;