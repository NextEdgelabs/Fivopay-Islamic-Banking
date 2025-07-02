'use client';

import { AccountProvider } from './context/AccountContext';

export default function AccountManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountProvider>
      {children}
    </AccountProvider>
  );
} 