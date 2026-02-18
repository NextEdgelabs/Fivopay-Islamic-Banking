import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum DocumentStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export interface LoanDocument {
  documentType: string;
  documentName: string;
  documentUrl: string;
  status: DocumentStatus;
  uploadedAt?: Date | string;
  verifiedAt?: Date | string;
  rejectedReason?: string;
}

export interface Loan {
  _id?: string; // MongoDB ObjectId
  id?: string; // For compatibility
  loanId?: string;
  applicationNumber?: string;

  // Backend schema fields from loadFlow.md
  userId: string;
  organisation?: string;
  category: string;
  product: string;
  esignStatus?: string;
  loanAgreement?: string;
  amount: number;
  eStampOrderId?: string;
  signingUrl?: string;
  signedAt?: Date | string;
  documents?: LoanDocument[];
  approvalStatus: ApprovalStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  resubmittedReason?: string;

  // Frontend compatibility fields (for existing UI)
  customerId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  loanType?: 'Personal Loan' | 'Home Loan' | 'Business Loan' | 'Education Loan' | 'Vehicle Loan' | 'Gold Loan';
  loanAmount?: number; // Alias for amount for UI compatibility
  interestRate?: number;
  tenure?: number; // in months
  emiAmount?: number;
  applicationDate?: string;
  approvalDate?: string;
  disbursementDate?: string;
  maturityDate?: string;
  status?: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed' | 'Active' | 'Closed' | 'Defaulted';
  principalAmount?: number;
  outstandingAmount?: number;
  paidAmount?: number;
  branchId?: string;
  branchName?: string;
  loanSource?: 'walkin' | 'online';
  processedBy?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  collateral?: { type: string; value: number; description: string };
  remarks?: string;
}

export interface CreateLoanDto {
  userId: string;
  organisation?: string;
  category: string;
  product: string;
  amount: number;
  documents?: LoanDocument[];
  // Frontend compatibility
  customerId?: string;
  loanType?: string;
  tenure?: number;
  branchId?: string;
  loanSource?: 'walkin' | 'online';
  remarks?: string;
}

export interface UpdateLoanDto {
  amount?: number;
  documents?: LoanDocument[];
  approvalStatus?: ApprovalStatus;
  eStampOrderId?: string;
  signingUrl?: string;
  signedAt?: Date | string;
  resubmittedReason?: string;
  // Frontend compatibility
  status?: string;
  interestRate?: number;
  loanSource?: 'walkin' | 'online';
  tenure?: number;
  remarks?: string;
}

export interface LoanFilters {
  search?: string;
  status?: string;
  approvalStatus?: ApprovalStatus;
  loanType?: string;
  branchId?: string;
  customerId?: string;
  userId?: string;
  organisation?: string;
  loanSource?: 'walkin' | 'online';
}

