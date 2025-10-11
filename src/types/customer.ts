/**
 * Customer Module - TypeScript Types
 * Based on Indian Banking Requirements
 * Generated from DATABASE_SCHEMA.md
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum CustomerType {
  INDIVIDUAL = 'Individual',
  BUSINESS = 'Business',
  NRI = 'NRI'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed'
}

export enum CustomerStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DORMANT = 'Dormant',
  CLOSED = 'Closed',
  BLOCKED = 'Blocked'
}

export enum KYCStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In_Progress',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected',
  EXPIRED = 'Expired'
}

export enum KYCType {
  FULL_KYC = 'Full_KYC',
  MINIMUM_KYC = 'Minimum_KYC',
  E_KYC = 'e-KYC',
  VIDEO_KYC = 'Video_KYC',
  CKYC = 'CKYC'
}

export enum KYCLevel {
  BASIC = 'Basic',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum DocumentType {
  // Identity Proof
  AADHAAR = 'Aadhaar',
  PAN = 'PAN',
  PASSPORT = 'Passport',
  VOTER_ID = 'Voter_ID',
  DRIVING_LICENSE = 'Driving_License',
  // Address Proof
  UTILITY_BILL = 'Utility_Bill',
  BANK_STATEMENT = 'Bank_Statement',
  RENT_AGREEMENT = 'Rent_Agreement',
  // Income Proof
  SALARY_SLIP = 'Salary_Slip',
  ITR = 'ITR',
  FORM_16 = 'Form_16',
  // Other
  PHOTOGRAPH = 'Photograph',
  SIGNATURE = 'Signature',
  FORM_60 = 'Form_60',
  FORM_61 = 'Form_61',
  CANCELLED_CHEQUE = 'Cancelled_Cheque'
}

export enum DocumentCategory {
  IDENTITY_PROOF = 'Identity_Proof',
  ADDRESS_PROOF = 'Address_Proof',
  INCOME_PROOF = 'Income_Proof',
  PHOTO = 'Photo',
  SIGNATURE = 'Signature',
  OTHER = 'Other'
}

export enum VerificationStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected'
}

export enum AddressType {
  PERMANENT = 'Permanent',
  CURRENT = 'Current',
  OFFICE = 'Office',
  COMMUNICATION = 'Communication'
}

export enum ResidenceType {
  OWNED = 'Owned',
  RENTED = 'Rented',
  PARENTAL = 'Parental',
  COMPANY_PROVIDED = 'Company_Provided'
}

export enum AccountType {
  // Savings
  REGULAR_SAVINGS = 'Regular_Savings',
  SALARY_ACCOUNT = 'Salary_Account',
  SENIOR_CITIZEN_SAVINGS = 'Senior_Citizen_Savings',
  WOMENS_SAVINGS = 'Womens_Savings',
  MINOR_SAVINGS = 'Minor_Savings',
  JAN_DHAN = 'Jan_Dhan',
  BSBD = 'BSBD',
  // Current
  CURRENT_ACCOUNT = 'Current_Account',
  CASH_CREDIT = 'Cash_Credit',
  OVERDRAFT = 'Overdraft',
  // Deposits
  FIXED_DEPOSIT = 'Fixed_Deposit',
  RECURRING_DEPOSIT = 'Recurring_Deposit',
  // NRI
  NRE = 'NRE',
  NRO = 'NRO',
  FCNR = 'FCNR'
}

export enum AccountStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DORMANT = 'Dormant',
  FROZEN = 'Frozen',
  CLOSED = 'Closed'
}

export enum RiskRating {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

// ============================================================================
// MAIN INTERFACES
// ============================================================================

/**
 * Customer Master Interface
 */
export interface Customer {
  customerId: string;
  customerType: CustomerType;
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  maritalStatus?: MaritalStatus;
  fatherName: string;
  motherName?: string;
  spouseName?: string;
  nationality: string;
  occupation?: string;
  annualIncome?: number;
  incomeSource?: string;
  primaryMobile: string;
  secondaryMobile?: string;
  primaryEmail: string;
  secondaryEmail?: string;
  preferredLanguage: string;
  preferredBranchId?: string;
  customerSegment?: string;
  customerCategory?: string;
  riskRating: RiskRating;
  pepStatus: boolean;
  status: CustomerStatus;
  onboardingDate: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

/**
 * Customer KYC Interface
 */
export interface CustomerKYC {
  kycId: string;
  customerId: string;
  kycType: KYCType;
  kycStatus: KYCStatus;
  kycLevel: KYCLevel;
  verificationDate?: string;
  expiryDate?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  
  // Aadhaar
  aadhaarNumber?: string; // Encrypted
  aadhaarVerified: boolean;
  aadhaarVerificationDate?: string;
  aadhaarEkycStatus?: string;
  
