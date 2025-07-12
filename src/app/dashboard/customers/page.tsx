"use client";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  XMarkIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

interface Customer {
  customer_id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  mobile_number: string;
  email_address: string;
  pan_number: string;
  aadhaar_number: string;
  current_address: string;
  permanent_address: string;
  occupation: string;
  annual_income: number;
  customer_segment: string;
  risk_category: string;
  customer_type: 'Individual' | 'Business';
  account_status: 'Active' | 'Inactive' | 'Suspended';
  kyc_status: 'Pending' | 'Completed' | 'Expired';
  registration_date: string;
  total_relationship_value: number;
  active_products: string[];
  loan_outstanding: number;
  deposit_balance: number;
  last_transaction_date: string;
  customer_since: string;
}

export default function CustomerDatabasePage() {
  const [searchCustomerId, setSearchCustomerId] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [searchMobileNumber, setSearchMobileNumber] = useState("");
  const [customerType, setCustomerType] = useState("all");
  const [accountStatus, setAccountStatus] = useState("all");
  const [kycStatus, setKycStatus] = useState("all");
  const [registrationDateRange, setRegistrationDateRange] = useState({ start: "", end: "" });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const mockCustomers: Customer[] = [
    {
      customer_id: "CUST001",
      full_name: "Rajesh Kumar",
      date_of_birth: "1985-03-15",
      gender: "Male",
      mobile_number: "+91 98765 43210",
      email_address: "rajesh.kumar@email.com",
      pan_number: "ABCDE1234F",
      aadhaar_number: "1234-5678-9012",
      current_address: "123, Green Park, New Delhi - 110016",
      permanent_address: "456, Model Town, Delhi - 110009",
      occupation: "Software Engineer",
      annual_income: 850000,
      customer_segment: "Premium",
      risk_category: "Low Risk",
      customer_type: "Individual",
      account_status: "Active",
      kyc_status: "Completed",
      registration_date: "2022-01-15",
      total_relationship_value: 2500000,
      active_products: ["Savings Account", "Fixed Deposit", "Personal Loan"],
      loan_outstanding: 500000,
      deposit_balance: 1500000,
      last_transaction_date: "2024-01-20",
      customer_since: "2022-01-15",
    },
    {
      customer_id: "CUST002",
      full_name: "Sunita Enterprises",
      date_of_birth: "1990-07-22",
      gender: "Female",
      mobile_number: "+91 87654 32109",
      email_address: "sunita.enterprises@email.com",
      pan_number: "FGHIJ5678K",
      aadhaar_number: "2345-6789-0123",
      current_address: "789, Connaught Place, New Delhi - 110001",
      permanent_address: "321, Karol Bagh, Delhi - 110005",
      occupation: "Business Owner",
      annual_income: 2500000,
      customer_segment: "Business",
      risk_category: "Medium Risk",
      customer_type: "Business",
      account_status: "Active",
      kyc_status: "Completed",
      registration_date: "2021-06-10",
      total_relationship_value: 5000000,
      active_products: ["Current Account", "Business Loan", "Term Deposit"],
      loan_outstanding: 2000000,
      deposit_balance: 2500000,
      last_transaction_date: "2024-01-18",
      customer_since: "2021-06-10",
    },
    {
      customer_id: "CUST003",
      full_name: "Amit Patel",
      date_of_birth: "1988-11-08",
      gender: "Male",
      mobile_number: "+91 76543 21098",
      email_address: "amit.patel@email.com",
      pan_number: "KLMNO9012P",
      aadhaar_number: "3456-7890-1234",
      current_address: "456, Lajpat Nagar, New Delhi - 110024",
      permanent_address: "654, Defence Colony, Delhi - 110024",
      occupation: "Doctor",
      annual_income: 1200000,
      customer_segment: "Gold",
      risk_category: "Low Risk",
      customer_type: "Individual",
      account_status: "Active",
      kyc_status: "Completed",
      registration_date: "2023-03-20",
      total_relationship_value: 1800000,
      active_products: ["Savings Account", "Health Insurance"],
      loan_outstanding: 0,
      deposit_balance: 800000,
      last_transaction_date: "2024-01-19",
      customer_since: "2023-03-20",
    },
  ];

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesId = customer.customer_id.toLowerCase().includes(searchCustomerId.toLowerCase());
    const matchesName = customer.full_name.toLowerCase().includes(searchCustomerName.toLowerCase());
    const matchesMobile = customer.mobile_number.includes(searchMobileNumber);
    const matchesType = customerType === "all" || customer.customer_type === customerType;
    const matchesStatus = accountStatus === "all" || customer.account_status === accountStatus;
    const matchesKyc = kycStatus === "all" || customer.kyc_status === kycStatus;
    
    return matchesId && matchesName && matchesMobile && matchesType && matchesStatus && matchesKyc;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "Premium": return "bg-purple-100 text-purple-800";
      case "Gold": return "bg-yellow-100 text-yellow-800";
      case "Business": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low Risk": return "bg-green-100 text-green-800";
      case "Medium Risk": return "bg-yellow-100 text-yellow-800";
      case "High Risk": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const maskAadhaar = (aadhaar: string) => {
    return aadhaar.replace(/(\d{4})-(\d{4})-(\d{4})/, "****-****-$3");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Database Management</h1>
          <p className="text-gray-600">Comprehensive customer 360° view and management</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <UserIcon className="h-4 w-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Customer Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Search & Filter</h2>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Customer ID"
                value={searchCustomerId}
                onChange={(e) => setSearchCustomerId(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Customer Name"
                value={searchCustomerName}
                onChange={(e) => setSearchCustomerName(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <PhoneIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Mobile Number"
                value={searchMobileNumber}
                onChange={(e) => setSearchMobileNumber(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Business">Business</option>
            </select>
            
            <select
              value={accountStatus}
              onChange={(e) => setAccountStatus(e.target.value)}
              className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
            
            <select
              value={kycStatus}
              onChange={(e) => setKycStatus(e.target.value)}
              className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All KYC Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Expired">Expired</option>
            </select>
            
            <input
              type="date"
              value={registrationDateRange.start}
              onChange={(e) => setRegistrationDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <input
              type="date"
              value={registrationDateRange.end}
              onChange={(e) => setRegistrationDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Customers Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.full_name}</div>
                        <div className="text-sm text-gray-500">{customer.customer_id}</div>
                        <div className="text-xs text-gray-400">{customer.occupation}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{customer.mobile_number}</div>
                        <div className="text-sm text-gray-500">{customer.email_address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{customer.customer_type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.account_status)}`}>
                        {customer.account_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(customer.kyc_status)}`}>
                        {customer.kyc_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(customer.customer_segment)}`}>
                        {customer.customer_segment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Profile Section */}
      {selectedCustomer && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Profile - {selectedCustomer.full_name}</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.customer_id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.full_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.date_of_birth}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.mobile_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.email_address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.pan_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
                      <p className="text-sm text-gray-900 mt-1">{maskAadhaar(selectedCustomer.aadhaar_number)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Address</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedCustomer.current_address}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedCustomer.permanent_address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Occupation</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.occupation}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                      <p className="text-sm text-gray-900 mt-1">₹{selectedCustomer.annual_income.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer Segment</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getSegmentColor(selectedCustomer.customer_segment)}`}>
                        {selectedCustomer.customer_segment}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Risk Category</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getRiskColor(selectedCustomer.risk_category)}`}>
                        {selectedCustomer.risk_category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Summary */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Account Summary</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Relationship Value</p>
                        <p className="text-2xl font-bold text-blue-900">₹{(selectedCustomer.total_relationship_value / 100000).toFixed(1)}L</p>
                      </div>
                      <CurrencyDollarIcon className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Deposit Balance</p>
                        <p className="text-xl font-bold text-green-900">₹{(selectedCustomer.deposit_balance / 100000).toFixed(1)}L</p>
                      </div>
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Loan Outstanding</p>
                        <p className="text-xl font-bold text-orange-900">₹{(selectedCustomer.loan_outstanding / 100000).toFixed(1)}L</p>
                      </div>
                      <ExclamationTriangleIcon className="h-6 w-6 text-orange-500" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Active Products</label>
                    <div className="space-y-1">
                      {selectedCustomer.active_products.map((product, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-900">{product}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Transaction</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.last_transaction_date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer Since</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.customer_since}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Profile
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                View Transactions
              </button>
              <button 
                onClick={() => setSelectedCustomer(null)}
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