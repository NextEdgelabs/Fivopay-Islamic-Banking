'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Breadcrumbs, Textarea, Checkbox } from '@/components/ui';
import { Save, X } from 'lucide-react';
import { useBranchMutations } from '@/hooks/useBranchMutations';
import { useToast } from '@/components/ui/Toast';
import { INDIAN_STATES, CITIES_BY_STATE, BRANCH_SERVICES, LOAN_TYPES } from '@/lib/indiaData';
import { CreateBranchDto } from '@/services/branches';

export default function AddBranchPage() {
  const router = useRouter();
  const { createBranch, loading } = useBranchMutations();
  const { addToast } = useToast();
  const [formData, setFormData] = useState<Omit<CreateBranchDto, 'status'> & { loanTypes: string[] }>({
    branchName: '',
    branchType: 'Main Branch',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    landmark: '',
    latitude: undefined,
    longitude: undefined,
    phone: '',
    email: '',
    managerName: '',
    managerPhone: '',
    openingDate: '',
    workingHours: {
      weekdays: '10:00 AM - 05:00 PM',
      saturday: '10:00 AM - 02:00 PM',
      sunday: 'Closed',
    },
    services: [],
    loanTypes: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (name === 'state') {
      newFormData.city = '';
    }

    setFormData(newFormData);
  };

  const handleWorkingHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [name]: value,
      }
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleLoanTypeToggle = (loanType: string) => {
    setFormData(prev => ({
      ...prev,
      loanTypes: prev.loanTypes.includes(loanType)
        ? prev.loanTypes.filter(t => t !== loanType)
        : [...prev.loanTypes, loanType]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.branchName.trim()) newErrors.branchName = 'Branch name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address Line 1 is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.postalCode.trim() || !/^\d{6}$/.test(formData.postalCode)) newErrors.postalCode = 'Valid 6-digit postal code is required';
    if (!formData.phone.trim() || !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) newErrors.phone = 'Valid phone number is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.managerName.trim()) newErrors.managerName = 'Manager name is required';
    if (!formData.managerPhone.trim() || !/^\+?[1-9]\d{1,14}$/.test(formData.managerPhone)) newErrors.managerPhone = 'Valid manager phone is required';
    if (!formData.openingDate) newErrors.openingDate = 'Opening date is required';
    if (formData.services.length === 0 && formData.loanTypes.length === 0) newErrors.services = 'At least one service or loan type must be selected';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    try {
      const servicesWithLoanTypes = [
        ...formData.services,
        ...formData.loanTypes.map(t => `Loan: ${t}`),
      ];
      const dataToSubmit = {
        ...formData,
        services: servicesWithLoanTypes,
        latitude: formData.latitude ? parseFloat(String(formData.latitude)) : undefined,
        longitude: formData.longitude ? parseFloat(String(formData.longitude)) : undefined,
        status: 'Active' as const,
      };
      delete (dataToSubmit as any).loanTypes;

      await createBranch(dataToSubmit);
      addToast({ type: 'success', message: 'Branch created successfully' });
      router.push('/branches');
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to create branch' });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Branches', href: '/branches' }, { label: 'Add' }]} />
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-neutral-900">Add New Branch</h1>
          <Button variant="outline" onClick={() => router.push('/branches')}><X className="mr-2 h-4 w-4" />Cancel</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Branch Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="branchName" label="Branch Name" value={formData.branchName} onChange={handleChange} required error={errors.branchName} />
              <Select
                name="branchType"
                label="Branch Type"
                value={formData.branchType}
                onChange={handleChange}
                required
                options={[
                  { label: 'Main Branch', value: 'Main Branch' },
                  { label: 'Sub Branch', value: 'Sub Branch' },
                  { label: 'Extension Counter', value: 'Extension Counter' },
                ]}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Location Information</h2>
            <div className="space-y-4">
              <Input name="addressLine1" label="Address Line 1" value={formData.addressLine1} onChange={handleChange} required error={errors.addressLine1} />
              <Input name="addressLine2" label="Address Line 2" value={formData.addressLine2 || ''} onChange={handleChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select name="state" label="State" value={formData.state} onChange={handleChange} required options={[{ label: 'Select State', value: '' }, ...INDIAN_STATES.map(s => ({ label: s, value: s }))]} />
                <Select name="city" label="City" value={formData.city} onChange={handleChange} required disabled={!formData.state} options={[{ label: 'Select City', value: '' }, ...(CITIES_BY_STATE[formData.state] || []).map(c => ({ label: c, value: c }))]} error={errors.city} />
                <Input name="postalCode" label="Postal Code" value={formData.postalCode} onChange={handleChange} required error={errors.postalCode} />
                <Input name="landmark" label="Landmark" value={formData.landmark || ''} onChange={handleChange} />
                <Input name="latitude" type="number" label="Latitude" value={formData.latitude || ''} onChange={handleChange} />
                <Input name="longitude" type="number" label="Longitude" value={formData.longitude || ''} onChange={handleChange} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact & Manager Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="phone" label="Branch Phone" value={formData.phone} onChange={handleChange} required error={errors.phone} />
              <Input name="email" label="Branch Email" type="email" value={formData.email} onChange={handleChange} required error={errors.email} />
              <Input name="managerName" label="Manager Name" value={formData.managerName} onChange={handleChange} required error={errors.managerName} />
              <Input name="managerPhone" label="Manager Phone" value={formData.managerPhone} onChange={handleChange} required error={errors.managerPhone} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Operating Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="openingDate" type="date" label="Opening Date" value={formData.openingDate} onChange={handleChange} required error={errors.openingDate} />
              <div>
                <h3 className="text-sm font-medium text-neutral-700 mb-2">Working Hours</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input name="weekdays" placeholder="Weekdays" value={formData.workingHours.weekdays} onChange={handleWorkingHoursChange} />
                  <Input name="saturday" placeholder="Saturday" value={formData.workingHours.saturday} onChange={handleWorkingHoursChange} />
                  <Input name="sunday" placeholder="Sunday" value={formData.workingHours.sunday} onChange={handleWorkingHoursChange} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
            {errors.services && <p className="text-sm text-error-500 mb-2">{errors.services}</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {BRANCH_SERVICES.map(service => (
                <label key={service} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    id={service}
                    checked={formData.services.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                  />
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Types of Loan Offered</h2>
            <p className="text-sm text-neutral-600 mb-4">Select the loan types this branch offers</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {LOAN_TYPES.map(loanType => (
                <label key={loanType} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    id={loanType}
                    checked={formData.loanTypes.includes(loanType)}
                    onCheckedChange={() => handleLoanTypeToggle(loanType)}
                  />
                  <span className="text-sm">{loanType}</span>
                </label>
              ))}
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.push('/branches')}>Cancel</Button>
            <Button type="submit" loading={loading}><Save className="mr-2 h-4 w-4" /> Save Branch</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

