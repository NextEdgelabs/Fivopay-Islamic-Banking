"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  DocumentTextIcon,
  CalculatorIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { SettingsProvider } from "./settings/context/SettingsContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
  { name: "Customer Management", href: "/dashboard/customers", icon: UserIcon },
  {
    name: "Field Agent Management",
    href: "/dashboard/field-agents",
    icon: UserGroupIcon,
    subItems: [
      {
        name: "Agent Dashboard",
        href: "/dashboard/field-agents",
        icon: UserGroupIcon,
      },
      {
        name: "Collection Management",
        href: "/dashboard/field-agents/collections",
        icon: BanknotesIcon,
      },
      {
        name: "Customer Assignments",
        href: "/dashboard/field-agents/assignments",
        icon: UserIcon,
      },
      {
        name: "Collection Reports",
        href: "/dashboard/field-agents/reports",
        icon: DocumentChartBarIcon,
      },
    ],
  },
  {
    name: "Employee Management",
    href: "/dashboard/employees",
    icon: UserGroupIcon,
  },
  {
    name: "Branch Management",
    href: "/dashboard/branch-management",
    icon: BuildingOfficeIcon,
  },
  {
    name: "Loan Management",
    href: "/dashboard/loans",
    icon: BanknotesIcon,
    subItems: [
      {
        name: "Product Management",
        href: "/dashboard/loans/products",
        icon: BanknotesIcon,
      },
      {
        name: "Loan Application Management",
        href: "/dashboard/loans/applications",
        icon: BanknotesIcon,
      },
      {
        name: "Approval Process Journey",
        href: "/dashboard/loans/approval",
        icon: BanknotesIcon,
      },
      {
        name: "Disbursement Journey",
        href: "/dashboard/loans/disbursement",
        icon: BanknotesIcon,
      },
      {
        name: "Repayment Journey",
        href: "/dashboard/loans/repayment",
        icon: BanknotesIcon,
      },
    ],
  },
  {
    name:"NPA Assets",
    href:"/dashboard/npa-assets",
    icon:BanknotesIcon,
    subItems:[
      {name:"NPA Assets",href:"/dashboard/npa-assets/npa-assets",icon:BanknotesIcon},
    ]
  },
  {
    name:"AI Companion",
    href:"/dashboard/ai-companion",
    icon:ChatBubbleLeftRightIcon,
  },
  {
    name: "Account Management",
    href: "/dashboard/account-management",
    icon: CreditCardIcon,
    subItems: [
      {
        name: "Account Creation",
        href: "/dashboard/account-management/account-creation",
        icon: CreditCardIcon,
      },
      {
        name: "Account Verification",
        href: "/dashboard/account-management/account-verification",
        icon: CreditCardIcon,
      },
    ],
  },
  {
    name: "Deposit Management",
    href: "/dashboard/deposit-management",
    icon: BanknotesIcon,
    subItems: [
      {
        name: "FD Product",
        href: "/dashboard/deposit-management/fd-product-management",
        icon: BanknotesIcon,
      },
      {
        name: "RD Product",
        href: "/dashboard/deposit-management/rd-product-management",
        icon: BanknotesIcon,
      },
    ],
  },
  {
    name: "Cash Management",
    href: "/dashboard/cash-management",
    icon: BanknotesIcon,
    subItems: [
      {
        name: "Digital Wallet",
        href: "/dashboard/cash-management/wallet",
        icon: WalletIcon,
      },
      {
        name: "Transactions",
        href: "/dashboard/cash-management/transactions",
        icon: ArrowsRightLeftIcon,
      },
      {
        name: "Branch Dashboard",
        href: "/dashboard/cash-management/branch-dashboard",
        icon: PresentationChartLineIcon,
      },
      {
        name: "Liquidity Report",
        href: "/dashboard/cash-management/liquidity",
        icon: DocumentChartBarIcon,
      },
      {
        name: "Interbranch Transactions",
        href: "/dashboard/cash-management/interbranch",
        icon: ArrowPathIcon,
      },
    ],
  },
  {
    name: "Insurance Management",
    href: "/dashboard/insurance-management",
    icon: BanknotesIcon,
    subItems: [
      {
        name: "Insurance Product",
        href: "/dashboard/insurance-management/insurance-product",
        icon: BanknotesIcon,
      },
      {
        name: "Insurance Policy",
        href: "/dashboard/insurance-management/insurance-policy",
        icon: BanknotesIcon,
      },
      {
        name: "Insurance Claim",
        href: "/dashboard/insurance-management/insurance-claim",
        icon: BanknotesIcon,
      },
    ],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: ClipboardDocumentListIcon,
    subItems: [
      {
        name: "Financial Reports",
        href: "/dashboard/reports/financial",
        icon: DocumentTextIcon,
      },
      {
        name: "Operational Reports",
        href: "/dashboard/reports/operational",
        icon: DocumentTextIcon,
      },
      {
        name: "Compliance Reports",
        href: "/dashboard/reports/compliance",
        icon: DocumentTextIcon,
      },
      {
        name: "Analytics Dashboard",
        href: "/dashboard/reports/analytics",
        icon: ChartBarIcon,
      },
    ],
  },
  {
    name: "Billing Engine",
    href: "/dashboard/billing",
    icon: CalculatorIcon,
    subItems: [
      {
        name: "Billing Configuration",
        href: "/dashboard/billing/configuration",
        icon: CalculatorIcon,
      },
      {
        name: "Invoice Management",
        href: "/dashboard/billing/invoices",
        icon: DocumentTextIcon,
      },
      {
        name: "Payment Processing",
        href: "/dashboard/billing/payments",
        icon: BanknotesIcon,
      },
      {
        name: "Billing Reports",
        href: "/dashboard/billing/reports",
        icon: DocumentChartBarIcon,
      },
    ],
  },
  { name: "Security", href: "/dashboard/security", icon: ShieldCheckIcon },
  { name: "Settings", href: "/dashboard/settings", icon: CogIcon },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Get user data from localStorage
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

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
    navigation.forEach((item) => {
      if (item.subItems && pathname.startsWith(item.href + "/")) {
        shouldExpand.push(item.name);
      }
    });
    return shouldExpand;
  };

  // Initialize expanded items based on current path
  useEffect(() => {
    const autoExpanded = autoExpandParents();
    if (autoExpanded.length > 0) {
      setExpandedItems(autoExpanded);
    }
  }, [pathname, autoExpandParents]);

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
    <aside className="fixed top-0 left-0 w-68 bg-white border-r border-stripe-border h-screen flex flex-col shadow-stripe-sm">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 p-6 border-b border-stripe-border">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-stripe-primary rounded-stripe flex items-center justify-center">
            <img src="/logo.jpeg" alt="FivoPay Logo" className="w-full h-full object-cover rounded-stripe" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-stripe-text">FivoPay</h1>
            <p className="text-xs text-stripe-text-secondary">Digital Banking</p>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable with hidden scrollbar */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="p-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              // Fix highlighting logic: Dashboard should only be active when exactly on /dashboard
              // Other items should be active when on their path or sub-paths
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");

              const isExpanded =
                expandedItems.includes(item.name) ||
                (item.subItems && pathname.startsWith(item.href + "/"));

              return (
                <li key={item.name}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-stripe transition-colors duration-200 flex-1 ${
                        isActive
                          ? "bg-stripe-primary text-white shadow-stripe-sm"
                          : "text-stripe-text-secondary hover:bg-gray-50 hover:text-stripe-text"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>

                    {/* Dropdown toggle button for items with subitems */}
                    {item.subItems && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExpanded(item.name);
                        }}
                        className="p-2 text-stripe-text-muted hover:text-stripe-text transition-colors duration-200"
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
                  {item.subItems && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="mt-2 ml-4 space-y-1">
                        {item.subItems.map((subItem, index) => {
                          const isSubActive = pathname === subItem.href;
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
                                href={subItem.href}
                                className={`flex items-center px-4 py-2 text-xs font-medium rounded-stripe transition-colors duration-200 ${
                                  isSubActive
                                    ? "bg-stripe-info-light text-stripe-primary border-l-2 border-stripe-primary"
                                    : "text-stripe-text-muted hover:bg-gray-50 hover:text-stripe-text"
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
      <div className="flex-shrink-0 p-6 border-t border-stripe-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-stripe-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{getUserInitials()}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-stripe-text">{getUserDisplayName()}</p>
            <p className="text-xs text-stripe-text-secondary">{userEmail || 'user@fivopay.com'}</p>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center text-stripe-text-secondary hover:text-stripe-text text-sm w-full transition-colors duration-200"
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
    <header className="bg-white border-b border-stripe-border h-16 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-stripe-text">
          Banking Administration
        </h2>
        <p className="text-sm text-stripe-text-secondary">
          Regulatory-compliant Banking as a Service
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-stripe-success-light px-3 py-1 rounded-stripe border border-green-200">
          <div className="w-2 h-2 bg-stripe-success rounded-full"></div>
          <span className="text-sm font-medium text-green-700">
            Regulatory Compliant
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
    <SettingsProvider>
        <div className="flex min-h-screen bg-stripe-background">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-68">
            <Header />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-y-auto">{children}</main>
          </div>
        </div>
    </SettingsProvider>
  );
}
