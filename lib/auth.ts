// Authentication utilities

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  designation: string;
  accessList: string[];
  isAdmin: boolean;
  canApproveLoans: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canManageEmployees: boolean;
  status: string;
  lastLogin: string;
  /** Organisation ID for scoping data (from login response) */
  organisation?: string;
  branch?: string;
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

export const getCurrentUser = (): Employee | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const userData = localStorage.getItem('user');
  const accessToken = localStorage.getItem('accessToken');
  return !!(userData && accessToken);
};

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('selectedOrganisationId');
};

export const hasAccess = (permission: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  return user.accessList.includes(permission) || user.isAdmin;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.isAdmin || false;
};

/** Get current organisation ID for scoping API data (from logged-in employee or selected org) */
export const getOrganisationId = (): string | null => {
  if (typeof window === 'undefined') return null;
  const user = getCurrentUser();
  const fromUser = (user as any)?.organisation;
  if (fromUser != null) {
    if (typeof fromUser === 'string') return fromUser;
    if (typeof (fromUser as any)?._id === 'string') return (fromUser as any)._id;
  }
  return localStorage.getItem('selectedOrganisationId');
};

/** Get current branch ID (from logged-in employee) */
export const getBranchId = (): string | null => {
  if (typeof window === 'undefined') return null;
  const user = getCurrentUser();
  const branch = (user as any)?.branch;
  if (branch != null) {
    if (typeof branch === 'string') return branch;
    if (typeof (branch as any)?._id === 'string') return (branch as any)._id;
  }
  return null;
};

/** Set selected organisation ID when user switches org (e.g. org selector) */
export const setSelectedOrganisationId = (organisationId: string | null): void => {
  if (typeof window === 'undefined') return;
  if (organisationId) localStorage.setItem('selectedOrganisationId', organisationId);
  else localStorage.removeItem('selectedOrganisationId');
};
