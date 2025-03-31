"use client";

import { useState } from "react";
import axios from "axios";
import { FadeInUp } from "@/utility/MotionComponents";
import { useRouter, useParams } from "next/navigation";

const ResetPassword = () => {
  const { resettoken } = useParams();
  const router = useRouter();
  // Use the backend URL from environment variable with fallback
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://lms-ci8t.onrender.com";

  const [formData, setFormData] = useState({
    password: "",
    passwordConfirmation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (formData.password !== formData.passwordConfirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put(
        `${backendUrl}/api/auth/resetpassword/${resettoken}`,
        formData
      );

      setSuccess("Password has been reset successfully!");

      // Store token if returned
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Redirect to login after brief delay
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen py-16">
      <div className="container max-w-md mx-auto">
        <FadeInUp>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-playfair text-gray-800">
                Reset Password
              </h1>
              <p className="text-gray-600 mt-2">
                Create a new password for your account
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                  placeholder="Create a new password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 6 characters with letters and numbers
                </p>
              </div>

              <div>
                <label
                  htmlFor="passwordConfirmation"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                  placeholder="Confirm your new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#854836] hover:bg-[#6a392b] text-white font-medium py-3 px-4 rounded-lg transition duration-300"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default ResetPassword;
