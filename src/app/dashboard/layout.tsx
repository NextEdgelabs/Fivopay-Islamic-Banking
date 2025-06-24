"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@heroicons/react/24/outline";
import { CreditCardIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
  { name: "Customer Management", href: "/dashboard/customers", icon: UserIcon },
  {
    name: "Employee Management",
    href: "/dashboard/employees",
    icon: UserGroupIcon,
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
    ],
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
    name: "Reports",
    href: "/dashboard/reports",
    icon: ClipboardDocumentListIcon,
  },
  { name: "Security", href: "/dashboard/security", icon: ShieldCheckIcon },
  { name: "Settings", href: "/dashboard/settings", icon: CogIcon },
];

function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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

  return (
    <aside className="fixed top-0 left-0 w-64 bg-slate-900 text-white h-screen overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
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

      {/* Navigation */}
      <nav className="p-6 flex-1 overflow-y-auto">
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
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex-1 ${
                      isActive
                        ? "bg-slate-800 text-white border-r-2 border-blue-500"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
      </nav>

      {/* User Menu */}
      <div className="absolute bottom-0 w-64 p-6 border-t border-slate-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-400">System Admin</p>
          </div>
        </div>
        <button className="flex items-center text-slate-300 hover:text-white text-sm w-full">
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
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
