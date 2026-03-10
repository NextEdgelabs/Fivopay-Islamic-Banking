import axios from 'axios';
import { API } from '@/api';
import { getAuthToken, getOrganisationId } from '@/lib/auth';

// ==================== Types ====================

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export interface LedgerAccount {
  _id: string;
  accountId: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
  description: string;
  color: string;
  isActive: boolean;
  organisationId?: string;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLedgerAccountDto {
  accountId: string;
  accountName: string;
  accountType: AccountType;
  balance?: number;
  description?: string;
  color?: string;
  isActive?: boolean;
  organisationId?: string;
  branchId?: string;
}

export interface UpdateLedgerAccountDto {
  accountId?: string;
  accountName?: string;
  accountType?: AccountType;
  balance?: number;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface LedgerAccountFilters {
  search?: string;
  accountType?: string;
  status?: string;
  organisationId?: string;
  page?: number;
  limit?: number;
}

export interface JournalEntryLine {
  accountId?: string;
  accountName: string;
  debit: number;
  credit: number;
  isMainEntry: boolean;
}

export interface JournalEntry {
  _id: string;
  transactionId: string;
  date: string;
  description: string;
  entries: JournalEntryLine[];
  organisationId?: string;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JournalEntryFilters {
  dateFrom?: string;
  dateTo?: string;
  accountId?: string;
  search?: string;
  organisationId?: string;
  page?: number;
  limit?: number;
}

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}

export interface LedgerAccountsListResponse {
  success: boolean;
  result: {
    accounts: LedgerAccount[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface LedgerAccountResponse {
  success: boolean;
  result: LedgerAccount;
}

export interface FinancialSummaryResponse {
  success: boolean;
  result: FinancialSummary;
}

export interface JournalEntriesListResponse {
  success: boolean;
  result: {
    journalEntries: JournalEntry[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface JournalEntryResponse {
  success: boolean;
  result: JournalEntry;
}

// ==================== Helpers ====================

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ==================== Ledger Account APIs ====================

const createAccount = async (data: CreateLedgerAccountDto): Promise<LedgerAccountResponse> => {
  const payload = {
    ...data,
    organisationId: data.organisationId || getOrganisationId() || undefined,
  };
  const response = await axios.post(
    `${API.domain}${API.endPoints.createLedgerAccount}`,
    payload,
    { headers: getHeaders() }
  );
  if (response.status === 200 || response.status === 201) return response.data;
  throw new Error('Failed to create ledger account');
};

const getAllAccounts = async (filters?: LedgerAccountFilters): Promise<LedgerAccountsListResponse> => {
  const params = new URLSearchParams();
  const organisationId = filters?.organisationId ?? getOrganisationId();
  if (organisationId) params.append('organisation', organisationId);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'organisationId' || value === undefined || value === '') return;
      params.append(key, String(value));
    });
  }
  const response = await axios.get(
    `${API.domain}${API.endPoints.getAllLedgerAccounts}${params.toString() ? '?' + params.toString() : ''}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch ledger accounts');
};

const getAccountById = async (id: string): Promise<LedgerAccountResponse> => {
  const response = await axios.get(
    `${API.domain}${API.endPoints.getLedgerAccountById}/${id}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch ledger account');
};

const updateAccount = async (id: string, data: UpdateLedgerAccountDto): Promise<LedgerAccountResponse> => {
  const response = await axios.put(
    `${API.domain}${API.endPoints.updateLedgerAccount}/${id}`,
    data,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to update ledger account');
};

const deleteAccount = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(
    `${API.domain}${API.endPoints.deleteLedgerAccount}/${id}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to delete ledger account');
};

const toggleAccountStatus = async (id: string): Promise<LedgerAccountResponse> => {
  const response = await axios.put(
    `${API.domain}${API.endPoints.toggleLedgerAccountStatus}/${id}`,
    {},
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to toggle account status');
};

const getFinancialSummary = async (organisationId?: string): Promise<FinancialSummaryResponse> => {
  const params = new URLSearchParams();
  const orgId = organisationId ?? getOrganisationId();
  if (orgId) params.append('organisation', orgId);
  const response = await axios.get(
    `${API.domain}${API.endPoints.getFinancialSummary}${params.toString() ? '?' + params.toString() : ''}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch financial summary');
};

// ==================== Journal Entry APIs ====================

const createJournalEntry = async (data: {
  date?: string;
  description: string;
  entries: JournalEntryLine[];
  organisationId?: string;
  branchId?: string;
}): Promise<JournalEntryResponse> => {
  const payload = {
    ...data,
    organisationId: data.organisationId || getOrganisationId() || undefined,
  };
  const response = await axios.post(
    `${API.domain}${API.endPoints.createJournalEntry}`,
    payload,
    { headers: getHeaders() }
  );
  if (response.status === 200 || response.status === 201) return response.data;
  throw new Error('Failed to create journal entry');
};

const getAllJournalEntries = async (filters?: JournalEntryFilters): Promise<JournalEntriesListResponse> => {
  const params = new URLSearchParams();
  const organisationId = filters?.organisationId ?? getOrganisationId();
  if (organisationId) params.append('organisation', organisationId);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'organisationId' || value === undefined || value === '') return;
      params.append(key, String(value));
    });
  }
  const response = await axios.get(
    `${API.domain}${API.endPoints.getAllJournalEntries}${params.toString() ? '?' + params.toString() : ''}`,
    { headers: getHeaders() }
  );
  if (response.status === 200) return response.data;
  throw new Error('Failed to fetch journal entries');
};

export const ledgerService = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  toggleAccountStatus,
  getFinancialSummary,
  createJournalEntry,
  getAllJournalEntries,
};
