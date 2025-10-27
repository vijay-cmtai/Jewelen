"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  registerUser,
  resetActionStatus,
} from "@/lib/features/users/userSlice";
import type { AppDispatch, RootState } from "@/lib/store";

type UserRole = "User" | "Admin";

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("User");
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, [userInfo, router]);

  useEffect(() => {
    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
    if (actionStatus === "succeeded") {
      toast.success("Registration successful! Please verify your OTP.");
      // Redirect to OTP page with email in query
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, router, formData.email]);

  const userTypes = [
    {
      role: "User" as UserRole,
      label: "User",
      description: "Create a standard user account.",
      icon: Users,
    },
    {
      role: "Admin" as UserRole,
      label: "Admin",
      description: "Create an administrator account.",
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    const registrationData = new FormData();
    registrationData.append("name", formData.name);
    registrationData.append("email", formData.email);
    registrationData.append("password", formData.password);
    registrationData.append("role", selectedRole);

    if (file) {
      registrationData.append("profilePicture", file);
    }

    dispatch(registerUser(registrationData));
  }

  const isLoading = actionStatus === "loading";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800">
            Create an Account
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            First, select your account type
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              Register as a {selectedRole}
            </h2>

            <div className="space-y-4">
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
              <div>
                <label
                  htmlFor="file-upload"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Profile Picture (Optional)
                </label>
                <Input
                  id="file-upload"
                  name="profilePicture"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="file:text-orange-600 file:font-semibold"
                />
                {file && (
                  <p className="text-xs text-gray-500 mt-1">{file.name}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Create Account"}
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
