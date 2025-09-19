import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import apiService from '../services/apiService';
import { useToast } from '../components/Toast/ToastProvider';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [causes, setCauses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCause, setSelectedCause] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const toast = useToast();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'causes', label: 'Causes', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ];

  const statusConfig = {
    under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
    ongoing: { label: 'Ongoing', color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
    completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  };

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [causesResponse, usersResponse] = await Promise.all([
        apiService.getAdminCauses().catch(() => ({ results: [] })),
        apiService.getAdminUsers().catch(() => ({ results: [] }))
      ]);

      setCauses(causesResponse.results || []);
      setUsers(usersResponse.results || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleApproveReject = async (cause, status) => {
    try {
      await apiService.approveRejectCause(
        cause.id, 
        status, 
        status === 'rejected' ? rejectionReason : ''
      );
      
      // Update local state
      setCauses(causes.map(c => 
        c.id === cause.id 
          ? { ...c, status, rejection_reason: status === 'rejected' ? rejectionReason : '' }
          : c
      ));

      toast.success(`Cause ${status} successfully`);
      setShowApprovalModal(false);
      setSelectedCause(null);
      setRejectionReason('');
    } catch (err) {
      console.error('Error updating cause:', err);
      toast.error('Failed to update cause');
    }
  };

  const filteredCauses = causes.filter(cause => {
    const matchesSearch = cause.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cause.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cause.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOverviewStats = () => {
    const totalCauses = causes.length;
    const pendingCauses = causes.filter(c => c.status === 'under_review').length;
    const approvedCauses = causes.filter(c => c.status === 'approved' || c.status === 'ongoing').length;
    const totalUsers = users.length;
    const totalRaised = causes.reduce((sum, cause) => sum + parseFloat(cause.current_amount || 0), 0);

    return { totalCauses, pendingCauses, approvedCauses, totalUsers, totalRaised };
  };

  const stats = getOverviewStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage causes, users, and platform analytics</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Causes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCauses}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingCauses}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
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
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {causes.slice(0, 5).map((cause) => (
                  <div key={cause.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <img
                        src={cause.cover_image || '/api/placeholder/50/50'}
                        alt={cause.name}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{cause.name}</p>
                        <p className="text-sm text-gray-500">
                          Created {new Date(cause.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[cause.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {statusConfig[cause.status]?.label || cause.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Causes Tab */}
        {activeTab === 'causes' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search causes..."
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
            <div className="space-y-4">
              {filteredCauses.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Causes Found</h3>
                  <p className="text-gray-600">No causes match your current filters.</p>
                </div>
              ) : (
                filteredCauses.map((cause) => {
                  const StatusIcon = statusConfig[cause.status]?.icon || AlertTriangle;
                  return (
                    <div key={cause.id} className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-48 h-32 lg:h-auto">
                          <img
                            src={cause.cover_image || '/api/placeholder/300/200'}
                            alt={cause.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

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
                              {cause.status === 'under_review' && (
                                <>
                                  <button
                                    onClick={() => handleApproveReject(cause, 'approved')}
                                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Approve"
                                  >
                                    <Check className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedCause(cause);
                                      setShowApprovalModal(true);
                                    }}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Reject"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                              <button
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-2">{cause.description}</p>

                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>
                              Target: ${parseFloat(cause.target_amount || 0).toLocaleString()}
                            </span>
                            <span>
                              Raised: ${parseFloat(cause.current_amount || 0).toLocaleString()}
                            </span>
                            <span>Created {new Date(cause.created_at).toLocaleDateString()}</span>
                          </div>

                          {cause.rejection_reason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-800">
                                <strong>Rejection Reason:</strong> {cause.rejection_reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.slice(0, 10).map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.first_name?.[0] || user.email?.[0] || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : user.email
                              }
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.date_joined || user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Disable
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cause Status Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const count = causes.filter(c => c.status === status).length;
                    const percentage = causes.length > 0 ? (count / causes.length) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{config.label}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="h-2 rounded-full bg-blue-600"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approval Rate</span>
                    <span className="text-lg font-semibold text-green-600">
                      {causes.length > 0 
                        ? Math.round((stats.approvedCauses / causes.length) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Funding</span>
                    <span className="text-lg font-semibold text-blue-600">
                      ${causes.length > 0 
                        ? Math.round(stats.totalRaised / causes.length)
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">User Growth</span>
                    <span className="text-lg font-semibold text-purple-600">+12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showApprovalModal && selectedCause && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reject Cause: {selectedCause.name}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Explain why this cause is being rejected..."
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedCause(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproveReject(selectedCause, 'rejected')}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reject Cause
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;