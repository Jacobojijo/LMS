"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import { FadeInUp, FadeIn } from "@/utility/MotionComponents";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://lms-ci8t.onrender.com";

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${backendUrl}/api/contact`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });

      if (response.data?.success) {
        setSuccess(
          response.data.data?.message ||
            "Your message has been sent. We will get back to you shortly."
        );
        setFormData({ name: "", email: "", message: "" });
      } else {
        setError("Failed to send your message. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to send your message. Please try again, or email us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-sand py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="eyebrow">Get in touch</span>
          <h1 className="mt-3 mb-4 font-playfair text-4xl font-bold text-teal-900 md:text-6xl">
            Contact Us
          </h1>
          <div className="rule-gold mb-6"></div>
          <p className="text-ink/70 max-w-2xl mx-auto">
            Have questions about language preservation or our courses? We'd love
            to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <FadeInUp>
            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-ink/75"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-sand-200 bg-sand/40 transition duration-300 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-ink/75"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-sand-200 bg-sand/40 transition duration-300 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-ink/75"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-sand-200 bg-sand/40 transition duration-300 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="Tell us how we can help you"
                  ></textarea>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={loading ? undefined : { scale: 1.02 }}
                  whileTap={loading ? undefined : { scale: 0.98 }}
                  className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
                <p className="text-center text-xs text-ink/50">
                  Prefer email? Write to us directly at{" "}
                  <a
                    href="mailto:heritagelanguageschool@gmail.com"
                    className="font-medium text-primary hover:underline"
                  >
                    heritagelanguageschool@gmail.com
                  </a>
                </p>
              </form>
            </div>
          </FadeInUp>

          <FadeIn>
            <div className="card p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-playfair font-bold text-primary-700 mb-4">
                  Our Contact Information
                </h2>
                <p className="text-ink/70 mb-6">
                  We're here to support your language learning journey. Reach
                  out to us anytime.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="text-primary mr-4" size={24} />
                  <div>
                    <p className="font-medium text-ink/75">Email</p>
                    <p className="text-ink/70">heritagelanguageschool@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="text-primary mr-4" size={24} />
                  <div>
                    <p className="font-medium text-ink/75">Phone</p>
                    <p className="text-ink/70">(+254) 746426925</p>
                  </div>
                </div>

                <div className="flex items-center"></div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
