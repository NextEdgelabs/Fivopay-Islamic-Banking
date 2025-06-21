"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Demo: Accept any non-empty credentials
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setError("");
    // Simulate login and redirect
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <form
        className="admin-card w-full max-w-md"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h1 className="admin-title text-center mb-6">Fivopay Admin Login</h1>
        {error && <div className="admin-form-error">{error}</div>}
        <label className="admin-form-label" htmlFor="email">
          Email
        </label>
        <input
          className="admin-form-input"
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label className="admin-form-label" htmlFor="password">
          Password
        </label>
        <input
          className="admin-form-input"
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="admin-btn w-full mt-2" type="submit">
          Login
        </button>
        <div className="text-center mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="admin-link">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