  // PAN
  panNumber: string;
  panVerified: boolean;
  panVerificationDate?: string;
  panNameMatch?: boolean;
  
  // Other IDs
  voterId?: string;
  drivingLicense?: string;
  passportNumber?: string;
  passportExpiry?: string;
  
  // CKYC
  ckycNumber?: string;
  ckycVerified: boolean;
  
  // Video KYC
  videoKycCompleted: boolean;
  videoKycDate?: string;
  videoKycAgentId?: string;
  
  // Compliance
  ipvCompleted: boolean;
  fatcaApplicable: boolean;
  fatcaDeclarationDate?: string;
  crsApplicable: boolean;
  taxResidentCountry?: string;
  tinNumber?: string;
  form6061Submitted?: string;
  
  // AML
  amlScreeningStatus: string;
  amlScreeningDate?: string;
  sanctionsCheck: boolean;
  adverseMediaCheck: boolean;
  
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Customer Document Interface
 */
export interface CustomerDocument {
  documentId: string;
  customerId: string;
  documentType: DocumentType;
  documentCategory: DocumentCategory;
  documentNumber?: string;
  documentName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  uploadedBy: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verificationDate?: string;
  expiryDate?: string;
  rejectionReason?: string;
  isPrimary: boolean;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Customer Address Interface
 */
export interface CustomerAddress {
  addressId: string;
  customerId: string;
  addressType: AddressType;
  isPrimary: boolean;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  country: string;
  residenceType?: ResidenceType;
  residenceDurationYears?: number;
  proofType?: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verificationDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Customer Nominee Interface
 */
export interface CustomerNominee {
  nomineeId: string;
  customerId: string;
  accountNumber?: string;
  nomineeSequence: number;
  nomineeName: string;
  relationship: string;
  dateOfBirth?: string;
  minorFlag: boolean;
  guardianName?: string;
  guardianRelationship?: string;
  sharePercentage: number;
  mobileNumber?: string;
  email?: string;
  address?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  identificationType?: string;
  identificationNumber?: string;
  status: string;
  effectiveDate: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Customer Account Interface
 */
export interface CustomerAccount {
  accountId: string;
  accountNumber: string;
  customerId: string;
  accountType: AccountType;
  accountSubType?: string;
  accountStatus: AccountStatus;
  openingDate: string;
  closingDate?: string;
  branchId: string;
  ifscCode: string;
  micrCode?: string;
  currency: string;
  currentBalance: number;
  availableBalance: number;
  overdraftLimit?: number;
  minimumBalance: number;
  interestRate?: number;
  maturityDate?: string;
  maturityAmount?: number;
  autoRenewal?: boolean;
  nominationRegistered: boolean;
  chequeBookFacility: boolean;
  atmDebitCard: boolean;
  internetBanking: boolean;
  mobileBanking: boolean;
  upiEnabled: boolean;
  upiId?: string;
  smsAlert: boolean;
  emailStatement: boolean;
  isJointAccount: boolean;
  jointHolderType?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// FORM INTERFACES (for creating/updating)
// ============================================================================

export interface CreateCustomerRequest {
  customerType: CustomerType;
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  maritalStatus?: MaritalStatus;
  fatherName: string;
  motherName?: string;
  spouseName?: string;
  nationality?: string;
  occupation?: string;
  annualIncome?: number;
  incomeSource?: string;
  primaryMobile: string;
  secondaryMobile?: string;
  primaryEmail: string;
  secondaryEmail?: string;
  preferredLanguage?: string;
  preferredBranchId?: string;
  
  // Initial KYC
  panNumber: string;
  aadhaarNumber?: string;
  
