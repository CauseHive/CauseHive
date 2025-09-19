import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Edit, Trash2, Calendar, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TestimonialsProvider, useTestimonials } from '../contexts/TestimonialsContext';
import { RatingDisplay } from '../components/testimonials';

const MyTestimonialsContent = () => {
  const { user } = useAuth();
  const { 
    testimonials, 
    loading, 
    error, 
    getUserTestimonials, 
    deleteTestimonial 
  } = useTestimonials();
  
  const [activeTab, setActiveTab] = useState('all');
  const [loadingDelete, setLoadingDelete] = useState({});

  useEffect(() => {
    if (user) {
      getUserTestimonials();
    }
  }, [user, getUserTestimonials]);

  const handleDeleteTestimonial = async (testimonialId, causeId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setLoadingDelete(prev => ({ ...prev, [testimonialId]: true }));
    try {
      await deleteTestimonial(testimonialId, causeId);
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setLoadingDelete(prev => ({ ...prev, [testimonialId]: false }));
    }
  };

  const userTestimonials = testimonials.user_testimonials || [];
  
  const filteredTestimonials = userTestimonials.filter(testimonial => {
    if (activeTab === 'all') return true;
    if (activeTab === 'approved') return testimonial.is_approved;
    if (activeTab === 'pending') return !testimonial.is_approved;
    return true;
  });

  if (loading.user_testimonials) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  if (error.user_testimonials) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Failed to load your reviews: {error.user_testimonials}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to="/dashboard"
            className="flex items-center text-blue-600 hover:text-blue-700 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="flex items-center space-x-3 mb-4">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
        </div>
        
        <p className="text-gray-600">
          Manage your testimonials and reviews for the causes you've supported.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Total Reviews</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{userTestimonials.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Average Rating</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {userTestimonials.length > 0 
              ? (userTestimonials.reduce((sum, t) => sum + t.rating, 0) / userTestimonials.length).toFixed(1)
              : '0.0'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Total Likes</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {userTestimonials.reduce((sum, t) => sum + (t.likes_count || 0), 0)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Reviews', count: userTestimonials.length },
              { key: 'approved', label: 'Published', count: userTestimonials.filter(t => t.is_approved).length },
              { key: 'pending', label: 'Pending', count: userTestimonials.filter(t => !t.is_approved).length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Testimonials List */}
      {filteredTestimonials.length > 0 ? (
        <div className="space-y-6">
          {filteredTestimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {testimonial.cause?.name || 'Unknown Cause'}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      testimonial.is_approved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {testimonial.is_approved ? 'Published' : 'Pending Review'}
                    </span>
                    {testimonial.is_featured && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(testimonial.created_at).toLocaleDateString()}</span>
                    </div>
                    {testimonial.likes_count > 0 && (
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{testimonial.likes_count} likes</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/my-testimonials/${testimonial.id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit review"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial.id, testimonial.cause?.id)}
                    disabled={loadingDelete[testimonial.id]}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-3">
                <RatingDisplay rating={testimonial.rating} size="default" showText={true} />
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{testimonial.review_text}</p>
              </div>

              {/* Verification */}
              {testimonial.is_verified_donation && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Heart className="h-4 w-4 fill-current" />
                  <span>Verified Donation</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activeTab === 'all' ? 'No Reviews Yet' : 
             activeTab === 'approved' ? 'No Published Reviews' : 
             'No Pending Reviews'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'all' 
              ? "You haven't written any reviews yet. Start by supporting a cause and sharing your experience!"
              : activeTab === 'approved'
              ? "None of your reviews have been published yet."
              : "You don't have any reviews pending approval."
            }
          </p>
          {activeTab === 'all' && (
            <Link
              to="/causes"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Heart className="h-5 w-5 mr-2" />
              Explore Causes
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

const MyTestimonialsPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-6">Please sign in to view your reviews.</p>
          <Link
            to="/auth/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TestimonialsProvider>
        <MyTestimonialsContent />
      </TestimonialsProvider>
    </div>
  );
};

export default MyTestimonialsPage;