# Customer Module Schema

## Updated Customer Data Structure

### Primary Details Tab
```typescript
{
  // Personal Information
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
  country: string; // Default: 'India'

  // Account Information
  accountType: 'Savings' | 'Current' | 'Business';
  initialDeposit: number; // Min: ₹1,000
  branch: string;
  
  // Nominee Information (Optional)
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  nomineeAddress?: string;
}
```

### KYC Documents Tab
```typescript
{
  // Aadhaar Card (Required)
  aadhaarNumber: string; // 12 digits
  aadhaarFrontImage?: File;
  aadhaarBackImage?: File;

  // PAN Card (Required)
  panNumber: string; // Format: ABCDE1234F
  panImage?: File;

  // Passport (Optional)
  passportNumber?: string;
  passportImage?: File;

  // Driving License (Optional)
  drivingLicenseNumber?: string;
  drivingLicenseImage?: File;

  // Voter ID (Optional)
  voterIdNumber?: string;
  voterIdImage?: File;

  // Address Proof
  addressProofType?: 'Utility Bill' | 'Bank Statement' | 'Rent Agreement' | 'Property Tax Receipt';
  addressProofNumber?: string;
  addressProofImage?: File;

  // Photo & Signature
  photographImage?: File; // Passport size
  signatureImage?: File;

  // KYC Status
  kycStatus: 'Pending' | 'In Progress' | 'Verified' | 'Rejected';
  kycVerifiedDate?: string;
  kycVerifiedBy?: string;
  kycNotes?: string;
}
```

## Mock Customer Data

```typescript
const mockCustomers = [
  {
    id: 'CUS001',
    customerId: 'CUS001',
    accountNumber: 'ACC001234567',

    // Primary Details
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
    annualIncome: 1200000, // ₹12,00,000
    
    addressLine1: '123, MG Road',
    addressLine2: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400058',
    country: 'India',
    
    accountType: 'Savings',
    branch: 'Mumbai Central',
    currentBalance: 348000, // ₹3,48,000
    status: 'Active',
    joinedDate: '2024-01-15',
    
    nomineeName: 'Fatima Hassan',
    nomineeRelation: 'Spouse',
    nomineePhone: '+91 98765 43211',
    nomineeAddress: '123, MG Road, Andheri West, Mumbai, Maharashtra - 400058',

    // KYC Details
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
    
    fullName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43220',
    alternatePhone: '+91 98765 43221',
    dateOfBirth: '1992-08-22',
    gender: 'Female',
    maritalStatus: 'Single',
    fatherName: 'Raj Sharma',
    motherName: 'Sunita Sharma',
    occupation: 'Software Engineer',
    annualIncome: 1800000, // ₹18,00,000
    
    addressLine1: '456, Park Street',
    addressLine2: 'Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    
    accountType: 'Savings',
    branch: 'Bangalore Tech Park',
    currentBalance: 756000, // ₹7,56,000
    status: 'Active',
    joinedDate: '2024-02-10',
    
    nomineeName: 'Raj Sharma',
    nomineeRelation: 'Father',
    nomineePhone: '+91 98765 43230',
    nomineeAddress: '456, Park Street, Indiranagar, Bangalore, Karnataka - 560038',

    aadhaarNumber: '234567890123',
    aadhaarVerified: true,
    panNumber: 'BCDEF2345G',
    panVerified: true,
    addressProofType: 'Rent Agreement',
    addressProofNumber: 'RA789012',
    kycStatus: 'Verified',
    kycVerifiedDate: '2024-02-15',
    kycVerifiedBy: 'Sarah Johnson (KYC Officer)',
    kycNotes: 'Standard verification completed',
  },
  {
    id: 'CUS003',
    customerId: 'CUS003',
    accountNumber: 'ACC001234569',
    
    fullName: 'Rahul Mehta',
    email: 'rahul.mehta@email.com',
    phone: '+91 98765 43230',
    dateOfBirth: '1985-03-10',
    gender: 'Male',
    maritalStatus: 'Married',
    fatherName: 'Suresh Mehta',
    motherName: 'Anita Mehta',
    occupation: 'Doctor',
    annualIncome: 2500000, // ₹25,00,000
    
    addressLine1: '789, Civil Lines',
    addressLine2: 'Karol Bagh',
    city: 'Delhi',
    state: 'Delhi',
    postalCode: '110005',
    country: 'India',
    
    accountType: 'Current',
    branch: 'Delhi Main',
    currentBalance: 1806000, // ₹18,06,000
    status: 'Active',
    joinedDate: '2023-11-20',
    
    nomineeName: 'Neha Mehta',
    nomineeRelation: 'Spouse',
    nomineePhone: '+91 98765 43240',
    nomineeAddress: '789, Civil Lines, Karol Bagh, Delhi - 110005',

    aadhaarNumber: '345678901234',
    aadhaarVerified: true,
    panNumber: 'CDEFG3456H',
    panVerified: true,
    passportNumber: 'B2345678',
    kycStatus: 'Verified',
    kycVerifiedDate: '2023-11-25',
    kycVerifiedBy: 'Michael Brown (Branch Manager)',
  },
];
```

## Validation Rules

### Primary Details
- **fullName**: Required, min 3 characters
- **email**: Required, valid email format
- **phone**: Required, Indian format (+91 XXXXX XXXXX)
- **dateOfBirth**: Required, age must be 18+
- **gender**: Required
- **occupation**: Required
- **address**: All required except addressLine2
- **postalCode**: Required, 6 digits
- **accountType**: Required
- **initialDeposit**: Required, minimum ₹1,000
- **branch**: Required

### KYC Documents
- **At least one ID proof required**: Aadhaar OR PAN OR Passport
- **Aadhaar**: 12 digits if provided
- **PAN**: Must match format ABCDE1234F if provided
- **File uploads**: Accept images and PDFs
- **Photograph**: Only images accepted
- **Signature**: Only images accepted

## UI Structure

### Add Customer Page
- Tab 1: Primary Details
  - Personal Information section
  - Address Information section
  - Account Information section
  - Nominee Information section

- Tab 2: KYC Documents
  - Aadhaar Card section
  - PAN Card section
  - Passport section (optional)
  - Driving License section (optional)
  - Voter ID section (optional)
  - Address Proof section
  - Photograph & Signature section
  - KYC Status section

### Edit Customer Page
- Same structure as Add page
- Pre-populated with existing data
- Can update KYC status
- Shows verification dates and by whom

### View Customer Page
- Tab 1: Overview
  - Shows all primary details in read-only format
- Tab 2: Transactions
  - Recent transactions list
- Tab 3: Activity
  - Account activity timeline
- Tab 4: KYC Documents (New)
  - Shows all uploaded KYC documents
  - Document verification status
  - Download options
