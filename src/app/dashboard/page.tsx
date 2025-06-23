"use client";
import Link from "next/link";
import { 
  UserIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { useAppContext } from "../context/AppContext";

export default function DashboardPage() {
  const { customers, employees } = useAppContext();
  
  // Calculate statistics
  const activeCustomers = customers.filter(c => c.status === "Active").length;
  const pendingCustomers = customers.filter(c => c.status === "Pending").length;
  const kycVerified = customers.filter(c => c.kycStatus === "Verified").length;
  const kycPending = customers.filter(c => c.kycStatus === "Pending" || c.kycStatus === "Under Review").length;
  
  const activeEmployees = employees.filter(e => e.status === "Active").length;
  const shariaCompliant = employees.filter(e => e.shariaCompliant).length;
  const compliancePercentage = employees.length > 0 ? Math.round((shariaCompliant / employees.length) * 100) : 0;

  // Recent customers
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Islamic Banking Dashboard</h1>
      
      {/* Sharia Compliance Status */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sharia Compliance Status</h2>
            <p className="text-slate-600">Overall system compliance with Islamic banking principles</p>
          </div>
          <div className="flex items-center space-x-2">
            {compliancePercentage >= 90 ? (
              <>
                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                <span className="text-green-600 font-medium">Fully Compliant</span>
              </>
            ) : compliancePercentage >= 75 ? (
              <>
                <ShieldCheckIcon className="h-6 w-6 text-yellow-600" />
                <span className="text-yellow-600 font-medium">Partially Compliant</span>
              </>
            ) : (
              <>
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                <span className="text-red-600 font-medium">Compliance Issues</span>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                compliancePercentage >= 90 ? 'bg-green-600' : 
                compliancePercentage >= 75 ? 'bg-yellow-500' : 
                'bg-red-600'
              }`}
              style={{ width: `${compliancePercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-500">0%</span>
            <span className="text-xs font-medium text-slate-700">{compliancePercentage}% Sharia Compliant</span>
            <span className="text-xs text-slate-500">100%</span>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-slate-600">
          <p>
            {compliancePercentage >= 90 
              ? "All banking operations are currently in compliance with Sharia principles." 
              : compliancePercentage >= 75 
              ? "Some operations require review to ensure full Sharia compliance." 
              : "Urgent review needed for multiple operations to meet Sharia requirements."}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Customer Stats */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
              <p className="text-sm font-medium text-slate-600">Total Customers</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <span className="text-green-600 font-medium">{activeCustomers}</span> Active
            </div>
            <div>
              <span className="text-yellow-600 font-medium">{pendingCustomers}</span> Pending
            </div>
            <div>
              <Link href="/dashboard/customers" className="text-blue-600 hover:underline">View All</Link>
            </div>
          </div>
        </div>

        {/* KYC Status */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{kycVerified}</p>
              <p className="text-sm font-medium text-slate-600">KYC Verified</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <span className="text-yellow-600 font-medium">{kycPending}</span> Pending
            </div>
            <div>
              <span className="text-slate-600 font-medium">{Math.round((kycVerified / customers.length) * 100)}%</span> Completion
            </div>
            <div>
              <Link href="/dashboard/customers" className="text-blue-600 hover:underline">Details</Link>
            </div>
          </div>
        </div>

        {/* Employee Stats */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{employees.length}</p>
              <p className="text-sm font-medium text-slate-600">Total Employees</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <span className="text-green-600 font-medium">{activeEmployees}</span> Active
            </div>
            <div>
              <span className="text-green-600 font-medium">{shariaCompliant}</span> Sharia Trained
            </div>
            <div>
              <Link href="/dashboard/employees" className="text-blue-600 hover:underline">View All</Link>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">98.7%</p>
              <p className="text-sm font-medium text-slate-600">System Uptime</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <span className="text-green-600 font-medium">Healthy</span>
            </div>
            <div>
              <span className="text-slate-600 font-medium">Last check: 5m ago</span>
            </div>
            <div>
              <Link href="#" className="text-blue-600 hover:underline">Details</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Customers and Islamic Banking Principles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Customers</h2>
            <Link 
              href="/dashboard/customers"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-medium">{customer.name.charAt(0)}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.accountType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{customer.accountBalance}</p>
                  <p className="text-xs text-slate-500">Joined {customer.joinDate}</p>
                </div>
              </div>
            ))}
            
            {recentCustomers.length === 0 && (
              <div className="text-center py-6">
                <p className="text-slate-500">No customers yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Islamic Banking Principles */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Islamic Banking Principles</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="p-2 bg-green-50 rounded-lg">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">No Interest (Riba)</p>
                <p className="text-xs text-slate-500">
                  All financial products avoid interest-based transactions, complying with Islamic law
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">Profit-Loss Sharing</p>
                <p className="text-xs text-slate-500">
                  Financial transactions based on equitable risk and profit sharing between parties
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 bg-purple-50 rounded-lg">
                <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">Ethical Investments</p>
                <p className="text-xs text-slate-500">
                  All investments screened to ensure they are halal and socially responsible
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 bg-orange-50 rounded-lg">
                <ClockIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">Regular Sharia Audits</p>
                <p className="text-xs text-slate-500">
                  System undergoes regular compliance reviews by qualified Sharia scholars
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
