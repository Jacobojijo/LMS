"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Phone, Landmark, Copy, Check } from "lucide-react";
import { FadeInUp } from "@/utility/MotionComponents";

// Temporary: donations are made manually via M-Pesa Paybill or bank transfer.
// To bring back the online checkout, render <OnlineDonation /> from
// "@/components/donate/OnlineDonation" instead of this page.

const ACCOUNT_NAME = "1 Sigana African Heritage Language Limited";

const PAYMENT_METHODS = [
  {
    title: "M-Pesa Paybill",
    icon: Phone,
    iconBg: "bg-green-500",
    details: [
      { label: "Paybill Business Number", value: "400200" },
      { label: "Account Number", value: "1211728" },
      { label: "Account Name", value: ACCOUNT_NAME },
    ],
    steps: [
      "Go to M-Pesa on your phone and select Lipa na M-Pesa",
      "Select Pay Bill",
      "Enter Business Number 400200",
      "Enter Account Number 1211728",
      "Enter the amount, your M-Pesa PIN and confirm",
    ],
  },
  {
    title: "Bank Transfer",
    icon: Landmark,
    iconBg: "bg-teal",
    details: [
      { label: "Account Number", value: "01103409698001" },
      { label: "Account Name", value: ACCOUNT_NAME },
    ],
  },
];

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available; the value is still visible to copy manually.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${value}`}
      className="shrink-0 p-2 rounded-md text-ink/50 hover:text-primary hover:bg-primary/5 transition"
    >
      {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const DonatePage = () => {
  return (
    <section className="bg-sand py-16 md:py-24 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-700">
            Support Our Mission
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-700 mx-auto mb-6"></div>
          <p className="text-ink/70 max-w-2xl mx-auto">
            Help us preserve African languages for future generations. You can
            make payments or donations using any of the options below.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {PAYMENT_METHODS.map(({ title, icon: Icon, iconBg, details, steps }) => (
            <FadeInUp key={title}>
              <div className="card p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-ink">{title}</h2>
                </div>

                <dl className="space-y-4">
                  {details.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3 rounded-lg bg-sand px-4 py-3"
                    >
                      <div className="min-w-0">
                        <dt className="text-xs uppercase tracking-wide text-ink/60">{label}</dt>
                        <dd className="font-semibold text-ink break-words">{value}</dd>
                      </div>
                      <CopyButton value={value} />
                    </div>
                  ))}
                </dl>

                {steps && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-ink mb-2">How to pay</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-ink/70">
                      {steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </FadeInUp>
          ))}
        </div>

        <p className="max-w-2xl mx-auto mt-10 text-center text-sm text-ink/60">
          After paying, please{" "}
          <a href="/contact" className="text-primary font-medium hover:underline">
            contact us
          </a>{" "}
          with your name and transaction reference so we can confirm your payment.
        </p>
      </div>
    </section>
  );
};

export default DonatePage;
