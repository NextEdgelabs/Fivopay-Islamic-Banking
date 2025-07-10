'use client';

import { Branch } from '../types';

interface FilterSummaryProps {
  branches: Branch[];
  filteredBranches: Branch[];
  searchTerm: string;
  selectedState: string;
  selectedCity: string;
}

export default function FilterSummary({
  branches,
  filteredBranches,
  searchTerm,
  selectedState,
  selectedCity
}: FilterSummaryProps) {
  const hasFilters = searchTerm !== '' || selectedState !== 'All States' || selectedCity !== 'All Cities';
  
  if (!hasFilters) {
    return (
      <div className="bg-gray-50 px-4 py-3 rounded-lg">
        <p className="text-sm text-gray-600">
          Showing all <span className="font-semibold">{branches.length}</span> branches
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 px-4 py-3 rounded-lg border-l-4 border-blue-400">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-800">
            Showing <span className="font-semibold">{filteredBranches.length}</span> of{' '}
            <span className="font-semibold">{branches.length}</span> branches
          </p>
          <div className="flex items-center space-x-4 mt-1 text-xs text-blue-600">
            {searchTerm && (
              <span>Search: &quot;{searchTerm}&quot;</span>
            )}
            {selectedState !== 'All States' && (
              <span>State: {selectedState}</span>
            )}
            {selectedCity !== 'All Cities' && (
              <span>City: {selectedCity}</span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-blue-600">
            <p>Active Branches: {filteredBranches.filter(b => b.status === 'Active').length}</p>
            <p>Total Employees: {filteredBranches.reduce((sum, b) => sum + b.employeeCount, 0)}</p>
            <p>Total Customers: {filteredBranches.reduce((sum, b) => sum + b.customerCount, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 