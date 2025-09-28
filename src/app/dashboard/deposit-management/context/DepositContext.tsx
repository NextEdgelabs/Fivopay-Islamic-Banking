'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DepositAccount {
  id: string;
  accountNumber: string;
  customerName: string;
  depositType: string;
  principalAmount: number;
  currentBalance: number;
  profitRate: number;
  maturityDate: string;
  status: 'Active' | 'Matured' | 'Closed' | 'Pending';
  lastTransaction: string;
  tenure: {
    years: number;
    months: number;
  };
  monthlyDeposit?: number;
  createdAt: string;
}

export interface DepositTransaction {
  id: string;
  accountNumber: string;
  customerName: string;
  type: 'Deposit' | 'Withdrawal' | 'Profit Credit' | 'Maturity';
  amount: number;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Failed';
  description?: string;
}

export interface NewAccountFormData {
  customerName: string;
  accountType: 'Fixed Deposit' | 'Recurring Deposit' | 'Savings Account';
  initialDeposit: number;
  profitRate: number;
  tenure: {
    years: number;
    months: number;
  };
  monthlyDeposit?: number;
}

export interface TransactionFormData {
  accountNumber: string;
  transactionType: 'Deposit' | 'Withdrawal' | 'Profit Credit' | 'Maturity';
  amount: number;
  description: string;
}

export interface FDProduct {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  profitRate: number;
  tenure: {
    years: number;
    months: number;
  };
  status: 'Active' | 'Inactive';
  description: string;
}

export interface RDProduct {
  id: string;
  name: string;
  minMonthlyDeposit: number;
  maxMonthlyDeposit: number;
  profitRate: number;
  tenure: {
    years: number;
    months: number;
  };
  status: 'Active' | 'Inactive';
  description: string;
}

interface DepositContextType {
  depositAccounts: DepositAccount[];
  transactions: DepositTransaction[];
  fdProducts: FDProduct[];
  rdProducts: RDProduct[];
  addDepositAccount: (accountData: NewAccountFormData) => void;
  addTransaction: (transactionData: TransactionFormData) => void;
  updateAccountStatus: (accountId: string, status: DepositAccount['status']) => void;
  updateAccountBalance: (accountId: string, amount: number, type: 'credit' | 'debit') => void;
  deleteAccount: (accountId: string) => void;
  addFDProduct: (product: Omit<FDProduct, 'id'>) => void;
  addRDProduct: (product: Omit<RDProduct, 'id'>) => void;
  updateFDProduct: (productId: string, product: Partial<FDProduct>) => void;
  updateRDProduct: (productId: string, product: Partial<RDProduct>) => void;
  deleteFDProduct: (productId: string) => void;
  deleteRDProduct: (productId: string) => void;
  getAccountById: (accountId: string) => DepositAccount | undefined;
  getAccountByNumber: (accountNumber: string) => DepositAccount | undefined;
}

const DepositContext = createContext<DepositContextType | undefined>(undefined);

export const useDepositContext = () => {
  const context = useContext(DepositContext);
  if (context === undefined) {
    throw new Error('useDepositContext must be used within a DepositProvider');
  }
  return context;
};

interface DepositProviderProps {
  children: ReactNode;
}

