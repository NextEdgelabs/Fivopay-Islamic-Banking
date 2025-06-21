/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  return (
    <aside className="admin-sidebar">
      <Link
        href="/dashboard"
        className={`admin-sidebar-link${pathname === "/dashboard" ? " active" : ""}`}
      >
        <span>📊</span> Dashboard
      </Link>
      <Link
        href="/dashboard/users"
        className={`admin-sidebar-link${pathname === "/dashboard/users" ? " active" : ""}`}
      >
        <span>👥</span> Users
      </Link>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
}
