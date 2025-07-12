"use client";
import { useState } from "react";
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MapPinIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface Segment {
  id: string;
  segment_name: string;
  income_range_min: number;
  income_range_max: number;
  age_range_min: number;
  age_range_max: number;
  geographic_location: string[];
  product_usage: string[];
  transaction_frequency: string;
  relationship_value_min: number;
  relationship_value_max: number;
  segment_size: number;
  segment_growth: number;
  profitability: number;
  retention_rate: number;
  cross_sell_potential: number;
}

export default function CustomerSegmentationPage() {
  const [segmentName, setSegmentName] = useState("");
  const [incomeRangeMin, setIncomeRangeMin] = useState("");
  const [incomeRangeMax, setIncomeRangeMax] = useState("");
  const [ageRangeMin, setAgeRangeMin] = useState("");
  const [ageRangeMax, setAgeRangeMax] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [transactionFrequency, setTransactionFrequency] = useState("");
  const [relationshipValueMin, setRelationshipValueMin] = useState("");
  const [relationshipValueMax, setRelationshipValueMax] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

  const mockSegments: Segment[] = [
    {
      id: "SEG001",
      segment_name: "Premium High-Net-Worth",
      income_range_min: 2000000,
      income_range_max: 10000000,
      age_range_min: 35,
      age_range_max: 65,
      geographic_location: ["Delhi", "Mumbai", "Bangalore"],
      product_usage: ["Private Banking", "Investment Advisory", "Premium Credit Cards"],
      transaction_frequency: "High",
      relationship_value_min: 10000000,
      relationship_value_max: 100000000,
      segment_size: 1250,
      segment_growth: 15.5,
      profitability: 85000000,
      retention_rate: 95.2,
      cross_sell_potential: 8.5,
    },
    {
      id: "SEG002",
      segment_name: "Young Professionals",
      income_range_min: 500000,
      income_range_max: 1500000,
      age_range_min: 25,
      age_range_max: 35,
      geographic_location: ["Delhi", "Mumbai", "Pune", "Hyderabad"],
      product_usage: ["Digital Banking", "Personal Loans", "Credit Cards"],
      transaction_frequency: "Medium",
      relationship_value_min: 500000,
      relationship_value_max: 3000000,
      segment_size: 8500,
      segment_growth: 22.3,
      profitability: 45000000,
      retention_rate: 88.7,
      cross_sell_potential: 7.2,
    },
    {
      id: "SEG003",
      segment_name: "Small Business Owners",
      income_range_min: 800000,
      income_range_max: 3000000,
      age_range_min: 30,
      age_range_max: 55,
      geographic_location: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
      product_usage: ["Business Accounts", "Working Capital Loans", "Trade Finance"],
      transaction_frequency: "High",
      relationship_value_min: 2000000,
      relationship_value_max: 15000000,
      segment_size: 3200,
      segment_growth: 18.9,
      profitability: 65000000,
      retention_rate: 92.1,
      cross_sell_potential: 9.1,
    },
  ];

  const locationOptions = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad", "Ahmedabad"
  ];

  const productOptions = [
    "Savings Account", "Current Account", "Fixed Deposit", "Personal Loan", "Business Loan",
    "Credit Cards", "Investment Advisory", "Insurance", "Digital Banking", "Trade Finance"
  ];

  const frequencyOptions = [
    "Low (1-5/month)", "Medium (6-15/month)", "High (16-30/month)", "Very High (30+/month)"
  ];

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    );
  };

  const handleProductToggle = (product: string) => {
    setSelectedProducts(prev => 
      prev.includes(product) 
        ? prev.filter(prod => prod !== product)
        : [...prev, product]
    );
  };

  const handleCreateSegment = () => {
    if (segmentName && incomeRangeMin && incomeRangeMax) {
      // Handle segment creation logic here
      console.log("Creating segment:", {
        segmentName,
        incomeRangeMin,
        incomeRangeMax,
        ageRangeMin,
        ageRangeMax,
        selectedLocations,
        selectedProducts,
        transactionFrequency,
        relationshipValueMin,
        relationshipValueMax
      });
    }
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Segmentation Tool</h1>
          <p className="text-gray-600">Create and manage customer segments for targeted marketing</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>Create Segment</span>
          </button>
        </div>
      </div>

      {/* Segmentation Criteria */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Segmentation Criteria</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Segment Name</label>
                  <input
                    type="text"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    placeholder="Enter segment name"
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Income Range (Min)</label>
                    <div className="relative">
                      <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={incomeRangeMin}
                        onChange={(e) => setIncomeRangeMin(e.target.value)}
                        placeholder="Min income"
                        className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Income Range (Max)</label>
                    <div className="relative">
                      <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={incomeRangeMax}
                        onChange={(e) => setIncomeRangeMax(e.target.value)}
                        placeholder="Max income"
                        className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (Min)</label>
                    <input
                      type="number"
                      value={ageRangeMin}
                      onChange={(e) => setAgeRangeMin(e.target.value)}
                      placeholder="Min age"
                      className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (Max)</label>
                    <input
                      type="number"
                      value={ageRangeMax}
                      onChange={(e) => setAgeRangeMax(e.target.value)}
                      placeholder="Max age"
                      className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Criteria */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Advanced Criteria</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Location</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {locationOptions.map((location) => (
                      <label key={location} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(location)}
                          onChange={() => handleLocationToggle(location)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Usage</label>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {productOptions.map((product) => (
                      <label key={product} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product)}
                          onChange={() => handleProductToggle(product)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{product}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Frequency</label>
                  <select
                    value={transactionFrequency}
                    onChange={(e) => setTransactionFrequency(e.target.value)}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    {frequencyOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Value (Min)</label>
                    <div className="relative">
                      <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={relationshipValueMin}
                        onChange={(e) => setRelationshipValueMin(e.target.value)}
                        placeholder="Min value"
                        className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Value (Max)</label>
                    <div className="relative">
                      <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={relationshipValueMax}
                        onChange={(e) => setRelationshipValueMax(e.target.value)}
                        placeholder="Max value"
                        className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleCreateSegment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Segment
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Preview Segment
            </button>
          </div>
        </div>
      </div>

      {/* Segment Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Segment Analytics</h2>
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Segments</p>
                  <p className="text-2xl font-bold text-blue-900">{mockSegments.length}</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Customers</p>
                  <p className="text-2xl font-bold text-green-900">{mockSegments.reduce((sum, seg) => sum + seg.segment_size, 0).toLocaleString()}</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Growth</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {(mockSegments.reduce((sum, seg) => sum + seg.segment_growth, 0) / mockSegments.length).toFixed(1)}%
                  </p>
                </div>
                <ArrowTrendingUpIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Total Profitability</p>
                  <p className="text-xl font-bold text-orange-900">₹{(mockSegments.reduce((sum, seg) => sum + seg.profitability, 0) / 10000000).toFixed(1)}Cr</p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">Avg Retention</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    {(mockSegments.reduce((sum, seg) => sum + seg.retention_rate, 0) / mockSegments.length).toFixed(1)}%
                  </p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
          </div>

          {/* Segments Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profitability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retention</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cross-Sell</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockSegments.map((segment) => {
                  const GrowthIcon = getGrowthIcon(segment.segment_growth);
                  return (
                    <tr key={segment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{segment.segment_name}</div>
                          <div className="text-sm text-gray-500">₹{segment.income_range_min.toLocaleString()} - ₹{segment.income_range_max.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{segment.segment_size.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <GrowthIcon className={`h-4 w-4 mr-1 ${getGrowthColor(segment.segment_growth)}`} />
                          <span className={`text-sm font-medium ${getGrowthColor(segment.segment_growth)}`}>
                            {segment.segment_growth}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{(segment.profitability / 1000000).toFixed(1)}M</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{segment.retention_rate}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{segment.cross_sell_potential}/10</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedSegment(segment)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Segment Details Modal */}
      {selectedSegment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Segment Details: {selectedSegment.segment_name}</h3>
              <button
                onClick={() => setSelectedSegment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Criteria</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Income Range:</span>
                    <span className="text-sm text-gray-900 ml-2">₹{selectedSegment.income_range_min.toLocaleString()} - ₹{selectedSegment.income_range_max.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Age Range:</span>
                    <span className="text-sm text-gray-900 ml-2">{selectedSegment.age_range_min} - {selectedSegment.age_range_max} years</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Locations:</span>
                    <div className="text-sm text-gray-900 mt-1">
                      {selectedSegment.geographic_location.join(", ")}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Products:</span>
                    <div className="text-sm text-gray-900 mt-1">
                      {selectedSegment.product_usage.join(", ")}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Transaction Frequency:</span>
                    <span className="text-sm text-gray-900 ml-2">{selectedSegment.transaction_frequency}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Analytics</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="text-sm font-medium text-blue-600">Segment Size</div>
                      <div className="text-lg font-bold text-blue-900">{selectedSegment.segment_size.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="text-sm font-medium text-green-600">Growth Rate</div>
                      <div className="text-lg font-bold text-green-900">{selectedSegment.segment_growth}%</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="text-sm font-medium text-purple-600">Profitability</div>
                      <div className="text-lg font-bold text-purple-900">₹{(selectedSegment.profitability / 1000000).toFixed(1)}M</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <div className="text-sm font-medium text-orange-600">Retention Rate</div>
                      <div className="text-lg font-bold text-orange-900">{selectedSegment.retention_rate}%</div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded">
                    <div className="text-sm font-medium text-indigo-600">Cross-Sell Potential</div>
                    <div className="text-lg font-bold text-indigo-900">{selectedSegment.cross_sell_potential}/10</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Segment
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Export Data
              </button>
              <button 
                onClick={() => setSelectedSegment(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 