import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FadeInUp } from "../../utility/MotionComponents";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [step, setStep] = useState(1); // 1: Email entry, 2: Code verification & new password
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/auth/forgotpassword", { email });
      setSuccess(response.data.message || "Password reset code sent to your email");
      setStep(2); // Move to code verification step
    } catch (err) {
      setError(
        err.response?.data?.error || 
        "Failed to send reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Verify passwords match
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/auth/resetpassword", {
        email,
        resetCode,
        password,
        passwordConfirmation
      });
      setSuccess("Password has been reset successfully!");
      // Clear form fields after successful reset
      setResetCode("");
      setPassword("");
      setPasswordConfirmation("");
      // Keep success message visible for a moment before redirecting
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
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
                Forgot Password
              </h1>
              {step === 1 ? (
                <p className="text-gray-600 mt-2">
                  Enter your email address to receive a password reset code
                </p>
              ) : (
                <p className="text-gray-600 mt-2">
                  Enter the verification code sent to your email and create a new password
                </p>
              )}
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

            {step === 1 ? (
              <form onSubmit={handleRequestCode} className="space-y-6">
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
                  {loading ? "Sending..." : "Send Reset Code"}
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
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label
                    htmlFor="resetCode"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Reset Code
                  </label>
                  <input
                    type="text"
                    id="resetCode"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                    placeholder="Enter reset code"
                  />
                </div>

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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                    placeholder="Enter new password"
                  />
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
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#854836] hover:bg-[#6a392b] text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <div className="flex justify-between text-center mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[#854836] hover:underline font-medium"
                  >
                    Back to Previous Step
                  </button>
                  <Link
                    to="/login"
                    className="text-[#854836] hover:underline font-medium"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default ForgotPassword;
