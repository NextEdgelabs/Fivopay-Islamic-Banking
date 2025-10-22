'use client';
import { Card, Skeleton, Table } from '@/components/ui';
import { useCustomer } from '@/hooks/useCustomer'; // Assuming this can fetch recent txns globally for now
import { customerService } from '@/services/customers.service';
import React from 'react';

export default function RecentTransactions() {
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // A bit of a hack: fetching transactions for the first mock customer
    // In a real app, this would be a dedicated endpoint for recent global transactions
    customerService.getCustomerTransactions('CUS001').then((data) => {
      setTransactions(data.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton className="h-64 w-full" />;

  const columns = [
    { header: 'Transaction ID', key: 'id' },
    { header: 'Date', key: 'date' },
    { header: 'Description', key: 'description' },
    { header: 'Amount', key: 'amount' },
  ];

  return (
    <Card className="p-4 col-span-2">
      <h3 className="font-semibold text-neutral-900 mb-4">Recent Transactions</h3>
      <Table data={transactions} columns={columns} />
    </Card>
  );
}
