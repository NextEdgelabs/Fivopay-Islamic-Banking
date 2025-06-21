"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    // Simulate signup and redirect
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <form
        className="admin-card w-full max-w-md"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h1 className="admin-title text-center mb-6">Sign Up for Fivopay Admin</h1>
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
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <label className="admin-form-label" htmlFor="confirm">
          Confirm Password
        </label>
        <input
          className="admin-form-input"
          id="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        <button className="admin-btn w-full mt-2" type="submit">
          Sign Up
        </button>
        <div className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="admin-link">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
