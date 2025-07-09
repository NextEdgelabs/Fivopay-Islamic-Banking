"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChartBarIcon,
  UserIcon,
  UserGroupIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  ArrowLeftOnRectangleIcon,
  BanknotesIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  WalletIcon,
  ArrowsRightLeftIcon,
  PresentationChartLineIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
  CreditCardIcon,
  // Additional icons for the new navigation structure
  HomeIcon,
  UsersIcon,
  ChartBarSquareIcon,
  DocumentChartBarIcon as FileBarChartIcon,
  ClipboardDocumentCheckIcon as ListChecksIcon,
  UserIcon as BookUserIcon,
  ClipboardDocumentIcon as ClipboardSignatureIcon,
  UserGroupIcon as ContactIcon,
  DocumentTextIcon as ScrollTextIcon,
  ClockIcon as HistoryIcon,
  CheckIcon as FileCheckIcon,
  CreditCardIcon as WalletCardsIcon,
  CurrencyDollarIcon as HandCoinsIcon,
  DocumentTextIcon as ReceiptTextIcon,
  MagnifyingGlassIcon as FileSearch2Icon,
  PencilSquareIcon as NotebookPenIcon,
  UserCircleIcon,
  CurrencyDollarIcon as BadgeIndianRupeeIcon,
  ArrowPathIcon as RepeatIcon,
  ArrowDownTrayIcon as ArrowDownToLineIcon,
  ArrowUpTrayIcon as ArrowUpFromLineIcon,
  Squares2X2Icon as SquareStackIcon,
  BookmarkIcon as BookMarkedIcon,
} from "@heroicons/react/24/outline";