export const DepositProvider: React.FC<DepositProviderProps> = ({ children }) => {
  const [depositAccounts, setDepositAccounts] = useState<DepositAccount[]>([
    {
      id: '1',
      accountNumber: 'FD001234',
      customerName: 'Ahmed Hassan',
      depositType: 'Fixed Deposit',
      principalAmount: 500000,
      currentBalance: 536000,
      profitRate: 7.2,
      maturityDate: '2024-12-15',
      status: 'Active',
      lastTransaction: '2024-01-15',
      tenure: { years: 1, months: 0 },
      createdAt: '2023-12-15'
    },
    {
      id: '2',
      accountNumber: 'RD002345',
      customerName: 'Fatima Al-Zahra',
      depositType: 'Recurring Deposit',
      principalAmount: 120000,
      currentBalance: 126400,
      profitRate: 6.8,
      maturityDate: '2025-06-20',
      status: 'Active',
      lastTransaction: '2024-01-20',
      tenure: { years: 1, months: 6 },
      monthlyDeposit: 10000,
      createdAt: '2023-06-20'
    },
    {
      id: '3',
      accountNumber: 'WD003456',
      customerName: 'Omar Abdullah',
      depositType: 'Savings Account',
      principalAmount: 75000,
      currentBalance: 75000,
      profitRate: 0,
      maturityDate: 'N/A',
      status: 'Active',
      lastTransaction: '2024-01-18',
      tenure: { years: 0, months: 0 },
      createdAt: '2024-01-01'
    },
    {
      id: '4',
      accountNumber: 'FD004567',
      customerName: 'Aisha Malik',
      depositType: 'Fixed Deposit',
      principalAmount: 1000000,
      currentBalance: 1072000,
      profitRate: 7.2,
      maturityDate: '2024-03-10',
      status: 'Matured',
      lastTransaction: '2024-01-10',
      tenure: { years: 1, months: 0 },
      createdAt: '2023-03-10'
    }
  ]);

  const [transactions, setTransactions] = useState<DepositTransaction[]>([
    {
      id: '1',
      accountNumber: 'FD001234',
      customerName: 'Ahmed Hassan',
      type: 'Profit Credit',
      amount: 3000,
      timestamp: '2024-01-20 14:30',
      status: 'Completed',
      description: 'Monthly profit credit'
    },
    {
      id: '2',
      accountNumber: 'RD002345',
      customerName: 'Fatima Al-Zahra',
      type: 'Deposit',
      amount: 10000,
      timestamp: '2024-01-20 11:15',
      status: 'Completed',
      description: 'Monthly recurring deposit'
    },
    {
      id: '3',
      accountNumber: 'WD003456',
      customerName: 'Omar Abdullah',
      type: 'Withdrawal',
      amount: 5000,
      timestamp: '2024-01-19 16:45',
      status: 'Completed',
      description: 'Cash withdrawal'
    },
    {
      id: '4',
      accountNumber: 'FD004567',
      customerName: 'Aisha Malik',
      type: 'Maturity',
      amount: 1072000,
      timestamp: '2024-01-18 09:00',
      status: 'Pending',
      description: 'Account maturity payment'
    }
  ]);

  const [fdProducts, setFdProducts] = useState<FDProduct[]>([
    {
      id: '1',
      name: 'Standard Fixed Deposit - 1 Year',
      minAmount: 10000,
      maxAmount: 10000000,
      profitRate: 7.2,
      tenure: { years: 1, months: 0 },
      status: 'Active',
      description: 'Standard fixed deposit with competitive interest rates'
    },
    {
      id: '2',
      name: 'Standard Fixed Deposit - 2 Years',
      minAmount: 25000,
      maxAmount: 10000000,
      profitRate: 7.5,
      tenure: { years: 2, months: 0 },
      status: 'Active',
      description: 'Long-term fixed deposit with higher profit rates'
    },
    {
      id: '3',
      name: 'Standard Fixed Deposit - 3 Years',
      minAmount: 50000,
      maxAmount: 10000000,
      profitRate: 7.8,
      tenure: { years: 3, months: 0 },
      status: 'Active',
      description: 'Extended term deposit with competitive interest rates'
    }
  ]);

  const [rdProducts, setRdProducts] = useState<RDProduct[]>([
    {
      id: '1',
      name: 'Standard Recurring Deposit - 1 Year',
      minMonthlyDeposit: 1000,
      maxMonthlyDeposit: 100000,
      profitRate: 6.8,
      tenure: { years: 1, months: 0 },
      status: 'Active',
      description: 'Monthly recurring deposit with competitive returns'
    },
    {
      id: '2',
      name: 'Standard Recurring Deposit - 2 Years',
      minMonthlyDeposit: 2000,
      maxMonthlyDeposit: 100000,
      profitRate: 7.0,
      tenure: { years: 2, months: 0 },
      status: 'Active',
      description: 'Long-term recurring deposit with higher returns'
    },
    {
      id: '3',
      name: 'Standard Recurring Deposit - 3 Years',
      minMonthlyDeposit: 5000,
      maxMonthlyDeposit: 100000,
      profitRate: 7.2,
      tenure: { years: 3, months: 0 },
      status: 'Active',
      description: 'Extended recurring deposit with maximum benefits'
    }
  ]);

  // Generate unique account number
  const generateAccountNumber = (type: string) => {
    const prefix = type === 'Fixed Deposit' ? 'FD' : 
                  type === 'Recurring Deposit' ? 'RD' : 'SA';
    const existingNumbers = depositAccounts.map(acc => acc.accountNumber);
    let newNumber = `${prefix}${String(depositAccounts.length + 1).padStart(6, '0')}`;
    let counter = 1;
    
    while (existingNumbers.includes(newNumber)) {
      newNumber = `${prefix}${String(depositAccounts.length + 1 + counter).padStart(6, '0')}`;
      counter++;
    }
    
    return newNumber;
  };

  // Calculate maturity date
  const calculateMaturityDate = (tenure: { years: number; months: number }) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + tenure.years);
    date.setMonth(date.getMonth() + tenure.months);
    return date.toISOString().split('T')[0];
  };

  const addDepositAccount = (accountData: NewAccountFormData) => {
    const newAccount: DepositAccount = {
      id: String(depositAccounts.length + 1),
      accountNumber: generateAccountNumber(accountData.accountType),
      customerName: accountData.customerName,
      depositType: accountData.accountType,
      principalAmount: accountData.initialDeposit,
      currentBalance: accountData.initialDeposit,
      profitRate: accountData.profitRate,
      maturityDate: calculateMaturityDate(accountData.tenure),
      status: 'Active',
      lastTransaction: new Date().toISOString().split('T')[0],
      tenure: accountData.tenure,
      monthlyDeposit: accountData.monthlyDeposit,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setDepositAccounts(prev => [...prev, newAccount]);
  };

  const addTransaction = (transactionData: TransactionFormData) => {
    const account = depositAccounts.find(acc => acc.accountNumber === transactionData.accountNumber);
    if (!account) return;

    const newTransaction: DepositTransaction = {
      id: String(transactions.length + 1),
      accountNumber: transactionData.accountNumber,
      customerName: account.customerName,
      type: transactionData.transactionType,
      amount: transactionData.amount,
      timestamp: new Date().toLocaleString(),
      status: 'Completed',
      description: transactionData.description
    };

    setTransactions(prev => [...prev, newTransaction]);

    // Update account balance
    if (transactionData.transactionType === 'Deposit' || transactionData.transactionType === 'Profit Credit') {
      updateAccountBalance(account.id, transactionData.amount, 'credit');
    } else if (transactionData.transactionType === 'Withdrawal') {
      updateAccountBalance(account.id, transactionData.amount, 'debit');
    } else if (transactionData.transactionType === 'Maturity') {
      updateAccountStatus(account.id, 'Matured');
    }
  };

  const updateAccountStatus = (accountId: string, status: DepositAccount['status']) => {
    setDepositAccounts(prev => 
      prev.map(account => 
        account.id === accountId ? { ...account, status } : account
      )
    );
  };

  const updateAccountBalance = (accountId: string, amount: number, type: 'credit' | 'debit') => {
    setDepositAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { 
              ...account, 
              currentBalance: type === 'credit' 
                ? account.currentBalance + amount 
                : account.currentBalance - amount,
              lastTransaction: new Date().toISOString().split('T')[0]
            }
          : account
      )
    );
  };

  const deleteAccount = (accountId: string) => {
    setDepositAccounts(prev => prev.filter(account => account.id !== accountId));
  };

  const addFDProduct = (product: Omit<FDProduct, 'id'>) => {
    const newProduct: FDProduct = {
      id: String(fdProducts.length + 1),
      ...product
    };
    setFdProducts(prev => [...prev, newProduct]);
  };

  const addRDProduct = (product: Omit<RDProduct, 'id'>) => {
    const newProduct: RDProduct = {
      id: String(rdProducts.length + 1),
      ...product
    };
    setRdProducts(prev => [...prev, newProduct]);
  };

  const updateFDProduct = (productId: string, product: Partial<FDProduct>) => {
    setFdProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, ...product } : p)
    );
  };

  const updateRDProduct = (productId: string, product: Partial<RDProduct>) => {
    setRdProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, ...product } : p)
    );
  };

  const deleteFDProduct = (productId: string) => {
    setFdProducts(prev => prev.filter(p => p.id !== productId));
  };

  const deleteRDProduct = (productId: string) => {
    setRdProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getAccountById = (accountId: string) => {
    return depositAccounts.find(account => account.id === accountId);
  };

  const getAccountByNumber = (accountNumber: string) => {
    return depositAccounts.find(account => account.accountNumber === accountNumber);
  };

  const value: DepositContextType = {
    depositAccounts,
    transactions,
    fdProducts,
    rdProducts,
    addDepositAccount,
    addTransaction,
    updateAccountStatus,
    updateAccountBalance,
    deleteAccount,
    addFDProduct,
    addRDProduct,
    updateFDProduct,
    updateRDProduct,
    deleteFDProduct,
    deleteRDProduct,
    getAccountById,
    getAccountByNumber
  };

  return (
    <DepositContext.Provider value={value}>
      {children}
    </DepositContext.Provider>
  );
}; 