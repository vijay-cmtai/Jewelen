"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { verifyOtp, resetActionStatus } from "@/lib/features/users/userSlice";
import type { AppDispatch, RootState } from "@/lib/store";

function VerifyOtpComponent() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const email = searchParams.get("email") || "";

  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      router.push("/signup");
    }
  }, [email, router]);

  useEffect(() => {
    if (actionStatus === "succeeded" && userInfo) {
      toast.success("Account verified successfully!");
      router.push("/"); // Redirect to home or dashboard after successful verification
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, userInfo, dispatch, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return toast.error("Please enter a 6-digit OTP.");
    }
    dispatch(verifyOtp({ email, otp }));
  };

  const isLoading = actionStatus === "loading";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100">
            <ShieldCheck className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Account
          </h1>
          <p className="text-gray-600">
            An OTP has been sent to <strong>{email}</strong>.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-semibold text-gray-700"
              >
                Enter 6-Digit OTP
              </label>
              <Input
                id="otp"
                name="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="_ _ _ _ _ _"
                disabled={isLoading}
                className="mt-2 h-14 text-center text-2xl tracking-[1em]"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Suspense Boundary is necessary for useSearchParams in App Router
export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpComponent />
    </Suspense>
  );
}
