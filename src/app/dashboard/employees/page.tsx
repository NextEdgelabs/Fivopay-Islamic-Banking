"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { useAppContext } from "@/app/context/AppContext";

export default function EmployeesPage() {
  const { employees, deleteEmployee } = useAppContext();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check if we're returning from employee creation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('created') === 'true') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = activeTab === "all" || 
                         (activeTab === "active" && employee.status === "Active") ||
                         (activeTab === "inactive" && employee.status === "Inactive");
    
    const matchesDepartment = selectedDepartment === "all" || 
                             employee.department === selectedDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = ["all", ...new Set(employees.map(emp => emp.department))];

  const tabs = [
    { id: "all", name: "All Employees", count: employees.length },
    { id: "active", name: "Active", count: employees.filter(emp => emp.status === "Active").length },
    { id: "inactive", name: "Inactive", count: employees.filter(emp => emp.status === "Inactive").length },
    { id: "roles", name: "Roles & Permissions", count: null },
  ];

  const roles = [
    { id: "Admin", name: "Admin", description: "Full system access", count: employees.filter(emp => emp.role === "Admin").length, color: "purple" },
    { id: "Manager", name: "Manager", description: "Customer and account management", count: employees.filter(emp => emp.role === "Manager").length, color: "blue" },
    { id: "Support", name: "Support", description: "Customer service tools", count: employees.filter(emp => emp.role === "Support").length, color: "green" },
    { id: "Compliance", name: "Compliance", description: "Sharia compliance features", count: employees.filter(emp => emp.role === "Compliance").length, color: "orange" },
    { id: "IT Admin", name: "IT Admin", description: "System configuration", count: employees.filter(emp => emp.role === "IT Admin").length, color: "indigo" },
  ];

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
          <span>Employee created successfully! The new employee has been added to the system.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
          <p className="text-slate-600">
            Manage staff members, roles, and permissions for Islamic banking operations
          </p>
        </div>
        <Link 
          href="/dashboard/employees/create"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Employee
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab.name}
              {tab.count !== null && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-purple-100 text-purple-600"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "roles" ? (
        /* Roles & Permissions Tab */
        <div className="space-y-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Role Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div key={role.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-3 h-3 rounded-full bg-${role.color}-500`}></div>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${role.color}-100 text-${role.color}-800`}>
                      {role.count} {role.count === 1 ? 'user' : 'users'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">{role.name}</h4>
                  <p className="text-sm text-slate-600 mb-3">{role.description}</p>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Manage Permissions →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Permission Matrix</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Module</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Admin</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Manager</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Support</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Compliance</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">IT Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    "Dashboard",
                    "Customer Management", 
                    "Account Management",
                    "Islamic Loan Management",
                    "Sharia Compliance",
                    "Reports & Analytics",
                    "System Settings"
                  ].map((module) => (
                    <tr key={module}>
                      <td className="py-3 px-4 font-medium text-slate-900">{module}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`w-4 h-4 rounded-full inline-block ${
                          module.includes("System") ? "bg-slate-300" : "bg-green-500"
                        }`}></span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`w-4 h-4 rounded-full inline-block ${
                          module.includes("Customer") || module.includes("Dashboard") 
                            ? "bg-green-500" : "bg-slate-300"
                        }`}></span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`w-4 h-4 rounded-full inline-block ${
                          module.includes("Sharia") || module.includes("Islamic") || module.includes("Dashboard")
                            ? "bg-green-500" : "bg-slate-300"
                        }`}></span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`w-4 h-4 rounded-full inline-block ${
                          module.includes("System") || module.includes("Dashboard")
                            ? "bg-green-500" : "bg-slate-300"
                        }`}></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Employee List Tabs */
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-gray-700 w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="text-gray-700 pl-10 pr-8 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Departments</option>
                  {departments.slice(1).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white shadow-lg rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-purple-600">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{employee.name}</div>
                            <div className="text-sm text-slate-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                          employee.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                          employee.role === 'Support' ? 'bg-green-100 text-green-800' :
                          employee.role === 'Compliance' ? 'bg-orange-100 text-orange-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {employee.lastLogin || "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-slate-400 hover:text-slate-600">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-slate-400 hover:text-slate-600">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-slate-400 hover:text-red-600"
                            onClick={() => handleDeleteEmployee(employee.id)}
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
        </div>
      )}
    </div>
  );
}
