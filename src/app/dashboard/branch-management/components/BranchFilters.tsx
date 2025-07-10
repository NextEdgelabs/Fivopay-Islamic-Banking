'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface BranchFiltersProps {
  searchTerm: string;
  selectedState: string;
  selectedCity: string;
  states: string[];
  cities: string[];
  onSearchChange: (term: string) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  onExport?: () => void;
  showClearFilters?: boolean;
  onClearFilters?: () => void;
}

export default function BranchFilters({
  searchTerm,
  selectedState,
  selectedCity,
  states,
  cities,
  onSearchChange,
  onStateChange,
  onCityChange,
  onExport,
  showClearFilters = true,
  onClearFilters
}: BranchFiltersProps) {
  const hasActiveFilters = searchTerm !== '' || selectedState !== 'All States' || selectedCity !== 'All Cities';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="text-gray-700 border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">State:</label>
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">City:</label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={selectedState === 'All States'}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2 ml-auto">
          {showClearFilters && hasActiveFilters && onClearFilters && (
            <button 
              onClick={onClearFilters}
              className="text-gray-600 hover:text-gray-800 px-3 py-2 text-sm font-medium"
            >
              Clear Filters
            </button>
          )}
          
          {onExport && (
            <button 
              onClick={onExport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export Data</span>
            </button>
          )}
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {searchTerm && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              Search: &quot;{searchTerm}&quot;
            </span>
          )}
          {selectedState !== 'All States' && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              State: {selectedState}
            </span>
          )}
          {selectedCity !== 'All Cities' && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              City: {selectedCity}
            </span>
          )}
        </div>
      )}
    </div>
  );
} 