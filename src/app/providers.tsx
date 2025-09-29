"use client";

import { SessionProvider } from "next-auth/react";
import { BankingModeProvider } from "@/context/BankingModeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      basePath="/api/auth"
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
    >
      <BankingModeProvider>
        {children}
      </BankingModeProvider>
    </SessionProvider>
  );
}
