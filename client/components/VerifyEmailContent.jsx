"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { FadeInUp } from "@/utility/MotionComponents";

export function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/auth/verifyemail", {
        email,
        verificationCode,
      });

      // Store token if returned
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Store user role if returned
      if (res.data.user && res.data.user.role) {
        localStorage.setItem("userRole", res.data.user.role);
      }

      setSuccess("Email verified successfully!");

      // Get user role from response or localStorage
      const userRole = res.data.user?.role || localStorage.getItem("userRole");

      // Redirect based on user role after a brief delay
      setTimeout(() => {
        if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/student/dashboard");
        }
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Verification failed. Please check your code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/auth/resendverification", { email });
      setSuccess("A new verification code has been sent to your email.");
      setCountdown(60); // Set 60 seconds cooldown
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to resend code. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen py-12">
      <div className="container max-w-md mx-auto">
        <FadeInUp>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-[#854836] rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold font-playfair text-gray-800">
                Verify Your Email
              </h1>
              <p className="text-gray-600 mt-2">
                Please enter the 6-digit code sent to
                <br />
                <span className="font-medium">{email}</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  pattern="[0-9]{6}"
                  maxLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836] text-center text-xl tracking-wider"
                  placeholder="Enter 6-digit code"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#854836] hover:bg-[#6a392b] text-white font-medium py-3 px-4 rounded-lg transition duration-300"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-600 mb-2">Didn't receive a code?</p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading || countdown > 0}
                  className="text-[#854836] hover:underline font-medium disabled:text-gray-400 disabled:no-underline"
                >
                  {countdown > 0
                    ? `Resend code in ${countdown}s`
                    : resendLoading
                    ? "Sending..."
                    : "Resend verification code"}
                </button>
              </div>
            </form>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
