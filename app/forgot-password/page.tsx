"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  forgotPassword,
  resetActionStatus,
} from "@/lib/features/users/userSlice";
import type { AppDispatch, RootState } from "@/lib/store";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { actionStatus, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Password reset link has been sent to your email!");
      dispatch(resetActionStatus());
      setEmail("");
    }
    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter your email address.");
    }
    dispatch(forgotPassword({ email }));
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
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
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
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <p className="text-center text-sm">
              <Link
                href="/signin"
                className="font-medium text-gray-600 hover:text-orange-600"
              >
                &larr; Back to Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
