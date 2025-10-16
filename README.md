# FivoPay Banking - Islamic Banking Management System

A modern, full-featured Islamic banking management system built with Next.js 14, TypeScript, and Tailwind CSS, featuring a Stripe-inspired design system.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Stripe-Inspired Design**: Professional, clean UI following Stripe's design principles
- **Comprehensive Component Library**: 30+ reusable, accessible components
- **Fully Typed**: Complete TypeScript support for type safety
- **Responsive Design**: Mobile-first approach with smooth animations
- **Accessible**: WCAG compliant components with keyboard navigation

## 📦 Component Library

### Action Components
- **Button**: Primary, secondary, danger, ghost, and outline variants with loading states
- **IconButton**: Compact icon-only buttons for toolbars and actions

### Form Components
- **Input**: Text inputs with icons, labels, errors, and helper text
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection with custom styling
- **Checkbox**: Checkboxes with labels and helper text
- **Radio**: Radio buttons for single selections
- **Toggle**: Switch toggle for boolean options

### Layout Components
- **Card**: Content containers with hover effects and customizable padding
- **Modal**: Overlay dialogs with customizable sizes
- **Drawer**: Slide-in panels from left or right

### Data Display Components
- **Badge**: Status indicators in multiple variants
- **Avatar**: User avatars with fallback initials
- **ProgressBar**: Visual progress indicators
- **StatsCard**: Statistics display with trends
- **EmptyState**: Placeholder for empty data states
- **Table**: Sortable data tables with custom rendering

### Feedback Components
- **Alert**: Contextual alerts (success, error, warning, info)
- **Loading**: Loading spinners with optional text
- **Skeleton**: Loading placeholders for content
- **Toast**: Temporary notifications with auto-dismiss

### Navigation Components
- **Tabs**: Organize content in tabs (default and pills variants)
- **Breadcrumbs**: Navigation breadcrumb trails
- **Pagination**: Page navigation with ellipsis
- **Stepper**: Multi-step process indicators (horizontal/vertical)

## 🎨 Design System

### Colors
- **Primary**: `#635BFF` (Stripe Purple/Blue)
- **Success**: `#00D924` (Green)
- **Warning**: `#FFA500` (Orange)
- **Error**: `#DF1B41` (Red)
- **Neutral**: Grayscale from `#F6F9FC` to `#0A2540`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Sizes**: 12px to 48px with consistent line heights
- **Font Weights**: 300 to 800

### Spacing
- Based on 4px units (1, 2, 3, 4, 6, 8, 12, 16)

### Shadows
- Multiple elevation levels from subtle to prominent
- Special Stripe-style shadows for cards

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### View Components

Navigate to `/components-showcase` to see all available components with live examples.

## 📁 Project Structure

```
├── app/
│   ├── components-showcase/    # Component showcase page
│   ├── layout.tsx              # Root layout with ToastProvider
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   └── ui/                     # All UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── ... (30+ components)
├── lib/
│   └── utils.ts                # Utility functions
├── types/
│   └── components.ts           # TypeScript type definitions
├── DESIGN_GUIDELINES.md        # Complete design system documentation
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

## 🎯 Planned Modules

1. **Login Module** - Authentication & authorization
2. **Dashboard** - Overview with stats and analytics
3. **Customer Module** - Customer management
4. **Branch Module** - Branch operations
5. **Loan Module** - Loan processing and tracking
6. **Term Deposit Module**
   - Fixed Deposit
   - Recurring Deposit
7. **Product Management**
   - Loan Products
   - Term Deposit Products
8. **Settings Module**
   - Organization settings
   - Organization Type (Ethical/Conventional Banking)

## 📖 Documentation

- **Design Guidelines**: See [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md) for comprehensive design system documentation
- **Component Showcase**: Visit `/components-showcase` for live component examples

## 🤝 Contributing

This is a private project for FivoPay Banking. For questions or contributions, please contact the development team.

## 📝 License

Proprietary - All rights reserved by FivoPay Banking

## 🔗 Links

- **Repository**: [NextEdgelabs/Fivopay-Islamic-Banking](https://github.com/NextEdgelabs/Fivopay-Islamic-Banking)
- **Documentation**: See DESIGN_GUIDELINES.md
- **Component Showcase**: `/components-showcase`

---

Built with ❤️ by the FivoPay Banking Team