export interface LoansListResponse {
  success: boolean;
  message: string;
  data?: {
    loans: Loan[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  result?: {
    loans: Loan[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface LoanResponse {
  success: boolean;
  message: string;
  data?: {
    loan: Loan;
  };
  result?: {
    loan: Loan;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Normalize loan data from API to match UI expectations
 */
function normalizeLoan(loan: any): Loan {
  // Extract customer/user ID - handle both string and populated object references
  const userId = typeof loan.userId === 'string' 
    ? loan.userId 
    : typeof loan.userId === 'object' && loan.userId?._id 
    ? loan.userId._id 
    : loan.userId?.toString() || '';
  
  const customerId = typeof loan.customerId === 'string'
    ? loan.customerId
    : typeof loan.customerId === 'object' && loan.customerId?._id
    ? loan.customerId._id
    : loan.customerId?.toString() || userId;
  
  // Extract customer name if userId is populated
  const customerName = loan.customerName 
    || (typeof loan.userId === 'object' ? loan.userId?.fullName || loan.userId?.name : null)
    || (typeof loan.customerId === 'object' ? loan.customerId?.fullName || loan.customerId?.name : null)
    || '';

  // Extract product name if product is populated
  let productName = loan.loanType;
  if (!productName && loan.product) {
    if (typeof loan.product === 'string') {
      productName = loan.product;
    } else if (typeof loan.product === 'object') {
      productName = loan.product.productName 
        || loan.product.name 
        || loan.product.productType 
        || loan.product.type
        || '';
    }
  }

  // Extract category name if category is populated
  let categoryName = '';
  if (loan.category) {
    if (typeof loan.category === 'string') {
      categoryName = loan.category;
    } else if (typeof loan.category === 'object') {
      categoryName = loan.category.categoryName 
        || loan.category.name 
        || loan.category.type
        || '';
    }
  }

  return {
    ...loan,
    // Map API fields to UI fields
    id: loan._id || loan.id,
    loanAmount: loan.amount || loan.loanAmount || 0,
    amount: loan.amount || loan.loanAmount || 0,
    // Map approvalStatus to status for UI compatibility
    status: loan.status || mapApprovalStatusToStatus(loan.approvalStatus),
    // Ensure all numeric fields have defaults
    emiAmount: loan.emiAmount || 0,
    tenure: loan.tenure || 0,
    interestRate: loan.interestRate || (typeof loan.product === 'object' ? loan.product.interestRate : undefined) || 0,
    principalAmount: loan.principalAmount || loan.amount || 0,
    outstandingAmount: loan.outstandingAmount || loan.amount || 0,
    paidAmount: loan.paidAmount || 0,
    // Map userId to customerId for UI compatibility (ensure string values)
    userId: userId,
    customerId: customerId,
    customerName: customerName || loan.customerName || '',
    // Map product to loanType for UI compatibility
    loanType: productName || loan.loanType || '',
    loanSource: loan.loanSource || 'online',
    // Ensure product and category are strings or objects (keep original for reference)
    product: loan.product,
    category: loan.category,
  };
}

/**
 * Map approvalStatus enum to UI status string
 */
function mapApprovalStatusToStatus(approvalStatus?: string): string {
  if (!approvalStatus) return 'Pending';
  
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
  };
  
  return statusMap[approvalStatus.toLowerCase()] || 'Pending';
}

// ============================================================================
// SERVICE METHODS
// ============================================================================

export const loanService = {
  /**
   * Get all loans with optional filters
   * API: GET /api/v1/loan/get-all-loans
   */
  async getLoans(filters?: LoanFilters): Promise<Loan[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const token = getAuthToken();
      const response:any = await axios.get<LoansListResponse>(
        `${API.domain}${API.endPoints.getAllLoans}?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const loans = response.data.result?.loans || response.data.data?.loans || [];
        // Normalize loan data to match UI expectations
        return loans.map((loan: any) => normalizeLoan(loan));
      } else {
        throw new Error('Failed to fetch loans');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch loans');
    }
  },

  /**
   * Get a single loan by ID
   * API: GET /api/v1/loan/get-loan-by-id/:id
   */
  async getLoanById(id: string): Promise<Loan> {
    try {
      const token = getAuthToken();
      const response = await axios.get<LoanResponse>(
        `${API.domain}${API.endPoints.getLoanById}/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const loan = response.data.data?.loan || response.data.result?.loan;
        return normalizeLoan(loan);
      } else {
        throw new Error('Failed to fetch loan');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch loan');
    }
  },

  /**
   * Update a loan
   * API: PUT /api/v1/loan/update-loan/:id
   */
  async updateLoan(id: string, data: UpdateLoanDto): Promise<Loan> {
    try {
      const token = getAuthToken();
      const response = await axios.put<LoanResponse>(
        `${API.domain}${API.endPoints.updateLoan}/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const loan = response.data.data?.loan || response.data.result?.loan;
        return normalizeLoan(loan);
      } else {
        throw new Error('Failed to update loan');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update loan');
    }
  },

  /**
   * Approve a loan
   * API: PATCH /api/v1/loan/approve-loan/:id
   */
  async approveLoan(id: string, approvedBy?: string, interestRate?: number): Promise<Loan> {
    try {
      const token = getAuthToken();
      const response = await axios.patch<LoanResponse>(
        `${API.domain}${API.endPoints.approveLoan}/${id}`,
        { approvedBy, interestRate },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const loan = response.data.data?.loan || response.data.result?.loan;
        return normalizeLoan(loan);
      } else {
        throw new Error('Failed to approve loan');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to approve loan');
    }
  },

  /**
   * Reject a loan
   * API: PATCH /api/v1/loan/reject-loan/:id
   */
  async rejectLoan(id: string, rejectedBy?: string, reason?: string): Promise<Loan> {
    try {
      const token = getAuthToken();
      const response = await axios.patch<LoanResponse>(
        `${API.domain}${API.endPoints.rejectLoan}/${id}`,
        { rejectedBy, reason },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const loan = response.data.data?.loan || response.data.result?.loan;
        return normalizeLoan(loan);
      } else {
        throw new Error('Failed to reject loan');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject loan');
    }
  },

  /**
   * Create a new loan (if needed - not in loadFlow.md but keeping for compatibility)
   */
  async createLoan(data: CreateLoanDto): Promise<Loan> {
    try {
      const token = getAuthToken();
      // Note: This endpoint is not in loadFlow.md, but keeping for compatibility
      // You may need to add this endpoint to your backend
      const response = await axios.post<LoanResponse>(
        `${API.domain}/api/v1/loan/create-loan`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if ((response.status === 200 || response.status === 201) && response.data.success) {
        const loan = response.data.data?.loan || response.data.result?.loan;
        return normalizeLoan(loan);
      } else {
        throw new Error('Failed to create loan');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create loan');
    }
  },

  /**
   * Delete a loan (if needed - not in loadFlow.md but keeping for compatibility)
   */
  async deleteLoan(id: string): Promise<void> {
    try {
      const token = getAuthToken();
      // Note: This endpoint is not in loadFlow.md, but keeping for compatibility
      const response = await axios.delete(
        `${API.domain}/api/v1/loan/delete-loan/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status !== 200 && response.status !== 204) {
        throw new Error('Failed to delete loan');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete loan');
    }
  },

  /**
   * Disburse a loan (if needed - not in loadFlow.md but keeping for compatibility)
   */
  async disburseLoan(id: string): Promise<Loan> {
    try {
      const token = getAuthToken();
      // Note: This endpoint is not in loadFlow.md, but keeping for compatibility
      const response = await axios.patch<LoanResponse>(
        `${API.domain}/api/v1/loan/disburse-loan/${id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const loan = response.data.data?.loan || response.data.result?.loan;
        return normalizeLoan(loan);
      } else {
        throw new Error('Failed to disburse loan');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to disburse loan');
    }
  },

  /**
   * Get customer loans
   */
  async getCustomerLoans(customerId: string): Promise<Loan[]> {
    return this.getLoans({ userId: customerId });
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
