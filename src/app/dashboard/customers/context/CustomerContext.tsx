'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: string;
  kycStatus: 'Pending' | 'Verified' | 'Rejected' | 'Under Review';
  verificationLevel: string;
  accountBalance: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  lastActivity: string;
  joinDate: string;
  branchId?: string;
  notes?: string;
}

export interface IntakeRequest {
  id: string;
  customerName: string;
  channel: 'Web Portal' | 'Mobile App' | 'Call Center' | 'Branch Visit';
  requestType: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Cancelled';
  timestamp: string;
  description?: string;
  assignedTo?: string;
  customerId?: string;
}

export interface CustomerCase {
  id: string;
  customerId: string;
  customerName: string;
  caseType: 'Account Issue' | 'Transaction Problem' | 'KYC Query' | 'Product Inquiry' | 'Complaint';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  resolution?: string;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountType: string;
  verificationLevel: string;
  kycStatus: Customer['kycStatus'];
  accountBalance: string;
  status: Customer['status'];
  notes: string;
  branchId: string;
}

export interface IntakeFormData {
  customerName: string;
  channel: IntakeRequest['channel'];
  requestType: string;
  priority: IntakeRequest['priority'];
  description: string;
  customerId?: string;
}

export interface CaseFormData {
  customerId: string;
  customerName: string;
  caseType: CustomerCase['caseType'];
  priority: CustomerCase['priority'];
  description: string;
  assignedTo: string;
}

interface CustomerContextType {
  // State
  customers: Customer[];
  intakeRequests: IntakeRequest[];
  cases: CustomerCase[];
  
  // Customer actions
  addCustomer: (customerData: CustomerFormData) => string;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  deleteCustomer: (customerId: string) => void;
  getCustomerById: (customerId: string) => Customer | undefined;
  getCustomersByStatus: (status: Customer['status']) => Customer[];
  getCustomersByKycStatus: (kycStatus: Customer['kycStatus']) => Customer[];
  
  // Intake request actions
  addIntakeRequest: (intakeData: IntakeFormData) => string;
  updateIntakeStatus: (requestId: string, status: IntakeRequest['status']) => void;
  deleteIntakeRequest: (requestId: string) => void;
  getIntakeRequestsByStatus: (status: IntakeRequest['status']) => IntakeRequest[];
  getIntakeRequestsByChannel: (channel: IntakeRequest['channel']) => IntakeRequest[];
  
  // Case actions
  addCase: (caseData: CaseFormData) => string;
  updateCaseStatus: (caseId: string, status: CustomerCase['status']) => void;
  updateCase: (caseId: string, updates: Partial<CustomerCase>) => void;
  deleteCase: (caseId: string) => void;
  getCasesByStatus: (status: CustomerCase['status']) => CustomerCase[];
  getCasesByType: (caseType: CustomerCase['caseType']) => CustomerCase[];
  
  // Analytics
  getCustomerStats: () => {
    total: number;
    active: number;
    pending: number;
    inactive: number;
    verified: number;
    pendingKyc: number;
  };
  getIntakeStats: () => {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    byChannel: Record<IntakeRequest['channel'], number>;
  };
  getCaseStats: () => {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    byType: Record<CustomerCase['caseType'], number>;
  };
  
