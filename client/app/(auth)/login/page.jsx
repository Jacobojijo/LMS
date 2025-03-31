"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeInUp } from "@/utility/MotionComponents";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const user = await login(formData.email, formData.password); // Use the login function from AuthContext

      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard"); // Default to student dashboard
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to login. Please check your credentials."
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
            {/* Decorative Section - replacing image with gradient background */}
            <div className="hidden md:block relative bg-gradient-to-br from-[#854836] to-[#6a392b]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <h2 className="text-3xl font-bold font-playfair mb-4">
                    Preserve Your Heritage
                  </h2>
                  <p className="text-lg">
                    Connect with your roots through language
                  </p>
                  <div className="mt-6 p-6 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm max-w-sm mx-auto">
                    <p className="text-lg font-light italic">
                      "Language is the road map of a culture. It tells you where
                      its people come from and where they are going."
                    </p>
                    <p className="mt-2 text-sm">- Rita Mae Brown</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8 md:p-12">
              <FadeInUp>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold font-playfair text-gray-800">
                    Welcome Back
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Sign in to continue your language journey
                  </p>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
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
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label
                        htmlFor="password"
                        className="block text-gray-700 font-medium"
                      >
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-[#854836] hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#854836] focus:border-[#854836]"
                      placeholder="Enter your password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#854836] hover:bg-[#6a392b] text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>

                  <div className="text-center mt-6">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        href="/register"
                        className="text-[#854836] hover:underline font-medium"
                      >
                        Sign Up
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

export default Login;
