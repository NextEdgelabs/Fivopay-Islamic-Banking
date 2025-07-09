/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon, LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Demo credentials for different roles
  const demoCredentials = {
    admin: { email: "admin@fivopay.com", password: "admin123", role: "admin" },
    branchManager: { email: "manager@fivopay.com", password: "manager123", role: "branch_manager" },
    branchCashier: { email: "cashier@fivopay.com", password: "cashier123", role: "branch_cashier" }
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    
    // Check credentials for all roles
    const adminCreds = demoCredentials.admin;
    const managerCreds = demoCredentials.branchManager;
    const cashierCreds = demoCredentials.branchCashier;
    
    let userRole = null;
    
    if (email === adminCreds.email && password === adminCreds.password) {
      userRole = adminCreds.role;
    } else if (email === managerCreds.email && password === managerCreds.password) {
      userRole = managerCreds.role;
    } else if (email === cashierCreds.email && password === cashierCreds.password) {
      userRole = cashierCreds.role;
    }
    
    if (userRole) {
      // Store user role and email in localStorage
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userEmail', email);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      setTimeout(() => {
        setLoading(false);
        setError("Invalid credentials. Please check the demo credentials below.");
      }, 1000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            FivoPay Islamic Banking
          </h1>
          <p className="text-slate-600">
            Sharia-compliant Banking as a Service
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-slate-200">
          <form onSubmit={handleSubmit} autoComplete="off">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
              Secure Login
            </h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-slate-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="text-gray-700 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">Bank-Grade Security</p>
              <p className="text-xs text-blue-600">
                Your data is protected with 256-bit encryption and Sharia-compliant standards
              </p>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-medium text-yellow-800 mb-2">Demo Credentials:</p>
          
          <div className="space-y-2">
            <div className="bg-white p-2 rounded border">
              <p className="text-xs font-medium text-yellow-700">👑 Admin</p>
              <p className="text-xs text-yellow-600">Email: admin@fivopay.com</p>
              <p className="text-xs text-yellow-600">Password: admin123</p>
            </div>
            
            <div className="bg-white p-2 rounded border">
              <p className="text-xs font-medium text-yellow-700">🏢 Branch Manager</p>
              <p className="text-xs text-yellow-600">Email: manager@fivopay.com</p>
              <p className="text-xs text-yellow-600">Password: manager123</p>
            </div>
            
            <div className="bg-white p-2 rounded border">
              <p className="text-xs font-medium text-yellow-700">💰 Branch Cashier</p>
              <p className="text-xs text-yellow-600">Email: cashier@fivopay.com</p>
              <p className="text-xs text-yellow-600">Password: cashier123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
