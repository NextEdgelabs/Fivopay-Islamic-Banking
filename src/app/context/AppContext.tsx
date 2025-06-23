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

  return (
    <AppContext.Provider 
      value={{ 
        employees, 
        customers, 
        addEmployee, 
        updateEmployee, 
        deleteEmployee,
        addCustomer,
        updateCustomer,
        deleteCustomer
      }}
    >
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