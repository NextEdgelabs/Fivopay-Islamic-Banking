import axios from 'axios';
import { API } from '@/api';

export const employeeLogin = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API.domain}${API.endPoints.employeeLogin}`, { email, password });
        if (response.status === 200 || response.status === 201) {
            return response.data;
        } else {
            throw new Error('Failed to login');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to login');
    }
}