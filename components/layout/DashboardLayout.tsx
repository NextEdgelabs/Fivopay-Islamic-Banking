"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Avatar, Modal } from "@/components/ui";
import { getCurrentUser, isAuthenticated, clearAuth } from "@/lib/auth";
import {
  Menu,
  Home,
  Users,
  Building,
  Briefcase,
  Package,
  Settings,
  LogOut,
  Bell,
  Search,
  AlertTriangle,
  FileText,
  BookOpen,
  Book,
  Calculator,
  BarChart3,
  Banknote,
  NotebookPen,
  Bot,
  Group,
  List,
  IndianRupee,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  // Handle keyboard shortcuts for logout modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showLogoutModal) {
        if (event.key === "Escape") {
          setShowLogoutModal(false);
        } else if (event.key === "Enter") {
          clearAuth();
          setShowLogoutModal(false);
          router.push("/login");
        }
      }
    };

    if (showLogoutModal) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showLogoutModal, router]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Clear authentication data
    clearAuth();

    // Close modal and redirect to login page
    setShowLogoutModal(false);
    router.push("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-500 rounded-stripe flex items-center justify-center mx-auto mb-4">
            <span className="text-sm font-bold text-white">FP</span>
          </div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-border-light transition-all duration-300 flex flex-col fixed h-screen z-30`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-light">
          {sidebarOpen ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-stripe flex items-center justify-center">
                <span className="text-sm font-bold text-white">FP</span>
              </div>
              <span className="font-bold text-neutral-900">FivoPay</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="w-8 h-8 bg-primary-500 rounded-stripe flex items-center justify-center mx-auto"
            >
              <span className="text-sm font-bold text-white">FP</span>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            sidebarOpen={sidebarOpen}
            href="/dashboard"
          />
          <NavItem
            icon={<Users className="h-5 w-5" />}
            label="Employees"
            sidebarOpen={sidebarOpen}
            href="/employees"
          />
          <NavItem
            icon={<Users className="h-5 w-5" />}
            label="Agents"
            sidebarOpen={sidebarOpen}
            href="/agents"
          />
          <NavItem
            icon={<Users className="h-5 w-5" />}
            label="Customers"
            sidebarOpen={sidebarOpen}
            href="/customers"
          />
          <NavItem
            icon={<Building className="h-5 w-5" />}
            label="Branches"
            sidebarOpen={sidebarOpen}
            href="/branches"
          />
          <NavItem
            icon={<Briefcase className="h-5 w-5" />}
            label="Loans"
            sidebarOpen={sidebarOpen}
            href="/loans"
          />
          {/* <NavItem
            icon={<Banknote className="h-5 w-5" />}
            label="Recovery"
            sidebarOpen={sidebarOpen}
            href="/recovery"
          /> */}
          <NavItem
            icon={<NotebookPen className="h-5 w-5" />}
            label="Deposits"
            sidebarOpen={sidebarOpen}
            href="/deposits"
          />
          <NavItem
            icon={<Package className="h-5 w-5" />}
            label="Products"
            sidebarOpen={sidebarOpen}
            href="/products"
          />
          {/* <NavItem
            icon={<FileText className="h-5 w-5" />}
            label="Reports"
            sidebarOpen={sidebarOpen}
            href="/reports"
          /> */}
          {/* AI Companion Divider */}
          {sidebarOpen ? (
            <div className="pt-4 pb-2">
              <div className="px-3 py-2">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  AI Companion
                </span>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-2 border-t border-border-light mt-2"></div>
          )}
          
          <NavItem
            icon={<Bot className="h-5 w-5" />}
            label="AI Companion"
            sidebarOpen={sidebarOpen}
            href="/ai-companion"
          />
          {}
          {/* Financials Divider */}
          {sidebarOpen ? (
            <div className="pt-4 pb-2">
              <div className="px-3 py-2">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Financials
                </span>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-2 border-t border-border-light mt-2"></div>
          )}
          
          <NavItem
            icon={<BookOpen className="h-5 w-5" />}
            label="General Ledger"
            sidebarOpen={sidebarOpen}
            href="/general-ledger"
          />
          <NavItem
            icon={<Book className="h-5 w-5" />}
            label="Subledger"
            sidebarOpen={sidebarOpen}
            href="/sub-ledger"
          />

          <NavItem
            icon={<Calculator className="h-5 w-5" />}
            label="Account Management"
            sidebarOpen={sidebarOpen}
            href="/account-management"
          />
          <NavItem
            icon={<BarChart3 className="h-5 w-5" />}
            label="Reports"
            sidebarOpen={sidebarOpen}
            href="/reports"
          />
          <NavItem
            icon={<Calculator className="h-5 w-5" />}
            label="Balance Sheet"
            sidebarOpen={sidebarOpen}
            href="/balance-sheet"
          />
<NavItem
            icon={<Calculator className="h-5 w-5" />}
            label="Journal Entries"
            sidebarOpen={sidebarOpen}
            href="/journal-entries"
          />
          {/* Joint Liability Group Divider */}
          {sidebarOpen ? (
            <div className="pt-4 pb-2">
              <div className="px-3 py-2">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Joint Liability Group
                </span>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-2 border-t border-border-light mt-2"></div>
          )}
          
          <NavItem
            icon={<Group className="h-5 w-5" />}
            label="Joint Liability Group"
            sidebarOpen={sidebarOpen}
            href="/joint-liability/joint-liability-group"
          />
          <NavItem
            icon={<List className="h-5 w-5" />}
            label="Joint Liability Transactions"
            sidebarOpen={sidebarOpen}
            href="/joint-liability/joint-liability-transactions"
          />
          <NavItem
            icon={<IndianRupee className="h-5 w-5" />}
            label="Joint Liability Loans"
            sidebarOpen={sidebarOpen}
            href="/joint-liability/joint-liability-loans"
          />
          
          {/* Divider below Financials */}
          {sidebarOpen ? (
            <div className="pt-4 pb-2">
              <div className="px-3 py-2">
                <div className="border-t border-border-light"></div>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-2 border-t border-border-light mt-2"></div>
          )}

          
          <NavItem
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            sidebarOpen={sidebarOpen}
            href="/settings"
          />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border-light">
          <div className="flex items-center gap-3">
            <Avatar size="md" fallback={user?.fullName || "User"} />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email || "user@fivopay.com"}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {user?.designation || user?.role || ""}
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <Button
              variant="outline"
              size="sm"
              fullWidth
              className="mt-3"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        {/* Header */}
        <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search customers, transactions..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-stripe text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-stripe transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
            </button>
            <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-stripe transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        title="Confirm Logout"
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Are you sure you want to logout?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                You will need to sign in again to access your account.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={cancelLogout}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Navigation Item Component
function NavItem({
  icon,
  label,
  sidebarOpen,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  sidebarOpen: boolean;
  href: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-stripe transition-colors ${
        isActive
          ? "bg-primary-50 text-primary-600"
          : "text-neutral-700 hover:bg-neutral-100"
      } ${!sidebarOpen ? "justify-center" : ""}`}
    >
      <span className={isActive ? "text-primary-600" : "text-neutral-600"}>
        {icon}
      </span>
      {sidebarOpen && (
        <span
          className={
            isActive ? "text-primary-600 font-medium" : "text-neutral-700"
          }
        >
          {label}
        </span>
      )}
    </Link>
  );
}
