"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
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
    <div className="w-full max-w-md mx-auto transition-colors duration-300">
      <div className="rounded-xl shadow-md p-8 bg-card transition-colors duration-300">
        <h2 className="text-2xl font-bold text-center dark:text-white mb-6">
          Welcome to DocuHub
        </h2>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-400 text-red-700 rounded text-sm dark:bg-red-900/40 dark:border-red-700 dark:text-red-300 transition-colors duration-300">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={`w-full pl-10 pr-3 py-2 rounded-md text-sm bg-gray-50 text-gray-700 dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.username
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                }`}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-3 py-2 rounded-md text-gray-700 text-sm bg-gray-50 dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className={`w-full pl-10 pr-10 py-2 text-gray-700 rounded-md text-sm bg-gray-50 dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showConfirmedPassword ? "text" : "password"}
                name="confirmedPassword"
                value={formData.confirmedPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className={`w-full pl-10 pr-10 py-2 rounded-md text-sm bg-gray-50 dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  errors.confirmedPassword
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmedPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
            {errors.confirmedPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmedPassword}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
            />
            <label
              htmlFor="agreeToTerms"
              className="ml-2 text-sm text-gray-400 dark:text-gray-300"
            >
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms & Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !agreeToTerms}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
