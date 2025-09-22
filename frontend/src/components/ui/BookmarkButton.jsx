import React from 'react';
import { Heart } from 'lucide-react';
import { useSavedCauses } from '../../contexts/SavedCausesContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../Toast/ToastProvider';

export function BookmarkButton({ 
  causeId, 
  causeName = 'Cause',
  size = 'default',
  variant = 'ghost',
  className = '',
  showToast = true
}) {
  const { isAuthenticated } = useAuth();
  const { isCauseSaved, toggleSavedCause } = useSavedCauses();
  const toast = useToast();

  const isSaved = isCauseSaved(causeId);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      if (showToast) {
        toast.error('Please sign in to save causes');
      }
      return;
    }
    
    toggleSavedCause(causeId);
    
    if (showToast) {
      const message = isSaved 
        ? `${causeName} removed from saved` 
        : `${causeName} saved!`;
      toast.success(message);
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const variantClasses = {
    ghost: `p-2 rounded-full transition-colors ${
      isSaved 
        ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100' 
        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
    }`,
    button: `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isSaved
        ? 'bg-red-100 text-red-700 hover:bg-red-200'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`,
    minimal: `transition-colors ${
      isSaved 
        ? 'text-red-500 hover:text-red-600' 
        : 'text-gray-400 hover:text-red-500'
    }`
  };

  if (!isAuthenticated && variant === 'ghost') {
    return null; // Don't show bookmark button for unauthenticated users in ghost variant
  }

  return (
    <button
      onClick={handleToggle}
      className={`${variantClasses[variant]} ${className}`}
      title={
        !isAuthenticated 
          ? 'Sign in to save causes'
          : isSaved 
            ? 'Remove from saved' 
            : 'Save cause'
      }
      disabled={!isAuthenticated}
    >
      <Heart 
        className={`${sizeClasses[size]} ${
          isSaved ? 'fill-current' : ''
        }`} 
      />
      {variant === 'button' && (
        <span>{isSaved ? 'Saved' : 'Save'}</span>
      )}
    </button>
  );
}

export default BookmarkButton;