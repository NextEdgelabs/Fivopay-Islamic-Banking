"use client";

import { SessionProvider } from "next-auth/react";
import { BankingModeProvider } from "@/context/BankingModeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BankingModeProvider>
        {children}
      </BankingModeProvider>
    </SessionProvider>
  );
}
