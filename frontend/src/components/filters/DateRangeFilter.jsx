import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';

export function DateRangeFilter({ 
  startDate, 
  endDate, 
  onDateRangeChange, 
  onClear,
  className = '' 
}) {
  const [showDateInputs, setShowDateInputs] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');

  const handleStartDateChange = (value) => {
    setLocalStartDate(value);
    onDateRangeChange(value, localEndDate);
  };

  const handleEndDateChange = (value) => {
    setLocalEndDate(value);
    onDateRangeChange(localStartDate, value);
  };

  const handleClear = () => {
    setLocalStartDate('');
    setLocalEndDate('');
    setShowDateInputs(false);
    onClear();
  };

  const hasDateFilter = localStartDate || localEndDate;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        <Calendar className="inline h-4 w-4 mr-1" />
        Campaign Deadline
      </label>
      
      {!showDateInputs && !hasDateFilter ? (
        <button
          onClick={() => setShowDateInputs(true)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-left text-neutral-500 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          Filter by deadline range...
        </button>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-neutral-600 mb-1">From Date</label>
              <input
                type="date"
                value={localStartDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-600 mb-1">To Date</label>
              <input
                type="date"
                value={localEndDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                min={localStartDate || new Date().toISOString().split('T')[0]} // Ensure end date is after start date
              />
            </div>
          </div>
          
          {hasDateFilter && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-600">
                {localStartDate && localEndDate 
                  ? `${localStartDate} to ${localEndDate}`
                  : localStartDate 
                    ? `From ${localStartDate}`
                    : `Until ${localEndDate}`
                }
              </span>
              <button
                onClick={handleClear}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DateRangeFilter;