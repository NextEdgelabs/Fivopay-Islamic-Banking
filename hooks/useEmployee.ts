import { useState, useEffect, useCallback } from 'react';
import {
  employeeService,
  Employee,
} from '@/services/employee.service';

interface UseEmployeeResult {
  employee: Employee | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEmployee(id: string): UseEmployeeResult {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeeData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response:any = await employeeService.getById(id);
      
      if (response.success && response.data) {
        setEmployee(response.data);
      } else {
        setError('Invalid response structure from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employee data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  return {
    employee,
    loading,
    error,
    refetch: fetchEmployeeData,
  };
}

