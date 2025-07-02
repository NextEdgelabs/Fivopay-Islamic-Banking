import { CashProvider } from './context/CashContext';

export default function CashManagementLayout({ children }: { children: React.ReactNode }) {
  return <CashProvider>{children}</CashProvider>;
} 