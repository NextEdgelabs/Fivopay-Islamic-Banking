"use client";
import { useState } from "react";
import {
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface InsuranceProduct {
  id: string;
  name: string;
  category: "health" | "life" | "motor" | "property" | "travel" | "business";
  description: string;
  premium: number;
  coverage: number;
  status: "active" | "inactive" | "draft";
  features: string[];
  createdAt: string;
  updatedAt: string;
  subscribers: number;
}

interface NewProductForm {
  name: string;
  category: "health" | "life" | "motor" | "property" | "travel" | "business";
  description: string;
  premium: number;
  coverage: number;
  status: "active" | "inactive" | "draft";
  features: string[];
}

export default function InsuranceProductPage() {
  const [products, setProducts] = useState<InsuranceProduct[]>([
    {
      id: "1",
      name: "Takaful Health Plus",
      category: "health",
      description: "Comprehensive health insurance with Sharia-compliant coverage",
      premium: 250,
      coverage: 50000,
      status: "active",
      features: ["Hospitalization", "Outpatient", "Dental", "Vision"],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
      subscribers: 1250,
    },
    {
      id: "2",
      name: "Takaful Life Protection",
      category: "life",
      description: "Life insurance with family protection benefits",
      premium: 180,
      coverage: 100000,
      status: "active",
      features: ["Death Benefit", "Disability", "Critical Illness"],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-10",
      subscribers: 890,
    },
    {
      id: "3",
      name: "Takaful Motor Shield",
      category: "motor",
      description: "Comprehensive motor vehicle insurance",
      premium: 320,
      coverage: 75000,
      status: "active",
      features: ["Accident Coverage", "Theft Protection", "Third Party"],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-12",
      subscribers: 2100,
    },
    {
      id: "4",
      name: "Takaful Property Guard",
      category: "property",
      description: "Home and property insurance coverage",
      premium: 150,
      coverage: 200000,
      status: "active",
      features: ["Fire Damage", "Natural Disasters", "Theft"],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-08",
      subscribers: 650,
    },
    {
      id: "5",
      name: "Takaful Travel Safe",
      category: "travel",
      description: "International travel insurance",
      premium: 45,
      coverage: 25000,
      status: "active",
      features: ["Medical Emergency", "Trip Cancellation", "Baggage Loss"],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-05",
      subscribers: 320,
    },
    {
      id: "6",
      name: "Takaful Business Protect",
      category: "business",
      description: "Business liability and property insurance",
      premium: 450,
      coverage: 500000,
      status: "draft",
      features: ["General Liability", "Property Damage", "Business Interruption"],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
      subscribers: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProductForm>({
    name: "",
    category: "health",
    description: "",
    premium: 0,
    coverage: 0,
    status: "draft",
    features: [],
  });
  const [newFeature, setNewFeature] = useState("");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "health", label: "Health" },
    { value: "life", label: "Life" },
    { value: "motor", label: "Motor" },
    { value: "property", label: "Property" },
    { value: "travel", label: "Travel" },
    { value: "business", label: "Business" },
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "draft", label: "Draft" },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "inactive":
        return <XCircleIcon className="h-4 w-4" />;
      case "draft":
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddFeature = () => {
    if (newFeature.trim() && !newProduct.features.includes(newFeature.trim())) {
      setNewProduct({
        ...newProduct,
        features: [...newProduct.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setNewProduct({
      ...newProduct,
      features: newProduct.features.filter(feature => feature !== featureToRemove),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProductData: InsuranceProduct = {
      id: (products.length + 1).toString(),
      ...newProduct,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      subscribers: 0,
    };
    setProducts([...products, newProductData]);
    setShowAddModal(false);
    setNewProduct({
      name: "",
      category: "health",
      description: "",
      premium: 0,
      coverage: 0,
      status: "draft",
      features: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Insurance Products
          </h1>
          <p className="text-slate-600">
            Manage Takaful insurance products and offerings
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-700 w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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

          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              {filteredProducts.length} products
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  {product.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Category</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                    product.category
                  )}`}
                >
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    product.status
                  )}`}
                >
                  {getStatusIcon(product.status)}
                  <span className="ml-1 capitalize">{product.status}</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Premium</span>
                <span className="text-sm font-medium text-slate-900">
                  ${product.premium}/month
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Coverage</span>
                <span className="text-sm font-medium text-slate-900">
                  ${product.coverage.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Subscribers</span>
                <span className="text-sm font-medium text-slate-900">
                  {product.subscribers.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                  >
                    {feature}
                  </span>
                ))}
                {product.features.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                    +{product.features.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                View Details
              </button>
              <button className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium text-slate-900">
            No products found
          </h3>
          <p className="mt-2 text-slate-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Add New Insurance Product
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
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
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
                    Monthly Premium ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProduct.premium}
                    onChange={(e) => setNewProduct({...newProduct, premium: Number(e.target.value)})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Coverage Amount ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProduct.coverage}
                    onChange={(e) => setNewProduct({...newProduct, coverage: Number(e.target.value)})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    required
                    value={newProduct.status}
                    onChange={(e) => setNewProduct({...newProduct, status: e.target.value as any})}
                    className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Features
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="text-gray-700 flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProduct.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
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
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
