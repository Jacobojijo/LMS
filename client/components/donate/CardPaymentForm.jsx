"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, Lock, ExternalLink } from "lucide-react";
import axios from "axios";

const CardPaymentForm = ({
  amount,
  currency,
  donorName,
  donorEmail,
  message,
  isAnonymous,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://lms-ci8t.onrender.com";

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${backendUrl}/api/donations/card/initiate`, {
        donorName,
        donorEmail,
        amount,
        currency,
        message,
        isAnonymous,
      });

      if (response.data.success && response.data.data.authorizationUrl) {
        window.location.href = response.data.data.authorizationUrl;
      } else {
        setError("Failed to initialize payment. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = () => {
    return currency === "KES"
      ? `KES ${amount.toLocaleString()}`
      : `$${amount.toLocaleString()}`;
  };

  return (
    <div>
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Card Payment</p>
            <p className="text-sm text-gray-600">
              Secure payment via Paystack
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Amount</span>
          <span className="font-medium">{formatAmount()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Email</span>
          <span className="font-medium">{donorEmail}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 text-center">
          You'll be redirected to Paystack's secure payment page to complete your donation.
        </p>
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-4 bg-[#854836] text-white rounded-lg hover:bg-[#6a392b] transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Redirecting...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pay {formatAmount()}
            <ExternalLink className="w-4 h-4 ml-1" />
          </>
        )}
      </motion.button>

      <div className="flex items-center justify-center gap-3 mt-6">
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">
          <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="32" rx="4" fill="#1A1F71"/>
            <path d="M19.5 21H17L19 11H21.5L19.5 21Z" fill="white"/>
            <path d="M28.5 11.2C28 11 27 10.8 26 10.8C23.5 10.8 21.8 12 21.8 13.8C21.8 15.2 23 15.9 24 16.4C25 16.9 25.3 17.2 25.3 17.6C25.3 18.2 24.5 18.5 23.8 18.5C22.8 18.5 22.3 18.4 21.5 18L21.2 17.9L20.9 20C21.5 20.3 22.7 20.5 23.9 20.5C26.5 20.5 28.2 19.3 28.2 17.4C28.2 16.3 27.5 15.5 26 14.8C25.1 14.4 24.5 14.1 24.5 13.6C24.5 13.2 25 12.8 26 12.8C26.8 12.8 27.5 13 28 13.2L28.3 13.3L28.5 11.2Z" fill="white"/>
            <path d="M32.5 11H30.5C30 11 29.5 11.1 29.3 11.7L25.5 21H28L28.5 19.5H31.5L31.8 21H34L32.5 11ZM29.3 17.5L30.5 14L31.1 17.5H29.3Z" fill="white"/>
            <path d="M16.5 11L14 17.5L13.7 16C13.2 14.5 11.8 12.8 10.2 12L12.5 21H15L19 11H16.5Z" fill="white"/>
            <path d="M12 11H8L8 11.2C11 12 13 14 13.7 16L13 11.7C12.9 11.2 12.5 11 12 11Z" fill="#F9A51A"/>
          </svg>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">
          <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="32" rx="4" fill="#F5F5F5"/>
            <circle cx="19" cy="16" r="10" fill="#EB001B"/>
            <circle cx="29" cy="16" r="10" fill="#F79E1B"/>
            <path d="M24 8.5C26.4 10.3 28 13 28 16C28 19 26.4 21.7 24 23.5C21.6 21.7 20 19 20 16C20 13 21.6 10.3 24 8.5Z" fill="#FF5F00"/>
          </svg>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">
          <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="32" rx="4" fill="#016FD0"/>
            <path d="M24 22V10L20 22H17L13 10V22H10V8H15L18.5 18L22 8H27V22H24Z" fill="white"/>
            <path d="M38 8H30V22H38V19H33V16.5H38V14H33V11H38V8Z" fill="white"/>
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
        <Lock className="w-4 h-4" />
        <span>Secured by Paystack. Your payment info is encrypted.</span>
      </div>
    </div>
  );
};

export default CardPaymentForm;
