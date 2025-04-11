"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { FadeInUp, FadeIn } from "@/utility/MotionComponents";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section className="bg-gray-100 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#854836] to-[#6a392b]">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#854836] to-[#6a392b] mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about language preservation or our courses? We'd love
            to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <FadeInUp>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#854836] transition duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#854836] transition duration-300"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#854836] transition duration-300"
                    placeholder="Tell us how we can help you"
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-6 py-3 bg-[#854836] text-white rounded-lg hover:bg-[#6a392b] transition duration-300 font-semibold"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </FadeInUp>

          <FadeIn>
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-playfair font-bold text-[#6a392b] mb-4">
                  Our Contact Information
                </h2>
                <p className="text-gray-600 mb-6">
                  We're here to support your language learning journey. Reach
                  out to us anytime.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="text-[#854836] mr-4" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <p className="text-gray-600">heritagelanguageschool@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="text-[#854836] mr-4" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <p className="text-gray-600">(+254) 746426925</p>
                    <p className="text-gray-600">(+254) 716883778</p>
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