  // Initial Address
  address: Omit<CustomerAddress, 'addressId' | 'customerId' | 'createdAt' | 'updatedAt'>;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  customerId: string;
}

// ============================================================================
// UTILITY INTERFACES
// ============================================================================

export interface CustomerSearchFilters {
  search?: string;
  customerType?: CustomerType;
  status?: CustomerStatus;
  kycStatus?: KYCStatus;
  riskRating?: RiskRating;
  branchId?: string;
  dateFrom?: string;
  dateTo?: string;
  minBalance?: number;
  maxBalance?: number;
  state?: string;
  city?: string;
  page?: number;
  pageSize?: number;
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  kycPending: number;
  kycVerified: number;
  newThisMonth: number;
  highRiskCustomers: number;
  pepFlagged: number;
}

export interface CustomerOnboardingStep {
  step: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

// ============================================================================
// DROPDOWN OPTIONS (for forms)
// ============================================================================

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
] as const;

export const RELATIONSHIPS = [
  'Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Brother', 'Sister',
  'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Nephew', 'Niece',
  'Father-in-law', 'Mother-in-law', 'Son-in-law', 'Daughter-in-law',
  'Brother-in-law', 'Sister-in-law', 'Friend', 'Guardian', 'Other'
] as const;

export const OCCUPATIONS = [
  'Salaried - Private Sector', 'Salaried - Public Sector', 'Salaried - Government',
  'Self Employed - Professional', 'Self Employed - Business', 'Business Owner',
  'Agriculture', 'Retired', 'Student', 'Homemaker', 'Freelancer', 'Other'
] as const;

export const INCOME_SOURCES = [
  'Salary', 'Business Income', 'Professional Income', 'Agriculture',
  'Pension', 'Rental Income', 'Investment Income', 'Family Support', 'Other'
] as const;

// ============================================================================
// CUSTOMER DETAIL INTERFACES
// ============================================================================

/**
 * Customer Loan Interface
 */
export interface CustomerLoan {
  loanId: string;
  customerId: string;
  accountNumber: string;
  loanType: string;
  principalAmount: number;
  outstandingAmount: number;
  disbursedAmount: number;
  disbursementDate: string;
  tenure: number; // in months
  emiAmount: number;
  nextEmiDate: string;
  interestRate?: number; // for conventional
  profitRate?: number; // for Islamic
  status: 'Active' | 'Overdue' | 'Closed' | 'Settled' | 'Default';
  totalEmis: number;
  paidEmis: number;
  delayedEmis: number;
  defaultEmis: number;
  averageDelayDays: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  loanOfficerId?: string;
  loanOfficerName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Customer Deposit Interface
 */
export interface CustomerDeposit {
  depositId: string;
  customerId: string;
  accountNumber: string;
  depositType: 'Fixed Deposit' | 'Recurring Deposit';
  principalAmount: number;
  currentValue: number;
  interestRate?: number; // for conventional
  profitRate?: number; // for Islamic
  profitSharingRatio?: number; // for Islamic
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  tenure: number; // in months
  autoRenewal: boolean;
  nomineeRegistered: boolean;
  status: 'Active' | 'Matured' | 'Closed' | 'Premature Closure';
  interestCredited: number;
  lastInterestDate?: string;
  prematureClosureCharges?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Customer Activity Interface
 */
export interface CustomerActivity {
  activityId: string;
  customerId: string;
  activityType: 'Account' | 'Loan' | 'Deposit' | 'Communication' | 'Team' | 'Request';
  title: string;
  description: string;
  timestamp: string;
  performedBy: string; // Staff name or 'System'
  performedById?: string;
  metadata?: {
    loanId?: string;
    depositId?: string;
    amount?: number;
    referenceNumber?: string;
    channel?: string; // phone, email, sms, whatsapp
    duration?: number; // for calls
    status?: string;
  };
  isExpandable: boolean;
  expandedDetails?: string;
  createdAt: string;
}

/**
 * Loan Repayment Interface
 */
export interface LoanRepayment {
  emiNumber: number;
  loanId: string;
  customerId: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Waived';
  delayDays: number;
  paymentMethod?: string;
  referenceNumber?: string;
  penaltyAmount?: number;
  waiverAmount?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Customer KYC Detailed Interface
 */
export interface CustomerKYCDetailed extends CustomerKYC {
  // Document URLs
  aadhaarDocumentUrl?: string;
  panDocumentUrl?: string;
  photoUrl?: string;
  signatureUrl?: string;
  addressProofUrl?: string;
  incomeProofUrl?: string;
  
  // Verification History
  verificationHistory: {
    field: string;
    oldValue: string;
    newValue: string;
    verifiedBy: string;
    verifiedAt: string;
    remarks?: string;
  }[];
  
  // Document Verification Details
  documentVerification: {
    documentType: string;
    documentNumber: string;
    verificationStatus: 'Pending' | 'Verified' | 'Rejected';
    verifiedBy?: string;
    verifiedAt?: string;
    rejectionReason?: string;
    documentUrl?: string;
  }[];
  
  // Compliance Status
  complianceStatus: {
    amlScreening: 'Pending' | 'Cleared' | 'Flagged';
    sanctionsCheck: 'Pending' | 'Cleared' | 'Flagged';
    adverseMediaCheck: 'Pending' | 'Cleared' | 'Flagged';
    pepStatus: boolean;
    lastScreeningDate?: string;
  };
}

/**
 * Address Detailed Interface
 */
export interface AddressDetailed extends CustomerAddress {
  verificationDocuments: {
    documentType: string;
    documentUrl: string;
    verificationStatus: 'Pending' | 'Verified' | 'Rejected';
    verifiedBy?: string;
    verifiedAt?: string;
  }[];
  
  // Address verification details
  verificationDetails: {
    gpsCoordinates?: {
      latitude: number;
      longitude: number;
    };
    nearbyLandmarks?: string[];
    verificationMethod: 'Physical Visit' | 'Document Verification' | 'Third Party';
    verifiedBy: string;
    verificationDate: string;
    remarks?: string;
  };
}
