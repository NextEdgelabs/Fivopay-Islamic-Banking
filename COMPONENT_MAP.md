# Component Architecture Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     FIVOPAY BANKING                             │
│                  Component Library v1.0                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        DESIGN SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│  Colors:     Primary | Success | Warning | Error | Neutral     │
│  Typography: Inter (8 sizes, 6 weights)                        │
│  Spacing:    4px base unit (1-16 scale)                        │
│  Shadows:    Stripe-style (7 levels)                           │
│  Animation:  Fade, Slide, Scale transitions                    │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────┬─────────────────────────────────────────┐
│   ACTION COMPONENTS   │           DESCRIPTION                   │
├───────────────────────┼─────────────────────────────────────────┤
│ Button                │ 5 variants, 3 sizes, loading, icons    │
│ IconButton            │ Icon-only, 4 variants, accessible      │
└───────────────────────┴─────────────────────────────────────────┘

┌───────────────────────┬─────────────────────────────────────────┐
│   FORM COMPONENTS     │           DESCRIPTION                   │
├───────────────────────┼─────────────────────────────────────────┤
│ Input                 │ Text, email, password + icons, errors   │
│ Textarea              │ Multi-line input with validation        │
│ Select                │ Dropdown with custom styling            │
│ Checkbox              │ Single/multiple selection               │
│ Radio                 │ Radio groups with helpers               │
│ Toggle                │ Switch for boolean values               │
└───────────────────────┴─────────────────────────────────────────┘

┌───────────────────────┬─────────────────────────────────────────┐
│  LAYOUT COMPONENTS    │           DESCRIPTION                   │
├───────────────────────┼─────────────────────────────────────────┤
│ Card                  │ Content containers, hover effects       │
│ Modal                 │ Overlay dialogs, 5 sizes                │
│ Drawer                │ Side panels (left/right)                │
└───────────────────────┴─────────────────────────────────────────┘

┌───────────────────────┬─────────────────────────────────────────┐
│ DATA DISPLAY          │           DESCRIPTION                   │
├───────────────────────┼─────────────────────────────────────────┤
│ Badge                 │ Status indicators, 5 variants           │
│ Avatar                │ User avatars with fallback              │
│ ProgressBar           │ Progress indicators, 4 variants         │
│ StatsCard             │ Metric cards with trends                │
│ EmptyState            │ Empty data placeholder                  │
│ Table                 │ Sortable data tables                    │
└───────────────────────┴─────────────────────────────────────────┘

┌───────────────────────┬─────────────────────────────────────────┐
│ FEEDBACK COMPONENTS   │           DESCRIPTION                   │
├───────────────────────┼─────────────────────────────────────────┤
│ Alert                 │ Inline alerts, 4 variants               │
│ Loading               │ Spinners, 3 sizes, full-screen         │
│ Skeleton              │ Loading placeholders                    │
│ Toast                 │ Notifications with auto-dismiss         │
└───────────────────────┴─────────────────────────────────────────┘

┌───────────────────────┬─────────────────────────────────────────┐
│ NAVIGATION            │           DESCRIPTION                   │
├───────────────────────┼─────────────────────────────────────────┤
│ Tabs                  │ Content organization, 2 variants        │
│ Breadcrumbs           │ Navigation trail                        │
│ Pagination            │ Page navigation with ellipsis           │
│ Stepper               │ Multi-step indicators                   │
└───────────────────────┴─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENT FLOW                             │
└─────────────────────────────────────────────────────────────────┘

USER ACTION
    ↓
┌─────────────┐
│   Button    │ ──→ onClick handler
└─────────────┘
    ↓
┌─────────────┐
│   Modal     │ ──→ Shows overlay
└─────────────┘
    ↓
┌─────────────┐
│   Form      │ ──→ Input, Select, Checkbox
└─────────────┘
    ↓
┌─────────────┐
│  Loading    │ ──→ Shows spinner
└─────────────┘
    ↓
┌─────────────┐
│   Toast     │ ──→ Success notification
└─────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DATA VISUALIZATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

API REQUEST
    ↓
┌─────────────┐
│  Loading    │ ──→ Show skeleton
└─────────────┘
    ↓
┌─────────────┐
│   Table     │ ──→ Display data
└─────────────┘
    │
    ├──→ ┌─────────────┐
    │    │   Badge     │ ──→ Status column
    │    └─────────────┘
    │
    ├──→ ┌─────────────┐
    │    │  Actions    │ ──→ IconButton
    │    └─────────────┘
    │
    └──→ ┌─────────────┐
         │ Pagination  │ ──→ Page controls
         └─────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      IMPORT STRUCTURE                           │
└─────────────────────────────────────────────────────────────────┘

components/ui/
├── index.ts ──────────────┐ (Barrel export)
│                          │
├── Button.tsx ────────────┼──→ Export Button
├── Input.tsx ─────────────┼──→ Export Input
├── Card.tsx ──────────────┼──→ Export Card
├── Table.tsx ─────────────┼──→ Export Table
├── Toast.tsx ─────────────┼──→ Export ToastProvider, useToast
└── ...                    │
                           │
                           ↓
        Import in your page/component:
        
        import { 
          Button, 
          Input, 
          Card, 
          Table,
          useToast 
        } from '@/components/ui';

