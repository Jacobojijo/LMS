// ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FadeInUp } from "../../utility/MotionComponents";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/auth/forgotpassword", { email });
      setSuccess(
        "Password reset instructions have been sent to your email address."
      );
      setEmail(""); // Clear the form
    } catch (err) {
      setError(
        err.response?.data?.error || 
        "Failed to send reset email. Please try again."
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
                Forgot Password
              </h1>
              <p className="text-gray-600 mt-2">
                Enter your email address to receive password reset instructions
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
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#854836] hover:bg-[#6a392b] text-white font-medium py-3 px-4 rounded-lg transition duration-300"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-[#854836] hover:underline font-medium"
                  >
                    Back to Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default ForgotPassword;
