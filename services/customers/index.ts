// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Customer {
  // Identifiers
  id: string;
  customerId: string;
  accountNumber: string;

  // Primary Details - Personal Information
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  fatherName?: string;
  motherName?: string;
  occupation: string;
  annualIncome?: number;

  // Address Information
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Account Information
  accountType: 'Savings' | 'Current' | 'Business';
  branch: string;
  currentBalance: number;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blocked';
  joinedDate: string;

  // Nominee Information
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  nomineeAddress?: string;

  // KYC Documents
  aadhaarNumber?: string;
  aadhaarVerified?: boolean;
  aadhaarFrontImage?: string;
  aadhaarBackImage?: string;

  panNumber?: string;
  panVerified?: boolean;
  panImage?: string;

  passportNumber?: string;
  passportImage?: string;

  drivingLicenseNumber?: string;
  drivingLicenseImage?: string;

  voterIdNumber?: string;
  voterIdImage?: string;

  addressProofType?: 'Utility Bill' | 'Bank Statement' | 'Rent Agreement' | 'Property Tax Receipt';
  addressProofNumber?: string;
  addressProofImage?: string;

  photographImage?: string;
  signatureImage?: string;

  kycStatus: 'Pending' | 'In Progress' | 'Verified' | 'Rejected';
  kycVerifiedDate?: string;
  kycVerifiedBy?: string;
  kycNotes?: string;

  // Share Purchase & Membership (for Ethical Banking)
  memberId?: string; // Member ID assigned when share purchase is approved
  isMember?: boolean; // Flag to indicate membership status
  totalShares?: number; // Total approved shares
}

export interface CustomerTransaction {
  id: string;
  customerId: string;
  transactionId: string;
  date: string;
  description: string;
  type: 'Credit' | 'Debit';
  amount: number;
  balanceAfter: number;
  status: 'Completed' | 'Pending' | 'Failed';
  branchName: string; // Added to link transaction to a branch
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  type: 'account_created' | 'kyc_verified' | 'profile_updated' | 'transaction' | 'status_changed' | 'document_uploaded';
  title: string;
  description: string;
  date: string;
  user?: string;
}

export interface CreateCustomerDto {
  // Primary Details
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  fatherName?: string;
  motherName?: string;
  occupation: string;
  annualIncome?: number;

  // Address
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Account
  accountType: 'Savings' | 'Current' | 'Business';
  initialDeposit: number;
  branch: string;

  // Nominee
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  nomineeAddress?: string;

  // KYC
  aadhaarNumber?: string;
  aadhaarFrontImage?: string;
  aadhaarBackImage?: string;
  panNumber?: string;
  panImage?: string;
  passportNumber?: string;
  passportImage?: string;
  drivingLicenseNumber?: string;
  drivingLicenseImage?: string;
  voterIdNumber?: string;
  voterIdImage?: string;
  addressProofType?: string;
  addressProofNumber?: string;
  addressProofImage?: string;
  photographImage?: string;
  signatureImage?: string;
  kycStatus?: 'Pending' | 'In Progress' | 'Verified' | 'Rejected';
  kycNotes?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  status?: 'Active' | 'Inactive' | 'Pending' | 'Blocked';
  currentBalance?: number;
}

export interface CustomerFilters {
  search?: string;
  status?: string;
  accountType?: string;
  branch?: string;
  state?: string;
  city?: string;
}

// ============================================================================
// SHARE PURCHASE TYPE DEFINITIONS (for Ethical Banking)
// ============================================================================

export interface SharePurchase {
  id: string;
  customerId: string;
  customerName: string;
  quantity: number;
  purchaseDate: string;
  pricePerShare: number;
  totalAmount: number;
  certificateNumber: string;
  shareholderId: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  approvalStatus: 'Pending Approval' | 'Approved' | 'Rejected';
  approvalDate?: string;
  approvedBy?: string;
  transactionReference: string;
  notes?: string;
  memberId?: string; // Generated on approval
  createdAt: string;
  updatedAt: string;
}

export interface CreateSharePurchaseDto {
  customerId: string;
  quantity: number;
  purchaseDate: string;
  pricePerShare: number;
  certificateNumber: string;
  shareholderId: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online';
  transactionReference: string;
  notes?: string;
}

export interface UpdateSharePurchaseDto extends Partial<CreateSharePurchaseDto> {
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  approvalStatus?: 'Pending Approval' | 'Approved' | 'Rejected';
}

