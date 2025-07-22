'use client';

import { FieldAgentProvider } from './context/FieldAgentContext';

export default function FieldAgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FieldAgentProvider>
      {children}
    </FieldAgentProvider>
  );
} 