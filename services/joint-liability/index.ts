import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

// ============================================================================
// TYPES (matching frontend lib/joint-liability-service)
// ============================================================================

export type MemberRole = 'head' | 'member';

export interface Member {
  id: string;
  name: string;
  customerId?: string;
  role: MemberRole;
  depositAmount: number;
  availableCredit: number;
  currentLoanAmount: number;
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  totalDeposit: number;
  maxCreditLimit: number;
  createdAt: string;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  groupId: string;
  groupName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'repaid';
  appliedDate: string;
  purpose: string;
}

export interface Transaction {
  id: string;
  groupId: string;
  type: 'deposit' | 'distribution' | 'loan_disbursement' | 'loan_repayment';
  amount: number;
  memberId?: string;
  memberName?: string;
  date: string;
  description: string;
}

export interface CreateGroupPayload {
  name: string;
  members: { name: string; depositAmount: number; role: MemberRole; customerId?: string }[];
}

export type DistributeCreditPayload = { memberId: string; amount: number }[];

export interface AddMemberPayload {
  name: string;
  depositAmount: number;
  role: MemberRole;
  customerId?: string;
}

// ============================================================================
// NORMALIZE API RESPONSE TO FRONTEND SHAPE
// ============================================================================

function normalizeMember(m: any): Member {
  return {
    id: m.memberId || m.id || m._id?.toString(),
    name: m.name,
    customerId: m.customerId?.toString(),
    role: m.role || 'member',
    depositAmount: m.depositAmount ?? 0,
    availableCredit: m.availableCredit ?? 0,
    currentLoanAmount: m.currentLoanAmount ?? 0,
    joinedAt: m.joinedAt || m.createdAt || new Date().toISOString(),
  };
}

function normalizeGroup(g: any): Group {
  return {
    id: g._id?.toString() || g.id,
    name: g.name,
    members: (g.members || []).map(normalizeMember),
    totalDeposit: g.totalDeposit ?? 0,
    maxCreditLimit: g.maxCreditLimit ?? 0,
    createdAt: g.createdAt || new Date().toISOString(),
  };
}

function normalizeLoan(l: any): Loan {
  return {
    id: l._id?.toString() || l.id,
    memberId: l.memberId,
    memberName: l.memberName,
    groupId: l.groupId?.toString() || l.groupId,
    groupName: l.groupName,
    amount: l.amount ?? 0,
    status: l.status || 'pending',
    appliedDate: l.appliedDate || l.createdAt || new Date().toISOString(),
    purpose: l.purpose || '',
  };
}

function normalizeTransaction(t: any): Transaction {
  return {
    id: t._id?.toString() || t.id,
    groupId: t.groupId?.toString() || t.groupId,
    type: t.type || 'deposit',
    amount: t.amount ?? 0,
    memberId: t.memberId,
    memberName: t.memberName,
    date: t.date || t.createdAt || new Date().toISOString(),
    description: t.description || '',
  };
}

// ============================================================================
// API HELPERS
// ============================================================================

