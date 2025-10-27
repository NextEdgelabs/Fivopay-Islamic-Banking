'use client';

import React from 'react';
import Link from 'next/link';
import { useShareholders } from '@/hooks/useShareholders';
import { useOrganizationSettings } from '@/hooks/useOrganizationSettings';
import { Card, Badge, Avatar } from '@/components/ui';
import { TrendingUp, Users } from 'lucide-react';

export default function ShareholdersWidget() {
  const { isEthicalBanking } = useOrganizationSettings();
  const { shareholders, loading } = useShareholders();

  // Only show widget for Ethical Banking
  if (!isEthicalBanking) return null;

  const totalSharesValue = shareholders.reduce((sum, s) => sum + s.totalValue, 0);

  if (loading) {
    return (
      <Card className="h-full">
        <div className="p-4 border-b border-border-light">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-neutral-900">Shareholders</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="text-center text-sm text-neutral-500">Loading...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      {/* Header */}
      <div className="p-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-neutral-900">Shareholders</h3>
          </div>
          <Badge variant="neutral">{shareholders.length}</Badge>
        </div>
      </div>

      {/* Shareholders List */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {shareholders.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-500">No shareholders yet</p>
          </div>
        ) : (
          shareholders.map((shareholder) => (
            <Link
              key={shareholder.customerId}
              href={`/customers/${shareholder.customerId}`}
              className="block hover:bg-neutral-50 p-3 rounded-lg transition-colors border border-transparent hover:border-border-light"
            >
              <div className="flex items-center gap-3">
                <Avatar fallback={shareholder.customerName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {shareholder.customerName}
                  </p>
                  {shareholder.memberId && (
                    <p className="text-xs text-neutral-500">
                      Member: {shareholder.memberId}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-neutral-600">
                      {shareholder.totalQuantity.toLocaleString('en-IN')} shares
                    </span>
                    <span className="text-xs text-neutral-400">•</span>
                    <span className="text-xs font-medium text-primary-600">
                      ₹{shareholder.totalValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {shareholder.pendingShares > 0 && (
                    <Badge variant="warning" className="mt-1 text-xs">
                      {shareholder.pendingShares} pending
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Footer with Total */}
      {shareholders.length > 0 && (
        <div className="p-4 border-t border-border-light bg-neutral-50">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Total Shareholders</span>
              <span className="text-sm font-semibold text-neutral-900">
                {shareholders.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Total Value</span>
              <span className="text-lg font-semibold text-primary-600">
                ₹{totalSharesValue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

