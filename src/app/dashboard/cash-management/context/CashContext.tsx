'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CashTransaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Interbranch Transfer';
  amount: number;
  fromBranch?: string;
  toBranch?: string;
  customerName?: string;
  accountNumber?: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Cancelled';
  timestamp: string;
  description?: string;
  referenceNumber: string;
  branchId: string;
  userId: string;
}

export interface DigitalWallet {
  id: string;
  customerName: string;
  walletNumber: string;
  balance: number;
  status: 'Active' | 'Suspended' | 'Pending' | 'Closed';
  lastTransaction: string;
  createdAt: string;
  branchId: string;
}

export interface InterbranchTransfer {
  id: string;
  fromBranch: string;
  toBranch: string;
  amount: number;
  purpose: string;
  status: 'Pending' | 'Level1_Approved' | 'Level2_Approved' | 'Completed' | 'Rejected';
  requestDate: string;
  approvalDate?: string;
  completionDate?: string;
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
}

export interface LiquidityReport {
  id: string;
  branchId: string;
  branchName: string;
  date: string;
  openingBalance: number;
  closingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  netCashFlow: number;
  liquidityRatio: number;
  status: 'Pending' | 'Submitted' | 'Approved';
}

export interface BranchCashPosition {
  id: string;
  branchId: string;
  branchName: string;
  currentBalance: number;
  minimumRequired: number;
  excessCash: number;
  lastUpdated: string;
  status: 'Normal' | 'Low' | 'High';
}

export interface TransactionFormData {
  type: 'Deposit' | 'Withdrawal' | 'Transfer';
  amount: number;
  fromBranch?: string;
  toBranch?: string;
  customerName?: string;
  accountNumber?: string;
  description: string;
  branchId: string;
}

export interface WalletFormData {
  customerName: string;
  initialBalance: number;
  branchId: string;
}

export interface InterbranchTransferFormData {
  fromBranch: string;
  toBranch: string;
  amount: number;
  purpose: string;
  notes?: string;
}

export interface LiquidityFormData {
  branchId: string;
  openingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  notes?: string;
}

interface CashContextType {
  // State
  transactions: CashTransaction[];
  wallets: DigitalWallet[];
  interbranchTransfers: InterbranchTransfer[];
  liquidityReports: LiquidityReport[];
  branchCashPositions: BranchCashPosition[];
  
  // Transaction actions
  addTransaction: (transactionData: TransactionFormData) => void;
  updateTransactionStatus: (transactionId: string, status: CashTransaction['status']) => void;
  deleteTransaction: (transactionId: string) => void;
  getTransactionsByBranch: (branchId: string) => CashTransaction[];
  getTransactionsByDateRange: (startDate: string, endDate: string) => CashTransaction[];
  
  // Wallet actions
  addWallet: (walletData: WalletFormData) => void;
  updateWalletBalance: (walletId: string, amount: number, type: 'credit' | 'debit') => void;
  updateWalletStatus: (walletId: string, status: DigitalWallet['status']) => void;
  deleteWallet: (walletId: string) => void;
  getWalletByNumber: (walletNumber: string) => DigitalWallet | undefined;
  
  // Interbranch transfer actions
  addInterbranchTransfer: (transferData: InterbranchTransferFormData) => void;
  updateTransferStatus: (transferId: string, status: InterbranchTransfer['status'], approvedBy?: string) => void;
  deleteTransfer: (transferId: string) => void;
  getTransfersByBranch: (branchId: string) => InterbranchTransfer[];
  
  // Liquidity actions
  addLiquidityReport: (reportData: LiquidityFormData) => void;
  updateLiquidityReport: (reportId: string, reportData: Partial<LiquidityReport>) => void;
  deleteLiquidityReport: (reportId: string) => void;
  getLiquidityReportsByBranch: (branchId: string) => LiquidityReport[];
  
  // Branch cash position actions
  updateBranchCashPosition: (branchId: string, position: Partial<BranchCashPosition>) => void;
  getBranchCashPosition: (branchId: string) => BranchCashPosition | undefined;
  
  // Utility functions
  generateReferenceNumber: (type: string) => string;
  calculateLiquidityRatio: (balance: number, deposits: number, withdrawals: number) => number;
  getTotalCashPosition: () => number;
  getTotalWalletBalance: () => number;
}

const CashContext = createContext<CashContextType | undefined>(undefined);

