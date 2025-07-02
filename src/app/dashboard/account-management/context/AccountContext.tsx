'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Account {
  id: string;
  accountNumber: string;
  customerName: string;
  accountType: 'Savings' | 'Current' | 'Investment' | 'Business';
  status: 'Active' | 'Pending' | 'Suspended' | 'Closed';
  balance: number;
  openingDate: string;
  kycStatus: 'Completed' | 'Pending' | 'Under Review' | 'Rejected';
  branch: string;
  riskRating: 'Low' | 'Medium' | 'High';
  email: string;
  phone: string;
  panCard: string;
  aadharCard: string;
  initialDeposit: number;
}

export interface NewAccountFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountType: 'Savings' | 'Current' | 'Investment' | 'Business' | '';
  initialDeposit: string;
  branch: string;
  panCard: string;
  aadharCard: string;
}

interface AccountContextType {
  accounts: Account[];
  addAccount: (accountData: NewAccountFormData) => void;
  updateAccountStatus: (accountId: string, status: Account['status']) => void;
  updateKycStatus: (accountId: string, kycStatus: Account['kycStatus']) => void;
  deleteAccount: (accountId: string) => void;
  getAccountById: (accountId: string) => Account | undefined;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }
  return context;
};

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      accountNumber: 'FP001234567890',
      customerName: 'Ahmed Hassan',
      accountType: 'Savings',
      status: 'Active',
      balance: 125000,
      openingDate: '2024-01-15',
      kycStatus: 'Completed',
      branch: 'Mumbai Central',
      riskRating: 'Low',
      email: 'ahmed.hassan@email.com',
      phone: '+91 98765 43210',
      panCard: 'ABCDE1234F',
      aadharCard: '123456789012',
      initialDeposit: 50000
    },
    {
      id: '2',
      accountNumber: 'FP001234567891',
      customerName: 'Fatima Al-Zahra',
      accountType: 'Business',
      status: 'Active',
      balance: 850000,
      openingDate: '2024-01-10',
      kycStatus: 'Completed',
      branch: 'Delhi Main',
      riskRating: 'Low',
      email: 'fatima.zahra@email.com',
      phone: '+91 98765 43211',
      panCard: 'FGHIJ5678K',
      aadharCard: '987654321098',
      initialDeposit: 1000000
    },
    {
      id: '3',
      accountNumber: 'FP001234567892',
      customerName: 'Mohammad Ali',
      accountType: 'Current',
      status: 'Pending',
      balance: 0,
      openingDate: '2024-01-20',
      kycStatus: 'Under Review',
      branch: 'Bangalore Tech',
      riskRating: 'Medium',
      email: 'mohammad.ali@email.com',
      phone: '+91 98765 43212',
      panCard: 'LMNOP9012Q',
      aadharCard: '456789012345',
      initialDeposit: 25000
    }
  ]);

  // Generate unique account number
  const generateAccountNumber = () => {
    const existingNumbers = accounts.map(acc => acc.accountNumber);
    let newNumber = `FP${String(accounts.length + 1).padStart(12, '0')}`;
    let counter = 1;
    
    while (existingNumbers.includes(newNumber)) {
      newNumber = `FP${String(accounts.length + 1 + counter).padStart(12, '0')}`;
      counter++;
    }
    
    return newNumber;
  };

  const addAccount = (accountData: NewAccountFormData) => {
    const newAccount: Account = {
      id: String(accounts.length + 1),
      accountNumber: generateAccountNumber(),
      customerName: `${accountData.firstName} ${accountData.lastName}`,
      accountType: accountData.accountType as Account['accountType'],
      status: 'Pending',
      balance: parseInt(accountData.initialDeposit) || 0,
      openingDate: new Date().toISOString().split('T')[0],
      kycStatus: 'Pending',
      branch: accountData.branch,
      riskRating: 'Low',
      email: accountData.email,
      phone: accountData.phone,
      panCard: accountData.panCard,
      aadharCard: accountData.aadharCard,
      initialDeposit: parseInt(accountData.initialDeposit) || 0
    };

    setAccounts(prev => [...prev, newAccount]);
  };

  const updateAccountStatus = (accountId: string, status: Account['status']) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId ? { ...account, status } : account
      )
    );
  };

  const updateKycStatus = (accountId: string, kycStatus: Account['kycStatus']) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId ? { ...account, kycStatus } : account
      )
    );
  };

  const deleteAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(account => account.id !== accountId));
  };

  const getAccountById = (accountId: string) => {
    return accounts.find(account => account.id === accountId);
  };

  const value: AccountContextType = {
    accounts,
    addAccount,
    updateAccountStatus,
    updateKycStatus,
    deleteAccount,
    getAccountById
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}; 