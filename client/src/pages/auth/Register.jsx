import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FadeInUp } from "../../utility/MotionComponents";
import { useAuth } from "../../context/AuthContext";

const BASE_API_URL = 'https://lms-ci8t.onrender.com/api'; // Or your local API URL

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
  });
  const [error, setError] = useState("");
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

    // Basic validation
    if (formData.password !== formData.passwordConfirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${BASE_API_URL}/auth/register`, formData);
      // Redirect to verification page with email
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(
        err.response?.data?.error || 
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen py-12">
      <div className="container max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Decorative Section - replacing image with pattern and gradient */}
            <div className="hidden md:block relative bg-gradient-to-tr from-[#6a392b] via-[#854836] to-[#9d5b49]">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.2) 2px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <h2 className="text-3xl font-bold font-playfair mb-4">
                    Join Our Community
                  </h2>
                  <p className="text-lg">
                    Begin your journey to language fluency
                  </p>
                  <div className="mt-8 flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-2xl">🗣️</span>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-2xl">🏛️</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8 md:p-12">
              <FadeInUp>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold font-playfair text-gray-800">
                    Create Account
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Start preserving your heritage language today
                  </p>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

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
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                      placeholder="Enter your phone number (e.g., +1234567890)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Password
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
                        placeholder="Create a password"
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
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        value={formData.passwordConfirmation}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#854836] hover:bg-[#6a392b] text-white font-medium py-3 px-4 rounded-lg transition duration-300 mt-4"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  <div className="text-center mt-6">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-[#854836] hover:underline font-medium"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </FadeInUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
