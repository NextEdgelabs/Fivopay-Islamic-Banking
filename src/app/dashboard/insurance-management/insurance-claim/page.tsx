"use client";
import { useState } from "react";
import {
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface InsuranceClaim {
  id: string;
  claimNumber: string;
  customerName: string;
  customerId: string;
  policyNumber: string;
  productName: string;
  productCategory: "health" | "life" | "motor" | "property" | "travel" | "business";
  status: "pending" | "under_review" | "approved" | "rejected" | "paid";
  claimType: "medical" | "accident" | "property_damage" | "theft" | "natural_disaster" | "other";
  amount: number;
  approvedAmount?: number;
  description: string;
  incidentDate: string;
  filedDate: string;
  processedDate?: string;
  documents: string[];
  notes: string[];
  assignedTo?: string;
}

interface NewClaimForm {
  customerName: string;
  customerId: string;
  policyNumber: string;
  productName: string;
  productCategory: "health" | "life" | "motor" | "property" | "travel" | "business";
  claimType: "medical" | "accident" | "property_damage" | "theft" | "natural_disaster" | "other";
  amount: number;
  description: string;
  incidentDate: string;
}

export default function InsuranceClaimPage() {
  const [claims, setClaims] = useState<InsuranceClaim[]>([
    {
      id: "1",
      claimNumber: "CLM-2024-001",
      customerName: "John Smith",
      customerId: "CUST-001",
      policyNumber: "POL-2024-001",
      productName: "Health Insurance Plus",
      productCategory: "health",
      status: "pending",
      claimType: "medical",
      amount: 25000,
      approvedAmount: 0,
      description: "Hospitalization due to appendicitis surgery",
      incidentDate: "2024-01-10",
      filedDate: "2024-01-15",
      documents: ["medical_report.pdf", "hospital_bill.pdf"],
      notes: ["Claim submitted", "Documents received"],
      assignedTo: "Sarah Johnson",
    },
    {
      id: "2",
      claimNumber: "CLM-2024-002",
      customerName: "Mike Wilson",
      customerId: "CUST-003",
      policyNumber: "POL-2024-003",
      productName: "Motor Insurance Shield",
      productCategory: "motor",
      status: "approved",
      claimType: "accident",
      amount: 15000,
      approvedAmount: 12000,
      description: "Vehicle damage from rear-end collision",
      incidentDate: "2024-01-05",
      filedDate: "2024-01-08",
      processedDate: "2024-01-12",
      documents: ["police_report.pdf", "repair_estimate.pdf"],
      notes: ["Claim approved", "Payment processed"],
      assignedTo: "David Brown",
    },
    {
      id: "3",
      claimNumber: "CLM-2024-003",
      customerName: "Sarah Johnson",
      customerId: "CUST-002",
      policyNumber: "POL-2024-002",
      productName: "Life Insurance Protection",
      productCategory: "life",
      status: "under_review",
      claimType: "medical",
      amount: 50000,
      approvedAmount: 0,
      description: "Critical illness claim for cancer treatment",
      incidentDate: "2024-01-01",
      filedDate: "2024-01-20",
      documents: ["medical_diagnosis.pdf", "treatment_plan.pdf"],
      notes: ["Under medical review", "Additional documents requested"],
      assignedTo: "Emily Davis",
    },
    {
      id: "4",
      claimNumber: "CLM-2024-004",
      customerName: "Emily Davis",
      customerId: "CUST-004",
      policyNumber: "POL-2024-004",
      productName: "Property Insurance Guard",
      productCategory: "property",
      status: "rejected",
      claimType: "property_damage",
      amount: 5000,
      approvedAmount: 0,
      description: "Water damage claim for basement flooding",
      incidentDate: "2024-01-12",
      filedDate: "2024-01-15",
      processedDate: "2024-01-18",
      documents: ["damage_photos.pdf", "repair_quotes.pdf"],
      notes: ["Claim rejected - insufficient documentation", "Policy exclusion applies"],
      assignedTo: "Lisa Anderson",
    },
    {
      id: "5",
      claimNumber: "CLM-2024-005",
      customerName: "David Brown",
      customerId: "CUST-005",
      policyNumber: "POL-2024-005",
      productName: "Travel Insurance Safe",
      productCategory: "travel",
      status: "paid",
      claimType: "medical",
      amount: 3000,
      approvedAmount: 3000,
      description: "Medical emergency during international travel",
      incidentDate: "2023-12-20",
      filedDate: "2023-12-25",
      processedDate: "2024-01-05",
      documents: ["medical_bills.pdf", "travel_documents.pdf"],
      notes: ["Claim approved", "Payment completed"],
      assignedTo: "Mike Wilson",
    },
    {
      id: "6",
      claimNumber: "CLM-2024-006",
      customerName: "Lisa Anderson",
      customerId: "CUST-006",
      policyNumber: "POL-2024-006",
      productName: "Health Insurance Plus",
      productCategory: "health",
      status: "pending",
      claimType: "medical",
      amount: 12000,
      approvedAmount: 0,
      description: "Dental surgery and treatment",
      incidentDate: "2024-01-18",
      filedDate: "2024-01-22",
      documents: ["dental_report.pdf", "treatment_plan.pdf"],
      notes: ["Claim submitted", "Awaiting dental records"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClaim, setNewClaim] = useState<NewClaimForm>({
    customerName: "",
    customerId: "",
    policyNumber: "",
    productName: "",
    productCategory: "health",
    claimType: "medical",
    amount: 0,
    description: "",
    incidentDate: "",
  });

  // For file uploads in the claim form
  const [newClaimDocuments, setNewClaimDocuments] = useState<File[]>([]);

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "paid", label: "Paid" },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "health", label: "Health" },
    { value: "life", label: "Life" },
    { value: "motor", label: "Motor" },
    { value: "property", label: "Property" },
    { value: "travel", label: "Travel" },
    { value: "business", label: "Business" },
  ];

  const claimTypes = [
    { value: "all", label: "All Types" },
    { value: "medical", label: "Medical" },
    { value: "accident", label: "Accident" },
    { value: "property_damage", label: "Property Damage" },
    { value: "theft", label: "Theft" },
    { value: "natural_disaster", label: "Natural Disaster" },
    { value: "other", label: "Other" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-4 w-4" />;
      case "under_review":
        return <EyeIcon className="h-4 w-4" />;
      case "approved":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "rejected":
        return <XCircleIcon className="h-4 w-4" />;
      case "paid":
        return <CurrencyDollarIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "bg-green-100 text-green-800";
      case "life":
        return "bg-blue-100 text-blue-800";
      case "motor":
        return "bg-yellow-100 text-yellow-800";
      case "property":
        return "bg-purple-100 text-purple-800";
      case "travel":
        return "bg-orange-100 text-orange-800";
      case "business":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getClaimTypeColor = (type: string) => {
    switch (type) {
      case "medical":
        return "bg-red-100 text-red-800";
      case "accident":
        return "bg-orange-100 text-orange-800";
      case "property_damage":
        return "bg-yellow-100 text-yellow-800";
      case "theft":
        return "bg-purple-100 text-purple-800";
      case "natural_disaster":
        return "bg-indigo-100 text-indigo-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || claim.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "all" || claim.productCategory === selectedCategory;
    const matchesType =
      selectedType === "all" || claim.claimType === selectedType;
    return matchesSearch && matchesStatus && matchesCategory && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const claimNumber = `CLM-${new Date().getFullYear()}-${String(claims.length + 1).padStart(3, '0')}`;

    const newClaimData: InsuranceClaim = {
      id: (claims.length + 1).toString(),
      claimNumber,
      ...newClaim,
      status: "pending",
      filedDate: new Date().toISOString().split('T')[0],
      documents: newClaimDocuments.map((file) => file.name),
      notes: ["Claim submitted"],
      approvedAmount: 0,
    };
    setClaims([...claims, newClaimData]);
    setShowAddModal(false);
    setNewClaim({
      customerName: "",
      customerId: "",
      policyNumber: "",
      productName: "",
      productCategory: "health",
      claimType: "medical",
      amount: 0,
      description: "",
      incidentDate: "",
    });
    setNewClaimDocuments([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Insurance Claims
          </h1>
          <p className="text-slate-600">
            Process and track insurance claims
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Claim
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-700 w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-gray-700 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-gray-700 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-gray-700 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {claimTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              {filteredClaims.length} claims
            </span>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Claim Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Policy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Claimed / Approved Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {claim.claimNumber}
                      </div>
                      <div className="text-sm text-slate-500 max-w-xs truncate">
                        {claim.description}
                      </div>
                      <div className="flex items-center mt-1">
                        <DocumentTextIcon className="h-3 w-3 text-slate-400 mr-1" />
                        <span className="text-xs text-slate-500">
                          {claim.documents.length} documents
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-slate-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-slate-900">
                          {claim.customerName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {claim.customerId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {claim.policyNumber}
                      </div>
                      <div className="text-sm text-slate-500">
                        {claim.productName}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                          claim.productCategory
                        )}`}
                      >
                        {claim.productCategory.charAt(0).toUpperCase() +
                          claim.productCategory.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getClaimTypeColor(
                        claim.claimType
                      )}`}
                    >
                      {claim.claimType.replace("_", " ").charAt(0).toUpperCase() +
                        claim.claimType.replace("_", " ").slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        claim.status
                      )}`}
                    >
                      {getStatusIcon(claim.status)}
                      <span className="ml-1 capitalize">
                        {claim.status.replace("_", " ")}
                      </span>
                    </span>
                    {claim.assignedTo && (
                      <div className="text-xs text-slate-500 mt-1">
                        Assigned to {claim.assignedTo}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      ${claim.amount.toLocaleString()} <span className="text-xs text-slate-500">/ ${claim.approvedAmount?.toLocaleString() ?? 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      Incident: {new Date(claim.incidentDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-slate-500">
                      Filed: {new Date(claim.filedDate).toLocaleDateString()}
                    </div>
                    {claim.processedDate && (
                      <div className="text-sm text-slate-500">
                        Processed: {new Date(claim.processedDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-slate-600 hover:text-slate-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredClaims.length === 0 && (
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium text-slate-900">
            No claims found
          </h3>
          <p className="mt-2 text-slate-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Add Claim Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                File New Insurance Claim
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newClaim.customerName}
                    onChange={(e) => setNewClaim({...newClaim, customerName: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    required
                    value={newClaim.customerId}
                    onChange={(e) => setNewClaim({...newClaim, customerId: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter customer ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    required
                    value={newClaim.policyNumber}
                    onChange={(e) => setNewClaim({...newClaim, policyNumber: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter policy number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newClaim.productName}
                    onChange={(e) => setNewClaim({...newClaim, productName: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Category
                  </label>
                  <select
                    required
                    value={newClaim.productCategory}
                    onChange={(e) => setNewClaim({...newClaim, productCategory: e.target.value as any})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="health">Health</option>
                    <option value="life">Life</option>
                    <option value="motor">Motor</option>
                    <option value="property">Property</option>
                    <option value="travel">Travel</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Claim Type
                  </label>
                  <select
                    required
                    value={newClaim.claimType}
                    onChange={(e) => setNewClaim({...newClaim, claimType: e.target.value as any})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="medical" className="text-gray-700">Medical</option>
                    <option value="accident" className="text-gray-700">Accident</option>
                    <option value="property_damage" className="text-gray-700">Property Damage</option>
                    <option value="theft" className="text-gray-700">Theft</option>
                    <option value="natural_disaster" className="text-gray-700">Natural Disaster</option>
                    <option value="other" className="text-gray-700">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Claim Amount ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newClaim.amount}
                    onChange={(e) => setNewClaim({...newClaim, amount: Number(e.target.value)})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newClaim.incidentDate}
                    onChange={(e) => setNewClaim({...newClaim, incidentDate: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Claim Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={newClaim.description}
                  onChange={(e) => setNewClaim({...newClaim, description: e.target.value})}
                  className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the incident and claim details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Documents
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setNewClaimDocuments(Array.from(e.target.files));
                    }
                  }}
                  className="block w-full text-sm text-gray-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {newClaimDocuments.length > 0 && (
                  <ul className="mt-2 text-xs text-slate-600 list-disc list-inside">
                    {newClaimDocuments.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  File Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
