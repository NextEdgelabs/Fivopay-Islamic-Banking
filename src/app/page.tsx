"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stripe-background">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-stripe-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-stripe-text-secondary">Redirecting to FivoPay Digital Banking...</p>
      </div>
    </div>
  );
}
