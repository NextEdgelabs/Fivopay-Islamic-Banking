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
