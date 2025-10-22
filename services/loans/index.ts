// Import existing customer data for referential integrity
import { mockCustomers } from '@/services/mockData';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Loan {
  id: string;
  loanId: string;
  applicationNumber: string;

  // Customer Info (from existing customers)
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  // Loan Details
  loanType: 'Personal Loan' | 'Home Loan' | 'Business Loan' | 'Education Loan' | 'Vehicle Loan' | 'Gold Loan';
  loanAmount: number;
  interestRate: number;
  tenure: number; // in months
  emiAmount: number;

  // Dates
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  maturityDate?: string;

  // Status
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed' | 'Active' | 'Closed' | 'Defaulted';

  // Financial Details
  principalAmount: number;
  outstandingAmount: number;
  paidAmount: number;

  // Branch (from existing branches)
  branchId: string;
  branchName: string;
  processedBy?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;

  // Documents & Collateral
  documents: { type: string; url: string; uploadedAt: string }[];
  collateral?: { type: string; value: number; description: string };
  remarks?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanDto {
  customerId: string;
  loanType: 'Personal Loan' | 'Home Loan' | 'Business Loan' | 'Education Loan' | 'Vehicle Loan' | 'Gold Loan';
  loanAmount: number;
  tenure: number;
  branchId: string;
  documents?: { type: string; url: string; uploadedAt: string }[];
  collateral?: { type: string; value: number; description: string };
  remarks?: string;
}

export interface UpdateLoanDto extends Partial<CreateLoanDto> {
  status?: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed' | 'Active' | 'Closed' | 'Defaulted';
  interestRate?: number;
}

export interface LoanFilters {
  search?: string;
  status?: string;
  loanType?: string;
  branchId?: string;
  customerId?: string;
}

// ============================================================================
// MOCK DATA (References actual customers)
// ============================================================================

export const mockLoans: Loan[] = [
  {
    id: 'LN001',
    loanId: 'LOAN-2024-001',
    applicationNumber: 'APP-2024-001',
    customerId: mockCustomers[0]._id,
    customerName: mockCustomers[0].fullName,
    customerPhone: mockCustomers[0].phone,
    customerEmail: mockCustomers[0].email,
    loanType: 'Home Loan',
    loanAmount: 5000000,
    interestRate: 8.5,
    tenure: 240, // 20 years
    emiAmount: 43391,
    applicationDate: '2024-01-10',
    approvalDate: '2024-01-15',
    disbursementDate: '2024-01-20',
    maturityDate: '2044-01-20',
    status: 'Active',
    principalAmount: 5000000,
    outstandingAmount: 4800000,
    paidAmount: 200000,
    branchId: 'BR001',
    branchName: mockCustomers[0].branch,
    approvedBy: 'Rajesh Kumar',
    documents: [],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'LN002',
    loanId: 'LOAN-2024-002',
    applicationNumber: 'APP-2024-002',
    customerId: mockCustomers[1]._id,
    customerName: mockCustomers[1].fullName,
    customerPhone: mockCustomers[1].phone,
    customerEmail: mockCustomers[1].email,
    loanType: 'Personal Loan',
    loanAmount: 500000,
    interestRate: 11.5,
    tenure: 60, // 5 years
    emiAmount: 11064,
    applicationDate: '2024-02-05',
    approvalDate: '2024-02-08',
    disbursementDate: '2024-02-10',
    maturityDate: '2029-02-10',
    status: 'Active',
    principalAmount: 500000,
    outstandingAmount: 450000,
    paidAmount: 50000,
    branchId: 'BR002',
    branchName: mockCustomers[1].branch,
    approvedBy: 'Amit Sharma',
    documents: [],
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'LN003',
    loanId: 'LOAN-2024-003',
    applicationNumber: 'APP-2024-003',
    customerId: mockCustomers[2]._id,
    customerName: mockCustomers[2].fullName,
    customerPhone: mockCustomers[2].phone,
    customerEmail: mockCustomers[2].email,
    loanType: 'Business Loan',
    loanAmount: 2000000,
    interestRate: 10.0,
    tenure: 120, // 10 years
    emiAmount: 26398,
    applicationDate: '2024-03-12',
    approvalDate: '2024-03-18',
    disbursementDate: '2024-03-20',
    maturityDate: '2034-03-20',
    status: 'Active',
    principalAmount: 2000000,
    outstandingAmount: 1900000,
    paidAmount: 100000,
    branchId: 'BR003',
    branchName: mockCustomers[2].branch,
    approvedBy: 'Sanjay Reddy',
    documents: [],
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'LN004',
    loanId: 'LOAN-2024-004',
    applicationNumber: 'APP-2024-004',
    customerId: mockCustomers[3]?._id,
    customerName: mockCustomers[3]?.fullName,
    customerPhone: mockCustomers[3]?.phone,
    customerEmail: mockCustomers[3]?.email,
    loanType: 'Vehicle Loan',
    loanAmount: 800000,
    interestRate: 9.5,
    tenure: 84, // 7 years
    emiAmount: 13252,
    applicationDate: '2024-04-05',
    approvalDate: '2024-04-10',
    disbursementDate: '2024-04-12',
    maturityDate: '2031-04-12',
    status: 'Active',
    principalAmount: 800000,
    outstandingAmount: 720000,
    paidAmount: 80000,
    branchId: 'BR004',
    branchName: mockCustomers[3]?.branch,
    approvedBy: 'Venkat Rao',
    documents: [],
    createdAt: '2024-04-05T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'LN005',
    loanId: 'LOAN-2024-005',
    applicationNumber: 'APP-2024-005',
    customerId: mockCustomers[4]?._id,
    customerName: mockCustomers[4]?.fullName,
    customerPhone: mockCustomers[4]?.phone,
    customerEmail: mockCustomers[4]?.email,
    loanType: 'Education Loan',
    loanAmount: 1500000,
    interestRate: 8.0,
    tenure: 180, // 15 years
    emiAmount: 14326,
    applicationDate: '2024-05-08',
    approvalDate: '2024-05-12',
    disbursementDate: '2024-05-15',
    maturityDate: '2039-05-15',
    status: 'Active',
    principalAmount: 1500000,
    outstandingAmount: 1450000,
    paidAmount: 50000,
    branchId: 'BR005',
    branchName: mockCustomers[4]?.branch,
    approvedBy: 'Priya Deshmukh',
    documents: [],
    createdAt: '2024-05-08T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'LN006',
    loanId: 'LOAN-2024-006',
    applicationNumber: 'APP-2024-006',
    customerId: mockCustomers[5]?._id,
    customerName: mockCustomers[5]?.fullName,
    customerPhone: mockCustomers[5]?.phone,
    customerEmail: mockCustomers[5]?.email,
    loanType: 'Gold Loan',
    loanAmount: 300000,
    interestRate: 12.0,
    tenure: 12, // 1 year
    emiAmount: 26621,
    applicationDate: '2024-06-10',
    approvalDate: '2024-06-11',
    disbursementDate: '2024-06-12',
    maturityDate: '2025-06-12',
    status: 'Active',
    principalAmount: 300000,
    outstandingAmount: 200000,
    paidAmount: 100000,
    branchId: 'BR006',
    branchName: mockCustomers[5]?.branch,
    approvedBy: 'Ramesh Iyer',
    documents: [],
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'LN007',
    loanId: 'LOAN-2024-007',
    applicationNumber: 'APP-2024-007',
    customerId: mockCustomers[6]?._id,
    customerName: mockCustomers[6]?.fullName,
    customerPhone: mockCustomers[6]?.phone,
    customerEmail: mockCustomers[6]?.email,
    loanType: 'Home Loan',
    loanAmount: 3500000,
    interestRate: 8.75,
    tenure: 180, // 15 years
    emiAmount: 34726,
    applicationDate: '2024-07-05',
    status: 'Under Review',
    principalAmount: 3500000,
    outstandingAmount: 3500000,
    paidAmount: 0,
    branchId: 'BR007',
    branchName: mockCustomers[6]?.branch,
    processedBy: 'Sourav Chatterjee',
    documents: [],
    createdAt: '2024-07-05T10:00:00Z',
    updatedAt: '2024-07-10T10:00:00Z',
  },
  {
    id: 'LN008',
    loanId: 'LOAN-2024-008',
    applicationNumber: 'APP-2024-008',
    customerId: mockCustomers[7]?._id,
    customerName: mockCustomers[7]?.fullName,
    customerPhone: mockCustomers[7]?.phone,
    customerEmail: mockCustomers[7]?.email,
    loanType: 'Business Loan',
    loanAmount: 1000000,
    interestRate: 10.5,
    tenure: 60, // 5 years
    emiAmount: 21496,
    applicationDate: '2024-08-01',
    status: 'Pending',
    principalAmount: 1000000,
    outstandingAmount: 1000000,
    paidAmount: 0,
    branchId: 'BR008',
    branchName: mockCustomers[7]?.branch,
    documents: [],
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2024-08-01T10:00:00Z',
  },
];

// ============================================================================
// SERVICE METHODS
// ============================================================================

export const loanService = {
  /**
   * Get all loans with optional filters
   */
  async getLoans(filters?: LoanFilters): Promise<Loan[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockLoans];

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(
            (l) =>
              l.loanId.toLowerCase().includes(searchLower) ||
              l.applicationNumber.toLowerCase().includes(searchLower) ||
              l.customerName.toLowerCase().includes(searchLower)
          );
        }

        if (filters?.status) {
          filtered = filtered.filter((l) => l.status === filters.status);
        }

        if (filters?.loanType) {
          filtered = filtered.filter((l) => l.loanType === filters.loanType);
        }

        if (filters?.branchId) {
          filtered = filtered.filter((l) => l.branchId === filters.branchId);
        }

        if (filters?.customerId) {
          filtered = filtered.filter((l) => l.customerId === filters.customerId);
        }

        // Ensure all returned loans have customer info
        const result = filtered.map(loan => {
          const customer = mockCustomers.find(c => c.id === loan.customerId);
          return {
            ...loan,
            customerName: customer?.fullName || 'N/A',
            customerId: loan.customerId || 'N/A',
          };
        });

        resolve(result);
      }, 500);
    });
  },

  /**
   * Get a single loan by ID
   */
  async getLoanById(id: string): Promise<Loan> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const loan = mockLoans.find((l) => l.id === id);
        if (loan) {
          resolve(loan);
        } else {
          reject(new Error(`Loan with ID ${id} not found`));
        }
      }, 500);
    });
  },

  /**
   * Create a new loan
   */
  async createLoan(data: CreateLoanDto): Promise<Loan> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const customer = mockCustomers.find((c) => c._id === data.customerId);
        if (!customer) {
          reject(new Error('Customer not found'));
          return;
        }

        // Calculate EMI
        const monthlyRate = (data.loanAmount * 10.0) / (12 * 100); // Default 10% rate for new loans
        const emi = loanService.calculateEMI(data.loanAmount, 10.0, data.tenure);

        const newLoan: Loan = {
          id: `LN${String(mockLoans.length + 1).padStart(3, '0')}`,
          loanId: `LOAN-2024-${String(mockLoans.length + 1).padStart(3, '0')}`,
          applicationNumber: `APP-2024-${String(mockLoans.length + 1).padStart(3, '0')}`,
          customerId: data.customerId,
          customerName: customer.fullName,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          loanType: data.loanType,
          loanAmount: data.loanAmount,
          interestRate: 10.0, // Default rate
          tenure: data.tenure,
          emiAmount: emi,
          applicationDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          principalAmount: data.loanAmount,
          outstandingAmount: data.loanAmount,
          paidAmount: 0,
          branchId: data.branchId,
          branchName: customer.branch,
          documents: data.documents || [],
          collateral: data.collateral,
          remarks: data.remarks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockLoans.push(newLoan);
        resolve(newLoan);
      }, 800);
    });
  },

  /**
   * Update a loan
   */
  async updateLoan(id: string, data: UpdateLoanDto): Promise<Loan> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockLoans.findIndex((l) => l.id === id);
        if (index === -1) {
          reject(new Error('Loan not found'));
          return;
        }

        const updated: Loan = {
          ...mockLoans[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        // Recalculate EMI if amount, rate, or tenure changed
        if (data.loanAmount || data.interestRate || data.tenure) {
          const amount = data.loanAmount || updated.loanAmount;
          const rate = data.interestRate || updated.interestRate;
          const tenure = data.tenure || updated.tenure;
          updated.emiAmount = loanService.calculateEMI(amount, rate, tenure);
        }

        mockLoans[index] = updated;
        resolve(updated);
      }, 800);
    });
  },

  /**
   * Delete a loan
   */
  async deleteLoan(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockLoans.findIndex((l) => l.id === id);
        if (index === -1) {
          reject(new Error('Loan not found'));
          return;
        }

        mockLoans.splice(index, 1);
        resolve();
      }, 500);
    });
  },

  /**
   * Approve a loan
   */
  async approveLoan(id: string, approvedBy: string, interestRate: number): Promise<Loan> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockLoans.findIndex((l) => l.id === id);
        if (index === -1) {
          reject(new Error('Loan not found'));
          return;
        }

        const emi = loanService.calculateEMI(
          mockLoans[index].loanAmount,
          interestRate,
          mockLoans[index].tenure
        );

        const updated: Loan = {
          ...mockLoans[index],
          status: 'Approved',
          approvalDate: new Date().toISOString().split('T')[0],
          approvedBy,
          interestRate,
          emiAmount: emi,
          updatedAt: new Date().toISOString(),
        };

        mockLoans[index] = updated;
        resolve(updated);
      }, 800);
    });
  },

  /**
   * Reject a loan
   */
  async rejectLoan(id: string, rejectedBy: string, reason: string): Promise<Loan> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockLoans.findIndex((l) => l.id === id);
        if (index === -1) {
          reject(new Error('Loan not found'));
          return;
        }

        const updated: Loan = {
          ...mockLoans[index],
          status: 'Rejected',
          rejectedBy,
          rejectionReason: reason,
          updatedAt: new Date().toISOString(),
        };

        mockLoans[index] = updated;
        resolve(updated);
      }, 800);
    });
  },

  /**
   * Disburse a loan
   */
  async disburseLoan(id: string): Promise<Loan> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockLoans.findIndex((l) => l.id === id);
        if (index === -1) {
          reject(new Error('Loan not found'));
          return;
        }

        if (mockLoans[index].status !== 'Approved') {
          reject(new Error('Only approved loans can be disbursed'));
          return;
        }

        const disbursementDate = new Date().toISOString().split('T')[0];
        const maturityDate = new Date();
        maturityDate.setMonth(maturityDate.getMonth() + mockLoans[index].tenure);

        const updated: Loan = {
          ...mockLoans[index],
          status: 'Disbursed',
          disbursementDate,
          maturityDate: maturityDate.toISOString().split('T')[0],
          updatedAt: new Date().toISOString(),
        };

        mockLoans[index] = updated;
        resolve(updated);
      }, 800);
    });
  },

  /**
   * Get customer loans
   */
  async getCustomerLoans(customerId: string): Promise<Loan[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const loans = mockLoans.filter((l) => l.customerId === customerId);
        resolve(loans);
      }, 500);
    });
  },

  /**
   * Calculate EMI using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
   */
  calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
    const monthlyRate = annualRate / (12 * 100);
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Math.round(emi);
  },
};

