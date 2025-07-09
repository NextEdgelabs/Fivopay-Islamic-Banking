export interface NPAAsset {
  id: string;
  assetId: string;
  customerId: string;
  customerName: string;
  loanAccountNumber: string;
  originalLoanAmount: number;
  outstandingAmount: number;
  assetType: 'Real Estate' | 'Vehicle' | 'Equipment' | 'Securities' | 'Other';
  assetDescription: string;
  location: string;
  acquisitionDate: string;
  npaDate: string;
  daysPastDue: number;
  classification: 'Substandard' | 'Doubtful' | 'Loss';
  recoveryStatus: 'Pending' | 'In Progress' | 'Recovered' | 'Written Off';
  assignedTo: string;
  estimatedValue: number;
  lastValuationDate: string;
  legalStatus: 'No Legal Action' | 'Notice Sent' | 'Case Filed' | 'Court Order' | 'Auction Scheduled';
  remarks: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NPAAssetFormData {
  customerId: string;
  customerName: string;
  loanAccountNumber: string;
  originalLoanAmount: number;
  outstandingAmount: number;
  assetType: 'Real Estate' | 'Vehicle' | 'Equipment' | 'Securities' | 'Other';
  assetDescription: string;
  location: string;
  acquisitionDate: string;
  npaDate: string;
  classification: 'Substandard' | 'Doubtful' | 'Loss';
  assignedTo: string;
  estimatedValue: number;
  remarks: string;
}

export interface NPARecoveryAction {
  id: string;
  assetId: string;
  actionType: 'Notice Sent' | 'Legal Notice' | 'Case Filed' | 'Court Hearing' | 'Auction Scheduled' | 'Recovery Made' | 'Written Off';
  actionDate: string;
  description: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  assignedTo: string;
  nextActionDate: string;
  remarks: string;
}

export interface NPAAssetStatistics {
  totalAssets: number;
  totalOutstandingAmount: number;
  totalEstimatedValue: number;
  assetsByClassification: {
    substandard: number;
    doubtful: number;
    loss: number;
  };
  assetsByType: {
    realEstate: number;
    vehicle: number;
    equipment: number;
    securities: number;
    other: number;
  };
  assetsByStatus: {
    pending: number;
    inProgress: number;
    recovered: number;
    writtenOff: number;
  };
  recoveryRate: number;
  averageDaysPastDue: number;
}

export interface NPAAssetFilters {
  classification: string;
  assetType: string;
  recoveryStatus: string;
  assignedTo: string;
  dateRange: {
    start: string;
    end: string;
  };
  amountRange: {
    min: number;
    max: number;
  };
  searchTerm: string;
}

export interface NPAAssetReport {
  assetId: string;
  customerName: string;
  outstandingAmount: number;
  estimatedValue: number;
  recoveryPotential: number;
  daysPastDue: number;
  classification: string;
  recoveryStatus: string;
  lastAction: string;
  nextActionDate: string;
} 