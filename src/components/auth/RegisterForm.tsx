"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import Link from "next/link";

interface RegisterFormData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmedPassword: string;
}

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmedPassword: "",
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Real-time validation
  const validateField = (name: keyof RegisterFormData, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "username":
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!value) {
          newErrors.username = "Username is required";
        } else if (!usernameRegex.test(value)) {
          newErrors.username =
            "Username must be 3-20 characters (letters, numbers, underscore only)";
        } else {
          delete newErrors.username;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "firstname":
        if (!value) {
          newErrors.firstname = "First name is required";
        } else if (value.length < 2) {
          newErrors.firstname = "First name must be at least 2 characters";
        } else {
          delete newErrors.firstname;
        }
        break;

      case "lastname":
        if (!value) {
          newErrors.lastname = "Last name is required";
        } else if (value.length < 2) {
          newErrors.lastname = "Last name must be at least 2 characters";
        } else {
          delete newErrors.lastname;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        } else {
          delete newErrors.password;
        }
        break;

      case "confirmedPassword":
        if (!value) {
          newErrors.confirmedPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          newErrors.confirmedPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmedPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear API error when user starts typing
    if (apiError) {
      setApiError("");
    }

    // Validate field on change
    validateField(name as keyof RegisterFormData, value);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof RegisterFormData;
      validateField(fieldName, formData[fieldName]);
    });

    // Check terms agreement
    if (!agreeToTerms) {
      setApiError("You must agree to the Terms & Privacy Policy");
      return false;
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          firstname: formData.firstname,
          lastname: formData.lastname,
          password: formData.password,
          confirmedPassword: formData.confirmedPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Registration successful
      console.log("✅ Registration successful:", data);

      // Auto-login the user
      if (data.token && data.user) {
        login(data.token, data.user);
      }

      // Call success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      setApiError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join us today and get started
          </p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm dark:bg-red-900 dark:border-red-600 dark:text-red-200">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username - First field as requested */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors ${
                  errors.username
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1 dark:text-red-400">
                {errors.username}
              </p>
            )}
          </div>

          {/* Email - Second field as requested */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors ${
                  errors.email
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* First Name - Third field as requested */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors ${
                  errors.firstname
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your first name"
              />
            </div>
            {errors.firstname && (
              <p className="text-red-500 text-xs mt-1 dark:text-red-400">
                {errors.firstname}
              </p>
            )}
          </div>

          {/* Last Name - Fourth field as requested */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors ${
                  errors.lastname
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your last name"
              />
            </div>
            {errors.lastname && (
              <p className="text-red-500 text-xs mt-1 dark:text-red-400">
                {errors.lastname}
              </p>
            )}
          </div>

          {/* Password - Fifth field as requested */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors ${
                  errors.password
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 dark:text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password - Sixth field as requested */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showConfirmedPassword ? "text" : "password"}
                name="confirmedPassword"
                value={formData.confirmedPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors ${
                  errors.confirmedPassword
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmedPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmedPassword && (
              <p className="text-red-500 text-xs mt-1 dark:text-red-400">
                {errors.confirmedPassword}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="agreeToTerms"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              I agree to the{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Terms & Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading || Object.keys(errors).length > 0 || !agreeToTerms
            }
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center dark:bg-blue-700 dark:hover:bg-blue-600 dark:disabled:bg-gray-600"
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

        {/* Switch to Login */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
