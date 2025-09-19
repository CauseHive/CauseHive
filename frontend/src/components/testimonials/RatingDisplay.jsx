import React from 'react';
import { Star } from 'lucide-react';

const RatingDisplay = ({ 
  rating, 
  size = 'default', 
  showText = true, 
  interactive = false, 
  onRatingChange = null 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6'
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Stars */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${
              interactive 
                ? 'cursor-pointer hover:text-yellow-400 transition-colors' 
                : ''
            }`}
            onClick={() => handleStarClick(star)}
          />
        ))}
      </div>
      
      {/* Rating Text */}
      {showText && (
        <span className="text-sm text-gray-600 ml-2">
          {rating > 0 ? `${rating}/5` : 'No rating'}
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;