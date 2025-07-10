
'use client';

import { useState } from 'react';
import {
  MapPinIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
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

interface BranchOverviewProps {
  branches: Branch[];
  onViewBranch: (branch: Branch) => void;
}

interface StateStatistics {
  state: string;
  totalBranches: number;
  activeBranches: number;
  totalEmployees: number;
  totalCustomers: number;
  totalDeposits: number;
  totalLoans: number;
  cities: string[];
}

interface CityStatistics {
  city: string;
  state: string;
  totalBranches: number;
  activeBranches: number;
  totalEmployees: number;
  totalCustomers: number;
  totalDeposits: number;
  totalLoans: number;
}

export default function BranchOverview({ branches, onViewBranch }: BranchOverviewProps) {
  const [viewType, setViewType] = useState<'state' | 'city'>('state');
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

  // Calculate state-wise statistics
  const getStateStatistics = (): StateStatistics[] => {
    const stateMap = new Map<string, StateStatistics>();

    branches.forEach(branch => {
      if (!stateMap.has(branch.state)) {
        stateMap.set(branch.state, {
          state: branch.state,
          totalBranches: 0,
          activeBranches: 0,
          totalEmployees: 0,
          totalCustomers: 0,
          totalDeposits: 0,
          totalLoans: 0,
          cities: []
        });
      }

      const stateStat = stateMap.get(branch.state)!;
      stateStat.totalBranches++;
      if (branch.status === 'Active') stateStat.activeBranches++;
      stateStat.totalEmployees += branch.employeeCount;
      stateStat.totalCustomers += branch.customerCount;
      stateStat.totalDeposits += branch.totalDeposits;
      stateStat.totalLoans += branch.totalLoans;
      
      if (!stateStat.cities.includes(branch.city)) {
        stateStat.cities.push(branch.city);
      }
    });

    return Array.from(stateMap.values());
  };

  // Calculate city-wise statistics
  const getCityStatistics = (): CityStatistics[] => {
    const cityMap = new Map<string, CityStatistics>();

    branches.forEach(branch => {
      const key = `${branch.city}-${branch.state}`;
      if (!cityMap.has(key)) {
        cityMap.set(key, {
          city: branch.city,
          state: branch.state,
          totalBranches: 0,
          activeBranches: 0,
          totalEmployees: 0,
          totalCustomers: 0,
          totalDeposits: 0,
          totalLoans: 0,
        });
      }

      const cityStat = cityMap.get(key)!;
      cityStat.totalBranches++;
      if (branch.status === 'Active') cityStat.activeBranches++;
      cityStat.totalEmployees += branch.employeeCount;
      cityStat.totalCustomers += branch.customerCount;
      cityStat.totalDeposits += branch.totalDeposits;
      cityStat.totalLoans += branch.totalLoans;
    });

    return Array.from(cityMap.values());
  };

  // Filter statistics based on selected filters
  const getFilteredStatistics = () => {
    if (viewType === 'state') {
      let stats = getStateStatistics();
      if (selectedState !== 'All States') {
        stats = stats.filter(stat => stat.state === selectedState);
      }
      if (searchTerm) {
        stats = stats.filter(stat => 
          stat.state.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return stats;
    } else {
      let stats = getCityStatistics();
      if (selectedState !== 'All States') {
        stats = stats.filter(stat => stat.state === selectedState);
      }
      if (selectedCity !== 'All Cities') {
        stats = stats.filter(stat => stat.city === selectedCity);
      }
      if (searchTerm) {
        stats = stats.filter(stat => 
          stat.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stat.state.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return stats;
    }
  };

  const filteredStats = getFilteredStatistics();

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
      {/* Header and Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Statistical Overview</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewType('state')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewType === 'state'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            By State
          </button>
          <button
            onClick={() => setViewType('city')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewType === 'city'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            By City
          </button>
        </div>
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

      {/* Statistics Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {viewType === 'state' ? 'State' : 'City'}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                    Branches
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    Employees
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    Customers
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <CurrencyRupeeIcon className="w-4 h-4 mr-2" />
                    Total Deposits
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <CurrencyRupeeIcon className="w-4 h-4 mr-2" />
                    Total Loans
                  </div>
                </th>
                {viewType === 'state' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cities
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStats.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {viewType === 'state' ? (stat as StateStatistics).state : (stat as CityStatistics).city}
                    </div>
                    {viewType === 'city' && (
                      <div className="text-sm text-gray-500">{(stat as CityStatistics).state}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {stat.totalBranches} total
                    </div>
                    <div className="text-sm text-green-600">
                      {stat.activeBranches} active
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {stat.totalEmployees.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {stat.totalCustomers.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(stat.totalDeposits)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {formatCurrency(stat.totalLoans)}
                    </div>
                  </td>
                  {viewType === 'state' && (
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {(stat as StateStatistics).cities.join(', ')}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total {viewType === 'state' ? 'States' : 'Cities'}</p>
              <p className="text-2xl font-bold text-blue-600">{filteredStats.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CurrencyRupeeIcon className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(filteredStats.reduce((sum, stat) => sum + stat.totalDeposits, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-purple-600">
                {filteredStats.reduce((sum, stat) => sum + stat.totalCustomers, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 