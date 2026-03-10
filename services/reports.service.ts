import axios from 'axios';
import { API } from '@/api';
import { getAuthToken, getOrganisationId } from '@/lib/auth';

// ==================== Types ====================

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReportFilters {
  organisationId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

export interface DashboardSummary {
  totalDeposits: number;
  totalDepositsToday: number;
  totalWithdrawals: number;
  totalWithdrawalsMtd: number;
  activeLoans: number;
  loanApplicationsToday: number;
  disbursedAmount: number;
  outstandingPrincipal: number;
  collectionRate: number;
  agentCashInHand: number;
  npaRate: number;
  netInterestIncome: number;
}

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface DashboardResponse {
  success: boolean;
  data: {
    summary: DashboardSummary;
    charts: {
      dailyTransactions: ChartDataPoint[];
      disbursementsByCategory: ChartDataPoint[];
      collectionByAgent: Array<{ name: string; value: number; color: string }>;
    };
  };
}

export interface TransactionsSummaryResponse {
  success: boolean;
  data: {
    summary: { totalCount: number; totalAmount: number; avgValue: number };
    charts: {
      dailyTrends: ChartDataPoint[];
      paymentMethodBreakdown: Array<{ name: string; value: number; color: string }>;
    };
  };
}

export interface TransactionsListResponse {
  success: boolean;
  data: {
    transactions: any[];
    pagination: Pagination;
  };
}

export interface LoansSummaryResponse {
  success: boolean;
  data: {
    summary: { applicationsReceived: number; approved: number; disbursed: number; activeLoans: number };
    charts: {
      pipelineFunnel: Array<{ stage: string; count: number; color: string }>;
      byProduct: Array<{ name: string; value: number }>;
      disbursementTrend: ChartDataPoint[];
    };
  };
}

export interface LoansApplicationsResponse {
  success: boolean;
  data: {
    applications: any[];
    pagination: Pagination;
  };
}

export interface LoansDisbursedResponse {
  success: boolean;
  data: {
    disbursedLoans: any[];
    pagination: Pagination;
  };
}

export interface LoansAgingResponse {
  success: boolean;
  data: {
    agingData: any[];
    pagination: Pagination;
  };
}

export interface CollectionsSummaryResponse {
  success: boolean;
  data: {
    summary: {
      totalCollectionsToday: number;
      totalCollectionsMtd: number;
      deposited: number;
      pending: number;
      activeAgentsToday: number;
      totalAgents: number;
      avgSuccessRate: number;
    };
    charts: {
      byAgent: ChartDataPoint[];
      byRegion: Array<{ region: string; amount: number; color: string }>;
    };
  };
}

export interface CollectionsAgentSummaryResponse {
  success: boolean;
  data: {
    agentSummaries: any[];
    pagination: Pagination;
  };
}

export interface CollectionsLogsResponse {
  success: boolean;
  data: {
    logs: any[];
    pagination: Pagination;
  };
}

export interface CollectionsReconciliationResponse {
  success: boolean;
  data: {
    reconciliation: any[];
    pagination: Pagination;
  };
}

export interface AccountingSummaryResponse {
  success: boolean;
  data: {
    summary: {
      totalInterestIncome: number;
      feeIncome: number;
      totalDisbursed: number;
      provisionedAmount: number;
      netCashFlow: number;
    };
    charts: {
      cashFlowTrend: ChartDataPoint[];
      incomeComposition: Array<{ name: string; value: number; color: string }>;
    };
  };
}

export interface AccountingDaybookResponse {
  success: boolean;
  data: {
    entries: any[];
    pagination: Pagination;
  };
}

export interface AccountingInterestFeesResponse {
  success: boolean;
  data: {
    interestFees: any[];
    pagination: Pagination;
  };
}

export interface AccountingProvisioningResponse {
  success: boolean;
  data: {
    provisioning: any[];
  };
}

export interface AccountingReconciliationResponse {
  success: boolean;
  data: {
    reconciliation: any[];
  };
}

export interface ComplianceSummaryResponse {
  success: boolean;
  data: {
    summary: {
      kycPending: number;
      amlFlags: number;
      transactionsFlagged: number;
      regulatorySubmitted: number;
    };
    charts: {
      severityDistribution: Array<{ name: string; value: number; color: string }>;
      complianceTrends: ChartDataPoint[];
    };
  };
}

export interface ComplianceKycResponse {
  success: boolean;
  data: {
    exceptions: any[];
    pagination: Pagination;
  };
}

export interface ComplianceAmlResponse {
  success: boolean;
  data: {
    alerts: any[];
    pagination: Pagination;
  };
}

export interface ComplianceAuditResponse {
  success: boolean;
  data: {
    auditTrail: any[];
    pagination: Pagination;
  };
}

export interface ComplianceRegulatoryResponse {
  success: boolean;
  data: {
    submissions: any[];
    pagination: Pagination;
  };
}

export interface PerformanceSummaryResponse {
  success: boolean;
  data: {
    summary: {
      avgLoanApprovalTime: number;
      avgKycVerificationTime: number;
      ticketsOpen: number;
      ticketsResolved: number;
      agentProductivityIndex: number;
    };
    charts: {
      slaPerformance: Array<{ department: string; sla: number; target: number }>;
      processingTimeTrend: ChartDataPoint[];
    };
  };
}

export interface PerformanceTopBranchesResponse {
  success: boolean;
  data: {
    topBranches: any[];
    pagination: Pagination;
  };
}

export interface PerformanceTopAgentsResponse {
  success: boolean;
  data: {
    topAgents: any[];
    pagination: Pagination;
  };
}

// ==================== Helpers ====================

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const buildParams = (filters?: ReportFilters): string => {
  const params = new URLSearchParams();
  const organisationId = filters?.organisationId ?? getOrganisationId();
  if (organisationId) params.append('organisation', organisationId);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'organisationId' || value === undefined || value === '') return;
      params.append(key, String(value));
    });
  }
  const str = params.toString();
  return str ? '?' + str : '';
};

