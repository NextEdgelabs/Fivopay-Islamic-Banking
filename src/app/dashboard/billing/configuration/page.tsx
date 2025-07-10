"use client";

import { useState } from "react";
import {
  CalculatorIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface BillingRule {
  id: string;
  name: string;
  type: "service" | "product" | "subscription";
  rate: number;
  currency: string;
  frequency: "one-time" | "monthly" | "quarterly" | "annual";
  description: string;
  isActive: boolean;
}

interface BillingRuleFormData {
  name: string;
  type: "service" | "product" | "subscription";
  rate: number;
  currency: string;
  frequency: "one-time" | "monthly" | "quarterly" | "annual";
  description: string;
}

export default function BillingConfigurationPage() {
  const [billingRules, setBillingRules] = useState<BillingRule[]>([
    {
      id: "1",
      name: "Account Maintenance Fee",
      type: "service",
      rate: 500,
      currency: "INR",
      frequency: "monthly",
      description: "Monthly account maintenance and service charges",
      isActive: true,
    },
    {
      id: "2",
      name: "Loan Processing Fee",
      type: "product",
      rate: 2500,
      currency: "INR",
      frequency: "one-time",
      description: "One-time loan processing and documentation fee",
      isActive: true,
    },
    {
      id: "3",
      name: "Premium Banking Package",
      type: "subscription",
      rate: 1500,
      currency: "INR",
      frequency: "monthly",
      description: "Premium banking services and priority support",
      isActive: true,
    },
    {
      id: "4",
      name: "Transaction Fee",
      type: "service",
      rate: 50,
      currency: "INR",
      frequency: "one-time",
      description: "Per transaction processing fee",
      isActive: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRule, setEditingRule] = useState<BillingRule | null>(null);
  const [formData, setFormData] = useState<BillingRuleFormData>({
    name: "",
    type: "service",
    rate: 0,
    currency: "INR",
    frequency: "monthly",
    description: "",
  });

  const handleAddRule = () => {
    if (formData.name && formData.rate > 0) {
      const newRule: BillingRule = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
      };
      setBillingRules([...billingRules, newRule]);
      setFormData({
        name: "",
        type: "service",
        rate: 0,
        currency: "INR",
        frequency: "monthly",
        description: "",
      });
      setShowAddForm(false);
    }
  };

  const handleEditRule = (rule: BillingRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      type: rule.type,
      rate: rule.rate,
      currency: rule.currency,
      frequency: rule.frequency,
      description: rule.description,
    });
  };

  const handleUpdateRule = () => {
    if (editingRule && formData.name && formData.rate > 0) {
      setBillingRules(billingRules.map(rule =>
        rule.id === editingRule.id
          ? { ...rule, ...formData }
          : rule
      ));
      setEditingRule(null);
      setFormData({
        name: "",
        type: "service",
        rate: 0,
        currency: "INR",
        frequency: "monthly",
        description: "",
      });
    }
  };

  const handleDeleteRule = (id: string) => {
    setBillingRules(billingRules.filter(rule => rule.id !== id));
  };

  const toggleRuleStatus = (id: string) => {
    setBillingRules(billingRules.map(rule =>
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "service":
        return "bg-blue-100 text-blue-800";
      case "product":
        return "bg-purple-100 text-purple-800";
      case "subscription":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "one-time":
        return "bg-gray-100 text-gray-800";
      case "monthly":
        return "bg-green-100 text-green-800";
      case "quarterly":
        return "bg-yellow-100 text-yellow-800";
      case "annual":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing Configuration</h1>
          <p className="text-gray-600">Configure billing rules, rates, and payment terms</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Billing Rule</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingRule) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingRule ? "Edit Billing Rule" : "Add New Billing Rule"}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingRule(null);
                setFormData({
                  name: "",
                  type: "service",
                  rate: 0,
                  currency: "INR",
                  frequency: "monthly",
                  description: "",
                });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter rule name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="service">Service</option>
                <option value="product">Product</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate</label>
              <input
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="one-time">One-time</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description"
              />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingRule(null);
                setFormData({
                  name: "",
                  type: "service",
                  rate: 0,
                  currency: "INR",
                  frequency: "monthly",
                  description: "",
                });
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingRule ? handleUpdateRule : handleAddRule}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <CheckIcon className="h-4 w-4" />
              <span>{editingRule ? "Update" : "Add"} Rule</span>
            </button>
          </div>
        </div>
      )}

      {/* Billing Rules Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Billing Rules</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rule Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                      <div className="text-sm text-gray-500">{rule.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(rule.type)}`}>
                      {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rule.currency} {rule.rate.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyColor(rule.frequency)}`}>
                      {rule.frequency.charAt(0).toUpperCase() + rule.frequency.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRuleStatus(rule.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rule.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rule.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CalculatorIcon className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Billing Calculator</div>
              <div className="text-sm text-gray-600">Calculate fees and charges</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CogIcon className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Advanced Settings</div>
              <div className="text-sm text-gray-600">Configure advanced billing options</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CheckIcon className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Validate Rules</div>
              <div className="text-sm text-gray-600">Validate billing rule configurations</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 