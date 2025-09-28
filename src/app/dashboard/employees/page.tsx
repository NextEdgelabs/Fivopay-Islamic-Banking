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
  CheckCircleIcon,
  ShieldCheckIcon,
  CogIcon,
  UserGroupIcon,
  KeyIcon,
  LockClosedIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon as TrashIconSolid,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
import { useAppContext } from "@/app/context/AppContext";

// Permission types
type PermissionType = 'read' | 'create' | 'update' | 'delete';

// Access level types
type AccessLevel = 'none' | 'read_only' | 'read_edit';

// Feature interface
interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  permissions: PermissionType[];
}

// Role interface
interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: Record<string, PermissionType[]>; // featureId -> permissions[]
  accessLevels: Record<string, AccessLevel>; // featureId -> accessLevel
  isDefault?: boolean;
}

// Permission matrix interface
interface PermissionMatrix {
  [roleId: string]: {
    [featureId: string]: PermissionType[];
  };
}

export default function EmployeesPage() {
  const { employees, deleteEmployee } = useAppContext();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Roles and permissions state
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "admin",
      name: "Admin",
      description: "Full system access with all permissions",
      color: "purple",
      permissions: {},
      accessLevels: {},
      isDefault: true
    },
    {
      id: "manager",
      name: "Manager",
      description: "Customer and account management with limited system access",
      color: "blue",
      permissions: {},
      accessLevels: {}
    },
    {
      id: "support",
      name: "Support",
      description: "Customer service tools and basic operations",
      color: "green",
      permissions: {},
      accessLevels: {}
    },
    {
      id: "compliance",
      name: "Compliance",
      description: "compliance features and reporting",
      color: "orange",
      permissions: {},
      accessLevels: {}
    },
    {
      id: "it_admin",
      name: "IT Admin",
      description: "System configuration and technical operations",
      color: "indigo",
      permissions: {},
      accessLevels: {}
    },
  ]);

  const [features, setFeatures] = useState<Feature[]>([
    // Dashboard
    { id: "dashboard", name: "Dashboard", description: "Main dashboard and overview", category: "Core", permissions: ["read"] },
    
    // Customer Management
    { id: "customers", name: "Customer Management", description: "Customer data and profiles", category: "Customer", permissions: ["read", "create", "update"] },
    { id: "customer_intake", name: "Customer Intake", description: "New customer registration", category: "Customer", permissions: ["read", "create"] },
    { id: "customer_list", name: "Customer List", description: "View and search customers", category: "Customer", permissions: ["read"] },
    
    // Account Management
    { id: "accounts", name: "Account Management", description: "Account creation and management", category: "Accounts", permissions: ["read", "create", "update"] },
    { id: "account_creation", name: "Account Creation", description: "Create new accounts", category: "Accounts", permissions: ["read", "create"] },
    { id: "account_verification", name: "Account Verification", description: "Verify account documents", category: "Accounts", permissions: ["read", "update"] },
    
    // Loans
    { id: "loans", name: "Loan Management", description: "Standard loan products and applications", category: "Loans", permissions: ["read", "create", "update"] },
    { id: "loan_applications", name: "Loan Applications", description: "Process loan applications", category: "Loans", permissions: ["read", "create", "update"] },
    { id: "loan_approval", name: "Loan Approval", description: "Approve or reject loans", category: "Loans", permissions: ["read", "update"] },
    { id: "loan_disbursement", name: "Loan Disbursement", description: "Process loan disbursements", category: "Loans", permissions: ["read", "update"] },
    { id: "loan_repayment", name: "Loan Repayment", description: "Track loan repayments", category: "Loans", permissions: ["read", "update"] },
    { id: "loan_products", name: "Loan Products", description: "Manage loan products", category: "Loans", permissions: ["read", "create", "update", "delete"] },
    
    // Deposits
    { id: "deposits", name: "Deposit Management", description: "Standard deposit products", category: "Deposits", permissions: ["read", "create", "update"] },
    { id: "fd_products", name: "Fixed Deposit Products", description: "Manage FD products", category: "Deposits", permissions: ["read", "create", "update", "delete"] },
    { id: "rd_products", name: "Recurring Deposit Products", description: "Manage RD products", category: "Deposits", permissions: ["read", "create", "update", "delete"] },
    
    // Cash Management
    { id: "cash_management", name: "Cash Management", description: "Branch cash operations", category: "Cash", permissions: ["read", "create", "update"] },
    { id: "branch_dashboard", name: "Branch Dashboard", description: "Branch cash overview", category: "Cash", permissions: ["read"] },
    { id: "interbranch", name: "Interbranch Transfers", description: "Transfer between branches", category: "Cash", permissions: ["read", "create", "update"] },
    { id: "liquidity", name: "Liquidity Management", description: "Liquidity monitoring", category: "Cash", permissions: ["read"] },
    { id: "transactions", name: "Transactions", description: "Cash transactions", category: "Cash", permissions: ["read", "create"] },
    { id: "wallet", name: "Digital Wallet", description: "Digital wallet operations", category: "Cash", permissions: ["read", "create", "update"] },
    
    // Billing
    { id: "billing", name: "Billing Management", description: "Billing and invoicing", category: "Billing", permissions: ["read", "create", "update"] },
    { id: "invoices", name: "Invoices", description: "Generate and manage invoices", category: "Billing", permissions: ["read", "create", "update"] },
    { id: "payments", name: "Payments", description: "Payment processing", category: "Billing", permissions: ["read", "create", "update"] },
    { id: "reports", name: "Billing Reports", description: "Billing reports and analytics", category: "Billing", permissions: ["read"] },
    { id: "configuration", name: "Billing Configuration", description: "Configure billing rules", category: "Billing", permissions: ["read", "create", "update", "delete"] },
    
    // Reports
    { id: "reports_analytics", name: "Reports & Analytics", description: "System reports and analytics", category: "Reports", permissions: ["read"] },
    { id: "financial_reports", name: "Financial Reports", description: "Financial reporting", category: "Reports", permissions: ["read"] },
    { id: "operational_reports", name: "Operational Reports", description: "Operational reporting", category: "Reports", permissions: ["read"] },
    { id: "compliance_reports", name: "Compliance Reports", description: "Compliance reporting", category: "Reports", permissions: ["read"] },
    { id: "analytics", name: "Analytics", description: "Data analytics and insights", category: "Reports", permissions: ["read"] },
    
    // NPA Assets
    { id: "npa_assets", name: "NPA Assets", description: "Non-performing assets management", category: "NPA", permissions: ["read", "create", "update"] },
    
    // Insurance
    { id: "insurance", name: "Insurance Management", description: "Insurance products and claims", category: "Insurance", permissions: ["read", "create", "update"] },
    { id: "insurance_products", name: "Insurance Products", description: "Manage insurance products", category: "Insurance", permissions: ["read", "create", "update", "delete"] },
    { id: "insurance_policies", name: "Insurance Policies", description: "Policy management", category: "Insurance", permissions: ["read", "create", "update"] },
    { id: "insurance_claims", name: "Insurance Claims", description: "Claims processing", category: "Insurance", permissions: ["read", "create", "update"] },
    
    // AI Companion
    { id: "ai_companion", name: "AI Companion", description: "AI-powered banking assistant", category: "AI", permissions: ["read"] },
    
    // System Settings
    { id: "system_settings", name: "System Settings", description: "System configuration", category: "System", permissions: ["read", "create", "update", "delete"] },
    { id: "employees", name: "Employee Management", description: "Manage employees and roles", category: "System", permissions: ["read", "create", "update", "delete"] },
    { id: "roles_permissions", name: "Roles & Permissions", description: "Manage roles and permissions", category: "System", permissions: ["read", "create", "update", "delete"] },
  ]);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

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

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id);
    }
  };

  // Role management functions
  const handleCreateRole = () => {
    setEditingRole({
      id: "",
      name: "",
      description: "",
      color: "blue",
      permissions: {},
      accessLevels: {}
    });
    setShowRoleModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role });
    setShowRoleModal(true);
  };

  const handleSaveRole = () => {
    if (!editingRole || !editingRole.name.trim()) return;

    if (editingRole.id) {
      // Update existing role
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id ? editingRole : role
      ));
    } else {
      // Create new role
      const newRole = {
        ...editingRole,
        id: `role_${Date.now()}`,
        permissions: {},
        accessLevels: {}
      };
      setRoles(prev => [...prev, newRole]);
    }
    setShowRoleModal(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm("Are you sure you want to delete this role? This will affect all employees with this role.")) {
      setRoles(prev => prev.filter(role => role.id !== roleId));
    }
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionModal(true);
  };

  const handleAccessLevelChange = (featureId: string, accessLevel: AccessLevel) => {
    if (!selectedRole) return;

    const updatedRole = { ...selectedRole };
    updatedRole.accessLevels[featureId] = accessLevel;

    // Update permissions based on access level
    if (accessLevel === 'none') {
      updatedRole.permissions[featureId] = [];
    } else if (accessLevel === 'read_only') {
      updatedRole.permissions[featureId] = ['read'];
    } else if (accessLevel === 'read_edit') {
      updatedRole.permissions[featureId] = ['read', 'create', 'update', 'delete'];
    }

    setSelectedRole(updatedRole);
    setRoles(prev => prev.map(role => role.id === updatedRole.id ? updatedRole : role));
  };

  const getPermissionColor = (permission: PermissionType) => {
    switch (permission) {
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-stripe-background-dark text-stripe-text-secondary';
    }
  };

  const getAccessLevelColor = (accessLevel: AccessLevel) => {
    switch (accessLevel) {
      case 'none': return 'bg-stripe-background-dark text-stripe-text-secondary';
      case 'read_only': return 'bg-blue-100 text-blue-800';
      case 'read_edit': return 'bg-green-100 text-green-800';
      default: return 'bg-stripe-background-dark text-stripe-text-secondary';
    }
  };

  const getRoleColor = (color: string) => {
    const colorMap: Record<string, string> = {
      purple: 'bg-purple-100 text-purple-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      orange: 'bg-orange-100 text-orange-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      pink: 'bg-pink-100 text-pink-800',
    };
    return colorMap[color] || 'bg-stripe-background-dark text-stripe-text-secondary';
  };

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    const headers = [
      'Employee ID',
      'Name',
      'Email',
      'Phone',
      'Position',
      'Department',
      'Role',
      'Status',
      'Join Date',
      'Last Login',
      'Manager',
      'Location'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(employee => [
        employee.id,
        `"${employee.name}"`,
        employee.email,
        employee.phone || '',
        employee.position,
        employee.department,
        employee.role,
        employee.status,
        employee.joinDate || '',
        employee.lastLogin || '',
        employee.manager || '',
        employee.location || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data: any[], filename: string) => {
    // For Excel export, we'll use a simple CSV format that Excel can open
    // In a real application, you might want to use a library like xlsx
    exportToCSV(data, filename.replace('.xlsx', '.csv'));
  };

  const handleExport = (format: 'csv' | 'excel', exportAll: boolean = false) => {
    const dataToExport = exportAll ? employees : filteredEmployees;
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'csv') {
      exportToCSV(dataToExport, `employees_${exportAll ? 'all' : 'filtered'}_${timestamp}.csv`);
    } else {
      exportToExcel(dataToExport, `employees_${exportAll ? 'all' : 'filtered'}_${timestamp}.xlsx`);
    }
    
    setShowExportMenu(false);
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
          <h1 className="text-2xl font-bold text-stripe-text">Employee Management</h1>
          <p className="text-stripe-text-secondary">
            Manage staff members, roles, and permissions for digital banking operations
          </p>
        </div>
        <Link 
          href="/dashboard/employees/create"
          className="btn btn-primary inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Employee
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-stripe-border">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-stripe-primary text-stripe-primary"
                  : "border-transparent text-stripe-text-secondary hover:text-stripe-text hover:border-stripe-border"
              }`}
            >
              {tab.name}
              {tab.count !== null && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-stripe-primary/10 text-stripe-primary"
                    : "bg-stripe-background text-stripe-text-secondary"
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
          {/* Role Management */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-stripe-text">Role Management</h3>
              <button
                onClick={handleCreateRole}
                className="btn btn-primary inline-flex items-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Create Role
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div key={role.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-3 h-3 rounded-full bg-${role.color}-500`}></div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(role.color)}`}>
                        {employees.filter(emp => emp.role === role.name).length} users
                      </span>
                      {role.isDefault && (
                        <span className="text-xs px-2 py-1 rounded-full bg-stripe-background-dark text-stripe-text-secondary">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <h4 className="font-semibold text-stripe-text mb-1">{role.name}</h4>
                  <p className="text-sm text-stripe-text-secondary mb-3">{role.description}</p>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleManagePermissions(role)}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Manage Permissions
                    </button>
                    <button 
                      onClick={() => handleEditRole(role)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    {!role.isDefault && (
                      <button 
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="card">
            <h3 className="text-lg font-semibold text-stripe-text mb-6">Permission Matrix</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-stripe-border">
                    <th className="text-left py-3 px-4 font-semibold text-stripe-text">Feature</th>
                    {roles.map((role) => (
                      <th key={role.id} className="text-center py-3 px-4 font-semibold text-stripe-text">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {features.map((feature) => (
                    <tr key={feature.id}>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-stripe-text">{feature.name}</div>
                          <div className="text-xs text-stripe-text-secondary">{feature.category}</div>
                        </div>
                      </td>
                      {roles.map((role) => {
                        const accessLevel = role.accessLevels[feature.id] || 'none';
                        const permissions = role.permissions[feature.id] || [];
                        return (
                          <td key={role.id} className="py-3 px-4 text-center">
                            <div className="flex flex-wrap justify-center gap-1">
                              {accessLevel === 'none' ? (
                                <span className="text-xs text-stripe-text-secondary">No access</span>
                              ) : (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(accessLevel)}`}>
                                  {accessLevel === 'read_only' ? 'READ ONLY' : 'READ & EDIT'}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
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
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stripe-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input w-full pl-10"
                />
              </div>
              
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stripe-text-secondary" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="text-stripe-text pl-10 pr-8 py-2 border border-stripe-border rounded-md focus:ring-2 focus:ring-stripe-primary focus:border-stripe-primary"
                >
                  <option value="all">All Departments</option>
                  {departments.slice(1).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Export and Actions Bar */}
          <div className="bg-white shadow-md rounded-lg p-4 border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-stripe-text-secondary">
                  Showing {filteredEmployees.length} of {employees.length} employees
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Export Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="inline-flex items-center px-4 py-2 border border-stripe-border rounded-md text-sm font-medium text-stripe-text bg-white hover:bg-stripe-background-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stripe-primary"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Export
                  </button>
                  
                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-200 z-10">
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs font-medium text-stripe-text-secondary uppercase tracking-wide">
                          Export Current View
                        </div>
                        <button
                          onClick={() => handleExport('csv', false)}
                          className="block w-full text-left px-4 py-2 text-sm text-stripe-text hover:bg-stripe-background-light"
                        >
                          Export as CSV
                        </button>
                        <button
                          onClick={() => handleExport('excel', false)}
                          className="block w-full text-left px-4 py-2 text-sm text-stripe-text hover:bg-stripe-background-light"
                        >
                          Export as Excel
                        </button>
                        
                        <div className="border-t border-slate-200 my-1"></div>
                        
                        <div className="px-4 py-2 text-xs font-medium text-stripe-text-secondary uppercase tracking-wide">
                          Export All Employees
                        </div>
                        <button
                          onClick={() => handleExport('csv', true)}
                          className="block w-full text-left px-4 py-2 text-sm text-stripe-text hover:bg-stripe-background-light"
                        >
                          Export All as CSV
                        </button>
                        <button
                          onClick={() => handleExport('excel', true)}
                          className="block w-full text-left px-4 py-2 text-sm text-stripe-text hover:bg-stripe-background-light"
                        >
                          Export All as Excel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <Link
                  href="/dashboard/employees/create"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Employee
                </Link>
              </div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-stripe-background">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-stripe-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-stripe-background-light">
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
                            <div className="text-sm font-medium text-stripe-text">{employee.name}</div>
                            <div className="text-sm text-stripe-text-secondary">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text-secondary">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stripe-text-secondary">
                        {employee.lastLogin || "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-stripe-text-secondary hover:text-stripe-text">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-stripe-text-secondary hover:text-stripe-text">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-stripe-text-secondary hover:text-red-600"
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

      {/* Role Modal */}
      {showRoleModal && editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-stripe-text">
                {editingRole.id ? 'Edit Role' : 'Create Role'}
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-stripe-text-secondary hover:text-stripe-text"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">Role Name</label>
                <input
                  type="text"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">Description</label>
                <textarea
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter role description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stripe-text mb-1">Color</label>
                <select
                  value={editingRole.color}
                  onChange={(e) => setEditingRole({ ...editingRole, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="orange">Orange</option>
                  <option value="indigo">Indigo</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="pink">Pink</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-stripe-text border border-stripe-border rounded-lg hover:bg-stripe-background-light"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {editingRole.id ? 'Update' : 'Create'} Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {showPermissionModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-stripe-text">
                Manage Permissions: {selectedRole.name}
              </h3>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="text-stripe-text-secondary hover:text-stripe-text"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(
                features.reduce((acc, feature) => {
                  if (!acc[feature.category]) acc[feature.category] = [];
                  acc[feature.category].push(feature);
                  return acc;
                }, {} as Record<string, Feature[]>)
              ).map(([category, categoryFeatures]) => (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-stripe-text mb-4">{category}</h4>
                  <div className="space-y-4">
                    {categoryFeatures.map((feature) => (
                      <div key={feature.id} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h5 className="font-medium text-stripe-text">{feature.name}</h5>
                            <p className="text-sm text-stripe-text-secondary">{feature.description}</p>
                          </div>
                        </div>
                                                 <div className="flex items-center space-x-4">
                           <label className="flex items-center space-x-2">
                             <input
                               type="radio"
                               name={`access_${feature.id}`}
                               value="none"
                               checked={(selectedRole.accessLevels[feature.id] || 'none') === 'none'}
                               onChange={(e) => handleAccessLevelChange(feature.id, e.target.value as AccessLevel)}
                               className="text-purple-600 focus:ring-purple-500"
                             />
                             <span className="text-sm text-stripe-text-secondary">No Access</span>
                           </label>
                           <label className="flex items-center space-x-2">
                             <input
                               type="radio"
                               name={`access_${feature.id}`}
                               value="read_only"
                               checked={(selectedRole.accessLevels[feature.id] || 'none') === 'read_only'}
                               onChange={(e) => handleAccessLevelChange(feature.id, e.target.value as AccessLevel)}
                               className="text-purple-600 focus:ring-purple-500"
                             />
                             <span className={`text-sm px-2 py-1 rounded-full ${getAccessLevelColor('read_only')}`}>
                               Read Only
                             </span>
                           </label>
                           <label className="flex items-center space-x-2">
                             <input
                               type="radio"
                               name={`access_${feature.id}`}
                               value="read_edit"
                               checked={(selectedRole.accessLevels[feature.id] || 'none') === 'read_edit'}
                               onChange={(e) => handleAccessLevelChange(feature.id, e.target.value as AccessLevel)}
                               className="text-purple-600 focus:ring-purple-500"
                             />
                             <span className={`text-sm px-2 py-1 rounded-full ${getAccessLevelColor('read_edit')}`}>
                               Read & Edit
                             </span>
                           </label>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
}