// ==================== Dashboard ====================

const getDashboard = async (filters?: ReportFilters): Promise<DashboardResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.dashboard}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch dashboard data');
};

// ==================== Transactions ====================

const getTransactionsSummary = async (filters?: ReportFilters): Promise<TransactionsSummaryResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.transactionsSummary}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch transactions summary');
};

const getTransactionsList = async (filters?: ReportFilters): Promise<TransactionsListResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.transactionsList}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch transactions list');
};

// ==================== Loans ====================

const getLoansSummary = async (filters?: ReportFilters): Promise<LoansSummaryResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.loansSummary}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch loans summary');
};

const getLoansApplications = async (filters?: ReportFilters): Promise<LoansApplicationsResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.loansApplications}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch loan applications');
};

const getLoansDisbursed = async (filters?: ReportFilters): Promise<LoansDisbursedResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.loansDisbursed}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch disbursed loans');
};

const getLoansAging = async (filters?: ReportFilters): Promise<LoansAgingResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.loansAging}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch loan aging data');
};

// ==================== Collections ====================

const getCollectionsSummary = async (filters?: ReportFilters): Promise<CollectionsSummaryResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.collectionsSummary}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch collections summary');
};

const getCollectionsAgentSummary = async (filters?: ReportFilters): Promise<CollectionsAgentSummaryResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.collectionsAgentSummary}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch agent summary');
};

const getCollectionsLogs = async (filters?: ReportFilters): Promise<CollectionsLogsResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.collectionsLogs}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch collection logs');
};

const getCollectionsReconciliation = async (filters?: ReportFilters): Promise<CollectionsReconciliationResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.collectionsReconciliation}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch reconciliation data');
};

// ==================== Accounting ====================

const getAccountingSummary = async (filters?: ReportFilters): Promise<AccountingSummaryResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.accountingSummary}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch accounting summary');
};

const getAccountingDaybook = async (filters?: ReportFilters): Promise<AccountingDaybookResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.accountingDaybook}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch daybook entries');
};

const getAccountingInterestFees = async (filters?: ReportFilters): Promise<AccountingInterestFeesResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.accountingInterestFees}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch interest & fees data');
};

const getAccountingProvisioning = async (filters?: ReportFilters): Promise<AccountingProvisioningResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.accountingProvisioning}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch provisioning data');
};

const getAccountingReconciliation = async (filters?: ReportFilters): Promise<AccountingReconciliationResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.accountingReconciliation}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch bank reconciliation data');
};

// ==================== Compliance ====================

const getComplianceSummary = async (filters?: ReportFilters): Promise<ComplianceSummaryResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.complianceSummary}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch compliance summary');
};

const getComplianceKycExceptions = async (filters?: ReportFilters): Promise<ComplianceKycResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.complianceKycExceptions}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch KYC exceptions');
};

const getComplianceAmlAlerts = async (filters?: ReportFilters): Promise<ComplianceAmlResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.complianceAmlAlerts}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch AML alerts');
};

const getComplianceAuditTrail = async (filters?: ReportFilters): Promise<ComplianceAuditResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.complianceAuditTrail}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch audit trail');
};

const getComplianceRegulatorySubmissions = async (filters?: ReportFilters): Promise<ComplianceRegulatoryResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.complianceRegulatorySubmissions}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch regulatory submissions');
};

// ==================== Performance ====================

const getPerformanceSummary = async (filters?: ReportFilters): Promise<PerformanceSummaryResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.performanceSummary}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch performance summary');
};

const getPerformanceTopBranches = async (filters?: ReportFilters): Promise<PerformanceTopBranchesResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.performanceTopBranches}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch top branches');
};

const getPerformanceTopAgents = async (filters?: ReportFilters): Promise<PerformanceTopAgentsResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.reports.performanceTopAgents}${buildParams(filters)}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch top agents');
};

// ==================== Export ====================

export const reportsService = {
  getDashboard,
  getTransactionsSummary,
  getTransactionsList,
  getLoansSummary,
  getLoansApplications,
  getLoansDisbursed,
  getLoansAging,
  getCollectionsSummary,
  getCollectionsAgentSummary,
  getCollectionsLogs,
  getCollectionsReconciliation,
  getAccountingSummary,
  getAccountingDaybook,
  getAccountingInterestFees,
  getAccountingProvisioning,
  getAccountingReconciliation,
  getComplianceSummary,
  getComplianceKycExceptions,
  getComplianceAmlAlerts,
  getComplianceAuditTrail,
  getComplianceRegulatorySubmissions,
  getPerformanceSummary,
  getPerformanceTopBranches,
  getPerformanceTopAgents,
};
