# Component Quick Reference

## Import Statement
```typescript
import { Button, Input, Card, Table, useToast } from '@/components/ui';
```

## Common Usage Patterns

### Buttons
```tsx
// Primary action
<Button variant="primary">Save Changes</Button>

// With icon
<Button icon={<Plus />} variant="primary">Add New</Button>

// Loading state
<Button loading>Processing...</Button>

// Icon button
<IconButton icon={<Edit />} ariaLabel="Edit" variant="ghost" />
```

### Forms
```tsx
// Input with validation
<Input
  label="Email"
  type="email"
  required
  error={errors.email}
  leftIcon={<Mail />}
/>

// Select dropdown
<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
/>

// Checkbox
<Checkbox label="I agree to terms" />

// Toggle
<Toggle
  label="Enable notifications"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

### Layout
```tsx
// Card
<Card padding="lg" hover>
  <h3>Title</h3>
  <p>Content</p>
</Card>

// Modal
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <p>Are you sure?</p>
</Modal>
```

### Data Display
```tsx
// Badge
<Badge variant="success" dot>Active</Badge>

// Avatar
<Avatar size="md" fallback="John Doe" />

// Progress
<ProgressBar value={75} variant="primary" showLabel />

// Stats Card
<StatsCard
  title="Total Revenue"
  value="$45,231"
  icon={<DollarSign />}
  trend={{ value: 12.5, isPositive: true }}
/>

// Table
<Table
  data={users}
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <Badge>{value}</Badge>
    }
  ]}
  onRowClick={(row) => console.log(row)}
/>
```

### Feedback
```tsx
// Alert
<Alert
  variant="error"
  title="Error"
  message="Something went wrong"
  dismissible
/>

// Toast (using hook)
const { addToast } = useToast();

addToast({
  type: 'success',
  message: 'Changes saved!',
  duration: 3000
});

// Loading
<Loading size="lg" text="Loading data..." />

// Skeleton
<SkeletonCard lines={3} />
```

### Navigation
```tsx
// Tabs
<Tabs
  tabs={[
    { id: '1', label: 'Overview', content: <div>...</div> },
    { id: '2', label: 'Details', content: <div>...</div> }
  ]}
  defaultTab="1"
/>

// Breadcrumbs
<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Users', href: '/users' },
    { label: 'John Doe' }
  ]}
/>

// Pagination
<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>

// Stepper
<Stepper
  steps={[
    { id: '1', label: 'Details', description: 'Basic info' },
    { id: '2', label: 'Review', description: 'Confirm' }
  ]}
  currentStep={1}
/>
```

## Common Patterns

### Form with Validation
```tsx
function MyForm() {
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate
    // Submit
    addToast({ type: 'success', message: 'Form submitted!' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        required
        error={errors.email}
      />
      <Button type="submit" fullWidth>Submit</Button>
    </form>
  );
}
```

### Data Table with Actions
```tsx
const columns = [
  { key: 'name', header: 'Name', sortable: true },
  {
    key: 'actions',
    header: 'Actions',
    render: (_, row) => (
      <div className="flex gap-2">
        <IconButton
          icon={<Edit />}
          ariaLabel="Edit"
          onClick={() => handleEdit(row)}
        />
        <IconButton
          icon={<Trash />}
          ariaLabel="Delete"
          variant="danger"
          onClick={() => handleDelete(row)}
        />
      </div>
    )
  }
];
```

### Modal with Form
```tsx
function EditModal({ isOpen, onClose, item }) {
  const [formData, setFormData] = useState(item);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Item"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
    </Modal>
  );
}
```

### Stats Dashboard
```tsx
function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Users"
        value="1,234"
        icon={<Users />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Revenue"
        value="$45,231"
        icon={<DollarSign />}
        trend={{ value: 8, isPositive: true }}
      />
      {/* More stats... */}
    </div>
  );
}
```

## Utility Functions

### cn() - Combine Classes
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  condition && 'conditional-class',
  anotherCondition ? 'true-class' : 'false-class'
)} />
```

### Format Functions
```tsx
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils';

formatCurrency(1234.56)      // "$1,234.56"
formatDate(new Date())        // "October 11, 2025"
formatNumber(1234567)         // "1,234,567"
```

## Responsive Design

Use Tailwind's responsive prefixes:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
</div>
```

## Accessibility Tips

1. Always provide `ariaLabel` for IconButton
2. Use semantic HTML (button, input, etc.)
3. Include labels for all form inputs
4. Ensure proper color contrast
5. Test keyboard navigation
6. Add alt text for images

## Performance Tips

1. Use dynamic imports for heavy components
2. Memoize expensive computations
3. Use proper key props in lists
4. Lazy load images
5. Optimize table rendering for large datasets
