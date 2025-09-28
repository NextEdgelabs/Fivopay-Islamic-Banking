"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

// ... (navigation array is unchanged)

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // ... (rest of the component is unchanged)

  return (
    <aside className="fixed top-0 left-0 w-64 bg-light text-dark h-screen flex flex-col border-r border-secondary-dark shadow-sm">
      {/* ... (rest of the component is unchanged) */}
    </aside>
  );
}
