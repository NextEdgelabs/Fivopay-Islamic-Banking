'use client';

import { DepositProvider } from './context/DepositContext';

export default function DepositManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DepositProvider>
      {children}
    </DepositProvider>
  );
} 