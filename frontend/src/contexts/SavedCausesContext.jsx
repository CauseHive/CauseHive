import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Actions
const SAVED_CAUSES_ACTIONS = {
  LOAD_SAVED: 'LOAD_SAVED',
  ADD_CAUSE: 'ADD_CAUSE',
  REMOVE_CAUSE: 'REMOVE_CAUSE',
  TOGGLE_CAUSE: 'TOGGLE_CAUSE',
  CLEAR_ALL: 'CLEAR_ALL',
  SET_LOADING: 'SET_LOADING'
};

// Initial state
const initialState = {
  savedCauseIds: [],
  loading: false,
  lastUpdated: null
};

// Reducer
function savedCausesReducer(state, action) {
  switch (action.type) {
    case SAVED_CAUSES_ACTIONS.LOAD_SAVED:
      return {
        ...state,
        savedCauseIds: action.payload,
        loading: false,
        lastUpdated: new Date().toISOString()
      };

    case SAVED_CAUSES_ACTIONS.ADD_CAUSE:
      if (state.savedCauseIds.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        savedCauseIds: [...state.savedCauseIds, action.payload],
        lastUpdated: new Date().toISOString()
      };

    case SAVED_CAUSES_ACTIONS.REMOVE_CAUSE:
      return {
        ...state,
        savedCauseIds: state.savedCauseIds.filter(id => id !== action.payload),
        lastUpdated: new Date().toISOString()
      };

    case SAVED_CAUSES_ACTIONS.TOGGLE_CAUSE:
      const isCurrentlySaved = state.savedCauseIds.includes(action.payload);
      return {
        ...state,
        savedCauseIds: isCurrentlySaved
          ? state.savedCauseIds.filter(id => id !== action.payload)
          : [...state.savedCauseIds, action.payload],
        lastUpdated: new Date().toISOString()
      };

    case SAVED_CAUSES_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        savedCauseIds: [],
        lastUpdated: new Date().toISOString()
      };

    case SAVED_CAUSES_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
}

// Create context
const SavedCausesContext = createContext();

// Storage key
const STORAGE_KEY = 'causehive_saved_causes';

// Provider component
export function SavedCausesProvider({ children }) {
  const [state, dispatch] = useReducer(savedCausesReducer, initialState);

  // Load saved causes from localStorage on mount
  useEffect(() => {
    try {
      dispatch({ type: SAVED_CAUSES_ACTIONS.SET_LOADING, payload: true });
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedData = JSON.parse(saved);
        // Support both old format (array) and new format (object with metadata)
        const causeIds = Array.isArray(savedData) ? savedData : (savedData.causeIds || []);
        dispatch({ type: SAVED_CAUSES_ACTIONS.LOAD_SAVED, payload: causeIds });
      } else {
        dispatch({ type: SAVED_CAUSES_ACTIONS.LOAD_SAVED, payload: [] });
      }
    } catch (error) {
      console.error('Error loading saved causes:', error);
      dispatch({ type: SAVED_CAUSES_ACTIONS.LOAD_SAVED, payload: [] });
    }
  }, []);

  // Save to localStorage whenever saved causes change
  useEffect(() => {
    if (state.lastUpdated) {
      try {
        const dataToSave = {
          causeIds: state.savedCauseIds,
          lastUpdated: state.lastUpdated,
          version: '1.0'
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving causes to localStorage:', error);
      }
    }
  }, [state.savedCauseIds, state.lastUpdated]);

  // Action creators
  const addSavedCause = (causeId) => {
    dispatch({ type: SAVED_CAUSES_ACTIONS.ADD_CAUSE, payload: causeId });
  };

  const removeSavedCause = (causeId) => {
    dispatch({ type: SAVED_CAUSES_ACTIONS.REMOVE_CAUSE, payload: causeId });
  };

  const toggleSavedCause = (causeId) => {
    dispatch({ type: SAVED_CAUSES_ACTIONS.TOGGLE_CAUSE, payload: causeId });
  };

  const clearAllSaved = () => {
    dispatch({ type: SAVED_CAUSES_ACTIONS.CLEAR_ALL });
  };

  const isCauseSaved = (causeId) => {
    return state.savedCauseIds.includes(causeId);
  };

  // Value to provide
  const value = {
    // State
    savedCauseIds: state.savedCauseIds,
    savedCount: state.savedCauseIds.length,
    loading: state.loading,
    lastUpdated: state.lastUpdated,
    
    // Actions
    addSavedCause,
    removeSavedCause,
    toggleSavedCause,
    clearAllSaved,
    isCauseSaved,
    
    // Utilities
    hasSavedCauses: state.savedCauseIds.length > 0
  };

  return (
    <SavedCausesContext.Provider value={value}>
      {children}
    </SavedCausesContext.Provider>
  );
}

// Hook to use saved causes context
export function useSavedCauses() {
  const context = useContext(SavedCausesContext);
  if (!context) {
    throw new Error('useSavedCauses must be used within a SavedCausesProvider');
  }
  return context;
}

export default SavedCausesContext;