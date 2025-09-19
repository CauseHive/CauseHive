import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'savedCauses';

export const useSavedCauses = () => {
  const [savedCauseIds, setSavedCauseIds] = useState([]);

  // Load saved causes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSavedCauseIds(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved causes:', error);
      setSavedCauseIds([]);
    }
  }, []);

  // Save to localStorage whenever savedCauseIds changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCauseIds));
    } catch (error) {
      console.error('Error saving causes to localStorage:', error);
    }
  }, [savedCauseIds]);

  // Check if a cause is saved
  const isCauseSaved = useCallback((causeId) => {
    return savedCauseIds.includes(causeId);
  }, [savedCauseIds]);

  // Toggle save status of a cause
  const toggleSavedCause = useCallback((causeId) => {
    setSavedCauseIds(prev => {
      if (prev.includes(causeId)) {
        // Remove from saved
        return prev.filter(id => id !== causeId);
      } else {
        // Add to saved
        return [...prev, causeId];
      }
    });
  }, []);

  // Add a cause to saved list
  const saveCause = useCallback((causeId) => {
    setSavedCauseIds(prev => {
      if (!prev.includes(causeId)) {
        return [...prev, causeId];
      }
      return prev;
    });
  }, []);

  // Remove a cause from saved list
  const removeSavedCause = useCallback((causeId) => {
    setSavedCauseIds(prev => prev.filter(id => id !== causeId));
  }, []);

  // Clear all saved causes
  const clearAllSaved = useCallback(() => {
    setSavedCauseIds([]);
  }, []);

  // Get count of saved causes
  const savedCount = savedCauseIds.length;

  return {
    savedCauseIds,
    savedCount,
    isCauseSaved,
    toggleSavedCause,
    saveCause,
    removeSavedCause,
    clearAllSaved,
  };
};

export default useSavedCauses;