┌─────────────────────────────────────────────────────────────────┐
│                    THEME ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────┘

tailwind.config.ts
    ↓
┌─────────────────────┐
│  Theme Extension    │
├─────────────────────┤
│ • colors            │ ──→ Primary, Success, Warning, Error
│ • fontFamily        │ ──→ Inter, Roboto Mono
│ • fontSize          │ ──→ xs to 5xl (8 sizes)
│ • spacing           │ ──→ 1 to 128 (4px base)
│ • boxShadow         │ ──→ Stripe shadows
│ • borderRadius      │ ──→ stripe, stripe-lg
│ • animation         │ ──→ fade-in, slide-in, slide-up
└─────────────────────┘
    ↓
globals.css
    ↓
┌─────────────────────┐
│  Global Styles      │
├─────────────────────┤
│ @layer base         │ ──→ CSS reset, body styles
│ @layer components   │ ──→ Reusable classes
│ @layer utilities    │ ──→ Custom utilities
└─────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   STATE MANAGEMENT                              │
└─────────────────────────────────────────────────────────────────┘

┌────────────────┐
│  ToastProvider │ ──→ Context for global toasts
└────────────────┘
        ↓
    useToast() hook
        ↓
    addToast({ type, message })

┌────────────────┐
│  useState      │ ──→ Local component state
└────────────────┘
        ↓
    Modal open/close
    Drawer open/close
    Form values
    Table sorting

┌─────────────────────────────────────────────────────────────────┐
│                   ACCESSIBILITY FEATURES                        │
└─────────────────────────────────────────────────────────────────┘

✓ Keyboard Navigation
  • Tab through all interactive elements
  • Enter/Space to activate buttons
  • Escape to close modals/drawers
  • Arrow keys in tabs/pagination

✓ Screen Reader Support
  • ARIA labels on IconButton
  • role="alert" on Alert component
  • role="progressbar" on ProgressBar
  • Semantic HTML throughout

✓ Visual Accessibility
  • 4.5:1 color contrast ratio
  • Focus indicators (2px ring)
  • Clear error messages
  • Loading states announced

┌─────────────────────────────────────────────────────────────────┐
│                   RESPONSIVE BREAKPOINTS                        │
└─────────────────────────────────────────────────────────────────┘

Mobile      Tablet      Desktop     Large       XLarge
< 640px     768px       1024px      1280px      1536px
   │          │           │           │           │
   sm:        md:         lg:         xl:         2xl:
   │          │           │           │           │
   └──────────┴───────────┴───────────┴───────────┘
         Tailwind Responsive Prefixes

┌─────────────────────────────────────────────────────────────────┐
│                      FILE STRUCTURE                             │
└─────────────────────────────────────────────────────────────────┘

Fivopay_banking_web/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout + ToastProvider
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   └── components-showcase/
│       └── page.tsx              # Component library showcase
│
├── components/
│   └── ui/                       # All UI components
│       ├── index.ts              # Barrel export
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Table.tsx
│       ├── Toast.tsx
│       └── ... (20+ more)
│
├── lib/
│   └── utils.ts                  # Utility functions
│
├── types/
│   └── components.ts             # TypeScript types
│
├── DESIGN_GUIDELINES.md          # Design system docs
├── PROJECT_SUMMARY.md            # Project overview
├── COMPONENT_GUIDE.md            # Usage guide
├── COMPLETION_CHECKLIST.md       # Feature checklist
├── README.md                     # Getting started
│
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── next.config.mjs               # Next.js config
└── package.json                  # Dependencies

┌─────────────────────────────────────────────────────────────────┐
│                    USAGE EXAMPLE                                │
└─────────────────────────────────────────────────────────────────┘

// Import components
import { Button, Input, Card, useToast } from '@/components/ui';

// Use in component
function MyPage() {
  const { addToast } = useToast();
  
  const handleSubmit = () => {
    // Show success toast
    addToast({
      type: 'success',
      message: 'Form submitted!'
    });
  };
  
  return (
    <Card>
      <Input label="Email" type="email" />
      <Button onClick={handleSubmit}>Submit</Button>
    </Card>
  );
}

┌─────────────────────────────────────────────────────────────────┐
│                    NEXT STEPS                                   │
└─────────────────────────────────────────────────────────────────┘

1. ✅ Component Library (COMPLETE)
2. ⏳ Login Module
3. ⏳ Dashboard
4. ⏳ Customer Module
5. ⏳ Branch Module
6. ⏳ Loan Module
7. ⏳ Term Deposit
8. ⏳ Product Management
9. ⏳ Settings

┌─────────────────────────────────────────────────────────────────┐
│              COMPONENT LIBRARY STATUS                           │
│                                                                 │
│                    ✅ COMPLETE                                  │
│                 READY FOR MODULE DEV                            │
└─────────────────────────────────────────────────────────────────┘
```
