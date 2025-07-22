export interface FieldAgent {
  id: string;
  agentCode: string;
  name: string;
  email: string;
  phone: string;
  branchId: string;
  branchName: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
  lastActivity: string;
  totalCollections: number;
  totalAmountCollected: number;
  assignedCustomers: number;
  performanceRating: number;
  supervisorName: string;
  supervisorPhone: string;
  territory: string;
  vehicleNumber?: string;
  idProofNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface Collection {
  id: string;
  collectionCode: string;
  agentId: string;
  agentName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  collectionType: 'Cash' | 'Cheque' | 'Digital Payment';
  status: 'Pending' | 'Completed' | 'Failed' | 'Cancelled';
  collectionDate: string;
  dueDate: string;
  branchId: string;
  branchName: string;
  receiptNumber: string;
  notes?: string;
  location: string;
  paymentMethod: string;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  verifiedBy?: string;
  verificationDate?: string;
}

export interface CustomerAssignment {
  id: string;
  agentId: string;
  agentName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  assignmentDate: string;
  status: 'Active' | 'Inactive' | 'Temporary';
  collectionFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'On Demand';
  lastCollectionDate?: string;
  nextCollectionDate?: string;
  totalAmountDue: number;
  outstandingAmount: number;
  branchId: string;
  branchName: string;
  notes?: string;
}

export interface CollectionReport {
  id: string;
  reportDate: string;
  agentId: string;
  agentName: string;
  totalCollections: number;
  totalAmount: number;
  successfulCollections: number;
  failedCollections: number;
  pendingCollections: number;
  averageCollectionAmount: number;
  branchId: string;
  branchName: string;
  territory: string;
  performanceScore: number;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  totalCollections: number;
  totalAmount: number;
  successRate: number;
  averageCollectionTime: number;
  customerSatisfaction: number;
  territory: string;
  branchId: string;
  branchName: string;
  monthlyTarget: number;
  monthlyAchievement: number;
  performanceRating: number;
}

export interface NewAgentFormData {
  name: string;
  email: string;
  phone: string;
  branchId: string;
  supervisorName: string;
  supervisorPhone: string;
  territory: string;
  vehicleNumber?: string;
  idProofNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface NewCollectionFormData {
  agentId: string;
  customerId: string;
  amount: number;
  collectionType: 'Cash' | 'Cheque' | 'Digital Payment';
  collectionDate: string;
  dueDate: string;
  location: string;
  paymentMethod: string;
  notes?: string;
}

export interface NewAssignmentFormData {
  agentId: string;
  customerId: string;
  collectionFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'On Demand';
  assignmentDate: string;
  notes?: string;
}

export interface CollectionFilter {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  agentId: string;
  customerId: string;
  status: string;
  collectionType: string;
  branchId: string;
  amountRange: {
    min: number;
    max: number;
  };
}

export interface AgentFilter {
  status: string;
  branchId: string;
  territory: string;
  performanceRating: number;
  searchTerm: string;
}

export interface AssignmentFilter {
  agentId: string;
  customerId: string;
  status: string;
  collectionFrequency: string;
  branchId: string;
  searchTerm: string;
}

export interface CollectionStatistics {
  totalCollections: number;
  totalAmount: number;
  successfulCollections: number;
  failedCollections: number;
  pendingCollections: number;
  averageCollectionAmount: number;
  totalAgents: number;
  activeAgents: number;
  totalCustomers: number;
  assignedCustomers: number;
  monthlyTarget: number;
  monthlyAchievement: number;
  achievementPercentage: number;
}

export interface TerritoryStatistics {
  territory: string;
  totalAgents: number;
  activeAgents: number;
  totalCollections: number;
  totalAmount: number;
  averageCollectionAmount: number;
  successRate: number;
  totalCustomers: number;
  assignedCustomers: number;
}

export interface BranchCollectionStats {
  branchId: string;
  branchName: string;
  totalCollections: number;
  totalAmount: number;
  successfulCollections: number;
  failedCollections: number;
  pendingCollections: number;
  totalAgents: number;
  activeAgents: number;
  totalCustomers: number;
  assignedCustomers: number;
  averageCollectionAmount: number;
  successRate: number;
} 