import { ApiResponse, ApiError } from '../types/api';

// Mock API endpoints for development
export const API_ENDPOINTS = {
  CUSTOMERS: {
    GET_CUSTOMERS: '/api/customers',
    GET_CUSTOMER_BY_ID: '/api/customers',
    CREATE_CUSTOMER: '/api/customers',
    UPDATE_CUSTOMER: '/api/customers',
    DELETE_CUSTOMER: '/api/customers',
    GET_CUSTOMER_STATS: '/api/customers/stats',
    GET_CUSTOMER_KYC: '/api/customers/kyc',
    UPDATE_CUSTOMER_KYC: '/api/customers/kyc',
    VERIFY_KYC: '/api/customers/kyc/verify',
    GET_CUSTOMER_DOCUMENTS: '/api/customers/documents',
    UPLOAD_DOCUMENT: '/api/customers/documents/upload',
    DELETE_DOCUMENT: '/api/customers/documents',
    GET_CUSTOMER_ADDRESSES: '/api/customers/addresses',
    ADD_CUSTOMER_ADDRESS: '/api/customers/addresses',
    UPDATE_CUSTOMER_ADDRESS: '/api/customers/addresses',
    DELETE_CUSTOMER_ADDRESS: '/api/customers/addresses',
    GET_CUSTOMER_NOMINEES: '/api/customers/nominees',
    ADD_CUSTOMER_NOMINEE: '/api/customers/nominees',
    UPDATE_CUSTOMER_NOMINEE: '/api/customers/nominees',
    DELETE_CUSTOMER_NOMINEE: '/api/customers/nominees',
    GET_CUSTOMER_ACCOUNTS: '/api/customers/accounts',
    ASSESS_CUSTOMER_RISK: '/api/customers/risk/assess',
    UPDATE_CUSTOMER_STATUS: '/api/customers/status',
    BULK_UPDATE_CUSTOMERS: '/api/customers/bulk-update',
    EXPORT_CUSTOMERS: '/api/customers/export'
  }
};

