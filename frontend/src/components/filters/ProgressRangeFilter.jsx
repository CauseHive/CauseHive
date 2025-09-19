import React, { useState } from 'react';
import { TrendingUp, X } from 'lucide-react';
import './FilterComponents.css';

export function ProgressRangeFilter({ 
  minProgress, 
  maxProgress, 
  onProgressRangeChange, 
  onClear,
  className = '' 
}) {
  const [localMinProgress, setLocalMinProgress] = useState(minProgress || 0);
  const [localMaxProgress, setLocalMaxProgress] = useState(maxProgress || 100);

  const handleMinProgressChange = (value) => {
    const numValue = parseInt(value);
    setLocalMinProgress(numValue);
    onProgressRangeChange(numValue, localMaxProgress);
  };

  const handleMaxProgressChange = (value) => {
    const numValue = parseInt(value);
    setLocalMaxProgress(numValue);
    onProgressRangeChange(localMinProgress, numValue);
  };

  const handleClear = () => {
    setLocalMinProgress(0);
    setLocalMaxProgress(100);
    onClear();
  };

  const hasProgressFilter = localMinProgress !== 0 || localMaxProgress !== 100;

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        <TrendingUp className="inline h-4 w-4 mr-1" />
        Funding Progress
      </label>
      
      <div className="space-y-3">
        {/* Progress Range Sliders */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span>Min Progress: {localMinProgress}%</span>
            <span>Max Progress: {localMaxProgress}%</span>
          </div>
          
          {/* Min Progress Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={localMinProgress}
              onChange={(e) => handleMinProgressChange(e.target.value)}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider-thumb-primary"
            />
          </div>
          
          {/* Max Progress Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={localMaxProgress}
              onChange={(e) => handleMaxProgressChange(e.target.value)}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider-thumb-secondary"
            />
          </div>
        </div>

        {/* Progress Bar Visualization */}
        <div className="relative h-6 bg-neutral-200 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
            style={{
              left: `${localMinProgress}%`,
              width: `${localMaxProgress - localMinProgress}%`
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-neutral-700">
            {localMinProgress}% - {localMaxProgress}%
          </div>
        </div>

        {/* Preset Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setLocalMinProgress(0);
              setLocalMaxProgress(25);
              onProgressRangeChange(0, 25);
            }}
            className="text-xs px-2 py-1 bg-neutral-100 hover:bg-primary-100 rounded border transition-colors"
          >
            Just Started (0-25%)
          </button>
          <button
            onClick={() => {
              setLocalMinProgress(25);
              setLocalMaxProgress(75);
              onProgressRangeChange(25, 75);
            }}
            className="text-xs px-2 py-1 bg-neutral-100 hover:bg-primary-100 rounded border transition-colors"
          >
            In Progress (25-75%)
          </button>
          <button
            onClick={() => {
              setLocalMinProgress(75);
              setLocalMaxProgress(100);
              onProgressRangeChange(75, 100);
            }}
            className="text-xs px-2 py-1 bg-neutral-100 hover:bg-primary-100 rounded border transition-colors"
          >
            Almost Complete (75-100%)
          </button>
        </div>

        {hasProgressFilter && (
          <div className="flex items-center justify-end pt-2">
            <button
              onClick={handleClear}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Reset Progress Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressRangeFilter;