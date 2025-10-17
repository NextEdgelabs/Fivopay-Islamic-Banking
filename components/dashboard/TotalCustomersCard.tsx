'use client';
import { Card, Skeleton } from '@/components/ui';
import { Users } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';

export default function TotalCustomersCard() {
  const { customers, loading } = useCustomers();
  if (loading) return <Skeleton className="h-24 w-full" />;
  return (
    <Card className="p-4">
      <div className="flex items-center">
        <div className="bg-primary-100 p-3 rounded-full">
          <Users className="h-6 w-6 text-primary-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-neutral-500">Total Customers</p>
          <p className="text-2xl font-bold text-neutral-900">{customers.length}</p>
        </div>
      </div>
    </Card>
  );
}
