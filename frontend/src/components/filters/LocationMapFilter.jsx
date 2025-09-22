import React, { useState } from 'react';
import { MapPin, Map, X, Check } from 'lucide-react';

export function LocationMapFilter({ 
  selectedLocation, 
  onLocationChange, 
  onClear,
  className = '' 
}) {
  const [showMap, setShowMap] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState(Array.isArray(selectedLocation) ? selectedLocation : (selectedLocation ? [selectedLocation] : []));

  // Ghana regions with coordinates for map visualization
  const ghanaRegions = [
    { 
      value: 'greater-accra', 
      label: 'Greater Accra', 
      coordinates: { lat: 5.6037, lng: -0.1870 },
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    { 
      value: 'ashanti', 
      label: 'Ashanti', 
      coordinates: { lat: 6.6885, lng: -1.6244 },
      color: 'bg-green-100 text-green-800 border-green-300'
    },
    { 
      value: 'western', 
      label: 'Western', 
      coordinates: { lat: 5.0000, lng: -2.5000 },
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    { 
      value: 'central', 
      label: 'Central', 
      coordinates: { lat: 5.3000, lng: -1.0000 },
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    },
    { 
      value: 'volta', 
      label: 'Volta', 
      coordinates: { lat: 6.6000, lng: 0.4667 },
      color: 'bg-red-100 text-red-800 border-red-300'
    },
    { 
      value: 'eastern', 
      label: 'Eastern', 
      coordinates: { lat: 6.1000, lng: -0.6000 },
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    },
    { 
      value: 'northern', 
      label: 'Northern', 
      coordinates: { lat: 9.5000, lng: -1.0000 },
      color: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    { 
      value: 'upper-east', 
      label: 'Upper East', 
      coordinates: { lat: 10.7833, lng: -0.8833 },
      color: 'bg-pink-100 text-pink-800 border-pink-300'
    },
    { 
      value: 'upper-west', 
      label: 'Upper West', 
      coordinates: { lat: 10.3000, lng: -2.5000 },
      color: 'bg-cyan-100 text-cyan-800 border-cyan-300'
    },
    { 
      value: 'brong-ahafo', 
      label: 'Brong Ahafo', 
      coordinates: { lat: 7.7167, lng: -2.3167 },
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    { 
      value: 'western-north', 
      label: 'Western North', 
      coordinates: { lat: 6.2000, lng: -2.8000 },
      color: 'bg-violet-100 text-violet-800 border-violet-300'
    },
    { 
      value: 'ahafo', 
      label: 'Ahafo', 
      coordinates: { lat: 7.2000, lng: -2.6000 },
      color: 'bg-rose-100 text-rose-800 border-rose-300'
    },
    { 
      value: 'bono', 
      label: 'Bono', 
      coordinates: { lat: 7.8000, lng: -2.5000 },
      color: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    { 
      value: 'bono-east', 
      label: 'Bono East', 
      coordinates: { lat: 8.1000, lng: -1.8000 },
      color: 'bg-lime-100 text-lime-800 border-lime-300'
    },
    { 
      value: 'oti', 
      label: 'Oti', 
      coordinates: { lat: 8.1500, lng: 0.0500 },
      color: 'bg-teal-100 text-teal-800 border-teal-300'
    },
    { 
      value: 'savannah', 
      label: 'Savannah', 
      coordinates: { lat: 9.0000, lng: -2.0000 },
      color: 'bg-stone-100 text-stone-800 border-stone-300'
    },
    { 
      value: 'north-east', 
      label: 'North East', 
      coordinates: { lat: 10.0000, lng: -0.3000 },
      color: 'bg-sky-100 text-sky-800 border-sky-300'
    }
  ];

  const handleRegionToggle = (regionValue) => {
    let updatedRegions;
    if (selectedRegions.includes(regionValue)) {
      updatedRegions = selectedRegions.filter(region => region !== regionValue);
    } else {
      updatedRegions = [...selectedRegions, regionValue];
    }
    setSelectedRegions(updatedRegions);
    onLocationChange(updatedRegions);
  };

  const handleClear = () => {
    setSelectedRegions([]);
    onClear();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        <MapPin className="inline h-4 w-4 mr-1" />
        Location (Ghana Regions)
      </label>

      {/* Toggle Map View */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setShowMap(false)}
          className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
            !showMap 
              ? 'bg-primary-50 border-primary-300 text-primary-700' 
              : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setShowMap(true)}
          className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
            showMap 
              ? 'bg-primary-50 border-primary-300 text-primary-700' 
              : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <Map className="inline h-4 w-4 mr-1" />
          Map View
        </button>
      </div>

      {/* Selected Regions Display */}
      {selectedRegions.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {ghanaRegions
            .filter(region => selectedRegions.includes(region.value))
            .map(region => (
              <span
                key={region.value}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${region.color}`}
              >
                {region.label}
                <button
                  onClick={() => handleRegionToggle(region.value)}
                  className="hover:bg-black hover:bg-opacity-10 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
        </div>
      )}

      {showMap ? (
        /* Visual Map Interface */
        <div className="border border-neutral-300 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 p-4">
          <div className="text-center mb-3">
            <h4 className="text-sm font-medium text-neutral-700">Ghana Regions Map</h4>
            <p className="text-xs text-neutral-600">Click regions to select</p>
          </div>
          
          {/* Simplified Ghana Map Grid Layout */}
          <div className="relative grid grid-cols-4 gap-1 mx-auto max-w-64 h-48">
            {/* North regions */}
            <div className="col-span-4 grid grid-cols-4 gap-1 h-12">
              {ghanaRegions
                .filter(region => ['upper-west', 'upper-east', 'north-east'].includes(region.value))
                .map(region => (
                  <button
                    key={region.value}
                    onClick={() => handleRegionToggle(region.value)}
                    className={`text-xs p-1 rounded border-2 transition-all transform hover:scale-105 ${
                      selectedRegions.includes(region.value) 
                        ? `${region.color} border-current` 
                        : 'bg-white border-neutral-300 hover:border-primary-300'
                    }`}
                  >
                    {region.label.split(' ')[0]}
                  </button>
                ))}
            </div>
            
            {/* Middle regions */}
            <div className="col-span-4 grid grid-cols-4 gap-1 h-12">
              {ghanaRegions
                .filter(region => ['northern', 'savannah', 'bono', 'bono-east'].includes(region.value))
                .map(region => (
                  <button
                    key={region.value}
                    onClick={() => handleRegionToggle(region.value)}
                    className={`text-xs p-1 rounded border-2 transition-all transform hover:scale-105 ${
                      selectedRegions.includes(region.value) 
                        ? `${region.color} border-current` 
                        : 'bg-white border-neutral-300 hover:border-primary-300'
                    }`}
                  >
                    {region.label.split(' ')[0]}
                  </button>
                ))}
            </div>
            
            {/* Central regions */}
            <div className="col-span-4 grid grid-cols-4 gap-1 h-12">
              {ghanaRegions
                .filter(region => ['brong-ahafo', 'ahafo', 'ashanti', 'eastern'].includes(region.value))
                .map(region => (
                  <button
                    key={region.value}
                    onClick={() => handleRegionToggle(region.value)}
                    className={`text-xs p-1 rounded border-2 transition-all transform hover:scale-105 ${
                      selectedRegions.includes(region.value) 
                        ? `${region.color} border-current` 
                        : 'bg-white border-neutral-300 hover:border-primary-300'
                    }`}
                  >
                    {region.label.split(' ')[0]}
                  </button>
                ))}
            </div>
            
            {/* South regions */}
            <div className="col-span-4 grid grid-cols-4 gap-1 h-12">
              {ghanaRegions
                .filter(region => ['western', 'western-north', 'central', 'greater-accra'].includes(region.value))
                .map(region => (
                  <button
                    key={region.value}
                    onClick={() => handleRegionToggle(region.value)}
                    className={`text-xs p-1 rounded border-2 transition-all transform hover:scale-105 ${
                      selectedRegions.includes(region.value) 
                        ? `${region.color} border-current` 
                        : 'bg-white border-neutral-300 hover:border-primary-300'
                    }`}
                  >
                    {region.label.split(' ')[0]}
                  </button>
                ))}
            </div>
          </div>
        </div>
      ) : (
        /* List View Interface */
        <div className="space-y-2">
          <div className="max-h-48 overflow-y-auto border border-neutral-300 rounded-md bg-white">
            {ghanaRegions.map(region => (
              <label
                key={region.value}
                className="flex items-center gap-3 p-2 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(region.value)}
                    onChange={() => handleRegionToggle(region.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    selectedRegions.includes(region.value)
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-neutral-300'
                  }`}>
                    {selectedRegions.includes(region.value) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-neutral-700 flex-1">
                  {region.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs border ${region.color}`}>
                  {region.value.split('-')[0]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Quick Select Options */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => {
            const coastalRegions = ['greater-accra', 'central', 'western'];
            setSelectedRegions(coastalRegions);
            onLocationChange(coastalRegions);
          }}
          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded border transition-colors"
        >
          Coastal Regions
        </button>
        <button
          onClick={() => {
            const northernRegions = ['northern', 'upper-east', 'upper-west'];
            setSelectedRegions(northernRegions);
            onLocationChange(northernRegions);
          }}
          className="px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded border transition-colors"
        >
          Northern Regions
        </button>
        <button
          onClick={() => {
            const allRegions = ghanaRegions.map(r => r.value);
            setSelectedRegions(allRegions);
            onLocationChange(allRegions);
          }}
          className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded border transition-colors"
        >
          All Regions
        </button>
      </div>

      {/* Clear Button */}
      {selectedRegions.length > 0 && (
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={handleClear}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear Location Filter
          </button>
        </div>
      )}
    </div>
  );
}

export default LocationMapFilter;