  // Utility functions
  generateCustomerId: () => string;
  generateIntakeId: () => string;
  generateCaseId: () => string;
  calculateAccountBalance: (balance: string) => number;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }
  return context;
};

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CUST001',
      name: 'Ahmad Hassan',
      email: 'ahmad.hassan@email.com',
      phone: '+971-50-123-4567',
      accountType: 'Ethical Savings',
      kycStatus: 'Verified',
      verificationLevel: 'Level 2',
      accountBalance: 'AED 25,000',
      status: 'Active',
      lastActivity: '2 hours ago',
      joinDate: '2024-01-15',
      branchId: 'B001'
    },
    {
      id: 'CUST002',
      name: 'Fatima Al-Zahra',
      email: 'fatima.alzahra@email.com',
      phone: '+971-55-987-6543',
      accountType: 'Mudarabah Investment',
      kycStatus: 'Under Review',
      verificationLevel: 'Level 1',
      accountBalance: 'AED 150,000',
      status: 'Active',
      lastActivity: '1 day ago',
      joinDate: '2024-01-10',
      branchId: 'B002'
    },
    {
      id: 'CUST003',
      name: 'Omar Ibrahim',
      email: 'omar.ibrahim@email.com',
      phone: '+971-52-456-7890',
      accountType: 'Ethical Current',
      kycStatus: 'Pending',
      verificationLevel: 'Level 1',
      accountBalance: 'AED 5,000',
      status: 'Pending',
      lastActivity: '3 days ago',
      joinDate: '2024-01-20',
      branchId: 'B001'
    }
  ]);

  const [intakeRequests, setIntakeRequests] = useState<IntakeRequest[]>([
    {
      id: 'INT-001',
      customerName: 'Ahmad Hassan',
      channel: 'Web Portal',
      requestType: 'Account Inquiry',
      priority: 'Medium',
      status: 'Pending',
      timestamp: '2 hours ago',
      customerId: 'CUST001'
    },
    {
      id: 'INT-002',
      customerName: 'Fatima Al-Zahra',
      channel: 'Mobile App',
      requestType: 'Ethical Loan Query',
      priority: 'High',
      status: 'In Progress',
      timestamp: '4 hours ago',
      customerId: 'CUST002'
    },
    {
      id: 'INT-003',
      customerName: 'Omar Ibrahim',
      channel: 'Call Center',
      requestType: 'Card Issue',
      priority: 'Low',
      status: 'Resolved',
      timestamp: '1 day ago',
      customerId: 'CUST003'
    }
  ]);

  const [cases, setCases] = useState<CustomerCase[]>([
    {
      id: 'CASE001',
      customerId: 'CUST001',
      customerName: 'Ahmad Hassan',
      caseType: 'Account Issue',
      priority: 'Medium',
      status: 'Open',
      assignedTo: 'John Smith',
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T10:30:00Z',
      description: 'Customer unable to access online banking'
    },
    {
      id: 'CASE002',
      customerId: 'CUST002',
      customerName: 'Fatima Al-Zahra',
      caseType: 'KYC Query',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'Sarah Johnson',
      createdAt: '2024-01-19T14:15:00Z',
      updatedAt: '2024-01-20T09:45:00Z',
      description: 'KYC verification documents need review'
    }
  ]);

  // Utility functions
  const generateCustomerId = () => {
    return `CUST${String(customers.length + 1).padStart(3, '0')}`;
  };

  const generateIntakeId = () => {
    return `INT-${String(intakeRequests.length + 1).padStart(3, '0')}`;
  };

  const generateCaseId = () => {
    return `CASE${String(cases.length + 1).padStart(3, '0')}`;
  };

  const calculateAccountBalance = (balance: string) => {
    return parseFloat(balance.replace(/[^0-9.-]+/g, "")) || 0;
  };

  // Customer actions
  const addCustomer = (customerData: CustomerFormData): string => {
    const newCustomer: Customer = {
      id: generateCustomerId(),
      name: `${customerData.firstName} ${customerData.lastName}`,
      email: customerData.email,
      phone: customerData.phone,
      accountType: customerData.accountType,
      kycStatus: customerData.kycStatus,
      verificationLevel: customerData.verificationLevel,
      accountBalance: `AED ${customerData.accountBalance}`,
      status: customerData.status,
      lastActivity: 'Just now',
      joinDate: new Date().toISOString().split('T')[0],
      branchId: customerData.branchId,
      notes: customerData.notes
    };

    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer.id;
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, ...updates }
          : customer
      )
    );
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== customerId));
  };

  const getCustomerById = (customerId: string) => {
    return customers.find(customer => customer.id === customerId);
  };

  const getCustomersByStatus = (status: Customer['status']) => {
    return customers.filter(customer => customer.status === status);
  };

  const getCustomersByKycStatus = (kycStatus: Customer['kycStatus']) => {
    return customers.filter(customer => customer.kycStatus === kycStatus);
  };

  // Intake request actions
  const addIntakeRequest = (intakeData: IntakeFormData): string => {
    const newIntake: IntakeRequest = {
      id: generateIntakeId(),
      customerName: intakeData.customerName,
      channel: intakeData.channel,
      requestType: intakeData.requestType,
      priority: intakeData.priority,
      status: 'Pending',
      timestamp: new Date().toLocaleString(),
      description: intakeData.description,
      customerId: intakeData.customerId
    };

    setIntakeRequests(prev => [...prev, newIntake]);
    return newIntake.id;
  };

  const updateIntakeStatus = (requestId: string, status: IntakeRequest['status']) => {
    setIntakeRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status }
          : request
      )
    );
  };

  const deleteIntakeRequest = (requestId: string) => {
    setIntakeRequests(prev => prev.filter(request => request.id !== requestId));
  };

  const getIntakeRequestsByStatus = (status: IntakeRequest['status']) => {
    return intakeRequests.filter(request => request.status === status);
  };

  const getIntakeRequestsByChannel = (channel: IntakeRequest['channel']) => {
    return intakeRequests.filter(request => request.channel === channel);
  };

  // Case actions
  const addCase = (caseData: CaseFormData): string => {
    const newCase: CustomerCase = {
      id: generateCaseId(),
      customerId: caseData.customerId,
      customerName: caseData.customerName,
      caseType: caseData.caseType,
      priority: caseData.priority,
      status: 'Open',
      assignedTo: caseData.assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: caseData.description
    };

    setCases(prev => [...prev, newCase]);
    return newCase.id;
  };

  const updateCaseStatus = (caseId: string, status: CustomerCase['status']) => {
    setCases(prev => 
      prev.map(caseItem => 
        caseItem.id === caseId 
          ? { ...caseItem, status, updatedAt: new Date().toISOString() }
          : caseItem
      )
    );
  };

  const updateCase = (caseId: string, updates: Partial<CustomerCase>) => {
    setCases(prev => 
      prev.map(caseItem => 
        caseItem.id === caseId 
          ? { ...caseItem, ...updates, updatedAt: new Date().toISOString() }
          : caseItem
      )
    );
  };

  const deleteCase = (caseId: string) => {
    setCases(prev => prev.filter(caseItem => caseItem.id !== caseId));
  };

  const getCasesByStatus = (status: CustomerCase['status']) => {
    return cases.filter(caseItem => caseItem.status === status);
  };

  const getCasesByType = (caseType: CustomerCase['caseType']) => {
    return cases.filter(caseItem => caseItem.caseType === caseType);
  };

  // Analytics
  const getCustomerStats = () => {
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'Active').length,
      pending: customers.filter(c => c.status === 'Pending').length,
      inactive: customers.filter(c => c.status === 'Inactive').length,
      verified: customers.filter(c => c.kycStatus === 'Verified').length,
      pendingKyc: customers.filter(c => c.kycStatus === 'Pending').length
    };
  };

  const getIntakeStats = () => {
    const byChannel = {
      'Web Portal': intakeRequests.filter(r => r.channel === 'Web Portal').length,
      'Mobile App': intakeRequests.filter(r => r.channel === 'Mobile App').length,
      'Call Center': intakeRequests.filter(r => r.channel === 'Call Center').length,
      'Branch Visit': intakeRequests.filter(r => r.channel === 'Branch Visit').length
    };

    return {
      total: intakeRequests.length,
      pending: intakeRequests.filter(r => r.status === 'Pending').length,
      inProgress: intakeRequests.filter(r => r.status === 'In Progress').length,
      resolved: intakeRequests.filter(r => r.status === 'Resolved').length,
      byChannel
    };
  };

  const getCaseStats = () => {
    const byType = {
      'Account Issue': cases.filter(c => c.caseType === 'Account Issue').length,
      'Transaction Problem': cases.filter(c => c.caseType === 'Transaction Problem').length,
      'KYC Query': cases.filter(c => c.caseType === 'KYC Query').length,
      'Product Inquiry': cases.filter(c => c.caseType === 'Product Inquiry').length,
      'Complaint': cases.filter(c => c.caseType === 'Complaint').length
    };

    return {
      total: cases.length,
      open: cases.filter(c => c.status === 'Open').length,
      inProgress: cases.filter(c => c.status === 'In Progress').length,
      resolved: cases.filter(c => c.status === 'Resolved').length,
      byType
    };
  };

  const value: CustomerContextType = {
    customers,
    intakeRequests,
    cases,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    getCustomersByStatus,
    getCustomersByKycStatus,
    addIntakeRequest,
    updateIntakeStatus,
    deleteIntakeRequest,
    getIntakeRequestsByStatus,
    getIntakeRequestsByChannel,
    addCase,
    updateCaseStatus,
    updateCase,
    deleteCase,
    getCasesByStatus,
    getCasesByType,
    getCustomerStats,
    getIntakeStats,
    getCaseStats,
    generateCustomerId,
    generateIntakeId,
    generateCaseId,
    calculateAccountBalance
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}; 