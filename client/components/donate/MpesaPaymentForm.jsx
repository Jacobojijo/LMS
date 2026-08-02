"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, Loader2, CheckCircle } from "lucide-react";
import axios from "axios";

const MpesaPaymentForm = ({
  amount,
  donorName,
  donorEmail,
  donorPhone,
  message,
  isAnonymous,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [donationId, setDonationId] = useState(null);
  const [pollCount, setPollCount] = useState(0);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://lms-ci8t.onrender.com";

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setStatus("initiating");

    try {
      const response = await axios.post(`${backendUrl}/api/donations/mpesa/initiate`, {
        donorName,
        donorEmail,
        donorPhone,
        amount,
        message,
        isAnonymous,
      });

      if (response.data.success) {
        setDonationId(response.data.data.donationId);
        setStatus("waiting");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to initiate payment. Please try again.");
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;

    if (status === "waiting" && donationId) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/api/donations/verify/${donationId}`
          );

          if (response.data.data.status === "completed") {
            setStatus("completed");
            clearInterval(interval);
            setTimeout(() => {
              router.push(`/donate/success?id=${donationId}`);
            }, 1500);
          } else if (response.data.data.status === "failed") {
            setStatus("failed");
            clearInterval(interval);
            setError("Payment was not completed. Please try again.");
          }

          setPollCount((prev) => prev + 1);
          if (pollCount >= 40) {
            clearInterval(interval);
            setStatus("timeout");
            setError("Payment verification timed out. If you completed the payment, please contact support.");
          }
        } catch (err) {
          console.error("Error polling status:", err);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, donationId, pollCount, router, backendUrl]);

  if (status === "waiting") {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <Phone className="w-10 h-10 text-green-600 animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Check Your Phone
        </h3>
        <p className="text-gray-600 mb-4">
          We've sent a payment request to <strong>{donorPhone}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Enter your M-Pesa PIN to complete the donation
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Waiting for payment confirmation...</span>
        </div>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600">
          Redirecting you to confirmation page...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-800">M-Pesa Payment</p>
            <p className="text-sm text-gray-600">
              You'll receive a prompt on {donorPhone}
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
          <span className="font-medium">KES {amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phone Number</span>
          <span className="font-medium">{donorPhone}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Email</span>
          <span className="font-medium">{donorEmail}</span>
        </div>
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Initiating Payment...
          </>
        ) : (
          <>
            <Phone className="w-5 h-5" />
            Pay with M-Pesa
          </>
        )}
      </motion.button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By clicking "Pay with M-Pesa", you agree to receive a payment prompt on your phone.
        Powered by Paystack.
      </p>
    </div>
  );
};

export default MpesaPaymentForm;
