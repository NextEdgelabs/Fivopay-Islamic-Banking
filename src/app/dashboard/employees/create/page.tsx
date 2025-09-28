"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  UserPlusIcon, 
  ArrowLeftIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { useAppContext, Employee } from "@/app/context/AppContext";

export default function CreateEmployeePage() {
  const router = useRouter();
  const { addEmployee } = useAppContext();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    role: "",
    status: "Active" as Employee["status"],
    notes: "",
    regulatoryCompliant: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newEmployeeId, setNewEmployeeId] = useState<string | null>(null);

  const departments = [
    "Regulatory Compliance",
    "Customer Service", 
    "Information Technology",
    "Operations",
    "Risk Management",
    "Finance",
    "Marketing",
    "Human Resources"
  ];

  const roles = [
    { id: "Admin", name: "Admin", description: "Full system access" },
    { id: "Manager", name: "Manager", description: "Customer and account management" },
    { id: "Support", name: "Support", description: "Customer service tools" },
    { id: "Compliance", name: "Compliance", description: "regulatory compliance features" },
    { id: "IT Admin", name: "IT Admin", description: "System configuration" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.department || !formData.role || !formData.position) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      // Create new employee object
      const newEmployee = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        role: formData.role,
        status: formData.status,
        lastLogin: "Never",
        regulatoryCompliant: formData.regulatoryCompliant,
        joinDate: new Date().toISOString().split('T')[0]
      };
      
      // Add employee to context
      const id = addEmployee(newEmployee);
      setNewEmployeeId(id);
      
      // Show success message briefly then redirect
      setLoading(false);
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/employees?created=true");
      }, 1500);
    } catch (error) {
      console.error("Error creating employee:", error);
      setLoading(false);
      alert("An error occurred while creating the employee.");
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Employee Created Successfully</h2>
          <p className="text-green-700 mb-4">
            The new employee account has been created and is pending regulatory compliance verification.
          </p>
          <p className="text-sm text-green-600">
            Employee ID: {newEmployeeId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stripe-text">Create New Employee</h1>
          <p className="text-stripe-text-secondary">
            Add a new staff member to the digital banking platform
          </p>
        </div>
        <Link 
          href="/dashboard/employees"
          className="btn-secondary"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Employees
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-stripe-text mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-stripe-text mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="text-stripe-text w-full px-3 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-stripe-text mb-4">Employment Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-1">
                Position/Title *
              </label>
              <input
                id="position"
                type="text"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., Senior Banking Specialist"
                required
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">
                Department *
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
                System Role *
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {formData.role && (
                <p className="mt-1 text-xs text-slate-500">
                  {roles.find(r => r.id === formData.role)?.description}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Employee["status"] }))}
                className="text-gray-700 w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Regulatory Compliance */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Regulatory Compliance</h3>
          
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="regulatoryCompliant"
                type="checkbox"
                checked={formData.regulatoryCompliant}
                onChange={(e) => setFormData(prev => ({ ...prev, regulatoryCompliant: e.target.checked }))}
                className=" h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="regulatoryCompliant" className="font-medium text-slate-700">
                Verified Regulatory Compliance
              </label>
              <p className="text-slate-500">
                Employee has completed regulatory compliance training and understands banking principles
              </p>
            </div>
          </div>

          {!formData.regulatoryCompliant && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-700">
                  Employee will have limited access until regulatory compliance verification is complete
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Creating Employee...
              </>
            ) : (
              <>
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Create Employee
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 