// Role-based navigation configuration
const navigationConfig = [
  // ---------------- ADMIN MODULES ----------------
  {
    name: "Executive Dashboard",
    icon: HomeIcon,
    path: "/dashboard/executive-dashboard",
    roles: ["admin"],
    children: [
      { name: "Strategic Planning", path: "/dashboard/executive-dashboard/strategic-planning", icon: ChartBarSquareIcon, roles: ["admin"] },
      { name: "Executive Reports", path: "/dashboard/executive-dashboard/executive-reports", icon: FileBarChartIcon, roles: ["admin"] },
    ],
  },
  {
    name: "Operations Management",
    icon: BuildingOfficeIcon,
    path: "/dashboard/operations-management",
    roles: ["admin"],
    children: [
      { name: "Loan Processing", path: "/dashboard/operations-management/branch", icon: BanknotesIcon, roles: ["admin"] },
      { name: "Staff Allocation", path: "/dashboard/operations-management/staff", icon: UsersIcon, roles: ["admin"] },
      { name: "Process Optimization", path: "/dashboard/operations-management/optimization", icon: ListChecksIcon, roles: ["admin"] },
    ],
  },
  {
    name: "Customer Management",
    icon: UsersIcon,
    path: "/admin/customer-management",
    roles: ["admin"],
    children: [
      { name: "Customer Onboarding", path: "/admin/customer-management/onboarding", icon: BookUserIcon, roles: ["admin"] },
      { name: "KYC Verification", path: "/admin/customer-management/kyc", icon: ClipboardSignatureIcon, roles: ["admin"] },
      { name: "Member Directory", path: "/admin/customer-management/directory", icon: ContactIcon, roles: ["admin"] },
    ],
  },
  {
    name: "Compliance & Audit",
    icon: ShieldCheckIcon,
    path: "/admin/compliance-audit",
    roles: ["admin"],
    children: [
      { name: "Policy Management", path: "/admin/compliance-audit/policy", icon: ScrollTextIcon, roles: ["admin"] },
      { name: "Audit Trails", path: "/admin/compliance-audit/trails", icon: HistoryIcon, roles: ["admin"] },
      { name: "Regulatory Reporting", path: "/admin/compliance-audit/regulatory", icon: FileCheckIcon, roles: ["admin"] },
    ],
  },
  {
    name: "Financial Management",
    icon: WalletIcon,
    path: "/admin/financial-management",
    roles: ["admin"],
    children: [
      { name: "Budgeting", path: "/admin/financial-management/budgeting", icon: WalletCardsIcon, roles: ["admin"] },
      { name: "Fund Allocation", path: "/admin/financial-management/allocation", icon: HandCoinsIcon, roles: ["admin"] },
      { name: "Financial Reporting", path: "/admin/financial-management/reporting", icon: FileBarChartIcon, roles: ["admin"] },
    ],
  },

  // ---------------- BRANCH MANAGER MODULES ----------------
  {
    name: "Branch Dashboard",
    icon: HomeIcon,
    path: "/manager/branch-dashboard",
    roles: ["branch_manager"],
    children: [
      { name: "Performance Monitoring", path: "/manager/branch-dashboard/performance", icon: ChartBarSquareIcon, roles: ["branch_manager"] },
      { name: "Staff Attendance", path: "/manager/branch-dashboard/staff", icon: UsersIcon, roles: ["branch_manager"] },
    ],
  },
  {
    name: "Loan Management",
    icon: BanknotesIcon,
    path: "/manager/loan-management",
    roles: ["branch_manager"],
    children: [
      { name: "Loan Applications", path: "/manager/loan-management/applications", icon: NotebookPenIcon, roles: ["branch_manager"] },
      { name: "Approval Process", path: "/manager/loan-management/approval", icon: FileCheckIcon, roles: ["branch_manager"] },
      { name: "Repayment Tracking", path: "/manager/loan-management/repayment", icon: ReceiptTextIcon, roles: ["branch_manager"] },
    ],
  },
  {
    name: "Customer Relationship",
    icon: UserCircleIcon,
    path: "/manager/customer-relationship",
    roles: ["branch_manager"],
    children: [
      { name: "Feedback Management", path: "/manager/customer-relationship/feedback", icon: ClipboardDocumentListIcon, roles: ["branch_manager"] },
      { name: "Query Resolution", path: "/manager/customer-relationship/query", icon: FileSearch2Icon, roles: ["branch_manager"] },
    ],
  },
  {
    name: "Financial Management",
    icon: WalletIcon,
    path: "/manager/financial-management",
    roles: ["branch_manager"],
    children: [
      { name: "Revenue Monitoring", path: "/manager/financial-management/revenue", icon: BadgeIndianRupeeIcon, roles: ["branch_manager"] },
      { name: "Branch Expenses", path: "/manager/financial-management/expenses", icon: BanknotesIcon, roles: ["branch_manager"] },
    ],
  },

  // ---------------- CASHIER MODULES ----------------
  {
    name: "Transaction Processing",
    icon: RepeatIcon,
    path: "/cashier/transactions",
    roles: ["branch_cashier"],
    children: [
      { name: "Deposit Entry", path: "/cashier/transactions/deposit", icon: ArrowDownToLineIcon, roles: ["branch_cashier"] },
      { name: "Withdrawal Entry", path: "/cashier/transactions/withdrawal", icon: ArrowUpFromLineIcon, roles: ["branch_cashier"] },
      { name: "Transfer Entry", path: "/cashier/transactions/transfer", icon: RepeatIcon, roles: ["branch_cashier"] },
    ],
  },
  {
    name: "Account Services",
    icon: SquareStackIcon,
    path: "/cashier/account-services",
    roles: ["branch_cashier"],
    children: [
      { name: "Passbook Update", path: "/cashier/account-services/passbook", icon: BookMarkedIcon, roles: ["branch_cashier"] },
      { name: "Balance Inquiry", path: "/cashier/account-services/inquiry", icon: WalletIcon, roles: ["branch_cashier"] },
    ],
  },
  {
    name: "Deposit Services",
    icon: BanknotesIcon,
    path: "/cashier/deposit-services",
    roles: ["branch_cashier"],
    children: [
      { name: "Recurring Deposit Entry", path: "/cashier/deposit-services/recurring", icon: RepeatIcon, roles: ["branch_cashier"] },
      { name: "Fixed Deposit Entry", path: "/cashier/deposit-services/fixed", icon: BanknotesIcon, roles: ["branch_cashier"] },
    ],
  },
  {
    name: "Loan Support",
    icon: HandCoinsIcon,
    path: "/cashier/loan-support",
    roles: ["branch_cashier"],
    children: [
      { name: "Disbursement", path: "/cashier/loan-support/disbursement", icon: ArrowDownToLineIcon, roles: ["branch_cashier"] },
      { name: "EMI Collection", path: "/cashier/loan-support/emi", icon: ReceiptTextIcon, roles: ["branch_cashier"] },
    ],
  },
  {
    name: "Reporting",
    icon: FileBarChartIcon,
    path: "/cashier/reports",
    roles: ["branch_cashier"],
    children: [
      { name: "Daily Summary", path: "/cashier/reports/daily", icon: ClipboardDocumentListIcon, roles: ["branch_cashier"] },
      { name: "Transaction Logs", path: "/cashier/reports/logs", icon: HistoryIcon, roles: ["branch_cashier"] },
    ],
  },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Get user data from localStorage
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

  // Filter navigation based on user role
  const filteredNavigation = navigationConfig.filter(item => 
    item.roles.includes(userRole || '')
  );

  // Get user display name based on role
  const getUserDisplayName = () => {
    switch (userRole) {
      case 'admin':
        return 'System Administrator';
      case 'branch_manager':
        return 'Branch Manager';
      case 'branch_cashier':
        return 'Branch Cashier';
      default:
        return 'User';
    }
  };

  const getUserInitials = () => {
    switch (userRole) {
      case 'admin':
        return 'SA';
      case 'branch_manager':
        return 'BM';
      case 'branch_cashier':
        return 'BC';
      default:
        return 'U';
    }
  };

  // Auto-expand parent items if we're on a sub-page
  const autoExpandParents = () => {
    const shouldExpand: string[] = [];
    filteredNavigation.forEach((item) => {
      if (item.children && pathname.startsWith(item.path + "/")) {
        shouldExpand.push(item.name);
      }
    });
    return shouldExpand;
  };

  // Initialize expanded items based on current path
  useState(() => {
    const autoExpanded = autoExpandParents();
    if (autoExpanded.length > 0) {
      setExpandedItems(autoExpanded);
    }
  });

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleSignOut = () => {
    // Clear any stored user data/session
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <aside className="fixed top-0 left-0 w-68 bg-slate-900 text-white h-screen flex flex-col">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FP</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">FivoPay</h1>
            <p className="text-xs text-slate-400">Ethical Banking</p>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable with hidden scrollbar */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-6">
          <ul className="space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
              const isExpanded = expandedItems.includes(item.name) || (item.children && pathname.startsWith(item.path + "/"));

              return (
                <li key={item.name}>
                  <div className="flex items-center">
                    <Link
                      href={item.path}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex-1 ${
                        isActive
                          ? "bg-slate-800 text-white border-r-2 border-blue-500"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>

                    {/* Dropdown toggle button for items with children */}
                    {item.children && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExpanded(item.name);
                        }}
                        className="p-2 text-slate-400 hover:text-white transition-colors duration-200"
                      >
                        <div
                          className={`transform transition-transform duration-200 ${
                            isExpanded ? "rotate-90" : "rotate-0"
                          }`}
                        >
                          <ChevronRightIcon className="h-4 w-4" />
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Render sub-items with smooth transition */}
                  {item.children && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="mt-2 ml-4 space-y-1">
                        {item.children.map((subItem, index) => {
                          const isSubActive = pathname === subItem.path;
                          return (
                            <div
                              key={subItem.name}
                              className={`transform transition-all duration-200 ${
                                isExpanded
                                  ? "translate-x-0 opacity-100"
                                  : "-translate-x-2 opacity-0"
                              }`}
                              style={{
                                transitionDelay: isExpanded
                                  ? `${index * 50}ms`
                                  : "0ms",
                              }}
                            >
                              <Link
                                href={subItem.path}
                                className={`flex items-center px-4 py-2 text-xs font-medium rounded-md transition-colors duration-200 ${
                                  isSubActive
                                    ? "bg-slate-700 text-white border-r-2 border-blue-400"
                                    : "text-slate-400 hover:bg-slate-700 hover:text-white"
                                }`}
                              >
                                <subItem.icon className="mr-3 h-4 w-4" />
                                {subItem.name}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User Menu - Fixed at bottom */}
      <div className="flex-shrink-0 p-6 border-t border-slate-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">{getUserInitials()}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{getUserDisplayName()}</p>
            <p className="text-xs text-slate-400">{userEmail || 'user@fivopay.com'}</p>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center text-slate-300 hover:text-white text-sm w-full"
        >
          <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm h-16 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Banking Administration
        </h2>
        <p className="text-sm text-slate-600">
          Sharia-compliant Banking as a Service
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">
            Sharia Compliant
          </span>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-68">
        <Header />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