// Mock customer data - Comprehensive and realistic for Indian Islamic Banking
const mockCustomers = [
  {
    customerId: 'CUST001',
    customerType: 'Individual',
    title: 'Mr.',
    firstName: 'Ahmed',
    middleName: 'Hassan',
    lastName: 'Khan',
    fullName: 'Ahmed Hassan Khan',
    fatherName: 'Mohammed Ismail Khan',
    motherName: 'Zainab Begum',
    spouseName: 'Rukhsar Khan',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Indian',
    primaryMobile: '9876543210',
    secondaryMobile: '9876543211',
    primaryEmail: 'ahmed.khan@email.com',
    secondaryEmail: 'ahmed.hassan@email.com',
    preferredLanguage: 'en',
    occupation: 'Software Engineer',
    annualIncome: 1200000,
    incomeSource: 'Salary',
    customerSegment: 'Premium',
    customerCategory: 'Salaried',
    pepStatus: false,
    riskRating: 'Low',
    status: 'Active',
    onboardingDate: '2023-01-15T09:30:00.000Z',
    lastLogin: '2024-10-03T14:25:00.000Z',
    preferredBranchId: 'BR001',
    createdAt: '2023-01-15T09:30:00.000Z',
    updatedAt: '2024-10-03T14:25:00.000Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    customerId: 'CUST002',
    customerType: 'Individual',
    title: 'Ms.',
    firstName: 'Fatima',
    middleName: 'Begum',
    lastName: 'Ahmed',
    fullName: 'Fatima Begum Ahmed',
    fatherName: 'Abdul Rehman Ahmed',
    motherName: 'Amina Khatun',
    dateOfBirth: '1990-07-22',
    gender: 'Female',
    maritalStatus: 'Single',
    nationality: 'Indian',
    primaryMobile: '9123456780',
    secondaryMobile: '',
    primaryEmail: 'fatima.ahmed@email.com',
    secondaryEmail: '',
    preferredLanguage: 'en',
    occupation: 'School Teacher',
    annualIncome: 600000,
    incomeSource: 'Salary',
    customerSegment: 'Standard',
    customerCategory: 'Salaried',
    pepStatus: false,
    riskRating: 'Low',
    status: 'Active',
    onboardingDate: '2023-06-10T10:15:00.000Z',
    lastLogin: '2024-10-02T16:45:00.000Z',
    preferredBranchId: 'BR002',
    createdAt: '2023-06-10T10:15:00.000Z',
    updatedAt: '2024-10-02T16:45:00.000Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    customerId: 'CUST003',
    customerType: 'Business',
    title: 'Mr.',
    firstName: 'Mohammed',
    middleName: 'Ali',
    lastName: 'Sheikh',
    fullName: 'Mohammed Ali Sheikh',
    fatherName: 'Ibrahim Khalil Sheikh',
    motherName: 'Khadija Bibi',
    spouseName: 'Noor Jahan Sheikh',
    dateOfBirth: '1978-11-08',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Indian',
    primaryMobile: '9988776655',
    secondaryMobile: '9988776656',
    primaryEmail: 'mohammed.sheikh@businessmail.com',
    secondaryEmail: 'm.ali.sheikh@gmail.com',
    preferredLanguage: 'en',
    occupation: 'Textile Business Owner',
    annualIncome: 2500000,
    incomeSource: 'Business',
    customerSegment: 'Premium',
    customerCategory: 'Self Employed',
    pepStatus: false,
    riskRating: 'Medium',
    status: 'Active',
    onboardingDate: '2022-09-20T11:00:00.000Z',
    lastLogin: '2024-10-04T09:15:00.000Z',
    preferredBranchId: 'BR001',
    createdAt: '2022-09-20T11:00:00.000Z',
    updatedAt: '2024-10-04T09:15:00.000Z',
    createdBy: 'branch_manager',
    updatedBy: 'branch_manager'
  },
  {
    customerId: 'CUST004',
    customerType: 'Individual',
    title: 'Dr.',
    firstName: 'Aisha',
    middleName: 'Bint',
    lastName: 'Abdullah',
    fullName: 'Aisha Bint Abdullah',
    fatherName: 'Abdullah Rahman',
    motherName: 'Maryam Abdullah',
    spouseName: 'Yusuf Siddiqui',
    dateOfBirth: '1992-04-12',
    gender: 'Female',
    maritalStatus: 'Married',
    nationality: 'Indian',
    primaryMobile: '9845123456',
    secondaryMobile: '9845123457',
    primaryEmail: 'dr.aisha.abdullah@hospital.com',
    secondaryEmail: 'aisha.personal@email.com',
    preferredLanguage: 'en',
    occupation: 'Medical Doctor - Pediatrician',
    annualIncome: 1800000,
    incomeSource: 'Professional',
    customerSegment: 'Premium',
    customerCategory: 'Professional',
    pepStatus: false,
    riskRating: 'Low',
    status: 'Active',
    onboardingDate: '2023-03-05T14:20:00.000Z',
    lastLogin: '2024-10-03T18:30:00.000Z',
    preferredBranchId: 'BR003',
    createdAt: '2023-03-05T14:20:00.000Z',
    updatedAt: '2024-10-03T18:30:00.000Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    customerId: 'CUST005',
    customerType: 'Individual',
    title: 'Mr.',
    firstName: 'Omar',
    middleName: 'Ibn',
    lastName: 'Hassan',
    fullName: 'Omar Ibn Hassan',
    fatherName: 'Hassan Al-Rashid',
    motherName: 'Safiya Begum',
    dateOfBirth: '1988-12-03',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'Indian',
    primaryMobile: '9900112233',
    secondaryMobile: '',
    primaryEmail: 'omar.hassan@investmentbank.com',
    secondaryEmail: '',
    preferredLanguage: 'en',
    occupation: 'Investment Banker',
    annualIncome: 3000000,
    incomeSource: 'Salary + Commission',
    customerSegment: 'Platinum',
    customerCategory: 'High Net Worth',
    pepStatus: true,
    riskRating: 'High',
    status: 'Active',
    onboardingDate: '2022-11-15T08:45:00.000Z',
    lastLogin: '2024-10-04T07:20:00.000Z',
    preferredBranchId: 'BR001',
    createdAt: '2022-11-15T08:45:00.000Z',
    updatedAt: '2024-10-04T07:20:00.000Z',
    createdBy: 'relationship_manager',
    updatedBy: 'relationship_manager'
  },
  {
    customerId: 'CUST006',
    customerType: 'Individual',
    title: 'Mrs.',
    firstName: 'Zainab',
    middleName: 'Khatun',
    lastName: 'Malik',
    fullName: 'Zainab Khatun Malik',
    fatherName: 'Rashid Ali Malik',
    motherName: 'Ayesha Malik',
    spouseName: 'Imran Malik',
    dateOfBirth: '1987-05-18',
    gender: 'Female',
    maritalStatus: 'Married',
    nationality: 'Indian',
    primaryMobile: '9876501234',
    secondaryMobile: '9876501235',
    primaryEmail: 'zainab.malik@email.com',
    secondaryEmail: '',
    preferredLanguage: 'en',
    occupation: 'Homemaker',
    annualIncome: 0,
    incomeSource: 'Dependent',
    customerSegment: 'Basic',
    customerCategory: 'Regular',
    pepStatus: false,
    riskRating: 'Low',
    status: 'Active',
    onboardingDate: '2023-08-22T13:10:00.000Z',
    lastLogin: '2024-09-28T11:30:00.000Z',
    preferredBranchId: 'BR002',
    createdAt: '2023-08-22T13:10:00.000Z',
    updatedAt: '2024-09-28T11:30:00.000Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    customerId: 'CUST007',
    customerType: 'Individual',
    title: 'Mr.',
    firstName: 'Bilal',
    middleName: 'Ahmed',
    lastName: 'Siddiqui',
    fullName: 'Bilal Ahmed Siddiqui',
    fatherName: 'Ahmed Raza Siddiqui',
    motherName: 'Rabia Siddiqui',
    dateOfBirth: '1995-09-10',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'Indian',
    primaryMobile: '9123987654',
    secondaryMobile: '',
    primaryEmail: 'bilal.siddiqui@techcorp.com',
    secondaryEmail: 'bilal.ahmed95@email.com',
    preferredLanguage: 'en',
    occupation: 'Senior Software Developer',
    annualIncome: 1500000,
    incomeSource: 'Salary',
    customerSegment: 'Premium',
    customerCategory: 'Salaried',
    pepStatus: false,
    riskRating: 'Low',
    status: 'Active',
    onboardingDate: '2024-02-14T10:30:00.000Z',
    lastLogin: '2024-10-04T08:45:00.000Z',
    preferredBranchId: 'BR001',
    createdAt: '2024-02-14T10:30:00.000Z',
    updatedAt: '2024-10-04T08:45:00.000Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    customerId: 'CUST008',
    customerType: 'Business',
    title: 'Mr.',
    firstName: 'Rashid',
    middleName: 'Mahmood',
    lastName: 'Ansari',
    fullName: 'Rashid Mahmood Ansari',
    fatherName: 'Mahmood Hussain Ansari',
    motherName: 'Halima Ansari',
    spouseName: 'Shabana Ansari',
    dateOfBirth: '1975-02-25',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Indian',
    primaryMobile: '9765432109',
    secondaryMobile: '9765432110',
    primaryEmail: 'rashid.ansari@exporthouse.com',
    secondaryEmail: 'rashid.m.ansari@email.com',
    preferredLanguage: 'en',
    occupation: 'Export Business',
    annualIncome: 4500000,
    incomeSource: 'Business',
    customerSegment: 'Platinum',
    customerCategory: 'High Net Worth',
    pepStatus: false,
    riskRating: 'Medium',
    status: 'Active',
    onboardingDate: '2021-12-05T09:00:00.000Z',
    lastLogin: '2024-10-03T17:15:00.000Z',
    preferredBranchId: 'BR001',
    createdAt: '2021-12-05T09:00:00.000Z',
    updatedAt: '2024-10-03T17:15:00.000Z',
    createdBy: 'branch_manager',
    updatedBy: 'branch_manager'
  },
  {
    customerId: 'CUST009',
    customerType: 'Individual',
    title: 'Mr.',
    firstName: 'Tariq',
    middleName: 'Jamil',
    lastName: 'Qureshi',
    fullName: 'Tariq Jamil Qureshi',
    fatherName: 'Jamil Ahmed Qureshi',
    motherName: 'Nusrat Qureshi',
    dateOfBirth: '1982-06-30',
    gender: 'Male',
    maritalStatus: 'Divorced',
    nationality: 'Indian',
    primaryMobile: '9845678901',
    secondaryMobile: '',
    primaryEmail: 'tariq.qureshi@email.com',
    secondaryEmail: '',
    preferredLanguage: 'en',
    occupation: 'Accountant',
    annualIncome: 800000,
    incomeSource: 'Salary',
    customerSegment: 'Standard',
    customerCategory: 'Salaried',
    pepStatus: false,
    riskRating: 'Low',
    status: 'Inactive',
    onboardingDate: '2023-04-18T11:45:00.000Z',
    lastLogin: '2024-06-15T10:20:00.000Z',
    preferredBranchId: 'BR003',
    createdAt: '2023-04-18T11:45:00.000Z',
    updatedAt: '2024-06-15T10:20:00.000Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    customerId: 'CUST010',
    customerType: 'Individual',
    title: 'Ms.',
    firstName: 'Samira',
    middleName: 'Bibi',
    lastName: 'Khan',
    fullName: 'Samira Bibi Khan',
    fatherName: 'Salman Khan',
    motherName: 'Rehana Khan',
    dateOfBirth: '1998-11-25',
    gender: 'Female',
    maritalStatus: 'Single',
    nationality: 'Indian',
    primaryMobile: '9001234567',
    secondaryMobile: '',
    primaryEmail: 'samira.khan@university.edu',
    secondaryEmail: 'samira.khan.personal@email.com',
    preferredLanguage: 'en',
    occupation: 'Research Scholar',
    annualIncome: 400000,
    incomeSource: 'Stipend',
    customerSegment: 'Basic',
    customerCategory: 'Student',
    pepStatus: false,
    riskRating: 'Low',
    status: 'Active',
    onboardingDate: '2024-01-08T15:20:00.000Z',
    lastLogin: '2024-10-02T12:10:00.000Z',
    preferredBranchId: 'BR002',
    createdAt: '2024-01-08T15:20:00.000Z',
    updatedAt: '2024-10-02T12:10:00.000Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

// Mock API client for development
export class MockApiClient {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data based on endpoint
    if (endpoint.includes('/stats')) {
      return {
        success: true,
        data: {
          totalCustomers: mockCustomers.length,
          activeCustomers: mockCustomers.filter(c => c.status === 'Active').length,
          inactiveCustomers: mockCustomers.filter(c => c.status === 'Inactive').length,
          kycPending: 0,
          kycVerified: mockCustomers.length,
          newThisMonth: mockCustomers.filter(c => {
            const onboardingDate = new Date(c.onboardingDate);
            const now = new Date();
            return onboardingDate.getMonth() === now.getMonth() && 
                   onboardingDate.getFullYear() === now.getFullYear();
          }).length,
          highRiskCustomers: mockCustomers.filter(c => c.riskRating === 'High').length,
          dormantCustomers: mockCustomers.filter(c => c.status === 'Dormant').length
        } as T,
        message: 'Customer stats retrieved successfully',
        timestamp: new Date().toISOString()
      };
    }
    
    if (endpoint.includes('/customers') && !endpoint.includes('/stats')) {
      const url = new URL(`http://localhost:3000${endpoint}`);
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
      const search = url.searchParams.get('search') || '';
      
      let filteredCustomers = mockCustomers;
      
      if (search) {
        filteredCustomers = mockCustomers.filter(customer => 
          customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
          customer.primaryEmail.toLowerCase().includes(search.toLowerCase()) ||
          customer.primaryMobile.includes(search) ||
          customer.customerId.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: {
          customers: paginatedCustomers,
          total: filteredCustomers.length,
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(filteredCustomers.length / pageSize)
        } as T,
        message: 'Customers retrieved successfully',
        timestamp: new Date().toISOString()
      };
    }
    
    // Handle individual customer fetch
    if (endpoint.includes('/customers/') && !endpoint.includes('/stats') && !endpoint.includes('?')) {
      const customerId = endpoint.split('/').pop();
      console.log('🟢 MockAPI: Looking for customer ID:', customerId);
      console.log('🟢 MockAPI: Available customers:', mockCustomers.map(c => c.customerId));
      const customer = mockCustomers.find(c => c.customerId === customerId);
      
      if (customer) {
        console.log('✅ MockAPI: Customer found:', customer);
        return {
          success: true,
          data: customer as T,
          message: 'Customer retrieved successfully',
          timestamp: new Date().toISOString()
        };
      } else {
        console.error('❌ MockAPI: Customer not found');
        return {
          success: false,
          error: {
            message: 'Customer not found',
            code: 'CUSTOMER_NOT_FOUND',
            status: 404
          },
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Handle customer addresses endpoint
    if (endpoint.includes('/addresses')) {
      const customerId = endpoint.split('/')[3]; // Extract customer ID from /api/customers/{id}/addresses
      // Return empty array for now - addresses will be fetched from the customer object
      return {
        success: true,
        data: [] as T,
        message: 'Customer addresses retrieved successfully',
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      success: true,
      data: {} as T,
      message: 'Request successful',
      timestamp: new Date().toISOString()
    };
  }

  async post<T>(endpoint: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: data as T,
      message: 'Resource created successfully',
      timestamp: new Date().toISOString()
    };
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: data as T,
      message: 'Resource updated successfully',
      timestamp: new Date().toISOString()
    };
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: data as T,
      message: 'Resource updated successfully',
      timestamp: new Date().toISOString()
    };
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: { success: true } as T,
      message: 'Resource deleted successfully',
      timestamp: new Date().toISOString()
    };
  }
}

// Create and export mock API client instance
export const apiClient = new MockApiClient();
