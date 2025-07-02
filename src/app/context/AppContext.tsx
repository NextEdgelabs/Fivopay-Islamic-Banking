"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our data
export type Employee = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin?: string;
  joinDate: string;
  shariaCompliant?: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  accountType: string;
  kycStatus: 'Verified' | 'Pending' | 'Under Review' | 'Rejected';
  verificationLevel: string;
  joinDate: string;
  lastActivity?: string;
  accountBalance: string;
  status: 'Active' | 'Pending' | 'Inactive';
};

// Interfaces for different loan-related data types
interface LoanApplication {
  id: string;
  applicantName: string;
  loanType: string;
  amount: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  submittedDate: string;
  lastUpdate: string;
  email?: string;
  phone?: string;
  employmentType?: string;
  monthlyIncome?: number;
  loanPurpose?: string;
  tenure?: string;
}

interface LoanProduct {
  id: string;
  name: string;
  type: 'Personal' | 'Business' | 'Home' | 'Vehicle' | 'Education';
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  tenure: string;
  status: 'Active' | 'Inactive' | 'Draft';
  applications: number;
  disbursed: number;
  createdDate: string;
  description: string;
}

interface ApprovalStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending';
  assignee?: string;
  completedDate?: string;
}

interface LoanInApproval {
  id: string;
  applicantName: string;
  productType: string;
  requestedAmount: number;
  currentStage: number;
  submissionDate: string;
  priority: 'High' | 'Medium' | 'Low';
  stages: ApprovalStage[];
}

interface DisbursementStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  completedDate?: string;
  estimatedTime: string;
}

interface Disbursement {
  id: string;
  loanId: string;
  applicantName: string;
  productType: string;
  disbursementAmount: number;
  beneficiaryBank: string;
  accountNumber: string;
  currentStage: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Failed' | 'On Hold';
  scheduledDate: string;
  completedDate?: string;
  stages: DisbursementStage[];
  riskFlags: string[];
  branch?: string;
  contactNumber?: string;
  hasRepaymentSchedule?: boolean;
}

interface Repayment {
  id: string;
  customerName: string;
  loanAccount: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  paidDate?: string;
  receiptUrl?: string;
  branch: string;
  contactNumber: string;
}

// Initial sample data
const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "Ahmed Al-Rashid",
    email: "ahmed.rashid@fivopay.com",
    phone: "+971-50-123-4567",
    position: "Senior Islamic Banking Specialist",
    department: "Sharia Compliance",
    role: "Compliance",
    status: 'Active',
    lastLogin: "2 hours ago",
    joinDate: "2023-03-15",
    shariaCompliant: true,
  },
  {
    id: "EMP-002", 
    name: "Fatima Hassan",
    email: "fatima.hassan@fivopay.com",
    phone: "+971-52-987-6543",
    position: "Customer Relations Manager",
    department: "Customer Service",
    role: "Manager",
    status: 'Active', 
    lastLogin: "1 hour ago",
    joinDate: "2023-01-20",
    shariaCompliant: true,
  },
  {
    id: "EMP-003",
    name: "Omar Ibrahim",
    email: "omar.ibrahim@fivopay.com", 
    phone: "+971-55-456-7890",
    position: "IT Systems Administrator",
    department: "Information Technology",
    role: "IT Admin",
    status: 'Active',
    lastLogin: "30 minutes ago",
    joinDate: "2022-11-10",
    shariaCompliant: true,
  },
  {
    id: "EMP-004",
    name: "Aisha Mohammed",
    email: "aisha.mohammed@fivopay.com",
    phone: "+971-56-234-5678",
    position: "Support Specialist",
    department: "Customer Service", 
    role: "Support",
    status: 'Inactive',
    lastLogin: "3 days ago",
    joinDate: "2023-06-01",
    shariaCompliant: false,
  },
  {
    id: "EMP-005",
    name: "Yusuf Al-Mahmoud", 
    email: "yusuf.mahmoud@fivopay.com",
    phone: "+971-50-876-5432",
    position: "Branch Manager",
    department: "Operations",
    role: "Manager",
    status: 'Active',
    lastLogin: "5 hours ago", 
    joinDate: "2022-08-12",
    shariaCompliant: true,
  },
];

const initialCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Ahmed Al-Mahmoud",
    email: "ahmed.mahmoud@email.com",
    phone: "+971-50-123-4567",
    accountType: "Islamic Savings",
    kycStatus: "Verified",
    verificationLevel: "Level 3",
    joinDate: "2023-11-15",
    lastActivity: "2 hours ago",
    accountBalance: "AED 125,450",
    status: "Active",
  },
  {
    id: "CUST-002",
    name: "Fatima Al-Zahra",
    email: "fatima.zahra@email.com", 
    phone: "+971-52-987-6543",
    accountType: "Islamic Current",
    kycStatus: "Verified",
    verificationLevel: "Level 2",
    joinDate: "2023-10-22",
    lastActivity: "1 day ago",
    accountBalance: "AED 87,320",
    status: "Active",
  },
  {
    id: "CUST-003",
    name: "Omar Hassan",
    email: "omar.hassan@email.com",
    phone: "+971-55-456-7890",
    accountType: "Ijara Financing",
    kycStatus: "Pending",
    verificationLevel: "Level 1",
    joinDate: "2023-12-01",
    lastActivity: "5 days ago",
    accountBalance: "AED 45,600",
    status: "Pending",
  },
  {
    id: "CUST-004",
    name: "Aisha Mohammed",
    email: "aisha.mohammed@email.com",
    phone: "+971-56-234-5678",
    accountType: "Halal Investment",
    kycStatus: "Verified",
    verificationLevel: "Level 3",
    joinDate: "2023-09-10",
    lastActivity: "3 hours ago",
    accountBalance: "AED 234,890",
    status: "Active",
  },
  {
    id: "CUST-005",
    name: "Yusuf Al-Rashid",
    email: "yusuf.rashid@email.com",
    phone: "+971-50-876-5432",
    accountType: "Islamic Savings",
    kycStatus: "Under Review",
    verificationLevel: "Level 2",
    joinDate: "2023-11-28",
    lastActivity: "1 week ago",
    accountBalance: "AED 67,120",
    status: "Inactive",
  },
];

