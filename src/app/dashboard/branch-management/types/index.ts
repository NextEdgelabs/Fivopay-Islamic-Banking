export interface Branch {
  id: string;
  branchCode: string;
  branchName: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  managerName: string;
  managerPhone: string;
  employeeCount: number;
  customerCount: number;
  totalDeposits: number;
  totalLoans: number;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  establishedDate: string;
  lastInspection: string;
}

export interface NewBranchFormData {
  branchName: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  managerName: string;
  managerPhone: string;
}

export interface StateStatistics {
  state: string;
  totalBranches: number;
  activeBranches: number;
  totalEmployees: number;
  totalCustomers: number;
  totalDeposits: number;
  totalLoans: number;
  cities: string[];
}

export interface CityStatistics {
  city: string;
  state: string;
  totalBranches: number;
  activeBranches: number;
  totalEmployees: number;
  totalCustomers: number;
  totalDeposits: number;
  totalLoans: number;
} 