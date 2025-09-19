import React, { createContext, useContext, useState, useCallback } from 'react';
import apiService from '../services/apiService';

const TestimonialsContext = createContext();

export const useTestimonials = () => {
  const context = useContext(TestimonialsContext);
  if (!context) {
    throw new Error('useTestimonials must be used within a TestimonialsProvider');
  }
  return context;
};

export const TestimonialsProvider = ({ children }) => {
  const [testimonials, setTestimonials] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const [stats, setStats] = useState({});

  // Get testimonials for a specific cause
  const getTestimonials = useCallback(async (causeId, params = {}) => {
    const key = `cause_${causeId}`;
    setLoading(prev => ({ ...prev, [key]: true }));
    setError(prev => ({ ...prev, [key]: null }));

    try {
      const response = await apiService.getTestimonials(causeId, params);
      setTestimonials(prev => ({
        ...prev,
        [key]: response.results || response
      }));
      return response;
    } catch (err) {
      setError(prev => ({ ...prev, [key]: err.message }));
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  // Get testimonial statistics for a cause
  const getTestimonialStats = useCallback(async (causeId) => {
    const key = `stats_${causeId}`;
    setLoading(prev => ({ ...prev, [key]: true }));
    setError(prev => ({ ...prev, [key]: null }));

    try {
      const response = await apiService.getTestimonialStats(causeId);
      setStats(prev => ({
        ...prev,
        [causeId]: response
      }));
      return response;
    } catch (err) {
      setError(prev => ({ ...prev, [key]: err.message }));
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  // Create a new testimonial
  const createTestimonial = useCallback(async (testimonialData) => {
    try {
      const response = await apiService.createTestimonial(testimonialData);
      
      // Update the local testimonials state
      const causeKey = `cause_${testimonialData.cause_id}`;
      setTestimonials(prev => ({
        ...prev,
        [causeKey]: [response, ...(prev[causeKey] || [])]
      }));

      // Update stats if available
      if (stats[testimonialData.cause_id]) {
        setStats(prev => ({
          ...prev,
          [testimonialData.cause_id]: {
            ...prev[testimonialData.cause_id],
            total_reviews: (prev[testimonialData.cause_id].total_reviews || 0) + 1,
            average_rating: calculateNewAverage(
              prev[testimonialData.cause_id].average_rating || 0,
              prev[testimonialData.cause_id].total_reviews || 0,
              testimonialData.rating
            )
          }
        }));
      }

      return response;
    } catch (err) {
      throw err;
    }
  }, [stats]);

  // Update an existing testimonial
  const updateTestimonial = useCallback(async (testimonialId, testimonialData) => {
    try {
      const response = await apiService.updateTestimonial(testimonialId, testimonialData);
      
      // Update the local testimonials state
      setTestimonials(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => {
          if (key.startsWith('cause_')) {
            newState[key] = newState[key].map(t => 
              t.id === testimonialId ? { ...t, ...response } : t
            );
          }
        });
        return newState;
      });

      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  // Delete a testimonial
  const deleteTestimonial = useCallback(async (testimonialId, causeId) => {
    try {
      await apiService.deleteTestimonial(testimonialId);
      
      // Remove from local state
      const causeKey = `cause_${causeId}`;
      setTestimonials(prev => ({
        ...prev,
        [causeKey]: (prev[causeKey] || []).filter(t => t.id !== testimonialId)
      }));

      // Update stats
      if (stats[causeId]) {
        setStats(prev => ({
          ...prev,
          [causeId]: {
            ...prev[causeId],
            total_reviews: Math.max(0, (prev[causeId].total_reviews || 1) - 1)
          }
        }));
      }

      return true;
    } catch (err) {
      throw err;
    }
  }, [stats]);

  // Like/unlike a testimonial
  const likeTestimonial = useCallback(async (testimonialId) => {
    try {
      const response = await apiService.likeTestimonial(testimonialId);
      
      // Update the local testimonials state
      setTestimonials(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => {
          if (key.startsWith('cause_')) {
            newState[key] = newState[key].map(t => {
              if (t.id === testimonialId) {
                return {
                  ...t,
                  is_liked: !t.is_liked,
                  likes_count: t.is_liked 
                    ? t.likes_count - 1 
                    : t.likes_count + 1
                };
              }
              return t;
            });
          }
        });
        return newState;
      });

      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  // Get user's own testimonials
  const getUserTestimonials = useCallback(async (page = 1) => {
    const key = 'user_testimonials';
    setLoading(prev => ({ ...prev, [key]: true }));
    setError(prev => ({ ...prev, [key]: null }));

    try {
      const response = await apiService.getUserTestimonials(page);
      setTestimonials(prev => ({
        ...prev,
        [key]: response.results || response
      }));
      return response;
    } catch (err) {
      setError(prev => ({ ...prev, [key]: err.message }));
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  // Helper function to calculate new average rating
  const calculateNewAverage = (currentAvg, currentCount, newRating) => {
    if (currentCount === 0) return newRating;
    const totalRating = currentAvg * currentCount + newRating;
    return totalRating / (currentCount + 1);
  };

  // Clear testimonials for a specific cause
  const clearTestimonials = useCallback((causeId) => {
    const key = `cause_${causeId}`;
    setTestimonials(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    setError(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    setLoading(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const value = {
    testimonials,
    loading,
    error,
    stats,
    getTestimonials,
    getTestimonialStats,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    likeTestimonial,
    getUserTestimonials,
    clearTestimonials
  };

  return (
    <TestimonialsContext.Provider value={value}>
      {children}
    </TestimonialsContext.Provider>
  );
};

export default TestimonialsContext;