export const useCashContext = () => {
  const context = useContext(CashContext);
  if (context === undefined) {
    throw new Error('useCashContext must be used within a CashProvider');
  }
  return context;
};

interface CashProviderProps {
  children: ReactNode;
}

export const CashProvider: React.FC<CashProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<CashTransaction[]>([
    {
      id: '1',
      type: 'Deposit',
      amount: 50000,
      customerName: 'Ahmed Hassan',
      accountNumber: 'ACC001234',
      status: 'Completed',
      timestamp: '2024-01-20T10:30:00Z',
      description: 'Cash deposit',
      referenceNumber: 'TXN001',
      branchId: 'B001',
      userId: 'U001'
    },
    {
      id: '2',
      type: 'Withdrawal',
      amount: 25000,
      customerName: 'Fatima Al-Zahra',
      accountNumber: 'ACC002345',
      status: 'Completed',
      timestamp: '2024-01-20T11:15:00Z',
      description: 'ATM withdrawal',
      referenceNumber: 'TXN002',
      branchId: 'B002',
      userId: 'U002'
    },
    {
      id: '3',
      type: 'Transfer',
      amount: 100000,
      fromBranch: 'B001',
      toBranch: 'B003',
      status: 'Pending',
      timestamp: '2024-01-20T12:00:00Z',
      description: 'Interbranch transfer',
      referenceNumber: 'TXN003',
      branchId: 'B001',
      userId: 'U001'
    }
  ]);

  const [wallets, setWallets] = useState<DigitalWallet[]>([
    {
      id: '1',
      customerName: 'Rahul Sharma',
      walletNumber: 'WAL001234567',
      balance: 25000,
      status: 'Active',
      lastTransaction: '2024-01-20T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      branchId: 'B001'
    },
    {
      id: '2',
      customerName: 'Priya Patel',
      walletNumber: 'WAL001234568',
      balance: 15000,
      status: 'Active',
      lastTransaction: '2024-01-20T09:15:00Z',
      createdAt: '2024-01-02T00:00:00Z',
      branchId: 'B002'
    },
    {
      id: '3',
      customerName: 'Amit Kumar',
      walletNumber: 'WAL001234569',
      balance: 50000,
      status: 'Suspended',
      lastTransaction: '2024-01-19T16:45:00Z',
      createdAt: '2024-01-03T00:00:00Z',
      branchId: 'B003'
    }
  ]);

  const [interbranchTransfers, setInterbranchTransfers] = useState<InterbranchTransfer[]>([
    {
      id: '1',
      fromBranch: 'B001',
      toBranch: 'B002',
      amount: 500000,
      purpose: 'Cash replenishment',
      status: 'Completed',
      requestDate: '2024-01-20T08:00:00Z',
      approvalDate: '2024-01-20T08:30:00Z',
      completionDate: '2024-01-20T09:00:00Z',
      requestedBy: 'U001',
      approvedBy: 'U003',
      notes: 'Regular cash transfer'
    },
    {
      id: '2',
      fromBranch: 'B003',
      toBranch: 'B001',
      amount: 300000,
      purpose: 'Excess cash transfer',
      status: 'Pending',
      requestDate: '2024-01-20T14:00:00Z',
      requestedBy: 'U004',
      notes: 'Transfer excess cash to main branch'
    }
  ]);

  const [liquidityReports, setLiquidityReports] = useState<LiquidityReport[]>([
    {
      id: '1',
      branchId: 'B001',
      branchName: 'Main Branch',
      date: '2024-01-20',
      openingBalance: 2000000,
      closingBalance: 1850000,
      totalDeposits: 500000,
      totalWithdrawals: 650000,
      netCashFlow: -150000,
      liquidityRatio: 85.2,
      status: 'Submitted'
    },
    {
      id: '2',
      branchId: 'B002',
      branchName: 'North Branch',
      date: '2024-01-20',
      openingBalance: 1500000,
      closingBalance: 1600000,
      totalDeposits: 400000,
      totalWithdrawals: 300000,
      netCashFlow: 100000,
      liquidityRatio: 92.1,
      status: 'Approved'
    }
  ]);

  const [branchCashPositions, setBranchCashPositions] = useState<BranchCashPosition[]>([
    {
      id: '1',
      branchId: 'B001',
      branchName: 'Main Branch',
      currentBalance: 1850000,
      minimumRequired: 1500000,
      excessCash: 350000,
      lastUpdated: '2024-01-20T17:00:00Z',
      status: 'Normal'
    },
    {
      id: '2',
      branchId: 'B002',
      branchName: 'North Branch',
      currentBalance: 1600000,
      minimumRequired: 1200000,
      excessCash: 400000,
      lastUpdated: '2024-01-20T17:00:00Z',
      status: 'Normal'
    },
    {
      id: '3',
      branchId: 'B003',
      branchName: 'South Branch',
      currentBalance: 800000,
      minimumRequired: 1000000,
      excessCash: -200000,
      lastUpdated: '2024-01-20T17:00:00Z',
      status: 'Low'
    }
  ]);

  // Generate unique reference number
  const generateReferenceNumber = (type: string) => {
    const prefix = type === 'transaction' ? 'TXN' : 
                  type === 'wallet' ? 'WAL' : 
                  type === 'transfer' ? 'TRF' : 'REF';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  // Calculate liquidity ratio
  const calculateLiquidityRatio = (balance: number, deposits: number, withdrawals: number) => {
    const totalFlow = deposits + withdrawals;
    return totalFlow > 0 ? (balance / totalFlow) * 100 : 100;
  };

  // Get total cash position
  const getTotalCashPosition = () => {
    return branchCashPositions.reduce((sum, position) => sum + position.currentBalance, 0);
  };

  // Get total wallet balance
  const getTotalWalletBalance = () => {
    return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  };

  // Transaction actions
  const addTransaction = (transactionData: TransactionFormData) => {
    const newTransaction: CashTransaction = {
      id: String(transactions.length + 1),
      type: transactionData.type,
      amount: transactionData.amount,
      fromBranch: transactionData.fromBranch,
      toBranch: transactionData.toBranch,
      customerName: transactionData.customerName,
      accountNumber: transactionData.accountNumber,
      status: 'Pending',
      timestamp: new Date().toISOString(),
      description: transactionData.description,
      referenceNumber: generateReferenceNumber('transaction'),
      branchId: transactionData.branchId,
      userId: 'U001' // This would come from auth context
    };

    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransactionStatus = (transactionId: string, status: CashTransaction['status']) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === transactionId 
          ? { ...transaction, status, timestamp: new Date().toISOString() }
          : transaction
      )
    );
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
  };

  const getTransactionsByBranch = (branchId: string) => {
    return transactions.filter(transaction => transaction.branchId === branchId);
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return transactionDate >= start && transactionDate <= end;
    });
  };

  // Wallet actions
  const addWallet = (walletData: WalletFormData) => {
    const newWallet: DigitalWallet = {
      id: String(wallets.length + 1),
      customerName: walletData.customerName,
      walletNumber: generateReferenceNumber('wallet'),
      balance: walletData.initialBalance,
      status: 'Active',
      lastTransaction: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      branchId: walletData.branchId
    };

    setWallets(prev => [...prev, newWallet]);
  };

  const updateWalletBalance = (walletId: string, amount: number, type: 'credit' | 'debit') => {
    setWallets(prev => 
      prev.map(wallet => 
        wallet.id === walletId 
          ? { 
              ...wallet, 
              balance: type === 'credit' ? wallet.balance + amount : wallet.balance - amount,
              lastTransaction: new Date().toISOString()
            }
          : wallet
      )
    );
  };

  const updateWalletStatus = (walletId: string, status: DigitalWallet['status']) => {
    setWallets(prev => 
      prev.map(wallet => 
        wallet.id === walletId ? { ...wallet, status } : wallet
      )
    );
  };

  const deleteWallet = (walletId: string) => {
    setWallets(prev => prev.filter(wallet => wallet.id !== walletId));
  };

  const getWalletByNumber = (walletNumber: string) => {
    return wallets.find(wallet => wallet.walletNumber === walletNumber);
  };

  // Interbranch transfer actions
  const addInterbranchTransfer = (transferData: InterbranchTransferFormData) => {
    const newTransfer: InterbranchTransfer = {
      id: String(interbranchTransfers.length + 1),
      fromBranch: transferData.fromBranch,
      toBranch: transferData.toBranch,
      amount: transferData.amount,
      purpose: transferData.purpose,
      status: 'Pending',
      requestDate: new Date().toISOString(),
      requestedBy: 'U001', // This would come from auth context
      notes: transferData.notes
    };

    setInterbranchTransfers(prev => [...prev, newTransfer]);
  };

  const updateTransferStatus = (transferId: string, status: InterbranchTransfer['status'], approvedBy?: string) => {
    setInterbranchTransfers(prev => 
      prev.map(transfer => {
        if (transfer.id === transferId) {
          const updatedTransfer = { ...transfer, status };
          if ((status === 'Level1_Approved' || status === 'Level2_Approved' || status === 'Completed') && approvedBy) {
            updatedTransfer.approvalDate = new Date().toISOString();
            updatedTransfer.approvedBy = approvedBy;
          } else if (status === 'Completed') {
            updatedTransfer.completionDate = new Date().toISOString();
          }
          return updatedTransfer;
        }
        return transfer;
      })
    );
  };

  const deleteTransfer = (transferId: string) => {
    setInterbranchTransfers(prev => prev.filter(transfer => transfer.id !== transferId));
  };

  const getTransfersByBranch = (branchId: string) => {
    return interbranchTransfers.filter(transfer => 
      transfer.fromBranch === branchId || transfer.toBranch === branchId
    );
  };

  // Liquidity actions
  const addLiquidityReport = (reportData: LiquidityFormData) => {
    const closingBalance = reportData.openingBalance + reportData.totalDeposits - reportData.totalWithdrawals;
    const liquidityRatio = calculateLiquidityRatio(closingBalance, reportData.totalDeposits, reportData.totalWithdrawals);
    
    const newReport: LiquidityReport = {
      id: String(liquidityReports.length + 1),
      branchId: reportData.branchId,
      branchName: 'Branch Name', // This would come from branch data
      date: new Date().toISOString().split('T')[0],
      openingBalance: reportData.openingBalance,
      closingBalance,
      totalDeposits: reportData.totalDeposits,
      totalWithdrawals: reportData.totalWithdrawals,
      netCashFlow: reportData.totalDeposits - reportData.totalWithdrawals,
      liquidityRatio,
      status: 'Pending'
    };

    setLiquidityReports(prev => [...prev, newReport]);
  };

  const updateLiquidityReport = (reportId: string, reportData: Partial<LiquidityReport>) => {
    setLiquidityReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, ...reportData } : report
      )
    );
  };

  const deleteLiquidityReport = (reportId: string) => {
    setLiquidityReports(prev => prev.filter(report => report.id !== reportId));
  };

  const getLiquidityReportsByBranch = (branchId: string) => {
    return liquidityReports.filter(report => report.branchId === branchId);
  };

  // Branch cash position actions
  const updateBranchCashPosition = (branchId: string, position: Partial<BranchCashPosition>) => {
    setBranchCashPositions(prev => 
      prev.map(branchPosition => 
        branchPosition.branchId === branchId 
          ? { 
              ...branchPosition, 
              ...position, 
              lastUpdated: new Date().toISOString(),
              excessCash: (position.currentBalance || branchPosition.currentBalance) - branchPosition.minimumRequired,
              status: (position.currentBalance || branchPosition.currentBalance) < branchPosition.minimumRequired 
                ? 'Low' 
                : (position.currentBalance || branchPosition.currentBalance) > branchPosition.minimumRequired * 1.5 
                ? 'High' 
                : 'Normal'
            }
          : branchPosition
      )
    );
  };

  const getBranchCashPosition = (branchId: string) => {
    return branchCashPositions.find(position => position.branchId === branchId);
  };

  const value: CashContextType = {
    // State
    transactions,
    wallets,
    interbranchTransfers,
    liquidityReports,
    branchCashPositions,
    
    // Transaction actions
    addTransaction,
    updateTransactionStatus,
    deleteTransaction,
    getTransactionsByBranch,
    getTransactionsByDateRange,
    
    // Wallet actions
    addWallet,
    updateWalletBalance,
    updateWalletStatus,
    deleteWallet,
    getWalletByNumber,
    
    // Interbranch transfer actions
    addInterbranchTransfer,
    updateTransferStatus,
    deleteTransfer,
    getTransfersByBranch,
    
    // Liquidity actions
    addLiquidityReport,
    updateLiquidityReport,
    deleteLiquidityReport,
    getLiquidityReportsByBranch,
    
    // Branch cash position actions
    updateBranchCashPosition,
    getBranchCashPosition,
    
    // Utility functions
    generateReferenceNumber,
    calculateLiquidityRatio,
    getTotalCashPosition,
    getTotalWalletBalance
  };

  return (
    <CashContext.Provider value={value}>
      {children}
    </CashContext.Provider>
  );
}; 