"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  resetPassword,
  resetActionStatus,
} from "@/lib/features/users/userSlice";
import type { AppDispatch, RootState } from "@/lib/store";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const token = params.token as string;

  const { actionStatus, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Password has been reset successfully! Please sign in.");
      dispatch(resetActionStatus());
      router.push("/signin");
    }
    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      return toast.error("Please fill in both password fields.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    if (!token) {
      return toast.error("Invalid or missing reset token.");
    }
    dispatch(resetPassword({ token, password }));
  };

  const isLoading = actionStatus === "loading";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100">
            <KeyRound className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set New Password
          </h1>
          <p className="text-gray-600">
            Create a new, strong password for your account.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  className="pl-11 h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                  className="pl-11 h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
