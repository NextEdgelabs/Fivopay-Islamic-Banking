# FivoPay Islamic Banking Platform - AI Coding Instructions

## Architecture Overview

**Banking-as-a-Service (BaaS) Platform**: Next.js 15 + React 19 + TypeScript with dual-mode Islamic/Conventional banking support.

### Core Design Philosophy
- **Dual Banking Mode**: Every feature toggles between `ethical` (Islamic/Sharia-compliant) and `conventional` banking via `BankingModeContext`
- **Module-Scoped Contexts**: Each dashboard module (`customers/`, `field-agents/`, `deposit-management/`, etc.) has its own Context Provider in `context/` subfolder
- **Provider Hierarchy**: `AuthProvider` → `BankingModeProvider` → `ProductProvider` at app root (`src/app/providers.tsx`), then module-specific providers wrap layouts
- **Mock-First Development**: All services use mock data via `api-client.ts` with structured `CustomerService`, `ProductService` classes

## Critical Context Pattern

### Global Context (src/context/)
```typescript
// Three root contexts - ALWAYS imported from src/context/
import { useAuth } from '@/context/AuthContext';           // Session, user, logout
import { useBankingMode } from '@/context/BankingModeContext';  // ethical/conventional toggle
import { useProductContext } from '@/context/ProductContext';    // Product CRUD & templates
```

### Module-Scoped Context
Each dashboard module has its own provider:
```typescript
// Dashboard layout wraps children with SettingsProvider + CustomerProvider
// /dashboard/customers/layout.tsx
import { CustomerProvider } from './context/CustomerContext';

// /dashboard/field-agents/layout.tsx
import { FieldAgentProvider } from './context/FieldAgentContext';

// /dashboard/cash-management/layout.tsx
import { CashProvider } from './context/CashContext';
```

**Rule**: When working in `/dashboard/[module]/`, check for `context/[Module]Context.tsx` and use its hook (e.g., `useCustomers()`, `useFieldAgentContext()`).

## Service Layer Architecture

### API Client Structure
- **Two API files exist**: 
  - `api.ts` (root) - API endpoint definitions only
  - `src/services/api-client.ts` - Mock data implementation + API_ENDPOINTS constant
- **Service Classes**: `services/customer.service.ts`, `src/services/product.service.ts`
  - Pattern: `static async getX(params): Promise<ApiResponse<T>>`
  - All use `apiClient.get/post/put/delete` from `api-client.ts`
  - Error handling via `utils/logger.ts` with `logger.apiError()`

### Mock Data Pattern
Mock data lives in `src/services/api-client.ts` as constants (e.g., `mockCustomers[]`). Services simulate API delays with `setTimeout`. To add mock data:
1. Define data structure following Indian banking standards (Aadhaar, PAN, etc.)
2. Return via `apiClient` methods which wrap data in `ApiResponse<T>` format
3. Use `CustomerService.method()` pattern - never call `apiClient` directly from components

## Type System

### Type Locations
- `src/types/customer.ts` - 650+ lines with enums (CustomerType, KYCStatus, DocumentType) + interfaces
- `src/types/banking-mode.ts` - BankingMode type + BANKING_MODES config
- `src/types/products.ts` - Product categories (deposits, loans, investments)
- `src/types/api.ts` - ApiResponse, ApiError wrappers

**Pattern**: Enums are ALL_CAPS (e.g., `CustomerType.INDIVIDUAL`), used throughout forms and filters.

## UI & Styling

### Theme System
Dual light/dark mode defined in `theme.md`:
- Dark: `#0A0F2C` (bg), `#5D6DFF` (accent blue), `#E14EFF` (accent purple)
- Light: `#F4F6FA` (bg), `#375DFB` (accent blue)
- Poppins font, 8px button radius, 16px card radius
- Icons via `@heroicons/react/24/outline`

### Component Patterns
- All pages use `"use client"` directive (Next.js 15 App Router)
- Form handling: `react-hook-form` + `zod` + `@hookform/resolvers`
- Shared components in `src/components/` - use existing before creating new ones
- Dashboard components in `src/app/dashboard/components/` (Header, Sidebar, Table)

## Routing & Navigation

### App Router Structure
```
/login → /dashboard (middleware.ts redirects unauthenticated users)
/dashboard/customers → CustomerProvider wraps all customer routes
/dashboard/customers/[customerId] → Dynamic customer detail pages
/dashboard/field-agents → FieldAgentProvider, etc.
```

### Middleware
`middleware.ts` checks `fivopay-session` cookie:
- Public paths: `/`, `/login`, `/signup`
- Protected: `/dashboard/*` - redirects to `/login?redirect=...`
- Authenticated users redirected away from login/signup

## Development Workflow

### Commands
```bash
npm run dev    # Starts dev server on localhost:3000
npm run build  # Next.js production build
npm run lint   # ESLint check
```

### Adding New Modules
1. Create `/dashboard/[module]/layout.tsx` with `[Module]Provider`
2. Define types in `src/types/[module].ts` with enums + interfaces
3. Create service class in `services/[module].service.ts` or `src/services/`
4. Add mock data to `src/services/api-client.ts`
5. Create context in `/dashboard/[module]/context/[Module]Context.tsx`
6. Update dashboard sidebar navigation in `src/app/dashboard/layout.tsx` (line 31-180)

### Existing Module Reference Files
- Customer module: `CUSTOMER_MODULE_GUIDE.md` (469 lines)
- General architecture: `instructions.md` (333 lines)
- Theme guide: `theme.md` (158 lines)

## Banking Mode Integration

### When Creating Features
Always check `currentMode` and render accordingly:
```typescript
const { currentMode, config } = useBankingMode();
const isEthical = currentMode === 'ethical';

// Show "Profit" for ethical, "Interest" for conventional
const label = isEthical ? 'Profit Rate' : 'Interest Rate';
```

### Product Configuration
Products filter by banking mode via `ProductContext`:
- Templates in `src/types/products.ts` (DEFAULT_PRODUCT_TEMPLATES)
- Each product has `bankingMode: 'ethical' | 'conventional' | 'both'`
- Use `getAvailableProducts()` to filter by current mode
- Product categories: `deposits`, `loans`, `investments`, `insurance`, `cards`

## Common Patterns

### Data Fetching in Pages
```typescript
const { customers, loading, error, fetchCustomers } = useCustomers();

useEffect(() => {
  fetchCustomers();
}, []);
```

### Form Submission
```typescript
const { createCustomer, loading } = useCustomers();
const onSubmit = async (data: CreateCustomerRequest) => {
  try {
    await createCustomer(data);
    router.push('/dashboard/customers');
  } catch (error) {
    // Error handled in context
  }
};
```

### Error Handling
Logger utility (`utils/logger.ts`) with levels: `debug`, `info`, `warn`, `error`. Used throughout service layer but check `NODE_ENV` and `NEXT_PUBLIC_LOG_LEVEL`.

## Key Files Reference
- Module navigation: `src/app/dashboard/layout.tsx` (537 lines)
- Auth flow: `src/context/AuthContext.tsx`, `middleware.ts`
- Customer operations: `services/customer.service.ts` (401 lines)
- Mock API: `src/services/api-client.ts` (555 lines)
- Type definitions: `src/types/customer.ts` (673 lines)

## What NOT to Do
- Don't call `apiClient` directly - use service classes
- Don't create global state for module-specific data - use module contexts
- Don't mix root API endpoints (`api.ts`) with service implementations
- Don't bypass `BankingModeContext` when adding banking features
- Don't add providers to individual pages - only layouts
