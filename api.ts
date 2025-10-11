// API Client Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    VERIFY_TOKEN: '/auth/verify'
  },

  // User Settings
  SETTINGS: {
    GET_USER_SETTINGS: '/settings/user',
    UPDATE_USER_SETTINGS: '/settings/user',
    GET_ORGANIZATION_SETTINGS: '/settings/organization',
    UPDATE_ORGANIZATION_SETTINGS: '/settings/organization',
    EXPORT_SETTINGS: '/settings/export',
    IMPORT_SETTINGS: '/settings/import',
    RESET_SETTINGS: '/settings/reset',
    CREATE_SETTINGS_BACKUP: '/settings/backup',
    GET_SETTINGS_BACKUP: '/settings/backup'
  },

  // Appearance & Theme
  APPEARANCE: {
    GET_THEMES: '/appearance/themes',
    UPDATE_THEME: '/appearance/theme',
    GET_USER_THEME: '/appearance/user-theme'
  },

  // Security
  SECURITY: {
    UPDATE_PASSWORD: '/security/password',
    TOGGLE_2FA: '/security/2fa',
    GET_SECURITY_LOGS: '/security/logs',
    UPDATE_SECURITY_SETTINGS: '/security/settings'
  },

  // System
  SYSTEM: {
    GET_SYSTEM_INFO: '/system/info',
    UPDATE_SYSTEM_SETTINGS: '/system/settings',
    GET_AUDIT_LOGS: '/system/audit',
    HEALTH_CHECK: '/system/health'
  },

  // Users
  USERS: {
    GET_USERS: '/users',
    CREATE_USER: '/users',
    UPDATE_USER: '/users',
    DELETE_USER: '/users',
    GET_USER_PROFILE: '/users/profile'
  },

  // Customers
  CUSTOMERS: {
    GET_CUSTOMERS: '/customers',
    GET_CUSTOMER_BY_ID: '/customers',
    CREATE_CUSTOMER: '/customers',
    UPDATE_CUSTOMER: '/customers',
    DELETE_CUSTOMER: '/customers',
    GET_CUSTOMER_STATS: '/customers/stats',
    GET_CUSTOMER_KYC: '/customers/kyc',
    UPDATE_CUSTOMER_KYC: '/customers/kyc',
    VERIFY_KYC: '/customers/kyc/verify',
    GET_CUSTOMER_DOCUMENTS: '/customers/documents',
    UPLOAD_DOCUMENT: '/customers/documents/upload',
    DELETE_DOCUMENT: '/customers/documents',
    GET_CUSTOMER_ADDRESSES: '/customers/addresses',
    ADD_CUSTOMER_ADDRESS: '/customers/addresses',
    UPDATE_CUSTOMER_ADDRESS: '/customers/addresses',
    DELETE_CUSTOMER_ADDRESS: '/customers/addresses',
    GET_CUSTOMER_NOMINEES: '/customers/nominees',
    ADD_CUSTOMER_NOMINEE: '/customers/nominees',
    UPDATE_CUSTOMER_NOMINEE: '/customers/nominees',
    DELETE_CUSTOMER_NOMINEE: '/customers/nominees',
    GET_CUSTOMER_ACCOUNTS: '/customers/accounts',
    ASSESS_CUSTOMER_RISK: '/customers/risk/assess',
    UPDATE_CUSTOMER_STATUS: '/customers/status',
    BULK_UPDATE_CUSTOMERS: '/customers/bulk-update',
    EXPORT_CUSTOMERS: '/customers/export'
  }
} as const;

// API Error interface
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  timestamp: string;
  requestId?: string;
}

// Request configuration interface
interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

// API Client Class
export class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Set authentication token
  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // Get authentication token
  getToken(): string | null {
    return this.token;
  }

  // Build headers for requests
  private buildHeaders(config?: RequestConfig): Record<string, string> {
    const headers = { 
      ...this.defaultHeaders, 
      ...config?.headers 
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Build full URL
  private buildURL(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  // Handle API response
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || `HTTP ${response.status}: ${response.statusText}`,
        code: data.code || `HTTP_${response.status}`,
        status: response.status,
        details: data.details || data
      };

      throw error;
    }

    return data;
  }

  // Generic request method
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    const headers = this.buildHeaders(config);

    const requestConfig: RequestInit = {
      method,
      headers,
      ...(data && method !== 'GET' && { body: JSON.stringify(data) })
    };

    // Add timeout if specified
    const controller = new AbortController();
    if (config?.timeout) {
      setTimeout(() => controller.abort(), config.timeout);
      requestConfig.signal = controller.signal;
    }

    try {
      const response = await fetch(url, requestConfig);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      // Handle network errors, timeouts, etc.
      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          code: 'TIMEOUT',
          status: 408
        } as ApiError;
      }

      // Re-throw API errors as-is
      if (error.status) {
        throw error;
      }

      // Handle other errors
      throw {
        message: error.message || 'Network error occurred',
        code: 'NETWORK_ERROR',
        status: 0,
        details: error
      } as ApiError;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, null, config);
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, null, config);
  }

  // File upload method
  async upload<T>(
    endpoint: string, 
    file: File | FormData, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    const headers = this.buildHeaders(config);
    
    // Remove content-type header to let browser set it for FormData
    delete headers['Content-Type'];

    const formData = file instanceof FormData ? file : (() => {
      const fd = new FormData();
      fd.append('file', file);
      return fd;
    })();

    const requestConfig: RequestInit = {
      method: 'POST',
      headers,
      body: formData
    };

    try {
      const response = await fetch(url, requestConfig);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.status) {
        throw error;
      }

      throw {
        message: error.message || 'Upload failed',
        code: 'UPLOAD_ERROR',
        status: 0,
        details: error
      } as ApiError;
    }
  }
}

// Create and export default API client instance
export const apiClient = new ApiClient();

// Export convenience methods
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) => apiClient.get<T>(endpoint, config),
  post: <T>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.post<T>(endpoint, data, config),
  put: <T>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.put<T>(endpoint, data, config),
  patch: <T>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.patch<T>(endpoint, data, config),
  delete: <T>(endpoint: string, config?: RequestConfig) => apiClient.delete<T>(endpoint, config),
  upload: <T>(endpoint: string, file: File | FormData, config?: RequestConfig) => apiClient.upload<T>(endpoint, file, config)
};

// Helper functions for common API operations
export const setAuthToken = (token: string | null) => apiClient.setToken(token);
export const getAuthToken = () => apiClient.getToken();
export const clearAuth = () => apiClient.setToken(null);

// Export types for external use
export type { RequestConfig };