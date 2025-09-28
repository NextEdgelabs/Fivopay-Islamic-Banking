"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon, UserPlusIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    position: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departments = [
    "Regulatory Compliance",
    "Customer Service", 
    "Information Technology",
    "Operations",
    "Risk Management",
    "Finance",
    "Marketing",
    "Human Resources"
  ];

  function validatePassword(password: string): string[] {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("One special character");
    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.password || !formData.confirmPassword || !formData.department || 
        !formData.position) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(`Password must have: ${passwordErrors.join(", ")}`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push("/login?message=account-created");
    }, 2000);
  }

  const passwordErrors = validatePassword(formData.password);
  const isPasswordValid = formData.password && passwordErrors.length === 0;

  return (
    <div className="min-h-screen bg-stripe-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stripe-primary rounded-full mb-4">
            <UserPlusIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stripe-text mb-2">
            Join FivoPay Digital Banking
          </h1>
          <p className="text-stripe-text-secondary">
            Create your employee account for the compliant banking platform
          </p>
        </div>

        {/* Signup Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-stripe-text mb-6 text-center">
              Employee Registration
            </h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-stripe-text mb-1">
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="form-input"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-stripe-text mb-1">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="form-input"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stripe-text mb-1">
                Work Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="form-input"
                placeholder="Enter work email address"
                required
              />
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">
                  Department *
                </label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-1">
                  Position *
                </label>
                <input
                  id="position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior Analyst"
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create password"
                    required
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 text-xs">
                      {passwordErrors.map((error, index) => (
                        <span key={index} className="text-red-600">
                          • {error}
                        </span>
                      ))}
                      {isPasswordValid && (
                        <span className="text-green-600 flex items-center">
                          <ShieldCheckIcon className="h-4 w-4 mr-1" />
                          Strong password
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="text-gray-700 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-slate-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>
                
                {formData.confirmPassword && (
                  <div className="mt-2">
                    {formData.password === formData.confirmPassword ? (
                      <span className="text-green-600 text-xs flex items-center">
                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                        Passwords match
                      </span>
                    ) : (
                      <span className="text-red-600 text-xs">
                        Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-slate-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
                    Privacy Policy
                  </Link>{" "}
                  of FivoPay Digital Banking
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.agreeToTerms}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Creating Account...
                </>
              ) : (
                "Create Employee Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">Secure Registration</p>
              <p className="text-xs text-blue-600">
                All employee accounts require administrator approval and undergo regulatory compliance verification
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