export interface ShareholderSummary {
  customerId: string;
  customerName: string;
  memberId?: string;
  totalQuantity: number;
  totalValue: number;
  approvedShares: number;
  pendingShares: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const mockCustomers: Customer[] = [
  {
    id: 'CUS001',
    customerId: 'CUS001',
    accountNumber: 'ACC001234567',
    fullName: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+91 98765 43210',
    alternatePhone: '+91 98765 43211',
    dateOfBirth: '1988-05-15',
    gender: 'Male',
    maritalStatus: 'Married',
    fatherName: 'Mohammed Hassan',
    motherName: 'Fatima Hassan',
    occupation: 'Business Owner',
    annualIncome: 1200000,
    addressLine1: '123, MG Road',
    addressLine2: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400058',
    country: 'India',
    accountType: 'Savings',
    branch: 'Mumbai Central',
    currentBalance: 348000,
    status: 'Active',
    joinedDate: '2024-01-15',
    nomineeName: 'Fatima Hassan',
    nomineeRelation: 'Spouse',
    nomineePhone: '+91 98765 43211',
    nomineeAddress: '123, MG Road, Andheri West, Mumbai, Maharashtra - 400058',
    aadhaarNumber: '123456789012',
    aadhaarVerified: true,
    panNumber: 'ABCDE1234F',
    panVerified: true,
    passportNumber: 'A1234567',
    drivingLicenseNumber: 'MH1234567890123',
    voterIdNumber: 'ABC1234567',
    addressProofType: 'Utility Bill',
    addressProofNumber: 'UB123456',
    kycStatus: 'Verified',
    kycVerifiedDate: '2024-01-20',
    kycVerifiedBy: 'John Doe (Branch Manager)',
    kycNotes: 'All documents verified successfully',
  },
  {
    id: 'CUS002',
    customerId: 'CUS002',
    accountNumber: 'ACC001234568',
    fullName: 'Fatima Ali',
    email: 'fatima.ali@email.com',
    phone: '+91 98765 43211',
    alternatePhone: '+91 98765 43212',
    dateOfBirth: '1992-08-22',
    gender: 'Female',
    maritalStatus: 'Single',
    fatherName: 'Ali Ahmed',
    motherName: 'Zainab Ali',
    occupation: 'Software Engineer',
    annualIncome: 950000,
    addressLine1: '456, Brigade Road',
    addressLine2: 'Indiranagar',
    city: 'Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
    accountType: 'Current',
    branch: 'Delhi Main',
    currentBalance: 950000,
    status: 'Active',
    joinedDate: '2024-02-20',
    nomineeName: 'Ali Ahmed',
    nomineeRelation: 'Father',
    nomineePhone: '+91 98765 43220',
    nomineeAddress: '456, Brigade Road, Indiranagar, Delhi - 110001',
    aadhaarNumber: '234567890123',
    aadhaarVerified: true,
    panNumber: 'BCDEF2345G',
    panVerified: true,
    addressProofType: 'Rent Agreement',
    addressProofNumber: 'RA789012',
    kycStatus: 'Verified',
    kycVerifiedDate: '2024-02-25',
    kycVerifiedBy: 'Sarah Johnson (KYC Officer)',
    kycNotes: 'Standard verification completed',
  },
  {
    id: 'CUS003',
    customerId: 'CUS003',
    accountNumber: 'ACC001234569',
    fullName: 'Mohammed Khan',
    email: 'mohammed.khan@email.com',
    phone: '+91 98765 43212',
    dateOfBirth: '1985-03-10',
    gender: 'Male',
    maritalStatus: 'Married',
    fatherName: 'Khan Sahab',
    motherName: 'Ayesha Khan',
    occupation: 'Doctor',
    annualIncome: 607000,
    addressLine1: '789, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
    accountType: 'Savings',
    branch: 'Bangalore Tech Park',
    currentBalance: 607000,
    status: 'Inactive',
    joinedDate: '2023-11-10',
    nomineeName: 'Ayesha Khan',
    nomineeRelation: 'Wife',
    nomineePhone: '+91 98765 43213',
    nomineeAddress: '789, MG Road, Bangalore, Karnataka - 560001',
    aadhaarNumber: '345678901234',
    aadhaarVerified: true,
    panNumber: 'CDEFG3456H',
    panVerified: true,
    passportNumber: 'B2345678',
    kycStatus: 'Verified',
    kycVerifiedDate: '2023-11-15',
    kycVerifiedBy: 'Michael Brown (Branch Manager)',
  },
  {
    id: 'CUS004',
    customerId: 'CUS004',
    accountNumber: 'ACC001234570',
    fullName: 'Aisha Rahman',
    email: 'aisha.rahman@email.com',
    phone: '+91 98765 43213',
    dateOfBirth: '1990-07-18',
    gender: 'Female',
    maritalStatus: 'Married',
    occupation: 'Entrepreneur',
    annualIncome: 1806000,
    addressLine1: '321, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500034',
    country: 'India',
    accountType: 'Business',
    branch: 'Hyderabad Banjara Hills',
    currentBalance: 1806000,
    status: 'Active',
    joinedDate: '2024-03-05',
    aadhaarNumber: '456789012345',
    panNumber: 'DEFGH4567I',
    kycStatus: 'Verified',
    kycVerifiedDate: '2024-03-10',
    kycVerifiedBy: 'Raj Kumar (KYC Officer)',
  },
  {
    id: 'CUS005',
    customerId: 'CUS005',
    accountNumber: 'ACC001234571',
    fullName: 'Omar Yusuf',
    email: 'omar.yusuf@email.com',
    phone: '+91 98765 43214',
    dateOfBirth: '1995-12-03',
    gender: 'Male',
    occupation: 'Teacher',
    annualIncome: 437000,
    addressLine1: '654, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411001',
    country: 'India',
    accountType: 'Savings',
    branch: 'Pune Koregaon Park',
    currentBalance: 437000,
    status: 'Active',
    joinedDate: '2024-04-12',
    aadhaarNumber: '567890123456',
    panNumber: 'EFGHI5678J',
    kycStatus: 'In Progress',
    kycNotes: 'Pending address proof verification',
  },
  {
    id: 'CUS006',
    customerId: 'CUS006',
    accountNumber: 'ACC001234572',
    fullName: 'Sarah Ahmed',
    email: 'sarah.ahmed@email.com',
    phone: '+91 98765 43215',
    dateOfBirth: '1989-09-25',
    gender: 'Female',
    occupation: 'Architect',
    annualIncome: 725000,
    addressLine1: '987, Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: '600040',
    country: 'India',
    accountType: 'Current',
    branch: 'Chennai Anna Nagar',
    currentBalance: 725000,
    status: 'Active',
    joinedDate: '2024-05-18',
    aadhaarNumber: '678901234567',
    panNumber: 'FGHIJ6789K',
    kycStatus: 'Verified',
    kycVerifiedDate: '2024-05-20',
    kycVerifiedBy: 'Priya Sharma (Branch Manager)',
  },
  {
    id: 'CUS007',
    customerId: 'CUS007',
    accountNumber: 'ACC001234573',
    fullName: 'Bilal Hussain',
    email: 'bilal.hussain@email.com',
    phone: '+91 98765 43216',
    dateOfBirth: '1993-04-14',
    gender: 'Male',
    occupation: 'Accountant',
    annualIncome: 298000,
    addressLine1: '159, Park Street',
    city: 'Kolkata',
    state: 'West Bengal',
    postalCode: '700016',
    country: 'India',
    accountType: 'Savings',
    branch: 'Kolkata Park Street',
    currentBalance: 298000,
    status: 'Pending',
    joinedDate: '2024-06-22',
    aadhaarNumber: '789012345678',
    kycStatus: 'Pending',
    kycNotes: 'Awaiting PAN card submission',
  },
  {
    id: 'CUS008',
    customerId: 'CUS008',
    accountNumber: 'ACC001234574',
    fullName: 'Zainab Malik',
    email: 'zainab.malik@email.com',
    phone: '+91 98765 43217',
    dateOfBirth: '1987-11-30',
    gender: 'Female',
    occupation: 'Consultant',
    annualIncome: 1425000,
    addressLine1: '753, CG Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380009',
    country: 'India',
    accountType: 'Business',
    branch: 'Ahmedabad CG Road',
    currentBalance: 1425000,
    status: 'Active',
    joinedDate: '2024-07-08',
    aadhaarNumber: '890123456789',
    panNumber: 'GHIJK7890L',
    kycStatus: 'Verified',
    kycVerifiedDate: '2024-07-12',
    kycVerifiedBy: 'Amit Patel (KYC Officer)',
  },
];

const mockTransactions: Record<string, CustomerTransaction[]> = {
  CUS001: [
    {
      id: 'TXN001',
      customerId: 'CUS001',
      transactionId: 'TXN2024001',
      date: '2024-10-15',
      description: 'Salary Credit',
      type: 'Credit',
      amount: 85000,
      balanceAfter: 348000,
      status: 'Completed',
      branchName: 'Mumbai Central',
    },
    {
      id: 'TXN002',
      customerId: 'CUS001',
      transactionId: 'TXN2024002',
      date: '2024-10-14',
      description: 'UPI Payment to Mohammed Khan',
      type: 'Debit',
      amount: -5000,
      balanceAfter: 263000,
      status: 'Completed',
      branchName: 'Mumbai Central',
    },
    {
      id: 'TXN003',
      customerId: 'CUS001',
      transactionId: 'TXN2024003',
      date: '2024-10-13',
      description: 'Online Purchase - Amazon',
      type: 'Debit',
      amount: -12500,
      balanceAfter: 268000,
      status: 'Completed',
      branchName: 'Mumbai Central',
    },
    {
      id: 'TXN004',
      customerId: 'CUS001',
      transactionId: 'TXN2024004',
      date: '2024-10-12',
      description: 'ATM Withdrawal',
      type: 'Debit',
      amount: -10000,
      balanceAfter: 280500,
      status: 'Completed',
      branchName: 'Mumbai Central',
    },
    {
      id: 'TXN005',
      customerId: 'CUS001',
      transactionId: 'TXN2024005',
      date: '2024-10-10',
      description: 'NEFT Credit from Business',
      type: 'Credit',
      amount: 150000,
      balanceAfter: 290500,
      status: 'Completed',
      branchName: 'Mumbai Central',
    },
  ],
  CUS002: [
    {
      id: 'TXN006',
      customerId: 'CUS002',
      transactionId: 'TXN2024006',
      date: '2024-10-15',
      description: 'Salary Credit',
      type: 'Credit',
      amount: 95000,
      balanceAfter: 950000,
      status: 'Completed',
      branchName: 'Delhi Main',
    },
  ],
  CUS003: [
    {
      id: 'TXN007',
      customerId: 'CUS003',
      transactionId: 'TXN2024007',
      date: '2024-10-10',
      description: 'Consultation Fee',
      type: 'Credit',
      amount: 50000,
      balanceAfter: 607000,
      status: 'Completed',
      branchName: 'Bangalore Tech Park',
    },
  ],
};

const mockActivities: Record<string, CustomerActivity[]> = {
  CUS001: [
    {
      id: 'ACT001',
      customerId: 'CUS001',
      type: 'account_created',
      title: 'Account Created',
      description: 'Customer account was successfully created',
      date: '2024-01-15T10:30:00Z',
      user: 'System',
    },
    {
      id: 'ACT002',
      customerId: 'CUS001',
      type: 'kyc_verified',
      title: 'KYC Verified',
      description: 'All KYC documents verified successfully',
      date: '2024-01-20T14:45:00Z',
      user: 'John Doe (Branch Manager)',
    },
    {
      id: 'ACT003',
      customerId: 'CUS001',
      type: 'document_uploaded',
      title: 'PAN Card Uploaded',
      description: 'PAN card document uploaded and verified',
      date: '2024-01-18T09:15:00Z',
      user: 'Ahmed Hassan',
    },
    {
      id: 'ACT004',
      customerId: 'CUS001',
      type: 'transaction',
      title: 'Large Transaction',
      description: 'NEFT Credit of ₹1,50,000 received',
      date: '2024-10-10T11:20:00Z',
      user: 'System',
    },
    {
      id: 'ACT005',
      customerId: 'CUS001',
      type: 'profile_updated',
      title: 'Profile Updated',
      description: 'Contact information updated',
      date: '2024-03-15T16:30:00Z',
      user: 'Ahmed Hassan',
    },
  ],
  CUS002: [
    {
      id: 'ACT006',
      customerId: 'CUS002',
      type: 'account_created',
      title: 'Account Created',
      description: 'Customer account was successfully created',
      date: '2024-02-20T11:00:00Z',
      user: 'System',
    },
    {
      id: 'ACT007',
      customerId: 'CUS002',
      type: 'kyc_verified',
      title: 'KYC Verified',
      description: 'Standard verification completed',
      date: '2024-02-25T15:30:00Z',
      user: 'Sarah Johnson (KYC Officer)',
    },
  ],
  CUS003: [
    {
      id: 'ACT008',
      customerId: 'CUS003',
      type: 'account_created',
      title: 'Account Created',
      description: 'Customer account was successfully created',
      date: '2023-11-10T10:00:00Z',
      user: 'System',
    },
    {
      id: 'ACT009',
      customerId: 'CUS003',
      type: 'status_changed',
      title: 'Account Status Changed',
      description: 'Account status changed to Inactive',
      date: '2024-09-01T12:00:00Z',
      user: 'Michael Brown (Branch Manager)',
    },
  ],
};

// Share Purchases Mock Data (for Ethical Banking)
const mockSharePurchases: SharePurchase[] = [
  {
    id: 'SP001',
    customerId: 'CUS001',
    customerName: 'Ahmed Hassan',
    quantity: 100,
    purchaseDate: '2024-01-15',
    pricePerShare: 100,
    totalAmount: 10000,
    certificateNumber: 'CERT-2024-001',
    shareholderId: 'SH001',
    paymentMethod: 'Bank Transfer',
    status: 'Approved',
    approvalStatus: 'Approved',
    approvalDate: '2024-01-16',
    approvedBy: 'Admin User',
    transactionReference: 'TXN-2024-001',
    memberId: 'MEM001',
    notes: 'Initial share purchase',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: 'SP002',
    customerId: 'CUS002',
    customerName: 'Priya Sharma',
    quantity: 50,
    purchaseDate: '2024-02-10',
    pricePerShare: 100,
    totalAmount: 5000,
    certificateNumber: 'CERT-2024-002',
    shareholderId: 'SH002',
    paymentMethod: 'Cash',
    status: 'Pending',
    approvalStatus: 'Pending Approval',
    transactionReference: 'TXN-2024-002',
    notes: '',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z',
  },
  {
    id: 'SP003',
    customerId: 'CUS003',
    customerName: 'Raj Patel',
    quantity: 75,
    purchaseDate: '2024-02-20',
    pricePerShare: 100,
    totalAmount: 7500,
    certificateNumber: 'CERT-2024-003',
    shareholderId: 'SH003',
    paymentMethod: 'Online',
    status: 'Approved',
    approvalStatus: 'Approved',
    approvalDate: '2024-02-21',
    approvedBy: 'Admin User',
    transactionReference: 'TXN-2024-003',
    memberId: 'MEM002',
    notes: 'Approved share purchase',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-02-21T10:00:00Z',
  },
  {
    id: 'SP004',
    customerId: 'CUS001',
    customerName: 'Ahmed Hassan',
    quantity: 50,
    purchaseDate: '2024-03-05',
    pricePerShare: 100,
    totalAmount: 5000,
    certificateNumber: 'CERT-2024-004',
    shareholderId: 'SH001',
    paymentMethod: 'Bank Transfer',
    status: 'Approved',
    approvalStatus: 'Approved',
    approvalDate: '2024-03-06',
    approvedBy: 'Admin User',
    transactionReference: 'TXN-2024-004',
    memberId: 'MEM001',
    notes: 'Additional share purchase',
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-06T11:00:00Z',
  },
];

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

export const customerService = {
  /**
   * Get all customers with optional filters
   */
  async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockCustomers];

