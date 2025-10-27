// Import existing customer data for referential integrity
import { customerService, CustomerTransaction } from '@/services/customers.service';
import { mockCustomers } from '@/services/mockData';
import { mockLoans } from '@/services/loans';
import { mockDeposits } from '@/services/deposits';

// Type Definitions
export interface Branch {
  id: string;
  branchCode: string;
  branchName: string;
  branchType: 'Main Branch' | 'Sub Branch' | 'Extension Counter';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: 'India';
  landmark?: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email: string;
  managerName: string;
  managerPhone: string;
  openingDate: string; // YYYY-MM-DD
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  workingHours: {
    weekdays: string; // e.g., "10:00 AM - 5:00 PM"
    saturday: string;
    sunday: string;
  };
  services: string[];
  totalCustomers: number;
}

export interface BranchKpi {
  totalCustomers: number;
  totalLoanValue: number;
  totalDepositValue: number;
  newMembersThisMonth: number;
}

export interface CreateBranchDto extends Omit<Branch, 'id' | 'branchCode' | 'country' | 'totalCustomers'> {}
export interface UpdateBranchDto extends Partial<CreateBranchDto> {}
export interface BranchFilters {
  search?: string;
  state?: string;
  status?: Branch['status'];
  branchType?: Branch['branchType'];
}

// Mock Data
const mockBranches: Branch[] = [
  {
    id: 'BR001',
    branchCode: 'MUM-CEN-001',
    branchName: 'Mumbai Central',
    branchType: 'Main Branch',
    addressLine1: '123 Financial Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
    landmark: 'Near Gateway of India',
    phone: '+91 22 1234 5678',
    email: 'mumbai.central@fivopay.com',
    managerName: 'Rajesh Kumar',
    managerPhone: '+91 9876543210',
    openingDate: '2010-05-15',
    status: 'Active',
    latitude: 19.0760,
    longitude: 72.8777,
    workingHours: {
      weekdays: '10:00 AM - 4:00 PM',
      saturday: '10:00 AM - 1:00 PM',
      sunday: 'Closed',
    },
    services: ['Deposits', 'Loans', 'Forex', 'Locker Facility', 'Online Banking'],
    totalCustomers: mockCustomers.filter(c => c.branch === 'Mumbai Central').length,
  },
  {
    id: 'BR002',
    branchCode: 'DEL-CON-001',
    branchName: 'Delhi Connaught Place',
    branchType: 'Sub Branch',
    addressLine1: '456 Capital Circle',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
    landmark: 'Inner Circle',
    phone: '+91 11 9876 5432',
    email: 'delhi.cp@fivopay.com',
    managerName: 'Sunita Sharma',
    managerPhone: '+91 9123456789',
    openingDate: '2012-08-20',
    status: 'Active',
    latitude: 28.6324,
    longitude: 77.2187,
    workingHours: {
      weekdays: '9:30 AM - 4:30 PM',
      saturday: '9:30 AM - 12:30 PM',
      sunday: 'Closed',
    },
    services: ['Deposits', 'Loans', 'Online Banking'],
    totalCustomers: mockCustomers.filter(c => c.branch === 'Delhi Connaught Place').length,
  },
  {
    id: 'BR003',
    branchCode: 'BLR-KOR-001',
    branchName: 'Bangalore Koramangala',
    branchType: 'Extension Counter',
    addressLine1: '789 Tech Park Road',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560034',
    country: 'India',
    phone: '+91 80 5555 4444',
    email: 'bangalore.kora@fivopay.com',
    managerName: 'Anil Desai',
    managerPhone: '+91 9988776655',
    openingDate: '2018-01-10',
    status: 'Inactive',
    workingHours: {
      weekdays: '10:00 AM - 3:00 PM',
      saturday: '10:00 AM - 1:00 PM',
      sunday: 'Closed',
    },
    services: ['Deposits', 'ATM'],
    totalCustomers: mockCustomers.filter(c => c.branch === 'Bangalore Koramangala').length,
  },
];

const generateBranchCode = (name: string, city: string) => {
  const cityCode = city.substring(0, 3).toUpperCase();
  const nameWords = name.split(' ').filter(word => word.length > 0);
  const branchTypeCode = nameWords.length > 1 ? nameWords[1].substring(0, 2).toUpperCase() : 'BR';
  const branchNumber = String(mockBranches.length + 1).padStart(3, '0');
  return `${cityCode}-${branchTypeCode}-${branchNumber}`;
};

// Service Methods
export const branchService = {
  async getBranches(filters?: BranchFilters): Promise<Branch[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = [...mockBranches];
        if (filters?.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(b => b.branchName.toLowerCase().includes(search) || b.branchCode.toLowerCase().includes(search));
        }
        if (filters?.status) {
          filtered = filtered.filter(b => b.status === filters.status);
        }
        if (filters?.state) {
          filtered = filtered.filter(b => b.state === filters.state);
        }
        if (filters?.branchType) {
          filtered = filtered.filter(b => b.branchType === filters.branchType);
        }
        resolve(filtered);
      }, 500);
    });
  },
  async getBranchById(id: string): Promise<Branch> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const branch = mockBranches.find(b => b.id === id);
        if (branch) {
          resolve(branch);
        } else {
          reject(new Error('Branch not found'));
        }
      }, 300);
    });
  },
  async createBranch(data: CreateBranchDto): Promise<Branch> {
    return new Promise(resolve => {
      setTimeout(() => {
        const newBranch: Branch = {
          id: `BR${String(mockBranches.length + 1).padStart(3, '0')}`,
          branchCode: generateBranchCode(data.branchName, data.city),
          country: 'India',
          totalCustomers: 0,
          ...data,
        };
        mockBranches.push(newBranch);
        resolve(newBranch);
      }, 500);
    });
  },
  async updateBranch(id: string, data: UpdateBranchDto): Promise<Branch> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBranches.findIndex(b => b.id === id);
        if (index === -1) {
          reject(new Error('Branch not found'));
          return;
        }
        const updatedBranch = { ...mockBranches[index], ...data };
        mockBranches[index] = updatedBranch;
        resolve(updatedBranch);
      }, 500);
    });
  },
  async deleteBranch(id: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockBranches.findIndex(b => b.id === id);
        if (index !== -1) {
          mockBranches.splice(index, 1);
        }
        resolve();
      }, 500);
    });
  },

  async getBranchKpis(branchId: string): Promise<BranchKpi> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const branchCustomers = mockCustomers.filter(c => {
          const branch = mockBranches.find(b => b.id === branchId);
          return c.branch === branch?.branchName;
        });

        const totalLoanValue = mockLoans
          .filter(l => l.branchId === branchId && l.status === 'Active')
          .reduce((sum, l) => sum + l.outstandingAmount, 0);

        const totalDepositValue = mockDeposits
          .filter(d => d.branchId === branchId && d.status === 'Active')
          .reduce((sum, d) => sum + d.currentBalance, 0);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const newMembersThisMonth = branchCustomers.filter(c => new Date(c.dateOfJoining) >= oneMonthAgo).length;

        resolve({
          totalCustomers: branchCustomers.length,
          totalLoanValue,
          totalDepositValue,
          newMembersThisMonth,
        });
      }, 700);
    });
  },

  async getBranchTransactions(branchName: string): Promise<CustomerTransaction[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const allTransactions = await customerService.getAllTransactions();
        const branchTransactions = allTransactions.filter(
          t => t.branchName.toLowerCase() === branchName.toLowerCase()
        );
        resolve(branchTransactions);
      } catch (error) {
        reject(error);
      }
    });
  },
};

