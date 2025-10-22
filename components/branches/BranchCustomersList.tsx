import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomers } from '@/hooks/useCustomers';
import { Table, Pagination, Input, Skeleton, Badge } from '@/components/ui';
import { Search, Eye } from 'lucide-react';
import { Customer } from '@/services/customers.service';

interface BranchCustomersListProps {
  branchName: string;
}

const BranchCustomersList: React.FC<BranchCustomersListProps> = ({ branchName }) => {
  const router = useRouter();
  const { customers, loading, error, setFilters } = useCustomers({ branch: branchName });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return customers.slice(startIndex, startIndex + itemsPerPage);
  }, [customers, currentPage]);

  const columns = [
    { header: 'Customer ID', key: 'customerId' },
    { header: 'Full Name', key: 'fullName' },
    { header: 'Account Type', key: 'accountType' },
    { header: 'Status', key: 'status', render: (status: string) => <Badge variant={status === 'Active' ? 'success' : 'neutral'}>{status}</Badge> },
    {
      header: 'Actions',
      key: 'actions',
      render: (_: any, item: Customer) => (
        <button onClick={() => router.push(`/customers/${item.id}`)} className="p-2 hover:bg-neutral-100 rounded-md">
          <Eye className="h-4 w-4" />
        </button>
      )
    }
  ];

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <p className="text-error-500">Failed to load customers for this branch.</p>;

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={handleSearchChange}
          leftIcon={<Search className="h-4 w-4 text-neutral-400" />}
        />
      </div>
      {customers.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <p>No customers found for this branch.</p>
        </div>
      ) : (
        <>
          <Table data={paginatedCustomers} columns={columns} />
          {customers.length > itemsPerPage && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(customers.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BranchCustomersList;
