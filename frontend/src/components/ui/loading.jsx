import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = '', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin mx-auto mb-2 text-primary-600`} />
        {text && <p className="text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  );
};

export const LoadingCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export const LoadingGrid = ({ count = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
};

export const LoadingTable = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border overflow-hidden ${className}`}>
      <div className="p-4 border-b">
        <div className="animate-pulse h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`animate-pulse h-3 bg-gray-200 rounded ${
                  colIndex === 0 ? 'w-1/4' : colIndex === 1 ? 'w-1/3' : 'w-1/6'
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const LoadingPage = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
};

export const ButtonLoading = ({ 
  isLoading = false, 
  loadingText = 'Loading...', 
  children, 
  disabled = false,
  ...props 
}) => {
  return (
    <button 
      {...props} 
      disabled={disabled || isLoading}
      className={`inline-flex items-center ${props.className || ''}`}
    >
      {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {isLoading ? loadingText : children}
    </button>
  );
};

export default LoadingSpinner;