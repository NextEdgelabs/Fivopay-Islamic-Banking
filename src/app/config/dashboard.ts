import {
    LayoutDashboardIcon,
    BuildingIcon,
    UsersIcon,
    ShieldCheckIcon,
    WalletIcon,
    BarChart4Icon,
    ClipboardListIcon,
    BanknoteIcon,
    FileCheckIcon,
    UserCircleIcon,
    FileBarChartIcon,
    HandCoinsIcon,
    ReceiptTextIcon,
    ContactIcon,
    BadgeIndianRupeeIcon,
    FileSearch2Icon,
    ListChecksIcon,
    BookUserIcon,
    WalletCardsIcon,
    ScrollTextIcon,
    SquareStackIcon,
    LogOutIcon,
    ArrowDownToLineIcon,
    ArrowUpFromLineIcon,
    RepeatIcon,
    NotebookPenIcon,
    HistoryIcon,
    ClipboardSignatureIcon,
    BookMarkedIcon
  } from "lucide-angular";
  
  const navigation = [
    // ---------------- ADMIN MODULES ----------------
    {
      name: "Executive Dashboard",
      icon: LayoutDashboardIcon,
      path: "/admin/executive-dashboard",
      roles: ["admin"],
      children: [
        { name: "KPI Monitoring", path: "/admin/executive-dashboard/kpi-monitoring", icon: BarChart4Icon, roles: ["admin"] },
        { name: "Growth Analytics", path: "/admin/executive-dashboard/growth-analytics", icon: FileBarChartIcon, roles: ["admin"] },
      ],
    },
    {
      name: "Operations Management",
      icon: BuildingIcon,
      path: "/admin/operations-management",
      roles: ["admin"],
      children: [
        { name: "Branch Management", path: "/admin/operations-management/branch", icon: BanknoteIcon, roles: ["admin"] },
        { name: "Staff Allocation", path: "/admin/operations-management/staff", icon: UsersIcon, roles: ["admin"] },
        { name: "Process Optimization", path: "/admin/operations-management/optimization", icon: ListChecksIcon, roles: ["admin"] },
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
      icon: LayoutDashboardIcon,
      path: "/manager/branch-dashboard",
      roles: ["manager"],
      children: [
        { name: "Performance Monitoring", path: "/manager/branch-dashboard/performance", icon: BarChart4Icon, roles: ["manager"] },
        { name: "Staff Attendance", path: "/manager/branch-dashboard/staff", icon: UsersIcon, roles: ["manager"] },
      ],
    },
    {
      name: "Loan Management",
      icon: BanknoteIcon,
      path: "/manager/loan-management",
      roles: ["manager"],
      children: [
        { name: "Loan Applications", path: "/manager/loan-management/applications", icon: NotebookPenIcon, roles: ["manager"] },
        { name: "Approval Process", path: "/manager/loan-management/approval", icon: FileCheckIcon, roles: ["manager"] },
        { name: "Repayment Tracking", path: "/manager/loan-management/repayment", icon: ReceiptTextIcon, roles: ["manager"] },
      ],
    },
    {
      name: "Customer Relationship",
      icon: UserCircleIcon,
      path: "/manager/customer-relationship",
      roles: ["manager"],
      children: [
        { name: "Feedback Management", path: "/manager/customer-relationship/feedback", icon: ClipboardListIcon, roles: ["manager"] },
        { name: "Query Resolution", path: "/manager/customer-relationship/query", icon: FileSearch2Icon, roles: ["manager"] },
      ],
    },
    {
      name: "Financial Management",
      icon: WalletIcon,
      path: "/manager/financial-management",
      roles: ["manager"],
      children: [
        { name: "Revenue Monitoring", path: "/manager/financial-management/revenue", icon: BadgeIndianRupeeIcon, roles: ["manager"] },
        { name: "Branch Expenses", path: "/manager/financial-management/expenses", icon: BanknoteIcon, roles: ["manager"] },
      ],
    },
  
    // ---------------- CASHIER MODULES ----------------
    {
      name: "Transaction Processing",
      icon: RepeatIcon,
      path: "/cashier/transactions",
      roles: ["cashier"],
      children: [
        { name: "Deposit Entry", path: "/cashier/transactions/deposit", icon: ArrowDownToLineIcon, roles: ["cashier"] },
        { name: "Withdrawal Entry", path: "/cashier/transactions/withdrawal", icon: ArrowUpFromLineIcon, roles: ["cashier"] },
        { name: "Transfer Entry", path: "/cashier/transactions/transfer", icon: RepeatIcon, roles: ["cashier"] },
      ],
    },
    {
      name: "Account Services",
      icon: SquareStackIcon,
      path: "/cashier/account-services",
      roles: ["cashier"],
      children: [
        { name: "Passbook Update", path: "/cashier/account-services/passbook", icon: BookMarkedIcon, roles: ["cashier"] },
        { name: "Balance Inquiry", path: "/cashier/account-services/inquiry", icon: WalletIcon, roles: ["cashier"] },
      ],
    },
    {
      name: "Deposit Services",
      icon: BanknoteIcon,
      path: "/cashier/deposit-services",
      roles: ["cashier"],
      children: [
        { name: "Recurring Deposit Entry", path: "/cashier/deposit-services/recurring", icon: RepeatIcon, roles: ["cashier"] },
        { name: "Fixed Deposit Entry", path: "/cashier/deposit-services/fixed", icon: BanknoteIcon, roles: ["cashier"] },
      ],
    },
    {
      name: "Loan Support",
      icon: HandCoinsIcon,
      path: "/cashier/loan-support",
      roles: ["cashier"],
      children: [
        { name: "Disbursement", path: "/cashier/loan-support/disbursement", icon: ArrowDownToLineIcon, roles: ["cashier"] },
        { name: "EMI Collection", path: "/cashier/loan-support/emi", icon: ReceiptTextIcon, roles: ["cashier"] },
      ],
    },
    {
      name: "Reporting",
      icon: FileBarChartIcon,
      path: "/cashier/reports",
      roles: ["cashier"],
      children: [
        { name: "Daily Summary", path: "/cashier/reports/daily", icon: ClipboardListIcon, roles: ["cashier"] },
        { name: "Transaction Logs", path: "/cashier/reports/logs", icon: HistoryIcon, roles: ["cashier"] },
      ],
    },
  ];
  