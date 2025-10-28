"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
}

interface ApiErrorResponse {
  status: number;
  message?: string;
  detail?: string;
}

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const validateField = (name: keyof RegisterFormData, value: string) => {
    const newErrors: Partial<RegisterFormData> = { ...errors };
    const regex = {
      username: /^[a-zA-Z0-9_]{3,20}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    };

    switch (name) {
      case "username":
        if (!value) newErrors.username = "Username is required";
        else if (!regex.username.test(value))
          newErrors.username =
            "Username must be 3–20 characters (letters, numbers, underscore)";
        else delete newErrors.username;
        break;

      case "email":
        if (!value) newErrors.email = "Email is required";
        else if (!regex.email.test(value))
          newErrors.email = "Invalid email address";
        else delete newErrors.email;
        break;

      case "password":
        if (!value) newErrors.password = "Password is required";
        else if (value.length < 6)
          newErrors.password = "Password must be at least 6 characters";
        else delete newErrors.password;
        break;

      case "confirmedPassword":
        if (!value) newErrors.confirmedPassword = "Please confirm password";
        else if (value !== formData.password)
          newErrors.confirmedPassword = "Passwords do not match";
        else delete newErrors.confirmedPassword;
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError(""); // clear api error when user types
    validateField(name as keyof RegisterFormData, value);
  };

  const validateForm = (): boolean => {
    Object.entries(formData).forEach(([key, value]) =>
      validateField(key as keyof RegisterFormData, value)
    );

    if (!agreeToTerms) {
      setApiError("You must agree to the Terms & Privacy Policy");
      return false;
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      // parse backend JSON safely
      const data: ApiErrorResponse = await response.json();

      if (!response.ok) {
        const message =
          data.detail ?? data.message ?? `Error ${response.status}`;

        // Set field-specific errors
        if (message.toLowerCase().includes("email"))
          setErrors((prev) => ({ ...prev, email: message }));
        else if (message.toLowerCase().includes("username"))
          setErrors((prev) => ({ ...prev, username: message }));
        else setApiError(message);

        return;
      }

      // Success
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) setApiError(error.message);
      else setApiError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Glassmorphism Card */}
      <div className="relative rounded-3xl shadow-2xl auth-card p-10 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-medium auth-title mb-1">
            Create your account
          </h2>
        </div>

        {apiError && (
          <div className="mb-6 p-3 bg-red-100/80 dark:bg-red-900/50 rounded-lg text-red-700 dark:text-red-300 text-sm backdrop-blur-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username or email */}
          <div>
            <label className="block auth-label mb-2">Username or email</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username or email"
              className={`w-full px-4 py-3 rounded-xl text-base auth-input transition-all duration-200 ${
                errors.username ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block auth-label mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className={`w-full px-4 py-3 rounded-xl text-base auth-input transition-all duration-200 ${
                errors.email ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block auth-label">Password</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 rounded-xl text-base auth-input transition-all duration-200 ${
                  errors.password ? "ring-2 ring-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 auth-icon hover:opacity-70 transition-opacity"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block auth-label mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmedPassword ? "text" : "password"}
                name="confirmedPassword"
                value={formData.confirmedPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className={`w-full px-4 py-3 pr-12 rounded-xl text-base auth-input transition-all duration-200 ${
                  errors.confirmedPassword ? "ring-2 ring-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 auth-icon hover:opacity-70 transition-opacity"
              >
                {showConfirmedPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {errors.confirmedPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmedPassword}
              </p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-4 h-4 text-blue-600 auth-checkbox rounded cursor-pointer"
            />
            <label
              htmlFor="agreeToTerms"
              className="text-sm auth-text cursor-pointer select-none"
            >
              I agree to the{" "}
              <a href="#" className="auth-link">
                Terms & Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !agreeToTerms}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3.5 rounded-xl transition-all duration-300 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <p className="auth-text text-sm">
            Already have an account?{" "}
            <Link href="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
