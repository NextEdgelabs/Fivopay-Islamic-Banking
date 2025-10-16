'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, User, Mail, Lock, Search, Plus, Edit, Trash2, Download, 
  Upload, Settings, Bell, Calendar, DollarSign, TrendingUp, Users,
  CreditCard, Building, FileText, Package
} from 'lucide-react';
import {
  Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Toggle,
  Card, Modal, Drawer, Badge, Avatar, ProgressBar, StatsCard, EmptyState,
  Table, Alert, Loading, Skeleton, SkeletonCard, SkeletonTable,
  Tabs, Breadcrumbs, Pagination, Stepper, useToast
} from '@/components/ui';

export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [toggleState, setToggleState] = useState(false);
  const { addToast } = useToast();

  // Sample data for table
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  ];

  const tableColumns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'success' : 'neutral'}>
          {value}
        </Badge>
      ),
    },
  ];

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Home className="h-4 w-4" />,
      content: <div className="p-4 bg-neutral-50 rounded">Overview content goes here</div>,
    },
    {
      id: 'details',
      label: 'Details',
      icon: <FileText className="h-4 w-4" />,
      content: <div className="p-4 bg-neutral-50 rounded">Details content goes here</div>,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      content: <div className="p-4 bg-neutral-50 rounded">Settings content goes here</div>,
    },
  ];

  const steps = [
    { id: '1', label: 'Account Details', description: 'Basic information' },
    { id: '2', label: 'Verification', description: 'Verify your identity' },
    { id: '3', label: 'Confirmation', description: 'Review and confirm' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-border-light">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Component Library
              </h1>
              <p className="text-neutral-600 mt-1">
                Stripe-inspired components for FivoPay Banking
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" icon={<Home className="h-4 w-4" />}>
                Back to Home
              </Button>
            </Link>
          </div>
          
          {/* Breadcrumbs */}
          <div className="mt-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Components' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-8 space-y-12">
        {/* Color Palette */}
        <Section title="Color Palette" description="Stripe-inspired color system">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <ColorSwatch name="Primary" colors={['primary-500', 'primary-600', 'primary-700']} />
            <ColorSwatch name="Success" colors={['success-500', 'success-600', 'success-700']} />
            <ColorSwatch name="Warning" colors={['warning-500', 'warning-600', 'warning-700']} />
            <ColorSwatch name="Error" colors={['error-500', 'error-600', 'error-700']} />
            <ColorSwatch name="Neutral" colors={['neutral-400', 'neutral-600', 'neutral-800']} />
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons" description="Primary, secondary, and utility buttons">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Variants</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="danger">Danger Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="outline">Outline Button</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Sizes</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">With Icons</h4>
              <div className="flex flex-wrap gap-3">
                <Button icon={<Plus className="h-4 w-4" />}>Add New</Button>
                <Button icon={<Download className="h-4 w-4" />} iconPosition="right">Download</Button>
                <Button loading>Loading...</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Icon Buttons</h4>
              <div className="flex flex-wrap gap-3">
                <IconButton icon={<Edit className="h-4 w-4" />} ariaLabel="Edit" variant="primary" />
                <IconButton icon={<Trash2 className="h-4 w-4" />} ariaLabel="Delete" variant="danger" />
                <IconButton icon={<Settings className="h-4 w-4" />} ariaLabel="Settings" variant="ghost" />
              </div>
            </div>
          </div>
        </Section>

        {/* Form Components */}
        <Section title="Form Components" description="Inputs, selects, checkboxes, and more">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              leftIcon={<Mail className="h-4 w-4" />}
              helperText="We'll never share your email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              rightIcon={<Lock className="h-4 w-4" />}
              required
            />
            <Input
              label="With Error"
              placeholder="Invalid input"
              error="This field is required"
            />
            <Select
              label="Country"
              placeholder="Select a country"
              options={[
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'ca', label: 'Canada' },
              ]}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                placeholder="Enter description"
                helperText="Maximum 500 characters"
              />
            </div>
            <div className="space-y-3">
              <Checkbox label="Accept terms and conditions" />
              <Checkbox label="Subscribe to newsletter" helperText="Get updates via email" />
            </div>
            <div className="space-y-3">
              <Radio name="plan" value="basic" label="Basic Plan" helperText="$10/month" />
              <Radio name="plan" value="pro" label="Pro Plan" helperText="$25/month" />
            </div>
            <div className="md:col-span-2">
              <Toggle
                label="Enable notifications"
                helperText="Receive email notifications for updates"
                checked={toggleState}
                onChange={(e) => setToggleState(e.target.checked)}
              />
            </div>
          </div>
        </Section>

        {/* Cards & Badges */}
        <Section title="Cards & Badges" description="Content containers and status indicators">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Basic Card</h3>
              <p className="text-neutral-600">This is a simple card with default padding.</p>
            </Card>
            <Card hover>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Hover Card</h3>
              <p className="text-neutral-600">Hover over this card to see the effect.</p>
            </Card>
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Large Padding</h3>
              <p className="text-neutral-600">This card has larger padding.</p>
            </Card>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-neutral-700 mb-3">Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="success" dot>Active</Badge>
              <Badge variant="primary" size="lg">Large Badge</Badge>
            </div>
          </div>
        </Section>

        {/* Stats Cards */}
        <Section title="Statistics Cards" description="Display key metrics and trends">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Revenue"
              value="$45,231"
              icon={<DollarSign className="h-6 w-6" />}
              trend={{ value: 12.5, isPositive: true }}
              description="vs last month"
            />
            <StatsCard
              title="Active Users"
              value="2,847"
              icon={<Users className="h-6 w-6" />}
              trend={{ value: 3.2, isPositive: true }}
              description="vs last month"
            />
            <StatsCard
              title="Loan Applications"
              value="456"
              icon={<FileText className="h-6 w-6" />}
              trend={{ value: 8.1, isPositive: false }}
              description="vs last month"
            />
            <StatsCard
              title="Deposits"
              value="$1.2M"
              icon={<TrendingUp className="h-6 w-6" />}
              description="This month"
            />
          </div>
        </Section>

        {/* Avatars & Progress */}
        <Section title="Avatars & Progress" description="User avatars and progress indicators">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Avatars</h4>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar size="xs" fallback="John Doe" />
                <Avatar size="sm" fallback="Jane Smith" />
                <Avatar size="md" fallback="Bob Johnson" />
                <Avatar size="lg" fallback="Alice Williams" />
                <Avatar size="xl" fallback="Charlie Brown" />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Progress Bars</h4>
              <div className="space-y-4 max-w-2xl">
                <ProgressBar value={75} showLabel label="Profile Completion" />
                <ProgressBar value={45} variant="success" showLabel label="Storage Used" />
                <ProgressBar value={90} variant="warning" showLabel label="API Limit" />
                <ProgressBar value={100} variant="error" showLabel label="Quota Exceeded" />
              </div>
            </div>
          </div>
        </Section>

        {/* Alerts & Loading */}
        <Section title="Feedback Components" description="Alerts, loading states, and notifications">
          <div className="space-y-4">
            <Alert variant="success" message="Your changes have been saved successfully!" />
            <Alert variant="error" message="An error occurred while processing your request." />
            <Alert variant="warning" title="Warning" message="Your session will expire in 5 minutes." dismissible />
            <Alert variant="info" message="A new version of the app is available." dismissible />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Loading Spinner</h4>
              <Loading size="md" text="Loading..." />
            </Card>
            <Card>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Toast Notification</h4>
              <Button
                onClick={() =>
                  addToast({
                    type: 'success',
                    message: 'Operation completed successfully!',
                  })
                }
              >
                Show Toast
              </Button>
            </Card>
            <Card>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Empty State</h4>
              <EmptyState
                icon={<Package className="h-8 w-8" />}
                title="No items found"
                description="Get started by adding your first item"
              />
            </Card>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-neutral-700 mb-3">Skeleton Loaders</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard lines={4} />
              <div className="space-y-3">
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="circular" width={48} height={48} />
              </div>
            </div>
          </div>
        </Section>

        {/* Table */}
        <Section title="Data Table" description="Sortable table with custom rendering">
          <Table
            data={tableData}
            columns={tableColumns}
            onRowClick={(row) => console.log('Clicked:', row)}
          />
        </Section>

        {/* Tabs */}
        <Section title="Tabs" description="Organize content into tabs">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Default Tabs</h4>
              <Tabs tabs={tabs} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Pill Tabs</h4>
              <Tabs tabs={tabs} variant="pills" />
            </div>
          </div>
        </Section>

        {/* Pagination */}
        <Section title="Pagination" description="Navigate through pages of content">
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </div>
        </Section>

        {/* Stepper */}
        <Section title="Stepper" description="Guide users through multi-step processes">
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-4">Horizontal Stepper</h4>
              <Stepper steps={steps} currentStep={currentStep} />
              <div className="flex justify-center gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                  disabled={currentStep === 3}
                >
                  Next
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-4">Vertical Stepper</h4>
              <Stepper steps={steps} currentStep={2} orientation="vertical" />
            </div>
          </div>
        </Section>

        {/* Modal & Drawer */}
        <Section title="Overlays" description="Modals and drawers for focused interactions">
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open Drawer
            </Button>
          </div>

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Example Modal"
            footer={
              <>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Confirm</Button>
              </>
            }
          >
            <p className="text-neutral-600">
              This is a modal dialog. It can contain any content you need, including forms,
              images, or complex layouts.
            </p>
          </Modal>

          <Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Example Drawer"
          >
            <div className="space-y-4">
              <p className="text-neutral-600">
                This is a drawer component. It slides in from the side and is great for
                navigation menus or forms.
              </p>
              <Input label="Name" placeholder="Enter your name" />
              <Input label="Email" type="email" placeholder="Enter your email" />
              <Button fullWidth>Submit</Button>
            </div>
          </Drawer>
        </Section>

        {/* Design Guidelines Link */}
        <Section title="Design Guidelines" description="Comprehensive design system documentation">
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-stripe flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Stripe Design Guidelines
                </h3>
                <p className="text-neutral-600 mb-4">
                  Complete documentation of our design system including colors, typography,
                  spacing, accessibility guidelines, and component usage patterns.
                </p>
                <Link href="/DESIGN_GUIDELINES.md" target="_blank">
                  <Button variant="outline">View Guidelines</Button>
                </Link>
              </div>
            </div>
          </Card>
        </Section>
      </div>
    </div>
  );
}

// Helper Components
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
        <p className="text-neutral-600 mt-1">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ColorSwatch({ name, colors }: { name: string; colors: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-neutral-700">{name}</h4>
      <div className="space-y-1">
        {colors.map((color) => (
          <div key={color} className="flex items-center gap-2">
            <div className={`w-12 h-12 rounded-stripe bg-${color} border border-border-light`} />
            <span className="text-xs text-neutral-600">{color}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
