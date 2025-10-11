'use client';

import { ReactNode } from 'react';
import { CustomerProvider } from './context/CustomerContext';

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <CustomerProvider>
      {children}
    </CustomerProvider>
  );
}
