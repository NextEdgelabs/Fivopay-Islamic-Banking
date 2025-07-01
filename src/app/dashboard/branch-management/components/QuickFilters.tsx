'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Branch } from '../types';

interface QuickFiltersProps {
  branches: Branch[];
  onStateSelect: (state: string) => void;
  onCitySelect: (city: string) => void;
  currentState: string;
  currentCity: string;
}

export default function QuickFilters({
  branches,
  onStateSelect,
  onCitySelect,
  currentState,
  currentCity
}: QuickFiltersProps) {
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Get top states by branch count
  const getTopStates = () => {
    const stateCounts = branches.reduce((acc, branch) => {
      acc[branch.state] = (acc[branch.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stateCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([state, count]) => ({ state, count }));
  };

  // Get top cities by branch count
  const getTopCities = () => {
    const cityCounts = branches.reduce((acc, branch) => {
      acc[branch.city] = (acc[branch.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(cityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([city, count]) => ({ city, count }));
  };

  const topStates = getTopStates();
  const topCities = getTopCities();

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700">Quick filters:</span>
      
      {/* States Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowStateDropdown(!showStateDropdown)}
          className="text-gray-700 flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <span>{currentState === 'All States' ? 'Select State' : currentState}</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        
        {showStateDropdown && (
          <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => {
                  onStateSelect('All States');
                  setShowStateDropdown(false);
                }}
                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                All States
              </button>
              {topStates.map(({ state, count }) => (
                <button
                  key={state}
                  onClick={() => {
                    onStateSelect(state);
                    setShowStateDropdown(false);
                  }}
                  className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <div className="flex justify-between">
                    <span>{state}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cities Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowCityDropdown(!showCityDropdown)}
          className="text-gray-700 flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <span>{currentCity === 'All Cities' ? 'Select City' : currentCity}</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        
        {showCityDropdown && (
          <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="py-1 max-h-64 overflow-y-auto">
              <button
                onClick={() => {
                  onCitySelect('All Cities');
                  setShowCityDropdown(false);
                }}
                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                All Cities
              </button>
              {topCities.map(({ city, count }) => (
                <button
                  key={city}
                  onClick={() => {
                    onCitySelect(city);
                    setShowCityDropdown(false);
                  }}
                  className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <div className="flex justify-between">
                    <span>{city}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showStateDropdown || showCityDropdown) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowStateDropdown(false);
            setShowCityDropdown(false);
          }}
        />
      )}
    </div>
  );
} 