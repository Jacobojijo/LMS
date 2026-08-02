"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const VerifyContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState("");

  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://lms-ci8t.onrender.com";

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus("failed");
        setError("Invalid payment reference");
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/donations/verify-by-ref/${reference}`
        );

        if (response.data.data.status === "completed") {
          setStatus("success");
          setTimeout(() => {
            router.push(`/donate/success?id=${response.data.data.id}`);
          }, 2000);
        } else if (response.data.data.status === "failed") {
          setStatus("failed");
          setError("Payment was not successful");
        } else {
          setTimeout(verifyPayment, 3000);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
        setError("Could not verify payment. Please contact support.");
      }
    };

    verifyPayment();
  }, [reference, router, backendUrl]);

  if (status === "verifying") {
    return (
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#854836]/10 mb-6"
        >
          <Loader2 className="w-10 h-10 text-[#854836]" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Verifying Payment
        </h2>
        <p className="text-gray-600">
          Please wait while we confirm your donation...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Verified!
        </h2>
        <p className="text-gray-600">
          Redirecting to confirmation page...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6"
      >
        <XCircle className="w-10 h-10 text-red-600" />
      </motion.div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Verification Failed
      </h2>
      <p className="text-gray-600 mb-6">
        {error || "We couldn't verify your payment."}
      </p>
      <div className="space-y-3">
        <button
          onClick={() => router.push("/donate")}
          className="w-full px-6 py-3 bg-[#854836] text-white rounded-lg hover:bg-[#6a392b] transition"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/contact")}
          className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

const VerifyPage = () => {
  return (
    <section className="bg-gray-100 py-16 md:py-24 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <Suspense
            fallback={
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#854836] mx-auto mb-4" />
                <p className="text-gray-600">Loading...</p>
              </div>
            }
          >
            <VerifyContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default VerifyPage;
