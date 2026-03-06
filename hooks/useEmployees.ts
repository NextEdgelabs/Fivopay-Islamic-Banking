import { useState, useEffect, useCallback } from 'react';
import { employeeService, Employee, EmployeeFilters, getAllEmployees } from '@/services/employee.service';
import { getOrganisationId } from '@/lib/auth';

interface UseEmployeesResult {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filters: EmployeeFilters;
  setFilters: React.Dispatch<React.SetStateAction<EmployeeFilters>>;
}

function getDefaultFilters(initialFilters?: EmployeeFilters): EmployeeFilters {
  const orgId = typeof window !== 'undefined' ? getOrganisationId() : null;
  return {
    ...initialFilters,
    organisation: initialFilters?.organisation !== undefined ? initialFilters.organisation : (orgId ?? undefined),
  };
}

export function useEmployees(initialFilters?: EmployeeFilters): UseEmployeesResult {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>(getDefaultFilters(initialFilters));

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEmployees(filters);
      if (data.success && data.data && data.data.employees) {
        setEmployees(data.data.employees);
      } else {
        setError('Invalid response structure from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
    filters,
    setFilters,
  };
}

