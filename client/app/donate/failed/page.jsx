"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, MessageCircle } from "lucide-react";

const DonateFailedPage = () => {
  return (
    <section className="bg-gray-100 py-16 md:py-24 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6"
            >
              <XCircle className="w-12 h-12 text-red-600" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4"
            >
              Payment Failed
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-8"
            >
              We couldn't process your donation. This could be due to
              insufficient funds, network issues, or a cancelled transaction.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <Link
                href="/donate"
                className="w-full px-6 py-3 bg-[#854836] text-white rounded-lg hover:bg-[#6a392b] transition duration-300 font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </Link>

              <Link
                href="/contact"
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 font-medium flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-6 border-t"
            >
              <p className="text-sm text-gray-500">
                Need help? Email us at{" "}
                <a
                  href="mailto:heritagelanguageschool@gmail.com"
                  className="text-[#854836] hover:underline"
                >
                  heritagelanguageschool@gmail.com
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DonateFailedPage;
