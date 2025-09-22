import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Users, TrendingUp } from 'lucide-react';
import TestimonialCard from './TestimonialCard';
import TestimonialForm from './TestimonialForm';
import RatingDisplay from './RatingDisplay';
import apiService from '../../services';
import { useAuth } from '../../contexts/AuthContext';

const TestimonialsList = ({ 
  causeId, 
  onTestimonialSubmit,
  onTestimonialLike 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest_rated

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const data = await apiService.get(`/api/causes/${causeId}/testimonials/`);
        setTestimonials(data);
      } catch (err) {
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    if (causeId) {
      fetchTestimonials();
    }
  }, [causeId]);

  const handleSubmitTestimonial = async (testimonialData) => {
    if (!isAuthenticated) {
      // Handle unauthenticated user
      return;
    }
    setIsSubmitting(true);
    try {
      const newTestimonial = await apiService.post(`/api/causes/${causeId}/testimonials/`, {
        ...testimonialData,
        user: user.id
      });
      
      setTestimonials(prev => [newTestimonial, ...prev]);
      setShowForm(false);
      
      if (onTestimonialSubmit) {
        onTestimonialSubmit(newTestimonial);
      }
    } catch (err) {
      setError('Failed to submit testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeTestimonial = async (testimonialId) => {
    try {
      // Optimistic update
      setTestimonials(prev => prev.map(testimonial => {
        if (testimonial.id === testimonialId) {
          return {
            ...testimonial,
            is_liked: !testimonial.is_liked,
            likes_count: testimonial.is_liked 
              ? testimonial.likes_count - 1 
              : testimonial.likes_count + 1
          };
        }
        return testimonial;
      }));

      if (onTestimonialLike) {
        onTestimonialLike(testimonialId);
      }
    } catch (error) {
      // Revert optimistic update on error
      console.error('Failed to toggle like:', error);
    }
  };

  const getSortedTestimonials = () => {
    const sorted = [...testimonials];
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'highest_rated':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  const getAverageRating = () => {
    if (testimonials.length === 0) return 0;
    const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
    return (sum / testimonials.length).toFixed(1);
  };

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    testimonials.forEach(t => {
      counts[t.rating] = (counts[t.rating] || 0) + 1;
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <MessageSquare className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const averageRating = getAverageRating();
  const ratingCounts = getRatingCounts();
  const sortedTestimonials = getSortedTestimonials();

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <span>Community Reviews</span>
          </h3>
          
          {user && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Write Review</span>
            </button>
          )}
        </div>

        {/* Statistics */}
        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Average Rating */}
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {averageRating}
              </div>
              <RatingDisplay rating={Math.round(averageRating)} size="small" showText={false} />
              <div className="text-sm text-gray-600 mt-1">Average Rating</div>
            </div>

            {/* Total Reviews */}
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {testimonials.length}
              </div>
              <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>

            {/* Top Rating Percentage */}
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {testimonials.length > 0 ? Math.round((ratingCounts[5] / testimonials.length) * 100) : 0}%
              </div>
              <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <div className="text-sm text-gray-600">5-Star Reviews</div>
            </div>
          </div>
        )}

        {/* Add Review Form */}
        {showForm && user && (
          <div className="mb-6">
            <TestimonialForm
              causeId={causeId}
              onSubmit={handleSubmitTestimonial}
              onCancel={() => setShowForm(false)}
              isSubmitting={isSubmitting}
              isOpen={showForm}
            />
          </div>
        )}
      </div>

      {/* Sort Options */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            {testimonials.length} review{testimonials.length !== 1 ? 's' : ''}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_rated">Highest Rated</option>
          </select>
        </div>
      )}

      {/* Testimonials List */}
      {sortedTestimonials.length > 0 ? (
        <div className="space-y-4">
          {sortedTestimonials.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onLike={handleLikeTestimonial}
              currentUserId={user ? user.id : null}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
          <p className="text-gray-600 mb-4">
            Be the first to share your experience with this cause!
          </p>
          {user && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write the First Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TestimonialsList;