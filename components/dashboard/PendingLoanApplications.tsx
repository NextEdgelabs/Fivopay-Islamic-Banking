'use client';
import { Card, Skeleton, Badge } from '@/components/ui';
import { Clock } from 'lucide-react';
import { useLoans } from '@/hooks/useLoans';
import Link from 'next/link';

export default function PendingLoanApplications() {
  const { loans, loading } = useLoans({ status: 'Pending' });
  if (loading) return <Skeleton className="h-48 w-full" />;
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-neutral-900">Pending Loan Applications</h3>
        <Badge variant="warning">{loans.length}</Badge>
      </div>
      <div className="space-y-3">
        {loans.slice(0, 5).map((loan) => (
          <Link href={`/loans/${loan.id}`} key={loan.id} className="block hover:bg-neutral-50 p-2 rounded">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{loan.customerName}</p>
                <p className="text-sm text-neutral-500">{loan.loanType}</p>
              </div>
              <p className="font-semibold">₹{loan.loanAmount.toLocaleString('en-IN')}</p>
            </div>
          </Link>
        ))}
        {loans.length === 0 && <p className="text-sm text-neutral-500 text-center py-4">No pending applications.</p>}
      </div>
    </Card>
  );
}
