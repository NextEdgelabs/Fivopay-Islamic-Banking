'use client';

import React, { useState } from 'react';
import { useSharePurchases } from '@/hooks/useSharePurchases';
import { useSharePurchaseMutations } from '@/hooks/useSharePurchaseMutations';
import { Table, Button, Badge, Card } from '@/components/ui';
import { Plus, Edit, Trash2, Check, X, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import SharePurchaseModal from './SharePurchaseModal';
import { SharePurchase } from '@/services/customers.service';

interface SharePurchaseHistoryProps {
  customerId: string;
  mode?: 'view' | 'edit' | 'add';
}

export default function SharePurchaseHistory({ customerId, mode = 'view' }: SharePurchaseHistoryProps) {
  const { sharePurchases, loading, refetch } = useSharePurchases(customerId);
  const { deleteSharePurchase, approveSharePurchase, rejectSharePurchase } = useSharePurchaseMutations();
  const { addToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<SharePurchase | null>(null);

  // Show message in add mode since customer doesn't exist yet
  if (mode === 'add' || !customerId) {
    return (
      <div className="p-6">
        <Card className="p-8">
          <div className="text-center text-neutral-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
            <p className="text-lg font-medium">Save Customer First</p>
            <p className="text-sm mt-2">
              Please save the customer details first, then you can add share purchases from the customer view or edit page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const handleAdd = () => {
    setEditingPurchase(null);
    setIsModalOpen(true);
  };

  const handleEdit = (purchase: SharePurchase) => {
    setEditingPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleDelete = async (purchase: SharePurchase) => {
    if (confirm(`Are you sure you want to delete this share purchase (${purchase.certificateNumber})?`)) {
      try {
        await deleteSharePurchase(purchase.id);
        addToast({
          type: 'success',
          message: 'Share purchase deleted successfully',
        });
        refetch();
      } catch (err) {
        addToast({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to delete share purchase',
        });
      }
    }
  };

  const handleApprove = async (purchase: SharePurchase) => {
    try {
      await approveSharePurchase(purchase.id, 'Admin User');
      addToast({
        type: 'success',
        message: 'Share purchase approved successfully. Member ID assigned!',
      });
      refetch();
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to approve share purchase',
      });
    }
  };

  const handleReject = async (purchase: SharePurchase) => {
    if (confirm('Are you sure you want to reject this share purchase?')) {
      try {
        await rejectSharePurchase(purchase.id, 'Admin User');
        addToast({
          type: 'success',
          message: 'Share purchase rejected',
        });
        refetch();
      } catch (err) {
        addToast({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to reject share purchase',
        });
      }
    }
  };

  const handleModalClose = (shouldRefresh?: boolean) => {
    setIsModalOpen(false);
    setEditingPurchase(null);
    if (shouldRefresh) {
      refetch();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'success' | 'warning' | 'error' | 'neutral', text: string }> = {
      'Approved': { variant: 'success', text: 'Approved' },
      'Pending': { variant: 'warning', text: 'Pending' },
      'Rejected': { variant: 'error', text: 'Rejected' },
      'Cancelled': { variant: 'error', text: 'Cancelled' },
    };
    
    const config = statusConfig[status] || { variant: 'neutral' as const, text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const columns = [
    {
      key: 'certificateNumber',
      header: 'Certificate #',
      render: (value: string) => <span className="font-medium text-neutral-900">{value}</span>,
    },
    {
      key: 'purchaseDate',
      header: 'Purchase Date',
      render: (value: string) => new Date(value).toLocaleDateString('en-IN'),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (value: number) => value.toLocaleString('en-IN'),
    },
    {
      key: 'pricePerShare',
      header: 'Price/Share',
      render: (value: number) => `₹${value.toLocaleString('en-IN')}`,
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      render: (value: number) => (
        <span className="font-semibold text-primary-600">₹{value.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'memberId',
      header: 'Member ID',
      render: (value?: string) => value || '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: SharePurchase) => (
        <div className="flex items-center gap-2">
          {row.approvalStatus === 'Pending Approval' && mode !== 'view' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(row)}
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleReject(row)}
                title="Reject"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          {mode !== 'view' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(row)}
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(row)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const totalShares = sharePurchases.reduce((sum, sp) => sum + sp.quantity, 0);
  const totalValue = sharePurchases.reduce((sum, sp) => sum + sp.totalAmount, 0);
  const approvedShares = sharePurchases
    .filter((sp) => sp.approvalStatus === 'Approved')
    .reduce((sum, sp) => sum + sp.quantity, 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-neutral-500">Loading share purchases...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          <h3 className="text-xl font-semibold text-neutral-900">Share Purchase History</h3>
        </div>
        {mode !== 'view' && (
          <Button variant="primary" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Share Purchase
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-neutral-600">Total Shares</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{totalShares.toLocaleString('en-IN')}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-600">Approved Shares</p>
          <p className="text-2xl font-bold text-success-600 mt-1">{approvedShares.toLocaleString('en-IN')}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-600">Total Value</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">₹{totalValue.toLocaleString('en-IN')}</p>
        </Card>
      </div>

      {/* Table */}
      {sharePurchases.length === 0 ? (
        <Card className="p-8">
          <div className="text-center text-neutral-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
            <p>No share purchases yet</p>
            {mode !== 'view' && (
              <Button variant="primary" onClick={handleAdd} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Share Purchase
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Table columns={columns} data={sharePurchases} />
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <SharePurchaseModal
          customerId={customerId}
          purchase={editingPurchase}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

