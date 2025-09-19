import React, { useState } from 'react';
import { Tag, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

export function MultipleCategoryFilter({ 
  selectedCategories = [], 
  onCategoriesChange, 
  onClear,
  className = '' 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const categoryOptions = [
    { value: 'education', label: 'Education', color: 'bg-blue-100 text-blue-800' },
    { value: 'healthcare', label: 'Healthcare', color: 'bg-green-100 text-green-800' },
    { value: 'environment', label: 'Environment', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'poverty-relief', label: 'Poverty Relief', color: 'bg-orange-100 text-orange-800' },
    { value: 'disaster-relief', label: 'Disaster Relief', color: 'bg-red-100 text-red-800' },
    { value: 'community-development', label: 'Community Development', color: 'bg-purple-100 text-purple-800' },
    { value: 'youth-development', label: 'Youth Development', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'women-empowerment', label: 'Women Empowerment', color: 'bg-pink-100 text-pink-800' },
    { value: 'agriculture', label: 'Agriculture', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'water-sanitation', label: 'Water & Sanitation', color: 'bg-cyan-100 text-cyan-800' }
  ];

  const handleCategoryToggle = (categoryValue) => {
    let updatedCategories;
    if (selectedCategories.includes(categoryValue)) {
      updatedCategories = selectedCategories.filter(cat => cat !== categoryValue);
    } else {
      updatedCategories = [...selectedCategories, categoryValue];
    }
    onCategoriesChange(updatedCategories);
  };

  const handleClear = () => {
    onClear();
  };



  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        <Tag className="inline h-4 w-4 mr-1" />
        Categories
      </label>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {categoryOptions
            .filter(option => selectedCategories.includes(option.value))
            .map(option => (
              <span
                key={option.value}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${option.color}`}
              >
                {option.label}
                <button
                  onClick={() => handleCategoryToggle(option.value)}
                  className="hover:bg-black hover:bg-opacity-10 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* Category Selection Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-left flex items-center justify-between hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
      >
        <span className="text-neutral-600">
          {selectedCategories.length === 0 
            ? 'Select categories...' 
            : `${selectedCategories.length} category${selectedCategories.length === 1 ? '' : 'ies'} selected`
          }
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-neutral-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-400" />
        )}
      </button>

      {/* Category Options Dropdown */}
      {isExpanded && (
        <div className="border border-neutral-300 rounded-md bg-white shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2 space-y-1">
            {categoryOptions.map(option => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(option.value)}
                    onChange={() => handleCategoryToggle(option.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    selectedCategories.includes(option.value)
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-neutral-300'
                  }`}>
                    {selectedCategories.includes(option.value) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-neutral-700 flex-1">
                  {option.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${option.color}`}>
                  {option.label.split(' ')[0]}
                </span>
              </label>
            ))}
          </div>
          
          {/* Clear All Button */}
          {selectedCategories.length > 0 && (
            <div className="border-t border-neutral-200 p-2">
              <button
                onClick={handleClear}
                className="w-full text-center text-sm text-red-600 hover:text-red-700 py-1"
              >
                Clear All Categories
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MultipleCategoryFilter;