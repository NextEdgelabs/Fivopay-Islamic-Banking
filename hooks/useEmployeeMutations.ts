import { useState } from 'react';
import {
  employeeService,
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '@/services/employee.service';

interface UseEmployeeMutationsResult {
  createEmployee: (data: CreateEmployeeDto) => Promise<Employee>;
  updateEmployee: (id: string, data: UpdateEmployeeDto) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useEmployeeMutations(): UseEmployeeMutationsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmployee = async (data: CreateEmployeeDto): Promise<Employee> => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.create(data);
      if (response.success && response.data && response.data.employee) {
        return response.data.employee;
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, data: UpdateEmployeeDto): Promise<Employee> => {
    try {
      setLoading(true);
      setError(null);
      const response:any = await employeeService.update(id, data);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await employeeService.delete(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    loading,
    error,
  };
}

