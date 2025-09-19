import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Users, TrendingUp } from 'lucide-react';
import TestimonialCard from './TestimonialCard';
import TestimonialForm from './TestimonialForm';
import RatingDisplay from './RatingDisplay';

const TestimonialsList = ({ 
  causeId, 
  currentUserId = null,
  onTestimonialSubmit,
  onTestimonialLike 
}) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest_rated

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock testimonials data
        const mockTestimonials = [
          {
            id: 1,
            user_name: "Sarah Johnson",
            user_avatar: null,
            rating: 5,
            review_text: "Amazing cause! I'm so glad I could contribute to helping local families. The transparency in how funds are used is excellent.",
            created_at: "2024-01-15T10:30:00Z",
            likes_count: 12,
            is_liked: false,
            is_verified_donation: true
          },
          {
            id: 2,
            user_name: "Michael Chen",
            user_avatar: null,
            rating: 4,
            review_text: "Great initiative. I've seen the positive impact firsthand in my community. Keep up the good work!",
            created_at: "2024-01-10T14:20:00Z",
            likes_count: 8,
            is_liked: true,
            is_verified_donation: true
          },
          {
            id: 3,
            user_name: "Emma Davis",
            user_avatar: null,
            rating: 5,
            review_text: "This cause changed lives in our neighborhood. Highly recommend supporting!",
            created_at: "2024-01-08T09:15:00Z",
            likes_count: 15,
            is_liked: false,
            is_verified_donation: false
          }
        ];
        
        setTestimonials(mockTestimonials);
      } catch (err) {
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [causeId]);

  const handleSubmitTestimonial = async (testimonialData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new testimonial object
      const newTestimonial = {
        id: Date.now(), // Mock ID
        user_name: "Current User", // Would come from auth context
        user_avatar: null,
        rating: testimonialData.rating,
        review_text: testimonialData.review_text,
        created_at: new Date().toISOString(),
        likes_count: 0,
        is_liked: false,
        is_verified_donation: false // Would be determined by backend
      };

      // Add to testimonials list
      setTestimonials(prev => [newTestimonial, ...prev]);
      setShowForm(false);
      
      if (onTestimonialSubmit) {
        onTestimonialSubmit(newTestimonial);
      }
    } catch (error) {
      throw new Error('Failed to submit testimonial');
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
          
          {currentUserId && (
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
        {showForm && currentUserId && (
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
              currentUserId={currentUserId}
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
          {currentUserId && !showForm && (
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