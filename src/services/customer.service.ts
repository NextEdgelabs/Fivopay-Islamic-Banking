import { ApiResponse, ApiError } from '../types/api';
import { apiClient, API_ENDPOINTS } from './api-client';
import { logger } from '../../utils/logger';
import { 
  Customer, 
  CustomerKYC, 
  CustomerDocument, 
  CustomerAddress, 
  CustomerNominee,
  CustomerAccount,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerSearchFilters,
  CustomerListResponse,
  CustomerStats,
  CustomerType,
  CustomerStatus,
  KYCStatus,
  RiskRating,
  CustomerLoan,
  CustomerDeposit,
  CustomerActivity,
  LoanRepayment,
  CustomerKYCDetailed,
  AddressDetailed
} from '../types/customer';

// Customer Service Class
export class CustomerService {
  // Customer CRUD Operations
  static async getCustomers(filters?: CustomerSearchFilters): Promise<ApiResponse<CustomerListResponse>> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }
      
      const queryString = params.toString();
      const endpoint = queryString ? `${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMERS}?${queryString}` : API_ENDPOINTS.CUSTOMERS.GET_CUSTOMERS;
      
      return await apiClient.get<CustomerListResponse>(endpoint);
    } catch (error) {
      logger.apiError('Failed to fetch customers', error, API_ENDPOINTS.CUSTOMERS.GET_CUSTOMERS);
      throw error;
    }
  }

  static async getCustomerById(customerId: string): Promise<ApiResponse<Customer>> {
    try {
      console.log('🔵 CustomerService: Calling API for customer ID:', customerId);
      const result = await apiClient.get<Customer>(`${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_BY_ID}/${customerId}`);
      console.log('🔵 CustomerService: API returned:', result);
      return result;
    } catch (error) {
      logger.apiError('Failed to fetch customer by ID', error, `${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_BY_ID}/${customerId}`);
      console.error('❌ CustomerService: Error:', error);
      throw error;
    }
  }

  static async createCustomer(customerData: CreateCustomerRequest): Promise<ApiResponse<Customer>> {
    try {
      return await apiClient.post<Customer>(API_ENDPOINTS.CUSTOMERS.CREATE_CUSTOMER, customerData);
    } catch (error) {
      logger.apiError('Failed to create customer', error, API_ENDPOINTS.CUSTOMERS.CREATE_CUSTOMER);
      throw error;
    }
  }

  static async updateCustomer(customerId: string, updates: UpdateCustomerRequest): Promise<ApiResponse<Customer>> {
    try {
      return await apiClient.put<Customer>(`${API_ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER}/${customerId}`, updates);
    } catch (error) {
      logger.apiError('Failed to update customer', error, `${API_ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER}/${customerId}`);
      throw error;
    }
  }

  static async deleteCustomer(customerId: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await apiClient.delete(`${API_ENDPOINTS.CUSTOMERS.DELETE_CUSTOMER}/${customerId}`);
    } catch (error) {
      logger.apiError('Failed to delete customer', error, `${API_ENDPOINTS.CUSTOMERS.DELETE_CUSTOMER}/${customerId}`);
      throw error;
    }
  }

  // Customer Statistics
  static async getCustomerStats(): Promise<ApiResponse<CustomerStats>> {
    try {
      return await apiClient.get<CustomerStats>(API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_STATS);
    } catch (error) {
      logger.apiError('Failed to fetch customer stats', error, API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_STATS);
      throw error;
    }
  }

  // KYC Operations
  static async getCustomerKYC(customerId: string): Promise<ApiResponse<CustomerKYC>> {
    try {
      return await apiClient.get<CustomerKYC>(`${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_KYC}/${customerId}`);
    } catch (error) {
      logger.apiError('Failed to fetch customer KYC', error, `${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_KYC}/${customerId}`);
      throw error;
    }
  }

  static async updateCustomerKYC(customerId: string, kycData: Partial<CustomerKYC>): Promise<ApiResponse<CustomerKYC>> {
    try {
      return await apiClient.put<CustomerKYC>(`${API_ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER_KYC}/${customerId}`, kycData);
    } catch (error) {
      logger.apiError('Failed to update customer KYC', error, `${API_ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER_KYC}/${customerId}`);
      throw error;
    }
  }

  static async verifyKYC(customerId: string, kycId: string): Promise<ApiResponse<{ verified: boolean }>> {
    try {
      return await apiClient.post(`${API_ENDPOINTS.CUSTOMERS.VERIFY_KYC}/${customerId}/${kycId}`);
    } catch (error) {
      logger.apiError('Failed to verify KYC', error, `${API_ENDPOINTS.CUSTOMERS.VERIFY_KYC}/${customerId}/${kycId}`);
      throw error;
    }
  }

  // Document Operations
  static async getCustomerDocuments(customerId: string): Promise<ApiResponse<CustomerDocument[]>> {
    try {
      return await apiClient.get<CustomerDocument[]>(`${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_DOCUMENTS}/${customerId}`);
    } catch (error) {
      logger.apiError('Failed to fetch customer documents', error, `${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_DOCUMENTS}/${customerId}`);
      throw error;
    }
  }

  static async uploadDocument(customerId: string, document: FormData): Promise<ApiResponse<CustomerDocument>> {
    try {
      return await apiClient.post<CustomerDocument>(`${API_ENDPOINTS.CUSTOMERS.UPLOAD_DOCUMENT}/${customerId}`, document, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      logger.apiError('Failed to upload document', error, `${API_ENDPOINTS.CUSTOMERS.UPLOAD_DOCUMENT}/${customerId}`);
      throw error;
    }
  }

  static async deleteDocument(customerId: string, documentId: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await apiClient.delete(`${API_ENDPOINTS.CUSTOMERS.DELETE_DOCUMENT}/${customerId}/${documentId}`);
    } catch (error) {
      logger.apiError('Failed to delete document', error, `${API_ENDPOINTS.CUSTOMERS.DELETE_DOCUMENT}/${customerId}/${documentId}`);
      throw error;
    }
  }

  // Address Operations
  static async getCustomerAddresses(customerId: string): Promise<ApiResponse<CustomerAddress[]>> {
    try {
      return await apiClient.get<CustomerAddress[]>(`${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_ADDRESSES}/${customerId}`);
    } catch (error) {
      logger.apiError('Failed to fetch customer addresses', error, `${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_ADDRESSES}/${customerId}`);
      throw error;
    }
  }

  static async addCustomerAddress(customerId: string, address: Omit<CustomerAddress, 'addressId' | 'customerId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<CustomerAddress>> {
    try {
      return await apiClient.post<CustomerAddress>(`${API_ENDPOINTS.CUSTOMERS.ADD_CUSTOMER_ADDRESS}/${customerId}`, address);
    } catch (error) {
      logger.apiError('Failed to add customer address', error, `${API_ENDPOINTS.CUSTOMERS.ADD_CUSTOMER_ADDRESS}/${customerId}`);
      throw error;
    }
  }

  static async updateCustomerAddress(customerId: string, addressId: string, updates: Partial<CustomerAddress>): Promise<ApiResponse<CustomerAddress>> {
    try {
      return await apiClient.put<CustomerAddress>(`${API_ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER_ADDRESS}/${customerId}/${addressId}`, updates);
    } catch (error) {
      logger.apiError('Failed to update customer address', error, `${API_ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER_ADDRESS}/${customerId}/${addressId}`);
      throw error;
    }
  }

  static async deleteCustomerAddress(customerId: string, addressId: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await apiClient.delete(`${API_ENDPOINTS.CUSTOMERS.DELETE_CUSTOMER_ADDRESS}/${customerId}/${addressId}`);
    } catch (error) {
      logger.apiError('Failed to delete customer address', error, `${API_ENDPOINTS.CUSTOMERS.DELETE_CUSTOMER_ADDRESS}/${customerId}/${addressId}`);
      throw error;
    }
  }

  // Nominee Operations
  static async getCustomerNominees(customerId: string): Promise<ApiResponse<CustomerNominee[]>> {
    try {
      return await apiClient.get<CustomerNominee[]>(`${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_NOMINEES}/${customerId}`);
    } catch (error) {
      logger.apiError('Failed to fetch customer nominees', error, `${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_NOMINEES}/${customerId}`);
      throw error;
    }
  }

  static async addCustomerNominee(customerId: string, nominee: Omit<CustomerNominee, 'nomineeId' | 'customerId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<CustomerNominee>> {
    try {
      return await apiClient.post<CustomerNominee>(`${API_ENDPOINTS.CUSTOMERS.ADD_CUSTOMER_NOMINEE}/${customerId}`, nominee);
    } catch (error) {
      logger.apiError('Failed to add customer nominee', error, `${API_ENDPOINTS.CUSTOMERS.ADD_CUSTOMER_NOMINEE}/${customerId}`);
      throw error;
    }
  }

  static async updateCustomerNominee(customerId: string, nomineeId: string, updates: Partial<CustomerNominee>): Promise<ApiResponse<CustomerNominee>> {
    try {
      return await apiClient.put<CustomerNominee>(`${API_ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER_NOMINEE}/${customerId}/${nomineeId}`, updates);
    } catch (error) {
      logger.apiError('Failed to update customer nominee', error, `${API_ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER_NOMINEE}/${customerId}/${nomineeId}`);
      throw error;
    }
  }

  static async deleteCustomerNominee(customerId: string, nomineeId: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await apiClient.delete(`${API_ENDPOINTS.CUSTOMERS.DELETE_CUSTOMER_NOMINEE}/${customerId}/${nomineeId}`);
    } catch (error) {
      logger.apiError('Failed to delete customer nominee', error, `${API_ENDPOINTS.CUSTOMERS.DELETE_CUSTOMER_NOMINEE}/${customerId}/${nomineeId}`);
      throw error;
    }
  }

  // Account Operations
  static async getCustomerAccounts(customerId: string): Promise<ApiResponse<CustomerAccount[]>> {
    try {
      return await apiClient.get<CustomerAccount[]>(`${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_ACCOUNTS}/${customerId}`);
    } catch (error) {
      logger.apiError('Failed to fetch customer accounts', error, `${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_ACCOUNTS}/${customerId}`);
      throw error;
    }
  }

  // Risk Assessment
  static async assessCustomerRisk(customerId: string): Promise<ApiResponse<{ riskRating: RiskRating; riskScore: number; factors: string[] }>> {
    try {
      return await apiClient.post(`${API_ENDPOINTS.CUSTOMERS.ASSESS_CUSTOMER_RISK}/${customerId}`);
    } catch (error) {
      logger.apiError('Failed to assess customer risk', error, `${API_ENDPOINTS.CUSTOMERS.ASSESS_CUSTOMER_RISK}/${customerId}`);
      throw error;
    }
  }

  // Customer Status Management
  static async updateCustomerStatus(customerId: string, status: CustomerStatus, reason?: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await apiClient.patch(`${API_ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER_STATUS}/${customerId}`, { status, reason });
    } catch (error) {
      logger.apiError('Failed to update customer status', error, `${API_ENDPOINTS.CUSTOMERS.UPDATE_CUSTOMER_STATUS}/${customerId}`);
      throw error;
    }
  }

  // Bulk Operations
  static async bulkUpdateCustomers(updates: Array<{ customerId: string; updates: Partial<Customer> }>): Promise<ApiResponse<{ success: number; failed: number; errors: string[] }>> {
    try {
      return await apiClient.post(API_ENDPOINTS.CUSTOMERS.BULK_UPDATE_CUSTOMERS, { updates });
    } catch (error) {
      logger.apiError('Failed to bulk update customers', error, API_ENDPOINTS.CUSTOMERS.BULK_UPDATE_CUSTOMERS);
      throw error;
    }
  }

  static async exportCustomers(filters?: CustomerSearchFilters): Promise<ApiResponse<{ downloadUrl: string; expiresAt: string }>> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }
      
      const queryString = params.toString();
      const endpoint = queryString ? `${API_ENDPOINTS.CUSTOMERS.EXPORT_CUSTOMERS}?${queryString}` : API_ENDPOINTS.CUSTOMERS.EXPORT_CUSTOMERS;
      
      return await apiClient.get(endpoint);
    } catch (error) {
      logger.apiError('Failed to export customers', error, API_ENDPOINTS.CUSTOMERS.EXPORT_CUSTOMERS);
      throw error;
    }
  }

  // Validation
  static validateCustomerData(customerData: Partial<Customer>): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];

    // Required field validation
    if (customerData.firstName && customerData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (customerData.lastName && customerData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    if (customerData.primaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.primaryEmail)) {
      errors.push('Invalid email format');
    }

    if (customerData.primaryMobile && !/^\+?[\d\s\-\(\)]+$/.test(customerData.primaryMobile)) {
      errors.push('Invalid mobile number format');
    }

    if (customerData.dateOfBirth) {
      const birthDate = new Date(customerData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        errors.push('Customer must be at least 18 years old');
      }
      
      if (age > 100) {
        errors.push('Invalid birth date');
      }
    }

    if (customerData.annualIncome && customerData.annualIncome < 0) {
      errors.push('Annual income cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Mock Data Generators
  static generateMockLoans(customerId: string): CustomerLoan[] {
    // Use customerId as seed for consistent data
    const seed = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Generate 0-3 loans per customer
    const loanCount = seed % 4;
    const loans: CustomerLoan[] = [];
    
    const loanTypes = ['Personal Loan', 'Home Loan', 'Business Loan', 'Vehicle Loan', 'Education Loan'];
    const statuses: Array<'Active' | 'Overdue' | 'Closed' | 'Settled' | 'Default'> = ['Active', 'Overdue', 'Closed', 'Settled', 'Default'];
    
    for (let i = 0; i < loanCount; i++) {
      const principalAmount = random(50000, 2000000);
      const tenure = random(12, 60);
      const disbursedAmount = principalAmount;
      const outstandingAmount = Math.floor(principalAmount * (0.3 + (seed % 70) / 100));
      const emiAmount = Math.floor(principalAmount * 0.02);
      const totalEmis = tenure;
      const paidEmis = Math.floor(totalEmis * (0.1 + (seed % 80) / 100));
      const delayedEmis = Math.floor(paidEmis * 0.1);
      const defaultEmis = Math.floor(paidEmis * 0.05);
      
      const loan: CustomerLoan = {
        loanId: `LOAN-${customerId}-${i + 1}`,
        customerId,
        accountNumber: `LN-2024-${String(i + 1).padStart(4, '0')}`,
        loanType: loanTypes[seed % loanTypes.length],
        principalAmount,
        outstandingAmount,
        disbursedAmount,
        disbursementDate: new Date(Date.now() - random(30, 365) * 24 * 60 * 60 * 1000).toISOString(),
        tenure,
        emiAmount,
        nextEmiDate: new Date(Date.now() + random(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
        interestRate: 12 + (seed % 5),
        profitRate: 8 + (seed % 3),
        status: statuses[seed % statuses.length],
        totalEmis,
        paidEmis,
        delayedEmis,
        defaultEmis,
        averageDelayDays: random(1, 15),
        lastPaymentDate: new Date(Date.now() - random(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
        lastPaymentAmount: emiAmount,
        loanOfficerId: `OFF-${random(100, 999)}`,
        loanOfficerName: `Officer ${random(1, 20)}`,
        createdAt: new Date(Date.now() - random(30, 365) * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      loans.push(loan);
    }
    
    return loans;
  }

  static generateMockDeposits(customerId: string): CustomerDeposit[] {
    const seed = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Generate 0-2 deposits per customer
    const depositCount = seed % 3;
    const deposits: CustomerDeposit[] = [];
    
    const depositTypes: Array<'Fixed Deposit' | 'Recurring Deposit'> = ['Fixed Deposit', 'Recurring Deposit'];
    const statuses: Array<'Active' | 'Matured' | 'Closed' | 'Premature Closure'> = ['Active', 'Matured', 'Closed', 'Premature Closure'];
    
    for (let i = 0; i < depositCount; i++) {
      const principalAmount = random(10000, 1000000);
      const tenure = random(6, 60);
      const interestRate = 6 + (seed % 4);
      const profitRate = 4 + (seed % 3);
      const startDate = new Date(Date.now() - random(30, 365) * 24 * 60 * 60 * 1000);
      const maturityDate = new Date(startDate.getTime() + tenure * 30 * 24 * 60 * 60 * 1000);
      const maturityAmount = Math.floor(principalAmount * (1 + (interestRate / 100) * (tenure / 12)));
      const currentValue = Math.floor(principalAmount * (1 + (interestRate / 100) * ((Date.now() - startDate.getTime()) / (365 * 24 * 60 * 60 * 1000))));
      
      const deposit: CustomerDeposit = {
        depositId: `DEP-${customerId}-${i + 1}`,
        customerId,
        accountNumber: `FD-2024-${String(i + 1).padStart(4, '0')}`,
        depositType: depositTypes[seed % depositTypes.length],
        principalAmount,
        currentValue,
        interestRate,
        profitRate,
        profitSharingRatio: 70 + (seed % 20),
        startDate: startDate.toISOString(),
        maturityDate: maturityDate.toISOString(),
        maturityAmount,
        tenure,
        autoRenewal: seed % 2 === 0,
        nomineeRegistered: seed % 3 !== 0,
        status: statuses[seed % statuses.length],
        interestCredited: currentValue - principalAmount,
        lastInterestDate: new Date(Date.now() - random(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
        prematureClosureCharges: Math.floor(principalAmount * 0.01),
        createdAt: startDate.toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      deposits.push(deposit);
    }
    
    return deposits;
  }

  static generateMockActivities(customerId: string): CustomerActivity[] {
    const seed = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const activities: CustomerActivity[] = [];
    const activityTypes: Array<'Account' | 'Loan' | 'Deposit' | 'Communication' | 'Team' | 'Request'> = 
      ['Account', 'Loan', 'Deposit', 'Communication', 'Team', 'Request'];
    
    const staffNames = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Brown', 'David Lee', 'System'];
    
    // Generate 10-50 activities
    const activityCount = 10 + (seed % 40);
    
    for (let i = 0; i < activityCount; i++) {
      const activityType = activityTypes[seed % activityTypes.length];
      const timestamp = new Date(Date.now() - random(1, 365) * 24 * 60 * 60 * 1000);
      
      let title = '';
      let description = '';
      let metadata: any = {};
      
      switch (activityType) {
        case 'Account':
          title = 'Account Activity';
          description = 'Customer account information updated';
          break;
        case 'Loan':
          title = 'Loan Activity';
          description = 'Loan application processed';
          metadata = { loanId: `LOAN-${customerId}-1`, amount: random(100000, 1000000) };
          break;
        case 'Deposit':
          title = 'Deposit Activity';
          description = 'Fixed deposit opened';
          metadata = { depositId: `DEP-${customerId}-1`, amount: random(50000, 500000) };
          break;
        case 'Communication':
          title = 'Customer Communication';
          description = 'Phone call with customer';
          metadata = { channel: 'phone', duration: random(5, 30) };
          break;
        case 'Team':
          title = 'Team Interaction';
          description = 'Internal note added';
          break;
        case 'Request':
          title = 'Service Request';
          description = 'Customer submitted service request';
          break;
      }
      
      const activity: CustomerActivity = {
        activityId: `ACT-${customerId}-${i + 1}`,
        customerId,
        activityType,
        title,
        description,
        timestamp: timestamp.toISOString(),
        performedBy: staffNames[seed % staffNames.length],
        performedById: `USER-${random(100, 999)}`,
        metadata,
        isExpandable: seed % 3 === 0,
        expandedDetails: seed % 3 === 0 ? 'Additional details about this activity...' : undefined,
        createdAt: timestamp.toISOString()
      };
      
      activities.push(activity);
    }
    
    // Sort by timestamp (newest first)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static generateMockRepayments(loanId: string): LoanRepayment[] {
    const seed = loanId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const repayments: LoanRepayment[] = [];
    const totalEmis = 12 + (seed % 48); // 12-60 EMIs
    const emiAmount = 15000 + (seed % 35000);
    
    for (let i = 1; i <= totalEmis; i++) {
      const dueDate = new Date(Date.now() - (totalEmis - i) * 30 * 24 * 60 * 60 * 1000);
      const isPaid = i <= Math.floor(totalEmis * 0.7) + (seed % 10); // 70-80% paid
      const isDelayed = isPaid && seed % 5 === 0; // 20% of paid are delayed
      const delayDays = isDelayed ? random(1, 30) : 0;
      const paidDate = isPaid ? new Date(dueDate.getTime() + delayDays * 24 * 60 * 60 * 1000) : undefined;
      
      const repayment: LoanRepayment = {
        emiNumber: i,
        loanId,
        customerId: loanId.split('-')[1],
        dueDate: dueDate.toISOString(),
        paidDate: paidDate?.toISOString(),
        amount: emiAmount,
        principalAmount: Math.floor(emiAmount * 0.7),
        interestAmount: Math.floor(emiAmount * 0.3),
        status: isPaid ? (isDelayed ? 'Overdue' : 'Paid') : 'Pending',
        delayDays,
        paymentMethod: isPaid ? ['UPI', 'NEFT', 'Cheque', 'Cash'][seed % 4] : undefined,
        referenceNumber: isPaid ? `REF-${random(100000, 999999)}` : undefined,
        penaltyAmount: isDelayed ? Math.floor(emiAmount * 0.02) : undefined,
        waiverAmount: seed % 10 === 0 ? Math.floor(emiAmount * 0.1) : undefined,
        remarks: isDelayed ? 'Payment delayed due to customer request' : undefined,
        createdAt: dueDate.toISOString(),
        updatedAt: paidDate?.toISOString() || dueDate.toISOString()
      };
      
      repayments.push(repayment);
    }
    
    return repayments;
  }

  // New Service Methods
  static async getCustomerLoans(customerId: string): Promise<ApiResponse<CustomerLoan[]>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const loans = this.generateMockLoans(customerId);
      return {
        success: true,
        data: loans,
        message: 'Customer loans fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.apiError('Failed to fetch customer loans', error, `customers/${customerId}/loans`);
      throw error;
    }
  }

  static async getCustomerDeposits(customerId: string): Promise<ApiResponse<CustomerDeposit[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const deposits = this.generateMockDeposits(customerId);
      return {
        success: true,
        data: deposits,
        message: 'Customer deposits fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.apiError('Failed to fetch customer deposits', error, `customers/${customerId}/deposits`);
      throw error;
    }
  }

  static async getCustomerActivities(customerId: string): Promise<ApiResponse<CustomerActivity[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const activities = this.generateMockActivities(customerId);
      return {
        success: true,
        data: activities,
        message: 'Customer activities fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.apiError('Failed to fetch customer activities', error, `customers/${customerId}/activities`);
      throw error;
    }
  }

  static async getLoanRepaymentHistory(customerId: string, loanId: string): Promise<ApiResponse<LoanRepayment[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const repayments = this.generateMockRepayments(loanId);
      return {
        success: true,
        data: repayments,
        message: 'Loan repayment history fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.apiError('Failed to fetch loan repayment history', error, `customers/${customerId}/loans/${loanId}/repayments`);
      throw error;
    }
  }

  static async getCustomerKYCDetails(customerId: string): Promise<ApiResponse<CustomerKYCDetailed>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock KYC details
      const kycDetails: CustomerKYCDetailed = {
        kycId: `KYC-${customerId}`,
        customerId,
        kycType: 'Full_KYC' as any,
        kycStatus: 'Verified' as any,
        kycLevel: 'Advanced' as any,
        verificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedBy: 'KYC_OFFICER_001',
        aadhaarNumber: '123456789012',
        aadhaarVerified: true,
        aadhaarVerificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        aadhaarEkycStatus: 'Verified',
        panNumber: 'ABCDE1234F',
        panVerified: true,
        panVerificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        panNameMatch: true,
        ckycNumber: 'CKYC123456789',
        ckycVerified: true,
        videoKycCompleted: true,
        videoKycDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        videoKycAgentId: 'AGENT_001',
        ipvCompleted: true,
        fatcaApplicable: false,
        crsApplicable: true,
        amlScreeningStatus: 'Cleared',
        amlScreeningDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        sanctionsCheck: true,
        adverseMediaCheck: true,
        remarks: 'All KYC documents verified successfully',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Extended properties
        aadhaarDocumentUrl: '/documents/aadhaar.pdf',
        panDocumentUrl: '/documents/pan.pdf',
        photoUrl: '/documents/photo.jpg',
        signatureUrl: '/documents/signature.jpg',
        addressProofUrl: '/documents/address-proof.pdf',
        incomeProofUrl: '/documents/income-proof.pdf',
        
        verificationHistory: [
          {
            field: 'Aadhaar Number',
            oldValue: '',
            newValue: '123456789012',
            verifiedBy: 'KYC_OFFICER_001',
            verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            remarks: 'Aadhaar verified through eKYC'
          }
        ],
        
        documentVerification: [
          {
            documentType: 'Aadhaar',
            documentNumber: '123456789012',
            verificationStatus: 'Verified',
            verifiedBy: 'KYC_OFFICER_001',
            verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            documentUrl: '/documents/aadhaar.pdf'
          },
          {
            documentType: 'PAN',
            documentNumber: 'ABCDE1234F',
            verificationStatus: 'Verified',
            verifiedBy: 'KYC_OFFICER_001',
            verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            documentUrl: '/documents/pan.pdf'
          }
        ],
        
        complianceStatus: {
          amlScreening: 'Cleared',
          sanctionsCheck: 'Cleared',
          adverseMediaCheck: 'Cleared',
          pepStatus: false,
          lastScreeningDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
      
      return {
        success: true,
        data: kycDetails,
        message: 'Customer KYC details fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.apiError('Failed to fetch customer KYC details', error, `customers/${customerId}/kyc`);
      throw error;
    }
  }

  static async getCustomerAddresses(customerId: string): Promise<ApiResponse<CustomerAddress[]>> {
    try {
      const response = await apiClient.get<CustomerAddress[]>(`${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_ADDRESSES}/${customerId}`);
      return response;
    } catch (error) {
      logger.apiError('Failed to fetch customer addresses', error, `customers/${customerId}/addresses`);
      return {
        success: true,
        data: [],
        message: 'No addresses found',
        timestamp: new Date().toISOString()
      };
    }
  }

  static async getCustomerFullProfile(customerId: string): Promise<ApiResponse<{
    customer: Customer;
    kyc: CustomerKYCDetailed;
    loans: CustomerLoan[];
    deposits: CustomerDeposit[];
    activities: CustomerActivity[];
    addresses: CustomerAddress[];
  }>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch all data in parallel
      const [customerRes, kycRes, loansRes, depositsRes, activitiesRes, addressesRes] = await Promise.all([
        this.getCustomerById(customerId),
        this.getCustomerKYCDetails(customerId),
        this.getCustomerLoans(customerId),
        this.getCustomerDeposits(customerId),
        this.getCustomerActivities(customerId),
        this.getCustomerAddresses(customerId)
      ]);
      
      if (!customerRes.success || !customerRes.data) {
        throw new Error('Customer not found');
      }
      
      return {
        success: true,
        data: {
          customer: customerRes.data,
          kyc: kycRes.data!,
          loans: loansRes.data || [],
          deposits: depositsRes.data || [],
          activities: activitiesRes.data || [],
          addresses: addressesRes.data || []
        },
        message: 'Customer full profile fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.apiError('Failed to fetch customer full profile', error, `customers/${customerId}/full-profile`);
      throw error;
    }
  }
}

// Customer Cache Management
export class CustomerCache {
  private static readonly CACHE_KEY = 'fivopay_customers_cache';
  private static readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  static set(customers: Customer[]): void {
    if (typeof window === 'undefined') return;

    const cacheData = {
      customers,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION
    };

    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache customers:', error);
    }
  }

  static get(): Customer[] | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      
      if (Date.now() > cacheData.expiresAt) {
        this.clear();
        return null;
      }

      return cacheData.customers;
    } catch (error) {
      console.warn('Failed to read customers cache:', error);
      this.clear();
      return null;
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear customers cache:', error);
    }
  }

  static isExpired(): boolean {
    if (typeof window === 'undefined') return true;

    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return true;

      const cacheData = JSON.parse(cached);
      return Date.now() > cacheData.expiresAt;
    } catch (error) {
      return true;
    }
  }

  // Mock Data Generators
  static generateMockLoans(customerId: string): CustomerLoan[] {
    // Use customerId as seed for consistent data
    const seed = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Generate 0-3 loans per customer
    const loanCount = seed % 4;
    const loans: CustomerLoan[] = [];
    
    const loanTypes = ['Personal Loan', 'Home Loan', 'Business Loan', 'Vehicle Loan', 'Education Loan'];
    const statuses: Array<'Active' | 'Overdue' | 'Closed' | 'Settled' | 'Default'> = ['Active', 'Overdue', 'Closed', 'Settled', 'Default'];
    
    for (let i = 0; i < loanCount; i++) {
      const principalAmount = random(50000, 2000000);
      const tenure = random(12, 60);
      const disbursedAmount = principalAmount;
      const outstandingAmount = Math.floor(principalAmount * (0.3 + (seed % 70) / 100));
      const emiAmount = Math.floor(principalAmount * 0.02);
      const totalEmis = tenure;
      const paidEmis = Math.floor(totalEmis * (0.1 + (seed % 80) / 100));
      const delayedEmis = Math.floor(paidEmis * 0.1);
      const defaultEmis = Math.floor(paidEmis * 0.05);
      
      const loan: CustomerLoan = {
        loanId: `LOAN-${customerId}-${i + 1}`,
        customerId,
        accountNumber: `LN-2024-${String(i + 1).padStart(4, '0')}`,
        loanType: loanTypes[seed % loanTypes.length],
        principalAmount,
        outstandingAmount,
        disbursedAmount,
        disbursementDate: new Date(Date.now() - random(30, 365) * 24 * 60 * 60 * 1000).toISOString(),
        tenure,
        emiAmount,
        nextEmiDate: new Date(Date.now() + random(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
        interestRate: 12 + (seed % 5),
        profitRate: 8 + (seed % 3),
        status: statuses[seed % statuses.length],
        totalEmis,
        paidEmis,
        delayedEmis,
        defaultEmis,
        averageDelayDays: random(1, 15),
        lastPaymentDate: new Date(Date.now() - random(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
        lastPaymentAmount: emiAmount,
        loanOfficerId: `OFF-${random(100, 999)}`,
        loanOfficerName: `Officer ${random(1, 20)}`,
        createdAt: new Date(Date.now() - random(30, 365) * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      loans.push(loan);
    }
    
    return loans;
  }

  static generateMockDeposits(customerId: string): CustomerDeposit[] {
    const seed = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Generate 0-2 deposits per customer
    const depositCount = seed % 3;
    const deposits: CustomerDeposit[] = [];
    
    const depositTypes: Array<'Fixed Deposit' | 'Recurring Deposit'> = ['Fixed Deposit', 'Recurring Deposit'];
    const statuses: Array<'Active' | 'Matured' | 'Closed' | 'Premature Closure'> = ['Active', 'Matured', 'Closed', 'Premature Closure'];
    
    for (let i = 0; i < depositCount; i++) {
      const principalAmount = random(10000, 1000000);
      const tenure = random(6, 60);
      const interestRate = 6 + (seed % 4);
      const profitRate = 4 + (seed % 3);
      const startDate = new Date(Date.now() - random(30, 365) * 24 * 60 * 60 * 1000);
      const maturityDate = new Date(startDate.getTime() + tenure * 30 * 24 * 60 * 60 * 1000);
      const maturityAmount = Math.floor(principalAmount * (1 + (interestRate / 100) * (tenure / 12)));
      const currentValue = Math.floor(principalAmount * (1 + (interestRate / 100) * ((Date.now() - startDate.getTime()) / (365 * 24 * 60 * 60 * 1000))));
      
      const deposit: CustomerDeposit = {
        depositId: `DEP-${customerId}-${i + 1}`,
        customerId,
        accountNumber: `FD-2024-${String(i + 1).padStart(4, '0')}`,
        depositType: depositTypes[seed % depositTypes.length],
        principalAmount,
        currentValue,
        interestRate,
        profitRate,
        profitSharingRatio: 70 + (seed % 20),
        startDate: startDate.toISOString(),
        maturityDate: maturityDate.toISOString(),
        maturityAmount,
        tenure,
        autoRenewal: seed % 2 === 0,
        nomineeRegistered: seed % 3 !== 0,
        status: statuses[seed % statuses.length],
        interestCredited: currentValue - principalAmount,
        lastInterestDate: new Date(Date.now() - random(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
        prematureClosureCharges: Math.floor(principalAmount * 0.01),
        createdAt: startDate.toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      deposits.push(deposit);
    }
    
    return deposits;
  }

  static generateMockActivities(customerId: string): CustomerActivity[] {
    const seed = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const activities: CustomerActivity[] = [];
    const activityTypes: Array<'Account' | 'Loan' | 'Deposit' | 'Communication' | 'Team' | 'Request'> = 
      ['Account', 'Loan', 'Deposit', 'Communication', 'Team', 'Request'];
    
    const staffNames = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Brown', 'David Lee', 'System'];
    
    // Generate 10-50 activities
    const activityCount = 10 + (seed % 40);
    
    for (let i = 0; i < activityCount; i++) {
      const activityType = activityTypes[seed % activityTypes.length];
      const timestamp = new Date(Date.now() - random(1, 365) * 24 * 60 * 60 * 1000);
      
      let title = '';
      let description = '';
      let metadata: any = {};
      
      switch (activityType) {
        case 'Account':
          title = 'Account Activity';
          description = 'Customer account information updated';
          break;
        case 'Loan':
          title = 'Loan Activity';
          description = 'Loan application processed';
          metadata = { loanId: `LOAN-${customerId}-1`, amount: random(100000, 1000000) };
          break;
        case 'Deposit':
          title = 'Deposit Activity';
          description = 'Fixed deposit opened';
          metadata = { depositId: `DEP-${customerId}-1`, amount: random(50000, 500000) };
          break;
        case 'Communication':
          title = 'Customer Communication';
          description = 'Phone call with customer';
          metadata = { channel: 'phone', duration: random(5, 30) };
          break;
        case 'Team':
          title = 'Team Interaction';
          description = 'Internal note added';
          break;
        case 'Request':
          title = 'Service Request';
          description = 'Customer submitted service request';
          break;
      }
      
      const activity: CustomerActivity = {
        activityId: `ACT-${customerId}-${i + 1}`,
        customerId,
        activityType,
        title,
        description,
        timestamp: timestamp.toISOString(),
        performedBy: staffNames[seed % staffNames.length],
        performedById: `USER-${random(100, 999)}`,
        metadata,
        isExpandable: seed % 3 === 0,
        expandedDetails: seed % 3 === 0 ? 'Additional details about this activity...' : undefined,
        createdAt: timestamp.toISOString()
      };
      
      activities.push(activity);
    }
    
    // Sort by timestamp (newest first)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static generateMockRepayments(loanId: string): LoanRepayment[] {
    const seed = loanId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const repayments: LoanRepayment[] = [];
    const totalEmis = 12 + (seed % 48); // 12-60 EMIs
    const emiAmount = 15000 + (seed % 35000);
    
    for (let i = 1; i <= totalEmis; i++) {
      const dueDate = new Date(Date.now() - (totalEmis - i) * 30 * 24 * 60 * 60 * 1000);
      const isPaid = i <= Math.floor(totalEmis * 0.7) + (seed % 10); // 70-80% paid
      const isDelayed = isPaid && seed % 5 === 0; // 20% of paid are delayed
      const delayDays = isDelayed ? random(1, 30) : 0;
      const paidDate = isPaid ? new Date(dueDate.getTime() + delayDays * 24 * 60 * 60 * 1000) : undefined;
      
      const repayment: LoanRepayment = {
        emiNumber: i,
        loanId,
        customerId: loanId.split('-')[1],
        dueDate: dueDate.toISOString(),
        paidDate: paidDate?.toISOString(),
        amount: emiAmount,
        principalAmount: Math.floor(emiAmount * 0.7),
        interestAmount: Math.floor(emiAmount * 0.3),
        status: isPaid ? (isDelayed ? 'Overdue' : 'Paid') : 'Pending',
        delayDays,
        paymentMethod: isPaid ? ['UPI', 'NEFT', 'Cheque', 'Cash'][seed % 4] : undefined,
        referenceNumber: isPaid ? `REF-${random(100000, 999999)}` : undefined,
        penaltyAmount: isDelayed ? Math.floor(emiAmount * 0.02) : undefined,
        waiverAmount: seed % 10 === 0 ? Math.floor(emiAmount * 0.1) : undefined,
        remarks: isDelayed ? 'Payment delayed due to customer request' : undefined,
        createdAt: dueDate.toISOString(),
        updatedAt: paidDate?.toISOString() || dueDate.toISOString()
      };
      
      repayments.push(repayment);
    }
    
    return repayments;
  }

  // New Service Methods
  static async getCustomerLoans(customerId: string): Promise<ApiResponse<CustomerLoan[]>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const loans = this.generateMockLoans(customerId);
      return {
        success: true,
        data: loans,
        message: 'Customer loans fetched successfully'
      };
    } catch (error) {
      logger.apiError('Failed to fetch customer loans', error, `customers/${customerId}/loans`);
      throw error;
    }
  }

  static async getCustomerDeposits(customerId: string): Promise<ApiResponse<CustomerDeposit[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const deposits = this.generateMockDeposits(customerId);
      return {
        success: true,
        data: deposits,
        message: 'Customer deposits fetched successfully'
      };
    } catch (error) {
      logger.apiError('Failed to fetch customer deposits', error, `customers/${customerId}/deposits`);
      throw error;
    }
  }

  static async getCustomerActivities(customerId: string): Promise<ApiResponse<CustomerActivity[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const activities = this.generateMockActivities(customerId);
      return {
        success: true,
        data: activities,
        message: 'Customer activities fetched successfully'
      };
    } catch (error) {
      logger.apiError('Failed to fetch customer activities', error, `customers/${customerId}/activities`);
      throw error;
    }
  }

  static async getLoanRepaymentHistory(customerId: string, loanId: string): Promise<ApiResponse<LoanRepayment[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const repayments = this.generateMockRepayments(loanId);
      return {
        success: true,
        data: repayments,
        message: 'Loan repayment history fetched successfully'
      };
    } catch (error) {
      logger.apiError('Failed to fetch loan repayment history', error, `customers/${customerId}/loans/${loanId}/repayments`);
      throw error;
    }
  }

  static async getCustomerKYCDetails(customerId: string): Promise<ApiResponse<CustomerKYCDetailed>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock KYC details
      const kycDetails: CustomerKYCDetailed = {
        kycId: `KYC-${customerId}`,
        customerId,
        kycType: 'Full_KYC',
        kycStatus: 'Verified',
        kycLevel: 'Advanced',
        verificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedBy: 'KYC_OFFICER_001',
        aadhaarNumber: '123456789012',
        aadhaarVerified: true,
        aadhaarVerificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        aadhaarEkycStatus: 'Verified',
        panNumber: 'ABCDE1234F',
        panVerified: true,
        panVerificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        panNameMatch: true,
        ckycNumber: 'CKYC123456789',
        ckycVerified: true,
        videoKycCompleted: true,
        videoKycDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        videoKycAgentId: 'AGENT_001',
        ipvCompleted: true,
        fatcaApplicable: false,
        crsApplicable: true,
        amlScreeningStatus: 'Cleared',
        amlScreeningDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        sanctionsCheck: true,
        adverseMediaCheck: true,
        remarks: 'All KYC documents verified successfully',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Extended properties
        aadhaarDocumentUrl: '/documents/aadhaar.pdf',
        panDocumentUrl: '/documents/pan.pdf',
        photoUrl: '/documents/photo.jpg',
        signatureUrl: '/documents/signature.jpg',
        addressProofUrl: '/documents/address-proof.pdf',
        incomeProofUrl: '/documents/income-proof.pdf',
        
        verificationHistory: [
          {
            field: 'Aadhaar Number',
            oldValue: '',
            newValue: '123456789012',
            verifiedBy: 'KYC_OFFICER_001',
            verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            remarks: 'Aadhaar verified through eKYC'
          }
        ],
        
        documentVerification: [
          {
            documentType: 'Aadhaar',
            documentNumber: '123456789012',
            verificationStatus: 'Verified',
            verifiedBy: 'KYC_OFFICER_001',
            verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            documentUrl: '/documents/aadhaar.pdf'
          },
          {
            documentType: 'PAN',
            documentNumber: 'ABCDE1234F',
            verificationStatus: 'Verified',
            verifiedBy: 'KYC_OFFICER_001',
            verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            documentUrl: '/documents/pan.pdf'
          }
        ],
        
        complianceStatus: {
          amlScreening: 'Cleared',
          sanctionsCheck: 'Cleared',
          adverseMediaCheck: 'Cleared',
          pepStatus: false,
          lastScreeningDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
      
      return {
        success: true,
        data: kycDetails,
        message: 'Customer KYC details fetched successfully'
      };
    } catch (error) {
      logger.apiError('Failed to fetch customer KYC details', error, `customers/${customerId}/kyc`);
      throw error;
    }
  }

  static async getCustomerFullProfile(customerId: string): Promise<ApiResponse<{
    customer: Customer;
    kyc: CustomerKYCDetailed;
    loans: CustomerLoan[];
    deposits: CustomerDeposit[];
    activities: CustomerActivity[];
    addresses: CustomerAddress[];
  }>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch all data in parallel
      const [customerRes, kycRes, loansRes, depositsRes, activitiesRes, addressesRes] = await Promise.all([
        this.getCustomerById(customerId),
        this.getCustomerKYCDetails(customerId),
        this.getCustomerLoans(customerId),
        this.getCustomerDeposits(customerId),
        this.getCustomerActivities(customerId),
        this.getCustomerAddresses(customerId)
      ]);
      
      if (!customerRes.success || !customerRes.data) {
        throw new Error('Customer not found');
      }
      
      return {
        success: true,
        data: {
          customer: customerRes.data,
          kyc: kycRes.data!,
          loans: loansRes.data || [],
          deposits: depositsRes.data || [],
          activities: activitiesRes.data || [],
          addresses: addressesRes.data || []
        },
        message: 'Customer full profile fetched successfully'
      };
    } catch (error) {
      logger.apiError('Failed to fetch customer full profile', error, `customers/${customerId}/full-profile`);
      throw error;
    }
  }
}

export default CustomerService;
