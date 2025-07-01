'use client';

import { useState } from 'react';
import BranchFilters from './BranchFilters';

interface Branch {
  id: string;
  branchCode: string;
  branchName: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  managerName: string;
  managerPhone: string;
  employeeCount: number;
  customerCount: number;
  totalDeposits: number;
  totalLoans: number;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  establishedDate: string;
  lastInspection: string;
}

interface BranchPerformanceProps {
  branches: Branch[];
}

export default function BranchPerformance({ branches }: BranchPerformanceProps) {
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchTerm, setSearchTerm] = useState('');

  const states = ['All States', ...Array.from(new Set(branches.map(branch => branch.state)))];
  
  // Get cities based on selected state
  const getAvailableCities = () => {
    if (selectedState === 'All States') {
      return ['All Cities', ...Array.from(new Set(branches.map(branch => branch.city)))];
    } else {
      const stateCities = branches
        .filter(branch => branch.state === selectedState)
        .map(branch => branch.city);
      return ['All Cities', ...Array.from(new Set(stateCities))];
    }
  };
  
  const cities = getAvailableCities();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Inactive':
        return 'text-red-600 bg-red-100';
      case 'Under Maintenance':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter branches based on selected filters and search term
  const filteredBranches = branches.filter(branch => {
    const matchesCity = selectedCity === 'All Cities' || branch.city === selectedCity;
    const matchesState = selectedState === 'All States' || branch.state === selectedState;
    const matchesSearch = searchTerm === '' || 
      branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.branchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.managerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCity && matchesState && matchesSearch;
  });

  // Handle state change and reset city if needed
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    if (state === 'All States') {
      setSelectedCity('All Cities');
    } else {
      // Check if current city exists in the new state
      const stateCities = branches
        .filter(branch => branch.state === state)
        .map(branch => branch.city);
      if (!stateCities.includes(selectedCity) && selectedCity !== 'All Cities') {
        setSelectedCity('All Cities');
      }
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedState('All States');
    setSelectedCity('All Cities');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Branch Performance Metrics</h3>
      </div>

      {/* Filters */}
      <BranchFilters
        searchTerm={searchTerm}
        selectedState={selectedState}
        selectedCity={selectedCity}
        states={states}
        cities={cities}
        onSearchChange={setSearchTerm}
        onStateChange={handleStateChange}
        onCityChange={setSelectedCity}
        onClearFilters={handleClearFilters}
      />

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Total Performance</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Deposits:</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(filteredBranches.reduce((sum, branch) => sum + branch.totalDeposits, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Loans:</span>
              <span className="text-sm font-medium text-blue-600">
                {formatCurrency(filteredBranches.reduce((sum, branch) => sum + branch.totalLoans, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Customers:</span>
              <span className="text-sm font-medium text-purple-600">
                {filteredBranches.reduce((sum, branch) => sum + branch.customerCount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Average Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. Deposits/Branch:</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(filteredBranches.length > 0 ? 
                  filteredBranches.reduce((sum, branch) => sum + branch.totalDeposits, 0) / filteredBranches.length : 0
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. Customers/Branch:</span>
              <span className="text-sm font-medium text-purple-600">
                {Math.round(filteredBranches.length > 0 ? 
                  filteredBranches.reduce((sum, branch) => sum + branch.customerCount, 0) / filteredBranches.length : 0
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. Employees/Branch:</span>
              <span className="text-sm font-medium text-orange-600">
                {Math.round(filteredBranches.length > 0 ? 
                  filteredBranches.reduce((sum, branch) => sum + branch.employeeCount, 0) / filteredBranches.length : 0
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h4>
          <div className="space-y-3">
            {filteredBranches
              .sort((a, b) => b.totalDeposits - a.totalDeposits)
              .slice(0, 3)
              .map((branch, index) => (
                <div key={branch.id} className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      #{index + 1} {branch.branchName}
                    </span>
                    <div className="text-xs text-gray-500">{branch.city}</div>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(branch.totalDeposits)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Individual Branch Performance */}
      <div className="grid gap-6">
        {filteredBranches.map((branch) => (
          <div key={branch.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{branch.branchName}</h4>
                <p className="text-sm text-gray-600">{branch.city}, {branch.state}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(branch.status)}`}>
                {branch.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Total Deposits</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(branch.totalDeposits)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((branch.totalDeposits / filteredBranches.reduce((sum, b) => sum + b.totalDeposits, 0)) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Total Loans</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(branch.totalLoans)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((branch.totalLoans / filteredBranches.reduce((sum, b) => sum + b.totalLoans, 0)) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-xl font-bold text-purple-600">{branch.customerCount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(branch.customerCount / branch.employeeCount)} customers/employee
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Employees</p>
                <p className="text-xl font-bold text-orange-600">{branch.employeeCount}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(Math.round(branch.totalDeposits / branch.employeeCount))}/employee
                </p>
              </div>
            </div>

            {/* Performance Ratios */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Loan-to-Deposit Ratio</p>
                <p className="text-lg font-bold text-blue-600">
                  {((branch.totalLoans / branch.totalDeposits) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Deposits per Customer</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(Math.round(branch.totalDeposits / branch.customerCount))}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Customer Growth Potential</p>
                <p className="text-lg font-bold text-purple-600">
                  {branch.status === 'Active' ? 'High' : branch.status === 'Under Maintenance' ? 'Medium' : 'Low'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 