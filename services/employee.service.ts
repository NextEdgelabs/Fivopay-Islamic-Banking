import axios from 'axios';
import { API } from '@/api';
import { getAuthToken, getOrganisationId } from '@/lib/auth';

// Employee Types and Interfaces (matching backend Employee model)
export type EmployeeStatus = 'active' | 'inactive' | 'suspended' | 'terminated';
export type EmployeeRole = 'admin' | 'manager' | 'loan_officer' | 'customer_service' | 'accountant' | 'hr' | 'it_support' | 'branch_manager' | 'senior_officer' | 'junior_officer' | 'agent';
export type Department = 'administration' | 'loan_department' | 'customer_service' | 'accounting' | 'human_resources' | 'information_technology' | 'operations' | 'marketing' | 'compliance' | 'risk_management' | 'agent_department';
export type Gender = 'male' | 'female' | 'other';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type EmploymentType = 'full_time' | 'part_time' | 'contract';

export interface Employee {
  _id?: string;
  id?: string;
  employeeId: string;
  branch: string | { _id: string; branchName: string };
  organisation: string | { _id: string; organisationName: string };
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string | Date;
  gender: Gender;
  maritalStatus?: MaritalStatus;
  
  // Address Information
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Professional Information
  role: EmployeeRole;
  department: Department;
  designation: string;
  dateOfJoining: string | Date;
  dateOfLeaving?: string | Date;
  salary: number;
  employmentType?: EmploymentType;
  reportingManager?: string;
  status: EmployeeStatus;
  
  // Authentication & Access
  password?: string; // Usually not returned in GET requests
  accessList: string[];
  isAdmin: boolean;
  canApproveLoans: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canManageEmployees: boolean;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  
  // Documents
  aadhaarNumber?: string;
  panNumber?: string;
  passportNumber?: string;
  drivingLicenseNumber?: string;
  
  // Bank Details
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  ifscCode?: string;
  
  // Additional Information
  qualifications?: string;
  previousExperience?: string;
  skills?: string[];
  notes?: string;
  
  // System Fields
  lastLogin?: string | Date;
  loginAttempts?: number;
  lastPasswordChange?: string | Date;
  passwordResetRequired?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: string | Date;
  
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateEmployeeDto {
  // Basic Information
  employeeId: string;
  branch: string;
  organisation: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string | Date;
  gender: Gender;
  maritalStatus?: MaritalStatus;
  
  // Address Information
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  
  // Professional Information
  role: EmployeeRole;
  department: Department;
  designation: string;
  dateOfJoining: string | Date;
  dateOfLeaving?: string | Date;
  salary: number;
  employmentType?: EmploymentType;
  reportingManager?: string;
  status?: EmployeeStatus;
  
  // Authentication & Access
  password: string;
  accessList: string[];
  isAdmin?: boolean;
  canApproveLoans?: boolean;
  canViewReports?: boolean;
  canManageUsers?: boolean;
  canManageEmployees?: boolean;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  
  // Documents
  aadhaarNumber?: string;
  panNumber?: string;
  passportNumber?: string;
  drivingLicenseNumber?: string;
  
  // Bank Details
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  ifscCode?: string;
  
  // Additional Information
  qualifications?: string;
  previousExperience?: string;
  skills?: string[];
  notes?: string;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  _id?: string;
  id?: string;
}

export interface EmployeeFilters {
  search?: string;
  branch?: string;
  department?: Department;
  role?: EmployeeRole;
  status?: EmployeeStatus;
  state?: string;
  city?: string;
  organisation?: string;
}

export interface EmployeesListResponse {
  success: boolean;
  message: string;
  data: {
    employees: Employee[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  data: {
    employee: Employee;
  };
}

// Employee Service Class
class EmployeeService {
  async create(employeeData: CreateEmployeeDto): Promise<EmployeeResponse> {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API.domain}${API.endPoints.createEmployee}`, employeeData, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error('Failed to create employee');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create employee');
    }
  }

  async getAll(filters?: EmployeeFilters): Promise<EmployeesListResponse> {
    try {
      const params = new URLSearchParams();
      // Scope by org: use filter if set and not "all", else current user's org
      const organisationId =
        filters?.organisation !== undefined && filters.organisation !== ''
          ? filters.organisation
          : getOrganisationId();
      const orgIdStr = typeof organisationId === 'string' ? organisationId : (organisationId as any)?._id;
      if (orgIdStr) params.append('organisation', orgIdStr);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (key === 'organisation' || value === undefined || value === '') return;
          params.append(key, value.toString());
        });
      }
      
      const token = getAuthToken();
      const response = await axios.get(`${API.domain}${API.endPoints.getAllEmployees}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to fetch employees');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch employees');
    }
  }

  async getNextEmployeeId(): Promise<{ success: boolean; data: { employeeId: string } }> {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API.domain}${API.endPoints.getNextEmployeeId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.status === 200 && response.data?.data?.employeeId) {
        return response.data;
      } else {
        throw new Error('Failed to generate employee ID');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate employee ID');
    }
  }

  async getById(employeeId: string): Promise<EmployeeResponse> {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API.domain}${API.endPoints.getEmployeeById}/${employeeId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to fetch employee');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch employee');
    }
  }

  async update(employeeId: string, employeeData: UpdateEmployeeDto): Promise<EmployeeResponse> {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API.domain}${API.endPoints.updateEmployee}/${employeeId}`,
        employeeData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );
      
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to update employee');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update employee');
    }
  }

  async delete(employeeId: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API.domain}${API.endPoints.deleteEmployee}/${employeeId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (response.status === 200 || response.status === 204) {
        return response.data || { success: true, message: 'Employee deleted successfully' };
      } else {
        throw new Error('Failed to delete employee');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete employee');
    }
  }
}

// Export singleton instance
export const employeeService = new EmployeeService();

// Export convenience functions
export const createEmployee = async (employeeData: CreateEmployeeDto): Promise<EmployeeResponse> => {
  return employeeService.create(employeeData);
};

export const getAllEmployees = async (filters?: EmployeeFilters): Promise<EmployeesListResponse> => {
  return employeeService.getAll(filters);
};

export const getEmployeeById = async (employeeId: string): Promise<EmployeeResponse> => {
  return employeeService.getById(employeeId);
};

export const updateEmployee = async (employeeId: string, employeeData: UpdateEmployeeDto): Promise<EmployeeResponse> => {
  return employeeService.update(employeeId, employeeData);
};

export const deleteEmployee = async (employeeId: string): Promise<{ success: boolean; message: string }> => {
  return employeeService.delete(employeeId);
};

// Employee Login Function
export const employeeLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API.domain}${API.endPoints.employeeLogin}`, { email, password });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error('Failed to login');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};
