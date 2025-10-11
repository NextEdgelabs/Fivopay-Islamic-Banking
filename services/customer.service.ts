import { apiClient, API_ENDPOINTS, ApiResponse, ApiError } from '../api';
import { logger } from '../utils/logger';
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
  RiskRating
} from '../src/types/customer';

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
      return await apiClient.get<Customer>(`${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_BY_ID}/${customerId}`);
    } catch (error) {
      logger.apiError('Failed to fetch customer by ID', error, `${API_ENDPOINTS.CUSTOMERS.GET_CUSTOMER_BY_ID}/${customerId}`);
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
  static validateCustomerData(customerData: Partial<Customer>): { isValid: boolean; errors: string[] } {
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
}

export default CustomerService;
