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

      <div className="flex items-center justify-center gap-4 mt-6">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 opacity-60" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8 opacity-60" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png" alt="Amex" className="h-5 opacity-60" />
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
        <Lock className="w-4 h-4" />
        <span>Secured by Paystack. Your payment info is encrypted.</span>
      </div>
    </div>
  );
};

export default CardPaymentForm;
