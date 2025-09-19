import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import RatingDisplay from './RatingDisplay';

const TestimonialForm = ({ 
  causeId, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  isOpen = true 
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    if (!reviewText.trim()) {
      newErrors.reviewText = 'Please write a review';
    }
    if (reviewText.trim().length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters long';
    }
    if (reviewText.trim().length > 500) {
      newErrors.reviewText = 'Review must be less than 500 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    const testimonialData = {
      cause_id: causeId,
      rating,
      review_text: reviewText.trim()
    };

    try {
      await onSubmit(testimonialData);
      // Reset form on success
      setRating(0);
      setReviewText('');
    } catch (error) {
      setErrors({ submit: 'Failed to submit review. Please try again.' });
    }
  };

  const handleCancel = () => {
    setRating(0);
    setReviewText('');
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
        {onCancel && (
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex items-center space-x-2">
            <RatingDisplay
              rating={rating}
              size="large"
              showText={false}
              interactive={true}
              onRatingChange={setRating}
            />
            <span className="text-sm text-gray-600">
              {rating > 0 ? `${rating}/5 stars` : 'Click to rate'}
            </span>
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this cause..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              errors.reviewText ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.reviewText ? (
              <p className="text-sm text-red-600">{errors.reviewText}</p>
            ) : (
              <p className="text-sm text-gray-500">
                {reviewText.length}/500 characters
              </p>
            )}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !reviewText.trim()}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSubmitting || rating === 0 || !reviewText.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;