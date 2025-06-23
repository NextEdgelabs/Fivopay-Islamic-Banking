"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChartBarIcon, 
  UserIcon, 
  UserGroupIcon, 
  CogIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
  { name: "Customer Management", href: "/dashboard/customers", icon: UserIcon },
  { name: "Employee Management", href: "/dashboard/employees", icon: UserGroupIcon },
  { name: "Reports", href: "/dashboard/reports", icon: ClipboardDocumentListIcon },
  { name: "Security", href: "/dashboard/security", icon: ShieldCheckIcon },
  { name: "Settings", href: "/dashboard/settings", icon: CogIcon },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FP</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">FivoPay</h1>
            <p className="text-xs text-slate-400">Islamic Banking</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "bg-slate-800 text-white border-r-2 border-blue-500"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
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
        <h2 className="text-lg font-semibold text-slate-900">Banking Administration</h2>
        <p className="text-sm text-slate-600">Sharia-compliant Banking as a Service</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">Sharia Compliant</span>
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
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
