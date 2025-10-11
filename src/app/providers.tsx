"use client";

import { BankingModeProvider } from "@/context/BankingModeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BankingModeProvider>
        <ProductProvider>
          {children}
        </ProductProvider>
      </BankingModeProvider>
    </AuthProvider>
  );
}