// Create the context
type AppContextType = {
  employees: Employee[];
  customers: Customer[];
  addEmployee: (employee: Omit<Employee, 'id'>) => string;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => string;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  applications: LoanApplication[];
  addApplication: (application: Omit<LoanApplication, 'id' | 'submittedDate' | 'lastUpdate'>) => void;
  updateApplication: (id: string, updates: Partial<LoanApplication>) => void;
  deleteApplication: (id: string) => void;
  products: LoanProduct[];
  addProduct: (product: Omit<LoanProduct, 'id' | 'createdDate' | 'applications' | 'disbursed'>) => void;
  updateProduct: (id: string, updates: Partial<LoanProduct>) => void;
  deleteProduct: (id: string) => void;
  approvals: LoanInApproval[];
  addApproval: (approval: Omit<LoanInApproval, 'id'>) => void;
  updateApproval: (id: string, updates: Partial<LoanInApproval>) => void;
  deleteApproval: (id: string) => void;
  disbursements: Disbursement[];
  addDisbursement: (disbursement: Omit<Disbursement, 'id'>) => void;
  updateDisbursement: (id: string, updates: Partial<Disbursement>) => void;
  deleteDisbursement: (id: string) => void;
  repayments: Repayment[];
  addRepayment: (repayment: Omit<Repayment, 'id'>) => void;
  updateRepayment: (id: string, updates: Partial<Repayment>) => void;
  deleteRepayment: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    // Try to load from localStorage on client side
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fivopay_employees');
      return saved ? JSON.parse(saved) : initialEmployees;
    }
    return initialEmployees;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    // Try to load from localStorage on client side
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fivopay_customers');
      return saved ? JSON.parse(saved) : initialCustomers;
    }
    return initialCustomers;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fivopay_employees', JSON.stringify(employees));
      localStorage.setItem('fivopay_customers', JSON.stringify(customers));
    }
  }, [employees, customers]);

  // Generate a unique ID
  const generateId = (prefix: string) => {
    return `${prefix}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  // Employee CRUD operations
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const id = generateId('EMP');
    const newEmployee = { 
      ...employee, 
      id, 
      joinDate: new Date().toISOString().split('T')[0]
    } as Employee;
    
    setEmployees(prev => [...prev, newEmployee]);
    return id;
  };

  const updateEmployee = (employee: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === employee.id ? employee : emp));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  // Customer CRUD operations
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const id = generateId('CUST');
    const newCustomer = { 
      ...customer, 
      id, 
      joinDate: new Date().toISOString().split('T')[0]
    } as Customer;
    
    setCustomers(prev => [...prev, newCustomer]);
    return id;
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(cust => cust.id === customer.id ? customer : cust));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(cust => cust.id !== id));
  };

  // Loan Application CRUD operations
  const [applications, setApplications] = useState<LoanApplication[]>([
    {
      id: 'APP001',
      applicantName: 'Ahmed Hassan',
      loanType: 'Personal Financing',
      amount: 500000,
      status: 'Under Review',
      submittedDate: '2024-01-25',
      lastUpdate: '2024-01-26',
      email: 'ahmed.hassan@email.com',
      phone: '+91 9876543210',
      employmentType: 'Salaried',
      monthlyIncome: 75000,
      loanPurpose: 'Personal expenses',
      tenure: '24 months'
    },
    {
      id: 'APP002',
      applicantName: 'Fatima Al-Zahra',
      loanType: 'Home Financing',
      amount: 2500000,
      status: 'Approved',
      submittedDate: '2024-01-24',
      lastUpdate: '2024-01-25',
      email: 'fatima.alzahra@email.com',
      phone: '+91 9876543211',
      employmentType: 'Business Owner',
      monthlyIncome: 150000,
      loanPurpose: 'Home purchase',
      tenure: '240 months'
    },
    {
      id: 'APP003',
      applicantName: 'Mohammad Ali',
      loanType: 'Business Financing',
      amount: 750000,
      status: 'Submitted',
      submittedDate: '2024-01-23',
      lastUpdate: '2024-01-23',
      email: 'mohammad.ali@email.com',
      phone: '+91 9876543212',
      employmentType: 'Self Employed',
      monthlyIncome: 100000,
      loanPurpose: 'Business expansion',
      tenure: '36 months'
    }
  ]);

  const addApplication = (application: Omit<LoanApplication, 'id' | 'submittedDate' | 'lastUpdate'>) => {
    const newApplication: LoanApplication = {
      ...application,
      id: generateId('APP'),
      submittedDate: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0],
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplication = (id: string, updates: Partial<LoanApplication>) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, ...updates, lastUpdate: new Date().toISOString().split('T')[0] } : app
    ));
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  // Loan Product CRUD operations
  const [products, setProducts] = useState<LoanProduct[]>([
    {
      id: '1',
      name: 'Halal Personal Loan',
      type: 'Personal',
      minAmount: 50000,
      maxAmount: 1000000,
      interestRate: 0,
      tenure: '6-36 months',
      status: 'Active',
      applications: 156,
      disbursed: 89,
      createdDate: '2024-01-15',
      description: 'Sharia-compliant personal financing based on Murabaha principles'
    },
    {
      id: '2',
      name: 'Islamic Business Financing',
      type: 'Business',
      minAmount: 500000,
      maxAmount: 10000000,
      interestRate: 0,
      tenure: '12-60 months',
      status: 'Active',
      applications: 78,
      disbursed: 45,
      createdDate: '2024-01-10',
      description: 'Profit-sharing business financing based on Musharakah principles'
    },
    {
      id: '3',
      name: 'Home Purchase Plan',
      type: 'Home',
      minAmount: 1000000,
      maxAmount: 50000000,
      interestRate: 0,
      tenure: '60-240 months',
      status: 'Active',
      applications: 234,
      disbursed: 167,
      createdDate: '2024-01-05',
      description: 'Islamic home financing through Ijara (lease-to-own) structure'
    }
  ]);

  const addProduct = (product: Omit<LoanProduct, 'id' | 'createdDate' | 'applications' | 'disbursed'>) => {
    const newProduct: LoanProduct = {
      ...product,
      id: generateId('PRD'),
      createdDate: new Date().toISOString().split('T')[0],
      applications: 0,
      disbursed: 0,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<LoanProduct>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  // Loan Approval CRUD operations
  const [approvals, setApprovals] = useState<LoanInApproval[]>([
    {
      id: 'LN001',
      applicantName: 'Ahmed Hassan',
      productType: 'Personal Loan',
      requestedAmount: 500000,
      currentStage: 2,
      submissionDate: '2024-01-20',
      priority: 'High',
      stages: [
        { id: '1', name: 'Document Verification', status: 'completed', completedDate: '2024-01-21', assignee: 'Sara Ahmed' },
        { id: '2', name: 'Credit Assessment', status: 'current', assignee: 'Omar Ali' },
        { id: '3', name: 'Sharia Compliance Review', status: 'pending' },
        { id: '4', name: 'Risk Assessment', status: 'pending' },
        { id: '5', name: 'Final Approval', status: 'pending' }
      ]
    },
    {
      id: 'LN002',
      applicantName: 'Fatima Al-Zahra',
      productType: 'Business Loan',
      requestedAmount: 2000000,
      currentStage: 3,
      submissionDate: '2024-01-18',
      priority: 'High',
      stages: [
        { id: '1', name: 'Document Verification', status: 'completed', completedDate: '2024-01-19', assignee: 'Sara Ahmed' },
        { id: '2', name: 'Credit Assessment', status: 'completed', completedDate: '2024-01-20', assignee: 'Omar Ali' },
        { id: '3', name: 'Sharia Compliance Review', status: 'current', assignee: 'Dr. Hassan Sheikh' },
        { id: '4', name: 'Risk Assessment', status: 'pending' },
        { id: '5', name: 'Final Approval', status: 'pending' }
      ]
    }
  ]);

  const addApproval = (approval: Omit<LoanInApproval, 'id'>) => {
    const newApproval: LoanInApproval = {
      ...approval,
      id: generateId('LN'),
    };
    setApprovals(prev => [...prev, newApproval]);
  };

  const updateApproval = (id: string, updates: Partial<LoanInApproval>) => {
    setApprovals(prev => prev.map(approval => 
      approval.id === id ? { ...approval, ...updates } : approval
    ));
  };

  const deleteApproval = (id: string) => {
    setApprovals(prev => prev.filter(approval => approval.id !== id));
  };

  // Loan Disbursement CRUD operations
  const [disbursements, setDisbursements] = useState<Disbursement[]>([
    {
      id: 'DB001',
      loanId: 'LN001',
      applicantName: 'Ahmed Hassan',
      productType: 'Personal Loan',
      disbursementAmount: 500000,
      beneficiaryBank: 'HDFC Bank',
      accountNumber: '****1234',
      currentStage: 4,
      priority: 'High',
      status: 'In Progress',
      scheduledDate: '2024-01-22',
      branch: 'Main Branch',
      contactNumber: '+91 9876543210',
      stages: [
        { id: '1', name: 'Final Verification', status: 'completed', completedDate: '2024-01-22 09:00', estimatedTime: '2 hours' },
        { id: '2', name: 'Fund Allocation', status: 'completed', completedDate: '2024-01-22 10:30', estimatedTime: '4 hours' },
        { id: '3', name: 'Compliance Check', status: 'completed', completedDate: '2024-01-22 11:00', estimatedTime: '1 hour' },
        { id: '4', name: 'Payment Processing', status: 'current', estimatedTime: '30 minutes' },
        { id: '5', name: 'Fund Transfer', status: 'pending', estimatedTime: '15 minutes' },
        { id: '6', name: 'Confirmation', status: 'pending', estimatedTime: '10 minutes' }
      ],
      riskFlags: [],
      hasRepaymentSchedule: false
    },
    {
      id: 'DB002',
      loanId: 'LN002',
      applicantName: 'Fatima Al-Zahra',
      productType: 'Business Loan',
      disbursementAmount: 2000000,
      beneficiaryBank: 'SBI Bank',
      accountNumber: '****5678',
      currentStage: 6,
      priority: 'High',
      status: 'Completed',
      scheduledDate: '2024-01-20',
      completedDate: '2024-01-20 15:45',
      branch: 'Downtown Branch',
      contactNumber: '+91 9876543211',
      stages: [
        { id: '1', name: 'Final Verification', status: 'completed', completedDate: '2024-01-20 09:00', estimatedTime: '2 hours' },
        { id: '2', name: 'Fund Allocation', status: 'completed', completedDate: '2024-01-20 11:00', estimatedTime: '4 hours' },
        { id: '3', name: 'Compliance Check', status: 'completed', completedDate: '2024-01-20 12:00', estimatedTime: '1 hour' },
        { id: '4', name: 'Payment Processing', status: 'completed', completedDate: '2024-01-20 14:30', estimatedTime: '30 minutes' },
        { id: '5', name: 'Fund Transfer', status: 'completed', completedDate: '2024-01-20 15:30', estimatedTime: '15 minutes' },
        { id: '6', name: 'Confirmation', status: 'completed', completedDate: '2024-01-20 15:45', estimatedTime: '10 minutes' }
      ],
      riskFlags: [],
      hasRepaymentSchedule: true
    }
  ]);

  const addDisbursement = (disbursement: Omit<Disbursement, 'id'>) => {
    const newDisbursement: Disbursement = {
      ...disbursement,
      id: generateId('DB'),
    };
    setDisbursements(prev => [...prev, newDisbursement]);
  };

  const updateDisbursement = (id: string, updates: Partial<Disbursement>) => {
    setDisbursements(prev => prev.map(disbursement => 
      disbursement.id === id ? { ...disbursement, ...updates } : disbursement
    ));
  };

  const deleteDisbursement = (id: string) => {
    setDisbursements(prev => prev.filter(disbursement => disbursement.id !== id));
  };

  // Loan Repayment CRUD operations
  const [repayments, setRepayments] = useState<Repayment[]>([
    {
      id: "1",
      customerName: "Ahmed Hassan",
      loanAccount: "LN001001",
      dueDate: "2024-01-05",
      amount: 25000,
      status: "Paid",
      paidDate: "2024-01-05",
      receiptUrl: "#",
      branch: "Main Branch",
      contactNumber: "+91 9876543210",
    },
    {
      id: "2",
      customerName: "Fatima Al-Zahra",
      loanAccount: "LN001002",
      dueDate: "2024-02-05",
      amount: 35000,
      status: "Pending",
      branch: "Downtown Branch",
      contactNumber: "+91 9876543211",
    },
    {
      id: "3",
      customerName: "Mohammad Ali",
      loanAccount: "LN001003",
      dueDate: "2024-03-05",
      amount: 45000,
      status: "Pending",
      branch: "Main Branch",
      contactNumber: "+91 9876543212",
    },
    {
      id: "4",
      customerName: "Sarah Khan",
      loanAccount: "LN001004",
      dueDate: "2023-12-05",
      amount: 28000,
      status: "Overdue",
      branch: "Downtown Branch",
      contactNumber: "+91 9876543213",
    }
  ]);

  const addRepayment = (repayment: Omit<Repayment, 'id'>) => {
    const newRepayment: Repayment = {
      ...repayment,
      id: generateId('RPY'),
    };
    setRepayments(prev => [...prev, newRepayment]);
  };

  const updateRepayment = (id: string, updates: Partial<Repayment>) => {
    setRepayments(prev => prev.map(repayment => 
      repayment.id === id ? { ...repayment, ...updates } : repayment
    ));
  };

  const deleteRepayment = (id: string) => {
    setRepayments(prev => prev.filter(repayment => repayment.id !== id));
  };

  const value: AppContextType = {
    employees,
    customers,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    approvals,
    addApproval,
    updateApproval,
    deleteApproval,
    disbursements,
    addDisbursement,
    updateDisbursement,
    deleteDisbursement,
    repayments,
    addRepayment,
    updateRepayment,
    deleteRepayment,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Create a custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
} 