async function apiRequest<T>(method: string, url: string, data?: any): Promise<T> {
  const token = getAuthToken();
  const config: any = {
    method,
    url: `${API.domain}${url}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.data = data;
  }
  const response = await axios(config);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || 'Request failed');
  }
  return response.data;
}

// ============================================================================
// GROUP API
// ============================================================================

export const jointLiabilityGroupApi = {
  async getAll(params?: { search?: string; page?: number; limit?: number }): Promise<Group[]> {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    if (params?.limit) q.append('limit', String(params.limit));
    const res = await apiRequest<any>(`GET`, `${API.endPoints.jointLiability.groupGetAll}${q.toString() ? '?' + q.toString() : ''}`);
    const groups = res?.data?.groups || res?.groups || [];
    return groups.map(normalizeGroup);
  },

  async getById(id: string): Promise<Group> {
    const res = await apiRequest<any>('GET', `${API.endPoints.jointLiability.groupGetById}/${id}`);
    const group = res?.data?.group || res?.group;
    if (!group) throw new Error('Group not found');
    return normalizeGroup(group);
  },

  async create(data: { name: string; members: { name: string; depositAmount: number; role: MemberRole; customerId?: string }[] }): Promise<Group> {
    const res = await apiRequest<any>('POST', API.endPoints.jointLiability.groupCreate, data);
    const group = res?.data?.group || res?.group;
    if (!group) throw new Error(res?.message || 'Failed to create group');
    return normalizeGroup(group);
  },

  async updateName(id: string, name: string): Promise<Group> {
    const res = await apiRequest<any>('PUT', `${API.endPoints.jointLiability.groupUpdate}/${id}`, { name });
    const group = res?.data?.group || res?.group;
    if (!group) throw new Error(res?.message || 'Failed to update group');
    return normalizeGroup(group);
  },

  async distributeCredit(id: string, distributions: { memberId: string; amount: number }[]): Promise<Group> {
    const res = await apiRequest<any>('PUT', `${API.endPoints.jointLiability.groupDistribute}/${id}`, { distributions });
    const group = res?.data?.group || res?.group;
    if (!group) throw new Error(res?.message || 'Failed to distribute credit');
    return normalizeGroup(group);
  },

  async addMember(id: string, member: { name: string; depositAmount: number; role: MemberRole; customerId?: string }): Promise<Group> {
    const res = await apiRequest<any>('PUT', `${API.endPoints.jointLiability.groupAddMember}/${id}`, member);
    const group = res?.data?.group || res?.group;
    if (!group) throw new Error(res?.message || 'Failed to add member');
    return normalizeGroup(group);
  },

  async removeMember(id: string, memberId: string): Promise<Group> {
    const res = await apiRequest<any>('PUT', `${API.endPoints.jointLiability.groupRemoveMember}/${id}`, { memberId });
    const group = res?.data?.group || res?.group;
    if (!group) throw new Error(res?.message || 'Failed to remove member');
    return normalizeGroup(group);
  },

  async addDeposit(id: string, memberId: string, amount: number): Promise<Group> {
    const res = await apiRequest<any>('PUT', `${API.endPoints.jointLiability.groupAddDeposit}/${id}`, { memberId, amount });
    const group = res?.data?.group || res?.group;
    if (!group) throw new Error(res?.message || 'Failed to add deposit');
    return normalizeGroup(group);
  },

  async delete(id: string): Promise<void> {
    await apiRequest('DELETE', `${API.endPoints.jointLiability.groupDelete}/${id}`);
  },
};

export const jointLiabilityService = {
  getAllGroups: (params?: { search?: string }) => jointLiabilityGroupApi.getAll(params),
  getGroupById: (id: string) => jointLiabilityGroupApi.getById(id),
  createGroup: (data: CreateGroupPayload) => jointLiabilityGroupApi.create(data),
  deleteGroup: (id: string) => jointLiabilityGroupApi.delete(id),
  distributeCredit: (id: string, distributions: DistributeCreditPayload) =>
    jointLiabilityGroupApi.distributeCredit(id, distributions),
  addMemberToGroup: (id: string, member: AddMemberPayload) => jointLiabilityGroupApi.addMember(id, member),
  removeMemberFromGroup: (id: string, memberId: string) => jointLiabilityGroupApi.removeMember(id, memberId),
  getAllTransactions: (params?: { groupId?: string; type?: string; startDate?: string; endDate?: string }) =>
    jointLiabilityTransactionApi.getAll(params),
  addDepositToMember: (groupId: string, memberId: string, amount: number) =>
    jointLiabilityGroupApi.addDeposit(groupId, memberId, amount),
  getAllLoans: () => jointLiabilityLoanApi.getAll(),
  applyForLoan: (groupId: string, memberId: string, amount: number, purpose: string) =>
    jointLiabilityLoanApi.apply({ groupId, memberId, amount, purpose }),
  updateLoanStatus: (id: string, status: Loan['status']) => jointLiabilityLoanApi.updateStatus(id, status),
  repayLoan: (id: string, amount: number) => jointLiabilityLoanApi.repay(id, amount),
};

// ============================================================================
// LOAN API
// ============================================================================

export const jointLiabilityLoanApi = {
  async getAll(): Promise<Loan[]> {
    const res = await apiRequest<any>('GET', API.endPoints.jointLiability.loanGetAll);
    const loans = res?.data?.loans || res?.loans || [];
    return loans.map(normalizeLoan);
  },

  async apply(data: { groupId: string; memberId: string; amount: number; purpose: string }): Promise<Loan> {
    const res = await apiRequest<any>('POST', API.endPoints.jointLiability.loanApply, data);
    const loan = res?.data?.loan || res?.loan;
    if (!loan) throw new Error(res?.message || 'Failed to apply for loan');
    return normalizeLoan(loan);
  },

  async updateStatus(id: string, status: Loan['status']): Promise<Loan> {
    const res = await apiRequest<any>('PUT', `${API.endPoints.jointLiability.loanUpdateStatus}/${id}`, { status });
    const loan = res?.data?.loan || res?.loan;
    if (!loan) throw new Error(res?.message || 'Failed to update loan status');
    return normalizeLoan(loan);
  },

  async repay(id: string, amount: number): Promise<void> {
    await apiRequest('PUT', `${API.endPoints.jointLiability.loanRepay}/${id}`, { amount });
  },
};

// ============================================================================
// TRANSACTION API
// ============================================================================

export const jointLiabilityTransactionApi = {
  async getAll(params?: { groupId?: string; type?: string; startDate?: string; endDate?: string }): Promise<Transaction[]> {
    const q = new URLSearchParams();
    if (params?.groupId) q.append('groupId', params.groupId);
    if (params?.type) q.append('type', params.type);
    if (params?.startDate) q.append('startDate', params.startDate);
    if (params?.endDate) q.append('endDate', params.endDate);
    const res = await apiRequest<any>(`GET`, `${API.endPoints.jointLiability.transactionGetAll}${q.toString() ? '?' + q.toString() : ''}`);
    const transactions = res?.data?.transactions || res?.transactions || [];
    return transactions.map(normalizeTransaction);
  },
};
