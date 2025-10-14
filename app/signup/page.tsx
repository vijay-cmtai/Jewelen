"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, Users, Package } from "lucide-react";

type UserType = "user" | "supplier" | "admin";

export default function RegisterPage() {
  const [selectedType, setSelectedType] = useState<UserType>("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const userTypes: {
    type: UserType;
    label: string;
    description: string;
    icon: React.ElementType;
  }[] = [
    {
      type: "user",
      label: "Customer",
      description: "Shop for jewelry and accessories",
      icon: Users,
    },
    {
      type: "supplier",
      label: "Supplier",
      description: "Sell your products on Jewelen",
      icon: Package,
    },
    {
      type: "admin",
      label: "Admin",
      description: "Manage platform and operations",
      icon: ShieldAlert,
    },
  ];

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push("Full name is required");
    }

    if (!formData.email.trim()) {
      newErrors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push("Please enter a valid email");
    }

    if (!formData.password) {
      newErrors.push("Password is required");
    } else if (formData.password.length < 6) {
      newErrors.push("Password must be at least 6 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log({
      userType: selectedType,
      ...formData,
    });

    // In a real application, send this data to your backend
    alert(`${selectedType.toUpperCase()} registration successful!`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join Jewelen
          </h1>
          <p className="text-lg text-gray-600">
            Select your account type to get started
          </p>
        </div>

        {/* User Type Selection */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {userTypes.map(({ type, label, description, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-lg border-2 p-6 text-left transition-all ${
                selectedType === type
                  ? "border-orange-500 bg-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-orange-300"
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <Icon
                  className={`h-6 w-6 ${selectedType === type ? "text-orange-500" : "text-gray-400"}`}
                />
                <h3 className="font-semibold text-gray-900">{label}</h3>
              </div>
              <p className="text-sm text-gray-600">{description}</p>
              {selectedType === type && (
                <div className="mt-3 text-sm font-medium text-orange-600">
                  ✓ Selected
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Registration Form */}
        <div className="mx-auto max-w-md">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-lg bg-white p-8 shadow-lg"
          >
            <div>
              <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
                Register as{" "}
                {userTypes.find((u) => u.type === selectedType)?.label}
              </h2>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="rounded-lg bg-red-50 p-4">
                <ul className="space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx} className="text-sm text-red-700">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Form Inputs */}
            <div className="space-y-4">
              <div>
                <Input
                  name="name"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>
              <div>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>
              <div>
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>
              <div>
                <Input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              Create Account
            </Button>

            {/* Already have account */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
