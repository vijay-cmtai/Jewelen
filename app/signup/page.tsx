"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// CHANGE 1: Admin ke liye ShieldAlert icon import karein
import { Users, Package, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  registerUser,
  resetActionStatus,
} from "@/lib/features/users/userSlice";
import type { AppDispatch, RootState } from "@/lib/store";

// CHANGE 2: UserRole mein 'Admin' ko add karein
type UserRole = "Buyer" | "Supplier" | "Admin";

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("Buyer");
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    businessType: "",
    companyCountry: "",
    companyWebsite: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { actionStatus, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
    if (actionStatus === "succeeded") {
      // CHANGE 3: Role ke hisaab se alag success message dikhayein
      const successMessage =
        selectedRole === "Admin"
          ? "Admin account created successfully!"
          : "Registration request submitted! Please wait for admin approval.";
      toast.success(successMessage);

      // Reset form on successful submission
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        businessType: "",
        companyCountry: "",
        companyWebsite: "",
      });
      setFile(null);
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, selectedRole]);

  // CHANGE 4: Admin role ko userTypes array mein add karein
  const userTypes = [
    {
      role: "Buyer" as UserRole,
      label: "Customer / Buyer",
      description: "Shop for jewelry",
      icon: Users,
    },
    {
      role: "Supplier" as UserRole,
      label: "Supplier",
      description: "Sell your products",
      icon: Package,
    },
    {
      role: "Admin" as UserRole,
      label: "Admin",
      description: "Manage the platform",
      icon: ShieldAlert,
    },
  ];

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  }

  // CHANGE 5: Form submission logic ko update karein
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    const registrationData = new FormData();
    // Personal details hamesha add hongi
    registrationData.append("name", formData.name);
    registrationData.append("email", formData.email);
    registrationData.append("password", formData.password);
    registrationData.append("role", selectedRole);

    // Agar role Buyer ya Supplier hai, tabhi business details add karein
    if (selectedRole === "Buyer" || selectedRole === "Supplier") {
      if (!file) {
        return toast.error("Business document is a required field.");
      }
      registrationData.append("companyName", formData.companyName);
      registrationData.append("businessType", formData.businessType);
      registrationData.append("companyCountry", formData.companyCountry);
      registrationData.append("companyWebsite", formData.companyWebsite);
      registrationData.append("businessDocument", file);
    }

    // Admin ke liye, koi extra field add nahi hoga

    dispatch(registerUser(registrationData));
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800">
            Join Jewelen
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Create your account by selecting your role
          </p>
        </div>

        {/* CHANGE 6: Grid layout ko 3 columns ke liye adjust karein */}
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {userTypes.map(({ role, label, description, icon: Icon }) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`rounded-lg border-2 p-6 text-left transition-all duration-300 ${
                selectedRole === role
                  ? "border-orange-500 bg-white shadow-lg scale-105"
                  : "border-gray-200 bg-white hover:border-orange-300"
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <Icon
                  className={`h-6 w-6 ${selectedRole === role ? "text-orange-500" : "text-gray-400"}`}
                />
                <h3 className="font-semibold text-gray-900">{label}</h3>
              </div>
              <p className="text-sm text-gray-600">{description}</p>
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl bg-white p-8 shadow-xl"
            noValidate
          >
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
              Register as a{" "}
              {userTypes.find((u) => u.role === selectedRole)?.label}
            </h2>

            {/* Personal Information (yeh sabke liye hai) */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2">
                Personal Information
              </h3>
              <Input
                name="name"
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={handleInputChange}
              />
              <Input
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            {/* CHANGE 7: Business Details ko conditionally render karein */}
            {(selectedRole === "Buyer" || selectedRole === "Supplier") && (
              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">
                  Business Details
                </h3>
                <Input
                  name="companyName"
                  type="text"
                  required
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
                <Input
                  name="businessType"
                  type="text"
                  required
                  placeholder="Type of Business (e.g., Retailer)"
                  value={formData.businessType}
                  onChange={handleInputChange}
                />
                <Input
                  name="companyCountry"
                  type="text"
                  required
                  placeholder="Country"
                  value={formData.companyCountry}
                  onChange={handleInputChange}
                />
                <Input
                  name="companyWebsite"
                  type="url"
                  placeholder="Website (e.g., https://example.com)"
                  value={formData.companyWebsite}
                  onChange={handleInputChange}
                />
                <div>
                  <label
                    htmlFor="file-upload"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Business Document (e.g., GST Certificate){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    required
                    onChange={handleFileChange}
                    className="file:text-orange-600 file:font-semibold"
                  />
                  {file && (
                    <p className="text-xs text-gray-500 mt-1">{file.name}</p>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" ? "Registering..." : "Create Account"}
            </Button>

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
