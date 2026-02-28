import axios from 'axios';
import { API } from '@/api';
import { getAuthToken } from '@/lib/auth';

export interface Organization {
  _id?: string;
  id?: string;
  organisationName?: string;
  organizationName?: string;
  name?: string;
  registrationNumber?: string;
  establishedDate?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  status?: 'active' | 'inactive';
}

export interface OrganizationsListResponse {
  success: boolean;
  message: string;
  data: {
    organizations?: Organization[];
    organisations?: Organization[];
  };
}

export interface OrganizationResponse {
  success: boolean;
  message: string;
  data: {
    organization: Organization;
  };
}

export const getAllOrganizations = async (): Promise<Organization[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getAllOrganisations}?limit=100`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200 && response.data?.success) {
      const data = response.data.data;
      const orgs = data?.organisations || data?.organizations || [];
      return Array.isArray(orgs) ? orgs : [];
    }
    throw new Error('Failed to fetch organizations');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch organizations');
  }
};

export const getOrganizationById = async (id: string): Promise<OrganizationResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API.domain}${API.endPoints.getOrganisationById}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch organization');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch organization');
  }
};

