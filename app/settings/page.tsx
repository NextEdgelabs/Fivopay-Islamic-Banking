'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs } from '@/components/ui';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useOrganizationSettings } from '@/hooks/useOrganizationSettings';
import { useOrganizationMutations } from '@/hooks/useOrganizationMutations';

export default function SettingsPage() {
  const { addToast } = useToast();
  const { organizationType, perSharePrice, loading: fetchLoading, refetch } = useOrganizationSettings();
  const { updateOrganizationType, updatePerSharePrice, loading: saving } = useOrganizationMutations();

  const [formData, setFormData] = useState({
    organizationType: 'Ethical Banking' as 'Ethical Banking' | 'Conventional Banking',
    perSharePrice: '100',
  });

  useEffect(() => {
    if (organizationType && perSharePrice) {
      setFormData({
        organizationType,
        perSharePrice: perSharePrice.toString(),
      });
    }
  }, [organizationType, perSharePrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const price = parseFloat(formData.perSharePrice);
      if (price < 1) {
        addToast({
          type: 'error',
          message: 'Per share price must be at least ₹1',
        });
        return;
      }

      await Promise.all([
        updateOrganizationType(formData.organizationType),
        updatePerSharePrice(price),
      ]);

      addToast({
        type: 'success',
        message: 'Settings updated successfully',
      });

      refetch();
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update settings',
      });
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/settings' },
  ];

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center text-neutral-500">Loading settings...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
            <p className="text-neutral-600 mt-1">Manage your organization settings</p>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <SettingsIcon className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-neutral-900">General Settings</h2>
              </div>

              <div className="space-y-6">
                <Select
                  label="Organization Type"
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  required
                  options={[
                    { value: 'Ethical Banking', label: 'Ethical Banking' },
                    { value: 'Conventional Banking', label: 'Conventional Banking' },
                  ]}
                  helperText="Select your organization type. Ethical Banking includes share purchase features."
                />

                {formData.organizationType === 'Ethical Banking' && (
                  <Input
                    label="Per Share Price (₹)"
                    name="perSharePrice"
                    type="number"
                    value={formData.perSharePrice}
                    onChange={handleChange}
                    required
                    min="1"
                    step="0.01"
                    helperText="Default price per share for new share purchases. Each purchase can have a different price."
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="primary" type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>

        {/* Information */}
        {formData.organizationType === 'Ethical Banking' && (
          <Card className="bg-primary-50 border-primary-200">
            <div className="p-4">
              <h3 className="text-sm font-medium text-primary-900 mb-2">
                Ethical Banking Features
              </h3>
              <ul className="text-sm text-primary-700 space-y-1">
                <li>• Share purchase management for customers</li>
                <li>• Member ID assignment on share approval</li>
                <li>• Shareholders widget on dashboard</li>
                <li>• Configurable per share pricing</li>
              </ul>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

