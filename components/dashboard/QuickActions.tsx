'use client';
import { Card, Button } from '@/components/ui';
import { Plus, Users, Building, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter();
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-neutral-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => router.push('/customers/add')}>
          <Users className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
        <Button variant="outline" onClick={() => router.push('/branches/add')}>
          <Building className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
        <Button variant="outline" onClick={() => router.push('/loans/add')}>
          <DollarSign className="h-4 w-4 mr-2" />
          New Loan
        </Button>
        <Button variant="outline" onClick={() => router.push('/deposits/add')}>
          <Plus className="h-4 w-4 mr-2" />
          New Deposit
        </Button>
      </div>
    </Card>
  );
}
