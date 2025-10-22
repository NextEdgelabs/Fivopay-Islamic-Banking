// Import existing customer data for referential integrity
import { mockCustomers } from '@/services/mockData';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Deposit {
  id: string;
  depositId: string;
  accountNumber: string;

  // Customer Info (from existing customers)
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  // Deposit Details
  depositType: 'Savings Account' | 'Fixed Deposit' | 'Recurring Deposit' | 'Current Account';
  depositAmount: number;
  interestRate: number;
  tenure?: number; // in months, for FD/RD
  maturityAmount?: number;
  maturityDate?: string;

  // Dates
  openingDate: string;
  lastTransactionDate?: string;

  // Status
  status: 'Active' | 'Closed' | 'Matured' | 'Frozen';

  // Financial Details
  currentBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  interestEarned: number;

  // Branch (from existing branches)
  branchId: string;
  branchName: string;

  // Nominee & Auto-renewal
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  autoRenewal?: boolean;
  remarks?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateDepositDto {
  customerId: string;
  depositType: 'Savings Account' | 'Fixed Deposit' | 'Recurring Deposit' | 'Current Account';
  depositAmount: number;
  tenure?: number;
  branchId: string;
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  autoRenewal?: boolean;
  remarks?: string;
}

export interface UpdateDepositDto extends Partial<CreateDepositDto> {
  status?: 'Active' | 'Closed' | 'Matured' | 'Frozen';
}

export interface DepositFilters {
  search?: string;
  status?: string;
  depositType?: string;
  branchId?: string;
  customerId?: string;
}

// ============================================================================
// MOCK DATA (References actual customers)
// ============================================================================

export const mockDeposits: Deposit[] = [
  {
    id: 'DEP001',
    depositId: 'FD-2024-001',
    accountNumber: mockCustomers[0]?.accountNumber,
    customerId: mockCustomers[0]?.id,
    customerName: mockCustomers[0]?.fullName,
    customerPhone: mockCustomers[0]?.phone,
    customerEmail: mockCustomers[0]?.email,
    depositType: 'Fixed Deposit',
    depositAmount: 500000,
    interestRate: 7.5,
    tenure: 36,
    maturityAmount: 625000,
    maturityDate: '2027-01-15',
    openingDate: '2024-01-15',
    status: 'Active',
    currentBalance: 500000,
    totalDeposits: 500000,
    totalWithdrawals: 0,
    interestEarned: 0,
    branchId: 'BR001',
    branchName: mockCustomers[0]?.branch,
    nomineeName: mockCustomers[0]?.nomineeName,
    nomineeRelation: mockCustomers[0]?.nomineeRelation,
    autoRenewal: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'DEP002',
    depositId: 'SA-2024-002',
    accountNumber: mockCustomers[1]?.accountNumber,
    customerId: mockCustomers[1]?.id,
    customerName: mockCustomers[1]?.fullName,
    customerPhone: mockCustomers[1]?.phone,
    customerEmail: mockCustomers[1]?.email,
    depositType: 'Savings Account',
    depositAmount: 950000,
    interestRate: 4.0,
    openingDate: '2024-02-01',
    lastTransactionDate: '2024-10-15',
    status: 'Active',
    currentBalance: 950000,
    totalDeposits: 950000,
    totalWithdrawals: 0,
    interestEarned: 12500,
    branchId: 'BR002',
    branchName: mockCustomers[1]?.branch,
    nomineeName: mockCustomers[1]?.nomineeName,
    nomineeRelation: mockCustomers[1]?.nomineeRelation,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'DEP003',
    depositId: 'RD-2024-003',
    accountNumber: mockCustomers[2]?.accountNumber,
    customerId: mockCustomers[2]?.id,
    customerName: mockCustomers[2]?.fullName,
    customerPhone: mockCustomers[2]?.phone,
    customerEmail: mockCustomers[2]?.email,
    depositType: 'Recurring Deposit',
    depositAmount: 10000,
    interestRate: 6.5,
    tenure: 60,
    maturityAmount: 700000,
    maturityDate: '2029-03-10',
    openingDate: '2024-03-10',
    status: 'Active',
    currentBalance: 70000,
    totalDeposits: 70000,
    totalWithdrawals: 0,
    interestEarned: 5000,
    branchId: 'BR003',
    branchName: mockCustomers[2]?.branch,
    nomineeName: mockCustomers[2]?.nomineeName,
    nomineeRelation: mockCustomers[2]?.nomineeRelation,
    autoRenewal: false,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'DEP004',
    depositId: 'CA-2024-004',
    accountNumber: mockCustomers[3]?.accountNumber,
    customerId: mockCustomers[3]?.id,
    customerName: mockCustomers[3]?.fullName,
    customerPhone: mockCustomers[3]?.phone,
    customerEmail: mockCustomers[3]?.email,
    depositType: 'Current Account',
    depositAmount: 1806000,
    interestRate: 0,
    openingDate: '2024-04-01',
    lastTransactionDate: '2024-10-15',
    status: 'Active',
    currentBalance: 1806000,
    totalDeposits: 2500000,
    totalWithdrawals: 694000,
    interestEarned: 0,
    branchId: 'BR004',
    branchName: mockCustomers[3]?.branch,
    nomineeName: mockCustomers[3]?.nomineeName,
    nomineeRelation: mockCustomers[3]?.nomineeRelation,
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'DEP005',
    depositId: 'FD-2024-005',
    accountNumber: mockCustomers[4]?.accountNumber,
    customerId: mockCustomers[4]?.id,
    customerName: mockCustomers[4]?.fullName,
    customerPhone: mockCustomers[4]?.phone,
    customerEmail: mockCustomers[4]?.email,
    depositType: 'Fixed Deposit',
    depositAmount: 300000,
    interestRate: 7.0,
    tenure: 24,
    maturityAmount: 345000,
    maturityDate: '2026-05-10',
    openingDate: '2024-05-10',
    status: 'Active',
    currentBalance: 300000,
    totalDeposits: 300000,
    totalWithdrawals: 0,
    interestEarned: 0,
    branchId: 'BR005',
    branchName: mockCustomers[4]?.branch,
    nomineeName: mockCustomers[4]?.nomineeName,
    nomineeRelation: mockCustomers[4]?.nomineeRelation,
    autoRenewal: true,
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2024-05-10T10:00:00Z',
  },
];

// ============================================================================
// SERVICE METHODS
// ============================================================================

export const depositService = {
  /**
   * Get all deposits with optional filters
   */
  async getDeposits(filters?: DepositFilters): Promise<Deposit[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockDeposits];

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(
            (d) =>
              d.depositId.toLowerCase().includes(searchLower) ||
              d.accountNumber.toLowerCase().includes(searchLower) ||
              d.customerName.toLowerCase().includes(searchLower)
          );
        }

        if (filters?.status) {
          filtered = filtered.filter((d) => d.status === filters.status);
        }

        if (filters?.depositType) {
          filtered = filtered.filter((d) => d.depositType === filters.depositType);
        }

        if (filters?.branchId) {
          filtered = filtered.filter((d) => d.branchId === filters.branchId);
        }

        if (filters?.customerId) {
          filtered = filtered.filter((d) => d.customerId === filters.customerId);
        }

        resolve(filtered);
      }, 500);
    });
  },

  /**
   * Get a single deposit by ID
   */
  async getDepositById(id: string): Promise<Deposit> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const deposit = mockDeposits.find((d) => d.id === id);
        if (deposit) {
          resolve(deposit);
        } else {
          reject(new Error(`Deposit with ID ${id} not found`));
        }
      }, 500);
    });
  },

  /**
   * Create a new deposit
   */
  async createDeposit(data: CreateDepositDto): Promise<Deposit> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const customer = mockCustomers.find((c) => c.id === data.customerId);
        if (!customer) {
          reject(new Error('Customer not found'));
          return;
        }

        const interestRates: Record<string, number> = {
          'Savings Account': 4.0,
          'Fixed Deposit': 7.5,
          'Recurring Deposit': 6.5,
          'Current Account': 0,
        };

        const interestRate = interestRates[data.depositType];
        let maturityAmount;
        let maturityDate;

        if (data.tenure && (data.depositType === 'Fixed Deposit' || data.depositType === 'Recurring Deposit')) {
          const years = data.tenure / 12;
          maturityAmount = Math.round(data.depositAmount * Math.pow(1 + interestRate / 100, years));
          const maturityDateObj = new Date();
          maturityDateObj.setMonth(maturityDateObj.getMonth() + data.tenure);
          maturityDate = maturityDateObj.toISOString().split('T')[0];
        }

        const newDeposit: Deposit = {
          id: `DEP${String(mockDeposits.length + 1).padStart(3, '0')}`,
          depositId: `${data.depositType.substring(0, 2).toUpperCase()}-2024-${String(mockDeposits.length + 1).padStart(3, '0')}`,
          accountNumber: customer.accountNumber,
          customerId: data.customerId,
          customerName: customer.fullName,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          depositType: data.depositType,
          depositAmount: data.depositAmount,
          interestRate,
          tenure: data.tenure,
          maturityAmount,
          maturityDate,
          openingDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          currentBalance: data.depositAmount,
          totalDeposits: data.depositAmount,
          totalWithdrawals: 0,
          interestEarned: 0,
          branchId: data.branchId,
          branchName: customer.branch,
          nomineeName: data.nomineeName || customer.nomineeName,
          nomineeRelation: data.nomineeRelation || customer.nomineeRelation,
          nomineePhone: data.nomineePhone,
          autoRenewal: data.autoRenewal,
          remarks: data.remarks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockDeposits.push(newDeposit);
        resolve(newDeposit);
      }, 800);
    });
  },

  /**
   * Update a deposit
   */
  async updateDeposit(id: string, data: UpdateDepositDto): Promise<Deposit> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockDeposits.findIndex((d) => d.id === id);
        if (index === -1) {
          reject(new Error('Deposit not found'));
          return;
        }

        const updated: Deposit = {
          ...mockDeposits[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        mockDeposits[index] = updated;
        resolve(updated);
      }, 800);
    });
  },

  /**
   * Delete a deposit
   */
  async deleteDeposit(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockDeposits.findIndex((d) => d.id === id);
        if (index === -1) {
          reject(new Error('Deposit not found'));
          return;
        }

        mockDeposits.splice(index, 1);
        resolve();
      }, 500);
    });
  },

  /**
   * Close a deposit
   */
  async closeDeposit(id: string): Promise<Deposit> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockDeposits.findIndex((d) => d.id === id);
        if (index === -1) {
          reject(new Error('Deposit not found'));
          return;
        }

        const updated: Deposit = {
          ...mockDeposits[index],
          status: 'Closed',
          updatedAt: new Date().toISOString(),
        };

        mockDeposits[index] = updated;
        resolve(updated);
      }, 800);
    });
  },

  /**
   * Calculate maturity amount
   */
  calculateMaturityAmount(principal: number, rate: number, tenureMonths: number): number {
    const years = tenureMonths / 12;
    return Math.round(principal * Math.pow(1 + rate / 100, years));
  },

  /**
   * Get customer deposits
   */
  async getCustomerDeposits(customerId: string): Promise<Deposit[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deposits = mockDeposits.filter((d) => d.customerId === customerId);
        resolve(deposits);
      }, 500);
    });
  },
};