        if (filters?.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.fullName.toLowerCase().includes(search) ||
              c.email.toLowerCase().includes(search) ||
              c.customerId.toLowerCase().includes(search)
          );
        }

        if (filters?.status && filters.status !== 'all') {
          filtered = filtered.filter((c) => c.status === filters.status);
        }

        if (filters?.accountType) {
          filtered = filtered.filter(c => c.accountType === filters.accountType);
        }
        if (filters?.branch) {
          filtered = filtered.filter(c => c.branch.toLowerCase() === filters.branch?.toLowerCase());
        }
        if (filters?.state) {
          filtered = filtered.filter(c => c.state === filters.state);
        }
        if (filters?.city) {
          filtered = filtered.filter(c => c.city === filters.city);
        }

        resolve(filtered);
      }, 500);
    });
  },

  /**
   * Get a single customer by ID
   */
  async getCustomerById(id: string): Promise<Customer> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const customer = mockCustomers.find((c) => c.id === id || c.customerId === id);
        if (customer) {
          resolve(customer);
        } else {
          reject(new Error(`Customer with ID ${id} not found`));
        }
      }, 500);
    });
  },

  /**
   * Create a new customer
   */
  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCustomer: Customer = {
          id: `CUS${String(mockCustomers.length + 1).padStart(3, '0')}`,
          customerId: `CUS${String(mockCustomers.length + 1).padStart(3, '0')}`,
          accountNumber: `ACC${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          alternatePhone: data.alternatePhone,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          fatherName: data.fatherName,
          motherName: data.motherName,
          occupation: data.occupation,
          annualIncome: data.annualIncome,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          accountType: data.accountType,
          branch: data.branch,
          currentBalance: data.initialDeposit || 0,
          status: 'Pending',
          joinedDate: new Date().toISOString().split('T')[0],
          nomineeName: data.nomineeName,
          nomineeRelation: data.nomineeRelation,
          nomineePhone: data.nomineePhone,
          nomineeAddress: data.nomineeAddress,
          aadhaarNumber: data.aadhaarNumber,
          panNumber: data.panNumber,
          passportNumber: data.passportNumber,
          drivingLicenseNumber: data.drivingLicenseNumber,
          voterIdNumber: data.voterIdNumber,
          addressProofType: data.addressProofType as Customer['addressProofType'],
          addressProofNumber: data.addressProofNumber,
          photographImage: data.photographImage,
          signatureImage: data.signatureImage,
          aadhaarFrontImage: data.aadhaarFrontImage,
          aadhaarBackImage: data.aadhaarBackImage,
          panImage: data.panImage,
          passportImage: data.passportImage,
          drivingLicenseImage: data.drivingLicenseImage,
          voterIdImage: data.voterIdImage,
          addressProofImage: data.addressProofImage,
          kycStatus: data.kycStatus || 'Pending',
          kycNotes: data.kycNotes,
        };

        mockCustomers.push(newCustomer);
        resolve(newCustomer);
      }, 1000);
    });
  },

  /**
   * Update an existing customer
   */
  async updateCustomer(id: string, data: UpdateCustomerDto): Promise<Customer> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockCustomers.findIndex((c) => c.id === id || c.customerId === id);
        if (index !== -1) {
          mockCustomers[index] = {
            ...mockCustomers[index],
            ...data,
            addressProofType: data.addressProofType as Customer['addressProofType'] ?? mockCustomers[index].addressProofType,
          };
          resolve(mockCustomers[index]);
        } else {
          reject(new Error(`Customer with ID ${id} not found`));
        }
      }, 800);
    });
  },

  /**
   * Delete a customer
   */
  async deleteCustomer(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockCustomers.findIndex((c) => c.id === id || c.customerId === id);
        if (index !== -1) {
          mockCustomers.splice(index, 1);
          resolve();
        } else {
          reject(new Error(`Customer with ID ${id} not found`));
        }
      }, 500);
    });
  },

  /**
   * Get customer transactions
   */
  async getCustomerTransactions(customerId: string): Promise<CustomerTransaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = Object.values(mockTransactions).flat().filter(t => t.customerId === customerId);
        resolve(transactions);
      }, 500);
    });
  },

  /**
   * Get customer activity log
   */
  async getCustomerActivity(customerId: string): Promise<CustomerActivity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activities = mockActivities[customerId] || [];
        resolve(activities);
      }, 500);
    });
  },

  /**
   * Get all transactions - useful for branch-level views
   */
  async getAllTransactions(): Promise<CustomerTransaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(mockTransactions).flat());
      }, 500);
    });
  },

  // ============================================================================
  // SHARE PURCHASE METHODS (for Ethical Banking)
  // ============================================================================

  /**
   * Get customer share purchases
   */
  async getCustomerSharePurchases(customerId: string): Promise<SharePurchase[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const purchases = mockSharePurchases
          .filter((sp) => sp.customerId === customerId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(purchases);
      }, 500);
    });
  },

  /**
   * Create share purchase
   */
  async createSharePurchase(data: CreateSharePurchaseDto): Promise<SharePurchase> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const customer = mockCustomers.find((c) => c.id === data.customerId);
        if (!customer) {
          reject(new Error('Customer not found'));
          return;
        }

        const newPurchase: SharePurchase = {
          id: `SP${String(mockSharePurchases.length + 1).padStart(3, '0')}`,
          customerId: data.customerId,
          customerName: customer.fullName,
          quantity: data.quantity,
          purchaseDate: data.purchaseDate,
          pricePerShare: data.pricePerShare,
          totalAmount: data.quantity * data.pricePerShare,
          certificateNumber: data.certificateNumber,
          shareholderId: data.shareholderId,
          paymentMethod: data.paymentMethod,
          transactionReference: data.transactionReference,
          notes: data.notes || '',
          status: 'Pending',
          approvalStatus: 'Pending Approval',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockSharePurchases.push(newPurchase);
        resolve(newPurchase);
      }, 800);
    });
  },

  /**
   * Update share purchase
   */
  async updateSharePurchase(id: string, data: UpdateSharePurchaseDto): Promise<SharePurchase> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockSharePurchases.findIndex((sp) => sp.id === id);
        if (index === -1) {
          reject(new Error('Share purchase not found'));
          return;
        }

        const purchase = mockSharePurchases[index];
        const updated: SharePurchase = {
          ...purchase,
          ...data,
          totalAmount: (data.quantity || purchase.quantity) * (data.pricePerShare || purchase.pricePerShare),
          updatedAt: new Date().toISOString(),
        };

        mockSharePurchases[index] = updated;
        resolve(updated);
      }, 800);
    });
  },

  /**
   * Delete share purchase
   */
  async deleteSharePurchase(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockSharePurchases.findIndex((sp) => sp.id === id);
        if (index === -1) {
          reject(new Error('Share purchase not found'));
          return;
        }

        mockSharePurchases.splice(index, 1);
        resolve();
      }, 500);
    });
  },

  /**
   * Approve share purchase (generates Member ID)
   */
  async approveSharePurchase(id: string, approvedBy: string): Promise<SharePurchase> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockSharePurchases.findIndex((sp) => sp.id === id);
        if (index === -1) {
          reject(new Error('Share purchase not found'));
          return;
        }

        const purchase = mockSharePurchases[index];

        // Generate Member ID if customer doesn't have one
        const customer = mockCustomers.find((c) => c.id === purchase.customerId);
        if (customer && !customer.memberId) {
          customer.memberId = `MEM${String(mockSharePurchases.length + Date.now()).padStart(6, '0')}`;
          customer.isMember = true;
          purchase.memberId = customer.memberId;
        } else if (customer?.memberId) {
          purchase.memberId = customer.memberId;
        }

        purchase.approvalStatus = 'Approved';
        purchase.status = 'Approved';
        purchase.approvalDate = new Date().toISOString();
        purchase.approvedBy = approvedBy;
        purchase.updatedAt = new Date().toISOString();

        mockSharePurchases[index] = purchase;
        resolve(purchase);
      }, 800);
    });
  },

  /**
   * Reject share purchase
   */
  async rejectSharePurchase(id: string, rejectedBy: string): Promise<SharePurchase> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockSharePurchases.findIndex((sp) => sp.id === id);
        if (index === -1) {
          reject(new Error('Share purchase not found'));
          return;
        }

        mockSharePurchases[index] = {
          ...mockSharePurchases[index],
          approvalStatus: 'Rejected',
          status: 'Rejected',
          approvedBy: rejectedBy,
          updatedAt: new Date().toISOString(),
        };

        resolve(mockSharePurchases[index]);
      }, 500);
    });
  },

  /**
   * Get all shareholders summary
   */
  async getAllShareholders(): Promise<ShareholderSummary[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const shareholderMap = new Map<string, ShareholderSummary>();

        mockSharePurchases.forEach((purchase) => {
          const customer = mockCustomers.find((c) => c.id === purchase.customerId);
          if (!customer) return;

          if (!shareholderMap.has(purchase.customerId)) {
            shareholderMap.set(purchase.customerId, {
              customerId: purchase.customerId,
              customerName: customer.fullName,
              memberId: customer.memberId,
              totalQuantity: 0,
              totalValue: 0,
              approvedShares: 0,
              pendingShares: 0,
            });
          }

          const summary = shareholderMap.get(purchase.customerId)!;
          summary.totalQuantity += purchase.quantity;
          summary.totalValue += purchase.totalAmount;

          if (purchase.approvalStatus === 'Approved') {
            summary.approvedShares += purchase.quantity;
          } else if (purchase.approvalStatus === 'Pending Approval') {
            summary.pendingShares += purchase.quantity;
          }
        });

        const result = Array.from(shareholderMap.values())
          .filter((s) => s.totalQuantity > 0)
          .sort((a, b) => b.totalQuantity - a.totalQuantity);

        resolve(result);
      }, 600);
    });
  },
};

