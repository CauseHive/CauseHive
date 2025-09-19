import React from 'react';
import { User, MessageCircle, Calendar, ThumbsUp } from 'lucide-react';
import RatingDisplay from './RatingDisplay';

const TestimonialCard = ({ testimonial, onLike = null, currentUserId = null }) => {
  const {
    id,
    user_name,
    user_avatar,
    rating,
    review_text,
    created_at,
    likes_count = 0,
    is_liked = false,
    is_verified_donation = false
  } = testimonial;

  const handleLike = () => {
    if (onLike && currentUserId) {
      onLike(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user_avatar ? (
            <img
              src={user_avatar}
              alt={user_name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {user_name}
            </h4>
            {is_verified_donation && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified Donor
              </span>
            )}
          </div>
          
          {/* Rating */}
          <div className="mb-2">
            <RatingDisplay rating={rating} size="small" showText={false} />
          </div>
          
          {/* Date */}
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(created_at)}
          </div>
        </div>
      </div>

      {/* Review Text */}
      {review_text && (
        <div className="mb-4">
          <div className="flex items-start space-x-2 mb-2">
            <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 text-sm leading-relaxed">{review_text}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          {currentUserId && (
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                is_liked
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ThumbsUp 
                className={`h-4 w-4 ${is_liked ? 'fill-current' : ''}`} 
              />
              <span>{likes_count}</span>
            </button>
          )}
          
          {!currentUserId && likes_count > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <ThumbsUp className="h-4 w-4" />
              <span>{likes_count}</span>
            </div>
          )}
        </div>

        {/* Rating Text */}
        <div className="text-xs text-gray-500">
          Rated {rating}/5 stars
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;