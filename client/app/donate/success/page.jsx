"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Heart, ArrowRight, Share2 } from "lucide-react";
import axios from "axios";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const donationId = searchParams.get("id");
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://lms-ci8t.onrender.com";

  useEffect(() => {
    const fetchDonation = async () => {
      if (!donationId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/donations/verify/${donationId}`
        );
        setDonation(response.data.data);
      } catch (err) {
        console.error("Error fetching donation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [donationId, backendUrl]);

  const formatAmount = () => {
    if (!donation) return "";
    return donation.currency === "KES"
      ? `KES ${donation.amount.toLocaleString()}`
      : `$${donation.amount.toLocaleString()}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: "I donated to Heritage Language School!",
      text: "I just made a donation to help preserve African languages. Join me in supporting this important cause!",
      url: window.location.origin + "/donate",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

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
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4"
            >
              Thank You!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-6"
            >
              Your generous donation helps us preserve African languages for future
              generations.
            </motion.p>

            {donation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 rounded-lg p-6 mb-6"
              >
                <p className="text-sm text-gray-500 mb-2">Donation Amount</p>
                <p className="text-3xl font-bold text-[#854836]">{formatAmount()}</p>
                {donation.receiptNumber && (
                  <p className="text-sm text-gray-500 mt-2">
                    Receipt: {donation.receiptNumber}
                  </p>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <button
                onClick={handleShare}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 font-medium flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Your Support
              </button>

              <Link
                href="/"
                className="w-full px-6 py-3 bg-[#854836] text-white rounded-lg hover:bg-[#6a392b] transition duration-300 font-semibold flex items-center justify-center gap-2"
              >
                Return Home
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t"
            >
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">
                  A confirmation email has been sent to your inbox
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const DonateSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <section className="bg-gray-100 py-16 md:py-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#854836] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </section>
      }
    >
      <SuccessContent />
    </Suspense>
  );
};

export default DonateSuccessPage;
